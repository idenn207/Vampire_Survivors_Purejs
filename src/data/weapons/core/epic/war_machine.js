/**
 * @fileoverview War Machine - Tech Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Tech/WarMachine
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.war_machine = {
    id: 'war_machine',
    name: 'War Machine',

    // Evolution metadata
    coreId: 'tech_core',
    baseWeaponId: 'tech_turret',
    evolutionChain: 'tech',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 23,
    cooldown: 0.22,
    projectileCount: 2,
    projectileSpeed: 720,
    range: 460,
    pierce: 2,
    turretCount: 4,

    // T4 Special Ability: Laser Lock
    specialAbility: {
      name: 'Laser Lock',
      description: 'Marks enemies for increased damage',
      laserLock: {
        enabled: true,
        markChance: 0.3,
        markDuration: 4,
        bonusDamage: 0.35,
      },
      // Keeps rocket barrage from T3
      rocketBarrage: {
        enabled: true,
        interval: 3.5,
        rocketCount: 3,
        rocketDamage: 55,
        explosionRadius: 75,
      },
      // Keeps tracking rounds from T2
      trackingRounds: {
        enabled: true,
        homingStrength: 0.45,
        homingRange: 120,
      },
    },

    // Visual properties
    color: '#7CFC00',
    size: 8,
    shape: 'circle',
    lifetime: 2.5,
    icon: 'war_machine',
    imageId: 'weapon_war_machine',

    // Level upgrades
    upgrades: {
      2: { damage: 28, turretCount: 4 },
      3: { damage: 36, specialAbility: { laserLock: { markChance: 0.4, bonusDamage: 0.45 } } },
      4: { damage: 44, cooldown: 0.18, turretCount: 5 },
      5: { damage: 55, pierce: 3, specialAbility: { rocketBarrage: { interval: 3, rocketCount: 5, rocketDamage: 80, explosionRadius: 100 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
