// High contrast color palettes optimized for infant vision
export const colorPalettes = {
  ocean: ['#0066FF', '#00CCFF', '#FFFFFF', '#00FF88', '#004488'],
  space: ['#FFFFFF', '#FFFF00', '#FF00FF', '#00FFFF', '#FF8800'],
  garden: ['#FF4488', '#44FF44', '#FFFF00', '#FF8844', '#FFFFFF'],
  rainbow: ['#FF0000', '#FF8800', '#FFFF00', '#00FF00', '#0088FF', '#8800FF'],
  animals: ['#FF8844', '#FFDD44', '#88FF44', '#44DDFF', '#FF88CC'],
  shapes: ['#FF4444', '#4444FF', '#FFFF00', '#44FF44', '#FF44FF'],
  clouds: ['#FFFFFF', '#AADDFF', '#FFCCEE', '#DDFFDD', '#FFEEDD'],
}

// Theme configurations for each day
export const dailyThemes = [
  {
    id: 'ocean',
    name: 'Ocean Day',
    background: 'linear-gradient(180deg, #001133 0%, #003366 50%, #0066AA 100%)',
    colors: colorPalettes.ocean,
    animations: ['bubbles', 'fish', 'waves'],
    sounds: ['water', 'bubbles', 'whale'],
    emoji: '🐠',
  },
  {
    id: 'space',
    name: 'Space Day',
    background: 'linear-gradient(180deg, #000011 0%, #110022 50%, #000033 100%)',
    colors: colorPalettes.space,
    animations: ['stars', 'planets', 'rockets'],
    sounds: ['twinkle', 'whoosh', 'chime'],
    emoji: '🚀',
  },
  {
    id: 'garden',
    name: 'Garden Day',
    background: 'linear-gradient(180deg, #88DDFF 0%, #AAFFAA 50%, #88DD88 100%)',
    colors: colorPalettes.garden,
    animations: ['flowers', 'butterflies', 'bees'],
    sounds: ['birds', 'wind', 'chime'],
    emoji: '🌸',
  },
  {
    id: 'rainbow',
    name: 'Rainbow Day',
    background: 'linear-gradient(180deg, #FFAAAA 0%, #FFFFAA 25%, #AAFFAA 50%, #AAFFFF 75%, #FFAAFF 100%)',
    colors: colorPalettes.rainbow,
    animations: ['colorWaves', 'prisms', 'sparkles'],
    sounds: ['chime', 'bells', 'harp'],
    emoji: '🌈',
  },
  {
    id: 'animals',
    name: 'Animal Day',
    background: 'linear-gradient(180deg, #FFEECC 0%, #DDFFDD 50%, #CCFFEE 100%)',
    colors: colorPalettes.animals,
    animations: ['animals', 'paws', 'hearts'],
    sounds: ['meow', 'woof', 'moo'],
    emoji: '🐱',
  },
  {
    id: 'shapes',
    name: 'Shapes Day',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #EEEEFF 50%, #DDEEFF 100%)',
    colors: colorPalettes.shapes,
    animations: ['shapes', 'patterns', 'spirals'],
    sounds: ['pop', 'ding', 'boing'],
    emoji: '⭐',
  },
  {
    id: 'clouds',
    name: 'Cloud Day',
    background: 'linear-gradient(180deg, #AADDFF 0%, #DDEEFF 50%, #FFFFFF 100%)',
    colors: colorPalettes.clouds,
    animations: ['clouds', 'raindrops', 'rainbows'],
    sounds: ['rain', 'thunder', 'wind'],
    emoji: '☁️',
  },
]

// Animal shapes as SVG paths
export const animalShapes = {
  cat: {
    emoji: '🐱',
    color: '#FF8844',
  },
  dog: {
    emoji: '🐶',
    color: '#DDAA66',
  },
  bunny: {
    emoji: '🐰',
    color: '#FFAACC',
  },
  bear: {
    emoji: '🐻',
    color: '#AA7744',
  },
  panda: {
    emoji: '🐼',
    color: '#333333',
  },
  chick: {
    emoji: '🐤',
    color: '#FFDD00',
  },
  fish: {
    emoji: '🐠',
    color: '#FF6644',
  },
  butterfly: {
    emoji: '🦋',
    color: '#AA44FF',
  },
  bee: {
    emoji: '🐝',
    color: '#FFCC00',
  },
  ladybug: {
    emoji: '🐞',
    color: '#FF2200',
  },
}

// Geometric shapes
export const geometricShapes = [
  { type: 'circle', sides: 0 },
  { type: 'triangle', sides: 3 },
  { type: 'square', sides: 4 },
  { type: 'pentagon', sides: 5 },
  { type: 'hexagon', sides: 6 },
  { type: 'star', sides: 5, star: true },
]

// Sound frequencies for generated tones
export const musicalNotes = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
}

// Touch feedback configurations
export const touchEffects = {
  burst: {
    particles: 12,
    duration: 800,
    spread: 100,
  },
  ripple: {
    rings: 3,
    duration: 600,
    maxSize: 150,
  },
  sparkle: {
    stars: 8,
    duration: 500,
    spread: 80,
  },
}
