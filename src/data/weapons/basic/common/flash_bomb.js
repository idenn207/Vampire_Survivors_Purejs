/**
 * @fileoverview Flash Bomb - Common mine that stuns enemies
 * @module Data/Weapons/Common/FlashBomb
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.flash_bomb = {
    id: 'flash_bomb',
    name: 'Flash Bomb',
    description: 'A blinding explosive that stuns all enemies in its blast',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 25,
    cooldown: 4.0,
    range: 280,
    triggerRadius: 40,
    explosionRadius: 70,
    duration: 15.0,

    color: '#FFFFFF',
    visualScale: 1.2,
    icon: 'flash_bomb',
    imageId: 'weapon_flash_bomb',
    mineImageId: 'flash_bomb_mine',

    statusEffect: {
      type: 'stun',
      duration: 1.0,
    },

    mineVisual: {
      type: 'glowing_orb',
      pulse: true,
      pulseSpeed: 2,
    },

    particles: {
      enabled: true,
      type: 'light_burst',
      color: '#FFFFAA',
      count: 10,
      spread: 60,
      lifetime: 0.4,
    },

    glow: {
      enabled: true,
      radius: 40,
      intensity: 0.6,
      color: '#FFFFFF',
    },

    screenEffects: {
      onExplode: {
        flash: { color: '#FFFFFF', intensity: 0.4, duration: 0.15 },
      },
    },

    upgrades: {
      2: { damage: 33, statusEffect: { duration: 1.2 }, explosionRadius: 80 },
      3: { damage: 43, cooldown: 3.5, triggerRadius: 45 },
      4: { damage: 56, statusEffect: { duration: 1.5 }, explosionRadius: 90 },
      5: { damage: 73, statusEffect: { duration: 1.8 }, cooldown: 3.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
