/**
 * @fileoverview Turret Summon - Stationary ranged attacker
 * @module Data/Summons/Turret
 */
(function (Data) {
  'use strict';

  var BehaviorType = Data.SummonBehaviorType;
  var AttackPattern = Data.SummonAttackPattern;
  var TargetingMode = Data.SummonTargetingMode;

  Data.SummonRegistry = Data.SummonRegistry || {};

  Data.SummonRegistry.turret = {
    id: 'turret',
    name: 'Turret',
    description: 'A stationary turret that fires projectiles at nearby enemies.',
    imageId: 'summon_turret',

    // Combat stats
    damage: 15,
    attackCooldown: 0.5,
    attackRange: 200,
    attackWindup: 0.1, // Rapid fire - minimal wind-up
    projectileSpeed: 400,
    projectileSize: 6,
    projectileColor: '#FFDD00',

    // Movement stats
    chaseSpeed: 0, // Stationary
    maxChaseRange: 250,
    returnDistance: 0,

    // Survival stats
    health: 80,
    duration: 20.0,

    // Visual
    size: 24,
    color: '#708090',
    shape: 'square',
    glowColor: '#FFDD00',
    glowRadius: 3,

    // AI Behavior
    behaviorType: BehaviorType.STATIONARY,
    attackPattern: AttackPattern.RANGED,
    targetingMode: TargetingMode.NEAREST,

    // Spawn settings
    spawnRadius: 60,
    spawnAnimation: 'build',
  };
})(window.VampireSurvivors.Data);
