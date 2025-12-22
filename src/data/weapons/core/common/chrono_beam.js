/**
 * @fileoverview Chrono Beam - Time Core starting weapon (MANUAL)
 * @module Data/Weapons/Core/ChronoBeam
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.chrono_beam = {
    id: 'chrono_beam',
    name: 'Chrono Beam',
    description: 'Time-warping laser that slows enemies and reduces cooldowns',
    coreId: 'time_core',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.MOUSE,
    isAuto: false,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 35,
    cooldown: 1.8,
    duration: 0.5,
    width: 10,
    range: 500,
    pierce: 999,
    tickRate: 6,

    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 1.0,
        duration: 2,
        speedModifier: 0.6,
      },
    ],

    passiveCDR: 0.15,

    passiveSlowAura: {
      radius: 150,
      slowPercent: 0.2,
    },

    color: '#DDA0DD',
    icon: 'chrono_beam',
    imageId: 'weapon_chrono_beam',
    laserImageId: 'chrono_beam_laser',

    upgrades: {
      2: { damage: 46, passiveCDR: 0.18 },
      3: { damage: 58, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 2.5, speedModifier: 0.55 }], passiveSlowAura: { radius: 175, slowPercent: 0.25 } },
      4: { damage: 74, cooldown: 1.5, passiveCDR: 0.22 },
      5: { damage: 95, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 3, speedModifier: 0.5 }], passiveCDR: 0.25, passiveSlowAura: { radius: 200, slowPercent: 0.35 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
