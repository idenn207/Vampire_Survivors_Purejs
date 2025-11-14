/**
 * 파일위치: /src/data/StatData.js
 * 파일명: StatData.js
 * 용도: 능력치 데이터 정의
 * 기능: 능력치 타입, 효과, 강화 정의
 * 책임: 능력치 밸런스 데이터
 */

const StatData = {
  // 공격력 증가
  attack_power: {
    id: 'attack_power',
    name: '공격력 증가',
    description: '공격력이 증가합니다',
    icon_color: '#ff4444',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { attack_power: 10 },
      2: { attack_power: 25 },
      3: { attack_power: 45 },
      4: { attack_power: 70 },
      5: { attack_power: 100 },
    },
  },

  // 공격속도 증가
  attack_speed: {
    id: 'attack_speed',
    name: '공격속도 증가',
    description: '공격속도가 증가합니다',
    icon_color: '#ffaa00',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { attack_speed: 0.1 },
      2: { attack_speed: 0.15 },
      3: { attack_speed: 0.2 },
      4: { attack_speed: 0.25 },
      5: { attack_speed: 0.3 },
    },
  },

  // 최대체력 증가
  max_health: {
    id: 'max_health',
    name: '체력 증가',
    description: '최대 체력이 증가합니다',
    icon_color: '#44ff44',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { max_health: 50 },
      2: { max_health: 120 },
      3: { max_health: 200 },
      4: { max_health: 300 },
      5: { max_health: 500 },
    },
  },

  // 행운
  luck: {
    id: 'luck',
    name: '행운',
    description: '아이템 드랍률이 증가합니다',
    icon_color: '#ffff00',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { luck: 5 },
      2: { luck: 12 },
      3: { luck: 20 },
      4: { luck: 30 },
      5: { luck: 50 },
    },
  },

  // 치명타 확률
  crit_chance: {
    id: 'crit_chance',
    name: '치명타 확률',
    description: '치명타 확률이 증가합니다',
    icon_color: '#ff00ff',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { crit_chance: 0.05 },
      2: { crit_chance: 0.08 },
      3: { crit_chance: 0.12 },
      4: { crit_chance: 0.17 },
      5: { crit_chance: 0.25 },
    },
  },

  // 치명타 피해량
  crit_damage: {
    id: 'crit_damage',
    name: '치명타 피해',
    description: '치명타 피해량이 증가합니다',
    icon_color: '#ff0088',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { crit_damage: 0.1 },
      2: { crit_damage: 0.2 },
      3: { crit_damage: 0.3 },
      4: { crit_damage: 0.5 },
      5: { crit_damage: 0.8 },
    },
  },

  // 이동속도
  move_speed: {
    id: 'move_speed',
    name: '이동속도',
    description: '이동속도가 증가합니다',
    icon_color: '#00ffff',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { move_speed: 10 },
      2: { move_speed: 25 },
      3: { move_speed: 40 },
      4: { move_speed: 60 },
      5: { move_speed: 80 },
    },
  },

  // 획득범위
  pickup_range: {
    id: 'pickup_range',
    name: '획득범위',
    description: '아이템 획득 범위가 증가합니다',
    icon_color: '#00ff88',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { magnet_range: 20 },
      2: { magnet_range: 40 },
      3: { magnet_range: 60 },
      4: { magnet_range: 90 },
      5: { magnet_range: 120 },
    },
  },

  // 방어무시율
  armor_penetration: {
    id: 'armor_penetration',
    name: '방어 관통',
    description: '적의 방어력을 무시합니다',
    icon_color: '#ff8800',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { armor_penetration: 0.1 },
      2: { armor_penetration: 0.18 },
      3: { armor_penetration: 0.27 },
      4: { armor_penetration: 0.37 },
      5: { armor_penetration: 0.5 },
    },
  },

  // 피해감소율
  damage_reduction: {
    id: 'damage_reduction',
    name: '피해 감소',
    description: '받는 피해가 감소합니다',
    icon_color: '#8888ff',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { damage_reduction: 0.05 },
      2: { damage_reduction: 0.08 },
      3: { damage_reduction: 0.12 },
      4: { damage_reduction: 0.17 },
      5: { damage_reduction: 0.25 },
    },
  },

  // 골드획득량
  gold_gain: {
    id: 'gold_gain',
    name: '골드 획득량',
    description: '골드 획득량이 증가합니다',
    icon_color: '#ffdd00',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { gold_gain: 0.1 },
      2: { gold_gain: 0.2 },
      3: { gold_gain: 0.3 },
      4: { gold_gain: 0.5 },
      5: { gold_gain: 0.8 },
    },
  },

  // 경험치획득량
  exp_gain: {
    id: 'exp_gain',
    name: '경험치 획득량',
    description: '경험치 획득량이 증가합니다',
    icon_color: '#00ccff',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { exp_gain: 0.1 },
      2: { exp_gain: 0.2 },
      3: { exp_gain: 0.3 },
      4: { exp_gain: 0.5 },
      5: { exp_gain: 0.8 },
    },
  },

  // 리롤기회
  reroll_count: {
    id: 'reroll_count',
    name: '리롤 기회',
    description: '레벨업 선택지를 다시 뽑을 수 있습니다',
    icon_color: '#cc88ff',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { reroll_count: 1 },
      2: { reroll_count: 2 },
      3: { reroll_count: 3 },
      4: { reroll_count: 4 },
      5: { reroll_count: 5 },
    },
  },

  // 삭제기회
  ban_count: {
    id: 'ban_count',
    name: '삭제 기회',
    description: '선택지를 영구적으로 제거할 수 있습니다',
    icon_color: '#ff4488',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { ban_count: 1 },
      2: { ban_count: 2 },
      3: { ban_count: 3 },
      4: { ban_count: 4 },
      5: { ban_count: 5 },
    },
  },

  // 흡혈
  life_steal: {
    id: 'life_steal',
    name: '흡혈',
    description: '피해량의 일부를 체력으로 회복합니다',
    icon_color: '#ff0044',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { life_steal: 0.03 },
      2: { life_steal: 0.06 },
      3: { life_steal: 0.1 },
      4: { life_steal: 0.15 },
      5: { life_steal: 0.25 },
    },
  },

  // 체력재생
  health_regen: {
    id: 'health_regen',
    name: '체력 재생',
    description: '초당 체력이 재생됩니다',
    icon_color: '#44ff88',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { health_regen: 1 },
      2: { health_regen: 2 },
      3: { health_regen: 4 },
      4: { health_regen: 7 },
      5: { health_regen: 12 },
    },
  },

  // 공격범위
  attack_range: {
    id: 'attack_range',
    name: '공격범위',
    description: '공격 범위가 증가합니다',
    icon_color: '#ff8844',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { attack_range: 0.1 },
      2: { attack_range: 0.15 },
      3: { attack_range: 0.2 },
      4: { attack_range: 0.3 },
      5: { attack_range: 0.5 },
    },
  },

  // 쿨타임감소
  cooldown_reduction: {
    id: 'cooldown_reduction',
    name: '쿨타임 감소',
    description: '스킬 쿨타임이 감소합니다',
    icon_color: '#8844ff',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { cooldown_reduction: 0.05 },
      2: { cooldown_reduction: 0.1 },
      3: { cooldown_reduction: 0.15 },
      4: { cooldown_reduction: 0.22 },
      5: { cooldown_reduction: 0.3 },
    },
  },

  // 최종데미지
  final_damage: {
    id: 'final_damage',
    name: '최종 데미지',
    description: '모든 데미지가 증가합니다',
    icon_color: '#ff0000',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { final_damage: 0.05 },
      2: { final_damage: 0.1 },
      3: { final_damage: 0.15 },
      4: { final_damage: 0.22 },
      5: { final_damage: 0.35 },
    },
  },

  // 액티브스킬 쿨타임
  active_cooldown: {
    id: 'active_cooldown',
    name: '액티브 쿨타임 감소',
    description: '액티브 스킬 쿨타임이 감소합니다',
    icon_color: '#ff44ff',
    max_level: 5,
    upgrade_costs: [1000, 2000, 4000, 8000, 16000],
    effects: {
      1: { active_cooldown: 0.05 },
      2: { active_cooldown: 0.1 },
      3: { active_cooldown: 0.15 },
      4: { active_cooldown: 0.22 },
      5: { active_cooldown: 0.3 },
    },
  },
};

export default StatData;
