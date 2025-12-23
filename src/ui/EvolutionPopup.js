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
  var i18n = window.VampireSurvivors.Core.i18n;
  var UpgradeTooltip = window.VampireSurvivors.UI.UpgradeTooltip;

  // ============================================
  // Constants
  // ============================================
  var POPUP_WIDTH = 560;
  var POPUP_HEIGHT = 460;

  // Blue theme colors
  var OVERLAY_COLOR = 'rgba(20, 25, 40, 0.85)';
  var POPUP_BG = '#1F2330';
  var POPUP_BG_TOP = '#2D3545';
  var POPUP_BG_BOTTOM = '#1F2330';
  var POPUP_BORDER = '#4A5580';
  var TITLE_COLOR = '#F5F0E1';
  var TEXT_COLOR = '#E8E2D0';
  var DESC_COLOR = '#A8B4C8';
  var SLOT_BG = '#3D4560';
  var SLOT_BORDER = '#5A6D90';
  var SLOT_EMPTY_COLOR = '#2D3545';
  var SLOT_HOVER_BORDER = '#7C90C0';
  var SLOT_SELECTED_BORDER = '#D4A84B';
  var RESULT_SLOT_BORDER = '#5EB8B8';
  var BUTTON_BG = '#8B6B9B';
  var BUTTON_HOVER_BG = '#9B7BAB';
  var BUTTON_DISABLED_BG = '#4A5570';
  var CLOSE_BUTTON_BG = '#5A6D90';
  var CLOSE_BUTTON_HOVER = '#6B7BA0';
  var UNKNOWN_RESULT_COLOR = '#D4A84B';
  var FORMULA_COLOR = '#A8B4C8';

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

    // Eligible weapons (max level weapons from all tiers)
    _eligibleWeapons = [];
    _selectedTier = 0;  // 0 = no tier selected
    _tierCounts = {};   // Track count of weapons per tier

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

    // Tooltip
    _tooltip = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._weaponGridRects = [];
      this._tooltip = new UpgradeTooltip();
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

      // Popup background with gradient
      var gradient = ctx.createLinearGradient(this._x, this._y, this._x, this._y + POPUP_HEIGHT);
      gradient.addColorStop(0, POPUP_BG_TOP);
      gradient.addColorStop(1, POPUP_BG_BOTTOM);
      ctx.fillStyle = gradient;
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
      ctx.fillText(i18n.t('evolution.title'), this._x + POPUP_WIDTH / 2, this._y + 35);

      // Tier indicator - only show when main weapon selected
      if (this._mainSlot && this._selectedTier > 0) {
        var tierConfig = WeaponTierData.getTierConfig(this._selectedTier);
        var nextTierConfig = WeaponTierData.getTierConfig(this._selectedTier + 1);
        ctx.font = '14px Arial';
        ctx.fillStyle = tierConfig.color;
        var tierText = 'Tier ' + tierConfig.icon + ' (' + tierConfig.name + ')';
        if (nextTierConfig) {
          tierText += ' → Tier ' + nextTierConfig.icon + ' (' + nextTierConfig.name + ')';
        }
        ctx.fillText(tierText, this._x + POPUP_WIDTH / 2, this._y + 60);
      } else {
        // Show instruction when no main selected
        ctx.font = '14px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.fillText(i18n.t('evolution.selectMain') || 'Select a main weapon', this._x + POPUP_WIDTH / 2, this._y + 60);
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
      ctx.fillText(i18n.t('evolution.instruction'), this._x + POPUP_WIDTH / 2, this._y + POPUP_HEIGHT - 15);

      // Render tooltip on top
      this._tooltip.render(ctx, this._canvasWidth, this._canvasHeight);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _findEligibleWeapons(options) {
      this._eligibleWeapons = [];
      this._selectedTier = 0;  // No tier selected initially
      this._tierCounts = {};   // Track weapon counts per tier

      if (!this._player) return;

      // Get weapons from player's WeaponSlot component
      var weaponSlot = this._player.weaponSlot;
      if (!weaponSlot) return;

      var weapons = weaponSlot.weapons;

      // Collect ALL max-level weapons (all tiers)
      for (var i = 0; i < weapons.length; i++) {
        var weapon = weapons[i];
        if (!weapon) continue;

        // Must be at max level
        if (weapon.level < weapon.maxLevel) continue;

        // Must be below max tier
        if (weapon.tier >= weapon.maxTier) continue;

        // Add to eligible weapons (ALL tiers)
        this._eligibleWeapons.push(weapon);

        // Track tier counts
        var tier = weapon.tier;
        this._tierCounts[tier] = (this._tierCounts[tier] || 0) + 1;
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

      // Hide tooltip by default
      this._tooltip.hide();

      // Check main slot
      if (this._isPointInRect(mouseX, mouseY, this._mainSlotRect)) {
        this._hoveredSlot = 'main';
        // Show tooltip for main slot weapon
        if (this._mainSlot) {
          var content = UpgradeTooltip.buildWeaponDetailContent(this._mainSlot);
          if (content) {
            this._tooltip.show(content, mouseX + 15, mouseY + 15);
          }
        }
        return;
      }

      // Check material slot
      if (this._isPointInRect(mouseX, mouseY, this._materialSlotRect)) {
        this._hoveredSlot = 'material';
        // Show tooltip for material slot weapon
        if (this._materialSlot) {
          var content = UpgradeTooltip.buildWeaponDetailContent(this._materialSlot);
          if (content) {
            this._tooltip.show(content, mouseX + 15, mouseY + 15);
          }
        }
        return;
      }

      // Check weapon grid
      for (var i = 0; i < this._weaponGridRects.length; i++) {
        if (i < this._eligibleWeapons.length && this._isPointInRect(mouseX, mouseY, this._weaponGridRects[i])) {
          var weapon = this._eligibleWeapons[i];
          // Show tooltip for any weapon in grid (even if not selectable)
          var content = UpgradeTooltip.buildWeaponDetailContent(weapon);
          if (content) {
            this._tooltip.show(content, mouseX + 15, mouseY + 15);
          }
          // Only set hover index if weapon is selectable
          if (this._isWeaponSelectable(weapon)) {
            this._hoveredWeaponIndex = i;
          }
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
        if (this._mainSlot && this._materialSlot && this._canEvolve()) {
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
          this._materialSlot = null;  // Also clear material when deselecting main
          this._selectedTier = 0;     // Reset tier
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

          // Check if weapon can be used as material (core chain weapons cannot)
          var isCoreChain = WeaponEvolutionData.isPartOfCoreEvolutionChain(weapon.id);

          // Fill main slot first, then material
          if (!this._mainSlot) {
            // Check if this weapon's tier has at least 2 weapons
            if ((this._tierCounts[weapon.tier] || 0) < 2) {
              return null;  // Can't evolve with single weapon in tier
            }
            this._mainSlot = weapon;
            this._selectedTier = weapon.tier;  // Set tier on main selection
          } else if (!this._materialSlot) {
            // Allow different tier if recipe exists
            if (weapon.tier !== this._selectedTier) {
              // Check if recipe exists for this combination
              if (!WeaponEvolutionData.isKnownRecipe(this._mainSlot.id, weapon.id)) {
                return null;  // Reject if no recipe
              }
            }
            // Core chain weapons cannot be used as material
            if (isCoreChain) {
              return null; // Reject selection
            }
            this._materialSlot = weapon;
          } else {
            // Both filled, replace material (allow if recipe exists or same tier)
            if (weapon.tier !== this._selectedTier) {
              // Check if recipe exists for this combination
              if (!WeaponEvolutionData.isKnownRecipe(this._mainSlot.id, weapon.id)) {
                return null;  // Reject if no recipe
              }
            }
            if (isCoreChain) {
              return null; // Reject selection
            }
            this._materialSlot = weapon;
          }

          this._updateEvolutionPreview();
          return null;
        }
      }

      return null;
    }

    /**
     * Check if evolution can proceed
     * Core weapons require a known recipe
     */
    _canEvolve() {
      if (!this._mainSlot || !this._materialSlot) return false;

      // If main weapon is a core chain weapon, require a known recipe
      if (WeaponEvolutionData.isPartOfCoreEvolutionChain(this._mainSlot.id)) {
        return this._isKnownRecipe;
      }

      return true;
    }

    /**
     * Check if a weapon can be selected based on current state
     * @param {Weapon} weapon
     * @returns {boolean}
     */
    _isWeaponSelectable(weapon) {
      if (!weapon) return false;

      // If already selected in a slot, not selectable
      if (this._mainSlot === weapon || this._materialSlot === weapon) {
        return false;
      }

      // If no main selected, weapon is selectable if its tier has 2+ weapons
      if (!this._mainSlot) {
        return (this._tierCounts[weapon.tier] || 0) >= 2;
      }

      // Main is selected - check if selectable as material
      if (weapon.tier !== this._selectedTier) {
        // Allow if a known recipe exists
        if (!WeaponEvolutionData.isKnownRecipe(this._mainSlot.id, weapon.id)) {
          return false;
        }
      }

      // Core chain weapons cannot be used as material
      if (WeaponEvolutionData.isPartOfCoreEvolutionChain(weapon.id)) {
        return false;
      }

      return true;
    }

    _updateEvolutionPreview() {
      this._evolutionResult = null;
      this._isKnownRecipe = false;

      if (!this._mainSlot || !this._materialSlot) return;

      var mainId = this._mainSlot.id;
      var materialId = this._materialSlot.id;
      var isCoreChain = WeaponEvolutionData.isPartOfCoreEvolutionChain(mainId);

      // Check for known recipe
      var tierEvolution = WeaponEvolutionData.findTierEvolution(mainId, materialId, this._selectedTier);

      if (tierEvolution && tierEvolution.isKnown) {
        this._isKnownRecipe = true;
        this._evolutionResult = tierEvolution.weaponData;
      } else if (isCoreChain) {
        // Core chain weapon with no recipe - cannot evolve
        this._isKnownRecipe = false;
        this._evolutionResult = {
          name: i18n.t('evolution.recipeRequired'),
          tier: this._selectedTier + 1,
          isRandom: false,
          requiresRecipe: true,
        };
      } else {
        // Unknown recipe - will be random (only for non-core weapons)
        this._isKnownRecipe = false;
        var nextTierConfig = WeaponTierData.getTierConfig(this._selectedTier + 1);
        this._evolutionResult = {
          name: i18n.t('evolution.random') + ' ' + (nextTierConfig ? nextTierConfig.name : ''),
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
      ctx.fillText(i18n.t('evolution.main'), rect.x + rect.width / 2, rect.y - 5);

      // Content
      if (isFilled) {
        this._renderWeaponInSlot(ctx, rect, this._mainSlot);
      } else {
        // Empty slot text
        ctx.font = '12px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i18n.t('evolution.select'), rect.x + rect.width / 2, rect.y + rect.height / 2);
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
      ctx.fillText(i18n.t('evolution.material'), rect.x + rect.width / 2, rect.y - 5);

      // Content
      if (isFilled) {
        this._renderWeaponInSlot(ctx, rect, this._materialSlot);
      } else {
        // Empty slot text
        ctx.font = '12px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i18n.t('evolution.select'), rect.x + rect.width / 2, rect.y + rect.height / 2);
      }
    }

    _renderWeaponInSlot(ctx, rect, weapon) {
      var centerX = rect.x + rect.width / 2;
      var centerY = rect.y + rect.height / 2 - 8;

      // Weapon icon
      var weaponData = weapon.data || weapon;
      var assetLoader = window.VampireSurvivors.Core.assetLoader;
      var imageId = weaponData.imageId;
      if (imageId && assetLoader && assetLoader.hasImage(imageId)) {
        var img = assetLoader.getImage(imageId);
        var imgSize = SLOT_ICON_SIZE * 0.7;
        ctx.drawImage(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);
      } else {
        // Fallback to colored circle
        var color = weaponData.color || '#FFFFFF';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, SLOT_ICON_SIZE / 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Weapon name
      ctx.font = '10px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      var name = i18n.tw(weapon.id, weapon.name || weapon.id);
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
      ctx.fillText(i18n.t('evolution.result'), rect.x + rect.width / 2, rect.y - 5);

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
          var name = i18n.tw(resultData.id, resultData.name);
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
        } else if (this._evolutionResult && this._evolutionResult.requiresRecipe) {
          // Core weapon with no recipe - show X
          ctx.font = 'bold 40px Arial';
          ctx.fillStyle = '#E74C3C';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✕', centerX, centerY - 5);

          // Recipe required text
          ctx.font = '9px Arial';
          ctx.fillStyle = '#E74C3C';
          ctx.textBaseline = 'top';
          ctx.fillText(i18n.t('evolution.recipeRequired'), centerX, centerY + 26);
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
          ctx.fillText(i18n.t('evolution.random'), centerX, centerY + 20);
          ctx.fillText(nextTierConfig.name, centerX, centerY + 32);
        }
      } else {
        // Empty - waiting for selection
        ctx.font = '11px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i18n.t('evolution.selectWeapons'), centerX, centerY);
      }
    }

    _renderWeaponGrid(ctx) {
      // Grid title
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(i18n.t('evolution.eligible'), this._x + POPUP_WIDTH / 2, this._y + 245);

      for (var i = 0; i < this._weaponGridRects.length; i++) {
        var rect = this._weaponGridRects[i];
        var weapon = i < this._eligibleWeapons.length ? this._eligibleWeapons[i] : null;
        var isHovered = this._hoveredWeaponIndex === i;
        var isSelected = weapon && (this._mainSlot === weapon || this._materialSlot === weapon);
        var isSelectable = weapon && this._isWeaponSelectable(weapon);

        // Slot background with selectability
        if (weapon) {
          ctx.fillStyle = isSelectable || isSelected ? SLOT_BG : SLOT_EMPTY_COLOR;
          ctx.globalAlpha = isSelectable || isSelected ? 1.0 : 0.4;
        } else {
          ctx.fillStyle = SLOT_EMPTY_COLOR;
          ctx.globalAlpha = 0.3;
        }
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.globalAlpha = 1.0;

        // Border
        if (isSelected) {
          ctx.strokeStyle = SLOT_SELECTED_BORDER;
          ctx.lineWidth = 3;
        } else if (isHovered && isSelectable) {
          ctx.strokeStyle = SLOT_HOVER_BORDER;
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = SLOT_BORDER;
          ctx.lineWidth = 1;
        }
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // Weapon content
        if (weapon) {
          this._renderWeaponInGridSlot(ctx, rect, weapon, isSelected, isSelectable);
        }
      }
    }

    _renderWeaponInGridSlot(ctx, rect, weapon, isSelected, isSelectable) {
      var centerX = rect.x + rect.width / 2;
      var centerY = rect.y + rect.height / 2 - 5;
      var isCoreChain = WeaponEvolutionData.isPartOfCoreEvolutionChain(weapon.id);

      // Dim if not selectable or selected
      if (!isSelectable && !isSelected) {
        ctx.globalAlpha = 0.4;
      } else if (isSelected) {
        ctx.globalAlpha = 0.5;
      }

      // Weapon icon
      var weaponData = weapon.data || weapon;
      var assetLoader = window.VampireSurvivors.Core.assetLoader;
      var imageId = weaponData.imageId;
      if (imageId && assetLoader && assetLoader.hasImage(imageId)) {
        var img = assetLoader.getImage(imageId);
        var imgSize = 26;
        ctx.drawImage(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);
      } else {
        // Fallback to colored circle
        var color = weaponData.color || '#FFFFFF';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Weapon name
      ctx.font = '9px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      var name = i18n.tw(weapon.id, weapon.name || weapon.id);
      if (name.length > 8) {
        name = name.substring(0, 7) + '..';
      }
      ctx.fillText(name, centerX, centerY + 18);

      ctx.globalAlpha = 1.0;

      // Tier badge - show tier icon for each weapon
      var tierConfig = WeaponTierData.getTierConfig(weapon.tier);
      if (tierConfig) {
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = tierConfig.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(tierConfig.icon, rect.x + 2, rect.y + 2);
      }

      // Core chain weapon indicator (star badge) - shows this weapon can only be MAIN
      if (isCoreChain && !isSelected) {
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#F1C40F';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('★', rect.x + rect.width - 2, rect.y + 2);
      }

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
      var canEvolve = this._canEvolve();

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
      ctx.fillText(i18n.t('evolution.evolve'), evolveRect.x + evolveRect.width / 2, evolveRect.y + evolveRect.height / 2);

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
      ctx.fillText(i18n.t('evolution.close'), closeRect.x + closeRect.width / 2, closeRect.y + closeRect.height / 2);
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
