/**
 * @fileoverview Titan Maul - Steel Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Steel/TitanMaul
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.titan_maul = {
    id: 'titan_maul',
    name: 'Titan Maul',

    // Evolution metadata
    coreId: 'steel_core',
    baseWeaponId: 'steel_hammer',
    evolutionChain: 'steel',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 56,
    cooldown: 1.0,
    range: 105,
    arc: 150,
    pierce: 999,
    knockback: 220,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.3,
        duration: 0.8,
      },
      {
        type: StatusEffectType.ARMOR_BREAK,
        chance: 0.25,
        duration: 4,
        armorReduction: 0.2,
      },
    ],

    // T3 Special Ability: Crushing Blow
    specialAbility: {
      name: 'Crushing Blow',
      description: 'Deals bonus damage to stunned enemies',
      crushingBlow: {
        enabled: true,
        bonusDamageMultiplier: 1.5,
        guaranteedStunOnCrit: true,
        critChance: 0.15,
      },
      // Keeps heavy impact from T2
      heavyImpact: {
        enabled: true,
        shockwaveRadius: 65,
        shockwaveDamage: 25,
        shockwaveKnockback: 120,
      },
    },

    // Visual properties
    color: '#778899',
    size: 55,
    shape: 'arc',
    lifetime: 0.35,
    icon: 'titan_maul',
    imageId: 'weapon_titan_maul',
    meleeImageId: 'titan_maul_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 70, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.35, duration: 0.9 }, { type: StatusEffectType.ARMOR_BREAK, chance: 0.3, duration: 4.5, armorReduction: 0.25 }] },
      3: { damage: 88, arc: 170, specialAbility: { crushingBlow: { bonusDamageMultiplier: 1.75, critChance: 0.2 } } },
      4: { damage: 110, cooldown: 0.9, range: 115 },
      5: { damage: 138, knockback: 280, specialAbility: { heavyImpact: { shockwaveRadius: 85, shockwaveDamage: 40 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
