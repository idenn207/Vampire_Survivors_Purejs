/**
 * @fileoverview Projectile entity - weapon projectiles that damage enemies
 * @module Entities/Projectile
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
  var ProjectileComponent = window.VampireSurvivors.Components.Projectile;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_SIZE = 8;
  var DEFAULT_COLOR = '#FFFF00'; // Yellow

  // ============================================
  // Class Definition
  // ============================================
  class Projectile extends Entity {
    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {number} [x] - Initial X position
     * @param {number} [y] - Initial Y position
     * @param {number} [size] - Projectile size
     * @param {string} [color] - Projectile color
     */
    constructor(x, y, size, color) {
      super();

      var actualSize = size || DEFAULT_SIZE;
      var actualColor = color || DEFAULT_COLOR;

      // Add components
      this.addComponent(new Transform(x || 0, y || 0, actualSize, actualSize));
      this.addComponent(new Velocity());
      this.addComponent(new Sprite(actualColor, 'circle'));
      this.addComponent(
        new Collider(
          actualSize / 2, // radius
          CollisionLayer.HITBOX, // layer - hitbox layer
          CollisionLayer.ENEMY // mask - collides with enemies
        )
      );
      this.addComponent(new ProjectileComponent());

      // Add tag
      this.addTag('hitbox');
      this.addTag('projectile');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Reset projectile for pool reuse
     * @param {number} x
     * @param {number} y
     * @param {number} vx
     * @param {number} vy
     * @param {number} damage
     * @param {number} pierce
     * @param {string} color
     * @param {number} size
     * @param {number} lifetime
     * @param {string} [sourceWeaponId]
     * @param {Object} [ricochet] - Ricochet config { bounces, damageDecay, bounceRange }
     * @param {boolean} [isCrit] - Whether this projectile is a critical hit
     */
    reset(x, y, vx, vy, damage, pierce, color, size, lifetime, sourceWeaponId, ricochet, isCrit) {
      // Reset transform
      var transform = this.transform;
      transform.x = x;
      transform.y = y;
      transform.width = size;
      transform.height = size;

      // Reset velocity
      var velocity = this.velocity;
      velocity.vx = vx;
      velocity.vy = vy;

      // Reset sprite
      var sprite = this.sprite;
      sprite.color = color;
      sprite.isVisible = true;
      sprite.alpha = 1;

      // Reset collider
      var collider = this.collider;
      collider.radius = size / 2;

      // Reset projectile component
      var projectile = this.projectile;
      projectile.reset(damage, pierce, lifetime, sourceWeaponId, ricochet, isCrit);

      // Ensure active
      this.isActive = true;
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

    get collider() {
      return this.getComponent(Collider);
    }

    get projectile() {
      return this.getComponent(ProjectileComponent);
    }

    get damage() {
      var proj = this.projectile;
      return proj ? proj.damage : 0;
    }

    get pierce() {
      var proj = this.projectile;
      return proj ? proj.pierce : 0;
    }

    get isExpired() {
      var proj = this.projectile;
      return proj ? proj.isExpired : true;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Projectile = Projectile;
})(window.VampireSurvivors.Entities);
