/**
 * @fileoverview Melee weapon behavior - arc/swing attacks around player
 * @module Behaviors/MeleeBehavior
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

  // ============================================
  // Class Definition
  // ============================================
  class MeleeBehavior extends WeaponBehavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _activeSwings = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._activeSwings = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Execute melee weapon behavior
     * @param {Weapon} weapon
     * @param {Entity} player
     * @returns {Array} Swing data
     */
    execute(weapon, player) {
      var playerPos = this.getPlayerCenter(player);

      // Get weapon stats
      var range = weapon.getStat('range', 60);
      var arcAngle = weapon.getStat('arcAngle', 90);
      var swingDuration = weapon.getStat('swingDuration', 0.2);
      var damage = weapon.damage;
      var color = weapon.getStat('color', '#CCCCCC');

      // Get swing direction based on targeting mode
      var direction = this._getSwingDirection(weapon, player, range);
      var centerAngle = direction.angle;

      // Convert arc angle to radians
      var arcRad = this.degreesToRadians(arcAngle);
      var startAngle = centerAngle - arcRad / 2;
      var endAngle = centerAngle + arcRad / 2;

      // Find enemies in arc
      var hitEnemies = this._findEnemiesInArc(playerPos.x, playerPos.y, range, startAngle, endAngle);

      // Apply damage to ALL enemies in arc
      for (var i = 0; i < hitEnemies.length; i++) {
        var enemy = hitEnemies[i];
        var health = enemy.getComponent(Health);
        if (health && !health.isDead) {
          health.takeDamage(damage);

          // Emit hit event
          events.emit('weapon:hit', {
            weapon: weapon,
            enemy: enemy,
            damage: damage,
            type: 'melee',
          });
        }
      }

      // Create swing visual data
      var swingData = {
        x: playerPos.x,
        y: playerPos.y,
        range: range,
        startAngle: startAngle,
        endAngle: endAngle,
        duration: swingDuration,
        elapsed: 0,
        color: color,
        alpha: 0.6,
        progress: 0,
      };

      this._activeSwings.push(swingData);

      return [swingData];
    }

    /**
     * Update active swings
     * @param {number} deltaTime
     */
    update(deltaTime) {
      for (var i = this._activeSwings.length - 1; i >= 0; i--) {
        var swing = this._activeSwings[i];
        swing.elapsed += deltaTime;
        swing.progress = swing.elapsed / swing.duration;

        // Fade out
        swing.alpha = 0.6 * (1 - swing.progress);

        // Remove expired swings
        if (swing.elapsed >= swing.duration) {
          this._activeSwings.splice(i, 1);
        }
      }
    }

    /**
     * Get active swings for rendering
     * @returns {Array}
     */
    getActiveSwings() {
      return this._activeSwings;
    }

    /**
     * Render swings to canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    render(ctx, camera) {
      var cameraX = camera ? camera.x : 0;
      var cameraY = camera ? camera.y : 0;

      for (var i = 0; i < this._activeSwings.length; i++) {
        var swing = this._activeSwings[i];

        ctx.save();
        ctx.globalAlpha = swing.alpha;
        ctx.fillStyle = swing.color;
        ctx.strokeStyle = swing.color;
        ctx.lineWidth = 3;

        // Draw arc (pie slice)
        var screenX = swing.x - cameraX;
        var screenY = swing.y - cameraY;

        // Animate the arc drawing based on progress
        var currentEndAngle = swing.startAngle + (swing.endAngle - swing.startAngle) * Math.min(swing.progress * 2, 1);

        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.arc(screenX, screenY, swing.range, swing.startAngle, currentEndAngle);
        ctx.closePath();
        ctx.fill();

        // Draw arc outline
        ctx.globalAlpha = swing.alpha * 1.5;
        ctx.stroke();

        ctx.restore();
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Get swing direction based on targeting mode
     * @param {Weapon} weapon
     * @param {Entity} player
     * @param {number} range
     * @returns {{x: number, y: number, angle: number}}
     */
    _getSwingDirection(weapon, player, range) {
      var targetingMode = weapon.targetingMode;

      switch (targetingMode) {
        case TargetingMode.NEAREST:
          var nearestEnemy = this.findNearestEnemy(player, range * 2);
          if (nearestEnemy) {
            return this.getDirectionToTarget(player, nearestEnemy);
          }
          return this.getRandomDirection();

        case TargetingMode.WEAKEST:
          var weakestEnemy = this.findWeakestEnemy(player, range * 2);
          if (weakestEnemy) {
            return this.getDirectionToTarget(player, weakestEnemy);
          }
          return this.getRandomDirection();

        case TargetingMode.MOUSE:
          return this.getMouseDirection(player);

        case TargetingMode.RANDOM:
          return this.getRandomDirection();

        default:
          return this.getMouseDirection(player);
      }
    }

    /**
     * Find enemies within an arc sector
     * @param {number} cx - Center X
     * @param {number} cy - Center Y
     * @param {number} radius - Arc radius
     * @param {number} startAngle - Start angle in radians
     * @param {number} endAngle - End angle in radians
     * @returns {Array<Entity>}
     */
    _findEnemiesInArc(cx, cy, radius, startAngle, endAngle) {
      if (!this._entityManager) return [];

      var enemies = this._entityManager.getByTag('enemy');
      var hitEnemies = [];
      var radiusSq = radius * radius;

      // Normalize angles to handle wrap-around
      startAngle = this._normalizeAngle(startAngle);
      endAngle = this._normalizeAngle(endAngle);

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        var ex = transform.centerX;
        var ey = transform.centerY;

        // Check distance
        var dx = ex - cx;
        var dy = ey - cy;
        var distSq = dx * dx + dy * dy;
        var enemyRadius = transform.width / 2;

        if (distSq > (radius + enemyRadius) * (radius + enemyRadius)) {
          continue;
        }

        // Check angle
        var angle = Math.atan2(dy, dx);
        angle = this._normalizeAngle(angle);

        if (this._isAngleInArc(angle, startAngle, endAngle)) {
          hitEnemies.push(enemy);
        }
      }

      return hitEnemies;
    }

    /**
     * Normalize angle to [0, 2π)
     * @param {number} angle
     * @returns {number}
     */
    _normalizeAngle(angle) {
      while (angle < 0) angle += Math.PI * 2;
      while (angle >= Math.PI * 2) angle -= Math.PI * 2;
      return angle;
    }

    /**
     * Check if angle is within arc
     * @param {number} angle
     * @param {number} start
     * @param {number} end
     * @returns {boolean}
     */
    _isAngleInArc(angle, start, end) {
      if (start <= end) {
        return angle >= start && angle <= end;
      } else {
        // Arc wraps around 0
        return angle >= start || angle <= end;
      }
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._activeSwings = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.MeleeBehavior = MeleeBehavior;
})(window.VampireSurvivors.Behaviors);
