/**
 * @fileoverview Shadow Core - Stealth/Crit Specialist
 * @module Data/TechCores/ShadowCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.shadow_core = {
    id: 'shadow_core',
    name: 'Shadow Core',
    theme: 'shadow',
    description: 'Strike from darkness. High critical damage and evasion.',
    color: '#4B0082',
    icon: 'moon',
    imageId: 'tech_shadow_core',
    startingWeapon: 'shadow_blade',

    tree: {
      base: {
        id: 'shadow_base',
        name: 'Shadow Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_DAMAGE, valuePerLevel: 0.05 }],
      },

      depth1: [
        {
          id: 'shadow_d1_stealth',
          name: 'Cloak of Shadows',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [{ type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.EVASION, valuePerLevel: 0.02 }],
        },
        {
          id: 'shadow_d1_backstab',
          name: 'Backstab',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.04 }],
        },
        {
          id: 'shadow_d1_veil',
          name: 'Dark Veil',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.02 }],
        },
      ],

      depth2: [
        {
          id: 'shadow_d2_assassin',
          name: 'Assassinate',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['shadow_d1_backstab'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.EXECUTE_THRESHOLD, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'shadow_d2_phantom',
          name: 'Phantom Strike',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['shadow_d1_stealth', 'shadow_d1_backstab'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.CRIT_DAMAGE, valuePerLevel: 0.25 },
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'shadow_d2_fade',
          name: 'Fade Away',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['shadow_d1_stealth'],
          requiresMultiple: false,
          effects: [{ type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.EVASION, valuePerLevel: 0.03 }],
        },
      ],

      depth3: [
        {
          id: 'shadow_d3_nightblade',
          name: 'Nightblade',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['shadow_d2_assassin'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
            { type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.08 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
