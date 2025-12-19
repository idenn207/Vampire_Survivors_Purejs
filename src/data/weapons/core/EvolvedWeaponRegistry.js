/**
 * @fileoverview Unified registry for all evolved weapons (basic + core)
 * @module Data/Weapons/Evolved/Registry
 */
(function (Data) {
  'use strict';

  // Initialize the unified evolved weapon registry
  Data.EvolvedWeaponRegistry = {};

  // Backwards compatibility alias
  Data.CoreEvolvedRegistry = Data.EvolvedWeaponRegistry;
})(window.VampireSurvivors.Data);
