/**
 * @fileoverview Centralized manager for buff/debuff operations
 * @module Managers/BuffDebuffManager
 */
(function (Managers) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class BuffDebuffManager {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _entityManager = null;
    _activeAuras = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._activeAuras = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Initialize the manager
     * @param {EntityManager} entityManager - Entity manager reference
     */
    initialize(entityManager) {
      this._entityManager = entityManager;
    }

    // ----------------------------------------
    // Effect Application API
    // ----------------------------------------

    /**
     * Apply effect to entity (creates component if needed)
     * @param {Entity} entity - Target entity
     * @param {string} effectId - Effect ID from BuffDebuffData
     * @param {Object} options - Effect options
     * @returns {boolean} Whether effect was applied
     */
    applyEffectToEntity(entity, effectId, options) {
      if (!entity || !entity.isActive) return false;

      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var buffDebuff = entity.getComponent(BuffDebuff);

      if (!buffDebuff) {
        buffDebuff = new BuffDebuff();
        entity.addComponent(buffDebuff);
      }

      return buffDebuff.applyEffect(effectId, options);
    }

    /**
     * Remove effect from entity
     * @param {Entity} entity - Target entity
     * @param {string} effectId - Effect ID
     * @param {boolean} force - Force remove
     */
    removeEffectFromEntity(entity, effectId, force) {
      if (!entity || !entity.isActive) return;

      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var buffDebuff = entity.getComponent(BuffDebuff);

      if (buffDebuff) {
        buffDebuff.removeEffect(effectId, force);
      }
    }

    /**
     * Clear all effects from entity
     * @param {Entity} entity - Target entity
     */
    clearAllEffects(entity) {
      if (!entity || !entity.isActive) return;

      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var buffDebuff = entity.getComponent(BuffDebuff);

      if (buffDebuff) {
        buffDebuff.clearAllEffects();
      }
    }

    /**
     * Clear all debuffs from entity
     * @param {Entity} entity - Target entity
     */
    clearDebuffs(entity) {
      if (!entity || !entity.isActive) return;

      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var buffDebuff = entity.getComponent(BuffDebuff);

      if (buffDebuff) {
        buffDebuff.clearDebuffs();
      }
    }

    /**
     * Clear all buffs from entity
     * @param {Entity} entity - Target entity
     */
    clearBuffs(entity) {
      if (!entity || !entity.isActive) return;

      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var buffDebuff = entity.getComponent(BuffDebuff);

      if (buffDebuff) {
        buffDebuff.clearBuffs();
      }
    }

    // ----------------------------------------
    // Query API
    // ----------------------------------------

    /**
     * Check if entity has effect
     * @param {Entity} entity - Target entity
     * @param {string} effectId - Effect ID
     * @returns {boolean}
     */
    entityHasEffect(entity, effectId) {
      if (!entity || !entity.isActive) return false;

      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var buffDebuff = entity.getComponent(BuffDebuff);

      return buffDebuff ? buffDebuff.hasEffect(effectId) : false;
    }

    /**
     * Get all entities with a specific effect
     * @param {string} effectId - Effect ID
     * @returns {Array<Entity>}
     */
    getEntitiesWithEffect(effectId) {
      var result = [];
      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var entities = this._entityManager.getWithComponents(BuffDebuff);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var buffDebuff = entity.getComponent(BuffDebuff);
        if (buffDebuff && buffDebuff.hasEffect(effectId)) {
          result.push(entity);
        }
      }
      return result;
    }

    /**
     * Get all entities with effects of a category
     * @param {string} category - Effect category
     * @returns {Array<Entity>}
     */
    getEntitiesWithCategory(category) {
      var result = [];
      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var entities = this._entityManager.getWithComponents(BuffDebuff);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var buffDebuff = entity.getComponent(BuffDebuff);
        if (buffDebuff && buffDebuff.getEffectsByCategory(category).length > 0) {
          result.push(entity);
        }
      }
      return result;
    }

    /**
     * Get effect stacks on entity
     * @param {Entity} entity - Target entity
     * @param {string} effectId - Effect ID
     * @returns {number}
     */
    getEffectStacks(entity, effectId) {
      if (!entity || !entity.isActive) return 0;

      var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
      var buffDebuff = entity.getComponent(BuffDebuff);

      return buffDebuff ? buffDebuff.getStacks(effectId) : 0;
    }

    // ----------------------------------------
    // Aura Management
    // ----------------------------------------

    /**
     * Register an area-of-effect aura
     * @param {Object} auraData - Aura configuration
     * @returns {string} Aura ID
     */
    registerAura(auraData) {
      var aura = {
        id: auraData.id || 'aura_' + Date.now(),
        effectId: auraData.effectId,
        source: auraData.source,
        radius: auraData.radius || 100,
        targetTags: auraData.targetTags || ['enemy'],
        tickRate: auraData.tickRate || 1,
        tickTimer: 0,
        effectOptions: auraData.effectOptions || {},
      };

      this._activeAuras.push(aura);
      return aura.id;
    }

    /**
     * Unregister an aura
     * @param {string} auraId - Aura ID
     */
    unregisterAura(auraId) {
      for (var i = this._activeAuras.length - 1; i >= 0; i--) {
        if (this._activeAuras[i].id === auraId) {
          this._activeAuras.splice(i, 1);
          break;
        }
      }
    }

    /**
     * Unregister all auras from a source entity
     * @param {Entity} source - Source entity
     */
    unregisterAurasFromSource(source) {
      for (var i = this._activeAuras.length - 1; i >= 0; i--) {
        if (this._activeAuras[i].source === source) {
          this._activeAuras.splice(i, 1);
        }
      }
    }

    /**
     * Update auras (called by BuffDebuffSystem)
     * @param {number} deltaTime - Time since last frame
     */
    updateAuras(deltaTime) {
      var Transform = window.VampireSurvivors.Components.Transform;

      for (var i = 0; i < this._activeAuras.length; i++) {
        var aura = this._activeAuras[i];

        if (!aura.source || !aura.source.isActive) {
          this._activeAuras.splice(i, 1);
          i--;
          continue;
        }

        aura.tickTimer += deltaTime;
        var tickInterval = 1 / aura.tickRate;

        if (aura.tickTimer < tickInterval) continue;
        aura.tickTimer -= tickInterval;

        var sourceTransform = aura.source.getComponent(Transform);
        if (!sourceTransform) continue;

        var sourceX = sourceTransform.centerX;
        var sourceY = sourceTransform.centerY;

        for (var t = 0; t < aura.targetTags.length; t++) {
          var targets = this._entityManager.getByTag(aura.targetTags[t]);

          for (var j = 0; j < targets.length; j++) {
            var target = targets[j];
            if (!target.isActive) continue;

            var targetTransform = target.getComponent(Transform);
            if (!targetTransform) continue;

            var dx = targetTransform.centerX - sourceX;
            var dy = targetTransform.centerY - sourceY;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= aura.radius) {
              var options = Object.assign({}, aura.effectOptions, {
                source: {
                  entity: aura.source,
                  position: { x: sourceX, y: sourceY },
                },
              });
              this.applyEffectToEntity(target, aura.effectId, options);
            }
          }
        }
      }
    }

    /**
     * Get active aura count
     * @returns {number}
     */
    getActiveAuraCount() {
      return this._activeAuras.length;
    }

    // ----------------------------------------
    // Debug
    // ----------------------------------------

    /**
     * Get debug info
     * @returns {Object}
     */
    getDebugInfo() {
      var entitiesWithEffects = 0;
      var totalEffects = 0;

      if (this._entityManager) {
        var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;
        var entities = this._entityManager.getWithComponents(BuffDebuff);
        entitiesWithEffects = entities.length;

        for (var i = 0; i < entities.length; i++) {
          var bd = entities[i].getComponent(BuffDebuff);
          totalEffects += bd.getActiveEffectIds().length;
        }
      }

      return {
        label: 'BuffDebuff',
        entries: [
          { key: 'Entities', value: entitiesWithEffects },
          { key: 'Active Effects', value: totalEffects },
          { key: 'Active Auras', value: this._activeAuras.length },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------

    /**
     * Dispose of the manager
     */
    dispose() {
      this._entityManager = null;
      this._activeAuras = [];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Managers.BuffDebuffManager = BuffDebuffManager;
})(window.VampireSurvivors.Managers);
