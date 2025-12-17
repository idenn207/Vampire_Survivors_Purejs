/**
 * @fileoverview Time management for game loop
 * @module Core/Time
 */
(function(Core) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var MAX_DELTA = 0.1;
  var TARGET_FPS = 60;
  var TARGET_FRAME_TIME = 1000 / TARGET_FPS;

  // ============================================
  // Class Definition
  // ============================================
  class Time {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _lastTime = 0;
    _deltaTime = 0;
    _unscaledDeltaTime = 0;
    _timeScale = 1;
    _elapsed = 0;
    _frameCount = 0;
    _fps = 0;
    _fpsAccumulator = 0;
    _fpsFrameCount = 0;
    _isPaused = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    update(currentTime) {
      if (this._lastTime === 0) {
        this._lastTime = currentTime;
        return;
      }

      this._unscaledDeltaTime = (currentTime - this._lastTime) / 1000;
      this._lastTime = currentTime;

      if (this._unscaledDeltaTime > MAX_DELTA) {
        this._unscaledDeltaTime = MAX_DELTA;
      }

      if (this._isPaused) {
        this._deltaTime = 0;
      } else {
        this._deltaTime = this._unscaledDeltaTime * this._timeScale;
        this._elapsed += this._deltaTime;
      }

      this._frameCount++;
      this._updateFPS();
    }

    reset() {
      this._lastTime = 0;
      this._deltaTime = 0;
      this._unscaledDeltaTime = 0;
      this._elapsed = 0;
      this._frameCount = 0;
      this._fps = 0;
      this._fpsAccumulator = 0;
      this._fpsFrameCount = 0;
    }

    pause() {
      this._isPaused = true;
    }

    resume() {
      this._isPaused = false;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _updateFPS() {
      this._fpsAccumulator += this._unscaledDeltaTime;
      this._fpsFrameCount++;

      if (this._fpsAccumulator >= 1) {
        this._fps = this._fpsFrameCount / this._fpsAccumulator;
        this._fpsAccumulator = 0;
        this._fpsFrameCount = 0;
      }
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get deltaTime() {
      return this._deltaTime;
    }

    get unscaledDeltaTime() {
      return this._unscaledDeltaTime;
    }

    get timeScale() {
      return this._timeScale;
    }

    set timeScale(value) {
      this._timeScale = Math.max(0, value);
    }

    get elapsed() {
      return this._elapsed;
    }

    get frameCount() {
      return this._frameCount;
    }

    get fps() {
      return Math.round(this._fps);
    }

    get isPaused() {
      return this._isPaused;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Core.Time = Time;

})(window.VampireSurvivors.Core);
