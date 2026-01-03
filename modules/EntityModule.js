/**
 * @fileoverview Entity module - EntityManager, Player
 * @module modules/EntityModule
 */

import { defineModule, Scope } from '../lib/nest-js-lite/index.js';

// Get class references from global namespace
const VampireSurvivors = window.VampireSurvivors || {};
const Managers = VampireSurvivors.Managers || {};
const Entities = VampireSurvivors.Entities || {};

/**
 * Entity module for entity management
 */
export const EntityModule = defineModule({
  name: 'EntityModule',
  imports: ['CoreModule'],
  providers: [
    // EntityManager - manages all game entities
    {
      token: 'EntityManager',
      type: 'class',
      class: Managers.EntityManager,
      dependencies: ['Game'],
      scope: Scope.SINGLETON,
      priority: 5,
      lifecycle: {
        onInit: 'initialize',
        onDestroy: 'dispose'
      },
      tags: ['entity', 'manager']
    },

    // Player - main player entity
    {
      token: 'Player',
      type: 'factory',
      factory: (container) => {
        const entityManager = container.resolve('EntityManager');
        return entityManager.create(Entities.Player);
      },
      dependencies: ['EntityManager'],
      scope: Scope.SINGLETON,
      priority: 10,
      tags: ['entity', 'player']
    }
  ],
  exports: ['EntityManager', 'Player']
});

export default EntityModule;
