/**
 * @fileoverview Application entry point
 * @module App
 */
(function(VampireSurvivors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Core = VampireSurvivors.Core;
  var Game = Core.Game;
  var events = Core.events;

  // ============================================
  // Application
  // ============================================
  var game = null;

  async function main() {
    try {
      game = new Game();

      await game.initialize('game-canvas');
      await game.start();

      console.log('[App] Game running');
    } catch (error) {
      console.error('[App] Failed to start game:', error);
    }
  }

  // ============================================
  // Bootstrap
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

  // ============================================
  // Export
  // ============================================
  VampireSurvivors.game = null;
  Object.defineProperty(VampireSurvivors, 'game', {
    get: function() { return game; }
  });

})(window.VampireSurvivors);
