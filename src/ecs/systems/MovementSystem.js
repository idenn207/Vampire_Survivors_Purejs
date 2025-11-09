/**
 * 파일위치: /src/ecs/systems/MovementSystem.js
 * 파일명: MovementSystem.js
 * 용도: Movement System
 * 기능: 엔티티 이동 처리 (속도, 가속도, 물리)
 * 책임: Transform과 Rigidbody를 이용한 위치 업데이트
 */

import System from '../System.js';

export default class MovementSystem extends System {
  constructor() {
    super();
    this._required_components = ['Transform', 'Rigidbody'];
  }

  /**
   * 엔티티 이동 처리
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  process(entity, deltaTime) {
    const transform = entity.getComponent('Transform');
    const rigidbody = entity.getComponent('Rigidbody');

    // 가속도 적용
    rigidbody.velocity.add(rigidbody.acceleration.clone().multiply(deltaTime));

    // 마찰력 적용
    rigidbody.applyFriction(deltaTime);

    // 속도 제한
    rigidbody.clampVelocity();

    // 위치 업데이트
    transform.position.add(rigidbody.velocity.clone().multiply(deltaTime));

    // 가속도 초기화
    rigidbody.acceleration.set(0, 0);
  }
}
