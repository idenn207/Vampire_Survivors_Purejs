/**
 * @fileoverview Blood Lord - Blood Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Blood/BloodLord
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.blood_lord = {
    id: 'blood_lord',
    name: 'Blood Lord',

    // Evolution metadata
    coreId: 'blood_core',
    baseWeaponId: 'blood_scythe',
    evolutionChain: 'blood',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_THRUST,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 50,
    cooldown: 0.75,
    range: 130,
    pierce: 999,

    // Thrust parameters (scythe style)
    thrustStyle: 'scythe',
    thrustDuration: 0.35,
    extendTime: 0.3,
    holdTime: 0.25,
    retractTime: 0.45,
    thrustWidth: 20,
    coneExpansion: 4.0,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.6,
        duration: 6,
        tickRate: 2,
        damagePerTick: 12,
      },
    ],

    // T4 Special Ability: Blood Explosion
    specialAbility: {
      name: 'Blood Explosion',
      description: 'Bleeding enemies explode on death',
      bloodExplosion: {
        enabled: true,
        explosionRadius: 80,
        explosionDamage: 40,
        applyBleed: true,
        bleedChance: 0.5,
      },
      // Keeps soul reap from T3
      soulReap: {
        enabled: true,
        damageBoost: 0.2,
        boostDuration: 6,
        maxStacks: 7,
      },
      // Keeps blood drain from T2
      bloodDrain: {
        enabled: true,
        healPercent: 0.1,
        maxHealPerHit: 10,
      },
    },

    // Visual properties
    color: '#B80000',
    visualScale: 1.2,
    size: 60,
    shape: 'arc',
    lifetime: 0.3,
    icon: 'blood_lord',
    imageId: 'weapon_blood_lord',
    meleeImageId: 'blood_lord_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 63, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.65, duration: 6.5, tickRate: 2, damagePerTick: 15 }] },
      3: { damage: 78, coneExpansion: 4.5, specialAbility: { bloodExplosion: { explosionRadius: 100, explosionDamage: 55 } } },
      4: { damage: 98, cooldown: 0.65, range: 145 },
      5: { damage: 122, specialAbility: { bloodExplosion: { explosionRadius: 120, explosionDamage: 75, bleedChance: 0.7 }, soulReap: { damageBoost: 0.3, maxStacks: 10 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
