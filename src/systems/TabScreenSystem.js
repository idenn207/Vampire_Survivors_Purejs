/**
 * @fileoverview TabScreenSystem - handles Tab key toggle and tab screen lifecycle
 * @module Systems/TabScreenSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var TabScreen = window.VampireSurvivors.UI.TabScreen;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 116; // After LevelUpSystem (115), before GameOverSystem (120)
  var TAB_KEY_CODE = 9; // Tab key

  // ============================================
  // Class Definition
  // ============================================
  class TabScreenSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _screen = null;
    _player = null;
    _isActive = false;

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

    // Flag to skip Tab key on the frame we were opened from another screen
    _skipNextTabKey = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true;
      this._screen = new TabScreen();

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
      if (data && data.screen && data.screen !== 'tabscreen') {
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
      if (data && data.screen === 'tabscreen') {
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
     * Check if tab screen is active
     * @returns {boolean}
     */
    get isActive() {
      return this._isActive;
    }

    /**
     * Update - process Tab key and screen input
     * @param {number} deltaTime
     */
    update(deltaTime) {
      var input = this._game.input;

      // Handle Tab key toggle
      this._handleTabKey(input);

      // Handle screen input when active
      if (this._isActive && this._screen.isVisible) {
        var result = this._screen.handleInput(input);

        if (result) {
          this._handleAction(result);
        }
      }
    }

    /**
     * Render the tab screen
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
     * Handle Tab key press
     * @param {Object} input
     */
    _handleTabKey(input) {
      // Use isKeyPressed for single-frame detection (not isKeyDown which checks held state)
      if (input.isKeyPressed('Tab')) {
        // Skip processing if we were just opened from another screen
        if (this._skipNextTabKey) {
          this._skipNextTabKey = false;
          return;
        }

        if (this._isActive) {
          this._closeScreen();
        } else if (!this._isAnotherScreenActive()) {
          this._openScreen();
        }
      }
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
     * Open the tab screen
     * @param {boolean} skipTabKey - If true, skip Tab key processing on this frame
     */
    _openScreen(skipTabKey) {
      if (!this._player) return;

      // Set flag to skip Tab key on same frame if opened from another screen
      if (skipTabKey) {
        this._skipNextTabKey = true;
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
      events.emitSync('screen:opened', { screen: 'tabscreen' });
      events.emit('tabscreen:opened', {});
    }

    /**
     * Close the tab screen
     */
    _closeScreen() {
      this._screen.hide();
      this._isActive = false;

      // Emit screen:closed event (Unity-style decoupling)
      events.emitSync('screen:closed', { screen: 'tabscreen' });

      // Check if level-up screen was suspended - if so, request resume via event
      if (this._suspendedScreens.has('levelup')) {
        events.emitSync('screen:requestResume', { screen: 'levelup' });
      } else if (!this._isAnotherScreenActive()) {
        // Only resume game if no other screen is active
        this._game.resume();
      }

      events.emit('tabscreen:closed', {});
    }

    /**
     * Handle action from screen
     * @param {Object} result
     */
    _handleAction(result) {
      if (!result) return;

      if (result.action === 'close') {
        this._closeScreen();
      }
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
  Systems.TabScreenSystem = TabScreenSystem;
})(window.VampireSurvivors.Systems);
