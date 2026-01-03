/**
 * @fileoverview DI-based application entry point
 * @module modules/app-di
 *
 * This file provides an alternative entry point using the DI container.
 * Can be used alongside the existing app.js for gradual migration.
 *
 * Usage:
 * 1. Replace <script src="src/app.js"></script> with
 *    <script type="module" src="modules/app-di.js"></script>
 * 2. Or import and call bootstrap() from another module
 */

import { Container, bootstrapContainer } from '../lib/nest-js-lite/index.js';
import { GraphExplorer } from '../lib/nest-js-lite/devtools/GraphExplorer.js';
import { MermaidExporter, exportToMermaid } from '../lib/nest-js-lite/devtools/MermaidExporter.js';

import { CoreModule } from './CoreModule.js';
import { EntityModule } from './EntityModule.js';
import { PoolsModule } from './PoolsModule.js';
import { SystemsModule } from './SystemsModule.js';

/**
 * Application state
 */
const app = {
  container: null,
  game: null,
  isRunning: false
};

/**
 * Bootstrap the application using DI container
 * @returns {Promise<Container>}
 */
export async function bootstrap() {
  console.log('[App-DI] Bootstrapping with DI container...');

  // Create container
  const container = new Container();

  // Register all modules
  container.register(CoreModule);
  container.register(EntityModule);
  container.register(PoolsModule);
  container.register(SystemsModule);

  console.log('[App-DI] Registered', container.getModuleNames().length, 'modules');
  console.log('[App-DI] Modules:', container.getModuleNames().join(', '));

  // Get debug info before initialization
  const debugInfo = container.getDebugInfo();
  console.log('[App-DI] Provider count:', debugInfo.providerCount);

  // Initialize all providers
  try {
    await container.initializeAll({
      // Any init arguments needed
    });

    console.log('[App-DI] Initialization complete');
    console.log('[App-DI] Init order:', container.getDebugInfo().initOrder.join(' -> '));

  } catch (error) {
    console.error('[App-DI] Initialization failed:', error);
    throw error;
  }

  // Store references
  app.container = container;
  app.game = container.resolve('Game');

  // Wire up game loop hooks
  const originalUpdate = app.game.update?.bind(app.game);
  app.game.update = function(deltaTime) {
    container.beforeUpdate(deltaTime);
    if (originalUpdate) originalUpdate(deltaTime);
    container.afterUpdate(deltaTime);
  };

  return container;
}

/**
 * Start the game
 */
export async function start() {
  if (!app.container) {
    await bootstrap();
  }

  const game = app.container.resolve('Game');

  // Add all systems to game
  for (const provider of app.container.getProviders()) {
    if (provider.tags.includes('system')) {
      const system = app.container.resolve(provider.token);
      game.addSystem(system);
    }
  }

  console.log('[App-DI] Starting game...');
  await game.start();
  app.isRunning = true;
}

/**
 * Stop the game and cleanup
 */
export async function stop() {
  if (!app.isRunning) return;

  console.log('[App-DI] Stopping game...');

  if (app.game) {
    app.game.stop();
  }

  if (app.container) {
    await app.container.destroyAll();
  }

  app.isRunning = false;
  console.log('[App-DI] Game stopped');
}

/**
 * Get dependency graph visualization
 * @returns {string} Mermaid diagram code
 */
export function getDependencyGraph() {
  if (!app.container) {
    throw new Error('Container not initialized. Call bootstrap() first.');
  }

  return exportToMermaid(app.container, {
    showModules: true,
    direction: 'TD'
  });
}

/**
 * Debug: explore the container
 */
export function debug() {
  if (!app.container) {
    throw new Error('Container not initialized. Call bootstrap() first.');
  }

  const explorer = new GraphExplorer(app.container);

  return {
    modules: explorer.findModules(),
    statistics: explorer.getStatistics(),
    circularDeps: explorer.analyzeCircularDependencies(),
    initOrder: explorer.getInitializationOrder(),
    graph: explorer.generateDebugReport()
  };
}

/**
 * Resolve a provider by token
 * @param {string} token
 * @returns {*}
 */
export function resolve(token) {
  if (!app.container) {
    throw new Error('Container not initialized. Call bootstrap() first.');
  }
  return app.container.resolve(token);
}

// Export app state for debugging
window.appDI = {
  bootstrap,
  start,
  stop,
  getDependencyGraph,
  debug,
  resolve,
  get container() { return app.container; },
  get game() { return app.game; },
  get isRunning() { return app.isRunning; }
};

// Auto-start if this is the main entry point
// Check if running as module entry
const isMainEntry = document.currentScript?.type === 'module' ||
  import.meta.url.includes('app-di.js');

if (isMainEntry && typeof window !== 'undefined') {
  // Wait for DOM and existing scripts to load
  window.addEventListener('load', async () => {
    // Check if VampireSurvivors namespace exists
    if (window.VampireSurvivors) {
      console.log('[App-DI] VampireSurvivors namespace found, starting...');
      try {
        await start();
      } catch (error) {
        console.error('[App-DI] Failed to start:', error);
      }
    } else {
      console.warn('[App-DI] VampireSurvivors namespace not found. Ensure game scripts are loaded first.');
    }
  });
}

export default {
  bootstrap,
  start,
  stop,
  getDependencyGraph,
  debug,
  resolve
};
