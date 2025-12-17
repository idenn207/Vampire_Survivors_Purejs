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
    _boundOnUpgradeKeyPressed = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._screen = new LevelUpScreen();
      this._boundOnLevelUp = this._onLevelUp.bind(this);
      this._boundOnUpgradeKeyPressed = this._onUpgradeKeyPressed.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(game, entityManager) {
      super.initialize(game, entityManager);

      // Listen for level-up events
      events.on('player:level_up', this._boundOnLevelUp);
      events.on('upgrade:open_screen', this._boundOnUpgradeKeyPressed);
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

    /**
     * Open screen manually (via 'U' key or button)
     */
    openManually() {
      if (this._isActive) return;
      this._openedManually = true;
      this._openScreen();
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

    _onUpgradeKeyPressed() {
      this.openManually();
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

      // 1. If all slots full AND all max level -> only stat boosts
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
        return pool.slice(0, OPTIONS_COUNT);
      }

      // 2. New weapons (if player has empty slots)
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

      // 3. Existing weapon upgrades (for weapons not at max level)
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

      // Shuffle and select
      this._shuffle(pool);
      for (var n = 0; n < OPTIONS_COUNT && n < pool.length; n++) {
        options.push(pool[n]);
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
      // Evolution logic will be implemented in Phase 2
      events.emitSync('upgrade:evolution_completed', {
        result: option.evolutionResult,
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
      events.off('upgrade:open_screen', this._boundOnUpgradeKeyPressed);

      if (this._screen) {
        this._screen.dispose();
        this._screen = null;
      }

      this._player = null;
      this._boundOnLevelUp = null;
      this._boundOnUpgradeKeyPressed = null;

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.LevelUpSystem = LevelUpSystem;
})(window.VampireSurvivors.Systems);
