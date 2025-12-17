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

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();

      // Add components
      this.addComponent(new Transform(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT));
      this.addComponent(new Velocity());
      this.addComponent(new Sprite(PLAYER_COLOR));
      this.addComponent(
        new Collider(
          DEFAULT_WIDTH / 2, // radius
          CollisionLayer.PLAYER, // layer
          CollisionLayer.ENEMY | CollisionLayer.TERRAIN | CollisionLayer.PICKUP // mask
        )
      );
      this.addComponent(new Health(DEFAULT_MAX_HEALTH));

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

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var transform = this.getComponent(Transform);
      var velocity = this.getComponent(Velocity);
      var health = this.getComponent(Health);

      return {
        label: 'Player',
        entries: [
          { key: 'Position', value: Math.round(transform.x) + ', ' + Math.round(transform.y) },
          { key: 'Velocity', value: Math.round(velocity.vx) + ', ' + Math.round(velocity.vy) },
          { key: 'Speed', value: this._speed },
          { key: 'Health', value: health.currentHealth + '/' + health.maxHealth },
        ],
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Player = Player;
})(window.VampireSurvivors.Entities);
