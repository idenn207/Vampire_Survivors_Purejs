/**
 * @fileoverview TabScreen - main tab screen showing stats, weapons, tech, with navigation to sub-panels
 * @module UI/TabScreen
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponSlot = window.VampireSurvivors.Components.WeaponSlot;
  var PlayerStats = window.VampireSurvivors.Components.PlayerStats;
  var TechTree = window.VampireSurvivors.Components.TechTree;
  var Health = window.VampireSurvivors.Components.Health;
  var UpgradeTooltip = UI.UpgradeTooltip;
  var EvolutionListPanel = UI.EvolutionListPanel;
  var TechTreePanel = UI.TechTreePanel;
  var WeaponEvolutionData = window.VampireSurvivors.Data.WeaponEvolutionData;
  var StatUpgradeData = window.VampireSurvivors.Data.StatUpgradeData;
  var WeaponTierData = window.VampireSurvivors.Data.WeaponTierData;
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants
  // ============================================
  var OVERLAY_COLOR = 'rgba(0, 0, 0, 0.8)';
  var PANEL_BG = '#1A2332';
  var PANEL_BORDER = '#3D566E';
  var TITLE_COLOR = '#FFFFFF';
  var TEXT_COLOR = '#ECF0F1';
  var DESC_COLOR = '#BDC3C7';
  var BUTTON_BG = '#2C3E50';
  var BUTTON_HOVER_BG = '#34495E';
  var BUTTON_BORDER = '#4A6278';
  var CLOSE_BUTTON_BG = '#E74C3C';
  var CLOSE_BUTTON_HOVER = '#C0392B';

  // Layout
  var PANEL_PADDING = 20;
  var SECTION_GAP = 15;
  var BUTTON_HEIGHT = 40;
  var BUTTON_WIDTH = 140;

  // Stats section
  var STAT_ROW_HEIGHT = 22;
  var STAT_ICON_SIZE = 16;

  // Weapon section
  var WEAPON_ROW_HEIGHT = 40;
  var WEAPON_ICON_SIZE = 32;

  // Tech section
  var TECH_ROW_HEIGHT = 45;
  var TECH_ICON_SIZE = 32;

  // ============================================
  // Class Definition
  // ============================================
  class TabScreen {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _player = null;
    _game = null;
    _canvasWidth = 800;
    _canvasHeight = 600;

    // View state
    _currentView = 'main'; // 'main', 'evolution', 'techTree'

    // Sub-panels
    _evolutionPanel = null;
    _techTreePanel = null;
    _tooltip = null;

    // UI rects
    _panelRect = null;
    _evolutionButtonRect = null;
    _techTreeButtonRect = null;
    _closeButtonRect = null;
    _backButtonRect = null;

    // Hover state
    _hoveredButton = null;
    _hoveredWeaponIndex = -1;
    _hoveredTechIndex = -1;

    // Section bounds
    _statsSection = null;
    _weaponsSection = null;
    _techSection = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._evolutionPanel = new EvolutionListPanel();
      this._techTreePanel = new TechTreePanel();
      this._tooltip = new UpgradeTooltip();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show the tab screen
     * @param {Entity} player
     * @param {Object} game
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    show(player, game, canvasWidth, canvasHeight) {
      this._isVisible = true;
      this._player = player;
      this._game = game;
      this._canvasWidth = canvasWidth;
      this._canvasHeight = canvasHeight;
      this._currentView = 'main';

      // Setup sub-panels
      this._evolutionPanel.setPlayer(player);
      this._techTreePanel.setPlayer(player);

      this._calculateLayout();
    }

    /**
     * Hide the screen
     */
    hide() {
      this._isVisible = false;
      this._player = null;
      this._tooltip.hide();
      this._evolutionPanel.hide();
      this._techTreePanel.hide();
    }

    /**
     * Handle input
     * @param {Object} input
     * @returns {Object|null} Action result
     */
    handleInput(input) {
      if (!this._isVisible) return null;

      var mousePos = input.mousePosition;
      var mouseX = mousePos.x;
      var mouseY = mousePos.y;

      // Handle based on current view
      if (this._currentView === 'evolution') {
        return this._handleEvolutionViewInput(input, mouseX, mouseY);
      } else if (this._currentView === 'techTree') {
        return this._handleTechTreeViewInput(input, mouseX, mouseY);
      } else {
        return this._handleMainViewInput(input, mouseX, mouseY);
      }
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

      // Render based on current view
      if (this._currentView === 'evolution') {
        this._renderEvolutionView(ctx);
      } else if (this._currentView === 'techTree') {
        this._renderTechTreeView(ctx);
      } else {
        this._renderMainView(ctx);
      }

      // Render tooltip on top
      this._tooltip.render(ctx, this._canvasWidth, this._canvasHeight);
    }

    // ----------------------------------------
    // Private Methods - Layout
    // ----------------------------------------
    _calculateLayout() {
      // Main panel dimensions
      var panelWidth = Math.min(850, this._canvasWidth - 60);
      var panelHeight = Math.min(550, this._canvasHeight - 60);
      var panelX = (this._canvasWidth - panelWidth) / 2;
      var panelY = (this._canvasHeight - panelHeight) / 2;

      this._panelRect = { x: panelX, y: panelY, width: panelWidth, height: panelHeight };

      // Calculate sections for main view
      var contentX = panelX + PANEL_PADDING;
      var contentY = panelY + 50; // After title
      var contentWidth = panelWidth - PANEL_PADDING * 2;
      var contentHeight = panelHeight - 50 - 60; // Minus title and buttons

      // Three columns: Stats (250px), Weapons (250px), Tech (rest)
      var statsWidth = 220;
      var weaponsWidth = 220;
      var techWidth = contentWidth - statsWidth - weaponsWidth - SECTION_GAP * 2;

      this._statsSection = { x: contentX, y: contentY, width: statsWidth, height: contentHeight };
      this._weaponsSection = { x: contentX + statsWidth + SECTION_GAP, y: contentY, width: weaponsWidth, height: contentHeight };
      this._techSection = { x: contentX + statsWidth + weaponsWidth + SECTION_GAP * 2, y: contentY, width: techWidth, height: contentHeight };

      // Buttons
      var buttonY = panelY + panelHeight - 55;
      var buttonGap = 20;
      var totalButtonWidth = BUTTON_WIDTH * 2 + 80 + buttonGap * 2; // 2 nav buttons + close
      var buttonStartX = panelX + (panelWidth - totalButtonWidth) / 2;

      this._evolutionButtonRect = { x: buttonStartX, y: buttonY, width: BUTTON_WIDTH, height: BUTTON_HEIGHT };
      this._techTreeButtonRect = { x: buttonStartX + BUTTON_WIDTH + buttonGap, y: buttonY, width: BUTTON_WIDTH, height: BUTTON_HEIGHT };
      this._closeButtonRect = { x: buttonStartX + BUTTON_WIDTH * 2 + buttonGap * 2, y: buttonY, width: 80, height: BUTTON_HEIGHT };

      // Back button (for sub-views)
      this._backButtonRect = { x: panelX + PANEL_PADDING, y: buttonY, width: 80, height: BUTTON_HEIGHT };

      // Setup sub-panels with bounds
      var subPanelPadding = 50;
      this._evolutionPanel.setBounds(panelX + subPanelPadding, panelY + subPanelPadding, panelWidth - subPanelPadding * 2, panelHeight - subPanelPadding * 2 - 50);
      this._techTreePanel.setBounds(panelX + subPanelPadding, panelY + subPanelPadding, panelWidth - subPanelPadding * 2, panelHeight - subPanelPadding * 2 - 50);
    }

    // ----------------------------------------
    // Private Methods - Main View Input
    // ----------------------------------------
    _handleMainViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;
      this._hoveredWeaponIndex = -1;
      this._hoveredTechIndex = -1;
      this._tooltip.hide();

      // Check button hover
      if (this._isPointInRect(mouseX, mouseY, this._evolutionButtonRect)) {
        this._hoveredButton = 'evolution';
      } else if (this._isPointInRect(mouseX, mouseY, this._techTreeButtonRect)) {
        this._hoveredButton = 'techTree';
      } else if (this._isPointInRect(mouseX, mouseY, this._closeButtonRect)) {
        this._hoveredButton = 'close';
      }

      // Check weapon hover for tooltip
      var weapons = this._getPlayerWeapons();
      for (var i = 0; i < weapons.length; i++) {
        var weaponRect = this._getWeaponRowRect(i);
        if (this._isPointInRect(mouseX, mouseY, weaponRect)) {
          this._hoveredWeaponIndex = i;
          this._showWeaponTooltip(weapons[i], mouseX, mouseY);
          break;
        }
      }

      // Check tech hover for tooltip
      var techDisplay = this._getTechDisplayInfo();
      for (var j = 0; j < techDisplay.length; j++) {
        var techRect = this._getTechRowRect(j);
        if (this._isPointInRect(mouseX, mouseY, techRect)) {
          this._hoveredTechIndex = j;
          this._showTechTooltip(techDisplay[j], mouseX, mouseY);
          break;
        }
      }

      // Handle click
      if (input.isMousePressed(0)) {
        if (this._hoveredButton === 'evolution') {
          this._evolutionPanel.clearFilter();
          this._currentView = 'evolution';
          this._evolutionPanel.show();
          return null;
        } else if (this._hoveredButton === 'techTree') {
          this._currentView = 'techTree';
          this._techTreePanel.show();
          return null;
        } else if (this._hoveredButton === 'close') {
          return { action: 'close' };
        }

        // Handle weapon click - show evolution list filtered by this weapon
        if (this._hoveredWeaponIndex >= 0) {
          var clickedWeapon = weapons[this._hoveredWeaponIndex];
          if (clickedWeapon) {
            this._evolutionPanel.setFilterWeapon(clickedWeapon.id, clickedWeapon.name);
            this._currentView = 'evolution';
            this._evolutionPanel.show();
            return null;
          }
        }
      }

      return null;
    }

    _handleEvolutionViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;
      this._tooltip.hide();

      // Handle sub-panel input
      var tooltipContent = this._evolutionPanel.handleMouseMove(mouseX, mouseY);
      if (tooltipContent) {
        this._tooltip.show(tooltipContent, mouseX + 15, mouseY + 15);
      }

      // Check back button
      if (this._isPointInRect(mouseX, mouseY, this._backButtonRect)) {
        this._hoveredButton = 'back';
      }

      // Handle click
      if (input.isMousePressed(0)) {
        if (this._evolutionPanel.handleMouseDown(mouseX, mouseY)) {
          return null;
        }

        if (this._hoveredButton === 'back') {
          this._evolutionPanel.hide();
          this._evolutionPanel.clearFilter();
          this._currentView = 'main';
          return null;
        }
      }

      // Handle mouse up for scrollbar
      if (!input.isMouseDown(0)) {
        this._evolutionPanel.handleMouseUp();
      }

      return null;
    }

    _handleTechTreeViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;
      this._tooltip.hide();

      // Handle sub-panel input
      var tooltipContent = this._techTreePanel.handleMouseMove(mouseX, mouseY);
      if (tooltipContent) {
        this._tooltip.show(tooltipContent, mouseX + 15, mouseY + 15);
      }

      // Check back button
      if (this._isPointInRect(mouseX, mouseY, this._backButtonRect)) {
        this._hoveredButton = 'back';
      }

      // Handle click
      if (input.isMousePressed(0)) {
        if (this._hoveredButton === 'back') {
          this._techTreePanel.hide();
          this._currentView = 'main';
          return null;
        }
      }

      return null;
    }

    // ----------------------------------------
    // Private Methods - Main View Render
    // ----------------------------------------
    _renderMainView(ctx) {
      // Panel background
      ctx.fillStyle = PANEL_BG;
      ctx.fillRect(this._panelRect.x, this._panelRect.y, this._panelRect.width, this._panelRect.height);

      // Panel border
      ctx.strokeStyle = PANEL_BORDER;
      ctx.lineWidth = 3;
      ctx.strokeRect(this._panelRect.x, this._panelRect.y, this._panelRect.width, this._panelRect.height);

      // Title and timer
      this._renderTitle(ctx);

      // Three sections
      this._renderStatsSection(ctx);
      this._renderWeaponsSection(ctx);
      this._renderTechSection(ctx);

      // Navigation buttons
      this._renderNavigationButtons(ctx);
    }

    _renderTitle(ctx) {
      // Title
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('tab.characterStatus'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 15);

      // Timer
      var time = this._game ? this._game._time : null;
      if (time) {
        var elapsed = time.elapsed || 0;
        var minutes = Math.floor(elapsed / 60);
        var seconds = Math.floor(elapsed % 60);
        var timeStr = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = TEXT_COLOR;
        ctx.textAlign = 'right';
        ctx.fillText(timeStr, this._panelRect.x + this._panelRect.width - PANEL_PADDING, this._panelRect.y + 18);
      }
    }

    _renderStatsSection(ctx) {
      var section = this._statsSection;

      // Section header
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('tab.characterStats'), section.x, section.y);

      // Get stats
      var stats = this._getPlayerStats();
      var y = section.y + 25;

      for (var i = 0; i < stats.length; i++) {
        var stat = stats[i];
        this._renderStatRow(ctx, stat, section.x, y, section.width);
        y += STAT_ROW_HEIGHT;

        if (y > section.y + section.height - STAT_ROW_HEIGHT) break;
      }
    }

    _renderStatRow(ctx, stat, x, y, width) {
      var centerY = y + STAT_ROW_HEIGHT / 2;

      // Draw colored icon circle (stat.icon contains a color code like '#E74C3C')
      var iconColor = stat.icon || '#FFFFFF';
      ctx.fillStyle = iconColor;
      ctx.beginPath();
      ctx.arc(x + 8, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Stat name
      ctx.font = '11px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.tsn(stat.id, stat.name), x + 20, centerY);

      // Stat value display: base (blue) + bonus (purple) = total (orange)
      // Get character base multiplier from PlayerData
      var basePercent = 100;
      var PlayerData = window.VampireSurvivors.Components.PlayerData;
      if (this._player && PlayerData) {
        var playerData = this._player.getComponent(PlayerData);
        if (playerData && playerData.characterData) {
          var baseStats = playerData.characterData.baseStats;
          // Map stat id to character base stat
          var statMap = {
            damage: 'attack',
            speed: 'speed',
            maxHealth: 'maxHealth',
            critChance: 'critChance',
            luck: 'luck',
          };
          var charStat = statMap[stat.id];
          if (charStat && baseStats[charStat] !== undefined) {
            basePercent = Math.round(baseStats[charStat] * 100);
          }
        }
      }

      var bonusPercent = stat.bonusPercent;
      var totalPercent = basePercent + bonusPercent;

      ctx.textAlign = 'right';
      ctx.font = '10px Arial';

      if (stat.isMaxLevel) {
        // Max level - show total in green
        ctx.fillStyle = '#3498DB'; // Blue for base
        ctx.fillText(basePercent + '%', x + width - 80, centerY);
        ctx.fillStyle = '#9B59B6'; // Purple for bonus
        ctx.fillText('+' + bonusPercent + '%', x + width - 45, centerY);
        ctx.fillStyle = '#2ECC71'; // Green for max
        ctx.fillText('=' + totalPercent + '%', x + width - 5, centerY);
      } else if (bonusPercent === 0) {
        // No bonus - show base only
        ctx.fillStyle = '#3498DB'; // Blue for base
        ctx.fillText(basePercent + '%', x + width - 5, centerY);
      } else {
        // Show base + bonus = total
        ctx.fillStyle = '#3498DB'; // Blue for base
        ctx.fillText(basePercent + '%', x + width - 80, centerY);
        ctx.fillStyle = '#9B59B6'; // Purple for bonus
        ctx.fillText('+' + bonusPercent + '%', x + width - 45, centerY);
        ctx.fillStyle = '#F39C12'; // Orange for total
        ctx.fillText('=' + totalPercent + '%', x + width - 5, centerY);
      }
    }

    _renderWeaponsSection(ctx) {
      var section = this._weaponsSection;

      // Section header
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('tab.weapons'), section.x, section.y);

      // Get weapons
      var weapons = this._getPlayerWeapons();
      var y = section.y + 25;

      for (var i = 0; i < weapons.length; i++) {
        var weapon = weapons[i];
        var isHovered = this._hoveredWeaponIndex === i;
        this._renderWeaponRow(ctx, weapon, section.x, y, section.width, isHovered);
        y += WEAPON_ROW_HEIGHT;

        if (y > section.y + section.height - WEAPON_ROW_HEIGHT) break;
      }

      // Empty state
      if (weapons.length === 0) {
        ctx.font = '12px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.fillText(i18n.t('weapons.noWeapons'), section.x + section.width / 2, section.y + 50);
      }
    }

    _renderWeaponRow(ctx, weapon, x, y, width, isHovered) {
      // Hover background (click hint)
      if (isHovered) {
        ctx.fillStyle = 'rgba(52, 152, 219, 0.15)';
        ctx.fillRect(x, y, width, WEAPON_ROW_HEIGHT);

        // Click hint border
        ctx.strokeStyle = '#3498DB';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, WEAPON_ROW_HEIGHT);
      }

      // Weapon icon
      var iconX = x + 5;
      var iconY = y + (WEAPON_ROW_HEIGHT - WEAPON_ICON_SIZE) / 2;
      var weaponData = weapon.data || weapon;
      var color = weaponData.color || '#FFFFFF';

      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(iconX, iconY, WEAPON_ICON_SIZE, WEAPON_ICON_SIZE);

      // Tier-based border around icon
      var tier = weaponData.tier || weapon.tier || 1;
      var tierBorderColor = WeaponTierData ? WeaponTierData.getTierBorderColor(tier) : '#AAAAAA';
      ctx.strokeStyle = tierBorderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(iconX, iconY, WEAPON_ICON_SIZE, WEAPON_ICON_SIZE);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(iconX + WEAPON_ICON_SIZE / 2, iconY + WEAPON_ICON_SIZE / 2, WEAPON_ICON_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();

      // Weapon name and level
      ctx.font = '12px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      var name = i18n.tw(weapon.id, weapon.name);
      if (name.length > 12) name = name.substring(0, 11) + '..';
      ctx.fillText(name + ' Lv.' + weapon.level, x + WEAPON_ICON_SIZE + 12, y + 5);

      // DPS and Total Damage
      ctx.font = '10px Arial';
      ctx.fillStyle = DESC_COLOR;
      var dps = weapon.dps || 0;
      var totalDamage = weapon.totalDamageDealt || 0;
      ctx.fillText(i18n.t('tab.dps') + ' ' + dps.toFixed(1), x + WEAPON_ICON_SIZE + 12, y + 20);
      ctx.fillText(i18n.t('tab.td') + ' ' + this._formatNumber(totalDamage), x + WEAPON_ICON_SIZE + 12, y + 32);
    }

    _renderTechSection(ctx) {
      var section = this._techSection;

      // Section header
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('tab.techProgress'), section.x, section.y);

      // Get tech data
      var techDisplay = this._getTechDisplayInfo();
      var y = section.y + 25;

      for (var i = 0; i < techDisplay.length; i++) {
        var tech = techDisplay[i];
        var isHovered = this._hoveredTechIndex === i;
        this._renderTechRow(ctx, tech, section.x, y, section.width, isHovered);
        y += TECH_ROW_HEIGHT;

        if (y > section.y + section.height - TECH_ROW_HEIGHT) break;
      }

      // Empty state
      if (techDisplay.length === 0) {
        ctx.font = '12px Arial';
        ctx.fillStyle = DESC_COLOR;
        ctx.textAlign = 'center';
        ctx.fillText(i18n.t('tech.noTech'), section.x + section.width / 2, section.y + 50);
      }
    }

    _renderTechRow(ctx, tech, x, y, width, isHovered) {
      // Hover background
      if (isHovered) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x, y, width, TECH_ROW_HEIGHT);
      }

      // Tech icon
      var iconX = x + 5;
      var iconY = y + (TECH_ROW_HEIGHT - TECH_ICON_SIZE) / 2;

      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(iconX, iconY, TECH_ICON_SIZE, TECH_ICON_SIZE);

      // Depth color indicator
      var depthColors = ['#FFFFFF', '#3498DB', '#9B59B6', '#F39C12'];
      ctx.fillStyle = depthColors[tech.depth] || '#FFFFFF';
      ctx.beginPath();
      ctx.arc(iconX + TECH_ICON_SIZE / 2, iconY + TECH_ICON_SIZE / 2, TECH_ICON_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();

      // Tech name and level
      ctx.font = '12px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      var name = i18n.ttn(tech.techId, tech.name);
      if (name.length > 15) name = name.substring(0, 14) + '..';
      ctx.fillText(name, x + TECH_ICON_SIZE + 12, y + TECH_ROW_HEIGHT / 2 - 7);

      // Level
      ctx.font = '10px Arial';
      ctx.fillStyle = DESC_COLOR;
      ctx.fillText('Lv.' + tech.level + '/' + tech.maxLevel, x + TECH_ICON_SIZE + 12, y + TECH_ROW_HEIGHT / 2 + 7);
    }

    _renderNavigationButtons(ctx) {
      // Evolution List button
      this._renderButton(ctx, this._evolutionButtonRect, i18n.t('menu.evolutionList'), this._hoveredButton === 'evolution');

      // Tech Tree button
      this._renderButton(ctx, this._techTreeButtonRect, i18n.t('menu.techTree'), this._hoveredButton === 'techTree');

      // Close button
      this._renderCloseButton(ctx, this._closeButtonRect, this._hoveredButton === 'close');
    }

    _renderButton(ctx, rect, text, isHovered) {
      ctx.fillStyle = isHovered ? BUTTON_HOVER_BG : BUTTON_BG;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      ctx.strokeStyle = BUTTON_BORDER;
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2);
    }

    _renderCloseButton(ctx, rect, isHovered) {
      ctx.fillStyle = isHovered ? CLOSE_BUTTON_HOVER : CLOSE_BUTTON_BG;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('X', rect.x + rect.width / 2, rect.y + rect.height / 2);
    }

    // ----------------------------------------
    // Private Methods - Sub-View Render
    // ----------------------------------------
    _renderEvolutionView(ctx) {
      // Panel background
      ctx.fillStyle = PANEL_BG;
      ctx.fillRect(this._panelRect.x, this._panelRect.y, this._panelRect.width, this._panelRect.height);

      // Panel border
      ctx.strokeStyle = PANEL_BORDER;
      ctx.lineWidth = 3;
      ctx.strokeRect(this._panelRect.x, this._panelRect.y, this._panelRect.width, this._panelRect.height);

      // Title (show filter if active)
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      var filterName = this._evolutionPanel.getFilterWeaponName();
      if (filterName) {
        ctx.fillText(i18n.t('tab.evolution') + ' ' + filterName, this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 15);
      } else {
        ctx.fillText(i18n.t('tab.evolutionList'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 15);
      }

      // Render evolution panel
      this._evolutionPanel.render(ctx);

      // Back button
      this._renderButton(ctx, this._backButtonRect, i18n.t('settings.back'), this._hoveredButton === 'back');
    }

    _renderTechTreeView(ctx) {
      // Panel background
      ctx.fillStyle = PANEL_BG;
      ctx.fillRect(this._panelRect.x, this._panelRect.y, this._panelRect.width, this._panelRect.height);

      // Panel border
      ctx.strokeStyle = PANEL_BORDER;
      ctx.lineWidth = 3;
      ctx.strokeRect(this._panelRect.x, this._panelRect.y, this._panelRect.width, this._panelRect.height);

      // Title
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('tech.title'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 15);

      // Render tech tree panel
      this._techTreePanel.render(ctx);

      // Back button
      this._renderButton(ctx, this._backButtonRect, i18n.t('settings.back'), this._hoveredButton === 'back');
    }

    // ----------------------------------------
    // Private Methods - Data Helpers
    // ----------------------------------------
    _getPlayerStats() {
      if (!this._player) return [];

      var playerStats = this._player.getComponent(PlayerStats);
      if (!playerStats) return [];

      return playerStats.getAllStatsForDisplay();
    }

    _getPlayerWeapons() {
      if (!this._player) return [];

      var weaponSlot = this._player.getComponent(WeaponSlot);
      if (!weaponSlot) return [];

      return weaponSlot.getWeapons();
    }

    _getTechDisplayInfo() {
      if (!this._player) return [];

      var techTree = this._player.getComponent(TechTree);
      if (!techTree) return [];

      return techTree.getDisplayInfo();
    }

    _getWeaponRowRect(index) {
      var section = this._weaponsSection;
      return {
        x: section.x,
        y: section.y + 25 + index * WEAPON_ROW_HEIGHT,
        width: section.width,
        height: WEAPON_ROW_HEIGHT,
      };
    }

    _getTechRowRect(index) {
      var section = this._techSection;
      return {
        x: section.x,
        y: section.y + 25 + index * TECH_ROW_HEIGHT,
        width: section.width,
        height: TECH_ROW_HEIGHT,
      };
    }

    _showWeaponTooltip(weapon, mouseX, mouseY) {
      // Get detailed weapon stats
      var weaponData = weapon.data || weapon;
      var allStats = weapon.getAllStats ? weapon.getAllStats() : {};

      // Calculate DPS
      var dps = weapon.dps || weapon.getDPS ? weapon.getDPS() : 0;
      var cooldownMax = weapon.cooldownMax || allStats.cooldown || 1.0;
      var damage = weapon.damage || allStats.damage || 0;
      var range = allStats.range || weaponData.range || 0;
      var projectileCount = allStats.projectileCount || weaponData.projectileCount || 1;
      var piercing = allStats.piercing || weaponData.piercing || 0;
      var areaRadius = allStats.areaRadius || weaponData.areaRadius || 0;

      // Get weapon traits
      var traits = [];
      if (weapon.attackType) traits.push(i18n.tat(weapon.attackType));
      if (weapon.targetingMode) traits.push(i18n.ttm(weapon.targetingMode));
      if (weapon.isAuto === false) traits.push('Manual');
      if (piercing > 0) traits.push('Piercing: ' + piercing);
      if (projectileCount > 1) traits.push('Multi-shot: ' + projectileCount);
      if (areaRadius > 0) traits.push('Area: ' + areaRadius);

      // Build unique properties list with descriptions
      var PropertyDescriptions = window.VampireSurvivors.Data.PropertyDescriptions;
      var uniqueProperties = [];
      if (PropertyDescriptions) {
        if (piercing > 0) {
          uniqueProperties.push({ name: 'Piercing', description: PropertyDescriptions.get('pierce') });
        }
        if (projectileCount > 1) {
          uniqueProperties.push({ name: 'Multi-shot', description: PropertyDescriptions.get('projectileCount') });
        }
        if (areaRadius > 0) {
          uniqueProperties.push({ name: 'Area Effect', description: PropertyDescriptions.get('areaRadius') });
        }
        if (weaponData.homing) {
          uniqueProperties.push({ name: 'Homing', description: PropertyDescriptions.get('homing') });
        }
        if (weaponData.chain) {
          uniqueProperties.push({ name: 'Chain', description: PropertyDescriptions.get('chain') });
        }
        if (weaponData.knockback) {
          uniqueProperties.push({ name: 'Knockback', description: PropertyDescriptions.get('knockback') });
        }
        // Additional properties
        if (weaponData.lifesteal) {
          uniqueProperties.push({ name: 'Lifesteal', description: PropertyDescriptions.get('lifesteal') });
        }
        if (weaponData.healing) {
          uniqueProperties.push({ name: 'Healing', description: PropertyDescriptions.get('healing') });
        }
        if (weaponData.burn) {
          uniqueProperties.push({ name: 'Burn', description: PropertyDescriptions.get('burn') });
        }
        if (weaponData.freeze) {
          uniqueProperties.push({ name: 'Freeze', description: PropertyDescriptions.get('freeze') });
        }
        if (weaponData.slow) {
          uniqueProperties.push({ name: 'Slow', description: PropertyDescriptions.get('slow') });
        }
        if (weaponData.poison) {
          uniqueProperties.push({ name: 'Poison', description: PropertyDescriptions.get('poison') });
        }
        if (weaponData.explosion) {
          uniqueProperties.push({ name: 'Explosion', description: PropertyDescriptions.get('explosion') });
        }
        if (weaponData.bounce) {
          uniqueProperties.push({ name: 'Bounce', description: PropertyDescriptions.get('bounce') });
        }
        if (weaponData.stun) {
          uniqueProperties.push({ name: 'Stun', description: PropertyDescriptions.get('stun') });
        }
        // Parse statusEffects array for weapons that use the array format
        if (weaponData.statusEffects && Array.isArray(weaponData.statusEffects)) {
          for (var j = 0; j < weaponData.statusEffects.length; j++) {
            var effect = weaponData.statusEffects[j];
            var effectType = effect.type;
            if (effectType) {
              var effectName = effectType.charAt(0).toUpperCase() + effectType.slice(1);
              var desc = PropertyDescriptions.get(effectType) || 'Applies ' + effectType;
              if (effect.duration) desc += ' - ' + effect.duration.toFixed(1) + 's';
              if (effect.damagePerTick) desc += ', ' + effect.damagePerTick + ' dmg/tick';
              uniqueProperties.push({ name: effectName, description: desc });
            }
          }
        }
      }

      var content = {
        type: 'weaponDetail',
        name: i18n.tw(weapon.id, weapon.name),
        level: weapon.level,
        maxLevel: weapon.maxLevel,
        tier: weapon.tier || 1,
        damage: damage,
        dps: dps,
        cooldown: cooldownMax,
        range: range,
        traits: traits,
        uniqueProperties: uniqueProperties,
        totalDamageDealt: weapon.totalDamageDealt || 0,
        attackType: weapon.attackType,
        isMaxLevel: weapon.level >= weapon.maxLevel,
      };
      this._tooltip.show(content, mouseX + 15, mouseY + 15);
    }

    _showTechTooltip(tech, mouseX, mouseY) {
      var content = {
        type: 'tech',
        title: i18n.ttn(tech.techId, tech.name),
        depth: tech.depth,
        level: tech.level,
        maxLevel: tech.maxLevel,
        effects: tech.effects || [],
        cost: tech.upgradeCost,
        canAfford: true,
      };
      this._tooltip.show(content, mouseX + 15, mouseY + 15);
    }

    _formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return Math.floor(num).toString();
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
      this._player = null;
      this._game = null;
      if (this._evolutionPanel) {
        this._evolutionPanel.dispose();
        this._evolutionPanel = null;
      }
      if (this._techTreePanel) {
        this._techTreePanel.dispose();
        this._techTreePanel = null;
      }
      if (this._tooltip) {
        this._tooltip.dispose();
        this._tooltip = null;
      }
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.TabScreen = TabScreen;
})(window.VampireSurvivors.UI);
