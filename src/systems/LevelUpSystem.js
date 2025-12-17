/**
 * @fileoverview Level-up system - orchestrates level-up menu and upgrade flow
 * @module Systems/LevelUpSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var LevelUpScreen = window.VampireSurvivors.UI.LevelUpScreen;
  var events = window.VampireSurvivors.Core.events;
  var Data = window.VampireSurvivors.Data;
  var Weapon = window.VampireSurvivors.Components.Weapon;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 115; // After HUDSystem (110)
  var OPTIONS_COUNT = 3;

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

    // Event handlers
    _boundOnLevelUp = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true; // Process input even when game is paused
      this._screen = new LevelUpScreen();
      this._boundOnLevelUp = this._onLevelUp.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Listen for level-up events only (no manual access)
      events.on('player:level_up', this._boundOnLevelUp);
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
      if (this._isActive) return; // Already showing

      this._openedManually = false;
      this._openScreen();
    }

    _openScreen() {
      // Pause the game
      this._game.pause();
      this._isActive = true;

      // Generate weapon options
      var options = this._generateWeaponOptions();

      // Show screen
      this._screen.show(this._player, options, this._game.width, this._game.height);
    }

    _generateWeaponOptions() {
      var options = [];
      var pool = [];

      if (!this._player || !this._player.weaponSlot) {
        return options;
      }

      var weaponSlot = this._player.weaponSlot;
      var equippedWeapons = weaponSlot.weapons || [];
      var equippedIds = equippedWeapons.map(function (w) {
        return w.id;
      });

      // Check if all slots full and all max level
      var allSlotsFull = weaponSlot.isFull;
      var allWeaponsMaxLevel =
        allSlotsFull &&
        equippedWeapons.every(function (w) {
          return w.isMaxLevel;
        });

      // 1. Check for evolution possibilities FIRST (HIGHEST PRIORITY - always shown)
      var evolutionOptions = this._generateEvolutionOptions(equippedWeapons);
      for (var e = 0; e < evolutionOptions.length && options.length < OPTIONS_COUNT; e++) {
        options.push(evolutionOptions[e]);
      }

      // If we already have enough options from evolutions, return early
      if (options.length >= OPTIONS_COUNT) {
        return options;
      }

      // 2. If all slots full AND all max level -> add stat boosts
      if (allWeaponsMaxLevel) {
        var statOrder = Data.StatUpgradeData.getStatOrder();
        for (var s = 0; s < statOrder.length; s++) {
          var statId = statOrder[s];
          var statConfig = Data.StatUpgradeData.getStatConfig(statId);
          if (statConfig) {
            pool.push({
              type: 'stat',
              statId: statId,
              statConfig: statConfig,
            });
          }
        }
        this._shuffle(pool);
        // Fill remaining slots with stat boosts
        for (var p = 0; p < pool.length && options.length < OPTIONS_COUNT; p++) {
          options.push(pool[p]);
        }
        return options;
      }

      // 3. New weapons (if player has empty slots)
      if (!allSlotsFull) {
        var allWeaponIds = Data.getAllWeaponIds();
        for (var i = 0; i < allWeaponIds.length; i++) {
          var weaponId = allWeaponIds[i];
          if (equippedIds.indexOf(weaponId) === -1) {
            var weaponData = Data.getWeaponData(weaponId);
            if (weaponData) {
              pool.push({
                type: 'new',
                weaponId: weaponId,
                weaponData: weaponData,
              });
            }
          }
        }
      }

      // 4. Existing weapon upgrades (for weapons not at max level)
      for (var j = 0; j < equippedWeapons.length; j++) {
        var weapon = equippedWeapons[j];
        if (!weapon.isMaxLevel) {
          pool.push({
            type: 'upgrade',
            weaponId: weapon.id,
            weaponData: weapon.data,
            currentLevel: weapon.level,
            weaponRef: weapon,
          });
        }
      }

      // Shuffle and fill remaining slots
      this._shuffle(pool);
      for (var n = 0; n < pool.length && options.length < OPTIONS_COUNT; n++) {
        options.push(pool[n]);
      }

      return options;
    }

    /**
     * Generate evolution options from max-level weapons
     * @param {Array<Weapon>} equippedWeapons
     * @returns {Array<Object>}
     */
    _generateEvolutionOptions(equippedWeapons) {
      var WeaponEvolutionData = Data.WeaponEvolutionData;
      if (!WeaponEvolutionData) {
        return [];
      }

      var options = [];
      var maxLevelWeapons = [];

      // Find all max-level weapons
      for (var i = 0; i < equippedWeapons.length; i++) {
        if (equippedWeapons[i].isMaxLevel) {
          maxLevelWeapons.push(equippedWeapons[i]);
        }
      }

      // Check all pairs of max-level weapons for evolution recipes
      for (var j = 0; j < maxLevelWeapons.length; j++) {
        for (var k = j + 1; k < maxLevelWeapons.length; k++) {
          var w1 = maxLevelWeapons[j];
          var w2 = maxLevelWeapons[k];
          var evolved = WeaponEvolutionData.findEvolution(w1.id, w2.id);

          if (evolved) {
            options.push({
              type: 'evolution',
              weapon1: w1,
              weapon2: w2,
              weaponId: evolved.id,
              weaponData: evolved,
              evolutionResult: evolved,
            });
          }
        }
      }

      return options;
    }

    _shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
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

    _handleWeaponSelection(option) {
      if (!option) return;

      switch (option.type) {
        case 'new':
          this._addNewWeapon(option);
          break;

        case 'upgrade':
          this._upgradeExistingWeapon(option);
          break;

        case 'stat':
          this._applyFreeStat(option);
          break;

        case 'evolution':
          this._performEvolution(option);
          break;
      }
    }

    _addNewWeapon(option) {
      if (!this._player || !this._player.weaponSlot) return;

      var newWeapon = new Weapon(option.weaponData);
      this._player.weaponSlot.addWeapon(newWeapon);

      events.emitSync('upgrade:weapon_added', {
        weaponId: option.weaponId,
        weapon: newWeapon,
      });
    }

    _upgradeExistingWeapon(option) {
      if (!option.weaponRef) return;

      option.weaponRef.upgrade();

      events.emitSync('upgrade:weapon_leveled', {
        weaponId: option.weaponId,
        newLevel: option.weaponRef.level,
      });
    }

    _applyFreeStat(option) {
      if (!this._player || !this._player.playerStats) return;

      var playerStats = this._player.playerStats;
      playerStats.applyFreeUpgrade(option.statId);

      // Apply immediate effects
      this._applyStatEffect(option.statId);

      events.emitSync('upgrade:free_stat_applied', {
        statId: option.statId,
      });
    }

    _applyStatEffect(statId) {
      if (!this._player || !this._player.playerStats) return;

      var playerStats = this._player.playerStats;

      switch (statId) {
        case 'maxHealth':
          var health = this._player.health;
          if (health) {
            var baseMax = 100;
            var newMax = Math.floor(baseMax * playerStats.getMultiplier('maxHealth'));
            var oldMax = health.maxHealth;
            health.setMaxHealth(newMax, false);
            health.heal(newMax - oldMax);
          }
          break;

        case 'moveSpeed':
          var baseSpeed = 200;
          this._player.speed = Math.floor(baseSpeed * playerStats.getMultiplier('moveSpeed'));
          break;
      }
    }

    _performEvolution(option) {
      if (!this._player || !this._player.weaponSlot) return;

      var weaponSlot = this._player.weaponSlot;

      // Remove source weapons (by ID)
      weaponSlot.removeWeapon(option.weapon1.id);
      weaponSlot.removeWeapon(option.weapon2.id);

      // Create and add evolved weapon
      var evolvedWeapon = new Weapon(option.evolutionResult);
      weaponSlot.addWeapon(evolvedWeapon);

      // Emit evolution completed event
      events.emitSync('upgrade:evolution_completed', {
        source1: option.weapon1.id,
        source2: option.weapon2.id,
        result: option.evolutionResult.id,
        evolvedWeapon: evolvedWeapon,
      });
    }

    _handleWeaponUpgrade(result) {
      if (result.success) {
        events.emitSync('upgrade:weapon_purchased', {
          weapon: result.weapon,
          cost: result.cost,
        });
      }
    }

    _closeScreen() {
      this._screen.hide();
      this._isActive = false;
      this._openedManually = false;
      this._game.resume();

      events.emitSync('levelup:screen_closed', {});
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
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('player:level_up', this._boundOnLevelUp);

      if (this._screen) {
        this._screen.dispose();
        this._screen = null;
      }

      this._player = null;
      this._boundOnLevelUp = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.LevelUpSystem = LevelUpSystem;
})(window.VampireSurvivors.Systems);
