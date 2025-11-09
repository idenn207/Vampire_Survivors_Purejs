/**
 * 파일위치: /src/ecs/systems/ExperienceSystem.js
 * 파일명: ExperienceSystem.js
 * 용도: Experience System
 * 기능: 경험치 자석, 체력 재생 처리
 * 책임: 플레이어 성장 시스템
 */

import Config from '../../data/Config.js';
import System from '../System.js';

export default class ExperienceSystem extends System {
  constructor(player, dropItems) {
    super();
    this._required_components = ['Stats', 'Health'];
    this._player = player;
    this._drop_items = dropItems || [];
  }

  /**
   * 드랍 아이템 목록 설정
   * @param {Array<Entity>} dropItems
   */
  setDropItems(dropItems) {
    this._drop_items = dropItems;
  }

  /**
   * 엔티티 처리
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  process(entity, deltaTime) {
    // 플레이어만 처리
    if (entity !== this._player) {
      return;
    }

    const stats = entity.getComponent('Stats');
    const health = entity.getComponent('Health');
    const transform = entity.getComponent('Transform');

    // 체력 재생
    if (stats.health_regen > 0 && !health.is_dead) {
      health.heal(stats.health_regen * deltaTime);
    }

    // 무적 타이머 업데이트
    if (health.is_invincible) {
      health.updateInvincibility(deltaTime);
    }

    // 경험치 자석
    this.#processMagnet(transform, stats);
  }

  /**
   * 경험치 자석 처리
   * @param {Transform} transform
   * @param {Stats} stats
   */
  #processMagnet(transform, stats) {
    const magnetRange = stats.magnet_range;

    for (const item of this._drop_items) {
      if (!item.active || item.destroyed) {
        continue;
      }

      // 경험치만 자석으로 끌어당김
      if (item.drop_type !== 'exp') {
        continue;
      }

      const itemTransform = item.getComponent('Transform');
      const itemRigidbody = item.getComponent('Rigidbody');

      if (!itemTransform || !itemRigidbody) {
        continue;
      }

      const distance = transform.position.distance(itemTransform.position);

      // 자석 범위 내
      if (distance < magnetRange) {
        item.is_magnetized = true;

        // 플레이어 방향으로 이동
        const direction = transform.position.clone().sub(itemTransform.position).normalize();

        const magnetSpeed = Config.EXPERIENCE.MAGNET_SPEED;
        itemRigidbody.velocity.set(direction.x * magnetSpeed, direction.y * magnetSpeed);
      }
    }
  }
}
