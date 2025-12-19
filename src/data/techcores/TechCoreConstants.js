/**
 * @fileoverview Tech Core constants and cost generation helpers
 * @module Data/TechCores/TechCoreConstants
 */
(function (Data) {
  'use strict';

  // ============================================
  // Initialize Tech Core Registry
  // ============================================
  Data.TechCoreRegistry = Data.TechCoreRegistry || {};

  // ============================================
  // Cost Generation Helpers
  // ============================================

  /**
   * Generate cost array for a tech
   * @param {number} baseCost - Starting cost
   * @param {number} levels - Number of levels
   * @param {number} multiplier - Cost growth multiplier
   * @returns {Array<number>}
   */
  function generateCosts(baseCost, levels, multiplier) {
    var costs = [];
    var cost = baseCost;
    for (var i = 0; i < levels; i++) {
      costs.push(Math.floor(cost));
      cost *= multiplier;
    }
    return costs;
  }

  // ============================================
  // Cost Presets
  // ============================================

  // Base core: 10 levels, total ~3000 gold (waves 20-30)
  var BASE_COSTS = generateCosts(50, 10, 1.45);

  // Depth 1: 5-10 levels, varies
  var D1_COSTS_5 = generateCosts(80, 5, 1.4);
  var D1_COSTS_7 = generateCosts(60, 7, 1.35);
  var D1_COSTS_10 = generateCosts(40, 10, 1.3);

  // Depth 2: 3-5 levels
  var D2_COSTS_3 = generateCosts(150, 3, 1.5);
  var D2_COSTS_4 = generateCosts(120, 4, 1.45);
  var D2_COSTS_5 = generateCosts(100, 5, 1.4);

  // Depth 3: 1-2 levels, total ~2500-4000 gold (waves 20-30)
  var D3_COSTS_1 = [1500];
  var D3_COSTS_2 = [1200, 1800];

  // ============================================
  // Export to Namespace
  // ============================================
  Data.TechCoreCosts = {
    generateCosts: generateCosts,
    BASE_COSTS: BASE_COSTS,
    D1_COSTS_5: D1_COSTS_5,
    D1_COSTS_7: D1_COSTS_7,
    D1_COSTS_10: D1_COSTS_10,
    D2_COSTS_3: D2_COSTS_3,
    D2_COSTS_4: D2_COSTS_4,
    D2_COSTS_5: D2_COSTS_5,
    D3_COSTS_1: D3_COSTS_1,
    D3_COSTS_2: D3_COSTS_2,
  };
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
