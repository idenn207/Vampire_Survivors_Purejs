/**
 * 파일위치: /src/data/WeaponData.js
 * 파일명: WeaponData.js
 * 용도: 무기 데이터 정의
 * 기능: 무기 스탯, 특성, 진화 레시피 정의
 * 책임: 무기 밸런스 데이터
 */

// 무기 등급
export const WeaponGrade = {
  COMMON: 0, // 미진화
  RARE: 1, // 1단계 진화
  EPIC: 2, // 2단계 진화
  UNIQUE: 3, // 3단계 진화
  LEGENDARY: 4, // 4단계 진화 (전용무기만)
};

export const WeaponGradeColors = {
  [WeaponGrade.COMMON]: '#ffffff',
  [WeaponGrade.RARE]: '#00aaff',
  [WeaponGrade.EPIC]: '#aa00ff',
  [WeaponGrade.UNIQUE]: '#ff8800',
  [WeaponGrade.LEGENDARY]: '#ffdd00',
};

// 무기 타입
export const WeaponType = {
  MANUAL: 'manual', // 수동 조준
  AUTO: 'auto', // 자동 공격
};

// 공격 타입
export const AttackType = {
  MELEE_SWING: 'melee_swing', // 근접 휘두르기
  PROJECTILE: 'projectile', // 투사체
  LASER: 'laser', // 레이저
  DIRECT_DAMAGE: 'direct_damage', // 직접 피해
  AREA_DAMAGE: 'area_damage', // 장판형
};

const WeaponData = {
  // ========================================
  // 수동 조준 무기 (5개)
  // ========================================

  // 1. 근접 휘두르기 (시작 무기)
  melee_slash: {
    id: 'melee_slash',
    name: '근접 검',
    description: '마우스 방향으로 검을 휘두릅니다',
    type: WeaponType.MANUAL,
    attack_type: AttackType.MELEE_SWING,
    grade: WeaponGrade.COMMON,
    icon_color: '#cccccc',

    // 기본 스탯
    damage_multiplier: 100, // 공격력의 100%
    attack_speed: 1.0, // 초당 1회
    range: 50, // 사거리
    attack_angle: 60, // 공격 범위 (각도)
    attack_duration: 0.3, // 휘두르기 지속시간
    hits_per_attack: 1, // 1회 공격당 타격 횟수

    // 강화
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 120, hits_per_attack: 2 },
      3: { damage_multiplier: 140, range: 70, attack_angle: 80 },
      4: { damage_multiplier: 170, hits_per_attack: 3, attack_speed: 1.2 },
      5: { damage_multiplier: 220, range: 90, attack_angle: 100, hits_per_attack: 4 },
    },

    // 진화
    evolutions: [
      {
        recipe: ['melee_slash_5', 'fire_ball_5'],
        result: 'flame_sword',
      },
      {
        recipe: ['melee_slash_5', 'magic_missile_5'],
        result: 'magic_blade',
      },
    ],
  },

  // 2. 원거리 총 (Rifle)
  rifle: {
    id: 'rifle',
    name: '라이플',
    description: '마우스 방향으로 자동 연사합니다',
    type: WeaponType.MANUAL,
    attack_type: AttackType.PROJECTILE,
    grade: WeaponGrade.COMMON,
    icon_color: '#888888',

    damage_multiplier: 80,
    attack_speed: 3.0, // 초당 3회
    projectile_count: 1,
    projectile_speed: 600,
    range: 500,
    pierce: 0, // 관통

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 95, attack_speed: 3.5 },
      3: { damage_multiplier: 115, projectile_count: 2, pierce: 1 },
      4: { damage_multiplier: 140, attack_speed: 4.0, pierce: 2 },
      5: { damage_multiplier: 180, projectile_count: 3, pierce: 3 },
    },

    evolutions: [
      {
        recipe: ['rifle_5', 'lightning_bolt_5'],
        result: 'railgun',
      },
    ],
  },

  // 3. 레이저건
  laser_gun: {
    id: 'laser_gun',
    name: '레이저건',
    description: '마우스 방향으로 레이저를 발사합니다',
    type: WeaponType.MANUAL,
    attack_type: AttackType.LASER,
    grade: WeaponGrade.COMMON,
    icon_color: '#00ffff',

    damage_multiplier: 150,
    attack_speed: 0.5, // 초당 0.5회
    range: 800, // 화면 내
    laser_width: 5,
    duration: 1.0, // 지속시간
    pierce: 999, // 무한 관통
    laser_type: 'straight', // straight | circular | homing

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 180, laser_width: 8 },
      3: { damage_multiplier: 220, duration: 1.3, laser_type: 'circular' },
      4: { damage_multiplier: 270, laser_width: 12, attack_speed: 0.7 },
      5: { damage_multiplier: 350, duration: 1.5, laser_type: 'homing' },
    },

    evolutions: [],
  },

  // 4. 산탄총
  shotgun: {
    id: 'shotgun',
    name: '산탄총',
    description: '여러 발의 탄환을 동시에 발사합니다',
    type: WeaponType.MANUAL,
    attack_type: AttackType.PROJECTILE,
    grade: WeaponGrade.COMMON,
    icon_color: '#ff8844',

    damage_multiplier: 60,
    attack_speed: 0.8,
    projectile_count: 5,
    projectile_speed: 500,
    range: 300,
    spread_angle: 30, // 탄착 퍼짐 각도

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 70, projectile_count: 7 },
      3: { damage_multiplier: 85, range: 350, spread_angle: 40 },
      4: { damage_multiplier: 105, projectile_count: 9, attack_speed: 1.0 },
      5: { damage_multiplier: 135, projectile_count: 12, spread_angle: 50 },
    },

    evolutions: [],
  },

  // 5. 크로스보우
  crossbow: {
    id: 'crossbow',
    name: '크로스보우',
    description: '강력한 화살을 발사합니다',
    type: WeaponType.MANUAL,
    attack_type: AttackType.PROJECTILE,
    grade: WeaponGrade.COMMON,
    icon_color: '#8b4513',

    damage_multiplier: 200,
    attack_speed: 0.5,
    projectile_count: 1,
    projectile_speed: 700,
    range: 600,
    pierce: 3,

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 240, pierce: 5 },
      3: { damage_multiplier: 290, attack_speed: 0.6, projectile_count: 2 },
      4: { damage_multiplier: 360, pierce: 8 },
      5: { damage_multiplier: 480, projectile_count: 3, pierce: 10 },
    },

    evolutions: [],
  },

  // ========================================
  // 자동 공격 무기 (10개)
  // ========================================

  // 6. 마법 미사일 (투사체, 가장 가까운 적)
  magic_missile: {
    id: 'magic_missile',
    name: '마법 미사일',
    description: '가장 가까운 적을 자동으로 공격합니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.PROJECTILE,
    targeting: 'nearest',
    grade: WeaponGrade.COMMON,
    icon_color: '#0088ff',

    damage_multiplier: 100,
    attack_speed: 1.0,
    projectile_count: 1,
    projectile_speed: 400,
    range: 400,
    pierce: 0,

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 120, projectile_count: 2 },
      3: { damage_multiplier: 145, range: 500, pierce: 1 },
      4: { damage_multiplier: 180, projectile_count: 3, attack_speed: 1.2 },
      5: { damage_multiplier: 230, pierce: 2, range: 600 },
    },

    evolutions: [
      {
        recipe: ['magic_missile_5', 'fire_ball_5'],
        result: 'hellfire_storm',
      },
    ],
  },

  // 7. 파이어볼 (투사체, 랜덤 방향)
  fire_ball: {
    id: 'fire_ball',
    name: '파이어볼',
    description: '랜덤 방향으로 화염구를 발사합니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.PROJECTILE,
    targeting: 'random',
    grade: WeaponGrade.COMMON,
    icon_color: '#ff4400',

    damage_multiplier: 90,
    attack_speed: 1.5,
    projectile_count: 3,
    projectile_speed: 350,
    range: 350,
    explosion_radius: 30, // 폭발 범위

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 110, projectile_count: 4 },
      3: { damage_multiplier: 135, explosion_radius: 40, attack_speed: 1.8 },
      4: { damage_multiplier: 170, projectile_count: 5, range: 400 },
      5: { damage_multiplier: 220, explosion_radius: 60, projectile_count: 6 },
    },

    evolutions: [],
  },

  // 8. 회전검 (투사체, 회전 패턴)
  rotating_blade: {
    id: 'rotating_blade',
    name: '회전검',
    description: '플레이어 주변을 회전하며 공격합니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.PROJECTILE,
    targeting: 'rotating',
    grade: WeaponGrade.COMMON,
    icon_color: '#cccccc',

    damage_multiplier: 120,
    attack_speed: 0.3, // 초당 0.3회 (재생성)
    projectile_count: 4,
    projectile_speed: 200,
    range: 150,
    rotation_speed: 3, // 초당 3 라디안
    orbit_radius: 80,

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 145, projectile_count: 5 },
      3: { damage_multiplier: 175, orbit_radius: 100, rotation_speed: 4 },
      4: { damage_multiplier: 220, projectile_count: 6, range: 180 },
      5: { damage_multiplier: 290, orbit_radius: 120, projectile_count: 8 },
    },

    evolutions: [],
  },

  // 9. 번개 (직접 피해, 다중 타겟)
  lightning_bolt: {
    id: 'lightning_bolt',
    name: '번개',
    description: '무작위 적에게 번개를 내려칩니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.DIRECT_DAMAGE,
    targeting: 'random_multiple',
    grade: WeaponGrade.COMMON,
    icon_color: '#ffff00',

    damage_multiplier: 150,
    attack_speed: 1.5,
    target_count: 3, // 동시 타겟 수
    range: 500,
    chain_count: 0, // 전파 횟수
    chain_damage_multiplier: 0.5, // 전파 피해 배율

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 180, target_count: 4 },
      3: { damage_multiplier: 220, chain_count: 1, range: 600 },
      4: { damage_multiplier: 280, target_count: 5, chain_count: 2 },
      5: { damage_multiplier: 370, target_count: 7, chain_count: 3 },
    },

    evolutions: [],
  },

  // 10. 독구름 (장판형)
  poison_cloud: {
    id: 'poison_cloud',
    name: '독구름',
    description: '독구름을 생성하여 지속 피해를 입힙니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.AREA_DAMAGE,
    targeting: 'random_area',
    grade: WeaponGrade.COMMON,
    icon_color: '#00ff00',

    damage_multiplier: 50, // 틱당 피해
    attack_speed: 3.0, // 생성 주기
    area_radius: 80, // 장판 반경
    duration: 4.0, // 지속시간
    tick_rate: 2, // 초당 데미지 횟수
    cloud_count: 1, // 동시 생성 장판 수
    spawn_range: 200, // 플레이어 기준 생성 범위

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 60, duration: 5.0 },
      3: { damage_multiplier: 75, area_radius: 100, cloud_count: 2 },
      4: { damage_multiplier: 95, tick_rate: 3, duration: 6.0 },
      5: { damage_multiplier: 125, cloud_count: 3, area_radius: 120 },
    },

    evolutions: [],
  },

  // 11. 화염장판
  fire_zone: {
    id: 'fire_zone',
    name: '화염장판',
    description: '화염장판을 생성하여 지속 피해를 입힙니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.AREA_DAMAGE,
    targeting: 'random_area',
    grade: WeaponGrade.COMMON,
    icon_color: '#ff6600',

    damage_multiplier: 60,
    attack_speed: 2.5,
    area_radius: 70,
    duration: 5.0,
    tick_rate: 3,
    cloud_count: 1,
    spawn_range: 200,

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 75, tick_rate: 4 },
      3: { damage_multiplier: 95, area_radius: 90, cloud_count: 2 },
      4: { damage_multiplier: 120, duration: 6.0, tick_rate: 5 },
      5: { damage_multiplier: 160, cloud_count: 3, area_radius: 110 },
    },

    evolutions: [],
  },

  // 12. 부메랑
  boomerang: {
    id: 'boomerang',
    name: '부메랑',
    description: '부메랑을 던져 왕복하며 공격합니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.PROJECTILE,
    targeting: 'nearest',
    grade: WeaponGrade.COMMON,
    icon_color: '#ffaa00',

    damage_multiplier: 110,
    attack_speed: 1.2,
    projectile_count: 1,
    projectile_speed: 350,
    range: 300,
    pierce: 999, // 무한 관통
    return_speed: 450, // 복귀 속도

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 135, projectile_count: 2 },
      3: { damage_multiplier: 165, range: 350, attack_speed: 1.4 },
      4: { damage_multiplier: 210, projectile_count: 3 },
      5: { damage_multiplier: 280, range: 400, projectile_count: 4 },
    },

    evolutions: [],
  },

  // 13. 빙결 (직접 피해 + 둔화)
  frost_nova: {
    id: 'frost_nova',
    name: '빙결',
    description: '주변 적을 얼리고 둔화시킵니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.DIRECT_DAMAGE,
    targeting: 'nearest_area',
    grade: WeaponGrade.COMMON,
    icon_color: '#00ccff',

    damage_multiplier: 100,
    attack_speed: 2.0,
    range: 250,
    area_radius: 150, // 효과 범위
    slow_duration: 2.0, // 둔화 지속시간
    slow_multiplier: 0.5, // 둔화 정도 (50% 속도)

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 125, area_radius: 180 },
      3: { damage_multiplier: 155, slow_duration: 2.5, slow_multiplier: 0.4 },
      4: { damage_multiplier: 200, area_radius: 220, attack_speed: 2.3 },
      5: { damage_multiplier: 270, slow_duration: 3.0, slow_multiplier: 0.3 },
    },

    evolutions: [],
  },

  // 14. 유성
  meteor: {
    id: 'meteor',
    name: '유성',
    description: '하늘에서 유성이 떨어집니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.AREA_DAMAGE,
    targeting: 'random_area',
    grade: WeaponGrade.COMMON,
    icon_color: '#ff0000',

    damage_multiplier: 200,
    attack_speed: 3.0,
    area_radius: 100,
    duration: 0.5, // 폭발 지속
    tick_rate: 1, // 단타
    cloud_count: 1,
    spawn_range: 300,

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 250, area_radius: 120 },
      3: { damage_multiplier: 310, cloud_count: 2, attack_speed: 2.7 },
      4: { damage_multiplier: 400, area_radius: 140 },
      5: { damage_multiplier: 550, cloud_count: 3, area_radius: 160 },
    },

    evolutions: [],
  },

  // 15. 독침 (투사체, 도트 데미지)
  poison_dart: {
    id: 'poison_dart',
    name: '독침',
    description: '적에게 독침을 발사하여 지속 피해를 입힙니다',
    type: WeaponType.AUTO,
    attack_type: AttackType.PROJECTILE,
    targeting: 'nearest',
    grade: WeaponGrade.COMMON,
    icon_color: '#88ff00',

    damage_multiplier: 70,
    attack_speed: 2.0,
    projectile_count: 2,
    projectile_speed: 450,
    range: 400,
    dot_damage: 20, // 초당 도트 데미지
    dot_duration: 3.0, // 도트 지속시간

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 85, projectile_count: 3, dot_damage: 25 },
      3: { damage_multiplier: 105, dot_duration: 4.0, attack_speed: 2.3 },
      4: { damage_multiplier: 135, projectile_count: 4, dot_damage: 35 },
      5: { damage_multiplier: 180, dot_duration: 5.0, projectile_count: 5 },
    },

    evolutions: [],
  },

  // ========================================
  // 전용무기 (캐릭터 전용)
  // ========================================

  vampire_fang: {
    id: 'vampire_fang',
    name: '뱀파이어의 송곳니',
    description: '흡혈귀의 힘을 담은 전용무기',
    type: WeaponType.MANUAL,
    attack_type: AttackType.MELEE_SWING,
    grade: WeaponGrade.COMMON,
    is_unique: true, // 전용무기 플래그
    icon_color: '#ff0066',

    damage_multiplier: 120,
    attack_speed: 1.2,
    range: 60,
    attack_angle: 70,
    attack_duration: 0.25,
    hits_per_attack: 2,
    life_steal: 0.1, // 고유 능력: 10% 흡혈

    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    upgrades: {
      2: { damage_multiplier: 150, hits_per_attack: 3, life_steal: 0.15 },
      3: { damage_multiplier: 190, range: 75, attack_angle: 90, life_steal: 0.2 },
      4: { damage_multiplier: 250, hits_per_attack: 4, attack_speed: 1.5 },
      5: { damage_multiplier: 340, range: 90, life_steal: 0.3, hits_per_attack: 5 },
    },

    // 전용무기는 최대 4단계 진화
    evolutions: [
      {
        recipe: ['vampire_fang_5', 'melee_slash_5'],
        result: 'vampire_fang_evolved1',
        unlocks_passive: 0, // 고유패시브 1 활성화
      },
    ],
  },
};

export default WeaponData;
