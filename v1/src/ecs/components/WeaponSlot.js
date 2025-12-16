/**
 * 파일위치: /src/ecs/components/WeaponSlot.js
 * 파일명: WeaponSlot.js
 * 용도: WeaponSlot 컴포넌트
 * 기능: 플레이어의 무기 슬롯 관리 (최대 10개)
 * 책임: 무기 추가/제거/진화 관리
 */

import Component from '../Component.js';

export default class WeaponSlot extends Component {
  constructor() {
    super();

    this.weapons = []; // Weapon 컴포넌트 배열 (최대 10개)
    this.max_slots = 10;
  }

  /**
   * 무기 추가
   * @param {Weapon} weapon
   * @returns {boolean}
   */
  addWeapon(weapon) {
    if (this.weapons.length >= this.max_slots) {
      console.warn('Weapon slots are full');
      return false;
    }

    // 중복 확인 (같은 id의 무기는 하나만)
    if (this.hasWeapon(weapon.id)) {
      console.warn(`Weapon ${weapon.id} already exists`);
      return false;
    }

    this.weapons.push(weapon);
    return true;
  }

  /**
   * 무기 제거 (진화 시 소재 제거용)
   * @param {string} weaponId
   * @returns {boolean}
   */
  removeWeapon(weaponId) {
    const index = this.weapons.findIndex((w) => w.id === weaponId);

    if (index === -1) {
      return false;
    }

    this.weapons.splice(index, 1);
    return true;
  }

  /**
   * 무기 교체 (진화 시 메인 무기 교체용)
   * @param {string} oldWeaponId
   * @param {Weapon} newWeapon
   * @returns {boolean}
   */
  replaceWeapon(oldWeaponId, newWeapon) {
    const index = this.weapons.findIndex((w) => w.id === oldWeaponId);

    if (index === -1) {
      return false;
    }

    this.weapons[index] = newWeapon;
    return true;
  }

  /**
   * 무기 보유 확인
   * @param {string} weaponId
   * @returns {boolean}
   */
  hasWeapon(weaponId) {
    return this.weapons.some((w) => w.id === weaponId);
  }

  /**
   * 무기 가져오기
   * @param {string} weaponId
   * @returns {Weapon|null}
   */
  getWeapon(weaponId) {
    return this.weapons.find((w) => w.id === weaponId) || null;
  }

  /**
   * 진화 가능한 무기 쌍 찾기
   * @returns {Array} [{ mainWeapon, materialWeapon, resultId }]
   */
  getEvolvablePairs() {
    const pairs = [];

    // 모든 무기 쌍 조합 확인
    for (let i = 0; i < this.weapons.length; i++) {
      const mainWeapon = this.weapons[i];

      if (!mainWeapon.canEvolve()) {
        continue;
      }

      for (let j = 0; j < this.weapons.length; j++) {
        if (i === j) continue;

        const materialWeapon = this.weapons[j];

        // 레벨 5 확인
        if (materialWeapon.level < materialWeapon.max_level) {
          continue;
        }

        // 같은 등급만 진화 가능
        if (mainWeapon.grade !== materialWeapon.grade) {
          continue;
        }

        // 진화 레시피 확인
        const resultId = mainWeapon.getEvolutionResult(materialWeapon.fullId);

        if (resultId) {
          pairs.push({
            mainWeapon,
            materialWeapon,
            resultId,
          });
        }
      }
    }

    return pairs;
  }

  /**
   * 강화 가능한 무기 목록
   * @returns {Array<Weapon>}
   */
  getUpgradableWeapons() {
    return this.weapons.filter((w) => w.canUpgrade());
  }

  /**
   * 슬롯 사용 가능 여부
   */
  get hasEmptySlot() {
    return this.weapons.length < this.max_slots;
  }

  /**
   * 사용 중인 슬롯 수
   */
  get usedSlots() {
    return this.weapons.length;
  }

  /**
   * 남은 슬롯 수
   */
  get emptySlots() {
    return this.max_slots - this.weapons.length;
  }
}
