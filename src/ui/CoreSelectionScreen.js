/**
 * @fileoverview Core selection screen - displayed at game start
 * @module UI/CoreSelectionScreen
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var TechCoreData = window.VampireSurvivors.Data.TechCoreData;
  var CoreWeaponData = window.VampireSurvivors.Data.CoreWeaponData;

  // ============================================
  // Constants
  // ============================================
  var OVERLAY_COLOR = 'rgba(0, 0, 0, 0.95)';
  var CARD_WIDTH = 160;
  var CARD_HEIGHT = 260;
  var CARD_GAP = 20;
  var ICON_SIZE = 50;

  // ============================================
  // Class Definition
  // ============================================
  class CoreSelectionScreen {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _cores = [];
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
     * Show the screen with given cores
     * @param {Array<Object>} cores - Array of core data objects
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    show(cores, canvasWidth, canvasHeight) {
      this._isVisible = true;
      this._cores = cores || [];
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
     * @returns {Object|null} { action: 'select', coreId: string } or null
     */
    handleInput(input) {
      if (!this._isVisible) return null;

      var mousePos = input.mousePosition;
      this._updateHoverState(mousePos.x, mousePos.y);

      if (input.isMousePressed(0) && this._hoveredIndex >= 0) {
        return {
          action: 'select',
          coreId: this._cores[this._hoveredIndex].id,
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
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SELECT YOUR CORE', this._canvasWidth / 2, 50);

      // Subtitle
      ctx.font = '16px Arial';
      ctx.fillStyle = '#BDC3C7';
      ctx.fillText(
        'Choose your path - each core has unique abilities and a dedicated weapon',
        this._canvasWidth / 2,
        85
      );

      // Render core cards
      for (var i = 0; i < this._cores.length; i++) {
        this._renderCoreCard(ctx, i);
      }

      // Instructions
      ctx.font = '14px Arial';
      ctx.fillStyle = '#7F8C8D';
      ctx.fillText('Click a core to begin', this._canvasWidth / 2, this._canvasHeight - 30);

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
        this._cores.length * CARD_WIDTH + (this._cores.length - 1) * CARD_GAP;
      var startX = (this._canvasWidth - totalWidth) / 2;
      var startY = 120;

      for (var i = 0; i < this._cores.length; i++) {
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
     * Render a single core card
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} index
     */
    _renderCoreCard(ctx, index) {
      var core = this._cores[index];
      var rect = this._cardRects[index];
      var isHovered = index === this._hoveredIndex;

      // Card background
      ctx.fillStyle = isHovered ? '#3D566E' : '#2C3E50';
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Card border (core color when hovered)
      ctx.strokeStyle = isHovered ? core.color : '#4A6278';
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Glow effect when hovered
      if (isHovered) {
        ctx.shadowColor = core.color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = core.color;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.shadowBlur = 0;
      }

      // Core icon (large colored circle with icon)
      var iconX = rect.x + rect.width / 2;
      var iconY = rect.y + 50;

      // Icon background circle
      ctx.fillStyle = core.color;
      ctx.beginPath();
      ctx.arc(iconX, iconY, ICON_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Icon inner circle (darker)
      ctx.fillStyle = this._darkenColor(core.color, 0.3);
      ctx.beginPath();
      ctx.arc(iconX, iconY, ICON_SIZE / 2 - 5, 0, Math.PI * 2);
      ctx.fill();

      // Icon symbol
      this._renderCoreIcon(ctx, core.icon, iconX, iconY, core.color);

      // Core name
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(core.name, rect.x + rect.width / 2, rect.y + 95);

      // Theme indicator
      ctx.font = '11px Arial';
      ctx.fillStyle = core.color;
      ctx.fillText(core.theme.toUpperCase(), rect.x + rect.width / 2, rect.y + 112);

      // Core description (wrapped)
      ctx.font = '11px Arial';
      ctx.fillStyle = '#BDC3C7';
      this._renderWrappedText(
        ctx,
        core.description,
        rect.x + 10,
        rect.y + 130,
        rect.width - 20,
        13
      );

      // Starting weapon info
      var weaponData = CoreWeaponData[core.startingWeapon];
      if (weaponData) {
        ctx.font = '10px Arial';
        ctx.fillStyle = '#95A5A6';
        ctx.fillText('Starting Weapon:', rect.x + rect.width / 2, rect.y + rect.height - 45);

        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = weaponData.color || '#FFFFFF';
        ctx.fillText(weaponData.name, rect.x + rect.width / 2, rect.y + rect.height - 30);

        // Weapon type indicator
        ctx.font = '9px Arial';
        ctx.fillStyle = '#7F8C8D';
        ctx.fillText(
          weaponData.attackType.replace('_', ' ').toUpperCase(),
          rect.x + rect.width / 2,
          rect.y + rect.height - 15
        );
      }
    }

    /**
     * Render core icon based on type
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} icon
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    _renderCoreIcon(ctx, icon, x, y, color) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Simple icon representations
      var symbols = {
        flame: '\u2B50', // star as flame
        snowflake: '\u2744', // snowflake
        bolt: '\u26A1', // lightning
        moon: '\u263D', // moon
        droplet: '\u2665', // heart as blood
        star: '\u2726', // star
        leaf: '\u2618', // shamrock as leaf
        shield: '\u2B21', // hexagon as shield
        wind: '\u2248', // wavy lines
        mountain: '\u25B2', // triangle
        void: '\u25CF', // circle
        sun: '\u2600', // sun
        gear: '\u2699', // gear
        paw: '\u2726', // star as paw
        clock: '\u231A', // clock
      };

      ctx.fillText(symbols[icon] || '\u2726', x, y);
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
     * Darken a hex color
     * @param {string} color
     * @param {number} amount
     * @returns {string}
     */
    _darkenColor(color, amount) {
      // Simple hex color darkening
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
  UI.CoreSelectionScreen = CoreSelectionScreen;
})(window.VampireSurvivors.UI = window.VampireSurvivors.UI || {});
