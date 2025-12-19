/**
 * @fileoverview Divine Spear - Holy Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Holy/DivineSpear
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.divine_spear = {
    id: 'divine_spear',
    name: 'Divine Spear',

    // Evolution metadata
    coreId: 'holy_core',
    baseWeaponId: 'holy_lance',
    evolutionChain: 'holy',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 26,
    cooldown: 0.95,
    projectileCount: 1,
    projectileSpeed: 520,
    range: 480,
    pierce: 4,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.HOLY_MARK,
        chance: 0.35,
        duration: 4,
        bonusDamage: 0.2,
      },
    ],

    // T2 Special Ability: Divine Light
    specialAbility: {
      name: 'Divine Light',
      description: 'Projectile impacts create light bursts',
      divineLight: {
        enabled: true,
        burstRadius: 50,
        burstDamage: 12,
        healPlayer: 2,
      },
    },

    // Visual properties
    color: '#FFD700',
    size: 14,
    shape: 'lance',
    lifetime: 2.5,
    icon: 'divine_spear',
    imageId: 'weapon_divine_spear',

    // Level upgrades
    upgrades: {
      2: { damage: 33, statusEffects: [{ type: StatusEffectType.HOLY_MARK, chance: 0.4, duration: 4.5, bonusDamage: 0.23 }] },
      3: { damage: 41, pierce: 5, specialAbility: { divineLight: { burstRadius: 65, burstDamage: 18, healPlayer: 3 } } },
      4: { damage: 51, cooldown: 0.85, projectileSpeed: 560 },
      5: { damage: 64, statusEffects: [{ type: StatusEffectType.HOLY_MARK, chance: 0.5, duration: 5, bonusDamage: 0.3 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
