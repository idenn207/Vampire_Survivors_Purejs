/**
 * @fileoverview Boss Constants - Scaling config and registry initialization
 * @module Data/Bosses/BossConstants
 */
(function (Data) {
  'use strict';

  // ============================================
  // Scaling Configuration
  // ============================================
  var ScalingConfig = {
    HEALTH_PER_WAVE: 0.6, // +60% health per wave (matches enemy scaling)
    DAMAGE_PER_WAVE: 0.05, // +5% damage per wave (matches enemy scaling)
  };

  // ============================================
  // Phase Colors (for health bar)
  // ============================================
  var PhaseColors = ['#2ECC71', '#F1C40F', '#E67E22', '#E74C3C']; // Green, Yellow, Orange, Red

  // ============================================
  // First Appearance Waves
  // ============================================
  var FirstWaves = {
    elite: 2, // Every 2 waves (2, 4, 8...)
    miniboss: 3, // Every 3 waves (3, 6, 9...)
    boss: 5, // Every 5 waves (5, 10, 15...)
  };

  // ============================================
  // Initialize Registry
  // ============================================
  Data.BossRegistry = Data.BossRegistry || {};

  // ============================================
  // Export to Namespace
  // ============================================
  Data.BossScalingConfig = ScalingConfig;
  Data.BossPhaseColors = PhaseColors;
  Data.BossFirstWaves = FirstWaves;
})(window.VampireSurvivors.Data);
