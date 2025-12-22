/**
 * @fileoverview Buff/Debuff type definitions, categories, and constants
 * @module Data/BuffDebuff/BuffDebuffConstants
 */
(function (Data) {
  'use strict';

  // ============================================
  // Initialize Registry
  // ============================================
  Data.BuffDebuffRegistry = Data.BuffDebuffRegistry || {};

  // ============================================
  // Effect Categories
  // ============================================
  var EffectCategory = {
    DEBUFF: 'debuff',
    BUFF: 'buff',
    AURA: 'aura',
    ENVIRONMENTAL: 'environmental',
  };

  // ============================================
  // Effect Type Constants (unique identifiers)
  // ============================================
  var EffectType = {
    // Debuffs (DoT)
    BURN: 'burn',
    POISON: 'poison',
    BLEED: 'bleed',

    // Debuffs (Movement)
    FREEZE: 'freeze',
    SLOW: 'slow',
    STUN: 'stun',

    // Debuffs (Damage Taken)
    WEAKNESS: 'weakness',
    MARK: 'mark',

    // Debuffs (Special)
    PULL: 'pull',

    // Buffs (Stat Boosts)
    ATTACK_BOOST: 'attack_boost',
    SPEED_BOOST: 'speed_boost',
    DEFENSE_BOOST: 'defense_boost',
    CRIT_BOOST: 'crit_boost',
    COOLDOWN_REDUCTION: 'cooldown_reduction',

    // Buffs (Healing)
    REGEN: 'regen',
    LIFESTEAL_BOOST: 'lifesteal_boost',

    // Buffs (Special)
    SHIELD: 'shield_buff',
    AURORA: 'aurora',
    MAGNET: 'magnet',
    INVINCIBLE: 'invincible',
  };

  // ============================================
  // Stacking Mode Constants
  // ============================================
  var StackingMode = {
    NONE: 'none',
    INTENSITY: 'intensity',
    DURATION: 'duration',
    INDEPENDENT: 'independent',
  };

  // ============================================
  // Effect Tags (for filtering/queries)
  // ============================================
  var EffectTag = {
    DOT: 'dot',
    HOT: 'hot',
    MOVEMENT: 'movement',
    DAMAGE_MOD: 'damage_mod',
    STAT_MOD: 'stat_mod',
    HEALING: 'healing',
    CONTROL: 'control',
    VISUAL: 'visual',
    AURA: 'aura',
  };

  // ============================================
  // Priority for Conflicting Movement Effects
  // ============================================
  var EffectPriority = {
    freeze: 3,
    stun: 2,
    slow: 1,
  };

  // ============================================
  // Visual Colors for Effects
  // ============================================
  var EffectColors = {
    burn: '#FF6600',
    poison: '#00FF00',
    bleed: '#CC0000',
    freeze: '#00FFFF',
    slow: '#6699FF',
    stun: '#FFFF00',
    weakness: '#9966FF',
    mark: '#FF00FF',
    pull: '#9933FF',
    attack_boost: '#E74C3C',
    speed_boost: '#2ECC71',
    defense_boost: '#3498DB',
    regen: '#27AE60',
    shield_buff: '#F1C40F',
    aurora: '#9B59B6',
    magnet: '#E91E63',
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Data.EffectCategory = EffectCategory;
  Data.BuffDebuffType = EffectType;
  Data.StackingMode = StackingMode;
  Data.EffectTag = EffectTag;
  Data.EffectPriority = EffectPriority;
  Data.EffectColors = EffectColors;
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
