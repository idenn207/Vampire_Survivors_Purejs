/**
 * @fileoverview CollisionSystem - Detects collisions between entities
 * @module Game/Systems/CollisionSystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Transform } from '../../../reference-framework/components/Transform.js';
import { Collider } from '../../../reference-framework/lib/RF/components/Collider.js';
import { CollisionLayers } from '../../../reference-framework/lib/RF/physics/CollisionLayers.js';

// ============================================
// CollisionSystem (Priority 20)
// ============================================
export class CollisionSystem extends System {
  constructor() {
    super();
    this._priority = 20;
    this._collisions = []; // Store collisions for CombatSystem
  }

  /**
   * Get current frame's collisions
   * @returns {Array<{entityA: Entity, entityB: Entity}>}
   */
  getCollisions() {
    return this._collisions;
  }

  update(deltaTime) {
    // Clear previous frame's collisions
    this._collisions = [];

    // Get all entities with colliders
    const entities = this.entityManager.getWithComponents(Transform, Collider);

    // Check all pairs for collisions
    for (let i = 0; i < entities.length; i++) {
      const entityA = entities[i];
      const transformA = entityA.getComponent(Transform);
      const colliderA = entityA.getComponent(Collider);

      if (!colliderA.isEnabled) continue;

      for (let j = i + 1; j < entities.length; j++) {
        const entityB = entities[j];
        const transformB = entityB.getComponent(Transform);
        const colliderB = entityB.getComponent(Collider);

        if (!colliderB.isEnabled) continue;

        // Check if layers can collide
        if (!this._canCollide(colliderA, colliderB)) continue;

        // Check for overlap
        if (this._checkOverlap(transformA, colliderA, transformB, colliderB)) {
          this._collisions.push({ entityA, entityB });
        }
      }
    }
  }

  /**
   * Check if two colliders can collide based on layers
   * @param {Collider} colliderA
   * @param {Collider} colliderB
   * @returns {boolean}
   */
  _canCollide(colliderA, colliderB) {
    // A's mask includes B's layer OR B's mask includes A's layer
    const aCanHitB = (colliderA.mask & colliderB.layer) !== 0;
    const bCanHitA = (colliderB.mask & colliderA.layer) !== 0;
    return aCanHitB || bCanHitA;
  }

  /**
   * Check if two entities overlap (circle collision)
   * @param {Transform} transformA
   * @param {Collider} colliderA
   * @param {Transform} transformB
   * @param {Collider} colliderB
   * @returns {boolean}
   */
  _checkOverlap(transformA, colliderA, transformB, colliderB) {
    // Get centers
    const ax = transformA.centerX + colliderA.offsetX;
    const ay = transformA.centerY + colliderA.offsetY;
    const bx = transformB.centerX + colliderB.offsetX;
    const by = transformB.centerY + colliderB.offsetY;

    // Calculate distance squared
    const dx = bx - ax;
    const dy = by - ay;
    const distSq = dx * dx + dy * dy;

    // Get combined radius
    const radiusA = colliderA.radius;
    const radiusB = colliderB.radius;
    const combinedRadius = radiusA + radiusB;

    return distSq <= combinedRadius * combinedRadius;
  }
}
