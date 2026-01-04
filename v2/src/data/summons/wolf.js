/**
 * @fileoverview Wolf Summon - Fast aggressive melee attacker
 * @module Data/Summons/Wolf
 */
(function (Data) {
  'use strict';

  var BehaviorType = Data.SummonBehaviorType;
  var AttackPattern = Data.SummonAttackPattern;
  var TargetingMode = Data.SummonTargetingMode;

  Data.SummonRegistry = Data.SummonRegistry || {};

  Data.SummonRegistry.wolf = {
    id: 'wolf',
    name: 'Shadow Wolf',
    description: 'A swift shadow wolf that aggressively hunts down enemies.',
    imageId: 'summon_wolf',

    // Combat stats
    damage: 25,
    attackCooldown: 0.6,
    attackRange: 40,
    attackWindup: 0.15, // Fast attacker - quick wind-up
    critChance: 0.15,
    critMultiplier: 1.5,

    // Movement stats
    chaseSpeed: 220,
    maxChaseRange: 400,
    returnDistance: 250,

    // Survival stats
    health: 35,
    duration: 12.0,

    // Visual
    size: 18,
    color: '#4B0082',
    shape: 'diamond',
    glowColor: '#8844FF',
    glowRadius: 3,

    // AI Behavior
    behaviorType: BehaviorType.CHASE,
    attackPattern: AttackPattern.MELEE,
    targetingMode: TargetingMode.NEAREST,

    // Spawn settings
    spawnRadius: 30,
    spawnAnimation: 'leap_in',
  };
})(window.VampireSurvivors.Data);
