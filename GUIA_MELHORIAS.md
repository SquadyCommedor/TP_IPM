# O Meu Guia do Cabeleireiro - v2.0 (Melhorado)

## Resumo das Melhorias

### 1. Layout Responsivo (Mobile + Desktop)
- **Mobile**: Bottom navigation bar com 5 tabs (Início, Casa, Salão, Avatar, Sair)
- **Desktop**: Sidebar fixa à esquerda com navegação completa
- **Breakpoints**: Adaptação automática em 768px
- **Safe Areas**: Suporte para notch e home indicator em iOS

### 2. Design Visual Completo
- **Paleta de Cores**: Laranja (#FF8C42), Teal (#4ECDC4), Amarelo (#FFE66D), Rosa (#FF6B9D), Roxo (#9B5DE5)
- **Tipografia**: Nunito (corpo) + Fredoka (títulos) do Google Fonts
- **Glass Morphism**: Headers com blur effect
- **Gradientes**: Usados em botões, cards e avatares
- **Sombras**: Hierarquia visual com sombras suaves

### 3. Biblioteca de Ícones (Lucide React)
Todos os ícones substituídos por Lucide:
- ✂️ Scissors (logo principal)
- 🏠 Home, ✂️ Scissors, 🏪 Store, 👤 User, 🚪 LogOut (navegação)
- ❤️ Heart, 📊 Activity, ⚠️ AlertTriangle (stress monitor)
- ⭐ Star, 🏆 Trophy, 🎖️ Award, 🥇 Medal (recompensas)
- ▶️ Play, ⏸️ Pause, 🔄 RotateCcw (controles)
- 💨 Wind (respiração), 💾 Save (notas)

### 4. Imagens Reais e Apelativas
- **Login**: Ilustrações de cabeleireiro para crianças
- **Dashboard**: Fotos reais de salões e crianças
- **Modo Casa**: 7 cenas com fotos de Unsplash (preparação, caminho, chegada, cadeira, capote, cortar, resultado)
- **Avatares**: Fotos reais de crianças (6 personagens)
- **Modo Salão**: Imagens de equipamento real

### 5. Animações (Framer Motion)
- **Entrada**: fade + slide up em todos os elementos
- **Hover**: scale e translateY nos cards e botões
- **Tap**: scale reduzido para feedback tátil
- **Loading**: rotação e pulse nos spinners
- **Transições**: AnimatePresence para troca de cenas
- **Floating**: Animação de flutuação no logo
- **Stress Gauge**: Animação de preenchimento suave

### 6. Componentes Novos
- **MobileLayout**: Layout base para mobile com bottom nav
- **DesktopLayout**: Layout base para desktop com sidebar
- **MobileNav**: Navegação inferior com indicador animado
- **DesktopSidebar**: Sidebar com user info e navegação
- **SceneCard**: Cards de cenas com imagem, overlay e badges
- **RewardBadge**: Badges de recompensa com animação spring
- **BreathingExercise**: Modal de respiração com círculo animado
- **ProgressBar**: Barra de progresso com percentagem animada
- **LoadingScreen**: Ecrã de carregamento com spinner e progresso
- **ProtectedRoute**: Proteção de rotas por role

### 7. Páginas Melhoradas
- **LoginPage**: Design moderno com passos (escolher tipo -> preencher dados), toggle password, animações
- **ChildDashboard**: Stats cards, quick actions com imagens, recompensas, dica do dia
- **HomeModePage**: Cenas com imagens reais, timer, tips, grid de todas as cenas, celebração no final
- **SalonModePage**: Monitor BITalino em tempo real, passos da visita, notas, resumo no final
- **CharacterPage**: Preview do avatar, seleção de personagem, cor de cabelo, acessórios
- **ParentDashboard**: Stats grid, filtros por período, lista de visitas com stress bars, dicas para pais

### 8. Funcionalidades Técnicas
- **useMediaQuery**: Hook para detectar mobile/desktop
- **useTimer**: Hook para cronometragem de sessões
- **useBitalino**: Hook melhorado com simulação e guardar no Supabase
- **React Query**: Cache de dados do Supabase
- **React Hot Toast**: Notificações toast em todo o lado
- **Supabase Auth**: Login/Register com criação automática de perfil

## Como Usar

### 1. Instalar Dependências
```bash
cd TP_IPM
npm install
```

### 2. Configurar Supabase
```bash
cp .env.example .env
# Editar .env com os dados do teu projeto Supabase
```

### 3. Configurar Base de Dados no Supabase
Executar o SQL do README original para criar tabelas e políticas RLS.

### 4. Corrigir o Problema de Perfil
No AuthContext.tsx, o perfil é criado automaticamente após signup. Se houver erro, o utilizador ainda pode fazer login e o perfil é carregado na próxima vez.

### 5. Iniciar
```bash
npm run dev
```

## Estrutura de Ficheiros
```
src/
├── components/
│   ├── BreathingExercise.tsx    # Exercício de respiração animado
│   ├── CharacterAvatar.tsx      # Avatar selecionável
│   ├── DesktopLayout.tsx        # Layout desktop
│   ├── DesktopSidebar.tsx       # Sidebar navegação
│   ├── LoadingScreen.tsx        # Ecrã de carregamento
│   ├── MobileLayout.tsx         # Layout mobile
│   ├── MobileNav.tsx            # Bottom navigation
│   ├── ProgressBar.tsx          # Barra de progresso
│   ├── ProtectedRoute.tsx       # Proteção de rotas
│   ├── RewardBadge.tsx          # Badge de recompensa
│   ├── SceneCard.tsx            # Card de cena
│   └── StressMonitor.tsx        # Monitor BITalino
├── hooks/
│   ├── useBitalino.ts           # Hook pulseira
│   ├── useMediaQuery.ts         # Hook responsive
│   └── useTimer.ts              # Hook cronômetro
├── pages/
│   ├── LoginPage.tsx            # Login/Register
│   ├── ChildDashboard.tsx        # Dashboard criança
│   ├── HomeModePage.tsx         # Modo Casa
│   ├── SalonModePage.tsx        # Modo Salão
│   ├── CharacterPage.tsx        # Personalização
│   └── ParentDashboard.tsx       # Dashboard pais
├── AuthContext.tsx              # Contexto auth
├── App.tsx                      # Router + layouts
└── index.css                     # Tailwind config
```

## Próximos Passos Sugeridos
1. Substituir imagens do Unsplash por imagens próprias
2. Adicionar sons para cada cena (usar Web Audio API)
3. Implementar Web Bluetooth API para BITalino real
4. Adicionar modo offline com Service Workers
5. Implementar push notifications para lembretes
6. Adicionar mais personagens e acessórios
7. Criar sistema de níveis/XP
8. Adicionar partilha de conquistas
