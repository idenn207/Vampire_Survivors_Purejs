/**
 * @fileoverview Attack Boost buff effect data
 * @module Data/BuffDebuff/Effects/Buffs/AttackBoost
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.attack_boost = {
    id: 'attack_boost',
    name: 'Attack Boost',
    description: 'Increases damage dealt',
    category: EffectCategory.BUFF,
    tags: [EffectTag.STAT_MOD, EffectTag.VISUAL],

    duration: 10.0,
    maxDuration: 30.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 3,
      stackDecay: true,
      decayTime: 5.0,
    },

    values: {
      damageMultiplier: 1.25,
      damagePerStack: 0.1,
      critChanceBonus: 0.05,
      critDamageBonus: 0.15,
    },

    visual: {
      icon: 'effect_attack',
      color: '#E74C3C',
      auraEffect: 'attack_glow',
    },

    statModifiers: {
      damage: { type: 'multiplicative', value: 'damageMultiplier' },
      critChance: { type: 'additive', value: 'critChanceBonus' },
      critDamage: { type: 'additive', value: 'critDamageBonus' },
    },
  };
})(window.VampireSurvivors.Data);
