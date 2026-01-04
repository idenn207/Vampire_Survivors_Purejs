/**
 * @fileoverview Shield buff effect data
 * @module Data/BuffDebuff/Effects/Buffs/ShieldBuff
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.shield_buff = {
    id: 'shield_buff',
    name: 'Shield',
    description: 'Absorbs incoming damage',
    category: EffectCategory.BUFF,
    tags: [EffectTag.DAMAGE_MOD, EffectTag.VISUAL],

    duration: 15.0,
    maxDuration: 30.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 3,
      stackDecay: false,
    },

    values: {
      shieldAmount: 50,
      shieldPerStack: 25,
      damageAbsorption: 1.0,
    },

    scaling: {
      shieldAmount: 0.15,
    },

    visual: {
      icon: 'effect_shield',
      color: '#F1C40F',
      auraEffect: 'shield_bubble',
    },

    conditions: {
      immunityTags: [],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
