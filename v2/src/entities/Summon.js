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
  var DEFAULT_ATTACK_WINDUP = 0.2;

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

    // Wind-up attack properties
    _attackWindup = DEFAULT_ATTACK_WINDUP;
    _windupTimer = 0;
    _isWindingUp = false;
    _attackTarget = null; // Target stored during wind-up

    // Attack pattern and projectile properties (for ranged summons)
    _attackPattern = 'melee';
    _projectileSpeed = 400;
    _projectileSize = 6;
    _projectileColor = '#FFDD00';

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
     * @param {number} [attackWindup] - Optional attack wind-up delay
     * @param {string} [attackPattern] - Attack pattern ('melee' or 'ranged')
     * @param {number} [projectileSpeed] - Projectile speed for ranged attacks
     * @param {number} [projectileSize] - Projectile size for ranged attacks
     * @param {string} [projectileColor] - Projectile color for ranged attacks
     */
    reset(x, y, damage, health, attackCooldown, attackRange, chaseSpeed, duration, color, sourceWeaponId, owner, imageId, size, attackWindup, attackPattern, projectileSpeed, projectileSize, projectileColor) {
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

      // Reset wind-up properties
      this._attackWindup = attackWindup || DEFAULT_ATTACK_WINDUP;
      this._windupTimer = 0;
      this._isWindingUp = false;
      this._attackTarget = null;

      // Reset attack pattern and projectile properties
      this._attackPattern = attackPattern || 'melee';
      this._projectileSpeed = projectileSpeed || 400;
      this._projectileSize = projectileSize || 6;
      this._projectileColor = projectileColor || '#FFDD00';

      // Ensure active
      this.isActive = true;
    }

    /**
     * Update summon behavior
     * @param {number} deltaTime
     * @returns {Object} State object: { state: 'active'|'expired'|'dead'|'windup_complete', target?: Entity }
     */
    update(deltaTime) {
      if (!this.isActive) return { state: 'expired' };

      // Check if dead
      var healthComp = this.health;
      if (healthComp.isDead) {
        return { state: 'dead' };
      }

      // Update lifetime
      this._lifetime -= deltaTime;
      if (this._lifetime <= 0) {
        return { state: 'expired' };
      }

      // Update attack cooldown
      if (this._attackTimer > 0) {
        this._attackTimer -= deltaTime;
      }

      // Update wind-up timer
      if (this._isWindingUp) {
        this._windupTimer -= deltaTime;
        if (this._windupTimer <= 0) {
          // Wind-up complete, ready to attack
          var target = this._attackTarget;
          this._isWindingUp = false;
          this._attackTarget = null;
          return { state: 'windup_complete', target: target };
        }
      }

      // Fade effect when nearing expiration
      if (this._lifetime < 3) {
        this.sprite.alpha = 0.5 + (this._lifetime / 3) * 0.5;
      }

      return { state: 'active' };
    }

    /**
     * Set target to chase
     * @param {Entity} target
     */
    setTarget(target) {
      this._target = target;
    }

    /**
     * Check if summon can attack (cooldown ready and not winding up)
     * @returns {boolean}
     */
    canAttack() {
      return this._attackTimer <= 0 && !this._isWindingUp;
    }

    /**
     * Start attack wind-up on target
     * @param {Entity} target - The target to attack after wind-up
     */
    startAttack(target) {
      this._isWindingUp = true;
      this._windupTimer = this._attackWindup;
      this._attackTarget = target;
    }

    /**
     * Perform attack (resets cooldown) - called after wind-up completes
     */
    attack() {
      this._attackTimer = this._attackCooldown;
    }

    /**
     * Cancel ongoing wind-up attack
     */
    cancelAttack() {
      this._isWindingUp = false;
      this._windupTimer = 0;
      this._attackTarget = null;
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

    get isWindingUp() {
      return this._isWindingUp;
    }

    get attackTarget() {
      return this._attackTarget;
    }

    get attackPattern() {
      return this._attackPattern;
    }

    get projectileSpeed() {
      return this._projectileSpeed;
    }

    get projectileSize() {
      return this._projectileSize;
    }

    get projectileColor() {
      return this._projectileColor;
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
