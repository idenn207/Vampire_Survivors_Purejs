/**
 * @fileoverview WeaponSlot component - container for player's equipped weapons
 * @module Components/WeaponSlot
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var Weapon = Components.Weapon;

  // ============================================
  // Constants
  // ============================================
  var MAX_WEAPONS = 10;

  // ============================================
  // Class Definition
  // ============================================
  class WeaponSlot extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _weapons = [];
    _maxWeapons = MAX_WEAPONS;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {number} [maxWeapons] - Maximum weapons that can be equipped
     */
    constructor(maxWeapons) {
      super();
      this._weapons = [];
      this._maxWeapons = maxWeapons || MAX_WEAPONS;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Add a weapon to the slot
     * @param {Weapon} weapon - Weapon component to add
     * @returns {boolean} True if added successfully
     */
    addWeapon(weapon) {
      if (!(weapon instanceof Weapon)) {
        console.warn('[WeaponSlot] Invalid weapon type');
        return false;
      }

      if (this._weapons.length >= this._maxWeapons) {
        console.warn('[WeaponSlot] Max weapons reached:', this._maxWeapons);
        return false;
      }

      // Check for duplicate
      if (this.hasWeapon(weapon.id)) {
        console.warn('[WeaponSlot] Weapon already equipped:', weapon.id);
        return false;
      }

      this._weapons.push(weapon);
      return true;
    }

    /**
     * Remove a weapon by ID
     * @param {string} weaponId
     * @returns {Weapon|null} Removed weapon or null
     */
    removeWeapon(weaponId) {
      var index = this._findWeaponIndex(weaponId);
      if (index === -1) {
        return null;
      }

      var weapon = this._weapons[index];
      this._weapons.splice(index, 1);
      return weapon;
    }

    /**
     * Get a weapon by ID
     * @param {string} weaponId
     * @returns {Weapon|null}
     */
    getWeapon(weaponId) {
      var index = this._findWeaponIndex(weaponId);
      return index !== -1 ? this._weapons[index] : null;
    }

    /**
     * Check if weapon is equipped
     * @param {string} weaponId
     * @returns {boolean}
     */
    hasWeapon(weaponId) {
      return this._findWeaponIndex(weaponId) !== -1;
    }

    /**
     * Get all equipped weapons
     * @returns {Array<Weapon>}
     */
    getWeapons() {
      return this._weapons.slice();
    }

    /**
     * Get weapons filtered by type
     * @param {string} attackType
     * @returns {Array<Weapon>}
     */
    getWeaponsByType(attackType) {
      return this._weapons.filter(function (weapon) {
        return weapon.attackType === attackType;
      });
    }

    /**
     * Get auto-firing weapons
     * @returns {Array<Weapon>}
     */
    getAutoWeapons() {
      return this._weapons.filter(function (weapon) {
        return weapon.isAuto;
      });
    }

    /**
     * Get manual weapons
     * @returns {Array<Weapon>}
     */
    getManualWeapons() {
      return this._weapons.filter(function (weapon) {
        return !weapon.isAuto;
      });
    }

    /**
     * Upgrade a weapon
     * @param {string} weaponId
     * @returns {boolean} True if upgraded
     */
    upgradeWeapon(weaponId) {
      var weapon = this.getWeapon(weaponId);
      if (!weapon) {
        return false;
      }
      return weapon.upgrade();
    }

    /**
     * Replace a weapon with another
     * @param {string} oldWeaponId
     * @param {Weapon} newWeapon
     * @returns {boolean}
     */
    replaceWeapon(oldWeaponId, newWeapon) {
      var index = this._findWeaponIndex(oldWeaponId);
      if (index === -1) {
        return false;
      }

      var oldWeapon = this._weapons[index];
      oldWeapon.dispose();
      this._weapons[index] = newWeapon;
      return true;
    }

    /**
     * Update all weapon cooldowns
     * @param {number} deltaTime
     * @param {number} [cooldownReduction]
     */
    updateCooldowns(deltaTime, cooldownReduction) {
      for (var i = 0; i < this._weapons.length; i++) {
        this._weapons[i].updateCooldown(deltaTime, cooldownReduction);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _findWeaponIndex(weaponId) {
      for (var i = 0; i < this._weapons.length; i++) {
        if (this._weapons[i].id === weaponId) {
          return i;
        }
      }
      return -1;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get weaponCount() {
      return this._weapons.length;
    }

    get maxWeapons() {
      return this._maxWeapons;
    }

    get isFull() {
      return this._weapons.length >= this._maxWeapons;
    }

    get isEmpty() {
      return this._weapons.length === 0;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var weaponNames = this._weapons
        .map(function (w) {
          return w.name + ' (Lv' + w.level + ')';
        })
        .join(', ');

      return {
        label: 'Weapons',
        entries: [
          { key: 'Count', value: this._weapons.length + '/' + this._maxWeapons },
          { key: 'Equipped', value: weaponNames || 'None' },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      for (var i = 0; i < this._weapons.length; i++) {
        this._weapons[i].dispose();
      }
      this._weapons = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.WeaponSlot = WeaponSlot;
})(window.VampireSurvivors.Components);
