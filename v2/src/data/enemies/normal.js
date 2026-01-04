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
    baseSpeed: 50,
    baseDamage: 10,
    size: 24,
    color: '#FF0000',
    behavior: 'chase',
    spawnWeight: 200,
    startWave: 2,
    imageId: 'enemy_normal',
  };
})(window.VampireSurvivors.Data);
