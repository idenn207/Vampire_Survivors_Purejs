/**
 * @fileoverview Thor Judgment - Lightning Core T5 Evolution (Legendary)
 * @module Data/Weapons/CoreEvolved/Lightning/ThorJudgment
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.thor_judgment = {
    id: 'thor_judgment',
    name: 'Thor Judgment',

    // Evolution metadata
    coreId: 'lightning_core',
    baseWeaponId: 'thunder_strike',
    evolutionChain: 'lightning',
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

    // Stats (2.5x base multiplier)
    damage: 50,
    cooldown: 0.4,
    projectileCount: 4,
    projectileSpeed: 800,
    range: 620,
    pierce: 6,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SHOCK,
        chance: 0.6,
        duration: 3,
        stunDuration: 1.0,
      },
    ],

    // T5 Special Ability: Storm Aura
    specialAbility: {
      name: 'Storm Aura',
      description: 'Enemies near player periodically take lightning damage',
      stormAura: {
        enabled: true,
        radius: 180,
        damagePerSecond: 20,
        shockChance: 0.15,
      },
      // Enhanced thunder strike from T4
      thunderStrike: {
        enabled: true,
        interval: 2,
        strikeCount: 6,
        strikeDamage: 120,
        stunDuration: 0.8,
      },
      // Keeps overcharge from T3
      overcharge: {
        enabled: true,
        bonusDamageMultiplier: 1.5,
      },
      // Keeps chain lightning from T2
      chainLightning: {
        enabled: true,
        maxChains: 6,
        chainRange: 150,
        chainDamageMultiplier: 0.85,
      },
    },

    // Visual properties
    color: '#FFFFFF',
    size: 14,
    shape: 'bolt',
    lifetime: 3.0,
    icon: 'thor_judgment',
    imageId: 'weapon_thor_judgment',

    // Level upgrades
    upgrades: {
      2: { damage: 63, statusEffects: [{ type: StatusEffectType.SHOCK, chance: 0.65, duration: 3.2, stunDuration: 1.1 }] },
      3: { damage: 78, pierce: 7, specialAbility: { stormAura: { radius: 220, damagePerSecond: 30 } } },
      4: { damage: 98, projectileCount: 5, cooldown: 0.35 },
      5: { damage: 122, statusEffects: [{ type: StatusEffectType.SHOCK, chance: 0.75, duration: 3.5, stunDuration: 1.3 }], specialAbility: { stormAura: { radius: 260, damagePerSecond: 45, shockChance: 0.25 }, thunderStrike: { interval: 1.5, strikeCount: 8, strikeDamage: 160 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
