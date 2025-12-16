/**
 * 파일위치: /src/ecs/systems/ProjectileSystem.js
 * 파일명: ProjectileSystem.js
 * 용도: Projectile System
 * 기능: 투사체 수명 관리
 * 책임: 투사체 자동 제거
 */

import projectilePool from '../../pool/ProjectilePool.js';
import System from '../System.js';

export default class ProjectileSystem extends System {
  constructor() {
    super();
    this._required_components = ['Transform'];
  }

  /**
   * 투사체 처리
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  process(entity, deltaTime) {
    // 투사체가 아니면 무시
    if (entity.name !== 'Projectile') {
      return;
    }

    // 수명 증가
    entity.lifetime += deltaTime;

    // 최대 수명 초과 시 제거
    if (entity.lifetime >= entity.max_lifetime) {
      projectilePool.despawn(entity);
    }
  }
}
