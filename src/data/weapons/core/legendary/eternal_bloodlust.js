/**
 * @fileoverview Eternal Bloodlust - Blood Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Blood/EternalBloodlust
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.eternal_bloodlust = {
    id: 'eternal_bloodlust',
    name: 'Eternal Bloodlust',

    // Evolution metadata
    coreId: 'blood_core',
    baseWeaponId: 'blood_scythe',
    evolutionChain: 'blood',
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

    // Stats (2.5x base multiplier)
    damage: 63,
    cooldown: 0.7,
    range: 185,
    arc: 240,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.75,
        duration: 7,
        tickRate: 2,
        damagePerTick: 16,
      },
    ],

    // T5 Special Ability: Blood Aura
    specialAbility: {
      name: 'Blood Aura',
      description: 'Permanent aura that drains life and causes bleeding',
      bloodAura: {
        enabled: true,
        radius: 140,
        damagePerSecond: 12,
        healPerSecond: 5,
        bleedChance: 0.1,
      },
      // Enhanced blood explosion from T4
      bloodExplosion: {
        enabled: true,
        explosionRadius: 110,
        explosionDamage: 65,
        applyBleed: true,
        bleedChance: 0.65,
      },
      // Enhanced soul reap from T3
      soulReap: {
        enabled: true,
        damageBoost: 0.25,
        boostDuration: 7,
        maxStacks: 10,
      },
      // Enhanced blood drain from T2
      bloodDrain: {
        enabled: true,
        healPercent: 0.15,
        maxHealPerHit: 15,
      },
    },

    // Visual properties
    color: '#DC0000',
    size: 65,
    shape: 'arc',
    lifetime: 0.3,
    icon: 'eternal_bloodlust',
    imageId: 'weapon_eternal_bloodlust',

    // Level upgrades
    upgrades: {
      2: { damage: 78, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.8, duration: 7.5, tickRate: 2, damagePerTick: 20 }] },
      3: { damage: 98, arc: 270, specialAbility: { bloodAura: { radius: 170, damagePerSecond: 18, healPerSecond: 8 } } },
      4: { damage: 122, cooldown: 0.6, range: 200 },
      5: { damage: 153, specialAbility: { bloodAura: { radius: 210, damagePerSecond: 28, healPerSecond: 12, bleedChance: 0.2 }, bloodExplosion: { explosionRadius: 150, explosionDamage: 100, bleedChance: 0.85 }, soulReap: { damageBoost: 0.4, maxStacks: 15 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
