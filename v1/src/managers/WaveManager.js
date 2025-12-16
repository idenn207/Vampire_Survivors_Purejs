/**
 * 파일위치: /src/managers/WaveManager.js
 * 파일명: WaveManager.js
 * 용도: 웨이브 관리자 (Singleton)
 * 기능: 웨이브 타이머, 자동 전환
 * 책임: 웨이브 진행 관리
 */

import Config from '../data/Config.js';
import eventBus from '../utils/EventBus.js';

class WaveManager {
  constructor() {
    if (WaveManager._instance) {
      return WaveManager._instance;
    }

    this._current_wave = 1;
    this._wave_timer = 0;
    this._wave_duration = Config.WAVE.DURATION;

    WaveManager._instance = this;
  }

  /**
   * 업데이트
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this._wave_timer += deltaTime;

    // 웨이브 시간 초과 시 다음 웨이브로
    if (this._wave_timer >= this._wave_duration) {
      this.#nextWave();
    }
  }

  /**
   * 다음 웨이브로 전환
   */
  #nextWave() {
    this._current_wave++;
    this._wave_timer = 0;

    // 웨이브 변경 이벤트 발생
    eventBus.emit('wave_changed', {
      wave: this._current_wave,
    });

    console.log(`Wave ${this._current_wave} started!`);
  }

  /**
   * 웨이브 리셋
   */
  reset() {
    this._current_wave = 1;
    this._wave_timer = 0;
  }

  /**
   * 현재 웨이브
   */
  get currentWave() {
    return this._current_wave;
  }

  /**
   * 남은 시간
   */
  get remainingTime() {
    return Math.max(0, this._wave_duration - this._wave_timer);
  }

  /**
   * 진행 비율 (0~1)
   */
  get progress() {
    return this._wave_timer / this._wave_duration;
  }
}

// Singleton 인스턴스 export
const waveManager = new WaveManager();
export default waveManager;
