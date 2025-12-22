/**
 * @fileoverview Burn debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Burn
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.burn = {
    id: 'burn',
    name: 'Burn',
    description: 'Takes fire damage over time',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.DOT, EffectTag.VISUAL],

    duration: 3.0,
    maxDuration: 10.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 5,
      stackDecay: false,
    },

    values: {
      damagePerTick: 5,
      tickRate: 2,
      damagePerStack: 2,
    },

    scaling: {
      damagePerTick: 0.1,
    },

    visual: {
      icon: 'effect_burn',
      color: '#FF6600',
      particleEffect: 'fire_particles',
    },

    conditions: {
      immunityTags: ['fire_immune'],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
