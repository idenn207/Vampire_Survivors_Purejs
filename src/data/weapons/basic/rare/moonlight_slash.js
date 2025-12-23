/**
 * @fileoverview Moonlight Slash - Rare laser with 3 crescent slashes, damage varies with moon phase
 * @module Data/Weapons/Rare/MoonlightSlash
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.moonlight_slash = {
    id: 'moonlight_slash',
    name: 'Moonlight Slash',
    description: 'Three silver crescents dance through enemies. Power waxes and wanes with the moon cycle',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 40, // Base damage per slash
    cooldown: 1.5,
    range: 350,
    width: 25, // Crescent width
    slashCount: 3, // Number of crescents
    slashDelay: 0.15, // Delay between each slash

    // Visual
    color: '#CCDDFF',
    secondaryColor: '#FFFFFF',
    visualScale: 1.2,
    icon: 'moonlight',
    imageId: 'weapon_moonlight_slash',
    laserImageId: 'moonlight_slash_laser',

    // Status effect
    statusEffect: {
      type: 'slow',
      speedModifier: 0.6,
      duration: 1.5,
    },

    // Moon phase system
    moonPhase: {
      enabled: true,
      cycleDuration: 30.0, // Full moon cycle time in seconds
      phases: [
        {
          name: 'New Moon',
          damageMultiplier: 0.7,
          color: '#6688AA',
          effect: 'stealth', // Enemies don't see you as easily
          slashAlpha: 0.5,
        },
        {
          name: 'Waxing Crescent',
          damageMultiplier: 0.85,
          color: '#8899BB',
          effect: null,
          slashAlpha: 0.65,
        },
        {
          name: 'First Quarter',
          damageMultiplier: 1.0,
          color: '#AABBCC',
          effect: null,
          slashAlpha: 0.8,
        },
        {
          name: 'Waxing Gibbous',
          damageMultiplier: 1.15,
          color: '#BBCCDD',
          effect: null,
          slashAlpha: 0.9,
        },
        {
          name: 'Full Moon',
          damageMultiplier: 1.5,
          color: '#FFFFFF',
          effect: 'lunacy', // Enemies take +25% damage from all sources
          slashAlpha: 1.0,
          screenGlow: true,
        },
        {
          name: 'Waning Gibbous',
          damageMultiplier: 1.15,
          color: '#BBCCDD',
          effect: null,
          slashAlpha: 0.9,
        },
        {
          name: 'Third Quarter',
          damageMultiplier: 1.0,
          color: '#AABBCC',
          effect: null,
          slashAlpha: 0.8,
        },
        {
          name: 'Waning Crescent',
          damageMultiplier: 0.85,
          color: '#8899BB',
          effect: null,
          slashAlpha: 0.65,
        },
      ],
      // Phase indicator UI
      showPhaseIndicator: true,
    },

    // Crescent slash pattern
    slashPattern: {
      type: 'arc_sequence',
      angles: [15, -15, 0], // Degrees offset for each slash
      arcSize: 120, // Crescent arc in degrees
      expandOnHit: true, // Slash grows slightly on hit
    },

    // Visual effects
    slashVisual: {
      type: 'silver_crescent',
      trailEnabled: true,
      trailLength: 30,
      shimmerEffect: true,
      starlightParticles: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.5,
      color: '#CCDDFF',
      pulse: true,
      pulseSpeed: 1.5,
      followPhase: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'moonlight_sparkle',
      colors: ['#FFFFFF', '#CCDDFF', '#AABBEE'],
      count: 10,
      spread: 40,
      lifetime: 0.6,
      twinkle: true,
    },

    // Screen effects during full moon
    screenEffects: {
      fullMoon: {
        vignette: { color: '#CCDDFF', intensity: 0.15 },
        ambientGlow: true,
      },
    },

    upgrades: {
      2: { damage: 52, slashCount: 4, fullMoon: { damageMultiplier: 1.65 } },
      3: { damage: 66, range: 400, cooldown: 1.3, cycleDuration: 25.0 },
      4: { damage: 82, slashCount: 5, statusEffect: { duration: 2.0 } },
      5: { damage: 105, fullMoon: { damageMultiplier: 2.0 }, slashDelay: 0.1 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
