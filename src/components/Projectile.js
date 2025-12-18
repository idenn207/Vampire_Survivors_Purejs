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

    // Ricochet properties
    _ricochetBounces = 0;      // Remaining bounces
    _ricochetDamageDecay = 1;  // Damage multiplier per bounce
    _ricochetRange = 0;        // Max range to find bounce target

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
     * @param {Object} [ricochet] - Ricochet config { bounces, damageDecay, bounceRange }
     */
    reset(damage, pierce, lifetime, sourceWeaponId, ricochet) {
      this._damage = damage || 0;
      this._pierce = pierce !== undefined ? pierce : DEFAULT_PIERCE;
      this._lifetime = lifetime !== undefined ? lifetime : DEFAULT_LIFETIME;
      this._elapsed = 0;
      this._hitEnemies.clear();
      this._sourceWeaponId = sourceWeaponId || null;

      // Reset ricochet
      if (ricochet) {
        this._ricochetBounces = ricochet.bounces || 0;
        this._ricochetDamageDecay = ricochet.damageDecay || 0.7;
        this._ricochetRange = ricochet.bounceRange || 100;
      } else {
        this._ricochetBounces = 0;
        this._ricochetDamageDecay = 1;
        this._ricochetRange = 0;
      }
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

      // Check if can ricochet instead of being destroyed
      if (this._pierce < 0 && this._ricochetBounces > 0) {
        return false; // Don't destroy yet, let combat system handle ricochet
      }

      return this._pierce < 0;
    }

    /**
     * Check if projectile can ricochet
     * @returns {boolean}
     */
    canRicochet() {
      return this._ricochetBounces > 0;
    }

    /**
     * Perform a ricochet - reduce bounces and apply damage decay
     * @returns {boolean} True if ricochet was successful
     */
    doRicochet() {
      if (this._ricochetBounces <= 0) return false;

      this._ricochetBounces--;
      this._damage = Math.round(this._damage * this._ricochetDamageDecay);

      return true;
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

    get ricochetBounces() {
      return this._ricochetBounces;
    }

    get ricochetRange() {
      return this._ricochetRange;
    }

    get ricochetDamageDecay() {
      return this._ricochetDamageDecay;
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
