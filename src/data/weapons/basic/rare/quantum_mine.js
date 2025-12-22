/**
 * @fileoverview Quantum Mine - Rare mine that exists in 3 places simultaneously
 * @module Data/Weapons/Rare/QuantumMine
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.quantum_mine = {
    id: 'quantum_mine',
    name: 'Quantum Mine',
    description: 'Exists in quantum superposition - 3 locations simultaneously. Triggering one collapses all',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 70,
    cooldown: 5.0,
    range: 350, // Placement range from player
    triggerRadius: 45,
    explosionRadius: 80,
    duration: 20.0, // Mine lifetime

    // Visual
    color: '#00FFFF',
    secondaryColor: '#FF00FF',
    icon: 'quantum_mine',
    imageId: 'weapon_quantum_mine',
    mineImageId: 'quantum_mine_mine',

    // Quantum superposition mechanic
    quantumState: {
      enabled: true,
      positionCount: 3, // Exists in 3 positions
      phaseInterval: 0.5, // Visual phase shift timing
      // When one triggers, all collapse and explode
      collapse: {
        simultaneousExplosion: true,
        collapseDelay: 0.1, // Brief delay between explosions
        bonusDamagePerCollapse: 0.2, // +20% damage for each position that explodes
      },
      // Quantum tunneling - small chance to teleport
      tunneling: {
        enabled: true,
        chance: 0.15, // 15% chance every few seconds
        interval: 3.0,
        range: 100, // Teleport range
      },
      // Uncertainty visual - positions shimmer/phase
      visual: {
        shimmerEffect: true,
        phaseAlpha: [1.0, 0.6, 0.6], // Primary position more visible
        colorShift: true,
        particleTrails: true,
      },
    },

    // Explosion effect
    explosion: {
      type: 'quantum_burst',
      colors: ['#00FFFF', '#FF00FF', '#FFFFFF'],
      waveEffect: true,
      distortion: { enabled: true, intensity: 0.5, duration: 0.3 },
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 25,
      intensity: 0.6,
      colors: ['#00FFFF', '#FF00FF'],
      alternateColors: true,
      pulse: true,
      pulseSpeed: 3,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'quantum_particles',
      colors: ['#00FFFF', '#FF00FF', '#FFFFFF'],
      count: 12,
      spread: 40,
      lifetime: 0.6,
      phaseShift: true,
    },

    // Screen effects
    screenEffects: {
      onCollapse: {
        flash: { color: '#FFFFFF', intensity: 0.4, duration: 0.15 },
        distortion: { type: 'ripple', intensity: 0.3, duration: 0.3 },
      },
    },

    upgrades: {
      2: { damage: 90, positionCount: 4, explosionRadius: 90 },
      3: { damage: 115, bonusDamagePerCollapse: 0.25, cooldown: 4.5 },
      4: { damage: 145, triggerRadius: 55, tunneling: { chance: 0.2 } },
      5: { damage: 185, positionCount: 5, explosionRadius: 100, bonusDamagePerCollapse: 0.3 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
