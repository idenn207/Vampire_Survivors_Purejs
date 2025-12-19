/**
 * @fileoverview Boss entity - powerful enemies with phase-based attacks
 * @module Entities/Boss
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
  var BossData = window.VampireSurvivors.Data.BossData;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_SIZE = 48;
  var DEFAULT_COLOR = '#FF0000';
  var DEFAULT_HEALTH = 500;
  var DEFAULT_SPEED = 60;
  var DEFAULT_DAMAGE = 20;

  // ============================================
  // Class Definition
  // ============================================
  class Boss extends Entity {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _bossType = 'elite';
    _config = null;
    _wave = 1;
    _speed = DEFAULT_SPEED;
    _damage = DEFAULT_DAMAGE;

    // Phase tracking
    _currentPhaseIndex = 0;
    _previousPhaseIndex = 0;

    // Attack cooldowns (keyed by attack name)
    _attackCooldowns = {};

    // Dash state
    _isDashing = false;
    _dashTimer = 0;
    _dashDuration = 0;
    _dashDirectionX = 0;
    _dashDirectionY = 0;
    _dashSpeed = 0;
    _dashDamage = 0;

    // Telegraph state (pause before attack)
    _isTelegraphing = false;
    _telegraphTimer = 0;
    _pendingAttack = null;

    // Attack target (for projectiles and dash)
    _attackTargetX = 0;
    _attackTargetY = 0;

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
          DEFAULT_SIZE / 2,
          CollisionLayer.ENEMY,
          CollisionLayer.PLAYER | CollisionLayer.HITBOX
        )
      );
      this.addComponent(new Health(DEFAULT_HEALTH));

      // Add base tags
      this.addTag('enemy');
      this.addTag('boss');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize boss with type and wave
     * @param {string} bossType - 'elite', 'miniboss', or 'boss'
     * @param {number} wave - Current wave number
     */
    init(bossType, wave) {
      this._bossType = bossType || 'elite';
      this._wave = wave || 1;
      this._config = BossData.getBossConfig(this._bossType);

      if (!this._config) {
        console.error('[Boss] Unknown boss type:', this._bossType);
        return this;
      }

      // Calculate scaled stats
      var healthMultiplier = BossData.getWaveHealthMultiplier(wave, bossType);
      var damageMultiplier = BossData.getWaveDamageMultiplier(wave, bossType);

      var scaledHealth = Math.floor(this._config.health * healthMultiplier);
      var scaledDamage = Math.floor(this._config.damage * damageMultiplier);

      this._speed = this._config.speed;
      this._damage = scaledDamage;

      var size = this._config.size;

      // Update components
      var transform = this.getComponent(Transform);
      transform.width = size;
      transform.height = size;

      var sprite = this.getComponent(Sprite);
      sprite.color = this._config.color;
      sprite.alpha = 1.0;
      if (this._config.imageId) {
        sprite.setImageId(this._config.imageId);
      }

      var collider = this.getComponent(Collider);
      collider.radius = size / 2;

      var healthComp = this.getComponent(Health);
      healthComp.setMaxHealth(scaledHealth, true);

      // Reset velocity
      var velocity = this.getComponent(Velocity);
      velocity.vx = 0;
      velocity.vy = 0;

      // Reset state
      this._currentPhaseIndex = 0;
      this._previousPhaseIndex = 0;
      this._isDashing = false;
      this._isTelegraphing = false;
      this._pendingAttack = null;

      // Initialize attack cooldowns
      this._attackCooldowns = {};
      var attacks = Object.keys(this._config.attacks);
      for (var i = 0; i < attacks.length; i++) {
        this._attackCooldowns[attacks[i]] = 0;
      }

      // Add type-specific tag
      this.addTag('boss_' + this._bossType);

      // Set enemyType for drop system
      this.enemyType = 'boss';

      return this;
    }

    /**
     * Update attack cooldowns
     * @param {number} deltaTime
     */
    updateCooldowns(deltaTime) {
      var attacks = Object.keys(this._attackCooldowns);
      for (var i = 0; i < attacks.length; i++) {
        var attack = attacks[i];
        if (this._attackCooldowns[attack] > 0) {
          this._attackCooldowns[attack] -= deltaTime;
        }
      }
    }

    /**
     * Update telegraph timer
     * @param {number} deltaTime
     * @returns {boolean} True if telegraph complete
     */
    updateTelegraph(deltaTime) {
      if (!this._isTelegraphing) return false;

      this._telegraphTimer -= deltaTime;
      if (this._telegraphTimer <= 0) {
        this._isTelegraphing = false;
        return true;
      }
      return false;
    }

    /**
     * Update dash state
     * @param {number} deltaTime
     * @returns {boolean} True if dash complete
     */
    updateDash(deltaTime) {
      if (!this._isDashing) return false;

      this._dashTimer -= deltaTime;
      if (this._dashTimer <= 0) {
        this._isDashing = false;
        // Stop velocity after dash
        var velocity = this.getComponent(Velocity);
        velocity.vx = 0;
        velocity.vy = 0;
        return true;
      }
      return false;
    }

    /**
     * Check and update phase based on current health
     * @returns {boolean} True if phase changed
     */
    updatePhase() {
      var healthComp = this.getComponent(Health);
      var healthPercent = healthComp.currentHealth / healthComp.maxHealth;

      var phaseData = BossData.getCurrentPhase(this._bossType, healthPercent);
      if (!phaseData) return false;

      this._previousPhaseIndex = this._currentPhaseIndex;
      this._currentPhaseIndex = phaseData.index;

      return this._currentPhaseIndex !== this._previousPhaseIndex;
    }

    /**
     * Check if an attack is available
     * @param {string} attackName
     * @returns {boolean}
     */
    canUseAttack(attackName) {
      // Check if attack is in current phase
      var phase = this.getCurrentPhase();
      if (!phase || phase.config.attacks.indexOf(attackName) === -1) {
        return false;
      }

      // Check cooldown
      return this._attackCooldowns[attackName] <= 0;
    }

    /**
     * Get available attacks for current phase
     * @returns {Array<string>}
     */
    getAvailableAttacks() {
      var phase = this.getCurrentPhase();
      if (!phase) return [];

      var available = [];
      for (var i = 0; i < phase.config.attacks.length; i++) {
        var attack = phase.config.attacks[i];
        if (this._attackCooldowns[attack] <= 0) {
          available.push(attack);
        }
      }
      return available;
    }

    /**
     * Start telegraph for an attack
     * @param {string} attackName
     * @param {number} targetX
     * @param {number} targetY
     */
    startTelegraph(attackName, targetX, targetY) {
      var attackConfig = BossData.getAttackConfig(this._bossType, attackName);
      if (!attackConfig) return;

      this._isTelegraphing = true;
      this._telegraphTimer = attackConfig.telegraph || 0.3;
      this._pendingAttack = attackName;
      this._attackTargetX = targetX;
      this._attackTargetY = targetY;

      // Stop movement during telegraph
      var velocity = this.getComponent(Velocity);
      velocity.vx = 0;
      velocity.vy = 0;
    }

    /**
     * Execute the pending attack (call after telegraph completes)
     * @returns {Object|null} Attack data for BossSystem to process
     */
    executePendingAttack() {
      if (!this._pendingAttack) return null;

      var attackName = this._pendingAttack;
      var attackConfig = BossData.getAttackConfig(this._bossType, attackName);
      this._pendingAttack = null;

      if (!attackConfig) return null;

      // Apply phase cooldown multiplier
      var phase = this.getCurrentPhase();
      var cooldownMultiplier = phase ? phase.config.cooldownMultiplier : 1.0;
      this._attackCooldowns[attackName] = attackConfig.cooldown * cooldownMultiplier;

      return {
        type: attackName,
        config: attackConfig,
        targetX: this._attackTargetX,
        targetY: this._attackTargetY,
        boss: this,
      };
    }

    /**
     * Start dash attack
     * @param {number} targetX
     * @param {number} targetY
     * @param {Object} config - Dash attack config
     */
    startDash(targetX, targetY, config) {
      var transform = this.getComponent(Transform);
      var dx = targetX - transform.centerX;
      var dy = targetY - transform.centerY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        this._dashDirectionX = dx / dist;
        this._dashDirectionY = dy / dist;
      } else {
        this._dashDirectionX = 1;
        this._dashDirectionY = 0;
      }

      this._isDashing = true;
      this._dashTimer = config.duration;
      this._dashDuration = config.duration;
      this._dashSpeed = config.speed;
      this._dashDamage = config.damage;

      // Set velocity for dash
      var velocity = this.getComponent(Velocity);
      velocity.vx = this._dashDirectionX * this._dashSpeed;
      velocity.vy = this._dashDirectionY * this._dashSpeed;
    }

    /**
     * Get current phase data
     * @returns {Object|null}
     */
    getCurrentPhase() {
      var healthComp = this.getComponent(Health);
      var healthPercent = healthComp.currentHealth / healthComp.maxHealth;
      return BossData.getCurrentPhase(this._bossType, healthPercent);
    }

    /**
     * Get current speed with phase multiplier
     * @returns {number}
     */
    getCurrentSpeed() {
      var phase = this.getCurrentPhase();
      var multiplier = phase ? phase.config.speedMultiplier : 1.0;
      return this._speed * multiplier;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get bossType() {
      return this._bossType;
    }

    get config() {
      return this._config;
    }

    get wave() {
      return this._wave;
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

    get currentPhaseIndex() {
      return this._currentPhaseIndex;
    }

    get isDashing() {
      return this._isDashing;
    }

    get isTelegraphing() {
      return this._isTelegraphing;
    }

    get dashDamage() {
      return this._dashDamage;
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

    get name() {
      return this._config ? this._config.name : 'Boss';
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var healthComp = this.getComponent(Health);
      return {
        label: 'Boss: ' + this.name,
        entries: [
          { key: 'Type', value: this._bossType },
          { key: 'Phase', value: this._currentPhaseIndex + 1 },
          { key: 'Health', value: healthComp.currentHealth + '/' + healthComp.maxHealth },
          { key: 'State', value: this._isDashing ? 'Dashing' : this._isTelegraphing ? 'Telegraph' : 'Normal' },
        ],
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Boss = Boss;
})(window.VampireSurvivors.Entities);
