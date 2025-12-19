/**
 * @fileoverview Enemy Constants - Shared enums and registry initialization
 * @module Data/Enemies/EnemyConstants
 */
(function (Data) {
  'use strict';

  // ============================================
  // Enemy Type Identifiers
  // ============================================
  var EnemyType = Object.freeze({
    NORMAL: 'normal',
    FAST: 'fast',
    FLYING: 'flying',
    SELF_DESTRUCT: 'self_destruct',
    INVISIBLE: 'invisible',
    DASH_ATTACK: 'dash_attack',
    PROJECTILE: 'projectile',
    JUMP_DROP: 'jump_drop',
  });

  // ============================================
  // Initialize Registry
  // ============================================
  Data.EnemyRegistry = Data.EnemyRegistry || {};

  // ============================================
  // Export to Namespace
  // ============================================
  Data.EnemyType = EnemyType;
})(window.VampireSurvivors.Data);
