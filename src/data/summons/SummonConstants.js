/**
 * @fileoverview Summon Constants - Shared enums and registry initialization
 * @module Data/Summons/SummonConstants
 */
(function (Data) {
  'use strict';

  // ============================================
  // Summon Type Identifiers
  // ============================================
  var SummonType = Object.freeze({
    SPIRIT: 'spirit',
    TURRET: 'turret',
    WOLF: 'wolf',
    GOLEM: 'golem',
    FAIRY: 'fairy',
  });

  // ============================================
  // Behavior Types
  // ============================================
  var BehaviorType = Object.freeze({
    CHASE: 'chase',       // Actively chases enemies
    STATIONARY: 'stationary', // Stays in place, attacks nearby
    ORBIT: 'orbit',       // Orbits around player
    FOLLOW: 'follow',     // Follows player closely
  });

  // ============================================
  // Attack Patterns
  // ============================================
  var AttackPattern = Object.freeze({
    MELEE: 'melee',       // Close range attacks
    RANGED: 'ranged',     // Projectile attacks
    AOE: 'aoe',           // Area of effect attacks
    SUPPORT: 'support',   // Heals/buffs player
  });

  // ============================================
  // Targeting Modes
  // ============================================
  var SummonTargetingMode = Object.freeze({
    NEAREST: 'nearest',   // Target nearest enemy
    WEAKEST: 'weakest',   // Target lowest health enemy
    STRONGEST: 'strongest', // Target highest health enemy
    RANDOM: 'random',     // Random target
  });

  // ============================================
  // Initialize Registry
  // ============================================
  Data.SummonRegistry = Data.SummonRegistry || {};

  // ============================================
  // Export to Namespace
  // ============================================
  Data.SummonType = SummonType;
  Data.SummonBehaviorType = BehaviorType;
  Data.SummonAttackPattern = AttackPattern;
  Data.SummonTargetingMode = SummonTargetingMode;
})(window.VampireSurvivors.Data);
