/**
 * @fileoverview Drop system - spawns pickups when enemies die
 * @module Systems/DropSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var events = window.VampireSurvivors.Core.events;
  var Transform = window.VampireSurvivors.Components.Transform;
  var DropTable = window.VampireSurvivors.Data.DropTable;
  var pickupPool = window.VampireSurvivors.Pool.pickupPool;

  // ============================================
  // Constants
  // ============================================
  var DROP_SPREAD_RADIUS = 20; // Spread drops around enemy position

  // ============================================
  // Class Definition
  // ============================================
  class DropSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 26; // After CombatSystem (25)
    _itemsDropped = 0;
    _currentWave = 1;
    _boundHandleEntityDeath = null;
    _boundOnWaveStarted = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._boundHandleEntityDeath = this._handleEntityDeath.bind(this);
      this._boundOnWaveStarted = this._onWaveStarted.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize the system
     * @param {Game} game
     * @param {EntityManager} entityManager
     */
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Listen for entity death events
      events.on('entity:died', this._boundHandleEntityDeath);

      // Listen for wave events to track current wave
      events.on('wave:started', this._boundOnWaveStarted);
    }

    /**
     * Update - no per-frame logic needed (event-driven)
     * @param {number} deltaTime
     */
    update(deltaTime) {
      // Event-driven system, no per-frame logic
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Handle entity death event
     * @param {Object} data - Event data with entity reference
     */
    _handleEntityDeath(data) {
      var entity = data.entity;

      // Only process enemy deaths
      if (!entity || !entity.hasTag('enemy')) {
        return;
      }

      // Get enemy position
      var transform = entity.getComponent(Transform);
      if (!transform) return;

      var baseX = transform.centerX;
      var baseY = transform.centerY;

      // Determine enemy type for drop table
      // Check for specific enemy type tags or property
      var enemyType = 'default';
      if (entity.enemyType) {
        enemyType = entity.enemyType;
      } else if (entity.hasTag('boss')) {
        enemyType = 'boss';
      } else if (entity.hasTag('miniboss')) {
        enemyType = 'miniboss';
      } else if (entity.hasTag('elite')) {
        enemyType = 'elite';
      } else if (entity.hasTag('swarm')) {
        enemyType = 'swarm';
      } else if (entity.hasTag('tank')) {
        enemyType = 'tank';
      }

      // Calculate wave-based XP bonus (+10% per wave)
      var xpMultiplier = 1 + (this._currentWave - 1) * 0.1;

      // Roll drops based on enemy type with wave multiplier
      var drops = DropTable.rollDrops(enemyType, { bonusXpMultiplier: xpMultiplier });

      // Spawn each drop with slight position offset
      for (var i = 0; i < drops.length; i++) {
        var drop = drops[i];
        this._spawnDrop(drop.type, drop.value, baseX, baseY);
      }
    }

    /**
     * Spawn a drop item at position with random offset
     * @param {string} type
     * @param {number} value
     * @param {number} baseX
     * @param {number} baseY
     */
    _spawnDrop(type, value, baseX, baseY) {
      // Add random offset to prevent stacking
      var angle = Math.random() * Math.PI * 2;
      var distance = Math.random() * DROP_SPREAD_RADIUS;
      var x = baseX + Math.cos(angle) * distance;
      var y = baseY + Math.sin(angle) * distance;

      // Spawn from pool
      var pickup = pickupPool.spawn(type, value, x, y);

      // Update stats
      if (pickup) {
        this._itemsDropped++;
      }
    }

    /**
     * Handle wave started event
     * @param {Object} data - Event data with wave number
     */
    _onWaveStarted(data) {
      this._currentWave = data.wave;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get itemsDropped() {
      return this._itemsDropped;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Drop System',
        entries: [{ key: 'Items Dropped', value: this._itemsDropped }],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('entity:died', this._boundHandleEntityDeath);
      events.off('wave:started', this._boundOnWaveStarted);
      this._boundHandleEntityDeath = null;
      this._boundOnWaveStarted = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.DropSystem = DropSystem;
})(window.VampireSurvivors.Systems);
