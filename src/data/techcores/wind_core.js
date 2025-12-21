/**
 * @fileoverview Wind Core - Speed/Evasion Specialist
 * @module Data/TechCores/WindCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.wind_core = {
    id: 'wind_core',
    name: 'Wind Core',
    theme: 'wind',
    description: 'Swift as the wind. High movement speed and evasion.',
    color: '#87CEEB',
    icon: 'wind',
    imageId: 'tech_wind_core',
    startingWeapon: 'wind_cutter_core',

    tree: {
      base: {
        id: 'wind_base',
        name: 'Wind Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.025 }],
      },

      depth1: [
        {
          id: 'wind_d1_gust',
          name: 'Tailwind',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.03 }],
        },
        {
          id: 'wind_d1_dodge',
          name: 'Wind Dodge',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.EVASION, valuePerLevel: 0.03 }],
        },
        {
          id: 'wind_d1_swift',
          name: 'Swift Strikes',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.025 }],
        },
      ],

      depth2: [
        {
          id: 'wind_d2_tornado',
          name: 'Tornado',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['wind_d1_gust'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.1 }],
        },
        {
          id: 'wind_d2_velocity',
          name: 'Velocity',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['wind_d1_gust', 'wind_d1_swift'],
          requiresMultiple: true,
          effects: [
            {
              type: EffectType.UNIQUE_MECHANIC,
              mechanic: MechanicId.DAMAGE_SCALES_WITH_SPEED,
              valuePerLevel: 0.15,
            },
          ],
        },
        {
          id: 'wind_d2_mirage',
          name: 'Wind Mirage',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['wind_d1_dodge'],
          requiresMultiple: false,
          effects: [{ type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.EVASION, valuePerLevel: 0.04 }],
        },
      ],

      depth3: [
        {
          id: 'wind_d3_hurricane',
          name: 'Hurricane',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['wind_d2_velocity'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.1 },
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.1 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
