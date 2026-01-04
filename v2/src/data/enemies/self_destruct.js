/**
 * @fileoverview Self-Destruct Enemy - Explodes when close to player
 * @module Data/Enemies/SelfDestruct
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.self_destruct = {
    name: 'Bomber',
    baseHealth: 300,
    baseSpeed: 80,
    baseDamage: 0,
    size: 28,
    color: '#FF6600',
    behavior: 'self_destruct',
    spawnWeight: 15,
    startWave: 11,
    imageId: 'enemy_self_destruct',
    // Self-destruct specific config
    explosionRadius: 80,
    explosionDamage: 30,
    fuseTime: 1.5,
    triggerRadius: 50,
    auroraColor: '#FF0000',
  };
})(window.VampireSurvivors.Data);
