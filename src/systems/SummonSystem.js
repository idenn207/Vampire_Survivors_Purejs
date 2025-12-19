/**
 * @fileoverview Summon system - handles summon AI chase and attack behavior
 * @module Systems/SummonSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var summonPool = window.VampireSurvivors.Pool.summonPool;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class SummonSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 12; // Before AreaEffect (13)

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
     * Update all active summons
     * @param {number} deltaTime
     */
    update(deltaTime) {
      if (!this._entityManager) return;

      var activeSummons = summonPool.getActiveSummons();
      var enemies = this._entityManager.getByTag('enemy');

      for (var i = activeSummons.length - 1; i >= 0; i--) {
        var summon = activeSummons[i];
        if (!summon.isActive) continue;

        // Update summon state
        var state = summon.update(deltaTime);

        switch (state) {
          case 'active':
            // AI behavior: chase and attack
            this._updateSummonAI(summon, enemies, deltaTime);
            break;

          case 'dead':
          case 'expired':
            // Remove summon
            summonPool.despawn(summon);
            break;
        }
      }
    }

    /**
     * Render summon visuals
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    render(ctx, camera) {
      if (!camera) return;

      var cameraX = camera.x;
      var cameraY = camera.y;
      var activeSummons = summonPool.getActiveSummons();

      for (var i = 0; i < activeSummons.length; i++) {
        var summon = activeSummons[i];
        if (!summon.isActive) continue;

        var transform = summon.transform;
        var sprite = summon.sprite;

        var screenX = transform.centerX - cameraX;
        var screenY = transform.centerY - cameraY;

        ctx.save();
        ctx.globalAlpha = sprite.alpha;

        // Draw summon body (glowing circle)
        ctx.fillStyle = sprite.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, transform.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow effect
        ctx.globalAlpha = sprite.alpha * 0.3;
        ctx.beginPath();
        ctx.arc(screenX, screenY, transform.width / 2 + 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw health bar above summon
        var healthComp = summon.health;
        if (healthComp && healthComp.healthRatio < 1) {
          var barWidth = transform.width;
          var barHeight = 3;
          var barX = screenX - barWidth / 2;
          var barY = screenY - transform.height / 2 - 8;

          // Background
          ctx.fillStyle = '#333333';
          ctx.fillRect(barX, barY, barWidth, barHeight);

          // Health fill
          ctx.fillStyle = '#44FF44';
          ctx.fillRect(barX, barY, barWidth * healthComp.healthRatio, barHeight);
        }

        ctx.restore();
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Update summon AI behavior
     * @param {Summon} summon
     * @param {Array<Entity>} enemies
     * @param {number} deltaTime
     */
    _updateSummonAI(summon, enemies, deltaTime) {
      // Find nearest enemy
      var target = this._findNearestEnemy(summon, enemies);

      if (!target) {
        // No target - stay near owner
        var owner = summon.owner;
        if (owner && owner.isActive) {
          var ownerTransform = owner.getComponent(Transform);
          if (ownerTransform) {
            var dx = ownerTransform.centerX - summon.centerX;
            var dy = ownerTransform.centerY - summon.centerY;
            var distToOwner = Math.sqrt(dx * dx + dy * dy);

            // If too far from owner, move back
            if (distToOwner > 200) {
              summon.moveToward(ownerTransform.centerX, ownerTransform.centerY);
            } else {
              summon.stopMoving();
            }
          }
        } else {
          summon.stopMoving();
        }
        return;
      }

      var targetTransform = target.getComponent(Transform);
      if (!targetTransform) return;

      var dx = targetTransform.centerX - summon.centerX;
      var dy = targetTransform.centerY - summon.centerY;
      var distance = Math.sqrt(dx * dx + dy * dy);

      // If in attack range, attack
      if (distance <= summon.attackRange) {
        summon.stopMoving();

        if (summon.canAttack()) {
          this._performAttack(summon, target);
          summon.attack();
        }
      } else {
        // Chase target
        summon.moveToward(targetTransform.centerX, targetTransform.centerY);
      }
    }

    /**
     * Find nearest enemy to summon
     * @param {Summon} summon
     * @param {Array<Entity>} enemies
     * @returns {Entity|null}
     */
    _findNearestEnemy(summon, enemies) {
      var summonX = summon.centerX;
      var summonY = summon.centerY;
      var nearestEnemy = null;
      var nearestDistSq = Infinity;
      var maxChaseRange = 300; // Max distance to chase
      var maxChaseRangeSq = maxChaseRange * maxChaseRange;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var health = enemy.getComponent(Health);
        if (!health || health.isDead) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        var dx = transform.centerX - summonX;
        var dy = transform.centerY - summonY;
        var distSq = dx * dx + dy * dy;

        if (distSq < nearestDistSq && distSq <= maxChaseRangeSq) {
          nearestDistSq = distSq;
          nearestEnemy = enemy;
        }
      }

      return nearestEnemy;
    }

    /**
     * Perform attack on target
     * @param {Summon} summon
     * @param {Entity} target
     */
    _performAttack(summon, target) {
      var health = target.getComponent(Health);
      if (!health || health.isDead) return;

      // Deal damage
      health.takeDamage(summon.damage);

      // Emit hit event
      events.emit('weapon:hit', {
        enemy: target,
        damage: summon.damage,
        type: 'summon',
        weaponId: summon.sourceWeaponId,
      });
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Summons',
        entries: [{ key: 'Active', value: summonPool.activeCount }],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      summonPool.releaseAll();
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.SummonSystem = SummonSystem;
})(window.VampireSurvivors.Systems);
