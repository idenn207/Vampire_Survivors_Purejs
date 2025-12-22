/**
 * @fileoverview Ragnarok - Epic melee with screen wipe ultimate and permanent damage stacking
 * @module Data/Weapons/Epic/Ragnarok
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.ragnarok = {
    id: 'ragnarok',
    name: 'Ragnarok',
    description: 'The blade that ends worlds. Every 50 kills triggers Twilight of the Gods - annihilating all',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 4,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 80,
    cooldown: 0.8,
    range: 85,
    arcAngle: 180,
    swingDuration: 0.25,
    hitsPerSwing: 3,

    // Visual
    color: '#FF0000',
    secondaryColor: '#FFAA00',
    tertiaryColor: '#000000',
    icon: 'ragnarok',
    imageId: 'weapon_ragnarok',
    meleeImageId: 'ragnarok_melee',

    // Permanent damage stacking
    permanentStacking: {
      enabled: true,
      damagePerKill: 0.3, // +0.3 permanent damage per kill
      maxBonus: 200, // Cap at +200 bonus damage
      displayCounter: true,
      visualEscalation: {
        thresholds: [50, 100, 200, 350, 500],
        effects: ['ember', 'flame', 'inferno', 'chaos', 'oblivion'],
      },
    },

    // Elemental cycling on swing
    elementalFury: {
      enabled: true,
      cycleOnSwing: true,
      elements: [
        { name: 'Fire', color: '#FF4400', effect: { type: 'burn', damage: 15, duration: 3.0 } },
        { name: 'Ice', color: '#00DDFF', effect: { type: 'freeze', duration: 1.0 } },
        { name: 'Lightning', color: '#FFFF00', effect: { type: 'stun', duration: 0.5 } },
        { name: 'Void', color: '#660066', effect: { type: 'weakness', damageMultiplier: 1.5, duration: 4.0 } },
      ],
    },

    // Twilight of the Gods - screen wipe ultimate
    twilightOfTheGods: {
      enabled: true,
      killsRequired: 50,
      resetOnTrigger: true,
      // Ultimate effect
      screenWipe: {
        damage: 9999, // Instant kill
        affectsAllEnemies: true, // Everything on screen
        bossMultiplier: 0.5, // Bosses take 50% of max health
        duration: 2.0, // Animation duration
      },
      // Visual sequence
      sequence: [
        { time: 0, effect: 'screen_darken', intensity: 0.8 },
        { time: 0.3, effect: 'runes_appear', count: 12 },
        { time: 0.8, effect: 'blade_descend', size: 2000 },
        { time: 1.2, effect: 'world_crack', spread: 'radial' },
        { time: 1.5, effect: 'explosion', color: '#FF0000' },
        { time: 1.8, effect: 'fade_restore' },
      ],
      // Player buff during animation
      invulnDuringAnimation: true,
      slowMotionEffect: { factor: 0.2, duration: 1.5 },
    },

    // Visual effects
    swingEffect: {
      type: 'apocalyptic_arc',
      trailColors: ['#FF0000', '#FF6600', '#FFAA00', '#FFFFFF'],
      trailLength: 60,
      afterimageCount: 4,
      worldShatterParticles: true,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 40,
      intensity: 0.8,
      colors: ['#FF0000', '#FF6600'],
      pulse: true,
      pulseSpeed: 3,
      intensifyWithKills: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'ragnarok_flames',
      colors: ['#FF0000', '#FF6600', '#FFAA00', '#000000'],
      count: 25,
      spread: 80,
      lifetime: 1.0,
      rise: true,
      embers: true,
    },

    // Screen effects
    screenEffects: {
      passive: {
        vignette: { color: '#330000', intensity: 0.1, pulseWithKillCount: true },
      },
      onSwing: {
        shake: { intensity: 3, duration: 0.1 },
      },
      onTwilight: {
        flash: { color: '#FF0000', intensity: 1.0, duration: 0.3 },
        shake: { intensity: 20, duration: 1.5 },
        slowMotion: { factor: 0.2, duration: 1.5 },
      },
    },

    // Sound
    sounds: {
      swing: 'apocalyptic_slash',
      kill: 'soul_absorbed',
      twilight: 'ragnarok_ultimate',
    },

    upgrades: {
      2: { damage: 100, damagePerKill: 0.4, killsRequired: 45, arcAngle: 200 },
      3: { damage: 125, hitsPerSwing: 4, range: 95, cooldown: 0.7 },
      4: { damage: 155, killsRequired: 40, maxBonus: 300, elementalFury: { all: { durationBonus: 1.0 } } },
      5: { damage: 200, damagePerKill: 0.5, killsRequired: 35, screenWipe: { bossMultiplier: 0.7 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
