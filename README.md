# ✂️ O Meu Guia do Cabeleireiro

Aplicação para crianças com PEA ( Perturbação do Espetro do Autismo) que auxilia na preparação e acompanhamento durante visitas ao cabeleireiro, com monitorização de stress em tempo real via pulseira BITalino.

## 🚀 Instalação Rápida

```bash
# 1. Clonar ou extrair o projeto
cd meu-guia-cabeleireiro

# 2. Instalar dependências do cliente
npm install

# 3. Instalar dependências do servidor
npm install

# 4. Configurar variáveis de ambiente
cp .env.example .env

# 5. Iniciar servidor + cliente em modo desenvolvimento
npm run dev:full
```

Ou separadamente:
```bash
# Terminal 1 - Servidor
npm run server

# Terminal 2 - Cliente
npm run dev
```

## 📁 Estrutura do Projeto

```
meu-guia-cabeleireiro/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── BreathingExercise.tsx
│   │   ├── CharacterAvatar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── RewardBadge.tsx
│   │   ├── SceneCard.tsx
│   │   └── StressMonitor.tsx
│   ├── hooks/
│   │   ├── useBitalino.ts   # Hook da pulseira BITalino
│   │   └── useTimer.ts      # Hook do timer
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── ChildDashboard.tsx
│   │   ├── HomeModePage.tsx
│   │   ├── SalonModePage.tsx
│   │   ├── CharacterPage.tsx
│   │   └── ParentDashboard.tsx
│   ├── App.tsx              # Router com proteção de rotas
│   ├── AuthContext.tsx      # Contexto de autenticação
│   ├── store.ts             # Zustand state management
│   ├── types.ts             # TypeScript types
│   ├── data.ts              # Dados das cenas e exercícios
│   ├── main.tsx
│   └── index.css            # Tailwind CSS config
├── server/
│   └── index.js             # Express server (auth API)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## 🔐 Autenticação

A app tem **dois tipos de utilizadores**:

| Tipo | Descrição | Rotas |
|------|-----------|-------|
| **Pai/Cuidador** | Acede ao dashboard com estatísticas e relatórios | `/parent` |
| **Criança** | Acede aos modos de jogo e personalização | `/child/*` |

### Fluxo de Registo/Login
1. Seleciona "Sou Pai/Mãe" ou "Sou Criança"
2. Preenche email + palavra-passe (mín. 6 caracteres)
3. Crianças preenchem também alcunha e idade
4. JWT token guardado no localStorage (Zustand persist)

## 🎮 Funcionalidades

### Modo Casa (`/child/home-mode`)
- 📖 História animada com 7 cenas do cabeleireiro
- ⏱️ Timer visual por cena
- 💡 Dicas contextuais
- 🧩 Jogo de ordenação (drag & drop)
- ⭐ Recompensas por cena completada

### Modo Salão (`/child/salon-mode`)
- 📋 Guia passo a passo durante a visita real
- 💓 Monitorização BITalino em tempo real
- 🫁 Pausa automática + exercício de respiração quando stress > 70%
- 🫁 Exercícios manuais de respiração (balão, vela, flor, estrela)
- 🎉 Diploma após 3 visitas completadas

### Dashboard Pais (`/parent`)
- 📊 Estatísticas de visitas
- 📈 Gráficos de evolução do stress
- 📋 Histórico detalhado por visita
- 👤 Perfil da criança

### Personalização (`/child/character`)
- 🧒 6 personagens para escolher
- 🎨 5 cores de cabelo
- ⭐ Sistema de estrelas e recompensas

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
- **Backend**: Express.js + JWT + bcryptjs
- **Auth**: JWT tokens + role-based routing

## 📝 Notas para Deploy

### Build para produção:
```bash
npm run build
```

### Deploy do servidor:
O servidor Express está em `server/index.js`. Para produção:
- Substituir storage em memória por MongoDB/PostgreSQL
- Configurar variáveis de ambiente (`JWT_SECRET`, `DATABASE_URL`)
- Usar HTTPS
- Configurar CORS para o domínio de produção

### Deploy do cliente:
O build Vite gera a pasta `dist/`. Podes fazer deploy em:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 👥 Créditos

Projeto académico desenvolvido para crianças com PEA.
