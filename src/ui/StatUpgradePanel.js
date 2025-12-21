/**
 * @fileoverview Stat upgrade panel - left section of level-up screen showing player stats
 * @module UI/StatUpgradePanel
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var StatUpgradeData = window.VampireSurvivors.Data.StatUpgradeData;
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants
  // ============================================
  var TITLE_HEIGHT = 40;
  var ROW_HEIGHT = 36;
  var ROW_PADDING = 4;
  var ICON_SIZE = 24;
  var BUTTON_SIZE = 28;
  var BUTTON_MARGIN = 8;

  // Blue theme colors
  var BG_COLOR = '#2D3545';
  var BG_COLOR_TOP = '#3D4560';
  var BG_COLOR_BOTTOM = '#2D3545';
  var BORDER_COLOR = '#4A5580';
  var TITLE_COLOR = '#F5F0E1';
  var TEXT_COLOR = '#E8E2D0';
  var VALUE_COLOR = '#5EB8B8';
  var BUTTON_COLOR = '#C9A227';
  var BUTTON_HOVER_COLOR = '#D4B84B';
  var BUTTON_DISABLED_COLOR = '#5A5B7A';
  var COST_COLOR = '#F0C040';
  var CANNOT_AFFORD_COLOR = '#C85A5A';

  // ============================================
  // Class Definition
  // ============================================
  class StatUpgradePanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;
    _hoveredStatId = null;
    _buttonRects = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._buttonRects = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Set player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Set panel bounds
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    setBounds(x, y, width, height) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._calculateButtonRects();
    }

    /**
     * Handle mouse move for hover detection
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} Hovered stat info for tooltip
     */
    handleMouseMove(mouseX, mouseY) {
      this._hoveredStatId = null;

      for (var i = 0; i < this._buttonRects.length; i++) {
        var rect = this._buttonRects[i];
        if (this._isPointInRect(mouseX, mouseY, rect)) {
          this._hoveredStatId = rect.statId;
          return this._getTooltipContent(rect.statId);
        }
      }

      return null;
    }

    /**
     * Handle click
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} { statId, success, cost } or null
     */
    handleClick(mouseX, mouseY) {
      if (!this._player) return null;

      for (var i = 0; i < this._buttonRects.length; i++) {
        var rect = this._buttonRects[i];
        if (this._isPointInRect(mouseX, mouseY, rect)) {
          return this._attemptUpgrade(rect.statId);
        }
      }

      return null;
    }

    /**
     * Render the panel
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      // Background with gradient
      var gradient = ctx.createLinearGradient(this._x, this._y, this._x, this._y + this._height);
      gradient.addColorStop(0, BG_COLOR_TOP);
      gradient.addColorStop(1, BG_COLOR_BOTTOM);
      ctx.fillStyle = gradient;
      ctx.fillRect(this._x, this._y, this._width, this._height);

      // Border
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = 2;
      ctx.strokeRect(this._x, this._y, this._width, this._height);

      // Title
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.t('stats.title'), this._x + this._width / 2, this._y + TITLE_HEIGHT / 2);

      // Separator line
      ctx.strokeStyle = BORDER_COLOR;
      ctx.beginPath();
      ctx.moveTo(this._x + 10, this._y + TITLE_HEIGHT);
      ctx.lineTo(this._x + this._width - 10, this._y + TITLE_HEIGHT);
      ctx.stroke();

      // Stat rows
      if (!this._player || !this._player.playerStats) return;

      var stats = this._player.playerStats.getAllStatsForDisplay();
      var currentGold = this._player.gold ? this._player.gold.amount : 0;

      for (var i = 0; i < stats.length; i++) {
        var stat = stats[i];
        var rowY = this._y + TITLE_HEIGHT + ROW_PADDING + i * ROW_HEIGHT;
        this._renderStatRow(ctx, stat, rowY, currentGold);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _calculateButtonRects() {
      this._buttonRects = [];
      var statOrder = StatUpgradeData.getStatOrder();

      for (var i = 0; i < statOrder.length; i++) {
        var rowY = this._y + TITLE_HEIGHT + ROW_PADDING + i * ROW_HEIGHT;
        var buttonX = this._x + this._width - BUTTON_MARGIN - BUTTON_SIZE;
        var buttonY = rowY + (ROW_HEIGHT - BUTTON_SIZE) / 2;

        this._buttonRects.push({
          statId: statOrder[i],
          x: buttonX,
          y: buttonY,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
        });
      }
    }

    _renderStatRow(ctx, stat, y, currentGold) {
      var x = this._x + 10;
      var isHovered = stat.id === this._hoveredStatId;
      var canAfford = currentGold >= stat.cost && !stat.isMaxLevel;

      // Row highlight on hover
      if (isHovered) {
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.fillRect(this._x + 5, y, this._width - 10, ROW_HEIGHT - ROW_PADDING);
      }

      // Icon (colored circle)
      ctx.fillStyle = stat.icon;
      ctx.beginPath();
      ctx.arc(x + ICON_SIZE / 2, y + ROW_HEIGHT / 2, ICON_SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Stat name
      ctx.font = '13px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.tsn(stat.id, stat.name), x + ICON_SIZE + 6, y + ROW_HEIGHT / 2);

      // Upgrade button (right side)
      var buttonX = this._x + this._width - BUTTON_MARGIN - BUTTON_SIZE;
      var buttonY = y + (ROW_HEIGHT - BUTTON_SIZE) / 2;

      if (stat.isMaxLevel) {
        // Current value (before MAX)
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = VALUE_COLOR;
        ctx.textAlign = 'right';
        ctx.fillText('+' + stat.bonusPercent + '%', buttonX - 8, y + ROW_HEIGHT / 2);

        // Max level indicator
        ctx.fillStyle = BUTTON_DISABLED_COLOR;
        ctx.fillRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE);
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i18n.t('stats.max'), buttonX + BUTTON_SIZE / 2, buttonY + BUTTON_SIZE / 2);
      } else {
        // Cost (left of button)
        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = canAfford ? COST_COLOR : CANNOT_AFFORD_COLOR;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(stat.cost + 'g', buttonX - 6, y + ROW_HEIGHT / 2);

        // Current value (further left)
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = VALUE_COLOR;
        ctx.textAlign = 'right';
        ctx.fillText('+' + stat.bonusPercent + '%', buttonX - 50, y + ROW_HEIGHT / 2);

        // Upgrade button
        ctx.fillStyle = isHovered ? BUTTON_HOVER_COLOR : BUTTON_COLOR;
        if (!canAfford) {
          ctx.fillStyle = BUTTON_DISABLED_COLOR;
        }
        ctx.fillRect(buttonX, buttonY, BUTTON_SIZE, BUTTON_SIZE);

        // Plus sign
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(buttonX + BUTTON_SIZE / 2, buttonY + 6);
        ctx.lineTo(buttonX + BUTTON_SIZE / 2, buttonY + BUTTON_SIZE - 6);
        ctx.moveTo(buttonX + 6, buttonY + BUTTON_SIZE / 2);
        ctx.lineTo(buttonX + BUTTON_SIZE - 6, buttonY + BUTTON_SIZE / 2);
        ctx.stroke();
      }
    }

    _attemptUpgrade(statId) {
      if (!this._player) return null;

      var playerStats = this._player.playerStats;
      var gold = this._player.gold;

      if (!playerStats || !gold) return null;

      var cost = playerStats.getUpgradeCost(statId);

      if (playerStats.isStatMaxLevel(statId)) {
        return { statId: statId, success: false, reason: 'max_level' };
      }

      if (gold.amount < cost) {
        return { statId: statId, success: false, reason: 'insufficient_gold' };
      }

      // Perform upgrade
      gold.spendGold(cost);
      playerStats.upgradeStat(statId);

      // Apply immediate effects
      this._applyStatEffect(statId);

      return { statId: statId, success: true, cost: cost };
    }

    _applyStatEffect(statId) {
      if (!this._player) return;

      var playerStats = this._player.playerStats;

      switch (statId) {
        case 'maxHealth':
          // Increase max health and heal
          var health = this._player.health;
          if (health) {
            var baseMax = 100;
            var newMax = Math.floor(baseMax * playerStats.getMultiplier('maxHealth'));
            var oldMax = health.maxHealth;
            health.setMaxHealth(newMax, false);
            // Heal for the difference
            health.heal(newMax - oldMax);
          }
          break;

        case 'moveSpeed':
          // Update player speed
          var baseSpeed = 200;
          this._player.speed = Math.floor(baseSpeed * playerStats.getMultiplier('moveSpeed'));
          break;
      }
    }

    _getTooltipContent(statId) {
      if (!this._player || !this._player.playerStats) return null;

      var playerStats = this._player.playerStats;
      var gold = this._player.gold;
      var config = StatUpgradeData.getStatConfig(statId);

      if (!config) return null;

      var level = playerStats.getStatLevel(statId);
      var currentBonus = playerStats.getStatBonus(statId);
      var nextBonus = currentBonus + config.bonusPerLevel;
      var cost = playerStats.getUpgradeCost(statId);
      var isMaxLevel = playerStats.isStatMaxLevel(statId);
      var canAfford = gold ? gold.amount >= cost : false;

      return {
        type: 'stat',
        name: i18n.tsn(statId, config.name),
        description: config.tooltip || '',
        currentPercent: Math.round(currentBonus * 100),
        nextPercent: Math.round(nextBonus * 100),
        cost: cost,
        isMaxLevel: isMaxLevel,
        canAfford: canAfford,
      };
    }

    _isPointInRect(x, y, rect) {
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      this._buttonRects = [];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.StatUpgradePanel = StatUpgradePanel;
})(window.VampireSurvivors.UI);
