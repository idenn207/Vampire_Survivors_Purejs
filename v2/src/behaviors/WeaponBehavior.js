/**
 * @fileoverview Base weapon behavior class - abstract class for weapon execution logic
 * @module Behaviors/WeaponBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var PlayerStats = window.VampireSurvivors.Components.PlayerStats;
  var PlayerData = window.VampireSurvivors.Components.PlayerData;
  var Vector2 = window.VampireSurvivors.Utils.Vector2;
  var GlobalStatsHelper = window.VampireSurvivors.Utils.GlobalStatsHelper;

  // ============================================
  // Class Definition
  // ============================================
  class WeaponBehavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entityManager = null;
    _input = null;
    _events = null;
    _player = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize behavior with dependencies
     * @param {EntityManager} entityManager
     * @param {Input} input
     * @param {EventBus} events
     * @param {Entity} player - Player entity reference
     */
    initialize(entityManager, input, events, player) {
      this._entityManager = entityManager;
      this._input = input;
      this._events = events;
      this._player = player;
    }

    /**
     * Set the player reference (called when player changes)
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Get player stats component
     * @returns {PlayerStats|null}
     */
    _getPlayerStats() {
      if (!this._player) return null;
      return this._player.getComponent(PlayerStats);
    }

    /**
     * Get player data component
     * @returns {PlayerData|null}
     */
    _getPlayerData() {
      if (!this._player) return null;
      return this._player.getComponent(PlayerData);
    }

    /**
     * Get active buff component (Mage's active skill buffs)
     * @returns {ActiveBuff|null}
     */
    _getActiveBuff() {
      if (!this._player) return null;
      var ActiveBuff = window.VampireSurvivors.Components.ActiveBuff;
      if (!ActiveBuff) return null;
      return this._player.getComponent(ActiveBuff);
    }

    /**
     * Execute the weapon behavior (abstract - override in subclass)
     * @param {Weapon} weapon - Weapon component
     * @param {Entity} player - Player entity
     * @returns {Array} Array of spawned entities/effects
     */
    execute(weapon, player) {
      throw new Error('[WeaponBehavior] execute() must be implemented by subclass');
    }

    // ----------------------------------------
    // Targeting Helpers
    // ----------------------------------------
    /**
     * Find the nearest enemy to the player
     * @param {Entity} player
     * @param {number} range - Max search range
     * @returns {Entity|null}
     */
    findNearestEnemy(player, range) {
      if (!this._entityManager) return null;

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return null;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;

      var enemies = this._entityManager.getByTag('enemy');
      var nearest = null;
      var nearestDist = range * range; // Compare squared distances

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distSq = dx * dx + dy * dy;

        if (distSq < nearestDist) {
          nearestDist = distSq;
          nearest = enemy;
        }
      }

      return nearest;
    }

    /**
     * Find the enemy with lowest health
     * @param {Entity} player
     * @param {number} range
     * @returns {Entity|null}
     */
    findWeakestEnemy(player, range) {
      if (!this._entityManager) return null;

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return null;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var rangeSq = range * range;

      var enemies = this._entityManager.getByTag('enemy');
      var weakest = null;
      var lowestHealth = Infinity;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distSq = dx * dx + dy * dy;

        if (distSq > rangeSq) continue;

        var health = enemy.getComponent(Health);
        var currentHealth = health ? health.currentHealth : 1;

        if (currentHealth < lowestHealth) {
          lowestHealth = currentHealth;
          weakest = enemy;
        }
      }

      return weakest;
    }

    /**
     * Find a random enemy within range
     * @param {Entity} player
     * @param {number} range
     * @returns {Entity|null}
     */
    findRandomEnemy(player, range) {
      if (!this._entityManager) return null;

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return null;

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var rangeSq = range * range;

      var enemies = this._entityManager.getByTag('enemy');
      var inRange = [];

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq) {
          inRange.push(enemy);
        }
      }

      if (inRange.length === 0) return null;

      var randomIndex = Math.floor(Math.random() * inRange.length);
      return inRange[randomIndex];
    }

    /**
     * Get all enemies within range
     * @param {Entity} player
     * @param {number} range
     * @returns {Array<Entity>}
     */
    getEnemiesInRange(player, range) {
      if (!this._entityManager) return [];

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return [];

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var rangeSq = range * range;

      var enemies = this._entityManager.getByTag('enemy');
      var inRange = [];

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq) {
          inRange.push(enemy);
        }
      }

      return inRange;
    }

    /**
     * Get direction from player to mouse position (world coordinates)
     * @param {Entity} player
     * @returns {{x: number, y: number, angle: number}}
     */
    getMouseDirection(player) {
      if (!this._input) {
        return { x: 1, y: 0, angle: 0 };
      }

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) {
        return { x: 1, y: 0, angle: 0 };
      }

      // Use mouseWorldPosition which accounts for camera offset
      var mousePos = this._input.mouseWorldPosition;
      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;

      var dx = mousePos.x - playerX;
      var dy = mousePos.y - playerY;
      var length = Math.sqrt(dx * dx + dy * dy);

      if (length === 0) {
        return { x: 1, y: 0, angle: 0 };
      }

      return {
        x: dx / length,
        y: dy / length,
        angle: Math.atan2(dy, dx),
      };
    }

    /**
     * Get direction based on auto mode (uses last movement direction)
     * @returns {{x: number, y: number, angle: number}}
     */
    getAutoModeDirection() {
      if (!this._input) {
        return { x: 1, y: 0, angle: 0 };
      }

      var lastDir = this._input.lastMovementDirection;
      return {
        x: lastDir.x,
        y: lastDir.y,
        angle: Math.atan2(lastDir.y, lastDir.x),
      };
    }

    /**
     * Get direction from player to a target entity
     * @param {Entity} player
     * @param {Entity} target
     * @returns {{x: number, y: number, angle: number}}
     */
    getDirectionToTarget(player, target) {
      var playerTransform = player.getComponent(Transform);
      var targetTransform = target.getComponent(Transform);

      if (!playerTransform || !targetTransform) {
        return { x: 1, y: 0, angle: 0 };
      }

      var dx = targetTransform.centerX - playerTransform.centerX;
      var dy = targetTransform.centerY - playerTransform.centerY;
      var length = Math.sqrt(dx * dx + dy * dy);

      if (length === 0) {
        return { x: 1, y: 0, angle: 0 };
      }

      return {
        x: dx / length,
        y: dy / length,
        angle: Math.atan2(dy, dx),
      };
    }

    /**
     * Get a random direction
     * @returns {{x: number, y: number, angle: number}}
     */
    getRandomDirection() {
      var angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
        angle: angle,
      };
    }

    // ----------------------------------------
    // Damage Helpers
    // ----------------------------------------
    /**
     * Calculate damage (with player stats applied)
     * Formula: (Player Base Attack + Weapon Damage) × Damage Multiplier
     * @param {Weapon} weapon
     * @param {number} [critChance] - Override critical hit chance (0-1)
     * @param {number} [critMultiplier] - Override critical damage multiplier
     * @returns {{damage: number, isCrit: boolean}}
     */
    calculateDamage(weapon, critChance, critMultiplier) {
      var playerStats = this._getPlayerStats();
      var playerData = this._getPlayerData();
      var activeBuff = this._getActiveBuff();
      var weaponDamage = weapon.damage;

      // Get player base attack from character selection (default 10 if no character)
      var playerBaseAttack = playerData ? playerData.baseAttack : 10;

      // Get damage multiplier including ActiveBuff bonus (Mage's attack buff)
      var damageMultiplier = GlobalStatsHelper.getDamageMultiplierWithBuff(playerStats, activeBuff);
      var effectiveDamage = (playerBaseAttack + weaponDamage) * damageMultiplier;

      // Get crit stats from weapon if not provided as parameters
      // Default base crit chance is 5% for weapons without explicit critChance
      var baseCritChance = critChance !== undefined ? critChance : weapon.getStat('critChance', 0.05);
      var baseCritMultiplier = critMultiplier !== undefined ? critMultiplier : weapon.getStat('critMultiplier', 2);

      // Add player character's base crit chance
      var playerBaseCrit = playerData ? playerData.baseCritChance : 0;
      baseCritChance += playerBaseCrit;

      // Add player character's passive crit damage bonus (Rogue)
      var passiveCritBonus = playerData ? playerData.getCritDamageBonus() : 0;

      // Apply player crit chance and multiplier bonuses from stat upgrades + ActiveBuff
      var effectiveCritChance = GlobalStatsHelper.getEffectiveCritChanceWithBuff(baseCritChance, playerStats, activeBuff);
      var effectiveCritMultiplier = GlobalStatsHelper.getEffectiveCritMultiplierWithBuff(baseCritMultiplier, playerStats, activeBuff) + passiveCritBonus;

      var isCrit = false;
      if (effectiveCritChance > 0 && Math.random() < effectiveCritChance) {
        isCrit = true;
        effectiveDamage *= effectiveCritMultiplier;
      }

      return {
        damage: Math.floor(effectiveDamage),
        isCrit: isCrit,
      };
    }

    /**
     * Get effective range with player stats applied
     * @param {number} baseRange - Base weapon range
     * @returns {number} Effective range
     */
    getEffectiveRange(baseRange) {
      var playerStats = this._getPlayerStats();
      return GlobalStatsHelper.getEffectiveRange(baseRange, playerStats);
    }

    /**
     * Get effective duration with player stats and ActiveBuff applied
     * @param {number} baseDuration - Base effect duration
     * @returns {number} Effective duration
     */
    getEffectiveDuration(baseDuration) {
      var playerStats = this._getPlayerStats();
      var activeBuff = this._getActiveBuff();
      return GlobalStatsHelper.getEffectiveDurationWithBuff(baseDuration, playerStats, activeBuff);
    }

    /**
     * Get size multiplier from player stats
     * @returns {number} Size multiplier
     */
    getSizeMultiplier() {
      var playerStats = this._getPlayerStats();
      return GlobalStatsHelper.getSizeMultiplier(playerStats);
    }

    // ----------------------------------------
    // Utility Helpers
    // ----------------------------------------
    /**
     * Get player center position
     * @param {Entity} player
     * @returns {{x: number, y: number}}
     */
    getPlayerCenter(player) {
      var transform = player.getComponent(Transform);
      if (!transform) {
        return { x: 0, y: 0 };
      }
      return {
        x: transform.centerX,
        y: transform.centerY,
      };
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees
     * @returns {number}
     */
    degreesToRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }

    /**
     * Convert radians to degrees
     * @param {number} radians
     * @returns {number}
     */
    radiansToDegrees(radians) {
      return (radians * 180) / Math.PI;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._entityManager = null;
      this._input = null;
      this._events = null;
      this._player = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.WeaponBehavior = WeaponBehavior;
})(window.VampireSurvivors.Behaviors = window.VampireSurvivors.Behaviors || {});
