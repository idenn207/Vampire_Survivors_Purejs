/**
 * @fileoverview Weapon card panel - top-right section for selecting new weapons or upgrading existing
 * @module UI/WeaponCardPanel
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponTierData = window.VampireSurvivors.Data.WeaponTierData;
  var i18n = window.VampireSurvivors.Core.i18n;
  var UpgradeTooltip = window.VampireSurvivors.UI.UpgradeTooltip;

  // ============================================
  // Constants
  // ============================================
  var TITLE_HEIGHT = 40;
  var CARD_WIDTH = 140;
  var CARD_HEIGHT = 210;
  var CARD_GAP = 15;
  var CARD_PADDING = 10;
  var ICON_SIZE = 45;

  // Blue theme colors
  var BG_COLOR = '#2D3545';
  var BORDER_COLOR = '#4A5580';
  var TITLE_COLOR = '#F5F0E1';
  var CARD_BG = '#4A5570';
  var CARD_BG_TOP = '#5D6B8D';
  var CARD_BG_BOTTOM = '#3D4560';
  var CARD_BORDER = '#6B7BA0';
  var CARD_HOVER_BG = '#5D6B8D';
  var CARD_HOVER_BG_TOP = '#6D7FB5';
  var CARD_HOVER_BG_BOTTOM = '#4A5570';
  var CARD_SELECTED_BORDER = '#D4A84B';
  var TEXT_COLOR = '#F5F0E1';
  var DESC_COLOR = '#A8B4C8';
  var NEW_BADGE_COLOR = '#5EB8B8';
  var UPGRADE_BADGE_COLOR = '#5090C0';
  var EVOLUTION_BADGE_COLOR = '#8B6B9B';
  var EVOLUTION_MAIN_BADGE_COLOR = '#D4A84B';
  var EVOLUTION_MATERIAL_BADGE_COLOR = '#8B6B9B';
  var CANCEL_BADGE_COLOR = '#8B9BAB';
  var STAT_BADGE_COLOR = '#D4A84B';

  // Attack type colors
  var ATTACK_TYPE_COLORS = {
    projectile: '#3498DB',
    laser: '#E74C3C',
    melee_swing: '#2ECC71',
    area_damage: '#F39C12',
    particle: '#9B59B6',
  };

  // ============================================
  // Class Definition
  // ============================================
  class WeaponCardPanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _options = [];
    _x = 0;
    _y = 0;
    _width = 0;
    _height = 0;
    _hoveredIndex = -1;
    _cardRects = [];
    _cardScale = 1;
    _actualCardWidth = CARD_WIDTH;
    _actualCardHeight = CARD_HEIGHT;

    // Evolution state
    _evolutionState = 'normal';
    _selectedMainWeapon = null;

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
     * Set weapon options to display
     * @param {Array<Object>} options - Array of weapon option objects
     * @param {string} [evolutionState] - Current evolution state ('normal' or 'selecting_material')
     * @param {Object} [selectedMainWeapon] - The selected main weapon (when in material selection)
     * Options format:
     * {
     *   type: 'new' | 'upgrade' | 'evolution' | 'evolution_main' | 'evolution_material' | 'evolution_cancel' | 'stat',
     *   weaponId: string,
     *   weaponData: Object,
     *   currentLevel: number (for upgrades),
     *   statId: string (for stat boosts),
     *   statConfig: Object (for stat boosts),
     *   evolutionResult: Object (for evolution)
     * }
     */
    setOptions(options, evolutionState, selectedMainWeapon) {
      this._options = options || [];
      this._evolutionState = evolutionState || 'normal';
      this._selectedMainWeapon = selectedMainWeapon || null;
      this._calculateCardRects();
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
      this._calculateCardRects();
    }

    /**
     * Handle mouse move
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} Hovered option info for tooltip
     */
    handleMouseMove(mouseX, mouseY) {
      this._hoveredIndex = -1;

      for (var i = 0; i < this._cardRects.length; i++) {
        if (this._isPointInRect(mouseX, mouseY, this._cardRects[i])) {
          this._hoveredIndex = i;
          return this._getTooltipContent(i);
        }
      }

      return null;
    }

    /**
     * Handle click - returns selected option
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} Selected option or null
     */
    handleClick(mouseX, mouseY) {
      for (var i = 0; i < this._cardRects.length; i++) {
        if (this._isPointInRect(mouseX, mouseY, this._cardRects[i])) {
          return this._options[i];
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

      // Title - changes based on evolution state
      var title = i18n.t('levelUp.selectOne');
      var subtitle = '';

      if (this._evolutionState === 'selecting_material') {
        title = i18n.t('levelUp.selectMaterial');
        if (this._selectedMainWeapon) {
          subtitle = i18n.t('levelUp.main') + ' ' + i18n.tw(this._selectedMainWeapon.id, this._selectedMainWeapon.name);
        }
      }

      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, this._x + this._width / 2, this._y + TITLE_HEIGHT / 2 - (subtitle ? 8 : 0));

      // Show subtitle with main weapon name if selecting material
      if (subtitle) {
        ctx.font = '12px Arial';
        ctx.fillStyle = EVOLUTION_MAIN_BADGE_COLOR;
        ctx.fillText(subtitle, this._x + this._width / 2, this._y + TITLE_HEIGHT / 2 + 12);
      }

      // Separator line
      ctx.strokeStyle = BORDER_COLOR;
      ctx.beginPath();
      ctx.moveTo(this._x + 10, this._y + TITLE_HEIGHT);
      ctx.lineTo(this._x + this._width - 10, this._y + TITLE_HEIGHT);
      ctx.stroke();

      // Render cards
      for (var i = 0; i < this._options.length; i++) {
        this._renderCard(ctx, i, this._options[i]);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _calculateCardRects() {
      this._cardRects = [];

      var numCards = this._options.length;
      if (numCards === 0) return;

      // Calculate available width with padding
      var availableWidth = this._width - 20;

      // Calculate ideal total width
      var idealTotalWidth = numCards * CARD_WIDTH + (numCards - 1) * CARD_GAP;

      // Scale down if needed to prevent overflow
      var scale = idealTotalWidth > availableWidth ? availableWidth / idealTotalWidth : 1;
      var actualCardWidth = Math.floor(CARD_WIDTH * scale);
      var actualCardHeight = Math.floor(CARD_HEIGHT * scale);
      var actualGap = Math.floor(CARD_GAP * scale);

      // Store scale for rendering adjustments
      this._cardScale = scale;
      this._actualCardWidth = actualCardWidth;
      this._actualCardHeight = actualCardHeight;

      // Calculate actual total width and center
      var actualTotalWidth = numCards * actualCardWidth + (numCards - 1) * actualGap;
      var startX = this._x + (this._width - actualTotalWidth) / 2;
      var startY = this._y + TITLE_HEIGHT + 20;

      for (var i = 0; i < numCards; i++) {
        this._cardRects.push({
          x: startX + i * (actualCardWidth + actualGap),
          y: startY,
          width: actualCardWidth,
          height: actualCardHeight,
        });
      }
    }

    _renderCard(ctx, index, option) {
      var rect = this._cardRects[index];
      if (!rect) return;

      var isHovered = index === this._hoveredIndex;

      // Add shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = isHovered ? 12 : 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;

      // Card background with gradient
      var gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
      if (isHovered) {
        gradient.addColorStop(0, CARD_HOVER_BG_TOP);
        gradient.addColorStop(1, CARD_HOVER_BG_BOTTOM);
      } else {
        gradient.addColorStop(0, CARD_BG_TOP);
        gradient.addColorStop(1, CARD_BG_BOTTOM);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Reset shadow for border
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Card border with glow effect when hovered
      if (isHovered) {
        ctx.shadowColor = CARD_SELECTED_BORDER;
        ctx.shadowBlur = 10;
      }
      ctx.strokeStyle = isHovered ? CARD_SELECTED_BORDER : CARD_BORDER;
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Reset shadow
      ctx.shadowBlur = 0;

      // Badge (NEW, UPGRADE, EVOLUTION types, STAT)
      var badgeText = '';
      var badgeColor = '';

      switch (option.type) {
        case 'new':
          badgeText = i18n.t('levelUp.new');
          badgeColor = NEW_BADGE_COLOR;
          break;
        case 'upgrade':
          badgeText = i18n.t('tech.lv') + option.currentLevel + ' -> ' + (option.currentLevel + 1);
          badgeColor = UPGRADE_BADGE_COLOR;
          break;
        case 'evolution':
          badgeText = i18n.t('levelUp.evolution');
          badgeColor = EVOLUTION_BADGE_COLOR;
          break;
        case 'evolution_main':
          badgeText = i18n.t('evolution.main');
          badgeColor = EVOLUTION_MAIN_BADGE_COLOR;
          break;
        case 'evolution_material':
          badgeText = i18n.t('evolution.material');
          badgeColor = EVOLUTION_MATERIAL_BADGE_COLOR;
          break;
        case 'evolution_cancel':
          badgeText = i18n.t('levelUp.cancel');
          badgeColor = CANCEL_BADGE_COLOR;
          break;
        case 'stat':
          badgeText = i18n.t('levelUp.statBoost');
          badgeColor = STAT_BADGE_COLOR;
          break;
      }

      if (badgeText) {
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = badgeColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(badgeText, rect.x + rect.width / 2, rect.y + 8);
      }

      // Icon
      var iconY = rect.y + 45;
      this._renderIcon(ctx, rect.x + rect.width / 2, iconY + ICON_SIZE / 2, option);

      // Name
      var name = this._getOptionName(option);
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(name, rect.x + rect.width / 2, iconY + ICON_SIZE + 10);

      // Description (wrapped)
      var description = this._getOptionDescription(option);
      ctx.font = '11px Arial';
      ctx.fillStyle = DESC_COLOR;
      this._renderWrappedText(ctx, description, rect.x + rect.width / 2, iconY + ICON_SIZE + 30, rect.width - 20, 13);

      // Tier indicator (for weapons with tier property)
      if (option.weaponData && option.weaponData.tier) {
        this._renderTierIndicator(ctx, rect, option.weaponData.tier);
      } else if (option.weaponRef && option.weaponRef.tier) {
        this._renderTierIndicator(ctx, rect, option.weaponRef.tier);
      }
    }

    _renderIcon(ctx, centerX, centerY, option) {
      var color = '#FFFFFF';

      if (option.type === 'evolution_cancel') {
        // Cancel icon - X mark
        ctx.strokeStyle = CANCEL_BADGE_COLOR;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        var size = ICON_SIZE / 2;
        ctx.beginPath();
        ctx.moveTo(centerX - size, centerY - size);
        ctx.lineTo(centerX + size, centerY + size);
        ctx.moveTo(centerX + size, centerY - size);
        ctx.lineTo(centerX - size, centerY + size);
        ctx.stroke();
        ctx.lineCap = 'butt';
        return;
      } else if (option.type === 'stat') {
        color = option.statConfig ? option.statConfig.icon : '#F39C12';
        // Stat icon - hexagon
        ctx.fillStyle = color;
        this._drawHexagon(ctx, centerX, centerY, ICON_SIZE / 2);
        ctx.fill();
      } else if (option.weaponData) {
        color = option.weaponData.color || ATTACK_TYPE_COLORS[option.weaponData.attackType] || '#FFFFFF';
        var icon = option.weaponData.icon;
        var attackType = option.weaponData.attackType;

        // Try to render image if available
        var assetLoader = window.VampireSurvivors.Core.assetLoader;
        var imageId = option.weaponData.imageId;
        if (imageId && assetLoader && assetLoader.hasImage(imageId)) {
          var img = assetLoader.getImage(imageId);
          ctx.drawImage(img, centerX - ICON_SIZE / 2, centerY - ICON_SIZE / 2, ICON_SIZE, ICON_SIZE);
        } else {
          // Fallback to canvas icon
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          this._renderWeaponIcon(ctx, centerX, centerY, icon, attackType, color, ICON_SIZE);
        }

        // Attack type indicator ring
        var attackTypeColor = ATTACK_TYPE_COLORS[option.weaponData.attackType];
        if (attackTypeColor) {
          ctx.strokeStyle = attackTypeColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(centerX, centerY, ICON_SIZE / 2 + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (option.type === 'evolution') {
        // Evolution icon - star
        ctx.fillStyle = EVOLUTION_BADGE_COLOR;
        this._drawStar(ctx, centerX, centerY, 5, ICON_SIZE / 2, ICON_SIZE / 4);
        ctx.fill();
      }
    }

    _renderWeaponIcon(ctx, centerX, centerY, icon, attackType, color, size) {
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      switch (icon) {
        case 'magic_orb':
          // Glowing orb with inner highlight
          ctx.beginPath();
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(centerX - 3, centerY - 3, size / 4, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'rifle':
          // Gun barrel
          ctx.fillRect(centerX - size / 2, centerY - 3, size * 0.8, 6);
          ctx.fillRect(centerX - size / 3, centerY - 10, 6, 16);
          break;

        case 'shotgun':
          // Double barrel
          ctx.fillRect(centerX - size / 2, centerY - 4, size * 0.7, 3);
          ctx.fillRect(centerX - size / 2, centerY + 1, size * 0.7, 3);
          ctx.fillRect(centerX - size / 3, centerY - 10, 8, 20);
          break;

        case 'laser_beam':
          // Concentrated beam with glow
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - size / 2, centerY);
          ctx.lineTo(centerX + size / 2, centerY);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(centerX + size / 2, centerY, 6, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'auto_laser':
          // Auto-targeting beam
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX - size / 2, centerY);
          ctx.lineTo(centerX + size / 3, centerY);
          ctx.stroke();
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX + size / 3, centerY, 6, 0, Math.PI * 2);
          ctx.stroke();
          // Crosshair lines
          ctx.beginPath();
          ctx.moveTo(centerX + size / 3 - 8, centerY);
          ctx.lineTo(centerX + size / 3 + 8, centerY);
          ctx.moveTo(centerX + size / 3, centerY - 8);
          ctx.lineTo(centerX + size / 3, centerY + 8);
          ctx.stroke();
          break;

        case 'sword':
          // Sword blade
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX - size / 2, centerY + size / 3);
          ctx.lineTo(centerX + size / 2, centerY - size / 3);
          ctx.stroke();
          // Guard
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(centerX - size / 4, centerY + size / 6);
          ctx.lineTo(centerX + size / 6, centerY - size / 4);
          ctx.stroke();
          break;

        case 'dagger':
          // Quick dagger
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX - size / 3, centerY + size / 4);
          ctx.lineTo(centerX + size / 3, centerY - size / 4);
          ctx.stroke();
          ctx.fillRect(centerX - size / 6, centerY + size / 8, 8, 4);
          break;

        case 'poison':
          // Toxic cloud bubbles
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(centerX - 10, centerY + 8, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(centerX + 10, centerY + 6, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          break;

        case 'fire':
          // Flame shape
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - size / 2);
          ctx.quadraticCurveTo(centerX + size / 2.5, centerY - size / 4, centerX + size / 3, centerY + size / 3);
          ctx.lineTo(centerX, centerY + size / 6);
          ctx.lineTo(centerX - size / 3, centerY + size / 3);
          ctx.quadraticCurveTo(centerX - size / 2.5, centerY - size / 4, centerX, centerY - size / 2);
          ctx.fill();
          break;

        case 'spinning_blade':
          // Circular blade
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
          ctx.stroke();
          // Inner spokes
          for (var i = 0; i < 4; i++) {
            var angle = (Math.PI / 2) * i;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + (Math.cos(angle) * size) / 2, centerY + (Math.sin(angle) * size) / 2);
            ctx.stroke();
          }
          // Center
          ctx.beginPath();
          ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'lightning':
          // Lightning bolt
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX + 5, centerY - size / 2);
          ctx.lineTo(centerX - 5, centerY - 2);
          ctx.lineTo(centerX + 5, centerY + 2);
          ctx.lineTo(centerX - 5, centerY + size / 2);
          ctx.stroke();
          break;

        default:
          // Fallback to type-based icons
          switch (attackType) {
            case 'projectile':
              ctx.beginPath();
              ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
              ctx.fill();
              break;

            case 'laser':
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(centerX - size / 2, centerY);
              ctx.lineTo(centerX + size / 2, centerY);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(centerX + size / 2, centerY, 5, 0, Math.PI * 2);
              ctx.fill();
              break;

            case 'melee_swing':
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.moveTo(centerX - size / 2, centerY + size / 3);
              ctx.lineTo(centerX + size / 2, centerY - size / 3);
              ctx.stroke();
              break;

            case 'area_damage':
              ctx.globalAlpha = 0.7;
              ctx.beginPath();
              ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1.0;
              break;

            case 'particle':
              this._drawStar(ctx, centerX, centerY, 5, size / 2, size / 4);
              ctx.fill();
              break;

            default:
              ctx.beginPath();
              ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
              ctx.fill();
          }
      }
    }

    /**
     * Render tier indicator on weapon card
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} rect - Card rect
     * @param {number} tier - Weapon tier
     */
    _renderTierIndicator(ctx, rect, tier) {
      if (!tier || tier < 1) return;

      var tierConfig = WeaponTierData ? WeaponTierData.getTierConfig(tier) : null;
      if (!tierConfig) return;

      var tierColor = tierConfig.color;
      var tierIcon = tierConfig.icon;

      // Tier badge at top-left of card
      var badgeX = rect.x + 8;
      var badgeY = rect.y + 8;
      var badgeWidth = 28;
      var badgeHeight = 16;

      // Badge background
      ctx.fillStyle = tierColor;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
      ctx.globalAlpha = 1.0;

      // Badge border
      ctx.strokeStyle = tierColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(badgeX, badgeY, badgeWidth, badgeHeight);

      // Tier text (Roman numeral)
      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = tierColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tierIcon, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
    }

    _getOptionName(option) {
      if (option.type === 'stat' && option.statConfig) {
        return i18n.tsn(option.statId, option.statConfig.name);
      }
      if (option.type === 'evolution_cancel') {
        return i18n.t('levelUp.cancelLabel');
      }
      if (option.type === 'evolution_material' && option.evolutionResult) {
        return i18n.tw(option.weaponData.id, option.weaponData.name);
      }
      if (option.weaponData) {
        return i18n.tw(option.weaponData.id, option.weaponData.name);
      }
      if (option.type === 'evolution' && option.evolutionResult) {
        return i18n.tw(option.evolutionResult.id, option.evolutionResult.name);
      }
      return i18n.t('levelUp.unknown');
    }

    _getOptionDescription(option) {
      if (option.type === 'stat' && option.statConfig) {
        return i18n.tsd(option.statId, option.statConfig.description);
      }
      if (option.type === 'evolution_cancel') {
        return i18n.t('levelUp.returnToSelection');
      }
      if (option.type === 'evolution_main' && option.weaponData) {
        return i18n.t('levelUp.selectAsMain');
      }
      if (option.type === 'evolution_material' && option.evolutionResult) {
        return i18n.t('levelUp.evolvesInto') + ' ' + i18n.tw(option.evolutionResult.id, option.evolutionResult.name);
      }
      if (option.type === 'new' && option.weaponData) {
        var data = option.weaponData;
        var parts = [];

        // Attack type and mode
        parts.push(i18n.tat(data.attackType) + ' - ' + (data.isAuto ? i18n.t('levelUp.auto') : i18n.t('levelUp.manual')));

        // Add stats if available
        var statParts = [];
        if (data.damage) statParts.push(i18n.t('tooltip.damage') + ' ' + data.damage);
        if (data.cooldown) statParts.push(i18n.t('tooltip.cooldown') + ' ' + data.cooldown.toFixed(1) + 's');
        if (statParts.length > 0) parts.push(statParts.join(' | '));

        return parts.join(' - ');
      }
      if (option.type === 'upgrade' && option.weaponData) {
        var upgrades = option.weaponData.upgrades;
        var nextLevel = option.currentLevel + 1;
        if (upgrades && upgrades[nextLevel]) {
          var upgradeData = upgrades[nextLevel];
          var parts = [];
          for (var key in upgradeData) {
            if (upgradeData.hasOwnProperty(key)) {
              parts.push(key + ': ' + upgradeData[key]);
            }
          }
          return parts.slice(0, 2).join(', ');
        }
        return i18n.t('levelUp.enhancedStats');
      }
      if (option.type === 'evolution') {
        return i18n.t('levelUp.combineWeapons');
      }
      return '';
    }

    _getTooltipContent(index) {
      var option = this._options[index];
      if (!option) return null;

      if (option.type === 'new') {
        // Use shared utility for new weapon tooltip
        return UpgradeTooltip.buildWeaponDetailContent(option.weaponData, {
          isNew: true,
        });
      }

      if (option.type === 'upgrade') {
        // Use shared utility for weapon upgrade tooltip
        // Use the actual weapon instance if available, otherwise fall back to weaponData
        var weaponSource = option.weapon || option.weaponData;
        return UpgradeTooltip.buildWeaponDetailContent(weaponSource, {
          isNew: false,
        });
      }

      return null;
    }

    _renderWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
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

      for (var j = 0; j < lines.length && j < 3; j++) {
        ctx.fillText(lines[j], x, y + j * lineHeight);
      }
    }

    _drawHexagon(ctx, cx, cy, radius) {
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var angle = (Math.PI / 3) * i - Math.PI / 6;
        var x = cx + radius * Math.cos(angle);
        var y = cy + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
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
    get hoveredIndex() {
      return this._hoveredIndex;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._options = [];
      this._cardRects = [];
      this._evolutionState = 'normal';
      this._selectedMainWeapon = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.WeaponCardPanel = WeaponCardPanel;
})(window.VampireSurvivors.UI);
