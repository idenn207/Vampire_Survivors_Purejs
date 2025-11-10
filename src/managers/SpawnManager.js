/**
 * 파일위치: /src/managers/SpawnManager.js
 * 파일명: SpawnManager.js
 * 용도: 적 스폰 관리자 (Singleton)
 * 기능: 적 스폰, 드랍 아이템 생성
 * 책임: 게임 난이도 조절
 */

import Config from '../data/Config.js';
import EnemyData from '../data/EnemyData.js';
import AI from '../ecs/components/AI.js';
import dropItemPool from '../pool/DropItemPool.js';
import enemyPool from '../pool/EnemyPool.js';
import projectilePool from '../pool/ProjectilePool.js';
import eventBus from '../utils/EventBus.js';

class SpawnManager {
  constructor() {
    if (SpawnManager._instance) {
      return SpawnManager._instance;
    }

    this._player = null;
    this._current_wave = 1;
    this._spawn_timer = 0;
    this._spawn_rate = Config.WAVE.SPAWN_RATE_BASE;

    this._enemies = [];
    this._drop_items = [];

    // 이벤트 구독
    eventBus.on('enemy_killed', this.#handleEnemyKilled, this);
    eventBus.on('item_picked_up', this.#handleItemPickedUp, this);
    eventBus.on('projectile_hit', this.#handleProjectileHit, this);

    SpawnManager._instance = this;
  }

  /**
   * 플레이어 설정
   * @param {Entity} player
   */
  setPlayer(player) {
    this._player = player;
  }

  /**
   * 웨이브 설정
   * @param {number} wave
   */
  setWave(wave) {
    this._current_wave = wave;

    // 웨이브에 따라 스폰 주기 감소
    this._spawn_rate = Math.max(Config.WAVE.SPAWN_RATE_MIN, Config.WAVE.SPAWN_RATE_BASE - (wave - 1) * Config.WAVE.SPAWN_RATE_DECREASE);
  }

  /**
   * 업데이트
   * @param {number} deltaTime
   */
  update(deltaTime) {
    if (!this._player) {
      return;
    }

    // 스폰 타이머
    this._spawn_timer += deltaTime;

    if (this._spawn_timer >= this._spawn_rate) {
      this._spawn_timer = 0;
      this.#spawnEnemy();
    }

    // 거리에 따른 적 제거
    this.#despawnDistantEnemies();

    // 투사체 수명 체크
    this.#updateProjectiles(deltaTime);
  }

  /**
   * 적 스폰
   */
  #spawnEnemy() {
    // 최대 적 수 체크
    if (this._enemies.length >= Config.ENEMY.MAX_ACTIVE) {
      return;
    }

    const playerTransform = this._player.getComponent('Transform');
    if (!playerTransform) {
      return;
    }

    // 플레이어 주변 랜덤 위치 계산
    const angle = Math.random() * Math.PI * 2;
    const distance = Config.ENEMY.SPAWN_DISTANCE;
    const spawnX = playerTransform.position.x + Math.cos(angle) * distance;
    const spawnY = playerTransform.position.y + Math.sin(angle) * distance;

    // 적 타입 선택 (현재는 normal만)
    const enemyType = this.#selectEnemyType();

    // 적 스폰
    const enemy = enemyPool.spawn(enemyType, spawnX, spawnY, this._current_wave);

    if (enemy) {
      // AI 컴포넌트 처리
      let ai = enemy.getComponent('AI');

      if (!ai) {
        // AI 컴포넌트가 없으면 새로 추가
        ai = new AI('chase');
        enemy.addComponent(ai);
      }

      // 타겟을 현재 플레이어로 업데이트
      ai.setTarget(this._player);

      this._enemies.push(enemy);
    }
  }

  /**
   * 적 타입 선택
   * @returns {string}
   */
  #selectEnemyType() {
    // 웨이브 3 이상부터 fast 적 등장
    if (this._current_wave >= 3 && Math.random() < 0.3) {
      return 'fast';
    }

    return 'normal';
  }

  /**
   * 거리에 따른 적 제거
   */
  #despawnDistantEnemies() {
    if (!this._player) {
      return;
    }

    const playerTransform = this._player.getComponent('Transform');
    const despawnDistance = Config.ENEMY.DESPAWN_DISTANCE;

    this._enemies = this._enemies.filter((enemy) => {
      if (!enemy.active || enemy.destroyed) {
        return false;
      }

      const enemyTransform = enemy.getComponent('Transform');
      if (!enemyTransform) {
        return false;
      }

      const distance = playerTransform.position.distance(enemyTransform.position);

      if (distance > despawnDistance) {
        enemyPool.despawn(enemy);
        return false;
      }

      return true;
    });
  }

  /**
   * 투사체 수명 업데이트
   * @param {number} deltaTime
   */
  #updateProjectiles(deltaTime) {
    // projectilePool에서 활성 투사체를 가져와 수명 체크
    // (간단한 구현을 위해 여기서는 생략)
  }

  /**
   * 적 사망 처리
   * @param {Object} data
   */
  #handleEnemyKilled(data) {
    const { enemy } = data;

    // 드랍 아이템 생성
    this.#spawnDropItems(enemy);

    // 적 제거
    const index = this._enemies.indexOf(enemy);
    if (index !== -1) {
      this._enemies.splice(index, 1);
    }

    enemyPool.despawn(enemy);
  }

  /**
   * 드랍 아이템 생성
   * @param {Entity} enemy
   */
  #spawnDropItems(enemy) {
    const transform = enemy.getComponent('Transform');
    const enemyType = enemy.enemy_type;
    const enemyData = EnemyData[enemyType];

    if (!transform || !enemyData) {
      return;
    }

    const x = transform.position.x;
    const y = transform.position.y;

    // 경험치 (100% 드랍)
    if (Math.random() < enemyData.drop_rates.exp) {
      const expValue = Config.EXPERIENCE.BASE_VALUE;
      const expItem = dropItemPool.spawn('exp', x, y, expValue);
      if (expItem) {
        this._drop_items.push(expItem);
      }
    }

    // 골드
    if (Math.random() < enemyData.drop_rates.gold) {
      const goldValue = Config.GOLD.BASE_VALUE;
      const goldItem = dropItemPool.spawn('gold', x, y, goldValue);
      if (goldItem) {
        this._drop_items.push(goldItem);
      }
    }
  }

  /**
   * 아이템 획득 처리
   * @param {Object} data
   */
  #handleItemPickedUp(data) {
    const { item } = data;

    // 아이템 목록에서 제거
    const index = this._drop_items.indexOf(item);
    if (index !== -1) {
      this._drop_items.splice(index, 1);
    }

    dropItemPool.despawn(item);
  }

  /**
   * 투사체 충돌 처리
   * @param {Object} data
   */
  #handleProjectileHit(data) {
    const { projectile } = data;

    // 투사체 제거
    if (projectile && projectile.active) {
      projectilePool.despawn(projectile);
    }
  }

  /**
   * 모든 엔티티 정리
   */
  clear() {
    this._enemies.forEach((enemy) => enemyPool.despawn(enemy));
    this._enemies = [];

    this._drop_items.forEach((item) => dropItemPool.despawn(item));
    this._drop_items = [];
  }

  /**
   * Getters
   */
  get enemies() {
    return this._enemies;
  }

  get dropItems() {
    return this._drop_items;
  }

  get currentWave() {
    return this._current_wave;
  }
}

// Singleton 인스턴스 export
const spawnManager = new SpawnManager();
export default spawnManager;
