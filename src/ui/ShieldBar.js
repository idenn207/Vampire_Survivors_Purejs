/**
 * @fileoverview Shield bar UI - displays player shield HP below health bar
 * @module UI/ShieldBar
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var UIScale = window.VampireSurvivors.Core.UIScale;
  var Shield = window.VampireSurvivors.Components.Shield;

  // ============================================
  // Constants (base values at 800x600)
  // ============================================
  var BASE_BAR_WIDTH = 200;
  var BASE_BAR_HEIGHT = 8;
  var BASE_X = 10;
  var BASE_Y_OFFSET_FROM_HEALTH = 4; // Below health bar
  var BASE_BORDER = 1;
  var BASE_LABEL_FONT_SIZE = 10;

  // Colors
  var BAR_BG = 'rgba(0, 0, 0, 0.6)';
  var BAR_FILL = '#4A90D9';
  var BAR_FILL_GRADIENT_END = '#82C8E5';
  var BAR_BORDER = '#2C5282';
  var TEXT_COLOR = '#FFFFFF';
  var TEXT_SHADOW = '#000000';

  // ============================================
  // Class Definition
  // ============================================
  class ShieldBar {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _healthBarY = 0; // Set by HUD

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
     * Set the Y position of the health bar (so we can render below it)
     * @param {number} y - Y position of health bar bottom
     */
    setHealthBarY(y) {
      this._healthBarY = y;
    }

    render(ctx, canvasWidth, canvasHeight) {
      if (!this._player) return;

      var shield = this._player.getComponent(Shield);
      if (!shield || !shield.hasShield()) return;

      // Calculate scaled dimensions
      var barWidth = UIScale.scale(BASE_BAR_WIDTH);
      var barHeight = UIScale.scale(BASE_BAR_HEIGHT);
      var x = UIScale.scale(BASE_X);
      var y = this._healthBarY + UIScale.scale(BASE_Y_OFFSET_FROM_HEALTH);
      var border = UIScale.scale(BASE_BORDER);

      // Draw background
      ctx.fillStyle = BAR_BG;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw shield fill
      var shieldRatio = shield.shieldRatio;
      var fillWidth = barWidth * shieldRatio;

      if (fillWidth > 0) {
        // Create gradient for shield bar
        var gradient = ctx.createLinearGradient(x, y, x + fillWidth, y);
        gradient.addColorStop(0, BAR_FILL);
        gradient.addColorStop(1, BAR_FILL_GRADIENT_END);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, fillWidth, barHeight);
      }

      // Draw border
      ctx.strokeStyle = BAR_BORDER;
      ctx.lineWidth = border;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Draw shield amount text
      var labelY = y + barHeight / 2;
      ctx.font = UIScale.font(BASE_LABEL_FONT_SIZE, 'bold');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      var shieldText = Math.floor(shield.shieldAmount).toString();

      // Text shadow
      ctx.fillStyle = TEXT_SHADOW;
      ctx.fillText(shieldText, x + 4 + 1, labelY + 1);

      // Text
      ctx.fillStyle = TEXT_COLOR;
      ctx.fillText(shieldText, x + 4, labelY);

      // Draw "SHIELD" label on right side
      ctx.textAlign = 'right';
      ctx.fillStyle = TEXT_SHADOW;
      ctx.fillText('SHIELD', x + barWidth - 4 + 1, labelY + 1);
      ctx.fillStyle = BAR_FILL;
      ctx.fillText('SHIELD', x + barWidth - 4, labelY);
    }

    /**
     * Render shield bar in overhead (world space, above player)
     * Used by PlayerOverhead
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} screenX - Player screen X position
     * @param {number} screenY - Player screen Y position (top of player)
     * @param {number} barWidth - Width of health bar
     * @param {number} healthBarHeight - Height of health bar
     * @param {number} offsetY - Offset below health bar
     */
    renderOverhead(ctx, screenX, screenY, barWidth, healthBarHeight, offsetY) {
      if (!this._player) return;

      var shield = this._player.getComponent(Shield);
      if (!shield || !shield.hasShield()) return;

      var shieldBarHeight = healthBarHeight * 0.6;
      var y = screenY + healthBarHeight + offsetY;
      var x = screenX - barWidth / 2;

      // Draw background
      ctx.fillStyle = BAR_BG;
      ctx.fillRect(x, y, barWidth, shieldBarHeight);

      // Draw shield fill
      var shieldRatio = shield.shieldRatio;
      var fillWidth = barWidth * shieldRatio;

      if (fillWidth > 0) {
        ctx.fillStyle = BAR_FILL;
        ctx.fillRect(x, y, fillWidth, shieldBarHeight);
      }

      // Draw border
      ctx.strokeStyle = BAR_BORDER;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, shieldBarHeight);
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
  UI.ShieldBar = ShieldBar;
})(window.VampireSurvivors.UI);
