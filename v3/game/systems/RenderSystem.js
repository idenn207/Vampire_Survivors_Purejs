/**
 * @fileoverview RenderSystem - Draws all entities with Transform and Sprite
 * @module Game/Systems/RenderSystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Transform } from '../../../reference-framework/components/Transform.js';
import { Sprite } from '../../../reference-framework/lib/RF/components/Sprite.js';
import { Health } from '../../../reference-framework/lib/RF/components/Health.js';

// ============================================
// RenderSystem (Priority 100)
// ============================================
export class RenderSystem extends System {
  constructor() {
    super();
    this._priority = 100;
    this._flashTimer = 0;
  }

  update(deltaTime) {
    // Update flash timer for invincibility effect
    this._flashTimer += deltaTime * 10;
  }

  render(ctx) {
    // Get all entities with Transform and Sprite
    const entities = this.entityManager.getWithComponents(Transform, Sprite);

    // Sort by zIndex (lower first)
    entities.sort((a, b) => {
      const spriteA = a.getComponent(Sprite);
      const spriteB = b.getComponent(Sprite);
      return (spriteA.zIndex || 0) - (spriteB.zIndex || 0);
    });

    // Draw each entity
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const transform = entity.getComponent(Transform);
      const sprite = entity.getComponent(Sprite);

      // Skip if not visible
      if (!sprite.isVisible) continue;

      // Check for invincibility (flash effect)
      let alpha = sprite.alpha;
      const health = entity.getComponent(Health);
      if (health && health.isInvincible) {
        // Flash by alternating alpha
        alpha = Math.sin(this._flashTimer) > 0 ? 0.3 : 1.0;
      }

      // Set fill style with alpha
      ctx.globalAlpha = alpha;
      ctx.fillStyle = sprite.color;

      // Draw based on shape
      if (sprite.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(
          transform.centerX,
          transform.centerY,
          transform.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (sprite.shape === 'rect') {
        ctx.fillRect(transform.x, transform.y, transform.width, transform.height);
      } else if (sprite.shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(transform.centerX, transform.y);
        ctx.lineTo(transform.x + transform.width, transform.y + transform.height);
        ctx.lineTo(transform.x, transform.y + transform.height);
        ctx.closePath();
        ctx.fill();
      }

      // Reset alpha
      ctx.globalAlpha = 1;
    }
  }
}
