/**
 * @fileoverview Velocity component for movement processing
 * @module Components/Velocity
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var Vector2 = window.VampireSurvivors.Utils.Vector2;

  // ============================================
  // Class Definition
  // ============================================
  class Velocity extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _velocity = null;
    _maxSpeed = 0; // 0 = unlimited

    // Knockback properties
    _knockbackVelocity = null;
    _knockbackDecay = 800; // How fast knockback decays per second
    _knockbackResistance = 0; // 0-1, percentage of knockback ignored

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(vx, vy, maxSpeed) {
      super();
      this._velocity = new Vector2(vx || 0, vy || 0);
      this._maxSpeed = maxSpeed || 0;
      this._knockbackVelocity = new Vector2(0, 0);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    set(vx, vy) {
      this._velocity.set(vx, vy);
      return this;
    }

    /**
     * Apply knockback force in a direction
     * @param {number} dirX - Direction X (normalized)
     * @param {number} dirY - Direction Y (normalized)
     * @param {number} force - Knockback force
     */
    applyKnockback(dirX, dirY, force) {
      // Apply knockback resistance
      var effectiveForce = force * (1 - this._knockbackResistance);
      if (effectiveForce <= 0) return;

      // Normalize direction
      var length = Math.sqrt(dirX * dirX + dirY * dirY);
      if (length > 0) {
        dirX /= length;
        dirY /= length;
      }

      // Add to knockback velocity
      this._knockbackVelocity.x += dirX * effectiveForce;
      this._knockbackVelocity.y += dirY * effectiveForce;
    }

    /**
     * Update knockback velocity (decay over time)
     * @param {number} deltaTime - Time since last frame
     * @returns {Object} Current knockback velocity { x, y }
     */
    updateKnockback(deltaTime) {
      var kbx = this._knockbackVelocity.x;
      var kby = this._knockbackVelocity.y;

      if (kbx === 0 && kby === 0) {
        return { x: 0, y: 0 };
      }

      // Decay knockback
      var decay = this._knockbackDecay * deltaTime;
      var length = Math.sqrt(kbx * kbx + kby * kby);

      if (length <= decay) {
        this._knockbackVelocity.set(0, 0);
        return { x: kbx, y: kby }; // Return final frame of knockback
      }

      // Apply decay in the opposite direction of knockback
      var decayRatio = (length - decay) / length;
      this._knockbackVelocity.x *= decayRatio;
      this._knockbackVelocity.y *= decayRatio;

      return { x: kbx, y: kby };
    }

    /**
     * Get current knockback velocity
     * @returns {Object} Knockback velocity { x, y }
     */
    getKnockbackVelocity() {
      return {
        x: this._knockbackVelocity.x,
        y: this._knockbackVelocity.y,
      };
    }

    /**
     * Check if currently being knocked back
     * @returns {boolean}
     */
    isKnockedBack() {
      return this._knockbackVelocity.x !== 0 || this._knockbackVelocity.y !== 0;
    }

    /**
     * Clear all knockback
     */
    clearKnockback() {
      this._knockbackVelocity.set(0, 0);
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get vx() {
      return this._velocity.x;
    }

    set vx(value) {
      this._velocity.x = value;
    }

    get vy() {
      return this._velocity.y;
    }

    set vy(value) {
      this._velocity.y = value;
    }

    get velocity() {
      return this._velocity;
    }

    set velocity(value) {
      this._velocity.copy(value);
    }

    get maxSpeed() {
      return this._maxSpeed;
    }

    set maxSpeed(value) {
      this._maxSpeed = Math.max(0, value);
    }

    get speed() {
      return this._velocity.length();
    }

    get knockbackResistance() {
      return this._knockbackResistance;
    }

    set knockbackResistance(value) {
      this._knockbackResistance = Math.max(0, Math.min(1, value));
    }

    get knockbackDecay() {
      return this._knockbackDecay;
    }

    set knockbackDecay(value) {
      this._knockbackDecay = Math.max(0, value);
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [
        { key: 'Velocity', value: Math.round(this._velocity.x) + ', ' + Math.round(this._velocity.y) },
      ];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      super.dispose();
      this._velocity = null;
      this._knockbackVelocity = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Velocity = Velocity;
})(window.VampireSurvivors.Components);
