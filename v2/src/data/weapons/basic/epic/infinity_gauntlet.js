/**
 * @fileoverview Infinity Gauntlet - Epic melee that collects 6 stones, SNAP = delete half enemies
 * @module Data/Weapons/Epic/InfinityGauntlet
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.infinity_gauntlet = {
    id: 'infinity_gauntlet',
    name: 'Infinity Gauntlet',
    description: 'Collect all 6 Infinity Stones. With all stones... SNAP... and half of all life ceases to exist',
    attackType: AttackType.MELEE_THRUST,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 4,
    isExclusive: true,
    maxTier: 5,

    // Base stats (without stones)
    damage: 60,
    cooldown: 0.9,
    range: 70,

    // Thrust parameters (punch style - gauntlet fist)
    thrustStyle: 'punch',
    thrustDuration: 0.2,
    extendTime: 0.4,
    holdTime: 0,
    retractTime: 0.6,
    thrustWidth: 40,
    coneExpansion: 1.0,

    // Visual
    color: '#FFD700',
    secondaryColor: '#AA8800',
    visualScale: 1.2,
    icon: 'infinity_gauntlet',
    imageId: 'weapon_infinity_gauntlet',
    meleeImageId: 'infinity_gauntlet_melee',

    // Infinity Stones system
    infinityStones: {
      enabled: true,
      killsPerStone: 30, // 30 kills to unlock each stone
      // Stone definitions
      stones: [
        {
          name: 'Power',
          color: '#9933FF',
          slot: 'thumb',
          killsRequired: 30,
          effect: {
            damageBonus: 0.5, // +50% damage
            explosionOnHit: { chance: 0.2, damage: 40, radius: 50 },
          },
        },
        {
          name: 'Space',
          color: '#3366FF',
          slot: 'index',
          killsRequired: 60,
          effect: {
            teleportStrike: { enabled: true, range: 200 },
            pullOnHit: { force: 80, radius: 100 },
          },
        },
        {
          name: 'Reality',
          color: '#FF3333',
          slot: 'middle',
          killsRequired: 90,
          effect: {
            transformEnemies: { chance: 0.1, duration: 3.0 }, // Turn to harmless form
            damageTypeShift: true, // Bypass resistances
          },
        },
        {
          name: 'Soul',
          color: '#FF9933',
          slot: 'ring',
          killsRequired: 120,
          effect: {
            lifesteal: 0.15, // 15% lifesteal
            soulCapture: { damage: 20, seekingProjectiles: true },
          },
        },
        {
          name: 'Time',
          color: '#33FF33',
          slot: 'pinky',
          killsRequired: 150,
          effect: {
            cooldownReduction: 0.3, // 30% faster cooldowns
            timeSlowAura: { radius: 150, slowFactor: 0.6 },
          },
        },
        {
          name: 'Mind',
          color: '#FFFF33',
          slot: 'knuckle',
          killsRequired: 180,
          effect: {
            confuseEnemies: { chance: 0.15, duration: 2.0 }, // Enemies attack each other
            psychicWave: { damage: 30, radius: 120, stunDuration: 0.5 },
          },
        },
      ],
      // Visual when stones are collected
      stoneVisuals: {
        glowOnGauntlet: true,
        orbitalGlow: true,
        particleAura: true,
      },
    },

    // THE SNAP - ultimate with all stones
    theSnap: {
      enabled: true,
      requireAllStones: true,
      cooldown: 60.0, // 60 second cooldown after snap
      // Snap effect
      effect: {
        deletePercent: 0.5, // 50% of all enemies
        selectionMethod: 'random', // Randomly selected
        instantKill: true,
        bossImmune: false, // Bosses CAN be snapped (50% chance)
        // Dusted enemies leave essence
        dustEssence: {
          healAmount: 5,
          damageBoostDuration: 10.0,
          damageBoostAmount: 0.25,
        },
      },
      // Snap animation sequence
      animation: {
        duration: 3.0,
        sequence: [
          { time: 0, action: 'raise_gauntlet', zoom: 1.2 },
          { time: 0.5, action: 'stones_glow', intensity: 1.0 },
          { time: 1.0, action: 'finger_snap', effect: 'shockwave' },
          { time: 1.2, action: 'golden_wave', spread: 'radial', speed: 2000 },
          { time: 1.5, action: 'enemies_dust', duration: 1.5 },
          { time: 3.0, action: 'restore_normal' },
        ],
        // Player invulnerable during animation
        invulnerable: true,
        pauseEnemies: true,
      },
      // Dust visual
      dustVisual: {
        particleCount: 50, // Per enemy
        colors: ['#FFD700', '#FFA500', '#FF6600'],
        floatAway: true,
        fadeTime: 1.5,
      },
    },

    // Gauntlet visual
    gauntletVisual: {
      type: 'golden_fist',
      metallic: true,
      stoneSlots: 6,
      energyLines: true,
      pulseWithPower: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 35,
      intensity: 0.7,
      color: '#FFD700',
      pulse: true,
      pulseSpeed: 2,
      stoneGlowsAdded: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'infinity_power',
      colors: ['#9933FF', '#3366FF', '#FF3333', '#FF9933', '#33FF33', '#FFFF33'],
      count: 20,
      spread: 60,
      lifetime: 1.0,
      orbitalMotion: true,
    },

    // Screen effects
    screenEffects: {
      onStoneCollect: {
        flash: { colorMatchStone: true, intensity: 0.5, duration: 0.3 },
        shake: { intensity: 6, duration: 0.3 },
      },
      onAllStones: {
        permanentAura: { color: '#FFD700', intensity: 0.1 },
      },
      onSnap: {
        flash: { color: '#FFD700', intensity: 1.0, duration: 0.5 },
        shake: { intensity: 15, duration: 2.0 },
        slowMotion: { factor: 0.3, duration: 2.0 },
      },
    },

    upgrades: {
      2: { damage: 78, killsPerStone: 25, explosionOnHit: { damage: 55 } },
      3: { damage: 98, cooldown: 0.8, theSnap: { cooldown: 50.0 }, thrustWidth: 45 },
      4: { damage: 120, lifesteal: 0.2, timeSlowAura: { radius: 180 } },
      5: { damage: 150, killsPerStone: 20, theSnap: { deletePercent: 0.6 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
