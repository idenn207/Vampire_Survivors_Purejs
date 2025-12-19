/**
 * @fileoverview Normal Enemy - Basic chase AI
 * @module Data/Enemies/Normal
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.normal = {
    name: 'Normal',
    baseHealth: 30,
    baseSpeed: 100,
    baseDamage: 10,
    size: 24,
    color: '#FF0000',
    behavior: 'chase',
    spawnWeight: 50,
    startWave: 1,
    imageId: 'enemy_normal',
  };
})(window.VampireSurvivors.Data);
