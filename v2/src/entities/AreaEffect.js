/**
 * @fileoverview AreaEffect entity - persistent damage zones
 * @module Entities/AreaEffect
 */
(function (Entities) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Entity = Entities.Entity;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Sprite = window.VampireSurvivors.Components.Sprite;
  var AreaEffectComponent = window.VampireSurvivors.Components.AreaEffect;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_RADIUS = 50;
  var DEFAULT_COLOR = '#00FF00';

  // ============================================
  // Class Definition
  // ============================================
  class AreaEffect extends Entity {
    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {number} [x] - Center X position
     * @param {number} [y] - Center Y position
     * @param {number} [radius] - Effect radius
     * @param {string} [color] - Effect color
     */
    constructor(x, y, radius, color) {
      super();

      var actualRadius = radius || DEFAULT_RADIUS;
      var actualColor = color || DEFAULT_COLOR;
      var size = actualRadius * 2;

      // Add components
      this.addComponent(new Transform(x || 0, y || 0, size, size));

      var sprite = new Sprite(actualColor, 'circle');
      sprite.alpha = 0.4;
      this.addComponent(sprite);

      this.addComponent(new AreaEffectComponent());

      // Add tags
      this.addTag('hitbox');
      this.addTag('areaEffect');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Reset area effect for pool reuse
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {string} color
     * @param {number} damage
     * @param {number} duration
     * @param {number} tickRate
     * @param {string} [sourceWeaponId]
     * @param {string} [imageId] - Image ID for sprite rendering (falls back to shape)
     */
    reset(x, y, radius, color, damage, duration, tickRate, sourceWeaponId, imageId) {
      var size = radius * 2;

      // Reset transform
      var transform = this.transform;
      transform.x = x - radius; // Center the effect
      transform.y = y - radius;
      transform.width = size;
      transform.height = size;

      // Reset sprite
      var sprite = this.sprite;
      sprite.color = color;
      sprite.isVisible = true;
      sprite.alpha = 0.4;

      // Apply image or clear for shape fallback
      if (imageId) {
        sprite.setImageId(imageId);
      } else {
        sprite.clearImage();
      }

      // Reset area effect component
      var areaEffect = this.areaEffect;
      areaEffect.reset(damage, radius, duration, tickRate, sourceWeaponId);

      // Ensure active
      this.isActive = true;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get transform() {
      return this.getComponent(Transform);
    }

    get sprite() {
      return this.getComponent(Sprite);
    }

    get areaEffect() {
      return this.getComponent(AreaEffectComponent);
    }

    get damage() {
      var ae = this.areaEffect;
      return ae ? ae.damage : 0;
    }

    get radius() {
      var ae = this.areaEffect;
      return ae ? ae.radius : 0;
    }

    get isExpired() {
      var ae = this.areaEffect;
      return ae ? ae.isExpired : true;
    }

    get center() {
      var transform = this.transform;
      if (!transform) return { x: 0, y: 0 };
      return {
        x: transform.centerX,
        y: transform.centerY,
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Entities.AreaEffect = AreaEffect;
})(window.VampireSurvivors.Entities);
