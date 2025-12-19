/**
 * @fileoverview Auto Sentinel - Tech Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Tech/AutoSentinel
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.auto_sentinel = {
    id: 'auto_sentinel',
    name: 'Auto Sentinel',

    // Evolution metadata
    coreId: 'tech_core',
    baseWeaponId: 'tech_turret',
    evolutionChain: 'tech',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 15,
    cooldown: 0.26,
    projectileCount: 1,
    projectileSpeed: 620,
    range: 390,
    pierce: 0,
    turretCount: 2,

    // T2 Special Ability: Tracking Rounds
    specialAbility: {
      name: 'Tracking Rounds',
      description: 'Projectiles slightly home towards enemies',
      trackingRounds: {
        enabled: true,
        homingStrength: 0.25,
        homingRange: 80,
      },
    },

    // Visual properties
    color: '#00FF00',
    size: 6,
    shape: 'circle',
    lifetime: 2.0,
    icon: 'auto_sentinel',
    imageId: 'weapon_auto_sentinel',

    // Level upgrades
    upgrades: {
      2: { damage: 19, turretCount: 2 },
      3: { damage: 24, specialAbility: { trackingRounds: { homingStrength: 0.35, homingRange: 100 } } },
      4: { damage: 30, cooldown: 0.22, turretCount: 3 },
      5: { damage: 37, pierce: 1, projectileSpeed: 700 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
