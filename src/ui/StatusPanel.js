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
  var UIScale = window.VampireSurvivors.Core.UIScale;
  var i18n = window.VampireSurvivors.Core.i18n;
  var Shield = window.VampireSurvivors.Components.Shield;

  // ============================================
  // Constants (base values at 800x600)
  // ============================================
  var BASE_PANEL_X = 10;
  var BASE_PANEL_Y = 30; // Below EXP bar

  var BASE_PORTRAIT_SIZE = 80;
  var BASE_PORTRAIT_BORDER = 4;
  var PORTRAIT_COLOR = '#4ECDC4'; // Cyan border
  var PORTRAIT_BG = '#2C3E50';

  var BASE_BAR_WIDTH = 150;
  var BASE_BAR_HEIGHT = 16;
  var BASE_BAR_GAP = 4;
  var BASE_BAR_OFFSET_X = 98; // BASE_PORTRAIT_SIZE + BASE_PORTRAIT_BORDER * 2 + 10

  var HP_BAR_BG = '#333333';
  var HP_BAR_FILL = '#E74C3C';
  var HP_BAR_BORDER = '#222222';
  var SHIELD_BAR_FILL = '#4A90D9';

  var SG_BAR_BG = '#333333';
  var SG_BAR_FILL = '#F39C12';
  var SG_BAR_BORDER = '#222222';

  var BASE_CURRENCY_ICON_SIZE = 16;

  // ============================================
  // Class Definition
  // ============================================
  class StatusPanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Handle mouse move (no-op, kept for interface compatibility)
     * @param {number} mouseX
     * @param {number} mouseY
     */
    handleMouseMove(mouseX, mouseY) {
      // No interactive elements
    }

    /**
     * Handle click (no-op, kept for interface compatibility)
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {boolean} Always false
     */
    handleClick(mouseX, mouseY) {
      return false;
    }

    render(ctx) {
      if (!this._player) return;

      // Scale all dimensions
      var x = UIScale.scale(BASE_PANEL_X);
      var y = UIScale.scale(BASE_PANEL_Y);
      var barOffsetX = UIScale.scale(BASE_BAR_OFFSET_X);
      var barHeight = UIScale.scale(BASE_BAR_HEIGHT);
      var barGap = UIScale.scale(BASE_BAR_GAP);

      // Render portrait
      this._renderPortrait(ctx, x, y);

      // Render level on portrait
      this._renderLevel(ctx, x, y);

      // Render HP bar
      var barX = x + barOffsetX;
      var barY = y + UIScale.scale(5);
      this._renderHPBar(ctx, barX, barY);

      // Render SG bar
      barY += barHeight + barGap;
      this._renderSGBar(ctx, barX, barY);

      // Render currency
      var currencyY = barY + barHeight + barGap + UIScale.scale(5);
      this._renderCurrency(ctx, barX, currencyY);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _renderPortrait(ctx, x, y) {
      var portraitSize = UIScale.scale(BASE_PORTRAIT_SIZE);
      var portraitBorder = UIScale.scale(BASE_PORTRAIT_BORDER);

      // Border
      ctx.fillStyle = PORTRAIT_COLOR;
      ctx.fillRect(x, y, portraitSize + portraitBorder * 2, portraitSize + portraitBorder * 2);

      // Background
      ctx.fillStyle = PORTRAIT_BG;
      ctx.fillRect(
        x + portraitBorder,
        y + portraitBorder,
        portraitSize,
        portraitSize
      );

      // Placeholder character icon (simple silhouette)
      ctx.fillStyle = '#5D6D7E';
      var iconX = x + portraitBorder + portraitSize / 2;
      var iconY = y + portraitBorder + portraitSize / 2;

      // Head
      ctx.beginPath();
      ctx.arc(iconX, iconY - UIScale.scale(15), UIScale.scale(18), 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.arc(iconX, iconY + UIScale.scale(20), UIScale.scale(25), Math.PI, 0);
      ctx.fill();
    }

    _renderLevel(ctx, x, y) {
      var level = this._player.experience ? this._player.experience.level : 1;
      var portraitSize = UIScale.scale(BASE_PORTRAIT_SIZE);
      var portraitBorder = UIScale.scale(BASE_PORTRAIT_BORDER);

      // Level text at top-right of portrait
      ctx.font = UIScale.font(14, 'bold');
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';

      var text = 'LV.' + level;
      var textX = x + portraitSize + portraitBorder * 2 - UIScale.scale(5);
      var textY = y + UIScale.scale(5);

      // Background for text
      var metrics = ctx.measureText(text);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(textX - metrics.width - UIScale.scale(4), textY - UIScale.scale(2), metrics.width + UIScale.scale(8), UIScale.scale(18));

      // Text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(text, textX, textY);
    }

    _renderHPBar(ctx, x, y) {
      var health = this._player.health;
      var current = health ? health.currentHealth : 0;
      var max = health ? health.maxHealth : 100;
      var hpRatio = max > 0 ? current / max : 0;

      // Get shield amount
      var shield = this._player.getComponent(Shield);
      var shieldAmount = (shield && shield.hasShield()) ? shield.shieldAmount : 0;

      // Calculate total ratio (HP + shield), capped at 2.0 for display
      var totalRatio = max > 0 ? Math.min((current + shieldAmount) / max, 2.0) : 0;

      var barHeight = UIScale.scale(BASE_BAR_HEIGHT);
      var barWidth = UIScale.scale(BASE_BAR_WIDTH);
      var labelOffset = UIScale.scale(25);

      // Label
      ctx.font = UIScale.font(12, 'bold');
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.t('status.hp'), x, y + barHeight / 2);

      var barX = x + labelOffset;
      var actualBarWidth = barWidth - labelOffset;

      // Border (extend if shield exceeds max HP)
      var displayWidth = shieldAmount > 0 ? actualBarWidth * Math.min(totalRatio, 2.0) : actualBarWidth;
      ctx.fillStyle = HP_BAR_BORDER;
      ctx.fillRect(barX - 1, y - 1, displayWidth + 2, barHeight + 2);

      // Background
      ctx.fillStyle = HP_BAR_BG;
      ctx.fillRect(barX, y, displayWidth, barHeight);

      // HP Fill (red)
      ctx.fillStyle = HP_BAR_FILL;
      ctx.fillRect(barX, y, actualBarWidth * hpRatio, barHeight);

      // Shield Fill (blue) - extends from HP end
      if (shieldAmount > 0) {
        var shieldStart = actualBarWidth * hpRatio;
        var shieldBarWidth = actualBarWidth * (totalRatio - hpRatio);
        ctx.fillStyle = SHIELD_BAR_FILL;
        ctx.fillRect(barX + shieldStart, y, shieldBarWidth, barHeight);
      }

      // Text: "120(+240)/120" format
      ctx.font = UIScale.font(11);
      ctx.textAlign = 'right';
      var textX = barX + displayWidth - UIScale.scale(5);
      var textY = y + barHeight / 2;

      if (shieldAmount > 0) {
        // Build text with shield
        var hpText = Math.floor(current);
        var shieldText = '(+' + Math.floor(shieldAmount) + ')';
        var maxText = '/' + Math.floor(max);

        // Measure widths for positioning
        ctx.font = UIScale.font(11);
        var maxTextWidth = ctx.measureText(maxText).width;
        var shieldTextWidth = ctx.measureText(shieldText).width;

        // Draw from right to left
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(maxText, textX, textY);

        ctx.fillStyle = SHIELD_BAR_FILL;
        ctx.fillText(shieldText, textX - maxTextWidth, textY);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(hpText, textX - maxTextWidth - shieldTextWidth, textY);
      } else {
        // No shield - standard format
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(Math.floor(current) + ' / ' + Math.floor(max), textX, textY);
      }
    }

    _renderSGBar(ctx, x, y) {
      // SG (Special Gauge) - for future use, static display for now
      var ratio = 1.0; // Full bar as placeholder

      var barHeight = UIScale.scale(BASE_BAR_HEIGHT);
      var barWidth = UIScale.scale(BASE_BAR_WIDTH);
      var labelOffset = UIScale.scale(25);

      // Label
      ctx.font = UIScale.font(12, 'bold');
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.t('status.sg'), x, y + barHeight / 2);

      var barX = x + labelOffset;
      var actualBarWidth = barWidth - labelOffset;

      // Border
      ctx.fillStyle = SG_BAR_BORDER;
      ctx.fillRect(barX - 1, y - 1, actualBarWidth + 2, barHeight + 2);

      // Background
      ctx.fillStyle = SG_BAR_BG;
      ctx.fillRect(barX, y, actualBarWidth, barHeight);

      // Fill
      ctx.fillStyle = SG_BAR_FILL;
      ctx.fillRect(barX, y, actualBarWidth * ratio, barHeight);
    }

    _renderCurrency(ctx, x, y) {
      var gold = this._player.gold ? this._player.gold.currentGold : 0;
      var iconSize = UIScale.scale(BASE_CURRENCY_ICON_SIZE);

      // Coin icon (simple circle)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x + iconSize / 2, y + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Coin detail
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.arc(x + iconSize / 2, y + iconSize / 2, iconSize / 4, 0, Math.PI * 2);
      ctx.fill();

      // Gold amount
      ctx.font = UIScale.font(14, 'bold');
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(gold.toString(), x + iconSize + UIScale.scale(8), y + iconSize / 2);
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
