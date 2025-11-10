/**
 * 파일위치: /src/ui/GameOverUI.js
 * 파일명: GameOverUI.js
 * 용도: 게임오버 UI
 * 기능: 게임오버 화면 표시, 재시작
 * 책임: 게임 종료 처리
 */

import eventBus from '../utils/EventBus.js';

export default class GameOverUI {
  constructor() {
    this._is_visible = false;
    this._container = null;
    this._stats = null;

    this.#createUI();
  }

  /**
   * UI 생성
   */
  #createUI() {
    // 컨테이너 생성
    this._container = document.createElement('div');
    this._container.id = 'gameover-ui';
    this._container.className = 'gameover-container';
    this._container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            z-index: 2000;
        `;

    // 타이틀
    const title = document.createElement('h1');
    title.textContent = 'GAME OVER';
    title.style.cssText = `
            color: #ff0000;
            font-size: 64px;
            margin-bottom: 30px;
            text-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
        `;
    this._container.appendChild(title);

    // 스탯 컨테이너
    this._statsContainer = document.createElement('div');
    this._statsContainer.style.cssText = `
            color: #ffffff;
            font-size: 24px;
            text-align: center;
            margin-bottom: 40px;
            line-height: 1.8;
        `;
    this._container.appendChild(this._statsContainer);

    // 재시작 버튼
    const restartButton = document.createElement('button');
    restartButton.textContent = 'RESTART';
    restartButton.style.cssText = `
            background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
            border: 3px solid #ffffff;
            border-radius: 10px;
            padding: 15px 50px;
            font-size: 24px;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        `;

    restartButton.onmouseenter = () => {
      restartButton.style.transform = 'scale(1.1)';
      restartButton.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
    };
    restartButton.onmouseleave = () => {
      restartButton.style.transform = 'scale(1)';
      restartButton.style.boxShadow = 'none';
    };
    restartButton.onclick = () => this.#restart();

    this._container.appendChild(restartButton);

    document.body.appendChild(this._container);
  }

  /**
   * UI 표시
   * @param {Object} stats - 게임 통계
   */
  show(stats) {
    this._is_visible = true;
    this._stats = stats;

    // 스탯 렌더링
    this._statsContainer.innerHTML = `
            <div>Survived to Wave ${stats.wave}</div>
            <div>Level ${stats.level}</div>
            <div>Enemies Killed: ${stats.kills || 0}</div>
            <div>Gold Collected: ${stats.gold}</div>
        `;

    this._container.style.display = 'flex';
  }

  /**
   * UI 숨기기
   */
  hide() {
    this._is_visible = false;
    this._container.style.display = 'none';
  }

  /**
   * 재시작
   */
  #restart() {
    this.hide();
    eventBus.emit('game_restart');
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
