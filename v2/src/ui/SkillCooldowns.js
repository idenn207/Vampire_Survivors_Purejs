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
  var ActiveSkill = window.VampireSurvivors.Components.ActiveSkill;
  var ActiveBuff = window.VampireSurvivors.Components.ActiveBuff;

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

  // Skill-specific colors
  var KNIGHT_SHIELD_COLOR = '#4A90D9';
  var ROGUE_SLASH_COLOR = '#E74C3C';
  var MAGE_BUFF_COLORS = {
    attack: '#E74C3C',
    speed: '#2ECC71',
    aurora: '#9B59B6',
  };

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
      var activeSkill = this._player.getComponent(ActiveSkill);
      if (!activeSkill || !activeSkill.skillType) {
        // No skill: show placeholder
        this._renderSkillIcon(ctx, x, y, size, {
          progress: 1,
          remaining: 0,
          isReady: false,
          iconColor: '#666666',
          iconType: 'none',
        });
        return;
      }

      var skillType = activeSkill.skillType;
      var options = {
        iconType: skillType,
        activeSkill: activeSkill,
      };

      if (skillType === 'combo_slash') {
        // Rogue: charge-based with cast cooldown
        var castCooldown = activeSkill.castCooldown;
        var charges = activeSkill.charges;
        options.isReady = charges > 0 && castCooldown <= 0;
        options.charges = charges;
        options.maxCharges = activeSkill.maxCharges;
        options.iconColor = ROGUE_SLASH_COLOR;
        // Show next slash that will execute (preview)
        var currentIndex = activeSkill.comboSlashIndex;
        if (activeSkill.isInCombo) {
          // In combo: next press will advance index, show that
          options.comboIndex = (currentIndex + 1) % 3;
        } else {
          // Not in combo: next press will start at 0
          options.comboIndex = 0;
        }
        options.isInCombo = activeSkill.isInCombo;
        options.castCooldown = castCooldown;

        // Determine what to show in center:
        // - If charges > 0 and cast cooldown active: show cast cooldown (1s delay)
        // - If charges = 0: show charge regen remaining time
        if (charges > 0 && castCooldown > 0) {
          options.progress = activeSkill.castCooldownProgress;
          options.remaining = castCooldown;
        } else if (charges === 0) {
          options.progress = activeSkill.chargeRegenProgress;
          options.remaining = activeSkill.chargeRegenRemaining;
        } else {
          options.progress = 1;
          options.remaining = 0;
        }
      } else if (skillType === 'shield') {
        // Knight: cooldown-based
        options.isReady = activeSkill.cooldown <= 0;
        options.progress = activeSkill.cooldownProgress;
        options.remaining = activeSkill.cooldown;
        options.iconColor = KNIGHT_SHIELD_COLOR;
      } else if (skillType === 'rotating_buff') {
        // Mage: cooldown-based with buff cycle
        options.isReady = activeSkill.cooldown <= 0;
        options.progress = activeSkill.cooldownProgress;
        options.remaining = activeSkill.cooldown;
        var nextBuff = activeSkill.getNextBuffData();
        options.buffType = nextBuff ? nextBuff.id : 'attack';
        options.iconColor = MAGE_BUFF_COLORS[options.buffType] || ACTIVE_ICON_COLOR;

        // Check for active buff
        var activeBuff = this._player.getComponent(ActiveBuff);
        if (activeBuff && activeBuff.hasBuff) {
          options.activeBuff = activeBuff;
        }
      }

      this._renderSkillIcon(ctx, x, y, size, options);
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

      // Draw cooldown text in center of icon (when on cooldown)
      if (!options.isReady && options.remaining > 0) {
        this._renderCenterCooldownText(ctx, centerX, centerY, options);
      }

      // Draw border
      ctx.strokeStyle = options.isReady ? ICON_BORDER_READY : ICON_BORDER_COOLDOWN;
      ctx.lineWidth = border;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - border / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Draw charge count below icon for charge-based skills
      if (options.iconType === 'combo_slash') {
        this._renderChargeCount(ctx, centerX, y + size, options);
      }
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
      } else if (options.iconType === 'shield') {
        // Knight shield icon
        this._drawShieldIcon(ctx, centerX, centerY, iconRadius, options.iconColor);
      } else if (options.iconType === 'combo_slash') {
        // Rogue slash icon - show current combo stage
        this._drawSlashIcon(ctx, centerX, centerY, iconRadius, options);
      } else if (options.iconType === 'rotating_buff') {
        // Mage buff icon - show next buff type
        this._drawBuffIcon(ctx, centerX, centerY, iconRadius, options);
      } else if (options.iconType === 'none') {
        // No skill: X mark
        ctx.strokeStyle = options.iconColor;
        ctx.lineWidth = UIScale.scale(2);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX - iconRadius * 0.5, centerY - iconRadius * 0.5);
        ctx.lineTo(centerX + iconRadius * 0.5, centerY + iconRadius * 0.5);
        ctx.moveTo(centerX + iconRadius * 0.5, centerY - iconRadius * 0.5);
        ctx.lineTo(centerX - iconRadius * 0.5, centerY + iconRadius * 0.5);
        ctx.stroke();
      } else {
        // Active skill placeholder: Question mark
        ctx.font = UIScale.font(18, 'bold');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', centerX, centerY);
      }

      ctx.globalAlpha = 1.0;
    }

    _drawShieldIcon(ctx, centerX, centerY, radius, color) {
      // Shield shape
      ctx.fillStyle = color;
      ctx.beginPath();
      var w = radius * 1.2;
      var h = radius * 1.4;
      ctx.moveTo(centerX, centerY - h * 0.5);
      ctx.quadraticCurveTo(centerX + w * 0.6, centerY - h * 0.4, centerX + w * 0.5, centerY);
      ctx.quadraticCurveTo(centerX + w * 0.4, centerY + h * 0.4, centerX, centerY + h * 0.5);
      ctx.quadraticCurveTo(centerX - w * 0.4, centerY + h * 0.4, centerX - w * 0.5, centerY);
      ctx.quadraticCurveTo(centerX - w * 0.6, centerY - h * 0.4, centerX, centerY - h * 0.5);
      ctx.fill();
    }

    _drawSlashIcon(ctx, centerX, centerY, radius, options) {
      ctx.strokeStyle = options.iconColor;
      ctx.lineWidth = UIScale.scale(3);
      ctx.lineCap = 'round';

      var comboIndex = options.comboIndex || 0;
      var len = radius * 0.9;

      if (options.isInCombo) {
        // Show combo indicator
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#FFFFFF';
      }

      // Draw slash lines based on combo stage
      ctx.beginPath();
      if (comboIndex === 0) {
        // Horizontal slash
        ctx.moveTo(centerX - len, centerY);
        ctx.lineTo(centerX + len, centerY);
      } else if (comboIndex === 1) {
        // Vertical slash
        ctx.moveTo(centerX, centerY - len);
        ctx.lineTo(centerX, centerY + len);
      } else {
        // X slash
        ctx.moveTo(centerX - len * 0.7, centerY - len * 0.7);
        ctx.lineTo(centerX + len * 0.7, centerY + len * 0.7);
        ctx.moveTo(centerX + len * 0.7, centerY - len * 0.7);
        ctx.lineTo(centerX - len * 0.7, centerY + len * 0.7);
      }
      ctx.strokeStyle = options.iconColor;
      ctx.globalAlpha = options.isReady ? 1.0 : 0.5;
      ctx.stroke();
    }

    _drawBuffIcon(ctx, centerX, centerY, radius, options) {
      var buffType = options.buffType || 'attack';

      ctx.fillStyle = options.iconColor;

      if (buffType === 'attack') {
        // Sword/attack icon
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius * 0.9);
        ctx.lineTo(centerX + radius * 0.3, centerY + radius * 0.5);
        ctx.lineTo(centerX, centerY + radius * 0.3);
        ctx.lineTo(centerX - radius * 0.3, centerY + radius * 0.5);
        ctx.closePath();
        ctx.fill();
      } else if (buffType === 'speed') {
        // Wind/speed icon
        ctx.strokeStyle = options.iconColor;
        ctx.lineWidth = UIScale.scale(2);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX - radius * 0.7, centerY - radius * 0.4);
        ctx.quadraticCurveTo(centerX, centerY - radius * 0.5, centerX + radius * 0.7, centerY - radius * 0.2);
        ctx.moveTo(centerX - radius * 0.7, centerY);
        ctx.quadraticCurveTo(centerX, centerY - radius * 0.1, centerX + radius * 0.7, centerY + radius * 0.2);
        ctx.moveTo(centerX - radius * 0.7, centerY + radius * 0.4);
        ctx.quadraticCurveTo(centerX, centerY + radius * 0.3, centerX + radius * 0.7, centerY + radius * 0.6);
        ctx.stroke();
      } else if (buffType === 'aurora') {
        // Aurora/magic circle icon
        ctx.strokeStyle = options.iconColor;
        ctx.lineWidth = UIScale.scale(2);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        // Inner dot
        ctx.fillStyle = options.iconColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    _renderCenterCooldownText(ctx, centerX, centerY, options) {
      ctx.font = UIScale.font(14, 'bold');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var text = options.remaining.toFixed(1);

      // Draw text shadow
      ctx.fillStyle = TEXT_SHADOW;
      ctx.fillText(text, centerX + 1, centerY + 1);

      // Draw main text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(text, centerX, centerY);
    }

    _renderChargeCount(ctx, centerX, topY, options) {
      var textY = topY + UIScale.scale(BASE_TEXT_OFFSET_Y);

      ctx.font = UIScale.font(BASE_COOLDOWN_FONT_SIZE, 'bold');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      var text = options.charges + '/' + options.maxCharges;

      // Draw text shadow
      ctx.fillStyle = TEXT_SHADOW;
      ctx.fillText(text, centerX + 1, textY + 1);

      // Draw text - green if charges available, white otherwise
      ctx.fillStyle = options.charges > 0 ? ICON_BORDER_READY : TEXT_COLOR;
      ctx.fillText(text, centerX, textY);
    }

    _renderCooldownText(ctx, centerX, topY, options) {
      var textY = topY + UIScale.scale(BASE_TEXT_OFFSET_Y);

      ctx.font = UIScale.font(BASE_COOLDOWN_FONT_SIZE, 'bold');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      var text;
      if (options.iconType === 'combo_slash') {
        // Show charges for Rogue
        text = options.charges + '/' + options.maxCharges;
      } else if (options.iconType === 'rotating_buff' && options.activeBuff) {
        // Show remaining buff duration for Mage
        text = options.activeBuff.duration.toFixed(1);
      } else if (options.isReady) {
        text = i18n.t('skills.ready');
      } else if (options.remaining > 0) {
        // Format remaining time with one decimal place
        text = options.remaining.toFixed(1);
      } else {
        text = i18n.t('skills.ready');
      }

      // Draw text shadow
      ctx.fillStyle = TEXT_SHADOW;
      ctx.fillText(text, centerX + 1, textY + 1);

      // Draw text
      var textColor = TEXT_COLOR;
      if (options.iconType === 'combo_slash') {
        textColor = options.charges > 0 ? ICON_BORDER_READY : TEXT_COLOR;
      } else {
        textColor = options.isReady ? ICON_BORDER_READY : TEXT_COLOR;
      }
      ctx.fillStyle = textColor;
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
