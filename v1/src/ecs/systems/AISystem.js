/**
 * 파일위치: /src/ecs/systems/AISystem.js
 * 파일명: AISystem.js
 * 용도: AI System
 * 기능: 적 AI 행동 처리
 * 책임: 적의 이동 및 공격 로직
 */

import System from '../System.js';

export default class AISystem extends System {
  constructor(player) {
    super();
    this._required_components = ['Transform', 'Rigidbody', 'AI'];
    this._player = player;
  }

  /**
   * 플레이어 설정
   * @param {Entity} player
   */
  setPlayer(player) {
    this._player = player;
  }

  /**
   * AI 처리
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  process(entity, deltaTime) {
    const ai = entity.getComponent('AI');

    // 플레이어를 타겟으로 설정
    if (!ai.target && this._player) {
      ai.setTarget(this._player);
    }

    // AI 타입별 행동
    switch (ai.type) {
      case 'chase':
        this.#processChase(entity, deltaTime);
        break;
      // 추후 다른 AI 타입 추가
    }
  }

  /**
   * 추적 AI 처리
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  #processChase(entity, deltaTime) {
    const transform = entity.getComponent('Transform');
    const rigidbody = entity.getComponent('Rigidbody');
    const ai = entity.getComponent('AI');

    if (!ai.target) {
      return;
    }

    const direction = ai.getDirectionToTarget();
    if (!direction) {
      return;
    }

    // 플레이어 방향으로 이동
    const force = direction.multiply(rigidbody.max_speed * 10);
    rigidbody.addForce(force);

    // 플레이어를 바라보도록 회전
    transform.lookAt(ai.target.getComponent('Transform').position);
  }
}
