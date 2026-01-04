/**
 * @fileoverview Mark debuff effect data
 * @module Data/BuffDebuff/Effects/Debuffs/Mark
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.mark = {
    id: 'mark',
    name: 'Mark',
    description: 'Stacking damage increase per mark',
    category: EffectCategory.DEBUFF,
    tags: [EffectTag.DAMAGE_MOD, EffectTag.VISUAL],

    duration: 6.0,
    maxDuration: 15.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 5,
      stackDecay: true,
      decayTime: 3.0,
    },

    values: {
      damageTakenMultiplier: 1.1,
    },

    visual: {
      icon: 'effect_mark',
      color: '#FF00FF',
      particleEffect: 'mark_symbol',
    },

    conditions: {
      immunityTags: ['mark_immune'],
      requiresMovement: false,
    },
  };
})(window.VampireSurvivors.Data);
