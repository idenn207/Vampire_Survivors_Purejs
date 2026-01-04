/**
 * @fileoverview Arcane Core - Versatile Magic Specialist
 * @module Data/TechCores/ArcaneCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.arcane_core = {
    id: 'arcane_core',
    name: 'Arcane Core',
    theme: 'arcane',
    description: 'Master of pure magic. Versatile spells and enhanced cooldowns.',
    color: '#9932CC',
    icon: 'star',
    imageId: 'tech_arcane_core',
    startingWeapon: 'arcane_barrage',

    tree: {
      base: {
        id: 'arcane_base',
        name: 'Arcane Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [
          { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.015 },
        ],
      },

      depth1: [
        {
          id: 'arcane_d1_focus',
          name: 'Arcane Focus',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.025 }],
        },
        {
          id: 'arcane_d1_efficiency',
          name: 'Mana Efficiency',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.025 },
          ],
        },
        {
          id: 'arcane_d1_barrier',
          name: 'Arcane Barrier',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SHIELD_ON_KILL, valuePerLevel: 1 },
          ],
        },
      ],

      depth2: [
        {
          id: 'arcane_d2_amplify',
          name: 'Spell Amplification',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['arcane_d1_focus'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.1 }],
        },
        {
          id: 'arcane_d2_mastery',
          name: 'Arcane Mastery',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['arcane_d1_focus', 'arcane_d1_efficiency'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.08 },
            { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'arcane_d2_ward',
          name: 'Arcane Ward',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['arcane_d1_barrier'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.03 }],
        },
      ],

      depth3: [
        {
          id: 'arcane_d3_archmage',
          name: 'Archmage',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['arcane_d2_mastery'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.15 },
            { type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 1 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
