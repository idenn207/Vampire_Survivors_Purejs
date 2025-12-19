/**
 * @fileoverview Beast Core - Attack Speed/Frenzy Specialist
 * @module Data/TechCores/BeastCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.beast_core = {
    id: 'beast_core',
    name: 'Beast Core',
    theme: 'beast',
    description: 'Unleash primal fury. Stack frenzy for massive attack speed.',
    color: '#FF6347',
    icon: 'paw',
    imageId: 'tech_beast_core',
    startingWeapon: 'beast_claw',

    tree: {
      base: {
        id: 'beast_base',
        name: 'Beast Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.03 }],
      },

      depth1: [
        {
          id: 'beast_d1_frenzy',
          name: 'Frenzy',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.04 }],
        },
        {
          id: 'beast_d1_savage',
          name: 'Savage Strikes',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.03 }],
        },
        {
          id: 'beast_d1_wild',
          name: 'Wild Instinct',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.02 }],
        },
      ],

      depth2: [
        {
          id: 'beast_d2_rampage',
          name: 'Rampage',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['beast_d1_frenzy'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.08 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'beast_d2_predator',
          name: 'Apex Predator',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['beast_d1_frenzy', 'beast_d1_savage'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.06 },
            { type: EffectType.STAT_BONUS, stat: StatId.CRIT_DAMAGE, valuePerLevel: 0.15 },
          ],
        },
        {
          id: 'beast_d2_pack',
          name: 'Pack Hunter',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['beast_d1_wild'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SUMMON_MINION, valuePerLevel: 0.5 },
          ],
        },
      ],

      depth3: [
        {
          id: 'beast_d3_alpha',
          name: 'Alpha Beast',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['beast_d2_predator'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.15 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
