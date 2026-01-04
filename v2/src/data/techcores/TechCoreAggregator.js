/**
 * @fileoverview Tech Core Aggregator - Merges all cores from registry
 * @module Data/TechCores/TechCoreAggregator
 */
(function (Data) {
  'use strict';

  // ============================================
  // Aggregate Cores from Registry
  // ============================================
  var CORES = {};

  // Copy all cores from registry
  var registry = Data.TechCoreRegistry || {};
  for (var coreId in registry) {
    if (registry.hasOwnProperty(coreId)) {
      CORES[coreId] = registry[coreId];
    }
  }

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get core data by ID
   * @param {string} coreId
   * @returns {Object|null}
   */
  function getCoreData(coreId) {
    return CORES[coreId] || null;
  }

  /**
   * Get all core IDs
   * @returns {Array<string>}
   */
  function getAllCoreIds() {
    return Object.keys(CORES);
  }

  /**
   * Get random cores
   * @param {number} count
   * @returns {Array<Object>}
   */
  function getRandomCores(count) {
    var ids = getAllCoreIds();
    var shuffled = ids.slice();

    // Fisher-Yates shuffle
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    var result = [];
    for (var k = 0; k < Math.min(count, shuffled.length); k++) {
      result.push(CORES[shuffled[k]]);
    }
    return result;
  }

  /**
   * Get techs by depth from a core
   * @param {string} coreId
   * @param {number} depth - 0 for base, 1-3 for depths
   * @returns {Array<Object>}
   */
  function getTechsByDepth(coreId, depth) {
    var core = CORES[coreId];
    if (!core) return [];

    if (depth === 0) {
      return [core.tree.base];
    }

    var depthKey = 'depth' + depth;
    return core.tree[depthKey] || [];
  }

  /**
   * Get a specific tech by ID from a core
   * @param {string} coreId
   * @param {string} techId
   * @returns {Object|null}
   */
  function getTechById(coreId, techId) {
    var core = CORES[coreId];
    if (!core) return null;

    // Check base
    if (core.tree.base.id === techId) {
      return core.tree.base;
    }

    // Check all depths
    for (var depth = 1; depth <= 3; depth++) {
      var techs = core.tree['depth' + depth] || [];
      for (var i = 0; i < techs.length; i++) {
        if (techs[i].id === techId) {
          return techs[i];
        }
      }
    }

    return null;
  }

  /**
   * Get the depth of a tech
   * @param {string} coreId
   * @param {string} techId
   * @returns {number} -1 if not found
   */
  function getTechDepth(coreId, techId) {
    var core = CORES[coreId];
    if (!core) return -1;

    if (core.tree.base.id === techId) {
      return 0;
    }

    for (var depth = 1; depth <= 3; depth++) {
      var techs = core.tree['depth' + depth] || [];
      for (var i = 0; i < techs.length; i++) {
        if (techs[i].id === techId) {
          return depth;
        }
      }
    }

    return -1;
  }

  /**
   * Get available techs to unlock based on current unlocks
   * @param {string} coreId
   * @param {Object} techTree - TechTree component or unlocked tech map
   * @returns {Array<Object>} Array of tech objects that can be unlocked
   */
  function getAvailableTechs(coreId, techTree) {
    var core = CORES[coreId];
    if (!core) return [];

    var available = [];
    var unlockedTechs = techTree._unlockedTechs || techTree;

    // Helper to check if tech is unlocked
    function isUnlocked(techId) {
      if (unlockedTechs instanceof Map) {
        return unlockedTechs.has(techId);
      }
      return unlockedTechs[techId] !== undefined;
    }

    // Helper to count unlocked techs at a depth
    function countUnlockedAtDepth(depth) {
      var techs = getTechsByDepth(coreId, depth);
      var count = 0;
      for (var i = 0; i < techs.length; i++) {
        if (isUnlocked(techs[i].id)) {
          count++;
        }
      }
      return count;
    }

    // Check each depth
    for (var depth = 1; depth <= 3; depth++) {
      var techs = core.tree['depth' + depth] || [];

      for (var i = 0; i < techs.length; i++) {
        var tech = techs[i];

        // Skip if already unlocked
        if (isUnlocked(tech.id)) continue;

        // Check prerequisites
        var canUnlock = true;

        if (tech.requiresMultiple && tech.requires && tech.requires.length >= 2) {
          // Need ALL required techs
          for (var j = 0; j < tech.requires.length; j++) {
            if (!isUnlocked(tech.requires[j])) {
              canUnlock = false;
              break;
            }
          }
        } else if (tech.requires && tech.requires.length > 0) {
          // Need at least one required tech
          var hasOne = false;
          for (var k = 0; k < tech.requires.length; k++) {
            if (isUnlocked(tech.requires[k])) {
              hasOne = true;
              break;
            }
          }
          canUnlock = hasOne;
        } else {
          // No specific requires - need at least 1 tech from previous depth
          var prevDepthCount = countUnlockedAtDepth(depth - 1);
          canUnlock = prevDepthCount >= 1;
        }

        if (canUnlock) {
          // Add depth info for display
          var techWithDepth = Object.assign({}, tech, { depth: depth });
          available.push(techWithDepth);
        }
      }
    }

    return available;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.TechCoreData = {
    CORES: CORES,
    getCoreData: getCoreData,
    getAllCoreIds: getAllCoreIds,
    getRandomCores: getRandomCores,
    getTechsByDepth: getTechsByDepth,
    getTechById: getTechById,
    getTechDepth: getTechDepth,
    getAvailableTechs: getAvailableTechs,
  };
})(window.VampireSurvivors.Data);
