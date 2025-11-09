/**
 * 파일위치: /src/ecs/components/Weapon.js
 * 파일명: Weapon.js
 * 용도: Weapon 컴포넌트
 * 기능: 무기 데이터 및 쿨타임 관리
 * 책임: 무기 발사 제어
 */

import Component from '../Component.js';

export default class Weapon extends Component {
  constructor(weaponData) {
    super();

    // 무기 기본 정보
    this.id = weaponData.id;
    this.name = weaponData.name;
    this.type = weaponData.type; // 'auto' | 'manual'
    this.targeting = weaponData.targeting; // 'nearest' | 'random' | 'rotating'
    this.level = 1;

    // 무기 스탯
    this.damage = weaponData.damage;
    this.attack_speed = weaponData.attack_speed; // 공격 주기 (초)
    this.projectile_count = weaponData.projectile_count || 1;
    this.projectile_speed = weaponData.projectile_speed || 400;
    this.range = weaponData.range || 300;

    // 쿨타임
    this.cooldown = 0;

    // 무기별 특수 데이터
    this.rotation_angle = 0; // 회전 무기용
    this.rotation_speed = weaponData.rotation_speed || 2; // 초당 회전 (라디안)
    this.orbit_radius = weaponData.orbit_radius || 80; // 궤도 반지름
  }

  /**
   * 쿨타임 업데이트
   * @param {number} deltaTime
   */
  updateCooldown(deltaTime) {
    if (this.cooldown > 0) {
      this.cooldown -= deltaTime;
    }
  }

  /**
   * 발사 가능 여부
   * @returns {boolean}
   */
  canFire() {
    return this.cooldown <= 0;
  }

  /**
   * 발사 (쿨타임 설정)
   */
  fire() {
    this.cooldown = 1 / this.attack_speed;
  }

  /**
   * 회전 각도 업데이트 (회전 무기용)
   * @param {number} deltaTime
   */
  updateRotation(deltaTime) {
    this.rotation_angle += this.rotation_speed * deltaTime;
    if (this.rotation_angle > Math.PI * 2) {
      this.rotation_angle -= Math.PI * 2;
    }
  }
}
