/**
 * @fileoverview Omega Protocol - Tech Core T5 Evolution (Legendary)
 * @module Data/Weapons/CoreEvolved/Tech/OmegaProtocol
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.omega_protocol = {
    id: 'omega_protocol',
    name: 'Omega Protocol',

    // Evolution metadata
    coreId: 'tech_core',
    baseWeaponId: 'tech_turret',
    evolutionChain: 'tech',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 28,
    cooldown: 0.2,
    projectileCount: 3,
    projectileSpeed: 780,
    range: 500,
    pierce: 3,
    turretCount: 5,

    // T5 Special Ability: Defense Matrix
    specialAbility: {
      name: 'Defense Matrix',
      description: 'Creates a protective field and orbital drones',
      defenseMatrix: {
        enabled: true,
        shieldRadius: 120,
        shieldDamageReduction: 0.2,
        droneCount: 3,
        droneDamage: 15,
        droneFireRate: 1.5,
      },
      // Enhanced laser lock from T4
      laserLock: {
        enabled: true,
        markChance: 0.45,
        markDuration: 5,
        bonusDamage: 0.5,
      },
      // Enhanced rocket barrage from T3
      rocketBarrage: {
        enabled: true,
        interval: 3,
        rocketCount: 5,
        rocketDamage: 90,
        explosionRadius: 100,
      },
      // Enhanced tracking rounds from T2
      trackingRounds: {
        enabled: true,
        homingStrength: 0.55,
        homingRange: 150,
      },
    },

    // Visual properties
    color: '#ADFF2F',
    size: 9,
    shape: 'circle',
    lifetime: 3.0,
    icon: 'omega_protocol',
    imageId: 'weapon_omega_protocol',

    // Level upgrades
    upgrades: {
      2: { damage: 35, turretCount: 5 },
      3: { damage: 44, specialAbility: { defenseMatrix: { shieldDamageReduction: 0.25, droneCount: 4, droneDamage: 22 } } },
      4: { damage: 55, cooldown: 0.16, turretCount: 6 },
      5: { damage: 69, pierce: 4, specialAbility: { defenseMatrix: { shieldDamageReduction: 0.35, droneCount: 5, droneDamage: 35, droneFireRate: 1.0 }, rocketBarrage: { interval: 2, rocketCount: 7, rocketDamage: 130, explosionRadius: 130 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
