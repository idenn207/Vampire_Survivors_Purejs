/**
 * @fileoverview Defense Boost buff effect data
 * @module Data/BuffDebuff/Effects/Buffs/DefenseBoost
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.defense_boost = {
    id: 'defense_boost',
    name: 'Defense Boost',
    description: 'Reduces damage taken',
    category: EffectCategory.BUFF,
    tags: [EffectTag.STAT_MOD, EffectTag.DAMAGE_MOD, EffectTag.VISUAL],

    duration: 10.0,
    maxDuration: 30.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 3,
      stackDecay: true,
      decayTime: 5.0,
    },

    values: {
      damageTakenMultiplier: 0.75,
      damageReductionPerStack: 0.05,
      maxHealthBonus: 0.1,
    },

    visual: {
      icon: 'effect_defense',
      color: '#3498DB',
      auraEffect: 'shield_aura',
    },

    statModifiers: {
      damageTaken: { type: 'multiplicative', value: 'damageTakenMultiplier' },
      maxHealth: { type: 'additive', value: 'maxHealthBonus' },
    },
  };
})(window.VampireSurvivors.Data);
