/**
 * @fileoverview Evolution popup - modal for weapon evolution with slot selection
 * @module UI/EvolutionPopup
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponTierData = window.VampireSurvivors.Data.WeaponTierData;
  var WeaponEvolutionData = window.VampireSurvivors.Data.WeaponEvolutionData;

  // ============================================
  // Constants
  // ============================================
  var POPUP_WIDTH = 560;
  var POPUP_HEIGHT = 460;

  // Colors
  var OVERLAY_COLOR = 'rgba(0, 0, 0, 0.85)';
  var POPUP_BG = '#1A2332';
  var POPUP_BORDER = '#3D566E';
  var TITLE_COLOR = '#FFFFFF';
  var TEXT_COLOR = '#ECF0F1';
  var DESC_COLOR = '#BDC3C7';
  var SLOT_BG = '#2C3E50';
  var SLOT_BORDER = '#4A6278';
  var SLOT_EMPTY_COLOR = '#34495E';
  var SLOT_HOVER_BORDER = '#2ECC71';
  var SLOT_SELECTED_BORDER = '#F39C12';
  var RESULT_SLOT_BORDER = '#2ECC71';
  var BUTTON_BG = '#9B59B6';
  var BUTTON_HOVER_BG = '#8E44AD';
  var BUTTON_DISABLED_BG = '#4A6278';
  var CLOSE_BUTTON_BG = '#7F8C8D';
  var CLOSE_BUTTON_HOVER = '#95A5A6';
  var UNKNOWN_RESULT_COLOR = '#F39C12';
  var FORMULA_COLOR = '#BDC3C7';

  // Slot dimensions
  var SLOT_SIZE = 80;
  var SLOT_ICON_SIZE = 50;
  var RESULT_SLOT_SIZE = 90;

  // Weapon grid
  var GRID_COLS = 5;
  var GRID_ROWS = 2;
  var GRID_SLOT_SIZE = 60;
  var GRID_GAP = 8;

  // Buttons
  var BUTTON_WIDTH = 120;
  var BUTTON_HEIGHT = 40;

  // ============================================
  // Class Definition
  // ============================================
  class EvolutionPopup {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _player = null;
    _canvasWidth = 800;
    _canvasHeight = 600;

    // Popup position
    _x = 0;
    _y = 0;

    // Weapon slots
    _mainSlot = null;
    _materialSlot = null;

    // Eligible weapons (same tier at max level)
    _eligibleWeapons = [];
    _selectedTier = 1;

    // Result preview
    _evolutionResult = null;
    _isKnownRecipe = false;

    // UI rects for hit testing
    _mainSlotRect = null;
    _materialSlotRect = null;
    _resultSlotRect = null;
    _weaponGridRects = [];
    _evolveButtonRect = null;
    _closeButtonRect = null;

    // Hover state
    _hoveredSlot = null; // 'main', 'material', or null
    _hoveredWeaponIndex = -1;
    _hoveredButton = null; // 'evolve', 'close', or null

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._weaponGridRects = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show the evolution popup
     * @param {Entity} player - Player entity
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     * @param {Object} [options] - Optional: { eligibleTiers: { [tier]: Weapon[] } }
     */
    show(player, canvasWidth, canvasHeight, options) {
      this._isVisible = true;
      this._player = player;
      this._canvasWidth = canvasWidth || 800;
      this._canvasHeight = canvasHeight || 600;

      // Center popup
      this._x = (this._canvasWidth - POPUP_WIDTH) / 2;
      this._y = (this._canvasHeight - POPUP_HEIGHT) / 2;

      // Reset selection
      this._mainSlot = null;
      this._materialSlot = null;
      this._evolutionResult = null;
      this._isKnownRecipe = false;

      // Find eligible weapons
      this._findEligibleWeapons(options);

      // Calculate UI rects
      this._calculateRects();
    }

    /**
     * Hide the popup
     */
    hide() {
      this._isVisible = false;
      this._player = null;
      this._mainSlot = null;
      this._materialSlot = null;
      this._eligibleWeapons = [];
      this._evolutionResult = null;
    }

    /**
     * Handle input
     * @param {Object} input - Input manager
     * @returns {Object|null} Action result or null
     */
    handleInput(input) {
      if (!this._isVisible) return null;

      var mousePos = input.mousePosition;
      var mouseX = mousePos.x;
      var mouseY = mousePos.y;

      // Update hover states
      this._updateHoverState(mouseX, mouseY);

      // Handle click
      if (input.isMousePressed(0)) {
        return this._handleClick(mouseX, mouseY);
      }

      return null;
    }

    /**
     * Render the popup
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._isVisible) return;

      // Dark overlay
      ctx.fillStyle = OVERLAY_COLOR;
      ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

      // Popup background
      ctx.fillStyle = POPUP_BG;
      ctx.fillRect(this._x, this._y, POPUP_WIDTH, POPUP_HEIGHT);

      // Popup border
      ctx.strokeStyle = POPUP_BORDER;
      ctx.lineWidth = 3;
      ctx.strokeRect(this._x, this._y, POPUP_WIDTH, POPUP_HEIGHT);

      // Title
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('WEAPON EVOLUTION', this._x + POPUP_WIDTH / 2, this._y + 35);

      // Tier indicator
      if (this._selectedTier > 0) {
        var tierConfig = WeaponTierData.getTierConfig(this._selectedTier);
        var nextTierConfig = WeaponTierData.getTierConfig(this._selectedTier + 1);
        ctx.font = '14px Arial';
        ctx.fillStyle = tierConfig.color;
        var tierText = 'Tier ' + tierConfig.icon + ' (' + tierConfig.name + ')';
        if (nextTierConfig) {
          tierText += ' -> Tier ' + nextTierConfig.icon + ' (' + nextTierConfig.name + ')';
        }
        ctx.fillText(tierText, this._x + POPUP_WIDTH / 2, this._y + 60);
      }

      // Render formula: [MAIN] + [MATERIAL] = [RESULT]
      this._renderMainSlot(ctx);
      this._renderFormulaOperators(ctx);
      this._renderMaterialSlot(ctx);
      this._renderResultSlot(ctx);

      // Eligible weapons grid
      this._renderWeaponGrid(ctx);

      // Buttons
      this._renderButtons(ctx);

      // Instructions
      ctx.font = '12px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.textAlign = 'center';
      ctx.fillText('Select MAIN weapon first, then MATERIAL (order matters!)', this._x + POPUP_WIDTH / 2, this._y + POPUP_HEIGHT - 15);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _findEligibleWeapons(options) {
      this._eligibleWeapons = [];
      this._selectedTier = 1;

      if (!this._player) return;

      // Get weapons from player's WeaponSlot component
      var weaponSlot = this._player.weaponSlot;
      if (!weaponSlot) return;

      var weapons = weaponSlot.weapons;

      // Group weapons by tier that are at max level and below max tier
      var tierGroups = {};

      for (var i = 0; i < weapons.length; i++) {
        var weapon = weapons[i];
        if (!weapon) continue;

        // Must be at max level
        if (weapon.level < weapon.maxLevel) continue;

        // Must be below max tier
        if (weapon.tier >= weapon.maxTier) continue;

        var tier = weapon.tier;
        if (!tierGroups[tier]) {
          tierGroups[tier] = [];
        }
        tierGroups[tier].push(weapon);
      }

      // Find a tier with 2+ weapons
      for (var t in tierGroups) {
        if (tierGroups[t].length >= 2) {
          this._selectedTier = parseInt(t);
          this._eligibleWeapons = tierGroups[t];
          break;
        }
      }

      // If options provided with eligibleTiers, use that
      if (options && options.eligibleTiers) {
        for (var tier in options.eligibleTiers) {
          if (options.eligibleTiers[tier].length >= 2) {
            this._selectedTier = parseInt(tier);
            this._eligibleWeapons = options.eligibleTiers[tier];
            break;
          }
        }
      }
    }

    _calculateRects() {
      var centerX = this._x + POPUP_WIDTH / 2;
      var slotY = this._y + 85;

      // Formula layout: [MAIN] + [MATERIAL] = [RESULT]
      // Calculate positions for all three slots with operators between them
      var formulaWidth = SLOT_SIZE + 30 + SLOT_SIZE + 30 + RESULT_SLOT_SIZE; // slots + gaps for + and =
      var formulaStartX = centerX - formulaWidth / 2;

      // Main slot (left)
      this._mainSlotRect = {
        x: formulaStartX,
        y: slotY,
        width: SLOT_SIZE,
        height: SLOT_SIZE,
      };

      // Material slot (middle)
      this._materialSlotRect = {
        x: formulaStartX + SLOT_SIZE + 30,
        y: slotY,
        width: SLOT_SIZE,
        height: SLOT_SIZE,
      };

      // Result slot (right)
      this._resultSlotRect = {
        x: formulaStartX + SLOT_SIZE + 30 + SLOT_SIZE + 30,
        y: slotY - 5, // Slightly higher to align visually
        width: RESULT_SLOT_SIZE,
        height: RESULT_SLOT_SIZE,
      };

      // Weapon grid
      var gridWidth = GRID_COLS * GRID_SLOT_SIZE + (GRID_COLS - 1) * GRID_GAP;
      var gridStartX = centerX - gridWidth / 2;
      var gridStartY = this._y + 255;

      this._weaponGridRects = [];
      for (var row = 0; row < GRID_ROWS; row++) {
        for (var col = 0; col < GRID_COLS; col++) {
          this._weaponGridRects.push({
            x: gridStartX + col * (GRID_SLOT_SIZE + GRID_GAP),
            y: gridStartY + row * (GRID_SLOT_SIZE + GRID_GAP),
            width: GRID_SLOT_SIZE,
            height: GRID_SLOT_SIZE,
          });
        }
      }

      // Buttons
      var buttonY = this._y + POPUP_HEIGHT - 70;

      this._evolveButtonRect = {
        x: centerX - BUTTON_WIDTH - 20,
        y: buttonY,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
      };

      this._closeButtonRect = {
        x: centerX + 20,
        y: buttonY,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
      };
    }

    _updateHoverState(mouseX, mouseY) {
      // Reset hover states
      this._hoveredSlot = null;
      this._hoveredWeaponIndex = -1;
      this._hoveredButton = null;

      // Check main slot
      if (this._isPointInRect(mouseX, mouseY, this._mainSlotRect)) {
        this._hoveredSlot = 'main';
        return;
      }

      // Check material slot
      if (this._isPointInRect(mouseX, mouseY, this._materialSlotRect)) {
        this._hoveredSlot = 'material';
        return;
      }

      // Check weapon grid
      for (var i = 0; i < this._weaponGridRects.length; i++) {
        if (i < this._eligibleWeapons.length && this._isPointInRect(mouseX, mouseY, this._weaponGridRects[i])) {
          this._hoveredWeaponIndex = i;
          return;
        }
      }

      // Check buttons
      if (this._isPointInRect(mouseX, mouseY, this._evolveButtonRect)) {
        this._hoveredButton = 'evolve';
        return;
      }

      if (this._isPointInRect(mouseX, mouseY, this._closeButtonRect)) {
        this._hoveredButton = 'close';
        return;
      }
    }

    _handleClick(mouseX, mouseY) {
      // Check close button first
      if (this._isPointInRect(mouseX, mouseY, this._closeButtonRect)) {
        return { action: 'close' };
      }

      // Check evolve button
      if (this._isPointInRect(mouseX, mouseY, this._evolveButtonRect)) {
        if (this._mainSlot && this._materialSlot) {
          return {
            action: 'evolve',
            mainWeapon: this._mainSlot,
            materialWeapon: this._materialSlot,
            evolutionResult: this._evolutionResult,
            isKnownRecipe: this._isKnownRecipe,
          };
        }
        return null;
      }

      // Check main slot (to deselect)
      if (this._isPointInRect(mouseX, mouseY, this._mainSlotRect)) {
        if (this._mainSlot) {
          this._mainSlot = null;
          this._updateEvolutionPreview();
        }
        return null;
      }

      // Check material slot (to deselect)
      if (this._isPointInRect(mouseX, mouseY, this._materialSlotRect)) {
        if (this._materialSlot) {
          this._materialSlot = null;
          this._updateEvolutionPreview();
        }
        return null;
      }

      // Check weapon grid
      for (var i = 0; i < this._weaponGridRects.length; i++) {
        if (i < this._eligibleWeapons.length && this._isPointInRect(mouseX, mouseY, this._weaponGridRects[i])) {
          var weapon = this._eligibleWeapons[i];

          // Don't allow selecting already selected weapons
          if (this._mainSlot === weapon || this._materialSlot === weapon) {
            return null;
          }

          // Fill main slot first, then material
          if (!this._mainSlot) {
            this._mainSlot = weapon;
          } else if (!this._materialSlot) {
            this._materialSlot = weapon;
          } else {
            // Both filled, replace material
            this._materialSlot = weapon;
          }

          this._updateEvolutionPreview();
          return null;
        }
      }

      return null;
    }

    _updateEvolutionPreview() {
      this._evolutionResult = null;
      this._isKnownRecipe = false;

      if (!this._mainSlot || !this._materialSlot) return;

      var mainId = this._mainSlot.id;
      var materialId = this._materialSlot.id;

      // Check for known recipe
      var tierEvolution = WeaponEvolutionData.findTierEvolution(mainId, materialId, this._selectedTier);

      if (tierEvolution && tierEvolution.isKnown) {
        this._isKnownRecipe = true;
        this._evolutionResult = tierEvolution.weaponData;
      } else {
        // Unknown recipe - will be random
        this._isKnownRecipe = false;
        this._evolutionResult = {
          name: 'Random Tier ' + (this._selectedTier + 1) + ' Weapon',
          tier: this._selectedTier + 1,
          isRandom: true,
        };
      }
    }

    _renderMainSlot(ctx) {
      var rect = this._mainSlotRect;
      var isHovered = this._hoveredSlot === 'main';
      var isFilled = !!this._mainSlot;

      // Slot background
      ctx.fillStyle = isFilled ? SLOT_BG : SLOT_EMPTY_COLOR;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Border
      if (isFilled) {
        ctx.strokeStyle = SLOT_SELECTED_BORDER;
      } else if (isHovered) {
        ctx.strokeStyle = SLOT_HOVER_BORDER;
      } else {
        ctx.strokeStyle = SLOT_BORDER;
      }
      ctx.lineWidth = isFilled || isHovered ? 3 : 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Label
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('MAIN', rect.x + rect.width / 2, rect.y - 5);

      // Content
      if (isFilled) {
        this._renderWeaponInSlot(ctx, rect, this._mainSlot);
      } else {
        // Empty slot text
        ctx.font = '12px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Select', rect.x + rect.width / 2, rect.y + rect.height / 2);
      }
    }

    _renderMaterialSlot(ctx) {
      var rect = this._materialSlotRect;
      var isHovered = this._hoveredSlot === 'material';
      var isFilled = !!this._materialSlot;

      // Slot background
      ctx.fillStyle = isFilled ? SLOT_BG : SLOT_EMPTY_COLOR;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Border
      if (isFilled) {
        ctx.strokeStyle = SLOT_SELECTED_BORDER;
      } else if (isHovered) {
        ctx.strokeStyle = SLOT_HOVER_BORDER;
      } else {
        ctx.strokeStyle = SLOT_BORDER;
      }
      ctx.lineWidth = isFilled || isHovered ? 3 : 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Label
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('MATERIAL', rect.x + rect.width / 2, rect.y - 5);

      // Content
      if (isFilled) {
        this._renderWeaponInSlot(ctx, rect, this._materialSlot);
      } else {
        // Empty slot text
        ctx.font = '12px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Select', rect.x + rect.width / 2, rect.y + rect.height / 2);
      }
    }

    _renderWeaponInSlot(ctx, rect, weapon) {
      var centerX = rect.x + rect.width / 2;
      var centerY = rect.y + rect.height / 2 - 8;

      // Weapon icon (simplified)
      var weaponData = weapon.data || weapon;
      var color = weaponData.color || '#FFFFFF';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, SLOT_ICON_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();

      // Weapon name
      ctx.font = '10px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      var name = weapon.name || weapon.id;
      if (name.length > 10) {
        name = name.substring(0, 9) + '...';
      }
      ctx.fillText(name, centerX, centerY + SLOT_ICON_SIZE / 3 + 5);

      // Tier indicator
      var tierConfig = WeaponTierData.getTierConfig(weapon.tier);
      if (tierConfig) {
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = tierConfig.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(tierConfig.icon, rect.x + 5, rect.y + 5);
      }
    }

    _renderFormulaOperators(ctx) {
      var slotY = this._mainSlotRect.y + SLOT_SIZE / 2;

      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = FORMULA_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Plus sign between main and material
      var plusX = this._mainSlotRect.x + SLOT_SIZE + 15;
      ctx.fillText('+', plusX, slotY);

      // Equals sign between material and result
      var equalsX = this._materialSlotRect.x + SLOT_SIZE + 15;
      ctx.fillText('=', equalsX, slotY);
    }

    _renderResultSlot(ctx) {
      var rect = this._resultSlotRect;
      var hasResult = this._mainSlot && this._materialSlot && this._evolutionResult;

      // Slot background
      ctx.fillStyle = hasResult ? SLOT_BG : SLOT_EMPTY_COLOR;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Border - glow effect when result is available
      if (hasResult && this._isKnownRecipe) {
        ctx.strokeStyle = RESULT_SLOT_BORDER;
        ctx.lineWidth = 3;
      } else if (hasResult) {
        ctx.strokeStyle = UNKNOWN_RESULT_COLOR;
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = SLOT_BORDER;
        ctx.lineWidth = 2;
      }
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Label
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('RESULT', rect.x + rect.width / 2, rect.y - 5);

      var centerX = rect.x + rect.width / 2;
      var centerY = rect.y + rect.height / 2;

      if (hasResult) {
        if (this._isKnownRecipe) {
          // Known recipe - show evolved weapon
          var resultData = this._evolutionResult;
          var tierConfig = WeaponTierData.getTierConfig(resultData.tier);

          // Icon
          var color = resultData.color || tierConfig.color;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(centerX, centerY - 12, 20, 0, Math.PI * 2);
          ctx.fill();

          // Weapon name
          ctx.font = 'bold 10px Arial';
          ctx.fillStyle = tierConfig.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          var name = resultData.name;
          if (name.length > 12) {
            name = name.substring(0, 11) + '...';
          }
          ctx.fillText(name, centerX, centerY + 12);

          // Tier badge
          ctx.font = 'bold 10px Arial';
          ctx.fillStyle = tierConfig.color;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(tierConfig.icon, rect.x + 5, rect.y + 5);
        } else {
          // Unknown recipe - show '?'
          var nextTierConfig = WeaponTierData.getTierConfig(this._selectedTier + 1);

          // Question mark
          ctx.font = 'bold 40px Arial';
          ctx.fillStyle = UNKNOWN_RESULT_COLOR;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', centerX, centerY - 5);

          // Random text
          ctx.font = '9px Arial';
          ctx.fillStyle = UNKNOWN_RESULT_COLOR;
          ctx.textBaseline = 'top';
          ctx.fillText('Random', centerX, centerY + 20);
          ctx.fillText(nextTierConfig.name, centerX, centerY + 32);
        }
      } else {
        // Empty - waiting for selection
        ctx.font = '11px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Select', centerX, centerY - 5);
        ctx.fillText('weapons', centerX, centerY + 8);
      }
    }

    _renderWeaponGrid(ctx) {
      // Grid title
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('ELIGIBLE WEAPONS (Lv.Max, Same Tier)', this._x + POPUP_WIDTH / 2, this._y + 245);

      for (var i = 0; i < this._weaponGridRects.length; i++) {
        var rect = this._weaponGridRects[i];
        var weapon = i < this._eligibleWeapons.length ? this._eligibleWeapons[i] : null;
        var isHovered = this._hoveredWeaponIndex === i;
        var isSelected = weapon && (this._mainSlot === weapon || this._materialSlot === weapon);

        // Slot background
        ctx.fillStyle = weapon ? SLOT_BG : SLOT_EMPTY_COLOR;
        ctx.globalAlpha = weapon ? 1.0 : 0.3;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.globalAlpha = 1.0;

        // Border
        if (isSelected) {
          ctx.strokeStyle = SLOT_SELECTED_BORDER;
          ctx.lineWidth = 3;
        } else if (isHovered && weapon) {
          ctx.strokeStyle = SLOT_HOVER_BORDER;
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = SLOT_BORDER;
          ctx.lineWidth = 1;
        }
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // Weapon content
        if (weapon) {
          this._renderWeaponInGridSlot(ctx, rect, weapon, isSelected);
        }
      }
    }

    _renderWeaponInGridSlot(ctx, rect, weapon, isSelected) {
      var centerX = rect.x + rect.width / 2;
      var centerY = rect.y + rect.height / 2 - 5;

      // Dim if selected (already in a slot)
      if (isSelected) {
        ctx.globalAlpha = 0.5;
      }

      // Weapon icon
      var weaponData = weapon.data || weapon;
      var color = weaponData.color || '#FFFFFF';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Weapon name
      ctx.font = '9px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      var name = weapon.name || weapon.id;
      if (name.length > 8) {
        name = name.substring(0, 7) + '..';
      }
      ctx.fillText(name, centerX, centerY + 18);

      ctx.globalAlpha = 1.0;

      // Selection indicator
      if (isSelected) {
        var indicator = this._mainSlot === weapon ? 'M' : 'S';
        var indicatorColor = this._mainSlot === weapon ? '#E67E22' : '#9B59B6';

        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = indicatorColor;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText(indicator, rect.x + rect.width - 3, rect.y + 3);
      }
    }

    _renderButtons(ctx) {
      var canEvolve = this._mainSlot && this._materialSlot;

      // Evolve button
      var evolveRect = this._evolveButtonRect;
      var evolveHovered = this._hoveredButton === 'evolve';

      if (canEvolve) {
        ctx.fillStyle = evolveHovered ? BUTTON_HOVER_BG : BUTTON_BG;
      } else {
        ctx.fillStyle = BUTTON_DISABLED_BG;
      }
      ctx.fillRect(evolveRect.x, evolveRect.y, evolveRect.width, evolveRect.height);

      ctx.strokeStyle = canEvolve ? BUTTON_BG : BUTTON_DISABLED_BG;
      ctx.lineWidth = 2;
      ctx.strokeRect(evolveRect.x, evolveRect.y, evolveRect.width, evolveRect.height);

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = canEvolve ? TEXT_COLOR : DESC_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('EVOLVE', evolveRect.x + evolveRect.width / 2, evolveRect.y + evolveRect.height / 2);

      // Close button
      var closeRect = this._closeButtonRect;
      var closeHovered = this._hoveredButton === 'close';

      ctx.fillStyle = closeHovered ? CLOSE_BUTTON_HOVER : CLOSE_BUTTON_BG;
      ctx.fillRect(closeRect.x, closeRect.y, closeRect.width, closeRect.height);

      ctx.strokeStyle = CLOSE_BUTTON_BG;
      ctx.lineWidth = 2;
      ctx.strokeRect(closeRect.x, closeRect.y, closeRect.width, closeRect.height);

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.fillText('CLOSE', closeRect.x + closeRect.width / 2, closeRect.y + closeRect.height / 2);
    }

    _isPointInRect(x, y, rect) {
      if (!rect) return false;
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isVisible() {
      return this._isVisible;
    }

    get mainSlot() {
      return this._mainSlot;
    }

    get materialSlot() {
      return this._materialSlot;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      this._mainSlot = null;
      this._materialSlot = null;
      this._eligibleWeapons = [];
      this._evolutionResult = null;
      this._weaponGridRects = [];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.EvolutionPopup = EvolutionPopup;
})(window.VampireSurvivors.UI);
