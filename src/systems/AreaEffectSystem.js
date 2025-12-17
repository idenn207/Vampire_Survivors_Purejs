/**
 * @fileoverview Area effect system - manages area damage tick processing
 * @module Systems/AreaEffectSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var AreaEffectComponent = window.VampireSurvivors.Components.AreaEffect;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var Sprite = window.VampireSurvivors.Components.Sprite;
  var areaEffectPool = window.VampireSurvivors.Pool.areaEffectPool;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class AreaEffectSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 13; // After Projectile (12), before Weapon (15)
    _despawnQueue = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._despawnQueue = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    update(deltaTime) {
      if (!this._entityManager) return;

      this._despawnQueue = [];

      // Get all entities with AreaEffect component
      var areaEffects = this._entityManager.getWithComponents(AreaEffectComponent);

      for (var i = 0; i < areaEffects.length; i++) {
        var entity = areaEffects[i];
        if (!entity.isActive) continue;

        var areaComp = entity.getComponent(AreaEffectComponent);
        if (!areaComp) continue;

        // Update lifetime
        var isAlive = areaComp.update(deltaTime);

        if (!isAlive) {
          this._despawnQueue.push(entity);
          continue;
        }

        // Process damage ticks
        this._processDamageTicks(entity, areaComp);

        // Update visual (fade based on remaining time)
        this._updateVisual(entity, areaComp);
      }

      // Despawn expired effects
      this._processDespawnQueue();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _processDamageTicks(entity, areaComp) {
      // Check if tick is ready
      while (areaComp.isTickReady()) {
        areaComp.consumeTick();
        this._applyAreaDamage(entity, areaComp);
      }
    }

    _applyAreaDamage(areaEntity, areaComp) {
      if (!this._entityManager) return;

      var transform = areaEntity.getComponent(Transform);
      if (!transform) return;

      var centerX = transform.centerX;
      var centerY = transform.centerY;
      var radius = areaComp.radius;
      var damage = areaComp.damage;
      var radiusSq = radius * radius;

      // Find all enemies in radius
      var enemies = this._entityManager.getByTag('enemy');

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var health = enemy.getComponent(Health);
        if (!health || health.isDead) continue;

        // Check distance
        var dx = enemyTransform.centerX - centerX;
        var dy = enemyTransform.centerY - centerY;
        var distSq = dx * dx + dy * dy;

        var enemyRadius = enemyTransform.width / 2;
        var combinedRadius = radius + enemyRadius;

        if (distSq <= combinedRadius * combinedRadius) {
          // Check per-enemy tick cooldown
          if (!areaComp.canDamage(enemy.id)) {
            continue;
          }

          // Apply damage
          health.takeDamage(damage);
          areaComp.recordHit(enemy.id);

          // Emit event
          events.emit('weapon:hit', {
            areaEffect: areaEntity,
            enemy: enemy,
            damage: damage,
            type: 'area_damage',
          });
        }
      }
    }

    _updateVisual(entity, areaComp) {
      var sprite = entity.getComponent(Sprite);
      if (!sprite) return;

      // Fade out as duration progresses
      var progress = areaComp.progress;
      var fadeStart = 0.7; // Start fading at 70% of duration

      if (progress > fadeStart) {
        var fadeProgress = (progress - fadeStart) / (1 - fadeStart);
        sprite.alpha = 0.4 * (1 - fadeProgress);
      } else {
        sprite.alpha = 0.4;
      }
    }

    _processDespawnQueue() {
      for (var i = 0; i < this._despawnQueue.length; i++) {
        var effect = this._despawnQueue[i];
        areaEffectPool.despawn(effect);
      }
      this._despawnQueue = [];
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Area Effects',
        entries: [{ key: 'Active', value: areaEffectPool.activeCount }],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._despawnQueue = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.AreaEffectSystem = AreaEffectSystem;
})(window.VampireSurvivors.Systems);
