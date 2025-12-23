/**
 * @fileoverview Jump/Drop Enemy - Jumps to player position
 * @module Data/Enemies/JumpDrop
 */
(function (Data) {
  'use strict';

  Data.EnemyRegistry = Data.EnemyRegistry || {};

  Data.EnemyRegistry.jump_drop = {
    name: 'Jumper',
    baseHealth: 80,
    baseSpeed: 0,
    baseDamage: 25,
    size: 30,
    color: '#8800FF',
    behavior: 'jump_drop',
    spawnWeight: 200,
    startWave: 7,
    imageId: 'enemy_jump_drop',
    // Jump-specific config
    jumpHeight: 200,
    jumpDuration: 2.0,
    jumpCooldown: 2.5,
    landingRadius: 40,
    shadowSize: 24,
    // Ascend animation config
    ascendDuration: 0.4,
    ascendHeight: 50,
    // Warning config
    warningTime: 1.5,
  };
})(window.VampireSurvivors.Data);
