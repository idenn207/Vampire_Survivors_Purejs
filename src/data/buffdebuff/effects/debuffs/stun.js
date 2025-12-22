/**
 * @fileoverview Stun debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Stun
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.stun = {
    id: 'stun',
    name: 'Stun',
    description: 'Briefly unable to move',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.MOVEMENT, EffectTag.CONTROL, EffectTag.VISUAL],

    duration: 0.8,
    maxDuration: 3.0,

    stacking: {
      mode: StackingMode.NONE,
      maxStacks: 1,
      stackDecay: false,
    },

    values: {
      speedModifier: 0,
    },

    visual: {
      icon: 'effect_stun',
      color: '#FFFF00',
      particleEffect: 'stun_stars',
    },

    conditions: {
      immunityTags: ['stun_immune'],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
