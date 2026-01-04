/**
 * @fileoverview Main game loop and state management
 * @module Core/Game
 */
(function (Core) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Time = Core.Time;
  var Input = Core.Input;
  var events = Core.events;
  var Debug = window.VampireSurvivors.Debug;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_WIDTH = 800;
  var DEFAULT_HEIGHT = 600;

  // For backwards compatibility, keep these as aliases
  var GAME_WIDTH = DEFAULT_WIDTH;
  var GAME_HEIGHT = DEFAULT_HEIGHT;

  var GameState = Object.freeze({
    INITIALIZING: 'initializing',
    RUNNING: 'running',
    PAUSED: 'paused',
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
    _debugManager = null;
    _state = GameState.INITIALIZING;
    _rafId = null;
    _systems = [];
    _isRunning = false;
    _elapsedTime = 0; // Total game time in seconds
    _width = DEFAULT_WIDTH;
    _height = DEFAULT_HEIGHT;

    _boundLoop = null;

    // Bound event handlers for Unity-style request/response pattern
    _boundOnRequestPause = null;
    _boundOnRequestResume = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._time = new Time();
      this._input = new Input();
      this._boundLoop = this._loop.bind(this);

      // Unity-style: Listen for pause/resume requests instead of direct calls
      this._boundOnRequestPause = this._onRequestPause.bind(this);
      this._boundOnRequestResume = this._onRequestResume.bind(this);
      events.on('game:requestPause', this._boundOnRequestPause);
      events.on('game:requestResume', this._boundOnRequestResume);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    async initialize(canvasId) {
      this._canvas = document.getElementById(canvasId);
      if (!this._canvas) {
        throw new Error('Canvas not found: ' + canvasId);
      }

      // Load saved resolution from localStorage
      this._loadSavedResolution();

      this._canvas.width = this._width;
      this._canvas.height = this._height;
      this._ctx = this._canvas.getContext('2d');

      // Initialize UIScale with current resolution
      Core.UIScale.update(this._width, this._height);

      this._input.initialize(this._canvas);

      // Initialize debug manager
      this._debugManager = Debug.debugManager;
      this._debugManager.initialize(this);

      await events.emit('game:initialized', { game: this });

      console.log('[Game] Initialized at ' + this._width + 'x' + this._height);
    }

    /**
     * Load saved resolution from localStorage
     */
    _loadSavedResolution() {
      try {
        var saved = localStorage.getItem('vampireSurvivors_resolution');
        if (saved) {
          var resolution = JSON.parse(saved);
          if (resolution.width && resolution.height) {
            this._width = resolution.width;
            this._height = resolution.height;
          }
        }
      } catch (e) {
        // Use defaults on error
        console.warn('[Game] Failed to load saved resolution:', e);
      }
    }

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

    pause() {
      if (this._state !== GameState.RUNNING) return;

      var previousState = this._state;
      this._state = GameState.PAUSED;
      this._time.pause();

      events.emitSync('game:paused', { game: this });
      events.emitSync('game:stateChanged', { state: GameState.PAUSED, previousState: previousState });
    }

    resume() {
      if (this._state !== GameState.PAUSED) return;

      var previousState = this._state;
      this._state = GameState.RUNNING;
      this._time.resume();

      events.emitSync('game:resumed', { game: this });
      events.emitSync('game:stateChanged', { state: GameState.RUNNING, previousState: previousState });
    }

    stop() {
      var previousState = this._state;
      this._isRunning = false;

      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }

      events.emitSync('game:stopped', { game: this });
      events.emitSync('game:stateChanged', { state: 'stopped', previousState: previousState });
    }

    gameOver() {
      var previousState = this._state;
      this._state = GameState.GAME_OVER;
      this._time.pause();

      events.emitSync('game:over', { game: this });
      events.emitSync('game:stateChanged', { state: GameState.GAME_OVER, previousState: previousState });
    }

    addSystem(system) {
      this._systems.push(system);
      this._systems.sort(function (a, b) {
        return (a.priority || 0) - (b.priority || 0);
      });
    }

    removeSystem(system) {
      var index = this._systems.indexOf(system);
      if (index !== -1) {
        this._systems.splice(index, 1);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _loop(currentTime) {
      if (!this._isRunning) return;

      this._time.update(currentTime);

      this._update(this._time.deltaTime);
      this._render();

      // Handle debug panel input (must run even when paused)
      if (this._debugManager) {
        this._debugManager.handleClick(this._input);
      }

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

      // Render debug overlay (always on top)
      if (this._debugManager) {
        this._debugManager.render(this._ctx);
      }
    }

    // ----------------------------------------
    // Unity-style Request Handlers
    // ----------------------------------------
    /**
     * Handle pause request event
     * @param {Object} data - { requester: string }
     */
    _onRequestPause(data) {
      this.pause();
    }

    /**
     * Handle resume request event
     * @param {Object} data - { requester: string }
     */
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

    get debugManager() {
      return this._debugManager;
    }

    get elapsedTime() {
      return this._elapsedTime;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getSummaryInfo() {
      return [{ key: 'FPS', value: Math.round(this._time.fps) }];
    }

    getDebugInfo() {
      return {
        label: 'Game',
        entries: [
          { key: 'State', value: this._state },
          { key: 'Systems', value: this._systems.length },
          { key: 'Size', value: this._width + 'x' + this._height },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this.stop();

      // Unsubscribe from request events
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

      if (this._debugManager) {
        this._debugManager.dispose();
        this._debugManager = null;
      }

      this._input.dispose();
      events.dispose();

      this._canvas = null;
      this._ctx = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Core.Game = Game;
  Core.GameState = GameState;
  Core.GAME_WIDTH = GAME_WIDTH;
  Core.GAME_HEIGHT = GAME_HEIGHT;
})(window.VampireSurvivors.Core);
