/**
 * @fileoverview Area damage weapon behavior - spawns persistent damage zones
 * @module Behaviors/AreaBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponBehavior = Behaviors.WeaponBehavior;
  var TargetingMode = window.VampireSurvivors.Data.TargetingMode;
  var Transform = window.VampireSurvivors.Components.Transform;
  var areaEffectPool = window.VampireSurvivors.Pool.areaEffectPool;

  // ============================================
  // Class Definition
  // ============================================
  class AreaBehavior extends WeaponBehavior {
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
     * Execute area damage weapon behavior
     * @param {Weapon} weapon
     * @param {Entity} player
     * @returns {Array} Spawned area effects
     */
    execute(weapon, player) {
      var areaEffects = [];
      var playerPos = this.getPlayerCenter(player);

      // Get weapon stats
      var baseRadius = weapon.getStat('radius', 50);
      var baseDuration = weapon.getStat('duration', 4.0);
      var tickRate = weapon.getStat('tickRate', 2);
      var cloudCount = weapon.getStat('cloudCount', 1);
      var baseSpawnRange = weapon.getStat('spawnRange', 200);
      var color = weapon.getStat('color', '#00FF00');

      // Apply player stat bonuses
      var radius = this.getEffectiveRange(baseRadius);
      var spawnRange = this.getEffectiveRange(baseSpawnRange);
      var duration = this.getEffectiveDuration(baseDuration);
      var damageResult = this.calculateDamage(weapon);
      var damage = damageResult.damage;

      // Spawn multiple clouds
      for (var i = 0; i < cloudCount; i++) {
        var spawnPos = this._getSpawnPosition(weapon, player, spawnRange);

        var areaEffect = areaEffectPool.spawn(
          spawnPos.x,
          spawnPos.y,
          radius,
          color,
          damage,
          duration,
          tickRate,
          weapon.id
        );

        if (areaEffect) {
          areaEffects.push(areaEffect);
        }
      }

      return areaEffects;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Get spawn position based on targeting mode
     * @param {Weapon} weapon
     * @param {Entity} player
     * @param {number} spawnRange
     * @returns {{x: number, y: number}}
     */
    _getSpawnPosition(weapon, player, spawnRange) {
      var playerPos = this.getPlayerCenter(player);
      var targetingMode = weapon.targetingMode;

      switch (targetingMode) {
        case TargetingMode.NEAREST:
          var nearestEnemy = this.findNearestEnemy(player, spawnRange * 2);
          if (nearestEnemy) {
            var transform = nearestEnemy.getComponent(Transform);
            if (transform) {
              return {
                x: transform.centerX,
                y: transform.centerY,
              };
            }
          }
          // Fall back to random
          return this._getRandomPositionNearPlayer(playerPos, spawnRange);

        case TargetingMode.WEAKEST:
          var weakestEnemy = this.findWeakestEnemy(player, spawnRange * 2);
          if (weakestEnemy) {
            var wTransform = weakestEnemy.getComponent(Transform);
            if (wTransform) {
              return {
                x: wTransform.centerX,
                y: wTransform.centerY,
              };
            }
          }
          return this._getRandomPositionNearPlayer(playerPos, spawnRange);

        case TargetingMode.RANDOM:
        default:
          return this._getRandomPositionNearPlayer(playerPos, spawnRange);

        case TargetingMode.MOUSE:
          if (this._input) {
            var mousePos = this._input.mouseWorldPosition;
            return {
              x: mousePos.x,
              y: mousePos.y,
            };
          }
          return playerPos;
      }
    }

    /**
     * Get a random position near the player
     * @param {{x: number, y: number}} playerPos
     * @param {number} range
     * @returns {{x: number, y: number}}
     */
    _getRandomPositionNearPlayer(playerPos, range) {
      var angle = Math.random() * Math.PI * 2;
      var distance = Math.random() * range;

      return {
        x: playerPos.x + Math.cos(angle) * distance,
        y: playerPos.y + Math.sin(angle) * distance,
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.AreaBehavior = AreaBehavior;
})(window.VampireSurvivors.Behaviors);
