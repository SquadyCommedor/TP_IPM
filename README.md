# ✂️ O Meu Guia do Cabeleireiro - Supabase Edition

Aplicação para crianças com PEA (Perturbação do Espetro do Autismo) que auxilia na preparação e acompanhamento durante visitas ao cabeleireiro, com monitorização de stress em tempo real via pulseira BITalino.

## 🚀 Instalação Rápida

```bash
# 1. Clonar o projeto
git clone https://github.com/SquadyCommedor/TP_IPM.git
cd TP_IPM

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com os dados do teu projeto Supabase

# 4. Iniciar em modo desenvolvimento
npm run dev
```

## 📋 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Vai a [supabase.com](https://supabase.com) e cria uma conta
2. Cria um novo projeto
3. Vai a Project Settings > API para obter:
   - `URL` (VITE_SUPABASE_URL)
   - `anon public` API key (VITE_SUPABASE_ANON_KEY)

### 2. Configurar Base de Dados

No SQL Editor do Supabase, executa:

```sql
-- Tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child')),
  avatar TEXT,
  child_profile JSONB,
  parent_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de visitas
CREATE TABLE visit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES profiles(id) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  max_stress INTEGER NOT NULL,
  avg_stress INTEGER NOT NULL,
  pauses INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de leituras BITalino
CREATE TABLE bitalino_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES profiles(id) NOT NULL,
  timestamp BIGINT NOT NULL,
  heart_rate INTEGER NOT NULL,
  eda REAL NOT NULL,
  stress_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitalino_readings ENABLE ROW LEVEL SECURITY;

-- Política para profiles: utilizadores podem ver/editar o seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para visit_logs: pais podem ver logs dos filhos, crianças podem ver as suas
CREATE POLICY "Parents can view child logs" ON visit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = visit_logs.child_id 
      AND profiles.parent_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Children can insert own logs" ON visit_logs
  FOR INSERT WITH CHECK (auth.uid() = child_id);

CREATE POLICY "Children can view own logs" ON visit_logs
  FOR SELECT USING (auth.uid() = child_id);

-- Política para bitalino_readings
CREATE POLICY "Parents can view child readings" ON bitalino_readings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = bitalino_readings.child_id 
      AND profiles.parent_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Children can insert own readings" ON bitalino_readings
  FOR INSERT WITH CHECK (auth.uid() = child_id);
```

### 3. Configurar Autenticação

No Supabase Dashboard:
1. Vai a Authentication > Settings
2. Em "Site URL", coloca o URL da tua app (ex: `http://localhost:5173`)
3. Ativa "Confirm email" se quiseres verificação de email

### 4. Ficheiro .env

```
VITE_SUPABASE_URL=https://teu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── BreathingExercise.tsx
│   ├── CharacterAvatar.tsx
│   ├── LoadingScreen.tsx
│   ├── ProgressBar.tsx
│   ├── RewardBadge.tsx
│   ├── SceneCard.tsx
│   └── StressMonitor.tsx
├── hooks/
│   ├── useBitalino.ts     # Hook da pulseira BITalino
│   └── useTimer.ts        # Hook do timer
├── lib/
│   ├── supabase.ts        # Cliente Supabase
│   └── database.types.ts  # Tipos TypeScript para Supabase
├── pages/
│   ├── LoginPage.tsx
│   ├── ChildDashboard.tsx
│   ├── HomeModePage.tsx
│   ├── SalonModePage.tsx
│   ├── CharacterPage.tsx
│   └── ParentDashboard.tsx
├── App.tsx                # Router com proteção de rotas
├── AuthContext.tsx        # Contexto de autenticação (Supabase Auth)
├── store.ts               # Zustand state management + Supabase sync
├── types.ts               # TypeScript types
├── data.ts                # Dados das cenas e exercícios
├── main.tsx
└── index.css              # Tailwind CSS config
```

## 🔐 Autenticação

A app usa **Supabase Auth** para autenticação:

| Tipo| Descrição| Rotas|
| ---| ---| ---|
| **Pai/Cuidador**| Acede ao dashboard com estatísticas e relatórios| `/parent`|
| **Criança**| Acede aos modos de jogo e personalização| `/child/*`|

### Fluxo de Registo/Login

1. Seleciona "Sou Pai/Mãe" ou "Sou Criança"
2. Preenche email + palavra-passe (mín. 6 caracteres)
3. Crianças preenchem também alcunha, idade e email do pai/mãe
4. Supabase Auth gere a sessão automaticamente

## 🎮 Funcionalidades

### Modo Casa (`/child/home-mode`)
- 📖 História animada com 7 cenas do cabeleireiro
- ⏱️ Timer visual por cena
- 💡 Dicas contextuais
- ⭐ Recompensas por cena completada (sync com Supabase)

### Modo Salão (`/child/salon-mode`)
- 📋 Guia passo a passo durante a visita real
- 💓 Monitorização BITalino em tempo real
- 🫁 Pausa automática + exercício de respiração quando stress > 70%
- 📊 Logs de visita guardados no Supabase
- 🎉 Diploma após 3 visitas completadas

### Dashboard Pais (`/parent`)
- 📊 Estatísticas de visitas (dados do Supabase)
- 📈 Gráficos de evolução do stress
- 📋 Histórico detalhado por visita
- 👤 Perfil da criança

### Personalização (`/child/character`)
- 🧒 6 personagens para escolher
- 🎨 5 cores de cabelo
- ⭐ Sistema de estrelas e recompensas (sync com Supabase)

## 🔌 Integração BITalino

O hook `useBitalino` simula leituras para desenvolvimento. Para integração real:

```typescript
// Em useBitalino.ts, substituir o connect() por:
const connect = async () => {
  // Web Bluetooth API para BITalino
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: 'BITalino' }],
    optionalServices: ['battery_service']
  });
  const server = await device.gatt.connect();
  // ... ler características ECG/EDA
};
```

Ou usar WebSocket para conexão via computador intermediário.

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **Animações**: Framer Motion
- **Estado**: Zustand (persist)
- **Gráficos**: Recharts
- **Efeitos**: Canvas Confetti
- **Backend/Auth/DB**: Supabase (PostgreSQL + Auth + Realtime)

## 📝 Notas para Deploy

### Build para produção:

```bash
npm run build
```

### Deploy:

O build Vite gera a pasta `dist/`. Podes fazer deploy em:

- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**
- **Supabase Hosting**

### Configuração CORS no Supabase:

Se fizeres deploy, adiciona o teu domínio em:
Supabase Dashboard > Authentication > URL Configuration > Redirect URLs

## 👥 Créditos

Projeto académico desenvolvido para crianças com PEA.
Migrado para Supabase para eliminar servidor local e simplificar deploy.
