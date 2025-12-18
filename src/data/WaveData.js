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
     * Starts at 1.0, increases by 20% each wave (no cap)
     */
    enemyHealthMultiplier: function (waveNumber) {
      return 1.0 + (waveNumber - 1) * 0.2;
    },

    /**
     * Enemy damage multiplier per wave
     * Starts at 1.0, increases by 15% each wave (no cap)
     */
    enemyDamageMultiplier: function (waveNumber) {
      return 1.0 + (waveNumber - 1) * 0.15;
    },
  };

  // ============================================
  // Special Wave Definitions
  // ============================================
  var SpecialWaves = {
    5: {
      name: 'First Challenge',
      isBossWave: true,
      bossType: 'elite',
      bossCount: 1,
      announcement: 'ELITE INCOMING!',
      announcementColor: '#FFD700',
    },
    10: {
      name: 'Swarm',
      isBossWave: true,
      bossType: 'miniboss',
      bossCount: 1,
      announcement: 'MINIBOSS APPROACHES!',
      announcementColor: '#FF4500',
    },
    15: {
      name: 'Boss Fight',
      isBossWave: true,
      bossType: 'boss',
      bossCount: 1,
      announcement: 'BOSS BATTLE!',
      announcementColor: '#FF0000',
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
   * @param {number} waveNumber
   * @returns {Object|null}
   */
  function getSpecialWave(waveNumber) {
    // Check for exact match first
    if (SpecialWaves[waveNumber]) {
      return SpecialWaves[waveNumber];
    }

    // Generate boss waves for waves beyond defined ones (every 5)
    if (waveNumber % WaveConfig.BOSS_WAVE_INTERVAL === 0) {
      var bossLevel = Math.floor(waveNumber / WaveConfig.BOSS_WAVE_INTERVAL);
      var bossType = 'elite';
      var announcement = 'ELITE INCOMING!';
      var color = '#FFD700';

      if (bossLevel % 3 === 0) {
        bossType = 'boss';
        announcement = 'BOSS BATTLE!';
        color = '#FF0000';
      } else if (bossLevel % 2 === 0) {
        bossType = 'miniboss';
        announcement = 'MINIBOSS APPROACHES!';
        color = '#FF4500';
      }

      return {
        name: 'Boss Wave ' + bossLevel,
        isBossWave: true,
        bossType: bossType,
        bossCount: Math.min(3, Math.floor(bossLevel / 3) + 1),
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
    SpecialWaves: SpecialWaves,
    getWaveConfig: getWaveConfig,
    getDifficultyModifiers: getDifficultyModifiers,
    getSpecialWave: getSpecialWave,
    getWaveDuration: getWaveDuration,
  };
})(window.VampireSurvivors.Data);
