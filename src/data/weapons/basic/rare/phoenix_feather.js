/**
 * @fileoverview Phoenix Feather - Rare projectile that can respawn and spreads fire on death
 * @module Data/Weapons/Rare/PhoenixFeather
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.phoenix_feather = {
    id: 'phoenix_feather',
    name: 'Phoenix Feather',
    description: 'A mystical feather that can respawn twice, spreading cleansing fire upon each death',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 40,
    cooldown: 1.8,
    projectileCount: 1,
    projectileSpeed: 380,
    range: 450,
    pierce: 2,
    spread: 0,

    // Visual
    color: '#FF6600',
    secondaryColor: '#FFCC00',
    size: 12,
    shape: 'feather',
    lifetime: 4.0,
    icon: 'phoenix_feather',
    imageId: 'weapon_phoenix_feather',
    projectileImageId: 'phoenix_feather_projectile',

    // Status effect
    statusEffect: {
      type: 'burn',
      damage: 6,
      duration: 3.0,
      tickRate: 0.5,
    },

    // Phoenix respawn behavior
    phoenix: {
      enabled: true,
      respawnCount: 2, // Can respawn 2 times
      respawnDelay: 0.3, // Brief delay before respawn
      respawnDamageBonus: 0.15, // +15% damage per respawn
      deathExplosion: {
        enabled: true,
        radius: 60,
        damage: 25,
        burnDuration: 2.0,
      },
      fireTrail: {
        enabled: true,
        width: 20,
        damage: 8,
        duration: 2.5,
      },
    },

    // Trail effect - fire particles
    trail: {
      enabled: true,
      type: 'fire',
      colors: ['#FF6600', '#FFAA00', '#FFCC33'],
      length: 20,
      fade: 0.7,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 18,
      intensity: 0.7,
      color: '#FF9933',
      pulse: true,
      pulseSpeed: 3,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'embers',
      colors: ['#FF6600', '#FFAA00', '#FFCC00'],
      count: 8,
      spread: 15,
      lifetime: 0.6,
    },

    upgrades: {
      2: { damage: 52, deathExplosion: { damage: 35 }, pierce: 3 },
      3: { damage: 65, respawnCount: 3, fireTrail: { damage: 12 }, cooldown: 1.6 },
      4: { damage: 82, deathExplosion: { radius: 80, damage: 45 }, respawnDamageBonus: 0.2 },
      5: { damage: 105, projectileCount: 2, pierce: 4, respawnCount: 4 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
