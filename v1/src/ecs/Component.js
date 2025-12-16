/**
 * 파일위치: /src/ecs/Component.js
 * 파일명: Component.js
 * 용도: ECS 패턴의 Component 베이스 클래스
 * 기능: 데이터 저장소 역할
 * 책임: 엔티티의 속성/데이터 정의
 */

export default class Component {
  constructor() {
    this._entity = null;
  }

  /**
   * 소유 엔티티 설정
   * @param {Entity} entity
   */
  set entity(value) {
    this._entity = value;
  }

  /**
   * 소유 엔티티 가져오기
   * @returns {Entity|null}
   */
  get entity() {
    return this._entity;
  }
}
