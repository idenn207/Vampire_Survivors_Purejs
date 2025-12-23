/**
 * @fileoverview Genesis Blade - Epic melee that creates weapons, absorbs them, and spawns allies
 * @module Data/Weapons/Epic/GenesisBlade
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.genesis_blade = {
    id: 'genesis_blade',
    name: 'Genesis Blade',
    description: 'The blade of creation. Kills spawn random weapons. Absorb weapons for power. 200 kills = allies',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 4,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 65,
    cooldown: 0.75,
    range: 75,
    arcAngle: 160,
    swingDuration: 0.2,
    hitsPerSwing: 2,

    // Visual
    color: '#FFFFFF',
    secondaryColor: '#FFD700',
    tertiaryColor: '#FF69B4',
    visualScale: 1.2,
    icon: 'genesis_blade',
    imageId: 'weapon_genesis_blade',
    meleeImageId: 'genesis_blade_melee',

    // Weapon spawning on kill
    weaponSpawning: {
      enabled: true,
      spawnChance: 0.3, // 30% chance per kill
      // Spawned weapon properties
      spawnedWeapon: {
        types: ['projectile', 'orbital', 'lightning', 'flame'],
        duration: 8.0, // Spawned weapons last 8 seconds
        damageMultiplier: 0.5, // 50% of genesis blade damage
        autoAttack: true, // Attacks automatically
      },
      maxSpawnedWeapons: 5,
      // Visual
      spawnVisual: {
        creationBurst: true,
        rainbowSparkles: true,
        genesisRune: true,
      },
    },

    // Weapon absorption
    weaponAbsorption: {
      enabled: true,
      // Can absorb spawned weapons for bonuses
      absorptionRadius: 80,
      absorptionKey: 'auto', // or 'manual'
      // Bonuses per absorption
      absorptionBonus: {
        damage: 3, // +3 permanent damage
        cooldownReduction: 0.01, // -1% cooldown
        rangeBonus: 1, // +1 range
      },
      maxAbsorptions: 100, // Cap bonuses
      // Absorption visual
      absorptionVisual: {
        pullEffect: true,
        mergeAnimation: true,
        powerUp: true,
      },
    },

    // Creation power - scales with kills
    creationPower: {
      enabled: true,
      killTracking: true,
      // Power thresholds
      thresholds: [
        { kills: 25, unlock: 'element_infusion', effect: 'random_element_per_swing' },
        { kills: 50, unlock: 'double_spawn', effect: 'spawn_2_weapons' },
        { kills: 100, unlock: 'creation_aura', effect: 'passive_damage_aura' },
        { kills: 150, unlock: 'weapon_mastery', effect: 'spawned_weapons_stronger' },
        { kills: 200, unlock: 'ally_creation', effect: 'summon_allies' },
      ],
    },

    // Ally creation at 200 kills
    allyCreation: {
      enabled: true,
      killsRequired: 200,
      // Ally properties
      allies: {
        count: 3,
        types: ['warrior', 'mage', 'archer'],
        health: 100,
        damage: 40,
        duration: 0, // Permanent until killed
        respawnTime: 30.0, // Respawn after 30 seconds
      },
      // Ally behaviors
      allyBehavior: {
        followPlayer: true,
        attackNearest: true,
        protectPlayer: true, // Intercept projectiles
      },
      // Ally visual
      allyVisual: {
        type: 'ethereal_warriors',
        glowing: true,
        colorMatch: ['#FF0000', '#0000FF', '#00FF00'],
      },
    },

    // Creation aura
    creationAura: {
      enabled: false, // Unlocks at 100 kills
      radius: 100,
      damage: 10,
      tickRate: 0.5,
      healPlayer: 1, // Heal per tick
      spawnMiniWeapons: true, // Tiny weapons orbit
    },

    // Genesis visual
    genesisVisual: {
      type: 'prismatic_blade',
      rainbowShimmer: true,
      creationParticles: true,
      cosmicEdge: true,
      // Evolves with kills
      evolutionStages: [
        { kills: 0, form: 'basic', glow: 0.3 },
        { kills: 50, form: 'radiant', glow: 0.5, wings: 2 },
        { kills: 100, form: 'celestial', glow: 0.7, wings: 4 },
        { kills: 150, form: 'divine', glow: 0.85, wings: 6, halo: true },
        { kills: 200, form: 'genesis', glow: 1.0, wings: 8, crown: true },
      ],
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 35,
      intensity: 0.7,
      colors: ['#FFFFFF', '#FFD700', '#FF69B4', '#00FFFF', '#FF00FF'],
      cycleColors: true,
      cycleSpeed: 2,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'creation_sparks',
      colors: ['#FFFFFF', '#FFD700', '#FF69B4', '#00FFFF', '#FF00FF', '#00FF00'],
      count: 25,
      spread: 80,
      lifetime: 1.0,
      starbursts: true,
      universeParticles: true, // Tiny galaxies
    },

    // Screen effects
    screenEffects: {
      onWeaponSpawn: {
        flash: { color: '#FFFFFF', intensity: 0.2, duration: 0.1 },
      },
      onAbsorption: {
        pulse: { colorMatchWeapon: true, intensity: 0.3 },
      },
      onThresholdUnlock: {
        flash: { color: '#FFD700', intensity: 0.5, duration: 0.3 },
        shake: { intensity: 6, duration: 0.3 },
        announcement: true, // Shows unlock message
      },
      onAllyCreation: {
        whiteFlash: { duration: 0.5 },
        shake: { intensity: 10, duration: 0.5 },
        choirSound: true,
      },
    },

    upgrades: {
      2: { damage: 82, spawnChance: 0.35, absorptionBonus: { damage: 4 }, hitsPerSwing: 3 },
      3: { damage: 100, maxSpawnedWeapons: 6, killsRequired: 180, cooldown: 0.65 },
      4: { damage: 125, allies: { count: 4, damage: 55 }, absorptionBonus: { damage: 5 } },
      5: { damage: 160, spawnChance: 0.45, allies: { count: 5 }, killsRequired: 150 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
