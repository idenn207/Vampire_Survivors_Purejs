/**
 * @fileoverview Enemy entity with configurable type and behavior
 * @module Entities/Enemy
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
  var DEFAULT_SPEED = 100; // pixels per second
  var DEFAULT_WIDTH = 24;
  var DEFAULT_HEIGHT = 24;
  var ENEMY_COLOR = '#FF0000'; // Red
  var DEFAULT_HEALTH = 30;
  var DEFAULT_DAMAGE = 10; // Contact damage to player

  // ============================================
  // Class Definition
  // ============================================
  class Enemy extends Entity {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _speed = DEFAULT_SPEED;
    _damage = DEFAULT_DAMAGE;

    // Enemy type system
    _enemyType = 'normal';
    _config = null;
    _behaviorState = null; // For state-machine behaviors

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(x, y) {
      super();

      // Add components
      this.addComponent(new Transform(x || 0, y || 0, DEFAULT_WIDTH, DEFAULT_HEIGHT));
      this.addComponent(new Velocity());
      this.addComponent(new Sprite(ENEMY_COLOR));
      this.addComponent(
        new Collider(
          DEFAULT_WIDTH / 2, // radius
          CollisionLayer.ENEMY, // layer
          CollisionLayer.PLAYER | CollisionLayer.HITBOX // mask
        )
      );
      this.addComponent(new Health(DEFAULT_HEALTH));

      // Add tag
      this.addTag('enemy');
    }

    // ----------------------------------------
    // Configuration Methods
    // ----------------------------------------
    /**
     * Configure enemy from type config
     * @param {string} enemyType - Enemy type key
     * @param {Object} config - Enemy type configuration from EnemyTypeData
     */
    configureFromType(enemyType, config) {
      this._enemyType = enemyType;
      this._config = config;
      this._behaviorState = {};

      // Apply base stats from config
      this._speed = config.baseSpeed;
      this._damage = config.baseDamage;

      // Update size
      var size = config.size || DEFAULT_WIDTH;
      var transform = this.getComponent(Transform);
      if (transform) {
        transform.width = size;
        transform.height = size;
      }

      // Update collider radius
      var collider = this.getComponent(Collider);
      if (collider) {
        collider.radius = size / 2;
      }

      // Update color
      var sprite = this.getComponent(Sprite);
      if (sprite) {
        sprite.color = config.color || ENEMY_COLOR;
      }

      // Update health
      var health = this.getComponent(Health);
      if (health) {
        health.setMaxHealth(config.baseHealth, true);
      }

      // Add type-specific tag
      this.addTag('enemy_' + enemyType);
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

    get damage() {
      return this._damage;
    }

    set damage(value) {
      this._damage = Math.max(0, value);
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

    get enemyType() {
      return this._enemyType;
    }

    get config() {
      return this._config;
    }

    get behaviorState() {
      return this._behaviorState;
    }

    set behaviorState(value) {
      this._behaviorState = value;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Enemy = Enemy;
})(window.VampireSurvivors.Entities);
