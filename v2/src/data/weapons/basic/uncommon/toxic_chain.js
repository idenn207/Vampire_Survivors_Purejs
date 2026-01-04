/**
 * @fileoverview Toxic Chain - Uncommon chain that adds poison stacks
 * @module Data/Weapons/Uncommon/ToxicChain
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.toxic_chain = {
    id: 'toxic_chain',
    name: 'Toxic Chain',
    description: 'Poison jumps between enemies, each chain adding another poison stack',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.CHAIN,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 10,
    cooldown: 1.4,
    chainCount: 4,
    chainRange: 100,
    damageDecay: 1.0,

    color: '#44DD00',
    visualScale: 1.2,
    icon: 'toxic_chain',
    imageId: 'weapon_toxic_chain',
    bladeImageId: 'toxic_chain_blade',

    stackingPoison: {
      enabled: true,
      poisonPerChain: 1,
      poisonDamage: 3,
      poisonDuration: 3.0,
      maxStacks: 8,
    },

    chainVisual: {
      type: 'toxic_link',
      color: '#44DD00',
      secondaryColor: '#88FF44',
      thickness: 4,
      bubbles: true,
    },

    particles: {
      enabled: true,
      type: 'poison_bubbles',
      color: '#66FF22',
      count: 5,
      spread: 20,
      lifetime: 0.4,
      floating: true,
    },

    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.4,
      color: '#44DD00',
    },

    upgrades: {
      2: { damage: 13, chainCount: 5, stackingPoison: { poisonDamage: 4 } },
      3: { damage: 17, cooldown: 1.2, chainRange: 120 },
      4: { damage: 22, chainCount: 6, stackingPoison: { maxStacks: 10 } },
      5: { damage: 29, cooldown: 1.0, stackingPoison: { poisonDamage: 5 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
