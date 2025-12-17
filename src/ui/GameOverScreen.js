/**
 * @fileoverview Game Over screen - displays final stats and restart option
 * @module UI/GameOverScreen
 */
(function (UI) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var OVERLAY_COLOR = 'rgba(0, 0, 0, 0.85)';

  // Panel dimensions
  var PANEL_WIDTH = 400;
  var PANEL_HEIGHT = 450;
  var PANEL_BG = '#2C3E50';
  var PANEL_BORDER = '#E74C3C';
  var PANEL_BORDER_WIDTH = 4;

  // Title styling
  var TITLE_TEXT = 'GAME OVER';
  var TITLE_COLOR = '#E74C3C';
  var TITLE_FONT = 'bold 48px Arial';
  var TITLE_SHADOW_COLOR = '#000000';
  var TITLE_SHADOW_OFFSET = 3;

  // Stats styling
  var STAT_LABEL_COLOR = '#BDC3C7';
  var STAT_VALUE_COLOR = '#FFFFFF';
  var STAT_LABEL_FONT = '18px Arial';
  var STAT_VALUE_FONT = 'bold 24px Arial';
  var STAT_LINE_HEIGHT = 55;
  var STAT_START_Y = 140;

  // Button styling
  var BUTTON_WIDTH = 200;
  var BUTTON_HEIGHT = 50;
  var BUTTON_BG = '#E74C3C';
  var BUTTON_HOVER_BG = '#C0392B';
  var BUTTON_TEXT_COLOR = '#FFFFFF';
  var BUTTON_FONT = 'bold 20px Arial';
  var BUTTON_BORDER_WIDTH = 2;
  var BUTTON_BORDER_COLOR = '#FFFFFF';

  // ============================================
  // Class Definition
  // ============================================
  class GameOverScreen {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _canvasWidth = 800;
    _canvasHeight = 600;
    _stats = null;
    _buttonRect = null;
    _isButtonHovered = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show the game over screen
     * @param {Object} stats - Player final stats
     * @param {number} stats.timeSurvived - Time in seconds
     * @param {number} stats.level - Final level
     * @param {number} stats.kills - Total enemy kills
     * @param {number} stats.gold - Total gold earned
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    show(stats, canvasWidth, canvasHeight) {
      this._isVisible = true;
      this._stats = stats || {
        timeSurvived: 0,
        level: 1,
        kills: 0,
        gold: 0,
      };
      this._canvasWidth = canvasWidth || 800;
      this._canvasHeight = canvasHeight || 600;
      this._isButtonHovered = false;
      this._calculateButtonRect();
    }

    /**
     * Hide the screen
     */
    hide() {
      this._isVisible = false;
      this._stats = null;
    }

    /**
     * Handle input
     * @param {Object} input - Input manager
     * @returns {Object|null} Result of any action taken
     */
    handleInput(input) {
      if (!this._isVisible) return null;

      // Get mouse position
      var mousePos = input.mousePosition;
      var mouseX = mousePos.x;
      var mouseY = mousePos.y;

      // Check button hover
      this._isButtonHovered = this._isPointInRect(mouseX, mouseY, this._buttonRect);

      // Handle click
      if (input.isMousePressed(0) && this._isButtonHovered) {
        return { action: 'restart' };
      }

      return null;
    }

    /**
     * Render the screen
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._isVisible) return;

      // Dark overlay
      ctx.fillStyle = OVERLAY_COLOR;
      ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

      // Calculate panel position (centered)
      var panelX = (this._canvasWidth - PANEL_WIDTH) / 2;
      var panelY = (this._canvasHeight - PANEL_HEIGHT) / 2;

      // Render components
      this._renderPanel(ctx, panelX, panelY);
      this._renderTitle(ctx, panelX, panelY);
      this._renderStats(ctx, panelX, panelY);
      this._renderButton(ctx);
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isVisible() {
      return this._isVisible;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _calculateButtonRect() {
      this._buttonRect = {
        x: (this._canvasWidth - BUTTON_WIDTH) / 2,
        y: (this._canvasHeight + PANEL_HEIGHT) / 2 - BUTTON_HEIGHT - 30,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
      };
    }

    _renderPanel(ctx, x, y) {
      // Panel border
      ctx.fillStyle = PANEL_BORDER;
      ctx.fillRect(
        x - PANEL_BORDER_WIDTH,
        y - PANEL_BORDER_WIDTH,
        PANEL_WIDTH + PANEL_BORDER_WIDTH * 2,
        PANEL_HEIGHT + PANEL_BORDER_WIDTH * 2
      );

      // Panel background
      ctx.fillStyle = PANEL_BG;
      ctx.fillRect(x, y, PANEL_WIDTH, PANEL_HEIGHT);
    }

    _renderTitle(ctx, panelX, panelY) {
      var centerX = panelX + PANEL_WIDTH / 2;
      var titleY = panelY + 70;

      ctx.font = TITLE_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shadow
      ctx.fillStyle = TITLE_SHADOW_COLOR;
      ctx.fillText(TITLE_TEXT, centerX + TITLE_SHADOW_OFFSET, titleY + TITLE_SHADOW_OFFSET);

      // Title
      ctx.fillStyle = TITLE_COLOR;
      ctx.fillText(TITLE_TEXT, centerX, titleY);
    }

    _renderStats(ctx, panelX, panelY) {
      if (!this._stats) return;

      var centerX = panelX + PANEL_WIDTH / 2;
      var statsY = panelY + STAT_START_Y;

      var statsList = [
        { label: 'Time Survived', value: this._formatTime(this._stats.timeSurvived) },
        { label: 'Level Reached', value: this._stats.level.toString() },
        { label: 'Enemies Killed', value: this._stats.kills.toString() },
        { label: 'Gold Earned', value: this._stats.gold.toString() },
      ];

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (var i = 0; i < statsList.length; i++) {
        var y = statsY + i * STAT_LINE_HEIGHT;

        // Label
        ctx.font = STAT_LABEL_FONT;
        ctx.fillStyle = STAT_LABEL_COLOR;
        ctx.fillText(statsList[i].label, centerX, y);

        // Value
        ctx.font = STAT_VALUE_FONT;
        ctx.fillStyle = STAT_VALUE_COLOR;
        ctx.fillText(statsList[i].value, centerX, y + 24);
      }
    }

    _renderButton(ctx) {
      var rect = this._buttonRect;
      if (!rect) return;

      // Button background
      ctx.fillStyle = this._isButtonHovered ? BUTTON_HOVER_BG : BUTTON_BG;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Button border
      ctx.strokeStyle = BUTTON_BORDER_COLOR;
      ctx.lineWidth = BUTTON_BORDER_WIDTH;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Button text
      ctx.font = BUTTON_FONT;
      ctx.fillStyle = BUTTON_TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('RESTART', rect.x + rect.width / 2, rect.y + rect.height / 2);
    }

    _formatTime(seconds) {
      var totalSeconds = Math.floor(seconds || 0);
      var mins = Math.floor(totalSeconds / 60);
      var secs = totalSeconds % 60;
      return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    _isPointInRect(x, y, rect) {
      if (!rect) return false;
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._stats = null;
      this._buttonRect = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.GameOverScreen = GameOverScreen;
})(window.VampireSurvivors.UI);
