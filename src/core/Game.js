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
  // var GAME_WIDTH = 1280;
  var GAME_WIDTH = 800;
  // var GAME_HEIGHT = 720;
  var GAME_HEIGHT = 600;

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

    _boundLoop = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._time = new Time();
      this._input = new Input();
      this._boundLoop = this._loop.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    async initialize(canvasId) {
      this._canvas = document.getElementById(canvasId);
      if (!this._canvas) {
        throw new Error('Canvas not found: ' + canvasId);
      }

      this._canvas.width = GAME_WIDTH;
      this._canvas.height = GAME_HEIGHT;
      this._ctx = this._canvas.getContext('2d');

      this._input.initialize(this._canvas);

      // Initialize debug manager
      this._debugManager = Debug.debugManager;
      this._debugManager.initialize(this);

      await events.emit('game:initialized', { game: this });

      console.log('[Game] Initialized');
    }

    async start() {
      if (this._isRunning) return;

      this._isRunning = true;
      this._state = GameState.RUNNING;
      this._time.reset();

      await events.emit('game:started', { game: this });

      this._rafId = requestAnimationFrame(this._boundLoop);

      console.log('[Game] Started');
    }

    pause() {
      if (this._state !== GameState.RUNNING) return;

      this._state = GameState.PAUSED;
      this._time.pause();

      events.emitSync('game:paused', { game: this });
    }

    resume() {
      if (this._state !== GameState.PAUSED) return;

      this._state = GameState.RUNNING;
      this._time.resume();

      events.emitSync('game:resumed', { game: this });
    }

    stop() {
      this._isRunning = false;

      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }

      events.emitSync('game:stopped', { game: this });
    }

    gameOver() {
      this._state = GameState.GAME_OVER;
      this._time.pause();

      events.emitSync('game:over', { game: this });
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

      this._input.update();

      this._rafId = requestAnimationFrame(this._boundLoop);
    }

    _update(deltaTime) {
      if (this._state !== GameState.RUNNING) return;

      for (var i = 0; i < this._systems.length; i++) {
        var system = this._systems[i];
        if (system.isEnabled !== false) {
          system.update(deltaTime);
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
      return GAME_WIDTH;
    }

    get height() {
      return GAME_HEIGHT;
    }

    get isRunning() {
      return this._isRunning && this._state === GameState.RUNNING;
    }

    get debugManager() {
      return this._debugManager;
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
          { key: 'Size', value: GAME_WIDTH + 'x' + GAME_HEIGHT },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this.stop();

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
