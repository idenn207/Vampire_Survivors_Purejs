/**
 * @fileoverview Mirrorblade - Rare melee with mirror images attacking from opposite sides
 * @module Data/Weapons/Rare/Mirrorblade
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.mirrorblade = {
    id: 'mirrorblade',
    name: 'Mirrorblade',
    description: 'Two mirror images swing from opposite directions, creating inescapable crossfire',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 38,
    cooldown: 0.85,
    range: 60,
    arcAngle: 100,
    swingDuration: 0.2,
    hitsPerSwing: 1,

    // Visual
    color: '#FFFFFF',
    secondaryColor: '#AADDFF',
    icon: 'mirror_blade',
    imageId: 'weapon_mirrorblade',

    // Mirror image system
    mirrorImages: {
      enabled: true,
      imageCount: 2, // 2 mirror images
      angleOffset: 180, // Degrees apart (opposite sides)
      damageMultiplier: 0.8, // Mirror images deal 80% damage
      visualAlpha: 0.6, // Mirror transparency
      colorShift: '#AADDFF', // Slight blue tint
      // Perfect sync bonus
      syncBonus: {
        enabled: true,
        bonusDamage: 0.3, // +30% if both mirrors hit same enemy
        bonusEffect: 'stagger', // Special stagger on sync hit
        staggerDuration: 0.4,
      },
    },

    // Visual effects
    swingEffect: {
      type: 'reflective_arc',
      trailColor: '#FFFFFF',
      trailAlpha: 0.7,
      shimmerEffect: true,
      reflectionParticles: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 18,
      intensity: 0.55,
      color: '#AADDFF',
      pulse: true,
      pulseSpeed: 2,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'glass_shards',
      colors: ['#FFFFFF', '#CCDDFF', '#AABBFF'],
      count: 8,
      spread: 30,
      lifetime: 0.5,
    },

    // Mirror shatter visual on kill
    onKillEffect: {
      type: 'shatter_flash',
      radius: 40,
      shardCount: 12,
      duration: 0.3,
    },

    upgrades: {
      2: { damage: 48, damageMultiplier: 0.85, arcAngle: 120 },
      3: { damage: 60, imageCount: 3, angleOffset: 120, cooldown: 0.75 },
      4: { damage: 75, syncBonus: { bonusDamage: 0.4 }, range: 70 },
      5: { damage: 95, imageCount: 4, damageMultiplier: 0.9, angleOffset: 90 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
