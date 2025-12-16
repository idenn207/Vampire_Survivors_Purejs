# Phase 1 구현 완료 보고서

## 1. 구현 개요

뱀파이어 서바이버 스타일 게임의 Phase 1을 구현했습니다. 프로토타입에서 본격적인 게임 시스템으로 확장하여 **무기/능력치 시스템**, **레벨업 UI**, **골드 강화 시스템**을 완성했습니다.

---

## 2. 핵심 구현 내용

### 2.1 데이터 시스템 (신규)

#### StatData.js (능력치 정의)

- **20종 능력치** 정의
  - 전투: 공격력, 공격속도, 치명타확률, 치명타피해, 방어관통, 피해감소
  - 생존: 최대체력, 체력재생, 흡혈, 이동속도
  - 유틸: 골드획득량, 경험치획득량, 행운, 획득범위
  - 특수: 쿨타임감소, 공격범위, 최종데미지, 리롤기회, 삭제기회
- **5단계 레벨 시스템**
  - 각 레벨마다 효과 증가
  - 골드 비용: 1000 → 2000 → 4000 → 8000 → 16000

#### WeaponData.js (무기 정의)

- **16개 무기** (15개 일반 + 1개 전용)

  - 수동 무기 5개: 근접검, 라이플, 레이저건, 산탄총, 크로스보우
  - 자동 무기 10개: 마법미사일, 파이어볼, 회전검, 번개, 독구름, 화염장판, 부메랑, 빙결, 유성, 독침
  - 전용무기 1개: 뱀파이어의 송곳니 (흡혈 고유능력)

- **무기 등급 시스템**

  ```javascript
  COMMON (0) → RARE (1) → EPIC (2) → UNIQUE (3) → LEGENDARY (4)
  ```

- **무기 타입**

  - `WeaponType`: manual (수동 조준), auto (자동 공격)
  - `AttackType`: melee_swing, projectile, laser, direct_damage, area_damage

- **진화 시스템**
  ```javascript
  evolutions: [
    {
      recipe: ['melee_slash_5', 'fire_ball_5'], // 레벨5 무기 2개 필요
      result: 'flame_sword', // 진화 결과
    },
  ];
  ```

### 2.2 컴포넌트 시스템

#### Stats 컴포넌트 (대수정)

```javascript
// 20종 능력치 필드 추가
this.crit_chance = 0.05;
this.armor_penetration = 0;
this.gold_gain = 0;
this.reroll_count = 0;
// ... 등

// 능력치 슬롯 (최대 10개)
this.ability_slots = []; // { id, name, level, effects }

// 메서드
addAbility(abilityData); // 능력치 추가
upgradeAbility(abilityId); // 능력치 강화
gainExp(amount); // 경험치 획득 (보너스 적용)
gainGold(amount); // 골드 획득 (보너스 적용)
spendGold(amount); // 골드 사용
```

#### Weapon 컴포넌트 (신규)

```javascript
constructor(weaponData) {
  this.id = weaponData.id;
  this.level = 1;
  this.max_level = 5;
  this.grade = WeaponGrade.COMMON;

  // 무기 스탯
  this.damage_multiplier = 100; // 공격력의 100%
  this.attack_speed = 1.0;
  this.range = 300;

  // 타입별 추가 스탯 (동적 초기화)
  // projectile: projectile_count, projectile_speed, pierce
  // laser: laser_width, duration, laser_type
  // area_damage: area_radius, tick_rate, cloud_count
  // ...
}

// 메서드
upgrade(weaponData)            // 레벨업
canEvolve()                    // 진화 가능 여부
getEvolutionResult(materialId) // 진화 레시피 확인
updateCooldown(deltaTime)      // 쿨타임 갱신
fire()                         // 발사 (쿨타임 설정)
```

#### WeaponSlot 컴포넌트 (신규)

```javascript
// 10개 무기 슬롯 관리
this.weapons = []; // Weapon 배열
this.max_slots = 10;

// 메서드
addWeapon(weapon); // 무기 추가
removeWeapon(weaponId); // 무기 제거 (진화 시)
replaceWeapon(oldId, newWeapon); // 무기 교체 (진화 시)
getEvolvablePairs(); // 진화 가능 조합 검색
getUpgradableWeapons(); // 강화 가능 무기 목록
```

### 2.3 시스템

#### WeaponSystem (대대적 수정)

**핵심 변경사항:**

- WeaponSlot의 모든 무기를 순회하며 독립적으로 처리
- 무기별 쿨타임 관리
- Stats 컴포넌트의 능력치 적용

**자동 무기 타겟팅:**

```javascript
nearest; // 가장 가까운 적 1명
random; // 랜덤 방향
rotating; // 플레이어 주변 회전
random_multiple; // 랜덤 적 N명 (직접 피해)
nearest_area; // 가장 가까운 적 중심 범위
random_area; // 랜덤 위치 장판
```

**수동 무기 처리:**

```javascript
// 마우스 방향으로 발사
const mousePos = input.mouseWorldPosition;
const direction = mousePos.clone().sub(transform.position).normalize();

// 공격 타입별 분기
switch (weapon.attack_type) {
  case 'melee_swing': // 부채꼴 범위 판정
  case 'projectile': // 투사체 발사 (산탄 지원)
  case 'laser': // 레이저 발사
}
```

**데미지 계산:**

```javascript
#calculateDamage(weaponMultiplier, stats) {
  const baseDamage = stats.attack_power * (weaponMultiplier / 100);
  const finalDamage = baseDamage * (1 + stats.final_damage);

  // 치명타
  if (Math.random() < stats.crit_chance) {
    return finalDamage * stats.crit_damage;
  }

  return finalDamage;
}
```

### 2.4 UI 시스템

#### LevelUpUI (완전 재작성)

**레이아웃:**

```
┌─────────────────────────────────────┐
│         LEVEL UP!                    │
│  [Reroll Button (N)]                 │
├─────────────────────────────────────┤
│  [Choice1] [Choice2] [Choice3]      │
│  [Choice4] [Choice5]                 │
├─────────────────────────────────────┤
│     Upgrade with Gold                │
│  ┌───────────┬───────────┐          │
│  │ Weapons   │ Abilities │          │
│  │ [Weapon1] │ [Ability1]│          │
│  │ [Weapon2] │ [Ability2]│          │
│  └───────────┴───────────┘          │
└─────────────────────────────────────┘
```

**선택지 생성 규칙:**

1. **무조건 5개** 선택지 제공
2. **무기 또는 능력치 최소 1개 보장**
3. 슬롯이 꽉 찬 경우: 골드, 체력, 스탯증가 선택지
4. 밴 목록에 있는 선택지는 제외

**선택지 타입:**

```javascript
{
  type: 'weapon',        // 무기 획득
  type: 'ability',       // 능력치 획득 (슬롯 사용)
  type: 'gold',          // 골드 500
  type: 'heal',          // 체력 50% 회복
  type: 'stat_increase', // 스탯 증가 (슬롯 미사용)
}
```

**리롤/삭제 시스템:**

- 리롤: 능력치로 획득한 횟수만큼 사용 가능
- 삭제: 우클릭으로 선택지 영구 제거 (ban_count 소모)

**강화 시스템:**

- 좌측: 무기 강화 (레벨 1~5)
- 우측: 능력치 강화 (레벨 1~5)
- 골드 소모로 즉시 강화
- 툴팁으로 강화 전후 스탯 비교

### 2.5 GameScene 통합

**플레이어 초기화:**

```javascript
// WeaponSlot 추가
const weaponSlot = new WeaponSlot();
this._player.addComponent(weaponSlot);

// 시작 무기: 근접 검
const startWeapon = new Weapon(WeaponData.melee_slash);
weaponSlot.addWeapon(startWeapon);
stats.weapon_slot_count = 1;
```

**UI 표시:**

- 무기 슬롯: N/10
- 능력치 슬롯: N/10
- 골드 표시
- 레벨/경험치

---

## 3. 데이터 구조 요약

### 무기 데이터 구조

```javascript
{
  id: 'magic_missile',
  name: '마법 미사일',
  type: 'auto',                    // auto | manual
  attack_type: 'projectile',       // 공격 방식
  targeting: 'nearest',             // 타겟팅
  grade: WeaponGrade.COMMON,       // 등급

  // 기본 스탯
  damage_multiplier: 100,          // 공격력 배율 (%)
  attack_speed: 1.0,               // 초당 공격 횟수
  range: 400,

  // 타입별 추가 스탯
  projectile_count: 1,
  projectile_speed: 400,
  pierce: 0,

  // 강화
  max_level: 5,
  upgrade_costs: [1000, 2000, 4000, 8000, 16000],
  upgrades: {
    2: { damage_multiplier: 120, projectile_count: 2 },
    3: { damage_multiplier: 145, pierce: 1 },
    // ...
  },

  // 진화
  evolutions: [
    {
      recipe: ['magic_missile_5', 'fire_ball_5'],
      result: 'hellfire_storm'
    }
  ]
}
```

### 능력치 데이터 구조

```javascript
{
  id: 'attack_power',
  name: '공격력 증가',
  max_level: 5,
  upgrade_costs: [1000, 2000, 4000, 8000, 16000],
  effects: {
    1: { attack_power: 10 },
    2: { attack_power: 25 },
    3: { attack_power: 45 },
    4: { attack_power: 70 },
    5: { attack_power: 100 },
  }
}
```

---

## 4. 이벤트 흐름

### 레벨업 흐름

```
1. ExperienceSystem에서 경험치 획득 감지
2. Stats.gainExp() → 레벨업 판정
3. 'player_leveled_up' 이벤트 발행
4. GameScene에서 이벤트 수신
5. LevelUpUI.show(player)
6. 선택지 생성 (5개)
7. 플레이어 선택
8. Stats/WeaponSlot 업데이트
9. LevelUpUI.hide()
10. 게임 재개
```

### 무기 공격 흐름

```
1. WeaponSystem.update(deltaTime)
2. WeaponSlot의 모든 무기 순회
3. 각 무기의 쿨타임 체크
4. 발사 가능하면:
   - 자동: 타겟팅 방식에 따라 적 검색
   - 수동: 마우스 방향 계산
5. 공격 타입에 따라 처리:
   - projectile: projectilePool.spawn()
   - direct_damage: health.takeDamage()
   - area_damage: 장판 생성
   - melee_swing: 부채꼴 범위 판정
6. weapon.fire() (쿨타임 설정)
```

---

## 5. 핵심 파일 목록

### 새로 생성된 파일

```
/src/data/StatData.js              # 20종 능력치 정의
/src/data/WeaponData.js            # 16개 무기 정의 (재작성)
/src/ecs/components/Stats.js      # 능력치 슬롯 추가 (재작성)
/src/ecs/components/Weapon.js     # 무기 컴포넌트 (신규)
/src/ecs/components/WeaponSlot.js # 무기 슬롯 관리 (신규)
/src/ecs/systems/WeaponSystem.js  # 다중 무기 처리 (재작성)
/src/ui/LevelUpUI.js              # 5개 선택지 + 강화 UI (재작성)
/src/scenes/GameScene.js          # WeaponSlot 통합 (수정)
```

---

## 6. 주요 특징

### 6.1 확장성

- 무기/능력치 데이터 파일만 수정하면 쉽게 추가 가능
- 컴포넌트 기반 설계로 기능 독립성 확보
- 진화 시스템 레시피 기반으로 유연한 확장

### 6.2 밸런스

- 골드 강화: 기하급수적 비용 증가 (×2)
- 레벨별 효과: 선형 이상의 증가율
- 무기 등급: 4단계 진화 시스템

### 6.3 플레이어 경험

- 레벨업마다 5개 선택지 (선택의 재미)
- 골드 강화로 빌드 커스터마이징
- 리롤/삭제 기능으로 전략적 선택
- 툴팁으로 정보 제공

---

## 7. 미구현 사항 (향후 개선)

### 7.1 장판형 무기

- 현재: projectilePool로 임시 표현
- 필요: AreaEffect 컴포넌트 및 시스템
- 기능: 지속 피해, 틱 데미지, 시각 효과

### 7.2 레이저 무기

- 현재: projectile로 임시 표현
- 필요: Laser 컴포넌트 및 렌더링
- 기능: 관통, 지속시간, 시각 효과

### 7.3 무기 진화 UI

- 진화 가능 조합 표시
- 진화 버튼 및 확인 UI
- 진화 애니메이션

### 7.4 도트 데미지

- 독침 무기의 지속 피해
- DotEffect 컴포넌트 필요

### 7.5 버프/디버프 시스템

- 빙결의 둔화 효과
- StatusEffect 컴포넌트 필요

---

## 8. 테스트 포인트

### 8.1 무기 시스템

- [ ] 10개 무기 동시 동작 확인
- [ ] 각 무기의 독립적인 쿨타임
- [ ] 수동 무기 마우스 조준
- [ ] 자동 무기 타겟팅

### 8.2 능력치 시스템

- [ ] 10개 능력치 슬롯
- [ ] 능력치 효과 적용 (공격력, 이동속도 등)
- [ ] 골드/경험치 보너스 작동

### 8.3 레벨업 UI

- [ ] 5개 선택지 생성
- [ ] 무기/능력치 최소 1개 보장
- [ ] 리롤 기능
- [ ] 우클릭 삭제 기능
- [ ] 강화 UI 동작

### 8.4 골드 시스템

- [ ] 골드 획득
- [ ] 골드로 무기/능력치 강화
- [ ] 강화 비용 정확성

---

## 9. 다음 단계 (Phase 2 예상)

### 9.1 적 시스템 확장

- 미니보스 (3웨이브마다)
- 보스 (5웨이브마다)
- 보스 패턴 시스템

### 9.2 무기 진화 시스템

- 진화 UI 구현
- 4단계 진화 (LEGENDARY)
- 캐릭터 전용무기 고유 패시브

### 9.3 시각 효과

- 무기별 이펙트
- 장판 렌더링
- 레이저 렌더링
- 파티클 시스템

### 9.4 UI/UX 개선

- 무기/능력치 아이콘
- 애니메이션
- 사운드

---

## 10. 중요 코드 스니펫

### Stats에 능력치 추가

```javascript
const abilityData = StatData.attack_power;
stats.addAbility(abilityData);
// → ability_slots에 추가됨
// → stats.attack_power += 10
```

### WeaponSlot에 무기 추가

```javascript
const weaponData = WeaponData.magic_missile;
const weapon = new Weapon(weaponData);
weaponSlot.addWeapon(weapon);
// → weapons 배열에 추가
// → WeaponSystem이 자동으로 처리
```

### 무기 강화

```javascript
const weapon = weaponSlot.getWeapon('magic_missile');
const cost = weapon.getUpgradeCost(); // 1000, 2000, 4000...

if (stats.spendGold(cost)) {
  weapon.upgrade(WeaponData.magic_missile);
  // → level 증가
  // → upgrades[level] 스탯 적용
}
```

### 진화 가능 조합 확인

```javascript
const pairs = weaponSlot.getEvolvablePairs();
// [{
//   mainWeapon: Weapon,
//   materialWeapon: Weapon,
//   resultId: 'flame_sword'
// }]
```

---

## 결론

Phase 1 구현으로 **프로토타입에서 본격적인 게임 시스템으로 도약**했습니다.

**핵심 성과:**

- ✅ 20종 능력치 시스템
- ✅ 16개 무기 (5가지 공격 타입)
- ✅ 10개 무기/능력치 슬롯
- ✅ 5개 선택지 레벨업 UI
- ✅ 골드 강화 시스템
- ✅ 리롤/삭제 기능
- ✅ 무기 진화 데이터 구조

**플레이 가능 상태:**

- 레벨업으로 무기/능력치 획득
- 골드로 무기/능력치 강화
- 다양한 무기 조합 실험
- 빌드 커스터마이징

다음 단계에서는 **보스 시스템**, **무기 진화 UI**, **시각 효과**를 구현하여 게임 완성도를 높일 예정입니다.
