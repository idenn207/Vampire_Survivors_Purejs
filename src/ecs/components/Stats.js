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

    // 추가 스탯 (20종)
    this.crit_chance = 0.05; // 치명타 확률 (0~1)
    this.crit_damage = 1.5; // 치명타 데미지 배율
    this.life_steal = 0; // 흡혈 (0~1)
    this.health_regen = 0; // 초당 체력 재생
    this.attack_range = 1.0; // 공격 범위 배율
    this.cooldown_reduction = 0; // 쿨타임 감소 (0~1)
    this.armor_penetration = 0; // 방어 무시율 (0~1)
    this.damage_reduction = 0; // 피해 감소율 (0~1)
    this.gold_gain = 0; // 골드 획득량 증가 (0~1)
    this.exp_gain = 0; // 경험치 획득량 증가 (0~1)
    this.luck = 0; // 행운 (드랍률 증가)
    this.reroll_count = 0; // 리롤 기회
    this.ban_count = 0; // 삭제 기회
    this.final_damage = 0; // 최종 데미지 증가 (0~1)
    this.active_cooldown = 0; // 액티브 쿨타임 감소 (0~1)

    // 자석 범위
    this.magnet_range = 50;

    // 경험치/레벨
    this.level = 1;
    this.exp = 0;
    this.exp_to_next = 100;

    // 골드
    this.gold = 0;

    // 통계
    this.kills = 0;

    // 능력치 슬롯 (최대 10개)
    this.ability_slots = []; // { id, name, level, effects }

    // 무기 슬롯 카운트 (실제 무기는 Weapon 컴포넌트 배열로 관리)
    this.weapon_slot_count = 0;
  }

  /**
   * 능력치 추가
   * @param {Object} abilityData - StatData의 ability 데이터
   * @returns {boolean} 추가 성공 여부
   */
  addAbility(abilityData) {
    // 슬롯 확인
    if (this.ability_slots.length >= 10) {
      console.warn('Ability slots are full');
      return false;
    }

    // 중복 확인
    if (this.hasAbility(abilityData.id)) {
      console.warn(`Ability ${abilityData.id} already exists`);
      return false;
    }

    // 능력치 추가
    const ability = {
      id: abilityData.id,
      name: abilityData.name,
      level: 1,
      effects: abilityData.effects[1],
    };

    this.ability_slots.push(ability);

    // 효과 적용
    this.#applyAbilityEffects(ability.effects);

    return true;
  }

  /**
   * 능력치 강화
   * @param {string} abilityId
   * @param {Object} abilityData - StatData의 ability 데이터
   * @returns {boolean} 강화 성공 여부
   */
  upgradeAbility(abilityId, abilityData) {
    const ability = this.ability_slots.find((a) => a.id === abilityId);

    if (!ability) {
      return false;
    }

    if (ability.level >= abilityData.max_level) {
      console.warn(`Ability ${abilityId} is already max level`);
      return false;
    }

    // 이전 효과 제거
    this.#removeAbilityEffects(ability.effects);

    // 레벨업
    ability.level++;
    ability.effects = abilityData.effects[ability.level];

    // 새 효과 적용
    this.#applyAbilityEffects(ability.effects);

    return true;
  }

  /**
   * 능력치 효과 적용
   * @param {Object} effects
   */
  #applyAbilityEffects(effects) {
    Object.keys(effects).forEach((key) => {
      if (this.hasOwnProperty(key)) {
        this[key] += effects[key];
      }
    });
  }

  /**
   * 능력치 효과 제거
   * @param {Object} effects
   */
  #removeAbilityEffects(effects) {
    Object.keys(effects).forEach((key) => {
      if (this.hasOwnProperty(key)) {
        this[key] -= effects[key];
      }
    });
  }

  /**
   * 능력치 보유 확인
   * @param {string} abilityId
   * @returns {boolean}
   */
  hasAbility(abilityId) {
    return this.ability_slots.some((a) => a.id === abilityId);
  }

  /**
   * 능력치 가져오기
   * @param {string} abilityId
   * @returns {Object|null}
   */
  getAbility(abilityId) {
    return this.ability_slots.find((a) => a.id === abilityId) || null;
  }

  /**
   * 스탯 증가 (슬롯 미사용)
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
    // 경험치 획득량 보너스 적용
    const finalAmount = Math.floor(amount * (1 + this.exp_gain));
    this.exp += finalAmount;

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
    // 골드 획득량 보너스 적용
    const finalAmount = Math.floor(amount * (1 + this.gold_gain));
    this.gold += finalAmount;
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

  /**
   * 능력치 슬롯 사용 가능 여부
   */
  get canAddAbility() {
    return this.ability_slots.length < 10;
  }

  /**
   * 무기 슬롯 사용 가능 여부
   */
  get canAddWeapon() {
    return this.weapon_slot_count < 10;
  }
}
