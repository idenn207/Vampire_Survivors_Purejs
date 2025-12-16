/**
 * 파일위치: /src/ecs/systems/CollisionSystem.js
 * 파일명: CollisionSystem.js
 * 용도: Collision System
 * 기능: 엔티티 간 충돌 감지
 * 책임: 충돌 이벤트 발생
 */

import Collision from '../../utils/Collision.js';
import eventBus from '../../utils/EventBus.js';
import System from '../System.js';

export default class CollisionSystem extends System {
  constructor() {
    super();
    this._required_components = ['Transform', 'Collider'];
    this._collision_pairs = []; // 이번 프레임의 충돌 쌍
  }

  /**
   * 충돌 검사 업데이트
   * @param {number} deltaTime
   */
  update(deltaTime) {
    if (!this._enabled) {
      return;
    }

    this._collision_pairs = [];

    // 모든 엔티티 쌍에 대해 충돌 검사
    for (let i = 0; i < this._entities.length; i++) {
      const entityA = this._entities[i];

      if (!entityA.active || entityA.destroyed) {
        continue;
      }

      for (let j = i + 1; j < this._entities.length; j++) {
        const entityB = this._entities[j];

        if (!entityB.active || entityB.destroyed) {
          continue;
        }

        // 충돌 검사
        if (this.#checkCollision(entityA, entityB)) {
          this._collision_pairs.push({ a: entityA, b: entityB });

          // 충돌 이벤트 발생
          eventBus.emit('collision', {
            entityA,
            entityB,
          });
        }
      }
    }
  }

  /**
   * 두 엔티티 간 충돌 검사
   * @param {Entity} entityA
   * @param {Entity} entityB
   * @returns {boolean}
   */
  #checkCollision(entityA, entityB) {
    const transformA = entityA.getComponent('Transform');
    const colliderA = entityA.getComponent('Collider');
    const transformB = entityB.getComponent('Transform');
    const colliderB = entityB.getComponent('Collider');

    // 레이어 마스크 체크
    if (!colliderA.canCollideWith(colliderB.collision_layer)) {
      return false;
    }

    // 충돌 타입별 검사
    if (colliderA.type === 'circle' && colliderB.type === 'circle') {
      return Collision.circleCircle(transformA.position, colliderA.radius, transformB.position, colliderB.radius);
    } else if (colliderA.type === 'box' && colliderB.type === 'box') {
      return Collision.boxBox(transformA.position, colliderA.width, colliderA.height, transformB.position, colliderB.width, colliderB.height);
    } else if (colliderA.type === 'circle' && colliderB.type === 'box') {
      return Collision.circleBox(transformA.position, colliderA.radius, transformB.position, colliderB.width, colliderB.height);
    } else if (colliderA.type === 'box' && colliderB.type === 'circle') {
      return Collision.circleBox(transformB.position, colliderB.radius, transformA.position, colliderA.width, colliderA.height);
    }

    return false;
  }

  /**
   * 이번 프레임의 충돌 쌍
   */
  get collisionPairs() {
    return this._collision_pairs;
  }
}
