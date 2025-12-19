/**
 * @fileoverview Mine weapon behavior - deploys proximity mines around player
 * @module Behaviors/MineBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponBehavior = Behaviors.WeaponBehavior;
  var minePool = window.VampireSurvivors.Pool.minePool;

  // ============================================
  // Class Definition
  // ============================================
  class MineBehavior extends WeaponBehavior {
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
     * Execute mine weapon behavior - deploys mines around player
     * @param {Weapon} weapon
     * @param {Entity} player
     * @returns {Array} Spawned mines
     */
    execute(weapon, player) {
      var mines = [];
      var playerPos = this.getPlayerCenter(player);

      // Get weapon stats
      var mineCount = weapon.getStat('mineCount', 1);
      var baseDamage = weapon.getStat('damage', 80);
      var baseExplosionRadius = weapon.getStat('explosionRadius', 60);
      var baseTriggerRadius = weapon.getStat('triggerRadius', 40);
      var baseDuration = weapon.getStat('duration', 15);
      var baseSpawnRange = weapon.getStat('spawnRange', 150);
      var color = weapon.getStat('color', '#FF4444');

      // Apply player stat bonuses
      var damageResult = this.calculateDamage(weapon);
      var damage = damageResult.damage;
      var explosionRadius = this.getEffectiveRange(baseExplosionRadius);
      var triggerRadius = this.getEffectiveRange(baseTriggerRadius);
      var duration = this.getEffectiveDuration(baseDuration);
      var spawnRange = this.getEffectiveRange(baseSpawnRange);

      // Spawn mines around player
      for (var i = 0; i < mineCount; i++) {
        var spawnPos = this._getSpawnPosition(playerPos, spawnRange, mineCount, i);

        var mine = minePool.spawn(
          spawnPos.x,
          spawnPos.y,
          damage,
          explosionRadius,
          triggerRadius,
          duration,
          color,
          weapon.id
        );

        if (mine) {
          mines.push(mine);
        }
      }

      return mines;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Get spawn position for a mine
     * @param {{x: number, y: number}} playerPos
     * @param {number} spawnRange
     * @param {number} totalMines
     * @param {number} index
     * @returns {{x: number, y: number}}
     */
    _getSpawnPosition(playerPos, spawnRange, totalMines, index) {
      if (totalMines === 1) {
        // Single mine: random position near player
        var angle = Math.random() * Math.PI * 2;
        var distance = Math.random() * spawnRange;
        return {
          x: playerPos.x + Math.cos(angle) * distance,
          y: playerPos.y + Math.sin(angle) * distance,
        };
      } else {
        // Multiple mines: spread in a circle around player
        var angleStep = (Math.PI * 2) / totalMines;
        var baseAngle = Math.random() * Math.PI * 2; // Random starting angle
        var mineAngle = baseAngle + angleStep * index;
        var distance = spawnRange * 0.5 + Math.random() * spawnRange * 0.5;

        return {
          x: playerPos.x + Math.cos(mineAngle) * distance,
          y: playerPos.y + Math.sin(mineAngle) * distance,
        };
      }
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.MineBehavior = MineBehavior;
})(window.VampireSurvivors.Behaviors);
