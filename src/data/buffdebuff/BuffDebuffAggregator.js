/**
 * @fileoverview Aggregates all buff/debuff data from registry into unified data object
 * @module Data/BuffDebuff/BuffDebuffAggregator
 */
(function (Data) {
  'use strict';

  // ============================================
  // Merge Registry into BuffDebuffData
  // ============================================
  var BuffDebuffData = Data.BuffDebuffData || {};
  var BuffDebuffRegistry = Data.BuffDebuffRegistry || {};

  for (var effectId in BuffDebuffRegistry) {
    if (BuffDebuffRegistry.hasOwnProperty(effectId)) {
      if (!BuffDebuffData[effectId]) {
        BuffDebuffData[effectId] = BuffDebuffRegistry[effectId];
      }
    }
  }

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get effect data by ID
   * @param {string} effectId - Effect ID
   * @returns {Object|null} Effect data or null if not found
   */
  function getEffectData(effectId) {
    return BuffDebuffData[effectId] || null;
  }

  /**
   * Get all effects of a specific category
   * @param {string} category - EffectCategory value
   * @returns {Array<Object>} Array of effect data objects
   */
  function getEffectsByCategory(category) {
    var result = [];
    for (var effectId in BuffDebuffData) {
      if (BuffDebuffData.hasOwnProperty(effectId)) {
        if (BuffDebuffData[effectId].category === category) {
          result.push(BuffDebuffData[effectId]);
        }
      }
    }
    return result;
  }

  /**
   * Get all effects with a specific tag
   * @param {string} tag - EffectTag value
   * @returns {Array<Object>} Array of effect data objects
   */
  function getEffectsByTag(tag) {
    var result = [];
    for (var effectId in BuffDebuffData) {
      if (BuffDebuffData.hasOwnProperty(effectId)) {
        var effect = BuffDebuffData[effectId];
        if (effect.tags && effect.tags.indexOf(tag) !== -1) {
          result.push(effect);
        }
      }
    }
    return result;
  }

  /**
   * Get all buff effects
   * @returns {Array<Object>} Array of buff effect data objects
   */
  function getAllBuffs() {
    return getEffectsByCategory(Data.EffectCategory.BUFF);
  }

  /**
   * Get all debuff effects
   * @returns {Array<Object>} Array of debuff effect data objects
   */
  function getAllDebuffs() {
    return getEffectsByCategory(Data.EffectCategory.DEBUFF);
  }

  /**
   * Get all DoT effects
   * @returns {Array<Object>} Array of DoT effect data objects
   */
  function getDoTEffects() {
    return getEffectsByTag(Data.EffectTag.DOT);
  }

  /**
   * Get all movement-affecting effects
   * @returns {Array<Object>} Array of movement effect data objects
   */
  function getMovementEffects() {
    return getEffectsByTag(Data.EffectTag.MOVEMENT);
  }

  /**
   * Check if effect is a DoT effect
   * @param {string} effectId - Effect ID
   * @returns {boolean}
   */
  function isDoTEffect(effectId) {
    var effect = BuffDebuffData[effectId];
    if (!effect || !effect.tags) return false;
    return effect.tags.indexOf(Data.EffectTag.DOT) !== -1;
  }

  /**
   * Check if effect is a HoT effect
   * @param {string} effectId - Effect ID
   * @returns {boolean}
   */
  function isHoTEffect(effectId) {
    var effect = BuffDebuffData[effectId];
    if (!effect || !effect.tags) return false;
    return effect.tags.indexOf(Data.EffectTag.HOT) !== -1;
  }

  /**
   * Check if effect modifies movement
   * @param {string} effectId - Effect ID
   * @returns {boolean}
   */
  function isMovementEffect(effectId) {
    var effect = BuffDebuffData[effectId];
    if (!effect || !effect.tags) return false;
    return effect.tags.indexOf(Data.EffectTag.MOVEMENT) !== -1;
  }

  /**
   * Check if effect is a control effect (stun, freeze)
   * @param {string} effectId - Effect ID
   * @returns {boolean}
   */
  function isControlEffect(effectId) {
    var effect = BuffDebuffData[effectId];
    if (!effect || !effect.tags) return false;
    return effect.tags.indexOf(Data.EffectTag.CONTROL) !== -1;
  }

  /**
   * Get effect priority for conflict resolution
   * @param {string} effectId - Effect ID
   * @returns {number} Priority value (higher = takes precedence)
   */
  function getEffectPriority(effectId) {
    return Data.EffectPriority[effectId] || 0;
  }

  /**
   * Get effect visual color
   * @param {string} effectId - Effect ID
   * @returns {string} Hex color string
   */
  function getEffectColor(effectId) {
    var effect = BuffDebuffData[effectId];
    if (effect && effect.visual && effect.visual.color) {
      return effect.visual.color;
    }
    return Data.EffectColors[effectId] || '#FFFFFF';
  }

  /**
   * Get all effect IDs
   * @returns {Array<string>} Array of effect IDs
   */
  function getAllEffectIds() {
    return Object.keys(BuffDebuffData);
  }

  /**
   * Get count of registered effects
   * @returns {number}
   */
  function getEffectCount() {
    return Object.keys(BuffDebuffData).length;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.BuffDebuffData = BuffDebuffData;
  Data.getEffectData = getEffectData;
  Data.getEffectsByCategory = getEffectsByCategory;
  Data.getEffectsByTag = getEffectsByTag;
  Data.getAllBuffs = getAllBuffs;
  Data.getAllDebuffs = getAllDebuffs;
  Data.getDoTEffects = getDoTEffects;
  Data.getMovementEffects = getMovementEffects;
  Data.isDoTEffect = isDoTEffect;
  Data.isHoTEffect = isHoTEffect;
  Data.isMovementEffect = isMovementEffect;
  Data.isControlEffect = isControlEffect;
  Data.getEffectPriority = getEffectPriority;
  Data.getEffectColor = getEffectColor;
  Data.getAllEffectIds = getAllEffectIds;
  Data.getEffectCount = getEffectCount;
})(window.VampireSurvivors.Data);
