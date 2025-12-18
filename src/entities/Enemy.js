/**
 * @fileoverview Enemy entity with chase AI
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
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Enemy = Enemy;
})(window.VampireSurvivors.Entities);
