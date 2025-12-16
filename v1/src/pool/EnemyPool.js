/**
 * 파일위치: /src/pool/EnemyPool.js
 * 파일명: EnemyPool.js
 * 용도: 적 객체 풀
 * 기능: 적 엔티티 재사용 관리
 * 책임: 적 생성/제거 최적화
 */

import EnemyData from '../data/EnemyData.js';
import Entity from '../ecs/Entity.js';
import Collider from '../ecs/components/Collider.js';
import Health from '../ecs/components/Health.js';
import Renderer from '../ecs/components/Renderer.js';
import Rigidbody from '../ecs/components/Rigidbody.js';
import Transform from '../ecs/components/Transform.js';
import ObjectPool from './ObjectPool.js';

class EnemyPool {
  constructor() {
    if (EnemyPool._instance) {
      return EnemyPool._instance;
    }

    this._pools = new Map(); // 타입별 풀

    // 각 적 타입별로 풀 생성
    Object.keys(EnemyData).forEach((type) => {
      this._pools.set(
        type,
        new ObjectPool(
          () => this.#createEnemy(type),
          (enemy, x, y, wave) => this.#resetEnemy(enemy, type, x, y, wave),
          50 // 타입당 50개씩 미리 생성
        )
      );
    });

    EnemyPool._instance = this;
  }

  /**
   * 적 엔티티 생성
   * @param {string} type - 적 타입
   * @returns {Entity}
   */
  #createEnemy(type) {
    const data = EnemyData[type];
    const enemy = new Entity(`Enemy_${type}`);

    // Transform
    enemy.addComponent(new Transform(0, 0));

    // Rigidbody
    const rigidbody = new Rigidbody();
    rigidbody.max_speed = data.base_speed;
    enemy.addComponent(rigidbody);

    // Renderer
    const renderer = new Renderer('circle', data.color, data.size);
    enemy.addComponent(renderer);

    // Health
    enemy.addComponent(new Health(data.base_health));

    // Collider
    const collider = new Collider('circle', data.size, data.size, data.size / 2);
    collider.setLayer(1); // ENEMY 레이어
    enemy.addComponent(collider);

    // 적 타입 저장
    enemy.enemy_type = type;

    return enemy;
  }

  /**
   * 적 초기화
   * @param {Entity} enemy
   * @param {string} type
   * @param {number} x
   * @param {number} y
   * @param {number} wave - 현재 웨이브
   */
  #resetEnemy(enemy, type, x, y, wave) {
    const data = EnemyData[type];

    // Transform 초기화
    const transform = enemy.getComponent('Transform');
    transform.setPosition(x, y);
    transform.rotation = 0;
    transform.scale = 1;

    // Rigidbody 초기화
    const rigidbody = enemy.getComponent('Rigidbody');
    rigidbody.velocity.set(0, 0);
    rigidbody.acceleration.set(0, 0);
    rigidbody.max_speed = data.base_speed * Math.pow(data.speed_scale, wave - 1);

    // Health 초기화
    const health = enemy.getComponent('Health');
    const scaledHealth = Math.floor(data.base_health * Math.pow(data.health_scale, wave - 1));
    health.setMaxHealth(scaledHealth, true);
    health.is_dead = false;
    health.is_invincible = false;

    // Renderer 초기화
    const renderer = enemy.getComponent('Renderer');
    renderer.visible = true;
    renderer.alpha = 1.0;

    // 엔티티 활성화
    enemy.setActive(true);
    enemy._destroyed = false;
    enemy.enemy_type = type;
    enemy.wave = wave;
  }

  /**
   * 적 가져오기
   * @param {string} type - 적 타입
   * @param {number} x - X 위치
   * @param {number} y - Y 위치
   * @param {number} wave - 현재 웨이브
   * @returns {Entity}
   */
  spawn(type, x, y, wave) {
    const pool = this._pools.get(type);
    if (!pool) {
      console.error(`Enemy type '${type}' not found`);
      return null;
    }

    return pool.get(x, y, wave);
  }

  /**
   * 적 반환
   * @param {Entity} enemy
   */
  despawn(enemy) {
    const type = enemy.enemy_type;
    const pool = this._pools.get(type);

    if (!pool) {
      return;
    }

    enemy.setActive(false);
    pool.release(enemy);
  }

  /**
   * 모든 적 반환
   */
  despawnAll() {
    this._pools.forEach((pool) => pool.releaseAll());
  }

  /**
   * 활성 적 수
   */
  get activeCount() {
    let count = 0;
    this._pools.forEach((pool) => {
      count += pool.activeCount;
    });
    return count;
  }

  /**
   * 특정 타입의 활성 적 수
   * @param {string} type
   */
  getActiveCount(type) {
    const pool = this._pools.get(type);
    return pool ? pool.activeCount : 0;
  }
}

// Singleton 인스턴스 export
const enemyPool = new EnemyPool();
export default enemyPool;
