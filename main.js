/**
 * 파일위치: /main.js
 * 파일명: main.js
 * 용도: 게임 진입점
 * 기능: 게임 초기화 및 시작
 * 책임: 캔버스 설정, 씬 등록, 게임 시작
 */

import game from './src/core/Game.js';
import GameScene from './src/scenes/GameScene.js';

/**
 * 게임 초기화 및 시작
 */
function main() {
  console.log('Initializing Vampire Survivors Prototype...');

  // 캔버스 가져오기
  const canvas = document.getElementById('game-canvas');

  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  // 게임 초기화
  game.initialize(canvas, {
    width: 1280,
    height: 720,
  });

  // 씬 등록
  const gameScene = new GameScene();
  game.addScene('GameScene', gameScene);

  // 성능 모니터링 활성화
  game.togglePerformanceMode();

  // 게임 시작
  game.start('GameScene');

  console.log('Game started successfully!');
}

// DOM 로드 완료 후 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
