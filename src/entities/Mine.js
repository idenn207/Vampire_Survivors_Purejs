/**
 * @fileoverview Mine entity - deployable traps that explode when enemies approach
 * @module Entities/Mine
 */
(function (Entities) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Entity = Entities.Entity;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Sprite = window.VampireSurvivors.Components.Sprite;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_SIZE = 16;
  var DEFAULT_COLOR = '#FF4444';

  // ============================================
  // Class Definition
  // ============================================
  class Mine extends Entity {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _damage = 0;
    _explosionRadius = 60;
    _triggerRadius = 40;
    _duration = 15;
    _lifetime = 15;
    _isTriggered = false;
    _triggerDelay = 0.3; // Delay before explosion after trigger
    _triggerTimer = 0;
    _sourceWeaponId = null;
    _armDelay = 0.5; // Time before mine can be triggered
    _armTimer = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();

      // Add components
      this.addComponent(new Transform(0, 0, DEFAULT_SIZE, DEFAULT_SIZE));
      this.addComponent(new Sprite(DEFAULT_COLOR, 'circle'));

      // Add tag
      this.addTag('mine');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Reset mine for pool reuse
     * @param {number} x
     * @param {number} y
     * @param {number} damage
     * @param {number} explosionRadius
     * @param {number} triggerRadius
     * @param {number} duration
     * @param {string} color
     * @param {string} sourceWeaponId
     * @param {string} [imageId] - Image ID for sprite rendering (falls back to shape)
     */
    reset(x, y, damage, explosionRadius, triggerRadius, duration, color, sourceWeaponId, imageId) {
      // Reset transform
      var transform = this.transform;
      transform.x = x - DEFAULT_SIZE / 2; // Center the mine
      transform.y = y - DEFAULT_SIZE / 2;
      transform.width = DEFAULT_SIZE;
      transform.height = DEFAULT_SIZE;

      // Reset sprite
      var sprite = this.sprite;
      sprite.color = color || DEFAULT_COLOR;
      sprite.isVisible = true;
      sprite.alpha = 1;

      // Apply image or clear for shape fallback
      if (imageId) {
        sprite.setImageId(imageId);
      } else {
        sprite.clearImage();
      }

      // Reset mine properties
      this._damage = damage;
      this._explosionRadius = explosionRadius;
      this._triggerRadius = triggerRadius;
      this._duration = duration;
      this._lifetime = duration;
      this._isTriggered = false;
      this._triggerTimer = 0;
      this._sourceWeaponId = sourceWeaponId;
      this._armTimer = 0;

      // Ensure active
      this.isActive = true;
    }

    /**
     * Update mine lifetime and trigger state
     * @param {number} deltaTime
     * @returns {string} State: 'active', 'triggered', 'explode', 'expired'
     */
    update(deltaTime) {
      if (!this.isActive) return 'expired';

      // Update arm timer
      if (this._armTimer < this._armDelay) {
        this._armTimer += deltaTime;
        // Visual feedback - dimmer while arming
        this.sprite.alpha = 0.5 + (this._armTimer / this._armDelay) * 0.5;
        return 'arming';
      }

      // Update lifetime
      this._lifetime -= deltaTime;
      if (this._lifetime <= 0) {
        return 'expired';
      }

      // Handle triggered state
      if (this._isTriggered) {
        this._triggerTimer += deltaTime;
        // Pulsing effect while triggered
        this.sprite.alpha = 0.5 + Math.sin(this._triggerTimer * 20) * 0.5;

        if (this._triggerTimer >= this._triggerDelay) {
          return 'explode';
        }
        return 'triggered';
      }

      // Pulsing effect when armed (slower)
      var lifeRatio = this._lifetime / this._duration;
      this.sprite.alpha = 0.7 + Math.sin(Date.now() * 0.005) * 0.3;

      return 'active';
    }

    /**
     * Trigger the mine (called when enemy enters trigger radius)
     */
    trigger() {
      if (!this._isTriggered && this._armTimer >= this._armDelay) {
        this._isTriggered = true;
        this._triggerTimer = 0;
      }
    }

    /**
     * Check if mine is armed and ready to trigger
     * @returns {boolean}
     */
    isArmed() {
      return this._armTimer >= this._armDelay && !this._isTriggered;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get transform() {
      return this.getComponent(Transform);
    }

    get sprite() {
      return this.getComponent(Sprite);
    }

    get damage() {
      return this._damage;
    }

    get explosionRadius() {
      return this._explosionRadius;
    }

    get triggerRadius() {
      return this._triggerRadius;
    }

    get isTriggered() {
      return this._isTriggered;
    }

    get sourceWeaponId() {
      return this._sourceWeaponId;
    }

    get triggerProgress() {
      if (!this._isTriggered) return 0;
      return Math.min(this._triggerTimer / this._triggerDelay, 1);
    }

    get centerX() {
      var transform = this.transform;
      return transform.x + transform.width / 2;
    }

    get centerY() {
      var transform = this.transform;
      return transform.y + transform.height / 2;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Mine = Mine;
})(window.VampireSurvivors.Entities);
