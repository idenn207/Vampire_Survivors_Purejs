/**
 * @fileoverview Provider scope constants for dependency injection
 * @module nest-js-lite/core/Scope
 */

/**
 * Provider scope types
 * @enum {string}
 */
export const Scope = Object.freeze({
  /**
   * Single instance shared across entire container lifetime.
   * Default scope for all providers.
   */
  SINGLETON: 'singleton',

  /**
   * New instance created for each resolution.
   * Useful for stateful services that shouldn't be shared.
   */
  TRANSIENT: 'transient',

  /**
   * One instance per request/frame context.
   * Requires request context to be set on container.
   */
  REQUEST: 'request'
});

export default Scope;
