/**
 * @fileoverview Pickup entity - collectible items dropped by enemies
 * @module Entities/Pickup
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
  var PickupComponent = window.VampireSurvivors.Components.Pickup;
  var PickupConfig = window.VampireSurvivors.Data.PickupConfig;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_SIZE = 8;
  var DEFAULT_COLOR = '#FFD700'; // Gold

  // ============================================
  // Type to Tag Mapping
  // ============================================
  var TYPE_TAGS = {
    exp: 'exp-gem',
    gold: 'gold-coin',
    health: 'health-potion',
  };

  // ============================================
  // Class Definition
  // ============================================
  class Pickup extends Entity {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _type = 'exp';

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {string} [type] - Pickup type ('exp', 'gold', 'health')
     * @param {number} [value] - Value to grant
     * @param {number} [x] - Initial X position
     * @param {number} [y] - Initial Y position
     */
    constructor(type, value, x, y) {
      super();

      // Pass value for XP tier calculation
      var config = PickupConfig.getPickupConfig(type, value) || PickupConfig.getPickupConfig('exp');
      var size = config ? config.size : DEFAULT_SIZE;
      var color = config ? config.color : DEFAULT_COLOR;
      var magnetRadius = config ? config.magnetRadius : 100;
      var magnetSpeed = config ? config.magnetSpeed : 250;

      this._type = type || 'exp';

      // Add components
      this.addComponent(new Transform(x || 0, y || 0, size, size));
      this.addComponent(new Velocity());
      var pickupSprite = new Sprite(color, 'circle');
      if (config && config.imageId) {
        pickupSprite.setImageId(config.imageId);
      }
      this.addComponent(pickupSprite);
      this.addComponent(
        new Collider(
          size / 2, // radius
          CollisionLayer.PICKUP, // layer - pickup layer
          CollisionLayer.PLAYER, // mask - collides with player only
          true // isTrigger
        )
      );
      this.addComponent(new PickupComponent(type, value, magnetRadius, magnetSpeed));

      // Add tags
      this.addTag('pickup');
      if (TYPE_TAGS[this._type]) {
        this.addTag(TYPE_TAGS[this._type]);
      }
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Reset pickup for pool reuse
     * @param {string} type
     * @param {number} value
     * @param {number} x
     * @param {number} y
     */
    reset(type, value, x, y) {
      // Pass value for XP tier calculation
      var config = PickupConfig.getPickupConfig(type, value) || PickupConfig.getPickupConfig('exp');
      var size = config ? config.size : DEFAULT_SIZE;
      var color = config ? config.color : DEFAULT_COLOR;
      var magnetRadius = config ? config.magnetRadius : 100;
      var magnetSpeed = config ? config.magnetSpeed : 250;

      // Remove old type tag
      if (TYPE_TAGS[this._type]) {
        this.removeTag(TYPE_TAGS[this._type]);
      }

      this._type = type || 'exp';

      // Add new type tag
      if (TYPE_TAGS[this._type]) {
        this.addTag(TYPE_TAGS[this._type]);
      }

      // Reset transform
      var transform = this.transform;
      transform.x = x;
      transform.y = y;
      transform.width = size;
      transform.height = size;

      // Reset velocity (stop any magnetization)
      var velocity = this.velocity;
      velocity.vx = 0;
      velocity.vy = 0;

      // Reset sprite
      var sprite = this.sprite;
      sprite.color = color;
      sprite.isVisible = true;
      sprite.alpha = 1;
      if (config && config.imageId) {
        sprite.setImageId(config.imageId);
      } else {
        sprite.clearImage();
      }

      // Reset collider
      var collider = this.collider;
      collider.radius = size / 2;

      // Reset pickup component
      var pickup = this.pickup;
      pickup.reset(type, value, magnetRadius, magnetSpeed);

      // Ensure active
      this.isActive = true;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get type() {
      return this._type;
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

    get pickup() {
      return this.getComponent(PickupComponent);
    }

    get value() {
      var pickup = this.pickup;
      return pickup ? pickup.value : 0;
    }

    get isMagnetized() {
      var pickup = this.pickup;
      return pickup ? pickup.isMagnetized : false;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.Pickup = Pickup;
})(window.VampireSurvivors.Entities);
