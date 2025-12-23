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
  var EvolutionPopup = UI.EvolutionPopup;
  var TechUpgradePanel = UI.TechUpgradePanel;
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants
  // ============================================
  var OVERLAY_COLOR = 'rgba(25, 30, 45, 0.75)';
  var SCREEN_PADDING = 40;
  var LEFT_PANEL_RATIO = 0.35; // Left panel takes 35% of width

  // Blue theme colors
  var COMBINED_BG_TOP = '#3D4560';
  var COMBINED_BG_BOTTOM = '#2D3545';
  var COMBINED_BORDER = '#4A5580';
  var DIVIDER_COLOR = '#4A5580';

  // Gold display colors
  var GOLD_COLOR = '#F0C040';
  var GOLD_BORDER_COLOR = '#C9A227';

  // Evolution button
  var EVOLVE_BUTTON_WIDTH = 160;
  var EVOLVE_BUTTON_HEIGHT = 36;
  var EVOLVE_BUTTON_COLOR = '#8B6B9B';
  var EVOLVE_BUTTON_HOVER_COLOR = '#9B7BAB';
  var EVOLVE_BUTTON_TEXT_COLOR = '#F5F0E1';

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
    _techUpgradePanel = null;
    _weaponCardPanel = null;
    _weaponGridPanel = null;
    _tooltip = null;
    _evolutionPopup = null;

    // Weapon options
    _weaponOptions = [];

    // Evolution state
    _evolutionState = 'normal';
    _selectedMainWeapon = null;
    _evolutionEligibility = null; // { canEvolve: boolean, eligibleTiers: { [tier]: Weapon[] } }

    // Evolution button
    _evolveButtonRect = null;
    _isEvolveButtonHovered = false;

    // Pending level-ups count
    _pendingLevelUps = 0;

    // Combined upgrade area bounds
    _combinedAreaRect = null;
    _dividerY = 0;

    // Mouse state
    _mouseX = 0;
    _mouseY = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._statPanel = new StatUpgradePanel();
      this._techUpgradePanel = TechUpgradePanel ? new TechUpgradePanel() : null;
      this._weaponCardPanel = new WeaponCardPanel();
      this._weaponGridPanel = new WeaponGridPanel();
      this._tooltip = new UpgradeTooltip();
      this._evolutionPopup = new EvolutionPopup();
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
     * @param {Object} [evolutionEligibility] - Optional { canEvolve: boolean, eligibleTiers: {} }
     * @param {number} [pendingLevelUps] - Optional pending level-ups count
     */
    show(player, weaponOptions, canvasWidth, canvasHeight, evolutionInfo, evolutionEligibility, pendingLevelUps) {
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

      // Set evolution eligibility
      this._evolutionEligibility = evolutionEligibility || null;

      // Set pending level-ups count
      this._pendingLevelUps = pendingLevelUps || 0;

      // Lazy initialization of TechUpgradePanel (in case it wasn't available at constructor time)
      if (!this._techUpgradePanel) {
        var TechUpgradePanelClass = TechUpgradePanel || window.VampireSurvivors.UI.TechUpgradePanel;
        if (TechUpgradePanelClass) {
          this._techUpgradePanel = new TechUpgradePanelClass();
        }
      }

      // Set player on panels
      this._statPanel.setPlayer(player);
      if (this._techUpgradePanel) {
        this._techUpgradePanel.setPlayer(player);
      }
      this._weaponGridPanel.setPlayer(player);

      // Set weapon options with evolution state
      this._weaponCardPanel.setOptions(this._weaponOptions, this._evolutionState, this._selectedMainWeapon, this._pendingLevelUps);

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
      this._evolutionEligibility = null;
      this._isEvolveButtonHovered = false;
      this._tooltip.hide();
      if (this._evolutionPopup) {
        this._evolutionPopup.hide();
      }
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

      // If evolution popup is open, delegate to it
      if (this._evolutionPopup && this._evolutionPopup.isVisible) {
        var popupResult = this._evolutionPopup.handleInput(input);
        if (popupResult) {
          if (popupResult.action === 'close') {
            this._evolutionPopup.hide();
            return null;
          } else if (popupResult.action === 'evolve') {
            return {
              type: 'evolution',
              result: popupResult,
              closesScreen: true,
            };
          }
        }
        return null;
      }

      // Handle hover for tooltips and evolve button
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

      // Gold display at top-right
      this._renderGoldDisplay(ctx);

      // Render panels
      this._statPanel.render(ctx);
      this._weaponCardPanel.render(ctx);

      // Render combined upgrade area background
      this._renderCombinedUpgradeArea(ctx);

      // Render weapon grid and tech panels (inside combined area)
      this._weaponGridPanel.render(ctx);
      if (this._techUpgradePanel) {
        this._techUpgradePanel.render(ctx);
      }

      // Render evolution button if eligible
      if (this._evolutionEligibility && this._evolutionEligibility.canEvolve) {
        this._renderEvolutionButton(ctx);
      }

      // Render tooltip last (on top)
      this._tooltip.render(ctx, this._canvasWidth, this._canvasHeight);

      // Render evolution popup on top of everything
      if (this._evolutionPopup && this._evolutionPopup.isVisible) {
        this._evolutionPopup.render(ctx);
      }
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

      // Left panel: Stats only (full height)
      this._statPanel.setBounds(SCREEN_PADDING, SCREEN_PADDING, leftWidth, totalHeight);

      // Right panel split: cards (55%), combined upgrades (45%)
      var weaponCardHeight = Math.floor(totalHeight * 0.55);
      var combinedHeight = totalHeight - weaponCardHeight - 10;

      var rightX = SCREEN_PADDING + leftWidth + 10;
      var combinedY = SCREEN_PADDING + weaponCardHeight + 10;

      // Top-right panel (weapon selection) - taller now
      this._weaponCardPanel.setBounds(rightX, SCREEN_PADDING, rightWidth, weaponCardHeight);

      // Combined upgrade area bounds
      this._combinedAreaRect = {
        x: rightX,
        y: combinedY,
        width: rightWidth,
        height: combinedHeight,
      };

      // Split combined area: weapons (65%), tech (35%)
      var weaponGridHeight = Math.floor(combinedHeight * 0.65);
      var techPanelHeight = combinedHeight - weaponGridHeight;

      // Weapon grid inside combined area (no background)
      this._weaponGridPanel.setBounds(rightX, combinedY, rightWidth, weaponGridHeight);
      if (this._weaponGridPanel.setEmbedded) {
        this._weaponGridPanel.setEmbedded(true);
      }

      // Divider Y position
      this._dividerY = combinedY + weaponGridHeight;

      // Tech upgrades inside combined area (no background)
      if (this._techUpgradePanel) {
        this._techUpgradePanel.setBounds(rightX, this._dividerY, rightWidth, techPanelHeight);
        if (this._techUpgradePanel.setEmbedded) {
          this._techUpgradePanel.setEmbedded(true);
        }
      }

      // Evolution button (top-right corner, above weapon card panel)
      this._evolveButtonRect = {
        x: this._canvasWidth - SCREEN_PADDING - EVOLVE_BUTTON_WIDTH,
        y: SCREEN_PADDING - EVOLVE_BUTTON_HEIGHT - 5,
        width: EVOLVE_BUTTON_WIDTH,
        height: EVOLVE_BUTTON_HEIGHT,
      };
    }

    _renderCombinedUpgradeArea(ctx) {
      var rect = this._combinedAreaRect;
      if (!rect) return;

      // Background gradient
      var gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
      gradient.addColorStop(0, COMBINED_BG_TOP);
      gradient.addColorStop(1, COMBINED_BG_BOTTOM);
      ctx.fillStyle = gradient;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Border
      ctx.strokeStyle = COMBINED_BORDER;
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Divider line between weapon grid and tech panel
      ctx.strokeStyle = DIVIDER_COLOR;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rect.x + 15, this._dividerY);
      ctx.lineTo(rect.x + rect.width - 15, this._dividerY);
      ctx.stroke();
    }

    _handleHover() {
      var tooltipContent = null;

      // Check evolution button hover
      this._isEvolveButtonHovered = false;
      if (this._evolutionEligibility && this._evolutionEligibility.canEvolve && this._evolveButtonRect) {
        if (this._isPointInRect(this._mouseX, this._mouseY, this._evolveButtonRect)) {
          this._isEvolveButtonHovered = true;
        }
      }

      // Check stat panel hover
      var statTooltip = this._statPanel.handleMouseMove(this._mouseX, this._mouseY);
      if (statTooltip) {
        tooltipContent = statTooltip;
      }

      // Check tech upgrade panel hover
      if (this._techUpgradePanel) {
        var techTooltip = this._techUpgradePanel.handleMouseMove(this._mouseX, this._mouseY);
        if (techTooltip) {
          tooltipContent = techTooltip;
        }
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
      // Check evolution button click
      if (this._evolutionEligibility && this._evolutionEligibility.canEvolve && this._evolveButtonRect) {
        if (this._isPointInRect(this._mouseX, this._mouseY, this._evolveButtonRect)) {
          // Open evolution popup
          this._evolutionPopup.show(this._player, this._canvasWidth, this._canvasHeight, { eligibleTiers: this._evolutionEligibility.eligibleTiers });
          return null;
        }
      }

      // Check stat panel click (gold upgrade)
      var statResult = this._statPanel.handleClick(this._mouseX, this._mouseY);
      if (statResult) {
        return {
          type: 'stat_upgrade',
          result: statResult,
          closesScreen: false,
        };
      }

      // Check tech upgrade panel click (gold tech upgrade)
      if (this._techUpgradePanel) {
        var techResult = this._techUpgradePanel.handleClick(this._mouseX, this._mouseY);
        if (techResult) {
          return {
            type: 'tech_upgrade',
            result: techResult,
            closesScreen: false,
          };
        }
      }

      // Check weapon card panel click (weapon selection)
      var weaponCardResult = this._weaponCardPanel.handleClick(this._mouseX, this._mouseY);
      if (weaponCardResult) {
        // Determine if this selection should close the screen
        // evolution_main and evolution_cancel don't close - they change state
        var shouldClose = weaponCardResult.type !== 'evolution_main' && weaponCardResult.type !== 'evolution_cancel';

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

    _renderGoldDisplay(ctx) {
      if (!this._player || !this._player.gold) return;

      var goldAmount = this._player.gold.amount || 0;
      var goldX = SCREEN_PADDING + 10;
      var goldY = 15;

      // Gold coin icon (small circle)
      ctx.fillStyle = GOLD_COLOR;
      ctx.beginPath();
      ctx.arc(goldX + 8, goldY + 8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = GOLD_BORDER_COLOR;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gold amount
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = GOLD_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(goldAmount.toLocaleString(), goldX + 22, goldY);
    }

    _renderEvolutionButton(ctx) {
      var rect = this._evolveButtonRect;
      if (!rect) return;

      // Button background
      ctx.fillStyle = this._isEvolveButtonHovered ? EVOLVE_BUTTON_HOVER_COLOR : EVOLVE_BUTTON_COLOR;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Button border
      ctx.strokeStyle = '#8E44AD';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Button text
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = EVOLVE_BUTTON_TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.t('levelUp.evolve'), rect.x + rect.width / 2, rect.y + rect.height / 2);

      // Pulse effect indicator (small star)
      var pulseAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 300);
      ctx.globalAlpha = pulseAlpha;
      ctx.fillStyle = '#F1C40F';
      ctx.beginPath();
      var starX = rect.x + 15;
      var starY = rect.y + rect.height / 2;
      this._drawStar(ctx, starX, starY, 5, 6, 3);
      ctx.fill();
      ctx.globalAlpha = 1.0;
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
      if (!rect) return false;
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
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
      if (this._techUpgradePanel) {
        this._techUpgradePanel = null;
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
      if (this._evolutionPopup) {
        this._evolutionPopup.dispose();
        this._evolutionPopup = null;
      }
      this._player = null;
      this._weaponOptions = [];
      this._evolutionEligibility = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.LevelUpScreen = LevelUpScreen;
})(window.VampireSurvivors.UI);
