/**
 * @fileoverview PauseMenuScreen - ESC menu with settings, evolution list, and tech tree
 * @module UI/PauseMenuScreen
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var EvolutionListPanel = UI.EvolutionListPanel;
  var TechTreePanel = UI.TechTreePanel;
  var UpgradeTooltip = UI.UpgradeTooltip;
  var i18n = window.VampireSurvivors.Core.i18n;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var OVERLAY_COLOR = 'rgba(0, 0, 0, 0.8)';
  var PANEL_BG = '#1A2332';
  var PANEL_BORDER = '#3D566E';
  var TITLE_COLOR = '#FFFFFF';
  var TEXT_COLOR = '#ECF0F1';
  var DESC_COLOR = '#BDC3C7';

  // Button styling
  var BUTTON_BG = '#2C3E50';
  var BUTTON_HOVER_BG = '#34495E';
  var BUTTON_BORDER = '#4A6278';
  var BUTTON_WIDTH = 220;
  var BUTTON_HEIGHT = 50;
  var BUTTON_GAP = 15;

  // Panel dimensions
  var MAIN_PANEL_WIDTH = 300;
  var MAIN_PANEL_HEIGHT = 320;
  var SETTINGS_PANEL_WIDTH = 350;
  var SETTINGS_PANEL_HEIGHT = 280;
  var LIST_PANEL_WIDTH = 400;
  var LIST_PANEL_HEIGHT = 350;

  // Resolution options
  var RESOLUTION_OPTIONS = [
    { width: 800, height: 600, label: '800 x 600' },
    { width: 1024, height: 768, label: '1024 x 768' },
    { width: 1280, height: 720, label: '1280 x 720 (HD)' },
    { width: 1920, height: 1080, label: '1920 x 1080 (FHD)' },
  ];

  // Language options
  var LANGUAGE_OPTIONS = [
    { code: 'en', labelKey: 'language.en' },
    { code: 'ko', labelKey: 'language.ko' },
  ];

  // ============================================
  // Class Definition
  // ============================================
  class PauseMenuScreen {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _player = null;
    _game = null;
    _canvasWidth = 800;
    _canvasHeight = 600;

    // View state: 'main', 'settings', 'resolution', 'language', 'evolution', 'techTree'
    _currentView = 'main';

    // Sub-panels
    _evolutionPanel = null;
    _techTreePanel = null;
    _tooltip = null;

    // Panel rects per view
    _panelRect = null;

    // Button rects
    _mainButtons = {};      // continue, settings, evolution, techTree
    _settingsButtons = {};  // resolution, language, back
    _listButtons = {};      // option buttons + back

    // Hover state
    _hoveredButton = null;

    // Current resolution
    _currentResolution = { width: 800, height: 600 };

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._evolutionPanel = new EvolutionListPanel();
      this._techTreePanel = new TechTreePanel();
      this._tooltip = new UpgradeTooltip();

      // Load saved resolution
      this._loadSavedResolution();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show the pause menu
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
      this._hoveredButton = null;

      // Update current resolution from game
      this._currentResolution = { width: canvasWidth, height: canvasHeight };

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
     * Handle ESC key press for back navigation
     * @returns {Object|null} { action: 'close' } if should close, null otherwise
     */
    handleEscPress() {
      if (this._currentView === 'main') {
        return { action: 'close' };
      }

      // Navigate back
      if (this._currentView === 'evolution') {
        this._evolutionPanel.hide();
        this._evolutionPanel.clearFilter();
      } else if (this._currentView === 'techTree') {
        this._techTreePanel.hide();
      } else if (this._currentView === 'resolution' || this._currentView === 'language') {
        this._currentView = 'settings';
        this._calculateLayout();
        return null;
      }

      this._currentView = 'main';
      this._calculateLayout();
      return null;
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
      switch (this._currentView) {
        case 'main':
          return this._handleMainViewInput(input, mouseX, mouseY);
        case 'settings':
          return this._handleSettingsViewInput(input, mouseX, mouseY);
        case 'resolution':
          return this._handleResolutionViewInput(input, mouseX, mouseY);
        case 'language':
          return this._handleLanguageViewInput(input, mouseX, mouseY);
        case 'evolution':
          return this._handleEvolutionViewInput(input, mouseX, mouseY);
        case 'techTree':
          return this._handleTechTreeViewInput(input, mouseX, mouseY);
        default:
          return null;
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
      switch (this._currentView) {
        case 'main':
          this._renderMainView(ctx);
          break;
        case 'settings':
          this._renderSettingsView(ctx);
          break;
        case 'resolution':
          this._renderResolutionView(ctx);
          break;
        case 'language':
          this._renderLanguageView(ctx);
          break;
        case 'evolution':
          this._renderEvolutionView(ctx);
          break;
        case 'techTree':
          this._renderTechTreeView(ctx);
          break;
      }

      // Render tooltip on top
      this._tooltip.render(ctx, this._canvasWidth, this._canvasHeight);
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isVisible() {
      return this._isVisible;
    }

    // ----------------------------------------
    // Private Methods - Layout
    // ----------------------------------------
    _calculateLayout() {
      switch (this._currentView) {
        case 'main':
          this._calculateMainLayout();
          break;
        case 'settings':
          this._calculateSettingsLayout();
          break;
        case 'resolution':
        case 'language':
          this._calculateListLayout();
          break;
        case 'evolution':
        case 'techTree':
          this._calculateSubPanelLayout();
          break;
      }
    }

    _calculateMainLayout() {
      var panelWidth = MAIN_PANEL_WIDTH;
      var panelHeight = MAIN_PANEL_HEIGHT;
      var panelX = (this._canvasWidth - panelWidth) / 2;
      var panelY = (this._canvasHeight - panelHeight) / 2;

      this._panelRect = { x: panelX, y: panelY, width: panelWidth, height: panelHeight };

      // Calculate button positions
      var buttonX = panelX + (panelWidth - BUTTON_WIDTH) / 2;
      var buttonY = panelY + 70;

      this._mainButtons = {
        continue: { x: buttonX, y: buttonY, width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
        settings: { x: buttonX, y: buttonY + BUTTON_HEIGHT + BUTTON_GAP, width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
        evolution: { x: buttonX, y: buttonY + (BUTTON_HEIGHT + BUTTON_GAP) * 2, width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
        techTree: { x: buttonX, y: buttonY + (BUTTON_HEIGHT + BUTTON_GAP) * 3, width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
      };
    }

    _calculateSettingsLayout() {
      var panelWidth = SETTINGS_PANEL_WIDTH;
      var panelHeight = SETTINGS_PANEL_HEIGHT;
      var panelX = (this._canvasWidth - panelWidth) / 2;
      var panelY = (this._canvasHeight - panelHeight) / 2;

      this._panelRect = { x: panelX, y: panelY, width: panelWidth, height: panelHeight };

      var buttonX = panelX + (panelWidth - BUTTON_WIDTH) / 2;
      var buttonY = panelY + 70;

      this._settingsButtons = {
        resolution: { x: buttonX, y: buttonY, width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
        language: { x: buttonX, y: buttonY + BUTTON_HEIGHT + BUTTON_GAP, width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
        back: { x: buttonX, y: buttonY + (BUTTON_HEIGHT + BUTTON_GAP) * 2, width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
      };
    }

    _calculateListLayout() {
      var panelWidth = LIST_PANEL_WIDTH;
      var panelHeight = LIST_PANEL_HEIGHT;
      var panelX = (this._canvasWidth - panelWidth) / 2;
      var panelY = (this._canvasHeight - panelHeight) / 2;

      this._panelRect = { x: panelX, y: panelY, width: panelWidth, height: panelHeight };

      var buttonX = panelX + (panelWidth - BUTTON_WIDTH) / 2;
      var buttonY = panelY + 70;

      this._listButtons = { options: [], back: null };

      var options = this._currentView === 'resolution' ? RESOLUTION_OPTIONS : LANGUAGE_OPTIONS;
      for (var i = 0; i < options.length; i++) {
        this._listButtons.options.push({
          x: buttonX,
          y: buttonY + i * (BUTTON_HEIGHT + BUTTON_GAP),
          width: BUTTON_WIDTH,
          height: BUTTON_HEIGHT,
          data: options[i],
        });
      }

      this._listButtons.back = {
        x: buttonX,
        y: buttonY + options.length * (BUTTON_HEIGHT + BUTTON_GAP),
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
      };
    }

    _calculateSubPanelLayout() {
      // Full-screen panel for evolution/tech tree
      var panelWidth = Math.min(850, this._canvasWidth - 60);
      var panelHeight = Math.min(550, this._canvasHeight - 60);
      var panelX = (this._canvasWidth - panelWidth) / 2;
      var panelY = (this._canvasHeight - panelHeight) / 2;

      this._panelRect = { x: panelX, y: panelY, width: panelWidth, height: panelHeight };

      // Setup sub-panel bounds
      var subPanelPadding = 50;
      this._evolutionPanel.setBounds(
        panelX + subPanelPadding,
        panelY + subPanelPadding,
        panelWidth - subPanelPadding * 2,
        panelHeight - subPanelPadding * 2 - 50
      );
      this._techTreePanel.setBounds(
        panelX + subPanelPadding,
        panelY + subPanelPadding,
        panelWidth - subPanelPadding * 2,
        panelHeight - subPanelPadding * 2 - 50
      );

      // Back button
      this._listButtons = {
        options: [],
        back: { x: panelX + 20, y: panelY + panelHeight - 55, width: 80, height: 40 },
      };
    }

    // ----------------------------------------
    // Private Methods - Main View
    // ----------------------------------------
    _handleMainViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;

      // Check button hover
      for (var key in this._mainButtons) {
        if (this._isPointInRect(mouseX, mouseY, this._mainButtons[key])) {
          this._hoveredButton = key;
          break;
        }
      }

      // Handle click
      if (input.isMousePressed(0) && this._hoveredButton) {
        switch (this._hoveredButton) {
          case 'continue':
            return { action: 'continue' };
          case 'settings':
            this._currentView = 'settings';
            this._calculateLayout();
            return null;
          case 'evolution':
            this._evolutionPanel.clearFilter();
            this._currentView = 'evolution';
            this._calculateLayout();
            this._evolutionPanel.show();
            return null;
          case 'techTree':
            this._currentView = 'techTree';
            this._calculateLayout();
            this._techTreePanel.show();
            return null;
        }
      }

      return null;
    }

    _renderMainView(ctx) {
      this._renderPanel(ctx, this._panelRect);

      // Title
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('menu.paused'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 20);

      // Buttons
      this._renderButton(ctx, this._mainButtons.continue, i18n.t('menu.continue'), this._hoveredButton === 'continue');
      this._renderButton(ctx, this._mainButtons.settings, i18n.t('menu.settings'), this._hoveredButton === 'settings');
      this._renderButton(ctx, this._mainButtons.evolution, i18n.t('menu.evolutionList'), this._hoveredButton === 'evolution');
      this._renderButton(ctx, this._mainButtons.techTree, i18n.t('menu.techTree'), this._hoveredButton === 'techTree');
    }

    // ----------------------------------------
    // Private Methods - Settings View
    // ----------------------------------------
    _handleSettingsViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;

      // Check button hover
      for (var key in this._settingsButtons) {
        if (this._isPointInRect(mouseX, mouseY, this._settingsButtons[key])) {
          this._hoveredButton = key;
          break;
        }
      }

      // Handle click
      if (input.isMousePressed(0) && this._hoveredButton) {
        switch (this._hoveredButton) {
          case 'resolution':
            this._currentView = 'resolution';
            this._calculateLayout();
            return null;
          case 'language':
            this._currentView = 'language';
            this._calculateLayout();
            return null;
          case 'back':
            this._currentView = 'main';
            this._calculateLayout();
            return null;
        }
      }

      return null;
    }

    _renderSettingsView(ctx) {
      this._renderPanel(ctx, this._panelRect);

      // Title
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('settings.title'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 20);

      // Buttons
      this._renderButton(ctx, this._settingsButtons.resolution, i18n.t('settings.resolution'), this._hoveredButton === 'resolution');
      this._renderButton(ctx, this._settingsButtons.language, i18n.t('settings.language'), this._hoveredButton === 'language');
      this._renderButton(ctx, this._settingsButtons.back, i18n.t('settings.back'), this._hoveredButton === 'back');
    }

    // ----------------------------------------
    // Private Methods - Resolution View
    // ----------------------------------------
    _handleResolutionViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;

      // Check option buttons
      for (var i = 0; i < this._listButtons.options.length; i++) {
        if (this._isPointInRect(mouseX, mouseY, this._listButtons.options[i])) {
          this._hoveredButton = 'option_' + i;
          break;
        }
      }

      // Check back button
      if (this._isPointInRect(mouseX, mouseY, this._listButtons.back)) {
        this._hoveredButton = 'back';
      }

      // Handle click
      if (input.isMousePressed(0)) {
        if (this._hoveredButton && this._hoveredButton.startsWith('option_')) {
          var index = parseInt(this._hoveredButton.split('_')[1]);
          var resolution = RESOLUTION_OPTIONS[index];
          this._applyResolution(resolution.width, resolution.height);
          return null;
        } else if (this._hoveredButton === 'back') {
          this._currentView = 'settings';
          this._calculateLayout();
          return null;
        }
      }

      return null;
    }

    _renderResolutionView(ctx) {
      this._renderPanel(ctx, this._panelRect);

      // Title
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('resolution.title'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 20);

      // Resolution options
      for (var i = 0; i < this._listButtons.options.length; i++) {
        var btn = this._listButtons.options[i];
        var res = btn.data;
        var isHovered = this._hoveredButton === 'option_' + i;
        var isCurrent = res.width === this._currentResolution.width && res.height === this._currentResolution.height;
        this._renderOptionButton(ctx, btn, res.label, isHovered, isCurrent);
      }

      // Back button
      this._renderButton(ctx, this._listButtons.back, i18n.t('settings.back'), this._hoveredButton === 'back');
    }

    // ----------------------------------------
    // Private Methods - Language View
    // ----------------------------------------
    _handleLanguageViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;

      // Check option buttons
      for (var i = 0; i < this._listButtons.options.length; i++) {
        if (this._isPointInRect(mouseX, mouseY, this._listButtons.options[i])) {
          this._hoveredButton = 'option_' + i;
          break;
        }
      }

      // Check back button
      if (this._isPointInRect(mouseX, mouseY, this._listButtons.back)) {
        this._hoveredButton = 'back';
      }

      // Handle click
      if (input.isMousePressed(0)) {
        if (this._hoveredButton && this._hoveredButton.startsWith('option_')) {
          var index = parseInt(this._hoveredButton.split('_')[1]);
          var lang = LANGUAGE_OPTIONS[index];
          this._applyLanguage(lang.code);
          return null;
        } else if (this._hoveredButton === 'back') {
          this._currentView = 'settings';
          this._calculateLayout();
          return null;
        }
      }

      return null;
    }

    _renderLanguageView(ctx) {
      this._renderPanel(ctx, this._panelRect);

      // Title
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('language.title'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 20);

      // Language options
      var currentLang = i18n.getLanguage();
      for (var i = 0; i < this._listButtons.options.length; i++) {
        var btn = this._listButtons.options[i];
        var lang = btn.data;
        var isHovered = this._hoveredButton === 'option_' + i;
        var isCurrent = lang.code === currentLang;
        this._renderOptionButton(ctx, btn, i18n.t(lang.labelKey), isHovered, isCurrent);
      }

      // Back button
      this._renderButton(ctx, this._listButtons.back, i18n.t('settings.back'), this._hoveredButton === 'back');
    }

    // ----------------------------------------
    // Private Methods - Evolution View
    // ----------------------------------------
    _handleEvolutionViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;
      this._tooltip.hide();

      // Handle sub-panel input
      var tooltipContent = this._evolutionPanel.handleMouseMove(mouseX, mouseY);
      if (tooltipContent) {
        this._tooltip.show(tooltipContent, mouseX + 15, mouseY + 15);
      }

      // Check back button
      if (this._isPointInRect(mouseX, mouseY, this._listButtons.back)) {
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
          this._calculateLayout();
          return null;
        }
      }

      // Handle mouse up for scrollbar
      if (!input.isMouseDown(0)) {
        this._evolutionPanel.handleMouseUp();
      }

      return null;
    }

    _renderEvolutionView(ctx) {
      this._renderPanel(ctx, this._panelRect);

      // Title
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('menu.evolutionList'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 15);

      // Render evolution panel
      this._evolutionPanel.render(ctx);

      // Back button
      this._renderButton(ctx, this._listButtons.back, i18n.t('settings.back'), this._hoveredButton === 'back');
    }

    // ----------------------------------------
    // Private Methods - Tech Tree View
    // ----------------------------------------
    _handleTechTreeViewInput(input, mouseX, mouseY) {
      this._hoveredButton = null;
      this._tooltip.hide();

      // Handle sub-panel input
      var tooltipContent = this._techTreePanel.handleMouseMove(mouseX, mouseY);
      if (tooltipContent) {
        this._tooltip.show(tooltipContent, mouseX + 15, mouseY + 15);
      }

      // Check back button
      if (this._isPointInRect(mouseX, mouseY, this._listButtons.back)) {
        this._hoveredButton = 'back';
      }

      // Handle click
      if (input.isMousePressed(0)) {
        if (this._hoveredButton === 'back') {
          this._techTreePanel.hide();
          this._currentView = 'main';
          this._calculateLayout();
          return null;
        }
      }

      return null;
    }

    _renderTechTreeView(ctx) {
      this._renderPanel(ctx, this._panelRect);

      // Title
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = TITLE_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(i18n.t('menu.techTree'), this._panelRect.x + this._panelRect.width / 2, this._panelRect.y + 15);

      // Render tech tree panel
      this._techTreePanel.render(ctx);

      // Back button
      this._renderButton(ctx, this._listButtons.back, i18n.t('settings.back'), this._hoveredButton === 'back');
    }

    // ----------------------------------------
    // Private Methods - Rendering Helpers
    // ----------------------------------------
    _renderPanel(ctx, rect) {
      // Panel background
      ctx.fillStyle = PANEL_BG;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Panel border
      ctx.strokeStyle = PANEL_BORDER;
      ctx.lineWidth = 3;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }

    _renderButton(ctx, rect, text, isHovered) {
      ctx.fillStyle = isHovered ? BUTTON_HOVER_BG : BUTTON_BG;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      ctx.strokeStyle = BUTTON_BORDER;
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2);
    }

    _renderOptionButton(ctx, rect, text, isHovered, isCurrent) {
      // Different styling for current selection
      if (isCurrent) {
        ctx.fillStyle = '#27AE60';
      } else {
        ctx.fillStyle = isHovered ? BUTTON_HOVER_BG : BUTTON_BG;
      }
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      ctx.strokeStyle = isCurrent ? '#2ECC71' : BUTTON_BORDER;
      ctx.lineWidth = isCurrent ? 3 : 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = TEXT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, rect.x + rect.width / 2, rect.y + rect.height / 2);

      // Checkmark for current
      if (isCurrent) {
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('\u2713', rect.x + rect.width - 10, rect.y + rect.height / 2);
      }
    }

    // ----------------------------------------
    // Private Methods - Settings Actions
    // ----------------------------------------
    _applyResolution(width, height) {
      this._currentResolution = { width: width, height: height };

      // Save to localStorage
      localStorage.setItem('vampireSurvivors_resolution', JSON.stringify(this._currentResolution));

      // Emit event for game to handle resolution change
      events.emit('settings:resolutionChanged', { width: width, height: height });

      console.log('[PauseMenu] Resolution changed to:', width + 'x' + height);
    }

    _applyLanguage(langCode) {
      i18n.setLanguage(langCode);

      // Emit event for any systems that need to update
      events.emit('settings:languageChanged', { language: langCode });

      console.log('[PauseMenu] Language changed to:', langCode);
    }

    _loadSavedResolution() {
      try {
        var saved = localStorage.getItem('vampireSurvivors_resolution');
        if (saved) {
          this._currentResolution = JSON.parse(saved);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    // ----------------------------------------
    // Private Methods - Utility
    // ----------------------------------------
    _isPointInRect(x, y, rect) {
      if (!rect) return false;
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
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
  UI.PauseMenuScreen = PauseMenuScreen;
})(window.VampireSurvivors.UI);
