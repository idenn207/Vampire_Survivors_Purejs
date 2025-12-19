/**
 * @fileoverview Phoenix Guardian - Rare summon with fire aura, fireballs, and rebirth mechanic
 * @module Data/Weapons/Rare/PhoenixGuardian
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.phoenix_guardian = {
    id: 'phoenix_guardian',
    name: 'Phoenix Guardian',
    description: 'A majestic phoenix companion. Burns enemies with its aura and is reborn in cleansing fire',
    attackType: AttackType.SUMMON,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 1,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 35, // Fireball damage
    cooldown: 0.0, // Continuous summon
    summonCount: 1,
    summonDuration: 0, // Permanent until killed

    // Visual
    color: '#FF6600',
    secondaryColor: '#FFCC00',
    icon: 'phoenix',
    imageId: 'weapon_phoenix_guardian',

    // Phoenix summon stats
    summonStats: {
      health: 150,
      speed: 180,
      size: 30,
      followDistance: 100, // Distance from player
      orbitPlayer: true,
      orbitSpeed: 0.5,
    },

    // Phoenix abilities
    phoenixAbilities: {
      // Passive fire aura
      fireAura: {
        enabled: true,
        radius: 80,
        damage: 8,
        tickRate: 0.4,
        burnChance: 0.5,
        burnDamage: 4,
        burnDuration: 2.0,
      },
      // Active fireball attack
      fireball: {
        enabled: true,
        damage: 35,
        cooldown: 1.2,
        projectileSpeed: 350,
        projectileSize: 10,
        pierce: 1,
        statusEffect: { type: 'burn', damage: 6, duration: 2.5, tickRate: 0.5 },
      },
      // Dive attack on low health enemies
      diveAttack: {
        enabled: true,
        triggerHealthPercent: 0.2, // When enemy below 20% HP
        damage: 60,
        cooldown: 4.0,
        speed: 600,
      },
    },

    // Rebirth mechanic
    rebirth: {
      enabled: true,
      lives: 2, // Can be reborn twice
      rebirthDelay: 1.5,
      // Rebirth explosion
      explosion: {
        damage: 100,
        radius: 120,
        knockback: 150,
        burnDamage: 10,
        burnDuration: 3.0,
      },
      // Rebirth buffs
      rebirthBuffs: {
        damageBonus: 0.2, // +20% damage per rebirth
        speedBonus: 0.15, // +15% speed per rebirth
        auraRadiusBonus: 20, // +20 aura radius per rebirth
      },
      // Visual during rebirth
      rebirthVisual: {
        eggPhase: true,
        eggDuration: 1.0,
        burstParticles: 40,
        phoenixScream: true,
      },
    },

    // Phoenix visual
    phoenixVisual: {
      type: 'flaming_bird',
      wingSpan: 50,
      tailLength: 40,
      flameTrail: true,
      trailColors: ['#FF6600', '#FFAA00', '#FFCC00'],
      glowRadius: 40,
      glowIntensity: 0.6,
      wingFlap: {
        enabled: true,
        speed: 4, // Flaps per second
      },
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 50,
      intensity: 0.7,
      color: '#FF8800',
      pulse: true,
      pulseSpeed: 2,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'phoenix_flames',
      colors: ['#FF6600', '#FFAA00', '#FFCC00', '#FFFFFF'],
      count: 20,
      spread: 60,
      lifetime: 0.8,
      riseUp: true,
    },

    // Screen effects
    screenEffects: {
      onRebirth: {
        flash: { color: '#FF6600', intensity: 0.5, duration: 0.2 },
        shake: { intensity: 8, duration: 0.35 },
      },
    },

    upgrades: {
      2: { damage: 45, fireAura: { damage: 11, radius: 95 }, lives: 3 },
      3: { damage: 58, fireball: { pierce: 2, cooldown: 1.0 }, summonStats: { health: 200 } },
      4: { damage: 72, explosion: { damage: 130, radius: 140 }, rebirthBuffs: { damageBonus: 0.25 } },
      5: { damage: 90, lives: 4, fireAura: { radius: 110, damage: 15 }, diveAttack: { damage: 85 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
