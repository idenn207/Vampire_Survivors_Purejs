/**
 * @fileoverview Enemy data - configures different enemy types and their behaviors
 * @module Data/EnemyData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Enemy Type Identifiers
  // ============================================
  var EnemyType = Object.freeze({
    NORMAL: 'normal',
    FAST: 'fast',
    FLYING: 'flying',
    SELF_DESTRUCT: 'self_destruct',
    INVISIBLE: 'invisible',
    DASH_ATTACK: 'dash_attack',
    PROJECTILE: 'projectile',
    JUMP_DROP: 'jump_drop',
  });

  // ============================================
  // Enemy Type Configurations
  // ============================================
  var EnemyTypeConfig = {
    // Normal enemy - basic chase AI
    normal: {
      name: 'Normal',
      baseHealth: 30,
      baseSpeed: 100,
      baseDamage: 10,
      size: 24,
      color: '#FF0000',
      behavior: 'chase',
      spawnWeight: 50,
      startWave: 1,
      imageId: 'enemy_normal',
    },

    // Fast enemy - higher speed, lower health
    fast: {
      name: 'Fast Runner',
      baseHealth: 15,
      baseSpeed: 180,
      baseDamage: 8,
      size: 20,
      color: '#FF66FF',
      behavior: 'chase',
      spawnWeight: 30,
      startWave: 2,
      imageId: 'enemy_fast',
    },

    // Flying enemy - chase with sinusoidal hover
    flying: {
      name: 'Flying Eye',
      baseHealth: 25,
      baseSpeed: 120,
      baseDamage: 12,
      size: 22,
      color: '#00CCFF',
      behavior: 'flying',
      spawnWeight: 20,
      startWave: 3,
      imageId: 'enemy_flying',
      // Flying-specific config
      hoverAmplitude: 30,
      hoverFrequency: 2,
    },

    // Self-destruct enemy - explodes when close
    self_destruct: {
      name: 'Bomber',
      baseHealth: 40,
      baseSpeed: 80,
      baseDamage: 5,
      size: 28,
      color: '#FF6600',
      behavior: 'self_destruct',
      spawnWeight: 15,
      startWave: 4,
      imageId: 'enemy_self_destruct',
      // Self-destruct specific config
      explosionRadius: 60,
      explosionDamage: 30,
      fuseTime: 3.0,
      triggerRadius: 50,
    },

    // Invisible enemy - visible only when close
    invisible: {
      name: 'Shade',
      baseHealth: 20,
      baseSpeed: 90,
      baseDamage: 18,
      size: 24,
      color: '#FFFFFF',
      behavior: 'invisible',
      spawnWeight: 15,
      startWave: 5,
      imageId: 'enemy_invisible',
      // Invisible-specific config
      visibilityRadius: 120,
      fadeSpeed: 2.0,
      minAlpha: 0.1,
    },

    // Dash attack enemy - charges at player
    dash_attack: {
      name: 'Charger',
      baseHealth: 35,
      baseSpeed: 60,
      baseDamage: 20,
      size: 26,
      color: '#CC0000',
      behavior: 'dash_attack',
      spawnWeight: 20,
      startWave: 5,
      imageId: 'enemy_dash_attack',
      // Dash-specific config
      chargeTime: 1.0,
      dashSpeed: 400,
      dashDuration: 0.5,
      dashCooldown: 3.0,
      dashRange: 200,
    },

    // Projectile enemy - fires at player from range
    projectile: {
      name: 'Spitter',
      baseHealth: 30,
      baseSpeed: 50,
      baseDamage: 5,
      size: 26,
      color: '#00FF00',
      behavior: 'projectile',
      spawnWeight: 15,
      startWave: 6,
      imageId: 'enemy_projectile',
      // Projectile-specific config
      projectileSpeed: 180,
      projectileDamage: 15,
      projectileSize: 10,
      projectileColor: '#88FF00',
      fireRate: 2.0,
      attackRange: 300,
      retreatRange: 150,
    },

    // Jump/drop enemy - jumps to player position
    jump_drop: {
      name: 'Jumper',
      baseHealth: 45,
      baseSpeed: 0,
      baseDamage: 25,
      size: 30,
      color: '#8800FF',
      behavior: 'jump_drop',
      spawnWeight: 10,
      startWave: 7,
      imageId: 'enemy_jump_drop',
      // Jump-specific config
      jumpHeight: 200,
      jumpDuration: 1.0,
      jumpCooldown: 2.5,
      landingRadius: 40,
      shadowSize: 24,
    },
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get available enemy types for a specific wave
   * @param {number} waveNumber - Current wave number
   * @returns {Array<string>} Array of enemy type keys
   */
  function getEnemyTypesForWave(waveNumber) {
    var types = [];
    for (var type in EnemyTypeConfig) {
      if (EnemyTypeConfig[type].startWave <= waveNumber) {
        types.push(type);
      }
    }
    return types;
  }

  /**
   * Select a random enemy type based on wave and spawn weights
   * @param {number} waveNumber - Current wave number
   * @returns {string} Selected enemy type key
   */
  function selectRandomType(waveNumber) {
    var types = getEnemyTypesForWave(waveNumber);
    if (types.length === 0) {
      return 'normal';
    }

    // Calculate total weight
    var totalWeight = 0;
    for (var i = 0; i < types.length; i++) {
      totalWeight += EnemyTypeConfig[types[i]].spawnWeight;
    }

    // Roll and select
    var roll = Math.random() * totalWeight;
    var cumulative = 0;
    for (var j = 0; j < types.length; j++) {
      cumulative += EnemyTypeConfig[types[j]].spawnWeight;
      if (roll < cumulative) {
        return types[j];
      }
    }

    return 'normal';
  }

  /**
   * Get configuration for a specific enemy type
   * @param {string} type - Enemy type key
   * @returns {Object} Enemy configuration object
   */
  function getConfig(type) {
    return EnemyTypeConfig[type] || EnemyTypeConfig.normal;
  }

  /**
   * Get all enemy type keys
   * @returns {Array<string>} Array of all enemy type keys
   */
  function getAllTypes() {
    return Object.keys(EnemyTypeConfig);
  }

  /**
   * Check if an enemy type exists
   * @param {string} type - Enemy type key
   * @returns {boolean} True if type exists
   */
  function hasType(type) {
    return EnemyTypeConfig.hasOwnProperty(type);
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.EnemyData = {
    EnemyType: EnemyType,
    EnemyTypeConfig: EnemyTypeConfig,
    getEnemyTypesForWave: getEnemyTypesForWave,
    selectRandomType: selectRandomType,
    getConfig: getConfig,
    getAllTypes: getAllTypes,
    hasType: hasType,
  };
})(window.VampireSurvivors.Data);
