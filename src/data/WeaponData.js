/**
 * 파일위치: /src/data/WeaponData.js
 * 파일명: WeaponData.js
 * 용도: 무기 데이터 정의
 * 기능: 무기 스탯, 특성 정의
 * 책임: 무기 밸런스 데이터
 */

const WeaponData = {
  // 마법 미사일 (자동, 가장 가까운 적 타겟팅)
  magic_missile: {
    id: 'magic_missile',
    name: '마법 미사일',
    type: 'auto',
    targeting: 'nearest',

    damage: 15,
    attack_speed: 1.0, // 초당 1회
    projectile_count: 1,
    projectile_speed: 400,
    range: 400,
  },

  // 랜덤 샷 (자동, 랜덤 방향)
  random_shot: {
    id: 'random_shot',
    name: '랜덤 샷',
    type: 'auto',
    targeting: 'random',

    damage: 10,
    attack_speed: 2.0, // 초당 2회
    projectile_count: 3,
    projectile_speed: 350,
    range: 300,
  },

  // 회전검 (자동, 회전 패턴)
  rotating_blade: {
    id: 'rotating_blade',
    name: '회전검',
    type: 'auto',
    targeting: 'rotating',

    damage: 20,
    attack_speed: 0.5, // 초당 0.5회
    projectile_count: 4,
    projectile_speed: 300,
    range: 200,
    rotation_speed: 2, // 초당 2 라디안
    orbit_radius: 100,
  },
};

export default WeaponData;
