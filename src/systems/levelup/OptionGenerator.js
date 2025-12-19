/**
 * @fileoverview Option generation for level-up screen
 * @module Systems/LevelUp/OptionGenerator
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Data = window.VampireSurvivors.Data;
  var LevelUpConstants = Systems.LevelUpConstants;
  var EvolutionState = Systems.EvolutionState;

  // ============================================
  // Option Generator
  // ============================================
  var OptionGenerator = {
    /**
     * Generate weapon options based on current state
     * @param {Entity} player - Player entity
     * @param {string} evolutionState - Current evolution state
     * @param {Weapon} selectedMainWeapon - Selected main weapon (for material selection)
     * @param {BlacklistManager} blacklistManager - Blacklist manager
     * @returns {Array<Object>} Array of options
     */
    generateOptions: function (player, evolutionState, selectedMainWeapon, blacklistManager) {
      if (evolutionState === EvolutionState.SELECTING_MATERIAL) {
        return this.generateMaterialOptions(player, selectedMainWeapon);
      }
      return this.generateNormalOptions(player, blacklistManager);
    },

    /**
     * Generate normal weapon options (new weapons, upgrades, evolution main weapons)
     * @param {Entity} player - Player entity
     * @param {BlacklistManager} blacklistManager - Blacklist manager
     * @returns {Array<Object>}
     */
    generateNormalOptions: function (player, blacklistManager) {
      var options = [];
      var pool = [];
      var OPTIONS_COUNT = LevelUpConstants.OPTIONS_COUNT;

      if (!player || !player.weaponSlot) {
        return options;
      }

      var weaponSlot = player.weaponSlot;
      var equippedWeapons = weaponSlot.weapons || [];
      var equippedIds = equippedWeapons.map(function (w) {
        return w.id;
      });

      // Check if all slots full and all max level
      var allSlotsFull = weaponSlot.isFull;
      var allWeaponsMaxLevel =
        allSlotsFull &&
        equippedWeapons.every(function (w) {
          return w.isMaxLevel;
        });

      // 1. If all slots full AND all max level -> add stat boosts
      if (allWeaponsMaxLevel) {
        var statOrder = Data.StatUpgradeData.getStatOrder();
        for (var s = 0; s < statOrder.length; s++) {
          var statId = statOrder[s];
          var statConfig = Data.StatUpgradeData.getStatConfig(statId);
          if (statConfig) {
            pool.push({
              type: 'stat',
              statId: statId,
              statConfig: statConfig,
            });
          }
        }
        this._shuffle(pool);
        for (var p = 0; p < pool.length && options.length < OPTIONS_COUNT; p++) {
          options.push(pool[p]);
        }
        return options;
      }

      // 2. New weapons (if player has empty slots)
      if (!allSlotsFull) {
        var allWeaponIds = Data.getAllWeaponIds();

        // Filter out blacklisted weapons
        if (blacklistManager) {
          allWeaponIds = blacklistManager.filterBlacklisted(allWeaponIds);
        }

        for (var i = 0; i < allWeaponIds.length; i++) {
          var weaponId = allWeaponIds[i];
          if (equippedIds.indexOf(weaponId) === -1) {
            var weaponData = Data.getWeaponData(weaponId);
            if (weaponData) {
              pool.push({
                type: 'new',
                weaponId: weaponId,
                weaponData: weaponData,
              });
            }
          }
        }
      }

      // 3. Existing weapon upgrades (for weapons not at max level)
      for (var j = 0; j < equippedWeapons.length; j++) {
        var weapon = equippedWeapons[j];
        if (!weapon.isMaxLevel) {
          pool.push({
            type: 'upgrade',
            weaponId: weapon.id,
            weaponData: weapon.data,
            currentLevel: weapon.level,
            weaponRef: weapon,
          });
        }
      }

      // Shuffle and fill remaining slots
      this._shuffle(pool);
      for (var n = 0; n < pool.length && options.length < OPTIONS_COUNT; n++) {
        options.push(pool[n]);
      }

      return options;
    },

    /**
     * Generate material weapon options for the selected main weapon
     * @param {Entity} player - Player entity
     * @param {Weapon} selectedMainWeapon - Selected main weapon
     * @returns {Array<Object>}
     */
    generateMaterialOptions: function (player, selectedMainWeapon) {
      var options = [];

      if (!player || !player.weaponSlot || !selectedMainWeapon) {
        return options;
      }

      var WeaponEvolutionData = Data.WeaponEvolutionData;
      var weaponSlot = player.weaponSlot;
      var equippedWeapons = weaponSlot.weapons || [];
      var mainWeaponId = selectedMainWeapon.id;

      // Get all potential evolution partners for the main weapon
      var partnerIds = WeaponEvolutionData.getEvolutionPartners(mainWeaponId);

      // Find equipped weapons that are valid materials
      for (var i = 0; i < equippedWeapons.length; i++) {
        var weapon = equippedWeapons[i];

        // Skip if this is the main weapon
        if (weapon.id === mainWeaponId) continue;

        // Must be max level and in partner list
        if (weapon.isMaxLevel && partnerIds.indexOf(weapon.id) !== -1) {
          var evolved = WeaponEvolutionData.findEvolution(mainWeaponId, weapon.id);
          if (evolved) {
            options.push({
              type: 'evolution_material',
              weaponId: weapon.id,
              weaponData: weapon.data,
              weaponRef: weapon,
              mainWeapon: selectedMainWeapon,
              evolutionResult: evolved,
            });
          }
        }
      }

      // Add cancel option
      options.push({
        type: 'evolution_cancel',
      });

      return options;
    },

    /**
     * Check if tier-based evolution is available
     * @param {Entity} player - Player entity
     * @returns {Object} { canEvolve: boolean, eligibleTiers: { [tier]: Weapon[] } }
     */
    checkEvolutionEligibility: function (player) {
      var result = {
        canEvolve: false,
        eligibleTiers: {},
      };

      if (!player || !player.weaponSlot) {
        return result;
      }

      var weapons = player.weaponSlot.weapons || [];

      // Group weapons by tier that are at max level and below max tier
      for (var i = 0; i < weapons.length; i++) {
        var weapon = weapons[i];
        if (!weapon) continue;

        // Must be at max level
        if (weapon.level < weapon.maxLevel) continue;

        // Must be below max tier
        if (weapon.tier >= weapon.maxTier) continue;

        var tier = weapon.tier;
        if (!result.eligibleTiers[tier]) {
          result.eligibleTiers[tier] = [];
        }
        result.eligibleTiers[tier].push(weapon);
      }

      // Check if any tier has 2+ weapons
      for (var t in result.eligibleTiers) {
        if (result.eligibleTiers[t].length >= 2) {
          result.canEvolve = true;
          break;
        }
      }

      return result;
    },

    /**
     * Shuffle an array in place
     * @param {Array} array
     */
    _shuffle: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.OptionGenerator = OptionGenerator;
})(window.VampireSurvivors.Systems);
