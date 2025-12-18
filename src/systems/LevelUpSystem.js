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
  var BlacklistManager = window.VampireSurvivors.Managers.BlacklistManager;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 115; // After HUDSystem (110)
  var OPTIONS_COUNT = 3;

  // ============================================
  // Evolution State Constants
  // ============================================
  var EvolutionState = Object.freeze({
    NORMAL: 'normal',
    SELECTING_MATERIAL: 'selecting_material',
  });

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
      this._priority = PRIORITY;
      this._updatesDuringPause = true; // Process input even when game is paused
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

      // Listen for level-up events only (no manual access)
      events.on('player:level_up', this._boundOnLevelUp);

      // Listen for game start to reset blacklist
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

      // Queue level-up (support for multi-level scenarios like boss kills)
      this._pendingLevelUps++;

      // If already showing, just queue the level-up
      if (this._isActive) return;

      this._openedManually = false;
      this._openScreen();
    }

    _openScreen() {
      // Pause the game
      this._game.pause();
      this._isActive = true;

      // Reset evolution state when opening screen
      this._evolutionState = EvolutionState.NORMAL;
      this._selectedMainWeapon = null;

      // Check evolution eligibility (tier-based)
      this._evolutionEligibility = this._checkEvolutionEligibility();

      // Generate weapon options
      var options = this._generateWeaponOptions();

      // Show screen with evolution state and eligibility
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

    _generateWeaponOptions() {
      // Different options based on evolution state
      if (this._evolutionState === EvolutionState.SELECTING_MATERIAL) {
        return this._generateMaterialOptions();
      }

      return this._generateNormalOptions();
    }

    /**
     * Generate normal weapon options (new weapons, upgrades, evolution main weapons)
     * @returns {Array<Object>}
     */
    _generateNormalOptions() {
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

      // Note: Old evolution_main options removed - now using tier-based evolution via EVOLVE WEAPON button

      // 1. If all slots full AND all max level -> add stat boosts
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

      // 2. New weapons (if player has empty slots)
      if (!allSlotsFull) {
        var allWeaponIds = Data.getAllWeaponIds();

        // Filter out blacklisted weapons
        if (this._blacklistManager) {
          allWeaponIds = this._blacklistManager.filterBlacklisted(allWeaponIds);
        }

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

      // Shuffle and fill remaining slots
      this._shuffle(pool);
      for (var n = 0; n < pool.length && options.length < OPTIONS_COUNT; n++) {
        options.push(pool[n]);
      }

      return options;
    }

    /**
     * Generate material weapon options for the selected main weapon
     * @returns {Array<Object>}
     */
    _generateMaterialOptions() {
      var options = [];

      if (!this._player || !this._player.weaponSlot || !this._selectedMainWeapon) {
        return options;
      }

      var WeaponEvolutionData = Data.WeaponEvolutionData;
      var weaponSlot = this._player.weaponSlot;
      var equippedWeapons = weaponSlot.weapons || [];
      var mainWeaponId = this._selectedMainWeapon.id;

      // Get all potential evolution partners for the main weapon
      var partnerIds = WeaponEvolutionData.getEvolutionPartners(mainWeaponId);

      // Find equipped weapons that are valid materials (max level, in partner list, not the main weapon)
      for (var i = 0; i < equippedWeapons.length; i++) {
        var weapon = equippedWeapons[i];

        // Skip if this is the main weapon
        if (weapon.id === mainWeaponId) continue;

        // Must be max level and in partner list
        if (weapon.isMaxLevel && partnerIds.indexOf(weapon.id) !== -1) {
          var evolved = WeaponEvolutionData.findEvolution(mainWeaponId, weapon.id);
          if (evolved) {
            options.push({
              type: 'evolution_material',
              weaponId: weapon.id,
              weaponData: weapon.data,
              weaponRef: weapon,
              mainWeapon: this._selectedMainWeapon,
              evolutionResult: evolved,
            });
          }
        }
      }

      // Add cancel option
      options.push({
        type: 'evolution_cancel',
      });

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

    /**
     * Check if tier-based evolution is available
     * Returns weapons grouped by tier that are at max level and can evolve
     * @returns {Object} { canEvolve: boolean, eligibleTiers: { [tier]: Weapon[] } }
     */
    _checkEvolutionEligibility() {
      var result = {
        canEvolve: false,
        eligibleTiers: {},
      };

      if (!this._player || !this._player.weaponSlot) {
        return result;
      }

      var weapons = this._player.weaponSlot.weapons || [];

      // Group weapons by tier that are at max level and below max tier
      for (var i = 0; i < weapons.length; i++) {
        var weapon = weapons[i];
        if (!weapon) continue;

        // Must be at max level
        if (weapon.level < weapon.maxLevel) continue;

        // Must be below max tier
        if (weapon.tier >= weapon.maxTier) continue;

        var tier = weapon.tier;
        if (!result.eligibleTiers[tier]) {
          result.eligibleTiers[tier] = [];
        }
        result.eligibleTiers[tier].push(weapon);
      }

      // Check if any tier has 2+ weapons
      for (var t in result.eligibleTiers) {
        if (result.eligibleTiers[t].length >= 2) {
          result.canEvolve = true;
          break;
        }
      }

      return result;
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

        case 'evolution_main':
          this._selectMainWeapon(option);
          return; // Don't close screen - wait for material selection

        case 'evolution_material':
          this._performEvolution(option);
          break;

        case 'evolution_cancel':
          this._cancelEvolution();
          return; // Don't close screen - go back to normal selection
      }
    }

    /**
     * Select a weapon as the main weapon for evolution
     * @param {Object} option
     */
    _selectMainWeapon(option) {
      this._selectedMainWeapon = option.weaponRef;
      this._evolutionState = EvolutionState.SELECTING_MATERIAL;

      // Regenerate options for material selection
      var materialOptions = this._generateWeaponOptions();

      // Update screen with new options and state
      this._screen.show(this._player, materialOptions, this._game.width, this._game.height, {
        evolutionState: this._evolutionState,
        selectedMainWeapon: this._selectedMainWeapon,
      });

      events.emitSync('evolution:main_selected', {
        weaponId: option.weaponId,
        weapon: option.weaponRef,
      });
    }

    /**
     * Cancel evolution and return to normal selection
     */
    _cancelEvolution() {
      this._evolutionState = EvolutionState.NORMAL;
      this._selectedMainWeapon = null;

      // Regenerate normal options
      var normalOptions = this._generateWeaponOptions();

      // Update screen
      this._screen.show(this._player, normalOptions, this._game.width, this._game.height, {
        evolutionState: this._evolutionState,
        selectedMainWeapon: this._selectedMainWeapon,
      });

      events.emitSync('evolution:cancelled', {});
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

      // Get main weapon from stored selection and material from option
      var mainWeapon = option.mainWeapon || this._selectedMainWeapon;
      var materialWeapon = option.weaponRef;

      if (!mainWeapon || !materialWeapon) {
        console.warn('[LevelUpSystem] Evolution failed - missing weapons');
        return;
      }

      // Remove source weapons (by ID)
      weaponSlot.removeWeapon(mainWeapon.id);
      weaponSlot.removeWeapon(materialWeapon.id);

      // Create and add evolved weapon
      var evolvedWeapon = new Weapon(option.evolutionResult);
      weaponSlot.addWeapon(evolvedWeapon);

      // Reset evolution state
      this._evolutionState = EvolutionState.NORMAL;
      this._selectedMainWeapon = null;

      // Emit evolution completed event
      events.emitSync('upgrade:evolution_completed', {
        mainWeapon: mainWeapon.id,
        materialWeapon: materialWeapon.id,
        result: option.evolutionResult.id,
        evolvedWeapon: evolvedWeapon,
      });
    }

    /**
     * Handle tier-based evolution from the EvolutionPopup
     * @param {Object} popupResult - Result from EvolutionPopup
     */
    _handleTierEvolution(popupResult) {
      if (!this._player || !this._player.weaponSlot) return;

      var weaponSlot = this._player.weaponSlot;
      var mainWeapon = popupResult.mainWeapon;
      var materialWeapon = popupResult.materialWeapon;
      var isKnownRecipe = popupResult.isKnownRecipe;
      var evolutionResult = popupResult.evolutionResult;

      if (!mainWeapon || !materialWeapon) {
        console.warn('[LevelUpSystem] Tier evolution failed - missing weapons');
        return;
      }

      // Add main weapon to blacklist (won't appear in level-up options again this run)
      if (this._blacklistManager) {
        this._blacklistManager.addToBlacklist(mainWeapon.id);
      }

      // Remove source weapons (by ID)
      weaponSlot.removeWeapon(mainWeapon.id);
      weaponSlot.removeWeapon(materialWeapon.id);

      // Determine the evolved weapon
      var evolvedWeaponData;

      if (isKnownRecipe && evolutionResult && !evolutionResult.isRandom) {
        // Known recipe - use the predefined evolved weapon
        evolvedWeaponData = evolutionResult;
      } else {
        // Unknown recipe - get a random weapon of the next tier that player doesn't own
        var currentTier = mainWeapon.tier;
        var nextTier = currentTier + 1;

        // Get currently owned weapon IDs
        var ownedIds = weaponSlot.weapons.map(function (w) {
          return w.id;
        });
        ownedIds.push(mainWeapon.id);
        ownedIds.push(materialWeapon.id);

        var WeaponEvolutionData = Data.WeaponEvolutionData;
        evolvedWeaponData = WeaponEvolutionData.getRandomUnownedWeaponOfTier(ownedIds, nextTier);

        if (!evolvedWeaponData) {
          // Fallback - get any weapon of the next tier
          var tierWeapons = WeaponEvolutionData.getAllWeaponsOfTier(nextTier);
          if (tierWeapons.length > 0) {
            evolvedWeaponData = tierWeapons[Math.floor(Math.random() * tierWeapons.length)];
          }
        }
      }

      if (!evolvedWeaponData) {
        console.warn('[LevelUpSystem] Tier evolution failed - no evolved weapon data');
        return;
      }

      // Create and add evolved weapon
      var evolvedWeapon = new Weapon(evolvedWeaponData);
      weaponSlot.addWeapon(evolvedWeapon);

      // Reset evolution state
      this._evolutionState = EvolutionState.NORMAL;
      this._selectedMainWeapon = null;

      // Emit evolution completed event
      events.emitSync('upgrade:tier_evolution_completed', {
        mainWeapon: mainWeapon.id,
        materialWeapon: materialWeapon.id,
        result: evolvedWeaponData.id,
        evolvedWeapon: evolvedWeapon,
        isKnownRecipe: isKnownRecipe,
        fromTier: mainWeapon.tier,
        toTier: evolvedWeapon.tier,
      });

      console.log('[LevelUpSystem] Tier evolution completed:', mainWeapon.id, '+', materialWeapon.id, '->', evolvedWeaponData.id);
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

      // Reset evolution state
      this._evolutionState = EvolutionState.NORMAL;
      this._selectedMainWeapon = null;

      // Decrement pending level-ups counter
      this._pendingLevelUps--;

      events.emitSync('levelup:screen_closed', {});

      // Check if there are more pending level-ups (multi-level scenario)
      if (this._pendingLevelUps > 0) {
        // Show screen again for the next level-up
        this._openScreen();
      } else {
        // No more pending level-ups, resume game
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
