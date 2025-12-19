/**
 * @fileoverview Constellation Arrow - Rare projectile that leaves damaging star patterns
 * @module Data/Weapons/Rare/ConstellationArrow
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.constellation_arrow = {
    id: 'constellation_arrow',
    name: 'Constellation Arrow',
    description: 'Arrows leave a trail of damaging stars connected by ethereal lines',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.RARE,

    // Tier properties
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Base stats
    damage: 45,
    cooldown: 1.2,
    projectileCount: 1,
    projectileSpeed: 350,
    range: 500,
    pierce: 3,
    spread: 0,

    // Visual
    color: '#FFFFFF',
    secondaryColor: '#6699FF',
    size: 10,
    shape: 'arrow',
    lifetime: 3.0,
    icon: 'constellation',
    imageId: 'weapon_constellation_arrow',

    // Trail effect - leaves stars along path
    trail: {
      enabled: true,
      type: 'star_pattern',
      color: '#AACCFF',
      starInterval: 50, // pixels between stars
      starSize: 6,
      starDamage: 10,
      starDuration: 3.0,
      connectLines: true, // Draw constellation lines between stars
      lineColor: '#6699FF',
      lineAlpha: 0.4,
    },

    // Glow effect
    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.6,
      color: '#AACCFF',
      pulse: true,
      pulseSpeed: 2,
    },

    // Particle effects
    particles: {
      enabled: true,
      type: 'sparkle',
      color: '#FFFFFF',
      count: 3,
      spread: 8,
      lifetime: 0.4,
    },

    upgrades: {
      2: { damage: 55, starDamage: 15, pierce: 4 },
      3: { damage: 70, projectileCount: 2, starInterval: 40 },
      4: { damage: 88, starDamage: 22, starDuration: 4.0, cooldown: 1.0 },
      5: { damage: 110, projectileCount: 3, pierce: 5, starDamage: 30 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
