/**
 * @fileoverview Level-up system - orchestrates level-up menu and upgrade flow
 * @module Systems/LevelUp/LevelUpSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var LevelUpScreen = window.VampireSurvivors.UI.LevelUpScreen;
  var events = window.VampireSurvivors.Core.events;
  var BlacklistManager = window.VampireSurvivors.Managers.BlacklistManager;
  var WeaponSlot = window.VampireSurvivors.Components.WeaponSlot;

  // Import modular handlers
  var LevelUpConstants = Systems.LevelUpConstants;
  var EvolutionState = Systems.EvolutionState;
  var OptionGenerator = Systems.OptionGenerator;
  var UpgradeProcessor = Systems.UpgradeProcessor;
  var EvolutionHandler = Systems.EvolutionHandler;

  // ============================================
  // Class Definition
  // ============================================
  class LevelUpSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _screen = null;
    _player = null;
    _isActive = false;
    _openedManually = false;

    // Pending level-ups queue (for multi-level scenarios)
    _pendingLevelUps = 0;

    // Evolution state
    _evolutionState = EvolutionState.NORMAL;
    _selectedMainWeapon = null;
    _evolutionEligibility = null;

    // Blacklist manager (weapons used as main in evolution)
    _blacklistManager = null;

    // Current wave (for tier-based weapon filtering)
    _currentWave = 1;

    // Event handlers
    _boundOnLevelUp = null;
    _boundOnGameStart = null;
    _boundOnWaveStarted = null;

    // Debounce keys
    _tabKeyWasPressed = false;
    _escKeyWasPressed = false;

    // References to other screen systems
    _tabScreenSystem = null;
    _pauseMenuSystem = null;

    // Suspended state (when Tab/ESC opens another screen)
    _isSuspended = false;
    _savedWeaponOptions = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = LevelUpConstants.PRIORITY;
      this._updatesDuringPause = true;
      this._screen = new LevelUpScreen();
      this._blacklistManager = new BlacklistManager();
      this._boundOnLevelUp = this._onLevelUp.bind(this);
      this._boundOnGameStart = this._onGameStart.bind(this);
      this._boundOnWaveStarted = this._onWaveStarted.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      events.on('player:level_up', this._boundOnLevelUp);
      events.on('game:start', this._boundOnGameStart);
      events.on('wave:started', this._boundOnWaveStarted);
    }

    /**
     * Handle game start - reset blacklist and pending level-ups for new run
     */
    _onGameStart() {
      if (this._blacklistManager) {
        this._blacklistManager.reset();
      }
      this._pendingLevelUps = 0;
      this._currentWave = 1;
      this._tabKeyWasPressed = false;
      this._escKeyWasPressed = false;
      this._isSuspended = false;
      this._savedWeaponOptions = null;
    }

    /**
     * Handle wave started event
     * @param {Object} data - Event data with wave number
     */
    _onWaveStarted(data) {
      this._currentWave = data.wave || 1;
    }

    /**
     * Set player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Set reference to TabScreenSystem
     * @param {Object} tabScreenSystem
     */
    setTabScreenSystem(tabScreenSystem) {
      this._tabScreenSystem = tabScreenSystem;
    }

    /**
     * Set reference to PauseMenuSystem
     * @param {Object} pauseMenuSystem
     */
    setPauseMenuSystem(pauseMenuSystem) {
      this._pauseMenuSystem = pauseMenuSystem;
    }

    update(deltaTime) {
      if (!this._isActive || !this._screen.isVisible) return;

      var input = this._game.input;

      // Handle keyboard input (Tab and ESC to close)
      this._handleKeyboardInput(input);

      // Handle mouse input
      var result = this._screen.handleInput(input);

      if (result) {
        this._handleAction(result);
      }
    }

    /**
     * Handle keyboard input for Tab and ESC keys
     * @param {Object} input
     */
    _handleKeyboardInput(input) {
      // Handle Tab key - open Tab screen
      var isTabPressed = input.isKeyDown('Tab');
      if (isTabPressed && !this._tabKeyWasPressed) {
        this._tabKeyWasPressed = true; // Save debounce state before returning
        this._closeScreenAndOpenTab();
        return;
      }
      this._tabKeyWasPressed = isTabPressed;

      // Handle ESC key - open Pause Menu
      var isEscPressed = input.isKeyDown('Escape');
      if (isEscPressed && !this._escKeyWasPressed) {
        this._escKeyWasPressed = true; // Save debounce state before returning
        this._closeScreenAndOpenPauseMenu();
        return;
      }
      this._escKeyWasPressed = isEscPressed;
    }

    /**
     * Suspend level-up screen and open Tab screen
     * Screen stays "active" but hidden, will resume when Tab screen closes
     */
    _closeScreenAndOpenTab() {
      // Save weapon options before hide() clears them
      this._savedWeaponOptions = this._screen._weaponOptions || [];
      this._screen.hide();
      this._isSuspended = true;
      // Keep _isActive = true so we know to resume

      // Open Tab screen (game stays paused)
      // Pass true to skip Tab key on same frame
      if (this._tabScreenSystem) {
        this._tabScreenSystem._openScreen(true);
      }
    }

    /**
     * Suspend level-up screen and open Pause Menu
     * Screen stays "active" but hidden, will resume when Pause screen closes
     */
    _closeScreenAndOpenPauseMenu() {
      // Save weapon options before hide() clears them
      this._savedWeaponOptions = this._screen._weaponOptions || [];
      this._screen.hide();
      this._isSuspended = true;
      // Keep _isActive = true so we know to resume

      // Open Pause Menu (game stays paused)
      // Pass true to skip ESC key on same frame
      if (this._pauseMenuSystem) {
        this._pauseMenuSystem._openScreen(true);
      }
    }

    render(ctx) {
      if (this._screen && this._screen.isVisible) {
        this._screen.render(ctx);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onLevelUp(data) {
      if (!this._player) return;

      this._pendingLevelUps++;

      if (this._isActive) return;

      this._openedManually = false;
      this._openScreen();
    }

    _openScreen() {
      this._game.pause();
      this._isActive = true;
      this._isSuspended = false;

      // Reset evolution state
      this._evolutionState = EvolutionState.NORMAL;
      this._selectedMainWeapon = null;

      // Check evolution eligibility
      this._evolutionEligibility = OptionGenerator.checkEvolutionEligibility(this._player);

      // Generate options
      var options = OptionGenerator.generateOptions(
        this._player,
        this._evolutionState,
        this._selectedMainWeapon,
        this._blacklistManager,
        this._currentWave
      );

      // Show screen
      this._screen.show(
        this._player,
        options,
        this._game.width,
        this._game.height,
        {
          evolutionState: this._evolutionState,
          selectedMainWeapon: this._selectedMainWeapon,
        },
        this._evolutionEligibility,
        this._pendingLevelUps
      );
    }

    _handleAction(result) {
      switch (result.type) {
        case 'stat_upgrade':
          this._handleStatUpgrade(result.result);
          break;

        case 'weapon_selection':
          this._handleWeaponSelection(result.result);
          if (result.closesScreen) {
            this._closeScreen();
          }
          break;

        case 'weapon_upgrade':
          this._handleWeaponUpgrade(result.result);
          break;

        case 'evolution':
          this._handleTierEvolution(result.result);
          if (result.closesScreen) {
            this._closeScreen();
          }
          break;

        case 'tech_upgrade':
          this._handleTechUpgrade(result.result);
          // Tech upgrade should NOT reroll weapon options
          return;
      }
    }

    _handleStatUpgrade(result) {
      if (result.success) {
        events.emitSync('upgrade:stat_purchased', {
          statId: result.statId,
          cost: result.cost,
        });
      }
    }

    _handleTechUpgrade(result) {
      if (result.success) {
        events.emitSync('upgrade:tech_purchased', {
          techId: result.techId,
          cost: result.cost,
          oldLevel: result.oldLevel,
          newLevel: result.newLevel,
        });
      }
    }

    _handleWeaponSelection(option) {
      if (!option) return;

      // Create state ref for handlers
      var stateRef = {
        evolutionState: this._evolutionState,
        selectedMainWeapon: this._selectedMainWeapon,
      };

      switch (option.type) {
        case 'new':
          UpgradeProcessor.addNewWeapon(this._player, option);
          break;

        case 'upgrade':
          UpgradeProcessor.upgradeExistingWeapon(option);
          // Check if evolution is possible after upgrade
          if (this._checkEvolutionReady()) {
            this._evolutionState = EvolutionState.TIER_EVOLUTION;
          }
          // Refresh screen with new options instead of closing
          this._refreshScreen();
          return;

        case 'stat':
          UpgradeProcessor.applyFreeStat(this._player, option);
          break;

        case 'evolution_main':
          EvolutionHandler.selectMainWeapon(option, stateRef);
          this._evolutionState = stateRef.evolutionState;
          this._selectedMainWeapon = stateRef.selectedMainWeapon;
          this._refreshScreen();
          return;

        case 'evolution_material':
          EvolutionHandler.performEvolution(this._player, option, this._selectedMainWeapon, stateRef);
          this._evolutionState = stateRef.evolutionState;
          this._selectedMainWeapon = stateRef.selectedMainWeapon;
          break;

        case 'evolution_cancel':
          EvolutionHandler.cancelEvolution(stateRef);
          this._evolutionState = stateRef.evolutionState;
          this._selectedMainWeapon = stateRef.selectedMainWeapon;
          this._refreshScreen();
          return;
      }
    }

    _handleTierEvolution(popupResult) {
      var stateRef = {
        evolutionState: this._evolutionState,
        selectedMainWeapon: this._selectedMainWeapon,
      };

      EvolutionHandler.handleTierEvolution(
        this._player,
        popupResult,
        this._blacklistManager,
        stateRef
      );

      this._evolutionState = stateRef.evolutionState;
      this._selectedMainWeapon = stateRef.selectedMainWeapon;
    }

    _handleWeaponUpgrade(result) {
      if (result.success) {
        events.emitSync('upgrade:weapon_purchased', {
          weapon: result.weapon,
          cost: result.cost,
        });

        // Check if evolution is now possible after coin upgrade
        this._evolutionEligibility = OptionGenerator.checkEvolutionEligibility(this._player);

        if (this._checkEvolutionReady()) {
          this._evolutionState = EvolutionState.TIER_EVOLUTION;
        }

        // Refresh screen to update eligibility and weapon display
        this._refreshScreen();
      }
    }

    /**
     * Refresh the screen with regenerated options
     */
    _refreshScreen() {
      var options = OptionGenerator.generateOptions(
        this._player,
        this._evolutionState,
        this._selectedMainWeapon,
        this._blacklistManager,
        this._currentWave
      );

      this._screen.show(
        this._player,
        options,
        this._game.width,
        this._game.height,
        {
          evolutionState: this._evolutionState,
          selectedMainWeapon: this._selectedMainWeapon,
        },
        this._evolutionEligibility,
        this._pendingLevelUps
      );
    }

    /**
     * Check if tier evolution is possible (2+ max-level weapons of same tier)
     * @returns {boolean}
     */
    _checkEvolutionReady() {
      if (!this._player) return false;

      var weaponSlot = this._player.getComponent(WeaponSlot);
      if (!weaponSlot) return false;

      var maxByTier = {};
      var weapons = weaponSlot.getWeapons();

      for (var i = 0; i < weapons.length; i++) {
        var w = weapons[i];
        if (w.level >= w.maxLevel) {
          var tier = w.tier || 1;
          maxByTier[tier] = (maxByTier[tier] || 0) + 1;
        }
      }

      // Check if any tier has 2+ max level weapons
      for (var t in maxByTier) {
        if (maxByTier[t] >= 2) return true;
      }
      return false;
    }

    _closeScreen() {
      this._screen.hide();
      this._isActive = false;
      this._openedManually = false;
      this._isSuspended = false;
      this._savedWeaponOptions = null;

      // Reset evolution state
      this._evolutionState = EvolutionState.NORMAL;
      this._selectedMainWeapon = null;

      this._pendingLevelUps--;

      events.emitSync('levelup:screen_closed', {});

      if (this._pendingLevelUps > 0) {
        this._openScreen();
      } else {
        this._game.resume();
      }
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isActive() {
      return this._isActive;
    }

    get isSuspended() {
      return this._isSuspended;
    }

    /**
     * Resume from suspended state (called when Tab/Pause screen closes)
     */
    resumeFromSuspend() {
      if (!this._isSuspended) return;

      this._isSuspended = false;
      this._screen.show(
        this._player,
        this._savedWeaponOptions || [],
        this._game.width,
        this._game.height,
        {
          evolutionState: this._evolutionState,
          selectedMainWeapon: this._selectedMainWeapon,
        },
        this._evolutionEligibility,
        this._pendingLevelUps
      );
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'Level-Up System',
        entries: [
          { key: 'Active', value: this._isActive ? 'Yes' : 'No' },
          { key: 'Manual Open', value: this._openedManually ? 'Yes' : 'No' },
          { key: 'Pending', value: this._pendingLevelUps },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('player:level_up', this._boundOnLevelUp);
      events.off('game:start', this._boundOnGameStart);
      events.off('wave:started', this._boundOnWaveStarted);

      if (this._screen) {
        this._screen.dispose();
        this._screen = null;
      }

      if (this._blacklistManager) {
        this._blacklistManager.dispose();
        this._blacklistManager = null;
      }

      this._player = null;
      this._boundOnLevelUp = null;
      this._boundOnGameStart = null;
      this._boundOnWaveStarted = null;
      this._evolutionEligibility = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.LevelUpSystem = LevelUpSystem;
})(window.VampireSurvivors.Systems);
