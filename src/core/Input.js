/**
 * 파일 위치: src/core/Input.js
 * 파일명: Input.js
 * 용도: 입력 관리 (Singleton)
 * 기능: 키보드, 마우스 입력 상태 추적
 * 책임: 게임 전체의 입력 처리
 */

import Vector2 from '../utils/Vector2.js';

class Input {
  constructor() {
    if (Input._instance) {
      return Input._instance;
    }

    // 키보드 상태
    this._keys_down = new Set(); // 현재 눌린 키
    this._keys_pressed = new Set(); // 이번 프레임에 눌린 키
    this._keys_released = new Set(); // 이번 프레임에 뗀 키

    // 마우스 상태
    this._mouse_position = new Vector2(0, 0); // 스크린 좌표
    this._mouse_world_position = new Vector2(0, 0); // 월드 좌표
    this._mouse_buttons_down = new Set(); // 현재 눌린 버튼
    this._mouse_buttons_pressed = new Set(); // 이번 프레임에 눌린 버튼
    this._mouse_buttons_released = new Set(); // 이번 프레임에 뗀 버튼
    this._mouse_wheel = 0; // 마우스 휠 델타

    // 캔버스 참조
    this._canvas = null;
    this._camera_offset = new Vector2(0, 0); // 카메라 오프셋

    // 이벤트 리스너 바인딩
    this._handleKeyDown = this.#onKeyDown.bind(this);
    this._handleKeyUp = this.#onKeyUp.bind(this);
    this._handleMouseDown = this.#onMouseDown.bind(this);
    this._handleMouseUp = this.#onMouseUp.bind(this);
    this._handleMouseMove = this.#onMouseMove.bind(this);
    this._handleWheel = this.#onWheel.bind(this);
    this._handleContextMenu = this.#onContextMenu.bind(this);

    Input._instance = this;
  }

  /**
   * 입력 시스템 초기화
   * @param {HTMLCanvasElement} canvas - 게임 캔버스
   */
  initialize(canvas) {
    this._canvas = canvas;
    this.#attachListeners();
  }

  /**
   * 이벤트 리스너 등록
   */
  #attachListeners() {
    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('keyup', this._handleKeyUp);

    this._canvas.addEventListener('mousedown', this._handleMouseDown);
    this._canvas.addEventListener('mouseup', this._handleMouseUp);
    this._canvas.addEventListener('mousemove', this._handleMouseMove);
    this._canvas.addEventListener('wheel', this._handleWheel);
    this._canvas.addEventListener('contextmenu', this._handleContextMenu);
  }

  /**
   * 이벤트 리스너 제거
   */
  destroy() {
    window.removeEventListener('keydown', this._handleKeyDown);
    window.removeEventListener('keyup', this._handleKeyUp);

    if (this._canvas) {
      this._canvas.removeEventListener('mousedown', this._handleMouseDown);
      this._canvas.removeEventListener('mouseup', this._handleMouseUp);
      this._canvas.removeEventListener('mousemove', this._handleMouseMove);
      this._canvas.removeEventListener('wheel', this._handleWheel);
      this._canvas.removeEventListener('contextmenu', this._handleContextMenu);
    }
  }

  /**
   * 프레임 업데이트 (게임 루프에서 호출)
   */
  update() {
    // 이번 프레임 입력 초기화
    this._keys_pressed.clear();
    this._keys_released.clear();
    this._mouse_buttons_pressed.clear();
    this._mouse_buttons_released.clear();
    this._mouse_wheel = 0;
  }

  /**
   * 카메라 오프셋 설정 (월드 좌표 계산용)
   * @param {Vector2} offset - 카메라 오프셋
   */
  setCameraOffset(offset) {
    this._camera_offset.copy(offset);
    this.#updateMouseWorldPosition();
  }

  /**
   * 마우스 월드 좌표 계산
   */
  #updateMouseWorldPosition() {
    this._mouse_world_position.set(this._mouse_position.x + this._camera_offset.x, this._mouse_position.y + this._camera_offset.y);
  }

  // === 키보드 이벤트 핸들러 ===
  #onKeyDown(event) {
    const key = event.key.toLowerCase();

    if (!this._keys_down.has(key)) {
      this._keys_pressed.add(key);
    }

    this._keys_down.add(key);
  }

  #onKeyUp(event) {
    const key = event.key.toLowerCase();
    this._keys_down.delete(key);
    this._keys_released.add(key);
  }

  // === 마우스 이벤트 핸들러 ===
  #onMouseDown(event) {
    const button = event.button;

    if (!this._mouse_buttons_down.has(button)) {
      this._mouse_buttons_pressed.add(button);
    }

    this._mouse_buttons_down.add(button);
  }

  #onMouseUp(event) {
    const button = event.button;
    this._mouse_buttons_down.delete(button);
    this._mouse_buttons_released.add(button);
  }

  #onMouseMove(event) {
    const rect = this._canvas.getBoundingClientRect();
    this._mouse_position.set(event.clientX - rect.left, event.clientY - rect.top);
    this.#updateMouseWorldPosition();
  }

  #onWheel(event) {
    event.preventDefault();
    this._mouse_wheel = Math.sign(event.deltaY);
  }

  #onContextMenu(event) {
    event.preventDefault(); // 우클릭 메뉴 방지
  }

  // === 키보드 입력 확인 ===

  /**
   * 키가 현재 눌려있는지
   * @param {string} key - 키 이름
   */
  getKey(key) {
    return this._keys_down.has(key.toLowerCase());
  }

  /**
   * 키가 이번 프레임에 눌렸는지
   * @param {string} key - 키 이름
   */
  getKeyDown(key) {
    return this._keys_pressed.has(key.toLowerCase());
  }

  /**
   * 키가 이번 프레임에 떼어졌는지
   * @param {string} key - 키 이름
   */
  getKeyUp(key) {
    return this._keys_released.has(key.toLowerCase());
  }

  // === 마우스 입력 확인 ===

  /**
   * 마우스 버튼이 현재 눌려있는지
   * @param {number} button - 버튼 번호 (0: 좌클릭, 1: 휠클릭, 2: 우클릭)
   */
  getMouseButton(button) {
    return this._mouse_buttons_down.has(button);
  }

  /**
   * 마우스 버튼이 이번 프레임에 눌렸는지
   * @param {number} button - 버튼 번호
   */
  getMouseButtonDown(button) {
    return this._mouse_buttons_pressed.has(button);
  }

  /**
   * 마우스 버튼이 이번 프레임에 떼어졌는지
   * @param {number} button - 버튼 번호
   */
  getMouseButtonUp(button) {
    return this._mouse_buttons_released.has(button);
  }

  // === Getters ===

  get mousePosition() {
    return this._mouse_position.clone();
  }

  get mouseWorldPosition() {
    return this._mouse_world_position.clone();
  }

  get mouseWheel() {
    return this._mouse_wheel;
  }

  // === 편의 메서드 ===

  // WASD 이동 입력
  getMovementInput() {
    const movement = new Vector2(0, 0);

    if (this.getKey('w')) movement.y -= 1;
    if (this.getKey('s')) movement.y += 1;
    if (this.getKey('a')) movement.x -= 1;
    if (this.getKey('d')) movement.x += 1;

    // 정규화 (대각선 이동 속도 보정)
    if (!movement.isZero()) {
      movement.normalize();
    }

    return movement;
  }

  // 화살표 키 이동 입력
  getArrowInput() {
    const movement = new Vector2(0, 0);

    if (this.getKey('arrowup')) movement.y -= 1;
    if (this.getKey('arrowdown')) movement.y += 1;
    if (this.getKey('arrowleft')) movement.x -= 1;
    if (this.getKey('arrowright')) movement.x += 1;

    if (!movement.isZero()) {
      movement.normalize();
    }

    return movement;
  }
}

// Singleton 인스턴스 export
const input = new Input();
export default input;
