/**
 * @fileoverview Battle Axe - Common melee with wide 180 degree double swing
 * @module Data/Weapons/Common/BattleAxe
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.battle_axe = {
    id: 'battle_axe',
    name: 'Battle Axe',
    description: 'A powerful axe with a wide 180-degree swing that hits twice',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 32,
    cooldown: 1.2,
    range: 60,
    arcAngle: 180,
    swingDuration: 0.28,
    hitsPerSwing: 2,

    color: '#666666',
    visualScale: 1.2,
    icon: 'axe',
    imageId: 'weapon_battle_axe',
    meleeImageId: 'battle_axe_melee',

    swingEffect: {
      type: 'heavy_arc',
      color: '#888888',
      alpha: 0.7,
    },

    particles: {
      enabled: true,
      type: 'metal_sparks',
      color: '#AAAAAA',
      count: 5,
      spread: 35,
      lifetime: 0.35,
    },

    upgrades: {
      2: { damage: 42, arcAngle: 200, cooldown: 1.1 },
      3: { damage: 55, range: 68, hitsPerSwing: 3 },
      4: { damage: 72, arcAngle: 220, cooldown: 1.0 },
      5: { damage: 94, range: 75, hitsPerSwing: 4 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
