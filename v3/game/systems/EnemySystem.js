/**
 * @fileoverview EnemySystem - Spawns enemies and updates chase AI
 * @module Game/Systems/EnemySystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Transform } from '../../../reference-framework/components/Transform.js';
import { Velocity } from '../../../reference-framework/components/Velocity.js';
import { Enemy } from '../entities/Enemy.js';
import { ENEMY, CANVAS } from '../config/GameConfig.js';

// ============================================
// EnemySystem (Priority 8)
// ============================================
export class EnemySystem extends System {
  constructor() {
    super();
    this._priority = 8;
    this._spawnTimer = 0;
  }

  update(deltaTime) {
    // Update spawn timer
    this._spawnTimer += deltaTime;

    // Spawn new enemy if timer elapsed and under max count
    const enemies = this.entityManager.getByTag('enemy');
    if (this._spawnTimer >= ENEMY.SPAWN_INTERVAL && enemies.length < ENEMY.MAX_COUNT) {
      this._spawnEnemy();
      this._spawnTimer = 0;
    }

    // Update enemy AI (chase player)
    this._updateChaseAI(enemies);
  }

  /**
   * Spawn an enemy outside the screen
   */
  _spawnEnemy() {
    const enemy = this.entityManager.create(Enemy);
    const transform = enemy.getComponent(Transform);

    // Get spawn position outside screen
    const spawnPos = this._getSpawnPosition();
    transform.x = spawnPos.x;
    transform.y = spawnPos.y;
  }

  /**
   * Get a random spawn position outside the screen
   * @returns {{x: number, y: number}}
   */
  _getSpawnPosition() {
    const distance = ENEMY.SPAWN_DISTANCE;
    const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left

    let x, y;

    switch (side) {
      case 0: // Top
        x = Math.random() * CANVAS.WIDTH;
        y = -distance;
        break;
      case 1: // Right
        x = CANVAS.WIDTH + distance;
        y = Math.random() * CANVAS.HEIGHT;
        break;
      case 2: // Bottom
        x = Math.random() * CANVAS.WIDTH;
        y = CANVAS.HEIGHT + distance;
        break;
      case 3: // Left
        x = -distance;
        y = Math.random() * CANVAS.HEIGHT;
        break;
    }

    return { x, y };
  }

  /**
   * Update chase AI for all enemies
   * @param {Entity[]} enemies
   */
  _updateChaseAI(enemies) {
    // Get player position
    const players = this.entityManager.getByTag('player');
    if (players.length === 0) return;

    const player = players[0];
    const playerTransform = player.getComponent(Transform);
    const playerX = playerTransform.centerX;
    const playerY = playerTransform.centerY;

    // Update each enemy to chase player
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const transform = enemy.getComponent(Transform);
      const velocity = enemy.getComponent(Velocity);

      // Calculate direction to player
      const dx = playerX - transform.centerX;
      const dy = playerY - transform.centerY;

      // Normalize direction
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 0) {
        const dirX = dx / distance;
        const dirY = dy / distance;

        // Set velocity toward player
        velocity.vx = dirX * enemy.speed;
        velocity.vy = dirY * enemy.speed;
      }
    }
  }
}
