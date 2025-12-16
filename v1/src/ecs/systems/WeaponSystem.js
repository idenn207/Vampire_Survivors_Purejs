/**
 * 파일위치: /src/ecs/systems/WeaponSystem.js
 * 파일명: WeaponSystem.js
 * 용도: Weapon System
 * 기능: 무기 발사 처리 (다중 무기 지원)
 * 책임: 자동/수동 무기 로직
 */

import input from '../../core/Input.js';
import projectilePool from '../../pool/ProjectilePool.js';
import System from '../System.js';

export default class WeaponSystem extends System {
  constructor(player, enemies) {
    super();
    this._required_components = ['WeaponSlot', 'Stats'];
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
    const weaponSlot = entity.getComponent('WeaponSlot');
    const stats = entity.getComponent('Stats');

    if (!weaponSlot || weaponSlot.weapons.length === 0) {
      return;
    }

    // 모든 무기 처리
    weaponSlot.weapons.forEach((weapon) => {
      // 쿨타임 업데이트
      weapon.updateCooldown(deltaTime, stats.cooldown_reduction);

      // 발사 가능 여부 확인
      if (!weapon.canFire()) {
        return;
      }

      // 무기 타입별 처리
      if (weapon.type === 'auto') {
        this.#processAutoWeapon(entity, weapon, stats);
      } else if (weapon.type === 'manual') {
        this.#processManualWeapon(entity, weapon, stats);
      }
    });
  }

  /**
   * 자동 무기 처리
   */
  #processAutoWeapon(entity, weapon, stats) {
    const transform = entity.getComponent('Transform');

    // 타겟팅 방식별 처리
    switch (weapon.targeting) {
      case 'nearest':
        this.#fireAtNearest(transform, weapon, stats);
        break;
      case 'random':
        this.#fireRandom(transform, weapon, stats);
        break;
      case 'rotating':
        weapon.updateRotation(0.016);
        this.#fireRotating(transform, weapon, stats);
        break;
      case 'random_multiple':
        this.#fireDirectDamageMultiple(transform, weapon, stats);
        break;
      case 'nearest_area':
        this.#fireDirectDamageArea(transform, weapon, stats);
        break;
      case 'random_area':
        this.#fireAreaDamage(transform, weapon, stats);
        break;
    }
  }

  /**
   * 수동 무기 처리
   */
  #processManualWeapon(entity, weapon, stats) {
    const transform = entity.getComponent('Transform');
    const mousePos = input.mouseWorldPosition;

    // 마우스 방향 계산
    const direction = mousePos.clone().sub(transform.position).normalize();

    // 공격 타입별 처리
    switch (weapon.attack_type) {
      case 'melee_swing':
        this.#fireMeleeSwing(transform, weapon, stats, direction);
        break;
      case 'projectile':
        this.#fireProjectileManual(transform, weapon, stats, direction);
        break;
      case 'laser':
        this.#fireLaser(transform, weapon, stats, direction);
        break;
    }
  }

  /**
   * 가장 가까운 적 타겟팅
   */
  #fireAtNearest(transform, weapon, stats) {
    const nearestEnemy = this.#findNearestEnemy(transform.position, weapon.range * stats.attack_range);

    if (!nearestEnemy) {
      return;
    }

    const enemyTransform = nearestEnemy.getComponent('Transform');
    const direction = enemyTransform.position.clone().sub(transform.position).normalize();

    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);

    for (let i = 0; i < weapon.projectile_count; i++) {
      const angle = direction.angle();
      const spread = (i - (weapon.projectile_count - 1) / 2) * 0.1;

      projectilePool.spawn(transform.position.x, transform.position.y, angle + spread, weapon.projectile_speed, finalDamage, '#ffff00', 8);
    }

    weapon.fire();
  }

  /**
   * 랜덤 방향 발사
   */
  #fireRandom(transform, weapon, stats) {
    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);

    for (let i = 0; i < weapon.projectile_count; i++) {
      const angle = Math.random() * Math.PI * 2;

      projectilePool.spawn(transform.position.x, transform.position.y, angle, weapon.projectile_speed, finalDamage, '#ff00ff', 8);
    }

    weapon.fire();
  }

  /**
   * 회전 무기 발사
   */
  #fireRotating(transform, weapon, stats) {
    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);
    const angleStep = (Math.PI * 2) / weapon.projectile_count;

    for (let i = 0; i < weapon.projectile_count; i++) {
      const angle = weapon.rotation_angle + angleStep * i;
      const offsetX = Math.cos(angle) * weapon.orbit_radius;
      const offsetY = Math.sin(angle) * weapon.orbit_radius;

      projectilePool.spawn(transform.position.x + offsetX, transform.position.y + offsetY, angle, weapon.projectile_speed, finalDamage, '#00ffff', 8);
    }

    weapon.fire();
  }

  /**
   * 직접 피해 (다중 타겟)
   */
  #fireDirectDamageMultiple(transform, weapon, stats) {
    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);
    const targets = this.#findRandomEnemies(transform.position, weapon.range, weapon.target_count);

    targets.forEach((enemy) => {
      const health = enemy.getComponent('Health');
      if (health && !health.is_dead) {
        health.takeDamage(finalDamage);
      }
    });

    weapon.fire();
  }

  /**
   * 직접 피해 (범위)
   */
  #fireDirectDamageArea(transform, weapon, stats) {
    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);
    const nearestEnemy = this.#findNearestEnemy(transform.position, weapon.range);

    if (!nearestEnemy) {
      return;
    }

    const enemyTransform = nearestEnemy.getComponent('Transform');

    this._enemies.forEach((enemy) => {
      if (!enemy.active || enemy.destroyed) return;

      const eTransform = enemy.getComponent('Transform');
      if (!eTransform) return;

      const distance = enemyTransform.position.distance(eTransform.position);

      if (distance <= weapon.area_radius) {
        const health = enemy.getComponent('Health');
        if (health && !health.is_dead) {
          health.takeDamage(finalDamage);
        }
      }
    });

    weapon.fire();
  }

  /**
   * 장판형 공격
   */
  #fireAreaDamage(transform, weapon, stats) {
    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);

    for (let i = 0; i < weapon.cloud_count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * weapon.spawn_range;
      const x = transform.position.x + Math.cos(angle) * distance;
      const y = transform.position.y + Math.sin(angle) * distance;

      // TODO: 장판 엔티티 생성
      projectilePool.spawn(x, y, 0, 0, finalDamage, '#00ff00', weapon.area_radius / 5);
    }

    weapon.fire();
  }

  /**
   * 근접 휘두르기
   */
  #fireMeleeSwing(transform, weapon, stats, direction) {
    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);
    const angle = direction.angle();

    this._enemies.forEach((enemy) => {
      if (!enemy.active || enemy.destroyed) return;

      const enemyTransform = enemy.getComponent('Transform');
      if (!enemyTransform) return;

      const toEnemy = enemyTransform.position.clone().sub(transform.position);
      const distance = toEnemy.magnitude();

      if (distance > weapon.range * stats.attack_range) return;

      const enemyAngle = toEnemy.angle();
      const angleDiff = Math.abs(enemyAngle - angle);
      const halfAngle = (weapon.attack_angle / 2) * (Math.PI / 180);

      if (angleDiff <= halfAngle || angleDiff >= Math.PI * 2 - halfAngle) {
        const health = enemy.getComponent('Health');
        if (health && !health.is_dead) {
          for (let i = 0; i < weapon.hits_per_attack; i++) {
            health.takeDamage(finalDamage);
          }
        }
      }
    });

    weapon.fire();
  }

  /**
   * 수동 투사체 발사
   */
  #fireProjectileManual(transform, weapon, stats, direction) {
    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);
    const baseAngle = direction.angle();

    for (let i = 0; i < weapon.projectile_count; i++) {
      let angle = baseAngle;

      if (weapon.spread_angle) {
        const spread = (weapon.spread_angle / 2) * (Math.PI / 180);
        angle += (Math.random() - 0.5) * spread * 2;
      }

      projectilePool.spawn(transform.position.x, transform.position.y, angle, weapon.projectile_speed, finalDamage, '#ffaa00', 8);
    }

    weapon.fire();
  }

  /**
   * 레이저 발사
   */
  #fireLaser(transform, weapon, stats, direction) {
    const finalDamage = this.#calculateDamage(weapon.damage_multiplier, stats);

    // TODO: 레이저 엔티티
    const angle = direction.angle();
    projectilePool.spawn(transform.position.x, transform.position.y, angle, weapon.projectile_speed || 800, finalDamage, '#00ffff', weapon.laser_width || 5);

    weapon.fire();
  }

  /**
   * 데미지 계산
   */
  #calculateDamage(weaponMultiplier, stats) {
    const baseDamage = stats.attack_power * (weaponMultiplier / 100);
    const finalDamage = baseDamage * (1 + stats.final_damage);

    if (Math.random() < stats.crit_chance) {
      return finalDamage * stats.crit_damage;
    }

    return finalDamage;
  }

  /**
   * 가장 가까운 적 찾기
   */
  #findNearestEnemy(position, maxRange) {
    let nearestEnemy = null;
    let nearestDistance = maxRange;

    for (const enemy of this._enemies) {
      if (!enemy.active || enemy.destroyed) continue;

      const health = enemy.getComponent('Health');
      if (health && health.is_dead) continue;

      const enemyTransform = enemy.getComponent('Transform');
      if (!enemyTransform) continue;

      const distance = position.distance(enemyTransform.position);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    }

    return nearestEnemy;
  }

  /**
   * 랜덤 적 찾기
   */
  #findRandomEnemies(position, maxRange, count) {
    const validEnemies = this._enemies.filter((enemy) => {
      if (!enemy.active || enemy.destroyed) return false;

      const health = enemy.getComponent('Health');
      if (health && health.is_dead) return false;

      const enemyTransform = enemy.getComponent('Transform');
      if (!enemyTransform) return false;

      const distance = position.distance(enemyTransform.position);
      return distance <= maxRange;
    });

    const shuffled = validEnemies.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
