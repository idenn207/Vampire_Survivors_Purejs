/**
 * @fileoverview Thrust weapon behavior - forward extension/retraction attacks
 * @module Behaviors/ThrustBehavior
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
  class ThrustBehavior extends WeaponBehavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _activeThrusts = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._activeThrusts = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Execute thrust weapon behavior
     * @param {Weapon} weapon
     * @param {Entity} player
     * @returns {Array} Thrust data
     */
    execute(weapon, player) {
      var playerPos = this.getPlayerCenter(player);

      // Get thrust style ('punch' or 'scythe')
      var thrustStyle = weapon.getStat('thrustStyle', 'punch');

      // Get timing stats
      var thrustDuration = weapon.getStat('thrustDuration', thrustStyle === 'punch' ? 0.15 : 0.35);
      var extendTime = weapon.getStat('extendTime', thrustStyle === 'punch' ? 0.4 : 0.3);
      var holdTime = weapon.getStat('holdTime', thrustStyle === 'punch' ? 0 : 0.25);
      var retractTime = weapon.getStat('retractTime', thrustStyle === 'punch' ? 0.6 : 0.45);

      // Get size stats
      var baseRange = weapon.getStat('range', thrustStyle === 'punch' ? 50 : 100);
      var thrustWidth = weapon.getStat('thrustWidth', thrustStyle === 'punch' ? 30 : 20);
      var coneExpansion = weapon.getStat('coneExpansion', thrustStyle === 'punch' ? 1.0 : 3.0);

      // Get visual stats
      var color = weapon.getStat('color', '#FFFFFF');
      var thrustImageId = weapon.getStat('thrustImageId', null) || weapon.getStat('meleeImageId', null);

      // Apply player stat bonuses
      var range = this.getEffectiveRange(baseRange);
      var damageResult = this.calculateDamage(weapon);
      var damage = damageResult.damage;
      var isCrit = damageResult.isCrit;

      // Apply size multiplier to thrust width
      var sizeMultiplier = this.getSizeMultiplier();
      thrustWidth *= sizeMultiplier;

      // Get thrust direction based on targeting mode
      var direction = this._getThrustDirection(weapon, player, range);

      // Create thrust data
      var thrustData = {
        x: playerPos.x,
        y: playerPos.y,
        direction: direction,
        range: range,
        currentExtension: 0,
        thrustStyle: thrustStyle,
        thrustWidth: thrustWidth,
        coneExpansion: coneExpansion,
        duration: thrustDuration,
        elapsed: 0,
        phase: 'extend',
        phaseTimes: {
          extend: extendTime,
          hold: holdTime,
          retract: retractTime,
        },
        damage: damage,
        isCrit: isCrit,
        weapon: weapon,
        hitEnemies: new Set(),
        color: color,
        alpha: 0.7,
        imageId: thrustImageId,
      };

      this._activeThrusts.push(thrustData);

      return [thrustData];
    }

    /**
     * Update active thrusts
     * @param {number} deltaTime
     */
    update(deltaTime) {
      for (var i = this._activeThrusts.length - 1; i >= 0; i--) {
        var thrust = this._activeThrusts[i];
        thrust.elapsed += deltaTime;

        // Update phase and extension
        this._updateThrustPhase(thrust);

        // Apply damage to enemies in hitbox
        this._applyThrustDamage(thrust);

        // Update alpha based on phase
        if (thrust.phase === 'retract') {
          var retractProgress = this._getRetractProgress(thrust);
          thrust.alpha = 0.7 * (1 - retractProgress);
        }

        // Remove completed thrusts
        if (thrust.elapsed >= thrust.duration) {
          this._activeThrusts.splice(i, 1);
        }
      }
    }

    /**
     * Get active thrusts for rendering
     * @returns {Array}
     */
    getActiveThrusts() {
      return this._activeThrusts;
    }

    /**
     * Render thrusts to canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    render(ctx, camera) {
      var cameraX = camera ? camera.x : 0;
      var cameraY = camera ? camera.y : 0;

      for (var i = 0; i < this._activeThrusts.length; i++) {
        var thrust = this._activeThrusts[i];
        var screenX = thrust.x - cameraX;
        var screenY = thrust.y - cameraY;

        if (thrust.alpha <= 0 || thrust.currentExtension <= 0) continue;

        ctx.save();
        ctx.globalAlpha = thrust.alpha;
        ctx.translate(screenX, screenY);
        ctx.rotate(thrust.direction.angle);

        if (thrust.thrustStyle === 'punch') {
          this._renderPunchThrust(ctx, thrust);
        } else {
          this._renderScytheThrust(ctx, thrust);
        }

        ctx.restore();
      }
    }

    // ----------------------------------------
    // Private Methods - Phase Management
    // ----------------------------------------
    /**
     * Update thrust phase and current extension
     * @param {Object} thrust
     */
    _updateThrustPhase(thrust) {
      var progress = thrust.elapsed / thrust.duration;
      var extendEnd = thrust.phaseTimes.extend;
      var holdEnd = extendEnd + thrust.phaseTimes.hold;

      if (progress < extendEnd) {
        // Extending phase
        thrust.phase = 'extend';
        var extendProgress = progress / extendEnd;
        thrust.currentExtension = this._easeOutQuad(extendProgress) * thrust.range;
      } else if (progress < holdEnd) {
        // Hold phase
        thrust.phase = 'hold';
        thrust.currentExtension = thrust.range;
      } else {
        // Retract phase
        thrust.phase = 'retract';
        var retractProgress = (progress - holdEnd) / thrust.phaseTimes.retract;
        retractProgress = Math.min(retractProgress, 1);
        thrust.currentExtension = thrust.range * (1 - this._easeInQuad(retractProgress));
      }
    }

    /**
     * Get retract phase progress (0-1)
     * @param {Object} thrust
     * @returns {number}
     */
    _getRetractProgress(thrust) {
      var progress = thrust.elapsed / thrust.duration;
      var holdEnd = thrust.phaseTimes.extend + thrust.phaseTimes.hold;
      var retractProgress = (progress - holdEnd) / thrust.phaseTimes.retract;
      return Math.max(0, Math.min(1, retractProgress));
    }

    // ----------------------------------------
    // Private Methods - Damage
    // ----------------------------------------
    /**
     * Apply damage to enemies in thrust hitbox
     * @param {Object} thrust
     */
    _applyThrustDamage(thrust) {
      var enemies;
      if (thrust.thrustStyle === 'punch') {
        enemies = this._findEnemiesInRectangle(thrust);
      } else {
        enemies = this._findEnemiesInCone(thrust);
      }

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        // Only hit each enemy once per thrust
        if (thrust.hitEnemies.has(enemy.id)) continue;
        thrust.hitEnemies.add(enemy.id);

        var health = enemy.getComponent(Health);
        if (health && !health.isDead) {
          health.takeDamage(thrust.damage, thrust.isCrit);

          // Emit hit event
          events.emit('weapon:hit', {
            weapon: thrust.weapon,
            enemy: enemy,
            damage: thrust.damage,
            isCrit: thrust.isCrit,
            type: 'thrust',
          });
        }
      }
    }

    // ----------------------------------------
    // Private Methods - Hit Detection
    // ----------------------------------------
    /**
     * Find enemies in rectangle hitbox (punch style)
     * @param {Object} thrust
     * @returns {Array<Entity>}
     */
    _findEnemiesInRectangle(thrust) {
      if (!this._entityManager) return [];

      var enemies = this._entityManager.getByTag('enemy');
      var hitEnemies = [];

      var cos = Math.cos(thrust.direction.angle);
      var sin = Math.sin(thrust.direction.angle);
      var halfWidth = thrust.thrustWidth / 2;
      var length = thrust.currentExtension;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        // Get enemy position relative to thrust origin
        var dx = transform.centerX - thrust.x;
        var dy = transform.centerY - thrust.y;

        // Transform to thrust's local coordinate system
        var localX = dx * cos + dy * sin;
        var localY = -dx * sin + dy * cos;

        var enemyRadius = transform.width / 2;

        // Check if enemy is within rectangle bounds
        if (
          localX >= -enemyRadius &&
          localX <= length + enemyRadius &&
          localY >= -halfWidth - enemyRadius &&
          localY <= halfWidth + enemyRadius
        ) {
          hitEnemies.push(enemy);
        }
      }

      return hitEnemies;
    }

    /**
     * Find enemies in cone hitbox (scythe style)
     * @param {Object} thrust
     * @returns {Array<Entity>}
     */
    _findEnemiesInCone(thrust) {
      if (!this._entityManager) return [];

      var enemies = this._entityManager.getByTag('enemy');
      var hitEnemies = [];

      var cos = Math.cos(thrust.direction.angle);
      var sin = Math.sin(thrust.direction.angle);
      var baseHalfWidth = thrust.thrustWidth / 2;
      var length = thrust.currentExtension;

      if (length <= 0) return [];

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        // Get enemy position relative to thrust origin
        var dx = transform.centerX - thrust.x;
        var dy = transform.centerY - thrust.y;

        // Transform to thrust's local coordinate system
        var localX = dx * cos + dy * sin;
        var localY = -dx * sin + dy * cos;

        var enemyRadius = transform.width / 2;

        // Check if enemy is in front (within length)
        if (localX < -enemyRadius || localX > length + enemyRadius) {
          continue;
        }

        // Calculate cone width at enemy's distance
        var t = Math.max(0, localX) / thrust.range;
        var widthAtDistance = baseHalfWidth + (baseHalfWidth * (thrust.coneExpansion - 1) * t);

        // Check if enemy is within cone width at this distance
        if (Math.abs(localY) <= widthAtDistance + enemyRadius) {
          hitEnemies.push(enemy);
        }
      }

      return hitEnemies;
    }

    // ----------------------------------------
    // Private Methods - Rendering
    // ----------------------------------------
    /**
     * Render punch-style thrust (rectangle)
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} thrust
     */
    _renderPunchThrust(ctx, thrust) {
      var halfWidth = thrust.thrustWidth / 2;
      var length = thrust.currentExtension;

      // Main thrust body
      ctx.fillStyle = thrust.color;
      ctx.fillRect(0, -halfWidth, length, thrust.thrustWidth);

      // Impact effect at tip
      if (thrust.phase !== 'retract') {
        ctx.beginPath();
        ctx.arc(length, 0, halfWidth * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outline
      ctx.strokeStyle = thrust.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = thrust.alpha * 1.5;
      ctx.strokeRect(0, -halfWidth, length, thrust.thrustWidth);
    }

    /**
     * Render scythe-style thrust (cone/trapezoid)
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} thrust
     */
    _renderScytheThrust(ctx, thrust) {
      var nearHalfWidth = thrust.thrustWidth / 2;
      var farHalfWidth = nearHalfWidth * thrust.coneExpansion;
      var length = thrust.currentExtension;

      // Draw trapezoid/cone shape
      ctx.fillStyle = thrust.color;
      ctx.beginPath();
      ctx.moveTo(0, -nearHalfWidth);
      ctx.lineTo(length, -farHalfWidth);
      ctx.lineTo(length, farHalfWidth);
      ctx.lineTo(0, nearHalfWidth);
      ctx.closePath();
      ctx.fill();

      // Outline
      ctx.strokeStyle = thrust.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = thrust.alpha * 1.5;
      ctx.stroke();

      // Edge glow effect at tip during hold phase
      if (thrust.phase === 'hold') {
        ctx.globalAlpha = thrust.alpha * 0.5;
        ctx.beginPath();
        ctx.moveTo(length, -farHalfWidth);
        ctx.lineTo(length, farHalfWidth);
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }

    // ----------------------------------------
    // Private Methods - Direction
    // ----------------------------------------
    /**
     * Get thrust direction based on targeting mode
     * @param {Weapon} weapon
     * @param {Entity} player
     * @param {number} range
     * @returns {{x: number, y: number, angle: number}}
     */
    _getThrustDirection(weapon, player, range) {
      var targetingMode = weapon.targetingMode;

      // In auto mode, use movement direction
      if (this._input && this._input.isAutoMode) {
        return this.getAutoModeDirection();
      }

      // Manual mode - use targeting mode logic
      switch (targetingMode) {
        case TargetingMode.NEAREST:
          var nearestEnemy = this.findNearestEnemy(player, range * 2);
          if (nearestEnemy) {
            return this.getDirectionToTarget(player, nearestEnemy);
          }
          return this.getMouseDirection(player);

        case TargetingMode.WEAKEST:
          var weakestEnemy = this.findWeakestEnemy(player, range * 2);
          if (weakestEnemy) {
            return this.getDirectionToTarget(player, weakestEnemy);
          }
          return this.getMouseDirection(player);

        case TargetingMode.MOUSE:
          return this.getMouseDirection(player);

        case TargetingMode.RANDOM:
          return this.getRandomDirection();

        default:
          return this.getMouseDirection(player);
      }
    }

    // ----------------------------------------
    // Private Methods - Easing
    // ----------------------------------------
    /**
     * Ease out quad - fast start, slow end
     * @param {number} t - Progress (0-1)
     * @returns {number}
     */
    _easeOutQuad(t) {
      return t * (2 - t);
    }

    /**
     * Ease in quad - slow start, fast end
     * @param {number} t - Progress (0-1)
     * @returns {number}
     */
    _easeInQuad(t) {
      return t * t;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._activeThrusts = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.ThrustBehavior = ThrustBehavior;
})(window.VampireSurvivors.Behaviors);
