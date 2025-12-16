/**
 * 파일위치: /src/ecs/components/Weapon.js
 * 파일명: Weapon.js
 * 용도: Weapon 컴포넌트
 * 기능: 무기 데이터 및 쿨타임 관리
 * 책임: 무기 발사 제어
 */

import { WeaponGrade } from '../../data/WeaponData.js';
import Component from '../Component.js';

export default class Weapon extends Component {
  constructor(weaponData) {
    super();

    // 무기 기본 정보
    this.id = weaponData.id;
    this.name = weaponData.name;
    this.description = weaponData.description;
    this.type = weaponData.type; // 'auto' | 'manual'
    this.attack_type = weaponData.attack_type;
    this.targeting = weaponData.targeting || null;
    this.grade = weaponData.grade || WeaponGrade.COMMON;
    this.icon_color = weaponData.icon_color;
    this.is_unique = weaponData.is_unique || false; // 전용무기 여부

    // 현재 레벨
    this.level = 1;
    this.max_level = weaponData.max_level || 5;

    // 무기 스탯 (레벨 1 기본값)
    this.damage_multiplier = weaponData.damage_multiplier;
    this.attack_speed = weaponData.attack_speed;
    this.range = weaponData.range || 300;

    // 타입별 추가 스탯
    this.#initializeTypeSpecificStats(weaponData);

    // 쿨타임
    this.cooldown = 0;

    // 강화 정보
    this.upgrade_costs = weaponData.upgrade_costs || [];
    this.upgrades = weaponData.upgrades || {};

    // 진화 정보
    this.evolutions = weaponData.evolutions || [];
  }

  /**
   * 타입별 스탯 초기화
   */
  #initializeTypeSpecificStats(data) {
    // 근접 휘두르기
    if (data.attack_type === 'melee_swing') {
      this.attack_angle = data.attack_angle || 60;
      this.attack_duration = data.attack_duration || 0.3;
      this.hits_per_attack = data.hits_per_attack || 1;
    }

    // 투사체
    if (data.attack_type === 'projectile' || data.attack_type === 'melee_swing') {
      this.projectile_count = data.projectile_count || 1;
      this.projectile_speed = data.projectile_speed || 400;
      this.pierce = data.pierce || 0;
    }

    // 레이저
    if (data.attack_type === 'laser') {
      this.laser_width = data.laser_width || 5;
      this.duration = data.duration || 1.0;
      this.laser_type = data.laser_type || 'straight';
    }

    // 직접 피해
    if (data.attack_type === 'direct_damage') {
      this.target_count = data.target_count || 1;
      this.chain_count = data.chain_count || 0;
      this.chain_damage_multiplier = data.chain_damage_multiplier || 0.5;
      this.area_radius = data.area_radius || 0;
      this.slow_duration = data.slow_duration || 0;
      this.slow_multiplier = data.slow_multiplier || 1.0;
    }

    // 장판형
    if (data.attack_type === 'area_damage') {
      this.area_radius = data.area_radius || 80;
      this.duration = data.duration || 3.0;
      this.tick_rate = data.tick_rate || 2;
      this.cloud_count = data.cloud_count || 1;
      this.spawn_range = data.spawn_range || 200;
    }

    // 기타 특수 속성
    this.rotation_angle = data.rotation_angle || 0;
    this.rotation_speed = data.rotation_speed || 2;
    this.orbit_radius = data.orbit_radius || 80;
    this.explosion_radius = data.explosion_radius || 0;
    this.spread_angle = data.spread_angle || 0;
    this.return_speed = data.return_speed || 0;
    this.dot_damage = data.dot_damage || 0;
    this.dot_duration = data.dot_duration || 0;
    this.life_steal = data.life_steal || 0;
  }

  /**
   * 무기 업그레이드
   * @param {Object} weaponData - 원본 무기 데이터
   * @returns {boolean}
   */
  upgrade(weaponData) {
    if (this.level >= this.max_level) {
      return false;
    }

    this.level++;

    // 업그레이드 스탯 적용
    const upgradeStats = this.upgrades[this.level];
    if (upgradeStats) {
      Object.keys(upgradeStats).forEach((key) => {
        if (this.hasOwnProperty(key)) {
          this[key] = upgradeStats[key];
        }
      });
    }

    return true;
  }

  /**
   * 진화 가능 여부 확인
   * @returns {boolean}
   */
  canEvolve() {
    return this.level >= this.max_level && this.evolutions.length > 0;
  }

  /**
   * 진화 레시피 확인
   * @param {string} materialWeaponId - 소재 무기 ID (레벨 포함)
   * @returns {string|null} 진화 결과 무기 ID
   */
  getEvolutionResult(materialWeaponId) {
    const myFullId = `${this.id}_${this.level}`;

    for (const evo of this.evolutions) {
      if (evo.recipe.includes(myFullId) && evo.recipe.includes(materialWeaponId)) {
        return evo.result;
      }
    }

    return null;
  }

  /**
   * 쿨타임 업데이트
   * @param {number} deltaTime
   * @param {number} cooldownReduction - 쿨타임 감소율 (0~1)
   */
  updateCooldown(deltaTime, cooldownReduction = 0) {
    if (this.cooldown > 0) {
      const actualCooldown = 1 / this.attack_speed;
      const reducedCooldown = actualCooldown * (1 - cooldownReduction);
      this.cooldown -= (deltaTime / reducedCooldown) * actualCooldown;

      if (this.cooldown < 0) {
        this.cooldown = 0;
      }
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
    if (this.rotation_speed > 0) {
      this.rotation_angle += this.rotation_speed * deltaTime;
      if (this.rotation_angle > Math.PI * 2) {
        this.rotation_angle -= Math.PI * 2;
      }
    }
  }

  /**
   * 다음 레벨 강화 비용
   * @returns {number}
   */
  getUpgradeCost() {
    if (this.level >= this.max_level) {
      return 0;
    }
    return this.upgrade_costs[this.level - 1] || 0;
  }

  /**
   * 강화 가능 여부
   * @returns {boolean}
   */
  canUpgrade() {
    return this.level < this.max_level;
  }

  /**
   * 무기 전체 ID (레벨 포함)
   */
  get fullId() {
    return `${this.id}_${this.level}`;
  }
}
