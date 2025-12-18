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
  // Arrow Indicator Constants
  // ============================================
  var ARROW_SIZE = 50; // Larger arrows for better visibility
  var ARROW_MARGIN = 60;
  var ARROW_PULSE_SPEED = 4;

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
    _traversalSystem = null;

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

    setTraversalSystem(traversalSystem) {
      this._traversalSystem = traversalSystem;
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

      // Render arrow indicators AFTER HUD so they appear on top
      this._renderArrowIndicators(ctx);
    }

    // ----------------------------------------
    // Arrow Indicator Rendering
    // ----------------------------------------
    _renderArrowIndicators(ctx) {
      if (!this._traversalSystem || !this._game) return;

      var indicators = this._traversalSystem.getPendingIndicators();
      if (!indicators || indicators.length === 0) return;

      var width = this._game.width;
      var height = this._game.height;
      var time = this._game.elapsedTime;

      for (var i = 0; i < indicators.length; i++) {
        var indicator = indicators[i];
        var color = indicator.color;
        var progress = indicator.progress;

        // Pulsing effect based on progress (faster as spawn approaches)
        var pulseRate = ARROW_PULSE_SPEED * (1 + progress * 2);
        var pulse = 0.5 + 0.5 * Math.sin(time * pulseRate);
        var alpha = 0.4 + 0.6 * progress; // More opaque as spawn approaches
        var scale = 0.8 + 0.4 * progress; // Larger as spawn approaches

        ctx.save();
        ctx.globalAlpha = alpha * (0.7 + 0.3 * pulse);

        // Draw arrow for each direction
        for (var j = 0; j < indicator.directions.length; j++) {
          this._drawArrow(ctx, indicator.directions[j], color, scale, width, height);
        }

        ctx.restore();
      }
    }

    _drawArrow(ctx, direction, color, scale, width, height) {
      var size = ARROW_SIZE * scale;
      var margin = ARROW_MARGIN;
      var x, y, angle;

      switch (direction) {
        case 'top':
          x = width / 2;
          y = margin + size / 2;
          angle = Math.PI / 2; // Point down
          break;
        case 'bottom':
          x = width / 2;
          y = height - margin - size / 2;
          angle = -Math.PI / 2; // Point up
          break;
        case 'left':
          x = margin + size / 2;
          y = height / 2;
          angle = 0; // Point right
          break;
        case 'right':
          x = width - margin - size / 2;
          y = height / 2;
          angle = Math.PI; // Point left
          break;
        default:
          return;
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Draw filled arrow
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(size / 2, 0); // Tip
      ctx.lineTo(-size / 2, -size / 2); // Top left
      ctx.lineTo(-size / 4, 0); // Inner left
      ctx.lineTo(-size / 2, size / 2); // Bottom left
      ctx.closePath();
      ctx.fill();

      // Draw outline for better visibility
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
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
      this._traversalSystem = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.HUDSystem = HUDSystem;
})(window.VampireSurvivors.Systems);
