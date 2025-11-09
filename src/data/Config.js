/**
 * 파일위치: /src/data/Config.js
 * 파일명: Config.js
 * 용도: 게임 전역 설정
 * 기능: 게임 상수, 설정값 정의
 * 책임: 게임 밸런스 조정
 */

const Config = {
  // 화면 설정
  SCREEN_WIDTH: 1280,
  SCREEN_HEIGHT: 720,
  TARGET_FPS: 60,

  // 플레이어 설정
  PLAYER: {
    MAX_HEALTH: 100,
    MOVE_SPEED: 200,
    ATTACK_POWER: 10,
    MAGNET_RANGE: 50,
    SIZE: 32,
  },

  // 적 설정
  ENEMY: {
    SPAWN_DISTANCE: 800, // 플레이어로부터 스폰 거리
    DESPAWN_DISTANCE: 1200, // 플레이어로부터 제거 거리
    MAX_ACTIVE: 200, // 동시 최대 적 수
  },

  // 웨이브 설정
  WAVE: {
    DURATION: 120, // 웨이브 지속시간 (초)
    SPAWN_RATE_BASE: 2, // 기본 스폰 주기 (초)
    SPAWN_RATE_DECREASE: 0.1, // 웨이브당 감소량
    SPAWN_RATE_MIN: 0.5, // 최소 스폰 주기
  },

  // 경험치 설정
  EXPERIENCE: {
    BASE_VALUE: 1,
    MAGNET_SPEED: 300, // 자석 끌림 속도
    PICKUP_RANGE: 30, // 획득 범위
  },

  // 골드 설정
  GOLD: {
    DROP_CHANCE: 0.5, // 드랍 확률
    BASE_VALUE: 1,
    PICKUP_RANGE: 50, // 획득 범위 (경험치보다 큼)
  },

  // 충돌 레이어
  COLLISION_LAYER: {
    PLAYER: 0,
    ENEMY: 1,
    PLAYER_PROJECTILE: 2,
    ENEMY_PROJECTILE: 3,
    PICKUP: 4,
    OBSTACLE: 5,
  },
};

export default Config;
