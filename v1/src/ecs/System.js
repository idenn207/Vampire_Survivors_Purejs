/**
 * 파일위치: /src/ecs/System.js
 * 파일명: System.js
 * 용도: ECS 패턴의 System 베이스 클래스
 * 기능: 엔티티 처리 로직
 * 책임: 특정 컴포넌트 조합을 가진 엔티티들에 대한 로직 실행
 */

export default class System {
  constructor() {
    this._entities = [];
    this._required_components = [];
    this._enabled = true;
  }

  /**
   * 시스템이 처리할 엔티티 추가
   * @param {Entity} entity
   */
  addEntity(entity) {
    if (!this.#canProcessEntity(entity)) {
      return;
    }

    if (!this._entities.includes(entity)) {
      this._entities.push(entity);
    }
  }

  /**
   * 엔티티 제거
   * @param {Entity} entity
   */
  removeEntity(entity) {
    const index = this._entities.indexOf(entity);
    if (index !== -1) {
      this._entities.splice(index, 1);
    }
  }

  /**
   * 엔티티가 이 시스템에서 처리 가능한지 확인
   * @param {Entity} entity
   * @returns {boolean}
   */
  #canProcessEntity(entity) {
    if (!entity.active || entity.destroyed) {
      return false;
    }

    return entity.hasComponents(...this._required_components);
  }

  /**
   * 모든 등록된 엔티티 업데이트
   * @param {number} deltaTime - 델타타임
   */
  update(deltaTime) {
    if (!this._enabled) {
      return;
    }

    // 비활성화되거나 파괴된 엔티티 제거
    this._entities = this._entities.filter((entity) => entity.active && !entity.destroyed && this.#canProcessEntity(entity));

    // 각 엔티티 처리
    for (const entity of this._entities) {
      this.process(entity, deltaTime);
    }
  }

  /**
   * 개별 엔티티 처리 (자식 클래스에서 오버라이드)
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  process(entity, deltaTime) {
    // Override in child classes
  }

  /**
   * 시스템 활성화/비활성화
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this._enabled = enabled;
  }

  /**
   * 모든 엔티티 제거
   */
  clear() {
    this._entities = [];
  }

  // === Getters ===

  get entities() {
    return this._entities;
  }

  get enabled() {
    return this._enabled;
  }

  get entityCount() {
    return this._entities.length;
  }
}
