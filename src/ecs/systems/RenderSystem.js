/**
 * 파일위치: /src/ecs/systems/RenderSystem.js
 * 파일명: RenderSystem.js
 * 용도: Render System
 * 기능: 엔티티 렌더링 처리
 * 책임: Transform과 Renderer를 이용한 화면 출력
 */

import System from '../System.js';

export default class RenderSystem extends System {
  constructor(ctx, camera = null) {
    super();
    this._required_components = ['Transform', 'Renderer'];
    this._ctx = ctx;
    this._camera = camera; // CameraManager
  }

  /**
   * 카메라 설정
   * @param {CameraManager} camera
   */
  setCamera(camera) {
    this._camera = camera;
  }

  /**
   * 모든 엔티티 렌더링
   * @param {number} deltaTime
   */
  update(deltaTime) {
    if (!this._enabled) {
      return;
    }

    // z_index 기준으로 정렬
    const sortedEntities = this._entities
      .filter((entity) => entity.active && !entity.destroyed)
      .sort((a, b) => {
        const rendererA = a.getComponent('Renderer');
        const rendererB = b.getComponent('Renderer');
        return rendererA.z_index - rendererB.z_index;
      });

    // 렌더링
    for (const entity of sortedEntities) {
      this.process(entity, deltaTime);
    }
  }

  /**
   * 개별 엔티티 렌더링
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  process(entity, deltaTime) {
    const transform = entity.getComponent('Transform');
    const renderer = entity.getComponent('Renderer');

    if (!renderer.visible) {
      return;
    }

    const ctx = this._ctx;

    // 카메라 오프셋 적용
    let screenX = transform.position.x;
    let screenY = transform.position.y;

    if (this._camera) {
      screenX -= this._camera.offset.x;
      screenY -= this._camera.offset.y;
    }

    ctx.save();

    // 투명도 설정
    ctx.globalAlpha = renderer.alpha;

    // 변환 행렬 적용
    ctx.translate(screenX, screenY);
    ctx.rotate(transform.rotation);
    ctx.scale(transform.scale, transform.scale);

    // 도형 그리기
    this.#renderShape(ctx, renderer);

    ctx.restore();
  }

  /**
   * 도형 렌더링
   * @param {CanvasRenderingContext2D} ctx
   * @param {Renderer} renderer
   */
  #renderShape(ctx, renderer) {
    ctx.fillStyle = renderer.color;

    switch (renderer.shape) {
      case 'circle':
        this.#renderCircle(ctx, renderer);
        break;
      case 'rect':
        this.#renderRect(ctx, renderer);
        break;
      case 'triangle':
        this.#renderTriangle(ctx, renderer);
        break;
      default:
        this.#renderCircle(ctx, renderer);
    }
  }

  /**
   * 원 렌더링
   */
  #renderCircle(ctx, renderer) {
    const radius = renderer.size / 2;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    if (renderer.stroke_width > 0 && renderer.stroke_color) {
      ctx.strokeStyle = renderer.stroke_color;
      ctx.lineWidth = renderer.stroke_width;
      ctx.stroke();
    }
  }

  /**
   * 사각형 렌더링
   */
  #renderRect(ctx, renderer) {
    const halfWidth = renderer.width / 2;
    const halfHeight = renderer.height / 2;

    ctx.fillRect(-halfWidth, -halfHeight, renderer.width, renderer.height);

    if (renderer.stroke_width > 0 && renderer.stroke_color) {
      ctx.strokeStyle = renderer.stroke_color;
      ctx.lineWidth = renderer.stroke_width;
      ctx.strokeRect(-halfWidth, -halfHeight, renderer.width, renderer.height);
    }
  }

  /**
   * 삼각형 렌더링
   */
  #renderTriangle(ctx, renderer) {
    const halfSize = renderer.size / 2;

    ctx.beginPath();
    ctx.moveTo(halfSize, 0);
    ctx.lineTo(-halfSize, halfSize);
    ctx.lineTo(-halfSize, -halfSize);
    ctx.closePath();
    ctx.fill();

    if (renderer.stroke_width > 0 && renderer.stroke_color) {
      ctx.strokeStyle = renderer.stroke_color;
      ctx.lineWidth = renderer.stroke_width;
      ctx.stroke();
    }
  }
}
