/**
 * 파일위치: /src/ecs/components/Health.js
 * 파일명: Health.js
 * 용도: Health 컴포넌트
 * 기능: 체력, 데미지, 사망 처리
 * 책임: 엔티티의 생존 상태
 */

import eventBus from '../../utils/EventBus.js';
import Component from '../Component.js';

export default class Health extends Component {
  constructor(maxHealth = 100) {
    super();

    this.max_health = maxHealth;
    this.current_health = maxHealth;
    this.is_invincible = false; // 무적 상태
    this.invincibility_duration = 0; // 무적 지속시간
    this.is_dead = false;
  }

  /**
   * 데미지 받기
   * @param {number} amount
   * @returns {boolean} 데미지를 실제로 받았는지
   */
  takeDamage(amount) {
    if (this.is_invincible || this.is_dead) {
      return false;
    }

    this.current_health = Math.max(0, this.current_health - amount);

    // 이벤트 발행
    eventBus.emit('entity_damaged', {
      entity: this._entity,
      damage: amount,
      current_health: this.current_health,
      max_health: this.max_health,
    });

    // 사망 처리
    if (this.current_health <= 0 && !this.is_dead) {
      this.die();
    }

    return true;
  }

  /**
   * 회복
   * @param {number} amount
   */
  heal(amount) {
    if (this.is_dead) {
      return;
    }

    const oldHealth = this.current_health;
    this.current_health = Math.min(this.max_health, this.current_health + amount);

    if (this.current_health !== oldHealth) {
      eventBus.emit('entity_healed', {
        entity: this._entity,
        amount: this.current_health - oldHealth,
        current_health: this.current_health,
        max_health: this.max_health,
      });
    }
  }

  /**
   * 최대 체력 변경
   * @param {number} newMaxHealth
   * @param {boolean} healToMax - 현재 체력도 최대로 설정할지
   */
  setMaxHealth(newMaxHealth, healToMax = false) {
    this.max_health = Math.max(1, newMaxHealth);

    if (healToMax) {
      this.current_health = this.max_health;
    } else {
      this.current_health = Math.min(this.current_health, this.max_health);
    }
  }

  /**
   * 무적 상태 설정
   * @param {number} duration - 무적 지속시간 (초)
   */
  setInvincible(duration) {
    this.is_invincible = true;
    this.invincibility_duration = duration;
  }

  /**
   * 무적 타이머 업데이트
   * @param {number} deltaTime
   */
  updateInvincibility(deltaTime) {
    if (!this.is_invincible) {
      return;
    }

    this.invincibility_duration -= deltaTime;

    if (this.invincibility_duration <= 0) {
      this.is_invincible = false;
      this.invincibility_duration = 0;
    }
  }

  /**
   * 사망 처리
   */
  die() {
    if (this.is_dead) {
      return;
    }

    this.is_dead = true;
    this.current_health = 0;

    eventBus.emit('entity_died', {
      entity: this._entity,
    });
  }

  /**
   * 부활
   * @param {number} health - 부활 시 체력 (null이면 최대 체력)
   */
  revive(health = null) {
    this.is_dead = false;
    this.current_health = health !== null ? health : this.max_health;

    eventBus.emit('entity_revived', {
      entity: this._entity,
      health: this.current_health,
    });
  }

  /**
   * 체력 비율 (0~1)
   */
  get healthRatio() {
    return this.current_health / this.max_health;
  }

  /**
   * 체력 퍼센트 (0~100)
   */
  get healthPercent() {
    return this.healthRatio * 100;
  }
}
