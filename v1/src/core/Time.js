/**
 * 파일 위치: src/core/Time.js
 * 파일명: Time.js
 * 용도: 시간 관리 (Singleton)
 * 기능: deltaTime, 타임스케일, FPS 계산
 * 책임: 게임 전체의 시간 흐름 제어
 */

class Time {
  constructor() {
    if (Time._instance) {
      return Time._instance;
    }

    // 시간 관련
    this._delta_time = 0; // 이전 프레임과의 시간 차이 (초)
    this._time_scale = 1.0; // 시간 배율 (슬로우 모션, 일시정지 등)
    this._elapsed_time = 0; // 게임 시작 후 경과 시간 (초)

    // FPS 관련
    this._last_frame_time = 0;
    this._fps = 60;
    this._frame_count = 0;
    this._fps_update_interval = 0.5; // FPS 갱신 주기 (초)
    this._fps_accumulator = 0;
    this._fps_frame_count = 0;

    // 성능 관련
    this._target_fps = 60;
    this._max_delta_time = 0.1; // 델타타임 상한 (렉 방지)

    Time._instance = this;
  }

  /**
   * 프레임 업데이트 (게임 루프에서 호출)
   * @param {number} timestamp - requestAnimationFrame에서 받은 타임스탬프
   */
  update(timestamp) {
    // 첫 프레임 초기화
    if (this._last_frame_time === 0) {
      this._last_frame_time = timestamp;
      return;
    }

    // 델타타임 계산 (밀리초 -> 초)
    let rawDelta = (timestamp - this._last_frame_time) / 1000;

    // 델타타임 제한 (렉 발생 시 물리 시뮬레이션 폭발 방지)
    rawDelta = Math.min(rawDelta, this._max_delta_time);

    // 타임스케일 적용
    this._delta_time = rawDelta * this._time_scale;

    // 경과 시간 누적
    this._elapsed_time += this._delta_time;

    // 프레임 카운트
    this._frame_count++;

    // FPS 계산
    this.#updateFPS(rawDelta);

    // 타임스탬프 저장
    this._last_frame_time = timestamp;
  }

  /**
   * FPS 계산 (내부 메서드)
   * @param {number} rawDelta - 실제 델타타임 (타임스케일 미적용)
   */
  #updateFPS(rawDelta) {
    this._fps_accumulator += rawDelta;
    this._fps_frame_count++;

    // 일정 주기마다 FPS 갱신
    if (this._fps_accumulator >= this._fps_update_interval) {
      this._fps = Math.round(this._fps_frame_count / this._fps_accumulator);
      this._fps_accumulator = 0;
      this._fps_frame_count = 0;
    }
  }

  /**
   * 타임스케일 설정 (0 = 일시정지, 0.5 = 슬로우 모션, 2 = 빠르게)
   * @param {number} scale - 시간 배율
   */
  setTimeScale(scale) {
    this._time_scale = Math.max(0, scale);
  }

  /**
   * 게임 일시정지
   */
  pause() {
    this.setTimeScale(0);
  }

  /**
   * 게임 재개
   */
  resume() {
    this.setTimeScale(1);
  }

  /**
   * 시간 초기화 (씬 전환 시 사용)
   */
  reset() {
    this._elapsed_time = 0;
    this._frame_count = 0;
    this._fps_accumulator = 0;
    this._fps_frame_count = 0;
  }

  // Getters
  get deltaTime() {
    return this._delta_time;
  }

  get unscaledDeltaTime() {
    return this._delta_time / this._time_scale;
  }

  get timeScale() {
    return this._time_scale;
  }

  get elapsedTime() {
    return this._elapsed_time;
  }

  get fps() {
    return this._fps;
  }

  get frameCount() {
    return this._frame_count;
  }

  get isPaused() {
    return this._time_scale === 0;
  }
}

// Singleton 인스턴스 export
const time = new Time();
export default time;
