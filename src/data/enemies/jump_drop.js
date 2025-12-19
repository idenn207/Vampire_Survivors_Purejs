/**
 * @fileoverview Jump/Drop Enemy - Jumps to player position
 * @module Data/Enemies/JumpDrop
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.jump_drop = {
    name: 'Jumper',
    baseHealth: 45,
    baseSpeed: 0,
    baseDamage: 25,
    size: 30,
    color: '#8800FF',
    behavior: 'jump_drop',
    spawnWeight: 10,
    startWave: 7,
    imageId: 'enemy_jump_drop',
    // Jump-specific config
    jumpHeight: 200,
    jumpDuration: 1.0,
    jumpCooldown: 2.5,
    landingRadius: 40,
    shadowSize: 24,
  };
})(window.VampireSurvivors.Data);
