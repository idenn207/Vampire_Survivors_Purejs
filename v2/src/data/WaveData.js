/**
 * @fileoverview Wave data definitions - data-driven wave configurations
 * @module Data/WaveData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Wave Configuration Constants
  // ============================================
  var WaveConfig = {
    BASE_WAVE_DURATION: 30, // Seconds per wave
    WAVE_DURATION_INCREMENT: 5, // Each wave is 5s longer (caps at max)
    MAX_WAVE_DURATION: 60, // Maximum wave duration
    ELITE_WAVE_INTERVAL: 2, // Elite spawns every 2 waves (2, 4, 8...)
    MINIBOSS_WAVE_INTERVAL: 3, // Miniboss spawns every 3 waves (3, 6, 9...)
    BOSS_WAVE_INTERVAL: 5, // Boss spawns every 5 waves (5, 10, 15...)
  };

  // ============================================
  // Difficulty Scaling Curves
  // ============================================
  var DifficultyScaling = {
    /**
     * Spawn rate multiplier per wave (1.0 = base spawn rate)
     * Starts at 1.0, increases by 10% each wave, caps at 3x
     */
    spawnRateMultiplier: function (waveNumber) {
      return Math.min(3.0, 1.0 + (waveNumber - 1) * 0.1);
    },

    /**
     * Max enemies multiplier per wave
     * Starts at 1.0, increases by 15% each wave, caps at 4x
     */
    maxEnemiesMultiplier: function (waveNumber) {
      return Math.min(4.0, 1.0 + (waveNumber - 1) * 0.15);
    },

    /**
     * Enemy health multiplier per wave
     * Starts at 1.0, increases by 40% each wave (no cap)
     */
    enemyHealthMultiplier: function (waveNumber) {
      return 1.0 + (waveNumber - 1) * 0.6;
    },

    /**
     * Enemy damage multiplier per wave
     * Starts at 1.0, increases by 5% each wave (no cap)
     */
    enemyDamageMultiplier: function (waveNumber) {
      return 1.0 + (waveNumber - 1) * 0.05;
    },
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get wave configuration constants
   * @returns {Object}
   */
  function getWaveConfig() {
    return WaveConfig;
  }

  /**
   * Get difficulty modifiers for a specific wave
   * @param {number} waveNumber
   * @returns {Object}
   */
  function getDifficultyModifiers(waveNumber) {
    return {
      spawnRateMultiplier: DifficultyScaling.spawnRateMultiplier(waveNumber),
      maxEnemiesMultiplier: DifficultyScaling.maxEnemiesMultiplier(waveNumber),
      enemyHealthMultiplier: DifficultyScaling.enemyHealthMultiplier(waveNumber),
      enemyDamageMultiplier: DifficultyScaling.enemyDamageMultiplier(waveNumber),
    };
  }

  /**
   * Get special wave info if this is a special wave
   * Priority: Boss > Miniboss > Elite
   * @param {number} waveNumber
   * @returns {Object|null}
   */
  function getSpecialWave(waveNumber) {
    // Check intervals - Priority: Boss > Miniboss > Elite
    var isBossWave = waveNumber % WaveConfig.BOSS_WAVE_INTERVAL === 0;
    var isMinibossWave = waveNumber % WaveConfig.MINIBOSS_WAVE_INTERVAL === 0;
    var isEliteWave = waveNumber % WaveConfig.ELITE_WAVE_INTERVAL === 0;

    var bossType = null;
    var announcement = '';
    var color = '';
    var bossCount = 1;

    if (isBossWave) {
      // Boss waves: 5, 10, 15, 20...
      bossType = 'boss';
      announcement = 'BOSS BATTLE!';
      color = '#FF0000';
      // Boss count: 1 at wave 5, increases every 25 waves (max 3)
      bossCount = Math.min(3, Math.floor(waveNumber / 25) + 1);
    } else if (isMinibossWave) {
      // Miniboss waves: 3, 6, 9, 12... (except when boss wave)
      bossType = 'miniboss';
      announcement = 'MINIBOSS APPROACHES!';
      color = '#FF4500';
      // Miniboss count: 1 at wave 3, increases every 15 waves (max 2)
      bossCount = Math.min(4, Math.floor(waveNumber / 15) + 1);
    } else if (isEliteWave) {
      // Elite waves: 2, 4, 8, 14... (except when boss or miniboss wave)
      bossType = 'elite';
      announcement = 'ELITE INCOMING!';
      color = '#FFD700';
      // Elite count: 1 at wave 2, increases every 10 waves (max 3)
      bossCount = Math.min(5, Math.floor(waveNumber / 10) + 1);
    }

    if (bossType) {
      return {
        name: bossType.charAt(0).toUpperCase() + bossType.slice(1) + ' Wave ' + waveNumber,
        isBossWave: true,
        bossType: bossType,
        bossCount: bossCount,
        announcement: announcement,
        announcementColor: color,
      };
    }

    return null;
  }

  /**
   * Get wave duration for a specific wave
   * @param {number} waveNumber
   * @returns {number} Duration in seconds
   */
  function getWaveDuration(waveNumber) {
    var duration = WaveConfig.BASE_WAVE_DURATION + (waveNumber - 1) * WaveConfig.WAVE_DURATION_INCREMENT;
    return Math.min(duration, WaveConfig.MAX_WAVE_DURATION);
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.WaveData = {
    WaveConfig: WaveConfig,
    DifficultyScaling: DifficultyScaling,
    getWaveConfig: getWaveConfig,
    getDifficultyModifiers: getDifficultyModifiers,
    getSpecialWave: getSpecialWave,
    getWaveDuration: getWaveDuration,
  };
})(window.VampireSurvivors.Data);
