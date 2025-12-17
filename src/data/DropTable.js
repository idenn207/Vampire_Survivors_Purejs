/**
 * @fileoverview Drop table data - configures what enemies drop when killed
 * @module Data/DropTable
 */
(function (Data) {
  'use strict';

  // ============================================
  // Drop Tables
  // ============================================
  var DROP_TABLES = {
    default: [
      { type: 'exp', minValue: 1, maxValue: 3, chance: 1.0 }, // Always drop XP
      { type: 'gold', minValue: 1, maxValue: 5, chance: 0.3 }, // 30% gold
      { type: 'health', minValue: 10, maxValue: 20, chance: 0.05 }, // 5% health
    ],
    elite: [
      { type: 'exp', minValue: 5, maxValue: 10, chance: 1.0 },
      { type: 'gold', minValue: 10, maxValue: 20, chance: 0.8 },
      { type: 'health', minValue: 20, maxValue: 30, chance: 0.15 },
    ],
  };

  // ============================================
  // Public API
  // ============================================
  /**
   * Get drop table for an enemy type
   * @param {string} enemyType - Enemy type ('default', 'elite', etc.)
   * @returns {Array} Array of drop entries
   */
  function getDropTable(enemyType) {
    return DROP_TABLES[enemyType] || DROP_TABLES.default;
  }

  /**
   * Roll drops based on a drop table
   * @param {string} enemyType - Enemy type to get drop table for
   * @returns {Array<{type: string, value: number}>} Array of drops
   */
  function rollDrops(enemyType) {
    var table = getDropTable(enemyType);
    var drops = [];

    for (var i = 0; i < table.length; i++) {
      var entry = table[i];

      // Roll chance
      if (Math.random() < entry.chance) {
        // Calculate random value in range
        var value = Math.floor(
          Math.random() * (entry.maxValue - entry.minValue + 1) + entry.minValue
        );

        drops.push({
          type: entry.type,
          value: value,
        });
      }
    }

    return drops;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.DropTable = {
    DROP_TABLES: DROP_TABLES,
    getDropTable: getDropTable,
    rollDrops: rollDrops,
  };
})(window.VampireSurvivors.Data);
