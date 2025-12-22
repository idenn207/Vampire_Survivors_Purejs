/**
 * @fileoverview Supernova Core - Rare area with 4s buildup that pulls enemies then explodes
 * @module Data/Weapons/Rare/SupernovaCore
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.supernova_core = {
    id: 'supernova_core',
    name: 'Supernova Core',
    description: 'A collapsing star that pulls enemies inward for 4 seconds before a cataclysmic explosion',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 200, // Explosion damage
    cooldown: 12.0,
    radius: 180, // Explosion radius
    range: 400, // Placement range

    // Visual
    color: '#FFFF00',
    secondaryColor: '#FF6600',
    tertiaryColor: '#FFFFFF',
    icon: 'supernova',
    imageId: 'weapon_supernova_core',
    areaImageId: 'supernova_core_area',

    // Supernova phases
    supernovaPhases: {
      enabled: true,
      // Phase 1: Collapse (pulling)
      collapse: {
        duration: 4.0,
        pullRadius: 250,
        pullForce: 100, // Strong pull
        pullForceGrowth: 1.5, // Force multiplier over duration
        tickDamage: 5, // Small DoT during collapse
        tickRate: 0.5,
        // Visual escalation
        visualPhases: [
          { time: 0, size: 40, color: '#FFFF66', intensity: 0.4 },
          { time: 1, size: 35, color: '#FFFF00', intensity: 0.5 },
          { time: 2, size: 28, color: '#FFAA00', intensity: 0.65 },
          { time: 3, size: 20, color: '#FF6600', intensity: 0.8 },
          { time: 3.5, size: 12, color: '#FF0000', intensity: 1.0 },
        ],
      },
      // Phase 2: Explosion
      explosion: {
        damage: 200,
        radius: 180,
        knockback: 200,
        burnDamage: 15,
        burnDuration: 3.0,
        screenShake: { intensity: 15, duration: 0.5 },
        screenFlash: { color: '#FFFFFF', intensity: 0.8, duration: 0.2 },
      },
      // Residual heat zone
      residualHeat: {
        enabled: true,
        radius: 100,
        duration: 4.0,
        damage: 12,
        tickRate: 0.4,
      },
    },

    // Warning indicator
    warningIndicator: {
      enabled: true,
      showRadius: true,
      pulseColor: '#FF0000',
      pulseSpeed: 4, // Gets faster as explosion approaches
      countdownDisplay: true,
    },

    // Visual effects
    glow: {
      enabled: true,
      radius: 60,
      intensity: 0.7,
      color: '#FFFF00',
      pulse: true,
      pulseSpeed: 2,
      intensifyOverTime: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'stellar_matter',
      colors: ['#FFFF00', '#FFAA00', '#FF6600', '#FFFFFF'],
      count: 25,
      spread: 200,
      lifetime: 1.0,
      spiralInward: true,
    },

    // Distortion effect
    distortion: {
      enabled: true,
      type: 'gravitational_lens',
      radius: 150,
      intensity: 0.6,
      intensifyOverTime: true,
    },

    upgrades: {
      2: { damage: 260, pullForce: 120, explosion: { radius: 200 } },
      3: { damage: 330, collapse: { duration: 3.5 }, cooldown: 11.0 },
      4: { damage: 420, residualHeat: { damage: 18, duration: 5.0 }, pullRadius: 280 },
      5: { damage: 550, explosion: { radius: 220, knockback: 250 }, cooldown: 10.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
