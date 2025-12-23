/**
 * @fileoverview Soul Nexus - Epic orbit that collects souls for scaling bonuses and soul storm
 * @module Data/Weapons/Epic/SoulNexus
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.soul_nexus = {
    id: 'soul_nexus',
    name: 'Soul Nexus',
    description: 'A vortex that collects enemy souls. At 100 souls, unleash a devastating Soul Storm',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 4,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 30,
    cooldown: 0.0, // Continuous
    particleCount: 6, // Orbiting souls
    orbitRadius: 100,
    orbitSpeed: 1.2,

    // Visual
    color: '#00FFAA',
    secondaryColor: '#66FFCC',
    tertiaryColor: '#AAFFEE',
    visualScale: 1.2,
    icon: 'soul_nexus',
    imageId: 'weapon_soul_nexus',
    bladeImageId: 'soul_nexus_blade',

    // Soul collection system
    soulCollection: {
      enabled: true,
      soulsPerKill: 1,
      maxSouls: 100,
      // Soul visuals - souls orbit the nexus
      soulOrbit: {
        innerRing: { count: 6, radius: 60, speed: 2.0 },
        middleRing: { count: 8, radius: 100, speed: 1.5 },
        outerRing: { count: 10, radius: 140, speed: 1.0 },
      },
      // Scaling bonuses based on souls
      soulBonuses: [
        { souls: 10, damageBonus: 0.1, particleBonus: 1 },
        { souls: 25, damageBonus: 0.25, orbitSpeedBonus: 0.2 },
        { souls: 50, damageBonus: 0.5, particleBonus: 2, radiusBonus: 20 },
        { souls: 75, damageBonus: 0.75, lifesteal: 0.05 },
        { souls: 100, damageBonus: 1.0, soulStormReady: true },
      ],
    },

    // Soul behaviors
    soulBehaviors: {
      // Passive soul damage
      orbitDamage: {
        enabled: true,
        damagePerSoul: 30,
        hitCooldown: 0.5, // Per enemy per soul
      },
      // Soul seeking
      soulSeeking: {
        enabled: true,
        seekOnKill: true, // Souls automatically come to player
        seekSpeed: 400,
        magnetRadius: 200,
      },
      // Soul explosion on hit
      soulExplosion: {
        enabled: true,
        chance: 0.15, // 15% chance when soul hits
        damage: 25,
        radius: 40,
      },
    },

    // Soul Storm ultimate
    soulStorm: {
      enabled: true,
      soulsRequired: 100,
      consumesSouls: true, // Uses all collected souls
      // Storm effect
      storm: {
        duration: 8.0,
        radius: 300, // Massive area
        // Soul barrage
        soulBarrage: {
          enabled: true,
          soulsPerSecond: 20,
          soulDamage: 40,
          soulHoming: true,
          soulSpeed: 500,
        },
        // Damage aura
        damageAura: {
          damage: 20,
          tickRate: 0.2,
        },
        // Soul absorption
        absorption: {
          enabled: true,
          healPerKill: 15,
          damageBoostPerKill: 0.02, // +2% damage per kill during storm
        },
      },
      // Storm visual
      stormVisual: {
        vortex: true,
        spiralingSouls: true,
        lightningEffects: true,
        screenDarkening: 0.3,
      },
      // Cooldown after storm
      stormCooldown: 30.0, // Must collect souls again
    },

    // Nexus visual
    nexusVisual: {
      type: 'soul_vortex',
      // Core
      core: {
        color: '#00FFAA',
        size: 25,
        pulse: true,
        soulCountDisplay: true,
      },
      // Soul appearances
      souls: {
        type: 'ethereal_wisps',
        faceExpressions: true,
        trailEffect: true,
        glowRadius: 10,
      },
      // Connection lines between souls
      soulConnections: {
        enabled: true,
        lineColor: '#66FFCC',
        lineAlpha: 0.3,
      },
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 120,
      intensity: 0.6,
      color: '#00FFAA',
      pulse: true,
      pulseSpeed: 1.5,
      intensifyWithSouls: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'soul_essence',
      colors: ['#00FFAA', '#66FFCC', '#AAFFEE', '#FFFFFF'],
      count: 30,
      spread: 120,
      lifetime: 1.2,
      spiralMotion: true,
      ghostlyEffect: true,
    },

    // Screen effects
    screenEffects: {
      passive: {
        ambientSouls: { enabled: true, count: 10, opacity: 0.2 },
      },
      onSoulCollect: {
        pulse: { color: '#00FFAA', intensity: 0.1 },
      },
      onSoulStorm: {
        vignette: { color: '#003322', intensity: 0.4 },
        shake: { intensity: 6, duration: 8.0, random: true },
        soulRain: true,
      },
    },

    upgrades: {
      2: { damage: 38, soulsPerKill: 2, soulExplosion: { chance: 0.2 }, particleCount: 7 },
      3: { damage: 48, storm: { duration: 10.0 }, soulBarrage: { soulsPerSecond: 25 } },
      4: { damage: 60, maxSouls: 120, soulStorm: { radius: 350 }, orbitRadius: 120 },
      5: { damage: 75, soulsRequired: 80, storm: { duration: 12.0, soulDamage: 55 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
