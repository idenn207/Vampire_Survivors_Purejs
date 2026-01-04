/**
 * @fileoverview Async event bus for decoupled communication
 * @module Core/EventBus
 */
(function(Core) {
  'use strict';

  // ============================================
  // Class Definition
  // ============================================
  class EventBus {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _listeners = new Map();
    _onceListeners = new Map();

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    on(event, callback) {
      if (!this._listeners.has(event)) {
        this._listeners.set(event, new Set());
      }
      this._listeners.get(event).add(callback);

      return () => this.off(event, callback);
    }

    once(event, callback) {
      if (!this._onceListeners.has(event)) {
        this._onceListeners.set(event, new Set());
      }
      this._onceListeners.get(event).add(callback);

      return () => {
        var listeners = this._onceListeners.get(event);
        if (listeners) {
          listeners.delete(callback);
        }
      };
    }

    off(event, callback) {
      var listeners = this._listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    }

    async emit(event, data) {
      var promises = [];

      var listeners = this._listeners.get(event);
      if (listeners) {
        listeners.forEach(function(callback) {
          try {
            var result = callback(data);
            if (result instanceof Promise) {
              promises.push(result);
            }
          } catch (e) {
            console.error('[EventBus] Error in listener for "' + event + '":', e);
          }
        });
      }

      var onceListeners = this._onceListeners.get(event);
      if (onceListeners) {
        onceListeners.forEach(function(callback) {
          try {
            var result = callback(data);
            if (result instanceof Promise) {
              promises.push(result);
            }
          } catch (e) {
            console.error('[EventBus] Error in once listener for "' + event + '":', e);
          }
        });
        this._onceListeners.delete(event);
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    }

    emitSync(event, data) {
      var listeners = this._listeners.get(event);
      if (listeners) {
        listeners.forEach(function(callback) {
          try {
            callback(data);
          } catch (e) {
            console.error('[EventBus] Error in listener for "' + event + '":', e);
          }
        });
      }

      var onceListeners = this._onceListeners.get(event);
      if (onceListeners) {
        onceListeners.forEach(function(callback) {
          try {
            callback(data);
          } catch (e) {
            console.error('[EventBus] Error in once listener for "' + event + '":', e);
          }
        });
        this._onceListeners.delete(event);
      }
    }

    clear(event) {
      if (event) {
        this._listeners.delete(event);
        this._onceListeners.delete(event);
      } else {
        this._listeners.clear();
        this._onceListeners.clear();
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getSummaryInfo() {
      var totalListeners = 0;
      this._listeners.forEach(function (set) {
        totalListeners += set.size;
      });
      return [{ key: 'Events', value: totalListeners }];
    }

    getDebugInfo() {
      var totalListeners = 0;
      this._listeners.forEach(function (set) {
        totalListeners += set.size;
      });

      return {
        label: 'Events',
        entries: [
          { key: 'Types', value: this._listeners.size },
          { key: 'Listeners', value: totalListeners },
          { key: 'Once', value: this._onceListeners.size },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._listeners.clear();
      this._onceListeners.clear();
    }
  }

  // ============================================
  // Global Instance
  // ============================================
  Core.EventBus = EventBus;
  Core.events = new EventBus();

})(window.VampireSurvivors.Core);
