/**
 * @fileoverview CoreSelectionSystem - handles pre-game core selection
 * @module Systems/CoreSelectionSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var events = window.VampireSurvivors.Core.events;
  var TechCoreData = window.VampireSurvivors.Data.TechCoreData;
  var CoreWeaponData = window.VampireSurvivors.Data.CoreWeaponData;
  var TechTree = window.VampireSurvivors.Components.TechTree;
  var Weapon = window.VampireSurvivors.Components.Weapon;
  var CoreSelectionScreen = window.VampireSurvivors.UI.CoreSelectionScreen;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 1; // Very early - before game starts
  var CORES_TO_SHOW = 5; // Number of cores to display

  // ============================================
  // Class Definition
  // ============================================
  class CoreSelectionSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _screen = null;
    _isActive = false;
    _availableCores = [];
    _selectedCore = null;
    _onCoreSelected = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true;
      this._screen = new CoreSelectionScreen();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize the system
     * @param {Game} game
     * @param {EntityManager} entityManager
     */
    initialize(game, entityManager) {
      super.initialize(game, entityManager);
    }

    /**
     * Start core selection flow
     * @param {Function} callback - Called with selected core ID
     */
    startSelection(callback) {
      this._onCoreSelected = callback;
      this._isActive = true;

      // Get random cores
      this._availableCores = TechCoreData.getRandomCores(CORES_TO_SHOW);

      // Pause game and show screen
      this._game.pause();

      // Emit screen:opened event (Unity-style decoupling)
      events.emitSync('screen:opened', { screen: 'coreselection' });

      this._screen.show(this._availableCores, this._game.width, this._game.height);

      console.log('[CoreSelectionSystem] Selection started with ' + this._availableCores.length + ' cores');
    }

    /**
     * Update system
     * @param {number} deltaTime
     */
    update(deltaTime) {
      if (!this._isActive || !this._screen.isVisible) return;

      var input = this._game.input;
      var result = this._screen.handleInput(input);

      if (result && result.action === 'select') {
        this._handleCoreSelection(result.coreId);
      }
    }

    /**
     * Render system
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (this._screen && this._screen.isVisible) {
        this._screen.render(ctx);
      }
    }

    /**
     * Setup player with selected core
     * @param {Entity} player
     * @param {string} coreId
     */
    setupPlayerWithCore(player, coreId) {
      // Add TechTree component
      var techTree = new TechTree(coreId);
      player.addComponent(techTree);

      // Get core data
      var coreData = TechCoreData.getCoreData(coreId);
      if (!coreData) {
        console.error('[CoreSelectionSystem] Core not found: ' + coreId);
        return;
      }

      // Get weapon data from CoreWeaponData
      var weaponData = CoreWeaponData[coreData.startingWeapon];
      if (weaponData) {
        var weapon = new Weapon(weaponData);
        player.weaponSlot.addWeapon(weapon);
        console.log('[CoreSelectionSystem] Added starting weapon: ' + weaponData.name);
      } else {
        console.warn('[CoreSelectionSystem] Starting weapon not found: ' + coreData.startingWeapon);
      }

      events.emitSync('core:setup_complete', {
        coreId: coreId,
        player: player,
        coreName: coreData.name,
      });

      console.log('[CoreSelectionSystem] Player setup with core: ' + coreData.name);
    }

    /**
     * Get the selected core ID
     * @returns {string|null}
     */
    getSelectedCoreId() {
      return this._selectedCore;
    }

    /**
     * Check if selection is active
     * @returns {boolean}
     */
    isSelectionActive() {
      return this._isActive;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Handle core selection
     * @param {string} coreId
     */
    _handleCoreSelection(coreId) {
      this._selectedCore = coreId;
      this._screen.hide();
      this._isActive = false;

      // Emit screen:closed event (Unity-style decoupling)
      events.emitSync('screen:closed', { screen: 'coreselection' });

      var coreData = TechCoreData.getCoreData(coreId);
      console.log('[CoreSelectionSystem] Selected core: ' + (coreData ? coreData.name : coreId));

      if (this._onCoreSelected) {
        this._onCoreSelected(coreId);
      }

      events.emitSync('core:selected', {
        coreId: coreId,
        coreData: coreData,
      });
    }

    // ----------------------------------------
    // Debug Info
    // ----------------------------------------
    getDebugInfo() {
      return {
        name: 'CoreSelectionSystem',
        isActive: this._isActive,
        selectedCore: this._selectedCore,
        availableCores: this._availableCores.map(function (c) {
          return c.id;
        }),
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._screen = null;
      this._availableCores = [];
      this._onCoreSelected = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.CoreSelectionSystem = CoreSelectionSystem;
})(window.VampireSurvivors.Systems = window.VampireSurvivors.Systems || {});
