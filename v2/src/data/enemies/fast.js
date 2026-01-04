/**
 * @fileoverview Fast Enemy - Higher speed, lower health
 * @module Data/Enemies/Fast
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.fast = {
    name: 'Fast Runner',
    baseHealth: 15,
    baseSpeed: 180,
    baseDamage: 8,
    size: 20,
    color: '#FF66FF',
    behavior: 'chase',
    spawnWeight: 30,
    startWave: 2,
    imageId: 'enemy_fast',
  };
})(window.VampireSurvivors.Data);
