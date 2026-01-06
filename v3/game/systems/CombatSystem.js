/**
 * @fileoverview CombatSystem - Processes collisions and applies damage
 * @module Game/Systems/CombatSystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Health } from '../../../reference-framework/lib/RF/components/Health.js';
import { events } from '../../../reference-framework/core/EventBus.js';
import { CollisionSystem } from './CollisionSystem.js';
import { PLAYER } from '../config/GameConfig.js';

// ============================================
// CombatSystem (Priority 25)
// ============================================
export class CombatSystem extends System {
  constructor() {
    super();
    this._priority = 25;
  }

  update(deltaTime) {
    // Get collision system to read collisions
    const collisionSystem = this.game.getSystem(CollisionSystem);
    if (!collisionSystem) return;

    const collisions = collisionSystem.getCollisions();

    // Process each collision
    for (let i = 0; i < collisions.length; i++) {
      const { entityA, entityB } = collisions[i];
      this._processCollision(entityA, entityB);
    }

    // Update player invincibility timer
    this._updateInvincibility(deltaTime);

    // Remove dead enemies
    this._removeDeadEnemies();
  }

  /**
   * Process a collision between two entities
   * @param {Entity} entityA
   * @param {Entity} entityB
   */
  _processCollision(entityA, entityB) {
    // Projectile vs Enemy
    if (entityA.hasTag('projectile') && entityB.hasTag('enemy')) {
      this._handleProjectileVsEnemy(entityA, entityB);
    } else if (entityB.hasTag('projectile') && entityA.hasTag('enemy')) {
      this._handleProjectileVsEnemy(entityB, entityA);
    }

    // Player vs Enemy
    if (entityA.hasTag('player') && entityB.hasTag('enemy')) {
      this._handlePlayerVsEnemy(entityA, entityB);
    } else if (entityB.hasTag('player') && entityA.hasTag('enemy')) {
      this._handlePlayerVsEnemy(entityB, entityA);
    }
  }

  /**
   * Handle projectile hitting enemy
   * @param {Entity} projectile
   * @param {Entity} enemy
   */
  _handleProjectileVsEnemy(projectile, enemy) {
    const enemyHealth = enemy.getComponent(Health);
    if (!enemyHealth || enemyHealth.isDead) return;

    // Apply damage
    enemyHealth.takeDamage(projectile.damage);

    // Destroy projectile
    this.entityManager.destroy(projectile);

    // Check if enemy died
    if (enemyHealth.isDead) {
      events.emit('enemy:died', { entity: enemy });
    }
  }

  /**
   * Handle player touching enemy
   * @param {Entity} player
   * @param {Entity} enemy
   */
  _handlePlayerVsEnemy(player, enemy) {
    const playerHealth = player.getComponent(Health);
    if (!playerHealth || playerHealth.isDead || playerHealth.isInvincible) return;

    // Apply damage
    playerHealth.takeDamage(enemy.damage);

    // Set invincibility
    playerHealth.setInvincible(PLAYER.INVINCIBILITY_DURATION);

    // Emit event
    events.emit('player:damaged', {
      entity: player,
      damage: enemy.damage,
      health: playerHealth.current,
    });

    // Check if player died
    if (playerHealth.isDead) {
      events.emit('player:died', { entity: player });
    }
  }

  /**
   * Update invincibility timers
   * @param {number} deltaTime
   */
  _updateInvincibility(deltaTime) {
    const players = this.entityManager.getByTag('player');
    if (players.length === 0) return;

    const player = players[0];
    const health = player.getComponent(Health);
    if (health) {
      health.update(deltaTime);
    }
  }

  /**
   * Remove dead enemies from the game
   */
  _removeDeadEnemies() {
    const enemies = this.entityManager.getByTag('enemy');

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      const health = enemy.getComponent(Health);

      if (health && health.isDead) {
        this.entityManager.destroy(enemy);
      }
    }
  }
}
