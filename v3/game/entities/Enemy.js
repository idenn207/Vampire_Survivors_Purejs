/**
 * @fileoverview Enemy entity that chases the player
 * @module Game/Entities/Enemy
 */
import { Entity } from '../../../reference-framework/ecs/Entity.js';
import { Transform } from '../../../reference-framework/components/Transform.js';
import { Velocity } from '../../../reference-framework/components/Velocity.js';
import { Sprite } from '../../../reference-framework/lib/RF/components/Sprite.js';
import { Health } from '../../../reference-framework/lib/RF/components/Health.js';
import { Collider } from '../../../reference-framework/lib/RF/components/Collider.js';
import { CollisionLayers } from '../../../reference-framework/lib/RF/physics/CollisionLayers.js';
import { ENEMY } from '../config/GameConfig.js';

// ============================================
// Enemy Entity
// ============================================
export class Enemy extends Entity {
  constructor() {
    super();

    // Add components (position set by EnemySystem on spawn)
    this.addComponent(new Transform(0, 0, ENEMY.SIZE, ENEMY.SIZE));
    this.addComponent(new Velocity(0, 0));
    this.addComponent(new Sprite({
      color: ENEMY.COLOR,
      shape: 'circle',
    }));
    this.addComponent(new Health(ENEMY.HEALTH));
    this.addComponent(new Collider({
      shape: 'circle',
      radius: ENEMY.SIZE / 2,
      layer: CollisionLayers.ENEMY,
      mask: CollisionLayers.PLAYER | CollisionLayers.PROJECTILE,
    }));

    // Add tag for querying
    this.addTag('enemy');

    // Store enemy properties
    this.speed = ENEMY.SPEED;
    this.damage = ENEMY.DAMAGE;
  }
}
