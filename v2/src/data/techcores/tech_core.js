/**
 * @fileoverview Tech Core - Projectile/Multi-shot Specialist
 * @module Data/TechCores/TechCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var ProcId = Data.ProcId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.tech_core = {
    id: 'tech_core',
    name: 'Tech Core',
    theme: 'tech',
    description: 'Advanced technology. Multiple projectiles and ricochets.',
    color: '#00CED1',
    icon: 'gear',
    imageId: 'tech_tech_core',
    startingWeapon: 'tech_turret',

    tree: {
      base: {
        id: 'tech_base',
        name: 'Tech Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [{ type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 0.2 }],
      },

      depth1: [
        {
          id: 'tech_d1_multishot',
          name: 'Multi-Shot',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 0.3 }],
        },
        {
          id: 'tech_d1_ricochet',
          name: 'Ricochet',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.RICOCHET, valuePerLevel: 0.08 }],
        },
        {
          id: 'tech_d1_overclock',
          name: 'Overclock',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.025 }],
        },
      ],

      depth2: [
        {
          id: 'tech_d2_barrage',
          name: 'Bullet Barrage',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['tech_d1_multishot'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 0.5 },
            { type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_SPEED, valuePerLevel: 0.1 },
          ],
        },
        {
          id: 'tech_d2_overdrive',
          name: 'Overdrive',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['tech_d1_multishot', 'tech_d1_overclock'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.08 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.06 },
          ],
        },
        {
          id: 'tech_d2_bounce',
          name: 'Bounce Tech',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['tech_d1_ricochet'],
          requiresMultiple: false,
          effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.RICOCHET, valuePerLevel: 0.1 }],
        },
      ],

      depth3: [
        {
          id: 'tech_d3_arsenal',
          name: 'Walking Arsenal',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['tech_d2_overdrive'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 1 },
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
