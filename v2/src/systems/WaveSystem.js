/**
 * @fileoverview Wave system - manages wave progression and difficulty scaling
 * @module Systems/WaveSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var events = window.VampireSurvivors.Core.events;
  var WaveData = window.VampireSurvivors.Data.WaveData;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 4; // Before PlayerSystem (5)
  var TRANSITION_DURATION = 2.0; // seconds for wave announcement

  // ============================================
  // Class Definition
  // ============================================
  class WaveSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _currentWave = 0;
    _waveTimer = 0;
    _waveDuration = 0;
    _isWaveActive = false;
    _difficultyModifiers = null;
    _specialWave = null;
    _isTransitioning = false;
    _transitionTimer = 0;

    // Event handlers
    _boundOnGameStarted = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._boundOnGameStarted = this._onGameStarted.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Start first wave when game starts
      events.on('game:started', this._boundOnGameStarted);
    }

    update(deltaTime) {
      if (!this._isWaveActive && !this._isTransitioning) return;

      // Handle transition animation
      if (this._isTransitioning) {
        this._transitionTimer -= deltaTime;
        if (this._transitionTimer <= 0) {
          this._isTransitioning = false;
          this._isWaveActive = true;
          events.emitSync('wave:started', {
            wave: this._currentWave,
            modifiers: this._difficultyModifiers,
            specialWave: this._specialWave,
          });
        }
        return;
      }

      // Update wave timer
      this._waveTimer += deltaTime;

      // Check for wave completion
      if (this._waveTimer >= this._waveDuration) {
        this._completeWave();
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onGameStarted() {
      this._startWave(1);
    }

    _startWave(waveNumber) {
      this._currentWave = waveNumber;
      this._waveTimer = 0;
      this._waveDuration = WaveData.getWaveDuration(waveNumber);
      this._difficultyModifiers = WaveData.getDifficultyModifiers(waveNumber);
      this._specialWave = WaveData.getSpecialWave(waveNumber);

      // Start transition (announcement)
      this._isTransitioning = true;
      this._transitionTimer = TRANSITION_DURATION;

      // Emit wave announcement event
      events.emitSync('wave:announcing', {
        wave: this._currentWave,
        duration: TRANSITION_DURATION,
        specialWave: this._specialWave,
      });

      console.log('[WaveSystem] Starting wave ' + waveNumber);
    }

    _completeWave() {
      this._isWaveActive = false;

      events.emitSync('wave:completed', {
        wave: this._currentWave,
        timeElapsed: this._waveTimer,
      });

      // Start next wave
      this._startWave(this._currentWave + 1);
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get currentWave() {
      return this._currentWave;
    }

    get waveProgress() {
      return this._waveDuration > 0 ? this._waveTimer / this._waveDuration : 0;
    }

    get timeRemaining() {
      return Math.max(0, this._waveDuration - this._waveTimer);
    }

    get difficultyModifiers() {
      return this._difficultyModifiers;
    }

    get isWaveActive() {
      return this._isWaveActive;
    }

    get isTransitioning() {
      return this._isTransitioning;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var modifiers = this._difficultyModifiers || {};
      return {
        label: 'Waves',
        entries: [
          { key: 'Wave', value: this._currentWave },
          { key: 'Time', value: this._waveTimer.toFixed(1) + '/' + this._waveDuration + 's' },
          { key: 'Spawn Rate', value: (modifiers.spawnRateMultiplier || 1).toFixed(2) + 'x' },
          { key: 'Max Enemies', value: (modifiers.maxEnemiesMultiplier || 1).toFixed(2) + 'x' },
          { key: 'Enemy HP', value: (modifiers.enemyHealthMultiplier || 1).toFixed(2) + 'x' },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('game:started', this._boundOnGameStarted);

      this._difficultyModifiers = null;
      this._specialWave = null;
      this._boundOnGameStarted = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.WaveSystem = WaveSystem;
})(window.VampireSurvivors.Systems);
