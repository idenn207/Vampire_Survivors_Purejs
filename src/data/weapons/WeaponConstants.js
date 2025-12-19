/**
 * @fileoverview Weapon system constants - shared across all weapon definitions
 * @module Data/Weapons/WeaponConstants
 */
(function (Data) {
  'use strict';

  // ============================================
  // Attack Type Constants
  // ============================================
  var AttackType = {
    PROJECTILE: 'projectile',
    LASER: 'laser',
    MELEE_SWING: 'melee_swing',
    AREA_DAMAGE: 'area_damage',
    PARTICLE: 'particle',
    MINE: 'mine',
    SUMMON: 'summon',
  };

  // ============================================
  // Targeting Mode Constants
  // ============================================
  var TargetingMode = {
    NEAREST: 'nearest',
    RANDOM: 'random',
    WEAKEST: 'weakest',
    MOUSE: 'mouse',
    ROTATING: 'rotating',
    CHAIN: 'chain',
  };

  // ============================================
  // Rarity Constants
  // ============================================
  var Rarity = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
  };

  // Rarity colors for UI
  var RarityColors = {
    common: '#AAAAAA',
    uncommon: '#55AA55',
    rare: '#5555FF',
    epic: '#AA55AA',
  };

  // ============================================
  // Visual Effect Presets
  // ============================================
  var VisualPresets = {
    // Trail effects
    trails: {
      fire: { color: '#FF6600', length: 15, fade: 0.8 },
      ice: { color: '#66FFFF', length: 12, fade: 0.6 },
      lightning: { color: '#FFFF00', length: 20, fade: 0.9 },
      void: { color: '#660066', length: 18, fade: 0.7 },
      holy: { color: '#FFFFAA', length: 14, fade: 0.5 },
      blood: { color: '#AA0000', length: 10, fade: 0.85 },
      arcane: { color: '#AA00FF', length: 16, fade: 0.75 },
      nature: { color: '#00AA00', length: 12, fade: 0.65 },
    },
    // Glow effects
    glow: {
      soft: { radius: 10, intensity: 0.3, pulse: false },
      bright: { radius: 15, intensity: 0.6, pulse: false },
      pulsing: { radius: 12, intensity: 0.5, pulse: true, pulseSpeed: 2 },
      intense: { radius: 20, intensity: 0.8, pulse: true, pulseSpeed: 3 },
    },
    // Particle effects
    particles: {
      sparkle: { count: 5, spread: 10, lifetime: 0.3 },
      burst: { count: 12, spread: 30, lifetime: 0.5 },
      shower: { count: 20, spread: 50, lifetime: 0.8 },
      storm: { count: 30, spread: 80, lifetime: 1.0 },
    },
  };

  // ============================================
  // Status Effect Presets (for easy reference)
  // ============================================
  var StatusPresets = {
    burn_light: { type: 'burn', damage: 3, duration: 2.0, tickRate: 0.5 },
    burn_heavy: { type: 'burn', damage: 8, duration: 3.0, tickRate: 0.5 },
    poison_stack: { type: 'poison', damage: 2, duration: 5.0, tickRate: 1, stackable: true, maxStacks: 5 },
    freeze_short: { type: 'freeze', duration: 1.0 },
    freeze_long: { type: 'freeze', duration: 2.0 },
    slow_light: { type: 'slow', speedModifier: 0.7, duration: 2.0 },
    slow_heavy: { type: 'slow', speedModifier: 0.4, duration: 3.0 },
    stun_short: { type: 'stun', duration: 0.5 },
    stun_long: { type: 'stun', duration: 1.0 },
    bleed_light: { type: 'bleed', damage: 2, duration: 3.0, tickRate: 0.5 },
    bleed_heavy: { type: 'bleed', damage: 5, duration: 4.0, tickRate: 0.3 },
    weakness: { type: 'weakness', damageMultiplier: 1.25, duration: 4.0 },
    mark: { type: 'mark', damageMultiplier: 1.1, duration: 6.0, stackable: true, maxStacks: 5 },
    pull: { type: 'pull', pullForce: 50, duration: 2.0 },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Data.AttackType = AttackType;
  Data.TargetingMode = TargetingMode;
  Data.Rarity = Rarity;
  Data.RarityColors = RarityColors;
  Data.VisualPresets = VisualPresets;
  Data.StatusPresets = StatusPresets;

  // Create weapons registry for individual weapon files to register to
  Data.WeaponRegistry = Data.WeaponRegistry || {};
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
