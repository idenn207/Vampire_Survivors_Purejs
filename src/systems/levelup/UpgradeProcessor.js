/**
 * @fileoverview Upgrade processing for weapons and stats
 * @module Systems/LevelUp/UpgradeProcessor
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Weapon = window.VampireSurvivors.Components.Weapon;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Upgrade Processor
  // ============================================
  var UpgradeProcessor = {
    /**
     * Add a new weapon to the player
     * @param {Entity} player - Player entity
     * @param {Object} option - New weapon option
     */
    addNewWeapon: function (player, option) {
      if (!player || !player.weaponSlot) return;

      var newWeapon = new Weapon(option.weaponData);
      player.weaponSlot.addWeapon(newWeapon);

      events.emitSync('upgrade:weapon_added', {
        weaponId: option.weaponId,
        weapon: newWeapon,
      });
    },

    /**
     * Upgrade an existing weapon
     * @param {Object} option - Upgrade option with weaponRef
     */
    upgradeExistingWeapon: function (option) {
      if (!option.weaponRef) return;

      option.weaponRef.upgrade();

      events.emitSync('upgrade:weapon_leveled', {
        weaponId: option.weaponId,
        newLevel: option.weaponRef.level,
      });
    },

    /**
     * Apply a free stat upgrade
     * @param {Entity} player - Player entity
     * @param {Object} option - Stat option
     */
    applyFreeStat: function (player, option) {
      if (!player || !player.playerStats) return;

      var playerStats = player.playerStats;
      playerStats.applyFreeUpgrade(option.statId);

      // Apply immediate effects
      this.applyStatEffect(player, option.statId);

      events.emitSync('upgrade:free_stat_applied', {
        statId: option.statId,
      });
    },

    /**
     * Apply immediate stat effects
     * @param {Entity} player - Player entity
     * @param {string} statId - Stat ID
     */
    applyStatEffect: function (player, statId) {
      if (!player || !player.playerStats) return;

      var playerStats = player.playerStats;

      switch (statId) {
        case 'maxHealth':
          var health = player.health;
          if (health) {
            var baseMax = 100;
            var newMax = Math.floor(baseMax * playerStats.getMultiplier('maxHealth'));
            var oldMax = health.maxHealth;
            health.setMaxHealth(newMax, false);
            health.heal(newMax - oldMax);
          }
          break;

        case 'moveSpeed':
          var baseSpeed = 200;
          player.speed = Math.floor(baseSpeed * playerStats.getMultiplier('moveSpeed'));
          break;
      }
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.UpgradeProcessor = UpgradeProcessor;
})(window.VampireSurvivors.Systems);
