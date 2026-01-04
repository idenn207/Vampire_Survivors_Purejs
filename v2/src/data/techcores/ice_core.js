/**
 * @fileoverview Ice Core - Slow/Freeze Specialist
 * @module Data/TechCores/IceCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var ProcId = Data.ProcId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.ice_core = {
    id: 'ice_core',
    name: 'Frost Core',
    theme: 'ice',
    description: 'Control the battlefield with freezing attacks. Slow and shatter enemies.',
    color: '#00BFFF',
    icon: 'snowflake',
    imageId: 'tech_ice_core',
    startingWeapon: 'frost_shard',

    tree: {
      base: {
        id: 'ice_base',
        name: 'Frost Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [
          { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SLOW_ON_HIT, valuePerLevel: 0.03 },
        ],
      },

      depth1: [
        {
          id: 'ice_d1_chill',
          name: 'Deep Chill',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.FREEZE_CHANCE, valuePerLevel: 0.02 },
          ],
        },
        {
          id: 'ice_d1_shatter',
          name: 'Ice Shatter',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.ICE_SHATTER, valuePerLevel: 0.1 }],
        },
        {
          id: 'ice_d1_armor',
          name: 'Frozen Armor',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 2 }],
        },
      ],

      depth2: [
        {
          id: 'ice_d2_blizzard',
          name: 'Blizzard',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['ice_d1_chill'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.12 }],
        },
        {
          id: 'ice_d2_absolute',
          name: 'Absolute Zero',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['ice_d1_chill', 'ice_d1_shatter'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.FREEZE_CHANCE, valuePerLevel: 0.05 },
            { type: EffectType.STAT_BONUS, stat: StatId.CRIT_DAMAGE, valuePerLevel: 0.2 },
          ],
        },
        {
          id: 'ice_d2_glacier',
          name: 'Glacial Barrier',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['ice_d1_armor'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.03 },
          ],
        },
      ],

      depth3: [
        {
          id: 'ice_d3_permafrost',
          name: 'Permafrost',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['ice_d2_absolute'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.FREEZE_CHANCE, valuePerLevel: 0.1 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
