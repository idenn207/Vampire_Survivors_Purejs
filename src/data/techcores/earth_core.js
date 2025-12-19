/**
 * @fileoverview Earth Core - Stun/Area Specialist
 * @module Data/TechCores/EarthCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.earth_core = {
    id: 'earth_core',
    name: 'Earth Core',
    theme: 'earth',
    description: 'Command the earth itself. Powerful area attacks and stuns.',
    color: '#8B4513',
    icon: 'mountain',
    imageId: 'tech_earth_core',
    startingWeapon: 'earth_spike',

    tree: {
      base: {
        id: 'earth_base',
        name: 'Earth Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.03 }],
      },

      depth1: [
        {
          id: 'earth_d1_tremor',
          name: 'Tremor',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.04 }],
        },
        {
          id: 'earth_d1_stone',
          name: 'Stone Skin',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 4 }],
        },
        {
          id: 'earth_d1_weight',
          name: 'Crushing Weight',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.02 }],
        },
      ],

      depth2: [
        {
          id: 'earth_d2_quake',
          name: 'Earthquake',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['earth_d1_tremor'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.12 },
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SLOW_ON_HIT, valuePerLevel: 0.04 },
          ],
        },
        {
          id: 'earth_d2_monolith',
          name: 'Monolith',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['earth_d1_stone', 'earth_d1_weight'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.08 },
            { type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 8 },
          ],
        },
        {
          id: 'earth_d2_fortress',
          name: 'Earth Fortress',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['earth_d1_stone'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.03 }],
        },
      ],

      depth3: [
        {
          id: 'earth_d3_titan',
          name: 'Earth Titan',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['earth_d2_quake'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.2 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
