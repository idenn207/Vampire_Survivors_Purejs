/**
 * 파일위치: /src/ecs/components/Rigidbody.js
 * 파일명: Rigidbody.js
 * 용도: Rigidbody 컴포넌트
 * 기능: 속도, 가속도, 물리 시뮬레이션
 * 책임: 엔티티의 운동 정보
 */

import Vector2 from '../../utils/Vector2.js';
import Component from '../Component.js';

export default class Rigidbody extends Component {
  constructor() {
    super();

    this.velocity = new Vector2(0, 0); // 속도
    this.acceleration = new Vector2(0, 0); // 가속도
    this.max_speed = 500; // 최대 속도
    this.friction = 0; // 마찰력 (0~1)
    this.mass = 1; // 질량
    this.use_gravity = false; // 중력 사용 여부
  }

  /**
   * 힘 추가 (F = ma)
   * @param {Vector2} force
   */
  addForce(force) {
    const accel = force.clone().divide(this.mass);
    this.acceleration.add(accel);
  }

  /**
   * 충격 추가 (즉시 속도 변경)
   * @param {Vector2} impulse
   */
  addImpulse(impulse) {
    const velocityChange = impulse.clone().divide(this.mass);
    this.velocity.add(velocityChange);
  }

  /**
   * 속도 제한
   */
  clampVelocity() {
    const speed = this.velocity.magnitude();
    if (speed > this.max_speed) {
      this.velocity.normalize().multiply(this.max_speed);
    }
  }

  /**
   * 마찰력 적용
   * @param {number} deltaTime
   */
  applyFriction(deltaTime) {
    if (this.friction <= 0) {
      return;
    }

    const frictionForce = this.velocity.clone().multiply(-this.friction);
    this.addForce(frictionForce);
  }
}
