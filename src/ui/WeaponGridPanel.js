/**
 * @fileoverview Weapon grid panel - bottom-right section showing acquired weapons with gold upgrade costs
 * @module UI/WeaponGridPanel
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponTierData = window.VampireSurvivors.Data.WeaponTierData;

  // ============================================
  // Constants
  // ============================================
  var TITLE_HEIGHT = 35;
  var SLOT_SIZE = 50;
  var SLOT_GAP = 8;
  var SLOT_BORDER = 2;
  var SLOTS_PER_ROW = 5;
  var TOTAL_SLOTS = 10;
  var COST_HEIGHT = 16;

  // Colors
  var BG_COLOR = '#2C3E50';
  var BORDER_COLOR = '#34495E';
  var TITLE_COLOR = '#FFFFFF';
  var SLOT_EMPTY_BG = '#1A252F';
  var SLOT_EMPTY_BORDER = '#2C3E50';
  var SLOT_FILLED_BG = '#34495E';
  var SLOT_FILLED_BORDER = '#4A6278';
  var SLOT_HOVER_BORDER = '#3498DB';
  var SLOT_MAX_BORDER = '#2ECC71';
  var TEXT_COLOR = '#ECF0F1';
  var COST_COLOR = '#F1C40F';
  var CANNOT_AFFORD_COLOR = '#E74C3C';
  var MAX_LEVEL_COLOR = '#2ECC71';

  // Attack type colors
  var ATTACK_TYPE_COLORS = {
    projectile: '#3498DB',
    laser: '#E74C3C',
    melee_swing: '#2ECC71',
    area_damage: '#F39C12',
    particle: '#9B59B6',
  };

  // Base weapon upgrade cost
  var BASE_WEAPON_UPGRADE_COST = 100;

  // ============================================
  // Class Definition
  // ============================================
  class WeaponGridPanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;
    _hoveredSlot = -1;
    _slotRects = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
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
     * Handle mouse move
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} Hovered weapon info for tooltip
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
     * Handle click - attempt weapon upgrade
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} { weapon, success, cost } or null
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
      // Background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(this._x, this._y, this._width, this._height);

      // Border
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = 2;
      ctx.strokeRect(this._x, this._y, this._width, this._height);

      // Title
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('WEAPONS (Gold Upgrade)', this._x + this._width / 2, this._y + TITLE_HEIGHT / 2);

      // Separator line
      ctx.strokeStyle = BORDER_COLOR;
      ctx.beginPath();
      ctx.moveTo(this._x + 10, this._y + TITLE_HEIGHT);
      ctx.lineTo(this._x + this._width - 10, this._y + TITLE_HEIGHT);
      ctx.stroke();

      // Get weapons
      var weapons = this._getWeapons();
      var currentGold = this._player && this._player.gold ? this._player.gold.amount : 0;

      // Render slots
      for (var i = 0; i < TOTAL_SLOTS; i++) {
        var weapon = weapons[i] || null;
        this._renderSlot(ctx, i, weapon, currentGold);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _calculateSlotRects() {
      this._slotRects = [];

      var totalWidthPerRow = SLOTS_PER_ROW * SLOT_SIZE + (SLOTS_PER_ROW - 1) * SLOT_GAP;
      var startX = this._x + (this._width - totalWidthPerRow) / 2;
      var startY = this._y + TITLE_HEIGHT + 15;

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

    _getWeapons() {
      if (!this._player || !this._player.weaponSlot) {
        return [];
      }
      return this._player.weaponSlot.weapons || [];
    }

    _getUpgradeCost(weapon) {
      if (!weapon) return 0;
      return BASE_WEAPON_UPGRADE_COST * weapon.level;
    }

    _isWeaponMaxLevel(weapon) {
      if (!weapon) return false;
      return weapon.isMaxLevel;
    }

    _renderSlot(ctx, index, weapon, currentGold) {
      var rect = this._slotRects[index];
      if (!rect) return;

      var isHovered = index === this._hoveredSlot;
      var isEmpty = !weapon;
      var isMaxLevel = weapon && this._isWeaponMaxLevel(weapon);
      var cost = weapon ? this._getUpgradeCost(weapon) : 0;
      var canAfford = currentGold >= cost;

      // Slot background
      ctx.fillStyle = isEmpty ? SLOT_EMPTY_BG : SLOT_FILLED_BG;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Slot border
      if (isMaxLevel) {
        ctx.strokeStyle = SLOT_MAX_BORDER;
      } else if (isHovered && weapon) {
        ctx.strokeStyle = SLOT_HOVER_BORDER;
      } else {
        ctx.strokeStyle = isEmpty ? SLOT_EMPTY_BORDER : SLOT_FILLED_BORDER;
      }
      ctx.lineWidth = isHovered ? 3 : SLOT_BORDER;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      if (weapon) {
        // Weapon icon
        this._renderWeaponIcon(ctx, rect, weapon);

        // Tier badge (top-left)
        this._renderTierBadge(ctx, rect, weapon.tier);

        // Level indicator (bottom-right)
        this._renderLevelBadge(ctx, rect, weapon.level, isMaxLevel);

        // Gold cost below slot
        if (!isMaxLevel) {
          ctx.font = 'bold 11px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = canAfford ? COST_COLOR : CANNOT_AFFORD_COLOR;
          ctx.fillText(cost + 'g', rect.x + rect.width / 2, rect.y + rect.height + 3);
        } else {
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = MAX_LEVEL_COLOR;
          ctx.fillText('MAX', rect.x + rect.width / 2, rect.y + rect.height + 3);
        }
      } else {
        // Empty slot X
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

    _renderWeaponIcon(ctx, rect, weapon) {
      var centerX = rect.x + rect.width / 2;
      var centerY = rect.y + rect.height / 2;
      var iconSize = rect.width * 0.6;

      // Get weapon color from data
      var color = '#FFFFFF';
      if (weapon.data) {
        color = weapon.data.color || ATTACK_TYPE_COLORS[weapon.data.attackType] || '#FFFFFF';
      }

      var icon = weapon.data ? weapon.data.icon : null;
      var attackType = weapon.data ? weapon.data.attackType : 'projectile';

      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      // Render specific icon based on weapon icon property
      switch (icon) {
        case 'magic_orb':
          ctx.beginPath();
          ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(centerX - 2, centerY - 2, iconSize / 4, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'rifle':
          ctx.fillRect(centerX - iconSize / 2, centerY - 2, iconSize * 0.8, 4);
          ctx.fillRect(centerX - iconSize / 3, centerY - 6, 4, 10);
          break;

        case 'shotgun':
          ctx.fillRect(centerX - iconSize / 2, centerY - 3, iconSize * 0.7, 2);
          ctx.fillRect(centerX - iconSize / 2, centerY + 1, iconSize * 0.7, 2);
          ctx.fillRect(centerX - iconSize / 3, centerY - 6, 5, 12);
          break;

        case 'laser_beam':
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 2, centerY);
          ctx.lineTo(centerX + iconSize / 2, centerY);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(centerX + iconSize / 2, centerY, 4, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'auto_laser':
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 2, centerY);
          ctx.lineTo(centerX + iconSize / 3, centerY);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(centerX + iconSize / 3, centerY, 4, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'sword':
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 2, centerY + iconSize / 3);
          ctx.lineTo(centerX + iconSize / 2, centerY - iconSize / 3);
          ctx.stroke();
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 4, centerY + iconSize / 6);
          ctx.lineTo(centerX + iconSize / 6, centerY - iconSize / 4);
          ctx.stroke();
          break;

        case 'dagger':
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 3, centerY + iconSize / 4);
          ctx.lineTo(centerX + iconSize / 3, centerY - iconSize / 4);
          ctx.stroke();
          ctx.fillRect(centerX - iconSize / 6, centerY + iconSize / 8, 5, 3);
          break;

        case 'poison':
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(centerX - 5, centerY + 4, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(centerX + 5, centerY + 3, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          break;

        case 'fire':
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - iconSize / 2);
          ctx.quadraticCurveTo(centerX + iconSize / 3, centerY - iconSize / 4, centerX + iconSize / 4, centerY + iconSize / 3);
          ctx.lineTo(centerX, centerY + iconSize / 6);
          ctx.lineTo(centerX - iconSize / 4, centerY + iconSize / 3);
          ctx.quadraticCurveTo(centerX - iconSize / 3, centerY - iconSize / 4, centerX, centerY - iconSize / 2);
          ctx.fill();
          break;

        case 'spinning_blade':
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
          ctx.stroke();
          for (var i = 0; i < 4; i++) {
            var angle = (Math.PI / 2) * i;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * iconSize / 2, centerY + Math.sin(angle) * iconSize / 2);
            ctx.stroke();
          }
          break;

        case 'lightning':
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - iconSize / 2);
          ctx.lineTo(centerX - iconSize / 4, centerY);
          ctx.lineTo(centerX + iconSize / 6, centerY);
          ctx.lineTo(centerX - iconSize / 6, centerY + iconSize / 2);
          ctx.stroke();
          break;

        default:
          // Fallback to type-based icons
          switch (attackType) {
            case 'projectile':
              ctx.beginPath();
              ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
              ctx.fill();
              break;

            case 'laser':
              ctx.fillRect(centerX - iconSize / 2, centerY - 3, iconSize, 6);
              ctx.beginPath();
              ctx.arc(centerX + iconSize / 2, centerY, 4, 0, Math.PI * 2);
              ctx.fill();
              break;

            case 'melee_swing':
              ctx.beginPath();
              ctx.moveTo(centerX - iconSize / 2, centerY + iconSize / 3);
              ctx.lineTo(centerX + iconSize / 2, centerY - iconSize / 3);
              ctx.lineWidth = 4;
              ctx.stroke();
              break;

            case 'area_damage':
              ctx.globalAlpha = 0.7;
              ctx.beginPath();
              ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1.0;
              break;

            case 'particle':
              this._drawStar(ctx, centerX, centerY, 5, iconSize / 2, iconSize / 4);
              ctx.fill();
              break;

            default:
              ctx.beginPath();
              ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
              ctx.fill();
          }
      }
    }

    _renderLevelBadge(ctx, rect, level, isMaxLevel) {
      var badgeX = rect.x + rect.width - 10;
      var badgeY = rect.y + rect.height - 10;
      var badgeRadius = 9;

      // Badge background
      ctx.fillStyle = isMaxLevel ? MAX_LEVEL_COLOR : 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Level text
      ctx.font = 'bold 10px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(level.toString(), badgeX, badgeY);
    }

    /**
     * Render tier badge at top-left of slot
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} rect - Slot rect
     * @param {number} tier - Weapon tier
     */
    _renderTierBadge(ctx, rect, tier) {
      if (!tier || tier < 1) return;

      var tierConfig = WeaponTierData ? WeaponTierData.getTierConfig(tier) : null;
      if (!tierConfig) return;

      var tierColor = tierConfig.color;
      var tierIcon = tierConfig.icon;

      // Tier badge at top-left of slot
      var badgeX = rect.x + 2;
      var badgeY = rect.y + 2;
      var badgeWidth = 16;
      var badgeHeight = 12;

      // Badge background
      ctx.fillStyle = tierColor;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
      ctx.globalAlpha = 1.0;

      // Badge border
      ctx.strokeStyle = tierColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(badgeX, badgeY, badgeWidth, badgeHeight);

      // Tier text (Roman numeral)
      ctx.font = 'bold 9px Arial';
      ctx.fillStyle = tierColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tierIcon, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
    }

    _attemptUpgrade(slotIndex) {
      if (!this._player) return null;

      var weapons = this._getWeapons();
      var weapon = weapons[slotIndex];

      if (!weapon) {
        return { weapon: null, success: false, reason: 'empty_slot' };
      }

      if (this._isWeaponMaxLevel(weapon)) {
        return { weapon: weapon, success: false, reason: 'max_level' };
      }

      var cost = this._getUpgradeCost(weapon);
      var gold = this._player.gold;

      if (!gold || gold.amount < cost) {
        return { weapon: weapon, success: false, reason: 'insufficient_gold' };
      }

      // Perform upgrade
      gold.spendGold(cost);
      weapon.upgrade();

      return { weapon: weapon, success: true, cost: cost };
    }

    _getTooltipContent(slotIndex) {
      var weapons = this._getWeapons();
      var weapon = weapons[slotIndex];

      if (!weapon) return null;

      var isMaxLevel = this._isWeaponMaxLevel(weapon);
      var cost = this._getUpgradeCost(weapon);
      var canAfford = this._player && this._player.gold ? this._player.gold.amount >= cost : false;

      var nextStats = '';
      if (!isMaxLevel && weapon.data && weapon.data.upgrades) {
        var nextLevel = weapon.level + 1;
        var upgradeData = weapon.data.upgrades[nextLevel];
        if (upgradeData) {
          var parts = [];
          for (var key in upgradeData) {
            if (upgradeData.hasOwnProperty(key)) {
              parts.push(key + ': ' + upgradeData[key]);
            }
          }
          nextStats = parts.slice(0, 2).join(', ');
        }
      }

      return {
        type: 'weapon',
        name: weapon.name || (weapon.data ? weapon.data.name : 'Unknown'),
        level: weapon.level,
        maxLevel: weapon.data ? weapon.data.maxLevel : 5,
        nextStats: nextStats,
        cost: cost,
        isMaxLevel: isMaxLevel,
        canAfford: canAfford,
      };
    }

    _drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
      var rot = (Math.PI / 2) * 3;
      var step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);

      for (var i = 0; i < spikes; i++) {
        var x = cx + Math.cos(rot) * outerRadius;
        var y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }

      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    }

    _isPointInRect(x, y, rect) {
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
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
      this._slotRects = [];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.WeaponGridPanel = WeaponGridPanel;
})(window.VampireSurvivors.UI);
