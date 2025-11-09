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
import Weapon from '../ecs/components/Weapon.js';

// Systems
import AISystem from '../ecs/systems/AISystem.js';
import CollisionSystem from '../ecs/systems/CollisionSystem.js';
import CombatSystem from '../ecs/systems/CombatSystem.js';
import ExperienceSystem from '../ecs/systems/ExperienceSystem.js';
import MovementSystem from '../ecs/systems/MovementSystem.js';
import WeaponSystem from '../ecs/systems/WeaponSystem.js';

// Managers
import spawnManager from '../managers/SpawnManager.js';

// Data
import Config from '../data/Config.js';
import WeaponData from '../data/WeaponData.js';

export default class GameScene extends Scene {
  constructor() {
    super('GameScene');

    this._entities = [];
    this._systems = [];
    this._player = null;
    this._projectiles = [];
  }

  /**
   * 씬 초기화
   */
  init() {
    super.init();

    // 플레이어 생성
    this.#createPlayer();

    // SpawnManager 초기화
    spawnManager.setPlayer(this._player);
    spawnManager.setWave(1);

    // 이벤트 구독
    eventBus.on('player_leveled_up', this.#handlePlayerLevelUp, this);

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
    rigidbody.max_speed = Config.PLAYER.MOVE_SPEED;
    rigidbody.friction = 10;
    this._player.addComponent(rigidbody);

    // Renderer
    const renderer = new Renderer('circle', '#00ff00', Config.PLAYER.SIZE);
    this._player.addComponent(renderer);

    // Health
    const health = new Health(Config.PLAYER.MAX_HEALTH);
    this._player.addComponent(health);

    // Stats
    const stats = new Stats();
    stats.move_speed = Config.PLAYER.MOVE_SPEED;
    stats.attack_power = Config.PLAYER.ATTACK_POWER;
    stats.magnet_range = Config.PLAYER.MAGNET_RANGE;
    this._player.addComponent(stats);

    // Collider
    const collider = new Collider('circle', 32, 32, 16);
    collider.setLayer(0); // PLAYER 레이어
    this._player.addComponent(collider);

    // 초기 무기 추가 (마법 미사일)
    const weaponData = WeaponData.magic_missile;
    const weapon = new Weapon(weaponData);
    this._player.addComponent(weapon);

    this._entities.push(this._player);
  }

  /**
   * 레벨업 처리
   * @param {Object} data
   */
  #handlePlayerLevelUp(data) {
    const { player, level } = data;
    console.log(`Player leveled up to ${level}!`);

    // 일시정지하고 레벨업 UI 표시 (추후 구현)
  }

  /**
   * 씬 시작
   */
  start() {
    super.start();

    // 시스템 초기화
    this._systems = [];

    // Movement System
    const movementSystem = new MovementSystem();
    this._entities.forEach((entity) => movementSystem.addEntity(entity));
    this._systems.push(movementSystem);

    // AI System
    const aiSystem = new AISystem(this._player);
    this._systems.push(aiSystem);

    // Collision System
    const collisionSystem = new CollisionSystem();
    this._systems.push(collisionSystem);

    // Combat System
    const combatSystem = new CombatSystem();
    this._systems.push(combatSystem);

    // Weapon System
    const weaponSystem = new WeaponSystem(this._player, []);
    this._systems.push(weaponSystem);

    // Experience System
    const experienceSystem = new ExperienceSystem(this._player, []);
    this._systems.push(experienceSystem);

    console.log('GameScene started');
  }

  /**
   * 씬 업데이트
   * @param {number} deltaTime
   */
  update(deltaTime) {
    // 플레이어 입력 처리
    this.#handlePlayerInput();

    // SpawnManager 업데이트
    spawnManager.update(deltaTime);

    // 적과 드랍 아이템을 각 시스템에 등록
    this.#updateSystemEntities();

    // 투사체 풀의 활성 투사체 처리
    this.#updateProjectiles(deltaTime);

    // 시스템 업데이트
    this._systems.forEach((system) => system.update(deltaTime));

    // 디버그 정보 업데이트
    this.#updateDebugInfo();
  }

  /**
   * 시스템 엔티티 업데이트
   */
  #updateSystemEntities() {
    const enemies = spawnManager.enemies;
    const dropItems = spawnManager.dropItems;

    // MovementSystem 엔티티 업데이트
    const movementSystem = this._systems[0];
    enemies.forEach((enemy) => {
      if (!movementSystem.entities.includes(enemy)) {
        movementSystem.addEntity(enemy);
      }
    });
    dropItems.forEach((item) => {
      if (!movementSystem.entities.includes(item)) {
        movementSystem.addEntity(item);
      }
    });
    this._projectiles.forEach((proj) => {
      if (!movementSystem.entities.includes(proj)) {
        movementSystem.addEntity(proj);
      }
    });

    // AISystem 엔티티 업데이트
    const aiSystem = this._systems[1];
    enemies.forEach((enemy) => {
      if (!aiSystem.entities.includes(enemy)) {
        aiSystem.addEntity(enemy);
      }
    });

    // CollisionSystem 엔티티 업데이트
    const collisionSystem = this._systems[2];
    const allEntities = [this._player, ...enemies, ...this._projectiles, ...dropItems];
    collisionSystem._entities = allEntities.filter((e) => e && e.active && !e.destroyed);

    // WeaponSystem 적 목록 업데이트
    const weaponSystem = this._systems[4];
    weaponSystem.setEnemies(enemies);

    // ExperienceSystem 드랍 아이템 목록 업데이트
    const experienceSystem = this._systems[5];
    experienceSystem.setDropItems(dropItems);
  }

  /**
   * 투사체 업데이트
   * @param {number} deltaTime
   */
  #updateProjectiles(deltaTime) {
    // projectilePool의 활성 투사체를 _projectiles에 동기화
    // (간단한 구현을 위해 매 프레임 재구성)
    this._projectiles = [];

    // projectilePool의 _pool._active에서 투사체 가져오기
    // 실제로는 projectilePool에 getActive() 메서드 추가 필요
    // 여기서는 임시로 비워둠
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

    // 모든 엔티티 렌더링
    const allEntities = [this._player, ...spawnManager.enemies, ...this._projectiles, ...spawnManager.dropItems].filter((e) => e && e.active && !e.destroyed);

    allEntities.forEach((entity) => {
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

    // 경험치바
    const expBarY = barY + barHeight + 10;

    ctx.fillStyle = '#222';
    ctx.fillRect(barX, expBarY, barWidth, 15);

    ctx.fillStyle = '#00ffff';
    ctx.fillRect(barX, expBarY, barWidth * stats.expRatio, 15);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, expBarY, barWidth, 15);

    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(`EXP: ${stats.exp}/${stats.exp_to_next}`, barX + barWidth / 2, expBarY + 7.5);

    // 레벨 표시
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`LV ${stats.level}`, barX, expBarY + 30);

    // 골드 표시
    ctx.fillText(`Gold: ${stats.gold}`, barX, expBarY + 50);

    // Wave 표시
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Wave ${spawnManager.currentWave}`, ctx.canvas.width - 20, 30);

    // 적 수 표시
    ctx.font = '14px Arial';
    ctx.fillText(`Enemies: ${spawnManager.enemies.length}`, ctx.canvas.width - 20, 55);

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
    const stats = this._player.getComponent('Stats');

    debugPanel.innerHTML = `
            <div><strong>Player Debug</strong></div>
            <div>Pos: (${transform.position.x.toFixed(1)}, ${transform.position.y.toFixed(1)})</div>
            <div>Vel: (${rigidbody.velocity.x.toFixed(1)}, ${rigidbody.velocity.y.toFixed(1)})</div>
            <div>Speed: ${rigidbody.velocity.magnitude().toFixed(1)}</div>
            <div>Level: ${stats.level} | Exp: ${stats.exp}/${stats.exp_to_next}</div>
            <div>Gold: ${stats.gold}</div>
            <div><strong>Game Info</strong></div>
            <div>Wave: ${spawnManager.currentWave}</div>
            <div>Enemies: ${spawnManager.enemies.length}</div>
            <div>Drop Items: ${spawnManager.dropItems.length}</div>
            <div>Projectiles: ${this._projectiles.length}</div>
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
    // 이벤트 구독 해제
    eventBus.off('player_leveled_up', this.#handlePlayerLevelUp, this);

    // SpawnManager 정리
    spawnManager.clear();

    // 모든 엔티티 파괴
    this._entities.forEach((entity) => entity.destroy());
    this._entities = [];

    // 시스템 정리
    this._systems.forEach((system) => {
      if (system.destroy) {
        system.destroy();
      }
      system.clear();
    });
    this._systems = [];

    this._player = null;
    this._projectiles = [];

    super.destroy();
    console.log('GameScene destroyed');
  }
}
