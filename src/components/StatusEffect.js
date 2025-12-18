/**
 * @fileoverview StatusEffect component for tracking active effects on entities
 * @module Components/StatusEffect
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var StatusEffectConfig = window.VampireSurvivors.Data.StatusEffectConfig;

  // ============================================
  // Class Definition
  // ============================================
  class StatusEffect extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _effects = null;           // Map<effectType, effectData>
    _pendingDamage = 0;        // Accumulated DoT damage this frame
    _lastPosition = null;      // For bleed movement detection
    _pullSource = null;        // Position to pull toward

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._effects = new Map();
      this._pendingDamage = 0;
      this._lastPosition = { x: 0, y: 0 };
      this._pullSource = null;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Apply a status effect to this entity
     * @param {string} effectType - StatusEffectType value
     * @param {Object} config - Effect configuration (merges with defaults)
     */
    applyEffect(effectType, config) {
      config = config || {};
      var defaults = StatusEffectConfig.getDefaultConfig(effectType);

      var effectData = {
        type: effectType,
        duration: config.duration !== undefined ? config.duration : defaults.duration,
        remainingDuration: config.duration !== undefined ? config.duration : defaults.duration,
        tickRate: config.tickRate !== undefined ? config.tickRate : defaults.tickRate,
        tickTimer: 0,
        damagePerTick: config.damagePerTick !== undefined ? config.damagePerTick : defaults.damagePerTick,
        speedModifier: config.speedModifier !== undefined ? config.speedModifier : defaults.speedModifier,
        damageMultiplier: config.damageMultiplier !== undefined ? config.damageMultiplier : defaults.damageMultiplier,
        pullForce: config.pullForce !== undefined ? config.pullForce : defaults.pullForce,
        requiresMovement: defaults.requiresMovement || false,
        stacks: 1,
        maxStacks: defaults.maxStacks || 1,
        stackable: defaults.stackable || false,
        sourcePosition: config.sourcePosition || null,
      };

      var existingEffect = this._effects.get(effectType);

      if (existingEffect) {
        if (effectData.stackable && existingEffect.stacks < effectData.maxStacks) {
          // Add stack
          existingEffect.stacks++;
          existingEffect.remainingDuration = effectData.duration; // Refresh duration
        } else {
          // Refresh duration only
          existingEffect.remainingDuration = Math.max(
            existingEffect.remainingDuration,
            effectData.duration
          );
        }
        // Update source position for pull
        if (effectData.sourcePosition) {
          existingEffect.sourcePosition = effectData.sourcePosition;
        }
      } else {
        this._effects.set(effectType, effectData);
      }

      // Set pull source if this is a pull effect
      if (effectType === StatusEffectConfig.Type.PULL && effectData.sourcePosition) {
        this._pullSource = effectData.sourcePosition;
      }
    }

    /**
     * Remove a status effect
     * @param {string} effectType - StatusEffectType value
     */
    removeEffect(effectType) {
      this._effects.delete(effectType);
      if (effectType === StatusEffectConfig.Type.PULL) {
        this._pullSource = null;
      }
    }

    /**
     * Check if entity has a specific effect
     * @param {string} effectType - StatusEffectType value
     * @returns {boolean}
     */
    hasEffect(effectType) {
      return this._effects.has(effectType);
    }

    /**
     * Get effect data for a specific type
     * @param {string} effectType - StatusEffectType value
     * @returns {Object|null}
     */
    getEffect(effectType) {
      return this._effects.get(effectType) || null;
    }

    /**
     * Get number of stacks for an effect
     * @param {string} effectType - StatusEffectType value
     * @returns {number}
     */
    getStacks(effectType) {
      var effect = this._effects.get(effectType);
      return effect ? effect.stacks : 0;
    }

    /**
     * Get speed modifier from all active movement effects
     * @returns {number} Multiplier 0-1 (0 = stopped, 1 = normal)
     */
    getSpeedModifier() {
      var modifier = 1;
      var Type = StatusEffectConfig.Type;

      // Check movement-affecting effects (use highest priority/lowest modifier)
      if (this._effects.has(Type.FREEZE)) {
        return 0; // Complete stop
      }
      if (this._effects.has(Type.STUN)) {
        return 0; // Complete stop
      }
      if (this._effects.has(Type.SLOW)) {
        var slowEffect = this._effects.get(Type.SLOW);
        modifier = Math.min(modifier, slowEffect.speedModifier);
      }

      return modifier;
    }

    /**
     * Get damage taken modifier from all active effects
     * @returns {number} Multiplier >= 1 (1 = normal, >1 = increased damage taken)
     */
    getDamageTakenModifier() {
      var modifier = 1;
      var Type = StatusEffectConfig.Type;

      if (this._effects.has(Type.WEAKNESS)) {
        var weakness = this._effects.get(Type.WEAKNESS);
        modifier *= weakness.damageMultiplier;
      }
      if (this._effects.has(Type.MARK)) {
        var mark = this._effects.get(Type.MARK);
        // Each stack adds to the multiplier
        modifier *= Math.pow(mark.damageMultiplier, mark.stacks);
      }

      return modifier;
    }

    /**
     * Get pull information if being pulled
     * @returns {Object|null} { sourceX, sourceY, force } or null
     */
    getPullInfo() {
      var Type = StatusEffectConfig.Type;
      if (!this._effects.has(Type.PULL) || !this._pullSource) {
        return null;
      }
      var pullEffect = this._effects.get(Type.PULL);
      return {
        sourceX: this._pullSource.x,
        sourceY: this._pullSource.y,
        force: pullEffect.pullForce,
      };
    }

    /**
     * Update all effects and calculate pending damage
     * @param {number} deltaTime - Time since last frame in seconds
     * @param {Object} position - Current entity position { x, y }
     * @returns {number} Total DoT damage to apply this frame
     */
    update(deltaTime, position) {
      this._pendingDamage = 0;
      var Type = StatusEffectConfig.Type;

      // Check if entity moved (for bleed)
      var hasMoved = false;
      if (position) {
        var dx = position.x - this._lastPosition.x;
        var dy = position.y - this._lastPosition.y;
        hasMoved = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
        this._lastPosition.x = position.x;
        this._lastPosition.y = position.y;
      }

      // Process each effect
      var effectsToRemove = [];

      this._effects.forEach(function (effect, effectType) {
        // Update duration
        effect.remainingDuration -= deltaTime;

        if (effect.remainingDuration <= 0) {
          effectsToRemove.push(effectType);
          return;
        }

        // Process DoT effects
        if (StatusEffectConfig.isDoTEffect(effectType)) {
          // Check movement requirement for bleed
          if (effect.requiresMovement && !hasMoved) {
            return;
          }

          effect.tickTimer += deltaTime;
          var tickInterval = 1 / effect.tickRate;

          while (effect.tickTimer >= tickInterval) {
            effect.tickTimer -= tickInterval;
            // Apply stacking damage
            this._pendingDamage += effect.damagePerTick * effect.stacks;
          }
        }
      }.bind(this));

      // Remove expired effects
      for (var i = 0; i < effectsToRemove.length; i++) {
        this.removeEffect(effectsToRemove[i]);
      }

      return this._pendingDamage;
    }

    /**
     * Get pending DoT damage without updating
     * @returns {number}
     */
    getPendingDamage() {
      return this._pendingDamage;
    }

    /**
     * Clear all effects
     */
    clearAllEffects() {
      this._effects.clear();
      this._pendingDamage = 0;
      this._pullSource = null;
    }

    /**
     * Check if frozen (freeze or stun)
     * @returns {boolean}
     */
    isFrozen() {
      var Type = StatusEffectConfig.Type;
      return this._effects.has(Type.FREEZE) || this._effects.has(Type.STUN);
    }

    /**
     * Get all active effect types
     * @returns {string[]}
     */
    getActiveEffectTypes() {
      return Array.from(this._effects.keys());
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      var activeEffects = this.getActiveEffectTypes();
      var effectsStr = activeEffects.length > 0 ? activeEffects.join(', ') : 'none';

      return [
        { key: 'Effects', value: effectsStr },
        { key: 'Speed Mod', value: (this.getSpeedModifier() * 100).toFixed(0) + '%' },
        { key: 'Dmg Taken Mod', value: (this.getDamageTakenModifier() * 100).toFixed(0) + '%' },
      ];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      super.dispose();
      this._effects.clear();
      this._effects = null;
      this._lastPosition = null;
      this._pullSource = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.StatusEffect = StatusEffect;
})(window.VampireSurvivors.Components);
