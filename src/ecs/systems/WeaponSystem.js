/**
 * 파일위치: /src/ecs/systems/WeaponSystem.js
 * 파일명: WeaponSystem.js
 * 용도: Weapon System
 * 기능: 무기 발사 처리
 * 책임: 자동/수동 무기 로직
 */

import projectilePool from '../../pool/ProjectilePool.js';
import Vector2 from '../../utils/Vector2.js';
import System from '../System.js';

export default class WeaponSystem extends System {
  constructor(player, enemies) {
    super();
    this._required_components = ['Weapon'];
    this._player = player;
    this._enemies = enemies || [];
  }

  /**
   * 적 목록 설정
   * @param {Array<Entity>} enemies
   */
  setEnemies(enemies) {
    this._enemies = enemies;
  }

  /**
   * 무기 처리
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  process(entity, deltaTime) {
    const weapon = entity.getComponent('Weapon');

    if (!weapon) {
      return;
    }

    // 쿨타임 업데이트
    weapon.updateCooldown(deltaTime);

    // 발사 가능 여부 확인
    if (!weapon.canFire()) {
      return;
    }

    // 무기 타입별 처리
    if (weapon.type === 'auto') {
      this.#processAutoWeapon(entity, weapon);
    } else if (weapon.type === 'manual') {
      this.#processManualWeapon(entity, weapon);
    }
  }

  /**
   * 자동 무기 처리
   * @param {Entity} entity
   * @param {Weapon} weapon
   */
  #processAutoWeapon(entity, weapon) {
    const transform = entity.getComponent('Transform');

    // 타겟팅 방식별 처리
    switch (weapon.targeting) {
      case 'nearest':
        this.#fireAtNearest(transform, weapon);
        break;
      case 'random':
        this.#fireRandom(transform, weapon);
        break;
      case 'rotating':
        weapon.updateRotation(0.016); // deltaTime 근사값
        this.#fireRotating(transform, weapon);
        break;
    }
  }

  /**
   * 수동 무기 처리 (마우스 방향)
   * @param {Entity} entity
   * @param {Weapon} weapon
   */
  #processManualWeapon(entity, weapon) {
    // 현재는 미구현 (추후 Input 시스템과 연동)
  }

  /**
   * 가장 가까운 적 타겟팅
   * @param {Transform} transform
   * @param {Weapon} weapon
   */
  #fireAtNearest(transform, weapon) {
    const nearestEnemy = this.#findNearestEnemy(transform.position, weapon.range);

    if (!nearestEnemy) {
      return;
    }

    const enemyTransform = nearestEnemy.getComponent('Transform');
    const direction = enemyTransform.position.clone().sub(transform.position).normalize();

    // 투사체 발사
    for (let i = 0; i < weapon.projectile_count; i++) {
      const angle = direction.angle();
      const spread = (i - (weapon.projectile_count - 1) / 2) * 0.1;

      projectilePool.spawn(transform.position.x, transform.position.y, angle + spread, weapon.projectile_speed, weapon.damage, '#ffff00', 8);
    }

    weapon.fire();
  }

  /**
   * 랜덤 방향 발사
   * @param {Transform} transform
   * @param {Weapon} weapon
   */
  #fireRandom(transform, weapon) {
    for (let i = 0; i < weapon.projectile_count; i++) {
      const angle = Math.random() * Math.PI * 2;

      projectilePool.spawn(transform.position.x, transform.position.y, angle, weapon.projectile_speed, weapon.damage, '#ff00ff', 8);
    }

    weapon.fire();
  }

  /**
   * 회전 무기 발사
   * @param {Transform} transform
   * @param {Weapon} weapon
   */
  #fireRotating(transform, weapon) {
    const angleStep = (Math.PI * 2) / weapon.projectile_count;

    for (let i = 0; i < weapon.projectile_count; i++) {
      const angle = weapon.rotation_angle + angleStep * i;
      const offsetX = Math.cos(angle) * weapon.orbit_radius;
      const offsetY = Math.sin(angle) * weapon.orbit_radius;

      projectilePool.spawn(transform.position.x + offsetX, transform.position.y + offsetY, angle, weapon.projectile_speed, weapon.damage, '#00ffff', 8);
    }

    weapon.fire();
  }

  /**
   * 가장 가까운 적 찾기
   * @param {Vector2} position
   * @param {number} maxRange
   * @returns {Entity|null}
   */
  #findNearestEnemy(position, maxRange) {
    let nearestEnemy = null;
    let nearestDistance = maxRange;

    for (const enemy of this._enemies) {
      if (!enemy.active || enemy.destroyed) {
        continue;
      }

      const health = enemy.getComponent('Health');
      if (health && health.is_dead) {
        continue;
      }

      const enemyTransform = enemy.getComponent('Transform');
      if (!enemyTransform) {
        continue;
      }

      const distance = position.distance(enemyTransform.position);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    }

    return nearestEnemy;
  }
}
