/**
 * @fileoverview Laser Pattern - Enemies move in lines across the screen
 * @module Data/TraversalEnemies/Laser
 */
(function (Data) {
  'use strict';

  Data.TraversalPatternRegistry = Data.TraversalPatternRegistry || {};
  Data.TraversalPatternWeights = Data.TraversalPatternWeights || {};

  Data.TraversalPatternRegistry.LASER = {
    enemiesPerLine: { min: 8, max: 12 }, // Per-line count
    enemySpacing: 150, // Pixels between enemies in line (3x spacing)
    spawnOffset: 300, // Extra offset outside viewport for wider spawn
    moveSpeed: 200, // Constant speed across map
    health: 50,
    damage: 15,
    decayTime: 12.0, // Longer lifetime
    color: '#00FFFF', // Cyan
    size: 26,
    imageId: 'enemy_traversal_laser',
  };

  Data.TraversalPatternWeights.LASER = 0.3; // 30% chance
})(window.VampireSurvivors.Data);
