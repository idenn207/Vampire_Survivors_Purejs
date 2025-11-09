/**
 * 파일위치: /src/scenes/GameScene.js
 * 파일명: GameScene.js
 * 용도: 메인 게임 씬
 * 기능: 게임 플레이 로직
 * 책임: 플레이어, 적, 전투 시스템 관리
 */

import input from '../core/Input.js';
import Scene from '../core/Scene.js';
import eventBus from '../utils/EventBus.js';

// ECS
import Entity from '../ecs/Entity.js';
import Collider from '../ecs/components/Collider.js';
import Health from '../ecs/components/Health.js';
import Renderer from '../ecs/components/Renderer.js';
import Rigidbody from '../ecs/components/Rigidbody.js';
import Stats from '../ecs/components/Stats.js';
import Transform from '../ecs/components/Transform.js';

// Systems
import MovementSystem from '../ecs/systems/MovementSystem.js';

export default class GameScene extends Scene {
  constructor() {
    super('GameScene');

    this._entities = [];
    this._systems = [];
    this._player = null;
  }

  /**
   * 씬 초기화
   */
  init() {
    super.init();

    // 플레이어 생성
    this.#createPlayer();

    // 테스트용 적 생성
    this.#createTestEnemy();

    console.log('GameScene initialized');
  }

  /**
   * 플레이어 생성
   */
  #createPlayer() {
    this._player = new Entity('Player');

    // Transform
    const transform = new Transform(640, 360);
    this._player.addComponent(transform);

    // Rigidbody
    const rigidbody = new Rigidbody();
    rigidbody.max_speed = 200;
    rigidbody.friction = 10;
    this._player.addComponent(rigidbody);

    // Renderer
    const renderer = new Renderer('circle', '#00ff00', 32);
    this._player.addComponent(renderer);

    // Health
    const health = new Health(100);
    this._player.addComponent(health);

    // Stats
    const stats = new Stats();
    this._player.addComponent(stats);

    // Collider
    const collider = new Collider('circle', 32, 32, 16);
    this._player.addComponent(collider);

    this._entities.push(this._player);
  }

  /**
   * 테스트용 적 생성
   */
  #createTestEnemy() {
    const enemy = new Entity('TestEnemy');

    // Transform
    const transform = new Transform(400, 200);
    enemy.addComponent(transform);

    // Renderer
    const renderer = new Renderer('circle', '#ff0000', 24);
    enemy.addComponent(renderer);

    this._entities.push(enemy);
  }

  /**
   * 씬 시작
   */
  start() {
    super.start();

    // 시스템 초기화 (씬마다 새로 생성)
    this._systems = [];

    // Movement System
    const movementSystem = new MovementSystem();
    this._entities.forEach((entity) => movementSystem.addEntity(entity));
    this._systems.push(movementSystem);

    console.log('GameScene started');
  }

  /**
   * 씬 업데이트
   * @param {number} deltaTime
   */
  update(deltaTime) {
    // 플레이어 입력 처리
    this.#handlePlayerInput();

    // 시스템 업데이트
    this._systems.forEach((system) => system.update(deltaTime));

    // 디버그 정보 업데이트
    this.#updateDebugInfo();
  }

  /**
   * 플레이어 입력 처리
   */
  #handlePlayerInput() {
    if (!this._player) {
      return;
    }

    const transform = this._player.getComponent('Transform');
    const rigidbody = this._player.getComponent('Rigidbody');
    const stats = this._player.getComponent('Stats');

    // WASD 이동
    const movement = input.getMovementInput();

    if (!movement.isZero()) {
      const force = movement.multiply(stats.move_speed * 10);
      rigidbody.addForce(force);
    }

    // ESC - 일시정지
    if (input.getKeyDown('escape')) {
      eventBus.emit('pause_toggle');
    }

    // P - 성능 모니터링 토글
    if (input.getKeyDown('p')) {
      const debugPanel = document.getElementById('debug-info');
      debugPanel.classList.toggle('active');
    }
  }

  /**
   * 씬 렌더링
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    // 배경 그리기
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 엔티티 렌더링
    this._entities.forEach((entity) => {
      if (!entity.active || entity.destroyed) {
        return;
      }

      const transform = entity.getComponent('Transform');
      const renderer = entity.getComponent('Renderer');

      if (!transform || !renderer || !renderer.visible) {
        return;
      }

      ctx.save();
      ctx.globalAlpha = renderer.alpha;
      ctx.translate(transform.position.x, transform.position.y);
      ctx.rotate(transform.rotation);
      ctx.scale(transform.scale, transform.scale);

      // 도형 그리기
      ctx.fillStyle = renderer.color;
      if (renderer.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, renderer.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // UI 그리기
    this.#renderUI(ctx);
  }

  /**
   * UI 렌더링
   * @param {CanvasRenderingContext2D} ctx
   */
  #renderUI(ctx) {
    if (!this._player) {
      return;
    }

    const stats = this._player.getComponent('Stats');
    const health = this._player.getComponent('Health');

    // 체력바
    const barWidth = 200;
    const barHeight = 20;
    const barX = 20;
    const barY = 20;

    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = '#00ff00';
    ctx.fillRect(barX, barY, barWidth * health.healthRatio, barHeight);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`HP: ${health.current_health}/${health.max_health}`, barX + barWidth / 2, barY + barHeight / 2);

    // 레벨 표시
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`LV ${stats.level}`, barX, barY + barHeight + 25);

    // 조작법 표시
    ctx.fillStyle = '#888';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('WASD: Move', 20, ctx.canvas.height - 60);
    ctx.fillText('ESC: Pause', 20, ctx.canvas.height - 40);
    ctx.fillText('P: Debug Info', 20, ctx.canvas.height - 20);
  }

  /**
   * 디버그 정보 업데이트
   */
  #updateDebugInfo() {
    const debugPanel = document.getElementById('debug-info');

    if (!debugPanel.classList.contains('active')) {
      return;
    }

    const transform = this._player.getComponent('Transform');
    const rigidbody = this._player.getComponent('Rigidbody');

    debugPanel.innerHTML = `
            <div><strong>Player Debug</strong></div>
            <div>Pos: (${transform.position.x.toFixed(1)}, ${transform.position.y.toFixed(1)})</div>
            <div>Vel: (${rigidbody.velocity.x.toFixed(1)}, ${rigidbody.velocity.y.toFixed(1)})</div>
            <div>Speed: ${rigidbody.velocity.magnitude().toFixed(1)}</div>
            <div>Entities: ${this._entities.length}</div>
        `;
  }

  /**
   * 씬 종료
   */
  stop() {
    super.stop();
    console.log('GameScene stopped');
  }

  /**
   * 씬 정리
   */
  destroy() {
    // 모든 엔티티 파괴
    this._entities.forEach((entity) => entity.destroy());
    this._entities = [];

    // 시스템 정리
    this._systems.forEach((system) => system.clear());
    this._systems = [];

    this._player = null;

    super.destroy();
    console.log('GameScene destroyed');
  }
}
