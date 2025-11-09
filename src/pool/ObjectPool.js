/**
 * 파일위치: /src/pool/ObjectPool.js
 * 파일명: ObjectPool.js
 * 용도: Object Pool 베이스 클래스
 * 기능: 객체 재사용 관리
 * 책임: 메모리 최적화, GC 부담 감소
 */

export default class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this._createFn = createFn; // 객체 생성 함수
    this._resetFn = resetFn; // 객체 초기화 함수
    this._pool = []; // 사용 가능한 객체들
    this._active = new Set(); // 활성 객체들

    // 초기 풀 생성
    for (let i = 0; i < initialSize; i++) {
      this._pool.push(this._createFn());
    }
  }

  /**
   * 객체 가져오기
   * @param {...any} args - 초기화 파라미터
   * @returns {Object}
   */
  get(...args) {
    let obj;

    if (this._pool.length > 0) {
      obj = this._pool.pop();
    } else {
      obj = this._createFn();
    }

    this._resetFn(obj, ...args);
    this._active.add(obj);

    return obj;
  }

  /**
   * 객체 반환
   * @param {Object} obj
   */
  release(obj) {
    if (!this._active.has(obj)) {
      return;
    }

    this._active.delete(obj);
    this._pool.push(obj);
  }

  /**
   * 모든 활성 객체 반환
   */
  releaseAll() {
    this._active.forEach((obj) => {
      this._pool.push(obj);
    });
    this._active.clear();
  }

  /**
   * 활성 객체 수
   */
  get activeCount() {
    return this._active.size;
  }

  /**
   * 사용 가능한 객체 수
   */
  get availableCount() {
    return this._pool.length;
  }

  /**
   * 전체 객체 수
   */
  get totalCount() {
    return this._pool.length + this._active.size;
  }
}
