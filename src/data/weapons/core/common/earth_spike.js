/**
 * @fileoverview Earth Spike - Earth Core starting weapon
 * @module Data/Weapons/Core/EarthSpike
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.earth_spike = {
    id: 'earth_spike',
    name: 'Earth Spike',
    description: 'Ground eruptions that deal area damage and stun nearby enemies',
    coreId: 'earth_core',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 35,
    cooldown: 1.6,
    radius: 80,
    duration: 0.3,
    tickRate: 10,
    cloudCount: 1,
    spawnRange: 200,

    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.8,
        duration: 1.0,
      },
    ],

    color: '#8B4513',
    icon: 'earth_spike',
    imageId: 'weapon_earth_spike',
    areaImageId: 'earth_spike_area',

    upgrades: {
      2: { damage: 46, radius: 95 },
      3: { damage: 60, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.9, duration: 1.2 }], cloudCount: 2 },
      4: { damage: 78, radius: 110, cooldown: 1.4 },
      5: { damage: 105, radius: 120, statusEffects: [{ type: StatusEffectType.STUN, chance: 1.0, duration: 1.5 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
