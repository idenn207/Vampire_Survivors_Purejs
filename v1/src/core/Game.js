/**
 * 파일위치: /src/core/Game.js
 * 파일명: Game.js
 * 용도: 게임 메인 루프 및 씬 관리 (Singleton)
 * 기능: requestAnimationFrame 기반 게임 루프, 씬 전환, 시스템 초기화
 * 책임: 게임 전체 생명주기 제어
 */

import eventBus from '../utils/EventBus.js';
import input from './Input.js';
import time from './Time.js';

class Game {
  constructor() {
    if (Game._instance) {
      return Game._instance;
    }

    // 캔버스 및 컨텍스트
    this._canvas = null;
    this._ctx = null;

    // 씬 관리
    this._scenes = new Map(); // 씬 이름 -> 씬 객체
    this._current_scene = null;
    this._next_scene_name = null;

    // 게임 상태
    this._is_running = false;
    this._is_paused = false;
    this._frame_id = null;

    // 성능 모니터링
    this._performance_mode = false;

    Game._instance = this;
  }

  /**
   * 게임 초기화
   * @param {HTMLCanvasElement} canvas - 게임 캔버스
   * @param {Object} config - 게임 설정
   */
  initialize(canvas, config = {}) {
    if (!canvas) {
      throw new Error('Canvas element is required');
    }

    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');

    // 캔버스 크기 설정
    this._canvas.width = config.width || 1280;
    this._canvas.height = config.height || 720;

    // 입력 시스템 초기화
    input.initialize(this._canvas);

    // 이벤트 리스너 등록
    this.#attachEventListeners();

    console.log(`Game initialized: ${this._canvas.width}x${this._canvas.height}`);
  }

  /**
   * 게임 이벤트 리스너 등록
   */
  #attachEventListeners() {
    // ESC 키로 일시정지 토글
    eventBus.on('pause_toggle', this.togglePause, this);

    // 씬 전환 이벤트
    eventBus.on('scene_change', this.changeScene, this);
  }

  /**
   * 씬 등록
   * @param {string} name - 씬 이름
   * @param {Scene} scene - 씬 객체
   */
  addScene(name, scene) {
    if (this._scenes.has(name)) {
      console.warn(`Scene '${name}' already exists. Overwriting.`);
    }
    this._scenes.set(name, scene);
  }

  /**
   * 씬 제거
   * @param {string} name - 씬 이름
   */
  removeScene(name) {
    if (!this._scenes.has(name)) {
      console.warn(`Scene '${name}' does not exist.`);
      return;
    }

    const scene = this._scenes.get(name);
    if (scene === this._current_scene) {
      console.error(`Cannot remove active scene '${name}'`);
      return;
    }

    scene.destroy();
    this._scenes.delete(name);
  }

  /**
   * 씬 전환
   * @param {string} sceneName - 전환할 씬 이름
   */
  changeScene(sceneName) {
    if (!this._scenes.has(sceneName)) {
      console.error(`Scene '${sceneName}' not found`);
      return;
    }

    // 다음 프레임에 씬 전환 예약
    this._next_scene_name = sceneName;
  }

  /**
   * 실제 씬 전환 처리
   */
  #performSceneChange() {
    if (!this._next_scene_name) {
      return;
    }

    const nextScene = this._scenes.get(this._next_scene_name);

    // 현재 씬 정리
    if (this._current_scene) {
      this._current_scene.stop();
      eventBus.emit('scene_stopped', this._current_scene.name);
    }

    // 새 씬 활성화
    this._current_scene = nextScene;

    if (!this._current_scene.isInitialized) {
      this._current_scene.init();
    }

    this._current_scene.start();

    eventBus.emit('scene_started', this._current_scene.name);

    this._next_scene_name = null;

    console.log(`Scene changed to: ${this._current_scene.name}`);
  }

  /**
   * 게임 시작
   * @param {string} initialSceneName - 시작 씬 이름
   */
  start(initialSceneName) {
    if (this._is_running) {
      console.warn('Game is already running');
      return;
    }

    if (!this._scenes.has(initialSceneName)) {
      throw new Error(`Initial scene '${initialSceneName}' not found`);
    }

    this._is_running = true;
    this.changeScene(initialSceneName);

    // 게임 루프 시작
    this._frame_id = requestAnimationFrame(this.#gameLoop.bind(this));

    eventBus.emit('game_start');
    console.log('Game started');
  }

  /**
   * 게임 메인 루프
   * @param {number} timestamp - 현재 타임스탬프
   */
  #gameLoop(timestamp) {
    if (!this._is_running) {
      return;
    }

    // 다음 프레임 예약
    this._frame_id = requestAnimationFrame(this.#gameLoop.bind(this));

    // 씬 전환 처리
    this.#performSceneChange();

    // 시간 업데이트
    time.update(timestamp);

    // 일시정지 상태 확인
    if (this._is_paused || time.isPaused) {
      // 일시정지 중 ESC 키로 재개
      if (input.getKeyDown('escape')) {
        this.togglePause();
      }

      this.#renderPauseOverlay();

      // 일시정지 중에도 입력 업데이트
      input.update();
      return;
    }

    // 현재 씬 업데이트
    if (this._current_scene && this._current_scene.isActive) {
      this._current_scene.update(time.deltaTime);
    }

    // 렌더링
    this.#render();

    // 이벤트 큐 처리
    eventBus.flush();

    // === 입력 업데이트를 마지막에 호출 (프레임 끝) ===
    input.update();

    // 성능 모니터링
    if (this._performance_mode) {
      this.#renderPerformanceStats();
    }
  }

  /**
   * 렌더링
   */
  #render() {
    // 화면 클리어
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // 현재 씬 렌더링
    if (this._current_scene && this._current_scene.isActive) {
      this._current_scene.render(this._ctx);
    }
  }

  /**
   * 일시정지 오버레이 렌더링
   */
  #renderPauseOverlay() {
    this._ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this._ctx.fillStyle = '#ffffff';
    this._ctx.font = 'bold 48px Arial';
    this._ctx.textAlign = 'center';
    this._ctx.textBaseline = 'middle';
    this._ctx.fillText('PAUSED', this._canvas.width / 2, this._canvas.height / 2);

    this._ctx.font = '24px Arial';
    this._ctx.fillText('Press ESC to resume', this._canvas.width / 2, this._canvas.height / 2 + 50);
  }

  /**
   * 성능 통계 렌더링
   */
  #renderPerformanceStats() {
    this._ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this._ctx.fillRect(10, 10, 200, 80);

    this._ctx.fillStyle = '#00ff00';
    this._ctx.font = '16px monospace';
    this._ctx.textAlign = 'left';
    this._ctx.textBaseline = 'top';

    const fps = time.fps;
    const frameTime = (time.unscaledDeltaTime * 1000).toFixed(2);
    const elapsedTime = time.elapsedTime.toFixed(2);

    this._ctx.fillText(`FPS: ${fps}`, 20, 20);
    this._ctx.fillText(`Frame: ${frameTime}ms`, 20, 40);
    this._ctx.fillText(`Time: ${elapsedTime}s`, 20, 60);
  }

  /**
   * 일시정지 토글
   */
  togglePause() {
    this._is_paused = !this._is_paused;

    if (this._is_paused) {
      time.pause();
      eventBus.emit('game_paused');
    } else {
      time.resume();
      eventBus.emit('game_resumed');
    }
  }

  /**
   * 일시정지
   */
  pause() {
    if (!this._is_paused) {
      this.togglePause();
    }
  }

  /**
   * 재개
   */
  resume() {
    if (this._is_paused) {
      this.togglePause();
    }
  }

  /**
   * 게임 정지
   */
  stop() {
    if (!this._is_running) {
      return;
    }

    this._is_running = false;

    if (this._frame_id) {
      cancelAnimationFrame(this._frame_id);
      this._frame_id = null;
    }

    if (this._current_scene) {
      this._current_scene.stop();
    }

    eventBus.emit('game_stop');
    console.log('Game stopped');
  }

  /**
   * 게임 재시작
   */
  restart() {
    this.stop();
    time.reset();

    if (this._current_scene) {
      const sceneName = this._current_scene.name;
      this._current_scene.destroy();
      this._current_scene.init();
      this.start(sceneName);
    }
  }

  /**
   * 게임 정리
   */
  destroy() {
    this.stop();

    // 모든 씬 정리
    this._scenes.forEach((scene) => scene.destroy());
    this._scenes.clear();

    // 입력 시스템 정리
    input.destroy();

    // 이벤트 리스너 제거
    eventBus.clear();

    this._current_scene = null;
    this._canvas = null;
    this._ctx = null;

    console.log('Game destroyed');
  }

  /**
   * 성능 모니터링 토글
   */
  togglePerformanceMode() {
    this._performance_mode = !this._performance_mode;
  }

  // === Getters ===

  get canvas() {
    return this._canvas;
  }

  get ctx() {
    return this._ctx;
  }

  get currentScene() {
    return this._current_scene;
  }

  get isRunning() {
    return this._is_running;
  }

  get isPaused() {
    return this._is_paused;
  }
}

// Singleton 인스턴스 export
const game = new Game();
export default game;
