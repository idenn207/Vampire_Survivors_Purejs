/**
 * @fileoverview Upgrade tooltip - reusable tooltip for showing upgrade info on hover
 * @module UI/UpgradeTooltip
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants
  // ============================================
  var PADDING = 10;
  var BORDER_RADIUS = 5;
  var MAX_WIDTH = 200;
  var LINE_HEIGHT = 18;
  // Blue theme colors
  var BG_COLOR = 'rgba(31, 35, 55, 0.95)';
  var BORDER_COLOR = '#4A5580';
  var TITLE_COLOR = '#F5F0E1';
  var DESC_COLOR = '#A8B4C8';
  var COST_COLOR = '#F0C040';
  var CANNOT_AFFORD_COLOR = '#C85A5A';
  var VALUE_COLOR = '#5EB85E';

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
      } else if (this._content.type === 'weaponDetail') {
        contentY = this._renderWeaponDetailTooltip(ctx, x + PADDING, contentY);
      } else if (this._content.type === 'newWeapon') {
        contentY = this._renderNewWeaponTooltip(ctx, x + PADDING, contentY);
      } else if (this._content.type === 'tech') {
        contentY = this._renderTechTooltip(ctx, x + PADDING, contentY);
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
        if (this._content.description) {
          lines += 2; // Add 2 lines for description
        }
      } else if (this._content.type === 'weapon') {
        lines = 5; // Title + level + stats + cost
      } else if (this._content.type === 'weaponDetail') {
        lines = 7; // Title + tier + damage/DPS + cooldown + range + traits + total damage
        if (this._content.traits && this._content.traits.length > 2) {
          lines += Math.min(this._content.traits.length - 2, 2); // Extra trait lines
        }
        // Determine if we need a wider tooltip for right-side properties
        var hasProperties = this._content.uniqueProperties && this._content.uniqueProperties.length > 0;
        if (hasProperties) {
          // Two-column layout: wider tooltip, properties on right
          var propLines = Math.min(this._content.uniqueProperties.length, 5) + 1; // +1 for header
          lines = Math.max(lines, propLines + 2); // Ensure enough height for properties
          this._width = 380; // Wider for two-column layout
        } else {
          this._width = 240; // Standard width
        }
        this._height = PADDING * 2 + lines * LINE_HEIGHT;
        return;
      } else if (this._content.type === 'newWeapon') {
        lines = 4; // Title + type + description + NEW
        // Add lines for stats if present
        if (this._content.damage && this._content.damage > 0) {
          lines += 2; // Damage/DPS + Cooldown
        }
        if (this._content.range && this._content.range > 0) {
          lines += 1; // Range
        }
        this._width = 220; // Wider for stats
        this._height = PADDING * 2 + lines * LINE_HEIGHT;
        return;
      } else if (this._content.type === 'tech') {
        lines = 4; // Title + depth + level + cost
        if (this._content.effects && this._content.effects.length > 0) {
          lines += Math.min(this._content.effects.length, 3); // Up to 3 effects
        }
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

      // Description (role explanation)
      if (content.description) {
        ctx.font = '11px Arial';
        ctx.fillStyle = DESC_COLOR;
        var descLines = this._wrapText(ctx, content.description, MAX_WIDTH - PADDING * 2);
        for (var i = 0; i < Math.min(descLines.length, 2); i++) {
          ctx.fillText(descLines[i], x, y);
          y += LINE_HEIGHT - 2;
        }
        y += 2;
      }

      // Current value
      ctx.font = '12px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText(i18n.t('tooltip.current') + ' +' + content.currentPercent + '%', x, y);
      y += LINE_HEIGHT;

      // Next value
      ctx.fillStyle = VALUE_COLOR;
      ctx.fillText(i18n.t('tooltip.next') + ' +' + content.nextPercent + '%', x, y);
      y += LINE_HEIGHT;

      // Cost
      if (content.isMaxLevel) {
        ctx.fillStyle = DESC_COLOR;
        ctx.fillText(i18n.t('tooltip.maxLevel'), x, y);
      } else {
        ctx.fillStyle = content.canAfford ? COST_COLOR : CANNOT_AFFORD_COLOR;
        ctx.fillText(i18n.t('tooltip.cost') + ' ' + content.cost + ' ' + i18n.t('tooltip.gold'), x, y);
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
      ctx.fillText(i18n.t('tooltip.level') + ' ' + content.level + ' / ' + content.maxLevel, x, y);
      y += LINE_HEIGHT;

      // Stats preview
      if (content.nextStats) {
        ctx.fillStyle = VALUE_COLOR;
        ctx.fillText(i18n.t('tooltip.next') + ' ' + content.nextStats, x, y);
        y += LINE_HEIGHT;
      }

      // Cost
      if (content.isMaxLevel) {
        ctx.fillStyle = DESC_COLOR;
        ctx.fillText(i18n.t('tooltip.maxLevel'), x, y);
      } else {
        ctx.fillStyle = content.canAfford ? COST_COLOR : CANNOT_AFFORD_COLOR;
        ctx.fillText(i18n.t('tooltip.cost') + ' ' + content.cost + ' ' + i18n.t('tooltip.gold'), x, y);
      }
      y += LINE_HEIGHT;

      return y;
    }

    _renderWeaponDetailTooltip(ctx, x, y) {
      var content = this._content;
      var startY = y; // Remember start Y for right column

      // Tier colors
      var tierColors = {
        1: '#FFFFFF',
        2: '#3498DB',
        3: '#9B59B6',
        4: '#F39C12',
        5: '#E74C3C',
      };
      var tierNames = {
        1: i18n.t('tier.common'),
        2: i18n.t('tier.uncommon'),
        3: i18n.t('tier.rare'),
        4: i18n.t('tier.epic'),
        5: i18n.t('tier.legendary'),
      };

      // Title (weapon name) with tier color
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = tierColors[content.tier] || TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(content.name, x, y);
      y += LINE_HEIGHT;

      // Level and Tier
      ctx.font = '12px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText(i18n.t('tech.lv') + content.level + '/' + content.maxLevel + '  ', x, y);
      ctx.fillStyle = tierColors[content.tier] || DESC_COLOR;
      ctx.fillText('[' + (tierNames[content.tier] || 'T' + content.tier) + ']', x + 55, y);
      y += LINE_HEIGHT;

      // Damage and DPS
      ctx.fillStyle = '#E67E22'; // Orange for damage
      ctx.fillText(i18n.t('tooltip.damage') + ' ' + content.damage, x, y);
      if (content.dps !== undefined && content.dps !== null) {
        ctx.fillStyle = VALUE_COLOR;
        ctx.fillText('  ' + i18n.t('tooltip.dps') + ' ' + Number(content.dps).toFixed(1), x + 80, y);
      }
      y += LINE_HEIGHT;

      // Cooldown
      ctx.fillStyle = '#1ABC9C'; // Teal for cooldown
      var cooldownValue = Number(content.cooldown) || 0;
      ctx.fillText(i18n.t('tooltip.cooldown') + ' ' + cooldownValue.toFixed(2) + 's', x, y);
      y += LINE_HEIGHT;

      // Range (if applicable)
      if (content.range > 0) {
        ctx.fillStyle = '#9B59B6'; // Purple for range
        ctx.fillText(i18n.t('tooltip.range') + ' ' + content.range, x, y);
        y += LINE_HEIGHT;
      }

      // Traits
      if (content.traits && content.traits.length > 0) {
        ctx.fillStyle = '#3498DB'; // Blue for traits
        var traitsText = content.traits.slice(0, 4).join(', ');
        if (traitsText.length > 25) {
          traitsText = traitsText.substring(0, 22) + '...';
        }
        ctx.fillText(traitsText, x, y);
        y += LINE_HEIGHT;
      }

      // Total Damage Dealt (left column)
      ctx.fillStyle = COST_COLOR;
      ctx.fillText(i18n.t('tooltip.totalDealt') + ' ' + this._formatNumber(content.totalDamageDealt), x, y);
      y += LINE_HEIGHT;

      // Unique Properties - render on RIGHT side as vertical list
      if (content.uniqueProperties && content.uniqueProperties.length > 0) {
        var propX = x + 170; // Right column starts here
        var propY = startY;

        // Header
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#9B9BC0';
        ctx.fillText(i18n.t('tooltip.properties') || 'Properties', propX, propY);
        propY += LINE_HEIGHT;

        // Property list
        ctx.font = '11px Arial';
        for (var j = 0; j < Math.min(content.uniqueProperties.length, 5); j++) {
          var prop = content.uniqueProperties[j];
          if (prop && prop.name) {
            // Property name
            ctx.fillStyle = '#B8B8D0';
            ctx.fillText('\u2022 ' + prop.name, propX, propY);
            propY += LINE_HEIGHT - 4;
            // Property description (smaller, wrapped)
            if (prop.description) {
              ctx.fillStyle = '#8888A8';
              ctx.font = '10px Arial';
              var descLines = this._wrapText(ctx, prop.description, 130);
              ctx.fillText(descLines[0] || '', propX + 8, propY);
              propY += LINE_HEIGHT - 2;
              ctx.font = '11px Arial';
            }
          }
        }
      }

      return y;
    }

    _formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return Math.floor(num).toString();
    }

    _renderNewWeaponTooltip(ctx, x, y) {
      var content = this._content;

      // Title (weapon name) with tier color if available
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = content.tierColor || TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(content.name, x, y);
      y += LINE_HEIGHT;

      // Type
      ctx.font = '12px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText(i18n.t('tooltip.type') + ' ' + i18n.tat(content.attackType), x, y);
      y += LINE_HEIGHT;

      // Description
      if (content.description) {
        ctx.fillStyle = DESC_COLOR;
        var wrapWidth = 200 - PADDING * 2; // Use wider width for stats tooltip
        var lines = this._wrapText(ctx, content.description, wrapWidth);
        for (var i = 0; i < lines.length && i < 2; i++) {
          ctx.fillText(lines[i], x, y);
          y += LINE_HEIGHT;
        }
      }

      // Stats section (if weapon has stats)
      if (content.damage && content.damage > 0) {
        // Damage and DPS
        ctx.fillStyle = '#E67E22'; // Orange for damage
        ctx.fillText(i18n.t('tooltip.damage') + ' ' + content.damage, x, y);
        if (content.dps !== undefined && content.dps !== null) {
          ctx.fillStyle = VALUE_COLOR;
          ctx.fillText('  ' + i18n.t('tooltip.dps') + ' ' + Number(content.dps).toFixed(1), x + 75, y);
        }
        y += LINE_HEIGHT;

        // Cooldown
        if (content.cooldown) {
          ctx.fillStyle = '#1ABC9C'; // Teal for cooldown
          var cooldownVal = Number(content.cooldown) || 0;
          ctx.fillText(i18n.t('tooltip.cooldown') + ' ' + cooldownVal.toFixed(2) + 's', x, y);
          y += LINE_HEIGHT;
        }
      }

      // Range (if applicable)
      if (content.range && content.range > 0) {
        ctx.fillStyle = '#9B59B6'; // Purple for range
        ctx.fillText(i18n.t('tooltip.range') + ' ' + content.range, x, y);
        y += LINE_HEIGHT;
      }

      // NEW badge or UPGRADE indicator
      ctx.fillStyle = content.isNew ? '#2ECC71' : '#3498DB';
      ctx.fillText(content.isNew ? i18n.t('tooltip.newWeapon') : i18n.t('tech.lv') + content.level + ' -> ' + (content.level + 1), x, y);
      y += LINE_HEIGHT;

      return y;
    }

    _renderTechTooltip(ctx, x, y) {
      var content = this._content;

      // Title (tech name)
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(content.title, x, y);
      y += LINE_HEIGHT;

      // Depth indicator
      ctx.font = '12px Arial';
      var depthColors = { 0: '#FFFFFF', 1: '#3498DB', 2: '#9B59B6', 3: '#F39C12' };
      ctx.fillStyle = depthColors[content.depth] || DESC_COLOR;
      ctx.fillText(i18n.t('tech.depth') + ' ' + content.depth, x, y);
      y += LINE_HEIGHT;

      // Level
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText(i18n.t('tooltip.level') + ' ' + content.level + ' / ' + content.maxLevel, x, y);
      y += LINE_HEIGHT;

      // Effects (up to 3)
      if (content.effects && content.effects.length > 0) {
        ctx.fillStyle = VALUE_COLOR;
        for (var i = 0; i < Math.min(content.effects.length, 3); i++) {
          var effect = content.effects[i];
          var effectText = this._formatTechEffect(effect);
          ctx.fillText(effectText, x, y);
          y += LINE_HEIGHT;
        }
      }

      // Cost
      if (content.level >= content.maxLevel) {
        ctx.fillStyle = DESC_COLOR;
        ctx.fillText(i18n.t('tooltip.maxLevel'), x, y);
      } else if (content.cost !== null) {
        ctx.fillStyle = content.canAfford ? COST_COLOR : CANNOT_AFFORD_COLOR;
        ctx.fillText(i18n.t('tooltip.cost') + ' ' + content.cost + ' ' + i18n.t('tooltip.gold'), x, y);
      }
      y += LINE_HEIGHT;

      return y;
    }

    _formatTechEffect(effect) {
      if (!effect) return '';
      var value = effect.valuePerLevel || effect.baseValue || 0;
      var valueStr = value < 1 ? Math.round(value * 100) + '%' : value;

      if (effect.type === 'stat_bonus') {
        return '+' + valueStr + ' ' + (effect.stat || 'stat') + '/lv';
      } else if (effect.type === 'unique_mechanic') {
        return (effect.mechanic || 'mechanic') + ': +' + valueStr + '/lv';
      } else if (effect.type === 'weapon_modifier') {
        return 'Weapon ' + (effect.stat || 'stat') + ': +' + valueStr + '/lv';
      } else if (effect.type === 'passive_proc') {
        return (effect.procType || 'proc') + ': +' + valueStr + '/lv';
      }
      return 'Effect: +' + valueStr + '/lv';
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
