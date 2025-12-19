/**
 * @fileoverview Void Emperor - Epic area that grows permanently with kills and spawns minions
 * @module Data/Weapons/Epic/VoidEmperor
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.void_emperor = {
    id: 'void_emperor',
    name: 'Void Emperor',
    description: 'A living void that follows you, growing larger with each soul consumed. Spawns void minions',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 1,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 25,
    cooldown: 0.0, // Continuous
    radius: 80, // Starting radius
    tickRate: 0.3,
    followPlayer: true,
    followSpeed: 180,

    // Visual
    color: '#000000',
    secondaryColor: '#330066',
    tertiaryColor: '#660099',
    icon: 'void_emperor',
    imageId: 'weapon_void_emperor',

    // Permanent growth system
    permanentGrowth: {
      enabled: true,
      // Radius growth
      radiusPerKill: 0.5, // +0.5 radius per kill
      maxRadius: 300, // Cap at 300 radius
      // Damage growth
      damagePerKill: 0.1, // +0.1 damage per kill
      maxDamageBonus: 50, // Cap at +50 damage
      // Visual growth thresholds
      growthStages: [
        { kills: 0, name: 'Void Seed', tentacles: 4, eyeCount: 1 },
        { kills: 50, name: 'Void Sprout', tentacles: 6, eyeCount: 2 },
        { kills: 150, name: 'Void Horror', tentacles: 8, eyeCount: 4 },
        { kills: 300, name: 'Void Titan', tentacles: 12, eyeCount: 6 },
        { kills: 500, name: 'Void Emperor', tentacles: 16, eyeCount: 9, crown: true },
      ],
    },

    // Void effects
    voidEffects: {
      // Constant pull effect
      gravitationalPull: {
        enabled: true,
        force: 40,
        radius: 150, // Pull radius extends beyond damage radius
      },
      // Damage over time
      voidCorrosion: {
        enabled: true,
        damagePercent: 0.02, // 2% of enemy max HP per tick
        applyWeakness: true,
        weaknessAmount: 1.2, // 20% more damage from all sources
      },
      // Fear effect
      terrorAura: {
        enabled: true,
        radius: 100,
        fleeChance: 0.1, // 10% chance enemies flee
        fleeDuration: 2.0,
      },
    },

    // Minion spawning
    voidMinions: {
      enabled: true,
      spawnInterval: 8.0, // Spawn every 8 seconds
      maxMinions: 4,
      // Minion types
      minionTypes: [
        {
          name: 'Void Tendril',
          health: 50,
          damage: 15,
          speed: 150,
          attackType: 'melee',
          behavior: 'aggressive',
        },
        {
          name: 'Void Eye',
          health: 30,
          damage: 20,
          speed: 100,
          attackType: 'projectile',
          behavior: 'ranged',
          projectileSpeed: 300,
        },
      ],
      // Minion growth with void
      minionScaling: {
        enabled: true,
        healthPerVoidGrowth: 0.01, // +1% minion health per void growth stage
        damagePerVoidGrowth: 0.01,
      },
    },

    // Void visual
    voidVisual: {
      type: 'eldritch_void',
      // Tentacles
      tentacles: {
        enabled: true,
        count: 4, // Grows with kills
        length: 60,
        wiggle: true,
        grabEnemies: true,
      },
      // Eyes
      eyes: {
        enabled: true,
        count: 1, // Grows with kills
        lookAtEnemies: true,
        blinkRandom: true,
        glowColor: '#FF0000',
      },
      // Void mass
      mass: {
        bubbling: true,
        distortion: true,
        starfieldInside: true,
      },
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 100,
      intensity: 0.6,
      color: '#330066',
      pulse: true,
      pulseSpeed: 1.5,
      invertedGlow: true, // Darkens instead of brightens
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'void_essence',
      colors: ['#000000', '#330066', '#660099', '#9933FF'],
      count: 30,
      spread: 100,
      lifetime: 1.2,
      spiralInward: true,
      eyeballsFloating: true,
    },

    // Distortion effect
    distortion: {
      enabled: true,
      type: 'reality_warp',
      radius: 120,
      intensity: 0.5,
      growWithSize: true,
    },

    // Screen effects
    screenEffects: {
      passive: {
        vignette: { color: '#000000', intensity: 0.15, growWithSize: true },
        desaturateNearVoid: true,
      },
      onGrowthStage: {
        flash: { color: '#660099', intensity: 0.4, duration: 0.3 },
        shake: { intensity: 8, duration: 0.4 },
        whispers: true, // Eldritch whisper sound
      },
    },

    upgrades: {
      2: { damage: 32, radiusPerKill: 0.6, maxMinions: 5, gravitationalPull: { force: 50 } },
      3: { damage: 40, damagePerKill: 0.15, spawnInterval: 7.0, tickRate: 0.25 },
      4: { damage: 50, maxRadius: 350, terrorAura: { fleeChance: 0.15 }, tentacles: { count: 6 } },
      5: { damage: 65, radiusPerKill: 0.8, maxMinions: 6, voidCorrosion: { damagePercent: 0.03 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
