/**
 * @fileoverview Chain Reaction Mine - Uncommon mine that triggers other mines
 * @module Data/Weapons/Uncommon/ChainReactionMine
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.chain_reaction_mine = {
    id: 'chain_reaction_mine',
    name: 'Chain Reaction Mine',
    description: 'When one mine detonates, it triggers all nearby mines in a chain reaction',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 30,
    cooldown: 3.0,
    range: 260,
    triggerRadius: 35,
    explosionRadius: 50,
    duration: 25.0,
    maxMines: 5,

    color: '#FF0000',
    icon: 'chain_reaction_mine',
    imageId: 'weapon_chain_reaction_mine',

    chainReaction: {
      enabled: true,
      triggerRadius: 100,
      chainDelay: 0.1,
      damageMultiplierPerChain: 1.1,
    },

    mineVisual: {
      type: 'linked',
      coreColor: '#CC0000',
      linkColor: '#FF4444',
      connectionLines: true,
      blinkSync: true,
    },

    particles: {
      enabled: true,
      type: 'chain_sparks',
      colors: ['#FF0000', '#FF4400', '#FF8800'],
      count: 10,
      spread: 50,
      lifetime: 0.3,
    },

    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.5,
      color: '#FF0000',
      pulse: true,
    },

    screenShake: {
      enabled: true,
      intensity: 3,
      duration: 0.15,
      additive: true,
    },

    upgrades: {
      2: { damage: 39, chainReaction: { triggerRadius: 120 }, maxMines: 6 },
      3: { damage: 51, cooldown: 2.7, explosionRadius: 60 },
      4: { damage: 66, chainReaction: { damageMultiplierPerChain: 1.15 }, maxMines: 7 },
      5: { damage: 86, cooldown: 2.4, chainReaction: { triggerRadius: 150 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
