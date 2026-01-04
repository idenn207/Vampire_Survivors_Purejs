/**
 * @fileoverview Shield component - tracks temporary shield HP that absorbs damage
 * @module Components/Shield
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
  class Shield extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _shieldAmount = 0;
    _maxShieldRecorded = 0; // For UI display purposes

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
     * Add shield HP (stacks with existing shield)
     * @param {number} amount - Shield amount to add
     */
    addShield(amount) {
      if (amount <= 0) return;

      var oldAmount = this._shieldAmount;
      this._shieldAmount += amount;

      // Track maximum for UI bar display
      if (this._shieldAmount > this._maxShieldRecorded) {
        this._maxShieldRecorded = this._shieldAmount;
      }

      events.emit('shield:applied', {
        entity: this._entity,
        amount: amount,
        totalShield: this._shieldAmount,
        previousShield: oldAmount,
      });
    }

    /**
     * Absorb incoming damage with shield
     * @param {number} damage - Incoming damage amount
     * @returns {number} Remaining damage after shield absorption (0 if fully absorbed)
     */
    absorbDamage(damage) {
      if (damage <= 0 || this._shieldAmount <= 0) {
        return damage;
      }

      var absorbed = Math.min(damage, this._shieldAmount);
      var remaining = damage - absorbed;

      this._shieldAmount -= absorbed;

      events.emit('shield:damaged', {
        entity: this._entity,
        absorbed: absorbed,
        remaining: remaining,
        currentShield: this._shieldAmount,
      });

      // Shield broken
      if (this._shieldAmount <= 0) {
        this._shieldAmount = 0;
        this._maxShieldRecorded = 0;

        events.emit('shield:broken', {
          entity: this._entity,
        });
      }

      return remaining;
    }

    /**
     * Clear all shield
     */
    clearShield() {
      if (this._shieldAmount > 0) {
        this._shieldAmount = 0;
        this._maxShieldRecorded = 0;

        events.emit('shield:broken', {
          entity: this._entity,
        });
      }
    }

    /**
     * Check if entity has active shield
     * @returns {boolean}
     */
    hasShield() {
      return this._shieldAmount > 0;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get shieldAmount() {
      return this._shieldAmount;
    }

    get maxShieldRecorded() {
      return this._maxShieldRecorded;
    }

    get shieldRatio() {
      if (this._maxShieldRecorded <= 0) return 0;
      return this._shieldAmount / this._maxShieldRecorded;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [{ key: 'Shield', value: Math.floor(this._shieldAmount) }];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._shieldAmount = 0;
      this._maxShieldRecorded = 0;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Shield = Shield;
})(window.VampireSurvivors.Components);
