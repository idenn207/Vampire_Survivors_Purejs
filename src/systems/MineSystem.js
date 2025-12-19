/**
 * @fileoverview Mine system - handles mine trigger detection and explosions
 * @module Systems/MineSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var minePool = window.VampireSurvivors.Pool.minePool;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class MineSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 14; // After AreaEffect (13), before Weapon (15)

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
     * Update all active mines
     * @param {number} deltaTime
     */
    update(deltaTime) {
      if (!this._entityManager) return;

      var activeMines = minePool.getActiveMines();
      var enemies = this._entityManager.getByTag('enemy');

      for (var i = activeMines.length - 1; i >= 0; i--) {
        var mine = activeMines[i];
        if (!mine.isActive) continue;

        // Update mine state
        var state = mine.update(deltaTime);

        switch (state) {
          case 'arming':
            // Mine is still arming, don't check triggers
            break;

          case 'active':
            // Check for enemy triggers
            this._checkTriggers(mine, enemies);
            break;

          case 'triggered':
            // Mine is about to explode, visual effect handled in update
            break;

          case 'explode':
            // Mine exploded - deal damage and remove
            this._explodeMine(mine, enemies);
            minePool.despawn(mine);
            break;

          case 'expired':
            // Mine timed out - just remove
            minePool.despawn(mine);
            break;
        }
      }
    }

    /**
     * Render mine trigger/explosion radius (debug)
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     */
    render(ctx, camera) {
      if (!camera) return;

      var cameraX = camera.x;
      var cameraY = camera.y;
      var activeMines = minePool.getActiveMines();

      for (var i = 0; i < activeMines.length; i++) {
        var mine = activeMines[i];
        if (!mine.isActive) continue;

        var screenX = mine.centerX - cameraX;
        var screenY = mine.centerY - cameraY;

        ctx.save();

        // Draw mine body
        var sprite = mine.sprite;
        ctx.globalAlpha = sprite.alpha;
        ctx.fillStyle = sprite.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw trigger radius indicator (subtle)
        if (mine.isArmed()) {
          ctx.globalAlpha = 0.15;
          ctx.strokeStyle = sprite.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(screenX, screenY, mine.triggerRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw triggered effect (pulsing glow)
        if (mine.isTriggered) {
          ctx.globalAlpha = sprite.alpha * 0.3;
          ctx.fillStyle = '#FFFF00';
          ctx.beginPath();
          ctx.arc(screenX, screenY, 12 + Math.sin(Date.now() * 0.02) * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Check if any enemies trigger the mine
     * @param {Mine} mine
     * @param {Array<Entity>} enemies
     */
    _checkTriggers(mine, enemies) {
      var mineX = mine.centerX;
      var mineY = mine.centerY;
      var triggerRadiusSq = mine.triggerRadius * mine.triggerRadius;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        var health = enemy.getComponent(Health);
        if (!health || health.isDead) continue;

        // Check distance
        var dx = transform.centerX - mineX;
        var dy = transform.centerY - mineY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= triggerRadiusSq) {
          mine.trigger();
          break; // Only need one trigger
        }
      }
    }

    /**
     * Explode the mine and deal damage to nearby enemies
     * @param {Mine} mine
     * @param {Array<Entity>} enemies
     */
    _explodeMine(mine, enemies) {
      var mineX = mine.centerX;
      var mineY = mine.centerY;
      var explosionRadiusSq = mine.explosionRadius * mine.explosionRadius;
      var damage = mine.damage;

      // Emit explosion effect event
      events.emit('effect:explosion', {
        x: mineX,
        y: mineY,
        radius: mine.explosionRadius,
        damage: damage,
        color: '#FF6600',
      });

      // Deal damage to all enemies in explosion radius
      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        var health = enemy.getComponent(Health);
        if (!health || health.isDead) continue;

        // Check distance
        var dx = transform.centerX - mineX;
        var dy = transform.centerY - mineY;
        var distSq = dx * dx + dy * dy;

        if (distSq <= explosionRadiusSq) {
          // Apply damage
          health.takeDamage(damage);

          // Emit hit event
          events.emit('weapon:hit', {
            enemy: enemy,
            damage: damage,
            type: 'mine',
            weaponId: mine.sourceWeaponId,
          });
        }
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Mines',
        entries: [{ key: 'Active', value: minePool.activeCount }],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      minePool.releaseAll();
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.MineSystem = MineSystem;
})(window.VampireSurvivors.Systems);
