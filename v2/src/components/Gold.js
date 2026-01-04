/**
 * @fileoverview Gold component - tracks player currency
 * @module Components/Gold
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
  class Gold extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _currentGold = 0;
    _totalGoldGained = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {number} [initialGold] - Starting gold amount
     */
    constructor(initialGold) {
      super();
      this._currentGold = initialGold || 0;
      this._totalGoldGained = 0;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Add gold
     * @param {number} amount - Gold to add
     */
    addGold(amount) {
      if (amount <= 0) return;

      this._currentGold += amount;
      this._totalGoldGained += amount;

      // Emit gold gained event
      events.emit('player:gold_gained', {
        entity: this._entity,
        amount: amount,
        currentGold: this._currentGold,
      });
    }

    /**
     * Spend gold
     * @param {number} amount - Gold to spend
     * @returns {boolean} True if successful
     */
    spendGold(amount) {
      if (amount <= 0 || !this.hasEnough(amount)) {
        return false;
      }

      this._currentGold -= amount;

      events.emit('player:gold_spent', {
        entity: this._entity,
        amount: amount,
        currentGold: this._currentGold,
      });

      return true;
    }

    /**
     * Check if player has enough gold
     * @param {number} amount
     * @returns {boolean}
     */
    hasEnough(amount) {
      return this._currentGold >= amount;
    }

    /**
     * Reset gold for new game
     */
    reset() {
      this._currentGold = 0;
      this._totalGoldGained = 0;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get currentGold() {
      return this._currentGold;
    }

    // Alias for currentGold (used by UI components)
    get amount() {
      return this._currentGold;
    }

    get totalGoldGained() {
      return this._totalGoldGained;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [
        { key: 'Gold', value: this._currentGold },
        { key: 'Total Earned', value: this._totalGoldGained },
      ];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Gold = Gold;
})(window.VampireSurvivors.Components);
