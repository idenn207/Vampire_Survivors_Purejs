/**
 * @fileoverview Upgrade tooltip - reusable tooltip for showing upgrade info on hover
 * @module UI/UpgradeTooltip
 */
(function (UI) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var PADDING = 10;
  var BORDER_RADIUS = 5;
  var MAX_WIDTH = 200;
  var LINE_HEIGHT = 18;
  var BG_COLOR = 'rgba(0, 0, 0, 0.9)';
  var BORDER_COLOR = '#34495E';
  var TITLE_COLOR = '#FFFFFF';
  var DESC_COLOR = '#BDC3C7';
  var COST_COLOR = '#F1C40F';
  var CANNOT_AFFORD_COLOR = '#E74C3C';
  var VALUE_COLOR = '#2ECC71';

  // ============================================
  // Class Definition
  // ============================================
  class UpgradeTooltip {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _content = null;
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show tooltip with content at position
     * @param {Object} content - Tooltip content
     * @param {number} x - Screen X position
     * @param {number} y - Screen Y position
     */
    show(content, x, y) {
      this._content = content;
      this._x = x;
      this._y = y;
      this._isVisible = true;
      this._calculateSize();
    }

    /**
     * Hide tooltip
     */
    hide() {
      this._isVisible = false;
      this._content = null;
    }

    /**
     * Render tooltip
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    render(ctx, canvasWidth, canvasHeight) {
      if (!this._isVisible || !this._content) return;

      // Adjust position to stay on screen
      var x = this._x;
      var y = this._y;

      if (x + this._width > canvasWidth - 10) {
        x = canvasWidth - this._width - 10;
      }
      if (y + this._height > canvasHeight - 10) {
        y = canvasHeight - this._height - 10;
      }
      if (x < 10) x = 10;
      if (y < 10) y = 10;

      // Draw background
      ctx.fillStyle = BG_COLOR;
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = 2;

      this._roundRect(ctx, x, y, this._width, this._height, BORDER_RADIUS);
      ctx.fill();
      ctx.stroke();

      // Draw content based on type
      var contentY = y + PADDING;

      if (this._content.type === 'stat') {
        contentY = this._renderStatTooltip(ctx, x + PADDING, contentY);
      } else if (this._content.type === 'weapon') {
        contentY = this._renderWeaponTooltip(ctx, x + PADDING, contentY);
      } else if (this._content.type === 'newWeapon') {
        contentY = this._renderNewWeaponTooltip(ctx, x + PADDING, contentY);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _calculateSize() {
      // Estimate size based on content
      var lines = 3; // Title + description + cost

      if (this._content.type === 'stat') {
        lines = 4; // Title + current + next + cost
      } else if (this._content.type === 'weapon') {
        lines = 5; // Title + level + stats + cost
      } else if (this._content.type === 'newWeapon') {
        lines = 4; // Title + type + description + NEW
      }

      this._width = MAX_WIDTH;
      this._height = PADDING * 2 + lines * LINE_HEIGHT;
    }

    _renderStatTooltip(ctx, x, y) {
      var content = this._content;

      // Title (stat name)
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(content.name, x, y);
      y += LINE_HEIGHT;

      // Current value
      ctx.font = '12px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText('Current: +' + content.currentPercent + '%', x, y);
      y += LINE_HEIGHT;

      // Next value
      ctx.fillStyle = VALUE_COLOR;
      ctx.fillText('Next: +' + content.nextPercent + '%', x, y);
      y += LINE_HEIGHT;

      // Cost
      if (content.isMaxLevel) {
        ctx.fillStyle = DESC_COLOR;
        ctx.fillText('MAX LEVEL', x, y);
      } else {
        ctx.fillStyle = content.canAfford ? COST_COLOR : CANNOT_AFFORD_COLOR;
        ctx.fillText('Cost: ' + content.cost + ' Gold', x, y);
      }
      y += LINE_HEIGHT;

      return y;
    }

    _renderWeaponTooltip(ctx, x, y) {
      var content = this._content;

      // Title (weapon name)
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(content.name, x, y);
      y += LINE_HEIGHT;

      // Level
      ctx.font = '12px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText('Level: ' + content.level + ' / ' + content.maxLevel, x, y);
      y += LINE_HEIGHT;

      // Stats preview
      if (content.nextStats) {
        ctx.fillStyle = VALUE_COLOR;
        ctx.fillText('Next: ' + content.nextStats, x, y);
        y += LINE_HEIGHT;
      }

      // Cost
      if (content.isMaxLevel) {
        ctx.fillStyle = DESC_COLOR;
        ctx.fillText('MAX LEVEL', x, y);
      } else {
        ctx.fillStyle = content.canAfford ? COST_COLOR : CANNOT_AFFORD_COLOR;
        ctx.fillText('Cost: ' + content.cost + ' Gold', x, y);
      }
      y += LINE_HEIGHT;

      return y;
    }

    _renderNewWeaponTooltip(ctx, x, y) {
      var content = this._content;

      // Title (weapon name)
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(content.name, x, y);
      y += LINE_HEIGHT;

      // Type
      ctx.font = '12px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText('Type: ' + content.attackType, x, y);
      y += LINE_HEIGHT;

      // Description
      if (content.description) {
        ctx.fillStyle = DESC_COLOR;
        var lines = this._wrapText(ctx, content.description, MAX_WIDTH - PADDING * 2);
        for (var i = 0; i < lines.length && i < 2; i++) {
          ctx.fillText(lines[i], x, y);
          y += LINE_HEIGHT;
        }
      }

      // NEW badge or UPGRADE indicator
      ctx.fillStyle = content.isNew ? '#2ECC71' : '#3498DB';
      ctx.fillText(content.isNew ? 'NEW WEAPON' : 'Lv.' + content.level + ' -> ' + (content.level + 1), x, y);
      y += LINE_HEIGHT;

      return y;
    }

    _wrapText(ctx, text, maxWidth) {
      var words = text.split(' ');
      var lines = [];
      var currentLine = '';

      for (var i = 0; i < words.length; i++) {
        var testLine = currentLine + (currentLine ? ' ' : '') + words[i];
        var metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    }

    _roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isVisible() {
      return this._isVisible;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._content = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.UpgradeTooltip = UpgradeTooltip;
})(window.VampireSurvivors.UI);
