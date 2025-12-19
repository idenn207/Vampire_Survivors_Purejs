/**
 * @fileoverview Void Core - Debuff/Curse Specialist
 * @module Data/TechCores/VoidCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var ProcId = Data.ProcId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.void_core = {
    id: 'void_core',
    name: 'Void Core',
    theme: 'void',
    description: 'Tap into the void. Weaken enemies with curses and debuffs.',
    color: '#2F0032',
    icon: 'void',
    imageId: 'tech_void_core',
    startingWeapon: 'void_rift',

    tree: {
      base: {
        id: 'void_base',
        name: 'Void Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [
          { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.WEAKNESS_DEBUFF, valuePerLevel: 0.01 },
        ],
      },

      depth1: [
        {
          id: 'void_d1_curse',
          name: 'Void Curse',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.WEAKNESS_DEBUFF, valuePerLevel: 0.015 },
          ],
        },
        {
          id: 'void_d1_entropy',
          name: 'Entropy',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.PIERCE, valuePerLevel: 1 }],
        },
        {
          id: 'void_d1_nihil',
          name: 'Nihilism',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.02 }],
        },
      ],

      depth2: [
        {
          id: 'void_d2_rift',
          name: 'Void Rift',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['void_d1_curse'],
          requiresMultiple: false,
          effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.VOID_RIFT, valuePerLevel: 0.08 }],
        },
        {
          id: 'void_d2_oblivion',
          name: 'Oblivion',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['void_d1_curse', 'void_d1_nihil'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.WEAKNESS_DEBUFF, valuePerLevel: 0.05 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
          ],
        },
        {
          id: 'void_d2_devour',
          name: 'Void Devour',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['void_d1_entropy'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.PIERCE, valuePerLevel: 1 }],
        },
      ],

      depth3: [
        {
          id: 'void_d3_abyss',
          name: 'Abyssal Lord',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['void_d2_oblivion'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.WEAKNESS_DEBUFF, valuePerLevel: 0.1 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.15 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
