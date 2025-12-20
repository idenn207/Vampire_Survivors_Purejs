/**
 * @fileoverview Tech upgrade panel - icon-based grid for tech leveling (placed below weapons)
 * @module UI/TechUpgradePanel
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var TechTree = window.VampireSurvivors.Components.TechTree;
  var Gold = window.VampireSurvivors.Components.Gold;
  var TechCoreData = window.VampireSurvivors.Data.TechCoreData;
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants
  // ============================================
  var TITLE_HEIGHT = 30;
  var SLOT_SIZE = 50;
  var SLOT_GAP = 6;
  var SLOT_BORDER = 2;
  var SLOTS_PER_ROW = 5;
  var TOTAL_SLOTS = 5; // Maximum 5 tech slots
  var COST_HEIGHT = 14;

  // Colors
  var BG_COLOR = '#2C3E50';
  var BORDER_COLOR = '#34495E';
  var TITLE_COLOR = '#FFFFFF';
  var SLOT_EMPTY_BG = '#1A252F';
  var SLOT_EMPTY_BORDER = '#2C3E50';
  var SLOT_FILLED_BG = '#34495E';
  var SLOT_FILLED_BORDER = '#4A6278';
  var SLOT_HOVER_BORDER = '#9B59B6';
  var SLOT_MAX_BORDER = '#2ECC71';
  var TEXT_COLOR = '#ECF0F1';
  var COST_COLOR = '#F1C40F';
  var CANNOT_AFFORD_COLOR = '#E74C3C';
  var MAX_LEVEL_COLOR = '#2ECC71';
  var LOCKED_COLOR = '#7F8C8D';

  // Depth colors (matching TechCoreData)
  var DEPTH_COLORS = {
    0: '#FFFFFF',
    1: '#3498DB',
    2: '#9B59B6',
    3: '#F39C12',
  };

  // Tech icons based on core icons
  var TECH_ICONS = {
    flame: '🔥',
    snowflake: '❄',
    bolt: '⚡',
    moon: '🌙',
    droplet: '💧',
    star: '✦',
    leaf: '🍃',
    shield: '🛡',
    wind: '💨',
    mountain: '⛰',
    void: '◉',
    sun: '☀',
    gear: '⚙',
    paw: '🐾',
    clock: '⏱',
  };

  // ============================================
  // Class Definition
  // ============================================
  class TechUpgradePanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;
    _techSlots = [];
    _slotRects = [];
    _hoveredSlot = -1;
    _coreData = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._techSlots = [];
      this._slotRects = [];
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
      this._refreshData();
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
      this._calculateSlotRects();
    }

    /**
     * Refresh panel data
     */
    refresh() {
      this._refreshData();
    }

    /**
     * Handle mouse move for hover
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} Tooltip content if hovering
     */
    handleMouseMove(mouseX, mouseY) {
      this._hoveredSlot = -1;

      for (var i = 0; i < this._slotRects.length; i++) {
        if (this._isPointInRect(mouseX, mouseY, this._slotRects[i])) {
          this._hoveredSlot = i;
          return this._getTooltipContent(i);
        }
      }

      return null;
    }

    /**
     * Handle click - attempt tech upgrade
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} { techId, success, cost } or null
     */
    handleClick(mouseX, mouseY) {
      if (!this._player) return null;

      for (var i = 0; i < this._slotRects.length; i++) {
        if (this._isPointInRect(mouseX, mouseY, this._slotRects[i])) {
          return this._attemptUpgrade(i);
        }
      }

      return null;
    }

    /**
     * Render the panel
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._player) return;

      // Background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(this._x, this._y, this._width, this._height);

      // Border
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = 2;
      ctx.strokeRect(this._x, this._y, this._width, this._height);

      // Title with core name
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var titleText = i18n.t('tech.title');
      if (this._coreData) {
        ctx.fillStyle = this._coreData.color || TITLE_COLOR;
        titleText = i18n.tcn(this._coreData.id, this._coreData.name).toUpperCase();
      }
      ctx.fillText(titleText, this._x + this._width / 2, this._y + TITLE_HEIGHT / 2);

      // Separator line
      ctx.strokeStyle = BORDER_COLOR;
      ctx.beginPath();
      ctx.moveTo(this._x + 8, this._y + TITLE_HEIGHT);
      ctx.lineTo(this._x + this._width - 8, this._y + TITLE_HEIGHT);
      ctx.stroke();

      // Get current gold
      var gold = this._player.getComponent(Gold);
      var currentGold = gold ? gold.currentGold : 0;

      // Render slots
      for (var i = 0; i < TOTAL_SLOTS; i++) {
        var tech = this._techSlots[i] || null;
        this._renderSlot(ctx, i, tech, currentGold);
      }

      // No techs message
      if (this._techSlots.length === 0) {
        ctx.font = '11px Arial';
        ctx.fillStyle = LOCKED_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i18n.t('tech.defeatBosses'), this._x + this._width / 2, this._y + this._height / 2 - 8);
        ctx.fillText(i18n.t('tech.unlockTechs'), this._x + this._width / 2, this._y + this._height / 2 + 8);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _calculateSlotRects() {
      this._slotRects = [];

      var totalWidthPerRow = SLOTS_PER_ROW * SLOT_SIZE + (SLOTS_PER_ROW - 1) * SLOT_GAP;
      var startX = this._x + (this._width - totalWidthPerRow) / 2;
      var startY = this._y + TITLE_HEIGHT + 10;

      for (var i = 0; i < TOTAL_SLOTS; i++) {
        var col = i % SLOTS_PER_ROW;
        var row = Math.floor(i / SLOTS_PER_ROW);

        this._slotRects.push({
          x: startX + col * (SLOT_SIZE + SLOT_GAP),
          y: startY + row * (SLOT_SIZE + SLOT_GAP + COST_HEIGHT),
          width: SLOT_SIZE,
          height: SLOT_SIZE,
        });
      }
    }

    _refreshData() {
      this._techSlots = [];
      this._coreData = null;

      if (!this._player) return;

      var techTree = this._player.getComponent(TechTree);
      if (!techTree) return;

      this._coreData = techTree.getCoreData();
      if (!this._coreData) return;

      var displayInfo = techTree.getDisplayInfo();
      var gold = this._player.getComponent(Gold);
      var currentGold = gold ? gold.currentGold : 0;

      for (var i = 0; i < displayInfo.length; i++) {
        var info = displayInfo[i];
        var techData = TechCoreData.getTechById(techTree.getCoreId(), info.techId);

        this._techSlots.push({
          techId: info.techId,
          name: info.name,
          depth: info.depth,
          level: info.level,
          maxLevel: info.maxLevel,
          canUpgrade: info.canUpgrade && currentGold >= info.upgradeCost,
          upgradeCost: info.upgradeCost,
          canAfford: currentGold >= info.upgradeCost,
          techData: techData,
        });
      }

      // Sort by depth, then by name
      this._techSlots.sort(function (a, b) {
        if (a.depth !== b.depth) return a.depth - b.depth;
        return a.name.localeCompare(b.name);
      });
    }

    _renderSlot(ctx, index, tech, currentGold) {
      var rect = this._slotRects[index];
      if (!rect) return;

      var isHovered = index === this._hoveredSlot;
      var isEmpty = !tech;
      var isMaxLevel = tech && tech.level >= tech.maxLevel;
      var canAfford = tech && currentGold >= tech.upgradeCost;

      // Slot background
      ctx.fillStyle = isEmpty ? SLOT_EMPTY_BG : SLOT_FILLED_BG;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Slot border
      if (isMaxLevel) {
        ctx.strokeStyle = SLOT_MAX_BORDER;
      } else if (isHovered && tech) {
        ctx.strokeStyle = SLOT_HOVER_BORDER;
      } else if (tech) {
        // Use depth color for border
        ctx.strokeStyle = DEPTH_COLORS[tech.depth] || SLOT_FILLED_BORDER;
      } else {
        ctx.strokeStyle = SLOT_EMPTY_BORDER;
      }
      ctx.lineWidth = isHovered ? 3 : SLOT_BORDER;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      if (tech) {
        // Tech icon
        this._renderTechIcon(ctx, rect, tech);

        // Depth badge (top-left)
        this._renderDepthBadge(ctx, rect, tech.depth);

        // Level indicator (bottom-right)
        this._renderLevelBadge(ctx, rect, tech.level, tech.maxLevel, isMaxLevel);

        // Cost below slot
        if (!isMaxLevel) {
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = canAfford ? COST_COLOR : CANNOT_AFFORD_COLOR;
          ctx.fillText(tech.upgradeCost + 'g', rect.x + rect.width / 2, rect.y + rect.height + 2);
        } else {
          ctx.font = 'bold 9px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = MAX_LEVEL_COLOR;
          ctx.fillText(i18n.t('stats.max'), rect.x + rect.width / 2, rect.y + rect.height + 2);
        }
      } else {
        // Empty slot
        ctx.strokeStyle = SLOT_EMPTY_BORDER;
        ctx.lineWidth = 1;
        var padding = 15;
        ctx.beginPath();
        ctx.moveTo(rect.x + padding, rect.y + padding);
        ctx.lineTo(rect.x + rect.width - padding, rect.y + rect.height - padding);
        ctx.moveTo(rect.x + rect.width - padding, rect.y + padding);
        ctx.lineTo(rect.x + padding, rect.y + rect.height - padding);
        ctx.stroke();
      }
    }

    _renderTechIcon(ctx, rect, tech) {
      var centerX = rect.x + rect.width / 2;
      var centerY = rect.y + rect.height / 2;

      // Get core icon
      var coreIcon = this._coreData ? this._coreData.icon : 'star';
      var iconChar = TECH_ICONS[coreIcon] || '✦';
      var depthColor = DEPTH_COLORS[tech.depth] || '#FFFFFF';

      // Draw colored circle background
      ctx.fillStyle = depthColor;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(centerX, centerY - 3, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Draw icon
      ctx.font = '18px Arial';
      ctx.fillStyle = depthColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(iconChar, centerX, centerY - 3);

      // Tech name (abbreviated)
      ctx.font = '8px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textBaseline = 'bottom';
      var name = i18n.ttn(tech.techId, tech.name);
      if (name.length > 8) {
        name = name.substring(0, 7) + '..';
      }
      ctx.fillText(name, centerX, rect.y + rect.height - 2);
    }

    _renderDepthBadge(ctx, rect, depth) {
      var depthColor = DEPTH_COLORS[depth] || DEPTH_COLORS[0];

      // Small depth indicator (top-left corner)
      var badgeX = rect.x + 2;
      var badgeY = rect.y + 2;
      var badgeSize = 12;

      ctx.fillStyle = depthColor;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(badgeX, badgeY, badgeSize, badgeSize);
      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = depthColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(badgeX, badgeY, badgeSize, badgeSize);

      // Depth number
      ctx.font = 'bold 9px Arial';
      ctx.fillStyle = depthColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('D' + depth, badgeX + badgeSize / 2, badgeY + badgeSize / 2);
    }

    _renderLevelBadge(ctx, rect, level, maxLevel, isMaxLevel) {
      var badgeX = rect.x + rect.width - 10;
      var badgeY = rect.y + rect.height - 18;
      var badgeRadius = 8;

      // Badge background
      ctx.fillStyle = isMaxLevel ? MAX_LEVEL_COLOR : 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Level text
      ctx.font = 'bold 9px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(level.toString(), badgeX, badgeY);
    }

    _attemptUpgrade(slotIndex) {
      if (!this._player) return null;

      var tech = this._techSlots[slotIndex];
      if (!tech) {
        return { techId: null, success: false, reason: 'empty_slot' };
      }

      if (tech.level >= tech.maxLevel) {
        return { techId: tech.techId, success: false, reason: 'max_level' };
      }

      var techTree = this._player.getComponent(TechTree);
      var gold = this._player.getComponent(Gold);

      if (!techTree || !gold) return null;

      var cost = tech.upgradeCost;

      if (!gold.hasEnough(cost)) {
        return { techId: tech.techId, success: false, reason: 'insufficient_gold' };
      }

      // Get old level
      var oldLevel = techTree.getTechLevel(tech.techId);

      // Spend gold and upgrade
      gold.spendGold(cost);
      techTree.upgradeTech(tech.techId);

      var newLevel = techTree.getTechLevel(tech.techId);

      // Update effects
      techTree.updateTechEffects(this._player, tech.techId, oldLevel, newLevel);

      // Refresh data
      this._refreshData();

      return {
        techId: tech.techId,
        success: true,
        cost: cost,
        oldLevel: oldLevel,
        newLevel: newLevel,
      };
    }

    _getTooltipContent(slotIndex) {
      var tech = this._techSlots[slotIndex];
      if (!tech) return null;

      var gold = this._player ? this._player.getComponent(Gold) : null;
      var canAfford = gold && gold.currentGold >= tech.upgradeCost;

      return {
        type: 'tech',
        title: i18n.ttn(tech.techId, tech.name),
        depth: tech.depth,
        level: tech.level,
        maxLevel: tech.maxLevel,
        cost: tech.canUpgrade ? tech.upgradeCost : null,
        canAfford: canAfford,
        effects: tech.techData ? tech.techData.effects : null,
      };
    }

    _isPointInRect(x, y, rect) {
      return (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
      );
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get hoveredSlot() {
      return this._hoveredSlot;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      this._techSlots = [];
      this._slotRects = [];
      this._coreData = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.TechUpgradePanel = TechUpgradePanel;
})(window.VampireSurvivors.UI = window.VampireSurvivors.UI || {});
