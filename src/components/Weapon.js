/**
 * @fileoverview Weapon component - manages weapon stats, cooldowns, and upgrades
 * @module Components/Weapon
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;

  // ============================================
  // Class Definition
  // ============================================
  class Weapon extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _id = '';
    _name = '';
    _level = 1;
    _maxLevel = 5;
    _cooldown = 0;
    _cooldownMax = 1.0;
    _damage = 10;
    _attackType = '';
    _targetingMode = '';
    _isAuto = true;
    _stats = null;
    _upgrades = null;
    _data = null; // Store original weapon data for reference

    // Tier properties
    _tier = 1;
    _maxTier = 4;
    _isExclusive = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {Object} weaponData - Weapon configuration from WeaponData
     */
    constructor(weaponData) {
      super();

      if (!weaponData) {
        console.warn('[Weapon] No weapon data provided');
        return;
      }

      // Store original weapon data for reference (icons, etc.)
      this._data = weaponData;

      this._id = weaponData.id || '';
      this._name = weaponData.name || '';
      this._attackType = weaponData.attackType || '';
      this._targetingMode = weaponData.targetingMode || '';
      this._isAuto = weaponData.isAuto !== false;
      this._cooldownMax = weaponData.cooldown || 1.0;
      this._damage = weaponData.damage || 10;
      this._maxLevel = weaponData.maxLevel || 5;
      this._upgrades = weaponData.upgrades || {};

      // Tier properties
      this._tier = weaponData.tier || 1;
      this._maxTier = weaponData.maxTier || 4;
      this._isExclusive = weaponData.isExclusive || false;

      // Copy all stats (excluding metadata)
      this._stats = {};
      var excludeKeys = ['id', 'name', 'attackType', 'targetingMode', 'isAuto', 'upgrades', 'maxLevel', 'tier', 'maxTier', 'isExclusive'];
      for (var key in weaponData) {
        if (weaponData.hasOwnProperty(key) && excludeKeys.indexOf(key) === -1) {
          this._stats[key] = weaponData[key];
        }
      }
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Update cooldown timer
     * @param {number} deltaTime
     * @param {number} [cooldownReduction] - Multiplier (0-1) to reduce cooldown
     */
    updateCooldown(deltaTime, cooldownReduction) {
      if (this._cooldown > 0) {
        var reduction = cooldownReduction || 0;
        this._cooldown -= deltaTime * (1 + reduction);
        if (this._cooldown < 0) {
          this._cooldown = 0;
        }
      }
    }

    /**
     * Check if weapon can fire
     * @returns {boolean}
     */
    canFire() {
      return this._cooldown <= 0;
    }

    /**
     * Fire the weapon (resets cooldown)
     */
    fire() {
      this._cooldown = this._cooldownMax;
    }

    /**
     * Upgrade weapon to next level
     * @returns {boolean} True if upgrade succeeded
     */
    upgrade() {
      if (this._level >= this._maxLevel) {
        return false;
      }

      this._level++;

      var upgradeData = this._upgrades[this._level];
      if (upgradeData) {
        // Apply upgrades to stats
        for (var key in upgradeData) {
          if (upgradeData.hasOwnProperty(key)) {
            if (key === 'damage') {
              this._damage = upgradeData[key];
            } else if (key === 'cooldown') {
              this._cooldownMax = upgradeData[key];
            } else {
              this._stats[key] = upgradeData[key];
            }
          }
        }
      }

      return true;
    }

    /**
     * Get a stat value
     * @param {string} name - Stat name
     * @param {*} [defaultValue] - Default if not found
     * @returns {*}
     */
    getStat(name, defaultValue) {
      if (this._stats.hasOwnProperty(name)) {
        return this._stats[name];
      }
      return defaultValue !== undefined ? defaultValue : null;
    }

    /**
     * Set a stat value
     * @param {string} name
     * @param {*} value
     */
    setStat(name, value) {
      this._stats[name] = value;
    }

    /**
     * Get all current stats
     * @returns {Object}
     */
    getAllStats() {
      var result = {
        id: this._id,
        name: this._name,
        level: this._level,
        maxLevel: this._maxLevel,
        tier: this._tier,
        maxTier: this._maxTier,
        isExclusive: this._isExclusive,
        damage: this._damage,
        cooldown: this._cooldownMax,
        attackType: this._attackType,
        targetingMode: this._targetingMode,
        isAuto: this._isAuto,
      };

      for (var key in this._stats) {
        if (this._stats.hasOwnProperty(key)) {
          result[key] = this._stats[key];
        }
      }

      return result;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get id() {
      return this._id;
    }

    get name() {
      return this._name;
    }

    get level() {
      return this._level;
    }

    get maxLevel() {
      return this._maxLevel;
    }

    get isMaxLevel() {
      return this._level >= this._maxLevel;
    }

    get cooldown() {
      return this._cooldown;
    }

    get cooldownMax() {
      return this._cooldownMax;
    }

    get cooldownProgress() {
      if (this._cooldownMax <= 0) return 1;
      return 1 - this._cooldown / this._cooldownMax;
    }

    get damage() {
      return this._damage;
    }

    set damage(value) {
      this._damage = Math.max(0, value);
    }

    get attackType() {
      return this._attackType;
    }

    get targetingMode() {
      return this._targetingMode;
    }

    get isAuto() {
      return this._isAuto;
    }

    get data() {
      return this._data;
    }

    get tier() {
      return this._tier;
    }

    set tier(value) {
      this._tier = Math.max(1, Math.min(value, this._maxTier));
    }

    get maxTier() {
      return this._maxTier;
    }

    get isExclusive() {
      return this._isExclusive;
    }

    /**
     * Check if weapon can evolve to next tier
     * (at max level and below max tier)
     */
    get canEvolveTier() {
      return this._level >= this._maxLevel && this._tier < this._maxTier;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: this._name || this._id,
        entries: [
          { key: 'Level', value: this._level + '/' + this._maxLevel },
          { key: 'Tier', value: this._tier + '/' + this._maxTier },
          { key: 'Damage', value: this._damage },
          { key: 'Cooldown', value: this._cooldown.toFixed(2) + '/' + this._cooldownMax },
          { key: 'Type', value: this._attackType },
          { key: 'Target', value: this._targetingMode },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._stats = null;
      this._upgrades = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Weapon = Weapon;
})(window.VampireSurvivors.Components);
