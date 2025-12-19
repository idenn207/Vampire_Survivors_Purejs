/**
 * @fileoverview World Serpent - Epic summon with 20-segment body that can swallow and coil
 * @module Data/Weapons/Epic/WorldSerpent
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.world_serpent = {
    id: 'world_serpent',
    name: 'World Serpent',
    description: 'Jormungandr incarnate. A massive 20-segment serpent that devours and constricts the world',
    attackType: AttackType.SUMMON,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.EPIC,

    // Tier properties
    tier: 1,
    isExclusive: true,
    maxTier: 5,

    // Base stats
    damage: 40, // Body contact damage
    cooldown: 0.0, // Continuous
    summonCount: 1,
    summonDuration: 0, // Permanent

    // Visual
    color: '#006600',
    secondaryColor: '#00AA00',
    tertiaryColor: '#003300',
    icon: 'world_serpent',
    imageId: 'weapon_world_serpent',

    // Serpent stats
    serpentStats: {
      segments: 20,
      segmentSize: 25,
      segmentGap: 5,
      totalLength: 600, // Approximate total length
      speed: 200,
      turnSpeed: 3, // How fast it can turn
      health: 500,
      invulnerable: true, // Cannot be killed
    },

    // Serpent behavior
    serpentBehavior: {
      // Movement pattern
      movement: {
        followPlayer: true,
        orbitWhenIdle: true,
        orbitRadius: 200,
        huntRadius: 400, // Will chase enemies within this radius
      },
      // Each segment deals damage on contact
      segmentDamage: {
        enabled: true,
        damagePerSegment: 40,
        tickRate: 0.3,
        // Tail does extra damage
        tailBonus: 1.5,
      },
    },

    // Swallow ability - devour enemies
    swallow: {
      enabled: true,
      // Mouth opening at head
      mouthOpen: {
        triggerDistance: 60,
        openAngle: 45, // Degrees
        swallowRadius: 50,
      },
      // Swallow effect
      swallowEffect: {
        instantKill: true, // Instantly kills small enemies
        maxHealthToSwallow: 200, // Can only instant-kill enemies with less HP
        bossDigestion: {
          enabled: true,
          damagePercent: 0.1, // 10% of boss HP as damage
          duration: 3.0, // Digestion time
        },
        // Healing from swallowing
        healOnSwallow: 10,
      },
      // Visual
      swallowVisual: {
        mouthAnimation: true,
        gulpEffect: true,
        bulgeAnimation: true, // Bulge travels down body
      },
    },

    // Coil ability - trap enemies in body
    coil: {
      enabled: true,
      triggerCondition: 'enemy_cluster', // When 5+ enemies nearby
      enemyThreshold: 5,
      // Coil effect
      coilEffect: {
        trapDuration: 4.0,
        constrictDamage: 25, // Damage per second while coiled
        pullToCenter: true, // Pull trapped enemies to coil center
        crushFinisher: true, // Big damage when coil ends
        crushDamage: 100,
      },
      cooldown: 10.0,
      // Visual
      coilVisual: {
        spiralPattern: true,
        tightenAnimation: true,
        dustParticles: true,
      },
    },

    // Growth mechanic
    growth: {
      enabled: true,
      killsToGrow: 20, // Grow new segment every 20 kills
      maxSegments: 30,
      growthBonus: {
        damagePerSegment: 2, // +2 damage per new segment
        healthPerSegment: 25,
      },
    },

    // Serpent visual
    serpentVisual: {
      type: 'scaled_serpent',
      scalePattern: true,
      headHorns: true,
      glowingEyes: true,
      eyeColor: '#FFFF00',
      underbelly: '#88AA88',
      // Segment animations
      segments: {
        wiggle: true,
        pulseOnHit: true,
        scaleShimmer: true,
      },
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 30,
      intensity: 0.5,
      color: '#00FF00',
      onHead: true,
      eyeGlow: true,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'serpent_scales',
      colors: ['#006600', '#00AA00', '#88FF88'],
      count: 15,
      spread: 50,
      lifetime: 0.8,
      followBody: true,
    },

    // Screen effects
    screenEffects: {
      onSwallow: {
        shake: { intensity: 4, duration: 0.2 },
      },
      onCoil: {
        vignette: { color: '#003300', intensity: 0.2, duration: 4.0 },
      },
      onCrush: {
        shake: { intensity: 8, duration: 0.3 },
        flash: { color: '#00FF00', intensity: 0.3, duration: 0.1 },
      },
    },

    upgrades: {
      2: { damage: 52, segments: 23, swallowEffect: { maxHealthToSwallow: 280 } },
      3: { damage: 65, coil: { constrictDamage: 35, crushDamage: 140 }, speed: 230 },
      4: { damage: 80, segments: 26, killsToGrow: 15, bossDigestion: { damagePercent: 0.15 } },
      5: { damage: 100, segments: 30, maxSegments: 40, coil: { cooldown: 8.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
