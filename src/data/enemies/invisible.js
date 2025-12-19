/**
 * @fileoverview Invisible Enemy - Visible only when close
 * @module Data/Enemies/Invisible
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.invisible = {
    name: 'Shade',
    baseHealth: 20,
    baseSpeed: 90,
    baseDamage: 18,
    size: 24,
    color: '#FFFFFF',
    behavior: 'invisible',
    spawnWeight: 15,
    startWave: 5,
    imageId: 'enemy_invisible',
    // Invisible-specific config
    visibilityRadius: 120,
    fadeSpeed: 2.0,
    minAlpha: 0.1,
  };
})(window.VampireSurvivors.Data);
