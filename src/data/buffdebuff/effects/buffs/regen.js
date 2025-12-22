/**
 * @fileoverview Regeneration buff effect data
 * @module Data/BuffDebuff/Effects/Buffs/Regen
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.regen = {
    id: 'regen',
    name: 'Regeneration',
    description: 'Heals over time',
    category: EffectCategory.BUFF,
    tags: [EffectTag.HOT, EffectTag.HEALING, EffectTag.VISUAL],

    duration: 8.0,
    maxDuration: 20.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 5,
      stackDecay: false,
    },

    values: {
      healPerTick: 2,
      tickRate: 1,
      healPerStack: 1,
    },

    scaling: {
      healPerTick: 0.1,
    },

    visual: {
      icon: 'effect_regen',
      color: '#27AE60',
      particleEffect: 'heal_sparkles',
    },

    conditions: {
      immunityTags: [],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
