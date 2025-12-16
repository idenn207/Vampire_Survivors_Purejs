/**
 * 파일 위치: src/utils/EventBus.js
 * 파일명: EventBus.js
 * 용도: 전역 이벤트 시스템 (Observer Pattern)
 * 기능: 이벤트 발행/구독, 이벤트 큐 관리
 * 책임: 게임 내 모든 시스템 간 느슨한 결합 통신
 */

class EventBus {
  constructor() {
    if (EventBus._instance) {
      return EventBus._instance;
    }

    this._listeners = new Map(); // 이벤트명 -> 리스너 배열
    this._eventQueue = []; // 지연 이벤트 큐

    EventBus._instance = this;
  }

  /**
   * 이벤트 구독
   * @param {string} event - 이벤트명
   * @param {Function} callback - 콜백 함수
   * @param {Object} context - this 바인딩 컨텍스트
   * @returns {Function} 구독 해제 함수
   */
  on(event, callback, context = null) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }

    const listener = { callback, context };
    this._listeners.get(event).push(listener);

    // 구독 해제 함수 반환
    return () => this.off(event, callback, context);
  }

  /**
   * 일회성 이벤트 구독
   * @param {string} event - 이벤트명
   * @param {Function} callback - 콜백 함수
   * @param {Object} context - this 바인딩 컨텍스트
   * @returns {Function} 구독 해제 함수
   */
  once(event, callback, context = null) {
    const wrappedCallback = (...args) => {
      callback.apply(context, args);
      this.off(event, wrappedCallback, context);
    };

    return this.on(event, wrappedCallback, context);
  }

  /**
   * 이벤트 구독 해제
   * @param {string} event - 이벤트명
   * @param {Function} callback - 콜백 함수
   * @param {Object} context - this 바인딩 컨텍스트
   */
  off(event, callback, context = null) {
    if (!this._listeners.has(event)) {
      return;
    }

    const listeners = this._listeners.get(event);
    const index = listeners.findIndex((listener) => listener.callback === callback && listener.context === context);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    // 리스너가 없으면 이벤트 삭제
    if (listeners.length === 0) {
      this._listeners.delete(event);
    }
  }

  /**
   * 특정 이벤트의 모든 리스너 제거
   * @param {string} event - 이벤트명
   */
  offAll(event) {
    this._listeners.delete(event);
  }

  /**
   * 모든 이벤트 리스너 제거
   */
  clear() {
    this._listeners.clear();
    this._eventQueue = [];
  }

  /**
   * 즉시 이벤트 발행
   * @param {string} event - 이벤트명
   * @param {...any} args - 이벤트 데이터
   */
  emit(event, ...args) {
    if (!this._listeners.has(event)) {
      return;
    }

    const listeners = this._listeners.get(event).slice(); // 복사본 사용

    listeners.forEach(({ callback, context }) => {
      try {
        callback.apply(context, args);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    });
  }

  /**
   * 지연 이벤트 발행 (다음 프레임에 처리)
   * @param {string} event - 이벤트명
   * @param {...any} args - 이벤트 데이터
   */
  emitDeferred(event, ...args) {
    this._eventQueue.push({ event, args });
  }

  /**
   * 큐에 쌓인 이벤트 일괄 처리
   * 게임 루프의 끝에서 호출
   */
  flush() {
    while (this._eventQueue.length > 0) {
      const { event, args } = this._eventQueue.shift();
      this.emit(event, ...args);
    }
  }

  /**
   * 특정 이벤트에 리스너가 있는지 확인
   * @param {string} event - 이벤트명
   * @returns {boolean}
   */
  hasListeners(event) {
    return this._listeners.has(event) && this._listeners.get(event).length > 0;
  }

  /**
   * 디버깅: 현재 등록된 이벤트 목록 출력
   */
  debug() {
    console.log('=== EventBus Debug ===');
    console.log(`Total events: ${this._listeners.size}`);
    console.log(`Queued events: ${this._eventQueue.length}`);

    this._listeners.forEach((listeners, event) => {
      console.log(`  ${event}: ${listeners.length} listener(s)`);
    });
  }
}

// Singleton 인스턴스 export
const eventBus = new EventBus();
export default eventBus;
