/**
 * @fileoverview Speed Boost buff effect data
 * @module Data/BuffDebuff/Effects/Buffs/SpeedBoost
 */
(function (Data) {
  'use strict';

  var StackingMode = Data.StackingMode;
  var EffectCategory = Data.EffectCategory;
  var EffectTag = Data.EffectTag;

  Data.BuffDebuffRegistry.speed_boost = {
    id: 'speed_boost',
    name: 'Speed Boost',
    description: 'Increases movement and attack speed',
    category: EffectCategory.BUFF,
    tags: [EffectTag.STAT_MOD, EffectTag.MOVEMENT, EffectTag.VISUAL],

    duration: 8.0,
    maxDuration: 24.0,

    stacking: {
      mode: StackingMode.INTENSITY,
      maxStacks: 3,
      stackDecay: true,
      decayTime: 4.0,
    },

    values: {
      moveSpeedBonus: 0.3,
      moveSpeedPerStack: 0.1,
      cooldownReduction: 0.15,
      durationBonus: 0.1,
    },

    visual: {
      icon: 'effect_speed',
      color: '#2ECC71',
      auraEffect: 'speed_trail',
    },

    statModifiers: {
      moveSpeed: { type: 'additive', value: 'moveSpeedBonus' },
      cooldownReduction: { type: 'additive', value: 'cooldownReduction' },
      duration: { type: 'additive', value: 'durationBonus' },
    },
  };
})(window.VampireSurvivors.Data);
