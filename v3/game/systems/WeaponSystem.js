/**
 * @fileoverview WeaponSystem - Auto-fires projectiles at nearest enemy
 * @module Game/Systems/WeaponSystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Transform } from '../../../reference-framework/components/Transform.js';
import { Lifetime } from '../../../reference-framework/lib/RF/components/Lifetime.js';
import { Weapon } from '../components/Weapon.js';
import { Projectile } from '../entities/Projectile.js';

// ============================================
// WeaponSystem (Priority 40)
// ============================================
export class WeaponSystem extends System {
  constructor() {
    super();
    this._priority = 40;
  }

  update(deltaTime) {
    // Get player with weapon
    const players = this.entityManager.getByTag('player');
    if (players.length === 0) return;

    const player = players[0];
    const weapon = player.getComponent(Weapon);
    if (!weapon) return;

    const playerTransform = player.getComponent(Transform);
    const currentTime = this.game.elapsedTime;

    // Check if weapon can fire
    if (!weapon.canFire(currentTime)) return;

    // Find nearest enemy in range
    const target = this._findNearestEnemy(playerTransform, weapon.range);
    if (!target) return;

    // Fire projectile
    this._fireProjectile(playerTransform, target, weapon);
    weapon.fire(currentTime);
  }

  /**
   * Find the nearest enemy within range
   * @param {Transform} playerTransform
   * @param {number} range
   * @returns {Entity|null}
   */
  _findNearestEnemy(playerTransform, range) {
    const enemies = this.entityManager.getByTag('enemy');
    if (enemies.length === 0) return null;

    const playerX = playerTransform.centerX;
    const playerY = playerTransform.centerY;

    let nearest = null;
    let nearestDistSq = range * range;

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const enemyTransform = enemy.getComponent(Transform);

      const dx = enemyTransform.centerX - playerX;
      const dy = enemyTransform.centerY - playerY;
      const distSq = dx * dx + dy * dy;

      if (distSq < nearestDistSq) {
        nearestDistSq = distSq;
        nearest = enemy;
      }
    }

    return nearest;
  }

  /**
   * Fire a projectile toward target
   * @param {Transform} playerTransform
   * @param {Entity} target
   * @param {Weapon} weapon
   */
  _fireProjectile(playerTransform, target, weapon) {
    const targetTransform = target.getComponent(Transform);

    // Calculate direction to target
    const dx = targetTransform.centerX - playerTransform.centerX;
    const dy = targetTransform.centerY - playerTransform.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return;

    // Normalize direction and apply speed
    const vx = (dx / dist) * weapon.projectileSpeed;
    const vy = (dy / dist) * weapon.projectileSpeed;

    // Create projectile
    const projectile = this.entityManager.create(Projectile);
    projectile.init(
      playerTransform.centerX,
      playerTransform.centerY,
      vx,
      vy,
      weapon.damage
    );
  }
}
