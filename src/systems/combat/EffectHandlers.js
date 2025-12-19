/**
 * @fileoverview Combat effect handlers (status effects, knockback, lifesteal, heal on hit)
 * @module Systems/Combat/EffectHandlers
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Health = window.VampireSurvivors.Components.Health;
  var StatusEffect = window.VampireSurvivors.Components.StatusEffect;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Velocity = window.VampireSurvivors.Components.Velocity;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Effect Handlers
  // ============================================
  var EffectHandlers = {
    /**
     * Apply status effects to enemy
     * @param {Entity} enemy - Target enemy
     * @param {Array} statusEffects - Array of status effect configs
     * @param {Entity} hitbox - Source entity for position
     * @param {Object} stats - Stats object to track { statusEffectsApplied }
     */
    applyStatusEffects: function (enemy, statusEffects, hitbox, stats) {
      if (!statusEffects || statusEffects.length === 0) return;

      // Get or add StatusEffect component
      var statusEffect = enemy.getComponent(StatusEffect);
      if (!statusEffect) {
        statusEffect = new StatusEffect();
        enemy.addComponent(statusEffect);
      }

      // Get hitbox position for pull source
      var hitboxTransform = hitbox.getComponent(Transform);
      var sourcePosition = hitboxTransform
        ? { x: hitboxTransform.x, y: hitboxTransform.y }
        : null;

      for (var i = 0; i < statusEffects.length; i++) {
        var effectConfig = statusEffects[i];

        // Check proc chance
        var chance = effectConfig.chance !== undefined ? effectConfig.chance : 1;
        if (Math.random() > chance) continue;

        // Apply the effect
        var config = Object.assign({}, effectConfig);
        config.sourcePosition = sourcePosition;

        statusEffect.applyEffect(effectConfig.type, config);
        if (stats) stats.statusEffectsApplied++;
      }
    },

    /**
     * Apply knockback to enemy
     * @param {Entity} hitbox - Source entity
     * @param {Entity} enemy - Target enemy
     * @param {number} force - Knockback force
     */
    applyKnockback: function (hitbox, enemy, force) {
      var enemyVelocity = enemy.getComponent(Velocity);
      if (!enemyVelocity) return;

      var hitboxTransform = hitbox.getComponent(Transform);
      var enemyTransform = enemy.getComponent(Transform);
      if (!hitboxTransform || !enemyTransform) return;

      // Calculate direction from hitbox to enemy
      var dx = enemyTransform.x - hitboxTransform.x;
      var dy = enemyTransform.y - hitboxTransform.y;

      // Apply knockback
      enemyVelocity.applyKnockback(dx, dy, force);
    },

    /**
     * Process lifesteal healing
     * @param {Entity} player - Player entity
     * @param {number} damage - Damage dealt
     * @param {number} lifestealPercent - Lifesteal percentage (0-1)
     * @param {Object} stats - Stats object to track { lifestealHealed }
     */
    processLifesteal: function (player, damage, lifestealPercent, stats) {
      if (!player) return;

      var healAmount = Math.floor(damage * lifestealPercent);
      if (healAmount <= 0) return;

      var playerHealth = player.getComponent(Health);
      if (playerHealth && !playerHealth.isDead) {
        playerHealth.heal(healAmount);
        if (stats) stats.lifestealHealed += healAmount;

        events.emit('player:lifesteal', {
          amount: healAmount,
          source: 'weapon',
        });
      }
    },

    /**
     * Process flat heal on hit
     * @param {Entity} player - Player entity
     * @param {number} healAmount - Amount to heal
     */
    processHealOnHit: function (player, healAmount) {
      if (!player || healAmount <= 0) return;

      var playerHealth = player.getComponent(Health);
      if (playerHealth && !playerHealth.isDead) {
        playerHealth.heal(healAmount);

        events.emit('player:healed', {
          amount: healAmount,
          source: 'heal_on_hit',
        });
      }
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.EffectHandlers = EffectHandlers;
})(window.VampireSurvivors.Systems);
