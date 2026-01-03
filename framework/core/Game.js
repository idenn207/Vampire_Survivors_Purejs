/**
 * @fileoverview Main game loop and state management
 * @module Core/Game
 */
(function(Core) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Time = Core.Time;
  var Input = Core.Input;
  var events = Core.events;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_WIDTH = 800;
  var DEFAULT_HEIGHT = 600;

  var GameState = Object.freeze({
    INITIALIZING: 'initializing',
    RUNNING: 'running',
    PAUSED: 'paused',
    STOPPED: 'stopped',
    GAME_OVER: 'game_over',
  });

  // ============================================
  // Class Definition
  // ============================================
  class Game {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _canvas = null;
    _ctx = null;
    _time = null;
    _input = null;
    _state = GameState.INITIALIZING;
    _rafId = null;
    _systems = [];
    _isRunning = false;
    _elapsedTime = 0;
    _width = DEFAULT_WIDTH;
    _height = DEFAULT_HEIGHT;

    _boundLoop = null;
    _boundOnRequestPause = null;
    _boundOnRequestResume = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(config) {
      config = config || {};
      this._width = config.width || DEFAULT_WIDTH;
      this._height = config.height || DEFAULT_HEIGHT;

      this._time = new Time();
      this._input = new Input();
      this._boundLoop = this._loop.bind(this);

      // Unity-style: Listen for pause/resume requests
      this._boundOnRequestPause = this._onRequestPause.bind(this);
      this._boundOnRequestResume = this._onRequestResume.bind(this);
      events.on('game:requestPause', this._boundOnRequestPause);
      events.on('game:requestResume', this._boundOnRequestResume);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Initialize the game
     * @param {string} canvasId - ID of the canvas element
     * @returns {Promise<void>}
     */
    async initialize(canvasId) {
      this._canvas = document.getElementById(canvasId);
      if (!this._canvas) {
        throw new Error('[Game] Canvas not found: ' + canvasId);
      }

      this._canvas.width = this._width;
      this._canvas.height = this._height;
      this._ctx = this._canvas.getContext('2d');

      this._input.initialize(this._canvas);

      await events.emit('game:initialized', { game: this });

      console.log('[Game] Initialized at ' + this._width + 'x' + this._height);
    }

    /**
     * Start the game loop
     * @returns {Promise<void>}
     */
    async start() {
      if (this._isRunning) return;

      this._isRunning = true;
      this._state = GameState.RUNNING;
      this._time.reset();
      this._elapsedTime = 0;

      await events.emit('game:started', { game: this });
      events.emitSync('game:stateChanged', { state: GameState.RUNNING, previousState: GameState.INITIALIZING });

      this._rafId = requestAnimationFrame(this._boundLoop);

      console.log('[Game] Started');
    }

    /**
     * Pause the game
     */
    pause() {
      if (this._state !== GameState.RUNNING) return;

      var previousState = this._state;
      this._state = GameState.PAUSED;
      this._time.pause();

      events.emitSync('game:paused', { game: this });
      events.emitSync('game:stateChanged', { state: GameState.PAUSED, previousState: previousState });
    }

    /**
     * Resume the game
     */
    resume() {
      if (this._state !== GameState.PAUSED) return;

      var previousState = this._state;
      this._state = GameState.RUNNING;
      this._time.resume();

      events.emitSync('game:resumed', { game: this });
      events.emitSync('game:stateChanged', { state: GameState.RUNNING, previousState: previousState });
    }

    /**
     * Stop the game loop
     */
    stop() {
      var previousState = this._state;
      this._isRunning = false;
      this._state = GameState.STOPPED;

      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }

      events.emitSync('game:stopped', { game: this });
      events.emitSync('game:stateChanged', { state: GameState.STOPPED, previousState: previousState });
    }

    /**
     * Trigger game over state
     */
    gameOver() {
      var previousState = this._state;
      this._state = GameState.GAME_OVER;
      this._time.pause();

      events.emitSync('game:over', { game: this });
      events.emitSync('game:stateChanged', { state: GameState.GAME_OVER, previousState: previousState });
    }

    /**
     * Add a system to the game (auto-sorted by priority)
     * @param {System} system
     */
    addSystem(system) {
      this._systems.push(system);
      this._systems.sort(function(a, b) {
        return (a.priority || 0) - (b.priority || 0);
      });
    }

    /**
     * Remove a system from the game
     * @param {System} system
     */
    removeSystem(system) {
      var index = this._systems.indexOf(system);
      if (index !== -1) {
        this._systems.splice(index, 1);
      }
    }

    /**
     * Get a system by class
     * @param {Function} SystemClass
     * @returns {System|null}
     */
    getSystem(SystemClass) {
      for (var i = 0; i < this._systems.length; i++) {
        if (this._systems[i] instanceof SystemClass) {
          return this._systems[i];
        }
      }
      return null;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _loop(currentTime) {
      if (!this._isRunning) return;

      this._time.update(currentTime);

      this._update(this._time.deltaTime);
      this._render();

      this._input.update();

      this._rafId = requestAnimationFrame(this._boundLoop);
    }

    _update(deltaTime) {
      var isPaused = this._state !== GameState.RUNNING;

      // Track elapsed game time (only when running)
      if (!isPaused) {
        this._elapsedTime += deltaTime;
      }

      for (var i = 0; i < this._systems.length; i++) {
        var system = this._systems[i];
        if (system.isEnabled !== false) {
          // Update all systems when running, or only updatesDuringPause systems when paused
          if (!isPaused || system.updatesDuringPause) {
            system.update(deltaTime);
          }
        }
      }
    }

    _render() {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

      for (var i = 0; i < this._systems.length; i++) {
        var system = this._systems[i];
        if (system.isEnabled !== false && system.render) {
          system.render(this._ctx);
        }
      }
    }

    _onRequestPause(data) {
      this.pause();
    }

    _onRequestResume(data) {
      this.resume();
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get canvas() {
      return this._canvas;
    }

    get ctx() {
      return this._ctx;
    }

    get time() {
      return this._time;
    }

    get input() {
      return this._input;
    }

    get state() {
      return this._state;
    }

    get width() {
      return this._width;
    }

    get height() {
      return this._height;
    }

    get isRunning() {
      return this._isRunning && this._state === GameState.RUNNING;
    }

    get elapsedTime() {
      return this._elapsedTime;
    }

    get systems() {
      return this._systems;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Game',
        entries: [
          { key: 'State', value: this._state },
          { key: 'Systems', value: this._systems.length },
          { key: 'Size', value: this._width + 'x' + this._height },
          { key: 'FPS', value: this._time.fps },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this.stop();

      events.off('game:requestPause', this._boundOnRequestPause);
      events.off('game:requestResume', this._boundOnRequestResume);
      this._boundOnRequestPause = null;
      this._boundOnRequestResume = null;

      for (var i = 0; i < this._systems.length; i++) {
        var system = this._systems[i];
        if (system.dispose) {
          system.dispose();
        }
      }
      this._systems = [];

      this._input.dispose();

      this._canvas = null;
      this._ctx = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Core.Game = Game;
  Core.GameState = GameState;

})(window.RoguelikeFramework.Core);
