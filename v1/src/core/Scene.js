/**
 * 파일 위치: src/core/Scene.js
 * 파일명: Scene.js
 * 용도: 씬 베이스 클래스
 * 기능: 씬 생명주기 관리 (초기화, 업데이트, 렌더링, 종료)
 * 책임: 모든 씬의 공통 인터페이스 정의
 */

export default class Scene {
  constructor(name) {
    this.name = name;
    this._is_active = false;
    this._is_initialized = false;
  }

  /**
   * 씬 초기화 (씬 진입 시 한 번 호출)
   * 자식 클래스에서 오버라이드
   */
  init() {
    this._is_initialized = true;
  }

  /**
   * 씬 시작 (씬 전환 시마다 호출)
   * 자식 클래스에서 오버라이드
   */
  start() {
    this._is_active = true;
  }

  /**
   * 씬 업데이트 (게임 루프에서 호출)
   * @param {number} deltaTime - 델타타임
   * 자식 클래스에서 오버라이드
   */
  update(deltaTime) {
    // Override in child classes
  }

  /**
   * 씬 렌더링 (게임 루프에서 호출)
   * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
   * 자식 클래스에서 오버라이드
   */
  render(ctx) {
    // Override in child classes
  }

  /**
   * 씬 종료 (씬 전환 시 호출)
   * 자식 클래스에서 오버라이드
   */
  stop() {
    this._is_active = false;
  }

  /**
   * 씬 정리 (씬 파괴 시 호출)
   * 자식 클래스에서 오버라이드
   */
  destroy() {
    this._is_initialized = false;
    this._is_active = false;
  }

  /**
   * 씬 활성화 여부
   */
  get isActive() {
    return this._is_active;
  }

  /**
   * 씬 초기화 여부
   */
  get isInitialized() {
    return this._is_initialized;
  }
}
