/**
 * @fileoverview LifetimeSystem - Handles entity expiration
 * @module Game/Systems/LifetimeSystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Lifetime } from '../../../reference-framework/lib/RF/components/Lifetime.js';

// ============================================
// LifetimeSystem (Priority 15)
// ============================================
export class LifetimeSystem extends System {
  constructor() {
    super();
    this._priority = 15;
  }

  update(deltaTime) {
    // Get all entities with Lifetime component
    const entities = this.entityManager.getWithComponents(Lifetime);

    for (let i = entities.length - 1; i >= 0; i--) {
      const entity = entities[i];
      const lifetime = entity.getComponent(Lifetime);

      // Update lifetime
      lifetime.update(deltaTime);

      // Remove expired entities
      if (lifetime.isExpired) {
        this.entityManager.destroy(entity);
      }
    }
  }
}
