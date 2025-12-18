/**
 * @fileoverview Drop table data - configures what enemies drop when killed
 * @module Data/DropTable
 */
(function (Data) {
  'use strict';

  // ============================================
  // Enemy Type Multipliers
  // ============================================
  var ENEMY_MULTIPLIERS = {
    default: {
      xpMultiplier: 1.0,
      goldMultiplier: 1.0,
    },
    elite: {
      xpMultiplier: 3.0,
      goldMultiplier: 2.5,
    },
    miniboss: {
      xpMultiplier: 10.0,
      goldMultiplier: 5.0,
    },
    boss: {
      xpMultiplier: 50.0,
      goldMultiplier: 20.0,
    },
    swarm: {
      // Small fast enemies - less drops
      xpMultiplier: 0.5,
      goldMultiplier: 0.3,
    },
    tank: {
      // High HP enemies - more drops
      xpMultiplier: 2.0,
      goldMultiplier: 1.5,
    },
    // Traversal enemies - reduced multipliers (more enemies now)
    traversal_circular: {
      xpMultiplier: 1.0,
      goldMultiplier: 1.0,
    },
    traversal_dash: {
      xpMultiplier: 1.0,
      goldMultiplier: 1.2,
    },
    traversal_laser: {
      xpMultiplier: 1.5,
      goldMultiplier: 1.2,
    },
  };

  // ============================================
  // Drop Tables
  // ============================================
  var DROP_TABLES = {
    default: [
      { type: 'exp', minValue: 1, maxValue: 5, chance: 1.0 }, // Always drop XP
      { type: 'gold', minValue: 1, maxValue: 5, chance: 0.3 }, // 30% gold
      { type: 'health', minValue: 10, maxValue: 20, chance: 0.05 }, // 5% health
    ],
    elite: [
      { type: 'exp', minValue: 15, maxValue: 30, chance: 1.0 }, // Tier 2-3 XP
      { type: 'gold', minValue: 10, maxValue: 25, chance: 0.8 }, // 80% gold
      { type: 'health', minValue: 20, maxValue: 30, chance: 0.15 }, // 15% health
    ],
    miniboss: [
      { type: 'exp', minValue: 50, maxValue: 100, chance: 1.0 }, // Tier 3 XP
      { type: 'gold', minValue: 25, maxValue: 50, chance: 1.0 }, // Always gold
      { type: 'health', minValue: 30, maxValue: 50, chance: 0.5 }, // 50% health
    ],
    boss: [
      { type: 'exp', minValue: 200, maxValue: 500, chance: 1.0 }, // Tier 4 XP (gold gem)
      { type: 'gold', minValue: 100, maxValue: 200, chance: 1.0 }, // Always gold
      { type: 'health', minValue: 50, maxValue: 100, chance: 1.0 }, // Always health
    ],
    swarm: [
      { type: 'exp', minValue: 1, maxValue: 2, chance: 0.8 }, // Small XP, 80% chance
      { type: 'gold', minValue: 1, maxValue: 2, chance: 0.1 }, // 10% gold
    ],
    tank: [
      { type: 'exp', minValue: 5, maxValue: 15, chance: 1.0 }, // Tier 1-2 XP
      { type: 'gold', minValue: 5, maxValue: 15, chance: 0.5 }, // 50% gold
      { type: 'health', minValue: 15, maxValue: 25, chance: 0.1 }, // 10% health
    ],
    // Traversal enemies - reduced per-enemy rewards (more enemies now)
    traversal_circular: [
      { type: 'exp', minValue: 3, maxValue: 8, chance: 0.8 }, // 80% XP
      { type: 'gold', minValue: 2, maxValue: 5, chance: 0.4 }, // 40% gold
      { type: 'health', minValue: 10, maxValue: 15, chance: 0.05 }, // 5% health
    ],
    traversal_dash: [
      { type: 'exp', minValue: 2, maxValue: 6, chance: 0.7 }, // 70% XP
      { type: 'gold', minValue: 3, maxValue: 8, chance: 0.5 }, // 50% gold
      { type: 'health', minValue: 10, maxValue: 20, chance: 0.08 }, // 8% health
    ],
    traversal_laser: [
      { type: 'exp', minValue: 4, maxValue: 10, chance: 0.9 }, // 90% XP
      { type: 'gold', minValue: 3, maxValue: 7, chance: 0.6 }, // 60% gold
      { type: 'health', minValue: 10, maxValue: 20, chance: 0.1 }, // 10% health
    ],
  };

  // ============================================
  // Public API
  // ============================================
  /**
   * Get drop table for an enemy type
   * @param {string} enemyType - Enemy type ('default', 'elite', 'miniboss', 'boss', etc.)
   * @returns {Array} Array of drop entries
   */
  function getDropTable(enemyType) {
    return DROP_TABLES[enemyType] || DROP_TABLES.default;
  }

  /**
   * Get multipliers for an enemy type
   * @param {string} enemyType - Enemy type
   * @returns {Object} Multiplier object { xpMultiplier, goldMultiplier }
   */
  function getMultipliers(enemyType) {
    return ENEMY_MULTIPLIERS[enemyType] || ENEMY_MULTIPLIERS.default;
  }

  /**
   * Roll drops based on a drop table with multipliers applied
   * @param {string} enemyType - Enemy type to get drop table for
   * @param {Object} [options] - Additional options
   * @param {number} [options.bonusXpMultiplier=1] - Additional XP multiplier (from player buffs, etc.)
   * @param {number} [options.bonusGoldMultiplier=1] - Additional gold multiplier
   * @returns {Array<{type: string, value: number}>} Array of drops
   */
  function rollDrops(enemyType, options) {
    options = options || {};
    var bonusXpMultiplier = options.bonusXpMultiplier || 1;
    var bonusGoldMultiplier = options.bonusGoldMultiplier || 1;

    var table = getDropTable(enemyType);
    var multipliers = getMultipliers(enemyType);
    var drops = [];

    for (var i = 0; i < table.length; i++) {
      var entry = table[i];

      // Roll chance
      if (Math.random() < entry.chance) {
        // Calculate random value in range
        var baseValue = Math.floor(
          Math.random() * (entry.maxValue - entry.minValue + 1) + entry.minValue
        );

        // Apply multipliers based on type
        var finalValue = baseValue;
        if (entry.type === 'exp') {
          finalValue = Math.floor(baseValue * multipliers.xpMultiplier * bonusXpMultiplier);
        } else if (entry.type === 'gold') {
          finalValue = Math.floor(baseValue * multipliers.goldMultiplier * bonusGoldMultiplier);
        }

        drops.push({
          type: entry.type,
          value: Math.max(1, finalValue), // Ensure at least 1
        });
      }
    }

    return drops;
  }

  /**
   * Get all enemy types that have drop tables
   * @returns {Array<string>}
   */
  function getEnemyTypes() {
    return Object.keys(DROP_TABLES);
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.DropTable = {
    DROP_TABLES: DROP_TABLES,
    ENEMY_MULTIPLIERS: ENEMY_MULTIPLIERS,
    getDropTable: getDropTable,
    getMultipliers: getMultipliers,
    rollDrops: rollDrops,
    getEnemyTypes: getEnemyTypes,
  };
})(window.VampireSurvivors.Data);
