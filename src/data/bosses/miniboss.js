/**
 * @fileoverview Miniboss - Second tier boss with dash and ring attacks
 * @module Data/Bosses/Miniboss
 */
(function (Data) {
  'use strict';

  Data.BossRegistry = Data.BossRegistry || {};

  Data.BossRegistry.miniboss = {
    name: 'Miniboss',
    health: 5000,
    speed: 60,
    damage: 20,
    size: 56,
    color: '#FF4500', // Orange-red
    imageId: 'boss_miniboss',
    phases: [
      { threshold: 0.66, speedMultiplier: 1.0, attacks: ['dash'], cooldownMultiplier: 1.0 },
      { threshold: 0.33, speedMultiplier: 1.2, attacks: ['dash', 'ring'], cooldownMultiplier: 0.9 },
      { threshold: 0.0, speedMultiplier: 1.5, attacks: ['dash', 'ring'], cooldownMultiplier: 0.7 },
    ],
    attacks: {
      dash: { cooldown: 4.0, damage: 25, speed: 350, duration: 0.6, telegraph: 0.4 },
      ring: { cooldown: 5.0, damage: 15, projectileCount: 8, projectileSpeed: 200, telegraph: 0.5 },
    },
  };
})(window.VampireSurvivors.Data);
