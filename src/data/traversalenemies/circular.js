/**
 * @fileoverview Circular Pattern - Enemies spawn in a ring around player
 * @module Data/TraversalEnemies/Circular
 */
(function (Data) {
  'use strict';

  Data.TraversalPatternRegistry = Data.TraversalPatternRegistry || {};
  Data.TraversalPatternWeights = Data.TraversalPatternWeights || {};

  Data.TraversalPatternRegistry.CIRCULAR = {
    enemyCount: { min: 40, max: 60 }, // More enemies for wider ring
    spawnRadius: 400, // Distance from player at spawn (wider)
    moveSpeed: 0, // STATIONARY - no movement
    health: 40, // Lower health (more enemies)
    damage: 10,
    decayTime: 15.0, // Seconds before disappearing
    color: '#FF6600', // Orange
    size: 24,
    imageId: 'enemy_traversal_circular',
  };

  Data.TraversalPatternWeights.CIRCULAR = 0.35; // 35% chance
})(window.VampireSurvivors.Data);
