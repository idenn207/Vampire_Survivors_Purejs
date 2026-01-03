/**
 * @fileoverview Framework namespace initialization
 * @module Core/Namespace
 *
 * Must be loaded first before any other framework files.
 * Creates the global RoguelikeFramework namespace hierarchy.
 */
(function(global) {
  'use strict';

  // ============================================
  // Create Framework Namespace
  // ============================================
  global.RoguelikeFramework = global.RoguelikeFramework || {};

  var RF = global.RoguelikeFramework;

  // Core module - Game loop, Time, Input, Camera, Events
  RF.Core = RF.Core || {};

  // ECS module - Entity, Component, System, EntityManager
  RF.ECS = RF.ECS || {};

  // Components module - Common components (Transform, Velocity, etc.)
  RF.Components = RF.Components || {};

  // Utils module - Utility classes (Vector2, etc.)
  RF.Utils = RF.Utils || {};

  // ============================================
  // Framework Version
  // ============================================
  RF.VERSION = '1.0.0';

  // ============================================
  // Framework Info
  // ============================================
  RF.info = function() {
    console.log('[RoguelikeFramework] v' + RF.VERSION);
    console.log('  Modules: Core, ECS, Components, Utils');
  };

})(window);
