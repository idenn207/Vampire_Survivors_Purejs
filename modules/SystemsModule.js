/**
 * @fileoverview Systems module - All game systems
 * @module modules/SystemsModule
 */

import { defineModule, Scope } from '../lib/nest-js-lite/index.js';

// Get class references from global namespace
const VampireSurvivors = window.VampireSurvivors || {};
const Systems = VampireSurvivors.Systems || {};

/**
 * Create a standard system provider config
 * @param {string} token - System token
 * @param {Function} SystemClass - System class
 * @param {number} priority - Execution priority
 * @param {string[]} [additionalDeps=[]] - Additional dependencies beyond Game and EntityManager
 */
function createSystemProvider(token, SystemClass, priority, additionalDeps = []) {
  return {
    token,
    type: 'class',
    class: SystemClass,
    dependencies: ['Game', 'EntityManager', ...additionalDeps],
    scope: Scope.SINGLETON,
    priority,
    lifecycle: {
      onInit: 'initialize',
      onDestroy: 'dispose'
    },
    tags: ['system']
  };
}

/**
 * Systems module containing all game systems
 */
export const SystemsModule = defineModule({
  name: 'SystemsModule',
  imports: ['CoreModule', 'EntityModule', 'PoolsModule'],
  providers: [
    // Background (priority 0)
    createSystemProvider('BackgroundSystem', Systems.BackgroundSystem, 0, ['Camera']),

    // Character & Core Selection (priority 1)
    createSystemProvider('CharacterSelectionSystem', Systems.CharacterSelectionSystem, 1),
    createSystemProvider('CoreSelectionSystem', Systems.CoreSelectionSystem, 1),

    // Wave (priority 4)
    createSystemProvider('WaveSystem', Systems.WaveSystem, 4),

    // Player (priority 5)
    createSystemProvider('PlayerSystem', Systems.PlayerSystem, 5),

    // Active Skills (priority 6)
    createSystemProvider('ActiveSkillSystem', Systems.ActiveSkillSystem, 6),

    // Enemy Systems (priority 8)
    createSystemProvider('EnemySystem', Systems.EnemySystem, 8, ['Player']),
    createSystemProvider('TraversalEnemySystem', Systems.TraversalEnemySystem, 8),
    createSystemProvider('BossSystem', Systems.BossSystem, 8),

    // Movement (priority 10)
    createSystemProvider('MovementSystem', Systems.MovementSystem, 10),

    // Projectiles & Effects (priority 12-15)
    createSystemProvider('ProjectileSystem', Systems.ProjectileSystem, 12),
    createSystemProvider('SummonSystem', Systems.SummonSystem, 12),
    createSystemProvider('AreaEffectSystem', Systems.AreaEffectSystem, 13),
    createSystemProvider('MineSystem', Systems.MineSystem, 14),
    createSystemProvider('WeaponSystem', Systems.WeaponSystem, 15, ['Player', 'Input', 'Camera']),

    // Collision (priority 20)
    createSystemProvider('CollisionSystem', Systems.CollisionSystem, 20),

    // Buff/Debuff (priority 22)
    {
      token: 'BuffDebuffSystem',
      type: 'class',
      class: Systems.BuffDebuffSystem,
      dependencies: ['Game', 'EntityManager', 'BuffDebuffManager'],
      scope: Scope.SINGLETON,
      priority: 22,
      lifecycle: {
        onInit: 'initialize',
        onDestroy: 'dispose'
      },
      tags: ['system', 'combat']
    },

    // Combat (priority 25)
    {
      token: 'CombatSystem',
      type: 'class',
      class: Systems.CombatSystem,
      dependencies: ['Game', 'EntityManager', 'Player', 'CollisionSystem'],
      scope: Scope.SINGLETON,
      priority: 25,
      lifecycle: {
        onInit: 'initialize',
        onDestroy: 'dispose'
      },
      tags: ['system', 'combat']
    },

    // Drops & Pickups (priority 26-27)
    createSystemProvider('DropSystem', Systems.DropSystem, 26),
    {
      token: 'PickupSystem',
      type: 'class',
      class: Systems.PickupSystem,
      dependencies: ['Game', 'EntityManager', 'CollisionSystem'],
      scope: Scope.SINGLETON,
      priority: 27,
      lifecycle: {
        onInit: 'initialize',
        onDestroy: 'dispose'
      },
      tags: ['system']
    },

    // Camera (priority 50)
    {
      token: 'CameraSystem',
      type: 'class',
      class: Systems.CameraSystem,
      dependencies: ['Game', 'EntityManager', 'Camera'],
      scope: Scope.SINGLETON,
      priority: 50,
      lifecycle: {
        onInit: 'initialize',
        onDestroy: 'dispose'
      },
      tags: ['system', 'rendering']
    },

    // Rendering (priority 100)
    {
      token: 'RenderSystem',
      type: 'class',
      class: Systems.RenderSystem,
      dependencies: ['Game', 'EntityManager', 'Camera', 'ActiveSkillSystem', 'EnemySystem'],
      scope: Scope.SINGLETON,
      priority: 100,
      lifecycle: {
        onInit: 'initialize',
        onDestroy: 'dispose'
      },
      tags: ['system', 'rendering']
    },

    // UI Systems (priority 110+)
    createSystemProvider('HUDSystem', Systems.HUDSystem, 110),
    createSystemProvider('TechTreeSystem', Systems.TechTreeSystem, 112),
    createSystemProvider('LevelUpSystem', Systems.LevelUpSystem, 115),
    createSystemProvider('TabScreenSystem', Systems.TabScreenSystem, 116),
    createSystemProvider('PauseMenuSystem', Systems.PauseMenuSystem, 117),
    createSystemProvider('GameOverSystem', Systems.GameOverSystem, 120)
  ],
  exports: [
    'BackgroundSystem',
    'WaveSystem',
    'PlayerSystem',
    'EnemySystem',
    'WeaponSystem',
    'CollisionSystem',
    'CombatSystem',
    'RenderSystem',
    'HUDSystem',
    'LevelUpSystem'
  ]
});

export default SystemsModule;
