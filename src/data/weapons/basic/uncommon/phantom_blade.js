/**
 * @fileoverview Phantom Blade - Uncommon melee with afterimage echoes
 * @module Data/Weapons/Uncommon/PhantomBlade
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.phantom_blade = {
    id: 'phantom_blade',
    name: 'Phantom Blade',
    description: 'A ghostly sword that creates 2 afterimage swings at 50% damage',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 28,
    cooldown: 1.0,
    range: 85,
    arc: 120,
    knockback: 80,

    color: '#6688FF',
    visualScale: 1.2,
    icon: 'phantom_blade',
    imageId: 'weapon_phantom_blade',
    meleeImageId: 'phantom_blade_melee',

    echo: {
      enabled: true,
      count: 2,
      delay: 0.15,
      damageMultiplier: 0.5,
      fadePerEcho: 0.3,
    },

    swingVisual: {
      type: 'phantom',
      width: 12,
      length: 85,
      transparency: 0.7,
      ghostColor: '#88AAFF',
    },

    trail: {
      enabled: true,
      type: 'ghost',
      color: '#6688FF',
      length: 40,
      width: 15,
      fade: true,
      ghostEffect: true,
    },

    particles: {
      enabled: true,
      type: 'spirit_wisps',
      color: '#AACCFF',
      count: 5,
      spread: 25,
      lifetime: 0.35,
    },

    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.4,
      color: '#6688FF',
    },

    upgrades: {
      2: { damage: 37, echo: { count: 3, damageMultiplier: 0.55 } },
      3: { damage: 48, cooldown: 0.9, range: 95 },
      4: { damage: 63, echo: { count: 4, damageMultiplier: 0.6 } },
      5: { damage: 82, cooldown: 0.8, arc: 140 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
