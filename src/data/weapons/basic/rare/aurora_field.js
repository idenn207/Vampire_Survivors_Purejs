/**
 * @fileoverview Aurora Field - Rare area that follows player and cycles through 4 elemental effects
 * @module Data/Weapons/Rare/AuroraField
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.aurora_field = {
    id: 'aurora_field',
    name: 'Aurora Field',
    description: 'A mesmerizing aurora surrounds you, cycling through fire, ice, lightning, and nature',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.ROTATING, // Cycles effects
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 18,
    cooldown: 0.0, // Continuous aura
    radius: 100,
    tickRate: 0.4,
    duration: 0, // Permanent while equipped
    followPlayer: true,

    // Visual
    color: '#FF66AA', // Base color, changes with cycle
    icon: 'aurora',
    imageId: 'weapon_aurora_field',
    areaImageId: 'aurora_field_area',

    // Element cycling system
    elementCycle: {
      enabled: true,
      cycleTime: 4.0, // Seconds per element
      elements: [
        {
          name: 'Fire',
          color: '#FF4400',
          secondaryColor: '#FFAA00',
          damage: 22,
          statusEffect: { type: 'burn', damage: 6, duration: 2.0, tickRate: 0.5 },
          particles: { type: 'flames', count: 12 },
        },
        {
          name: 'Ice',
          color: '#00DDFF',
          secondaryColor: '#AAFFFF',
          damage: 15,
          statusEffect: { type: 'slow', speedModifier: 0.5, duration: 2.0 },
          particles: { type: 'snowflakes', count: 15 },
        },
        {
          name: 'Lightning',
          color: '#FFFF00',
          secondaryColor: '#FFFFFF',
          damage: 25,
          statusEffect: { type: 'stun', duration: 0.3, chance: 0.2 },
          particles: { type: 'sparks', count: 10 },
        },
        {
          name: 'Nature',
          color: '#00FF66',
          secondaryColor: '#88FF88',
          damage: 12,
          healing: 2, // Heals player per tick
          statusEffect: { type: 'poison', damage: 4, duration: 3.0, stackable: true },
          particles: { type: 'leaves', count: 8 },
        },
      ],
      // Transition effect between elements
      transitionEffect: {
        duration: 0.5,
        fadeOut: true,
        flashOnSwitch: true,
      },
    },

    // Visual effects
    auraVisual: {
      type: 'aurora_wave',
      layerCount: 3,
      waveSpeed: 1.5,
      alphaOscillate: true,
      innerGlow: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 120,
      intensity: 0.4,
      pulse: true,
      pulseSpeed: 2,
      colorFollowsElement: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'aurora_ribbons',
      count: 20,
      spread: 100,
      lifetime: 1.2,
      followElement: true,
    },

    upgrades: {
      2: { damage: 24, radius: 120, Fire: { damage: 28 }, Lightning: { damage: 32 } },
      3: { damage: 30, cycleTime: 3.5, tickRate: 0.35, Nature: { healing: 3 } },
      4: { damage: 38, radius: 140, Ice: { statusEffect: { speedModifier: 0.4 } } },
      5: { damage: 48, radius: 160, cycleTime: 3.0, all: { damageBonus: 1.2 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
