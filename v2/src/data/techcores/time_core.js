/**
 * @fileoverview Time Core - Cooldown/Slow Specialist
 * @module Data/TechCores/TimeCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.time_core = {
    id: 'time_core',
    name: 'Time Core',
    theme: 'time',
    description: 'Manipulate time itself. Reduce cooldowns and slow enemies.',
    color: '#DDA0DD',
    icon: 'clock',
    imageId: 'tech_time_core',
    startingWeapon: 'chrono_beam',

    tree: {
      base: {
        id: 'time_base',
        name: 'Time Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [
          { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.015 },
        ],
      },

      depth1: [
        {
          id: 'time_d1_haste',
          name: 'Temporal Haste',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.02 },
          ],
        },
        {
          id: 'time_d1_slow',
          name: 'Time Dilation',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.TIME_SLOW_AURA, valuePerLevel: 0.04 },
          ],
        },
        {
          id: 'time_d1_rewind',
          name: 'Minor Rewind',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.5 },
          ],
        },
      ],

      depth2: [
        {
          id: 'time_d2_stop',
          name: 'Time Stop',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['time_d1_slow'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.TIME_SLOW_AURA, valuePerLevel: 0.08 },
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.FREEZE_CHANCE, valuePerLevel: 0.02 },
          ],
        },
        {
          id: 'time_d2_accelerate',
          name: 'Accelerate',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['time_d1_haste', 'time_d1_slow'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.08 },
            { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.05 },
          ],
        },
        {
          id: 'time_d2_echo',
          name: 'Temporal Echo',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['time_d1_rewind'],
          requiresMultiple: false,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DURATION, valuePerLevel: 0.08 }],
        },
      ],

      depth3: [
        {
          id: 'time_d3_lord',
          name: 'Time Lord',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['time_d2_accelerate'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.1 },
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.1 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
