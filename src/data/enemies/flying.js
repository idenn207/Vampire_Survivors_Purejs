/**
 * @fileoverview Flying Enemy - Chase with sinusoidal hover
 * @module Data/Enemies/Flying
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.flying = {
    name: 'Flying Eye',
    baseHealth: 25,
    baseSpeed: 120,
    baseDamage: 12,
    size: 22,
    color: '#00CCFF',
    behavior: 'flying',
    spawnWeight: 20,
    startWave: 3,
    imageId: 'enemy_flying',
    // Flying-specific config
    hoverAmplitude: 30,
    hoverFrequency: 2,
  };
})(window.VampireSurvivors.Data);
