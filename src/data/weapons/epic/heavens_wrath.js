/**
 * @fileoverview Heaven's Wrath - Epic chain with no decay, branching, and divine ultimate
 * @module Data/Weapons/Epic/HeavensWrath
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.heavens_wrath = {
    id: 'heavens_wrath',
    name: "Heaven's Wrath",
    description: 'Divine lightning with NO damage decay. Chains split and branch. 100 kills = Divine Judgment',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.CHAIN,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 1,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 55,
    cooldown: 1.0,
    chainCount: 8, // Chains to 8 enemies
    chainRange: 180,
    particleCount: 1,

    // Visual
    color: '#FFFFFF',
    secondaryColor: '#FFFFAA',
    tertiaryColor: '#FFFF00',
    icon: 'divine_lightning',
    imageId: 'weapon_heavens_wrath',

    // NO damage decay - unique property
    chainBehavior: {
      damageDecay: 0, // NO DECAY - full damage on every chain
      // Chain branching
      branching: {
        enabled: true,
        branchChance: 0.4, // 40% chance to branch
        maxBranches: 3, // Can split into 3 separate chains
        branchesCanBranch: true, // Branches can branch again
        maxDepth: 3, // Maximum branching depth
      },
      // Smite effect on final target
      smite: {
        enabled: true,
        damageBonus: 0.5, // +50% damage on final target
        stunDuration: 0.8,
        holyGroundEffect: true, // Leaves holy ground
      },
    },

    // Divine stacking
    divineStacking: {
      enabled: true,
      stacksPerHit: 1,
      maxStacks: 100,
      // Stack bonuses
      bonusPerStack: {
        damage: 0.5, // +0.5 damage per stack
        chainRange: 1, // +1 range per stack
      },
      // Visual escalation
      stackVisuals: [
        { stacks: 0, wingSize: 0, haloIntensity: 0 },
        { stacks: 25, wingSize: 20, haloIntensity: 0.3 },
        { stacks: 50, wingSize: 40, haloIntensity: 0.5 },
        { stacks: 75, wingSize: 60, haloIntensity: 0.7 },
        { stacks: 100, wingSize: 80, haloIntensity: 1.0, angelicForm: true },
      ],
    },

    // Divine Judgment ultimate
    divineJudgment: {
      enabled: true,
      killsRequired: 100,
      resetOnTrigger: true,
      // Ultimate effects
      effect: {
        invulnerability: {
          duration: 10.0,
          visualEffect: 'golden_shield',
        },
        damageMultiplier: 5.0, // 5x damage for duration
        chainCountBonus: 10, // +10 chains
        // Heavenly strike
        heavenlyStrike: {
          enabled: true,
          strikeCount: 7, // 7 massive lightning strikes
          strikeInterval: 0.5,
          strikeDamage: 150,
          strikeRadius: 100,
        },
        // Healing aura
        healingAura: {
          enabled: true,
          healPerSecond: 20,
          radius: 200,
        },
      },
      // Animation
      animation: {
        duration: 2.0,
        sequence: [
          { time: 0, effect: 'heaven_opens', lightBeam: true },
          { time: 0.5, effect: 'angel_wings_appear' },
          { time: 1.0, effect: 'halo_form', intensity: 1.0 },
          { time: 1.5, effect: 'divine_power_surge' },
          { time: 2.0, effect: 'judgment_begins' },
        ],
      },
    },

    // Holy ground effect
    holyGround: {
      enabled: true,
      createOnSmite: true,
      radius: 50,
      duration: 5.0,
      damageToEnemies: 15, // DoT to enemies
      healToPlayer: 3, // Heal when player stands on it
      slowEnemies: 0.5,
    },

    // Divine visual
    divineVisual: {
      type: 'holy_lightning',
      brilliance: true,
      angelicParticles: true,
      // Player enhancements
      playerWings: { enabled: true, growWithStacks: true },
      playerHalo: { enabled: true, growWithStacks: true },
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 40,
      intensity: 0.8,
      color: '#FFFFAA',
      pulse: true,
      pulseSpeed: 2,
      divine: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'holy_light',
      colors: ['#FFFFFF', '#FFFFAA', '#FFFF00', '#FFCC00'],
      count: 25,
      spread: 80,
      lifetime: 1.0,
      riseUp: true,
      feathers: true,
    },

    // Screen effects
    screenEffects: {
      passive: {
        lightRays: { enabled: true, intensity: 0.1, fromAbove: true },
      },
      onChain: {
        flash: { color: '#FFFFFF', intensity: 0.2, duration: 0.05 },
      },
      onDivineJudgment: {
        whiteOut: { duration: 0.5 },
        shake: { intensity: 12, duration: 2.0 },
        slowMotion: { factor: 0.3, duration: 1.0 },
        choirSound: true,
      },
    },

    upgrades: {
      2: { damage: 70, branchChance: 0.5, chainCount: 10, smite: { damageBonus: 0.6 } },
      3: { damage: 88, maxBranches: 4, killsRequired: 90, cooldown: 0.9 },
      4: { damage: 110, heavenlyStrike: { strikeDamage: 200 }, invulnerability: { duration: 12.0 } },
      5: { damage: 140, chainCount: 12, damageMultiplier: 6.0, killsRequired: 80 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
