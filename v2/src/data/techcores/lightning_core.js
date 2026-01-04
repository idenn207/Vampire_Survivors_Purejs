/**
 * @fileoverview Lightning Core - Chain Attack Specialist
 * @module Data/TechCores/LightningCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var ProcId = Data.ProcId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.lightning_core = {
    id: 'lightning_core',
    name: 'Storm Core',
    theme: 'lightning',
    description: 'Harness electrical power. Attacks chain between enemies.',
    color: '#FFD700',
    icon: 'bolt',
    imageId: 'tech_lightning_core',
    startingWeapon: 'thunder_strike',

    tree: {
      base: {
        id: 'lightning_base',
        name: 'Storm Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [
          { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.CHAIN_ATTACK, valuePerLevel: 0.5 },
        ],
      },

      depth1: [
        {
          id: 'lightning_d1_arc',
          name: 'Arc Conductor',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.RANGE, valuePerLevel: 0.05 }],
        },
        {
          id: 'lightning_d1_surge',
          name: 'Power Surge',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.03 }],
        },
        {
          id: 'lightning_d1_static',
          name: 'Static Field',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [
            { type: EffectType.PASSIVE_PROC, procType: ProcId.LIGHTNING_STRIKE, valuePerLevel: 0.04 },
          ],
        },
      ],

      depth2: [
        {
          id: 'lightning_d2_overload',
          name: 'Overload',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['lightning_d1_surge'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_DAMAGE, valuePerLevel: 0.15 }],
        },
        {
          id: 'lightning_d2_tempest',
          name: 'Tempest',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['lightning_d1_arc', 'lightning_d1_static'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.08 },
            { type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.1 },
          ],
        },
        {
          id: 'lightning_d2_discharge',
          name: 'Discharge',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['lightning_d1_static'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.PASSIVE_PROC, procType: ProcId.LIGHTNING_STRIKE, valuePerLevel: 0.05 },
          ],
        },
      ],

      depth3: [
        {
          id: 'lightning_d3_thunderlord',
          name: 'Thunderlord',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['lightning_d2_overload'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
            { type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.1 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
