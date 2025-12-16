/**
 * 파일위치: /src/ecs/components/Collider.js
 * 파일명: Collider.js
 * 용도: Collider 컴포넌트
 * 기능: 충돌 판정, 충돌 박스 정의
 * 책임: 엔티티의 충돌 영역
 */

import Component from '../Component.js';

export default class Collider extends Component {
  constructor(type = 'circle', width = 32, height = 32, radius = 16) {
    super();

    this.type = type; // 'circle' | 'box'
    this.width = width; // 박스 충돌체 너비
    this.height = height; // 박스 충돌체 높이
    this.radius = radius; // 원형 충돌체 반지름

    this.offset_x = 0; // 충돌체 오프셋 X
    this.offset_y = 0; // 충돌체 오프셋 Y

    this.is_trigger = false; // 트리거 여부 (물리 충돌 무시)
    this.collision_layer = 0; // 충돌 레이어
    this.collision_mask = -1; // 충돌 마스크 (어떤 레이어와 충돌할지)
  }

  /**
   * 오프셋 설정
   * @param {number} x
   * @param {number} y
   */
  setOffset(x, y) {
    this.offset_x = x;
    this.offset_y = y;
  }

  /**
   * 충돌 레이어 설정
   * @param {number} layer
   */
  setLayer(layer) {
    this.collision_layer = layer;
  }

  /**
   * 충돌 마스크 설정
   * @param {number} mask
   */
  setMask(mask) {
    this.collision_mask = mask;
  }

  /**
   * 특정 레이어와 충돌 가능한지 확인
   * @param {number} layer
   * @returns {boolean}
   */
  canCollideWith(layer) {
    return (this.collision_mask & (1 << layer)) !== 0;
  }
}
