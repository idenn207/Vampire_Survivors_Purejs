/**
 * @fileoverview PlayerSystem - Handles player input and sets velocity
 * @module Game/Systems/PlayerSystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Velocity } from '../../../reference-framework/components/Velocity.js';

// ============================================
// PlayerSystem (Priority 5)
// ============================================
export class PlayerSystem extends System {
  constructor() {
    super();
    this._priority = 5;
  }

  update(deltaTime) {
    // Get player entity
    const players = this.entityManager.getByTag('player');
    if (players.length === 0) return;

    const player = players[0];
    const velocity = player.getComponent(Velocity);
    if (!velocity) return;

    // Get input direction (normalized for diagonal movement)
    const direction = this.game.input.getMovementDirection();

    // Set velocity based on input and player speed
    velocity.vx = direction.x * player.speed;
    velocity.vy = direction.y * player.speed;
  }
}
