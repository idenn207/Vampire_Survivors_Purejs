/**
 * @fileoverview Pools module - Object pools and managers
 * @module modules/PoolsModule
 */

import { defineModule, Scope } from '../lib/nest-js-lite/index.js';

// Get references from global namespace
const VampireSurvivors = window.VampireSurvivors || {};
const Pool = VampireSurvivors.Pool || {};
const Managers = VampireSurvivors.Managers || {};

/**
 * Pools module containing object pools and managers
 */
export const PoolsModule = defineModule({
  name: 'PoolsModule',
  imports: ['CoreModule', 'EntityModule'],
  providers: [
    // Projectile Pool
    {
      token: 'ProjectilePool',
      type: 'factory',
      factory: () => Pool.projectilePool,
      scope: Scope.SINGLETON,
      priority: 6,
      tags: ['pool']
    },

    // Area Effect Pool
    {
      token: 'AreaEffectPool',
      type: 'factory',
      factory: () => Pool.areaEffectPool,
      scope: Scope.SINGLETON,
      priority: 6,
      tags: ['pool']
    },

    // Pickup Pool
    {
      token: 'PickupPool',
      type: 'factory',
      factory: () => Pool.pickupPool,
      scope: Scope.SINGLETON,
      priority: 6,
      tags: ['pool']
    },

    // Mine Pool
    {
      token: 'MinePool',
      type: 'factory',
      factory: () => Pool.minePool,
      scope: Scope.SINGLETON,
      priority: 6,
      tags: ['pool']
    },

    // Summon Pool
    {
      token: 'SummonPool',
      type: 'factory',
      factory: () => Pool.summonPool,
      scope: Scope.SINGLETON,
      priority: 6,
      tags: ['pool']
    },

    // Damage Number Pool
    {
      token: 'DamageNumberPool',
      type: 'factory',
      factory: () => Pool.damageNumberPool,
      scope: Scope.SINGLETON,
      priority: 6,
      tags: ['pool', 'ui']
    },

    // Buff/Debuff Manager
    {
      token: 'BuffDebuffManager',
      type: 'class',
      class: Managers.BuffDebuffManager,
      dependencies: ['EntityManager'],
      scope: Scope.SINGLETON,
      priority: 7,
      lifecycle: {
        onInit: 'initialize',
        onDestroy: 'dispose'
      },
      tags: ['manager']
    },

    // Blacklist Manager
    {
      token: 'BlacklistManager',
      type: 'factory',
      factory: () => Managers.BlacklistManager,
      scope: Scope.SINGLETON,
      priority: 7,
      tags: ['manager']
    }
  ],
  exports: [
    'ProjectilePool',
    'AreaEffectPool',
    'PickupPool',
    'MinePool',
    'SummonPool',
    'DamageNumberPool',
    'BuffDebuffManager',
    'BlacklistManager'
  ]
});

export default PoolsModule;
