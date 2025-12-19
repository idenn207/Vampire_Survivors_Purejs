/**
 * @fileoverview Fairy Summon - Small healer/support
 * @module Data/Summons/Fairy
 */
(function (Data) {
  'use strict';

  var BehaviorType = Data.SummonBehaviorType;
  var AttackPattern = Data.SummonAttackPattern;
  var TargetingMode = Data.SummonTargetingMode;

  Data.SummonRegistry = Data.SummonRegistry || {};

  Data.SummonRegistry.fairy = {
    id: 'fairy',
    name: 'Healing Fairy',
    description: 'A small fairy that heals the player over time.',
    imageId: 'summon_fairy',

    // Combat stats (minimal - focuses on support)
    damage: 5,
    attackCooldown: 2.0,
    attackRange: 30,

    // Support stats
    healAmount: 2,
    healInterval: 1.0,
    healRange: 100,
    buffType: 'regen',

    // Movement stats
    chaseSpeed: 100,
    maxChaseRange: 150,
    returnDistance: 80,

    // Survival stats
    health: 25,
    duration: 30.0,

    // Visual
    size: 12,
    color: '#FFB6C1',
    shape: 'circle',
    glowColor: '#FF69B4',
    glowRadius: 6,

    // AI Behavior
    behaviorType: BehaviorType.FOLLOW,
    attackPattern: AttackPattern.SUPPORT,
    targetingMode: TargetingMode.NEAREST,

    // Spawn settings
    spawnRadius: 20,
    spawnAnimation: 'sparkle',
  };
})(window.VampireSurvivors.Data);
