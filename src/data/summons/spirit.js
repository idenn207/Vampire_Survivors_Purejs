/**
 * @fileoverview Spirit Summon - Balanced ally that chases and attacks
 * @module Data/Summons/Spirit
 */
(function (Data) {
  'use strict';

  var BehaviorType = Data.SummonBehaviorType;
  var AttackPattern = Data.SummonAttackPattern;
  var TargetingMode = Data.SummonTargetingMode;

  Data.SummonRegistry = Data.SummonRegistry || {};

  Data.SummonRegistry.spirit = {
    id: 'spirit',
    name: 'Spirit',
    description: 'A ghostly companion that chases and attacks enemies.',
    imageId: 'summon_spirit',

    // Combat stats
    damage: 20,
    attackCooldown: 1.0,
    attackRange: 50,

    // Movement stats
    chaseSpeed: 150,
    maxChaseRange: 300,
    returnDistance: 200,

    // Survival stats
    health: 50,
    duration: 15.0,

    // Visual
    size: 20,
    color: '#88CCFF',
    shape: 'circle',
    glowColor: '#88CCFF',
    glowRadius: 4,

    // AI Behavior
    behaviorType: BehaviorType.CHASE,
    attackPattern: AttackPattern.MELEE,
    targetingMode: TargetingMode.NEAREST,

    // Spawn settings
    spawnRadius: 40,
    spawnAnimation: 'fade_in',
  };
})(window.VampireSurvivors.Data);
