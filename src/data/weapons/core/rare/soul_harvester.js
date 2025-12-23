/**
 * @fileoverview Soul Harvester - Blood Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Blood/SoulHarvester
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.soul_harvester = {
    id: 'soul_harvester',
    name: 'Soul Harvester',

    // Evolution metadata
    coreId: 'blood_core',
    baseWeaponId: 'blood_scythe',
    evolutionChain: 'blood',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_THRUST,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 40,
    cooldown: 0.8,
    range: 110,
    pierce: 999,

    // Thrust parameters (scythe style)
    thrustStyle: 'scythe',
    thrustDuration: 0.35,
    extendTime: 0.3,
    holdTime: 0.25,
    retractTime: 0.45,
    thrustWidth: 20,
    coneExpansion: 3.5,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.5,
        duration: 5,
        tickRate: 2,
        damagePerTick: 9,
      },
    ],

    // T3 Special Ability: Soul Reap
    specialAbility: {
      name: 'Soul Reap',
      description: 'Killing bleeding enemies grants temporary damage boost',
      soulReap: {
        enabled: true,
        damageBoost: 0.15,
        boostDuration: 5,
        maxStacks: 5,
      },
      // Keeps blood drain from T2
      bloodDrain: {
        enabled: true,
        healPercent: 0.08,
        maxHealPerHit: 8,
      },
    },

    // Visual properties
    color: '#A00000',
    size: 55,
    shape: 'arc',
    lifetime: 0.25,
    icon: 'soul_harvester',
    imageId: 'weapon_soul_harvester',
    meleeImageId: 'soul_harvester_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 50, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.55, duration: 5.5, tickRate: 2, damagePerTick: 11 }] },
      3: { damage: 63, coneExpansion: 4.0, specialAbility: { soulReap: { damageBoost: 0.2, maxStacks: 6 } } },
      4: { damage: 78, cooldown: 0.7, range: 130 },
      5: { damage: 98, specialAbility: { soulReap: { damageBoost: 0.25, boostDuration: 6, maxStacks: 8 }, bloodDrain: { healPercent: 0.12, maxHealPerHit: 12 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
