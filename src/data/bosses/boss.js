/**
 * @fileoverview Main Boss - Third tier boss with all attack types
 * @module Data/Bosses/Boss
 */
(function (Data) {
  'use strict';

  Data.BossRegistry = Data.BossRegistry || {};

  Data.BossRegistry.boss = {
    name: 'Boss',
    health: 2000,
    speed: 50,
    damage: 25,
    size: 72,
    color: '#FF0000', // Red
    imageId: 'boss_main',
    phases: [
      { threshold: 0.75, speedMultiplier: 1.0, attacks: ['projectile'], cooldownMultiplier: 1.0 },
      { threshold: 0.5, speedMultiplier: 1.1, attacks: ['projectile', 'dash'], cooldownMultiplier: 0.9 },
      { threshold: 0.25, speedMultiplier: 1.3, attacks: ['projectile', 'dash', 'ring'], cooldownMultiplier: 0.8 },
      { threshold: 0.0, speedMultiplier: 1.6, attacks: ['projectile', 'dash', 'ring'], cooldownMultiplier: 0.6 },
    ],
    attacks: {
      projectile: { cooldown: 2.0, damage: 15, speed: 250, count: 1, telegraph: 0.2 },
      dash: { cooldown: 5.0, damage: 30, speed: 300, duration: 0.8, telegraph: 0.5 },
      ring: { cooldown: 6.0, damage: 12, projectileCount: 12, projectileSpeed: 180, telegraph: 0.6 },
    },
  };
})(window.VampireSurvivors.Data);
