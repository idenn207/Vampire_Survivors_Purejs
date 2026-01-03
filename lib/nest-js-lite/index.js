/**
 * @fileoverview NestJS-Lite - Dependency Injection Framework for Pure JavaScript
 * @module nest-js-lite
 *
 * A lightweight dependency injection container inspired by NestJS,
 * designed for pure JavaScript projects without TypeScript or build tools.
 *
 * @example
 * import { Container, defineModule, Scope } from './lib/nest-js-lite/index.js';
 *
 * // Define a module
 * const CoreModule = defineModule({
 *   name: 'CoreModule',
 *   global: true,
 *   providers: [
 *     { token: 'EventBus', class: EventBus, scope: Scope.SINGLETON }
 *   ]
 * });
 *
 * // Create container and register modules
 * const container = new Container();
 * container.register(CoreModule);
 * await container.initializeAll();
 *
 * // Resolve dependencies
 * const eventBus = container.resolve('EventBus');
 */

// Core exports
export { Container } from './core/Container.js';
export { Scope } from './core/Scope.js';
export { Provider, ProviderType } from './core/Provider.js';
export { Injector } from './core/Injector.js';
export { LifecycleManager } from './core/LifecycleManager.js';
export { defineModule, Module, createDynamicModule } from './core/Module.js';

// Re-export commonly used utilities
export { default as ContainerDefault } from './core/Container.js';

/**
 * Create a pre-configured container instance
 * @param {Object[]} modules - Array of module definitions
 * @returns {Promise<Container>} Initialized container
 */
export async function createContainer(modules = []) {
  const container = new Container();

  for (const mod of modules) {
    container.register(mod);
  }

  return container;
}

/**
 * Create and initialize a container in one step
 * @param {Object[]} modules - Array of module definitions
 * @param {Object} [initArgs={}] - Arguments to pass to onInit hooks
 * @returns {Promise<Container>} Initialized container
 */
export async function bootstrapContainer(modules = [], initArgs = {}) {
  const container = await createContainer(modules);
  await container.initializeAll(initArgs);
  return container;
}

// Version info
export const VERSION = '1.0.0';
export const FRAMEWORK_NAME = 'nest-js-lite';
