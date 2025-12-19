/**
 * @fileoverview Summon data - configures different summon types and their behaviors
 * @module Data/SummonData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Summon Type Identifiers
  // ============================================
  var SummonType = Object.freeze({
    SPIRIT: 'spirit',
    TURRET: 'turret',
    WOLF: 'wolf',
    GOLEM: 'golem',
    FAIRY: 'fairy',
  });

  // ============================================
  // Behavior Types
  // ============================================
  var BehaviorType = Object.freeze({
    CHASE: 'chase',       // Actively chases enemies
    STATIONARY: 'stationary', // Stays in place, attacks nearby
    ORBIT: 'orbit',       // Orbits around player
    FOLLOW: 'follow',     // Follows player closely
  });

  // ============================================
  // Attack Patterns
  // ============================================
  var AttackPattern = Object.freeze({
    MELEE: 'melee',       // Close range attacks
    RANGED: 'ranged',     // Projectile attacks
    AOE: 'aoe',           // Area of effect attacks
    SUPPORT: 'support',   // Heals/buffs player
  });

  // ============================================
  // Targeting Modes
  // ============================================
  var TargetingMode = Object.freeze({
    NEAREST: 'nearest',   // Target nearest enemy
    WEAKEST: 'weakest',   // Target lowest health enemy
    STRONGEST: 'strongest', // Target highest health enemy
    RANDOM: 'random',     // Random target
  });

  // ============================================
  // Summon Type Configurations
  // ============================================
  var SummonTypeConfig = {
    // Spirit - Balanced ally that chases and attacks
    spirit: {
      id: 'spirit',
      name: 'Spirit',
      description: 'A ghostly companion that chases and attacks enemies.',
      imageId: 'summon_spirit',

      // Combat stats
      damage: 20,
      attackCooldown: 1.0,
      attackRange: 50,

      // Movement stats
      chaseSpeed: 150,
      maxChaseRange: 300,
      returnDistance: 200,

      // Survival stats
      health: 50,
      duration: 15.0,

      // Visual
      size: 20,
      color: '#88CCFF',
      shape: 'circle',
      glowColor: '#88CCFF',
      glowRadius: 4,

      // AI Behavior
      behaviorType: BehaviorType.CHASE,
      attackPattern: AttackPattern.MELEE,
      targetingMode: TargetingMode.NEAREST,

      // Spawn settings
      spawnRadius: 40,
      spawnAnimation: 'fade_in',
    },

    // Turret - Stationary ranged attacker
    turret: {
      id: 'turret',
      name: 'Turret',
      description: 'A stationary turret that fires projectiles at nearby enemies.',
      imageId: 'summon_turret',

      // Combat stats
      damage: 15,
      attackCooldown: 0.5,
      attackRange: 200,
      projectileSpeed: 400,
      projectileSize: 6,
      projectileColor: '#FFDD00',

      // Movement stats
      chaseSpeed: 0, // Stationary
      maxChaseRange: 250,
      returnDistance: 0,

      // Survival stats
      health: 80,
      duration: 20.0,

      // Visual
      size: 24,
      color: '#708090',
      shape: 'square',
      glowColor: '#FFDD00',
      glowRadius: 3,

      // AI Behavior
      behaviorType: BehaviorType.STATIONARY,
      attackPattern: AttackPattern.RANGED,
      targetingMode: TargetingMode.NEAREST,

      // Spawn settings
      spawnRadius: 60,
      spawnAnimation: 'build',
    },

    // Wolf - Fast aggressive melee attacker
    wolf: {
      id: 'wolf',
      name: 'Shadow Wolf',
      description: 'A swift shadow wolf that aggressively hunts down enemies.',
      imageId: 'summon_wolf',

      // Combat stats
      damage: 25,
      attackCooldown: 0.6,
      attackRange: 40,
      critChance: 0.15,
      critMultiplier: 1.5,

      // Movement stats
      chaseSpeed: 220,
      maxChaseRange: 400,
      returnDistance: 250,

      // Survival stats
      health: 35,
      duration: 12.0,

      // Visual
      size: 18,
      color: '#4B0082',
      shape: 'diamond',
      glowColor: '#8844FF',
      glowRadius: 3,

      // AI Behavior
      behaviorType: BehaviorType.CHASE,
      attackPattern: AttackPattern.MELEE,
      targetingMode: TargetingMode.NEAREST,

      // Spawn settings
      spawnRadius: 30,
      spawnAnimation: 'leap_in',
    },

    // Golem - Slow tanky defender
    golem: {
      id: 'golem',
      name: 'Stone Golem',
      description: 'A powerful golem with high health and crushing attacks.',
      imageId: 'summon_golem',

      // Combat stats
      damage: 45,
      attackCooldown: 1.8,
      attackRange: 60,
      knockback: 150,
      stunChance: 0.2,
      stunDuration: 0.5,

      // Movement stats
      chaseSpeed: 80,
      maxChaseRange: 200,
      returnDistance: 150,

      // Survival stats
      health: 150,
      duration: 25.0,
      armor: 10,

      // Visual
      size: 32,
      color: '#8B4513',
      shape: 'square',
      glowColor: '#CD853F',
      glowRadius: 5,

      // AI Behavior
      behaviorType: BehaviorType.CHASE,
      attackPattern: AttackPattern.MELEE,
      targetingMode: TargetingMode.NEAREST,

      // Spawn settings
      spawnRadius: 50,
      spawnAnimation: 'rise_up',
    },

    // Fairy - Small healer/support
    fairy: {
      id: 'fairy',
      name: 'Healing Fairy',
      description: 'A small fairy that heals the player over time.',
      imageId: 'summon_fairy',

      // Combat stats (minimal - focuses on support)
      damage: 5,
      attackCooldown: 2.0,
      attackRange: 30,

      // Support stats
      healAmount: 2,
      healInterval: 1.0,
      healRange: 100,
      buffType: 'regen',

      // Movement stats
      chaseSpeed: 100,
      maxChaseRange: 150,
      returnDistance: 80,

      // Survival stats
      health: 25,
      duration: 30.0,

      // Visual
      size: 12,
      color: '#FFB6C1',
      shape: 'circle',
      glowColor: '#FF69B4',
      glowRadius: 6,

      // AI Behavior
      behaviorType: BehaviorType.FOLLOW,
      attackPattern: AttackPattern.SUPPORT,
      targetingMode: TargetingMode.NEAREST,

      // Spawn settings
      spawnRadius: 20,
      spawnAnimation: 'sparkle',
    },
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get configuration for a specific summon type
   * @param {string} type - Summon type key
   * @returns {Object} Summon configuration object
   */
  function getConfig(type) {
    return SummonTypeConfig[type] || SummonTypeConfig.spirit;
  }

  /**
   * Get all summon type keys
   * @returns {Array<string>}
   */
  function getAllTypes() {
    return Object.keys(SummonTypeConfig);
  }

  /**
   * Check if a summon type exists
   * @param {string} type - Summon type key
   * @returns {boolean}
   */
  function hasType(type) {
    return SummonTypeConfig.hasOwnProperty(type);
  }

  /**
   * Get summons by behavior type
   * @param {string} behaviorType - BehaviorType value
   * @returns {Array<Object>}
   */
  function getSummonsByBehavior(behaviorType) {
    var result = [];
    for (var type in SummonTypeConfig) {
      if (SummonTypeConfig[type].behaviorType === behaviorType) {
        result.push(SummonTypeConfig[type]);
      }
    }
    return result;
  }

  /**
   * Get summons by attack pattern
   * @param {string} attackPattern - AttackPattern value
   * @returns {Array<Object>}
   */
  function getSummonsByAttackPattern(attackPattern) {
    var result = [];
    for (var type in SummonTypeConfig) {
      if (SummonTypeConfig[type].attackPattern === attackPattern) {
        result.push(SummonTypeConfig[type]);
      }
    }
    return result;
  }

  /**
   * Create a summon config with custom overrides
   * @param {string} baseType - Base summon type
   * @param {Object} overrides - Properties to override
   * @returns {Object} Merged configuration
   */
  function createCustomConfig(baseType, overrides) {
    var base = getConfig(baseType);
    var custom = {};

    // Copy base properties
    for (var key in base) {
      if (base.hasOwnProperty(key)) {
        custom[key] = base[key];
      }
    }

    // Apply overrides
    for (var overrideKey in overrides) {
      if (overrides.hasOwnProperty(overrideKey)) {
        custom[overrideKey] = overrides[overrideKey];
      }
    }

    return custom;
  }

  /**
   * Calculate effective stats with level scaling
   * @param {Object} config - Base summon config
   * @param {number} level - Summon level (1-5)
   * @returns {Object} Scaled stats
   */
  function getScaledStats(config, level) {
    var levelMultiplier = 1 + (level - 1) * 0.15;
    var healthMultiplier = 1 + (level - 1) * 0.25;
    var durationBonus = (level - 1) * 2;

    return {
      damage: Math.floor(config.damage * levelMultiplier),
      health: Math.floor(config.health * healthMultiplier),
      duration: config.duration + durationBonus,
      attackCooldown: Math.max(0.2, config.attackCooldown * (1 - (level - 1) * 0.05)),
      attackRange: config.attackRange + (level - 1) * 5,
      chaseSpeed: config.chaseSpeed + (level - 1) * 10,
    };
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.SummonData = {
    SummonType: SummonType,
    BehaviorType: BehaviorType,
    AttackPattern: AttackPattern,
    TargetingMode: TargetingMode,
    SummonTypeConfig: SummonTypeConfig,
    getConfig: getConfig,
    getAllTypes: getAllTypes,
    hasType: hasType,
    getSummonsByBehavior: getSummonsByBehavior,
    getSummonsByAttackPattern: getSummonsByAttackPattern,
    createCustomConfig: createCustomConfig,
    getScaledStats: getScaledStats,
  };
})(window.VampireSurvivors.Data);
