/**
 * @fileoverview Skill cooldown icons UI - displays dash and active skill cooldowns
 * @module UI/SkillCooldowns
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var UIScale = window.VampireSurvivors.Core.UIScale;
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants (base values at 800x600)
  // ============================================
  // Position (bottom-left)
  var BASE_X = 10;
  var BASE_Y_FROM_BOTTOM = 60;

  // Icon dimensions
  var BASE_ICON_SIZE = 40;
  var BASE_ICON_GAP = 8;
  var BASE_ICON_BORDER = 2;

  // Visual styling
  var ICON_BG = 'rgba(0, 0, 0, 0.7)';
  var ICON_BORDER_READY = '#4ECDC4';
  var ICON_BORDER_COOLDOWN = '#666666';
  var COOLDOWN_OVERLAY = 'rgba(0, 0, 0, 0.6)';
  var TEXT_COLOR = '#FFFFFF';
  var TEXT_SHADOW = '#000000';

  // Icon colors
  var DASH_ICON_COLOR = '#4ECDC4';
  var ACTIVE_ICON_COLOR = '#F39C12';
  var ICON_READY_GLOW = 'rgba(78, 205, 196, 0.4)';

  // Text
  var BASE_COOLDOWN_FONT_SIZE = 11;
  var BASE_TEXT_OFFSET_Y = 6;

  // ============================================
  // Class Definition
  // ============================================
  class SkillCooldowns {
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

    render(ctx, canvasWidth, canvasHeight) {
      if (!this._player) return;

      // Calculate scaled dimensions
      var iconSize = UIScale.scale(BASE_ICON_SIZE);
      var iconGap = UIScale.scale(BASE_ICON_GAP);
      var x = UIScale.scale(BASE_X);
      var y = canvasHeight - UIScale.scale(BASE_Y_FROM_BOTTOM) - iconSize;

      // Render Dash skill icon (index 0)
      this._renderDashIcon(ctx, x, y, iconSize);

      // Render Active skill placeholder icon (index 1)
      var activeX = x + iconSize + iconGap;
      this._renderActiveSkillIcon(ctx, activeX, y, iconSize);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _renderDashIcon(ctx, x, y, size) {
      // Get dash cooldown data from player
      var cooldownProgress = this._player.dashCooldownProgress;
      var cooldownRemaining = this._player.dashCooldown;
      var isReady = cooldownProgress >= 1;

      this._renderSkillIcon(ctx, x, y, size, {
        progress: cooldownProgress,
        remaining: cooldownRemaining,
        isReady: isReady,
        iconColor: DASH_ICON_COLOR,
        iconType: 'dash',
      });
    }

    _renderActiveSkillIcon(ctx, x, y, size) {
      // Placeholder: always show as ready with "?" icon
      this._renderSkillIcon(ctx, x, y, size, {
        progress: 1,
        remaining: 0,
        isReady: true,
        iconColor: ACTIVE_ICON_COLOR,
        iconType: 'active',
      });
    }

    _renderSkillIcon(ctx, x, y, size, options) {
      var centerX = x + size / 2;
      var centerY = y + size / 2;
      var radius = size / 2;
      var border = UIScale.scale(BASE_ICON_BORDER);

      // Draw glow effect if ready
      if (options.isReady) {
        ctx.fillStyle = ICON_READY_GLOW;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + UIScale.scale(4), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw background circle
      ctx.fillStyle = ICON_BG;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw cooldown overlay (pie fill, clockwise from top)
      if (!options.isReady && options.progress < 1) {
        ctx.fillStyle = COOLDOWN_OVERLAY;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        // Start at top (-PI/2), sweep clockwise based on remaining cooldown
        var sweepAngle = Math.PI * 2 * (1 - options.progress);
        ctx.arc(
          centerX,
          centerY,
          radius - border,
          -Math.PI / 2,
          -Math.PI / 2 + sweepAngle,
          false
        );
        ctx.closePath();
        ctx.fill();
      }

      // Draw icon symbol
      this._renderIconSymbol(ctx, centerX, centerY, radius, options);

      // Draw border
      ctx.strokeStyle = options.isReady ? ICON_BORDER_READY : ICON_BORDER_COOLDOWN;
      ctx.lineWidth = border;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - border / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Draw cooldown text below icon
      this._renderCooldownText(ctx, centerX, y + size, options);
    }

    _renderIconSymbol(ctx, centerX, centerY, radius, options) {
      var iconRadius = radius * 0.5;

      // Dim the icon during cooldown
      ctx.globalAlpha = options.isReady ? 1.0 : 0.5;
      ctx.fillStyle = options.iconColor;

      if (options.iconType === 'dash') {
        // Dash icon: Arrow/streak pointing right
        ctx.beginPath();
        var arrowWidth = iconRadius * 1.4;
        var arrowHeight = iconRadius * 0.8;
        ctx.moveTo(centerX - arrowWidth / 2, centerY - arrowHeight / 2);
        ctx.lineTo(centerX + arrowWidth / 4, centerY - arrowHeight / 2);
        ctx.lineTo(centerX + arrowWidth / 2, centerY);
        ctx.lineTo(centerX + arrowWidth / 4, centerY + arrowHeight / 2);
        ctx.lineTo(centerX - arrowWidth / 2, centerY + arrowHeight / 2);
        ctx.lineTo(centerX - arrowWidth / 4, centerY);
        ctx.closePath();
        ctx.fill();

        // Speed lines behind arrow
        ctx.strokeStyle = options.iconColor;
        ctx.lineWidth = UIScale.scale(2);
        ctx.lineCap = 'round';
        var lineOffset = iconRadius * 0.6;
        ctx.beginPath();
        ctx.moveTo(centerX - lineOffset - 4, centerY - 4);
        ctx.lineTo(centerX - lineOffset - 10, centerY - 4);
        ctx.moveTo(centerX - lineOffset - 2, centerY);
        ctx.lineTo(centerX - lineOffset - 12, centerY);
        ctx.moveTo(centerX - lineOffset - 4, centerY + 4);
        ctx.lineTo(centerX - lineOffset - 10, centerY + 4);
        ctx.stroke();
      } else if (options.iconType === 'active') {
        // Active skill placeholder: Question mark
        ctx.font = UIScale.font(18, 'bold');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', centerX, centerY);
      }

      ctx.globalAlpha = 1.0;
    }

    _renderCooldownText(ctx, centerX, topY, options) {
      var textY = topY + UIScale.scale(BASE_TEXT_OFFSET_Y);

      ctx.font = UIScale.font(BASE_COOLDOWN_FONT_SIZE, 'bold');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      var text;
      if (options.isReady) {
        text = i18n.t('skills.ready');
      } else {
        // Format remaining time with one decimal place
        text = options.remaining.toFixed(1);
      }

      // Draw text shadow
      ctx.fillStyle = TEXT_SHADOW;
      ctx.fillText(text, centerX + 1, textY + 1);

      // Draw text
      ctx.fillStyle = options.isReady ? ICON_BORDER_READY : TEXT_COLOR;
      ctx.fillText(text, centerX, textY);
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
  UI.SkillCooldowns = SkillCooldowns;
})(window.VampireSurvivors.UI);
