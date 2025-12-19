/**
 * @fileoverview Cascade Lightning - Rare particle with damage that INCREASES per jump
 * @module Data/Weapons/Rare/CascadeLightning
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.cascade_lightning = {
    id: 'cascade_lightning',
    name: 'Cascade Lightning',
    description: 'Lightning that grows stronger with each jump. Can branch into multiple devastating arcs',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.CHAIN,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 25, // Starting damage
    cooldown: 1.2,
    chainCount: 6,
    chainRange: 150,
    particleCount: 1, // Lightning bolts fired

    // Visual
    color: '#FFFFFF',
    secondaryColor: '#FFFF00',
    icon: 'cascade_lightning',
    imageId: 'weapon_cascade_lightning',

    // Cascade mechanic - damage INCREASES per jump
    cascade: {
      enabled: true,
      damageGrowth: 0.25, // +25% damage per jump (opposite of normal decay)
      maxGrowth: 3.0, // Cap at 3x original damage
      // Chain branching
      branching: {
        enabled: true,
        branchChance: 0.3, // 30% chance to branch at each jump
        maxBranches: 2, // Max simultaneous branches
        branchDamageMultiplier: 0.7, // Branches deal 70% damage
      },
      // Status effect stacking
      stunStack: {
        enabled: true,
        stunPerHit: 0.15, // Stun duration per hit
        maxStun: 1.0, // Max stun duration
      },
    },

    // Status effect
    statusEffect: {
      type: 'stun',
      duration: 0.2,
      stackable: true,
    },

    // Visual effects
    lightningVisual: {
      type: 'branching_arc',
      segmentCount: 8,
      jaggedness: 0.4,
      thickness: 3,
      thicknessGrowth: 0.5, // Gets thicker with damage growth
      glowIntensity: 0.8,
      forkVisual: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.7,
      color: '#FFFF66',
      pulse: false,
      flashOnHit: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'electric_sparks',
      colors: ['#FFFFFF', '#FFFF00', '#AAFFFF'],
      count: 8,
      spread: 30,
      lifetime: 0.25,
      onEachHit: true,
    },

    // Screen effects
    screenEffects: {
      onMaxChain: {
        flash: { color: '#FFFFFF', intensity: 0.3, duration: 0.1 },
        shake: { intensity: 4, duration: 0.15 },
      },
    },

    // Sound escalation
    sounds: {
      escalating: true, // Sound gets louder/more intense with chain
      baseSound: 'zap',
      maxSound: 'thunder_boom',
    },

    upgrades: {
      2: { damage: 32, chainCount: 7, damageGrowth: 0.3, cooldown: 1.1 },
      3: { damage: 40, branchChance: 0.4, maxBranches: 3, chainRange: 170 },
      4: { damage: 50, chainCount: 8, maxGrowth: 3.5, stunPerHit: 0.2 },
      5: { damage: 65, particleCount: 2, branchChance: 0.5, chainCount: 10 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
