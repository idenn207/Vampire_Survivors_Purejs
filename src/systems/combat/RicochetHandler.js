/**
 * @fileoverview Projectile ricochet handling
 * @module Systems/Combat/RicochetHandler
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Health = window.VampireSurvivors.Components.Health;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Velocity = window.VampireSurvivors.Components.Velocity;
  var events = window.VampireSurvivors.Core.events;
  var projectilePool = window.VampireSurvivors.Pool.projectilePool;

  // ============================================
  // Ricochet Handler
  // ============================================
  var RicochetHandler = {
    /**
     * Handle projectile ricochet to a new target
     * @param {Entity} hitbox - The projectile entity
     * @param {Entity} hitEnemy - The enemy that was hit
     * @param {Projectile} projectileComp - Projectile component
     * @param {EntityManager} entityManager - Entity manager reference
     * @returns {boolean} True if ricochet occurred, false if projectile should despawn
     */
    handleRicochet: function (hitbox, hitEnemy, projectileComp, entityManager) {
      // Perform ricochet (reduces bounces, applies damage decay)
      if (!projectileComp.doRicochet()) {
        projectilePool.despawn(hitbox);
        return false;
      }

      var hitboxTransform = hitbox.getComponent(Transform);
      if (!hitboxTransform) {
        projectilePool.despawn(hitbox);
        return false;
      }

      // Find nearest enemy that hasn't been hit
      var newTarget = this.findRicochetTarget(
        hitbox,
        hitEnemy,
        projectileComp,
        entityManager
      );

      if (!newTarget) {
        projectilePool.despawn(hitbox);
        return false;
      }

      // Redirect projectile toward new target
      var targetTransform = newTarget.getComponent(Transform);
      if (!targetTransform) {
        projectilePool.despawn(hitbox);
        return false;
      }

      var dx = targetTransform.centerX - hitboxTransform.x;
      var dy = targetTransform.centerY - hitboxTransform.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        var velocity = hitbox.getComponent(Velocity);
        if (velocity) {
          var speed = velocity.speed || 400;
          velocity.vx = (dx / distance) * speed;
          velocity.vy = (dy / distance) * speed;

          // Update rotation to match new velocity direction (for directional sprites)
          hitboxTransform.rotation = Math.atan2(velocity.vy, velocity.vx);
        }
      }

      events.emit('projectile:ricochet', {
        projectile: hitbox,
        from: hitEnemy,
        to: newTarget,
        remainingBounces: projectileComp.ricochetBounces,
      });

      return true;
    },

    /**
     * Find a valid ricochet target
     * @param {Entity} hitbox - The projectile
     * @param {Entity} hitEnemy - The enemy that was just hit
     * @param {Projectile} projectileComp - Projectile component
     * @param {EntityManager} entityManager - Entity manager reference
     * @returns {Entity|null} Valid target or null
     */
    findRicochetTarget: function (hitbox, hitEnemy, projectileComp, entityManager) {
      if (!entityManager) return null;

      var hitboxTransform = hitbox.getComponent(Transform);
      if (!hitboxTransform) return null;

      var range = projectileComp.ricochetRange;
      var rangeSq = range * range;

      var enemies = entityManager.getByTag('enemy');
      var bestTarget = null;
      var bestDistSq = Infinity;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive || enemy === hitEnemy) continue;

        // Skip already-hit enemies
        if (projectileComp.hasHitEnemy(enemy.id)) continue;

        var enemyHealth = enemy.getComponent(Health);
        if (!enemyHealth || enemyHealth.isDead) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - hitboxTransform.x;
        var dy = enemyTransform.centerY - hitboxTransform.y;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq && distSq < bestDistSq) {
          bestDistSq = distSq;
          bestTarget = enemy;
        }
      }

      return bestTarget;
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.RicochetHandler = RicochetHandler;
})(window.VampireSurvivors.Systems);
