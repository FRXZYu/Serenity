export type SerenitySymbolId = 'estrella' | 'silueta' | 'galaxia' | 'cometa' | 'serenity';

export interface EmblemElement {
  id: 'estrella' | 'silueta' | 'galaxia' | 'cometa';
  title: string;
  shortMeaning: string;
  image: string;
  glowColor: string;
  /** Exact relative placement inside the unified 1097:1419 emblem */
  layout: {
    left: string;
    top: string;
    width: string;
  };
  /** Visual scale multiplier when separated as a standalone floating icon */
  iconScale: number;
}

export const SERENITY_WORDMARK = '/assets/aistudio/serenity_logo_9895c4c1.png';

export const SERENITY_NAME_MEANING = {
  id: 'serenity' as const,
  title: 'Serenity',
  shortMeaning:
    'La luz que asoma entre las nubes al llegar a la cima. La calma que confirma que todo el camino valió la pena.',
  image: SERENITY_WORDMARK,
  glowColor: 'rgba(220, 238, 255, 0.25)',
};

export const EMBLEM_ELEMENTS: EmblemElement[] = [
  {
    id: 'cometa',
    title: 'La Pasión',
    shortMeaning:
      'Entregarse con ilusión a aquello que nos hace sentir vivos y perseguir lo que soñamos.',
    image: '/assets/aistudio/cometa_logo_ac0dbce6.png',
    glowColor: 'rgba(220, 238, 255, 0.34)',
    layout: {
      left: '1.0%',
      top: '0%',
      width: '50.0%',
    },
    iconScale: 1.25,
  },
  {
    id: 'galaxia',
    title: 'La Galaxia',
    shortMeaning:
      'Una promoción unida por el significado de cada estudiante. Un brillo irrepetible en un mismo universo.',
    image: '/assets/aistudio/galaxia_logo_bf2dbb39.png',
    glowColor: 'rgba(142, 68, 236, 0.42)',
    layout: {
      left: '0%',
      top: '27.5%',
      width: '99.3%',
    },
    iconScale: 0.72,
  },
  {
    id: 'silueta',
    title: 'Mirar al Cielo',
    shortMeaning:
      'Un reflejo de quien eres: atreverse a mirar arriba y soñar en grande sin dejar de aspirar a más.',
    image: '/assets/aistudio/silueta_logo_e302909d.png',
    glowColor: 'rgba(233, 226, 245, 0.24)',
    layout: {
      left: '9.0%',
      top: '10.8%',
      width: '69.0%',
    },
    iconScale: 0.88,
  },
  {
    id: 'estrella',
    title: 'La Luz Interior',
    shortMeaning:
      'Ese brillo único que te define y que, aunque intentes ocultarlo, siempre termina saliendo.',
    image: '/assets/aistudio/estrella_logo_2ab4667f.png',
    glowColor: 'rgba(217, 0, 255, 0.44)',
    layout: {
      left: '21.3%',
      top: '50.9%',
      width: '49.5%',
    },
    iconScale: 1.24,
  },
];
