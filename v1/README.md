# Vampire_Survivors_Purejs

뱀파이어 서바이벌류 게임 개발

## 뱀파이어 서바이벌 게임 아키텍처 설계

1. 프로젝트 폴더 구조

```plaintext
/vampire-survivor-prototype
│
├── /src
│   ├── /core                    # 핵심 엔진 시스템
│   │   ├── Game.js              # 게임 메인 루프 (Singleton)
│   │   ├── Scene.js             # 씬 관리 (FSM)
│   │   ├── Time.js              # 시간 관리 (Singleton)
│   │   └── Input.js             # 입력 관리 (Singleton)
│   │
│   ├── /ecs                     # Entity Component System
│   │   ├── Entity.js            # 엔티티 베이스
│   │   ├── Component.js         # 컴포넌트 베이스
│   │   ├── System.js            # 시스템 베이스
│   │   ├── /components          # 컴포넌트들
│   │   │   ├── Transform.js     # 위치, 회전, 스케일
│   │   │   ├── Rigidbody.js     # 물리 (속도, 가속도)
│   │   │   ├── Collider.js      # 충돌 처리
│   │   │   ├── Health.js        # 체력 시스템
│   │   │   ├── Renderer.js      # 렌더링
│   │   │   ├── Weapon.js        # 무기
│   │   │   ├── AI.js            # AI 행동
│   │   │   └── Stats.js         # 능력치
│   │   │
│   │   └── /systems             # 시스템들
│   │       ├── MovementSystem.js        # 이동 처리
│   │       ├── CollisionSystem.js       # 충돌 처리
│   │       ├── CombatSystem.js          # 전투 처리
│   │       ├── AISystem.js              # AI 처리
│   │       ├── RenderSystem.js          # 렌더링 처리
│   │       ├── WeaponSystem.js          # 무기 처리
│   │       └── ExperienceSystem.js      # 경험치 처리
│   │
│   ├── /pool                    # Object Pooling
│   │   ├── ObjectPool.js        # 풀 매니저 (Singleton)
│   │   ├── EnemyPool.js         # 적 풀
│   │   ├── ProjectilePool.js    # 투사체 풀
│   │   └── DropItemPool.js      # 드랍 아이템 풀
│   │
│   ├── /managers                # 매니저 (Singleton + Facade)
│   │   ├── WaveManager.js       # 웨이브 관리
│   │   ├── SpawnManager.js      # 스폰 관리
│   │   ├── UIManager.js         # UI 관리
│   │   ├── MapManager.js        # 맵 관리
│   │   ├── CameraManager.js     # 카메라 관리
│   │   ├── AudioManager.js      # 오디오 관리
│   │   └── SaveManager.js       # 저장 관리
│   │
│   ├── /entities                # 게임 엔티티
│   │   ├── Player.js            # 플레이어
│   │   ├── /enemies             # 적들
│   │   │   ├── Enemy.js         # 적 베이스
│   │   │   ├── NormalEnemy.js   # 일반
│   │   │   ├── FastEnemy.js     # 빠른 속도
│   │   │   ├── Boss.js          # 보스 베이스
│   │   │   └── BossType1.js     # 보스 타입1
│   │   │
│   │   ├── /weapons             # 무기들
│   │   │   ├── Weapon.js        # 무기 베이스
│   │   │   ├── AutoWeapon.js    # 자동 공격 베이스
│   │   │   ├── ManualWeapon.js  # 수동 조준 베이스
│   │   │   └── /types           # 무기 타입들
│   │   │       ├── MagicMissile.js      # 마법탄환 (자동)
│   │   │       ├── RotatingBlade.js     # 회전검 (자동)
│   │   │       ├── RandomShot.js        # 랜덤샷 (자동)
│   │   │       └── Rifle.js             # 라이플 (수동)
│   │   │
│   │   ├── /obstacles           # 장애물
│   │   │   ├── Obstacle.js      # 장애물 베이스
│   │   │   ├── Rock.js          # 바위
│   │   │   ├── Tree.js          # 나무
│   │   │   └── Cliff.js         # 낭떨어지
│   │   │
│   │   └── /drops               # 드랍 아이템
│   │       ├── DropItem.js      # 드랍 베이스
│   │       ├── Experience.js    # 경험치
│   │       ├── Gold.js          # 골드
│   │       ├── HealItem.js      # 회복
│   │       └── MagnetItem.js    # 자석
│   │
│   ├── /ui                      # UI 시스템
│   │   ├── UIComponent.js       # UI 베이스
│   │   ├── HUD.js               # 게임 HUD
│   │   ├── LevelUpUI.js         # 레벨업 선택
│   │   ├── UpgradeUI.js         # 무기/능력치 업그레이드
│   │   ├── PauseMenu.js         # 일시정지
│   │   ├── GameOverUI.js        # 게임오버
│   │   ├── EquipmentUI.js       # 장비 목록 (TAB)
│   │   └── Tooltip.js           # 툴팁
│   │
│   ├── /data                    # 게임 데이터
│   │   ├── WeaponData.js        # 무기 데이터
│   │   ├── EnemyData.js         # 적 데이터
│   │   ├── BossData.js          # 보스 데이터
│   │   ├── StatData.js          # 능력치 데이터
│   │   ├── WaveData.js          # 웨이브 데이터
│   │   └── Config.js            # 게임 설정
│   │
│   ├── /utils                   # 유틸리티
│   │   ├── Vector2.js           # 2D 벡터
│   │   ├── Math.js              # 수학 함수
│   │   ├── Random.js            # 랜덤 유틸
│   │   ├── Collision.js         # 충돌 감지
│   │   └── EventBus.js          # 이벤트 시스템 (Observer)
│   │
│   ├── /patterns                # AI 패턴 (FSM)
│   │   ├── State.js             # 상태 베이스
│   │   ├── StateMachine.js      # 상태 머신
│   │   └── /enemy-states        # 적 상태들
│   │       ├── ChaseState.js    # 추적
│   │       ├── AttackState.js   # 공격
│   │       └── DashState.js     # 돌진
│   │
│   └── /scenes                  # 씬들
│       ├── MainMenuScene.js     # 메인 메뉴
│       ├── GameScene.js         # 게임 플레이
│       └── GameOverScene.js     # 게임오버
│
├── index.html                   # HTML 진입점
├── style.css                    # 스타일
└── main.js                      # 자바스크립트 진입점
```

1. 핵심 아키텍처 패턴

   1. ECS (Entity Component System)

   ```plaintext
   Entity (데이터 컨테이너)
     ↓ has many
   Components (데이터)
     - Transform, Health, Weapon 등
     ↓ processed by
   Systems (로직)
     - MovementSystem, CombatSystem 등
   ```

   1. Object Pooling

   ```plaintext
   ObjectPool (Manager)
   └── manages
   ├── EnemyPool (적 200개 미리 생성)
   ├── ProjectilePool (투사체 500개)
   └── DropItemPool (드랍 100개)
   ```

   1. Singleton Pattern

   ```plaintext
   Game, Time, Input, ObjectPool,
   WaveManager, UIManager 등 매니저들
   ```

   1. Observer Pattern

   ```plaintext
   EventBus (중앙 이벤트 시스템)
     - 'enemy_killed' → SpawnManager, UIManager
     - 'level_up' → UIManager
     - 'wave_changed' → WaveManager, MapManager
   ```

   1. FSM (Finite State Machine)

   ```plaintext
   Scene FSM: MainMenu → Game → GameOver
   Enemy AI FSM: Idle → Chase → Attack → Death
   Boss FSM: Phase1 → Phase2 → Phase3
   ```

   1. Composite Pattern

   ```plaintext
   UI Hierarchy:
   UIComponent (Base)
     └── HUD
         ├── HealthBar
         ├── ExpBar
         └── WaveDisplay
   ```

   1. Facade Pattern

   ```plaintext
   WaveManager (Facade)
     └── coordinates
         ├── SpawnManager
         ├── MapManager
         └── UIManager
   ```

1. 시스템 플로우

   1. 게임 초기화

   ```plaintext
   1. Game.init()
   2. ObjectPool 초기화
   3. GameScene 로드
   4. Player 생성
   5. Map 생성
   6. Wave 1 시작
   ```

   1. 게임 루프 (60 FPS)

   ```plaintext
   Game Loop (requestAnimationFrame)
     ├── Time.update() - deltaTime 계산
     ├── Input.update() - 입력 처리
     ├── Systems.update()
     │   ├── AISystem - 적 AI
     │   ├── MovementSystem - 이동
     │   ├── WeaponSystem - 무기 발사
     │   ├── CollisionSystem - 충돌 검사
     │   ├── CombatSystem - 전투 처리
     │   └── ExperienceSystem - 경험치 처리
     ├── Managers.update()
     │   ├── WaveManager - 웨이브 관리
     │   ├── SpawnManager - 적 스폰
     │   ├── CameraManager - 카메라 추적
     │   └── MapManager - 접근금지구역
     ├── RenderSystem.render()
     │   ├── Map 렌더
     │   ├── Entities 렌더
     │   └── UI 렌더
     └── EventBus.flush()
   ```

   1. 웨이브 시스템

   ```plaintext
   WaveManager
     ├── 2분 타이머 체크
     ├── Wave 증가
     ├── Event: 'wave_changed'
     ├── MapManager.activateRestrictedZone()
     │   └── 10초 유예 → 5% 데미지
     ├── MapManager.redistributeObstacles()
     └── SpawnManager.updateSpawnRate()
         ├── Wave % 3 === 0 → 중간보스 스폰
         └── Wave % 5 === 0 → 보스 스폰
   ```

   1. 레벨업 시스템

   ```plaintext
   Player.gainExp()
     └── if levelUp
         ├── Game.pause()
         ├── UIManager.showLevelUpUI()
         │   ├── 5개 선택지 생성
         │   │   ├── 새 무기 (필수 1개 이상)
         │   │   ├── 새 능력치 (필수 1개 이상)
         │   │   ├── 골드
         │   │   └── 스탯 증가
         │   └── UpgradeUI 동시 표시
         │       ├── 기존 무기 목록
         │       ├── 기존 능력치 목록
         │       ├── Hover → Tooltip
         │       └── Click → 골드 소모 업그레이드
         └── 선택 완료 → Game.resume()
   ```

   1. 전투 시스템

   ```plaintext
   WeaponSystem.update()
     ├── AutoWeapon
     │   ├── MagicMissile → 가장 가까운 적 타겟팅
     │   ├── RotatingBlade → 플레이어 주변 회전
     │   └── RandomShot → 랜덤 방향 발사
     └── ManualWeapon
         └── Rifle → 마우스 방향 자동 연사

   CombatSystem.update()
     ├── 투사체-적 충돌 검사
     ├── 데미지 계산 (치명타, 관통 등)
     ├── 적 체력 감소
     └── if 적 사망
         ├── DropItem 생성 (경험치/골드/아이템)
         ├── Event: 'enemy_killed'
         └── ObjectPool.return(enemy)
   ```

1. 데이터 구조

   1. 플레이어 스탯

   ```javascript
   {
     // 기본 스탯
     max_health: 100,
     attack_power: 10,
     attack_speed: 1.0,
     defense: 0,
     move_speed: 200,

     // 추가 스탯
     crit_chance: 0.05,
     crit_damage: 1.5,
     life_steal: 0,
     health_regen: 0,
     attack_range: 1.0,
     cooldown_reduction: 0,

     // 자석 범위
     magnet_range: 50,

     // 현재 상태
     current_health: 100,
     level: 1,
     exp: 0,
     exp_to_next: 100,
     gold: 0,

     // 장착 무기 (최대 10개)
     weapons: [],

     // 획득 능력치 (최대 10개)
     abilities: []
   }
   ```

   1. 무기 데이터

   ```javascript
   {
     id: 'magic_missile',
     name: '마법 미사일',
     type: 'auto', // 'auto' | 'manual'
     targeting: 'nearest', // 'nearest' | 'random' | 'rotating'
     level: 1,
     max_level: 5,

     // 무기 스탯
     damage: 10,
     attack_speed: 1.0,
     projectile_count: 1,
     range: 300,

     // 진화 정보
     can_evolve: true,
     evolve_requires: ['magic_missile_5', 'fire_book_5'],
     evolved_form: 'hellfire_storm'
   }
   ```

   1. 적 데이터

   ```javascript
   {
     id: 'normal_enemy',
     type: 'normal',

     // 기본 스탯 (Wave에 따라 증가)
     base_health: 50,
     base_damage: 10,
     base_speed: 80,

     // 특수 능력
     abilities: [],

     // 드랍률
     drop_rates: {
       exp: 1.0,
       gold: 0.5,
       heal: 0.0005
     }
   }
   ```

1. 이벤트 플로우

주요이벤트

```javascript
EventBus.emit('game_start');
EventBus.emit('wave_changed', wave_number);
EventBus.emit('enemy_spawned', enemy);
EventBus.emit('enemy_killed', enemy);
EventBus.emit('player_damaged', damage);
EventBus.emit('player_leveled_up', level);
EventBus.emit('weapon_acquired', weapon);
EventBus.emit('ability_acquired', ability);
EventBus.emit('boss_spawned', boss);
EventBus.emit('boss_killed', boss);
EventBus.emit('game_over');
```
