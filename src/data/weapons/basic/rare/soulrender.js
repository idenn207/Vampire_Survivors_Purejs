/**
 * @fileoverview Soulrender - Rare melee that releases seeking souls on kill and marks enemies
 * @module Data/Weapons/Rare/Soulrender
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.soulrender = {
    id: 'soulrender',
    name: 'Soulrender',
    description: 'Rends souls from slain enemies. Captured souls seek new victims with vengeance',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 48,
    cooldown: 0.9,
    range: 65,
    arcAngle: 130,
    swingDuration: 0.2,
    hitsPerSwing: 1,

    // Visual
    color: '#00FFAA',
    secondaryColor: '#66FFCC',
    icon: 'soul_blade',
    imageId: 'weapon_soulrender',

    // Mark enemies on hit
    statusEffect: {
      type: 'mark',
      damageMultiplier: 1.15, // Marked enemies take 15% more damage
      duration: 5.0,
      stackable: true,
      maxStacks: 3,
    },

    // Soul release on kill
    soulRelease: {
      enabled: true,
      soulsPerKill: 1,
      soulDamage: 25,
      soulSpeed: 250,
      soulLifetime: 4.0,
      soulHoming: true,
      soulHomingStrength: 5,
      soulPierce: 0, // Dies on hit
      // Soul chain reaction
      chainOnKill: {
        enabled: true,
        chance: 0.3, // 30% chance killed enemy also releases soul
        chainDepth: 2, // Can chain up to 2 times
      },
      // Soul appearance
      soulVisual: {
        color: '#00FFAA',
        size: 8,
        trailEnabled: true,
        trailLength: 15,
        ghostEffect: true,
      },
    },

    // Soul collector bonus
    soulCollector: {
      enabled: true,
      soulsToBonus: 10, // Every 10 souls collected
      bonusDamage: 5, // +5 damage
      maxBonusStacks: 10, // Cap at +50 damage
    },

    // Visual effects
    swingEffect: {
      type: 'ethereal_slash',
      trailColor: '#00FFAA',
      trailAlpha: 0.75,
      ghostTrail: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 16,
      intensity: 0.6,
      color: '#66FFCC',
      pulse: true,
      pulseSpeed: 2.5,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'soul_wisps',
      colors: ['#00FFAA', '#66FFCC', '#AAFFEE'],
      count: 6,
      spread: 35,
      lifetime: 0.8,
      floatUp: true,
    },

    upgrades: {
      2: { damage: 60, soulDamage: 32, soulsPerKill: 2, markDuration: 6.0 },
      3: { damage: 75, chainOnKill: { chance: 0.4 }, cooldown: 0.8, arcAngle: 150 },
      4: { damage: 95, soulPierce: 1, soulLifetime: 5.0, maxStacks: 4 },
      5: { damage: 120, soulsPerKill: 3, soulDamage: 45, chainDepth: 3 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
