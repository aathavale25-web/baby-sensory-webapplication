# Age-Adaptive System

Baby Sensory World automatically adjusts the sensory experience based on your baby's age, following developmental milestones and vision capabilities.

## Overview

The app recognizes three developmental stages:

| Age Range | Profile Name | Focus |
|-----------|-------------|-------|
| 4-6 months | High Simplicity | High contrast, large objects, cause-effect learning |
| 7-9 months | Medium Complexity | More colors, gentle interactions, pattern recognition |
| 10-12 months | Full Complexity | Rich animations, full palette, active engagement |

## Age Profiles Configuration

Each age profile defines specific parameters:

### 4-6 Months: Building Vision Foundation

**Visual Properties**
- **Object Count**: 1-2 objects maximum
- **Object Size**: 20-30% of screen (very large)
- **Colors**: 5 high-contrast colors
  - Black (#000000)
  - White (#FFFFFF)
  - Red (#FF0000)
  - Yellow (#FFFF00)
  - Blue (#0000FF)
- **Movement**: Linear paths only, no curves
- **Speed**: 30% of baseline (very slow)
- **Rotation**: Disabled

**Why?**
- At 4-6 months, babies are still developing visual tracking
- High contrast helps with focus and attention
- Large objects are easier to see and track
- Slow movement prevents overstimulation

**Interaction**
- **Touch Persistence**: 3 seconds
- **Purpose**: Teaches cause-and-effect relationship
- **Feedback**: Large growth, gentle pulses, personalized message
- **Spawn Delay**: 4 seconds between objects

**Environment**
- **Background**: Solid colors only (black or white)
- **Themes**: Contrast World only
- **Complexity**: Minimal, clean interface

**Developmental Benefits**
- Strengthens visual tracking abilities
- Develops hand-eye coordination
- Teaches cause-and-effect relationships
- Encourages focused attention

---

### 7-9 Months: Expanding Perception

**Visual Properties**
- **Object Count**: 3-5 objects
- **Object Size**: 12-20% of screen
- **Colors**: 8 colors (adds secondary colors)
  - Primary 5 + Green, Orange, Purple
- **Movement**: Curved paths
- **Speed**: 60% of baseline (moderate)
- **Rotation**: Gentle rotation enabled

**Why?**
- Vision has improved significantly
- Can track multiple objects
- Ready for more color variety
- Beginning to understand patterns

**Interaction**
- **Touch Persistence**: 2 seconds
- **Purpose**: Faster feedback, still reinforcing
- **Feedback**: Medium growth, celebration
- **Spawn Delay**: 2.5 seconds

**Environment**
- **Background**: Gradients allowed
- **Themes**: Contrast, Ocean, Space
- **Complexity**: Moderate animations

**Developmental Benefits**
- Enhances color recognition
- Improves multi-object tracking
- Develops anticipation skills
- Strengthens spatial awareness

---

### 10-12 Months: Full Engagement

**Visual Properties**
- **Object Count**: 5-8 objects
- **Object Size**: 8-15% of screen
- **Colors**: 14 colors (full palette)
- **Movement**: Organic, varied paths
- **Speed**: 100% (full speed)
- **Rotation**: Full rotation enabled

**Why?**
- Vision nearly mature
- Can handle complex scenes
- Ready for rich visual experiences
- Enjoys exploration and discovery

**Interaction**
- **Touch Persistence**: 0 seconds (immediate removal)
- **Purpose**: Quick feedback, encourages continuous play
- **Feedback**: Celebration then removal
- **Spawn Delay**: 1.5 seconds

**Environment**
- **Background**: Animated backgrounds (ColorWave, particles)
- **Themes**: All themes available
- **Complexity**: Full animations, rich interactions

**Developmental Benefits**
- Refines fine motor control
- Enhances problem-solving
- Develops decision-making
- Encourages exploration

## How Age Adaptation Works

### Automatic Adjustment

When you create or update a baby profile:

```javascript
// Example: 5-month-old baby
profile = {
  name: "Emma",
  age_months: 5
}

// System automatically selects 4-6 month profile
ageProfile = getAgeProfile(5)
// Returns: {
//   objectCount: { min: 1, max: 2 },
//   colorPalette: ['#000000', '#FFFFFF', '#FF0000', '#FFFF00', '#0000FF'],
//   animationSpeed: 0.3,
//   ...
// }
```

### Component Integration

All components respect the age profile:

**Animations**
```javascript
<BubbleAnimation
  colors={colors}
  count={ageProfile.objectCount.max}
  ageProfile={ageProfile}
/>
```

**Touch Feedback**
```javascript
<TouchFeedback
  ageProfile={ageProfile}
  // Automatically uses:
  // - persistDuration (3s, 2s, or 0s)
  // - growScale (2.0, 1.8, or 1.5)
  // - celebrationDuration (1000ms, 800ms, 500ms)
/>
```

**Themes**
```javascript
availableThemes = themes.filter(t =>
  ageProfile.enabledThemes.includes(t.id)
)
```

## Overriding Age Profiles

Parents can manually override the age profile for testing:

1. Open **Settings Panel** (⚙️)
2. Click age override buttons (4-6, 7-9, 10-12)
3. Profile temporarily switches to selected age
4. Override clears when you save profile changes

**Use Cases for Override:**
- Testing different complexity levels
- Preparing baby for next stage
- Adjusting for individual development pace

## Progressive Transition

As your baby grows:

1. **Update age in Settings**
2. **Experience automatically adapts**
3. **Gradual complexity increase**

Example transition from 6 to 7 months:
- Objects increase from 1-2 to 3-5
- Speed increases from 30% to 60%
- New colors become available
- Background gains gradients
- Touch persistence reduces from 3s to 2s

## Best Practices

### For 4-6 Month Olds
- ✅ Use in bright, quiet environment
- ✅ Short sessions (5-10 minutes)
- ✅ Close distance (12-18 inches)
- ✅ Watch for signs of tiredness

### For 7-9 Month Olds
- ✅ Can handle longer sessions (10-15 minutes)
- ✅ Encourage reaching and touching
- ✅ Talk about colors and objects
- ✅ Point out patterns

### For 10-12 Month Olds
- ✅ Interactive play (15-20 minutes)
- ✅ Name objects and colors together
- ✅ Encourage exploration
- ✅ Celebrate achievements together

## Research Basis

Age adaptations are based on:

- **Vision Development Studies**: Infant visual acuity timeline
- **AAP Guidelines**: Screen time and developmental appropriateness
- **Montessori Principles**: Age-appropriate complexity
- **Pediatric Research**: Infant attention spans and processing

## See Also

- [Touch Interactions](Touch-Interactions) - How touch feedback works
- [Themes & Animations](Themes-and-Animations) - Theme details
- [Parent's Guide](Parents-Guide) - Usage recommendations
