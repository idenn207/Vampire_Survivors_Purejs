/**
 * @fileoverview Dragonbreath Volley - Rare projectile with heat buildup mechanic
 * @module Data/Weapons/Rare/DragonbreathVolley
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.dragonbreath_volley = {
    id: 'dragonbreath_volley',
    name: 'Dragonbreath Volley',
    description: 'Builds heat with each shot. Overcharge unleashes a devastating 2x damage burst',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.MOUSE,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 28,
    cooldown: 0.4,
    projectileCount: 3, // Cone of fire
    projectileSpeed: 450,
    range: 350,
    pierce: 1,
    spread: 25, // Cone angle

    // Visual
    color: '#FF4400',
    secondaryColor: '#FFAA00',
    size: 8,
    shape: 'flame',
    lifetime: 2.0,
    icon: 'dragon_fire',
    imageId: 'weapon_dragonbreath_volley',
    projectileImageId: 'dragonbreath_volley_projectile',

    // Status effect
    statusEffect: {
      type: 'burn',
      damage: 5,
      duration: 2.0,
      tickRate: 0.5,
    },

    // Heat buildup mechanic
    heatSystem: {
      enabled: true,
      maxHeat: 100,
      heatPerShot: 12,
      heatDecayRate: 8, // Heat lost per second when not firing
      heatDecayDelay: 0.8, // Seconds before decay starts
      // Visual escalation based on heat
      heatLevels: [
        { threshold: 0, color: '#FF4400', sizeBonus: 0, damageBonus: 0 },
        { threshold: 30, color: '#FF6600', sizeBonus: 2, damageBonus: 0.1 },
        { threshold: 60, color: '#FF8800', sizeBonus: 4, damageBonus: 0.25 },
        { threshold: 85, color: '#FFAA00', sizeBonus: 6, damageBonus: 0.5 },
      ],
      // Overcharge at max heat
      overcharge: {
        triggerAtHeat: 100,
        damageMultiplier: 2.0,
        projectileCount: 8,
        spreadAngle: 60,
        burstRadius: 80,
        cooldownAfter: 1.5,
        resetHeatAfter: true,
      },
    },

    // Trail effect
    trail: {
      enabled: true,
      type: 'fire_breath',
      colors: ['#FF4400', '#FF6600', '#FF8800'],
      length: 25,
      fade: 0.8,
      scaleWithHeat: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 12,
      intensity: 0.5,
      color: '#FF6600',
      pulse: false,
      scaleWithHeat: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'embers',
      colors: ['#FF4400', '#FFAA00', '#FFCC00'],
      count: 6,
      spread: 20,
      lifetime: 0.5,
    },

    // Screen effects on overcharge
    screenEffects: {
      onOvercharge: {
        shake: { intensity: 6, duration: 0.25 },
        flash: { color: '#FF6600', intensity: 0.25, duration: 0.1 },
      },
    },

    upgrades: {
      2: { damage: 35, heatPerShot: 14, overcharge: { damageMultiplier: 2.2 } },
      3: { damage: 44, pierce: 2, projectileCount: 4, cooldown: 0.35 },
      4: { damage: 55, overcharge: { projectileCount: 10, damageMultiplier: 2.5 } },
      5: { damage: 70, projectileCount: 5, pierce: 3, maxHeat: 120 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
