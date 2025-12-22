/**
 * @fileoverview Aurora buff effect data
 * @module Data/BuffDebuff/Effects/Buffs/Aurora
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.aurora = {
    id: 'aurora',
    name: 'Aurora',
    description: 'Damaging aura around the player',
    category: EffectCategory.BUFF,
    tags: [EffectTag.AURA, EffectTag.DAMAGE_MOD, EffectTag.VISUAL],

    duration: 12.0,
    maxDuration: 30.0,

    stacking: {
      mode: StackingMode.NONE,
      maxStacks: 1,
      stackDecay: false,
    },

    values: {
      auraRadius: 120,
      auraDamagePercent: 0.15,
      auraTickRate: 0.5,
      statusEffects: ['burn'],
    },

    scaling: {
      auraRadius: 0.1,
      auraDamagePercent: 0.05,
    },

    visual: {
      icon: 'effect_aurora',
      color: '#9B59B6',
      auraEffect: 'aurora_circle',
    },

    conditions: {
      immunityTags: [],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
