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

  var Game = Core.Game;
  var Camera = Core.Camera;
  var events = Core.events;

  var Transform = Components.Transform;
  var EntityManager = Managers.EntityManager;
  var Player = Entities.Player;
  var BackgroundSystem = Systems.BackgroundSystem;
  var PlayerSystem = Systems.PlayerSystem;
  var EnemySystem = Systems.EnemySystem;
  var MovementSystem = Systems.MovementSystem;
  var CollisionSystem = Systems.CollisionSystem;
  var CombatSystem = Systems.CombatSystem;
  var CameraSystem = Systems.CameraSystem;
  var RenderSystem = Systems.RenderSystem;

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

      // Setup camera
      camera = new Camera(game.width, game.height);
      game.input.setCamera(camera);

      // Setup systems (priority order: 0 -> 5 -> 10 -> 50 -> 100)
      var backgroundSystem = new BackgroundSystem();
      backgroundSystem.initialize(game, entityManager);
      backgroundSystem.setCamera(camera);
      game.addSystem(backgroundSystem);

      var playerSystem = new PlayerSystem();
      playerSystem.initialize(game, entityManager);
      game.addSystem(playerSystem);

      var enemySystem = new EnemySystem();
      enemySystem.initialize(game, entityManager);
      game.addSystem(enemySystem);

      var movementSystem = new MovementSystem();
      movementSystem.initialize(game, entityManager);
      game.addSystem(movementSystem);

      var collisionSystem = new CollisionSystem();
      collisionSystem.initialize(game, entityManager);
      game.addSystem(collisionSystem);

      var combatSystem = new CombatSystem();
      combatSystem.initialize(game, entityManager);
      combatSystem.setCollisionSystem(collisionSystem);
      game.addSystem(combatSystem);

      var cameraSystem = new CameraSystem();
      cameraSystem.initialize(game, entityManager);
      cameraSystem.setCamera(camera);
      game.addSystem(cameraSystem);

      var renderSystem = new RenderSystem();
      renderSystem.initialize(game, entityManager);
      renderSystem.setCamera(camera);
      game.addSystem(renderSystem);

      // Create player at center
      player = entityManager.create(Player);
      var transform = player.getComponent(Transform);
      transform.x = game.width / 2 - transform.width / 2;
      transform.y = game.height / 2 - transform.height / 2;

      // Set player reference in systems
      playerSystem.setPlayer(player);
      enemySystem.setPlayer(player);
      combatSystem.setPlayer(player);

      // Camera follows player
      camera.follow(player);

      // Listen for player death
      events.on('player:died', function (data) {
        console.log('[App] Player died!');
        game.debugManager.error('Player died!');
        // TODO: Implement game over screen
      });

      // Listen for player damage
      events.on('player:damaged', function (data) {
        game.debugManager.warn('Player hit! HP: ' + data.currentHealth + '/' + data.maxHealth);
      });

      // Register debug info
      game.debugManager.register(entityManager);
      game.debugManager.register(player);
      game.debugManager.register(camera);
      game.debugManager.register(enemySystem);
      game.debugManager.register(collisionSystem);
      game.debugManager.register(combatSystem);

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
