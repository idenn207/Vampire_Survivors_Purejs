/**
 * @fileoverview Level-Up System Constants
 * @module Systems/LevelUp/LevelUpConstants
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Level-Up Constants
  // ============================================
  Systems.LevelUpConstants = {
    PRIORITY: 115, // After HUDSystem (110)
    OPTIONS_COUNT: 3,
  };

  // ============================================
  // Evolution State Enum
  // ============================================
  Systems.EvolutionState = Object.freeze({
    NORMAL: 'normal',
    SELECTING_MATERIAL: 'selecting_material',
  });
})(window.VampireSurvivors.Systems);
