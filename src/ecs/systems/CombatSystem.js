/**
 * 파일위치: /src/ecs/systems/CombatSystem.js
 * 파일명: CombatSystem.js
 * 용도: Combat System
 * 기능: 전투 로직 처리 (데미지, 사망)
 * 책임: 충돌 기반 전투 처리
 */

import EnemyData from '../../data/EnemyData.js';
import eventBus from '../../utils/EventBus.js';
import System from '../System.js';

export default class CombatSystem extends System {
  constructor() {
    super();
    this._required_components = []; // 직접 충돌 이벤트 구독

    // 충돌 이벤트 구독
    eventBus.on('collision', this.#handleCollision, this);
  }

  /**
   * 충돌 처리
   * @param {Object} data - { entityA, entityB }
   */
  #handleCollision(data) {
    const { entityA, entityB } = data;

    // 투사체-적 충돌
    if (this.#isProjectile(entityA) && this.#isEnemy(entityB)) {
      this.#handleProjectileEnemyCollision(entityA, entityB);
    } else if (this.#isProjectile(entityB) && this.#isEnemy(entityA)) {
      this.#handleProjectileEnemyCollision(entityB, entityA);
    }

    // 플레이어-적 충돌
    else if (this.#isPlayer(entityA) && this.#isEnemy(entityB)) {
      this.#handlePlayerEnemyCollision(entityA, entityB);
    } else if (this.#isPlayer(entityB) && this.#isEnemy(entityA)) {
      this.#handlePlayerEnemyCollision(entityB, entityA);
    }

    // 플레이어-드랍 아이템 충돌
    else if (this.#isPlayer(entityA) && this.#isDropItem(entityB)) {
      this.#handlePlayerDropItemCollision(entityA, entityB);
    } else if (this.#isPlayer(entityB) && this.#isDropItem(entityA)) {
      this.#handlePlayerDropItemCollision(entityB, entityA);
    }
  }

  /**
   * 투사체-적 충돌 처리
   */
  #handleProjectileEnemyCollision(projectile, enemy) {
    const health = enemy.getComponent('Health');

    if (!health || health.is_dead) {
      return;
    }

    // 데미지 적용
    const damage = projectile.damage;
    health.takeDamage(damage);

    // 투사체 제거 이벤트
    eventBus.emit('projectile_hit', { projectile, enemy });

    // 적 사망 시
    if (health.is_dead) {
      eventBus.emit('enemy_killed', { enemy });
    }
  }

  /**
   * 플레이어-적 충돌 처리
   */
  #handlePlayerEnemyCollision(player, enemy) {
    const playerHealth = player.getComponent('Health');

    if (!playerHealth || playerHealth.is_dead || playerHealth.is_invincible) {
      return;
    }

    // 적의 데미지 계산
    const enemyType = enemy.enemy_type;
    const enemyData = EnemyData[enemyType];
    const wave = enemy.wave || 1;
    const damage = Math.floor(enemyData.base_damage * Math.pow(enemyData.damage_scale, wave - 1));

    // 플레이어에게 데미지
    playerHealth.takeDamage(damage);

    // 무적 시간 부여 (0.5초)
    playerHealth.setInvincible(0.5);

    // 플레이어 사망 시
    if (playerHealth.is_dead) {
      eventBus.emit('player_died');
    }
  }

  /**
   * 플레이어-드랍 아이템 충돌 처리
   */
  #handlePlayerDropItemCollision(player, item) {
    const stats = player.getComponent('Stats');

    if (!stats) {
      return;
    }

    // 드랍 아이템 타입별 처리
    switch (item.drop_type) {
      case 'exp':
        const leveledUp = stats.gainExp(item.value);
        eventBus.emit('exp_gained', { player, amount: item.value });

        if (leveledUp) {
          eventBus.emit('player_leveled_up', { player, level: stats.level });
        }
        break;

      case 'gold':
        stats.gainGold(item.value);
        eventBus.emit('gold_gained', { player, amount: item.value });
        break;
    }

    // 아이템 획득 이벤트
    eventBus.emit('item_picked_up', { item });
  }

  /**
   * 엔티티 타입 확인
   */
  #isProjectile(entity) {
    return entity.name === 'Projectile';
  }

  #isEnemy(entity) {
    return entity.name.startsWith('Enemy_');
  }

  #isPlayer(entity) {
    return entity.name === 'Player';
  }

  #isDropItem(entity) {
    return entity.name.startsWith('DropItem_');
  }

  /**
   * 시스템 정리
   */
  destroy() {
    eventBus.off('collision', this.#handleCollision, this);
  }
}
