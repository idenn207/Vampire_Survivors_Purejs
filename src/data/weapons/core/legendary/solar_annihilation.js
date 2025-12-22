/**
 * @fileoverview Solar Annihilation - Fire Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Fire/SolarAnnihilation
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.solar_annihilation = {
    id: 'solar_annihilation',
    name: 'Solar Annihilation',

    // Evolution metadata
    coreId: 'fire_core',
    baseWeaponId: 'inferno_bolt',
    evolutionChain: 'fire',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (10.0x base multiplier)
    damage: 45,
    cooldown: 0.7,
    projectileCount: 5,
    projectileSpeed: 480,
    range: 520,
    pierce: 5,
    spread: 45,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BURN,
        chance: 1.0,
        duration: 5,
        tickRate: 2,
        damagePerTick: 20,
      },
    ],

    // T5 Special Ability: Solar Aura
    specialAbility: {
      name: 'Solar Aura',
      description: 'Permanent burn aura around player',
      solarAura: {
        enabled: true,
        radius: 120,
        damagePerSecond: 15,
        burnChance: 0.5,
        burnDuration: 2,
      },
      // Also keeps fire nova from T4
      fireNova: {
        enabled: true,
        killThreshold: 20,
        radius: 280,
        damage: 150,
        burnDuration: 4,
      },
    },

    // Enhanced kill effect
    onKill: {
      chance: 1.0,
      explosion: { radius: 120, damage: 65 },
    },

    // Visual properties
    color: '#FF8800',
    size: 16,
    shape: 'circle',
    lifetime: 4.0,
    icon: 'solar_annihilation',
    imageId: 'weapon_solar_annihilation',
    projectileImageId: 'solar_annihilation_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 56, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 5, tickRate: 2, damagePerTick: 25 }] },
      3: { damage: 70, pierce: 6, specialAbility: { solarAura: { radius: 150, damagePerSecond: 20 } } },
      4: { damage: 88, projectileCount: 6, cooldown: 0.6 },
      5: { damage: 110, onKill: { chance: 1.0, explosion: { radius: 150, damage: 90 } }, specialAbility: { solarAura: { radius: 180, damagePerSecond: 30, burnChance: 0.8 }, fireNova: { killThreshold: 15, radius: 350, damage: 200 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
