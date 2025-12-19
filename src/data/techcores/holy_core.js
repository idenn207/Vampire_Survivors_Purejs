/**
 * @fileoverview Holy Core - Healing/Aura Specialist
 * @module Data/TechCores/HolyCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var ProcId = Data.ProcId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.holy_core = {
    id: 'holy_core',
    name: 'Holy Core',
    theme: 'holy',
    description: 'Channel divine light. Heal yourself and smite enemies.',
    color: '#FFD700',
    icon: 'sun',
    imageId: 'tech_holy_core',
    startingWeapon: 'holy_lance',

    tree: {
      base: {
        id: 'holy_base',
        name: 'Holy Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [
          { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.6 },
        ],
      },

      depth1: [
        {
          id: 'holy_d1_blessing',
          name: 'Divine Blessing',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.8 },
          ],
        },
        {
          id: 'holy_d1_smite',
          name: 'Holy Smite',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.HOLY_SMITE, valuePerLevel: 0.06 }],
        },
        {
          id: 'holy_d1_sanctify',
          name: 'Sanctify',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.025 }],
        },
      ],

      depth2: [
        {
          id: 'holy_d2_radiance',
          name: 'Divine Radiance',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['holy_d1_smite'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.08 },
            { type: EffectType.PASSIVE_PROC, procType: ProcId.HOLY_SMITE, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'holy_d2_grace',
          name: 'Divine Grace',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['holy_d1_blessing', 'holy_d1_sanctify'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 2 },
            { type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.08 },
          ],
        },
        {
          id: 'holy_d2_aura',
          name: 'Holy Aura',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['holy_d1_sanctify'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.06 }],
        },
      ],

      depth3: [
        {
          id: 'holy_d3_avatar',
          name: 'Divine Avatar',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['holy_d2_grace'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 4 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
