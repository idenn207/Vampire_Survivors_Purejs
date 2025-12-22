/**
 * @fileoverview PlayerStatusEffects UI - displays active buffs/debuffs on player
 * @module UI/PlayerStatusEffects
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var UIScale = window.VampireSurvivors.Core.UIScale;
  var StatusEffect = window.VampireSurvivors.Components.StatusEffect;
  var ActiveBuff = window.VampireSurvivors.Components.ActiveBuff;

  // ============================================
  // Constants (base values at 800x600)
  // ============================================
  // Position (below wave indicator in top-right)
  var BASE_X_FROM_RIGHT = 10;
  var BASE_Y = 55; // Below info bar (which is at y=30)

  // Icon dimensions
  var BASE_ICON_SIZE = 24;
  var BASE_ICON_GAP = 4;
  var BASE_ICON_BORDER = 2;
  var BASE_DURATION_BAR_HEIGHT = 3;
  var BASE_DURATION_BAR_GAP = 2;

  // Visual styling
  var ICON_BG = 'rgba(0, 0, 0, 0.7)';
  var DURATION_BAR_BG = 'rgba(0, 0, 0, 0.5)';

  // Flashing animation constants
  var FLASH_THRESHOLD = 5.0; // Start flashing at 5 seconds remaining
  var FLASH_BASE_RATE = 2.0; // Flashes per second at threshold
  var FLASH_MAX_RATE = 6.0; // Flashes per second near expiration
  var FLASH_MIN_ALPHA = 0.3; // Minimum alpha during flash
  var FLASH_MAX_ALPHA = 1.0; // Maximum alpha during flash

  // Effect type colors (for icons and borders)
  var EFFECT_COLORS = {
    // Debuffs (from StatusEffectConfig)
    burn: '#FF6600',
    poison: '#00FF00',
    bleed: '#CC0000',
    freeze: '#00FFFF',
    slow: '#6699FF',
    stun: '#FFFF00',
    weakness: '#9966FF',
    mark: '#FF00FF',
    pull: '#9933FF',
    // Buffs (from ActiveBuff)
    attack: '#E74C3C',
    speed: '#2ECC71',
    aurora: '#9B59B6',
  };

  // ============================================
  // Class Definition
  // ============================================
  class PlayerStatusEffects {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _flashTimer = 0; // Global timer for flash animation

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

    update(deltaTime) {
      this._flashTimer += deltaTime;
    }

    render(ctx, canvasWidth, canvasHeight) {
      if (!this._player) return;

      var effects = this._collectActiveEffects();
      if (effects.length === 0) return;

      // Calculate scaled dimensions
      var iconSize = UIScale.scale(BASE_ICON_SIZE);
      var iconGap = UIScale.scale(BASE_ICON_GAP);
      var y = UIScale.scale(BASE_Y);

      // Calculate starting X (right-aligned, growing leftward)
      var startX = canvasWidth - UIScale.scale(BASE_X_FROM_RIGHT) - iconSize;

      // Render each effect icon from right to left
      for (var i = 0; i < effects.length; i++) {
        var effectData = effects[i];
        var x = startX - i * (iconSize + iconGap);

        this._renderEffectIcon(ctx, x, y, iconSize, effectData);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _collectActiveEffects() {
      if (!this._player) return [];

      var effects = [];

      // Get debuffs from StatusEffect component
      var statusEffect = this._player.getComponent(StatusEffect);
      if (statusEffect) {
        var effectTypes = statusEffect.getActiveEffectTypes();
        for (var i = 0; i < effectTypes.length; i++) {
          var effectType = effectTypes[i];
          var effectData = statusEffect.getEffect(effectType);
          if (effectData) {
            effects.push({
              type: effectType,
              isDebuff: true,
              remainingDuration: effectData.remainingDuration,
              duration: effectData.duration,
              stacks: effectData.stacks || 1,
              color: EFFECT_COLORS[effectType] || '#FFFFFF',
            });
          }
        }
      }

      // Get buffs from ActiveBuff component
      var activeBuff = this._player.getComponent(ActiveBuff);
      if (activeBuff && activeBuff.hasBuff) {
        effects.push({
          type: activeBuff.activeBuff,
          isDebuff: false,
          remainingDuration: activeBuff.duration,
          duration: activeBuff.maxDuration,
          stacks: 1,
          color: EFFECT_COLORS[activeBuff.activeBuff] || '#FFFFFF',
        });
      }

      return effects;
    }

    _renderEffectIcon(ctx, x, y, size, effectData) {
      var centerX = x + size / 2;
      var centerY = y + size / 2;
      var radius = size / 2;
      var border = UIScale.scale(BASE_ICON_BORDER);

      // Calculate flash alpha
      var alpha = this._calculateFlashAlpha(effectData.remainingDuration);

      ctx.save();
      ctx.globalAlpha = alpha;

      // Draw background circle
      ctx.fillStyle = ICON_BG;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw border with effect color
      ctx.strokeStyle = effectData.color;
      ctx.lineWidth = border;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - border / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Draw effect symbol
      this._drawEffectSymbol(ctx, centerX, centerY, radius * 0.5, effectData.type);

      // Draw duration bar below icon
      var barWidth = size;
      var barHeight = UIScale.scale(BASE_DURATION_BAR_HEIGHT);
      var barY = y + size + UIScale.scale(BASE_DURATION_BAR_GAP);
      var ratio = effectData.duration > 0 ? effectData.remainingDuration / effectData.duration : 0;

      this._renderDurationBar(ctx, x, barY, barWidth, barHeight, ratio, effectData.color);

      // Draw stack count if > 1
      if (effectData.stacks > 1) {
        this._renderStackCount(ctx, x + size, y, effectData.stacks);
      }

      ctx.restore();
    }

    _calculateFlashAlpha(remainingTime) {
      // No flashing if above threshold
      if (remainingTime > FLASH_THRESHOLD) {
        return FLASH_MAX_ALPHA;
      }

      // Calculate flash rate (speeds up as time runs out)
      // At threshold (5s): rate = 2 flashes/sec
      // At 0s: rate = 6 flashes/sec
      var progress = 1 - remainingTime / FLASH_THRESHOLD;
      var flashRate = FLASH_BASE_RATE + (FLASH_MAX_RATE - FLASH_BASE_RATE) * progress;

      // Calculate flash phase using sine wave for smooth pulsing
      var flashPhase = Math.sin(this._flashTimer * flashRate * Math.PI * 2);

      // Map sine wave (-1 to 1) to alpha range (0.3 to 1.0)
      var alpha = FLASH_MIN_ALPHA + (FLASH_MAX_ALPHA - FLASH_MIN_ALPHA) * (flashPhase * 0.5 + 0.5);

      return alpha;
    }

    _renderDurationBar(ctx, x, y, width, height, ratio, color) {
      // Background
      ctx.fillStyle = DURATION_BAR_BG;
      ctx.fillRect(x, y, width, height);

      // Fill
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width * ratio, height);
    }

    _renderStackCount(ctx, x, y, stacks) {
      var fontSize = UIScale.scale(10);
      ctx.font = fontSize + 'px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = UIScale.scale(2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var badgeX = x;
      var badgeY = y + UIScale.scale(4);

      ctx.strokeText('x' + stacks, badgeX, badgeY);
      ctx.fillText('x' + stacks, badgeX, badgeY);
    }

    _drawEffectSymbol(ctx, centerX, centerY, radius, effectType) {
      ctx.fillStyle = EFFECT_COLORS[effectType] || '#FFFFFF';
      ctx.strokeStyle = EFFECT_COLORS[effectType] || '#FFFFFF';
      ctx.lineWidth = UIScale.scale(2);
      ctx.lineCap = 'round';

      switch (effectType) {
        case 'burn':
          this._drawFlameSymbol(ctx, centerX, centerY, radius);
          break;
        case 'poison':
          this._drawDropletSymbol(ctx, centerX, centerY, radius);
          break;
        case 'bleed':
          this._drawBloodDropSymbol(ctx, centerX, centerY, radius);
          break;
        case 'freeze':
          this._drawSnowflakeSymbol(ctx, centerX, centerY, radius);
          break;
        case 'slow':
          this._drawSlowSymbol(ctx, centerX, centerY, radius);
          break;
        case 'stun':
          this._drawStunSymbol(ctx, centerX, centerY, radius);
          break;
        case 'weakness':
          this._drawWeaknessSymbol(ctx, centerX, centerY, radius);
          break;
        case 'mark':
          this._drawMarkSymbol(ctx, centerX, centerY, radius);
          break;
        case 'pull':
          this._drawPullSymbol(ctx, centerX, centerY, radius);
          break;
        case 'attack':
          this._drawSwordSymbol(ctx, centerX, centerY, radius);
          break;
        case 'speed':
          this._drawSpeedSymbol(ctx, centerX, centerY, radius);
          break;
        case 'aurora':
          this._drawAuroraSymbol(ctx, centerX, centerY, radius);
          break;
        default:
          // Default: simple circle
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
      }
    }

    // Symbol drawing methods
    _drawFlameSymbol(ctx, cx, cy, r) {
      // Simple flame shape
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.quadraticCurveTo(cx + r * 0.8, cy - r * 0.3, cx + r * 0.5, cy + r * 0.5);
      ctx.quadraticCurveTo(cx + r * 0.2, cy + r * 0.2, cx, cy + r);
      ctx.quadraticCurveTo(cx - r * 0.2, cy + r * 0.2, cx - r * 0.5, cy + r * 0.5);
      ctx.quadraticCurveTo(cx - r * 0.8, cy - r * 0.3, cx, cy - r);
      ctx.fill();
    }

    _drawDropletSymbol(ctx, cx, cy, r) {
      // Poison droplet
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.quadraticCurveTo(cx + r, cy, cx, cy + r);
      ctx.quadraticCurveTo(cx - r, cy, cx, cy - r);
      ctx.fill();
    }

    _drawBloodDropSymbol(ctx, cx, cy, r) {
      // Blood drop (similar to droplet but pointing down)
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.8);
      ctx.quadraticCurveTo(cx + r * 0.8, cy + r * 0.2, cx, cy + r);
      ctx.quadraticCurveTo(cx - r * 0.8, cy + r * 0.2, cx, cy - r * 0.8);
      ctx.fill();
    }

    _drawSnowflakeSymbol(ctx, cx, cy, r) {
      // Simple snowflake (6 lines)
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var angle = (i / 6) * Math.PI * 2;
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      }
      ctx.stroke();
    }

    _drawSlowSymbol(ctx, cx, cy, r) {
      // Hourglass shape
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.6, cy - r);
      ctx.lineTo(cx + r * 0.6, cy - r);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + r * 0.6, cy + r);
      ctx.lineTo(cx - r * 0.6, cy + r);
      ctx.lineTo(cx, cy);
      ctx.closePath();
      ctx.stroke();
    }

    _drawStunSymbol(ctx, cx, cy, r) {
      // Star burst
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {
        var angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        var len = i % 2 === 0 ? r : r * 0.5;
        var px = cx + Math.cos(angle) * len;
        var py = cy + Math.sin(angle) * len;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
    }

    _drawWeaknessSymbol(ctx, cx, cy, r) {
      // Broken shield (down arrow)
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.8, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r * 0.8, cy);
      ctx.closePath();
      ctx.stroke();
    }

    _drawMarkSymbol(ctx, cx, cy, r) {
      // Target crosshair
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.stroke();
    }

    _drawPullSymbol(ctx, cx, cy, r) {
      // Inward arrows
      var arrowSize = r * 0.4;
      for (var i = 0; i < 4; i++) {
        var angle = (i / 4) * Math.PI * 2;
        var startX = cx + Math.cos(angle) * r;
        var startY = cy + Math.sin(angle) * r;
        var endX = cx + Math.cos(angle) * r * 0.3;
        var endY = cy + Math.sin(angle) * r * 0.3;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    _drawSwordSymbol(ctx, cx, cy, r) {
      // Sword pointing up
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.15, cy + r * 0.3);
      ctx.lineTo(cx + r * 0.4, cy + r * 0.3);
      ctx.lineTo(cx + r * 0.4, cy + r * 0.5);
      ctx.lineTo(cx + r * 0.15, cy + r * 0.5);
      ctx.lineTo(cx + r * 0.15, cy + r);
      ctx.lineTo(cx - r * 0.15, cy + r);
      ctx.lineTo(cx - r * 0.15, cy + r * 0.5);
      ctx.lineTo(cx - r * 0.4, cy + r * 0.5);
      ctx.lineTo(cx - r * 0.4, cy + r * 0.3);
      ctx.lineTo(cx - r * 0.15, cy + r * 0.3);
      ctx.closePath();
      ctx.fill();
    }

    _drawSpeedSymbol(ctx, cx, cy, r) {
      // Wind/speed lines (3 horizontal lines)
      ctx.beginPath();
      ctx.moveTo(cx - r, cy - r * 0.5);
      ctx.lineTo(cx + r, cy - r * 0.5);
      ctx.moveTo(cx - r * 0.5, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx - r, cy + r * 0.5);
      ctx.lineTo(cx + r, cy + r * 0.5);
      ctx.stroke();
    }

    _drawAuroraSymbol(ctx, cx, cy, r) {
      // Magic circle with inner dot
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
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
  UI.PlayerStatusEffects = PlayerStatusEffects;
})(window.VampireSurvivors.UI);
