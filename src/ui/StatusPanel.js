/**
 * @fileoverview Status panel UI component - character portrait, HP/SG bars, currency
 * @module UI/StatusPanel
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var PANEL_X = 10;
  var PANEL_Y = 30; // Below EXP bar

  var PORTRAIT_SIZE = 80;
  var PORTRAIT_BORDER = 4;
  var PORTRAIT_COLOR = '#4ECDC4'; // Cyan border
  var PORTRAIT_BG = '#2C3E50';

  var BAR_WIDTH = 150;
  var BAR_HEIGHT = 16;
  var BAR_GAP = 4;
  var BAR_OFFSET_X = PORTRAIT_SIZE + PORTRAIT_BORDER * 2 + 10;

  var HP_BAR_BG = '#333333';
  var HP_BAR_FILL = '#E74C3C';
  var HP_BAR_BORDER = '#222222';

  var SG_BAR_BG = '#333333';
  var SG_BAR_FILL = '#F39C12';
  var SG_BAR_BORDER = '#222222';

  var CURRENCY_ICON_SIZE = 16;
  var CURRENCY_GAP = 20;

  // Upgrade button
  var UPGRADE_BTN_SIZE = 20;
  var UPGRADE_BTN_COLOR = '#3498DB';
  var UPGRADE_BTN_HOVER_COLOR = '#2980B9';

  // ============================================
  // Class Definition
  // ============================================
  class StatusPanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _upgradeButtonRect = null;
    _isUpgradeButtonHovered = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._upgradeButtonRect = { x: 0, y: 0, width: UPGRADE_BTN_SIZE, height: UPGRADE_BTN_SIZE };
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Handle mouse move for hover detection
     * @param {number} mouseX
     * @param {number} mouseY
     */
    handleMouseMove(mouseX, mouseY) {
      this._isUpgradeButtonHovered = this._isPointInRect(
        mouseX,
        mouseY,
        this._upgradeButtonRect
      );
    }

    /**
     * Handle click - check if upgrade button was clicked
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {boolean} True if button was clicked
     */
    handleClick(mouseX, mouseY) {
      if (this._isPointInRect(mouseX, mouseY, this._upgradeButtonRect)) {
        events.emit('upgrade:open_screen');
        return true;
      }
      return false;
    }

    render(ctx) {
      if (!this._player) return;

      var x = PANEL_X;
      var y = PANEL_Y;

      // Render portrait
      this._renderPortrait(ctx, x, y);

      // Render level on portrait
      this._renderLevel(ctx, x, y);

      // Render HP bar
      var barX = x + BAR_OFFSET_X;
      var barY = y + 5;
      this._renderHPBar(ctx, barX, barY);

      // Render SG bar
      barY += BAR_HEIGHT + BAR_GAP;
      this._renderSGBar(ctx, barX, barY);

      // Render currency
      var currencyY = barY + BAR_HEIGHT + BAR_GAP + 5;
      this._renderCurrency(ctx, barX, currencyY);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _renderPortrait(ctx, x, y) {
      // Border
      ctx.fillStyle = PORTRAIT_COLOR;
      ctx.fillRect(x, y, PORTRAIT_SIZE + PORTRAIT_BORDER * 2, PORTRAIT_SIZE + PORTRAIT_BORDER * 2);

      // Background
      ctx.fillStyle = PORTRAIT_BG;
      ctx.fillRect(
        x + PORTRAIT_BORDER,
        y + PORTRAIT_BORDER,
        PORTRAIT_SIZE,
        PORTRAIT_SIZE
      );

      // Placeholder character icon (simple silhouette)
      ctx.fillStyle = '#5D6D7E';
      var iconX = x + PORTRAIT_BORDER + PORTRAIT_SIZE / 2;
      var iconY = y + PORTRAIT_BORDER + PORTRAIT_SIZE / 2;

      // Head
      ctx.beginPath();
      ctx.arc(iconX, iconY - 15, 18, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.arc(iconX, iconY + 20, 25, Math.PI, 0);
      ctx.fill();
    }

    _renderLevel(ctx, x, y) {
      var level = this._player.experience ? this._player.experience.level : 1;

      // Level text at top-right of portrait
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';

      var text = 'LV.' + level;
      var textX = x + PORTRAIT_SIZE + PORTRAIT_BORDER * 2 - 5;
      var textY = y + 5;

      // Background for text
      var metrics = ctx.measureText(text);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(textX - metrics.width - 4, textY - 2, metrics.width + 8, 18);

      // Text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(text, textX, textY);
    }

    _renderHPBar(ctx, x, y) {
      var health = this._player.health;
      var current = health ? health.currentHealth : 0;
      var max = health ? health.maxHealth : 100;
      var ratio = max > 0 ? current / max : 0;

      // Label
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('HP', x, y + BAR_HEIGHT / 2);

      var barX = x + 25;
      var barWidth = BAR_WIDTH - 25;

      // Border
      ctx.fillStyle = HP_BAR_BORDER;
      ctx.fillRect(barX - 1, y - 1, barWidth + 2, BAR_HEIGHT + 2);

      // Background
      ctx.fillStyle = HP_BAR_BG;
      ctx.fillRect(barX, y, barWidth, BAR_HEIGHT);

      // Fill
      ctx.fillStyle = HP_BAR_FILL;
      ctx.fillRect(barX, y, barWidth * ratio, BAR_HEIGHT);

      // Text (current/max)
      ctx.font = '11px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      ctx.fillText(Math.floor(current) + ' / ' + Math.floor(max), barX + barWidth - 5, y + BAR_HEIGHT / 2);
    }

    _renderSGBar(ctx, x, y) {
      // SG (Special Gauge) - for future use, static display for now
      var ratio = 1.0; // Full bar as placeholder

      // Label
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('SG', x, y + BAR_HEIGHT / 2);

      var barX = x + 25;
      var barWidth = BAR_WIDTH - 25;

      // Border
      ctx.fillStyle = SG_BAR_BORDER;
      ctx.fillRect(barX - 1, y - 1, barWidth + 2, BAR_HEIGHT + 2);

      // Background
      ctx.fillStyle = SG_BAR_BG;
      ctx.fillRect(barX, y, barWidth, BAR_HEIGHT);

      // Fill
      ctx.fillStyle = SG_BAR_FILL;
      ctx.fillRect(barX, y, barWidth * ratio, BAR_HEIGHT);
    }

    _renderCurrency(ctx, x, y) {
      var gold = this._player.gold ? this._player.gold.currentGold : 0;

      // Coin icon (simple circle)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x + CURRENCY_ICON_SIZE / 2, y + CURRENCY_ICON_SIZE / 2, CURRENCY_ICON_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Coin detail
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.arc(x + CURRENCY_ICON_SIZE / 2, y + CURRENCY_ICON_SIZE / 2, CURRENCY_ICON_SIZE / 4, 0, Math.PI * 2);
      ctx.fill();

      // Gold amount
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(gold.toString(), x + CURRENCY_ICON_SIZE + 8, y + CURRENCY_ICON_SIZE / 2);

      // Upgrade button (arrow up)
      var btnX = x + CURRENCY_ICON_SIZE + 60;
      var btnY = y - 2;

      // Update button rect for hit detection
      this._upgradeButtonRect.x = btnX;
      this._upgradeButtonRect.y = btnY;

      // Button background
      ctx.fillStyle = this._isUpgradeButtonHovered ? UPGRADE_BTN_HOVER_COLOR : UPGRADE_BTN_COLOR;
      ctx.fillRect(btnX, btnY, UPGRADE_BTN_SIZE, UPGRADE_BTN_SIZE);

      // Border
      ctx.strokeStyle = '#2C3E50';
      ctx.lineWidth = 1;
      ctx.strokeRect(btnX, btnY, UPGRADE_BTN_SIZE, UPGRADE_BTN_SIZE);

      // Arrow up icon
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      var centerX = btnX + UPGRADE_BTN_SIZE / 2;
      var centerY = btnY + UPGRADE_BTN_SIZE / 2;
      ctx.moveTo(centerX, centerY - 6);
      ctx.lineTo(centerX + 5, centerY + 2);
      ctx.lineTo(centerX + 2, centerY + 2);
      ctx.lineTo(centerX + 2, centerY + 6);
      ctx.lineTo(centerX - 2, centerY + 6);
      ctx.lineTo(centerX - 2, centerY + 2);
      ctx.lineTo(centerX - 5, centerY + 2);
      ctx.closePath();
      ctx.fill();
    }

    _isPointInRect(x, y, rect) {
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.StatusPanel = StatusPanel;
})(window.VampireSurvivors.UI);
