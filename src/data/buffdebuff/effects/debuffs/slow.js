/**
 * @fileoverview Slow debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Slow
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.slow = {
    id: 'slow',
    name: 'Slow',
    description: 'Movement speed reduced',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.MOVEMENT, EffectTag.VISUAL],

    duration: 2.0,
    maxDuration: 8.0,

    stacking: {
      mode: StackingMode.NONE,
      maxStacks: 1,
      stackDecay: false,
    },

    values: {
      speedModifier: 0.7,
    },

    visual: {
      icon: 'effect_slow',
      color: '#6699FF',
      particleEffect: 'slow_waves',
    },

    conditions: {
      immunityTags: ['slow_immune'],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
