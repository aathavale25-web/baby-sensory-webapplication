// Age-appropriate configurations for baby sensory experiences
// Based on developmental milestones and vision capabilities

export const AGE_PROFILES = {
  '4-6': {
    name: '4-6 Months',
    ageRange: [4, 6],

    // Object spawning
    objectCount: { min: 1, max: 2 },
    maxSimultaneousObjects: 2,
    spawnDelay: 4000, // 4 seconds between spawns

    // Visual properties
    colorPalette: [
      '#000000', // Black
      '#FFFFFF', // White
      '#FF0000', // Red
      '#FFFF00', // Yellow
      '#0000FF', // Blue
    ],
    objectSize: { min: 20, max: 30 }, // Percentage of screen

    // Animation
    animationSpeed: 0.3, // 70% slower than baseline
    allowRotation: false,
    movementPattern: 'linear',

    // Interaction
    touchBehavior: {
      celebrationDuration: 1000, // 1 second pulse animation
      persistDuration: 3000, // Stay visible for 3 seconds
      removeOnTouch: false, // Don't remove immediately
      growScale: 2.0, // Grow to 2x size
      hitboxMultiplier: 1.5, // Easier to touch
    },

    // Environment
    backgroundComplexity: 'solid',
    enabledThemes: ['contrast'],
  },

  '7-9': {
    name: '7-9 Months',
    ageRange: [7, 9],

    // Object spawning
    objectCount: { min: 3, max: 5 },
    maxSimultaneousObjects: 5,
    spawnDelay: 2500, // 2.5 seconds between spawns

    // Visual properties
    colorPalette: [
      '#000000', // Black
      '#FFFFFF', // White
      '#FF0000', // Red
      '#FFFF00', // Yellow
      '#0000FF', // Blue
      '#00FF00', // Green
      '#FFA500', // Orange
      '#800080', // Purple
    ],
    objectSize: { min: 12, max: 20 },

    // Animation
    animationSpeed: 0.6, // Moderate speed
    allowRotation: true,
    movementPattern: 'curved',

    // Interaction
    touchBehavior: {
      celebrationDuration: 800,
      persistDuration: 2000, // 2 seconds
      removeOnTouch: false,
      growScale: 1.8,
      hitboxMultiplier: 1.3,
    },

    // Environment
    backgroundComplexity: 'gradient',
    enabledThemes: ['contrast', 'ocean', 'space'],
  },

  '10-12': {
    name: '10-12 Months',
    ageRange: [10, 12],

    // Object spawning
    objectCount: { min: 5, max: 8 },
    maxSimultaneousObjects: 8,
    spawnDelay: 1500, // 1.5 seconds between spawns

    // Visual properties - full palette
    colorPalette: [
      '#000000', '#FFFFFF', '#FF0000', '#FFFF00', '#0000FF',
      '#00FF00', '#FFA500', '#800080', '#FF1493', '#00CED1',
      '#FFD700', '#FF69B4', '#98FB98', '#DDA0DD',
    ],
    objectSize: { min: 8, max: 15 },

    // Animation
    animationSpeed: 1.0, // Full speed
    allowRotation: true,
    movementPattern: 'organic',

    // Interaction
    touchBehavior: {
      celebrationDuration: 500,
      persistDuration: 0, // Remove after celebration
      removeOnTouch: true,
      growScale: 1.5,
      hitboxMultiplier: 1.2,
    },

    // Environment
    backgroundComplexity: 'animated',
    enabledThemes: ['contrast', 'ocean', 'space', 'jungle', 'rainbow'],
  },
};

/**
 * Get age profile for a given age in months
 * @param {number} ageMonths - Baby's age in months (4-12)
 * @returns {object} Age profile configuration
 */
export function getAgeProfile(ageMonths) {
  if (ageMonths >= 4 && ageMonths <= 6) {
    return AGE_PROFILES['4-6'];
  } else if (ageMonths >= 7 && ageMonths <= 9) {
    return AGE_PROFILES['7-9'];
  } else if (ageMonths >= 10 && ageMonths <= 12) {
    return AGE_PROFILES['10-12'];
  }

  // Default to oldest age group if outside range
  return AGE_PROFILES['10-12'];
}

/**
 * Get simplified color palette based on age
 * @param {number} ageMonths - Baby's age in months
 * @returns {array} Array of hex color codes
 */
export function getColorPalette(ageMonths) {
  const profile = getAgeProfile(ageMonths);
  return profile.colorPalette;
}

/**
 * Check if a theme is enabled for a given age
 * @param {number} ageMonths - Baby's age in months
 * @param {string} themeId - Theme identifier
 * @returns {boolean} Whether theme is enabled
 */
export function isThemeEnabled(ageMonths, themeId) {
  const profile = getAgeProfile(ageMonths);
  return profile.enabledThemes.includes(themeId);
}
