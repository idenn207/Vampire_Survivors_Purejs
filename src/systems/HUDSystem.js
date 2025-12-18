/**
 * @fileoverview HUD System - integrates HUD rendering into the game loop
 * @module Systems/HUDSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var HUD = window.VampireSurvivors.UI.HUD;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 110; // After RenderSystem (100)

  // ============================================
  // Class Definition
  // ============================================
  class HUDSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _hud = null;
    _player = null;
    _camera = null;

    // Event handlers (bound)
    _boundOnEntityDied = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._hud = new HUD();

      // Bind event handlers
      this._boundOnEntityDied = this._onEntityDied.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Subscribe to events
      events.on('entity:died', this._boundOnEntityDied);
    }

    setPlayer(player) {
      this._player = player;
      if (this._hud && this._game) {
        this._hud.initialize(this._game, player, this._camera);
      }
    }

    setCamera(camera) {
      this._camera = camera;
      if (this._hud) {
        this._hud.setCamera(camera);
      }
    }

    setWaveSystem(waveSystem) {
      if (this._hud) {
        this._hud.setWaveSystem(waveSystem);
      }
    }

    update(deltaTime) {
      // Update HUD components (health bar visibility, damage numbers, etc.)
      if (this._hud) {
        this._hud.update(deltaTime);
      }
    }

    render(ctx) {
      if (this._hud) {
        this._hud.render(ctx);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onEntityDied(data) {
      // Increment kill count for enemies
      if (data && data.entity && data.entity.hasTag && data.entity.hasTag('enemy')) {
        this._hud.incrementKillCount();
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'HUD',
        entries: [
          { key: 'Kills', value: this._hud ? this._hud.killCount : 0 },
          { key: 'Timer', value: this._game ? this._formatTime(this._game.elapsedTime) : '00:00' },
        ],
      };
    }

    _formatTime(seconds) {
      var mins = Math.floor(seconds / 60);
      var secs = Math.floor(seconds % 60);
      return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      // Unsubscribe from events
      events.off('entity:died', this._boundOnEntityDied);

      if (this._hud) {
        this._hud.dispose();
        this._hud = null;
      }

      this._player = null;
      this._camera = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.HUDSystem = HUDSystem;
})(window.VampireSurvivors.Systems);
