/**
 * @fileoverview Bleed debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Bleed
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.bleed = {
    id: 'bleed',
    name: 'Bleed',
    description: 'Takes damage when moving',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.DOT, EffectTag.MOVEMENT, EffectTag.VISUAL],

    duration: 4.0,
    maxDuration: 12.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 5,
      stackDecay: false,
    },

    values: {
      damagePerTick: 3,
      tickRate: 2,
      damagePerStack: 2,
    },

    scaling: {
      damagePerTick: 0.1,
    },

    visual: {
      icon: 'effect_bleed',
      color: '#CC0000',
      particleEffect: 'blood_drip',
    },

    conditions: {
      immunityTags: ['bleed_immune'],
      requiresMovement: true,
    },
  };
})(window.VampireSurvivors.Data);
