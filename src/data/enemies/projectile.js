/**
 * @fileoverview Projectile Enemy - Fires at player from range
 * @module Data/Enemies/Projectile
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.projectile = {
    name: 'Spitter',
    baseHealth: 150,
    baseSpeed: 50,
    baseDamage: 5,
    size: 26,
    color: '#00FF00',
    behavior: 'projectile',
    spawnWeight: 15,
    startWave: 6,
    imageId: 'enemy_projectile',
    // Projectile-specific config
    projectileSpeed: 180,
    projectileDamage: 15,
    projectileSize: 10,
    projectileColor: '#88FF00',
    fireRate: 2.0,
    attackRange: 300,
    retreatRange: 150,
  };
})(window.VampireSurvivors.Data);
