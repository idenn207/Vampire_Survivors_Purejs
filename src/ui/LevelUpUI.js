/**
 * 파일위치: /src/ui/LevelUpUI.js
 * 파일명: LevelUpUI.js
 * 용도: 레벨업 UI
 * 기능: 무기/능력치 선택 UI 표시
 * 책임: 레벨업 선택지 관리
 */

import WeaponData from '../data/WeaponData.js';
import Weapon from '../ecs/components/Weapon.js';
import eventBus from '../utils/EventBus.js';

export default class LevelUpUI {
  constructor() {
    this._is_visible = false;
    this._player = null;
    this._choices = [];
    this._container = null;

    this.#createUI();
  }

  /**
   * UI 생성
   */
  #createUI() {
    // 컨테이너 생성
    this._container = document.createElement('div');
    this._container.id = 'levelup-ui';
    this._container.className = 'levelup-container';
    this._container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #ffff00;
            border-radius: 10px;
            padding: 30px;
            display: none;
            z-index: 1000;
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

    // 선택지 컨테이너
    this._choicesContainer = document.createElement('div');
    this._choicesContainer.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
        `;
    this._container.appendChild(this._choicesContainer);

    document.body.appendChild(this._container);
  }

  /**
   * UI 표시
   * @param {Entity} player
   */
  show(player) {
    this._is_visible = true;
    this._player = player;

    // 선택지 생성
    this._choices = this.#generateChoices();

    // UI 렌더링
    this.#render();

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

    // 게임 재개
    eventBus.emit('pause_toggle');
  }

  /**
   * 선택지 생성
   * @returns {Array}
   */
  #generateChoices() {
    const choices = [];
    const stats = this._player.getComponent('Stats');

    // 1. 새 무기 (이미 없는 무기만)
    const availableWeapons = Object.keys(WeaponData).filter((id) => {
      return !this._player.getComponent('Weapon') || this._player.getComponent('Weapon').id !== id;
    });

    if (availableWeapons.length > 0 && choices.length < 3) {
      const weaponId = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
      choices.push({
        type: 'weapon',
        id: weaponId,
        name: WeaponData[weaponId].name,
        description: `Damage: ${WeaponData[weaponId].damage}`,
      });
    }

    // 2. 골드
    if (choices.length < 3) {
      choices.push({
        type: 'gold',
        amount: 50,
        name: 'Gold',
        description: '+50 Gold',
      });
    }

    // 3. 체력 회복
    if (choices.length < 3) {
      choices.push({
        type: 'heal',
        amount: 50,
        name: 'Health',
        description: '+50 HP',
      });
    }

    // 4. 스탯 증가
    if (choices.length < 3) {
      const statChoices = [
        { stat: 'attack_power', name: 'Attack Power', value: 5, description: '+5 Attack' },
        { stat: 'max_speed', name: 'Move Speed', value: 20, description: '+20 Speed' },
        { stat: 'magnet_range', name: 'Magnet Range', value: 20, description: '+20 Range' },
      ];

      const statChoice = statChoices[Math.floor(Math.random() * statChoices.length)];
      choices.push({
        type: 'stat',
        ...statChoice,
      });
    }

    return choices;
  }

  /**
   * UI 렌더링
   */
  #render() {
    this._choicesContainer.innerHTML = '';

    this._choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice-button';
      button.style.cssText = `
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                border: 2px solid #ffff00;
                border-radius: 8px;
                padding: 20px;
                width: 200px;
                color: white;
                cursor: pointer;
                transition: all 0.3s;
            `;

      button.innerHTML = `
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #ffff00;">
                    ${choice.name}
                </div>
                <div style="font-size: 14px; color: #aaa;">
                    ${choice.description}
                </div>
            `;

      // 호버 효과
      button.onmouseenter = () => {
        button.style.background = 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)';
        button.style.transform = 'scale(1.05)';
      };
      button.onmouseleave = () => {
        button.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)';
        button.style.transform = 'scale(1)';
      };

      // 클릭 이벤트
      button.onclick = () => this.#selectChoice(choice);

      this._choicesContainer.appendChild(button);
    });
  }

  /**
   * 선택지 선택
   * @param {Object} choice
   */
  #selectChoice(choice) {
    const stats = this._player.getComponent('Stats');
    const health = this._player.getComponent('Health');

    switch (choice.type) {
      case 'weapon':
        // 무기 교체
        const weaponData = WeaponData[choice.id];

        // 기존 무기 제거 후 새 무기 추가
        if (this._player.hasComponent('Weapon')) {
          this._player.removeComponent('Weapon');
        }

        const newWeapon = new Weapon(weaponData);
        this._player.addComponent(newWeapon);

        console.log(`Acquired weapon: ${weaponData.name}`);
        break;

      case 'gold':
        stats.gainGold(choice.amount);
        break;

      case 'heal':
        health.heal(choice.amount);
        break;

      case 'stat':
        stats.increaseStat(choice.stat, choice.value);

        // Rigidbody max_speed도 업데이트
        if (choice.stat === 'move_speed') {
          const rigidbody = this._player.getComponent('Rigidbody');
          if (rigidbody) {
            rigidbody.max_speed = stats.move_speed;
          }
        }
        break;
    }

    // UI 숨기기
    this.hide();
  }

  /**
   * UI 정리
   */
  destroy() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}
