/**
 * @fileoverview Projectile weapon behavior - spawns projectiles from pool
 * @module Behaviors/ProjectileBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponBehavior = Behaviors.WeaponBehavior;
  var TargetingMode = window.VampireSurvivors.Data.TargetingMode;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var projectilePool = window.VampireSurvivors.Pool.projectilePool;

  // ============================================
  // Class Definition
  // ============================================
  class ProjectileBehavior extends WeaponBehavior {
    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Execute projectile weapon behavior
     * @param {Weapon} weapon
     * @param {Entity} player
     * @returns {Array<Projectile>} Spawned projectiles
     */
    execute(weapon, player) {
      var projectiles = [];
      var playerPos = this.getPlayerCenter(player);

      // Get weapon stats
      var count = weapon.getStat('projectileCount', 1);
      var speed = weapon.getStat('projectileSpeed', 400);
      var spread = weapon.getStat('spread', 0);
      var pierce = weapon.getStat('pierce', 0);
      var color = weapon.getStat('color', '#FFFF00');
      var size = weapon.getStat('size', 8);
      var lifetime = weapon.getStat('lifetime', 3.0);
      var range = weapon.getStat('range', 400);
      var damage = weapon.damage;

      // Get ricochet config if present
      var ricochet = weapon.getStat('ricochet', null);

      var targetingMode = weapon.targetingMode;

      // For auto-targeting modes with no spread, target multiple enemies
      var isAutoTargeting =
        targetingMode === TargetingMode.NEAREST ||
        targetingMode === TargetingMode.WEAKEST ||
        targetingMode === TargetingMode.RANDOM;

      if (isAutoTargeting && spread === 0 && count > 1) {
        // Multi-target mode: each projectile targets a different enemy
        return this._spawnMultiTargetProjectiles(
          weapon,
          player,
          playerPos,
          count,
          speed,
          damage,
          pierce,
          color,
          size,
          lifetime,
          range,
          ricochet
        );
      }

      // Standard mode: spread-based projectiles
      var baseDirection = this._getBaseDirection(weapon, player, range);
      if (!baseDirection) {
        return projectiles; // No valid target
      }

      var baseAngle = baseDirection.angle;

      // Calculate spread angles for multiple projectiles
      var spreadRad = this.degreesToRadians(spread);
      var angles = this._calculateSpreadAngles(count, baseAngle, spreadRad);

      // Spawn projectiles
      for (var i = 0; i < angles.length; i++) {
        var projectile = projectilePool.spawn(
          playerPos.x,
          playerPos.y,
          angles[i],
          speed,
          damage,
          pierce,
          color,
          size,
          lifetime,
          weapon.id,
          ricochet
        );

        if (projectile) {
          projectiles.push(projectile);
        }
      }

      return projectiles;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Get the base direction based on targeting mode
     * @param {Weapon} weapon
     * @param {Entity} player
     * @param {number} range
     * @returns {{x: number, y: number, angle: number}|null}
     */
    _getBaseDirection(weapon, player, range) {
      var targetingMode = weapon.targetingMode;

      switch (targetingMode) {
        case TargetingMode.NEAREST:
          var nearestEnemy = this.findNearestEnemy(player, range);
          if (nearestEnemy) {
            return this.getDirectionToTarget(player, nearestEnemy);
          }
          return null; // No enemy in range

        case TargetingMode.WEAKEST:
          var weakestEnemy = this.findWeakestEnemy(player, range);
          if (weakestEnemy) {
            return this.getDirectionToTarget(player, weakestEnemy);
          }
          return null;

        case TargetingMode.RANDOM:
          var randomEnemy = this.findRandomEnemy(player, range);
          if (randomEnemy) {
            return this.getDirectionToTarget(player, randomEnemy);
          }
          // Fall back to random direction if no enemy
          return this.getRandomDirection();

        case TargetingMode.MOUSE:
          // In auto mode, use movement direction; in manual mode, use mouse
          if (this._input && this._input.isAutoMode) {
            return this.getAutoModeDirection();
          }
          return this.getMouseDirection(player);

        default:
          return this.getRandomDirection();
      }
    }

    /**
     * Spawn projectiles targeting multiple different enemies
     * @param {Weapon} weapon
     * @param {Entity} player
     * @param {{x: number, y: number}} playerPos
     * @param {number} count
     * @param {number} speed
     * @param {number} damage
     * @param {number} pierce
     * @param {string} color
     * @param {number} size
     * @param {number} lifetime
     * @param {number} range
     * @param {Object} [ricochet]
     * @returns {Array<Projectile>}
     */
    _spawnMultiTargetProjectiles(
      weapon,
      player,
      playerPos,
      count,
      speed,
      damage,
      pierce,
      color,
      size,
      lifetime,
      range,
      ricochet
    ) {
      var projectiles = [];
      var targetingMode = weapon.targetingMode;

      // Find multiple enemies based on targeting mode
      var targets = this._findMultipleEnemies(player, range, count, targetingMode);

      if (targets.length === 0) {
        return projectiles; // No enemies in range
      }

      // Spawn a projectile for each target
      for (var i = 0; i < count; i++) {
        // Cycle through targets if we have more projectiles than enemies
        var targetIndex = i % targets.length;
        var target = targets[targetIndex];

        var direction = this.getDirectionToTarget(player, target);

        var projectile = projectilePool.spawn(
          playerPos.x,
          playerPos.y,
          direction.angle,
          speed,
          damage,
          pierce,
          color,
          size,
          lifetime,
          weapon.id,
          ricochet
        );

        if (projectile) {
          projectiles.push(projectile);
        }
      }

      return projectiles;
    }

    /**
     * Find multiple enemies sorted by targeting mode criteria
     * @param {Entity} player
     * @param {number} range
     * @param {number} count - Max number of enemies to find
     * @param {string} targetingMode
     * @returns {Array<Entity>}
     */
    _findMultipleEnemies(player, range, count, targetingMode) {
      if (!this._entityManager) return [];

      var playerTransform = player.getComponent(Transform);
      if (!playerTransform) return [];

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var rangeSq = range * range;

      var enemies = this._entityManager.getByTag('enemy');
      var validEnemies = [];

      // Collect all valid enemies in range with their distance/health
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

        validEnemies.push({
          enemy: enemy,
          distSq: distSq,
          health: currentHealth,
        });
      }

      // Sort based on targeting mode
      if (targetingMode === TargetingMode.NEAREST) {
        // Sort by distance (nearest first)
        validEnemies.sort(function (a, b) {
          return a.distSq - b.distSq;
        });
      } else if (targetingMode === TargetingMode.WEAKEST) {
        // Sort by health (lowest first)
        validEnemies.sort(function (a, b) {
          return a.health - b.health;
        });
      } else if (targetingMode === TargetingMode.RANDOM) {
        // Shuffle randomly
        for (var j = validEnemies.length - 1; j > 0; j--) {
          var k = Math.floor(Math.random() * (j + 1));
          var temp = validEnemies[j];
          validEnemies[j] = validEnemies[k];
          validEnemies[k] = temp;
        }
      }

      // Return up to 'count' enemies
      var result = [];
      for (var m = 0; m < Math.min(count, validEnemies.length); m++) {
        result.push(validEnemies[m].enemy);
      }

      return result;
    }

    /**
     * Calculate spread angles for multiple projectiles
     * @param {number} count - Number of projectiles
     * @param {number} baseAngle - Base angle in radians
     * @param {number} spreadRad - Total spread in radians
     * @returns {Array<number>} Array of angles
     */
    _calculateSpreadAngles(count, baseAngle, spreadRad) {
      var angles = [];

      if (count === 1 || spreadRad === 0) {
        angles.push(baseAngle);
        return angles;
      }

      // Distribute projectiles evenly across the spread
      var startAngle = baseAngle - spreadRad / 2;
      var angleStep = spreadRad / (count - 1);

      for (var i = 0; i < count; i++) {
        angles.push(startAngle + angleStep * i);
      }

      return angles;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.ProjectileBehavior = ProjectileBehavior;
})(window.VampireSurvivors.Behaviors);
