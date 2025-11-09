/**
 * 파일위치: /src/ecs/components/Transform.js
 * 파일명: Transform.js
 * 용도: Transform 컴포넌트
 * 기능: 위치, 회전, 스케일 관리
 * 책임: 엔티티의 공간 정보
 */

import Vector2 from '../../utils/Vector2.js';
import Component from '../Component.js';

export default class Transform extends Component {
  constructor(x = 0, y = 0, rotation = 0, scale = 1) {
    super();

    this.position = new Vector2(x, y);
    this.rotation = rotation; // 라디안
    this.scale = scale;
  }

  /**
   * 위치 설정
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    this.position.set(x, y);
  }

  /**
   * 위치 이동
   * @param {number} dx
   * @param {number} dy
   */
  translate(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
  }

  /**
   * 회전 설정 (각도)
   * @param {number} degrees
   */
  setRotationDegrees(degrees) {
    this.rotation = (degrees * Math.PI) / 180;
  }

  /**
   * 회전 가져오기 (각도)
   * @returns {number}
   */
  getRotationDegrees() {
    return (this.rotation * 180) / Math.PI;
  }

  /**
   * 특정 지점을 바라보도록 회전 설정
   * @param {Vector2} target
   */
  lookAt(target) {
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    this.rotation = Math.atan2(dy, dx);
  }

  /**
   * 앞 방향 벡터 (회전 기준)
   * @returns {Vector2}
   */
  getForward() {
    return new Vector2(Math.cos(this.rotation), Math.sin(this.rotation));
  }

  /**
   * 오른쪽 방향 벡터 (회전 기준)
   * @returns {Vector2}
   */
  getRight() {
    return new Vector2(Math.cos(this.rotation + Math.PI / 2), Math.sin(this.rotation + Math.PI / 2));
  }
}
