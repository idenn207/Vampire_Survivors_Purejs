/**
 * @fileoverview Chase enemy behavior - simple movement toward player
 * @module Behaviors/ChaseEnemyBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var EnemyBehavior = Behaviors.EnemyBehavior;

  // ============================================
  // Class Definition
  // ============================================
  class ChaseEnemyBehavior extends EnemyBehavior {
    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Update enemy - move toward player
     * @param {Entity} enemy - Enemy entity
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(enemy, deltaTime) {
      if (!enemy.isActive) return;

      // Simply move toward player at enemy's speed
      this.moveTowardPlayer(enemy, enemy.speed);
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.ChaseEnemyBehavior = ChaseEnemyBehavior;
})(window.VampireSurvivors.Behaviors);
