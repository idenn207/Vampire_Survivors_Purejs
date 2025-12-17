/**
 * @fileoverview Experience component - tracks player XP and level progression
 * @module Components/Experience
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_BASE_EXP = 100;
  var DEFAULT_SCALING = 1.2;

  // ============================================
  // Class Definition
  // ============================================
  class Experience extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _currentExp = 0;
    _level = 1;
    _expToNextLevel = DEFAULT_BASE_EXP;
    _totalExpGained = 0;
    _baseExpRequired = DEFAULT_BASE_EXP;
    _expScaling = DEFAULT_SCALING;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * @param {number} [baseExpRequired] - Base XP needed for level 2
     * @param {number} [expScaling] - Multiplier per level
     */
    constructor(baseExpRequired, expScaling) {
      super();
      this._baseExpRequired = baseExpRequired || DEFAULT_BASE_EXP;
      this._expScaling = expScaling || DEFAULT_SCALING;
      this._expToNextLevel = this._calculateExpRequired(2);
      this._currentExp = 0;
      this._level = 1;
      this._totalExpGained = 0;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Add experience points
     * @param {number} amount - XP to add
     */
    addExperience(amount) {
      if (amount <= 0) return;

      this._currentExp += amount;
      this._totalExpGained += amount;

      // Emit XP gained event
      events.emit('player:exp_gained', {
        entity: this._entity,
        amount: amount,
        currentExp: this._currentExp,
        level: this._level,
      });

      // Check for level-ups (can level multiple times)
      while (this._currentExp >= this._expToNextLevel) {
        this._levelUp();
      }
    }

    /**
     * Reset experience for new game
     */
    reset() {
      this._currentExp = 0;
      this._level = 1;
      this._totalExpGained = 0;
      this._expToNextLevel = this._calculateExpRequired(2);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Level up the player
     */
    _levelUp() {
      var previousLevel = this._level;
      this._currentExp -= this._expToNextLevel;
      this._level++;
      this._expToNextLevel = this._calculateExpRequired(this._level + 1);

      // Emit level-up event
      events.emit('player:level_up', {
        entity: this._entity,
        newLevel: this._level,
        previousLevel: previousLevel,
      });
    }

    /**
     * Calculate XP required for a specific level
     * @param {number} level
     * @returns {number}
     */
    _calculateExpRequired(level) {
      // Level 2 requires baseExp, each subsequent level scales
      return Math.floor(this._baseExpRequired * Math.pow(this._expScaling, level - 2));
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get currentExp() {
      return this._currentExp;
    }

    get level() {
      return this._level;
    }

    get expToNextLevel() {
      return this._expToNextLevel;
    }

    get totalExpGained() {
      return this._totalExpGained;
    }

    /**
     * Progress toward next level (0 to 1)
     */
    get expProgress() {
      return this._currentExp / this._expToNextLevel;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      return [
        { key: 'Level', value: this._level },
        { key: 'XP', value: this._currentExp + '/' + this._expToNextLevel },
        { key: 'Total XP', value: this._totalExpGained },
        { key: 'Progress', value: Math.round(this.expProgress * 100) + '%' },
      ];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.Experience = Experience;
})(window.VampireSurvivors.Components);
