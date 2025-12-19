/**
 * @fileoverview Fire Core - Burn DoT Specialist
 * @module Data/TechCores/FireCore
 */
(function (Data) {
  'use strict';

  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var ProcId = Data.ProcId;
  var Costs = Data.TechCoreCosts;

  Data.TechCoreRegistry.fire_core = {
    id: 'fire_core',
    name: 'Flame Core',
    theme: 'fire',
    description: 'Master of burning damage over time. Enemies ignite and spread flames.',
    color: '#FF4500',
    icon: 'flame',
    imageId: 'tech_fire_core',
    startingWeapon: 'inferno_bolt',

    tree: {
      base: {
        id: 'fire_base',
        name: 'Flame Mastery',
        maxLevel: 10,
        costPerLevel: Costs.BASE_COSTS,
        effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.02 }],
      },

      depth1: [
        {
          id: 'fire_d1_intensity',
          name: 'Burning Intensity',
          maxLevel: 7,
          costPerLevel: Costs.D1_COSTS_7,
          requires: [],
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.BURN_DAMAGE, valuePerLevel: 3 },
          ],
        },
        {
          id: 'fire_d1_spread',
          name: 'Fire Spread',
          maxLevel: 5,
          costPerLevel: Costs.D1_COSTS_5,
          requires: [],
          effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.FIRE_SPREAD, valuePerLevel: 0.08 }],
        },
        {
          id: 'fire_d1_resist',
          name: 'Heat Shield',
          maxLevel: 10,
          costPerLevel: Costs.D1_COSTS_10,
          requires: [],
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.025 },
          ],
        },
      ],

      depth2: [
        {
          id: 'fire_d2_inferno',
          name: 'Inferno',
          maxLevel: 4,
          costPerLevel: Costs.D2_COSTS_4,
          requires: ['fire_d1_intensity'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.1 },
            { type: EffectType.PASSIVE_PROC, procType: ProcId.EXPLOSION_ON_KILL, valuePerLevel: 0.1 },
          ],
        },
        {
          id: 'fire_d2_phoenix',
          name: 'Phoenix Rising',
          maxLevel: 3,
          costPerLevel: Costs.D2_COSTS_3,
          requires: ['fire_d1_intensity', 'fire_d1_resist'],
          requiresMultiple: true,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.PHOENIX_REVIVE, valuePerLevel: 0.33 },
          ],
        },
        {
          id: 'fire_d2_wildfire',
          name: 'Wildfire',
          maxLevel: 5,
          costPerLevel: Costs.D2_COSTS_5,
          requires: ['fire_d1_spread'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.04 },
          ],
        },
      ],

      depth3: [
        {
          id: 'fire_d3_avatar',
          name: 'Avatar of Flame',
          maxLevel: 2,
          costPerLevel: Costs.D3_COSTS_2,
          requires: ['fire_d2_inferno'],
          requiresMultiple: false,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.15 },
            { type: EffectType.PASSIVE_PROC, procType: ProcId.EXPLOSION_ON_CRIT, valuePerLevel: 0.25 },
          ],
        },
      ],
    },
  };
})(window.VampireSurvivors.Data);
