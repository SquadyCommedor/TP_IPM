import type { Scene, BreathingExercise } from './types';

export const HAIRCUT_SCENES: Scene[] = [
  {
    id: 'chegada',
    title: 'Chegada ao Salão',
    description: 'Vamos entrar no salão de cabeleireiro. Primeiro, cumprimentamos o cabeleireiro e sentamo-nos na cadeira de espera.',
    icon: 'DoorOpen',
    duration: 120,
    order: 1,
    tips: [
      'O cabeleireiro é nosso amigo e quer ajudar',
      'Podemos levar um brinquedo favorito',
      'A cadeira de espera é confortável'
    ],
    sounds: ['campainha', 'conversa suave'],
    imagePrompt: 'Entrada de um salão de cabeleireiro amigável e colorido'
  },
  {
    id: 'capa',
    title: 'A Capa Mágica',
    description: 'O cabeleireiro coloca uma capa especial em nós. É como uma capa de super-herói!',
    icon: 'Shirt',
    duration: 60,
    order: 2,
    tips: [
      'A capa protege a nossa roupa',
      'É macia e não aperta',
      'Podemos escolher uma cor divertida'
    ],
    sounds: ['tecido suave'],
    imagePrompt: 'Criança com capa de cabeleireiro colorida'
  },
  {
    id: 'lavagem',
    title: 'Lavar o Cabelo',
    description: 'Vamos à lavagem! A água está morna e o champô cheira bem.',
    icon: 'Droplets',
    duration: 180,
    order: 3,
    tips: [
      'A água não vai para os olhos',
      'O cabeleireiro usa uma toalha na testa',
      'A massagem na cabeça é relaxante'
    ],
    sounds: ['água corrente', 'massagem suave'],
    imagePrompt: 'Lavagem de cabelo suave e confortável'
  },
  {
    id: 'corte',
    title: 'Hora do Corte',
    description: 'O cabeleireiro corta o cabelo com tesouras especiais. Faz um som suave de "snip snip".',
    icon: 'Scissors',
    duration: 300,
    order: 4,
    tips: [
      'As tesouras não tocam na pele',
      'O som é como um pássaro a bater asas',
      'Podemos pedir uma pausa quando quisermos'
    ],
    sounds: ['tesouras'],
    imagePrompt: 'Cabeleireiro a cortar cabelo com cuidado'
  },
  {
    id: 'secagem',
    title: 'Secar o Cabelo',
    description: 'O secador faz um som suave e o ar é morno. O cabelo fica macio!',
    icon: 'Wind',
    duration: 180,
    order: 5,
    tips: [
      'O ar é morno, não quente',
      'O som é como o vento',
      'Podemos tapar os ouvidos se quisermos'
    ],
    sounds: ['secador'],
    imagePrompt: 'Secagem de cabelo suave'
  },
  {
    id: 'acabamento',
    title: 'O Toque Final',
    description: 'O cabeleireiro passa um pente suave e aplica um pouco de produto. Estamos quase lá!',
    icon: 'Sparkles',
    duration: 120,
    order: 6,
    tips: [
      'O pente desliza suavemente',
      'O produto cheira bem',
      'Já estamos quase no fim!'
    ],
    sounds: ['pente'],
    imagePrompt: 'Acabamento final do corte de cabelo'
  },
  {
    id: 'espelho',
    title: 'O Espelho Mágico',
    description: 'Olha que bonito! Vamos ver o resultado no espelho. Estás lindo/a!',
    icon: 'Mirror',
    duration: 60,
    order: 7,
    tips: [
      'O novo corte fica-te muito bem!',
      'Podemos sorrir para o espelho',
      'O cabeleireiro fez um trabalho fantástico'
    ],
    sounds: ['elogios'],
    imagePrompt: 'Criança a ver-se no espelho com cabelo novo'
  }
];

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'balloon',
    name: 'Encher o Balão',
    description: 'Imagina que estás a encher um balão colorido. Inspira para encher, solta o ar para soltar.',
    inhaleTime: 4,
    holdTime: 2,
    exhaleTime: 6,
    visual: 'balloon',
    color: '#F59E0B'
  },
  {
    id: 'candle',
    name: 'Apagar a Vela',
    description: 'Imagina uma vela à tua frente. Inspira o cheiro doce, sopra suavemente para apagar a chama.',
    inhaleTime: 4,
    holdTime: 1,
    exhaleTime: 6,
    visual: 'candle',
    color: '#EF4444'
  },
  {
    id: 'flower',
    name: 'Cheirar a Flor',
    description: 'Cheira a flor bonita (inspira) e sopra as pétalas (expira).',
    inhaleTime: 4,
    holdTime: 2,
    exhaleTime: 5,
    visual: 'flower',
    color: '#10B981'
  },
  {
    id: 'star',
    name: 'Brilhar como Estrela',
    description: 'A estrela cresce quando inspires (inspira) e brilha quando soltas o ar (expira).',
    inhaleTime: 3,
    holdTime: 2,
    exhaleTime: 5,
    visual: 'star',
    color: '#6366F1'
  }
];

export const CHARACTER_OPTIONS = [
  { id: 'boy1', name: 'Rui', emoji: '👦', color: '#3B82F6' },
  { id: 'boy2', name: 'Tomás', emoji: '🧒', color: '#8B5CF6' },
  { id: 'girl1', name: 'Ana', emoji: '👧', color: '#EC4899' },
  { id: 'girl2', name: 'Sofia', emoji: '🧒', color: '#F472B6' },
  { id: 'neutral1', name: 'Lia', emoji: '🙂', color: '#10B981' },
  { id: 'neutral2', name: 'Nico', emoji: '🤗', color: '#F59E0B' },
] as const;

export const HAIR_COLORS = [
  { id: 'dark', name: 'Castanho Escuro', color: '#3E2723' },
  { id: 'brown', name: 'Castanho Claro', color: '#6D4C41' },
  { id: 'blonde', name: 'Loiro', color: '#F9D71C' },
  { id: 'red', name: 'Ruivo', color: '#C62828' },
  { id: 'black', name: 'Preto', color: '#212121' },
] as const;

export const STRESS_THRESHOLD = 70;
export const STRESS_WARNING = 50;
