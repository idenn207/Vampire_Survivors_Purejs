/**
 * @fileoverview Dash Pattern - Enemies charge at player in groups
 * @module Data/TraversalEnemies/Dash
 */
(function (Data) {
  'use strict';

  Data.TraversalPatternRegistry = Data.TraversalPatternRegistry || {};
  Data.TraversalPatternWeights = Data.TraversalPatternWeights || {};

  Data.TraversalPatternRegistry.DASH = {
    enemyCount: { min: 12, max: 15 }, // Spawn count
    dashSpeed: 350, // Dash speed toward player
    health: 30, // Weaker individuals
    damage: 15,
    decayTime: 6.0,
    color: '#FF00FF', // Magenta
    size: 18,
    chargeTime: 0.8, // Pause before dashing
    groupSpread: 80, // Cluster spread radius
    imageId: 'enemy_traversal_dash',
  };

  Data.TraversalPatternWeights.DASH = 0.35; // 35% chance
})(window.VampireSurvivors.Data);
