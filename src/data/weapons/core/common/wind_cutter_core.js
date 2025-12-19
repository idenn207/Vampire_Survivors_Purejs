/**
 * @fileoverview Wind Cutter - Wind Core starting weapon (MANUAL)
 * @module Data/Weapons/Core/WindCutter
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  // Note: Uses wind_cutter_core id to avoid conflict with common wind_cutter weapon
  Data.CoreWeaponRegistry.wind_cutter_core = {
    id: 'wind_cutter_core',
    name: 'Wind Cutter',
    description: 'Slicing wind blades that knock back enemies and boost movement speed',
    coreId: 'wind_core',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.MOUSE,
    isAuto: false,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 22,
    cooldown: 0.7,
    projectileCount: 2,
    projectileSpeed: 500,
    range: 450,
    pierce: 2,
    spread: 15,

    knockback: 150,
    passiveSpeedBoost: 0.15,

    color: '#87CEEB',
    size: 8,
    shape: 'arc',
    lifetime: 2.0,
    icon: 'wind_cutter',
    imageId: 'weapon_wind_cutter',

    upgrades: {
      2: { damage: 28, knockback: 180, passiveSpeedBoost: 0.18 },
      3: { damage: 36, projectileCount: 3, pierce: 3 },
      4: { damage: 46, cooldown: 0.6, passiveSpeedBoost: 0.22, knockback: 220 },
      5: { damage: 60, projectileCount: 4, passiveSpeedBoost: 0.3, knockback: 280 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
