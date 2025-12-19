/**
 * @fileoverview Summon entity - AI-controlled fighter that chases and attacks enemies
 * @module Entities/Summon
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
  var Health = window.VampireSurvivors.Components.Health;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_SIZE = 20;
  var DEFAULT_COLOR = '#88CCFF';

  // ============================================
  // Class Definition
  // ============================================
  class Summon extends Entity {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _damage = 20;
    _attackCooldown = 1.0;
    _attackRange = 50;
    _chaseSpeed = 150;
    _duration = 15;
    _lifetime = 15;
    _attackTimer = 0;
    _target = null;
    _sourceWeaponId = null;
    _owner = null; // Reference to player

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();

      // Add components
      this.addComponent(new Transform(0, 0, DEFAULT_SIZE, DEFAULT_SIZE));
      this.addComponent(new Velocity());
      this.addComponent(new Sprite(DEFAULT_COLOR, 'circle'));
      this.addComponent(new Health(50));

      // Add tag
      this.addTag('summon');
      this.addTag('ally');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Reset summon for pool reuse
     * @param {number} x
     * @param {number} y
     * @param {number} damage
     * @param {number} health
     * @param {number} attackCooldown
     * @param {number} attackRange
     * @param {number} chaseSpeed
     * @param {number} duration
     * @param {string} color
     * @param {string} sourceWeaponId
     * @param {Entity} owner
     * @param {string} [imageId] - Optional image ID for sprite
     * @param {number} [size] - Optional custom size
     */
    reset(x, y, damage, health, attackCooldown, attackRange, chaseSpeed, duration, color, sourceWeaponId, owner, imageId, size) {
      var actualSize = size || DEFAULT_SIZE;

      // Reset transform
      var transform = this.transform;
      transform.x = x - actualSize / 2;
      transform.y = y - actualSize / 2;
      transform.width = actualSize;
      transform.height = actualSize;

      // Reset velocity
      var velocity = this.velocity;
      velocity.vx = 0;
      velocity.vy = 0;

      // Reset sprite
      var sprite = this.sprite;
      sprite.color = color || DEFAULT_COLOR;
      sprite.isVisible = true;
      sprite.alpha = 1;
      if (imageId) {
        sprite.setImageId(imageId);
      } else {
        sprite.clearImage();
      }

      // Reset health
      var healthComp = this.health;
      healthComp.setMaxHealth(health, true);
      healthComp.revive(health);

      // Reset summon properties
      this._damage = damage;
      this._attackCooldown = attackCooldown;
      this._attackRange = attackRange;
      this._chaseSpeed = chaseSpeed;
      this._duration = duration;
      this._lifetime = duration;
      this._attackTimer = 0;
      this._target = null;
      this._sourceWeaponId = sourceWeaponId;
      this._owner = owner;

      // Ensure active
      this.isActive = true;
    }

    /**
     * Update summon behavior
     * @param {number} deltaTime
     * @returns {string} State: 'active', 'expired', 'dead'
     */
    update(deltaTime) {
      if (!this.isActive) return 'expired';

      // Check if dead
      var healthComp = this.health;
      if (healthComp.isDead) {
        return 'dead';
      }

      // Update lifetime
      this._lifetime -= deltaTime;
      if (this._lifetime <= 0) {
        return 'expired';
      }

      // Update attack cooldown
      if (this._attackTimer > 0) {
        this._attackTimer -= deltaTime;
      }

      // Fade effect when nearing expiration
      if (this._lifetime < 3) {
        this.sprite.alpha = 0.5 + (this._lifetime / 3) * 0.5;
      }

      return 'active';
    }

    /**
     * Set target to chase
     * @param {Entity} target
     */
    setTarget(target) {
      this._target = target;
    }

    /**
     * Check if summon can attack
     * @returns {boolean}
     */
    canAttack() {
      return this._attackTimer <= 0;
    }

    /**
     * Perform attack (resets cooldown)
     */
    attack() {
      this._attackTimer = this._attackCooldown;
    }

    /**
     * Move toward target
     * @param {number} targetX
     * @param {number} targetY
     */
    moveToward(targetX, targetY) {
      var transform = this.transform;
      var velocity = this.velocity;

      var dx = targetX - transform.centerX;
      var dy = targetY - transform.centerY;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        velocity.vx = (dx / distance) * this._chaseSpeed;
        velocity.vy = (dy / distance) * this._chaseSpeed;
      } else {
        velocity.vx = 0;
        velocity.vy = 0;
      }
    }

    /**
     * Stop moving
     */
    stopMoving() {
      var velocity = this.velocity;
      velocity.vx = 0;
      velocity.vy = 0;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get transform() {
      return this.getComponent(Transform);
    }

    get velocity() {
      return this.getComponent(Velocity);
    }

    get sprite() {
      return this.getComponent(Sprite);
    }

    get health() {
      return this.getComponent(Health);
    }

    get damage() {
      return this._damage;
    }

    get attackRange() {
      return this._attackRange;
    }

    get chaseSpeed() {
      return this._chaseSpeed;
    }

    get target() {
      return this._target;
    }

    get sourceWeaponId() {
      return this._sourceWeaponId;
    }

    get owner() {
      return this._owner;
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
  Entities.Summon = Summon;
})(window.VampireSurvivors.Entities);
