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
import WeaponSlot from '../ecs/components/WeaponSlot.js';

// Systems
import AISystem from '../ecs/systems/AISystem.js';
import CollisionSystem from '../ecs/systems/CollisionSystem.js';
import CombatSystem from '../ecs/systems/CombatSystem.js';
import ExperienceSystem from '../ecs/systems/ExperienceSystem.js';
import MovementSystem from '../ecs/systems/MovementSystem.js';
import ProjectileSystem from '../ecs/systems/ProjectileSystem.js';
import WeaponSystem from '../ecs/systems/WeaponSystem.js';

// Managers
import { createCameraManager } from '../managers/CameraManager.js';
import spawnManager from '../managers/SpawnManager.js';
import waveManager from '../managers/WaveManager.js';
import projectilePool from '../pool/ProjectilePool.js';

// UI
import GameOverUI from '../ui/GameOverUI.js';
import LevelUpUI from '../ui/LevelUpUI.js';

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
    this._camera = null;
    this._levelup_ui = null;
    this._gameover_ui = null;
    this._is_game_over = false;

    // 화면 쉐이크
    this._shake_intensity = 0;
    this._shake_duration = 0;
  }

  /**
   * 씬 초기화
   */
  init() {
    super.init();

    // 카메라 생성
    if (!this._camera) {
      this._camera = createCameraManager(Config.SCREEN_WIDTH, Config.SCREEN_HEIGHT);
    }

    // 플레이어 생성
    this.#createPlayer();

    // 카메라 타겟 설정
    this._camera.setTarget(this._player);

    // SpawnManager 초기화
    spawnManager.setPlayer(this._player);
    spawnManager.setWave(1);

    // UI 생성 (중복 방지)
    if (!this._levelup_ui) {
      this._levelup_ui = new LevelUpUI();
    }
    if (!this._gameover_ui) {
      this._gameover_ui = new GameOverUI();
    }

    // 게임 상태 초기화
    this._is_game_over = false;

    // 이벤트 구독 (중복 방지를 위해 먼저 해제)
    eventBus.off('player_leveled_up', this.#handlePlayerLevelUp, this);
    eventBus.off('wave_changed', this.#handleWaveChanged, this);
    eventBus.off('player_died', this.#handlePlayerDied, this);
    eventBus.off('player_hit', this.#handlePlayerHit, this);
    eventBus.off('enemy_killed', this.#handleEnemyKilled, this);
    eventBus.off('game_restart', this.#handleGameRestart, this);

    // 이벤트 구독
    eventBus.on('player_leveled_up', this.#handlePlayerLevelUp, this);
    eventBus.on('wave_changed', this.#handleWaveChanged, this);
    eventBus.on('player_died', this.#handlePlayerDied, this);
    eventBus.on('player_hit', this.#handlePlayerHit, this);
    eventBus.on('enemy_killed', this.#handleEnemyKilled, this);
    eventBus.on('game_restart', this.#handleGameRestart, this);

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
    rigidbody.friction = 0; // 관성 제거
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

    // WeaponSlot 추가 (10개 슬롯)
    const weaponSlot = new WeaponSlot();
    this._player.addComponent(weaponSlot);

    // 시작 무기 추가 (근접 검)
    const startWeaponData = WeaponData.melee_slash;
    const startWeapon = new Weapon(startWeaponData);
    weaponSlot.addWeapon(startWeapon);
    stats.weapon_slot_count = 1;

    this._entities.push(this._player);
  }

  /**
   * 레벨업 처리
   * @param {Object} data
   */
  #handlePlayerLevelUp(data) {
    const { player, level } = data;
    console.log(`Player leveled up to ${level}!`);

    // 레벨업 UI 표시
    if (this._levelup_ui) {
      this._levelup_ui.show(player);
    }
  }

  /**
   * 웨이브 변경 처리
   * @param {Object} data
   */
  #handleWaveChanged(data) {
    const { wave } = data;
    console.log(`Wave ${wave} started!`);

    // SpawnManager에 새 웨이브 설정
    spawnManager.setWave(wave);
  }

  /**
   * 플레이어 사망 처리
   * @param {Object} data
   */
  #handlePlayerDied(data) {
    if (this._is_game_over) {
      return;
    }

    this._is_game_over = true;
    console.log('Player died!');

    // 게임오버 통계
    const stats = this._player.getComponent('Stats');
    const gameOverStats = {
      wave: waveManager.currentWave,
      level: stats.level,
      kills: stats.kills,
      gold: stats.gold,
    };

    // 게임오버 UI 표시
    if (this._gameover_ui) {
      this._gameover_ui.show(gameOverStats);
    }
  }

  /**
   * 플레이어 피격 처리
   * @param {Object} data
   */
  #handlePlayerHit(data) {
    // 화면 쉐이크
    this.#startScreenShake(5, 0.2);
  }

  /**
   * 적 처치 처리
   * @param {Object} data
   */
  #handleEnemyKilled(data) {
    const stats = this._player.getComponent('Stats');
    if (stats) {
      stats.kills++;
    }
  }

  /**
   * 게임 재시작 처리
   */
  #handleGameRestart() {
    console.log('Restarting game...');

    // 게임오버 상태 해제
    this._is_game_over = false;

    // UI 숨기기
    if (this._gameover_ui) {
      this._gameover_ui.hide();
    }

    // 모든 풀 초기화
    spawnManager.clear();
    projectilePool.despawnAll();

    // WaveManager 리셋
    waveManager.reset();

    // 기존 플레이어 파괴
    if (this._player) {
      this._player.destroy();
    }

    // 시스템 클리어 (재사용)
    this._systems.forEach((system) => system.clear());

    // 플레이어 재생성
    this._entities = [];
    this._projectiles = [];
    this.#createPlayer();

    // 카메라 타겟 재설정
    if (this._camera) {
      this._camera.reset();
      this._camera.setTarget(this._player);
    }

    // SpawnManager 재초기화
    spawnManager.setPlayer(this._player);
    spawnManager.setWave(1);

    // 시스템들에 플레이어 재등록
    this._systems[0].addEntity(this._player); // MovementSystem
    this._systems[1].setPlayer(this._player); // AISystem
    this._systems[4].addEntity(this._player); // WeaponSystem
    this._systems[5].setPlayer(this._player); // ExperienceSystem
    this._systems[5].addEntity(this._player); // ExperienceSystem

    // 화면 쉐이크 리셋
    this._shake_intensity = 0;
    this._shake_duration = 0;

    console.log('Game restarted successfully');
  }

  /**
   * 화면 쉐이크 시작
   * @param {number} intensity - 강도
   * @param {number} duration - 지속시간 (초)
   */
  #startScreenShake(intensity, duration) {
    this._shake_intensity = intensity;
    this._shake_duration = duration;
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

    // Weapon System (플레이어 추가)
    const weaponSystem = new WeaponSystem(this._player, []);
    weaponSystem.addEntity(this._player);
    this._systems.push(weaponSystem);

    // Experience System (플레이어 추가)
    const experienceSystem = new ExperienceSystem(this._player, []);
    experienceSystem.addEntity(this._player);
    this._systems.push(experienceSystem);

    // Projectile System
    const projectileSystem = new ProjectileSystem();
    this._systems.push(projectileSystem);

    console.log('GameScene started');
  }

  /**
   * 씬 업데이트
   * @param {number} deltaTime
   */
  update(deltaTime) {
    // 게임오버 상태면 업데이트 중지
    if (this._is_game_over) {
      return;
    }

    // 플레이어 입력 처리
    this.#handlePlayerInput();

    // 화면 쉐이크 업데이트
    this.#updateScreenShake(deltaTime);

    // 카메라 업데이트
    if (this._camera) {
      this._camera.update(deltaTime);
    }

    // WaveManager 업데이트
    waveManager.update(deltaTime);

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
   * 화면 쉐이크 업데이트
   * @param {number} deltaTime
   */
  #updateScreenShake(deltaTime) {
    if (this._shake_duration > 0) {
      this._shake_duration -= deltaTime;

      if (this._shake_duration <= 0) {
        this._shake_intensity = 0;
        this._shake_duration = 0;
      }
    }
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

    // ProjectileSystem 투사체 업데이트
    const projectileSystem = this._systems[6];
    this._projectiles.forEach((proj) => {
      if (!projectileSystem.entities.includes(proj)) {
        projectileSystem.addEntity(proj);
      }
    });
  }

  /**
   * 투사체 업데이트
   * @param {number} deltaTime
   */
  #updateProjectiles(deltaTime) {
    // projectilePool의 활성 투사체를 _projectiles에 동기화
    this._projectiles = projectilePool.getActiveProjectiles();
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
      // 이동 중일 때는 속도 직접 설정 (관성 없음)
      rigidbody.velocity.set(movement.x * stats.move_speed, movement.y * stats.move_speed);
    } else {
      // 키를 떼면 즉시 정지
      rigidbody.velocity.set(0, 0);
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

    // 화면 쉐이크 적용
    let shakeX = 0;
    let shakeY = 0;
    if (this._shake_intensity > 0) {
      shakeX = (Math.random() - 0.5) * this._shake_intensity;
      shakeY = (Math.random() - 0.5) * this._shake_intensity;
    }

    // 카메라 변환 시작
    ctx.save();
    if (this._camera) {
      ctx.translate(-this._camera.offset.x + shakeX, -this._camera.offset.y + shakeY);
    }

    // 배경 그리드 그리기
    this.#renderGrid(ctx);

    // 모든 엔티티 렌더링
    const allEntities = [this._player, ...spawnManager.enemies, ...this._projectiles, ...spawnManager.dropItems].filter((e) => e && e.active && !e.destroyed);

    allEntities.forEach((entity) => {
      const transform = entity.getComponent('Transform');
      const renderer = entity.getComponent('Renderer');

      if (!transform || !renderer || !renderer.visible) {
        return;
      }

      // 무적 상태 깜빡임 효과
      const health = entity.getComponent('Health');
      if (health && health.is_invincible) {
        // 0.1초마다 깜빡임
        const blinkInterval = 0.1;
        const time = performance.now() / 1000;
        if (Math.floor(time / blinkInterval) % 2 === 0) {
          return; // 깜빡임 - 렌더링 스킵
        }
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

    // 카메라 변환 종료
    ctx.restore();

    // UI 그리기 (카메라 영향 안받음)
    this.#renderUI(ctx);
  }

  /**
   * 배경 그리드 렌더링
   * @param {CanvasRenderingContext2D} ctx
   */
  #renderGrid(ctx) {
    if (!this._camera) {
      return;
    }

    const gridSize = 50;
    const startX = Math.floor(this._camera.offset.x / gridSize) * gridSize;
    const startY = Math.floor(this._camera.offset.y / gridSize) * gridSize;
    const endX = startX + ctx.canvas.width + gridSize;
    const endY = startY + ctx.canvas.height + gridSize;

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;

    // 세로선
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }

    // 가로선
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
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
    const weaponSlot = this._player.getComponent('WeaponSlot');

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

    // 무기 슬롯 표시
    if (weaponSlot) {
      ctx.fillText(`Weapons: ${weaponSlot.usedSlots}/10`, barX, expBarY + 70);
    }

    // 능력치 슬롯 표시
    ctx.fillText(`Abilities: ${stats.ability_slots.length}/10`, barX, expBarY + 90);

    // Wave 표시
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Wave ${waveManager.currentWave}`, ctx.canvas.width - 20, 30);

    // Wave 타이머
    const remainingTime = Math.ceil(waveManager.remainingTime);
    ctx.font = '16px Arial';
    ctx.fillText(`Next: ${remainingTime}s`, ctx.canvas.width - 20, 55);

    // 적 수 표시
    ctx.font = '14px Arial';
    ctx.fillText(`Enemies: ${spawnManager.enemies.length}`, ctx.canvas.width - 20, 80);

    // 미니맵
    this.#renderMinimap(ctx);

    // 조작법 표시
    ctx.fillStyle = '#888';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('WASD: Move', 20, ctx.canvas.height - 60);
    ctx.fillText('ESC: Pause', 20, ctx.canvas.height - 40);
    ctx.fillText('P: Debug Info', 20, ctx.canvas.height - 20);
  }

  /**
   * 미니맵 렌더링
   * @param {CanvasRenderingContext2D} ctx
   */
  #renderMinimap(ctx) {
    const minimapSize = 150;
    const minimapX = ctx.canvas.width - minimapSize - 20;
    const minimapY = ctx.canvas.height - minimapSize - 20;
    const minimapScale = 0.05; // 월드 좌표를 미니맵 좌표로 변환하는 스케일

    // 미니맵 배경
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);

    const playerTransform = this._player.getComponent('Transform');
    const centerX = minimapX + minimapSize / 2;
    const centerY = minimapY + minimapSize / 2;

    // 플레이어 (중앙 고정)
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

    // 적 표시
    ctx.fillStyle = '#ff0000';
    spawnManager.enemies.forEach((enemy) => {
      if (!enemy.active || enemy.destroyed) return;

      const enemyTransform = enemy.getComponent('Transform');
      if (!enemyTransform) return;

      // 플레이어 기준 상대 좌표
      const relativeX = (enemyTransform.position.x - playerTransform.position.x) * minimapScale;
      const relativeY = (enemyTransform.position.y - playerTransform.position.y) * minimapScale;

      const mapX = centerX + relativeX;
      const mapY = centerY + relativeY;

      // 미니맵 범위 내에만 표시
      if (mapX >= minimapX && mapX <= minimapX + minimapSize && mapY >= minimapY && mapY <= minimapY + minimapSize) {
        ctx.beginPath();
        ctx.arc(mapX, mapY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 경험치 표시
    ctx.fillStyle = '#00ffff';
    spawnManager.dropItems.forEach((item) => {
      if (!item.active || item.destroyed || item.drop_type !== 'exp') return;

      const itemTransform = item.getComponent('Transform');
      if (!itemTransform) return;

      const relativeX = (itemTransform.position.x - playerTransform.position.x) * minimapScale;
      const relativeY = (itemTransform.position.y - playerTransform.position.y) * minimapScale;

      const mapX = centerX + relativeX;
      const mapY = centerY + relativeY;

      if (mapX >= minimapX && mapX <= minimapX + minimapSize && mapY >= minimapY && mapY <= minimapY + minimapSize) {
        ctx.beginPath();
        ctx.arc(mapX, mapY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
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
    const weaponSlot = this._player.getComponent('WeaponSlot');

    debugPanel.innerHTML = `
      <div><strong>Player Debug</strong></div>
      <div>Pos: (${transform.position.x.toFixed(1)}, ${transform.position.y.toFixed(1)})</div>
      <div>Vel: (${rigidbody.velocity.x.toFixed(1)}, ${rigidbody.velocity.y.toFixed(1)})</div>
      <div>Speed: ${rigidbody.velocity.magnitude().toFixed(1)}</div>
      <div>Level: ${stats.level} | Exp: ${stats.exp}/${stats.exp_to_next}</div>
      <div>Gold: ${stats.gold}</div>
      <div>Weapons: ${weaponSlot ? weaponSlot.usedSlots : 0}/10</div>
      <div>Abilities: ${stats.ability_slots.length}/10</div>
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
    eventBus.off('wave_changed', this.#handleWaveChanged, this);
    eventBus.off('player_died', this.#handlePlayerDied, this);
    eventBus.off('player_hit', this.#handlePlayerHit, this);
    eventBus.off('enemy_killed', this.#handleEnemyKilled, this);
    eventBus.off('game_restart', this.#handleGameRestart, this);

    // UI 정리 (완전 파괴)
    if (this._levelup_ui) {
      this._levelup_ui.destroy();
      this._levelup_ui = null;
    }

    if (this._gameover_ui) {
      this._gameover_ui.destroy();
      this._gameover_ui = null;
    }

    // SpawnManager 정리
    spawnManager.clear();

    // WaveManager 리셋
    waveManager.reset();

    // 카메라 리셋
    if (this._camera) {
      this._camera.reset();
      this._camera = null;
    }

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
    this._is_game_over = false;

    super.destroy();
    console.log('GameScene destroyed');
  }
}
