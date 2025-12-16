/**
 * 파일위치: /src/pool/ProjectilePool.js
 * 파일명: ProjectilePool.js
 * 용도: 투사체 객체 풀
 * 기능: 투사체 엔티티 재사용 관리
 * 책임: 투사체 생성/제거 최적화
 */

import Entity from '../ecs/Entity.js';
import Collider from '../ecs/components/Collider.js';
import Renderer from '../ecs/components/Renderer.js';
import Rigidbody from '../ecs/components/Rigidbody.js';
import Transform from '../ecs/components/Transform.js';
import ObjectPool from './ObjectPool.js';

class ProjectilePool {
  constructor() {
    if (ProjectilePool._instance) {
      return ProjectilePool._instance;
    }

    this._pool = new ObjectPool(
      () => this.#createProjectile(),
      (projectile, x, y, direction, speed, damage, color, size) => this.#resetProjectile(projectile, x, y, direction, speed, damage, color, size),
      100 // 100개 미리 생성
    );

    ProjectilePool._instance = this;
  }

  /**
   * 투사체 엔티티 생성
   * @returns {Entity}
   */
  #createProjectile() {
    const projectile = new Entity('Projectile');

    // Transform
    projectile.addComponent(new Transform(0, 0));

    // Rigidbody
    const rigidbody = new Rigidbody();
    rigidbody.friction = 0; // 투사체는 마찰 없음
    projectile.addComponent(rigidbody);

    // Renderer
    projectile.addComponent(new Renderer('circle', '#ffff00', 8));

    // Collider
    const collider = new Collider('circle', 8, 8, 4);
    collider.setLayer(2); // PLAYER_PROJECTILE 레이어
    projectile.addComponent(collider);

    // 투사체 전용 데이터
    projectile.damage = 0;
    projectile.lifetime = 0;
    projectile.max_lifetime = 3; // 3초 후 소멸

    return projectile;
  }

  /**
   * 투사체 초기화
   */
  #resetProjectile(projectile, x, y, direction, speed, damage, color = '#ffff00', size = 8) {
    // Transform 초기화
    const transform = projectile.getComponent('Transform');
    transform.setPosition(x, y);
    transform.rotation = direction;

    // Rigidbody 초기화
    const rigidbody = projectile.getComponent('Rigidbody');
    rigidbody.velocity.set(Math.cos(direction) * speed, Math.sin(direction) * speed);
    rigidbody.max_speed = speed;

    // Renderer 초기화
    const renderer = projectile.getComponent('Renderer');
    renderer.color = color;
    renderer.size = size;
    renderer.visible = true;
    renderer.alpha = 1.0;

    // Collider 초기화
    const collider = projectile.getComponent('Collider');
    collider.radius = size / 2;

    // 투사체 데이터
    projectile.damage = damage;
    projectile.lifetime = 0;

    // 엔티티 활성화
    projectile.setActive(true);
    projectile._destroyed = false;
  }

  /**
   * 투사체 생성
   * @param {number} x - 시작 X 위치
   * @param {number} y - 시작 Y 위치
   * @param {number} direction - 방향 (라디안)
   * @param {number} speed - 속도
   * @param {number} damage - 데미지
   * @param {string} color - 색상
   * @param {number} size - 크기
   * @returns {Entity}
   */
  spawn(x, y, direction, speed, damage, color = '#ffff00', size = 8) {
    return this._pool.get(x, y, direction, speed, damage, color, size);
  }

  /**
   * 투사체 반환
   * @param {Entity} projectile
   */
  despawn(projectile) {
    projectile.setActive(false);
    this._pool.release(projectile);
  }

  /**
   * 모든 투사체 반환
   */
  despawnAll() {
    this._pool.releaseAll();
  }

  /**
   * 활성 투사체 수
   */
  get activeCount() {
    return this._pool.activeCount;
  }

  /**
   * 모든 활성 투사체 가져오기
   * @returns {Array<Entity>}
   */
  getActiveProjectiles() {
    return Array.from(this._pool._active);
  }
}

// Singleton 인스턴스 export
const projectilePool = new ProjectilePool();
export default projectilePool;
