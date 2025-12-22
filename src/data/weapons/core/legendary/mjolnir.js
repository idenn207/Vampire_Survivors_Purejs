/**
 * @fileoverview Mjolnir - Steel Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Steel/Mjolnir
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.mjolnir = {
    id: 'mjolnir',
    name: 'Mjolnir',

    // Evolution metadata
    coreId: 'steel_core',
    baseWeaponId: 'steel_hammer',
    evolutionChain: 'steel',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (10.0x base multiplier)
    damage: 88,
    cooldown: 0.9,
    range: 130,
    arc: 200,
    pierce: 999,
    knockback: 300,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.5,
        duration: 1.2,
      },
      {
        type: StatusEffectType.ARMOR_BREAK,
        chance: 0.45,
        duration: 6,
        armorReduction: 0.4,
      },
    ],

    // T5 Special Ability: Divine Hammer
    specialAbility: {
      name: 'Divine Hammer',
      description: 'Hammer infused with lightning, creates thunder on hit',
      divineHammer: {
        enabled: true,
        lightningChance: 0.3,
        lightningDamage: 50,
        lightningChainCount: 3,
        lightningRadius: 100,
      },
      // Enhanced seismic slam from T4
      seismicSlam: {
        enabled: true,
        hitThreshold: 4,
        slamRadius: 160,
        slamDamage: 130,
        stunDuration: 1.2,
      },
      // Enhanced crushing blow from T3
      crushingBlow: {
        enabled: true,
        bonusDamageMultiplier: 2.0,
        guaranteedStunOnCrit: true,
        critChance: 0.25,
      },
      // Enhanced heavy impact from T2
      heavyImpact: {
        enabled: true,
        shockwaveRadius: 100,
        shockwaveDamage: 50,
        shockwaveKnockback: 180,
      },
    },

    // Visual properties
    color: '#C0C0C0',
    size: 65,
    shape: 'arc',
    lifetime: 0.4,
    icon: 'mjolnir',
    imageId: 'weapon_mjolnir',
    meleeImageId: 'mjolnir_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 110, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.55, duration: 1.3 }, { type: StatusEffectType.ARMOR_BREAK, chance: 0.5, duration: 6.5, armorReduction: 0.45 }] },
      3: { damage: 138, arc: 220, specialAbility: { divineHammer: { lightningChance: 0.4, lightningDamage: 70, lightningChainCount: 4 } } },
      4: { damage: 172, cooldown: 0.8, range: 145 },
      5: { damage: 215, knockback: 380, specialAbility: { divineHammer: { lightningChance: 0.5, lightningDamage: 100, lightningChainCount: 5, lightningRadius: 140 }, seismicSlam: { hitThreshold: 3, slamRadius: 200, slamDamage: 200 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
