/**
 * @fileoverview Cosmic Annihilator - Epic laser that sweeps and creates persistent stars
 * @module Data/Weapons/Epic/CosmicAnnihilator
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.cosmic_annihilator = {
    id: 'cosmic_annihilator',
    name: 'Cosmic Annihilator',
    description: 'A sweeping beam of galactic destruction. Creates persistent stars. Fully charged = 3x power',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 4,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 50, // Per tick
    cooldown: 0.0, // Continuous
    range: 500,
    width: 30,
    sweepSpeed: 0.8, // Rotations per second
    tickRate: 0.1,

    // Visual
    color: '#9933FF',
    secondaryColor: '#FF33FF',
    tertiaryColor: '#FFFFFF',
    icon: 'cosmic_beam',
    imageId: 'weapon_cosmic_annihilator',
    laserImageId: 'cosmic_annihilator_laser',

    // Sweep behavior
    sweepPattern: {
      enabled: true,
      type: 'full_rotation',
      direction: 'clockwise',
      acceleration: true, // Speed up over time
      maxSpeed: 1.5,
    },

    // Star creation along beam path
    starCreation: {
      enabled: true,
      createInterval: 0.3, // Seconds between stars
      // Star properties
      star: {
        damage: 20,
        radius: 40,
        duration: 8.0, // Stars last 8 seconds
        tickRate: 0.5,
        // Stars can connect
        constellation: {
          enabled: true,
          connectRange: 150,
          lineDamage: 10, // Damage on connection lines
          lineWidth: 15,
        },
      },
      maxStars: 15,
      // Old stars explode when max reached
      starExplosion: {
        damage: 40,
        radius: 60,
      },
    },

    // Charge system for ultimate
    chargeSystem: {
      enabled: true,
      chargeTime: 5.0, // 5 seconds to fully charge
      chargeWhileFiring: true,
      // Charge benefits
      chargeBonus: {
        damageMultiplier: 3.0, // 3x damage at full charge
        widthMultiplier: 2.0, // Double width
        starDamageMultiplier: 2.0,
      },
      // Charge visual escalation
      chargeVisuals: [
        { percent: 0, color: '#9933FF', particles: 5 },
        { percent: 25, color: '#AA44FF', particles: 10 },
        { percent: 50, color: '#BB55FF', particles: 15 },
        { percent: 75, color: '#CC66FF', particles: 20 },
        { percent: 100, color: '#FFFFFF', particles: 30, screenEffect: true },
      ],
      // Full charge burst
      fullChargeBurst: {
        enabled: true,
        burstDamage: 200,
        burstRadius: 300,
        createSuperStar: true, // Creates one massive star
        superStarDuration: 15.0,
        superStarDamage: 50,
        superStarRadius: 100,
      },
    },

    // Galaxy visual
    galaxyVisual: {
      enabled: true,
      spiralArms: 4,
      dustClouds: true,
      starfield: true,
      nebulaColors: ['#9933FF', '#FF33FF', '#3366FF', '#FF6699'],
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 60,
      intensity: 0.9,
      colors: ['#9933FF', '#FF33FF'],
      pulse: true,
      pulseSpeed: 2,
      galaxySpiral: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'cosmic_dust',
      colors: ['#9933FF', '#FF33FF', '#FFFFFF', '#3366FF'],
      count: 40,
      spread: 200,
      lifetime: 1.5,
      spiral: true,
      stardust: true,
    },

    // Screen effects
    screenEffects: {
      passive: {
        vignette: { color: '#330033', intensity: 0.15 },
        starfieldBackground: true,
      },
      onFullCharge: {
        flash: { color: '#FFFFFF', intensity: 0.6, duration: 0.2 },
        shake: { intensity: 10, duration: 0.5 },
        slowMotion: { factor: 0.5, duration: 0.8 },
      },
    },

    upgrades: {
      2: { damage: 65, starDuration: 10.0, maxStars: 18, chargeTime: 4.5 },
      3: { damage: 82, width: 38, fullChargeBurst: { burstDamage: 260 }, sweepSpeed: 1.0 },
      4: { damage: 100, damageMultiplier: 3.5, constellation: { connectRange: 180 } },
      5: { damage: 125, maxStars: 22, chargeTime: 4.0, superStarDamage: 75 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
