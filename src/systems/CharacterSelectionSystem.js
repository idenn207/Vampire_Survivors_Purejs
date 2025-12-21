/**
 * @fileoverview CharacterSelectionSystem - handles pre-game character selection
 * @module Systems/CharacterSelectionSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var events = window.VampireSurvivors.Core.events;
  var CharacterData = window.VampireSurvivors.Data.CharacterData;
  var CharacterSelectionScreen = window.VampireSurvivors.UI.CharacterSelectionScreen;

  // ============================================
  // Constants
  // ============================================
  var PRIORITY = 0; // Before CoreSelectionSystem (1)

  // ============================================
  // Class Definition
  // ============================================
  class CharacterSelectionSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _screen = null;
    _isActive = false;
    _availableCharacters = [];
    _selectedCharacter = null;
    _onCharacterSelected = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._priority = PRIORITY;
      this._updatesDuringPause = true;
      this._screen = new CharacterSelectionScreen();
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
     * Start character selection flow
     * @param {Function} callback - Called with selected character ID
     */
    startSelection(callback) {
      this._onCharacterSelected = callback;
      this._isActive = true;

      // Get all available characters
      this._availableCharacters = CharacterData.getAllCharacters();

      // Pause game and show screen
      this._game.pause();
      this._screen.show(this._availableCharacters, this._game.width, this._game.height);

      console.log('[CharacterSelectionSystem] Selection started with ' + this._availableCharacters.length + ' characters');
    }

    /**
     * Update system
     * @param {number} deltaTime
     */
    update(deltaTime) {
      if (!this._isActive || !this._screen.isVisible) return;

      var input = this._game.input;
      var result = this._screen.handleInput(input);

      if (result && result.type === 'select') {
        this._handleCharacterSelection(result.characterId);
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
     * Get the selected character ID
     * @returns {string|null}
     */
    getSelectedCharacterId() {
      return this._selectedCharacter;
    }

    /**
     * Get the selected character data
     * @returns {Object|null}
     */
    getSelectedCharacterData() {
      if (!this._selectedCharacter) return null;
      return CharacterData.getCharacter(this._selectedCharacter);
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
     * Handle character selection
     * @param {string} characterId
     */
    _handleCharacterSelection(characterId) {
      this._selectedCharacter = characterId;
      this._screen.hide();
      this._isActive = false;

      var characterData = CharacterData.getCharacter(characterId);
      console.log('[CharacterSelectionSystem] Selected character: ' + (characterData ? characterData.name : characterId));

      if (this._onCharacterSelected) {
        this._onCharacterSelected(characterId);
      }

      events.emitSync('character:selected', {
        characterId: characterId,
        characterData: characterData,
      });
    }

    // ----------------------------------------
    // Debug Info
    // ----------------------------------------
    getDebugInfo() {
      return {
        name: 'CharacterSelectionSystem',
        isActive: this._isActive,
        selectedCharacter: this._selectedCharacter,
        availableCharacters: this._availableCharacters.map(function (c) {
          return c.id;
        }),
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._screen = null;
      this._availableCharacters = [];
      this._onCharacterSelected = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.CharacterSelectionSystem = CharacterSelectionSystem;
})(window.VampireSurvivors.Systems = window.VampireSurvivors.Systems || {});
