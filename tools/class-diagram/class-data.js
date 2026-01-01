// Class metadata for tooltips - comprehensive data for all 120+ classes
export const classData = {
  // ============================================
  // CORE CLASSES (8)
  // ============================================
  'Game': {
    namespace: 'VampireSurvivors.Core',
    file: 'src/core/Game.js',
    description: 'Main game loop orchestrator. Manages systems, state, and rendering.',
    properties: ['_canvas', '_ctx', '_time', '_input', '_camera', '_systems', '_state'],
    methods: ['initialize', 'start', 'pause', 'resume', 'addSystem', 'removeSystem', 'setResolution'],
    dependencies: ['Time', 'Input', 'Camera', 'EventBus', 'System']
  },
  'EventBus': {
    namespace: 'VampireSurvivors.Core',
    file: 'src/core/EventBus.js',
    description: 'Pub/sub event system for decoupled communication between systems.',
    properties: ['_listeners'],
    methods: ['on', 'once', 'off', 'emit', 'emitSync'],
    events: ['game:*', 'player:*', 'enemy:*', 'weapon:*', 'wave:*', 'entity:*']
  },
  'Time': {
    namespace: 'VampireSurvivors.Core',
    file: 'src/core/Time.js',
    description: 'Frame time and FPS management. Tracks delta time and elapsed time.',
    properties: ['deltaTime', 'unscaledDeltaTime', 'timeScale', 'elapsed', 'frameCount', 'fps'],
    methods: ['update', 'pause', 'resume'],
    dependencies: []
  },
  'Input': {
    namespace: 'VampireSurvivors.Core',
    file: 'src/core/Input.js',
    description: 'Keyboard and mouse input handling with state management.',
    properties: ['_keys', '_mouse', '_keysPressed'],
    methods: ['isKeyDown', 'isKeyPressed', 'isKeyReleased', 'getMousePosition', 'update'],
    dependencies: []
  },
  'Camera': {
    namespace: 'VampireSurvivors.Core',
    file: 'src/core/Camera.js',
    description: 'Camera system for world-to-screen coordinate transformation.',
    properties: ['x', 'y', 'width', 'height', 'zoom', 'target'],
    methods: ['follow', 'update', 'worldToScreen', 'screenToWorld'],
    dependencies: ['Entity']
  },
  'AssetLoader': {
    namespace: 'VampireSurvivors.Core',
    file: 'src/core/AssetLoader.js',
    description: 'Loads and manages game assets (images, sprite sheets).',
    properties: ['_images', '_spriteSheets', '_loaded'],
    methods: ['loadImage', 'getImage', 'loadSpriteSheet', 'getSpriteSheet'],
    dependencies: []
  },
  'UIScale': {
    namespace: 'VampireSurvivors.Core',
    file: 'src/core/UIScale.js',
    description: 'Calculates and applies UI scaling based on canvas size.',
    properties: ['scale', 'baseWidth', 'baseHeight'],
    methods: ['calculate', 'apply'],
    dependencies: []
  },
  'i18n': {
    namespace: 'VampireSurvivors.Core',
    file: 'src/core/i18n.js',
    description: 'Internationalization system for multi-language support.',
    properties: ['_locale', '_translations'],
    methods: ['setLocale', 't', 'loadTranslations'],
    dependencies: []
  },

  // ============================================
  // COMPONENTS (20)
  // ============================================
  'Component': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Component.js',
    description: 'Base class for all components. Pure data containers with entity reference.',
    properties: ['_entity'],
    methods: ['getDebugEntries', 'dispose'],
    dependencies: []
  },
  'Transform': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Transform.js',
    description: 'Position, size, rotation, and scale of an entity.',
    properties: ['x', 'y', 'width', 'height', 'rotation', 'scale'],
    methods: ['centerX', 'centerY', 'distanceTo'],
    extends: 'Component'
  },
  'Velocity': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Velocity.js',
    description: 'Movement velocity with knockback system and speed limiting.',
    properties: ['vx', 'vy', 'maxSpeed', 'knockback', 'knockbackResistance'],
    methods: ['applyKnockback', 'update', 'getSpeed'],
    extends: 'Component'
  },
  'Sprite': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Sprite.js',
    description: 'Visual rendering properties including color, image, and animation.',
    properties: ['color', 'shape', 'zIndex', 'alpha', 'visible', 'imageId', 'animation'],
    methods: ['setAnimation', 'updateAnimation'],
    extends: 'Component'
  },
  'Collider': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Collider.js',
    description: 'Circle-based collision with layer/mask bitmask system.',
    properties: ['radius', 'layer', 'mask', 'offsetX', 'offsetY', 'isTrigger'],
    methods: ['collidesWith', 'distanceTo', 'overlaps'],
    extends: 'Component',
    layers: 'PLAYER=1, ENEMY=2, TERRAIN=4, HITBOX=8, PICKUP=16'
  },
  'Health': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Health.js',
    description: 'Health points with damage, healing, and invincibility frames.',
    properties: ['current', 'max', 'invincibilityTime', 'isDead'],
    methods: ['takeDamage', 'heal', 'reset', 'setInvincible'],
    extends: 'Component',
    events: ['entity:died', 'player:damaged']
  },
  'Weapon': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Weapon.js',
    description: 'Weapon stats, cooldowns, and upgrade system.',
    properties: ['id', 'damage', 'cooldown', 'level', 'tier', 'stats', 'currentCooldown'],
    methods: ['upgrade', 'getDPS', 'isReady', 'fire'],
    extends: 'Component'
  },
  'WeaponSlot': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/WeaponSlot.js',
    description: 'Container for multiple equipped weapons (up to 10 slots).',
    properties: ['weapons', 'maxSlots'],
    methods: ['add', 'remove', 'getByType', 'getAutoWeapons', 'getManualWeapons'],
    extends: 'Component'
  },
  'Projectile': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Projectile.js',
    description: 'Projectile data including damage, pierce, lifetime, and ricochet.',
    properties: ['damage', 'pierceCount', 'lifetime', 'isCritical', 'ricochet', 'sourceWeaponId'],
    methods: ['reset', 'decrementPierce'],
    extends: 'Component'
  },
  'AreaEffect': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/AreaEffect.js',
    description: 'Area damage zone with tick rate and per-enemy hit tracking.',
    properties: ['damage', 'radius', 'duration', 'tickRate', 'hitEnemies', 'elapsed'],
    methods: ['tick', 'reset', 'canHit'],
    extends: 'Component'
  },
  'Pickup': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Pickup.js',
    description: 'Collectible item data with magnet attraction properties.',
    properties: ['type', 'value', 'isMagnetic', 'magnetSpeed'],
    methods: ['reset'],
    extends: 'Component',
    types: 'exp, gold, health'
  },
  'Experience': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Experience.js',
    description: 'XP tracking with level progression and scaling formula.',
    properties: ['current', 'level', 'toNextLevel', 'scaling'],
    methods: ['addXP', 'levelUp', 'getProgress'],
    extends: 'Component',
    events: ['player:level_up']
  },
  'Gold': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Gold.js',
    description: 'Currency tracking with spend/gain methods.',
    properties: ['amount'],
    methods: ['add', 'spend', 'canAfford'],
    extends: 'Component'
  },
  'PlayerStats': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/PlayerStats.js',
    description: 'Purchasable stat upgrades with level-based bonuses.',
    properties: ['levels', 'bonuses'],
    methods: ['getStatValue', 'upgradeStat', 'applyBonuses', 'getUpgradeCost'],
    extends: 'Component',
    stats: 'maxHealth, damage, moveSpeed, critChance, critDamage, armor, regen, magnet'
  },
  'PlayerData': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/PlayerData.js',
    description: 'Selected character info with base stats and passive effects.',
    properties: ['characterId', 'baseStats', 'passives'],
    methods: ['getPassiveEffect', 'getBaseStat'],
    extends: 'Component'
  },
  'TechTree': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/TechTree.js',
    description: 'Tech core progression tracking with unlock/upgrade management.',
    properties: ['coreId', 'unlocked', 'levels', 'maxLevel'],
    methods: ['unlock', 'upgrade', 'getEffect', 'isUnlocked', 'getLevel'],
    extends: 'Component'
  },
  'ActiveSkill': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/ActiveSkill.js',
    description: 'Character active skill with cooldown or charge system.',
    properties: ['skillId', 'cooldown', 'charges', 'maxCharges', 'currentCooldown'],
    methods: ['use', 'update', 'isReady', 'addCharge'],
    extends: 'Component',
    types: 'Shield, RotatingBuff, ComboSlash'
  },
  'ActiveBuff': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/ActiveBuff.js',
    description: 'Temporary buff instance with duration and stat bonuses.',
    properties: ['type', 'duration', 'bonuses', 'isActive', 'remaining'],
    methods: ['update', 'apply', 'remove'],
    extends: 'Component'
  },
  'BuffDebuff': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/BuffDebuff.js',
    description: 'Unified effect system for buffs, debuffs, auras with stacking.',
    properties: ['effectId', 'type', 'duration', 'modifiers', 'stackMode', 'stacks'],
    methods: ['apply', 'remove', 'tick', 'canStack'],
    extends: 'Component',
    stackModes: 'replace, stack, refresh, ignore'
  },
  'Shield': {
    namespace: 'VampireSurvivors.Components',
    file: 'src/components/Shield.js',
    description: 'Shield HP for damage absorption separate from health.',
    properties: ['current', 'max'],
    methods: ['absorb', 'regenerate', 'reset'],
    extends: 'Component',
    events: ['shield:broken']
  },

  // ============================================
  // ENTITIES (10)
  // ============================================
  'Entity': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/Entity.js',
    description: 'Base class for all game entities. Container for components with tag support.',
    properties: ['_id', '_components', '_tags', '_isActive'],
    methods: ['addComponent', 'getComponent', 'hasComponent', 'removeComponent', 'hasTag', 'addTag', 'removeTag', 'dispose'],
    dependencies: ['Component']
  },
  'Player': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/Player.js',
    description: 'Player entity with movement, combat, progression, and skill components.',
    properties: ['transform', 'velocity', 'sprite', 'collider', 'health', 'weaponSlot', 'experience', 'gold', 'stats'],
    methods: ['dash', 'activateMagnet', 'takeDamage', 'heal'],
    extends: 'Entity',
    components: 'Transform, Velocity, Sprite, Collider, Health, WeaponSlot, Experience, Gold, PlayerStats, TechTree, ActiveSkill, Shield',
    tags: 'player'
  },
  'Enemy': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/Enemy.js',
    description: 'Base enemy entity configurable by type with AI behavior support.',
    properties: ['enemyType', 'behaviorState', 'config'],
    methods: ['reset', 'updateBehavior'],
    extends: 'Entity',
    components: 'Transform, Velocity, Sprite, Collider, Health',
    tags: 'enemy'
  },
  'Boss': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/Boss.js',
    description: 'Boss entity with phase-based combat and attack patterns.',
    properties: ['phase', 'phaseThresholds', 'attackCooldowns', 'isTelegraphing'],
    methods: ['advancePhase', 'executeAttack', 'telegraph'],
    extends: 'Entity',
    tags: 'enemy, boss'
  },
  'TraversalEnemy': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/TraversalEnemy.js',
    description: 'Screen-crossing enemies with special movement patterns.',
    properties: ['pattern', 'decayTimer', 'patternState'],
    methods: ['updatePattern', 'checkDecay'],
    extends: 'Entity',
    patterns: 'CIRCULAR, DASH, LASER',
    tags: 'enemy, traversal'
  },
  'ProjectileEntity': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/Projectile.js',
    description: 'Projectile entity for weapon attacks with pooling support.',
    properties: ['sourceWeaponId'],
    methods: ['reset'],
    extends: 'Entity',
    components: 'Transform, Velocity, Sprite, Collider, Projectile',
    tags: 'hitbox, projectile'
  },
  'AreaEffectEntity': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/AreaEffect.js',
    description: 'Area damage zone entity with visual representation.',
    methods: ['reset'],
    extends: 'Entity',
    components: 'Transform, Sprite, AreaEffect',
    tags: 'hitbox, areaEffect'
  },
  'PickupEntity': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/Pickup.js',
    description: 'Collectible item entity with magnet attraction.',
    methods: ['reset'],
    extends: 'Entity',
    components: 'Transform, Velocity, Sprite, Collider, Pickup',
    tags: 'pickup'
  },
  'Mine': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/Mine.js',
    description: 'Deployable mine entity with proximity or timed trigger.',
    properties: ['triggerMode', 'armDelay', 'isArmed'],
    methods: ['arm', 'detonate', 'reset'],
    extends: 'Entity',
    components: 'Transform, Sprite',
    tags: 'mine',
    triggerModes: 'proximity, timed'
  },
  'Summon': {
    namespace: 'VampireSurvivors.Entities',
    file: 'src/entities/Summon.js',
    description: 'AI-controlled ally entity with chase/attack behaviors.',
    properties: ['attackMode', 'attackCooldown', 'target', 'duration'],
    methods: ['updateAI', 'attack', 'findTarget', 'reset'],
    extends: 'Entity',
    components: 'Transform, Velocity, Sprite, Health',
    tags: 'summon, ally',
    attackModes: 'melee, ranged'
  },

  // ============================================
  // SYSTEMS (27)
  // ============================================
  'System': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/System.js',
    description: 'Base class for all systems. Logic processors with priority-based execution.',
    properties: ['_game', '_entityManager', '_priority', '_isEnabled', '_updatesDuringPause'],
    methods: ['initialize', 'update', 'render', 'dispose', 'enable', 'disable'],
    dependencies: ['Game', 'EntityManager']
  },
  'BackgroundSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/BackgroundSystem.js',
    description: 'Renders tile-based or grid pattern backgrounds.',
    priority: 0,
    methods: ['setCamera', 'setTileSpriteSheet', 'render'],
    extends: 'System',
    dependencies: ['Camera', 'AssetLoader']
  },
  'CoreSelectionSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/CoreSelectionSystem.js',
    description: 'Pre-game tech core selection screen and setup.',
    priority: 1,
    methods: ['startSelection', 'setupPlayerWithCore', 'isSelectionActive'],
    extends: 'System',
    dependencies: ['TechCoreData', 'CoreWeaponData', 'CoreSelectionScreen'],
    events: ['core:selected', 'core:setup_complete']
  },
  'WaveSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/WaveSystem.js',
    description: 'Wave progression with difficulty scaling modifiers.',
    priority: 4,
    properties: ['currentWave', 'waveTimer', 'difficultyModifiers'],
    methods: ['getDifficultyModifiers', 'advanceWave'],
    extends: 'System',
    dependencies: ['WaveData'],
    events: ['wave:started', 'wave:completed', 'wave:announcing']
  },
  'PlayerSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/PlayerSystem.js',
    description: 'Handles player input and converts to movement velocity.',
    priority: 5,
    methods: ['setPlayer', 'handleInput', 'handleDash'],
    extends: 'System',
    dependencies: ['Player', 'Input', 'Velocity']
  },
  'EnemySystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/EnemySystem.js',
    description: 'Spawns enemies and orchestrates AI behavior patterns.',
    priority: 8,
    methods: ['setPlayer', 'spawnEnemy', 'getBehavior', 'updateEnemies'],
    extends: 'System',
    dependencies: ['Enemy', 'EnemyData', 'EnemyBehavior', 'ObjectPool'],
    events: ['wave:started']
  },
  'TraversalEnemySystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/TraversalEnemySystem.js',
    description: 'Manages screen-crossing enemies with special patterns.',
    priority: 8,
    methods: ['spawnTraversal', 'updatePatterns'],
    extends: 'System',
    dependencies: ['TraversalEnemy', 'TraversalEnemyData']
  },
  'BossSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/BossSystem.js',
    description: 'Boss spawning, phase transitions, and attack patterns.',
    priority: 8,
    properties: {
      private: ['_priority', '_player', '_camera', '_hudSystem', '_currentWave', '_activeBosses', '_aiTimer', '_bossProjectiles', '_boundOnWaveStarted', '_boundOnEntityDied'],
      public: []
    },
    methods: {
      public: [
        { name: 'initialize', params: ['game', 'entityManager'], returns: 'void' },
        { name: 'setPlayer', params: ['player'], returns: 'void' },
        { name: 'setCamera', params: ['camera'], returns: 'void' },
        { name: 'setHUDSystem', params: ['hudSystem'], returns: 'void' },
        { name: 'update', params: ['deltaTime'], returns: 'void' },
        { name: 'getPrimaryBoss', params: [], returns: 'Boss' },
        { name: 'getActiveBosses', params: [], returns: 'Array' },
        { name: 'render', params: ['ctx'], returns: 'void' },
        { name: 'getDebugInfo', params: [], returns: 'Object' },
        { name: 'dispose', params: [], returns: 'void' }
      ],
      private: [
        { name: '_onWaveStarted', params: ['data'], returns: 'void' },
        { name: '_onEntityDied', params: ['data'], returns: 'void' },
        { name: '_spawnBossWave', params: ['specialWave', 'wave'], returns: 'void' },
        { name: '_spawnBoss', params: ['bossType', 'wave', 'index', 'totalCount'], returns: 'void' },
        { name: '_handleBossDeath', params: ['boss'], returns: 'void' },
        { name: '_updateBosses', params: ['deltaTime'], returns: 'void' },
        { name: '_updateBossAI', params: ['boss'], returns: 'void' },
        { name: '_chasePlayer', params: ['boss', 'dx', 'dy', 'distance'], returns: 'void' },
        { name: '_executeAttack', params: ['boss'], returns: 'void' },
        { name: '_executeDash', params: ['boss', 'attackData'], returns: 'void' },
        { name: '_executeProjectile', params: ['boss', 'attackData'], returns: 'void' },
        { name: '_executeRing', params: ['boss', 'attackData'], returns: 'void' },
        { name: '_spawnBossProjectile', params: ['x', 'y', 'vx', 'vy', 'damage'], returns: 'void' },
        { name: '_updateProjectiles', params: ['deltaTime'], returns: 'void' },
        { name: '_renderProjectiles', params: ['ctx'], returns: 'void' },
        { name: '_cleanupInactiveBosses', params: [], returns: 'void' }
      ]
    },
    callChain: {
      'update': ['_updateBosses', '_updateProjectiles', '_cleanupInactiveBosses'],
      '_onWaveStarted': ['_spawnBossWave'],
      '_spawnBossWave': ['_spawnBoss'],
      '_updateBosses': ['_executeAttack', '_updateBossAI'],
      '_updateBossAI': ['_chasePlayer'],
      '_executeAttack': ['_executeDash', '_executeProjectile', '_executeRing'],
      '_executeProjectile': ['_spawnBossProjectile'],
      '_executeRing': ['_spawnBossProjectile'],
      'render': ['_renderProjectiles']
    },
    extends: 'System',
    dependencies: ['System', 'Transform', 'Velocity', 'Health', 'Boss', 'BossData', 'events'],
    events: ['wave:started', 'entity:died', 'player:damaged', 'player:died']
  },
  'MovementSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/MovementSystem.js',
    description: 'Applies velocity to position with speed modifiers and knockback.',
    priority: 10,
    methods: ['applyVelocity', 'handleKnockback'],
    extends: 'System',
    dependencies: ['Transform', 'Velocity', 'BuffDebuff']
  },
  'ProjectileSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/ProjectileSystem.js',
    description: 'Manages projectile lifetime and despawning.',
    priority: 12,
    methods: ['updateLifetimes', 'despawnProjectiles'],
    extends: 'System',
    dependencies: ['Projectile', 'ProjectilePool']
  },
  'AreaEffectSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/AreaEffectSystem.js',
    description: 'Processes area damage ticks and visual updates.',
    priority: 13,
    methods: ['processTicks', 'applyDamage'],
    extends: 'System',
    dependencies: ['AreaEffect', 'AreaEffectPool', 'Health'],
    events: ['weapon:hit']
  },
  'WeaponSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/WeaponSystem.js',
    description: 'Orchestrates weapon firing. Delegates to behavior instances by attack type.',
    priority: 15,
    methods: ['setPlayer', 'setInput', 'setCamera', 'initializeBehaviors', 'fireWeapon'],
    extends: 'System',
    dependencies: ['WeaponSlot', 'PlayerStats', 'WeaponBehavior', 'Input', 'Camera'],
    events: ['weapon:fired'],
    behaviors: 'ProjectileBehavior, LaserBehavior, MeleeBehavior, ThrustBehavior, AreaBehavior, ParticleBehavior, MineBehavior, SummonBehavior'
  },
  'MineSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/MineSystem.js',
    description: 'Updates deployable mines and checks trigger conditions.',
    priority: 15,
    methods: ['updateMines', 'checkTriggers', 'detonate'],
    extends: 'System',
    dependencies: ['Mine', 'MinePool']
  },
  'SummonSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/SummonSystem.js',
    description: 'Updates summoned ally AI and attack behaviors.',
    priority: 15,
    methods: ['updateSummons', 'updateAI', 'findTarget'],
    extends: 'System',
    dependencies: ['Summon', 'SummonPool']
  },
  'CollisionSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/CollisionSystem.js',
    description: 'Detects collisions via bitmask layers and invokes callbacks.',
    priority: 20,
    methods: ['detectCollisions', 'registerCallback', 'getCollisionsByTags'],
    extends: 'System',
    dependencies: ['Transform', 'Collider'],
    events: ['collision:detected']
  },
  'CombatSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/combat/CombatSystem.js',
    description: 'Processes damage dealing, critical hits, and combat effects.',
    priority: 25,
    methods: ['setCollisionSystem', 'setPlayer', 'processCollisions', 'applyDamage'],
    extends: 'System',
    dependencies: ['Health', 'Projectile', 'CollisionSystem', 'DamageProcessor', 'EffectHandlers'],
    events: ['weapon:hit', 'player:damaged', 'player:died', 'enemy:damaged'],
    helpers: 'DamageProcessor, EffectHandlers, RicochetHandler, ExplosionHandler'
  },
  'DropSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/DropSystem.js',
    description: 'Spawns pickups when enemies die based on drop tables.',
    priority: 26,
    methods: ['handleEntityDeath', 'spawnPickup', 'rollDrop'],
    extends: 'System',
    dependencies: ['DropTable', 'PickupPool'],
    events: ['entity:died', 'wave:started']
  },
  'PickupSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/PickupSystem.js',
    description: 'Handles pickup magnetization and collection.',
    priority: 27,
    methods: ['setPlayer', 'processPickups', 'magnetizePickups', 'collectPickup'],
    extends: 'System',
    dependencies: ['Pickup', 'PickupPool', 'CollisionSystem', 'Experience', 'Gold', 'Health'],
    events: ['pickup:collected']
  },
  'CameraSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/CameraSystem.js',
    description: 'Updates camera to follow player.',
    priority: 50,
    methods: ['setCamera', 'update'],
    extends: 'System',
    dependencies: ['Camera']
  },
  'RenderSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/RenderSystem.js',
    description: 'Draws entities with camera offset, z-sorting, and sprite rendering.',
    priority: 100,
    methods: ['setCamera', 'setEnemySystem', 'renderEntities', 'zSort'],
    extends: 'System',
    dependencies: ['Transform', 'Sprite', 'Camera', 'AssetLoader']
  },
  'HUDSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/HUDSystem.js',
    description: 'Renders HUD overlay including health, XP, and indicators.',
    priority: 110,
    methods: ['setPlayer', 'setCamera', 'renderHUD', 'showIndicators', 'setBoss'],
    extends: 'System',
    dependencies: ['HUD', 'Camera', 'Input'],
    events: ['entity:died', 'targeting:modeChanged']
  },
  'TechTreeSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/TechTreeSystem.js',
    description: 'Tech unlock popups and effect application.',
    priority: 112,
    methods: ['setPlayer', 'showUnlockPopup', 'upgradeTech', 'applyEffects'],
    extends: 'System',
    dependencies: ['TechTree', 'TechCoreData', 'TechEffectData', 'TechUnlockPopup'],
    events: ['tech:unlocked', 'tech:upgraded', 'entity:died'],
    updatesDuringPause: true
  },
  'LevelUpSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/levelup/LevelUpSystem.js',
    description: 'Level-up menu, upgrade options, and evolution handling.',
    priority: 115,
    methods: ['setPlayer', 'showLevelUpScreen', 'processUpgrade', 'generateOptions'],
    extends: 'System',
    dependencies: ['WeaponSlot', 'LevelUpScreen', 'BlacklistManager', 'OptionGenerator', 'UpgradeProcessor', 'EvolutionHandler'],
    events: ['player:level_up', 'upgrade:*', 'screen:*'],
    updatesDuringPause: true
  },
  'TabScreenSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/TabScreenSystem.js',
    description: 'Stats and evolution tabs (Tab key).',
    priority: 116,
    methods: ['showStats', 'showEvolutions', 'switchTab'],
    extends: 'System',
    updatesDuringPause: true
  },
  'GameOverSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/GameOverSystem.js',
    description: 'Death screen with run statistics.',
    priority: 120,
    methods: ['showGameOver', 'showStats', 'restart'],
    extends: 'System',
    dependencies: ['GameOverScreen'],
    updatesDuringPause: true
  },
  'PauseMenuSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/PauseMenuSystem.js',
    description: 'Pause menu UI and controls.',
    methods: ['show', 'hide', 'toggle'],
    extends: 'System',
    dependencies: ['PauseMenuScreen'],
    updatesDuringPause: true
  },
  'ActiveSkillSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/ActiveSkillSystem.js',
    description: 'Processes character active skill cooldowns and effects.',
    methods: ['setPlayer', 'useSkill', 'updateCooldowns'],
    extends: 'System',
    dependencies: ['ActiveSkill', 'Player']
  },
  'BuffDebuffSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/BuffDebuffSystem.js',
    description: 'Manages status effect application and updates.',
    methods: ['applyEffect', 'removeEffect', 'update'],
    extends: 'System',
    dependencies: ['BuffDebuff', 'BuffDebuffManager']
  },
  'CharacterSelectionSystem': {
    namespace: 'VampireSurvivors.Systems',
    file: 'src/systems/CharacterSelectionSystem.js',
    description: 'Character selection screen before game start.',
    methods: ['show', 'selectCharacter'],
    extends: 'System',
    dependencies: ['CharacterData', 'CharacterSelectionScreen']
  },

  // ============================================
  // BEHAVIORS (17)
  // ============================================
  'WeaponBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/WeaponBehavior.js',
    description: 'Base class for weapon attack behaviors.',
    properties: ['_entityManager', '_camera', '_input'],
    methods: ['execute', 'render', 'getTargetDirection'],
    dependencies: ['EntityManager', 'Camera', 'Input']
  },
  'ProjectileBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/ProjectileBehavior.js',
    description: 'Spawns projectiles with targeting modes (nearest, random, mouse).',
    methods: ['execute', 'spawnProjectile', 'getTargetDirection'],
    extends: 'WeaponBehavior',
    dependencies: ['ProjectilePool'],
    targetingModes: 'NEAREST, RANDOM, MOUSE, ROTATING, CHAIN'
  },
  'LaserBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/LaserBehavior.js',
    description: 'Casts laser beams with raycast damage.',
    methods: ['execute', 'castRay', 'render'],
    extends: 'WeaponBehavior'
  },
  'MeleeBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/MeleeBehavior.js',
    description: 'Creates melee swing arcs around player.',
    methods: ['execute', 'createSwingArc', 'render'],
    extends: 'WeaponBehavior'
  },
  'ThrustBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/ThrustBehavior.js',
    description: 'Creates thrust attack zones in target direction.',
    methods: ['execute', 'createThrustZone', 'render'],
    extends: 'WeaponBehavior'
  },
  'AreaBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/AreaBehavior.js',
    description: 'Spawns area damage zones.',
    methods: ['execute', 'spawnAreaEffect'],
    extends: 'WeaponBehavior',
    dependencies: ['AreaEffectPool']
  },
  'ParticleBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/ParticleBehavior.js',
    description: 'Spawns particle effects with spread patterns.',
    methods: ['execute', 'spawnParticles', 'render'],
    extends: 'WeaponBehavior'
  },
  'MineBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/MineBehavior.js',
    description: 'Deploys mines at target positions.',
    methods: ['execute', 'deployMine'],
    extends: 'WeaponBehavior',
    dependencies: ['MinePool']
  },
  'SummonBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/SummonBehavior.js',
    description: 'Spawns ally summon entities.',
    methods: ['execute', 'spawnSummon'],
    extends: 'WeaponBehavior',
    dependencies: ['SummonPool']
  },
  'EnemyBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/EnemyBehavior.js',
    description: 'Base class for enemy AI behaviors.',
    methods: ['update', 'onSpawn', 'getChaseVector'],
    dependencies: ['Enemy', 'Player']
  },
  'ChaseEnemyBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/ChaseEnemyBehavior.js',
    description: 'Basic chase AI that moves toward player.',
    methods: ['update', 'calculateChaseVector'],
    extends: 'EnemyBehavior'
  },
  'FlyingEnemyBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/FlyingEnemyBehavior.js',
    description: 'Flying enemy with floating vertical offset.',
    methods: ['update', 'updateFloatOffset'],
    extends: 'EnemyBehavior'
  },
  'InvisibleEnemyBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/InvisibleEnemyBehavior.js',
    description: 'Enemy that toggles visibility periodically.',
    methods: ['update', 'toggleVisibility'],
    extends: 'EnemyBehavior'
  },
  'DashAttackBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/DashAttackBehavior.js',
    description: 'Enemy that charges toward player with dash attack.',
    methods: ['update', 'prepareDash', 'executeDash'],
    extends: 'EnemyBehavior'
  },
  'JumpDropBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/JumpDropBehavior.js',
    description: 'Enemy that jumps and drops on player position.',
    methods: ['update', 'jump', 'drop'],
    extends: 'EnemyBehavior'
  },
  'SelfDestructBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/SelfDestructBehavior.js',
    description: 'Enemy that explodes when near player.',
    methods: ['update', 'arm', 'explode'],
    extends: 'EnemyBehavior'
  },
  'ProjectileEnemyBehavior': {
    namespace: 'VampireSurvivors.Behaviors',
    file: 'src/behaviors/ProjectileEnemyBehavior.js',
    description: 'Enemy that fires projectiles at player.',
    methods: ['update', 'fireProjectile', 'aim'],
    extends: 'EnemyBehavior',
    dependencies: ['EnemyProjectilePool']
  },

  // ============================================
  // MANAGERS & POOLS (10)
  // ============================================
  'EntityManager': {
    namespace: 'VampireSurvivors.Managers',
    file: 'src/managers/EntityManager.js',
    description: 'Central entity registry. Handles creation, querying, and lifecycle.',
    properties: ['_entities', '_entitiesByTag', '_nextId'],
    methods: ['create', 'add', 'remove', 'destroy', 'getById', 'getByTag', 'getWithComponents', 'getAll', 'getCount', 'clear'],
    dependencies: ['Entity']
  },
  'BuffDebuffManager': {
    namespace: 'VampireSurvivors.Managers',
    file: 'src/managers/BuffDebuffManager.js',
    description: 'Manages active status effects on entities.',
    properties: ['_activeEffects'],
    methods: ['apply', 'remove', 'update', 'getEffects', 'clearAll'],
    dependencies: ['BuffDebuff', 'BuffDebuffData']
  },
  'BlacklistManager': {
    namespace: 'VampireSurvivors.Managers',
    file: 'src/managers/BlacklistManager.js',
    description: 'Tracks weapons used in evolutions to prevent reselection.',
    properties: ['_blacklistedWeapons'],
    methods: ['add', 'remove', 'has', 'clear', 'getAll'],
    dependencies: []
  },
  'ObjectPool': {
    namespace: 'VampireSurvivors.Pool',
    file: 'src/pool/ObjectPool.js',
    description: 'Generic object pooling pattern for efficient entity reuse.',
    properties: ['_pool', '_active', '_maxSize', '_factory'],
    methods: ['get', 'release', 'reset', 'getActiveObjects', 'releaseAll', 'clear'],
    dependencies: []
  },
  'ProjectilePool': {
    namespace: 'VampireSurvivors.Pool',
    file: 'src/pool/ProjectilePool.js',
    description: 'Object pool for projectile entities.',
    methods: ['get', 'release', 'reset'],
    extends: 'ObjectPool',
    dependencies: ['Projectile']
  },
  'AreaEffectPool': {
    namespace: 'VampireSurvivors.Pool',
    file: 'src/pool/AreaEffectPool.js',
    description: 'Object pool for area effect entities.',
    methods: ['get', 'release', 'reset'],
    extends: 'ObjectPool',
    dependencies: ['AreaEffect']
  },
  'PickupPool': {
    namespace: 'VampireSurvivors.Pool',
    file: 'src/pool/PickupPool.js',
    description: 'Object pool for pickup entities.',
    methods: ['get', 'release', 'reset'],
    extends: 'ObjectPool',
    dependencies: ['Pickup']
  },
  'MinePool': {
    namespace: 'VampireSurvivors.Pool',
    file: 'src/pool/MinePool.js',
    description: 'Object pool for mine entities.',
    methods: ['get', 'release', 'reset'],
    extends: 'ObjectPool',
    dependencies: ['Mine']
  },
  'SummonPool': {
    namespace: 'VampireSurvivors.Pool',
    file: 'src/pool/SummonPool.js',
    description: 'Object pool for summon entities.',
    methods: ['get', 'release', 'reset'],
    extends: 'ObjectPool',
    dependencies: ['Summon']
  },
  'EnemyProjectilePool': {
    namespace: 'VampireSurvivors.Pool',
    file: 'src/pool/EnemyProjectilePool.js',
    description: 'Object pool for enemy-fired projectiles.',
    methods: ['get', 'release', 'reset'],
    extends: 'ObjectPool',
    dependencies: ['Projectile']
  },

  // ============================================
  // UI CLASSES (28)
  // ============================================
  'HUD': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/HUD.js',
    description: 'Main HUD container managing all UI sub-components.',
    properties: ['_statusPanel', '_weaponSlots', '_damageNumbers', '_waveAnnouncement', '_bossHealthBar', '_minimap'],
    methods: ['setPlayer', 'update', 'render'],
    dependencies: ['StatusPanel', 'WeaponSlots', 'DamageNumbers', 'WaveAnnouncement', 'BossHealthBar', 'Minimap']
  },
  'StatusPanel': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/StatusPanel.js',
    description: 'Displays player health, experience, and gold.',
    methods: ['renderHealth', 'renderExperience', 'renderGold', 'renderShield'],
    dependencies: ['Health', 'Experience', 'Gold', 'Shield']
  },
  'WeaponSlots': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/WeaponSlots.js',
    description: 'Displays equipped weapon icons with cooldown indicators.',
    methods: ['renderSlots', 'renderCooldowns'],
    dependencies: ['WeaponSlot', 'Weapon']
  },
  'DamageNumbers': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/DamageNumbers.js',
    description: 'Floating damage number display with critical hit styling.',
    properties: ['_numbers'],
    methods: ['spawn', 'update', 'render'],
    dependencies: []
  },
  'WaveAnnouncement': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/WaveAnnouncement.js',
    description: 'Wave start announcement overlay.',
    methods: ['show', 'hide', 'render'],
    dependencies: []
  },
  'BossHealthBar': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/BossHealthBar.js',
    description: 'Large health bar for boss enemies.',
    methods: ['setBoss', 'render'],
    dependencies: ['Boss', 'Health']
  },
  'EntityHealthBars': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/EntityHealthBars.js',
    description: 'Renders health bars above entities.',
    methods: ['render'],
    dependencies: ['Health', 'Transform']
  },
  'SkillCooldowns': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/SkillCooldowns.js',
    description: 'Active skill cooldown indicator.',
    methods: ['render'],
    dependencies: ['ActiveSkill']
  },
  'Minimap': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/Minimap.js',
    description: 'Small map showing entity positions.',
    methods: ['render'],
    dependencies: ['EntityManager', 'Camera']
  },
  'PlayerStatusEffects': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/PlayerStatusEffects.js',
    description: 'Displays active buff/debuff icons.',
    methods: ['render'],
    dependencies: ['BuffDebuff']
  },
  'PlayerOverhead': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/PlayerOverhead.js',
    description: 'Health/shield bars above player.',
    methods: ['render'],
    dependencies: ['Player', 'Health', 'Shield']
  },
  'ShieldBar': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/ShieldBar.js',
    description: 'Shield HP display bar below health bar or overhead.',
    properties: {
      private: ['_player', '_healthBarY'],
      public: []
    },
    methods: {
      public: [
        { name: 'setPlayer', params: ['player'], returns: 'void' },
        { name: 'setHealthBarY', params: ['y'], returns: 'void' },
        { name: 'render', params: ['ctx', 'canvasWidth', 'canvasHeight'], returns: 'void' },
        { name: 'renderOverhead', params: ['ctx', 'screenX', 'screenY', 'barWidth', 'healthBarHeight', 'offsetY'], returns: 'void' },
        { name: 'dispose', params: [], returns: 'void' }
      ],
      private: []
    },
    dependencies: ['UIScale', 'Shield']
  },
  'LevelUpScreen': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/LevelUpScreen.js',
    description: 'Level-up upgrade selection screen.',
    properties: ['_options', '_selectedIndex'],
    methods: ['show', 'hide', 'selectOption', 'render'],
    dependencies: []
  },
  'CoreSelectionScreen': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/CoreSelectionScreen.js',
    description: 'Tech core selection screen at game start.',
    properties: ['_cores', '_selectedIndex'],
    methods: ['show', 'selectCore', 'render'],
    dependencies: ['TechCoreData']
  },
  'CharacterSelectionScreen': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/CharacterSelectionScreen.js',
    description: 'Character selection before game.',
    properties: ['_characters'],
    methods: ['show', 'selectCharacter', 'render'],
    dependencies: ['CharacterData']
  },
  'GameOverScreen': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/GameOverScreen.js',
    description: 'Game over screen with run statistics.',
    properties: ['_stats'],
    methods: ['show', 'render'],
    dependencies: []
  },
  'PauseMenuScreen': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/PauseMenuScreen.js',
    description: 'Pause menu with resume/quit options.',
    methods: ['show', 'hide', 'render'],
    dependencies: []
  },
  'TabScreen': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/TabScreen.js',
    description: 'Tabbed screen for stats and evolutions.',
    properties: ['_activeTab'],
    methods: ['show', 'switchTab', 'render'],
    dependencies: []
  },
  'TechUnlockPopup': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/TechUnlockPopup.js',
    description: 'Tech unlock choice popup after boss kills.',
    properties: ['_choices'],
    methods: ['show', 'selectChoice', 'render'],
    dependencies: ['TechCoreData']
  },
  'TechTreePanel': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/TechTreePanel.js',
    description: 'Visual tech tree display.',
    methods: ['render'],
    dependencies: ['TechTree', 'TechCoreData']
  },
  'TechUpgradePanel': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/TechUpgradePanel.js',
    description: 'Tech upgrade details and buttons.',
    methods: ['render'],
    dependencies: ['TechTree']
  },
  'StatUpgradePanel': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/StatUpgradePanel.js',
    description: 'Player stat upgrade UI.',
    methods: ['render'],
    dependencies: ['PlayerStats']
  },
  'EvolutionPopup': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/EvolutionPopup.js',
    description: 'Weapon evolution announcement.',
    methods: ['show', 'render'],
    dependencies: []
  },
  'EvolutionListPanel': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/EvolutionListPanel.js',
    description: 'Lists available weapon evolutions.',
    methods: ['render'],
    dependencies: ['WeaponTierData']
  },
  'WeaponCardPanel': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/WeaponCardPanel.js',
    description: 'Single weapon info card.',
    methods: ['render'],
    dependencies: ['Weapon', 'WeaponData']
  },
  'WeaponGridPanel': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/WeaponGridPanel.js',
    description: 'Grid of weapon cards.',
    methods: ['render'],
    dependencies: ['WeaponSlot']
  },
  'UpgradeTooltip': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/UpgradeTooltip.js',
    description: 'Hover tooltip for upgrade options.',
    methods: ['show', 'hide', 'render'],
    dependencies: []
  },
  'ScrollBar': {
    namespace: 'VampireSurvivors.UI',
    file: 'src/ui/ScrollBar.js',
    description: 'Scrollbar component for long lists.',
    methods: ['render', 'handleScroll'],
    dependencies: []
  }
};
