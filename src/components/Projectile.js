/**
 * @fileoverview Projectile component - tracks projectile damage, pierce, and lifetime
 * @module Components/Projectile
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_LIFETIME = 3.0;
  var DEFAULT_PIERCE = 0;

  // ============================================
  // Class Definition
  // ============================================
  class Projectile extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _damage = 0;
    _pierce = DEFAULT_PIERCE;
    _lifetime = DEFAULT_LIFETIME;
    _elapsed = 0;
    _hitEnemies = null;
    _sourceWeaponId = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {number} [damage] - Damage dealt on hit
     * @param {number} [pierce] - Number of enemies can pass through (0 = destroyed on first hit)
     * @param {number} [lifetime] - Time in seconds before auto-despawn
     */
    constructor(damage, pierce, lifetime) {
      super();
      this._damage = damage || 0;
      this._pierce = pierce !== undefined ? pierce : DEFAULT_PIERCE;
      this._lifetime = lifetime !== undefined ? lifetime : DEFAULT_LIFETIME;
      this._elapsed = 0;
      this._hitEnemies = new Set();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Update elapsed time
     * @param {number} deltaTime
     * @returns {boolean} True if still alive
     */
    update(deltaTime) {
      this._elapsed += deltaTime;
      return !this.isExpired;
    }

    /**
     * Reset projectile for pool reuse
     * @param {number} damage
     * @param {number} pierce
     * @param {number} lifetime
     * @param {string} [sourceWeaponId]
     */
    reset(damage, pierce, lifetime, sourceWeaponId) {
      this._damage = damage || 0;
      this._pierce = pierce !== undefined ? pierce : DEFAULT_PIERCE;
      this._lifetime = lifetime !== undefined ? lifetime : DEFAULT_LIFETIME;
      this._elapsed = 0;
      this._hitEnemies.clear();
      this._sourceWeaponId = sourceWeaponId || null;
    }

    /**
     * Check if an enemy has already been hit
     * @param {number} enemyId
     * @returns {boolean}
     */
    hasHitEnemy(enemyId) {
      return this._hitEnemies.has(enemyId);
    }

    /**
     * Record a hit on an enemy
     * @param {number} enemyId
     */
    recordHit(enemyId) {
      this._hitEnemies.add(enemyId);
    }

    /**
     * Handle a hit - decrement pierce and return if should be destroyed
     * @param {number} enemyId
     * @returns {boolean} True if projectile should be destroyed
     */
    onHit(enemyId) {
      if (this.hasHitEnemy(enemyId)) {
        return false; // Already hit, don't process again
      }

      this.recordHit(enemyId);
      this._pierce--;

      return this._pierce < 0;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get damage() {
      return this._damage;
    }

    set damage(value) {
      this._damage = Math.max(0, value);
    }

    get pierce() {
      return this._pierce;
    }

    set pierce(value) {
      this._pierce = value;
    }

    get lifetime() {
      return this._lifetime;
    }

    set lifetime(value) {
      this._lifetime = Math.max(0, value);
    }

    get elapsed() {
      return this._elapsed;
    }

    get isExpired() {
      return this._elapsed >= this._lifetime;
    }

    get remainingTime() {
      return Math.max(0, this._lifetime - this._elapsed);
    }

    get sourceWeaponId() {
      return this._sourceWeaponId;
    }

    set sourceWeaponId(value) {
      this._sourceWeaponId = value;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [
        { key: 'Damage', value: this._damage },
        { key: 'Pierce', value: this._pierce },
        { key: 'Lifetime', value: this._elapsed.toFixed(1) + '/' + this._lifetime.toFixed(1) },
        { key: 'Source', value: this._sourceWeaponId || 'unknown' },
      ];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._hitEnemies.clear();
      this._hitEnemies = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Projectile = Projectile;
})(window.VampireSurvivors.Components);
