/**
 * @fileoverview AreaEffect component - tracks area damage zones
 * @module Components/AreaEffect
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
  class AreaEffect extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _damage = 0;
    _radius = 50;
    _duration = 5.0;
    _elapsed = 0;
    _tickRate = 2;
    _tickTimer = 0;
    _hitEnemies = null;
    _sourceWeaponId = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {number} [damage] - Damage per tick
     * @param {number} [radius] - Effect radius
     * @param {number} [duration] - Total duration
     * @param {number} [tickRate] - Damage ticks per second
     */
    constructor(damage, radius, duration, tickRate) {
      super();
      this._damage = damage || 0;
      this._radius = radius || 50;
      this._duration = duration || 5.0;
      this._tickRate = tickRate || 2;
      this._tickTimer = 0;
      this._hitEnemies = new Map(); // Map<enemyId, lastTickTime>
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Update elapsed time and tick timer
     * @param {number} deltaTime
     * @returns {boolean} True if still active
     */
    update(deltaTime) {
      this._elapsed += deltaTime;
      this._tickTimer += deltaTime;
      return !this.isExpired;
    }

    /**
     * Check if a damage tick is ready
     * @returns {boolean}
     */
    isTickReady() {
      var tickInterval = 1 / this._tickRate;
      return this._tickTimer >= tickInterval;
    }

    /**
     * Consume a tick
     */
    consumeTick() {
      var tickInterval = 1 / this._tickRate;
      this._tickTimer -= tickInterval;
    }

    /**
     * Check if can damage an enemy (respects tick rate per enemy)
     * @param {number} enemyId
     * @returns {boolean}
     */
    canDamage(enemyId) {
      var tickInterval = 1 / this._tickRate;
      var lastHit = this._hitEnemies.get(enemyId);

      if (lastHit === undefined) {
        return true;
      }

      return this._elapsed - lastHit >= tickInterval;
    }

    /**
     * Record a hit on an enemy
     * @param {number} enemyId
     */
    recordHit(enemyId) {
      this._hitEnemies.set(enemyId, this._elapsed);
    }

    /**
     * Reset area effect for pool reuse
     * @param {number} damage
     * @param {number} radius
     * @param {number} duration
     * @param {number} tickRate
     * @param {string} [sourceWeaponId]
     */
    reset(damage, radius, duration, tickRate, sourceWeaponId) {
      this._damage = damage || 0;
      this._radius = radius || 50;
      this._duration = duration || 5.0;
      this._tickRate = tickRate || 2;
      this._elapsed = 0;
      this._tickTimer = 0;
      this._hitEnemies.clear();
      this._sourceWeaponId = sourceWeaponId || null;
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

    get radius() {
      return this._radius;
    }

    set radius(value) {
      this._radius = Math.max(0, value);
    }

    get duration() {
      return this._duration;
    }

    get elapsed() {
      return this._elapsed;
    }

    get isExpired() {
      return this._elapsed >= this._duration;
    }

    get remainingTime() {
      return Math.max(0, this._duration - this._elapsed);
    }

    get tickRate() {
      return this._tickRate;
    }

    get sourceWeaponId() {
      return this._sourceWeaponId;
    }

    get progress() {
      return this._elapsed / this._duration;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [
        { key: 'Damage', value: this._damage },
        { key: 'Radius', value: this._radius },
        { key: 'Duration', value: this._elapsed.toFixed(1) + '/' + this._duration.toFixed(1) },
        { key: 'TickRate', value: this._tickRate + '/s' },
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
  Components.AreaEffect = AreaEffect;
})(window.VampireSurvivors.Components);
