/**
 * 파일위치: /src/ui/LevelUpUI.js
 * 파일명: LevelUpUI.js
 * 용도: 레벨업 UI
 * 기능: 무기/능력치 선택 UI 표시, 강화 UI
 * 책임: 레벨업 선택지 관리, 골드 강화 시스템
 */

import StatData from '../data/StatData.js';
import WeaponData from '../data/WeaponData.js';
import Weapon from '../ecs/components/Weapon.js';
import eventBus from '../utils/EventBus.js';

export default class LevelUpUI {
  constructor() {
    this._is_visible = false;
    this._player = null;
    this._choices = [];
    this._container = null;
    this._banned_choices = []; // 영구 삭제된 선택지
    this._current_reroll_count = 0;

    this.#createUI();
  }

  /**
   * UI 생성
   */
  #createUI() {
    // 메인 컨테이너
    this._container = document.createElement('div');
    this._container.id = 'levelup-ui';
    this._container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      border: 3px solid #ffff00;
      border-radius: 10px;
      padding: 20px;
      display: none;
      z-index: 1000;
      width: 900px;
      max-height: 90vh;
      overflow-y: auto;
    `;

    // 타이틀
    const title = document.createElement('h2');
    title.textContent = 'LEVEL UP!';
    title.style.cssText = `
      color: #ffff00;
      text-align: center;
      margin-bottom: 20px;
      font-size: 32px;
    `;
    this._container.appendChild(title);

    // 리롤 버튼
    this._rerollButton = document.createElement('button');
    this._rerollButton.textContent = 'Reroll (0)';
    this._rerollButton.style.cssText = `
      background: #8844ff;
      border: 2px solid #ffffff;
      border-radius: 5px;
      padding: 8px 16px;
      color: white;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 15px;
    `;
    this._rerollButton.onclick = () => this.#rerollChoices();
    this._container.appendChild(this._rerollButton);

    // 선택지 컨테이너
    this._choicesContainer = document.createElement('div');
    this._choicesContainer.style.cssText = `
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    `;
    this._container.appendChild(this._choicesContainer);

    // 구분선
    const divider = document.createElement('hr');
    divider.style.cssText = `
      border: 1px solid #444;
      margin: 20px 0;
    `;
    this._container.appendChild(divider);

    // 강화 섹션 타이틀
    const upgradeTitle = document.createElement('h3');
    upgradeTitle.textContent = 'Upgrade with Gold';
    upgradeTitle.style.cssText = `
      color: #ffdd00;
      text-align: center;
      margin-bottom: 15px;
      font-size: 20px;
    `;
    this._container.appendChild(upgradeTitle);

    // 강화 컨테이너 (좌우 분할)
    this._upgradeContainer = document.createElement('div');
    this._upgradeContainer.style.cssText = `
      display: flex;
      gap: 20px;
    `;
    this._container.appendChild(this._upgradeContainer);

    // 무기 강화 섹션
    const weaponSection = document.createElement('div');
    weaponSection.style.cssText = `
      flex: 1;
      border: 2px solid #ff8800;
      border-radius: 5px;
      padding: 10px;
    `;
    const weaponTitle = document.createElement('h4');
    weaponTitle.textContent = 'Weapons';
    weaponTitle.style.cssText = `
      color: #ff8800;
      margin-bottom: 10px;
      text-align: center;
    `;
    weaponSection.appendChild(weaponTitle);

    this._weaponUpgradeContainer = document.createElement('div');
    this._weaponUpgradeContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    `;
    weaponSection.appendChild(this._weaponUpgradeContainer);
    this._upgradeContainer.appendChild(weaponSection);

    // 능력치 강화 섹션
    const abilitySection = document.createElement('div');
    abilitySection.style.cssText = `
      flex: 1;
      border: 2px solid #00aaff;
      border-radius: 5px;
      padding: 10px;
    `;
    const abilityTitle = document.createElement('h4');
    abilityTitle.textContent = 'Abilities';
    abilityTitle.style.cssText = `
      color: #00aaff;
      margin-bottom: 10px;
      text-align: center;
    `;
    abilitySection.appendChild(abilityTitle);

    this._abilityUpgradeContainer = document.createElement('div');
    this._abilityUpgradeContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    `;
    abilitySection.appendChild(this._abilityUpgradeContainer);
    this._upgradeContainer.appendChild(abilitySection);

    // 툴팁
    this._tooltip = document.createElement('div');
    this._tooltip.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid #ffffff;
      border-radius: 5px;
      padding: 10px;
      color: white;
      font-size: 14px;
      display: none;
      pointer-events: none;
      z-index: 2000;
      max-width: 300px;
    `;
    document.body.appendChild(this._tooltip);

    document.body.appendChild(this._container);
  }

  /**
   * UI 표시
   * @param {Entity} player
   */
  show(player) {
    this._is_visible = true;
    this._player = player;

    const stats = player.getComponent('Stats');
    this._current_reroll_count = stats.reroll_count;

    // 리롤 버튼 업데이트
    this._rerollButton.textContent = `Reroll (${this._current_reroll_count})`;
    this._rerollButton.disabled = this._current_reroll_count <= 0;

    // 선택지 생성
    this._choices = this.#generateChoices();

    // UI 렌더링
    this.#renderChoices();
    this.#renderUpgradeSection();

    this._container.style.display = 'block';

    // 게임 일시정지
    eventBus.emit('pause_toggle');
  }

  /**
   * UI 숨기기
   */
  hide() {
    this._is_visible = false;
    this._container.style.display = 'none';
    this._tooltip.style.display = 'none';

    // 게임 재개
    eventBus.emit('pause_toggle');
  }

  /**
   * 선택지 생성 (무조건 5개)
   */
  #generateChoices() {
    const choices = [];
    const stats = this._player.getComponent('Stats');
    const weaponSlot = this._player.getComponent('WeaponSlot');

    const canAddWeapon = weaponSlot ? weaponSlot.hasEmptySlot : true;
    const canAddAbility = stats.canAddAbility;
    const bothFull = !canAddWeapon && !canAddAbility;

    // 1. 무기 또는 능력치 최소 1개 보장
    let guaranteedWeaponOrAbility = 0;

    if (canAddWeapon) {
      choices.push(this.#generateWeaponChoice());
      guaranteedWeaponOrAbility++;
    }

    if (canAddAbility && guaranteedWeaponOrAbility < 2) {
      choices.push(this.#generateAbilityChoice());
      guaranteedWeaponOrAbility++;
    }

    // 2. 나머지 선택지 채우기
    while (choices.length < 5) {
      const rand = Math.random();

      if (bothFull) {
        // 둘 다 꽉 찬 경우: 능력치 스탯 증가, 골드, HP
        if (rand < 0.4) {
          choices.push(this.#generateStatIncreaseChoice());
        } else if (rand < 0.7) {
          choices.push(this.#generateGoldChoice());
        } else {
          choices.push(this.#generateHealChoice());
        }
      } else {
        // 일반 경우
        if (rand < 0.3 && canAddWeapon) {
          choices.push(this.#generateWeaponChoice());
        } else if (rand < 0.5 && canAddAbility) {
          choices.push(this.#generateAbilityChoice());
        } else if (rand < 0.7) {
          choices.push(this.#generateGoldChoice());
        } else {
          choices.push(this.#generateHealChoice());
        }
      }
    }

    return choices;
  }

  /**
   * 무기 선택지 생성
   */
  #generateWeaponChoice() {
    const weaponSlot = this._player.getComponent('WeaponSlot');
    const existingIds = weaponSlot ? weaponSlot.weapons.map((w) => w.id) : [];

    // 보유하지 않은 무기 중 랜덤 선택
    const availableWeapons = Object.keys(WeaponData).filter(
      (id) => !existingIds.includes(id) && !WeaponData[id].is_unique && !this._banned_choices.includes(id)
    );

    if (availableWeapons.length === 0) {
      return this.#generateGoldChoice();
    }

    const weaponId = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
    const weaponData = WeaponData[weaponId];

    return {
      type: 'weapon',
      id: weaponId,
      name: weaponData.name,
      description: weaponData.description,
      icon_color: weaponData.icon_color,
    };
  }

  /**
   * 능력치 선택지 생성
   */
  #generateAbilityChoice() {
    const stats = this._player.getComponent('Stats');
    const existingIds = stats.ability_slots.map((a) => a.id);

    const availableAbilities = Object.keys(StatData).filter((id) => !existingIds.includes(id) && !this._banned_choices.includes(id));

    if (availableAbilities.length === 0) {
      return this.#generateGoldChoice();
    }

    const abilityId = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
    const abilityData = StatData[abilityId];

    return {
      type: 'ability',
      id: abilityId,
      name: abilityData.name,
      description: abilityData.description,
      icon_color: abilityData.icon_color,
    };
  }

  /**
   * 골드 선택지
   */
  #generateGoldChoice() {
    const amount = 500;
    return {
      type: 'gold',
      amount,
      name: 'Gold',
      description: `+${amount} Gold`,
      icon_color: '#ffdd00',
    };
  }

  /**
   * 체력 회복 선택지
   */
  #generateHealChoice() {
    const health = this._player.getComponent('Health');
    const amount = Math.floor(health.max_health * 0.5);

    return {
      type: 'heal',
      amount,
      name: 'Health',
      description: `+${amount} HP`,
      icon_color: '#00ff00',
    };
  }

  /**
   * 능력치 스탯 증가 선택지 (슬롯 미사용)
   */
  #generateStatIncreaseChoice() {
    const statOptions = [
      { stat: 'attack_power', name: 'Attack Power', value: 5 },
      { stat: 'max_health', name: 'Max Health', value: 50 },
      { stat: 'attack_speed', name: 'Attack Speed', value: 0.1 },
      { stat: 'move_speed', name: 'Move Speed', value: 10 },
      { stat: 'crit_chance', name: 'Crit Chance', value: 0.05 },
      { stat: 'crit_damage', name: 'Crit Damage', value: 0.1 },
      { stat: 'luck', name: 'Luck', value: 5 },
      { stat: 'gold_gain', name: 'Gold Gain', value: 0.1 },
    ];

    const choice = statOptions[Math.floor(Math.random() * statOptions.length)];

    return {
      type: 'stat_increase',
      stat: choice.stat,
      value: choice.value,
      name: choice.name,
      description: `+${choice.value} ${choice.name}`,
      icon_color: '#aaaaaa',
    };
  }

  /**
   * 선택지 리롤
   */
  #rerollChoices() {
    const stats = this._player.getComponent('Stats');

    if (stats.reroll_count <= 0) {
      return;
    }

    stats.reroll_count--;
    this._current_reroll_count = stats.reroll_count;

    // 새 선택지 생성
    this._choices = this.#generateChoices();
    this.#renderChoices();

    // 리롤 버튼 업데이트
    this._rerollButton.textContent = `Reroll (${this._current_reroll_count})`;
    this._rerollButton.disabled = this._current_reroll_count <= 0;
  }

  /**
   * 선택지 렌더링
   */
  #renderChoices() {
    this._choicesContainer.innerHTML = '';

    this._choices.forEach((choice) => {
      const button = document.createElement('button');
      button.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border: 2px solid ${choice.icon_color};
        border-radius: 8px;
        padding: 15px;
        width: 160px;
        color: white;
        cursor: pointer;
        transition: all 0.3s;
      `;

      button.innerHTML = `
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: ${choice.icon_color};">
          ${choice.name}
        </div>
        <div style="font-size: 12px; color: #aaa;">
          ${choice.description}
        </div>
      `;

      button.onmouseenter = (e) => {
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = `0 0 15px ${choice.icon_color}`;
      };
      button.onmouseleave = () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
      };

      button.onclick = () => this.#selectChoice(choice);

      // 삭제 기능 (우클릭)
      button.oncontextmenu = (e) => {
        e.preventDefault();
        this.#banChoice(choice);
      };

      this._choicesContainer.appendChild(button);
    });
  }

  /**
   * 강화 섹션 렌더링
   */
  #renderUpgradeSection() {
    const weaponSlot = this._player.getComponent('WeaponSlot');
    const stats = this._player.getComponent('Stats');

    // 무기 강화
    this._weaponUpgradeContainer.innerHTML = '';
    if (weaponSlot) {
      weaponSlot.getUpgradableWeapons().forEach((weapon) => {
        this._weaponUpgradeContainer.appendChild(this.#createUpgradeButton(weapon, 'weapon'));
      });
    }

    // 능력치 강화
    this._abilityUpgradeContainer.innerHTML = '';
    stats.ability_slots.forEach((ability) => {
      const abilityData = StatData[ability.id];
      if (ability.level < abilityData.max_level) {
        this._abilityUpgradeContainer.appendChild(this.#createUpgradeButton(ability, 'ability'));
      }
    });
  }

  /**
   * 강화 버튼 생성
   */
  #createUpgradeButton(item, type) {
    const stats = this._player.getComponent('Stats');
    const cost = type === 'weapon' ? item.getUpgradeCost() : StatData[item.id].upgrade_costs[item.level - 1];
    const canAfford = stats.gold >= cost;

    const button = document.createElement('button');
    button.style.cssText = `
      background: ${canAfford ? '#2a2a2a' : '#1a1a1a'};
      border: 2px solid ${canAfford ? '#ffdd00' : '#555'};
      border-radius: 5px;
      padding: 8px;
      color: ${canAfford ? 'white' : '#777'};
      cursor: ${canAfford ? 'pointer' : 'not-allowed'};
      font-size: 12px;
      text-align: left;
    `;

    button.innerHTML = `
      <div style="font-weight: bold;">${item.name} Lv.${item.level}</div>
      <div style="font-size: 10px; color: #ffdd00;">${cost}G</div>
    `;

    button.onmouseenter = (e) => this.#showTooltip(e, item, type);
    button.onmouseleave = () => this.#hideTooltip();

    if (canAfford) {
      button.onclick = () => this.#upgradeItem(item, type);
    }

    return button;
  }

  /**
   * 툴팁 표시
   */
  #showTooltip(event, item, type) {
    const tooltipContent = this.#generateTooltipContent(item, type);

    this._tooltip.innerHTML = tooltipContent;
    this._tooltip.style.display = 'block';
    this._tooltip.style.left = event.clientX + 10 + 'px';
    this._tooltip.style.top = event.clientY + 10 + 'px';
  }

  /**
   * 툴팁 숨기기
   */
  #hideTooltip() {
    this._tooltip.style.display = 'none';
  }

  /**
   * 툴팁 내용 생성
   */
  #generateTooltipContent(item, type) {
    if (type === 'weapon') {
      const nextLevel = item.level + 1;
      const upgrades = item.upgrades[nextLevel];

      let content = `<strong>${item.name} Lv.${item.level} → Lv.${nextLevel}</strong><br><br>`;

      if (upgrades) {
        Object.keys(upgrades).forEach((key) => {
          const currentValue = item[key];
          const nextValue = upgrades[key];
          content += `${key}: ${currentValue} → ${nextValue}<br>`;
        });
      }

      return content;
    } else {
      const abilityData = StatData[item.id];
      const currentEffects = item.effects;
      const nextEffects = abilityData.effects[item.level + 1];

      let content = `<strong>${item.name} Lv.${item.level} → Lv.${item.level + 1}</strong><br><br>`;

      Object.keys(nextEffects).forEach((key) => {
        const currentValue = currentEffects[key];
        const nextValue = nextEffects[key];
        content += `${key}: ${currentValue} → ${nextValue}<br>`;
      });

      return content;
    }
  }

  /**
   * 선택지 선택
   */
  #selectChoice(choice) {
    const stats = this._player.getComponent('Stats');
    const health = this._player.getComponent('Health');
    const weaponSlot = this._player.getComponent('WeaponSlot');

    switch (choice.type) {
      case 'weapon':
        const weaponData = WeaponData[choice.id];
        const newWeapon = new Weapon(weaponData);
        if (weaponSlot) {
          weaponSlot.addWeapon(newWeapon);
          stats.weapon_slot_count++;
        }
        console.log(`Acquired weapon: ${weaponData.name}`);
        break;

      case 'ability':
        const abilityData = StatData[choice.id];
        stats.addAbility(abilityData);
        console.log(`Acquired ability: ${abilityData.name}`);
        break;

      case 'gold':
        stats.gainGold(choice.amount);
        break;

      case 'heal':
        health.heal(choice.amount);
        break;

      case 'stat_increase':
        stats.increaseStat(choice.stat, choice.value);

        // 특수 처리
        if (choice.stat === 'move_speed') {
          const rigidbody = this._player.getComponent('Rigidbody');
          if (rigidbody) {
            rigidbody.max_speed = stats.move_speed;
          }
        } else if (choice.stat === 'max_health') {
          health.setMaxHealth(health.max_health + choice.value, false);
        }
        break;
    }

    this.hide();
  }

  /**
   * 아이템 강화
   */
  #upgradeItem(item, type) {
    const stats = this._player.getComponent('Stats');
    const weaponSlot = this._player.getComponent('WeaponSlot');

    let cost = 0;
    let success = false;

    if (type === 'weapon') {
      cost = item.getUpgradeCost();
      if (stats.spendGold(cost)) {
        success = item.upgrade(WeaponData[item.id]);
      }
    } else {
      const abilityData = StatData[item.id];
      cost = abilityData.upgrade_costs[item.level - 1];
      if (stats.spendGold(cost)) {
        success = stats.upgradeAbility(item.id, abilityData);
      }
    }

    if (success) {
      console.log(`Upgraded ${item.name} to Lv.${item.level}`);
      this.#renderUpgradeSection();
    }
  }

  /**
   * 선택지 영구 삭제
   */
  #banChoice(choice) {
    const stats = this._player.getComponent('Stats');

    if (stats.ban_count <= 0) {
      return;
    }

    stats.ban_count--;

    if (choice.type === 'weapon') {
      this._banned_choices.push(choice.id);
    } else if (choice.type === 'ability') {
      this._banned_choices.push(choice.id);
    }

    // 새 선택지 생성
    this._choices = this.#generateChoices();
    this.#renderChoices();

    console.log(`Banned choice: ${choice.name}`);
  }

  /**
   * UI 정리
   */
  destroy() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    if (this._tooltip && this._tooltip.parentNode) {
      this._tooltip.parentNode.removeChild(this._tooltip);
    }
  }
}
