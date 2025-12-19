/**
 * @fileoverview Phoenix Storm - Fire Core T3 Evolution (Rare)
 * @module Data/Weapons/CoreEvolved/Fire/PhoenixStorm
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.phoenix_storm = {
    id: 'phoenix_storm',
    name: 'Phoenix Storm',

    // Evolution metadata
    coreId: 'fire_core',
    baseWeaponId: 'inferno_bolt',
    evolutionChain: 'fire',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 29,
    cooldown: 0.8,
    projectileCount: 3,
    projectileSpeed: 420,
    range: 450,
    pierce: 2,
    spread: 25,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BURN,
        chance: 1.0,
        duration: 4,
        tickRate: 2,
        damagePerTick: 10,
      },
    ],

    // T3 Special Ability: Chain Explosion
    specialAbility: {
      name: 'Chain Explosion',
      description: 'Explosions can chain to nearby enemies',
      chainExplosion: {
        enabled: true,
        maxChains: 2,
        chainRadius: 100,
        chainDamageMultiplier: 0.7,
      },
    },

    // Enhanced kill effect
    onKill: {
      chance: 0.8,
      explosion: { radius: 85, damage: 40 },
    },

    // Visual properties
    color: '#FF6600',
    size: 12,
    shape: 'circle',
    lifetime: 3.0,
    icon: 'phoenix_storm',
    imageId: 'weapon_phoenix_storm',

    // Level upgrades
    upgrades: {
      2: { damage: 36, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 13 }] },
      3: { damage: 45, pierce: 3, specialAbility: { chainExplosion: { maxChains: 3 } } },
      4: { damage: 56, projectileCount: 4, cooldown: 0.7 },
      5: { damage: 70, onKill: { chance: 1.0, explosion: { radius: 100, damage: 55 } }, specialAbility: { chainExplosion: { maxChains: 4, chainDamageMultiplier: 0.8 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
