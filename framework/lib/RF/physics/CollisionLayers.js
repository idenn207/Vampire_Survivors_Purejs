/**
 * @fileoverview Bitmask-based collision layer system
 * @module Lib/Physics/CollisionLayers
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Physics = Lib.Physics || {};

  // ============================================
  // Predefined Layers
  // ============================================
  var PREDEFINED = {
    NONE: 0,
    PLAYER: 1 << 0,      // 1
    ENEMY: 1 << 1,       // 2
    PROJECTILE: 1 << 2,  // 4
    PICKUP: 1 << 3,      // 8
    TERRAIN: 1 << 4,     // 16
    TRIGGER: 1 << 5,     // 32
    NPC: 1 << 6,         // 64
    EFFECT: 1 << 7,      // 128
    ALL: 0xFFFFFFFF,
  };

  // Track custom layers
  var _customLayers = {};
  var _nextBit = 8;  // Start custom layers at bit 8

  // ============================================
  // CollisionLayers Object
  // ============================================
  var CollisionLayers = {
    // ----------------------------------------
    // Predefined layer constants
    // ----------------------------------------
    NONE: PREDEFINED.NONE,
    PLAYER: PREDEFINED.PLAYER,
    ENEMY: PREDEFINED.ENEMY,
    PROJECTILE: PREDEFINED.PROJECTILE,
    PICKUP: PREDEFINED.PICKUP,
    TERRAIN: PREDEFINED.TERRAIN,
    TRIGGER: PREDEFINED.TRIGGER,
    NPC: PREDEFINED.NPC,
    EFFECT: PREDEFINED.EFFECT,
    ALL: PREDEFINED.ALL,

    // ----------------------------------------
    // Layer Management
    // ----------------------------------------

    /**
     * Create a custom collision layer
     * @param {string} name - Layer name
     * @returns {number} Layer bitmask value
     */
    create: function (name) {
      if (_customLayers[name]) {
        return _customLayers[name];
      }

      if (_nextBit >= 32) {
        console.warn('[CollisionLayers] Maximum layers (32) reached');
        return 0;
      }

      var layer = 1 << _nextBit;
      _customLayers[name] = layer;
      CollisionLayers[name.toUpperCase()] = layer;
      _nextBit++;

      return layer;
    },

    /**
     * Get layer by name
     * @param {string} name - Layer name
     * @returns {number} Layer bitmask or 0 if not found
     */
    get: function (name) {
      var upper = name.toUpperCase();
      return CollisionLayers[upper] || _customLayers[name] || 0;
    },

    /**
     * Get all layer names
     * @returns {Array<string>}
     */
    getLayerNames: function () {
      var names = Object.keys(PREDEFINED).filter(function (k) {
        return k !== 'NONE' && k !== 'ALL';
      });
      return names.concat(Object.keys(_customLayers));
    },

    // ----------------------------------------
    // Collision Checking
    // ----------------------------------------

    /**
     * Check if two entities can collide based on layers
     * @param {number} layerA - First entity's layer
     * @param {number} maskA - First entity's collision mask
     * @param {number} layerB - Second entity's layer
     * @param {number} maskB - Second entity's collision mask
     * @returns {boolean}
     */
    canCollide: function (layerA, maskA, layerB, maskB) {
      return (maskA & layerB) !== 0 && (maskB & layerA) !== 0;
    },

    /**
     * Check if a layer is included in a mask
     * @param {number} mask - Collision mask
     * @param {number} layer - Layer to check
     * @returns {boolean}
     */
    includes: function (mask, layer) {
      return (mask & layer) !== 0;
    },

    // ----------------------------------------
    // Mask Building
    // ----------------------------------------

    /**
     * Combine multiple layers into a mask
     * @param {...number} layers - Layer values
     * @returns {number} Combined mask
     */
    combine: function () {
      var result = 0;
      for (var i = 0; i < arguments.length; i++) {
        result |= arguments[i];
      }
      return result;
    },

    /**
     * Add layer to mask
     * @param {number} mask - Current mask
     * @param {number} layer - Layer to add
     * @returns {number} New mask
     */
    add: function (mask, layer) {
      return mask | layer;
    },

    /**
     * Remove layer from mask
     * @param {number} mask - Current mask
     * @param {number} layer - Layer to remove
     * @returns {number} New mask
     */
    remove: function (mask, layer) {
      return mask & ~layer;
    },

    /**
     * Toggle layer in mask
     * @param {number} mask - Current mask
     * @param {number} layer - Layer to toggle
     * @returns {number} New mask
     */
    toggle: function (mask, layer) {
      return mask ^ layer;
    },

    // ----------------------------------------
    // Common Presets
    // ----------------------------------------

    /**
     * Create mask for player projectiles (hits enemies)
     * @returns {number}
     */
    playerProjectileMask: function () {
      return CollisionLayers.combine(
        PREDEFINED.ENEMY,
        PREDEFINED.TERRAIN
      );
    },

    /**
     * Create mask for enemy projectiles (hits player)
     * @returns {number}
     */
    enemyProjectileMask: function () {
      return CollisionLayers.combine(
        PREDEFINED.PLAYER,
        PREDEFINED.TERRAIN
      );
    },

    /**
     * Create mask for player (collides with enemies, pickups, terrain)
     * @returns {number}
     */
    playerMask: function () {
      return CollisionLayers.combine(
        PREDEFINED.ENEMY,
        PREDEFINED.PICKUP,
        PREDEFINED.TERRAIN,
        PREDEFINED.TRIGGER
      );
    },

    /**
     * Create mask for enemies (collides with player, player projectiles)
     * @returns {number}
     */
    enemyMask: function () {
      return CollisionLayers.combine(
        PREDEFINED.PLAYER,
        PREDEFINED.PROJECTILE,
        PREDEFINED.TERRAIN
      );
    },

    // ----------------------------------------
    // Debug
    // ----------------------------------------

    /**
     * Get human-readable layer names from mask
     * @param {number} mask - Collision mask
     * @returns {Array<string>} Layer names
     */
    toNames: function (mask) {
      var names = [];

      if (mask === PREDEFINED.NONE) return ['NONE'];
      if (mask === PREDEFINED.ALL) return ['ALL'];

      for (var key in PREDEFINED) {
        if (key !== 'NONE' && key !== 'ALL') {
          if ((mask & PREDEFINED[key]) !== 0) {
            names.push(key);
          }
        }
      }

      for (var name in _customLayers) {
        if ((mask & _customLayers[name]) !== 0) {
          names.push(name);
        }
      }

      return names;
    },

    /**
     * Get debug info
     * @returns {Object}
     */
    getDebugInfo: function () {
      return {
        label: 'CollisionLayers',
        entries: [
          { key: 'Predefined', value: Object.keys(PREDEFINED).length },
          { key: 'Custom', value: Object.keys(_customLayers).length },
          { key: 'Next Bit', value: _nextBit },
        ],
      };
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Physics.CollisionLayers = CollisionLayers;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
