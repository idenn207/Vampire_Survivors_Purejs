/**
 * @fileoverview Siege Platform - Tech Core T3 Evolution (Rare)
 * @module Data/Weapons/CoreEvolved/Tech/SiegePlatform
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.siege_platform = {
    id: 'siege_platform',
    name: 'Siege Platform',

    // Evolution metadata
    coreId: 'tech_core',
    baseWeaponId: 'tech_turret',
    evolutionChain: 'tech',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 18,
    cooldown: 0.24,
    projectileCount: 1,
    projectileSpeed: 680,
    range: 420,
    pierce: 1,
    turretCount: 3,

    // T3 Special Ability: Rocket Barrage
    specialAbility: {
      name: 'Rocket Barrage',
      description: 'Periodically fires explosive rockets',
      rocketBarrage: {
        enabled: true,
        interval: 4,
        rocketCount: 2,
        rocketDamage: 35,
        explosionRadius: 60,
      },
      // Keeps tracking rounds from T2
      trackingRounds: {
        enabled: true,
        homingStrength: 0.35,
        homingRange: 100,
      },
    },

    // Visual properties
    color: '#32CD32',
    size: 7,
    shape: 'circle',
    lifetime: 2.0,
    icon: 'siege_platform',
    imageId: 'weapon_siege_platform',

    // Level upgrades
    upgrades: {
      2: { damage: 23, turretCount: 3 },
      3: { damage: 28, specialAbility: { rocketBarrage: { rocketCount: 3, rocketDamage: 50 } } },
      4: { damage: 36, cooldown: 0.2, turretCount: 4 },
      5: { damage: 44, pierce: 2, specialAbility: { rocketBarrage: { interval: 3, rocketCount: 4, explosionRadius: 80 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
