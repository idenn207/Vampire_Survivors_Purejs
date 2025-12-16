/**
 * 파일위치: /src/ecs/components/AI.js
 * 파일명: AI.js
 * 용도: AI 컴포넌트
 * 기능: AI 행동 정의
 * 책임: 적의 행동 패턴
 */

import Component from '../Component.js';

export default class AI extends Component {
  constructor(type = 'chase') {
    super();

    this.type = type; // 'chase' | 'dash' | 'ranged' 등
    this.target = null; // 타겟 엔티티 (보통 플레이어)
    this.state = 'idle'; // 현재 상태

    // 추적 관련
    this.detection_range = 500; // 감지 범위
    this.attack_range = 30; // 공격 범위

    // 행동 타이머
    this.action_timer = 0;
    this.action_cooldown = 0;
  }

  /**
   * 타겟 설정
   * @param {Entity} target
   */
  setTarget(target) {
    this.target = target;
  }

  /**
   * 타겟까지의 거리
   * @returns {number}
   */
  getDistanceToTarget() {
    if (!this.target) {
      return Infinity;
    }

    const myTransform = this._entity.getComponent('Transform');
    const targetTransform = this.target.getComponent('Transform');

    if (!myTransform || !targetTransform) {
      return Infinity;
    }

    return myTransform.position.distance(targetTransform.position);
  }

  /**
   * 타겟 방향 벡터
   * @returns {Vector2|null}
   */
  getDirectionToTarget() {
    if (!this.target) {
      return null;
    }

    const myTransform = this._entity.getComponent('Transform');
    const targetTransform = this.target.getComponent('Transform');

    if (!myTransform || !targetTransform) {
      return null;
    }

    const direction = targetTransform.position.clone().sub(myTransform.position);
    return direction.normalize();
  }
}
