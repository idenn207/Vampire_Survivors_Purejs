/**
 * @fileoverview High-level ECS container bundling Game, EntityManager, and systems
 * @module ECS/World
 */
(function(ECS) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Game = window.RoguelikeFramework.Core.Game;
  var Camera = window.RoguelikeFramework.Core.Camera;
  var EntityManager = ECS.EntityManager;
  var QueryManager = ECS.QueryManager;

  // ============================================
  // Class Definition
  // ============================================
  class World {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _game = null;
    _entityManager = null;
    _queryManager = null;
    _camera = null;
    _config = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(config) {
      config = config || {};
      this._config = {
        width: config.width || 800,
        height: config.height || 600,
      };

      this._game = new Game(this._config);
      this._entityManager = new EntityManager();
      this._queryManager = new QueryManager(this._entityManager);
      this._camera = new Camera(this._config.width, this._config.height);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Initialize the world
     * @param {string} canvasId - ID of the canvas element
     * @returns {Promise<void>}
     */
    async initialize(canvasId) {
      await this._game.initialize(canvasId);
      this._entityManager.initialize(this._game);
      this._game.input.setCamera(this._camera);
    }

    /**
     * Start the world
     * @returns {Promise<void>}
     */
    async start() {
      await this._game.start();
    }

    /**
     * Pause the world
     */
    pause() {
      this._game.pause();
    }

    /**
     * Resume the world
     */
    resume() {
      this._game.resume();
    }

    /**
     * Stop the world
     */
    stop() {
      this._game.stop();
    }

    /**
     * Add a system to the world
     * @param {System} system
     */
    addSystem(system) {
      system.initialize(this._game, this._entityManager);
      this._game.addSystem(system);
    }

    /**
     * Remove a system from the world
     * @param {System} system
     */
    removeSystem(system) {
      this._game.removeSystem(system);
    }

    /**
     * Get a system by class
     * @param {Function} SystemClass
     * @returns {System|null}
     */
    getSystem(SystemClass) {
      return this._game.getSystem(SystemClass);
    }

    /**
     * Create an entity
     * @param {Function} EntityClass
     * @returns {Entity}
     */
    createEntity(EntityClass) {
      return this._entityManager.create(EntityClass);
    }

    /**
     * Destroy an entity
     * @param {Entity} entity
     */
    destroyEntity(entity) {
      this._entityManager.destroy(entity);
    }

    /**
     * Create a cached component query
     * @param {...Function} ComponentClasses
     * @returns {Query}
     */
    createQuery() {
      return this._queryManager.createQuery.apply(
        this._queryManager,
        arguments
      );
    }

    /**
     * Update camera to follow an entity
     * @param {Entity} entity
     */
    cameraFollow(entity) {
      this._camera.follow(entity);
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** Game instance */
    get game() {
      return this._game;
    }

    /** Entity manager */
    get entityManager() {
      return this._entityManager;
    }

    /** Query manager */
    get queryManager() {
      return this._queryManager;
    }

    /** Camera */
    get camera() {
      return this._camera;
    }

    /** Event bus */
    get events() {
      return window.RoguelikeFramework.Core.events;
    }

    /** Time instance */
    get time() {
      return this._game.time;
    }

    /** Input instance */
    get input() {
      return this._game.input;
    }

    /** Canvas element */
    get canvas() {
      return this._game.canvas;
    }

    /** Canvas 2D context */
    get ctx() {
      return this._game.ctx;
    }

    /** Game width */
    get width() {
      return this._config.width;
    }

    /** Game height */
    get height() {
      return this._config.height;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'World',
        entries: [
          { key: 'State', value: this._game.state },
          { key: 'Entities', value: this._entityManager.getCount() },
          { key: 'Systems', value: this._game.systems.length },
          { key: 'Queries', value: this._queryManager._queries.length },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._queryManager.dispose();
      this._entityManager.dispose();
      this._game.dispose();
      this._camera.dispose();

      this._queryManager = null;
      this._entityManager = null;
      this._game = null;
      this._camera = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  ECS.World = World;

})(window.RoguelikeFramework.ECS);
