/**
 * @fileoverview Dash Attack Enemy - Charges at player
 * @module Data/Enemies/DashAttack
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.dash_attack = {
    name: 'Charger',
    baseHealth: 35,
    baseSpeed: 60,
    baseDamage: 20,
    size: 26,
    color: '#CC0000',
    behavior: 'dash_attack',
    spawnWeight: 20,
    startWave: 5,
    imageId: 'enemy_dash_attack',
    // Dash-specific config
    chargeTime: 1.0,
    dashSpeed: 400,
    dashDuration: 0.5,
    dashCooldown: 3.0,
    dashRange: 200,
  };
})(window.VampireSurvivors.Data);
