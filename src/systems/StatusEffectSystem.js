/**
 * @fileoverview StatusEffect system - processes DoT damage and status modifiers
 * @module Systems/StatusEffectSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var StatusEffect = window.VampireSurvivors.Components.StatusEffect;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class StatusEffectSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 22; // After Collision (20), before Combat (25)
    _totalDoTDamage = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    update(deltaTime) {
      if (!this._entityManager) return;

      var entities = this._entityManager.getWithComponents(StatusEffect);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (!entity.isActive) continue;

        var statusEffect = entity.getComponent(StatusEffect);
        var transform = entity.getComponent(Transform);
        var health = entity.getComponent(Health);

        // Get current position for movement tracking
        var position = transform ? { x: transform.x, y: transform.y } : null;

        // Update all effects and get pending DoT damage
        var dotDamage = statusEffect.update(deltaTime, position);

        // Apply DoT damage
        if (dotDamage > 0 && health && !health.isDead) {
          health.takeDamage(dotDamage);
          this._totalDoTDamage += dotDamage;

          // Emit DoT damage event
          events.emit('status:dot_damage', {
            entity: entity,
            damage: dotDamage,
            activeEffects: statusEffect.getActiveEffectTypes(),
          });

          // Check for death
          if (health.isDead) {
            events.emit('enemy:killed', {
              enemy: entity,
              cause: 'status_effect',
            });
          }
        }

        // Handle pull effect
        this._processPullEffect(entity, statusEffect, transform, deltaTime);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _processPullEffect(entity, statusEffect, transform, deltaTime) {
      if (!transform) return;

      var pullInfo = statusEffect.getPullInfo();
      if (!pullInfo) return;

      // Calculate direction toward pull source
      var dx = pullInfo.sourceX - transform.x;
      var dy = pullInfo.sourceY - transform.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      // Don't pull if already at source
      if (distance < 5) return;

      // Normalize and apply pull force
      var pullAmount = pullInfo.force * deltaTime;
      var moveX = (dx / distance) * pullAmount;
      var moveY = (dy / distance) * pullAmount;

      // Apply pull (direct position modification)
      transform.x += moveX;
      transform.y += moveY;
    }

    /**
     * Apply a status effect to an entity (convenience method)
     * @param {Entity} entity - Target entity
     * @param {string} effectType - StatusEffectType value
     * @param {Object} config - Effect configuration
     */
    applyEffectToEntity(entity, effectType, config) {
      if (!entity || !entity.isActive) return;

      var statusEffect = entity.getComponent(StatusEffect);

      // Add StatusEffect component if not present
      if (!statusEffect) {
        statusEffect = new StatusEffect();
        entity.addComponent(statusEffect);
      }

      statusEffect.applyEffect(effectType, config);

      // Emit event
      events.emit('status:effect_applied', {
        entity: entity,
        effectType: effectType,
        config: config,
      });
    }

    /**
     * Remove a status effect from an entity
     * @param {Entity} entity - Target entity
     * @param {string} effectType - StatusEffectType value
     */
    removeEffectFromEntity(entity, effectType) {
      if (!entity || !entity.isActive) return;

      var statusEffect = entity.getComponent(StatusEffect);
      if (statusEffect) {
        statusEffect.removeEffect(effectType);

        events.emit('status:effect_removed', {
          entity: entity,
          effectType: effectType,
        });
      }
    }

    /**
     * Clear all effects from an entity
     * @param {Entity} entity - Target entity
     */
    clearAllEffects(entity) {
      if (!entity || !entity.isActive) return;

      var statusEffect = entity.getComponent(StatusEffect);
      if (statusEffect) {
        statusEffect.clearAllEffects();

        events.emit('status:effects_cleared', {
          entity: entity,
        });
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var entityCount = 0;
      var totalEffects = 0;

      if (this._entityManager) {
        var entities = this._entityManager.getWithComponents(StatusEffect);
        entityCount = entities.length;

        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i];
          if (entity.isActive) {
            var statusEffect = entity.getComponent(StatusEffect);
            totalEffects += statusEffect.getActiveEffectTypes().length;
          }
        }
      }

      return {
        label: 'StatusEffects',
        entries: [
          { key: 'Entities', value: entityCount },
          { key: 'Active Effects', value: totalEffects },
          { key: 'Total DoT Dmg', value: Math.round(this._totalDoTDamage) },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.StatusEffectSystem = StatusEffectSystem;
})(window.VampireSurvivors.Systems);
