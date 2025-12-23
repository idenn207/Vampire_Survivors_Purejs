/**
 * @fileoverview Iron Crusher - Steel Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Steel/IronCrusher
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.iron_crusher = {
    id: 'iron_crusher',
    name: 'Iron Crusher',

    // Evolution metadata
    coreId: 'steel_core',
    baseWeaponId: 'steel_hammer',
    evolutionChain: 'steel',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 46,
    cooldown: 1.05,
    range: 95,
    arc: 130,
    pierce: 999,
    knockback: 180,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.2,
        duration: 0.6,
      },
    ],

    // T2 Special Ability: Heavy Impact
    specialAbility: {
      name: 'Heavy Impact',
      description: 'Creates a shockwave on hit',
      heavyImpact: {
        enabled: true,
        shockwaveRadius: 50,
        shockwaveDamage: 15,
        shockwaveKnockback: 100,
      },
    },

    // Visual properties
    color: '#708090',
    visualScale: 1.2,
    size: 50,
    shape: 'arc',
    lifetime: 0.3,
    icon: 'iron_crusher',
    imageId: 'weapon_iron_crusher',
    meleeImageId: 'iron_crusher_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 58, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.25, duration: 0.7 }] },
      3: { damage: 72, arc: 150, specialAbility: { heavyImpact: { shockwaveRadius: 65, shockwaveDamage: 22 } } },
      4: { damage: 90, cooldown: 0.95, range: 105 },
      5: { damage: 113, knockback: 220, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.35, duration: 0.9 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
