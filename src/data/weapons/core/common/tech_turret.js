/**
 * @fileoverview Tech Turret - Tech Core starting weapon
 * @module Data/Weapons/Core/TechTurret
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.tech_turret = {
    id: 'tech_turret',
    name: 'Tech Turret',
    description: 'Rapid-fire projectiles that ricochet between multiple targets',
    coreId: 'tech_core',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 10,
    cooldown: 0.25,
    projectileCount: 2,
    projectileSpeed: 600,
    range: 350,
    pierce: 0,
    spread: 8,

    ricochet: {
      bounces: 2,
      damageDecay: 0.7,
      bounceRange: 100,
    },

    color: '#00CED1',
    size: 6,
    shape: 'square',
    lifetime: 2.0,
    icon: 'tech_turret',
    imageId: 'weapon_tech_turret',

    upgrades: {
      2: { damage: 13, ricochet: { bounces: 2, damageDecay: 0.75, bounceRange: 110 } },
      3: { damage: 16, projectileCount: 3, ricochet: { bounces: 3, damageDecay: 0.75, bounceRange: 120 } },
      4: { damage: 20, cooldown: 0.2, ricochet: { bounces: 3, damageDecay: 0.8, bounceRange: 130 } },
      5: { damage: 26, projectileCount: 4, ricochet: { bounces: 4, damageDecay: 0.8, bounceRange: 150 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
