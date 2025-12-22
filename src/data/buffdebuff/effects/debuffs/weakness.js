/**
 * @fileoverview Weakness debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Weakness
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.weakness = {
    id: 'weakness',
    name: 'Weakness',
    description: 'Takes increased damage',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.DAMAGE_MOD, EffectTag.VISUAL],

    duration: 4.0,
    maxDuration: 12.0,

    stacking: {
      mode: StackingMode.NONE,
      maxStacks: 1,
      stackDecay: false,
    },

    values: {
      damageTakenMultiplier: 1.25,
    },

    visual: {
      icon: 'effect_weakness',
      color: '#9966FF',
      particleEffect: 'weakness_aura',
    },

    conditions: {
      immunityTags: ['weakness_immune'],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
