// Nursery rhyme melodies using musical note frequencies
// Each melody is an array of notes with frequency, duration, and timing

// Standard musical note frequencies (Hz)
const NOTES = {
  // Octave 3
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.00,
  A3: 220.00,
  B3: 246.94,
  // Octave 4
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  // Octave 5
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.00,
  B5: 987.77,
  // Rest (silence)
  REST: 0,
}

// Note duration multipliers (based on tempo)
const DURATIONS = {
  WHOLE: 4,
  HALF: 2,
  QUARTER: 1,
  EIGHTH: 0.5,
  SIXTEENTH: 0.25,
  DOTTED_HALF: 3,
  DOTTED_QUARTER: 1.5,
}

// Helper to create a note object
function note(pitch, duration) {
  return {
    frequency: NOTES[pitch] || 0,
    duration,
    pitch, // Keep pitch name for debugging
  }
}

// Twinkle Twinkle Little Star
// C C G G A A G - F F E E D D C
const twinkleTwinkle = {
  id: 'twinkle',
  name: 'Twinkle Twinkle Little Star',
  emoji: '⭐',
  color: '#FFD700',
  tempo: 120, // BPM
  notes: [
    // Twin-kle twin-kle lit-tle star
    note('C4', DURATIONS.QUARTER),
    note('C4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    note('A4', DURATIONS.QUARTER),
    note('A4', DURATIONS.QUARTER),
    note('G4', DURATIONS.HALF),
    // How I won-der what you are
    note('F4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('C4', DURATIONS.HALF),
    // Up a-bove the world so high
    note('G4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('D4', DURATIONS.HALF),
    // Like a dia-mond in the sky
    note('G4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('D4', DURATIONS.HALF),
    // Twin-kle twin-kle lit-tle star
    note('C4', DURATIONS.QUARTER),
    note('C4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    note('A4', DURATIONS.QUARTER),
    note('A4', DURATIONS.QUARTER),
    note('G4', DURATIONS.HALF),
    // How I won-der what you are
    note('F4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('C4', DURATIONS.HALF),
  ],
}

// Mary Had a Little Lamb
// E D C D E E E - D D D - E G G
const maryHadALittleLamb = {
  id: 'mary',
  name: 'Mary Had a Little Lamb',
  emoji: '🐑',
  color: '#FFB6C1',
  tempo: 120,
  notes: [
    // Ma-ry had a lit-tle lamb
    note('E4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('C4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.HALF),
    // Lit-tle lamb, lit-tle lamb
    note('D4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('D4', DURATIONS.HALF),
    note('E4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    note('G4', DURATIONS.HALF),
    // Ma-ry had a lit-tle lamb
    note('E4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('C4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    // Its fleece was white as snow
    note('D4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('C4', DURATIONS.WHOLE),
  ],
}

// Row Row Row Your Boat
// C C C D E - E D E F G
const rowRowRowYourBoat = {
  id: 'row',
  name: 'Row Row Row Your Boat',
  emoji: '🚣',
  color: '#87CEEB',
  tempo: 100,
  notes: [
    // Row row row your boat
    note('C4', DURATIONS.DOTTED_QUARTER),
    note('C4', DURATIONS.EIGHTH),
    note('C4', DURATIONS.QUARTER),
    note('D4', DURATIONS.EIGHTH),
    note('E4', DURATIONS.DOTTED_QUARTER),
    // Gen-tly down the stream
    note('E4', DURATIONS.EIGHTH),
    note('D4', DURATIONS.EIGHTH),
    note('E4', DURATIONS.EIGHTH),
    note('F4', DURATIONS.EIGHTH),
    note('G4', DURATIONS.DOTTED_HALF),
    // Mer-ri-ly mer-ri-ly mer-ri-ly mer-ri-ly
    note('C5', DURATIONS.EIGHTH),
    note('C5', DURATIONS.EIGHTH),
    note('C5', DURATIONS.EIGHTH),
    note('G4', DURATIONS.EIGHTH),
    note('G4', DURATIONS.EIGHTH),
    note('G4', DURATIONS.EIGHTH),
    note('E4', DURATIONS.EIGHTH),
    note('E4', DURATIONS.EIGHTH),
    note('E4', DURATIONS.EIGHTH),
    note('C4', DURATIONS.EIGHTH),
    note('C4', DURATIONS.EIGHTH),
    note('C4', DURATIONS.EIGHTH),
    // Life is but a dream
    note('G4', DURATIONS.EIGHTH),
    note('F4', DURATIONS.EIGHTH),
    note('E4', DURATIONS.EIGHTH),
    note('D4', DURATIONS.EIGHTH),
    note('C4', DURATIONS.DOTTED_HALF),
  ],
}

// Baa Baa Black Sheep (same melody as Twinkle Twinkle)
const baaBaaBlackSheep = {
  id: 'baabaa',
  name: 'Baa Baa Black Sheep',
  emoji: '🐑',
  color: '#2F4F4F',
  tempo: 110,
  notes: [
    // Baa baa black sheep
    note('C4', DURATIONS.QUARTER),
    note('C4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    note('G4', DURATIONS.QUARTER),
    // Have you a-ny wool
    note('A4', DURATIONS.QUARTER),
    note('A4', DURATIONS.QUARTER),
    note('G4', DURATIONS.HALF),
    // Yes sir yes sir
    note('F4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    // Three bags full
    note('D4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('C4', DURATIONS.HALF),
    // One for the mas-ter
    note('G4', DURATIONS.QUARTER),
    note('G4', DURATIONS.EIGHTH),
    note('G4', DURATIONS.EIGHTH),
    note('F4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    // One for the dame
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.EIGHTH),
    note('E4', DURATIONS.EIGHTH),
    note('D4', DURATIONS.HALF),
    // One for the lit-tle boy
    note('G4', DURATIONS.QUARTER),
    note('G4', DURATIONS.EIGHTH),
    note('G4', DURATIONS.EIGHTH),
    note('F4', DURATIONS.QUARTER),
    note('F4', DURATIONS.QUARTER),
    // Who lives down the lane
    note('E4', DURATIONS.QUARTER),
    note('E4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('D4', DURATIONS.QUARTER),
    note('C4', DURATIONS.HALF),
  ],
}

// Itsy Bitsy Spider
const itsyBitsySpider = {
  id: 'spider',
  name: 'Itsy Bitsy Spider',
  emoji: '🕷️',
  color: '#8B4513',
  tempo: 110,
  notes: [
    // The it-sy bit-sy spi-der
    note('G4', DURATIONS.EIGHTH),
    note('C5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('C5', DURATIONS.QUARTER),
    note('D5', DURATIONS.EIGHTH),
    note('E5', DURATIONS.DOTTED_QUARTER),
    // Climbed up the wa-ter spout
    note('E5', DURATIONS.EIGHTH),
    note('D5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('D5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('C5', DURATIONS.DOTTED_QUARTER),
    // Down came the rain and
    note('G4', DURATIONS.EIGHTH),
    note('C5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('C5', DURATIONS.QUARTER),
    note('D5', DURATIONS.EIGHTH),
    note('E5', DURATIONS.DOTTED_QUARTER),
    // Washed the spi-der out
    note('E5', DURATIONS.EIGHTH),
    note('D5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('D5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('C5', DURATIONS.DOTTED_QUARTER),
    // Out came the sun and
    note('E5', DURATIONS.EIGHTH),
    note('E5', DURATIONS.QUARTER),
    note('E5', DURATIONS.EIGHTH),
    note('F5', DURATIONS.QUARTER),
    note('G5', DURATIONS.EIGHTH),
    note('G5', DURATIONS.DOTTED_QUARTER),
    // Dried up all the rain
    note('F5', DURATIONS.EIGHTH),
    note('E5', DURATIONS.QUARTER),
    note('D5', DURATIONS.EIGHTH),
    note('E5', DURATIONS.QUARTER),
    note('F5', DURATIONS.EIGHTH),
    note('E5', DURATIONS.DOTTED_QUARTER),
    // And the it-sy bit-sy spi-der
    note('G4', DURATIONS.EIGHTH),
    note('C5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('C5', DURATIONS.QUARTER),
    note('D5', DURATIONS.EIGHTH),
    note('E5', DURATIONS.DOTTED_QUARTER),
    // Climbed up the spout a-gain
    note('E5', DURATIONS.EIGHTH),
    note('D5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('D5', DURATIONS.QUARTER),
    note('C5', DURATIONS.EIGHTH),
    note('C5', DURATIONS.DOTTED_HALF),
  ],
}

// Export all nursery rhymes
export const nurseryRhymes = [
  twinkleTwinkle,
  maryHadALittleLamb,
  rowRowRowYourBoat,
  baaBaaBlackSheep,
  itsyBitsySpider,
]

// Export note frequencies for use in audio synthesis
export { NOTES, DURATIONS }
