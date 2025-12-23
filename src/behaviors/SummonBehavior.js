/**
 * @fileoverview Summon weapon behavior - spawns AI-controlled fighters
 * @module Behaviors/SummonBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponBehavior = Behaviors.WeaponBehavior;
  var summonPool = window.VampireSurvivors.Pool.summonPool;

  // ============================================
  // Class Definition
  // ============================================
  class SummonBehavior extends WeaponBehavior {
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
     * Execute summon weapon behavior - spawns AI fighters
     * @param {Weapon} weapon
     * @param {Entity} player
     * @returns {Array} Spawned summons
     */
    execute(weapon, player) {
      var summons = [];
      var playerPos = this.getPlayerCenter(player);

      // Get weapon stats
      var summonCount = weapon.getStat('summonCount', 1);
      var baseDamage = weapon.getStat('damage', 20);
      var summonHealth = weapon.getStat('summonHealth', 50);
      var attackCooldown = weapon.getStat('cooldown', 1.0);
      var baseAttackRange = weapon.getStat('attackRange', 50);
      var summonSpeed = weapon.getStat('summonSpeed', 150);
      var baseDuration = weapon.getStat('duration', 15);
      var color = weapon.getStat('color', '#88CCFF');
      var summonImageId = weapon.getStat('summonImageId', null);
      var summonSize = weapon.getStat('summonSize', null);
      var attackWindup = weapon.getStat('attackWindup', 0.2);
      var attackPattern = weapon.getStat('attackPattern', 'melee');
      var projectileSpeed = weapon.getStat('projectileSpeed', 400);
      var projectileSize = weapon.getStat('projectileSize', 6);
      var projectileColor = weapon.getStat('projectileColor', '#FFDD00');

      // Apply player stat bonuses
      var damageResult = this.calculateDamage(weapon);
      var damage = damageResult.damage;
      var attackRange = this.getEffectiveRange(baseAttackRange);
      var duration = this.getEffectiveDuration(baseDuration);

      // Spawn summons around player
      for (var i = 0; i < summonCount; i++) {
        var spawnPos = this._getSpawnPosition(playerPos, summonCount, i);

        var summon = summonPool.spawn(
          spawnPos.x,
          spawnPos.y,
          damage,
          summonHealth,
          attackCooldown,
          attackRange,
          summonSpeed,
          duration,
          color,
          weapon.id,
          player,
          summonImageId,
          summonSize,
          attackWindup,
          attackPattern,
          projectileSpeed,
          projectileSize,
          projectileColor
        );

        if (summon) {
          summons.push(summon);
        }
      }

      return summons;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Get spawn position for a summon
     * @param {{x: number, y: number}} playerPos
     * @param {number} totalSummons
     * @param {number} index
     * @returns {{x: number, y: number}}
     */
    _getSpawnPosition(playerPos, totalSummons, index) {
      // Spawn summons in a circle around player
      var spawnRadius = 40;
      var angleStep = (Math.PI * 2) / totalSummons;
      var angle = angleStep * index;

      return {
        x: playerPos.x + Math.cos(angle) * spawnRadius,
        y: playerPos.y + Math.sin(angle) * spawnRadius,
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.SummonBehavior = SummonBehavior;
})(window.VampireSurvivors.Behaviors);
