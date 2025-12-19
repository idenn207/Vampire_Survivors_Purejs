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
      this.addComponent(new Experience(100, 1.2)); // 100 base XP, 1.2x scaling
      this.addComponent(new Gold(0)); // Start with 0 gold
      this.addComponent(new PlayerStats()); // Stat upgrades tracking

      // Add tag
      this.addTag('player');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    update(deltaTime, input) {
      // Get input direction
      var direction = input.getMovementDirection();

      // Set velocity based on input
      var velocity = this.getComponent(Velocity);
      velocity.vx = direction.x * this._speed;
      velocity.vy = direction.y * this._speed;
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
