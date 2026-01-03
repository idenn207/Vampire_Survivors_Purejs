/**
 * @fileoverview Core module - Game, EventBus, Time, Input, Camera
 * @module modules/CoreModule
 */

import { defineModule, Scope } from '../lib/nest-js-lite/index.js';

// Get class references from global namespace
const VampireSurvivors = window.VampireSurvivors || {};
const Core = VampireSurvivors.Core || {};

/**
 * Core module containing fundamental game services
 */
export const CoreModule = defineModule({
  name: 'CoreModule',
  global: true,  // Available to all modules
  providers: [
    // Game - main game loop manager
    {
      token: 'Game',
      type: 'class',
      class: Core.Game,
      scope: Scope.SINGLETON,
      priority: 0,
      lifecycle: {
        onInit: 'initialize',
        onDestroy: 'dispose'
      },
      tags: ['core']
    },

    // EventBus - pub/sub event system
    {
      token: 'EventBus',
      type: 'factory',
      factory: () => Core.events,  // Use existing singleton
      scope: Scope.SINGLETON,
      priority: 1,
      tags: ['core', 'events']
    },

    // Time - frame time management
    {
      token: 'Time',
      type: 'factory',
      factory: (container) => container.resolve('Game').time,
      dependencies: ['Game'],
      scope: Scope.SINGLETON,
      priority: 2,
      tags: ['core']
    },

    // Input - keyboard/mouse input handling
    {
      token: 'Input',
      type: 'factory',
      factory: (container) => container.resolve('Game').input,
      dependencies: ['Game'],
      scope: Scope.SINGLETON,
      priority: 2,
      tags: ['core']
    },

    // Camera - viewport management
    {
      token: 'Camera',
      type: 'class',
      class: Core.Camera,
      scope: Scope.SINGLETON,
      priority: 3,
      lifecycle: {
        onInit: 'initialize'
      },
      tags: ['core', 'rendering']
    },

    // AssetLoader - asset management
    {
      token: 'AssetLoader',
      type: 'factory',
      factory: () => Core.AssetLoader,
      scope: Scope.SINGLETON,
      priority: 1,
      tags: ['core']
    },

    // UIScale - UI scaling calculations
    {
      token: 'UIScale',
      type: 'factory',
      factory: () => Core.UIScale,
      scope: Scope.SINGLETON,
      priority: 2,
      tags: ['core', 'ui']
    },

    // i18n - internationalization
    {
      token: 'i18n',
      type: 'factory',
      factory: () => Core.i18n,
      scope: Scope.SINGLETON,
      priority: 2,
      tags: ['core', 'localization']
    }
  ],
  exports: ['Game', 'EventBus', 'Time', 'Input', 'Camera', 'AssetLoader', 'UIScale', 'i18n']
});

export default CoreModule;
