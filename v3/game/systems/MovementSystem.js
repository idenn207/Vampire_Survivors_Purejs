/**
 * @fileoverview MovementSystem - Applies velocity to transform position
 * @module Game/Systems/MovementSystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Transform } from '../../../reference-framework/components/Transform.js';
import { Velocity } from '../../../reference-framework/components/Velocity.js';

// ============================================
// MovementSystem (Priority 10)
// ============================================
export class MovementSystem extends System {
  constructor() {
    super();
    this._priority = 10;
  }

  update(deltaTime) {
    // Get all entities with Transform and Velocity
    const entities = this.entityManager.getWithComponents(Transform, Velocity);

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const transform = entity.getComponent(Transform);
      const velocity = entity.getComponent(Velocity);

      // Apply velocity to position
      transform.x += velocity.vx * deltaTime;
      transform.y += velocity.vy * deltaTime;

      // Clamp to screen bounds
      if (transform.x < 0) {
        transform.x = 0;
      }
      if (transform.y < 0) {
        transform.y = 0;
      }
      if (transform.x + transform.width > this.game.width) {
        transform.x = this.game.width - transform.width;
      }
      if (transform.y + transform.height > this.game.height) {
        transform.y = this.game.height - transform.height;
      }
    }
  }
}
