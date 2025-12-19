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

    // Event handlers
    _boundOnLevelUp = null;
    _boundOnGameStart = null;

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
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      events.on('player:level_up', this._boundOnLevelUp);
      events.on('game:start', this._boundOnGameStart);
    }

    /**
     * Handle game start - reset blacklist and pending level-ups for new run
     */
    _onGameStart() {
      if (this._blacklistManager) {
        this._blacklistManager.reset();
      }
      this._pendingLevelUps = 0;
    }

    /**
     * Set player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    update(deltaTime) {
      if (!this._isActive || !this._screen.isVisible) return;

      var input = this._game.input;
      var result = this._screen.handleInput(input);

      if (result) {
        this._handleAction(result);
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
        this._blacklistManager
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
        this._evolutionEligibility
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
          break;
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
          break;

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
        this._blacklistManager
      );

      this._screen.show(this._player, options, this._game.width, this._game.height, {
        evolutionState: this._evolutionState,
        selectedMainWeapon: this._selectedMainWeapon,
      });
    }

    _closeScreen() {
      this._screen.hide();
      this._isActive = false;
      this._openedManually = false;

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
      this._evolutionEligibility = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.LevelUpSystem = LevelUpSystem;
})(window.VampireSurvivors.Systems);
