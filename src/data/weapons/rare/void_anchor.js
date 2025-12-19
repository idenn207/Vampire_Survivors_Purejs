/**
 * @fileoverview Void Anchor - Rare mine that roots, pulls, explodes, and leaves a damaging rift
 * @module Data/Weapons/Rare/VoidAnchor
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.void_anchor = {
    id: 'void_anchor',
    name: 'Void Anchor',
    description: 'Chains enemies to the void. Roots, pulls, detonates, then leaves a devouring rift',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 1,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 55,
    cooldown: 6.0,
    range: 300,
    triggerRadius: 50,
    explosionRadius: 90,
    duration: 25.0,

    // Visual
    color: '#330066',
    secondaryColor: '#000000',
    icon: 'void_anchor',
    imageId: 'weapon_void_anchor',

    // Multi-phase anchor effect
    anchorPhases: {
      enabled: true,
      // Phase 1: Root - enemies that trigger are immobilized
      root: {
        enabled: true,
        duration: 1.5,
        rootRadius: 60,
        breakThreshold: 0, // Can't break free
      },
      // Phase 2: Pull - while rooted, pull more enemies
      pull: {
        enabled: true,
        pullRadius: 120,
        pullForce: 100,
        duration: 1.0, // Pull during this time
      },
      // Phase 3: Detonate - explosion
      detonate: {
        damage: 55,
        radius: 90,
        damageBonus: 0.1, // +10% per enemy caught
        maxBonus: 1.0, // Cap at +100%
      },
      // Phase 4: Rift - leaves damaging void rift
      rift: {
        enabled: true,
        duration: 4.0,
        radius: 60,
        damage: 12,
        tickRate: 0.4,
        slowEffect: 0.5,
        pullForce: 30, // Light continuous pull
      },
    },

    // Chain visual connecting rooted enemies
    chainVisual: {
      enabled: true,
      color: '#660099',
      thickness: 3,
      pulseEffect: true,
      toAnchor: true, // Chains from anchor to enemies
    },

    // Visual effects
    anchorVisual: {
      type: 'void_maw',
      teeth: true, // Void teeth appearance
      eyeEffect: true, // Central eye
      tentacles: 4, // Number of void tentacles
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 35,
      intensity: 0.7,
      color: '#660099',
      pulse: true,
      pulseSpeed: 2,
      darkAura: true, // Darkens surrounding area
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'void_tendrils',
      colors: ['#330066', '#660099', '#000000'],
      count: 15,
      spread: 70,
      lifetime: 1.0,
      reachOutward: true,
    },

    // Distortion effect
    distortion: {
      enabled: true,
      type: 'void_warp',
      radius: 80,
      intensity: 0.4,
      growDuringPull: true,
    },

    // Screen effects
    screenEffects: {
      onDetonate: {
        shake: { intensity: 6, duration: 0.25 },
        vignette: { color: '#330066', intensity: 0.3, duration: 0.2 },
      },
    },

    upgrades: {
      2: { damage: 70, rift: { duration: 5.0, damage: 16 }, pullRadius: 140 },
      3: { damage: 88, root: { duration: 2.0 }, cooldown: 5.5, explosionRadius: 100 },
      4: { damage: 110, rift: { radius: 75, pullForce: 45 }, damageBonus: 0.15 },
      5: { damage: 140, root: { duration: 2.5 }, rift: { duration: 6.0 }, pullRadius: 160 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
