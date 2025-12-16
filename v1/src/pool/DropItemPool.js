/**
 * 파일위치: /src/pool/DropItemPool.js
 * 파일명: DropItemPool.js
 * 용도: 드랍 아이템 객체 풀
 * 기능: 경험치, 골드 등 드랍 아이템 재사용 관리
 * 책임: 드랍 아이템 생성/제거 최적화
 */

import Entity from '../ecs/Entity.js';
import Collider from '../ecs/components/Collider.js';
import Renderer from '../ecs/components/Renderer.js';
import Rigidbody from '../ecs/components/Rigidbody.js';
import Transform from '../ecs/components/Transform.js';
import ObjectPool from './ObjectPool.js';

class DropItemPool {
  constructor() {
    if (DropItemPool._instance) {
      return DropItemPool._instance;
    }

    // 타입별 풀
    this._pools = {
      exp: new ObjectPool(
        () => this.#createDropItem('exp', '#00ffff', 6),
        (item, x, y, value) => this.#resetDropItem(item, 'exp', x, y, value),
        100
      ),
      gold: new ObjectPool(
        () => this.#createDropItem('gold', '#ffff00', 8),
        (item, x, y, value) => this.#resetDropItem(item, 'gold', x, y, value),
        50
      ),
    };

    DropItemPool._instance = this;
  }

  /**
   * 드랍 아이템 생성
   */
  #createDropItem(type, color, size) {
    const item = new Entity(`DropItem_${type}`);

    // Transform
    item.addComponent(new Transform(0, 0));

    // Rigidbody
    const rigidbody = new Rigidbody();
    rigidbody.friction = 5;
    rigidbody.max_speed = 300;
    item.addComponent(rigidbody);

    // Renderer
    item.addComponent(new Renderer('circle', color, size));

    // Collider
    const collider = new Collider('circle', size, size, size / 2);
    collider.setLayer(4); // PICKUP 레이어
    collider.is_trigger = true;
    item.addComponent(collider);

    // 드랍 아이템 데이터
    item.drop_type = type;
    item.value = 0;
    item.is_magnetized = false;

    return item;
  }

  /**
   * 드랍 아이템 초기화
   */
  #resetDropItem(item, type, x, y, value) {
    // Transform 초기화
    const transform = item.getComponent('Transform');
    transform.setPosition(x, y);
    transform.rotation = 0;

    // Rigidbody 초기화
    const rigidbody = item.getComponent('Rigidbody');
    rigidbody.velocity.set(0, 0);
    rigidbody.acceleration.set(0, 0);

    // Renderer 초기화
    const renderer = item.getComponent('Renderer');
    renderer.visible = true;
    renderer.alpha = 1.0;

    // 드랍 아이템 데이터
    item.drop_type = type;
    item.value = value;
    item.is_magnetized = false;

    // 엔티티 활성화
    item.setActive(true);
    item._destroyed = false;
  }

  /**
   * 드랍 아이템 생성
   * @param {string} type - 'exp' | 'gold'
   * @param {number} x
   * @param {number} y
   * @param {number} value
   * @returns {Entity}
   */
  spawn(type, x, y, value) {
    const pool = this._pools[type];
    if (!pool) {
      console.error(`Drop item type '${type}' not found`);
      return null;
    }

    return pool.get(x, y, value);
  }

  /**
   * 드랍 아이템 반환
   * @param {Entity} item
   */
  despawn(item) {
    const type = item.drop_type;
    const pool = this._pools[type];

    if (!pool) {
      return;
    }

    item.setActive(false);
    pool.release(item);
  }

  /**
   * 모든 드랍 아이템 반환
   */
  despawnAll() {
    Object.values(this._pools).forEach((pool) => pool.releaseAll());
  }

  /**
   * 활성 드랍 아이템 수
   */
  get activeCount() {
    let count = 0;
    Object.values(this._pools).forEach((pool) => {
      count += pool.activeCount;
    });
    return count;
  }
}

// Singleton 인스턴스 export
const dropItemPool = new DropItemPool();
export default dropItemPool;
