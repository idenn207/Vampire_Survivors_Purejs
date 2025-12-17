/**
 * @fileoverview Level-up screen - main container with 3 sections for upgrades
 * @module UI/LevelUpScreen
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var StatUpgradePanel = UI.StatUpgradePanel;
  var WeaponCardPanel = UI.WeaponCardPanel;
  var WeaponGridPanel = UI.WeaponGridPanel;
  var UpgradeTooltip = UI.UpgradeTooltip;

  // ============================================
  // Constants
  // ============================================
  var OVERLAY_COLOR = 'rgba(0, 0, 0, 0.75)';
  var SCREEN_PADDING = 40;
  var LEFT_PANEL_RATIO = 0.35; // Left panel takes 35% of width
  var TOP_RIGHT_RATIO = 0.55; // Top-right takes 55% of right section height

  // ============================================
  // Class Definition
  // ============================================
  class LevelUpScreen {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _player = null;
    _canvasWidth = 800;
    _canvasHeight = 600;

    // Sub-panels
    _statPanel = null;
    _weaponCardPanel = null;
    _weaponGridPanel = null;
    _tooltip = null;

    // Weapon options
    _weaponOptions = [];

    // Evolution state
    _evolutionState = 'normal';
    _selectedMainWeapon = null;

    // Mouse state
    _mouseX = 0;
    _mouseY = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._statPanel = new StatUpgradePanel();
      this._weaponCardPanel = new WeaponCardPanel();
      this._weaponGridPanel = new WeaponGridPanel();
      this._tooltip = new UpgradeTooltip();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show the level-up screen
     * @param {Entity} player
     * @param {Array<Object>} weaponOptions
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     * @param {Object} [evolutionInfo] - Optional evolution state info
     */
    show(player, weaponOptions, canvasWidth, canvasHeight, evolutionInfo) {
      this._isVisible = true;
      this._player = player;
      this._weaponOptions = weaponOptions || [];
      this._canvasWidth = canvasWidth || 800;
      this._canvasHeight = canvasHeight || 600;

      // Set evolution state
      if (evolutionInfo) {
        this._evolutionState = evolutionInfo.evolutionState || 'normal';
        this._selectedMainWeapon = evolutionInfo.selectedMainWeapon || null;
      } else {
        this._evolutionState = 'normal';
        this._selectedMainWeapon = null;
      }

      // Set player on panels
      this._statPanel.setPlayer(player);
      this._weaponGridPanel.setPlayer(player);

      // Set weapon options with evolution state
      this._weaponCardPanel.setOptions(this._weaponOptions, this._evolutionState, this._selectedMainWeapon);

      // Calculate and set panel bounds
      this._calculatePanelBounds();
    }

    /**
     * Hide the screen
     */
    hide() {
      this._isVisible = false;
      this._player = null;
      this._weaponOptions = [];
      this._evolutionState = 'normal';
      this._selectedMainWeapon = null;
      this._tooltip.hide();
    }

    /**
     * Handle input
     * @param {Object} input - Input manager
     * @returns {Object|null} Result of any action taken
     */
    handleInput(input) {
      if (!this._isVisible) return null;

      // Get mouse position
      var mousePos = input.mousePosition;
      this._mouseX = mousePos.x;
      this._mouseY = mousePos.y;

      // Handle hover for tooltips
      this._handleHover();

      // Handle click
      if (input.isMousePressed(0)) {
        return this._handleClick();
      }

      return null;
    }

    /**
     * Render the screen
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._isVisible) return;

      // Dark overlay
      ctx.fillStyle = OVERLAY_COLOR;
      ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

      // Render panels
      this._statPanel.render(ctx);
      this._weaponCardPanel.render(ctx);
      this._weaponGridPanel.render(ctx);

      // Render tooltip last (on top)
      this._tooltip.render(ctx, this._canvasWidth, this._canvasHeight);
    }

    /**
     * Update weapon options (called when options change)
     * @param {Array<Object>} options
     */
    updateWeaponOptions(options) {
      this._weaponOptions = options || [];
      this._weaponCardPanel.setOptions(this._weaponOptions);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _calculatePanelBounds() {
      var totalWidth = this._canvasWidth - SCREEN_PADDING * 2;
      var totalHeight = this._canvasHeight - SCREEN_PADDING * 2;

      var leftWidth = Math.floor(totalWidth * LEFT_PANEL_RATIO);
      var rightWidth = totalWidth - leftWidth - 10; // 10px gap

      var topRightHeight = Math.floor(totalHeight * TOP_RIGHT_RATIO);
      var bottomRightHeight = totalHeight - topRightHeight - 10; // 10px gap

      // Left panel (stats)
      this._statPanel.setBounds(
        SCREEN_PADDING,
        SCREEN_PADDING,
        leftWidth,
        totalHeight
      );

      // Top-right panel (weapon selection)
      this._weaponCardPanel.setBounds(
        SCREEN_PADDING + leftWidth + 10,
        SCREEN_PADDING,
        rightWidth,
        topRightHeight
      );

      // Bottom-right panel (weapon grid)
      this._weaponGridPanel.setBounds(
        SCREEN_PADDING + leftWidth + 10,
        SCREEN_PADDING + topRightHeight + 10,
        rightWidth,
        bottomRightHeight
      );
    }

    _handleHover() {
      var tooltipContent = null;

      // Check stat panel hover
      var statTooltip = this._statPanel.handleMouseMove(this._mouseX, this._mouseY);
      if (statTooltip) {
        tooltipContent = statTooltip;
      }

      // Check weapon card panel hover
      var weaponCardTooltip = this._weaponCardPanel.handleMouseMove(this._mouseX, this._mouseY);
      if (weaponCardTooltip) {
        tooltipContent = weaponCardTooltip;
      }

      // Check weapon grid panel hover
      var weaponGridTooltip = this._weaponGridPanel.handleMouseMove(this._mouseX, this._mouseY);
      if (weaponGridTooltip) {
        tooltipContent = weaponGridTooltip;
      }

      // Show or hide tooltip
      if (tooltipContent) {
        this._tooltip.show(tooltipContent, this._mouseX + 15, this._mouseY + 15);
      } else {
        this._tooltip.hide();
      }
    }

    _handleClick() {
      // Check stat panel click (gold upgrade)
      var statResult = this._statPanel.handleClick(this._mouseX, this._mouseY);
      if (statResult) {
        return {
          type: 'stat_upgrade',
          result: statResult,
          closesScreen: false,
        };
      }

      // Check weapon card panel click (weapon selection)
      var weaponCardResult = this._weaponCardPanel.handleClick(this._mouseX, this._mouseY);
      if (weaponCardResult) {
        // Determine if this selection should close the screen
        // evolution_main and evolution_cancel don't close - they change state
        var shouldClose =
          weaponCardResult.type !== 'evolution_main' && weaponCardResult.type !== 'evolution_cancel';

        return {
          type: 'weapon_selection',
          result: weaponCardResult,
          closesScreen: shouldClose,
        };
      }

      // Check weapon grid panel click (gold weapon upgrade)
      var weaponGridResult = this._weaponGridPanel.handleClick(this._mouseX, this._mouseY);
      if (weaponGridResult) {
        return {
          type: 'weapon_upgrade',
          result: weaponGridResult,
          closesScreen: false,
        };
      }

      return null;
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
      if (this._statPanel) {
        this._statPanel.dispose();
        this._statPanel = null;
      }
      if (this._weaponCardPanel) {
        this._weaponCardPanel.dispose();
        this._weaponCardPanel = null;
      }
      if (this._weaponGridPanel) {
        this._weaponGridPanel.dispose();
        this._weaponGridPanel = null;
      }
      if (this._tooltip) {
        this._tooltip.dispose();
        this._tooltip = null;
      }
      this._player = null;
      this._weaponOptions = [];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.LevelUpScreen = LevelUpScreen;
})(window.VampireSurvivors.UI);
