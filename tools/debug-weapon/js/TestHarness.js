/**
 * @fileoverview TestHarness - Game environment and test simulation
 */

class TestHarness {
  constructor() {
    this._canvas = null;
    this._ctx = null;
    this._game = null;
    this._entityManager = null;
    this._player = null;
    this._currentWeapon = null;
    this._systems = [];
    this._testDummies = [];
    this._running = false;
    this._mouseX = 0;
    this._mouseY = 0;
  }

  initialize(canvasId) {
    const self = this;
    this._canvas = document.getElementById(canvasId);
    this._ctx = this._canvas.getContext('2d');

    // Set canvas size
    this._resizeCanvas();
    window.addEventListener('resize', () => {
      self._resizeCanvas();
    });

    // Track mouse position
    this._canvas.addEventListener('mousemove', (e) => {
      const rect = self._canvas.getBoundingClientRect();
      self._mouseX = e.clientX - rect.left;
      self._mouseY = e.clientY - rect.top;
    });

    // Initialize game components
    const VS = window.VampireSurvivors;
    const Core = VS.Core;
    const Managers = VS.Managers;
    const Pool = VS.Pool;

    // Use existing EventBus - DO NOT create a new one!
    // Systems capture EventBus reference at load time, creating a new one
    // would cause events to go to the wrong bus.
    if (!Core.events) {
      Core.events = new Core.EventBus();
    }

    // Create Time
    Core.time = new Core.Time();

    // Create Input
    Core.input = new Core.Input();
    Core.input.initialize(this._canvas);

    // Create Camera (full implementation needed for weapon behaviors)
    Core.camera = {
      x: 0,
      y: 0,
      width: this._canvas.width,
      height: this._canvas.height,
      viewportWidth: this._canvas.width,
      viewportHeight: this._canvas.height,
      worldToScreen: function(wx, wy) {
        return { x: wx - this.x + this.width / 2, y: wy - this.y + this.height / 2 };
      },
      screenToWorld: function(sx, sy) {
        return { x: sx + this.x - this.width / 2, y: sy + this.y - this.height / 2 };
      },
      isOnScreen: function(x, y, margin) {
        margin = margin || 100;
        const screenX = x - this.x + this.width / 2;
        const screenY = y - this.y + this.height / 2;
        return screenX >= -margin && screenX <= this.width + margin &&
               screenY >= -margin && screenY <= this.height + margin;
      },
      follow: function(entity) { this._target = entity; },
      _target: null
    };

    // Create minimal game object
    this._game = {
      canvas: this._canvas,
      ctx: this._ctx,
      width: this._canvas.width,
      height: this._canvas.height,
      state: 'running',
      input: Core.input,
      getState: function() { return 'running'; },
      pause: function() { this.state = 'paused'; },
      resume: function() { this.state = 'running'; }
    };

    // Create EntityManager
    this._entityManager = new Managers.EntityManager();
    this._entityManager.initialize(this._game);
    Managers.entityManager = this._entityManager;

    // Initialize Pools with entityManager
    Pool.projectilePool = new Pool.ProjectilePool();
    Pool.projectilePool.initialize(this._entityManager);
    Pool.areaEffectPool = new Pool.AreaEffectPool();
    Pool.areaEffectPool.initialize(this._entityManager);
    Pool.pickupPool = new Pool.PickupPool();
    Pool.pickupPool.initialize(this._entityManager);
    Pool.minePool = new Pool.MinePool();
    Pool.minePool.initialize(this._entityManager);
    Pool.summonPool = new Pool.SummonPool();
    Pool.summonPool.initialize(this._entityManager);

    // Create BuffDebuffManager
    if (Managers.BuffDebuffManager) {
      this._buffDebuffManager = new Managers.BuffDebuffManager();
      this._buffDebuffManager.initialize(this._entityManager);
      Managers.buffDebuffManager = this._buffDebuffManager;
    }

    // Initialize systems
    this._initializeSystems();

    // Create player
    this._createPlayer();

    // Set input camera reference
    Core.input.setCamera(Core.camera);

    // Debug: Log initialization state
    console.log('=== TestHarness Initialization Complete ===');
    console.log('Systems loaded:', this._systems.length);
    for (let i = 0; i < this._systems.length; i++) {
      console.log('  - ' + (this._systems[i].constructor.name || 'Unknown') + ' (priority: ' + this._systems[i]._priority + ')');
    }
    console.log('Player created:', !!this._player);
    console.log('WeaponSystem:', !!this._weaponSystem);
    console.log('Behaviors initialized:', !!(this._weaponSystem && this._weaponSystem._projectileBehavior));

    // Start game loop
    this._running = true;
    this._lastTime = performance.now();
    requestAnimationFrame(this._gameLoop.bind(this));
  }

  _resizeCanvas() {
    const container = this._canvas.parentElement;
    this._canvas.width = container.clientWidth;
    this._canvas.height = container.clientHeight;

    if (window.VampireSurvivors.Core.camera) {
      window.VampireSurvivors.Core.camera.width = this._canvas.width;
      window.VampireSurvivors.Core.camera.height = this._canvas.height;
      window.VampireSurvivors.Core.camera.viewportWidth = this._canvas.width;
      window.VampireSurvivors.Core.camera.viewportHeight = this._canvas.height;
    }
  }

  _initializeSystems() {
    const Systems = window.VampireSurvivors.Systems;
    const Core = window.VampireSurvivors.Core;

    try {
      // Player System (for WASD movement)
      if (Systems.PlayerSystem) {
        this._playerSystem = new Systems.PlayerSystem();
        this._playerSystem.initialize(this._game, this._entityManager);
        this._systems.push(this._playerSystem);
      }

      // Movement System
      if (Systems.MovementSystem) {
        this._movementSystem = new Systems.MovementSystem();
        this._movementSystem.initialize(this._game, this._entityManager);
        this._systems.push(this._movementSystem);
      }

      // Projectile System
      if (Systems.ProjectileSystem) {
        this._projectileSystem = new Systems.ProjectileSystem();
        this._projectileSystem.initialize(this._game, this._entityManager);
        this._systems.push(this._projectileSystem);
      }

      // Area Effect System
      if (Systems.AreaEffectSystem) {
        this._areaEffectSystem = new Systems.AreaEffectSystem();
        this._areaEffectSystem.initialize(this._game, this._entityManager);
        this._systems.push(this._areaEffectSystem);
      }

      // Mine System
      if (Systems.MineSystem) {
        this._mineSystem = new Systems.MineSystem();
        this._mineSystem.initialize(this._game, this._entityManager);
        this._systems.push(this._mineSystem);
      }

      // Summon System
      if (Systems.SummonSystem) {
        this._summonSystem = new Systems.SummonSystem();
        this._summonSystem.initialize(this._game, this._entityManager);
        this._systems.push(this._summonSystem);
      }

      // Collision System
      if (Systems.CollisionSystem) {
        this._collisionSystem = new Systems.CollisionSystem();
        this._collisionSystem.initialize(this._game, this._entityManager);
        this._systems.push(this._collisionSystem);
      }

      // BuffDebuff System
      if (Systems.BuffDebuffSystem) {
        this._buffDebuffSystem = new Systems.BuffDebuffSystem();
        this._buffDebuffSystem.initialize(this._game, this._entityManager);
        if (this._buffDebuffManager) {
          this._buffDebuffSystem.setBuffDebuffManager(this._buffDebuffManager);
        }
        this._systems.push(this._buffDebuffSystem);
      }

      // Combat System
      if (Systems.CombatSystem) {
        this._combatSystem = new Systems.CombatSystem();
        this._combatSystem.initialize(this._game, this._entityManager);
        if (this._collisionSystem) {
          this._combatSystem.setCollisionSystem(this._collisionSystem);
        }
        this._systems.push(this._combatSystem);
      }

      // Weapon System (priority 40, after CombatSystem)
      if (Systems.WeaponSystem) {
        this._weaponSystem = new Systems.WeaponSystem();
        this._weaponSystem.initialize(this._game, this._entityManager);
        this._weaponSystem.setInput(Core.input);
        this._weaponSystem.setCamera(Core.camera);
        this._weaponSystem._priority = 40; // Set correct priority
        this._systems.push(this._weaponSystem);
        console.log('[DEBUG] WeaponSystem initialized, priority:', this._weaponSystem._priority);
      }

      // Render System
      if (Systems.RenderSystem) {
        this._renderSystem = new Systems.RenderSystem();
        this._renderSystem.initialize(this._game, this._entityManager);
        this._renderSystem.setCamera(Core.camera);
        this._systems.push(this._renderSystem);
      }
    } catch (e) {
      console.error('Failed to initialize systems:', e);
    }

    // Sort by priority
    this._systems.sort((a, b) => {
      return (a._priority || 0) - (b._priority || 0);
    });
  }

  _createPlayer() {
    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;
    const Core = window.VampireSurvivors.Core;

    this._player = this._entityManager.create(Entities.Player);

    // Position at center
    const transform = this._player.getComponent(Components.Transform);
    transform.x = 0;
    transform.y = 0;

    // Set player reference globally
    Core.player = this._player;

    // Set player in systems that need it
    if (this._playerSystem && this._playerSystem.setPlayer) {
      this._playerSystem.setPlayer(this._player);
    }
    if (this._combatSystem && this._combatSystem.setPlayer) {
      this._combatSystem.setPlayer(this._player);
    }
    if (this._weaponSystem) {
      if (this._weaponSystem.setPlayer) {
        this._weaponSystem.setPlayer(this._player);
      }
      try {
        this._weaponSystem.initializeBehaviors();
        console.log('[DEBUG] Weapon behaviors initialized successfully');
      } catch (e) {
        console.error('[DEBUG] Failed to initialize weapon behaviors:', e);
      }
    }

    // Update camera to follow player
    Core.camera.x = 0;
    Core.camera.y = 0;
    Core.camera.follow(this._player);

    // Verify behaviors are initialized
    this._verifyBehaviors();
  }

  /**
   * Verify all weapon behaviors are properly initialized
   */
  _verifyBehaviors() {
    if (!this._weaponSystem) {
      console.error('[DEBUG] WeaponSystem not initialized');
      return false;
    }

    const behaviorNames = [
      '_projectileBehavior',
      '_laserBehavior',
      '_meleeBehavior',
      '_thrustBehavior',
      '_areaBehavior',
      '_particleBehavior',
      '_mineBehavior',
      '_summonBehavior'
    ];

    let allGood = true;
    for (let i = 0; i < behaviorNames.length; i++) {
      const name = behaviorNames[i];
      const behavior = this._weaponSystem[name];
      if (!behavior) {
        console.warn('[DEBUG] Missing behavior:', name);
        allGood = false;
      } else {
        // Check if behavior has required dependencies
        const hasEntityManager = !!behavior._entityManager;
        const hasPlayer = !!behavior._player;
        if (!hasEntityManager || !hasPlayer) {
          console.warn('[DEBUG]', name, '- entityManager:', hasEntityManager, 'player:', hasPlayer);
          allGood = false;
        }
      }
    }

    if (allGood) {
      console.log('[DEBUG] All weapon behaviors initialized with dependencies');
    }

    return allGood;
  }

  /**
   * Force fire the current weapon (bypass cooldown)
   */
  forceFire() {
    const Components = window.VampireSurvivors.Components;
    const AttackType = window.VampireSurvivors.Data.AttackType;
    const TargetingMode = window.VampireSurvivors.Data.TargetingMode;
    const weaponSlot = this._player.getComponent(Components.WeaponSlot);
    if (!weaponSlot) {
      console.error('[DEBUG] No weapon slot found');
      return;
    }

    const weapons = weaponSlot.getWeapons();
    if (weapons.length === 0) {
      console.error('[DEBUG] No weapons equipped');
      return;
    }

    const weapon = weapons[0];
    console.log('[DEBUG] Force fire:', weapon.name);
    console.log('[DEBUG] - attackType:', weapon.attackType);
    console.log('[DEBUG] - targetingMode:', weapon.targetingMode);
    console.log('[DEBUG] - Before cooldown:', weapon._cooldown, 'canFire:', weapon.canFire());

    // Reset cooldown to allow firing
    weapon._cooldown = 0;

    // Check for enemies (required for some targeting modes)
    const enemies = this._entityManager.getByTag('enemy');
    const enemyCount = enemies ? enemies.length : 0;
    console.log('[DEBUG] - Enemies available:', enemyCount);

    // Check if weapon needs targets
    const needsTargets = weapon.targetingMode === TargetingMode.NEAREST ||
                         weapon.targetingMode === TargetingMode.WEAKEST ||
                         weapon.targetingMode === 'nearest' ||
                         weapon.targetingMode === 'weakest';

    if (needsTargets && enemyCount === 0) {
      console.warn('[DEBUG] WARNING: Weapon targeting mode requires enemies but none found!');
      console.warn('[DEBUG] Auto-spawning 5 enemies...');
      this.spawnTestDummies(5);
      const newEnemies = this._entityManager.getByTag('enemy');
      console.log('[DEBUG] - Enemies after spawn:', newEnemies ? newEnemies.length : 0);
    }

    // Get the appropriate behavior and execute directly
    let behavior = null;
    switch (weapon.attackType) {
      case AttackType.PROJECTILE:
        behavior = this._weaponSystem._projectileBehavior;
        break;
      case AttackType.LASER:
        behavior = this._weaponSystem._laserBehavior;
        break;
      case AttackType.MELEE_SWING:
        behavior = this._weaponSystem._meleeBehavior;
        break;
      case AttackType.MELEE_THRUST:
        behavior = this._weaponSystem._thrustBehavior;
        break;
      case AttackType.AREA_DAMAGE:
        behavior = this._weaponSystem._areaBehavior;
        break;
      case AttackType.PARTICLE:
        behavior = this._weaponSystem._particleBehavior;
        break;
      case AttackType.MINE:
        behavior = this._weaponSystem._mineBehavior;
        break;
      case AttackType.SUMMON:
        behavior = this._weaponSystem._summonBehavior;
        break;
    }

    if (!behavior) {
      console.error('[DEBUG] No behavior found for attackType:', weapon.attackType);
      return;
    }

    console.log('[DEBUG] - Using behavior:', behavior.constructor.name);
    console.log('[DEBUG] - Behavior has entityManager:', !!behavior._entityManager);
    console.log('[DEBUG] - Behavior has player:', !!behavior._player);

    try {
      const result = behavior.execute(weapon, this._player);
      console.log('[DEBUG] - Execute result:', result);
      if (result && result.length > 0) {
        console.log('[DEBUG] Force fire SUCCESS - spawned', result.length, 'entities');
      } else if (result && result.length === 0) {
        console.warn('[DEBUG] Force fire returned empty array - no projectiles/effects spawned');
      } else {
        console.log('[DEBUG] Force fire completed - result:', result);
      }
      weapon.fire(); // Reset cooldown after firing
    } catch (e) {
      console.error('[DEBUG] Execute error:', e);
      console.error(e.stack);
    }
  }

  selectWeapon(weaponId) {
    const Data = window.VampireSurvivors.Data;
    const Components = window.VampireSurvivors.Components;

    // Find weapon data
    const weaponData = Data.WeaponData[weaponId] ||
                       Data.CoreWeaponData[weaponId] ||
                       Data.EvolvedWeaponData[weaponId];

    if (!weaponData) {
      console.error('Weapon not found:', weaponId);
      return null;
    }

    // Clear existing weapons
    const weaponSlot = this._player.getComponent(Components.WeaponSlot);
    if (weaponSlot) {
      // Remove all existing weapons
      const existingWeapons = weaponSlot.getWeapons();
      for (let i = 0; i < existingWeapons.length; i++) {
        weaponSlot.removeWeapon(existingWeapons[i].id);
      }
    }

    // Add new weapon
    const weapon = new Components.Weapon(weaponData);
    weaponSlot.addWeapon(weapon);

    this._currentWeapon = weaponData;

    // Update weapon system with new player weapon reference
    if (this._weaponSystem && this._weaponSystem.setPlayer) {
      this._weaponSystem.setPlayer(this._player);
    }

    // Debug output
    console.log('Selected weapon:', weaponData.name);
    console.log('  - Attack Type:', weaponData.attackType);
    console.log('  - Targeting Mode:', weaponData.targetingMode);
    console.log('  - Cooldown:', weaponData.cooldown);
    console.log('  - Is Auto:', weaponData.isAuto);
    console.log('  - Damage:', weaponData.damage);
    console.log('  - Projectile Count:', weaponData.projectileCount);

    // Verify weapon was added
    const addedWeapons = weaponSlot.getWeapons();
    console.log('  - Weapons in slot:', addedWeapons.length);
    if (addedWeapons.length > 0) {
      console.log('  - First weapon can fire:', addedWeapons[0].canFire());
      console.log('  - First weapon cooldown:', addedWeapons[0]._cooldown);
      console.log('  - First weapon cooldownMax:', addedWeapons[0]._cooldownMax);
    }

    // Log behavior availability
    if (this._weaponSystem) {
      const behaviorName = '_' + weaponData.attackType.replace('_damage', '').replace('_', '') + 'Behavior';
      const altBehaviorName = '_' + weaponData.attackType + 'Behavior';
      console.log('  - Expected behavior:', behaviorName, 'or', altBehaviorName);
      console.log('  - Behavior available:', !!(this._weaponSystem._projectileBehavior ||
                  this._weaponSystem._areaBehavior ||
                  this._weaponSystem._mineBehavior ||
                  this._weaponSystem._summonBehavior));
    }

    // Auto-spawn enemies for weapons that need targets
    const TargetingMode = window.VampireSurvivors.Data.TargetingMode;
    const needsTargets = weaponData.targetingMode === TargetingMode.NEAREST ||
                         weaponData.targetingMode === TargetingMode.WEAKEST ||
                         weaponData.targetingMode === TargetingMode.RANDOM ||
                         weaponData.targetingMode === 'nearest' ||
                         weaponData.targetingMode === 'weakest' ||
                         weaponData.targetingMode === 'random';

    const autoSpawnCheckbox = document.getElementById('chk-auto-spawn');
    if (needsTargets && autoSpawnCheckbox && autoSpawnCheckbox.checked) {
      const existingEnemies = this._entityManager.getByTag('enemy');
      if (!existingEnemies || existingEnemies.length === 0) {
        console.log('[DEBUG] Auto-spawning enemies for targeting weapon');
        this.spawnTestDummies(5);
      }
    }

    return weaponData;
  }

  spawnTestDummies(count) {
    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;

    // Clear existing dummies
    this.clearDummies();

    // Get player position for spawning around
    const playerTransform = this._player.getComponent(Components.Transform);
    const playerX = playerTransform ? playerTransform.x : 0;
    const playerY = playerTransform ? playerTransform.y : 0;

    // Spawn in circle around player
    const radius = 150;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = playerX + Math.cos(angle) * radius;
      const y = playerY + Math.sin(angle) * radius;

      const enemy = this._entityManager.create(Entities.Enemy);

      const transform = enemy.getComponent(Components.Transform);
      if (transform) {
        transform.x = x;
        transform.y = y;
      }

      // Configure as stationary dummy
      const velocity = enemy.getComponent(Components.Velocity);
      if (velocity) {
        velocity.x = 0;
        velocity.y = 0;
      }

      // Set health based on position (some weak, some strong)
      const health = enemy.getComponent(Components.Health);
      if (health) {
        const hp = (i % 3 === 0) ? 10 : 100; // Some weak for kill testing
        health.setMaxHealth(hp, true);
      }

      // Make enemy stand still by setting speed to 0 and nullifying behavior
      if (enemy.speed !== undefined) {
        enemy.speed = 0;
      }
      if (enemy._speed !== undefined) {
        enemy._speed = 0;
      }
      // Mark as test dummy to prevent normal AI behavior
      enemy.addTag('test_dummy');
      enemy._isTestDummy = true;

      this._testDummies.push(enemy);
    }

    console.log('Spawned ' + count + ' test dummies');

    // Debug: verify enemies are findable
    const enemyEntities = this._entityManager.getByTag('enemy');
    console.log('[DEBUG] Enemies findable by tag:', enemyEntities ? enemyEntities.length : 0);
  }

  clearDummies() {
    this._testDummies.forEach((dummy) => {
      this._entityManager.destroy(dummy);
    });
    this._testDummies = [];
  }

  /**
   * Spawn enemies in a tight cluster for ricochet testing
   * @param {number} count - Number of enemies to spawn
   * @param {number} spacing - Distance between enemies
   */
  spawnCluster(count, spacing) {
    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;

    this.clearDummies();

    const playerTransform = this._player.getComponent(Components.Transform);
    const playerX = playerTransform ? playerTransform.x : 0;
    const playerY = playerTransform ? playerTransform.y : 0;

    // Spawn in cluster to the right of player
    const centerX = playerX + 150;
    const centerY = playerY;
    const rows = Math.ceil(Math.sqrt(count));
    const cols = Math.ceil(count / rows);

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = centerX + (col - cols / 2) * spacing;
      const y = centerY + (row - rows / 2) * spacing;

      const enemy = this._entityManager.create(Entities.Enemy);

      const transform = enemy.getComponent(Components.Transform);
      if (transform) {
        transform.x = x;
        transform.y = y;
      }

      const velocity = enemy.getComponent(Components.Velocity);
      if (velocity) {
        velocity.x = 0;
        velocity.y = 0;
      }

      const health = enemy.getComponent(Components.Health);
      if (health) {
        health.setMaxHealth(100, true);
      }

      if (enemy.speed !== undefined) enemy.speed = 0;
      if (enemy._speed !== undefined) enemy._speed = 0;
      enemy.addTag('test_dummy');
      enemy._isTestDummy = true;

      this._testDummies.push(enemy);
    }

    console.log('Spawned ' + count + ' clustered enemies for ricochet testing');
  }

  /**
   * Spawn enemies in a line for pierce testing
   * @param {number} count - Number of enemies to spawn
   */
  spawnLine(count) {
    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;

    this.clearDummies();

    const playerTransform = this._player.getComponent(Components.Transform);
    const playerX = playerTransform ? playerTransform.x : 0;
    const playerY = playerTransform ? playerTransform.y : 0;

    // Spawn in a line in front of player
    const startX = playerX + 80;
    const spacing = 50;

    for (let i = 0; i < count; i++) {
      const enemy = this._entityManager.create(Entities.Enemy);

      const transform = enemy.getComponent(Components.Transform);
      if (transform) {
        transform.x = startX + i * spacing;
        transform.y = playerY;
      }

      const velocity = enemy.getComponent(Components.Velocity);
      if (velocity) {
        velocity.x = 0;
        velocity.y = 0;
      }

      const health = enemy.getComponent(Components.Health);
      if (health) {
        health.setMaxHealth(200, true); // High HP so they don't die from pierce
      }

      if (enemy.speed !== undefined) enemy.speed = 0;
      if (enemy._speed !== undefined) enemy._speed = 0;
      enemy.addTag('test_dummy');
      enemy._isTestDummy = true;

      this._testDummies.push(enemy);
    }

    console.log('Spawned ' + count + ' enemies in a line for pierce testing');
  }

  /**
   * Spawn weak enemies for on-kill effect testing
   * @param {number} count - Number of enemies to spawn
   * @param {number} hp - Health of each enemy
   */
  spawnWeak(count, hp) {
    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;

    this.clearDummies();

    const playerTransform = this._player.getComponent(Components.Transform);
    const playerX = playerTransform ? playerTransform.x : 0;
    const playerY = playerTransform ? playerTransform.y : 0;

    // Spawn around player
    const radius = 120;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = playerX + Math.cos(angle) * radius;
      const y = playerY + Math.sin(angle) * radius;

      const enemy = this._entityManager.create(Entities.Enemy);

      const transform = enemy.getComponent(Components.Transform);
      if (transform) {
        transform.x = x;
        transform.y = y;
      }

      const velocity = enemy.getComponent(Components.Velocity);
      if (velocity) {
        velocity.x = 0;
        velocity.y = 0;
      }

      // Very low HP for on-kill testing
      const health = enemy.getComponent(Components.Health);
      if (health) {
        health.setMaxHealth(hp || 5, true);
      }

      if (enemy.speed !== undefined) enemy.speed = 0;
      if (enemy._speed !== undefined) enemy._speed = 0;
      enemy.addTag('test_dummy');
      enemy._isTestDummy = true;

      this._testDummies.push(enemy);
    }

    console.log('Spawned ' + count + ' weak enemies (HP: ' + hp + ') for on-kill testing');
  }

  // ========================================
  // Priority 4: Enhanced Testing Scenarios
  // ========================================

  /**
   * Spawn a boss enemy for extended testing (high HP, larger size)
   * Good for: kill stacking, soul collection, sustained damage testing
   * @param {number} hp - Boss health (default 5000)
   */
  spawnBoss(hp) {
    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;

    this.clearDummies();

    const playerTransform = this._player.getComponent(Components.Transform);
    const playerX = playerTransform ? playerTransform.x : 0;
    const playerY = playerTransform ? playerTransform.y : 0;

    // Create boss enemy
    const boss = this._entityManager.create(Entities.Enemy);

    const transform = boss.getComponent(Components.Transform);
    if (transform) {
      transform.x = playerX + 200;
      transform.y = playerY;
    }

    // Boss is stationary
    const velocity = boss.getComponent(Components.Velocity);
    if (velocity) {
      velocity.x = 0;
      velocity.y = 0;
    }

    // High HP for extended testing
    const health = boss.getComponent(Components.Health);
    if (health) {
      health.setMaxHealth(hp || 5000, true);
    }

    // Make boss larger
    const sprite = boss.getComponent(Components.Sprite);
    if (sprite) {
      sprite.scale = 3;
    }

    // Larger collider for easier targeting
    const collider = boss.getComponent(Components.Collider);
    if (collider) {
      collider.radius = 60;
    }

    if (boss.speed !== undefined) boss.speed = 0;
    if (boss._speed !== undefined) boss._speed = 0;
    boss.addTag('test_dummy');
    boss.addTag('boss');
    boss._isTestDummy = true;
    boss._isBoss = true;

    this._testDummies.push(boss);

    console.log('Spawned BOSS enemy (HP: ' + (hp || 5000) + ') for extended testing');
    return boss;
  }

  /**
   * Spawn moving enemies that approach the player
   * Good for: homing verification, dynamic combat testing
   * @param {number} count - Number of enemies
   * @param {number} speed - Movement speed (default 50)
   */
  spawnMoving(count, speed) {
    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;

    this.clearDummies();

    const playerTransform = this._player.getComponent(Components.Transform);
    const playerX = playerTransform ? playerTransform.x : 0;
    const playerY = playerTransform ? playerTransform.y : 0;

    const moveSpeed = speed || 50;
    const spawnRadius = 300;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = playerX + Math.cos(angle) * spawnRadius;
      const y = playerY + Math.sin(angle) * spawnRadius;

      const enemy = this._entityManager.create(Entities.Enemy);

      const transform = enemy.getComponent(Components.Transform);
      if (transform) {
        transform.x = x;
        transform.y = y;
      }

      // Set velocity toward player
      const velocity = enemy.getComponent(Components.Velocity);
      if (velocity) {
        const dx = playerX - x;
        const dy = playerY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        velocity.x = (dx / dist) * moveSpeed;
        velocity.y = (dy / dist) * moveSpeed;
      }

      const health = enemy.getComponent(Components.Health);
      if (health) {
        health.setMaxHealth(50, true);
      }

      // Enable movement
      if (enemy.speed !== undefined) enemy.speed = moveSpeed;
      if (enemy._speed !== undefined) enemy._speed = moveSpeed;
      enemy.addTag('test_dummy');
      enemy.addTag('moving');
      enemy._isTestDummy = true;
      enemy._isMoving = true;

      this._testDummies.push(enemy);
    }

    console.log('Spawned ' + count + ' MOVING enemies (speed: ' + moveSpeed + ') for homing/dynamic testing');
  }

  /**
   * Spawn mixed HP enemies for execute damage testing
   * Good for: execute bonus verification, damage scaling
   * @param {number} count - Number of enemies
   */
  spawnMixed(count) {
    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;

    this.clearDummies();

    const playerTransform = this._player.getComponent(Components.Transform);
    const playerX = playerTransform ? playerTransform.x : 0;
    const playerY = playerTransform ? playerTransform.y : 0;

    const radius = 150;
    const hpLevels = [10, 25, 50, 100, 200]; // Mixed HP values

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = playerX + Math.cos(angle) * radius;
      const y = playerY + Math.sin(angle) * radius;

      const enemy = this._entityManager.create(Entities.Enemy);

      const transform = enemy.getComponent(Components.Transform);
      if (transform) {
        transform.x = x;
        transform.y = y;
      }

      const velocity = enemy.getComponent(Components.Velocity);
      if (velocity) {
        velocity.x = 0;
        velocity.y = 0;
      }

      // Varied HP for different damage scenarios
      const health = enemy.getComponent(Components.Health);
      if (health) {
        const hp = hpLevels[i % hpLevels.length];
        health.setMaxHealth(hp, true);
        // Pre-damage some for execute testing
        if (i % 3 === 0) {
          health.takeDamage(hp * 0.8); // 20% HP remaining
        }
      }

      if (enemy.speed !== undefined) enemy.speed = 0;
      if (enemy._speed !== undefined) enemy._speed = 0;
      enemy.addTag('test_dummy');
      enemy._isTestDummy = true;

      this._testDummies.push(enemy);
    }

    console.log('Spawned ' + count + ' MIXED HP enemies for execute/scaling testing');
  }

  /**
   * Start multi-wave sustained test mode
   * Automatically spawns waves of enemies for extended testing
   * Good for: heat buildup, soul collection, kill stacking
   * @param {object} options - Configuration options
   */
  startWaveMode(options) {
    const self = this;
    const opts = options || {};
    const waveSize = opts.waveSize || 10;
    const waveDelay = opts.waveDelay || 3000; // ms between waves
    const maxWaves = opts.maxWaves || 10;
    const enemyHP = opts.enemyHP || 20;

    this._waveMode = {
      active: true,
      currentWave: 0,
      maxWaves: maxWaves,
      waveSize: waveSize,
      enemyHP: enemyHP,
      interval: null,
      kills: 0,
      startTime: Date.now()
    };

    console.log('=== WAVE MODE STARTED ===');
    console.log('Waves: ' + maxWaves + ', Size: ' + waveSize + ', HP: ' + enemyHP);

    // Spawn first wave immediately
    this._spawnWave();

    // Set up interval for subsequent waves
    this._waveMode.interval = setInterval(() => {
      if (!self._waveMode.active) {
        clearInterval(self._waveMode.interval);
        return;
      }

      // Check if all enemies are dead before spawning next wave
      const enemies = self._entityManager.getByTag('enemy');
      const aliveCount = enemies ? enemies.filter(e => {
        const h = e.getComponent(window.VampireSurvivors.Components.Health);
        return h && h.isAlive();
      }).length : 0;

      if (aliveCount === 0) {
        self._waveMode.currentWave++;

        if (self._waveMode.currentWave >= self._waveMode.maxWaves) {
          self.stopWaveMode();
          return;
        }

        self._spawnWave();
      }
    }, waveDelay);

    return this._waveMode;
  }

  _spawnWave() {
    if (!this._waveMode || !this._waveMode.active) return;

    const Entities = window.VampireSurvivors.Entities;
    const Components = window.VampireSurvivors.Components;

    const playerTransform = this._player.getComponent(Components.Transform);
    const playerX = playerTransform ? playerTransform.x : 0;
    const playerY = playerTransform ? playerTransform.y : 0;

    const waveNum = this._waveMode.currentWave + 1;
    const count = this._waveMode.waveSize;
    const radius = 200;

    console.log('--- Wave ' + waveNum + '/' + this._waveMode.maxWaves + ' ---');

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (waveNum * 0.5); // Offset each wave
      const x = playerX + Math.cos(angle) * radius;
      const y = playerY + Math.sin(angle) * radius;

      const enemy = this._entityManager.create(Entities.Enemy);

      const transform = enemy.getComponent(Components.Transform);
      if (transform) {
        transform.x = x;
        transform.y = y;
      }

      const velocity = enemy.getComponent(Components.Velocity);
      if (velocity) {
        // Slow movement toward player
        const dx = playerX - x;
        const dy = playerY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        velocity.x = (dx / dist) * 20;
        velocity.y = (dy / dist) * 20;
      }

      const health = enemy.getComponent(Components.Health);
      if (health) {
        health.setMaxHealth(this._waveMode.enemyHP, true);
      }

      enemy.addTag('test_dummy');
      enemy.addTag('wave_enemy');
      enemy._isTestDummy = true;
      enemy._waveNumber = waveNum;

      this._testDummies.push(enemy);
    }
  }

  /**
   * Stop wave mode
   */
  stopWaveMode() {
    if (this._waveMode) {
      if (this._waveMode.interval) {
        clearInterval(this._waveMode.interval);
      }
      const duration = ((Date.now() - this._waveMode.startTime) / 1000).toFixed(1);
      console.log('=== WAVE MODE ENDED ===');
      console.log('Completed waves: ' + this._waveMode.currentWave + '/' + this._waveMode.maxWaves);
      console.log('Duration: ' + duration + 's');
      this._waveMode.active = false;
    }
    return this._waveMode;
  }

  /**
   * Get wave mode status
   */
  getWaveModeStatus() {
    if (!this._waveMode) return null;
    return {
      active: this._waveMode.active,
      currentWave: this._waveMode.currentWave,
      maxWaves: this._waveMode.maxWaves,
      elapsed: Date.now() - this._waveMode.startTime
    };
  }

  /**
   * Generate damage breakdown report from StatTracker data
   * @param {StatTracker} statTracker - The stat tracker instance
   * @returns {object} Damage breakdown report
   */
  generateDamageReport(statTracker) {
    if (!statTracker) {
      console.error('No StatTracker provided');
      return null;
    }

    const report = {
      summary: {},
      breakdown: {},
      critAnalysis: {},
      dps: {}
    };

    // Total damage
    const damageStats = statTracker.getStats('damage_dealt');
    if (damageStats) {
      report.summary.totalDamage = damageStats.sum;
      report.summary.avgDamagePerHit = damageStats.avg;
      report.summary.minDamage = damageStats.min;
      report.summary.maxDamage = damageStats.max;
      report.summary.totalHits = damageStats.count;
    }

    // Crit analysis
    const critStats = statTracker.getStats('crit_rate');
    const critRatioStats = statTracker.getStats('crit_damage_ratio');
    if (critStats && damageStats) {
      report.critAnalysis.critCount = critStats.count;
      report.critAnalysis.critRate = (critStats.count / damageStats.count * 100).toFixed(1) + '%';
      if (critRatioStats) {
        report.critAnalysis.avgCritMultiplier = critRatioStats.avg.toFixed(2) + 'x';
      }
    }

    // DOT damage
    const dotStats = statTracker.getStats('dot_tick_damage');
    if (dotStats) {
      report.breakdown.dotDamage = {
        total: dotStats.sum,
        avgTick: dotStats.avg,
        tickCount: dotStats.count
      };
    }

    // Explosion damage
    const explosionStats = statTracker.getStats('explosion_damage');
    if (explosionStats) {
      report.breakdown.explosionDamage = {
        total: explosionStats.sum,
        avgExplosion: explosionStats.avg,
        count: explosionStats.count
      };
    }

    // Summon damage
    const summonStats = statTracker.getStats('summon_damage_dealt');
    if (summonStats) {
      report.breakdown.summonDamage = {
        total: summonStats.sum,
        avgHit: summonStats.avg,
        hits: summonStats.count
      };
    }

    // Soul orbit damage
    const soulOrbitStats = statTracker.getStats('soul_orbit_damage');
    if (soulOrbitStats) {
      report.breakdown.soulOrbitDamage = {
        total: soulOrbitStats.sum,
        avgTick: soulOrbitStats.avg,
        ticks: soulOrbitStats.count
      };
    }

    // Void rift damage
    const riftStats = statTracker.getStats('voidrift_tick_damage');
    if (riftStats) {
      report.breakdown.riftDamage = {
        total: riftStats.sum,
        avgTick: riftStats.avg,
        ticks: riftStats.count
      };
    }

    // DPS calculation (if we have fire timing)
    const fireStats = statTracker.getStats('fire_interval');
    if (fireStats && damageStats) {
      const avgFireInterval = fireStats.avg;
      if (avgFireInterval > 0) {
        report.dps.firesPerSecond = (1 / avgFireInterval).toFixed(2);
        report.dps.damagePerSecond = (damageStats.avg / avgFireInterval).toFixed(1);
      }
    }

    // Kill stacking bonus
    const killstackStats = statTracker.getStats('killstack_current');
    if (killstackStats) {
      report.breakdown.killStacking = {
        currentStacks: killstackStats.max,
        damageBonus: statTracker.getStats('killstack_damage_per_kill')?.avg || 0
      };
    }

    // Heat system
    const heatStats = statTracker.getStats('heat_current');
    if (heatStats) {
      report.breakdown.heatSystem = {
        maxHeat: heatStats.max,
        overchargeTriggered: statTracker.getCount('heat_overcharge_triggered') > 0
      };
    }

    return report;
  }

  /**
   * Print damage report to console
   * @param {StatTracker} statTracker
   */
  printDamageReport(statTracker) {
    const report = this.generateDamageReport(statTracker);
    if (!report) return;

    console.log('\n========== DAMAGE BREAKDOWN REPORT ==========');

    if (report.summary.totalHits) {
      console.log('\n--- Summary ---');
      console.log('Total Damage: ' + report.summary.totalDamage.toFixed(0));
      console.log('Total Hits: ' + report.summary.totalHits);
      console.log('Avg Damage/Hit: ' + report.summary.avgDamagePerHit.toFixed(1));
      console.log('Damage Range: ' + report.summary.minDamage + ' - ' + report.summary.maxDamage);
    }

    if (report.critAnalysis.critCount) {
      console.log('\n--- Critical Hits ---');
      console.log('Crit Count: ' + report.critAnalysis.critCount);
      console.log('Crit Rate: ' + report.critAnalysis.critRate);
      if (report.critAnalysis.avgCritMultiplier) {
        console.log('Avg Crit Multiplier: ' + report.critAnalysis.avgCritMultiplier);
      }
    }

    if (report.dps.damagePerSecond) {
      console.log('\n--- DPS ---');
      console.log('Fires/Second: ' + report.dps.firesPerSecond);
      console.log('DPS: ' + report.dps.damagePerSecond);
    }

    console.log('\n--- Damage Sources ---');
    if (report.breakdown.dotDamage) {
      console.log('DOT: ' + report.breakdown.dotDamage.total.toFixed(0) + ' (' + report.breakdown.dotDamage.tickCount + ' ticks)');
    }
    if (report.breakdown.explosionDamage) {
      console.log('Explosions: ' + report.breakdown.explosionDamage.total.toFixed(0) + ' (' + report.breakdown.explosionDamage.count + ' explosions)');
    }
    if (report.breakdown.summonDamage) {
      console.log('Summons: ' + report.breakdown.summonDamage.total.toFixed(0) + ' (' + report.breakdown.summonDamage.hits + ' hits)');
    }
    if (report.breakdown.soulOrbitDamage) {
      console.log('Soul Orbit: ' + report.breakdown.soulOrbitDamage.total.toFixed(0));
    }
    if (report.breakdown.riftDamage) {
      console.log('Void Rifts: ' + report.breakdown.riftDamage.total.toFixed(0));
    }
    if (report.breakdown.killStacking) {
      console.log('Kill Stacks: ' + report.breakdown.killStacking.currentStacks + ' (bonus: +' + report.breakdown.killStacking.damageBonus + '/kill)');
    }
    if (report.breakdown.heatSystem) {
      console.log('Heat: ' + report.breakdown.heatSystem.maxHeat + (report.breakdown.heatSystem.overchargeTriggered ? ' (OVERCHARGED)' : ''));
    }

    console.log('\n==============================================\n');

    return report;
  }

  reset() {
    this.clearDummies();

    // Reset player position
    const Components = window.VampireSurvivors.Components;
    const transform = this._player.getComponent(Components.Transform);
    transform.x = 0;
    transform.y = 0;

    // Reset camera
    this.centerCamera();
  }

  /**
   * Center the camera on the player
   */
  centerCamera() {
    const Components = window.VampireSurvivors.Components;
    const Core = window.VampireSurvivors.Core;

    if (this._player && Core.camera) {
      const transform = this._player.getComponent(Components.Transform);
      if (transform) {
        Core.camera.x = transform.x;
        Core.camera.y = transform.y;
      }
    }
    console.log('[DEBUG] Camera centered on player');
  }

  _gameLoop(timestamp) {
    if (!this._running) return;

    let deltaTime = (timestamp - this._lastTime) / 1000;
    this._lastTime = timestamp;

    // Cap delta time
    if (deltaTime > 0.1) deltaTime = 0.1;

    // Update time
    const Core = window.VampireSurvivors.Core;
    if (Core.time) {
      Core.time._deltaTime = deltaTime;
      Core.time._elapsed += deltaTime;
    }

    // Debug: Check weapon state periodically
    this._debugCounter = (this._debugCounter || 0) + 1;
    if (this._debugCounter % 300 === 0 && this._player) { // Every ~5 seconds at 60fps
      const Components = window.VampireSurvivors.Components;
      const weaponSlot = this._player.getComponent(Components.WeaponSlot);
      if (weaponSlot) {
        const weapons = weaponSlot.getWeapons();
        if (weapons.length > 0) {
          console.log('[DEBUG] Weapon cooldown:', weapons[0]._cooldown, 'canFire:', weapons[0].canFire());
        }
      }
    }

    // Update input
    if (Core.input) {
      Core.input.update();
    }

    // Update camera to follow player
    if (this._player && Core.camera) {
      const Components = window.VampireSurvivors.Components;
      const transform = this._player.getComponent(Components.Transform);
      if (transform) {
        Core.camera.x = transform.x;
        Core.camera.y = transform.y;
      }
    }

    // Update all systems
    for (let i = 0; i < this._systems.length; i++) {
      try {
        if (this._systems[i].isEnabled !== false) {
          this._systems[i].update(deltaTime);
        }
      } catch (e) {
        console.error('System update error:', this._systems[i].constructor.name, e);
      }
    }

    // Clear canvas
    this._ctx.fillStyle = '#1a1a2e';
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    // Draw grid
    this._drawGrid();

    // Render all systems
    for (let j = 0; j < this._systems.length; j++) {
      if (this._systems[j].render) {
        try {
          this._systems[j].render(this._ctx);
        } catch (e) {
          // Ignore render errors
        }
      }
    }

    // Draw crosshair at mouse position
    this._drawCrosshair();

    requestAnimationFrame(this._gameLoop.bind(this));
  }

  _drawGrid() {
    const ctx = this._ctx;
    const camera = window.VampireSurvivors.Core.camera;
    const gridSize = 50;

    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 1;

    const startX = -camera.x % gridSize + camera.width / 2;
    const startY = -camera.y % gridSize + camera.height / 2;

    // Vertical lines
    for (let x = startX - gridSize; x < this._canvas.width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this._canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY - gridSize; y < this._canvas.height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this._canvas.width, y);
      ctx.stroke();
    }
  }

  _drawCrosshair() {
    const ctx = this._ctx;
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1;

    const size = 10;
    ctx.beginPath();
    ctx.moveTo(this._mouseX - size, this._mouseY);
    ctx.lineTo(this._mouseX + size, this._mouseY);
    ctx.moveTo(this._mouseX, this._mouseY - size);
    ctx.lineTo(this._mouseX, this._mouseY + size);
    ctx.stroke();
  }

  getPlayer() {
    return this._player;
  }

  getCurrentWeapon() {
    return this._currentWeapon;
  }
}

export { TestHarness };
export default TestHarness;
