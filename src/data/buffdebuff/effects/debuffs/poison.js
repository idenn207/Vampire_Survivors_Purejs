/**
 * @fileoverview Poison debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Poison
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.poison = {
    id: 'poison',
    name: 'Poison',
    description: 'Stacking damage over time',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.DOT, EffectTag.VISUAL],

    duration: 5.0,
    maxDuration: 15.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 10,
      stackDecay: false,
    },

    values: {
      damagePerTick: 2,
      tickRate: 1,
      damagePerStack: 2,
    },

    scaling: {
      damagePerTick: 0.08,
    },

    visual: {
      icon: 'effect_poison',
      color: '#00FF00',
      particleEffect: 'poison_bubbles',
    },

    conditions: {
      immunityTags: ['poison_immune'],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
