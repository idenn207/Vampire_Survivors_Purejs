/**
 * @fileoverview Apocalypse Engine - Epic mine with 4 Horsemen effects and SCREEN NUKE
 * @module Data/Weapons/Epic/ApocalypseEngine
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.apocalypse_engine = {
    id: 'apocalypse_engine',
    name: 'Apocalypse Engine',
    description: 'Mines cycle through the 4 Horsemen. Deploy 10 mines to trigger... THE APOCALYPSE',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 4,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 60,
    cooldown: 3.0,
    range: 400,
    triggerRadius: 55,
    explosionRadius: 100,
    duration: 30.0,

    // Visual
    color: '#FF0000',
    secondaryColor: '#000000',
    icon: 'apocalypse',
    imageId: 'weapon_apocalypse_engine',
    mineImageId: 'apocalypse_engine_mine',

    // Four Horsemen rotation
    fourHorsemen: {
      enabled: true,
      cycleOnDeploy: true, // Each mine is the next horseman
      horsemen: [
        {
          name: 'Conquest',
          color: '#FFFFFF',
          symbol: 'crown',
          damage: 70,
          // Conquest effect - mark enemies for bonus damage
          effect: {
            type: 'mark',
            markDuration: 8.0,
            damageBonus: 0.5, // Marked take 50% more damage
            spreadMark: true, // Mark spreads to nearby on kill
            spreadRadius: 80,
          },
          visual: {
            explosion: 'white_flash',
            particles: 'conquest_banners',
          },
        },
        {
          name: 'War',
          color: '#FF0000',
          symbol: 'sword',
          damage: 90,
          // War effect - rage aura that buffs damage
          effect: {
            type: 'rage_zone',
            radius: 120,
            duration: 6.0,
            playerDamageBonus: 0.3, // Player deals 30% more in zone
            enemyAggroAll: true, // Enemies attack each other
          },
          visual: {
            explosion: 'blood_burst',
            particles: 'war_flames',
          },
        },
        {
          name: 'Famine',
          color: '#000000',
          symbol: 'scales',
          damage: 50,
          // Famine effect - weakening debuff
          effect: {
            type: 'famine_curse',
            radius: 100,
            duration: 10.0,
            damageReduction: 0.4, // Enemies deal 40% less damage
            healingBlocked: true, // Enemies can't heal
            speedReduction: 0.3,
          },
          visual: {
            explosion: 'dark_void',
            particles: 'famine_locusts',
          },
        },
        {
          name: 'Death',
          color: '#00FF00', // Pale green
          symbol: 'skull',
          damage: 80,
          // Death effect - execute and plague
          effect: {
            type: 'death_touch',
            executeThreshold: 0.2, // Instant kill below 20% HP
            plagueSpread: {
              enabled: true,
              damage: 15,
              duration: 8.0,
              spreadOnDeath: true,
              maxSpread: 5,
            },
          },
          visual: {
            explosion: 'skull_burst',
            particles: 'death_mist',
          },
        },
      ],
    },

    // Apocalypse ultimate - SCREEN NUKE
    apocalypse: {
      enabled: true,
      minesRequired: 10, // 10 active mines triggers it
      // Nuke effect
      nuke: {
        damage: 999,
        affectsAllScreen: true,
        bossPercentDamage: 0.4, // 40% of boss max HP
        // Multi-phase destruction
        phases: [
          { time: 0, effect: 'ground_crack', intensity: 1.0 },
          { time: 0.5, effect: 'fire_pillar', count: 20 },
          { time: 1.0, effect: 'shockwave', speed: 2000 },
          { time: 1.5, effect: 'mushroom_cloud', height: 800 },
          { time: 2.5, effect: 'fallout', duration: 5.0 },
        ],
        // Fallout zone after nuke
        fallout: {
          duration: 8.0,
          damage: 30,
          tickRate: 0.3,
          radiationVisual: true,
        },
      },
      // Cooldown - must deploy 10 new mines
      resetAfterNuke: true,
    },

    // Mine visual
    mineVisual: {
      type: 'horseman_sigil',
      sigilGlow: true,
      rotatingSymbol: true,
      countdown: true, // Shows which horseman is next
      ominousAura: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 50,
      intensity: 0.7,
      colorMatchHorseman: true,
      pulse: true,
      pulseSpeed: 2,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'apocalyptic_embers',
      colors: ['#FF0000', '#FFFFFF', '#000000', '#00FF00'],
      count: 20,
      spread: 70,
      lifetime: 1.0,
      horsemanThemed: true,
    },

    // Screen effects
    screenEffects: {
      onHorsemanSwitch: {
        flash: { colorMatchHorseman: true, intensity: 0.3, duration: 0.15 },
      },
      onMineExplode: {
        shake: { intensity: 5, duration: 0.2 },
      },
      onApocalypse: {
        whiteOut: { duration: 1.0 },
        shake: { intensity: 25, duration: 3.0 },
        slowMotion: { factor: 0.2, duration: 2.0 },
        screenCrack: true,
        sirenSound: true,
      },
    },

    // Sound effects
    sounds: {
      deploy: 'ominous_horn',
      conquest: 'trumpet',
      war: 'battle_cry',
      famine: 'locust_swarm',
      death: 'death_knell',
      apocalypse: 'world_end',
    },

    upgrades: {
      2: { damage: 78, War: { damage: 115 }, Death: { executeThreshold: 0.25 }, cooldown: 2.7 },
      3: { damage: 95, minesRequired: 9, nuke: { bossPercentDamage: 0.5 } },
      4: { damage: 115, explosionRadius: 120, fallout: { duration: 10.0, damage: 40 } },
      5: { damage: 140, minesRequired: 8, nuke: { damage: 1500 }, cooldown: 2.4 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
