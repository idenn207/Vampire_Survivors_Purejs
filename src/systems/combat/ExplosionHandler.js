/**
 * @fileoverview Explosion and on-kill effect handling
 * @module Systems/Combat/ExplosionHandler
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Health = window.VampireSurvivors.Components.Health;
  var Transform = window.VampireSurvivors.Components.Transform;
  var StatusEffect = window.VampireSurvivors.Components.StatusEffect;
  var ProjectileComponent = window.VampireSurvivors.Components.Projectile;
  var events = window.VampireSurvivors.Core.events;
  var areaEffectPool = window.VampireSurvivors.Pool.areaEffectPool;

  // ============================================
  // Explosion Handler
  // ============================================
  var ExplosionHandler = {
    /**
     * Create an explosion area effect
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} radius - Explosion radius
     * @param {number} damage - Explosion damage
     */
    createExplosion: function (x, y, radius, damage) {
      // Check if areaEffectPool is available
      if (!areaEffectPool) {
        console.warn('[ExplosionHandler] areaEffectPool not available');
        return;
      }

      // Spawn explosion area effect
      var explosion = areaEffectPool.spawn(
        x,
        y,
        radius,
        damage,
        0.1, // Very short duration (single hit)
        0, // No tick rate (instant damage)
        'explosion_on_kill'
      );

      if (explosion) {
        events.emit('effect:explosion', {
          x: x,
          y: y,
          radius: radius,
          damage: damage,
        });
      }
    },

    /**
     * Process on-kill effects (explosions, shatter, etc.)
     * @param {Entity} killedEnemy - The killed enemy
     * @param {Object} onKill - On-kill configuration
     * @param {Entity} hitbox - The projectile/hitbox that killed
     */
    processOnKillEffects: function (killedEnemy, onKill, hitbox) {
      if (!onKill) return;

      // Check proc chance
      var chance = onKill.chance !== undefined ? onKill.chance : 1;
      if (Math.random() > chance) return;

      var enemyTransform = killedEnemy.getComponent(Transform);
      if (!enemyTransform) return;

      // Process explosion
      if (onKill.explosion) {
        this.createExplosion(
          enemyTransform.x,
          enemyTransform.y,
          onKill.explosion.radius || 60,
          onKill.explosion.damage || 25
        );
      }

      // Process shatter (for frozen enemies)
      if (onKill.shatter) {
        var statusEffect = killedEnemy.getComponent(StatusEffect);
        if (statusEffect && statusEffect.isFrozen()) {
          this.createExplosion(
            enemyTransform.x,
            enemyTransform.y,
            onKill.shatter.radius || 50,
            onKill.shatter.damage || 20
          );
        }
      }

      // Emit on-kill event for other systems (frenzy stacking, etc.)
      var projectileComp = hitbox.getComponent(ProjectileComponent);
      events.emit('weapon:on_kill', {
        enemy: killedEnemy,
        weaponId: projectileComp ? projectileComp.sourceWeaponId : null,
        onKillConfig: onKill,
      });
    },

    /**
     * Handle enemy death explosion passive
     * @param {Entity} deadEnemy - The enemy that died
     * @param {number} explosionDamage - Damage for the explosion
     * @param {number} explosionRadius - Radius for the explosion
     * @param {EntityManager} entityManager - Entity manager reference
     */
    handleEnemyDeathExplosion: function (
      deadEnemy,
      explosionDamage,
      explosionRadius,
      entityManager
    ) {
      var transform = deadEnemy.getComponent(Transform);
      if (!transform) return;

      var x = transform.centerX;
      var y = transform.centerY;

      // Find all enemies in explosion radius
      var enemies = entityManager.getByTag('enemy');
      var radiusSq = explosionRadius * explosionRadius;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive || enemy === deadEnemy) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var enemyHealth = enemy.getComponent(Health);
        if (!enemyHealth || enemyHealth.isDead) continue;

        // Check distance
        var dx = enemyTransform.centerX - x;
        var dy = enemyTransform.centerY - y;
        var distSq = dx * dx + dy * dy;

        if (distSq <= radiusSq) {
          // Apply explosion damage
          enemyHealth.takeDamage(explosionDamage);

          // Emit hit event
          events.emit('weapon:hit', {
            enemy: enemy,
            damage: explosionDamage,
            type: 'enemy_explosion',
          });
        }
      }

      // Emit explosion effect event for visuals
      events.emit('effect:explosion', {
        x: x,
        y: y,
        radius: explosionRadius,
        damage: explosionDamage,
        color: '#FF8800',
      });
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.ExplosionHandler = ExplosionHandler;
})(window.VampireSurvivors.Systems);
