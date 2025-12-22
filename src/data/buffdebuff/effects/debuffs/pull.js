/**
 * @fileoverview Pull debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Pull
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.pull = {
    id: 'pull',
    name: 'Pull',
    description: 'Being pulled toward source',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.MOVEMENT, EffectTag.VISUAL],

    duration: 3.0,
    maxDuration: 8.0,

    stacking: {
      mode: StackingMode.NONE,
      maxStacks: 1,
      stackDecay: false,
    },

    values: {
      pullForce: 50,
    },

    scaling: {
      pullForce: 0.15,
    },

    visual: {
      icon: 'effect_pull',
      color: '#9933FF',
      particleEffect: 'gravity_pull',
    },

    conditions: {
      immunityTags: ['pull_immune'],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
