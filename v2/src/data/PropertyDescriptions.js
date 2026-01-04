/**
 * @fileoverview Property descriptions - explains weapon unique properties for tooltips
 * @module Data/PropertyDescriptions
 */
(function (Data) {
  'use strict';

  // ============================================
  // Property Descriptions
  // ============================================
  var PROPERTY_DESCRIPTIONS = {
    // Projectile properties
    pierce: 'Passes through enemies, hitting multiple targets',
    projectileCount: 'Number of projectiles fired per attack',
    homing: 'Projectiles automatically track enemies',
    bounce: 'Projectiles bounce between enemies',
    split: 'Projectiles split into smaller ones on impact',
    spread: 'Angle of projectile spread',

    // Area properties
    areaRadius: 'Radius of area damage effects',
    explosion: 'Creates explosion on impact',

    // Damage modifiers
    chain: 'Damage chains to nearby enemies',
    lifesteal: 'Heals player for portion of damage dealt',
    critBonus: 'Increased critical hit chance',

    // Crowd control
    knockback: 'Pushes enemies back on hit',
    slow: 'Reduces enemy movement speed',
    freeze: 'Temporarily immobilizes enemies',
    stun: 'Briefly stops enemy actions',

    // Status effects
    burn: 'Deals fire damage over time',
    poison: 'Deals poison damage over time',
    bleed: 'Causes bleeding damage over time',
    shock: 'Deals lightning damage over time',

    // Special mechanics
    summon: 'Summons allied entities to fight',
    shield: 'Creates protective barrier',
    teleport: 'Instantly moves to target location',
    aura: 'Continuous effect around the player',

    // Healing-related
    healing: 'Restores HP on hit or over time',
    regen: 'Passive health regeneration over time',
    woundedBonus: 'Deals more damage when player HP is low',

    // Chain mechanics
    chainCount: 'Maximum number of chain jumps',
    chainRange: 'Maximum distance for chain to next target',
    damageDecay: 'Damage reduction per chain jump',

    // Special effects
    stackingPoison: 'Poison stacks accumulate for increased damage',
    pull: 'Pulls enemies toward the impact location',
    onKill: 'Triggers special effect when killing enemies',

    // Projectile modifiers
    ricochet: 'Bounces off walls or enemies',
    multiShot: 'Fires multiple projectiles at once',
    spreadAngle: 'Angle between multiple projectiles',
  };

  // ============================================
  // Public API
  // ============================================
  var PropertyDescriptions = {
    /**
     * Get description for a property
     * @param {string} propertyId
     * @returns {string|null}
     */
    get: function (propertyId) {
      return PROPERTY_DESCRIPTIONS[propertyId] || null;
    },

    /**
     * Get all property descriptions
     * @returns {Object}
     */
    getAll: function () {
      return PROPERTY_DESCRIPTIONS;
    },

    /**
     * Check if property has a description
     * @param {string} propertyId
     * @returns {boolean}
     */
    has: function (propertyId) {
      return propertyId in PROPERTY_DESCRIPTIONS;
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Data.PropertyDescriptions = PropertyDescriptions;
})(window.VampireSurvivors.Data);
