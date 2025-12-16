/**
 * 파일위치: /src/ecs/Entity.js
 * 파일명: Entity.js
 * 용도: ECS 패턴의 Entity 베이스 클래스
 * 기능: 컴포넌트 관리, 고유 ID 부여
 * 책임: 컴포넌트 컨테이너 역할
 */

let _nextEntityId = 1;

export default class Entity {
  constructor(name = 'Entity') {
    this._id = _nextEntityId++;
    this._name = name;
    this._components = new Map(); // 컴포넌트 타입 -> 컴포넌트 인스턴스
    this._active = true;
    this._destroyed = false;
  }

  /**
   * 컴포넌트 추가
   * @param {Component} component - 추가할 컴포넌트
   * @returns {Entity} this (메서드 체이닝)
   */
  addComponent(component) {
    if (this._destroyed) {
      console.warn(`Cannot add component to destroyed entity: ${this._name}`);
      return this;
    }

    const type = component.constructor.name;

    if (this._components.has(type)) {
      console.warn(`Component '${type}' already exists on entity: ${this._name}`);
      return this;
    }

    this._components.set(type, component);
    component.entity = this;

    return this;
  }

  /**
   * 컴포넌트 제거
   * @param {string} componentType - 제거할 컴포넌트 타입 (클래스명)
   * @returns {boolean} 제거 성공 여부
   */
  removeComponent(componentType) {
    if (!this._components.has(componentType)) {
      return false;
    }

    const component = this._components.get(componentType);
    component.entity = null;
    this._components.delete(componentType);

    return true;
  }

  /**
   * 컴포넌트 가져오기
   * @param {string} componentType - 가져올 컴포넌트 타입 (클래스명)
   * @returns {Component|null}
   */
  getComponent(componentType) {
    return this._components.get(componentType) || null;
  }

  /**
   * 컴포넌트 존재 확인
   * @param {string} componentType - 확인할 컴포넌트 타입 (클래스명)
   * @returns {boolean}
   */
  hasComponent(componentType) {
    return this._components.has(componentType);
  }

  /**
   * 여러 컴포넌트 동시 존재 확인
   * @param {...string} componentTypes - 확인할 컴포넌트 타입들
   * @returns {boolean}
   */
  hasComponents(...componentTypes) {
    return componentTypes.every((type) => this.hasComponent(type));
  }

  /**
   * 모든 컴포넌트 가져오기
   * @returns {Array<Component>}
   */
  getAllComponents() {
    return Array.from(this._components.values());
  }

  /**
   * 엔티티 활성화/비활성화
   * @param {boolean} active
   */
  setActive(active) {
    this._active = active;
  }

  /**
   * 엔티티 파괴
   */
  destroy() {
    if (this._destroyed) {
      return;
    }

    // 모든 컴포넌트 제거
    this._components.forEach((component) => {
      component.entity = null;
    });
    this._components.clear();

    this._destroyed = true;
    this._active = false;
  }

  // === Getters ===

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get active() {
    return this._active;
  }

  get destroyed() {
    return this._destroyed;
  }

  get componentCount() {
    return this._components.size;
  }
}
