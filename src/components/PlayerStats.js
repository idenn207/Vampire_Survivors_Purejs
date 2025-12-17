/**
 * @fileoverview PlayerStats component - tracks stat levels and bonuses from gold upgrades
 * @module Components/PlayerStats
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var StatUpgradeData = window.VampireSurvivors.Data.StatUpgradeData;

  // ============================================
  // Class Definition
  // ============================================
  class PlayerStats extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _stats = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._initializeStats();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _initializeStats() {
      this._stats = {
        maxHealth: { level: 0, bonus: 0 },
        damage: { level: 0, bonus: 0 },
        moveSpeed: { level: 0, bonus: 0 },
        critChance: { level: 0, bonus: 0 },
        critDamage: { level: 0, bonus: 0 },
        pickupRange: { level: 0, bonus: 0 },
        xpGain: { level: 0, bonus: 0 },
      };
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Get stat level
     * @param {string} statId
     * @returns {number}
     */
    getStatLevel(statId) {
      var stat = this._stats[statId];
      return stat ? stat.level : 0;
    }

    /**
     * Get stat bonus (percentage as decimal, e.g., 0.10 = 10%)
     * @param {string} statId
     * @returns {number}
     */
    getStatBonus(statId) {
      var stat = this._stats[statId];
      return stat ? stat.bonus : 0;
    }

    /**
     * Get multiplier for a stat (1 + bonus)
     * @param {string} statId
     * @returns {number}
     */
    getMultiplier(statId) {
      return 1 + this.getStatBonus(statId);
    }

    /**
     * Get upgrade cost for a stat
     * @param {string} statId
     * @returns {number}
     */
    getUpgradeCost(statId) {
      var level = this.getStatLevel(statId);
      return StatUpgradeData.calculateUpgradeCost(statId, level);
    }

    /**
     * Check if stat is at max level
     * @param {string} statId
     * @returns {boolean}
     */
    isStatMaxLevel(statId) {
      var level = this.getStatLevel(statId);
      return StatUpgradeData.isMaxLevel(statId, level);
    }

    /**
     * Check if player can afford upgrade
     * @param {string} statId
     * @param {number} currentGold
     * @returns {boolean}
     */
    canAffordUpgrade(statId, currentGold) {
      if (this.isStatMaxLevel(statId)) return false;
      return currentGold >= this.getUpgradeCost(statId);
    }

    /**
     * Upgrade a stat (does not handle gold - caller must do that)
     * @param {string} statId
     * @returns {boolean} Success
     */
    upgradeStat(statId) {
      var stat = this._stats[statId];
      if (!stat) return false;

      if (this.isStatMaxLevel(statId)) return false;

      stat.level++;
      stat.bonus = StatUpgradeData.calculateBonus(statId, stat.level);

      return true;
    }

    /**
     * Apply a free stat upgrade (for level-up when all weapons maxed)
     * @param {string} statId
     * @returns {boolean} Success
     */
    applyFreeUpgrade(statId) {
      var stat = this._stats[statId];
      if (!stat) return false;

      var config = StatUpgradeData.getStatConfig(statId);
      if (!config) return false;

      // Add bonus without increasing level (for free upgrades)
      stat.bonus += config.bonusPerLevel;

      return true;
    }

    /**
     * Get all stat data for display
     * @returns {Array<Object>}
     */
    getAllStatsForDisplay() {
      var result = [];
      var order = StatUpgradeData.getStatOrder();

      for (var i = 0; i < order.length; i++) {
        var statId = order[i];
        var config = StatUpgradeData.getStatConfig(statId);
        var stat = this._stats[statId];

        if (config && stat) {
          result.push({
            id: statId,
            name: config.name,
            icon: config.icon,
            level: stat.level,
            bonus: stat.bonus,
            bonusPercent: Math.round(stat.bonus * 100),
            cost: this.getUpgradeCost(statId),
            isMaxLevel: this.isStatMaxLevel(statId),
            description: config.description,
            maxLevel: config.maxLevel,
          });
        }
      }

      return result;
    }

    /**
     * Reset all stats
     */
    reset() {
      this._initializeStats();
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      var entries = [];
      var order = StatUpgradeData.getStatOrder();

      for (var i = 0; i < order.length; i++) {
        var statId = order[i];
        var config = StatUpgradeData.getStatConfig(statId);
        var stat = this._stats[statId];

        if (config && stat) {
          entries.push({
            key: config.name,
            value: 'Lv.' + stat.level + ' (+' + Math.round(stat.bonus * 100) + '%)',
          });
        }
      }

      return entries;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._stats = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.PlayerStats = PlayerStats;
})(window.VampireSurvivors.Components);
