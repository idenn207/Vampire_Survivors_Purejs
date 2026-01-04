/**
 * @fileoverview PauseMenuSystem - handles ESC key toggle and pause menu lifecycle
 * @module Systems/PauseMenuSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var PauseMenuScreen = window.VampireSurvivors.UI.PauseMenuScreen;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 117; // After TabScreenSystem (116), before GameOverSystem (120)

  // ============================================
  // Class Definition
  // ============================================
  class PauseMenuSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _screen = null;
    _player = null;
    _isActive = false;

    // Debounce ESC key
    _escKeyWasPressed = false;

    // Track active screens via events (Unity-style decoupling)
    _activeScreens = null;
    _suspendedScreens = null;
    _gameState = 'running';

    // Bound event handlers for screen state tracking
    _boundOnScreenOpened = null;
    _boundOnScreenClosed = null;
    _boundOnScreenSuspended = null;
    _boundOnScreenRequestOpen = null;
    _boundOnGameStateChanged = null;

    // Flag to skip ESC key on the frame we were opened from another screen
    _skipNextEscKey = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true;
      this._screen = new PauseMenuScreen();

      // Screen state event handlers (Unity-style decoupling)
      this._activeScreens = new Set();
      this._suspendedScreens = new Set();
      this._boundOnScreenOpened = this._onScreenOpened.bind(this);
      this._boundOnScreenClosed = this._onScreenClosed.bind(this);
      this._boundOnScreenSuspended = this._onScreenSuspended.bind(this);
      this._boundOnScreenRequestOpen = this._onScreenRequestOpen.bind(this);
      this._boundOnGameStateChanged = this._onGameStateChanged.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize with game and entity manager
     * @param {Object} game
     * @param {Object} entityManager
     */
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Listen for resolution change events
      events.on('settings:resolutionChanged', this._handleResolutionChange.bind(this));

      // Subscribe to screen state events (Unity-style decoupling)
      events.on('screen:opened', this._boundOnScreenOpened);
      events.on('screen:closed', this._boundOnScreenClosed);
      events.on('screen:suspended', this._boundOnScreenSuspended);
      events.on('screen:requestOpen', this._boundOnScreenRequestOpen);
      events.on('game:stateChanged', this._boundOnGameStateChanged);
    }

    /**
     * Set player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    // ----------------------------------------
    // Screen State Event Handlers (Unity-style decoupling)
    // ----------------------------------------
    /**
     * Handle screen opened event - track which screens are active
     * @param {Object} data - { screen: string }
     */
    _onScreenOpened(data) {
      if (data && data.screen && data.screen !== 'pausemenu') {
        this._activeScreens.add(data.screen);
        // If a screen opens, it's no longer suspended
        this._suspendedScreens.delete(data.screen);
      }
    }

    /**
     * Handle screen closed event
     * @param {Object} data - { screen: string }
     */
    _onScreenClosed(data) {
      if (data && data.screen) {
        this._activeScreens.delete(data.screen);
        this._suspendedScreens.delete(data.screen);
      }
    }

    /**
     * Handle screen suspended event
     * @param {Object} data - { screen: string }
     */
    _onScreenSuspended(data) {
      if (data && data.screen) {
        this._suspendedScreens.add(data.screen);
      }
    }

    /**
     * Handle request to open this screen
     * @param {Object} data - { screen: string, skipKey: boolean }
     */
    _onScreenRequestOpen(data) {
      if (data && data.screen === 'pausemenu') {
        this._openScreen(data.skipKey);
      }
    }

    /**
     * Handle game state change event
     * @param {Object} data - { state: string }
     */
    _onGameStateChanged(data) {
      if (data && data.state) {
        this._gameState = data.state;
      }
    }

    /**
     * Check if pause menu is active
     * @returns {boolean}
     */
    get isActive() {
      return this._isActive;
    }

    /**
     * Update - process ESC key and screen input
     * @param {number} deltaTime
     */
    update(deltaTime) {
      var input = this._game.input;

      // Handle ESC key toggle
      this._handleEscKey(input);

      // Handle screen input when active
      if (this._isActive && this._screen.isVisible) {
        var result = this._screen.handleInput(input);

        if (result) {
          this._handleAction(result);
        }
      }
    }

    /**
     * Render the pause menu
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (this._isActive && this._screen) {
        this._screen.render(ctx);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Handle ESC key press
     * @param {Object} input
     */
    _handleEscKey(input) {
      var isEscPressed = input.isKeyDown('Escape');

      // Detect key press (not held)
      if (isEscPressed && !this._escKeyWasPressed) {
        // Skip processing if we were just opened from another screen
        if (this._skipNextEscKey) {
          this._skipNextEscKey = false;
          this._escKeyWasPressed = isEscPressed;
          return;
        }

        if (this._isActive) {
          // Handle ESC navigation within the menu
          var result = this._screen.handleEscPress();
          if (result && result.action === 'close') {
            this._closeScreen();
          }
        } else if (!this._isAnotherScreenActive()) {
          this._openScreen();
        }
      }

      this._escKeyWasPressed = isEscPressed;
    }

    /**
     * Check if another modal screen is active (Unity-style - uses event tracking)
     * @returns {boolean}
     */
    _isAnotherScreenActive() {
      // Check tracked active screens (populated via screen:opened events)
      if (this._activeScreens.size > 0) {
        return true;
      }

      // Check game state (populated via game:stateChanged events)
      // Fall back to direct check if game state events not yet implemented
      if (this._gameState === 'game_over' || this._game._state === 'game_over') {
        return true;
      }

      return false;
    }

    /**
     * Open the pause menu
     * @param {boolean} skipEscKey - If true, skip ESC key processing on this frame
     */
    _openScreen(skipEscKey) {
      if (!this._player) return;

      // Set flag to skip ESC key on same frame if opened from another screen
      if (skipEscKey) {
        this._skipNextEscKey = true;
      }

      this._game.pause();
      this._isActive = true;
      this._screen.show(
        this._player,
        this._game,
        this._game.width,
        this._game.height
      );

      // Emit screen:opened event (Unity-style decoupling)
      events.emitSync('screen:opened', { screen: 'pausemenu' });
      events.emit('pausemenu:opened', {});
    }

    /**
     * Close the pause menu
     */
    _closeScreen() {
      this._screen.hide();
      this._isActive = false;

      // Emit screen:closed event (Unity-style decoupling)
      events.emitSync('screen:closed', { screen: 'pausemenu' });

      // Check if level-up screen was suspended - if so, request resume via event
      if (this._suspendedScreens.has('levelup')) {
        events.emitSync('screen:requestResume', { screen: 'levelup' });
      } else {
        this._game.resume();
      }

      events.emit('pausemenu:closed', {});
    }

    /**
     * Handle action from screen
     * @param {Object} result
     */
    _handleAction(result) {
      if (!result) return;

      switch (result.action) {
        case 'continue':
          this._closeScreen();
          break;
      }
    }

    /**
     * Handle resolution change event
     * @param {Object} data
     */
    _handleResolutionChange(data) {
      if (!data || !data.width || !data.height) return;

      // Update game canvas size
      if (this._game && this._game._canvas) {
        this._game._canvas.width = data.width;
        this._game._canvas.height = data.height;
        this._game._width = data.width;
        this._game._height = data.height;

        // Update UIScale for all UI elements
        window.VampireSurvivors.Core.UIScale.update(data.width, data.height);

        // Update screen if visible
        if (this._isActive && this._screen.isVisible) {
          this._screen.show(
            this._player,
            this._game,
            data.width,
            data.height
          );
        }
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        name: 'PauseMenuSystem',
        isActive: this._isActive,
        currentView: this._screen ? this._screen._currentView : 'none',
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      // Unsubscribe from screen state events
      events.off('screen:opened', this._boundOnScreenOpened);
      events.off('screen:closed', this._boundOnScreenClosed);
      events.off('screen:suspended', this._boundOnScreenSuspended);
      events.off('screen:requestOpen', this._boundOnScreenRequestOpen);
      events.off('game:stateChanged', this._boundOnGameStateChanged);

      if (this._screen) {
        this._screen.dispose();
        this._screen = null;
      }
      this._player = null;
      this._activeScreens = null;
      this._suspendedScreens = null;
      this._boundOnScreenOpened = null;
      this._boundOnScreenClosed = null;
      this._boundOnScreenSuspended = null;
      this._boundOnScreenRequestOpen = null;
      this._boundOnGameStateChanged = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.PauseMenuSystem = PauseMenuSystem;
})(window.VampireSurvivors.Systems);
