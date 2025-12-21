/**
 * @fileoverview Laser weapon behavior - instant line-based damage
 * @module Behaviors/LaserBehavior
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
  var events = window.VampireSurvivors.Core.events;
  var EffectHandlers = window.VampireSurvivors.Systems.EffectHandlers;

  // ============================================
  // Class Definition
  // ============================================
  class LaserBehavior extends WeaponBehavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _activeLasers = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._activeLasers = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Execute laser weapon behavior
     * @param {Weapon} weapon
     * @param {Entity} player
     * @returns {Array} Laser data for rendering
     */
    execute(weapon, player) {
      var playerPos = this.getPlayerCenter(player);

      // Get weapon stats
      var baseRange = weapon.getStat('range', 800);
      var baseWidth = weapon.getStat('width', 5);
      var baseDuration = weapon.getStat('duration', 0.5);
      var color = weapon.getStat('color', '#00FFFF');

      // Apply player stat bonuses
      var range = this.getEffectiveRange(baseRange);
      var width = Math.round(baseWidth * this.getSizeMultiplier());
      var duration = this.getEffectiveDuration(baseDuration);
      var damageResult = this.calculateDamage(weapon);
      var damage = damageResult.damage;
      var isCrit = damageResult.isCrit;

      // Get direction based on targeting mode
      var direction = this._getDirection(weapon, player, range);
      if (!direction) {
        return [];
      }

      // Calculate laser end point
      var endX = playerPos.x + direction.x * range;
      var endY = playerPos.y + direction.y * range;

      // Find all enemies hit by the laser
      var hitEnemies = this._findEnemiesOnLine(playerPos.x, playerPos.y, endX, endY, width);

      // Apply damage to all hit enemies
      for (var i = 0; i < hitEnemies.length; i++) {
        var enemy = hitEnemies[i];
        var health = enemy.getComponent(Health);
        if (health && !health.isDead) {
          health.takeDamage(damage, isCrit);

          // Emit hit event
          events.emit('weapon:hit', {
            weapon: weapon,
            enemy: enemy,
            damage: damage,
            isCrit: isCrit,
            type: 'laser',
          });
        }
      }

      // Process healOnHit for laser weapons (heal once per laser fire if enemies hit)
      var healOnHit = weapon.getStat('healOnHit', 0);
      if (healOnHit > 0 && hitEnemies.length > 0 && EffectHandlers) {
        EffectHandlers.processHealOnHit(player, healOnHit);
      }

      // Create laser visual data
      var laserData = {
        startX: playerPos.x,
        startY: playerPos.y,
        endX: endX,
        endY: endY,
        width: width,
        color: color,
        duration: duration,
        elapsed: 0,
        alpha: 1,
      };

      this._activeLasers.push(laserData);

      return [laserData];
    }

    /**
     * Update active lasers (for visual effects)
     * @param {number} deltaTime
     */
    update(deltaTime) {
      for (var i = this._activeLasers.length - 1; i >= 0; i--) {
        var laser = this._activeLasers[i];
        laser.elapsed += deltaTime;

        // Fade out
        laser.alpha = 1 - laser.elapsed / laser.duration;

        // Remove expired lasers
        if (laser.elapsed >= laser.duration) {
          this._activeLasers.splice(i, 1);
        }
      }
    }

    /**
     * Get active lasers for rendering
     * @returns {Array}
     */
    getActiveLasers() {
      return this._activeLasers;
    }

    /**
     * Render lasers to canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    render(ctx, camera) {
      var cameraX = camera ? camera.x : 0;
      var cameraY = camera ? camera.y : 0;

      for (var i = 0; i < this._activeLasers.length; i++) {
        var laser = this._activeLasers[i];

        ctx.save();
        ctx.globalAlpha = laser.alpha;
        ctx.strokeStyle = laser.color;
        ctx.lineWidth = laser.width;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(laser.startX - cameraX, laser.startY - cameraY);
        ctx.lineTo(laser.endX - cameraX, laser.endY - cameraY);
        ctx.stroke();

        // Glow effect
        ctx.globalAlpha = laser.alpha * 0.3;
        ctx.lineWidth = laser.width * 3;
        ctx.stroke();

        ctx.restore();
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Get direction based on targeting mode
     * @param {Weapon} weapon
     * @param {Entity} player
     * @param {number} range
     * @returns {{x: number, y: number, angle: number}|null}
     */
    _getDirection(weapon, player, range) {
      var targetingMode = weapon.targetingMode;

      switch (targetingMode) {
        case TargetingMode.NEAREST:
          var nearestEnemy = this.findNearestEnemy(player, range);
          if (nearestEnemy) {
            return this.getDirectionToTarget(player, nearestEnemy);
          }
          return null;

        case TargetingMode.WEAKEST:
          var weakestEnemy = this.findWeakestEnemy(player, range);
          if (weakestEnemy) {
            return this.getDirectionToTarget(player, weakestEnemy);
          }
          return null;

        case TargetingMode.MOUSE:
          // In auto mode, use movement direction; in manual mode, use mouse
          if (this._input && this._input.isAutoMode) {
            return this.getAutoModeDirection();
          }
          return this.getMouseDirection(player);

        case TargetingMode.RANDOM:
          var randomEnemy = this.findRandomEnemy(player, range);
          if (randomEnemy) {
            return this.getDirectionToTarget(player, randomEnemy);
          }
          return this.getRandomDirection();

        default:
          // In auto mode, use movement direction; in manual mode, use mouse
          if (this._input && this._input.isAutoMode) {
            return this.getAutoModeDirection();
          }
          return this.getMouseDirection(player);
      }
    }

    /**
     * Find enemies along a line
     * @param {number} x1 - Start X
     * @param {number} y1 - Start Y
     * @param {number} x2 - End X
     * @param {number} y2 - End Y
     * @param {number} width - Line width
     * @returns {Array<Entity>}
     */
    _findEnemiesOnLine(x1, y1, x2, y2, width) {
      if (!this._entityManager) return [];

      var enemies = this._entityManager.getByTag('enemy');
      var hitEnemies = [];
      var halfWidth = width / 2;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        var enemyX = transform.centerX;
        var enemyY = transform.centerY;

        // Calculate distance from enemy to line
        var dist = this._pointToLineDistance(enemyX, enemyY, x1, y1, x2, y2);

        // Check if enemy is within laser width
        var enemyRadius = transform.width / 2;
        if (dist <= halfWidth + enemyRadius) {
          hitEnemies.push(enemy);
        }
      }

      return hitEnemies;
    }

    /**
     * Calculate perpendicular distance from point to line segment
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @param {number} x1 - Line start X
     * @param {number} y1 - Line start Y
     * @param {number} x2 - Line end X
     * @param {number} y2 - Line end Y
     * @returns {number}
     */
    _pointToLineDistance(px, py, x1, y1, x2, y2) {
      var dx = x2 - x1;
      var dy = y2 - y1;
      var lengthSq = dx * dx + dy * dy;

      if (lengthSq === 0) {
        // Line is a point
        var ddx = px - x1;
        var ddy = py - y1;
        return Math.sqrt(ddx * ddx + ddy * ddy);
      }

      // Project point onto line
      var t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
      var projX = x1 + t * dx;
      var projY = y1 + t * dy;

      var distX = px - projX;
      var distY = py - projY;
      return Math.sqrt(distX * distX + distY * distY);
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._activeLasers = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.LaserBehavior = LaserBehavior;
})(window.VampireSurvivors.Behaviors);
