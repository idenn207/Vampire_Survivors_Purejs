/**
 * @fileoverview Traversal enemy entity - enemies with fixed movement patterns
 * @module Entities/TraversalEnemy
 */
(function (Entities) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Entity = Entities.Entity;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Velocity = window.VampireSurvivors.Components.Velocity;
  var Sprite = window.VampireSurvivors.Components.Sprite;
  var Collider = window.VampireSurvivors.Components.Collider;
  var CollisionLayer = window.VampireSurvivors.Components.CollisionLayer;
  var Health = window.VampireSurvivors.Components.Health;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_SIZE = 28;
  var DEFAULT_COLOR = '#FF6600';
  var DEFAULT_HEALTH = 80;
  var DEFAULT_SPEED = 180;
  var DEFAULT_DAMAGE = 15;
  var DEFAULT_DECAY_TIME = 10.0;

  // ============================================
  // Class Definition
  // ============================================
  class TraversalEnemy extends Entity {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _patternType = 'CIRCULAR';
    _speed = DEFAULT_SPEED;
    _damage = DEFAULT_DAMAGE;
    _decayTimer = DEFAULT_DECAY_TIME;
    _maxDecayTime = DEFAULT_DECAY_TIME;

    // DASH pattern state
    _targetX = 0;
    _targetY = 0;
    _isCharging = false;
    _chargeTimer = 0;
    _chargeTime = 0.5;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();

      // Add components with defaults (will be updated in init)
      this.addComponent(new Transform(0, 0, DEFAULT_SIZE, DEFAULT_SIZE));
      this.addComponent(new Velocity());
      this.addComponent(new Sprite(DEFAULT_COLOR));
      this.addComponent(
        new Collider(
          DEFAULT_SIZE / 2, // radius
          CollisionLayer.ENEMY, // layer
          CollisionLayer.PLAYER | CollisionLayer.HITBOX // mask
        )
      );
      this.addComponent(new Health(DEFAULT_HEALTH));

      // Add base tags
      this.addTag('enemy');
      this.addTag('traversal');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize with pattern type and config
     * @param {string} patternType - 'CIRCULAR', 'DASH', or 'LASER'
     * @param {Object} config - Pattern configuration
     */
    init(patternType, config) {
      config = config || {};

      this._patternType = patternType || 'CIRCULAR';

      var size = config.size || DEFAULT_SIZE;
      var color = config.color || DEFAULT_COLOR;
      var health = config.health || DEFAULT_HEALTH;

      // Handle zero speed for CIRCULAR pattern (use !== undefined to allow 0)
      this._speed =
        config.moveSpeed !== undefined
          ? config.moveSpeed
          : config.dashSpeed !== undefined
            ? config.dashSpeed
            : DEFAULT_SPEED;
      this._damage = config.damage || DEFAULT_DAMAGE;
      this._decayTimer = config.decayTime || DEFAULT_DECAY_TIME;
      this._maxDecayTime = this._decayTimer;
      this._chargeTime = config.chargeTime || 0.5;

      // Update components
      var transform = this.getComponent(Transform);
      transform.width = size;
      transform.height = size;

      var sprite = this.getComponent(Sprite);
      sprite.color = color;
      sprite.alpha = 1.0;

      var collider = this.getComponent(Collider);
      collider.radius = size / 2;

      var healthComp = this.getComponent(Health);
      healthComp.setMaxHealth(health, true);

      // Reset velocity (important for CIRCULAR pattern and entity pooling)
      var velocity = this.getComponent(Velocity);
      velocity.vx = 0;
      velocity.vy = 0;

      // Reset charging state
      this._isCharging = false;
      this._chargeTimer = 0;

      // Add pattern-specific tag
      this.addTag('traversal_' + this._patternType.toLowerCase());

      // Set enemyType for drop system
      this.enemyType = 'traversal_' + this._patternType.toLowerCase();

      return this;
    }

    /**
     * Set dash target position (for DASH pattern)
     * @param {number} x
     * @param {number} y
     */
    setDashTarget(x, y) {
      this._targetX = x;
      this._targetY = y;
    }

    /**
     * Start charging (for DASH pattern)
     */
    startCharge() {
      this._isCharging = true;
      this._chargeTimer = this._chargeTime;
    }

    /**
     * Update decay timer
     * @param {number} deltaTime
     * @returns {boolean} True if decayed (should be removed)
     */
    updateDecay(deltaTime) {
      this._decayTimer -= deltaTime;
      return this._decayTimer <= 0;
    }

    /**
     * Update charge timer (for DASH pattern)
     * @param {number} deltaTime
     * @returns {boolean} True if charge complete
     */
    updateCharge(deltaTime) {
      if (!this._isCharging) return false;

      this._chargeTimer -= deltaTime;
      if (this._chargeTimer <= 0) {
        this._isCharging = false;
        return true; // Ready to dash
      }
      return false;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get patternType() {
      return this._patternType;
    }

    get speed() {
      return this._speed;
    }

    set speed(value) {
      this._speed = Math.max(0, value);
    }

    get damage() {
      return this._damage;
    }

    set damage(value) {
      this._damage = Math.max(0, value);
    }

    get decayTimer() {
      return this._decayTimer;
    }

    get maxDecayTime() {
      return this._maxDecayTime;
    }

    get decayProgress() {
      return this._decayTimer / this._maxDecayTime;
    }

    get isCharging() {
      return this._isCharging;
    }

    get targetX() {
      return this._targetX;
    }

    get targetY() {
      return this._targetY;
    }

    get health() {
      return this.getComponent(Health);
    }

    get transform() {
      return this.getComponent(Transform);
    }

    get velocity() {
      return this.getComponent(Velocity);
    }

    get sprite() {
      return this.getComponent(Sprite);
    }

    get collider() {
      return this.getComponent(Collider);
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.TraversalEnemy = TraversalEnemy;
})(window.VampireSurvivors.Entities);
