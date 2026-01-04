/**
 * @fileoverview Freeze debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Freeze
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.freeze = {
    id: 'freeze',
    name: 'Freeze',
    description: 'Completely frozen in place',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.MOVEMENT, EffectTag.CONTROL, EffectTag.VISUAL],

    duration: 1.5,
    maxDuration: 5.0,

    stacking: {
      mode: StackingMode.NONE,
      maxStacks: 1,
      stackDecay: false,
    },

    values: {
      speedModifier: 0,
    },

    visual: {
      icon: 'effect_freeze',
      color: '#00FFFF',
      particleEffect: 'ice_crystals',
    },

    conditions: {
      immunityTags: ['freeze_immune', 'ice_immune'],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
