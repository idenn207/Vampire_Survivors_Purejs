/**
 * 파일위치: /src/ecs/components/Stats.js
 * 파일명: Stats.js
 * 용도: Stats 컴포넌트
 * 기능: 게임 능력치 (공격력, 방어력, 속도 등)
 * 책임: 엔티티의 전투/성장 능력치
 */

import Component from '../Component.js';

export default class Stats extends Component {
  constructor() {
    super();

    // 기본 스탯
    this.attack_power = 10;
    this.attack_speed = 1.0;
    this.defense = 0;
    this.move_speed = 200;

    // 추가 스탯
    this.crit_chance = 0.05; // 치명타 확률 (0~1)
    this.crit_damage = 1.5; // 치명타 데미지 배율
    this.life_steal = 0; // 흡혈 (0~1)
    this.health_regen = 0; // 초당 체력 재생
    this.attack_range = 1.0; // 공격 범위 배율
    this.cooldown_reduction = 0; // 쿨타임 감소 (0~1)

    // 자석 범위
    this.magnet_range = 50;

    // 경험치/레벨
    this.level = 1;
    this.exp = 0;
    this.exp_to_next = 100;

    // 골드
    this.gold = 0;
  }

  /**
   * 스탯 증가
   * @param {string} statName
   * @param {number} amount
   */
  increaseStat(statName, amount) {
    if (this.hasOwnProperty(statName)) {
      this[statName] += amount;
    }
  }

  /**
   * 스탯 배율 적용
   * @param {string} statName
   * @param {number} multiplier
   */
  multiplyStat(statName, multiplier) {
    if (this.hasOwnProperty(statName)) {
      this[statName] *= multiplier;
    }
  }

  /**
   * 경험치 획득
   * @param {number} amount
   * @returns {boolean} 레벨업 했는지
   */
  gainExp(amount) {
    this.exp += amount;

    if (this.exp >= this.exp_to_next) {
      this.levelUp();
      return true;
    }

    return false;
  }

  /**
   * 레벨업
   */
  levelUp() {
    this.level++;
    this.exp -= this.exp_to_next;

    // 다음 레벨 필요 경험치 계산
    this.exp_to_next = Math.floor(100 * Math.pow(1.2, this.level - 1));

    // 남은 경험치로 추가 레벨업 확인
    if (this.exp >= this.exp_to_next) {
      this.levelUp();
    }
  }

  /**
   * 골드 획득
   * @param {number} amount
   */
  gainGold(amount) {
    this.gold += amount;
  }

  /**
   * 골드 사용
   * @param {number} amount
   * @returns {boolean} 사용 성공 여부
   */
  spendGold(amount) {
    if (this.gold >= amount) {
      this.gold -= amount;
      return true;
    }
    return false;
  }

  /**
   * 경험치 비율 (0~1)
   */
  get expRatio() {
    return this.exp / this.exp_to_next;
  }
}
