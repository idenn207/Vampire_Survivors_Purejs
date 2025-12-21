/**
 * @fileoverview PlayerData component - stores selected character data and base stats
 * @module Components/PlayerData
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;

  // ============================================
  // Class Definition
  // ============================================
  class PlayerData extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _characterId = null;
    _characterData = null;

    // Calculated base stats (from character + any bonuses)
    _baseAttack = 10;
    _baseSpeed = 200;
    _baseMaxHealth = 100;
    _baseCritChance = 0.05;
    _baseLuck = 0;

    // Passive effect
    _passive = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Set character and calculate stats
     * @param {string} characterId
     */
    setCharacter(characterId) {
      var CharacterData = window.VampireSurvivors.Data.CharacterData;
      this._characterId = characterId;
      this._characterData = CharacterData.getCharacter(characterId);

      if (this._characterData) {
        var stats = this._characterData.baseStats;
        var baseValues = CharacterData.BASE_VALUES;

        this._baseAttack = baseValues.attack * stats.attack;
        this._baseSpeed = baseValues.speed * stats.speed;
        this._baseMaxHealth = baseValues.maxHealth * stats.maxHealth;
        this._baseCritChance = stats.critChance;
        this._baseLuck = stats.luck;
        this._passive = this._characterData.passive;
      }
    }

    /**
     * Apply damage reduction from passive (Knight)
     * @param {number} incomingDamage
     * @returns {number}
     */
    applyDamageReduction(incomingDamage) {
      if (this._passive && this._passive.effect.type === 'damage_reduction') {
        return incomingDamage * (1 - this._passive.effect.value);
      }
      return incomingDamage;
    }

    /**
     * Get crit damage bonus from passive (Rogue)
     * @returns {number}
     */
    getCritDamageBonus() {
      if (this._passive && this._passive.effect.type === 'crit_damage_bonus') {
        return this._passive.effect.value;
      }
      return 0;
    }

    /**
     * Get cooldown reduction from passive (Mage)
     * @returns {number}
     */
    getCooldownReduction() {
      if (this._passive && this._passive.effect.type === 'cooldown_reduction') {
        return this._passive.effect.value;
      }
      return 0;
    }

    /**
     * Check if player has a specific passive type
     * @param {string} effectType
     * @returns {boolean}
     */
    hasPassiveEffect(effectType) {
      return this._passive && this._passive.effect.type === effectType;
    }

    /**
     * Get passive effect value
     * @param {string} effectType
     * @returns {number}
     */
    getPassiveValue(effectType) {
      if (this._passive && this._passive.effect.type === effectType) {
        return this._passive.effect.value;
      }
      return 0;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get characterId() {
      return this._characterId;
    }

    get characterData() {
      return this._characterData;
    }

    get baseAttack() {
      return this._baseAttack;
    }

    get baseSpeed() {
      return this._baseSpeed;
    }

    get baseMaxHealth() {
      return this._baseMaxHealth;
    }

    get baseCritChance() {
      return this._baseCritChance;
    }

    get baseLuck() {
      return this._baseLuck;
    }

    get passive() {
      return this._passive;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      var entries = [];

      if (this._characterData) {
        entries.push({ key: 'Character', value: this._characterData.name });
        entries.push({ key: 'Base Attack', value: this._baseAttack.toFixed(1) });
        entries.push({ key: 'Base Speed', value: this._baseSpeed.toFixed(0) });
        entries.push({ key: 'Base HP', value: this._baseMaxHealth.toFixed(0) });
        entries.push({ key: 'Base Crit', value: (this._baseCritChance * 100).toFixed(0) + '%' });
        entries.push({ key: 'Base Luck', value: (this._baseLuck * 100).toFixed(0) + '%' });

        if (this._passive) {
          entries.push({ key: 'Passive', value: this._passive.name });
        }
      }

      return entries;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._characterId = null;
      this._characterData = null;
      this._passive = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.PlayerData = PlayerData;
})(window.VampireSurvivors.Components);
