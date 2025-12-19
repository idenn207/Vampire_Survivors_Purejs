/**
 * @fileoverview Render system - draws sprites with camera offset
 * @module Systems/RenderSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Sprite = window.VampireSurvivors.Components.Sprite;
  var ShapeType = window.VampireSurvivors.Components.ShapeType;

  // ============================================
  // Class Definition
  // ============================================
  class RenderSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 100; // Render last
    _camera = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setCamera(camera) {
      this._camera = camera;
    }

    render(ctx) {
      if (!this._entityManager) return;

      var entities = this._entityManager.getWithComponents(Transform, Sprite);

      // Sort by zIndex
      entities.sort(function (a, b) {
        var spriteA = a.getComponent(Sprite);
        var spriteB = b.getComponent(Sprite);
        return spriteA.zIndex - spriteB.zIndex;
      });

      // Get camera offset
      var cameraX = this._camera ? this._camera.x : 0;
      var cameraY = this._camera ? this._camera.y : 0;

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (!entity.isActive) continue;

        var transform = entity.getComponent(Transform);
        var sprite = entity.getComponent(Sprite);

        if (!sprite.isVisible) continue;

        // Calculate screen position (world to screen)
        var screenX = transform.x - cameraX;
        var screenY = transform.y - cameraY;

        // Apply scale
        var width = transform.width * transform.scale;
        var height = transform.height * transform.scale;

        // Save context state
        ctx.save();

        // Apply alpha
        ctx.globalAlpha = sprite.alpha;

        // Apply rotation if needed
        if (transform.rotation !== 0) {
          ctx.translate(screenX + width / 2, screenY + height / 2);
          ctx.rotate(transform.rotation);
          ctx.translate(-(screenX + width / 2), -(screenY + height / 2));
        }

        // Draw sprite
        if (sprite.image) {
          // Image rendering
          if (sprite.sourceWidth > 0 && sprite.sourceHeight > 0) {
            // Sprite sheet rendering with source coordinates
            ctx.drawImage(
              sprite.image,
              sprite.sourceX, sprite.sourceY, sprite.sourceWidth, sprite.sourceHeight,
              screenX, screenY, width, height
            );
          } else {
            // Simple image rendering
            ctx.drawImage(sprite.image, screenX, screenY, width, height);
          }
        } else {
          // Fallback: Shape rendering
          this._renderShape(ctx, sprite, screenX, screenY, width, height);
        }

        // Draw debug selection highlight
        if (entity.hasTag('debug:selected')) {
          var DebugConfig = window.VampireSurvivors.Debug.DebugConfig;
          ctx.strokeStyle = DebugConfig.SELECTION_BORDER_COLOR;
          ctx.lineWidth = DebugConfig.SELECTION_BORDER_WIDTH;

          if (sprite.shape === ShapeType.CIRCLE) {
            var highlightRadius = Math.min(width, height) / 2 + 2;
            ctx.beginPath();
            ctx.arc(screenX + width / 2, screenY + height / 2, highlightRadius, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.strokeRect(screenX - 1, screenY - 1, width + 2, height + 2);
          }
        }

        // Restore context state
        ctx.restore();
      }

      // Render enemy projectiles
      var Pool = window.VampireSurvivors.Pool;
      if (Pool && Pool.enemyProjectilePool) {
        Pool.enemyProjectilePool.render(ctx, this._camera);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------

    /**
     * Render a shape (fallback when no image)
     * @param {CanvasRenderingContext2D} ctx
     * @param {Sprite} sprite
     * @param {number} screenX
     * @param {number} screenY
     * @param {number} width
     * @param {number} height
     */
    _renderShape(ctx, sprite, screenX, screenY, width, height) {
      ctx.fillStyle = sprite.color;

      if (sprite.shape === ShapeType.CIRCLE) {
        var radius = Math.min(width, height) / 2;
        ctx.beginPath();
        ctx.arc(screenX + width / 2, screenY + height / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Default: rectangle
        ctx.fillRect(screenX, screenY, width, height);
      }
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get camera() {
      return this._camera;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var count = 0;
      if (this._entityManager) {
        count = this._entityManager.getWithComponents(Transform, Sprite).length;
      }

      return {
        label: 'Render',
        entries: [
          { key: 'Sprites', value: count },
          { key: 'Camera', value: this._camera ? 'Set' : 'None' },
        ],
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.RenderSystem = RenderSystem;
})(window.VampireSurvivors.Systems);
