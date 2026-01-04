/**
 * @fileoverview Unified BuffDebuff component for tracking all effects on entities
 * @module Components/BuffDebuff
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class BuffDebuff extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _effects = null;
    _pendingDamage = 0;
    _pendingHealing = 0;
    _statModifierCache = null;
    _statCacheDirty = true;
    _lastPosition = null;
    _shieldAmount = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._effects = new Map();
      this._lastPosition = { x: 0, y: 0 };
      this._statModifierCache = {
        speedModifier: 1,
        damageTakenModifier: 1,
        damageDealtModifier: 1,
        stats: {},
      };
      this._pendingDamage = 0;
      this._pendingHealing = 0;
      this._shieldAmount = 0;
    }

    // ----------------------------------------
    // Core API Methods
    // ----------------------------------------

    /**
     * Apply an effect to this entity
     * @param {string} effectId - Effect ID from BuffDebuffData
     * @param {Object} options - Override options
     * @returns {boolean} Whether effect was applied
     */
    applyEffect(effectId, options) {
      options = options || {};
      var Data = window.VampireSurvivors.Data;
      var effectDef = Data.getEffectData(effectId);

      if (!effectDef) {
        console.warn('[BuffDebuff] Unknown effect: ' + effectId);
        return false;
      }

      if (this._isImmune(effectDef)) {
        return false;
      }

      var existingEffect = this._effects.get(effectId);

      if (existingEffect) {
        return this._handleExistingEffect(existingEffect, effectDef, options);
      } else {
        return this._createNewEffect(effectId, effectDef, options);
      }
    }

    /**
     * Remove an effect
     * @param {string} effectId - Effect ID
     * @param {boolean} force - Force remove
     */
    removeEffect(effectId, force) {
      var effect = this._effects.get(effectId);
      if (!effect) return;

      this._effects.delete(effectId);
      this._statCacheDirty = true;

      events.emit('buffdebuff:removed', {
        entity: this._entity,
        effectId: effectId,
        wasForced: force || false,
      });
    }

    /**
     * Check if entity has a specific effect
     * @param {string} effectId - Effect ID
     * @returns {boolean}
     */
    hasEffect(effectId) {
      return this._effects.has(effectId);
    }

    /**
     * Get effect instance data
     * @param {string} effectId - Effect ID
     * @returns {Object|null}
     */
    getEffect(effectId) {
      return this._effects.get(effectId) || null;
    }

    /**
     * Get current stacks for an effect
     * @param {string} effectId - Effect ID
     * @returns {number}
     */
    getStacks(effectId) {
      var effect = this._effects.get(effectId);
      return effect ? effect.stacks : 0;
    }

    /**
     * Get remaining duration for an effect
     * @param {string} effectId - Effect ID
     * @returns {number}
     */
    getRemainingDuration(effectId) {
      var effect = this._effects.get(effectId);
      return effect ? effect.remainingDuration : 0;
    }

    /**
     * Get all active effect IDs
     * @returns {Array<string>}
     */
    getActiveEffectIds() {
      return Array.from(this._effects.keys());
    }

    /**
     * Get all effects by category
     * @param {string} category - 'buff', 'debuff', 'aura', 'environmental'
     * @returns {Array<Object>}
     */
    getEffectsByCategory(category) {
      var result = [];
      this._effects.forEach(function (effect) {
        if (effect.definition.category === category) {
          result.push(effect);
        }
      });
      return result;
    }

    /**
     * Get all effects with a specific tag
     * @param {string} tag - Effect tag
     * @returns {Array<Object>}
     */
    getEffectsByTag(tag) {
      var result = [];
      this._effects.forEach(function (effect) {
        if (effect.definition.tags && effect.definition.tags.indexOf(tag) !== -1) {
          result.push(effect);
        }
      });
      return result;
    }

    // ----------------------------------------
    // Stat Modifier Methods
    // ----------------------------------------

    /**
     * Get total speed modifier (0 = stopped, 1 = normal, >1 = faster)
     * @returns {number}
     */
    getSpeedModifier() {
      this._ensureStatCache();
      return this._statModifierCache.speedModifier;
    }

    /**
     * Get damage taken modifier (1 = normal, >1 = more damage, <1 = less damage)
     * @returns {number}
     */
    getDamageTakenModifier() {
      this._ensureStatCache();
      return this._statModifierCache.damageTakenModifier;
    }

    /**
     * Get damage dealt modifier (1 = normal, >1 = more damage)
     * @returns {number}
     */
    getDamageDealtModifier() {
      this._ensureStatCache();
      return this._statModifierCache.damageDealtModifier;
    }

    /**
     * Get stat modifier for a specific stat
     * @param {string} statName - Stat name
     * @returns {Object} { additive: number, multiplicative: number }
     */
    getStatModifier(statName) {
      this._ensureStatCache();
      return this._statModifierCache.stats[statName] || { additive: 0, multiplicative: 1 };
    }

    /**
     * Check if entity is immobilized (frozen/stunned)
     * @returns {boolean}
     */
    isImmobilized() {
      return this.hasEffect('freeze') || this.hasEffect('stun');
    }

    /**
     * Check if frozen (freeze or stun)
     * @returns {boolean}
     */
    isFrozen() {
      return this.isImmobilized();
    }

    /**
     * Get pull information if being pulled
     * @returns {Object|null} { sourceX, sourceY, force }
     */
    getPullInfo() {
      var pullEffect = this._effects.get('pull');
      if (!pullEffect || !pullEffect.sourcePosition) return null;

      return {
        sourceX: pullEffect.sourcePosition.x,
        sourceY: pullEffect.sourcePosition.y,
        force: pullEffect.values.pullForce || 50,
      };
    }

    /**
     * Get current shield amount
     * @returns {number}
     */
    getShieldAmount() {
      return this._shieldAmount;
    }

    /**
     * Absorb damage with shield
     * @param {number} damage - Incoming damage
     * @returns {number} Remaining damage after shield absorption
     */
    absorbDamage(damage) {
      if (this._shieldAmount <= 0) return damage;

      if (damage <= this._shieldAmount) {
        this._shieldAmount -= damage;
        return 0;
      } else {
        var remaining = damage - this._shieldAmount;
        this._shieldAmount = 0;
        return remaining;
      }
    }

    // ----------------------------------------
    // Update Method (called by BuffDebuffSystem)
    // ----------------------------------------

    /**
     * Update all effects
     * @param {number} deltaTime - Time since last frame
     * @param {Object} position - Current entity position { x, y }
     * @returns {Object} { damage: number, healing: number }
     */
    update(deltaTime, position) {
      this._pendingDamage = 0;
      this._pendingHealing = 0;

      var hasMoved = this._checkMovement(position);
      var effectsToRemove = [];

      var self = this;
      this._effects.forEach(function (effect, effectId) {
        effect.remainingDuration -= deltaTime;

        if (effect.remainingDuration <= 0) {
          effectsToRemove.push(effectId);
          return;
        }

        self._processEffectTick(effect, deltaTime, hasMoved);
        self._processStackDecay(effect, deltaTime);
        self._processShield(effect);
      });

      for (var i = 0; i < effectsToRemove.length; i++) {
        this.removeEffect(effectsToRemove[i]);
      }

      return {
        damage: this._pendingDamage,
        healing: this._pendingHealing,
      };
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------

    _isImmune(effectDef) {
      if (!effectDef.conditions || !effectDef.conditions.immunityTags) return false;
      if (!this._entity) return false;

      var immunityTags = effectDef.conditions.immunityTags;
      for (var i = 0; i < immunityTags.length; i++) {
        if (this._entity.hasTag(immunityTags[i])) {
          return true;
        }
      }
      return false;
    }

    _handleExistingEffect(existingEffect, effectDef, options) {
      var StackingMode = window.VampireSurvivors.Data.StackingMode;
      var stacking = effectDef.stacking;

      switch (stacking.mode) {
        case StackingMode.NONE:
          existingEffect.remainingDuration = Math.min(
            Math.max(existingEffect.remainingDuration, options.duration || effectDef.duration),
            effectDef.maxDuration || Infinity
          );
          break;

        case StackingMode.INTENSITY:
          if (existingEffect.stacks < stacking.maxStacks) {
            existingEffect.stacks += options.stacks || 1;
            existingEffect.stacks = Math.min(existingEffect.stacks, stacking.maxStacks);
          }
          existingEffect.remainingDuration = Math.min(
            options.duration || effectDef.duration,
            effectDef.maxDuration || Infinity
          );
          this._statCacheDirty = true;
          break;

        case StackingMode.DURATION:
          existingEffect.remainingDuration = Math.min(
            existingEffect.remainingDuration + (options.duration || effectDef.duration),
            effectDef.maxDuration || Infinity
          );
          break;

        case StackingMode.INDEPENDENT:
          break;
      }

      if (options.source && options.source.position) {
        existingEffect.sourcePosition = options.source.position;
      }

      events.emit('buffdebuff:refreshed', {
        entity: this._entity,
        effectId: effectDef.id,
        stacks: existingEffect.stacks,
        remainingDuration: existingEffect.remainingDuration,
      });

      return true;
    }

    _createNewEffect(effectId, effectDef, options) {
      var effect = {
        id: effectId,
        definition: effectDef,
        stacks: options.stacks || 1,
        duration: options.duration || effectDef.duration,
        remainingDuration: options.duration || effectDef.duration,
        tickTimer: 0,
        stackDecayTimer: effectDef.stacking.decayTime || 0,
        sourcePosition: options.source ? options.source.position : null,
        sourceLevel: options.level || 1,
        values: this._calculateScaledValues(effectDef, options.level || 1),
      };

      this._effects.set(effectId, effect);
      this._statCacheDirty = true;

      events.emit('buffdebuff:applied', {
        entity: this._entity,
        effectId: effectId,
        stacks: effect.stacks,
        duration: effect.duration,
      });

      return true;
    }

    _calculateScaledValues(effectDef, level) {
      var values = Object.assign({}, effectDef.values);
      if (effectDef.scaling && level > 1) {
        for (var key in effectDef.scaling) {
          if (effectDef.scaling.hasOwnProperty(key) && values[key] !== undefined) {
            values[key] *= 1 + effectDef.scaling[key] * (level - 1);
          }
        }
      }
      return values;
    }

    _checkMovement(position) {
      if (!position) return false;
      var dx = position.x - this._lastPosition.x;
      var dy = position.y - this._lastPosition.y;
      var moved = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
      this._lastPosition.x = position.x;
      this._lastPosition.y = position.y;
      return moved;
    }

    _processEffectTick(effect, deltaTime, hasMoved) {
      var def = effect.definition;
      var EffectTag = window.VampireSurvivors.Data.EffectTag;

      if (def.conditions && def.conditions.requiresMovement && !hasMoved) {
        return;
      }

      if (def.tags && def.tags.indexOf(EffectTag.DOT) !== -1) {
        var tickRate = effect.values.tickRate || 1;
        var tickInterval = 1 / tickRate;

        effect.tickTimer += deltaTime;
        while (effect.tickTimer >= tickInterval) {
          effect.tickTimer -= tickInterval;

          var baseDamage = effect.values.damagePerTick || 0;
          var stackDamage = (effect.values.damagePerStack || 0) * (effect.stacks - 1);
          this._pendingDamage += baseDamage + stackDamage;
        }
      }

      if (def.tags && def.tags.indexOf(EffectTag.HOT) !== -1) {
        var healTickRate = effect.values.tickRate || 1;
        var healTickInterval = 1 / healTickRate;

        effect.tickTimer += deltaTime;
        while (effect.tickTimer >= healTickInterval) {
          effect.tickTimer -= healTickInterval;

          var baseHeal = effect.values.healPerTick || 0;
          var stackHeal = (effect.values.healPerStack || 0) * (effect.stacks - 1);
          this._pendingHealing += baseHeal + stackHeal;
        }
      }
    }

    _processStackDecay(effect, deltaTime) {
      var def = effect.definition;
      if (!def.stacking.stackDecay || effect.stacks <= 1) return;

      effect.stackDecayTimer -= deltaTime;
      if (effect.stackDecayTimer <= 0) {
        effect.stacks--;
        effect.stackDecayTimer = def.stacking.decayTime || 5.0;
        this._statCacheDirty = true;

        events.emit('buffdebuff:stack_decayed', {
          entity: this._entity,
          effectId: effect.id,
          stacks: effect.stacks,
        });
      }
    }

    _processShield(effect) {
      if (effect.id === 'shield_buff') {
        var baseShield = effect.values.shieldAmount || 0;
        var stackShield = (effect.values.shieldPerStack || 0) * (effect.stacks - 1);
        this._shieldAmount = Math.max(this._shieldAmount, baseShield + stackShield);
      }
    }

    _ensureStatCache() {
      if (!this._statCacheDirty) return;

      var cache = {
        speedModifier: 1,
        damageTakenModifier: 1,
        damageDealtModifier: 1,
        stats: {},
      };

      var EffectPriority = window.VampireSurvivors.Data.EffectPriority;
      var highestMovementPriority = -1;
      var speedBuffBonus = 0;

      var self = this;
      this._effects.forEach(function (effect) {
        var def = effect.definition;
        var values = effect.values;

        if (values.speedModifier !== undefined && values.speedModifier < 1) {
          var priority = EffectPriority[effect.id] || 0;
          if (priority > highestMovementPriority) {
            highestMovementPriority = priority;
            cache.speedModifier = values.speedModifier;
          }
        }

        if (values.moveSpeedBonus !== undefined) {
          speedBuffBonus += values.moveSpeedBonus;
          speedBuffBonus += (values.moveSpeedPerStack || 0) * (effect.stacks - 1);
        }

        if (values.damageTakenMultiplier !== undefined) {
          if (values.damageTakenMultiplier > 1) {
            var stackMultiplier = Math.pow(values.damageTakenMultiplier, effect.stacks);
            cache.damageTakenModifier *= stackMultiplier;
          } else {
            cache.damageTakenModifier *= values.damageTakenMultiplier;
          }
        }

        if (values.damageMultiplier !== undefined) {
          var dmgMult = values.damageMultiplier;
          dmgMult += (values.damagePerStack || 0) * (effect.stacks - 1);
          cache.damageDealtModifier *= dmgMult;
        }

        if (def.statModifiers) {
          for (var statName in def.statModifiers) {
            if (def.statModifiers.hasOwnProperty(statName)) {
              var modDef = def.statModifiers[statName];
              var modValue = values[modDef.value] || 0;

              if (!cache.stats[statName]) {
                cache.stats[statName] = { additive: 0, multiplicative: 1 };
              }

              if (modDef.type === 'additive') {
                cache.stats[statName].additive += modValue * effect.stacks;
              } else if (modDef.type === 'multiplicative') {
                cache.stats[statName].multiplicative *= Math.pow(modValue, effect.stacks);
              }
            }
          }
        }
      });

      if (cache.speedModifier === 1 && speedBuffBonus > 0) {
        cache.speedModifier = 1 + speedBuffBonus;
      } else if (cache.speedModifier < 1) {
        // Debuff takes priority
      }

      this._statModifierCache = cache;
      this._statCacheDirty = false;
    }

    // ----------------------------------------
    // Clear and Cleanup
    // ----------------------------------------

    /**
     * Clear all effects
     */
    clearAllEffects() {
      this._effects.clear();
      this._pendingDamage = 0;
      this._pendingHealing = 0;
      this._shieldAmount = 0;
      this._statCacheDirty = true;

      events.emit('buffdebuff:cleared', {
        entity: this._entity,
      });
    }

    /**
     * Clear all effects of a category
     * @param {string} category - Effect category
     */
    clearEffectsByCategory(category) {
      var toRemove = [];
      this._effects.forEach(function (effect, effectId) {
        if (effect.definition.category === category) {
          toRemove.push(effectId);
        }
      });
      for (var i = 0; i < toRemove.length; i++) {
        this.removeEffect(toRemove[i]);
      }
    }

    /**
     * Clear all debuffs
     */
    clearDebuffs() {
      this.clearEffectsByCategory(window.VampireSurvivors.Data.EffectCategory.DEBUFF);
    }

    /**
     * Clear all buffs
     */
    clearBuffs() {
      this.clearEffectsByCategory(window.VampireSurvivors.Data.EffectCategory.BUFF);
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      var activeEffects = this.getActiveEffectIds();
      var effectsStr = activeEffects.length > 0 ? activeEffects.join(', ') : 'none';

      return [
        { key: 'Effects', value: effectsStr },
        { key: 'Speed Mod', value: (this.getSpeedModifier() * 100).toFixed(0) + '%' },
        { key: 'Dmg Taken', value: (this.getDamageTakenModifier() * 100).toFixed(0) + '%' },
        { key: 'Dmg Dealt', value: (this.getDamageDealtModifier() * 100).toFixed(0) + '%' },
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
      this._statModifierCache = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.BuffDebuff = BuffDebuff;
})(window.VampireSurvivors.Components);
