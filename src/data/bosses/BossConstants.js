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
    HEALTH_PER_WAVE: 0.2, // +20% health per wave after first boss wave
    DAMAGE_PER_WAVE: 0.15, // +15% damage per wave
  };

  // ============================================
  // Phase Colors (for health bar)
  // ============================================
  var PhaseColors = ['#2ECC71', '#F1C40F', '#E67E22', '#E74C3C']; // Green, Yellow, Orange, Red

  // ============================================
  // First Appearance Waves
  // ============================================
  var FirstWaves = {
    elite: 5,
    miniboss: 10,
    boss: 15,
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
