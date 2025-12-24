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
    startWave: 1,
    imageId: 'enemy_self_destruct',
    // Self-destruct specific config
    explosionRadius: 300,
    explosionDamage: 30,
    fuseTime: 1.0,
    triggerRadius: 80,
    auroraColor: '#FF0000',
  };
})(window.VampireSurvivors.Data);
