/**
 * @fileoverview Health component - tracks entity health state
 * @module Components/Health
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_MAX_HEALTH = 100;
  var DEFAULT_INVINCIBILITY_DURATION = 1; // seconds

  // ============================================
  // Class Definition
  // ============================================
  class Health extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _currentHealth = DEFAULT_MAX_HEALTH;
    _maxHealth = DEFAULT_MAX_HEALTH;
    _isInvincible = false;
    _invincibilityTimer = 0;
    _invincibilityDuration = DEFAULT_INVINCIBILITY_DURATION;
    _isDead = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(maxHealth = DEFAULT_MAX_HEALTH) {
      super();
      this._maxHealth = Math.max(1, maxHealth);
      this._currentHealth = this._maxHealth;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Apply damage to this entity
     * @param {number} amount - Damage amount
     * @returns {boolean} True if damage was applied
     */
    takeDamage(amount) {
      if (this._isDead || this._isInvincible || amount <= 0) {
        return false;
      }

      this._currentHealth = Math.max(0, this._currentHealth - amount);

      // Emit damage event
      events.emit('entity:damaged', {
        entity: this._entity,
        amount: amount,
        currentHealth: this._currentHealth,
        maxHealth: this._maxHealth,
      });

      // Check for death
      if (this._currentHealth <= 0) {
        this.die();
      }

      return true;
    }

    /**
     * Restore health
     * @param {number} amount - Heal amount
     */
    heal(amount) {
      if (this._isDead || amount <= 0) return;

      var oldHealth = this._currentHealth;
      this._currentHealth = Math.min(this._maxHealth, this._currentHealth + amount);

      if (this._currentHealth > oldHealth) {
        events.emit('entity:healed', {
          entity: this._entity,
          amount: this._currentHealth - oldHealth,
          currentHealth: this._currentHealth,
          maxHealth: this._maxHealth,
        });
      }
    }

    /**
     * Set invincibility for a duration
     * @param {number} duration - Duration in seconds
     */
    setInvincible(duration) {
      if (duration <= 0) return;
      this._isInvincible = true;
      this._invincibilityTimer = duration;
    }

    /**
     * Update invincibility timer (call each frame)
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
      if (this._isInvincible) {
        this._invincibilityTimer -= deltaTime;
        if (this._invincibilityTimer <= 0) {
          this._isInvincible = false;
          this._invincibilityTimer = 0;
        }
      }
    }

    /**
     * Kill this entity
     */
    die() {
      if (this._isDead) return;

      this._isDead = true;
      this._currentHealth = 0;

      events.emit('entity:died', {
        entity: this._entity,
      });

      // Mark entity as inactive
      if (this._entity) {
        this._entity.isActive = false;
      }
    }

    /**
     * Revive entity with specified health
     * @param {number} health - Health to revive with (default: max)
     */
    revive(health) {
      if (!this._isDead) return;

      this._isDead = false;
      this._currentHealth = health !== undefined ? Math.min(health, this._maxHealth) : this._maxHealth;
      this._isInvincible = false;
      this._invincibilityTimer = 0;

      if (this._entity) {
        this._entity.isActive = true;
      }
    }

    /**
     * Set max health
     * @param {number} newMax - New max health
     * @param {boolean} healToMax - Whether to heal to new max
     */
    setMaxHealth(newMax, healToMax = false) {
      this._maxHealth = Math.max(1, newMax);
      if (healToMax) {
        this._currentHealth = this._maxHealth;
      } else {
        this._currentHealth = Math.min(this._currentHealth, this._maxHealth);
      }
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get currentHealth() {
      return this._currentHealth;
    }

    get maxHealth() {
      return this._maxHealth;
    }

    get isDead() {
      return this._isDead;
    }

    get isInvincible() {
      return this._isInvincible;
    }

    get invincibilityTimer() {
      return this._invincibilityTimer;
    }

    get healthRatio() {
      return this._maxHealth > 0 ? this._currentHealth / this._maxHealth : 0;
    }

    get healthPercent() {
      return this.healthRatio * 100;
    }

    get invincibilityDuration() {
      return this._invincibilityDuration;
    }

    set invincibilityDuration(value) {
      this._invincibilityDuration = Math.max(0, value);
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [{ key: 'Health', value: this._currentHealth + '/' + this._maxHealth }];
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._isDead = true;
      this._isInvincible = false;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Health = Health;
})(window.VampireSurvivors.Components);
