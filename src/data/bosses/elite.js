/**
 * @fileoverview Elite Boss - First tier boss with dash attack
 * @module Data/Bosses/Elite
 */
(function (Data) {
  'use strict';

  Data.BossRegistry = Data.BossRegistry || {};

  Data.BossRegistry.elite = {
    name: 'Elite',
    health: 200,
    speed: 80,
    damage: 15,
    size: 40,
    color: '#FFD700', // Gold
    imageId: 'boss_elite',
    phases: [
      { threshold: 0.5, speedMultiplier: 1.0, attacks: ['dash'], cooldownMultiplier: 1.0 },
      { threshold: 0.0, speedMultiplier: 1.3, attacks: ['dash'], cooldownMultiplier: 0.8 },
    ],
    attacks: {
      dash: { cooldown: 3.0, damage: 20, speed: 400, duration: 0.5, telegraph: 0.3 },
    },
  };
})(window.VampireSurvivors.Data);
