/**
 * @fileoverview EvolutionListPanel - reusable panel showing all evolution recipes by result tier
 * @module UI/EvolutionListPanel
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponTierData = window.VampireSurvivors.Data.WeaponTierData;
  var WeaponEvolutionData = window.VampireSurvivors.Data.WeaponEvolutionData;
  var ScrollBar = UI.ScrollBar;

  // ============================================
  // Constants
  // ============================================
  var BG_COLOR = '#1A2332';
  var BORDER_COLOR = '#3D566E';
  var TITLE_COLOR = '#FFFFFF';
  var TEXT_COLOR = '#ECF0F1';
  var DESC_COLOR = '#BDC3C7';
  var FORMULA_COLOR = '#BDC3C7';
  var TAB_BG = '#2C3E50';
  var TAB_ACTIVE_BG = '#34495E';
  var TAB_HOVER_BG = '#3D566E';

  // Dimensions
  var TAB_HEIGHT = 35;
  var TAB_GAP = 5;
  var ROW_HEIGHT = 60;
  var ICON_SIZE = 40;
  var ICON_GAP = 15;
  var SCROLLBAR_WIDTH = 14;
  var PADDING = 15;

  // Brightness
  var OWNED_BRIGHTNESS = 1.0;
  var UNOWNED_BRIGHTNESS = 0.4;

  // ============================================
  // Class Definition
  // ============================================
  class EvolutionListPanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _x = 0;
    _y = 0;
    _width = 400;
    _height = 400;
    _isVisible = false;
    _player = null;

    // Evolution data grouped by tier
    _evolutionsByTier = {};
    _selectedTier = 2;
    _availableTiers = [];

    // Owned weapon IDs
    _ownedWeaponIds = [];

    // Filter by weapon ID (shows only recipes involving this weapon)
    _filterWeaponId = null;
    _filterWeaponName = null;

    // Scrolling
    _scrollBar = null;
    _viewportHeight = 0;
    _contentHeight = 0;

    // Tab rects
    _tabRects = [];

    // Hover state
    _hoveredRow = -1;
    _hoveredWeaponInRow = null; // 'result', 'main', or 'material'

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._scrollBar = new ScrollBar();
      this._evolutionsByTier = {};
      this._tabRects = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Set player reference for checking owned weapons
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
      this._updateOwnedWeapons();
    }

    /**
     * Set weapon filter - shows only recipes involving this weapon
     * @param {string|null} weaponId - Weapon ID to filter by, or null to clear filter
     * @param {string|null} weaponName - Weapon name for display
     */
    setFilterWeapon(weaponId, weaponName) {
      this._filterWeaponId = weaponId;
      this._filterWeaponName = weaponName;
    }

    /**
     * Clear the weapon filter
     */
    clearFilter() {
      this._filterWeaponId = null;
      this._filterWeaponName = null;
    }

    /**
     * Get the current filter weapon name
     * @returns {string|null}
     */
    getFilterWeaponName() {
      return this._filterWeaponName;
    }

    /**
     * Set panel position and dimensions
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
      this._updateLayout();
    }

    /**
     * Refresh evolution data
     */
    refresh() {
      this._updateOwnedWeapons();
      this._buildEvolutionData();
      this._updateLayout();
    }

    /**
     * Show the panel
     */
    show() {
      this._isVisible = true;
      this.refresh();
    }

    /**
     * Hide the panel
     */
    hide() {
      this._isVisible = false;
      this._scrollBar.resetScroll();
    }

    /**
     * Handle mouse move for hover and tooltip
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} Tooltip content or null
     */
    handleMouseMove(mouseX, mouseY) {
      if (!this._isVisible) return null;

      this._hoveredRow = -1;
      this._hoveredWeaponInRow = null;

      // Handle scrollbar
      this._scrollBar.handleMouseMove(mouseX, mouseY);

      // Check tab hover
      for (var i = 0; i < this._tabRects.length; i++) {
        if (this._isPointInRect(mouseX, mouseY, this._tabRects[i])) {
          return null; // Tab hover, no tooltip
        }
      }

      // Check row hover
      var evolutions = this._evolutionsByTier[this._selectedTier] || [];
      var scrollOffset = this._scrollBar.getScrollOffset();
      var listY = this._y + TAB_HEIGHT + PADDING;
      var listX = this._x + PADDING;

      for (var i = 0; i < evolutions.length; i++) {
        var rowY = listY + i * ROW_HEIGHT - scrollOffset;

        // Skip rows outside viewport
        if (rowY + ROW_HEIGHT < listY || rowY > this._y + this._height - PADDING) {
          continue;
        }

        // Check if mouse is in this row
        if (mouseY >= rowY && mouseY < rowY + ROW_HEIGHT && mouseX >= listX && mouseX < this._x + this._width - SCROLLBAR_WIDTH - PADDING) {
          this._hoveredRow = i;

          // Determine which icon is hovered
          var evolution = evolutions[i];
          var iconPositions = this._getIconPositions(listX, rowY);

          if (this._isPointInIcon(mouseX, mouseY, iconPositions.result)) {
            this._hoveredWeaponInRow = 'result';
            return this._getWeaponTooltip(evolution.result, evolution.resultData);
          } else if (this._isPointInIcon(mouseX, mouseY, iconPositions.main)) {
            this._hoveredWeaponInRow = 'main';
            return this._getWeaponTooltip(evolution.main, evolution.mainData);
          } else if (this._isPointInIcon(mouseX, mouseY, iconPositions.material)) {
            this._hoveredWeaponInRow = 'material';
            return this._getWeaponTooltip(evolution.material, evolution.materialData);
          }
        }
      }

      return null;
    }

    /**
     * Handle mouse down for tab and scrollbar clicks
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {boolean} True if handled
     */
    handleMouseDown(mouseX, mouseY) {
      if (!this._isVisible) return false;

      // Check scrollbar
      if (this._scrollBar.handleMouseDown(mouseX, mouseY)) {
        return true;
      }

      // Check tabs
      for (var i = 0; i < this._tabRects.length; i++) {
        if (this._isPointInRect(mouseX, mouseY, this._tabRects[i])) {
          this._selectedTier = this._availableTiers[i];
          this._scrollBar.resetScroll();
          this._updateLayout();
          return true;
        }
      }

      return false;
    }

    /**
     * Handle mouse up
     */
    handleMouseUp() {
      this._scrollBar.handleMouseUp();
    }

    /**
     * Render the panel
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._isVisible) return;

      // Background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(this._x, this._y, this._width, this._height);

      // Border
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = 2;
      ctx.strokeRect(this._x, this._y, this._width, this._height);

      // Render tabs
      this._renderTabs(ctx);

      // Render evolution list
      this._renderEvolutionList(ctx);

      // Render scrollbar
      this._scrollBar.render(ctx);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _updateOwnedWeapons() {
      this._ownedWeaponIds = [];

      if (!this._player) return;

      var weaponSlot = this._player.getComponent(window.VampireSurvivors.Components.WeaponSlot);
      if (!weaponSlot) return;

      var weapons = weaponSlot.getWeapons();
      for (var i = 0; i < weapons.length; i++) {
        this._ownedWeaponIds.push(weapons[i].id);
      }
    }

    _buildEvolutionData() {
      this._evolutionsByTier = {};
      this._availableTiers = [];

      var recipes = WeaponEvolutionData.getAllEvolutionRecipes();
      var Data = window.VampireSurvivors.Data;

      for (var key in recipes) {
        if (!recipes.hasOwnProperty(key)) continue;

        var recipe = recipes[key];
        var parts = key.split('+');
        var mainId = parts[0];
        var materialId = parts[1];
        var resultId = recipe.result;
        var resultTier = recipe.resultTier;

        // Apply filter if set
        if (this._filterWeaponId) {
          if (mainId !== this._filterWeaponId &&
              materialId !== this._filterWeaponId &&
              resultId !== this._filterWeaponId) {
            continue; // Skip recipes not involving the filtered weapon
          }
        }

        // Get weapon data (check regular weapons, core weapons, and evolved weapons)
        var mainData = Data.getWeaponData(mainId) || Data.getCoreWeaponData(mainId) || WeaponEvolutionData.getEvolvedWeaponData(mainId);
        var materialData = Data.getWeaponData(materialId) || Data.getCoreWeaponData(materialId) || WeaponEvolutionData.getEvolvedWeaponData(materialId);
        var resultData = WeaponEvolutionData.getEvolvedWeaponData(resultId);

        if (!resultData) continue;

        // Group by result tier
        if (!this._evolutionsByTier[resultTier]) {
          this._evolutionsByTier[resultTier] = [];
        }

        this._evolutionsByTier[resultTier].push({
          main: mainId,
          mainData: mainData,
          material: materialId,
          materialData: materialData,
          result: resultId,
          resultData: resultData,
          resultTier: resultTier,
        });
      }

      // Get available tiers (sorted)
      for (var tier in this._evolutionsByTier) {
        this._availableTiers.push(parseInt(tier));
      }
      this._availableTiers.sort(function (a, b) {
        return a - b;
      });

      // Select first available tier if current is not available
      if (this._availableTiers.length > 0 && this._availableTiers.indexOf(this._selectedTier) === -1) {
        this._selectedTier = this._availableTiers[0];
      }
    }

    _updateLayout() {
      // Calculate tab rects
      this._tabRects = [];
      var tabWidth = (this._width - PADDING * 2 - (this._availableTiers.length - 1) * TAB_GAP) / Math.max(1, this._availableTiers.length);

      for (var i = 0; i < this._availableTiers.length; i++) {
        this._tabRects.push({
          x: this._x + PADDING + i * (tabWidth + TAB_GAP),
          y: this._y + PADDING,
          width: tabWidth,
          height: TAB_HEIGHT - PADDING,
        });
      }

      // Calculate viewport and content heights
      this._viewportHeight = this._height - TAB_HEIGHT - PADDING * 2;
      var evolutions = this._evolutionsByTier[this._selectedTier] || [];
      this._contentHeight = evolutions.length * ROW_HEIGHT;

      // Update scrollbar
      var scrollbarX = this._x + this._width - SCROLLBAR_WIDTH - 5;
      var scrollbarY = this._y + TAB_HEIGHT + PADDING;
      this._scrollBar.setBounds(scrollbarX, scrollbarY, SCROLLBAR_WIDTH, this._viewportHeight);
      this._scrollBar.setContentHeight(this._contentHeight, this._viewportHeight);
    }

    _getIconPositions(listX, rowY) {
      var resultX = listX;
      var equalsX = resultX + ICON_SIZE + ICON_GAP;
      var mainX = equalsX + 20;
      var plusX = mainX + ICON_SIZE + ICON_GAP;
      var materialX = plusX + 20;

      return {
        result: { x: resultX, y: rowY + (ROW_HEIGHT - ICON_SIZE) / 2 },
        main: { x: mainX, y: rowY + (ROW_HEIGHT - ICON_SIZE) / 2 },
        material: { x: materialX, y: rowY + (ROW_HEIGHT - ICON_SIZE) / 2 },
      };
    }

    _isPointInIcon(mouseX, mouseY, iconPos) {
      return (
        mouseX >= iconPos.x &&
        mouseX <= iconPos.x + ICON_SIZE &&
        mouseY >= iconPos.y &&
        mouseY <= iconPos.y + ICON_SIZE
      );
    }

    _getWeaponTooltip(weaponId, weaponData) {
      if (!weaponData) return null;

      var isOwned = this._ownedWeaponIds.indexOf(weaponId) !== -1;
      var tierConfig = WeaponTierData.getTierConfig(weaponData.tier || 1);

      return {
        type: 'newWeapon',
        name: weaponData.name || weaponId,
        attackType: weaponData.attackType || 'Unknown',
        description: weaponData.description || '',
        isNew: !isOwned,
        level: 1,
        tier: weaponData.tier || 1,
        tierName: tierConfig.name,
        tierColor: tierConfig.color,
      };
    }

    _renderTabs(ctx) {
      for (var i = 0; i < this._tabRects.length; i++) {
        var rect = this._tabRects[i];
        var tier = this._availableTiers[i];
        var isSelected = tier === this._selectedTier;
        var tierConfig = WeaponTierData.getTierConfig(tier);

        // Tab background
        if (isSelected) {
          ctx.fillStyle = TAB_ACTIVE_BG;
        } else {
          ctx.fillStyle = TAB_BG;
        }
        this._roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 5);
        ctx.fill();

        // Tab border
        ctx.strokeStyle = isSelected ? tierConfig.color : BORDER_COLOR;
        ctx.lineWidth = isSelected ? 2 : 1;
        this._roundRect(ctx, rect.x, rect.y, rect.width, rect.height, 5);
        ctx.stroke();

        // Tab text
        ctx.font = isSelected ? 'bold 12px Arial' : '12px Arial';
        ctx.fillStyle = tierConfig.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tierConfig.name, rect.x + rect.width / 2, rect.y + rect.height / 2);
      }
    }

    _renderEvolutionList(ctx) {
      var evolutions = this._evolutionsByTier[this._selectedTier] || [];
      var scrollOffset = this._scrollBar.getScrollOffset();
      var listY = this._y + TAB_HEIGHT + PADDING;
      var listX = this._x + PADDING;
      var listWidth = this._width - PADDING * 2 - SCROLLBAR_WIDTH - 10;

      // Set clip region for scrolling
      ctx.save();
      ctx.beginPath();
      ctx.rect(this._x, listY, this._width, this._viewportHeight);
      ctx.clip();

      for (var i = 0; i < evolutions.length; i++) {
        var evolution = evolutions[i];
        var rowY = listY + i * ROW_HEIGHT - scrollOffset;

        // Skip rows outside viewport
        if (rowY + ROW_HEIGHT < listY || rowY > listY + this._viewportHeight) {
          continue;
        }

        var isHovered = this._hoveredRow === i;
        this._renderEvolutionRow(ctx, evolution, listX, rowY, listWidth, isHovered);
      }

      ctx.restore();

      // Empty state
      if (evolutions.length === 0) {
        ctx.font = '14px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No evolutions available', this._x + this._width / 2, listY + this._viewportHeight / 2);
      }
    }

    _renderEvolutionRow(ctx, evolution, x, y, width, isHovered) {
      // Row background on hover
      if (isHovered) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x, y, width, ROW_HEIGHT);
      }

      // Check ownership for brightness
      var resultOwned = this._ownedWeaponIds.indexOf(evolution.result) !== -1;
      var mainOwned = this._ownedWeaponIds.indexOf(evolution.main) !== -1;
      var materialOwned = this._ownedWeaponIds.indexOf(evolution.material) !== -1;

      var iconY = y + (ROW_HEIGHT - ICON_SIZE) / 2;
      var centerY = y + ROW_HEIGHT / 2;

      // Result icon
      var resultX = x;
      this._renderWeaponIcon(ctx, evolution.resultData, resultX, iconY, resultOwned ? OWNED_BRIGHTNESS : UNOWNED_BRIGHTNESS);

      // Equals sign
      var equalsX = resultX + ICON_SIZE + ICON_GAP;
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = FORMULA_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('=', equalsX, centerY);

      // Main weapon icon
      var mainX = equalsX + 20;
      this._renderWeaponIcon(ctx, evolution.mainData, mainX, iconY, mainOwned ? OWNED_BRIGHTNESS : UNOWNED_BRIGHTNESS);

      // Plus sign
      var plusX = mainX + ICON_SIZE + ICON_GAP;
      ctx.fillText('+', plusX, centerY);

      // Material weapon icon
      var materialX = plusX + 20;
      this._renderWeaponIcon(ctx, evolution.materialData, materialX, iconY, materialOwned ? OWNED_BRIGHTNESS : UNOWNED_BRIGHTNESS);

      // Result name
      var nameX = materialX + ICON_SIZE + ICON_GAP + 10;
      var tierConfig = WeaponTierData.getTierConfig(evolution.resultTier);
      ctx.font = '13px Arial';
      ctx.fillStyle = tierConfig.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = resultOwned ? 1.0 : 0.6;
      ctx.fillText(evolution.resultData.name || evolution.result, nameX, centerY);
      ctx.globalAlpha = 1.0;
    }

    _renderWeaponIcon(ctx, weaponData, x, y, brightness) {
      if (!weaponData) return;

      ctx.globalAlpha = brightness;

      // Icon background
      var tierConfig = WeaponTierData.getTierConfig(weaponData.tier || 1);
      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(x, y, ICON_SIZE, ICON_SIZE);

      // Icon border with tier color
      ctx.strokeStyle = tierConfig.borderColor || tierConfig.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, ICON_SIZE, ICON_SIZE);

      // Weapon color circle
      var color = weaponData.color || tierConfig.color || '#FFFFFF';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + ICON_SIZE / 2, y + ICON_SIZE / 2, ICON_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();

      // Tier badge
      ctx.font = 'bold 9px Arial';
      ctx.fillStyle = tierConfig.color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(tierConfig.icon, x + 2, y + 2);

      ctx.globalAlpha = 1.0;
    }

    _isPointInRect(x, y, rect) {
      if (!rect) return false;
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
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
      this._player = null;
      this._evolutionsByTier = {};
      this._ownedWeaponIds = [];
      if (this._scrollBar) {
        this._scrollBar.dispose();
        this._scrollBar = null;
      }
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.EvolutionListPanel = EvolutionListPanel;
})(window.VampireSurvivors.UI);
