/**
 * @fileoverview Self-Destruct Enemy - Explodes when close to player
 * @module Data/Enemies/SelfDestruct
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.self_destruct = {
    name: 'Bomber',
    baseHealth: 40,
    baseSpeed: 80,
    baseDamage: 5,
    size: 28,
    color: '#FF6600',
    behavior: 'self_destruct',
    spawnWeight: 15,
    startWave: 4,
    imageId: 'enemy_self_destruct',
    // Self-destruct specific config
    explosionRadius: 60,
    explosionDamage: 30,
    fuseTime: 3.0,
    triggerRadius: 50,
  };
})(window.VampireSurvivors.Data);
