/**
 * @fileoverview Player entity with input-driven movement
 * @module Entities/Player
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
  var WeaponSlot = window.VampireSurvivors.Components.WeaponSlot;
  var Experience = window.VampireSurvivors.Components.Experience;
  var Gold = window.VampireSurvivors.Components.Gold;
  var PlayerStats = window.VampireSurvivors.Components.PlayerStats;
  // TechTree imported lazily in getter (loaded after Player.js)
  // ActiveSkill, Shield, ActiveBuff imported lazily (loaded after Player.js)

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_SPEED = 200; // pixels per second
  var DEFAULT_WIDTH = 32;
  var DEFAULT_HEIGHT = 32;
  var PLAYER_COLOR = '#00FF00'; // Green
  var DEFAULT_MAX_HEALTH = 100;

  // ============================================
  // Class Definition
  // ============================================
  class Player extends Entity {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _speed = DEFAULT_SPEED;

    // Contact damage
    _contactDamageMultiplier = 1.0;

    // Magnet state
    _magnetActive = false;
    _magnetTimer = 0;
    _magnetMaxSpeed = 600;

    // Dash state
    _isDashing = false;
    _dashTimer = 0;
    _dashDuration = 0.2; // 0.2 seconds dash duration
    _dashSpeed = 800; // 4x normal speed during dash
    _dashDirection = { x: 0, y: 0 };
    _dashCooldown = 0;
    _dashCooldownMax = 5.0; // 5 second cooldown
    _dashInvincibilityAfter = 0.5; // 0.5 seconds invincibility after dash

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();

      // Add components
      this.addComponent(new Transform(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT));
      this.addComponent(new Velocity());
      var sprite = new Sprite(PLAYER_COLOR);
      sprite.setImageId('player_default');
      this.addComponent(sprite);
      this.addComponent(
        new Collider(
          DEFAULT_WIDTH / 2, // radius
          CollisionLayer.PLAYER, // layer
          CollisionLayer.ENEMY | CollisionLayer.TERRAIN | CollisionLayer.PICKUP // mask
        )
      );
      this.addComponent(new Health(DEFAULT_MAX_HEALTH));
      this.addComponent(new WeaponSlot());
      this.addComponent(new Experience(100, 1.08)); // 100 base XP, 1.08x scaling
      this.addComponent(new Gold(0)); // Start with 0 gold
      this.addComponent(new PlayerStats()); // Stat upgrades tracking

      // Add tag
      this.addTag('player');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    update(deltaTime, input) {
      var velocity = this.getComponent(Velocity);

      // If dashing, override velocity with dash velocity
      if (this._isDashing) {
        this.applyDashVelocity(velocity);
        return;
      }

      // Calculate effective speed with ActiveBuff bonus (Mage's speed buff)
      var effectiveSpeed = this._speed;
      var ActiveBuff = window.VampireSurvivors.Components.ActiveBuff;
      if (ActiveBuff) {
        var activeBuff = this.getComponent(ActiveBuff);
        if (activeBuff && activeBuff.moveSpeedBonus) {
          effectiveSpeed *= (1 + activeBuff.moveSpeedBonus);
        }
      }

      // Normal movement
      var direction = input.getMovementDirection();
      velocity.vx = direction.x * effectiveSpeed;
      velocity.vy = direction.y * effectiveSpeed;
    }

    /**
     * Activate magnet effect
     * @param {number} duration - Duration in seconds
     * @param {number} maxSpeed - Maximum pull speed
     */
    activateMagnet(duration, maxSpeed) {
      this._magnetActive = true;
      this._magnetTimer = duration;
      this._magnetMaxSpeed = maxSpeed || 600;
    }

    /**
     * Update magnet timer (call each frame)
     * @param {number} deltaTime
     */
    updateMagnet(deltaTime) {
      if (this._magnetActive) {
        this._magnetTimer -= deltaTime;
        if (this._magnetTimer <= 0) {
          this._magnetActive = false;
          this._magnetTimer = 0;
        }
      }
    }

    /**
     * Start a dash in specified direction
     * @param {object} direction - Direction to dash {x, y}
     * @returns {boolean} - True if dash started
     */
    startDash(direction) {
      if (this._dashCooldown > 0 || this._isDashing) return false;
      if (direction.x === 0 && direction.y === 0) return false;

      this._isDashing = true;
      this._dashTimer = this._dashDuration;
      this._dashDirection = { x: direction.x, y: direction.y };
      this._dashCooldown = this._dashCooldownMax;

      // Set invincibility for dash duration + after-dash invincibility
      var health = this.getComponent(Health);
      if (health) {
        health.setInvincible(this._dashDuration + this._dashInvincibilityAfter);
      }

      return true;
    }

    /**
     * Update dash state (call each frame)
     * @param {number} deltaTime
     */
    updateDash(deltaTime) {
      // Update cooldown
      if (this._dashCooldown > 0) {
        this._dashCooldown -= deltaTime;
      }

      // Update dash
      if (this._isDashing) {
        this._dashTimer -= deltaTime;
        if (this._dashTimer <= 0) {
          this._isDashing = false;
          this._dashTimer = 0;
        }
      }
    }

    /**
     * Apply dash velocity (called during update if dashing)
     * @param {Velocity} velocity
     */
    applyDashVelocity(velocity) {
      if (!this._isDashing) return;
      velocity.vx = this._dashDirection.x * this._dashSpeed;
      velocity.vy = this._dashDirection.y * this._dashSpeed;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get speed() {
      return this._speed;
    }

    set speed(value) {
      this._speed = Math.max(0, value);
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

    get health() {
      return this.getComponent(Health);
    }

    get weaponSlot() {
      return this.getComponent(WeaponSlot);
    }

    get experience() {
      return this.getComponent(Experience);
    }

    get gold() {
      return this.getComponent(Gold);
    }

    get playerStats() {
      return this.getComponent(PlayerStats);
    }

    get techTree() {
      var TechTree = window.VampireSurvivors.Components.TechTree;
      return TechTree ? this.getComponent(TechTree) : null;
    }

    get activeSkill() {
      var ActiveSkill = window.VampireSurvivors.Components.ActiveSkill;
      return ActiveSkill ? this.getComponent(ActiveSkill) : null;
    }

    get shield() {
      var Shield = window.VampireSurvivors.Components.Shield;
      return Shield ? this.getComponent(Shield) : null;
    }

    get activeBuff() {
      var ActiveBuff = window.VampireSurvivors.Components.ActiveBuff;
      return ActiveBuff ? this.getComponent(ActiveBuff) : null;
    }

    /**
     * Initialize active skill components based on character
     * @param {string} characterId - Character ID (knight, rogue, mage)
     */
    initializeActiveSkill(characterId) {
      var ActiveSkill = window.VampireSurvivors.Components.ActiveSkill;
      var Shield = window.VampireSurvivors.Components.Shield;
      var ActiveBuff = window.VampireSurvivors.Components.ActiveBuff;
      var ActiveSkillData = window.VampireSurvivors.Data.ActiveSkillData;

      if (!ActiveSkill || !ActiveSkillData) return;

      // Add ActiveSkill component
      var activeSkillComp = new ActiveSkill();
      var skillData = ActiveSkillData.getSkillForCharacter(characterId);
      if (skillData) {
        activeSkillComp.initialize(skillData);
      }
      this.addComponent(activeSkillComp);

      // Add Shield component (for Knight, but available for all)
      if (Shield) {
        this.addComponent(new Shield());
      }

      // Add ActiveBuff component (for Mage, but available for all)
      if (ActiveBuff) {
        this.addComponent(new ActiveBuff());
      }
    }

    /**
     * Get contact damage based on equipped weapons
     * @returns {number}
     */
    get contactDamage() {
      var weaponSlot = this.getComponent(WeaponSlot);
      if (!weaponSlot) return 10;

      var weapons = weaponSlot.getWeapons();
      if (weapons.length === 0) return 10;

      var totalDamage = 0;
      for (var i = 0; i < weapons.length; i++) {
        totalDamage += weapons[i].damage;
      }
      return Math.floor((totalDamage / weapons.length) * this._contactDamageMultiplier);
    }

    get isMagnetActive() {
      return this._magnetActive;
    }

    get magnetMaxSpeed() {
      return this._magnetMaxSpeed;
    }

    get isDashing() {
      return this._isDashing;
    }

    get dashCooldown() {
      return this._dashCooldown;
    }

    get dashCooldownMax() {
      return this._dashCooldownMax;
    }

    get dashCooldownProgress() {
      if (this._dashCooldownMax <= 0) return 1;
      return 1 - this._dashCooldown / this._dashCooldownMax;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getSummaryInfo() {
      var transform = this.getComponent(Transform);
      return [{ key: 'Player', value: Math.round(transform.x) + ', ' + Math.round(transform.y) }];
    }

    getDebugInfo() {
      var transform = this.getComponent(Transform);
      var velocity = this.getComponent(Velocity);
      var health = this.getComponent(Health);
      var exp = this.getComponent(Experience);
      var gold = this.getComponent(Gold);

      return {
        label: 'Player',
        entries: [
          { key: 'Position', value: Math.round(transform.x) + ', ' + Math.round(transform.y) },
          { key: 'Velocity', value: Math.round(velocity.vx) + ', ' + Math.round(velocity.vy) },
          { key: 'Speed', value: this._speed },
          { key: 'Health', value: health.currentHealth + '/' + health.maxHealth },
          { key: 'Level', value: exp ? exp.level : 1 },
          { key: 'XP', value: exp ? exp.currentExp + '/' + exp.expToNextLevel : '0/0' },
          { key: 'Gold', value: gold ? gold.currentGold : 0 },
        ],
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Player = Player;
})(window.VampireSurvivors.Entities);
