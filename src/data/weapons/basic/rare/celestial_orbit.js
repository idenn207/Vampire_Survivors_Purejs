/**
 * @fileoverview Celestial Orbit - Rare particle with Sun/Moon/Star orbitals and eclipse mechanic
 * @module Data/Weapons/Rare/CelestialOrbit
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.celestial_orbit = {
    id: 'celestial_orbit',
    name: 'Celestial Orbit',
    description: 'Sun, Moon, and Stars orbit you with unique powers. Eclipse alignment triggers 3x damage',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 35, // Base damage per hit
    cooldown: 0.0, // Continuous orbiting
    particleCount: 3, // Sun, Moon, Star
    orbitRadius: 80,
    orbitSpeed: 1.5, // Rotations per second

    // Visual
    icon: 'celestial',
    imageId: 'weapon_celestial_orbit',

    // Celestial body system
    celestialBodies: {
      enabled: true,
      bodies: [
        {
          name: 'Sun',
          color: '#FFDD00',
          secondaryColor: '#FF8800',
          size: 16,
          damage: 40,
          orbitRadius: 90,
          orbitSpeed: 1.2,
          // Sun power - burn damage
          statusEffect: { type: 'burn', damage: 8, duration: 2.5, tickRate: 0.5 },
          // Sun visual
          glow: { radius: 25, intensity: 0.8, pulse: true, pulseSpeed: 2 },
          particles: { type: 'solar_flare', count: 6, color: '#FFAA00' },
        },
        {
          name: 'Moon',
          color: '#CCDDFF',
          secondaryColor: '#8899CC',
          size: 12,
          damage: 30,
          orbitRadius: 70,
          orbitSpeed: 1.8,
          // Moon power - slow effect
          statusEffect: { type: 'slow', speedModifier: 0.6, duration: 2.0 },
          // Moon visual
          glow: { radius: 18, intensity: 0.5, pulse: true, pulseSpeed: 1.5 },
          particles: { type: 'moonlight', count: 4, color: '#AABBFF' },
          // Moon phases affect damage
          phases: {
            enabled: true,
            cycleTime: 10.0,
            damageModifiers: [0.8, 1.0, 1.2, 1.0], // New, First Quarter, Full, Third Quarter
          },
        },
        {
          name: 'Star',
          color: '#FFFFFF',
          secondaryColor: '#FFFFAA',
          size: 8,
          damage: 25,
          orbitRadius: 100,
          orbitSpeed: 2.5,
          // Star power - crit chance
          critChance: 0.25,
          critMultiplier: 2.0,
          // Star visual
          glow: { radius: 12, intensity: 0.6, twinkle: true },
          particles: { type: 'stardust', count: 3, color: '#FFFFFF' },
        },
      ],
      // Eclipse mechanic - when Sun and Moon align
      eclipse: {
        enabled: true,
        triggerAngle: 15, // Degrees of alignment tolerance
        damageMultiplier: 3.0,
        duration: 2.0, // Eclipse effect duration
        cooldown: 15.0, // Minimum time between eclipses
        // Eclipse visuals
        visual: {
          mergeColors: true,
          coronaEffect: true,
          darkening: 0.3, // Screen darken effect
          particleBurst: { count: 30, spread: 150 },
        },
        // Eclipse bonus effects
        bonusEffects: {
          allStatusEffects: true, // Apply all status effects
          aoeRadius: 60, // Damage in area during eclipse
        },
      },
    },

    // Visual effects
    glow: {
      enabled: true,
      radius: 100,
      intensity: 0.3,
      color: '#FFFFAA',
    },

    // Screen effects during eclipse
    screenEffects: {
      onEclipse: {
        flash: { color: '#FFFFFF', intensity: 0.4, duration: 0.15 },
        vignette: { intensity: 0.3, duration: 2.0 },
      },
    },

    upgrades: {
      2: { damage: 45, Sun: { damage: 52 }, Moon: { damage: 38 }, orbitRadius: 90 },
      3: { damage: 58, Star: { critChance: 0.3 }, eclipse: { damageMultiplier: 3.5 } },
      4: { damage: 72, particleCount: 4, orbitSpeed: 1.8 }, // Adds second star
      5: { damage: 90, eclipse: { damageMultiplier: 4.0, cooldown: 12.0 }, all: { sizeBonus: 4 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
