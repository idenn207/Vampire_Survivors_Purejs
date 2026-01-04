/**
 * @fileoverview Damage calculation and processing utilities
 * @module Systems/Combat/DamageProcessor
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Health = window.VampireSurvivors.Components.Health;
  var BuffDebuff = window.VampireSurvivors.Components.BuffDebuff;

  // ============================================
  // Damage Processor
  // ============================================
  var DamageProcessor = {
    /**
     * Calculate enhanced damage with crits, execute, weakness modifiers
     * @param {number} baseDamage - Base damage amount
     * @param {Entity} enemy - Target enemy entity
     * @param {Object} weaponConfig - Weapon configuration
     * @param {Object} stats - Stats object to track { criticalHits }
     * @returns {Object} { finalDamage, isCrit }
     */
    calculateEnhancedDamage: function (baseDamage, enemy, weaponConfig, stats) {
      var damage = baseDamage;
      var isCrit = false;

      // 1. Roll for critical hit
      if (weaponConfig) {
        var critChance = weaponConfig.critChance || 0;
        var critMultiplier = weaponConfig.critMultiplier || 2;

        if (critChance > 0 && Math.random() < critChance) {
          damage *= critMultiplier;
          isCrit = true;
          if (stats) stats.criticalHits++;
        }
      }

      // 2. Apply execute bonus (bonus damage to low HP enemies)
      if (weaponConfig && weaponConfig.executeThreshold) {
        var enemyHealth = enemy.getComponent(Health);
        if (enemyHealth) {
          var hpPercent = enemyHealth.currentHealth / enemyHealth.maxHealth;
          if (hpPercent <= weaponConfig.executeThreshold) {
            var executeMultiplier = weaponConfig.executeMultiplier || 2;
            damage *= executeMultiplier;
          }
        }
      }

      // 3. Apply weakness/mark damage modifiers from BuffDebuff component
      var buffDebuff = enemy.getComponent(BuffDebuff);
      if (buffDebuff) {
        var damageTakenModifier = buffDebuff.getDamageTakenModifier();
        damage *= damageTakenModifier;
      }

      // 4. Apply armor penetration (if enemy has armor)
      // Note: Armor system would need to be added to enemies
      // For now, armor pierce is a placeholder for future implementation

      return {
        finalDamage: Math.round(damage),
        isCrit: isCrit,
      };
    },

    /**
     * Apply execute bonus to pre-calculated damage
     * @param {number} damage - Current damage
     * @param {Entity} enemy - Target enemy
     * @param {Object} weaponConfig - Weapon configuration
     * @returns {number} Modified damage
     */
    applyExecuteBonus: function (damage, enemy, weaponConfig) {
      if (!weaponConfig || !weaponConfig.executeThreshold) return damage;

      var enemyHealth = enemy.getComponent(Health);
      if (!enemyHealth) return damage;

      var hpPercent = enemyHealth.currentHealth / enemyHealth.maxHealth;
      if (hpPercent <= weaponConfig.executeThreshold) {
        var executeMultiplier = weaponConfig.executeMultiplier || 2;
        return Math.round(damage * executeMultiplier);
      }

      return damage;
    },

    /**
     * Apply status effect damage modifiers
     * @param {number} damage - Current damage
     * @param {Entity} enemy - Target enemy
     * @returns {number} Modified damage
     */
    applyStatusEffectModifiers: function (damage, enemy) {
      var buffDebuff = enemy.getComponent(BuffDebuff);
      if (buffDebuff) {
        var damageTakenModifier = buffDebuff.getDamageTakenModifier();
        return Math.round(damage * damageTakenModifier);
      }
      return damage;
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.DamageProcessor = DamageProcessor;
})(window.VampireSurvivors.Systems);
