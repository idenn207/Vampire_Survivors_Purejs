/**
 * @fileoverview Projectile entity fired by weapons
 * @module Game/Entities/Projectile
 */
import { Entity } from '../../../reference-framework/ecs/Entity.js';
import { Transform } from '../../../reference-framework/components/Transform.js';
import { Velocity } from '../../../reference-framework/components/Velocity.js';
import { Sprite } from '../../../reference-framework/lib/RF/components/Sprite.js';
import { Lifetime } from '../../../reference-framework/lib/RF/components/Lifetime.js';
import { Collider } from '../../../reference-framework/lib/RF/components/Collider.js';
import { CollisionLayers } from '../../../reference-framework/lib/RF/physics/CollisionLayers.js';
import { WEAPON } from '../config/GameConfig.js';

// ============================================
// Projectile Entity
// ============================================
export class Projectile extends Entity {
  constructor() {
    super();

    // Add components (position/velocity set by WeaponSystem)
    this.addComponent(new Transform(0, 0, WEAPON.PROJECTILE_SIZE, WEAPON.PROJECTILE_SIZE));
    this.addComponent(new Velocity(0, 0));
    this.addComponent(new Sprite({
      color: WEAPON.PROJECTILE_COLOR,
      shape: 'circle',
      zIndex: 10, // Draw above enemies
    }));
    this.addComponent(new Lifetime(WEAPON.PROJECTILE_LIFETIME));
    this.addComponent(new Collider({
      shape: 'circle',
      radius: WEAPON.PROJECTILE_SIZE / 2,
      layer: CollisionLayers.PROJECTILE,
      mask: CollisionLayers.ENEMY,
    }));

    // Add tag for querying
    this.addTag('projectile');

    // Store damage (set by WeaponSystem based on weapon)
    this.damage = WEAPON.DAMAGE;
  }

  /**
   * Initialize projectile with position and velocity
   * @param {number} x - Start X position
   * @param {number} y - Start Y position
   * @param {number} vx - X velocity
   * @param {number} vy - Y velocity
   * @param {number} damage - Damage to deal on hit
   */
  init(x, y, vx, vy, damage) {
    const transform = this.getComponent(Transform);
    const velocity = this.getComponent(Velocity);

    transform.x = x - transform.width / 2;
    transform.y = y - transform.height / 2;
    velocity.vx = vx;
    velocity.vy = vy;
    this.damage = damage;
  }
}
