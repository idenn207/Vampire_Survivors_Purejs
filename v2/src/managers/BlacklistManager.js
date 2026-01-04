/**
 * @fileoverview Blacklist manager - tracks weapons excluded from level-up options
 * @module Managers/BlacklistManager
 */
(function (Managers) {
  'use strict';

  // ============================================
  // Class Definition
  // ============================================
  class BlacklistManager {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _blacklistedWeapons = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._blacklistedWeapons = new Set();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Add weapon to blacklist (used as main in evolution)
     * @param {string} weaponId
     */
    addToBlacklist(weaponId) {
      if (weaponId) {
        this._blacklistedWeapons.add(weaponId);
        console.log('[BlacklistManager] Added to blacklist:', weaponId);
      }
    }

    /**
     * Remove weapon from blacklist
     * @param {string} weaponId
     */
    removeFromBlacklist(weaponId) {
      this._blacklistedWeapons.delete(weaponId);
    }

    /**
     * Check if weapon is blacklisted
     * @param {string} weaponId
     * @returns {boolean}
     */
    isBlacklisted(weaponId) {
      return this._blacklistedWeapons.has(weaponId);
    }

    /**
     * Get all blacklisted weapon IDs
     * @returns {Array<string>}
     */
    getBlacklistedWeapons() {
      return Array.from(this._blacklistedWeapons);
    }

    /**
     * Get count of blacklisted weapons
     * @returns {number}
     */
    getBlacklistCount() {
      return this._blacklistedWeapons.size;
    }

    /**
     * Filter out blacklisted weapons from a list
     * @param {Array<string>} weaponIds
     * @returns {Array<string>}
     */
    filterBlacklisted(weaponIds) {
      var self = this;
      return weaponIds.filter(function (id) {
        return !self._blacklistedWeapons.has(id);
      });
    }

    /**
     * Filter out blacklisted weapon objects from a list
     * @param {Array<Object>} weapons - Array of weapon data objects with id property
     * @returns {Array<Object>}
     */
    filterBlacklistedWeapons(weapons) {
      var self = this;
      return weapons.filter(function (weapon) {
        return !self._blacklistedWeapons.has(weapon.id);
      });
    }

    /**
     * Reset blacklist (call on new game)
     */
    reset() {
      this._blacklistedWeapons.clear();
      console.log('[BlacklistManager] Blacklist cleared');
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Blacklist',
        entries: [
          { key: 'Count', value: this._blacklistedWeapons.size },
          { key: 'Weapons', value: this.getBlacklistedWeapons().join(', ') || 'None' },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._blacklistedWeapons.clear();
      this._blacklistedWeapons = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Managers.BlacklistManager = BlacklistManager;
})(window.VampireSurvivors.Managers);
