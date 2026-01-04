/**
 * @fileoverview Steel Core - Defense/Reflect Specialist
 * @module Data/TechCores/SteelCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.steel_core = {
    id: 'steel_core',
    name: 'Steel Core',
    theme: 'steel',
    description: 'Become an impenetrable fortress. High armor and damage reflection.',
    color: '#708090',
    icon: 'shield',
    imageId: 'tech_steel_core',
    startingWeapon: 'steel_hammer',

    tree: {
      base: {
        id: 'steel_base',
        name: 'Steel Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 3 }],
      },

      depth1: [
        {
          id: 'steel_d1_fortify',
          name: 'Fortify',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.02 }],
        },
        {
          id: 'steel_d1_reflect',
          name: 'Steel Reflect',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.DAMAGE_REFLECT, valuePerLevel: 0.08 },
          ],
        },
        {
          id: 'steel_d1_endurance',
          name: 'Iron Endurance',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.03 }],
        },
      ],

      depth2: [
        {
          id: 'steel_d2_counter',
          name: 'Counter Strike',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['steel_d1_reflect'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.06 },
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.DAMAGE_REFLECT, valuePerLevel: 0.1 },
          ],
        },
        {
          id: 'steel_d2_bulwark',
          name: 'Bulwark',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['steel_d1_fortify', 'steel_d1_endurance'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 10 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'steel_d2_rampart',
          name: 'Living Rampart',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['steel_d1_endurance'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.05 }],
        },
      ],

      depth3: [
        {
          id: 'steel_d3_juggernaut',
          name: 'Juggernaut',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['steel_d2_bulwark'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 20 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
