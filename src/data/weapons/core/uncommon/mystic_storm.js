/**
 * @fileoverview Mystic Storm - Arcane Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Arcane/MysticStorm
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.mystic_storm = {
    id: 'mystic_storm',
    name: 'Mystic Storm',

    // Evolution metadata
    coreId: 'arcane_core',
    baseWeaponId: 'arcane_barrage',
    evolutionChain: 'arcane',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 16,
    cooldown: 0.32,
    projectileCount: 4,
    projectileSpeed: 550,
    range: 420,
    pierce: 1,
    spread: 360,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.ARCANE_MARK,
        chance: 0.25,
        duration: 4,
        bonusDamage: 0.15,
      },
    ],

    // T2 Special Ability: Magic Missile
    specialAbility: {
      name: 'Magic Missile',
      description: 'Projectiles home slightly towards enemies',
      magicMissile: {
        enabled: true,
        homingStrength: 0.3,
        homingRange: 100,
      },
    },

    // Visual properties
    color: '#9932CC',
    size: 8,
    shape: 'diamond',
    lifetime: 2.5,
    icon: 'mystic_storm',
    imageId: 'weapon_mystic_storm',
    projectileImageId: 'mystic_storm_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 20, projectileCount: 5, statusEffects: [{ type: StatusEffectType.ARCANE_MARK, chance: 0.3, duration: 4.5, bonusDamage: 0.18 }] },
      3: { damage: 25, pierce: 2, specialAbility: { magicMissile: { homingStrength: 0.4, homingRange: 120 } } },
      4: { damage: 31, projectileCount: 6, cooldown: 0.28 },
      5: { damage: 39, statusEffects: [{ type: StatusEffectType.ARCANE_MARK, chance: 0.4, duration: 5, bonusDamage: 0.25 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
