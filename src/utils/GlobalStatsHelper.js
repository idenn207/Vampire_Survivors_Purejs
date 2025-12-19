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
  };
})(window.VampireSurvivors.Utils);
