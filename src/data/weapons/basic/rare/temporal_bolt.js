/**
 * @fileoverview Temporal Bolt - Rare projectile that manipulates time around its path
 * @module Data/Weapons/Rare/TemporalBolt
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.temporal_bolt = {
    id: 'temporal_bolt',
    name: 'Temporal Bolt',
    description: 'A bolt of pure chronal energy that slows time in its wake and replays ghost attacks',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 38,
    cooldown: 1.5,
    projectileCount: 1,
    projectileSpeed: 300,
    range: 480,
    pierce: 4,
    spread: 0,

    // Visual
    color: '#00FFFF',
    secondaryColor: '#AAFFFF',
    size: 10,
    shape: 'bolt',
    lifetime: 3.5,
    icon: 'temporal',
    imageId: 'weapon_temporal_bolt',
    projectileImageId: 'temporal_bolt_projectile',

    // Temporal effects
    temporal: {
      enabled: true,
      // Time slow aura around projectile path
      timeSlowAura: {
        radius: 80,
        slowFactor: 0.5, // Enemies at 50% speed
        duration: 1.5, // How long slow persists after projectile passes
      },
      // Ghost replay - replays the attack after delay
      ghostReplay: {
        enabled: true,
        delay: 1.0, // Seconds before ghost appears
        ghostCount: 1,
        ghostDamageMultiplier: 0.6, // 60% of original damage
        ghostAlpha: 0.4, // Visual transparency
      },
      // Clock particle effects
      clockParticles: {
        enabled: true,
        showHands: true, // Spinning clock hands
        showNumbers: true, // Floating numbers
      },
    },

    // Trail effect - time ripples
    trail: {
      enabled: true,
      type: 'time_ripple',
      color: '#00FFFF',
      rippleInterval: 30,
      rippleExpand: true,
      rippleAlpha: 0.5,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.6,
      color: '#66FFFF',
      pulse: true,
      pulseSpeed: 1.5,
    },

    // Distortion effect
    distortion: {
      enabled: true,
      type: 'temporal_shimmer',
      radius: 40,
      intensity: 0.4,
    },

    upgrades: {
      2: { damage: 48, ghostCount: 2, timeSlowAura: { radius: 100 } },
      3: { damage: 62, pierce: 5, ghostDamageMultiplier: 0.7, cooldown: 1.3 },
      4: { damage: 78, timeSlowAura: { slowFactor: 0.4, duration: 2.0 }, ghostCount: 3 },
      5: { damage: 100, projectileCount: 2, ghostDamageMultiplier: 0.8, delay: 0.8 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
