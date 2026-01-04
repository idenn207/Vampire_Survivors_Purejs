/**
 * @fileoverview Projectile system - manages projectile lifecycle
 * @module Systems/ProjectileSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var ProjectileComponent = window.VampireSurvivors.Components.Projectile;
  var projectilePool = window.VampireSurvivors.Pool.projectilePool;

  // ============================================
  // Class Definition
  // ============================================
  class ProjectileSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 12; // After Movement (10), before AreaEffect (13)
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

      // Clear despawn queue
      this._despawnQueue = [];

      // Get all entities with Projectile component
      var projectiles = this._entityManager.getWithComponents(ProjectileComponent);

      for (var i = 0; i < projectiles.length; i++) {
        var entity = projectiles[i];
        if (!entity.isActive) continue;

        var projectileComp = entity.getComponent(ProjectileComponent);
        if (!projectileComp) continue;

        // Update lifetime
        var isAlive = projectileComp.update(deltaTime);

        // Queue for despawn if expired
        if (!isAlive) {
          this._despawnQueue.push(entity);
        }
      }

      // Despawn expired projectiles
      this._processDespawnQueue();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _processDespawnQueue() {
      for (var i = 0; i < this._despawnQueue.length; i++) {
        var projectile = this._despawnQueue[i];
        projectilePool.despawn(projectile);
      }
      this._despawnQueue = [];
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Projectiles',
        entries: [{ key: 'Active', value: projectilePool.activeCount }],
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
  Systems.ProjectileSystem = ProjectileSystem;
})(window.VampireSurvivors.Systems);
