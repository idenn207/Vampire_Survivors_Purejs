/**
 * @fileoverview Player entity with movement components
 * @module Game/Entities/Player
 */
import { Entity } from '../../../reference-framework/ecs/Entity.js';
import { Transform } from '../../../reference-framework/components/Transform.js';
import { Velocity } from '../../../reference-framework/components/Velocity.js';
import { Sprite } from '../../../reference-framework/lib/RF/components/Sprite.js';
import { Health } from '../../../reference-framework/lib/RF/components/Health.js';
import { Collider } from '../../../reference-framework/lib/RF/components/Collider.js';
import { CollisionLayers } from '../../../reference-framework/lib/RF/physics/CollisionLayers.js';
import { Weapon } from '../components/Weapon.js';
import { PLAYER, CANVAS } from '../config/GameConfig.js';

// ============================================
// Player Entity
// ============================================
export class Player extends Entity {
  constructor() {
    super();

    // Calculate center position
    const startX = (CANVAS.WIDTH - PLAYER.SIZE) / 2;
    const startY = (CANVAS.HEIGHT - PLAYER.SIZE) / 2;

    // Add components
    this.addComponent(new Transform(startX, startY, PLAYER.SIZE, PLAYER.SIZE));
    this.addComponent(new Velocity(0, 0));
    this.addComponent(new Sprite({
      color: PLAYER.COLOR,
      shape: 'circle',
    }));
    this.addComponent(new Health(PLAYER.HEALTH));
    this.addComponent(new Collider({
      shape: 'circle',
      radius: PLAYER.SIZE / 2,
      layer: CollisionLayers.PLAYER,
      mask: CollisionLayers.ENEMY,
    }));
    this.addComponent(new Weapon()); // Auto-fire weapon

    // Add tag for querying
    this.addTag('player');

    // Store speed for PlayerSystem
    this.speed = PLAYER.SPEED;
  }
}
