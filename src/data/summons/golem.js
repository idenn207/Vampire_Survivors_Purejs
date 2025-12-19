/**
 * @fileoverview Golem Summon - Slow tanky defender
 * @module Data/Summons/Golem
 */
(function (Data) {
  'use strict';

  var BehaviorType = Data.SummonBehaviorType;
  var AttackPattern = Data.SummonAttackPattern;
  var TargetingMode = Data.SummonTargetingMode;

  Data.SummonRegistry = Data.SummonRegistry || {};

  Data.SummonRegistry.golem = {
    id: 'golem',
    name: 'Stone Golem',
    description: 'A powerful golem with high health and crushing attacks.',
    imageId: 'summon_golem',

    // Combat stats
    damage: 45,
    attackCooldown: 1.8,
    attackRange: 60,
    knockback: 150,
    stunChance: 0.2,
    stunDuration: 0.5,

    // Movement stats
    chaseSpeed: 80,
    maxChaseRange: 200,
    returnDistance: 150,

    // Survival stats
    health: 150,
    duration: 25.0,
    armor: 10,

    // Visual
    size: 32,
    color: '#8B4513',
    shape: 'square',
    glowColor: '#CD853F',
    glowRadius: 5,

    // AI Behavior
    behaviorType: BehaviorType.CHASE,
    attackPattern: AttackPattern.MELEE,
    targetingMode: TargetingMode.NEAREST,

    // Spawn settings
    spawnRadius: 50,
    spawnAnimation: 'rise_up',
  };
})(window.VampireSurvivors.Data);
