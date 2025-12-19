/**
 * @fileoverview Blood Core - Lifesteal Specialist
 * @module Data/TechCores/BloodCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var ProcId = Data.ProcId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.blood_core = {
    id: 'blood_core',
    name: 'Blood Core',
    theme: 'blood',
    description: 'Drain life from enemies. Sacrifice health for power.',
    color: '#8B0000',
    icon: 'droplet',
    imageId: 'tech_blood_core',
    startingWeapon: 'blood_scythe',

    tree: {
      base: {
        id: 'blood_base',
        name: 'Blood Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [
          { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.LIFESTEAL, valuePerLevel: 0.01 },
        ],
      },

      depth1: [
        {
          id: 'blood_d1_drain',
          name: 'Life Drain',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.LIFESTEAL, valuePerLevel: 0.015 },
          ],
        },
        {
          id: 'blood_d1_sacrifice',
          name: 'Blood Sacrifice',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [
            {
              type: EffectType.UNIQUE_MECHANIC,
              mechanic: MechanicId.DAMAGE_SCALES_WITH_MISSING_HP,
              valuePerLevel: 0.1,
            },
          ],
        },
        {
          id: 'blood_d1_vitality',
          name: 'Crimson Vitality',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.03 }],
        },
      ],

      depth2: [
        {
          id: 'blood_d2_hemorrhage',
          name: 'Hemorrhage',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['blood_d1_drain'],
          requiresMultiple: false,
          effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.BLEED_ON_HIT, valuePerLevel: 0.1 }],
        },
        {
          id: 'blood_d2_covenant',
          name: 'Blood Covenant',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['blood_d1_sacrifice', 'blood_d1_vitality'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
            { type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.08 },
          ],
        },
        {
          id: 'blood_d2_pool',
          name: 'Blood Pool',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['blood_d1_vitality'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 1 },
          ],
        },
      ],

      depth3: [
        {
          id: 'blood_d3_vampire',
          name: 'Vampire Lord',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['blood_d2_hemorrhage'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.LIFESTEAL, valuePerLevel: 0.05 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
