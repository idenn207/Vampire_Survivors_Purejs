/**
 * @fileoverview Chrono Shatter - Epic projectile that records and replays attacks with time freeze
 * @module Data/Weapons/Epic/ChronoShatter
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.chrono_shatter = {
    id: 'chrono_shatter',
    name: 'Chrono Shatter',
    description: 'Records 10 seconds of attacks, then replays 5 ghost layers simultaneously. Can freeze time',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 4,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 45,
    cooldown: 0.5,
    projectileCount: 2,
    projectileSpeed: 400,
    range: 450,
    pierce: 2,
    spread: 15,

    // Visual
    color: '#00FFFF',
    secondaryColor: '#AAFFFF',
    tertiaryColor: '#FFFFFF',
    icon: 'chrono_crystal',
    imageId: 'weapon_chrono_shatter',
    projectileImageId: 'chrono_shatter_projectile',

    // Time recording system
    timeRecording: {
      enabled: true,
      recordDuration: 10.0, // Records 10 seconds of attacks
      recordWhat: ['projectiles', 'position', 'targets'],
      // Replay system
      replay: {
        enabled: true,
        ghostLayers: 5, // 5 simultaneous replays
        layerDelay: 0.3, // Seconds between each ghost layer
        damageMultiplier: 0.5, // Each ghost deals 50% damage
        ghostAlpha: [0.8, 0.6, 0.5, 0.4, 0.3], // Transparency per layer
        ghostColors: ['#00FFFF', '#33FFFF', '#66FFFF', '#99FFFF', '#CCFFFF'],
        // Replay triggers
        triggerMode: 'automatic', // or 'manual'
        replayInterval: 15.0, // Auto-replay every 15 seconds
      },
    },

    // Time freeze ultimate
    timeFreeze: {
      enabled: true,
      chargeRequired: 100, // Charge points needed
      chargePerHit: 2,
      chargePerKill: 10,
      // Freeze effect
      freeze: {
        duration: 3.0, // 3 seconds of frozen time
        affectsEnemies: true,
        affectsProjectiles: true, // Enemy projectiles freeze
        playerMovement: 'normal', // Player can move freely
        playerAttacks: 'enhanced', // Player attacks deal bonus damage
        frozenDamageBonus: 0.5, // +50% damage to frozen enemies
      },
      // Shatter effect when time resumes
      shatter: {
        enabled: true,
        damage: 30, // Per enemy
        baseOnHitsDuringFreeze: true, // Damage = 30 * hits during freeze
        maxHits: 20,
        shatterRadius: 60, // AoE around each shattered enemy
      },
    },

    // Temporal visual effects
    temporalVisual: {
      type: 'clock_projectile',
      clockFace: true,
      handsSpinning: true,
      timeRipples: true,
      afterimages: 3,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 25,
      intensity: 0.7,
      color: '#00FFFF',
      pulse: true,
      pulseSpeed: 1.5,
      clockPulse: true, // Pulses like a ticking clock
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'time_fragments',
      colors: ['#00FFFF', '#AAFFFF', '#FFFFFF'],
      count: 15,
      spread: 40,
      lifetime: 0.8,
      clockNumbers: true, // Floating clock numbers
      sandParticles: true, // Hourglass sand effect
    },

    // Screen effects
    screenEffects: {
      duringRecording: {
        border: { color: '#00FFFF', width: 2, pulse: true },
        recordIndicator: true,
      },
      onReplay: {
        distortion: { type: 'temporal_echo', intensity: 0.3 },
      },
      onTimeFreeze: {
        desaturate: { amount: 0.5 },
        vignette: { color: '#003333', intensity: 0.3 },
        clockOverlay: true,
        particleFreeze: true, // All particles freeze
      },
      onShatter: {
        flash: { color: '#00FFFF', intensity: 0.6, duration: 0.2 },
        shake: { intensity: 12, duration: 0.4 },
        glassShatter: true,
      },
    },

    // Sound effects
    sounds: {
      shoot: 'time_whoosh',
      replayStart: 'clock_rewind',
      timeFreeze: 'time_stop',
      shatter: 'glass_break',
    },

    upgrades: {
      2: { damage: 58, ghostLayers: 6, chargePerKill: 12, pierce: 3 },
      3: { damage: 72, recordDuration: 12.0, freeze: { duration: 3.5 }, cooldown: 0.45 },
      4: { damage: 90, damageMultiplier: 0.6, frozenDamageBonus: 0.7, projectileCount: 3 },
      5: { damage: 115, ghostLayers: 7, freeze: { duration: 4.0 }, shatter: { maxHits: 30 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
