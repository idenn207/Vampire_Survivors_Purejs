/**
 * @fileoverview Simple finite state machine with transition guards
 * @module Lib/Core/StateMachine
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Core = Lib.Core || {};

  // ============================================
  // Class Definition
  // ============================================
  class StateMachine {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _currentState = null;
    _previousState = null;
    _states = null;
    _context = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * Create a new state machine
     * @param {string} initialState - Initial state name
     * @param {Object} states - State definitions
     * @param {Object} [context] - Context object passed to callbacks
     *
     * @example
     * var fsm = new StateMachine('idle', {
     *   idle: {
     *     onEnter: function(ctx) { },
     *     onUpdate: function(ctx, dt) { },
     *     onExit: function(ctx) { },
     *     transitions: ['walking', 'attacking']
     *   },
     *   walking: { ... },
     *   attacking: { ... }
     * });
     */
    constructor(initialState, states, context) {
      this._states = states || {};
      this._context = context || null;
      this._currentState = initialState;
      this._previousState = null;

      // Call onEnter for initial state
      this._callStateCallback('onEnter');
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Attempt to transition to a new state
     * @param {string} newState - Target state name
     * @returns {boolean} True if transition succeeded
     */
    transition(newState) {
      if (!this.canTransition(newState)) {
        return false;
      }

      // Exit current state
      this._callStateCallback('onExit');

      // Update state
      this._previousState = this._currentState;
      this._currentState = newState;

      // Enter new state
      this._callStateCallback('onEnter');

      return true;
    }

    /**
     * Force transition without checking guards
     * @param {string} newState - Target state name
     */
    forceTransition(newState) {
      if (!this._states[newState]) {
        console.warn('[StateMachine] Unknown state:', newState);
        return;
      }

      this._callStateCallback('onExit');
      this._previousState = this._currentState;
      this._currentState = newState;
      this._callStateCallback('onEnter');
    }

    /**
     * Check if transition to state is allowed
     * @param {string} newState - Target state name
     * @returns {boolean} True if transition is allowed
     */
    canTransition(newState) {
      // Check if state exists
      if (!this._states[newState]) {
        return false;
      }

      // Check transition list if defined
      var currentStateDef = this._states[this._currentState];
      if (currentStateDef && currentStateDef.transitions) {
        return currentStateDef.transitions.indexOf(newState) !== -1;
      }

      // No transition restrictions
      return true;
    }

    /**
     * Update current state
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
      this._callStateCallback('onUpdate', deltaTime);
    }

    /**
     * Check if currently in a specific state
     * @param {string} state - State name to check
     * @returns {boolean}
     */
    isInState(state) {
      return this._currentState === state;
    }

    /**
     * Check if in any of the given states
     * @param {...string} states - State names to check
     * @returns {boolean}
     */
    isInAnyState() {
      var states = Array.prototype.slice.call(arguments);
      return states.indexOf(this._currentState) !== -1;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _callStateCallback(callbackName, arg) {
      var stateDef = this._states[this._currentState];
      if (stateDef && typeof stateDef[callbackName] === 'function') {
        stateDef[callbackName](this._context, arg);
      }
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** Current state name */
    get currentState() {
      return this._currentState;
    }

    /** Previous state name */
    get previousState() {
      return this._previousState;
    }

    /** Context object */
    get context() {
      return this._context;
    }

    set context(value) {
      this._context = value;
    }

    /** All state names */
    get stateNames() {
      return Object.keys(this._states);
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      return {
        label: 'StateMachine',
        entries: [
          { key: 'Current', value: this._currentState },
          { key: 'Previous', value: this._previousState || 'none' },
          { key: 'States', value: this.stateNames.join(', ') },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._states = null;
      this._context = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Core.StateMachine = StateMachine;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
