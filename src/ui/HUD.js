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
  var WaveAnnouncement = UI.WaveAnnouncement;
  var BossHealthBar = UI.BossHealthBar;
  var SkillCooldowns = UI.SkillCooldowns;
  var Minimap = UI.Minimap;
  var PlayerStatusEffects = UI.PlayerStatusEffects;
  var events = window.VampireSurvivors.Core.events;
  var UIScale = window.VampireSurvivors.Core.UIScale;
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants (base values at 800x600)
  // ============================================
  // EXP Bar
  var BASE_EXP_BAR_HEIGHT = 22;
  var BASE_EXP_BAR_Y = 0;
  var EXP_BAR_BG = '#2C3E50';
  var EXP_BAR_FILL = '#9B59B6';
  var EXP_BAR_BORDER = '#1A252F';
  var EXP_TEXT_COLOR = '#FFFFFF';

  // Top-right info bar (timer, wave, kills on same line)
  var BASE_INFO_BAR_Y = 30;
  var BASE_INFO_BAR_X_OFFSET = 10;
  var BASE_INFO_BAR_FONT_SIZE = 18;

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

    // Wave system reference
    _waveSystem = null;
    _currentWave = 1;

    // UI Components
    _statusPanel = null;
    _weaponSlots = null;
    _playerOverhead = null;
    _entityHealthBars = null;
    _damageNumbers = null;
    _waveAnnouncement = null;
    _bossHealthBar = null;
    _skillCooldowns = null;
    _minimap = null;
    _playerStatusEffects = null;

    // Event handlers
    _boundOnWaveAnnouncing = null;
    _boundOnWaveStarted = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._statusPanel = new StatusPanel();
      this._weaponSlots = new WeaponSlots();
      this._playerOverhead = new PlayerOverhead();
      this._entityHealthBars = new EntityHealthBars();
      this._damageNumbers = new DamageNumbers();
      this._waveAnnouncement = new WaveAnnouncement();
      this._bossHealthBar = new BossHealthBar();
      this._skillCooldowns = new SkillCooldowns();
      this._minimap = new Minimap();
      this._playerStatusEffects = new PlayerStatusEffects();

      // Bind event handlers
      this._boundOnWaveAnnouncing = this._onWaveAnnouncing.bind(this);
      this._boundOnWaveStarted = this._onWaveStarted.bind(this);

      // Subscribe to wave events
      events.on('wave:announcing', this._boundOnWaveAnnouncing);
      events.on('wave:started', this._boundOnWaveStarted);
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
      this._skillCooldowns.setPlayer(player);
      this._minimap.setPlayer(player);
      this._playerStatusEffects.setPlayer(player);
    }

    setPlayer(player) {
      this._player = player;
      this._statusPanel.setPlayer(player);
      this._weaponSlots.setPlayer(player);
      this._playerOverhead.setPlayer(player);
      this._skillCooldowns.setPlayer(player);
      this._minimap.setPlayer(player);
      this._playerStatusEffects.setPlayer(player);
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

    setWaveSystem(waveSystem) {
      this._waveSystem = waveSystem;
    }

    incrementKillCount() {
      this._killCount++;
    }

    update(deltaTime) {
      // Update UI components that need per-frame updates
      this._playerOverhead.update(deltaTime);
      this._entityHealthBars.update(deltaTime);
      this._damageNumbers.update(deltaTime);
      this._waveAnnouncement.update(deltaTime);
      this._bossHealthBar.update(deltaTime);
      this._minimap.update(deltaTime);
      this._playerStatusEffects.update(deltaTime);
    }

    setBoss(boss) {
      if (this._bossHealthBar) {
        this._bossHealthBar.setBoss(boss);
      }
    }

    clearBoss() {
      if (this._bossHealthBar) {
        this._bossHealthBar.clearBoss();
      }
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

      // Render boss health bar (below EXP bar)
      this._bossHealthBar.render(ctx, canvasWidth);

      // Render info bar at top right (timer, wave, kills on same line)
      this._renderInfoBar(ctx, canvasWidth);

      // Render player status effects (below wave indicator)
      this._playerStatusEffects.render(ctx, canvasWidth, canvasHeight);

      // Render sub-components (screen space)
      this._statusPanel.render(ctx);
      this._weaponSlots.render(ctx);
      this._skillCooldowns.render(ctx, canvasWidth, canvasHeight);
      this._minimap.render(ctx, canvasWidth, canvasHeight);

      // Render wave announcement on top
      this._waveAnnouncement.render(ctx, canvasWidth, canvasHeight);
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

      // Scale dimensions
      var expBarHeight = UIScale.scale(BASE_EXP_BAR_HEIGHT);
      var expBarY = UIScale.scale(BASE_EXP_BAR_Y);
      var borderHeight = UIScale.scale(2);
      var textPadding = UIScale.scale(10);

      // Background
      ctx.fillStyle = EXP_BAR_BG;
      ctx.fillRect(0, expBarY, canvasWidth, expBarHeight);

      // Border bottom
      ctx.fillStyle = EXP_BAR_BORDER;
      ctx.fillRect(0, expBarY + expBarHeight - borderHeight, canvasWidth, borderHeight);

      // Fill
      ctx.fillStyle = EXP_BAR_FILL;
      ctx.fillRect(0, expBarY, canvasWidth * ratio, expBarHeight - borderHeight);

      // Level text on left
      ctx.font = UIScale.font(14, 'bold');
      ctx.fillStyle = EXP_TEXT_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.t('hud.level') + ' ' + level, textPadding, expBarY + expBarHeight / 2);

      // EXP label in center
      ctx.textAlign = 'center';
      ctx.fillText(i18n.t('hud.exp'), canvasWidth / 2, expBarY + expBarHeight / 2);

      // XP numbers on right (optional, can be hidden)
      ctx.textAlign = 'right';
      ctx.font = UIScale.font(12);
      ctx.fillText(Math.floor(current) + ' / ' + Math.floor(required), canvasWidth - textPadding, expBarY + expBarHeight / 2);
    }

    _renderInfoBar(ctx, canvasWidth) {
      var x = canvasWidth - UIScale.scale(BASE_INFO_BAR_X_OFFSET);
      var y = UIScale.scale(BASE_INFO_BAR_Y);

      ctx.font = UIScale.font(BASE_INFO_BAR_FONT_SIZE, 'bold');
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.lineWidth = UIScale.scale(3);
      ctx.strokeStyle = '#000000';

      // Build info string: Timer | Wave X | Kills: X
      var parts = [];

      // Timer
      if (this._game) {
        var elapsedTime = this._game.elapsedTime || 0;
        parts.push(this._formatTime(elapsedTime));
      }

      // Wave
      parts.push(i18n.t('hud.wave') + ' ' + this._currentWave);

      // Kills
      parts.push(i18n.t('hud.kills') + ': ' + this._killCount);

      var infoText = parts.join('  |  ');

      // Draw outline
      ctx.strokeText(infoText, x, y);

      // Draw fill
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(infoText, x, y);
    }

    _onWaveAnnouncing(data) {
      this._waveAnnouncement.show(data.wave, data.duration, data.specialWave);
    }

    _onWaveStarted(data) {
      this._currentWave = data.wave;
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
      // Unsubscribe from events
      events.off('wave:announcing', this._boundOnWaveAnnouncing);
      events.off('wave:started', this._boundOnWaveStarted);

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
      if (this._waveAnnouncement) {
        this._waveAnnouncement.dispose();
        this._waveAnnouncement = null;
      }
      if (this._bossHealthBar) {
        this._bossHealthBar.dispose();
        this._bossHealthBar = null;
      }
      if (this._skillCooldowns) {
        this._skillCooldowns.dispose();
        this._skillCooldowns = null;
      }
      if (this._minimap) {
        this._minimap.dispose();
        this._minimap = null;
      }
      if (this._playerStatusEffects) {
        this._playerStatusEffects.dispose();
        this._playerStatusEffects = null;
      }

      this._player = null;
      this._game = null;
      this._camera = null;
      this._waveSystem = null;
      this._boundOnWaveAnnouncing = null;
      this._boundOnWaveStarted = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.HUD = HUD;
})(window.VampireSurvivors.UI);
