/**
 * @fileoverview Evolution handling for weapons
 * @module Systems/LevelUp/EvolutionHandler
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Weapon = window.VampireSurvivors.Components.Weapon;
  var Data = window.VampireSurvivors.Data;
  var events = window.VampireSurvivors.Core.events;
  var EvolutionState = Systems.EvolutionState;

  // ============================================
  // Evolution Handler
  // ============================================
  var EvolutionHandler = {
    /**
     * Select a weapon as the main weapon for evolution
     * @param {Object} option - Evolution main option
     * @param {Object} stateRef - State reference to update { evolutionState, selectedMainWeapon }
     */
    selectMainWeapon: function (option, stateRef) {
      stateRef.selectedMainWeapon = option.weaponRef;
      stateRef.evolutionState = EvolutionState.SELECTING_MATERIAL;

      events.emitSync('evolution:main_selected', {
        weaponId: option.weaponId,
        weapon: option.weaponRef,
      });
    },

    /**
     * Cancel evolution and return to normal selection
     * @param {Object} stateRef - State reference to update { evolutionState, selectedMainWeapon }
     */
    cancelEvolution: function (stateRef) {
      stateRef.evolutionState = EvolutionState.NORMAL;
      stateRef.selectedMainWeapon = null;

      events.emitSync('evolution:cancelled', {});
    },

    /**
     * Perform weapon evolution from material selection
     * @param {Entity} player - Player entity
     * @param {Object} option - Evolution material option
     * @param {Weapon} selectedMainWeapon - Previously selected main weapon
     * @param {Object} stateRef - State reference to update { evolutionState, selectedMainWeapon }
     */
    performEvolution: function (player, option, selectedMainWeapon, stateRef) {
      if (!player || !player.weaponSlot) return;

      var weaponSlot = player.weaponSlot;

      // Get main weapon from stored selection and material from option
      var mainWeapon = option.mainWeapon || selectedMainWeapon;
      var materialWeapon = option.weaponRef;

      if (!mainWeapon || !materialWeapon) {
        console.warn('[EvolutionHandler] Evolution failed - missing weapons');
        return;
      }

      // Remove material weapon first
      weaponSlot.removeWeapon(materialWeapon.id);

      // Create evolved weapon and replace main weapon (preserves slot index)
      var evolvedWeapon = new Weapon(option.evolutionResult);
      weaponSlot.replaceWeapon(mainWeapon.id, evolvedWeapon);

      // Reset evolution state
      stateRef.evolutionState = EvolutionState.NORMAL;
      stateRef.selectedMainWeapon = null;

      // Emit evolution completed event
      events.emitSync('upgrade:evolution_completed', {
        mainWeapon: mainWeapon.id,
        materialWeapon: materialWeapon.id,
        result: option.evolutionResult.id,
        evolvedWeapon: evolvedWeapon,
      });
    },

    /**
     * Handle tier-based evolution from the EvolutionPopup
     * @param {Entity} player - Player entity
     * @param {Object} popupResult - Result from EvolutionPopup
     * @param {BlacklistManager} blacklistManager - Blacklist manager
     * @param {Object} stateRef - State reference to update { evolutionState, selectedMainWeapon }
     */
    handleTierEvolution: function (player, popupResult, blacklistManager, stateRef) {
      if (!player || !player.weaponSlot) return;

      var weaponSlot = player.weaponSlot;
      var mainWeapon = popupResult.mainWeapon;
      var materialWeapon = popupResult.materialWeapon;
      var isKnownRecipe = popupResult.isKnownRecipe;
      var evolutionResult = popupResult.evolutionResult;

      if (!mainWeapon || !materialWeapon) {
        console.warn('[EvolutionHandler] Tier evolution failed - missing weapons');
        return;
      }

      // Note: Blacklist removed - weapons can reappear after evolution

      // Remove material weapon first (main weapon will be replaced to preserve slot index)
      weaponSlot.removeWeapon(materialWeapon.id);

      // Determine the evolved weapon
      var evolvedWeaponData;

      if (isKnownRecipe && evolutionResult && !evolutionResult.isRandom) {
        // Known recipe - use the predefined evolved weapon
        evolvedWeaponData = evolutionResult;
      } else {
        // Unknown recipe - get a random weapon of the next tier
        var currentTier = mainWeapon.tier;
        var nextTier = currentTier + 1;

        // Get currently owned weapon IDs
        var ownedIds = weaponSlot.weapons.map(function (w) {
          return w.id;
        });
        ownedIds.push(mainWeapon.id);
        ownedIds.push(materialWeapon.id);

        var WeaponEvolutionData = Data.WeaponEvolutionData;
        evolvedWeaponData = WeaponEvolutionData.getRandomUnownedWeaponOfTier(ownedIds, nextTier);

        if (!evolvedWeaponData) {
          // Fallback - get any weapon of the next tier
          var tierWeapons = WeaponEvolutionData.getAllWeaponsOfTier(nextTier);
          if (tierWeapons.length > 0) {
            evolvedWeaponData = tierWeapons[Math.floor(Math.random() * tierWeapons.length)];
          }
        }
      }

      if (!evolvedWeaponData) {
        console.warn('[EvolutionHandler] Tier evolution failed - no evolved weapon data');
        return;
      }

      // Create evolved weapon and replace main weapon (preserves slot index)
      var evolvedWeapon = new Weapon(evolvedWeaponData);
      weaponSlot.replaceWeapon(mainWeapon.id, evolvedWeapon);

      // Reset evolution state
      stateRef.evolutionState = EvolutionState.NORMAL;
      stateRef.selectedMainWeapon = null;

      // Emit evolution completed event
      events.emitSync('upgrade:tier_evolution_completed', {
        mainWeapon: mainWeapon.id,
        materialWeapon: materialWeapon.id,
        result: evolvedWeaponData.id,
        evolvedWeapon: evolvedWeapon,
        isKnownRecipe: isKnownRecipe,
        fromTier: mainWeapon.tier,
        toTier: evolvedWeapon.tier,
      });

      console.log(
        '[EvolutionHandler] Tier evolution completed:',
        mainWeapon.id,
        '+',
        materialWeapon.id,
        '->',
        evolvedWeaponData.id
      );
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.EvolutionHandler = EvolutionHandler;
})(window.VampireSurvivors.Systems);
