/**
 * @fileoverview Application entry point
 * @module App
 */
(function (VampireSurvivors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Core = VampireSurvivors.Core;
  var Components = VampireSurvivors.Components;
  var Entities = VampireSurvivors.Entities;
  var Managers = VampireSurvivors.Managers;
  var Systems = VampireSurvivors.Systems;
  var Pool = VampireSurvivors.Pool;
  var Data = VampireSurvivors.Data;

  var Game = Core.Game;
  var Camera = Core.Camera;
  var events = Core.events;

  var Transform = Components.Transform;
  var Weapon = Components.Weapon;
  var EntityManager = Managers.EntityManager;
  var Player = Entities.Player;
  var BackgroundSystem = Systems.BackgroundSystem;
  var WaveSystem = Systems.WaveSystem;
  var PlayerSystem = Systems.PlayerSystem;
  var EnemySystem = Systems.EnemySystem;
  var TraversalEnemySystem = Systems.TraversalEnemySystem;
  var MovementSystem = Systems.MovementSystem;
  var ProjectileSystem = Systems.ProjectileSystem;
  var AreaEffectSystem = Systems.AreaEffectSystem;
  var WeaponSystem = Systems.WeaponSystem;
  var CollisionSystem = Systems.CollisionSystem;
  var CombatSystem = Systems.CombatSystem;
  var CameraSystem = Systems.CameraSystem;
  var RenderSystem = Systems.RenderSystem;
  var DropSystem = Systems.DropSystem;
  var PickupSystem = Systems.PickupSystem;
  var HUDSystem = Systems.HUDSystem;
  var LevelUpSystem = Systems.LevelUpSystem;
  var GameOverSystem = Systems.GameOverSystem;

  var projectilePool = Pool.projectilePool;
  var areaEffectPool = Pool.areaEffectPool;
  var pickupPool = Pool.pickupPool;

  // ============================================
  // Application State
  // ============================================
  var game = null;
  var entityManager = null;
  var player = null;
  var camera = null;

  // ============================================
  // Application
  // ============================================
  async function main() {
    try {
      // Create game instance
      game = new Game();
      await game.initialize('game-canvas');

      // Setup entity manager
      entityManager = new EntityManager();
      entityManager.initialize(game);
      Managers.entityManager = entityManager;

      // Wire debug manager with entity manager
      game.debugManager.setEntityManager(entityManager);

      // Initialize pools
      projectilePool.initialize(entityManager);
      areaEffectPool.initialize(entityManager);
      pickupPool.initialize(entityManager);

      // Setup camera
      camera = new Camera(game.width, game.height);
      game.input.setCamera(camera);

      // Setup systems (priority order: 0 -> 5 -> 10 -> 50 -> 100)
      var backgroundSystem = new BackgroundSystem();
      backgroundSystem.initialize(game, entityManager);
      backgroundSystem.setCamera(camera);
      game.addSystem(backgroundSystem);

      var waveSystem = new WaveSystem();
      waveSystem.initialize(game, entityManager);
      game.addSystem(waveSystem);

      var playerSystem = new PlayerSystem();
      playerSystem.initialize(game, entityManager);
      game.addSystem(playerSystem);

      var enemySystem = new EnemySystem();
      enemySystem.initialize(game, entityManager);
      game.addSystem(enemySystem);

      var traversalEnemySystem = new TraversalEnemySystem();
      traversalEnemySystem.initialize(game, entityManager);
      game.addSystem(traversalEnemySystem);

      var movementSystem = new MovementSystem();
      movementSystem.initialize(game, entityManager);
      game.addSystem(movementSystem);

      var projectileSystem = new ProjectileSystem();
      projectileSystem.initialize(game, entityManager);
      game.addSystem(projectileSystem);

      var areaEffectSystem = new AreaEffectSystem();
      areaEffectSystem.initialize(game, entityManager);
      game.addSystem(areaEffectSystem);

      var collisionSystem = new CollisionSystem();
      collisionSystem.initialize(game, entityManager);
      game.addSystem(collisionSystem);

      var combatSystem = new CombatSystem();
      combatSystem.initialize(game, entityManager);
      combatSystem.setCollisionSystem(collisionSystem);
      game.addSystem(combatSystem);

      var dropSystem = new DropSystem();
      dropSystem.initialize(game, entityManager);
      game.addSystem(dropSystem);

      var pickupSystem = new PickupSystem();
      pickupSystem.initialize(game, entityManager);
      pickupSystem.setCollisionSystem(collisionSystem);
      game.addSystem(pickupSystem);

      var weaponSystem = new WeaponSystem();
      weaponSystem.initialize(game, entityManager);
      weaponSystem.setInput(game.input);
      game.addSystem(weaponSystem);

      var cameraSystem = new CameraSystem();
      cameraSystem.initialize(game, entityManager);
      cameraSystem.setCamera(camera);
      game.addSystem(cameraSystem);

      var renderSystem = new RenderSystem();
      renderSystem.initialize(game, entityManager);
      renderSystem.setCamera(camera);
      game.addSystem(renderSystem);

      var hudSystem = new HUDSystem();
      hudSystem.initialize(game, entityManager);
      game.addSystem(hudSystem);

      var levelUpSystem = new LevelUpSystem();
      levelUpSystem.initialize(game, entityManager);
      game.addSystem(levelUpSystem);

      var gameOverSystem = new GameOverSystem();
      gameOverSystem.initialize(game, entityManager);
      game.addSystem(gameOverSystem);

      // Create player at center
      player = entityManager.create(Player);
      var transform = player.getComponent(Transform);
      transform.x = game.width / 2 - transform.width / 2;
      transform.y = game.height / 2 - transform.height / 2;

      // Give player starting weapons
      // Magic Missile - auto-targeting projectile
      var magicMissileData = Data.getWeaponData('magic_missile');
      var magicMissile = new Weapon(magicMissileData);
      player.weaponSlot.addWeapon(magicMissile);

      // Rifle - manual aiming with mouse (click to fire)
      var rifleData = Data.getWeaponData('rifle');
      var rifle = new Weapon(rifleData);
      player.weaponSlot.addWeapon(rifle);

      // Set player reference in systems
      playerSystem.setPlayer(player);
      enemySystem.setPlayer(player);
      traversalEnemySystem.setPlayer(player);
      traversalEnemySystem.setCamera(camera);
      combatSystem.setPlayer(player);
      weaponSystem.setPlayer(player);
      pickupSystem.setPlayer(player);
      hudSystem.setPlayer(player);
      hudSystem.setCamera(camera);
      hudSystem.setWaveSystem(waveSystem);
      weaponSystem.setCamera(camera);
      weaponSystem.initializeBehaviors();
      levelUpSystem.setPlayer(player);
      gameOverSystem.setPlayer(player);
      gameOverSystem.setHUDSystem(hudSystem);

      // Camera follows player
      camera.follow(player);

      // Listen for player death (handled by GameOverSystem)
      events.on('player:died', function (data) {
        console.log('[App] Player died!');
        game.debugManager.error('Player died!');
      });

      // Listen for game restart
      events.on('game:restart', function (data) {
        console.log('[App] Restarting game...');
        window.location.reload();
      });

      // Listen for player damage
      events.on('player:damaged', function (data) {
        game.debugManager.warn('Player hit! HP: ' + data.currentHealth + '/' + data.maxHealth);
      });

      // Listen for level up
      events.on('player:level_up', function (data) {
        game.debugManager.info('Level Up! Now level ' + data.newLevel);
      });

      // Listen for pickup collection
      events.on('pickup:collected', function (data) {
        // Future: visual feedback, sounds
      });

      // Register debug info
      game.debugManager.register(entityManager);
      game.debugManager.register(player);
      game.debugManager.register(camera);
      game.debugManager.register(waveSystem);
      game.debugManager.register(enemySystem);
      game.debugManager.register(traversalEnemySystem);
      game.debugManager.register(collisionSystem);
      game.debugManager.register(combatSystem);
      game.debugManager.register(weaponSystem);
      game.debugManager.register(dropSystem);
      game.debugManager.register(pickupSystem);
      game.debugManager.register(hudSystem);
      game.debugManager.register(levelUpSystem);
      game.debugManager.register(gameOverSystem);
      game.debugManager.register(projectilePool);
      game.debugManager.register(areaEffectPool);
      game.debugManager.register(pickupPool);

      // Register summary providers for high-priority debug info
      game.debugManager.registerSummary(game);
      game.debugManager.registerSummary(events);
      game.debugManager.registerSummary(player);
      game.debugManager.registerSummary(camera);
      game.debugManager.registerSummary(entityManager);

      // Hook into game loop
      events.on('game:started', function () {
        game.debugManager.info('ECS initialized');
        game.debugManager.info('Player spawned');
      });

      await game.start();

      console.log('[App] Game running with ECS');
    } catch (error) {
      console.error('[App] Failed to start game:', error);
    }
  }

  // ============================================
  // Bootstrap
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

  // ============================================
  // Export
  // ============================================
  Object.defineProperty(VampireSurvivors, 'game', {
    get: function () {
      return game;
    },
  });

  Object.defineProperty(VampireSurvivors, 'player', {
    get: function () {
      return player;
    },
  });

  Object.defineProperty(VampireSurvivors, 'camera', {
    get: function () {
      return camera;
    },
  });

  Object.defineProperty(VampireSurvivors, 'entityManager', {
    get: function () {
      return entityManager;
    },
  });
})(window.VampireSurvivors);
