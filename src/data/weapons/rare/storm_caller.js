/**
 * @fileoverview Storm Caller - Rare melee with charge buildup for massive lightning strike
 * @module Data/Weapons/Rare/StormCaller
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.storm_caller = {
    id: 'storm_caller',
    name: 'Storm Caller',
    description: 'Each swing builds storm charge. At full charge, unleash a devastating lightning storm',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 1,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 42,
    cooldown: 0.7,
    range: 65,
    arcAngle: 120,
    swingDuration: 0.18,
    hitsPerSwing: 1,

    // Visual
    color: '#FFFF00',
    secondaryColor: '#FFFFFF',
    icon: 'storm_hammer',
    imageId: 'weapon_storm_caller',

    // Status effect
    statusEffect: {
      type: 'stun',
      duration: 0.3,
      chance: 0.2, // 20% stun chance per hit
    },

    // Storm charge system
    stormCharge: {
      enabled: true,
      maxCharge: 100,
      chargePerSwing: 15,
      chargePerHit: 5, // Bonus charge for hitting enemies
      chargeDecayRate: 0, // No decay - stays until used
      // Visual indicators
      chargeVisuals: [
        { threshold: 0, particleCount: 2, glowIntensity: 0.3 },
        { threshold: 30, particleCount: 5, glowIntensity: 0.5 },
        { threshold: 60, particleCount: 8, glowIntensity: 0.7 },
        { threshold: 90, particleCount: 12, glowIntensity: 0.9 },
      ],
      // Ultimate at full charge
      stormStrike: {
        triggerAtCharge: 100,
        damage: 150,
        radius: 180,
        chainCount: 5, // Chains to 5 enemies
        chainDamageDecay: 0.15, // 15% damage loss per chain
        stunDuration: 1.0,
        cooldownAfter: 2.0,
        resetChargeAfter: true,
      },
    },

    // Visual effects
    swingEffect: {
      type: 'electric_arc',
      trailColor: '#FFFF00',
      trailAlpha: 0.8,
      sparkCount: 6,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.5,
      color: '#FFFF66',
      pulse: true,
      pulseSpeed: 3,
      scaleWithCharge: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'lightning_sparks',
      colors: ['#FFFF00', '#FFFFFF', '#AAFFFF'],
      count: 4,
      spread: 25,
      lifetime: 0.3,
    },

    // Screen effects on storm strike
    screenEffects: {
      onStormStrike: {
        shake: { intensity: 12, duration: 0.4 },
        flash: { color: '#FFFFFF', intensity: 0.6, duration: 0.1 },
      },
    },

    // Sound cues (for audio system)
    sounds: {
      swing: 'electric_whoosh',
      hit: 'thunder_crack',
      stormStrike: 'massive_thunder',
    },

    upgrades: {
      2: { damage: 52, stormStrike: { damage: 180, chainCount: 6 }, chargePerSwing: 18 },
      3: { damage: 65, range: 75, arcAngle: 140, cooldown: 0.6 },
      4: { damage: 82, stormStrike: { damage: 220, radius: 220, stunDuration: 1.3 } },
      5: { damage: 105, chargePerHit: 8, stormStrike: { damage: 280, chainCount: 8 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
