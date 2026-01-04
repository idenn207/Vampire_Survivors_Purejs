/**
 * @fileoverview Character selection screen - displayed before core selection
 * @module UI/CharacterSelectionScreen
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var CharacterData = window.VampireSurvivors.Data.CharacterData;
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants
  // ============================================
  var OVERLAY_COLOR = 'rgba(0, 0, 0, 0.95)';
  var CARD_WIDTH = 200;
  var CARD_HEIGHT = 320;
  var CARD_GAP = 25;
  var ICON_SIZE = 60;

  // Colors
  var BG_COLOR = '#2C3E50';
  var CARD_BG = '#34495E';
  var CARD_HOVER_BG = '#3D566E';
  var TITLE_COLOR = '#FFFFFF';
  var TEXT_COLOR = '#ECF0F1';
  var DESC_COLOR = '#BDC3C7';
  var STAT_LABEL_COLOR = '#95A5A6';
  var STAT_POSITIVE_COLOR = '#2ECC71';
  var STAT_NEGATIVE_COLOR = '#E74C3C';
  var STAT_NEUTRAL_COLOR = '#F39C12';

  // ============================================
  // Class Definition
  // ============================================
  class CharacterSelectionScreen {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _characters = [];
    _canvasWidth = 800;
    _canvasHeight = 600;
    _cardRects = [];
    _hoveredIndex = -1;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._cardRects = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show the screen with given characters
     * @param {Array<Object>} characters - Array of character data objects
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    show(characters, canvasWidth, canvasHeight) {
      this._isVisible = true;
      this._characters = characters || CharacterData.getAllCharacters();
      this._canvasWidth = canvasWidth;
      this._canvasHeight = canvasHeight;
      this._hoveredIndex = -1;
      this._calculateCardRects();
    }

    /**
     * Hide the screen
     */
    hide() {
      this._isVisible = false;
    }

    /**
     * Handle input and return result if selection made
     * @param {Input} input
     * @returns {Object|null} { type: 'select', characterId: string } or null
     */
    handleInput(input) {
      if (!this._isVisible) return null;

      var mousePos = input.mousePosition;
      this._updateHoverState(mousePos.x, mousePos.y);

      if (input.isMousePressed(0) && this._hoveredIndex >= 0) {
        return {
          type: 'select',
          characterId: this._characters[this._hoveredIndex].id,
        };
      }

      return null;
    }

    /**
     * Render the screen
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._isVisible) return;

      // Save context state
      ctx.save();

      // Overlay
      ctx.fillStyle = OVERLAY_COLOR;
      ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

      // Title
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.t('character.select'), this._canvasWidth / 2, 50);

      // Subtitle
      ctx.font = '16px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText(
        i18n.t('character.selectHint'),
        this._canvasWidth / 2,
        85
      );

      // Render character cards
      for (var i = 0; i < this._characters.length; i++) {
        this._renderCharacterCard(ctx, i);
      }

      // Restore context state
      ctx.restore();
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
    /**
     * Calculate card positions
     */
    _calculateCardRects() {
      this._cardRects = [];

      var totalWidth =
        this._characters.length * CARD_WIDTH + (this._characters.length - 1) * CARD_GAP;
      var startX = (this._canvasWidth - totalWidth) / 2;
      var startY = 120;

      for (var i = 0; i < this._characters.length; i++) {
        this._cardRects.push({
          x: startX + i * (CARD_WIDTH + CARD_GAP),
          y: startY,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        });
      }
    }

    /**
     * Update hover state based on mouse position
     * @param {number} mouseX
     * @param {number} mouseY
     */
    _updateHoverState(mouseX, mouseY) {
      this._hoveredIndex = -1;

      for (var i = 0; i < this._cardRects.length; i++) {
        var rect = this._cardRects[i];
        if (
          mouseX >= rect.x &&
          mouseX <= rect.x + rect.width &&
          mouseY >= rect.y &&
          mouseY <= rect.y + rect.height
        ) {
          this._hoveredIndex = i;
          break;
        }
      }
    }

    /**
     * Render a single character card
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} index
     */
    _renderCharacterCard(ctx, index) {
      var character = this._characters[index];
      var rect = this._cardRects[index];
      var isHovered = index === this._hoveredIndex;

      // Card background
      ctx.fillStyle = isHovered ? CARD_HOVER_BG : CARD_BG;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Card border (character color when hovered)
      ctx.strokeStyle = isHovered ? character.color : '#4A6278';
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Glow effect when hovered
      if (isHovered) {
        ctx.shadowColor = character.color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = character.color;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.shadowBlur = 0;
      }

      // Character icon
      var iconX = rect.x + rect.width / 2;
      var iconY = rect.y + 50;
      this._renderCharacterIcon(ctx, character, iconX, iconY);

      // Character name
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = character.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        i18n.tchn(character.id, character.name),
        rect.x + rect.width / 2,
        rect.y + 95
      );

      // Character description
      ctx.font = '11px Arial';
      ctx.fillStyle = DESC_COLOR;
      this._renderWrappedText(
        ctx,
        i18n.tchd(character.id, character.description),
        rect.x + 10,
        rect.y + 115,
        rect.width - 20,
        13
      );

      // Stats section header
      ctx.font = 'bold 10px Arial';
      ctx.fillStyle = STAT_LABEL_COLOR;
      ctx.textAlign = 'center';
      ctx.fillText(i18n.t('character.stats'), rect.x + rect.width / 2, rect.y + 155);

      // Base stats
      var statsY = rect.y + 170;
      this._renderStat(ctx, rect.x + 15, statsY, i18n.t('character.attack'), character.baseStats.attack, 'attack');
      this._renderStat(ctx, rect.x + 15, statsY + 18, i18n.t('character.speed'), character.baseStats.speed, 'speed');
      this._renderStat(ctx, rect.x + 15, statsY + 36, i18n.t('character.hp'), character.baseStats.maxHealth, 'maxHealth');
      this._renderStat(ctx, rect.x + 15, statsY + 54, i18n.t('character.critChance'), character.baseStats.critChance, 'critChance');
      this._renderStat(ctx, rect.x + 15, statsY + 72, i18n.t('character.luck'), character.baseStats.luck, 'luck');

      // Passive section
      if (character.passive) {
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = STAT_LABEL_COLOR;
        ctx.textAlign = 'center';
        ctx.fillText(i18n.t('character.passive'), rect.x + rect.width / 2, rect.y + 265);

        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = character.color;
        ctx.fillText(
          i18n.tpn(character.passive.id, character.passive.name),
          rect.x + rect.width / 2,
          rect.y + 280
        );

        ctx.font = '10px Arial';
        ctx.fillStyle = DESC_COLOR;
        this._renderWrappedText(
          ctx,
          i18n.tpd(character.passive.id, character.passive.description),
          rect.x + 10,
          rect.y + 295,
          rect.width - 20,
          12
        );
      }
    }

    /**
     * Render character icon
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} character
     * @param {number} x
     * @param {number} y
     */
    _renderCharacterIcon(ctx, character, x, y) {
      // Icon background circle
      ctx.fillStyle = character.color;
      ctx.beginPath();
      ctx.arc(x, y, ICON_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Icon inner circle (darker)
      ctx.fillStyle = this._darkenColor(character.color, 0.3);
      ctx.beginPath();
      ctx.arc(x, y, ICON_SIZE / 2 - 6, 0, Math.PI * 2);
      ctx.fill();

      // Icon symbol
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var symbols = {
        shield: '\u2B21',
        dagger: '\u2020',
        magic_orb: '\u2726',
      };

      ctx.fillText(symbols[character.icon] || '\u2726', x, y);
    }

    /**
     * Render a stat row
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @param {string} label
     * @param {number} value
     * @param {string} statId - stat identifier for formatting
     */
    _renderStat(ctx, x, y, label, value, statId) {
      // Label
      ctx.font = '10px Arial';
      ctx.fillStyle = STAT_LABEL_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);

      // Value
      ctx.textAlign = 'right';

      var valueText;
      var valueColor;
      var isPercentage = this._isPercentageStat(statId);
      var baseline = this._getStatBaseline(statId);

      if (isPercentage) {
        // Percentage stats (critChance, luck): stored as decimal (0.05 = 5%)
        valueText = (value * 100).toFixed(0) + '%';
        if (value > baseline) {
          valueColor = STAT_POSITIVE_COLOR;
        } else if (value > 0) {
          valueColor = STAT_NEUTRAL_COLOR;
        } else {
          valueColor = STAT_LABEL_COLOR;
        }
      } else {
        // Fixed-value stats (attack, speed, maxHealth): display as raw number
        valueText = value.toString();
        if (value > baseline) {
          valueColor = STAT_POSITIVE_COLOR;
        } else if (value < baseline) {
          valueColor = STAT_NEGATIVE_COLOR;
        } else {
          valueColor = STAT_NEUTRAL_COLOR;
        }
      }

      ctx.fillStyle = valueColor;
      ctx.fillText(valueText, x + 170, y);
    }

    /**
     * Render wrapped text
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} maxWidth
     * @param {number} lineHeight
     */
    _renderWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
      var words = text.split(' ');
      var line = '';
      var currentY = y;

      ctx.textAlign = 'left';

      for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line.trim(), x, currentY);
          line = words[i] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }

      ctx.fillText(line.trim(), x, currentY);
    }

    /**
     * Check if stat should be displayed as percentage
     * @param {string} statId
     * @returns {boolean}
     */
    _isPercentageStat(statId) {
      var percentageStats = ['critChance', 'luck'];
      return percentageStats.indexOf(statId) !== -1;
    }

    /**
     * Get baseline value for stat comparison (color coding)
     * @param {string} statId
     * @returns {number}
     */
    _getStatBaseline(statId) {
      var baselines = {
        attack: 10,
        speed: 100,
        maxHealth: 100,
        critChance: 0.05,
        luck: 0.05
      };
      return baselines[statId] || 0;
    }

    /**
     * Darken a hex color
     * @param {string} color
     * @param {number} amount
     * @returns {string}
     */
    _darkenColor(color, amount) {
      var hex = color.replace('#', '');
      var r = parseInt(hex.substr(0, 2), 16);
      var g = parseInt(hex.substr(2, 2), 16);
      var b = parseInt(hex.substr(4, 2), 16);

      r = Math.floor(r * (1 - amount));
      g = Math.floor(g * (1 - amount));
      b = Math.floor(b * (1 - amount));

      return (
        '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0')
      );
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.CharacterSelectionScreen = CharacterSelectionScreen;
})(window.VampireSurvivors.UI = window.VampireSurvivors.UI || {});
