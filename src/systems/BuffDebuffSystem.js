/**
 * @fileoverview BuffDebuff system - processes all buff/debuff effects
 * @module Systems/BuffDebuffSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class BuffDebuffSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 22;
    _buffDebuffManager = null;
    _totalDoTDamage = 0;
    _totalHealing = 0;

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
     * Set the buff/debuff manager reference
     * @param {BuffDebuffManager} manager - Manager instance
     */
    setBuffDebuffManager(manager) {
      this._buffDebuffManager = manager;
    }

    /**
     * Update all entities with BuffDebuff components
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
      if (!this._entityManager) return;

      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var Transform = window.VampireSurvivors.Components.Transform;
      var Health = window.VampireSurvivors.Components.Health;

      if (this._buffDebuffManager) {
        this._buffDebuffManager.updateAuras(deltaTime);
      }

      var entities = this._entityManager.getWithComponents(BuffDebuff);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (!entity.isActive) continue;

        var buffDebuff = entity.getComponent(BuffDebuff);
        var transform = entity.getComponent(Transform);
        var health = entity.getComponent(Health);

        var position = transform ? { x: transform.x, y: transform.y } : null;

        var result = buffDebuff.update(deltaTime, position);

        if (result.damage > 0 && health && !health.isDead) {
          health.takeDamage(result.damage);
          this._totalDoTDamage += result.damage;

          events.emit('buffdebuff:dot_damage', {
            entity: entity,
            damage: result.damage,
          });

          if (health.isDead) {
            events.emit('enemy:killed', {
              enemy: entity,
              cause: 'status_effect',
            });
          }
        }

        if (result.healing > 0 && health && !health.isDead) {
          health.heal(result.healing);
          this._totalHealing += result.healing;

          events.emit('buffdebuff:hot_heal', {
            entity: entity,
            healing: result.healing,
          });
        }

        this._processPullEffect(entity, buffDebuff, transform, deltaTime);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------

    /**
     * Process pull effect movement
     * @param {Entity} entity - Target entity
     * @param {BuffDebuff} buffDebuff - BuffDebuff component
     * @param {Transform} transform - Transform component
     * @param {number} deltaTime - Time since last frame
     */
    _processPullEffect(entity, buffDebuff, transform, deltaTime) {
      if (!transform) return;

      var pullInfo = buffDebuff.getPullInfo();
      if (!pullInfo) return;

      var dx = pullInfo.sourceX - transform.x;
      var dy = pullInfo.sourceY - transform.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) return;

      var pullAmount = pullInfo.force * deltaTime;
      transform.x += (dx / distance) * pullAmount;
      transform.y += (dy / distance) * pullAmount;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------

    /**
     * Get debug info
     * @returns {Object}
     */
    getDebugInfo() {
      return {
        label: 'BuffDebuff System',
        entries: [
          { key: 'Total DoT Dmg', value: Math.round(this._totalDoTDamage) },
          { key: 'Total Healing', value: Math.round(this._totalHealing) },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------

    /**
     * Dispose of the system
     */
    dispose() {
      this._buffDebuffManager = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.BuffDebuffSystem = BuffDebuffSystem;
})(window.VampireSurvivors.Systems);
