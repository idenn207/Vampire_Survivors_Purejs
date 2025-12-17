/**
 * @fileoverview Main HUD class - renders EXP bar, timer, and orchestrates other UI components
 * @module UI/HUD
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var StatusPanel = UI.StatusPanel;
  var WeaponSlots = UI.WeaponSlots;
  var PlayerOverhead = UI.PlayerOverhead;
  var EntityHealthBars = UI.EntityHealthBars;
  var DamageNumbers = UI.DamageNumbers;

  // ============================================
  // Constants
  // ============================================
  // EXP Bar
  var EXP_BAR_HEIGHT = 22;
  var EXP_BAR_Y = 0;
  var EXP_BAR_BG = '#2C3E50';
  var EXP_BAR_FILL = '#9B59B6';
  var EXP_BAR_BORDER = '#1A252F';
  var EXP_TEXT_COLOR = '#FFFFFF';

  // Timer
  var TIMER_Y = 60;
  var TIMER_FONT = 'bold 48px Arial';
  var TIMER_COLOR = '#FFFFFF';
  var TIMER_OUTLINE_COLOR = '#000000';
  var TIMER_OUTLINE_WIDTH = 4;

  // Kill counter
  var KILL_COUNTER_X_OFFSET = 10;
  var KILL_COUNTER_Y = 60;

  // ============================================
  // Class Definition
  // ============================================
  class HUD {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _game = null;
    _camera = null;
    _killCount = 0;

    // UI Components
    _statusPanel = null;
    _weaponSlots = null;
    _playerOverhead = null;
    _entityHealthBars = null;
    _damageNumbers = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._statusPanel = new StatusPanel();
      this._weaponSlots = new WeaponSlots();
      this._playerOverhead = new PlayerOverhead();
      this._entityHealthBars = new EntityHealthBars();
      this._damageNumbers = new DamageNumbers();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, player, camera) {
      this._game = game;
      this._player = player;
      this._camera = camera;

      // Initialize sub-components
      this._statusPanel.setPlayer(player);
      this._weaponSlots.setPlayer(player);
      this._playerOverhead.setPlayer(player);
      this._playerOverhead.setCamera(camera);
      this._entityHealthBars.setCamera(camera);
      this._damageNumbers.setCamera(camera);
    }

    setPlayer(player) {
      this._player = player;
      this._statusPanel.setPlayer(player);
      this._weaponSlots.setPlayer(player);
      this._playerOverhead.setPlayer(player);
    }

    setGame(game) {
      this._game = game;
    }

    setCamera(camera) {
      this._camera = camera;
      this._playerOverhead.setCamera(camera);
      this._entityHealthBars.setCamera(camera);
      this._damageNumbers.setCamera(camera);
    }

    incrementKillCount() {
      this._killCount++;
    }

    update(deltaTime) {
      // Update UI components that need per-frame updates
      this._playerOverhead.update(deltaTime);
      this._entityHealthBars.update(deltaTime);
      this._damageNumbers.update(deltaTime);
    }

    render(ctx) {
      if (!this._game) return;

      var canvasWidth = this._game.width;
      var canvasHeight = this._game.height;

      // Render world-space UI (affected by camera) first
      this._entityHealthBars.render(ctx);
      this._playerOverhead.render(ctx);
      this._damageNumbers.render(ctx);

      // Render EXP bar at top (full width)
      this._renderEXPBar(ctx, canvasWidth);

      // Render timer at top center
      this._renderTimer(ctx, canvasWidth);

      // Render kill counter at top right
      this._renderKillCounter(ctx, canvasWidth);

      // Render sub-components (screen space)
      this._statusPanel.render(ctx);
      this._weaponSlots.render(ctx);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _renderEXPBar(ctx, canvasWidth) {
      if (!this._player || !this._player.experience) return;

      var exp = this._player.experience;
      var current = exp.currentExp;
      var required = exp.expToNextLevel;
      var level = exp.level;
      var ratio = required > 0 ? current / required : 0;

      // Background
      ctx.fillStyle = EXP_BAR_BG;
      ctx.fillRect(0, EXP_BAR_Y, canvasWidth, EXP_BAR_HEIGHT);

      // Border bottom
      ctx.fillStyle = EXP_BAR_BORDER;
      ctx.fillRect(0, EXP_BAR_Y + EXP_BAR_HEIGHT - 2, canvasWidth, 2);

      // Fill
      ctx.fillStyle = EXP_BAR_FILL;
      ctx.fillRect(0, EXP_BAR_Y, canvasWidth * ratio, EXP_BAR_HEIGHT - 2);

      // Level text on left
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = EXP_TEXT_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('LV. ' + level, 10, EXP_BAR_Y + EXP_BAR_HEIGHT / 2);

      // EXP label in center
      ctx.textAlign = 'center';
      ctx.fillText('EXP', canvasWidth / 2, EXP_BAR_Y + EXP_BAR_HEIGHT / 2);

      // XP numbers on right (optional, can be hidden)
      ctx.textAlign = 'right';
      ctx.font = '12px Arial';
      ctx.fillText(Math.floor(current) + ' / ' + Math.floor(required), canvasWidth - 10, EXP_BAR_Y + EXP_BAR_HEIGHT / 2);
    }

    _renderTimer(ctx, canvasWidth) {
      if (!this._game) return;

      var elapsedTime = this._game.elapsedTime || 0;
      var timeStr = this._formatTime(elapsedTime);

      var x = canvasWidth / 2;
      var y = TIMER_Y;

      // Text style
      ctx.font = TIMER_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Outline
      ctx.strokeStyle = TIMER_OUTLINE_COLOR;
      ctx.lineWidth = TIMER_OUTLINE_WIDTH;
      ctx.strokeText(timeStr, x, y);

      // Fill
      ctx.fillStyle = TIMER_COLOR;
      ctx.fillText(timeStr, x, y);
    }

    _renderKillCounter(ctx, canvasWidth) {
      var x = canvasWidth - KILL_COUNTER_X_OFFSET;
      var y = KILL_COUNTER_Y;

      // Label
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';

      // Outline
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText('Kills: ' + this._killCount, x, y);

      // Fill
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Kills: ' + this._killCount, x, y);
    }

    _formatTime(seconds) {
      var mins = Math.floor(seconds / 60);
      var secs = Math.floor(seconds % 60);
      return this._padZero(mins) + ':' + this._padZero(secs);
    }

    _padZero(num) {
      return num < 10 ? '0' + num : num.toString();
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get killCount() {
      return this._killCount;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      if (this._statusPanel) {
        this._statusPanel.dispose();
        this._statusPanel = null;
      }
      if (this._weaponSlots) {
        this._weaponSlots.dispose();
        this._weaponSlots = null;
      }
      if (this._playerOverhead) {
        this._playerOverhead.dispose();
        this._playerOverhead = null;
      }
      if (this._entityHealthBars) {
        this._entityHealthBars.dispose();
        this._entityHealthBars = null;
      }
      if (this._damageNumbers) {
        this._damageNumbers.dispose();
        this._damageNumbers = null;
      }

      this._player = null;
      this._game = null;
      this._camera = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.HUD = HUD;
})(window.VampireSurvivors.UI);
