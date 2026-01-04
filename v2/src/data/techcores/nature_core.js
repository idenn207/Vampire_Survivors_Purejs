/**
 * @fileoverview Nature Core - Regen/Summon Specialist
 * @module Data/TechCores/NatureCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.nature_core = {
    id: 'nature_core',
    name: 'Nature Core',
    theme: 'nature',
    description: 'Harness nature\'s power. Regenerate and summon plant allies.',
    color: '#228B22',
    icon: 'leaf',
    imageId: 'tech_nature_core',
    startingWeapon: 'venom_spore',

    tree: {
      base: {
        id: 'nature_base',
        name: 'Nature Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [
          { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.5 },
        ],
      },

      depth1: [
        {
          id: 'nature_d1_growth',
          name: 'Rapid Growth',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.8 },
          ],
        },
        {
          id: 'nature_d1_thorns',
          name: 'Thorn Armor',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.DAMAGE_REFLECT, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'nature_d1_bloom',
          name: 'Blooming Life',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.025 }],
        },
      ],

      depth2: [
        {
          id: 'nature_d2_entangle',
          name: 'Entangling Roots',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['nature_d1_thorns'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SLOW_ON_HIT, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'nature_d2_overgrowth',
          name: 'Overgrowth',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['nature_d1_growth', 'nature_d1_bloom'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 2 },
            { type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.1 },
          ],
        },
        {
          id: 'nature_d2_summon',
          name: 'Nature\'s Call',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['nature_d1_bloom'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SUMMON_MINION, valuePerLevel: 1 },
          ],
        },
      ],

      depth3: [
        {
          id: 'nature_d3_avatar',
          name: 'Nature\'s Avatar',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['nature_d2_overgrowth'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.15 },
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 3 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
