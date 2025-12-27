/**
 * @fileoverview TechTreeSystem - manages tech unlocks, leveling, and effect application
 * @module Systems/TechTreeSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var events = window.VampireSurvivors.Core.events;
  var TechCoreData = window.VampireSurvivors.Data.TechCoreData;
  var TechEffectData = window.VampireSurvivors.Data.TechEffectData;
  var TechTree = window.VampireSurvivors.Components.TechTree;
  var TechUnlockPopup = window.VampireSurvivors.UI.TechUnlockPopup;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 112; // Between HUDSystem (110) and LevelUpSystem (115)
  var MIN_UNLOCK_CHOICES = 2;
  var MAX_UNLOCK_CHOICES = 3;
  var MAX_TECH_SKILLS = 5; // Maximum tech skills including base tech

  // ============================================
  // Class Definition
  // ============================================
  class TechTreeSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _techUnlockPopup = null;
    _isPopupActive = false;
    _pendingUnlockChoices = [];

    // Event handlers
    _boundOnBossDeath = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true;
      this._techUnlockPopup = new TechUnlockPopup();

      this._boundOnBossDeath = this._onBossDeath.bind(this);
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

      events.on('entity:died', this._boundOnBossDeath);
    }

    /**
     * Set player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Update system
     * @param {number} deltaTime
     */
    update(deltaTime) {
      if (!this._isPopupActive || !this._techUnlockPopup.isVisible) return;

      var input = this._game.input;
      var result = this._techUnlockPopup.handleInput(input);

      if (result) {
        this._handlePopupResult(result);
      }
    }

    /**
     * Render system
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (this._techUnlockPopup && this._techUnlockPopup.isVisible) {
        this._techUnlockPopup.render(ctx);
      }
    }

    /**
     * Upgrade a tech with gold
     * @param {string} techId
     * @returns {boolean} True if upgrade successful
     */
    upgradeTech(techId) {
      if (!this._player) return false;

      var techTree = this._player.getComponent(TechTree);
      var Gold = window.VampireSurvivors.Components.Gold;
      var gold = this._player.getComponent(Gold);

      if (!techTree || !gold) return false;

      // Check if can upgrade
      if (!techTree.canUpgradeTech(techId)) return false;

      // Get cost
      var cost = techTree.getUpgradeCost(techId);
      if (!gold.hasEnough(cost)) return false;

      // Get old level for effect update
      var oldLevel = techTree.getTechLevel(techId);

      // Spend gold and upgrade
      gold.spendGold(cost);
      techTree.upgradeTech(techId);

      var newLevel = techTree.getTechLevel(techId);

      // Update effects
      techTree.updateTechEffects(this._player, techId, oldLevel, newLevel);

      events.emitSync('tech:upgraded', {
        techId: techId,
        oldLevel: oldLevel,
        newLevel: newLevel,
        player: this._player,
      });

      console.log('[TechTreeSystem] Upgraded tech ' + techId + ' to level ' + newLevel);

      return true;
    }

    /**
     * Check if popup is active
     * @returns {boolean}
     */
    isPopupActive() {
      return this._isPopupActive;
    }

    // ----------------------------------------
    // Private Methods - Boss Death Handling
    // ----------------------------------------
    /**
     * Handle entity death event
     * @param {Object} data
     */
    _onBossDeath(data) {
      if (!data || !data.entity) return;

      // Only trigger for actual bosses (not elite or miniboss)
      if (!data.entity.hasTag || !data.entity.hasTag('boss_boss')) return;

      if (!this._player) return;

      var techTree = this._player.getComponent(TechTree);
      if (!techTree) return;

      // Check if already at max tech skills
      var unlockedCount = techTree.getAllUnlockedTechs().length;
      if (unlockedCount >= MAX_TECH_SKILLS) {
        console.log('[TechTreeSystem] Max tech skills reached (' + MAX_TECH_SKILLS + ')');
        return;
      }

      // Generate unlock choices
      var choices = this._generateUnlockChoices(techTree);

      // If no choices available, skip
      if (choices.length === 0) {
        console.log('[TechTreeSystem] No techs available to unlock');
        return;
      }

      // Pause game and show popup
      this._game.pause();
      this._isPopupActive = true;
      this._pendingUnlockChoices = choices;

      // Emit screen:opened event (Unity-style decoupling)
      events.emitSync('screen:opened', { screen: 'techtree' });

      this._techUnlockPopup.show(
        this._player,
        choices,
        this._game.width,
        this._game.height
      );

      console.log('[TechTreeSystem] Boss defeated! Showing ' + choices.length + ' tech choices');
    }

    /**
     * Generate unlock choices based on available techs
     * @param {TechTree} techTree
     * @returns {Array<Object>}
     */
    _generateUnlockChoices(techTree) {
      var availableTechs = techTree.getAvailableTechs();

      if (availableTechs.length === 0) {
        return [];
      }

      // Shuffle available techs
      this._shuffle(availableTechs);

      // Pick 2-3 random choices
      var count = Math.min(
        availableTechs.length,
        Math.random() < 0.5 ? MIN_UNLOCK_CHOICES : MAX_UNLOCK_CHOICES
      );

      return availableTechs.slice(0, count);
    }

    /**
     * Handle popup result
     * @param {Object} result
     */
    _handlePopupResult(result) {
      if (result.action === 'select') {
        var techId = result.techId;
        var techTree = this._player.getComponent(TechTree);

        if (techTree && techTree.unlockTech(techId)) {
          // Apply initial effects (level 1)
          techTree.applyTechEffects(this._player, techId, 1);

          var techData = TechCoreData.getTechById(techTree.getCoreId(), techId);

          events.emitSync('tech:unlocked', {
            techId: techId,
            techName: techData ? techData.name : techId,
            player: this._player,
          });

          console.log('[TechTreeSystem] Unlocked tech: ' + (techData ? techData.name : techId));
        }
      }

      // Close popup and resume
      this._techUnlockPopup.hide();
      this._isPopupActive = false;
      this._pendingUnlockChoices = [];

      // Emit screen:closed event (Unity-style decoupling)
      events.emitSync('screen:closed', { screen: 'techtree' });

      this._game.resume();
    }

    // ----------------------------------------
    // Utility Methods
    // ----------------------------------------
    /**
     * Fisher-Yates shuffle
     * @param {Array} array
     */
    _shuffle(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

    // ----------------------------------------
    // Debug Info
    // ----------------------------------------
    getDebugInfo() {
      var info = {
        name: 'TechTreeSystem',
        isPopupActive: this._isPopupActive,
        pendingChoices: this._pendingUnlockChoices.length,
      };

      if (this._player) {
        var techTree = this._player.getComponent(TechTree);
        if (techTree) {
          info.coreId = techTree.getCoreId();
          info.unlockedTechs = techTree.getAllUnlockedTechs().length;
          info.availableTechs = techTree.getAvailableTechs().length;
        }
      }

      return info;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('entity:died', this._boundOnBossDeath);
      this._techUnlockPopup = null;
      this._player = null;
      this._pendingUnlockChoices = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.TechTreeSystem = TechTreeSystem;
})(window.VampireSurvivors.Systems = window.VampireSurvivors.Systems || {});
