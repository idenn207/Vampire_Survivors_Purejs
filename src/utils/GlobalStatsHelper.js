/**
 * @fileoverview GlobalStatsHelper - utility for applying player stats to weapons
 * @module Utils/GlobalStatsHelper
 */
(function (Utils) {
  'use strict';

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get effective damage with player stats applied
   * @param {number} baseDamage - Base weapon damage
   * @param {PlayerStats} playerStats - Player stats component
   * @returns {number} Effective damage
   */
  function getEffectiveDamage(baseDamage, playerStats) {
    if (!playerStats) return baseDamage;
    return Math.floor(baseDamage * playerStats.getMultiplier('damage'));
  }

  /**
   * Get effective range with player stats applied
   * @param {number} baseRange - Base weapon range
   * @param {PlayerStats} playerStats - Player stats component
   * @returns {number} Effective range
   */
  function getEffectiveRange(baseRange, playerStats) {
    if (!playerStats) return baseRange;
    return Math.floor(baseRange * playerStats.getMultiplier('range'));
  }

  /**
   * Get effective cooldown with reduction applied
   * @param {number} baseCooldown - Base weapon cooldown
   * @param {PlayerStats} playerStats - Player stats component
   * @returns {number} Effective cooldown (reduced)
   */
  function getEffectiveCooldown(baseCooldown, playerStats) {
    if (!playerStats) return baseCooldown;
    var reduction = playerStats.getStatBonus('cooldownReduction');
    // Cap reduction at 80% to prevent zero/negative cooldowns
    reduction = Math.min(reduction, 0.8);
    return baseCooldown * (1 - reduction);
  }

  /**
   * Get effective duration with bonus applied
   * @param {number} baseDuration - Base effect duration
   * @param {PlayerStats} playerStats - Player stats component
   * @returns {number} Effective duration
   */
  function getEffectiveDuration(baseDuration, playerStats) {
    if (!playerStats) return baseDuration;
    return baseDuration * playerStats.getMultiplier('duration');
  }

  /**
   * Get effective crit chance with luck and critChance bonuses
   * @param {number} baseCritChance - Base critical hit chance (0-1)
   * @param {PlayerStats} playerStats - Player stats component
   * @returns {number} Effective crit chance
   */
  function getEffectiveCritChance(baseCritChance, playerStats) {
    if (!playerStats) return baseCritChance;
    var critBonus = playerStats.getStatBonus('critChance');
    // Luck adds 50% of its value to crit chance
    var luckBonus = playerStats.getStatBonus('luck') * 0.5;
    // Cap at 100%
    return Math.min(1, baseCritChance + critBonus + luckBonus);
  }

  /**
   * Get effective crit multiplier with critDamage bonus
   * @param {number} baseCritMultiplier - Base critical damage multiplier (e.g., 2.0)
   * @param {PlayerStats} playerStats - Player stats component
   * @returns {number} Effective crit multiplier
   */
  function getEffectiveCritMultiplier(baseCritMultiplier, playerStats) {
    if (!playerStats) return baseCritMultiplier;
    // critDamage bonus adds to the multiplier
    // e.g., base 2.0 with 15% bonus = 2.0 + 0.15 = 2.15
    return baseCritMultiplier + playerStats.getStatBonus('critDamage');
  }

  /**
   * Get luck bonus for drop chance calculations
   * @param {PlayerStats} playerStats - Player stats component
   * @returns {number} Luck bonus (as multiplier, e.g., 1.05 for 5% more luck)
   */
  function getDropLuckMultiplier(playerStats) {
    if (!playerStats) return 1;
    return playerStats.getMultiplier('luck');
  }

  /**
   * Get projectile size multiplier from range stat
   * Range stat also affects projectile/attack sizes
   * @param {PlayerStats} playerStats - Player stats component
   * @returns {number} Size multiplier
   */
  function getSizeMultiplier(playerStats) {
    if (!playerStats) return 1;
    // Use half of range bonus for size to prevent oversized projectiles
    var rangeBonus = playerStats.getStatBonus('range');
    return 1 + rangeBonus * 0.5;
  }

  // ============================================
  // ActiveBuff-aware Helper Functions
  // ============================================

  /**
   * Get damage multiplier including ActiveBuff bonus
   * @param {PlayerStats} playerStats - Player stats component
   * @param {ActiveBuff} activeBuff - Active buff component (optional)
   * @returns {number} Damage multiplier
   */
  function getDamageMultiplierWithBuff(playerStats, activeBuff) {
    var baseMultiplier = playerStats ? playerStats.getMultiplier('damage') : 1;
    var buffBonus = activeBuff ? activeBuff.attackBonus : 0;
    return baseMultiplier * (1 + buffBonus);
  }

  /**
   * Get effective crit chance including ActiveBuff bonus
   * @param {number} baseCritChance - Base critical hit chance (0-1)
   * @param {PlayerStats} playerStats - Player stats component
   * @param {ActiveBuff} activeBuff - Active buff component (optional)
   * @returns {number} Effective crit chance
   */
  function getEffectiveCritChanceWithBuff(baseCritChance, playerStats, activeBuff) {
    var baseEffective = getEffectiveCritChance(baseCritChance, playerStats);
    var buffBonus = activeBuff ? activeBuff.critChanceBonus : 0;
    // Cap at 100%
    return Math.min(1, baseEffective + buffBonus);
  }

  /**
   * Get effective crit multiplier including ActiveBuff bonus
   * @param {number} baseCritMultiplier - Base critical damage multiplier (e.g., 2.0)
   * @param {PlayerStats} playerStats - Player stats component
   * @param {ActiveBuff} activeBuff - Active buff component (optional)
   * @returns {number} Effective crit multiplier
   */
  function getEffectiveCritMultiplierWithBuff(baseCritMultiplier, playerStats, activeBuff) {
    var baseEffective = getEffectiveCritMultiplier(baseCritMultiplier, playerStats);
    var buffBonus = activeBuff ? activeBuff.critDamageBonus : 0;
    return baseEffective + buffBonus;
  }

  /**
   * Get cooldown reduction including ActiveBuff bonus
   * @param {PlayerStats} playerStats - Player stats component
   * @param {ActiveBuff} activeBuff - Active buff component (optional)
   * @returns {number} Total cooldown reduction (0-0.8)
   */
  function getCooldownReductionWithBuff(playerStats, activeBuff) {
    var baseReduction = playerStats ? playerStats.getStatBonus('cooldownReduction') : 0;
    var buffBonus = activeBuff ? activeBuff.cooldownReductionBonus : 0;
    // Cap reduction at 80% to prevent zero/negative cooldowns
    return Math.min(baseReduction + buffBonus, 0.8);
  }

  /**
   * Get effective duration including ActiveBuff bonus
   * @param {number} baseDuration - Base effect duration
   * @param {PlayerStats} playerStats - Player stats component
   * @param {ActiveBuff} activeBuff - Active buff component (optional)
   * @returns {number} Effective duration
   */
  function getEffectiveDurationWithBuff(baseDuration, playerStats, activeBuff) {
    var baseMultiplier = playerStats ? playerStats.getMultiplier('duration') : 1;
    var buffBonus = activeBuff ? activeBuff.durationBonus : 0;
    return baseDuration * baseMultiplier * (1 + buffBonus);
  }

  /**
   * Get movement speed multiplier including ActiveBuff bonus
   * @param {PlayerStats} playerStats - Player stats component
   * @param {ActiveBuff} activeBuff - Active buff component (optional)
   * @returns {number} Speed multiplier
   */
  function getMoveSpeedMultiplierWithBuff(playerStats, activeBuff) {
    var baseMultiplier = playerStats ? playerStats.getMultiplier('moveSpeed') : 1;
    var buffBonus = activeBuff ? activeBuff.moveSpeedBonus : 0;
    return baseMultiplier * (1 + buffBonus);
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Utils.GlobalStatsHelper = {
    getEffectiveDamage: getEffectiveDamage,
    getEffectiveRange: getEffectiveRange,
    getEffectiveCooldown: getEffectiveCooldown,
    getEffectiveDuration: getEffectiveDuration,
    getEffectiveCritChance: getEffectiveCritChance,
    getEffectiveCritMultiplier: getEffectiveCritMultiplier,
    getDropLuckMultiplier: getDropLuckMultiplier,
    getSizeMultiplier: getSizeMultiplier,
    // ActiveBuff-aware functions
    getDamageMultiplierWithBuff: getDamageMultiplierWithBuff,
    getEffectiveCritChanceWithBuff: getEffectiveCritChanceWithBuff,
    getEffectiveCritMultiplierWithBuff: getEffectiveCritMultiplierWithBuff,
    getCooldownReductionWithBuff: getCooldownReductionWithBuff,
    getEffectiveDurationWithBuff: getEffectiveDurationWithBuff,
    getMoveSpeedMultiplierWithBuff: getMoveSpeedMultiplierWithBuff,
  };
})(window.VampireSurvivors.Utils);
