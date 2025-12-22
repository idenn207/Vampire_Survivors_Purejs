/**
 * @fileoverview Magnet buff effect data
 * @module Data/BuffDebuff/Effects/Buffs/Magnet
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.magnet = {
    id: 'magnet',
    name: 'Magnet',
    description: 'Increases pickup range',
    category: EffectCategory.BUFF,
    tags: [EffectTag.STAT_MOD, EffectTag.VISUAL],

    duration: 15.0,
    maxDuration: 45.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 3,
      stackDecay: false,
    },

    values: {
      pickupRangeBonus: 1.0,
      pickupRangePerStack: 0.5,
    },

    visual: {
      icon: 'effect_magnet',
      color: '#E91E63',
      auraEffect: 'magnet_field',
    },

    statModifiers: {
      pickupRange: { type: 'additive', value: 'pickupRangeBonus' },
    },

    conditions: {
      immunityTags: [],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
