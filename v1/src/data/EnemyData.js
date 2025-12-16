/**
 * 파일위치: /src/data/EnemyData.js
 * 파일명: EnemyData.js
 * 용도: 적 타입별 데이터 정의
 * 기능: 적 스탯, 능력, 드랍률 정의
 * 책임: 적 밸런스 데이터
 */

const EnemyData = {
  // 일반 적
  normal: {
    id: 'normal',
    name: '일반 적',

    // 기본 스탯
    base_health: 50,
    base_damage: 10,
    base_speed: 80,

    // 외형
    color: '#ff4444',
    size: 24,

    // 드랍률
    drop_rates: {
      exp: 1.0, // 100% 경험치 드랍
      gold: 0.5, // 50% 골드 드랍
      heal: 0.0005, // 0.05% 회복 아이템
    },

    // 웨이브당 스탯 증가율
    health_scale: 1.1,
    damage_scale: 1.05,
    speed_scale: 1.02,
  },

  // 빠른 적
  fast: {
    id: 'fast',
    name: '빠른 적',

    base_health: 30,
    base_damage: 8,
    base_speed: 150,

    color: '#44ff44',
    size: 20,

    drop_rates: {
      exp: 1.0,
      gold: 0.6,
      heal: 0.001,
    },

    health_scale: 1.1,
    damage_scale: 1.05,
    speed_scale: 1.03,
  },
};

export default EnemyData;
