/**
 * @fileoverview ActiveBuff component - tracks temporary buff effects from Mage skill
 * @module Components/ActiveBuff
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
  class ActiveBuff extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _activeBuff = null; // Current active buff type (attack, speed, aurora)
    _buffData = null; // Buff configuration data
    _duration = 0; // Remaining buff duration
    _maxDuration = 0; // Total buff duration
    _auraTickTimer = 0; // Timer for aurora damage ticks

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
     * Apply a buff
     * @param {string} buffType - Buff type (attack, speed, aurora)
     * @param {Object} buffData - Buff configuration
     * @param {number} duration - Buff duration in seconds
     */
    applyBuff(buffType, buffData, duration) {
      // Clear existing buff first
      if (this._activeBuff) {
        this.clearBuff();
      }

      this._activeBuff = buffType;
      this._buffData = buffData;
      this._duration = duration;
      this._maxDuration = duration;
      this._auraTickTimer = 0;

      events.emit('buff:applied', {
        entity: this._entity,
        buffType: buffType,
        buffData: buffData,
        duration: duration,
      });
    }

    /**
     * Update buff timer
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
      if (!this._activeBuff || this._duration <= 0) return;

      this._duration -= deltaTime;

      // Update aura tick timer for aurora buff
      if (this._activeBuff === 'aurora' && this._buffData) {
        this._auraTickTimer += deltaTime;
      }

      // Check for expiration
      if (this._duration <= 0) {
        this._expireBuff();
      }
    }

    /**
     * Clear active buff
     */
    clearBuff() {
      if (!this._activeBuff) return;

      var expiredType = this._activeBuff;
      this._activeBuff = null;
      this._buffData = null;
      this._duration = 0;
      this._maxDuration = 0;
      this._auraTickTimer = 0;

      events.emit('buff:expired', {
        entity: this._entity,
        buffType: expiredType,
      });
    }

    /**
     * Check if should process aura tick
     * @returns {boolean}
     */
    shouldProcessAuraTick() {
      if (this._activeBuff !== 'aurora' || !this._buffData) return false;

      var tickRate = this._buffData.auraTickRate || 0.5;
      if (this._auraTickTimer >= tickRate) {
        this._auraTickTimer -= tickRate;
        return true;
      }
      return false;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _expireBuff() {
      var expiredType = this._activeBuff;
      this._activeBuff = null;
      this._buffData = null;
      this._duration = 0;
      this._maxDuration = 0;
      this._auraTickTimer = 0;

      events.emit('buff:expired', {
        entity: this._entity,
        buffType: expiredType,
      });
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get activeBuff() {
      return this._activeBuff;
    }

    get buffData() {
      return this._buffData;
    }

    get duration() {
      return this._duration;
    }

    get maxDuration() {
      return this._maxDuration;
    }

    get durationRatio() {
      if (this._maxDuration <= 0) return 0;
      return this._duration / this._maxDuration;
    }

    get hasBuff() {
      return this._activeBuff !== null && this._duration > 0;
    }

    /**
     * Get attack bonus from current buff
     * @returns {number}
     */
    get attackBonus() {
      if (this._activeBuff !== 'attack' || !this._buffData) return 0;
      return this._buffData.attackBonus || 0;
    }

    /**
     * Get crit chance bonus from current buff
     * @returns {number}
     */
    get critChanceBonus() {
      if (this._activeBuff !== 'attack' || !this._buffData) return 0;
      return this._buffData.critChanceBonus || 0;
    }

    /**
     * Get crit damage bonus from current buff
     * @returns {number}
     */
    get critDamageBonus() {
      if (this._activeBuff !== 'attack' || !this._buffData) return 0;
      return this._buffData.critDamageBonus || 0;
    }

    /**
     * Get movement speed bonus from current buff
     * @returns {number}
     */
    get moveSpeedBonus() {
      if (this._activeBuff !== 'speed' || !this._buffData) return 0;
      return this._buffData.moveSpeedBonus || 0;
    }

    /**
     * Get cooldown reduction bonus from current buff
     * @returns {number}
     */
    get cooldownReductionBonus() {
      if (this._activeBuff !== 'speed' || !this._buffData) return 0;
      return this._buffData.cooldownReductionBonus || 0;
    }

    /**
     * Get duration bonus from current buff
     * @returns {number}
     */
    get durationBonus() {
      if (this._activeBuff !== 'speed' || !this._buffData) return 0;
      return this._buffData.durationBonus || 0;
    }

    /**
     * Get aurora aura radius
     * @returns {number}
     */
    get auraRadius() {
      if (this._activeBuff !== 'aurora' || !this._buffData) return 0;
      return this._buffData.auraRadius || 0;
    }

    /**
     * Get aurora damage percent
     * @returns {number}
     */
    get auraDamagePercent() {
      if (this._activeBuff !== 'aurora' || !this._buffData) return 0;
      return this._buffData.auraDamagePercent || 0;
    }

    /**
     * Get aurora status effects list
     * @returns {Array<string>}
     */
    get auraStatusEffects() {
      if (this._activeBuff !== 'aurora' || !this._buffData) return [];
      return this._buffData.statusEffects || [];
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      if (!this._activeBuff) {
        return [{ key: 'Buff', value: 'None' }];
      }
      return [{ key: 'Buff', value: this._activeBuff + ' (' + this._duration.toFixed(1) + 's)' }];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._activeBuff = null;
      this._buffData = null;
      this._duration = 0;
      this._maxDuration = 0;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.ActiveBuff = ActiveBuff;
})(window.VampireSurvivors.Components);
