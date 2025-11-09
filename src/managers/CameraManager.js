/**
 * 파일위치: /src/managers/CameraManager.js
 * 파일명: CameraManager.js
 * 용도: 카메라 관리자 (Singleton)
 * 기능: 카메라 이동, 플레이어 추적
 * 책임: 화면 오프셋 관리
 */

import Vector2 from '../utils/Vector2.js';

class CameraManager {
  constructor(canvasWidth, canvasHeight) {
    if (CameraManager._instance) {
      return CameraManager._instance;
    }

    this._canvas_width = canvasWidth;
    this._canvas_height = canvasHeight;

    this.offset = new Vector2(0, 0); // 카메라 오프셋
    this._target = null; // 추적 타겟

    // 카메라 설정
    this._lerp_speed = 5; // 부드러운 이동 속도
    this._dead_zone = 50; // 데드존 (타겟이 이 범위 내에서는 카메라 이동 안함)

    CameraManager._instance = this;
  }

  /**
   * 추적 타겟 설정
   * @param {Entity} target
   */
  setTarget(target) {
    this._target = target;
  }

  /**
   * 카메라 업데이트
   * @param {number} deltaTime
   */
  update(deltaTime) {
    if (!this._target) {
      return;
    }

    const transform = this._target.getComponent('Transform');
    if (!transform) {
      return;
    }

    // 타겟 위치를 화면 중앙으로
    const targetX = transform.position.x - this._canvas_width / 2;
    const targetY = transform.position.y - this._canvas_height / 2;

    // 부드러운 카메라 이동 (Lerp)
    this.offset.x += (targetX - this.offset.x) * this._lerp_speed * deltaTime;
    this.offset.y += (targetY - this.offset.y) * this._lerp_speed * deltaTime;
  }

  /**
   * 월드 좌표를 스크린 좌표로 변환
   * @param {Vector2} worldPos
   * @returns {Vector2}
   */
  worldToScreen(worldPos) {
    return new Vector2(worldPos.x - this.offset.x, worldPos.y - this.offset.y);
  }

  /**
   * 스크린 좌표를 월드 좌표로 변환
   * @param {Vector2} screenPos
   * @returns {Vector2}
   */
  screenToWorld(screenPos) {
    return new Vector2(screenPos.x + this.offset.x, screenPos.y + this.offset.y);
  }

  /**
   * 카메라 리셋
   */
  reset() {
    this.offset.set(0, 0);
  }
}

// Singleton 인스턴스 export
let cameraManager = null;

export function createCameraManager(canvasWidth, canvasHeight) {
  cameraManager = new CameraManager(canvasWidth, canvasHeight);
  return cameraManager;
}

export default function getCameraManager() {
  return cameraManager;
}
