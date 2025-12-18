/**
 * @fileoverview Tech Core data definitions - 15 unique cores with tech trees
 * @module Data/TechCoreData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Import Effect Constants
  // ============================================
  var EffectType = Data.EffectType;
  var StatId = Data.StatId;
  var MechanicId = Data.MechanicId;
  var ProcId = Data.ProcId;

  // ============================================
  // Cost Generation Helpers
  // ============================================

  /**
   * Generate cost array for a tech
   * @param {number} baseCost - Starting cost
   * @param {number} levels - Number of levels
   * @param {number} multiplier - Cost growth multiplier
   * @returns {Array<number>}
   */
  function generateCosts(baseCost, levels, multiplier) {
    var costs = [];
    var cost = baseCost;
    for (var i = 0; i < levels; i++) {
      costs.push(Math.floor(cost));
      cost *= multiplier;
    }
    return costs;
  }

  // Base core: 10 levels, total ~3000 gold (waves 20-30)
  var BASE_COSTS = generateCosts(50, 10, 1.45);
  // Depth 1: 5-10 levels, varies
  var D1_COSTS_5 = generateCosts(80, 5, 1.4);
  var D1_COSTS_7 = generateCosts(60, 7, 1.35);
  var D1_COSTS_10 = generateCosts(40, 10, 1.3);
  // Depth 2: 3-5 levels
  var D2_COSTS_3 = generateCosts(150, 3, 1.5);
  var D2_COSTS_4 = generateCosts(120, 4, 1.45);
  var D2_COSTS_5 = generateCosts(100, 5, 1.4);
  // Depth 3: 1-2 levels, total ~2500-4000 gold (waves 20-30)
  var D3_COSTS_1 = [1500];
  var D3_COSTS_2 = [1200, 1800];

  // ============================================
  // Core Definitions
  // ============================================
  var CORES = {
    // ========================================
    // 1. FIRE CORE - Burn DoT Specialist
    // ========================================
    fire_core: {
      id: 'fire_core',
      name: 'Flame Core',
      theme: 'fire',
      description: 'Master of burning damage over time. Enemies ignite and spread flames.',
      color: '#FF4500',
      icon: 'flame',
      startingWeapon: 'flame_bolt',

      tree: {
        base: {
          id: 'fire_base',
          name: 'Flame Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.02 }],
        },

        depth1: [
          {
            id: 'fire_d1_intensity',
            name: 'Burning Intensity',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.BURN_DAMAGE, valuePerLevel: 3 },
            ],
          },
          {
            id: 'fire_d1_spread',
            name: 'Fire Spread',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.FIRE_SPREAD, valuePerLevel: 0.08 }],
          },
          {
            id: 'fire_d1_resist',
            name: 'Heat Shield',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
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
            costPerLevel: D2_COSTS_4,
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
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['fire_d2_inferno'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.15 },
              { type: EffectType.PASSIVE_PROC, procType: ProcId.EXPLOSION_ON_CRIT, valuePerLevel: 0.25 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 2. ICE CORE - Slow/Freeze Specialist
    // ========================================
    ice_core: {
      id: 'ice_core',
      name: 'Frost Core',
      theme: 'ice',
      description: 'Control the battlefield with freezing attacks. Slow and shatter enemies.',
      color: '#00BFFF',
      icon: 'snowflake',
      startingWeapon: 'frost_shard',

      tree: {
        base: {
          id: 'ice_base',
          name: 'Frost Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SLOW_ON_HIT, valuePerLevel: 0.03 },
          ],
        },

        depth1: [
          {
            id: 'ice_d1_chill',
            name: 'Deep Chill',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.FREEZE_CHANCE, valuePerLevel: 0.02 },
            ],
          },
          {
            id: 'ice_d1_shatter',
            name: 'Ice Shatter',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.ICE_SHATTER, valuePerLevel: 0.1 }],
          },
          {
            id: 'ice_d1_armor',
            name: 'Frozen Armor',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 2 }],
          },
        ],

        depth2: [
          {
            id: 'ice_d2_blizzard',
            name: 'Blizzard',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
            requires: ['ice_d1_chill'],
            requiresMultiple: false,
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.12 }],
          },
          {
            id: 'ice_d2_absolute',
            name: 'Absolute Zero',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['ice_d2_absolute'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.FREEZE_CHANCE, valuePerLevel: 0.1 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 3. LIGHTNING CORE - Chain Attack Specialist
    // ========================================
    lightning_core: {
      id: 'lightning_core',
      name: 'Storm Core',
      theme: 'lightning',
      description: 'Harness electrical power. Attacks chain between enemies.',
      color: '#FFD700',
      icon: 'bolt',
      startingWeapon: 'spark_bolt',

      tree: {
        base: {
          id: 'lightning_base',
          name: 'Storm Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.CHAIN_ATTACK, valuePerLevel: 0.5 },
          ],
        },

        depth1: [
          {
            id: 'lightning_d1_arc',
            name: 'Arc Conductor',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.RANGE, valuePerLevel: 0.05 }],
          },
          {
            id: 'lightning_d1_surge',
            name: 'Power Surge',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.03 }],
          },
          {
            id: 'lightning_d1_static',
            name: 'Static Field',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
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
            costPerLevel: D2_COSTS_4,
            requires: ['lightning_d1_surge'],
            requiresMultiple: false,
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_DAMAGE, valuePerLevel: 0.15 }],
          },
          {
            id: 'lightning_d2_tempest',
            name: 'Tempest',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['lightning_d2_overload'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
              { type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.1 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 4. SHADOW CORE - Stealth/Crit Specialist
    // ========================================
    shadow_core: {
      id: 'shadow_core',
      name: 'Shadow Core',
      theme: 'shadow',
      description: 'Strike from darkness. High critical damage and evasion.',
      color: '#4B0082',
      icon: 'moon',
      startingWeapon: 'shadow_knife',

      tree: {
        base: {
          id: 'shadow_base',
          name: 'Shadow Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_DAMAGE, valuePerLevel: 0.05 }],
        },

        depth1: [
          {
            id: 'shadow_d1_stealth',
            name: 'Cloak of Shadows',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [{ type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.EVASION, valuePerLevel: 0.02 }],
          },
          {
            id: 'shadow_d1_backstab',
            name: 'Backstab',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.04 }],
          },
          {
            id: 'shadow_d1_veil',
            name: 'Dark Veil',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.02 }],
          },
        ],

        depth2: [
          {
            id: 'shadow_d2_assassin',
            name: 'Assassinate',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
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
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['shadow_d2_assassin'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
              { type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.08 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 5. BLOOD CORE - Lifesteal Specialist
    // ========================================
    blood_core: {
      id: 'blood_core',
      name: 'Blood Core',
      theme: 'blood',
      description: 'Drain life from enemies. Sacrifice health for power.',
      color: '#8B0000',
      icon: 'droplet',
      startingWeapon: 'blood_lance',

      tree: {
        base: {
          id: 'blood_base',
          name: 'Blood Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.LIFESTEAL, valuePerLevel: 0.01 },
          ],
        },

        depth1: [
          {
            id: 'blood_d1_drain',
            name: 'Life Drain',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.LIFESTEAL, valuePerLevel: 0.015 },
            ],
          },
          {
            id: 'blood_d1_sacrifice',
            name: 'Blood Sacrifice',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
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
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.03 }],
          },
        ],

        depth2: [
          {
            id: 'blood_d2_hemorrhage',
            name: 'Hemorrhage',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
            requires: ['blood_d1_drain'],
            requiresMultiple: false,
            effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.BLEED_ON_HIT, valuePerLevel: 0.1 }],
          },
          {
            id: 'blood_d2_covenant',
            name: 'Blood Covenant',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['blood_d2_hemorrhage'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.LIFESTEAL, valuePerLevel: 0.05 },
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 6. ARCANE CORE - Versatile Magic Specialist
    // ========================================
    arcane_core: {
      id: 'arcane_core',
      name: 'Arcane Core',
      theme: 'arcane',
      description: 'Master of pure magic. Versatile spells and enhanced cooldowns.',
      color: '#9932CC',
      icon: 'star',
      startingWeapon: 'arcane_bolt',

      tree: {
        base: {
          id: 'arcane_base',
          name: 'Arcane Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.015 },
          ],
        },

        depth1: [
          {
            id: 'arcane_d1_focus',
            name: 'Arcane Focus',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.025 }],
          },
          {
            id: 'arcane_d1_efficiency',
            name: 'Mana Efficiency',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.025 },
            ],
          },
          {
            id: 'arcane_d1_barrier',
            name: 'Arcane Barrier',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SHIELD_ON_KILL, valuePerLevel: 1 },
            ],
          },
        ],

        depth2: [
          {
            id: 'arcane_d2_amplify',
            name: 'Spell Amplification',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
            requires: ['arcane_d1_focus'],
            requiresMultiple: false,
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.1 }],
          },
          {
            id: 'arcane_d2_mastery',
            name: 'Arcane Mastery',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
            requires: ['arcane_d1_focus', 'arcane_d1_efficiency'],
            requiresMultiple: true,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.08 },
              { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.05 },
            ],
          },
          {
            id: 'arcane_d2_ward',
            name: 'Arcane Ward',
            maxLevel: 5,
            costPerLevel: D2_COSTS_5,
            requires: ['arcane_d1_barrier'],
            requiresMultiple: false,
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.03 }],
          },
        ],

        depth3: [
          {
            id: 'arcane_d3_archmage',
            name: 'Archmage',
            maxLevel: 2,
            costPerLevel: D3_COSTS_2,
            requires: ['arcane_d2_mastery'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.15 },
              { type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 1 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 7. NATURE CORE - Regen/Summon Specialist
    // ========================================
    nature_core: {
      id: 'nature_core',
      name: 'Nature Core',
      theme: 'nature',
      description: 'Harness nature\'s power. Regenerate and summon plant allies.',
      color: '#228B22',
      icon: 'leaf',
      startingWeapon: 'thorn_shot',

      tree: {
        base: {
          id: 'nature_base',
          name: 'Nature Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.5 },
          ],
        },

        depth1: [
          {
            id: 'nature_d1_growth',
            name: 'Rapid Growth',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.8 },
            ],
          },
          {
            id: 'nature_d1_thorns',
            name: 'Thorn Armor',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.DAMAGE_REFLECT, valuePerLevel: 0.05 },
            ],
          },
          {
            id: 'nature_d1_bloom',
            name: 'Blooming Life',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.025 }],
          },
        ],

        depth2: [
          {
            id: 'nature_d2_entangle',
            name: 'Entangling Roots',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
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
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['nature_d2_overgrowth'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.15 },
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 3 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 8. STEEL CORE - Defense/Reflect Specialist
    // ========================================
    steel_core: {
      id: 'steel_core',
      name: 'Steel Core',
      theme: 'steel',
      description: 'Become an impenetrable fortress. High armor and damage reflection.',
      color: '#708090',
      icon: 'shield',
      startingWeapon: 'steel_blade',

      tree: {
        base: {
          id: 'steel_base',
          name: 'Steel Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 3 }],
        },

        depth1: [
          {
            id: 'steel_d1_fortify',
            name: 'Fortify',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.02 }],
          },
          {
            id: 'steel_d1_reflect',
            name: 'Steel Reflect',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.DAMAGE_REFLECT, valuePerLevel: 0.08 },
            ],
          },
          {
            id: 'steel_d1_endurance',
            name: 'Iron Endurance',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.03 }],
          },
        ],

        depth2: [
          {
            id: 'steel_d2_counter',
            name: 'Counter Strike',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
            requires: ['steel_d1_reflect'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.06 },
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.DAMAGE_REFLECT, valuePerLevel: 0.1 },
            ],
          },
          {
            id: 'steel_d2_bulwark',
            name: 'Bulwark',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
            requires: ['steel_d1_fortify', 'steel_d1_endurance'],
            requiresMultiple: true,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 10 },
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.05 },
            ],
          },
          {
            id: 'steel_d2_rampart',
            name: 'Living Rampart',
            maxLevel: 5,
            costPerLevel: D2_COSTS_5,
            requires: ['steel_d1_endurance'],
            requiresMultiple: false,
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.05 }],
          },
        ],

        depth3: [
          {
            id: 'steel_d3_juggernaut',
            name: 'Juggernaut',
            maxLevel: 2,
            costPerLevel: D3_COSTS_2,
            requires: ['steel_d2_bulwark'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 20 },
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 9. WIND CORE - Speed/Evasion Specialist
    // ========================================
    wind_core: {
      id: 'wind_core',
      name: 'Wind Core',
      theme: 'wind',
      description: 'Swift as the wind. High movement speed and evasion.',
      color: '#87CEEB',
      icon: 'wind',
      startingWeapon: 'wind_slash',

      tree: {
        base: {
          id: 'wind_base',
          name: 'Wind Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.025 }],
        },

        depth1: [
          {
            id: 'wind_d1_gust',
            name: 'Tailwind',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.03 }],
          },
          {
            id: 'wind_d1_dodge',
            name: 'Wind Dodge',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.EVASION, valuePerLevel: 0.03 }],
          },
          {
            id: 'wind_d1_swift',
            name: 'Swift Strikes',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.025 }],
          },
        ],

        depth2: [
          {
            id: 'wind_d2_tornado',
            name: 'Tornado',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
            requires: ['wind_d1_gust'],
            requiresMultiple: false,
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.1 }],
          },
          {
            id: 'wind_d2_velocity',
            name: 'Velocity',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
            requires: ['wind_d1_gust', 'wind_d1_swift'],
            requiresMultiple: true,
            effects: [
              {
                type: EffectType.UNIQUE_MECHANIC,
                mechanic: MechanicId.DAMAGE_SCALES_WITH_SPEED,
                valuePerLevel: 0.15,
              },
            ],
          },
          {
            id: 'wind_d2_mirage',
            name: 'Wind Mirage',
            maxLevel: 5,
            costPerLevel: D2_COSTS_5,
            requires: ['wind_d1_dodge'],
            requiresMultiple: false,
            effects: [{ type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.EVASION, valuePerLevel: 0.04 }],
          },
        ],

        depth3: [
          {
            id: 'wind_d3_hurricane',
            name: 'Hurricane',
            maxLevel: 2,
            costPerLevel: D3_COSTS_2,
            requires: ['wind_d2_velocity'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.1 },
              { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.1 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 10. EARTH CORE - Stun/Area Specialist
    // ========================================
    earth_core: {
      id: 'earth_core',
      name: 'Earth Core',
      theme: 'earth',
      description: 'Command the earth itself. Powerful area attacks and stuns.',
      color: '#8B4513',
      icon: 'mountain',
      startingWeapon: 'rock_throw',

      tree: {
        base: {
          id: 'earth_base',
          name: 'Earth Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.03 }],
        },

        depth1: [
          {
            id: 'earth_d1_tremor',
            name: 'Tremor',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.04 }],
          },
          {
            id: 'earth_d1_stone',
            name: 'Stone Skin',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 4 }],
          },
          {
            id: 'earth_d1_weight',
            name: 'Crushing Weight',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.02 }],
          },
        ],

        depth2: [
          {
            id: 'earth_d2_quake',
            name: 'Earthquake',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
            requires: ['earth_d1_tremor'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.12 },
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.SLOW_ON_HIT, valuePerLevel: 0.04 },
            ],
          },
          {
            id: 'earth_d2_monolith',
            name: 'Monolith',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
            requires: ['earth_d1_stone', 'earth_d1_weight'],
            requiresMultiple: true,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.08 },
              { type: EffectType.STAT_BONUS, stat: StatId.ARMOR, valuePerLevel: 8 },
            ],
          },
          {
            id: 'earth_d2_fortress',
            name: 'Earth Fortress',
            maxLevel: 5,
            costPerLevel: D2_COSTS_5,
            requires: ['earth_d1_stone'],
            requiresMultiple: false,
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE_REDUCTION, valuePerLevel: 0.03 }],
          },
        ],

        depth3: [
          {
            id: 'earth_d3_titan',
            name: 'Earth Titan',
            maxLevel: 2,
            costPerLevel: D3_COSTS_2,
            requires: ['earth_d2_quake'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.2 },
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 11. VOID CORE - Debuff/Curse Specialist
    // ========================================
    void_core: {
      id: 'void_core',
      name: 'Void Core',
      theme: 'void',
      description: 'Tap into the void. Weaken enemies with curses and debuffs.',
      color: '#2F0032',
      icon: 'void',
      startingWeapon: 'void_bolt',

      tree: {
        base: {
          id: 'void_base',
          name: 'Void Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.WEAKNESS_DEBUFF, valuePerLevel: 0.01 },
          ],
        },

        depth1: [
          {
            id: 'void_d1_curse',
            name: 'Void Curse',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.WEAKNESS_DEBUFF, valuePerLevel: 0.015 },
            ],
          },
          {
            id: 'void_d1_entropy',
            name: 'Entropy',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.PIERCE, valuePerLevel: 1 }],
          },
          {
            id: 'void_d1_nihil',
            name: 'Nihilism',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.02 }],
          },
        ],

        depth2: [
          {
            id: 'void_d2_rift',
            name: 'Void Rift',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
            requires: ['void_d1_curse'],
            requiresMultiple: false,
            effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.VOID_RIFT, valuePerLevel: 0.08 }],
          },
          {
            id: 'void_d2_oblivion',
            name: 'Oblivion',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['void_d2_oblivion'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.WEAKNESS_DEBUFF, valuePerLevel: 0.1 },
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.15 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 12. HOLY CORE - Healing/Aura Specialist
    // ========================================
    holy_core: {
      id: 'holy_core',
      name: 'Holy Core',
      theme: 'holy',
      description: 'Channel divine light. Heal yourself and smite enemies.',
      color: '#FFD700',
      icon: 'sun',
      startingWeapon: 'holy_beam',

      tree: {
        base: {
          id: 'holy_base',
          name: 'Holy Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [
            { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.6 },
          ],
        },

        depth1: [
          {
            id: 'holy_d1_blessing',
            name: 'Divine Blessing',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 0.8 },
            ],
          },
          {
            id: 'holy_d1_smite',
            name: 'Holy Smite',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.HOLY_SMITE, valuePerLevel: 0.06 }],
          },
          {
            id: 'holy_d1_sanctify',
            name: 'Sanctify',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.025 }],
          },
        ],

        depth2: [
          {
            id: 'holy_d2_radiance',
            name: 'Divine Radiance',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
            requires: ['holy_d1_smite'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.08 },
              { type: EffectType.PASSIVE_PROC, procType: ProcId.HOLY_SMITE, valuePerLevel: 0.05 },
            ],
          },
          {
            id: 'holy_d2_grace',
            name: 'Divine Grace',
            maxLevel: 3,
            costPerLevel: D2_COSTS_3,
            requires: ['holy_d1_blessing', 'holy_d1_sanctify'],
            requiresMultiple: true,
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 2 },
              { type: EffectType.STAT_BONUS, stat: StatId.MAX_HEALTH, valuePerLevel: 0.08 },
            ],
          },
          {
            id: 'holy_d2_aura',
            name: 'Holy Aura',
            maxLevel: 5,
            costPerLevel: D2_COSTS_5,
            requires: ['holy_d1_sanctify'],
            requiresMultiple: false,
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.AREA, valuePerLevel: 0.06 }],
          },
        ],

        depth3: [
          {
            id: 'holy_d3_avatar',
            name: 'Divine Avatar',
            maxLevel: 2,
            costPerLevel: D3_COSTS_2,
            requires: ['holy_d2_grace'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.HEALTH_REGEN, valuePerLevel: 4 },
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 13. TECH CORE - Projectile/Multi-shot Specialist
    // ========================================
    tech_core: {
      id: 'tech_core',
      name: 'Tech Core',
      theme: 'tech',
      description: 'Advanced technology. Multiple projectiles and ricochets.',
      color: '#00CED1',
      icon: 'gear',
      startingWeapon: 'auto_turret',

      tree: {
        base: {
          id: 'tech_base',
          name: 'Tech Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 0.2 }],
        },

        depth1: [
          {
            id: 'tech_d1_multishot',
            name: 'Multi-Shot',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 0.3 }],
          },
          {
            id: 'tech_d1_ricochet',
            name: 'Ricochet',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.PASSIVE_PROC, procType: ProcId.RICOCHET, valuePerLevel: 0.08 }],
          },
          {
            id: 'tech_d1_overclock',
            name: 'Overclock',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.025 }],
          },
        ],

        depth2: [
          {
            id: 'tech_d2_barrage',
            name: 'Bullet Barrage',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
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
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['tech_d2_overdrive'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.PROJECTILE_COUNT, valuePerLevel: 1 },
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.1 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 14. BEAST CORE - Attack Speed/Frenzy Specialist
    // ========================================
    beast_core: {
      id: 'beast_core',
      name: 'Beast Core',
      theme: 'beast',
      description: 'Unleash primal fury. Stack frenzy for massive attack speed.',
      color: '#FF6347',
      icon: 'paw',
      startingWeapon: 'claw_swipe',

      tree: {
        base: {
          id: 'beast_base',
          name: 'Beast Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.03 }],
        },

        depth1: [
          {
            id: 'beast_d1_frenzy',
            name: 'Frenzy',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.04 }],
          },
          {
            id: 'beast_d1_savage',
            name: 'Savage Strikes',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.CRIT_CHANCE, valuePerLevel: 0.03 }],
          },
          {
            id: 'beast_d1_wild',
            name: 'Wild Instinct',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
            requires: [],
            effects: [{ type: EffectType.STAT_BONUS, stat: StatId.MOVE_SPEED, valuePerLevel: 0.02 }],
          },
        ],

        depth2: [
          {
            id: 'beast_d2_rampage',
            name: 'Rampage',
            maxLevel: 4,
            costPerLevel: D2_COSTS_4,
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
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['beast_d2_predator'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.15 },
              { type: EffectType.STAT_BONUS, stat: StatId.DAMAGE, valuePerLevel: 0.12 },
            ],
          },
        ],
      },
    },

    // ========================================
    // 15. TIME CORE - Cooldown/Slow Specialist
    // ========================================
    time_core: {
      id: 'time_core',
      name: 'Time Core',
      theme: 'time',
      description: 'Manipulate time itself. Reduce cooldowns and slow enemies.',
      color: '#DDA0DD',
      icon: 'clock',
      startingWeapon: 'chrono_bolt',

      tree: {
        base: {
          id: 'time_base',
          name: 'Time Mastery',
          maxLevel: 10,
          costPerLevel: BASE_COSTS,
          effects: [
            { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.015 },
          ],
        },

        depth1: [
          {
            id: 'time_d1_haste',
            name: 'Temporal Haste',
            maxLevel: 7,
            costPerLevel: D1_COSTS_7,
            requires: [],
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.02 },
            ],
          },
          {
            id: 'time_d1_slow',
            name: 'Time Dilation',
            maxLevel: 5,
            costPerLevel: D1_COSTS_5,
            requires: [],
            effects: [
              { type: EffectType.UNIQUE_MECHANIC, mechanic: MechanicId.TIME_SLOW_AURA, valuePerLevel: 0.04 },
            ],
          },
          {
            id: 'time_d1_rewind',
            name: 'Minor Rewind',
            maxLevel: 10,
            costPerLevel: D1_COSTS_10,
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
            costPerLevel: D2_COSTS_4,
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
            costPerLevel: D2_COSTS_3,
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
            costPerLevel: D2_COSTS_5,
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
            costPerLevel: D3_COSTS_2,
            requires: ['time_d2_accelerate'],
            requiresMultiple: false,
            effects: [
              { type: EffectType.STAT_BONUS, stat: StatId.COOLDOWN_REDUCTION, valuePerLevel: 0.1 },
              { type: EffectType.STAT_BONUS, stat: StatId.ATTACK_SPEED, valuePerLevel: 0.1 },
            ],
          },
        ],
      },
    },
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get core data by ID
   * @param {string} coreId
   * @returns {Object|null}
   */
  function getCoreData(coreId) {
    return CORES[coreId] || null;
  }

  /**
   * Get all core IDs
   * @returns {Array<string>}
   */
  function getAllCoreIds() {
    return Object.keys(CORES);
  }

  /**
   * Get random cores
   * @param {number} count
   * @returns {Array<Object>}
   */
  function getRandomCores(count) {
    var ids = getAllCoreIds();
    var shuffled = ids.slice();

    // Fisher-Yates shuffle
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    var result = [];
    for (var k = 0; k < Math.min(count, shuffled.length); k++) {
      result.push(CORES[shuffled[k]]);
    }
    return result;
  }

  /**
   * Get techs by depth from a core
   * @param {string} coreId
   * @param {number} depth - 0 for base, 1-3 for depths
   * @returns {Array<Object>}
   */
  function getTechsByDepth(coreId, depth) {
    var core = CORES[coreId];
    if (!core) return [];

    if (depth === 0) {
      return [core.tree.base];
    }

    var depthKey = 'depth' + depth;
    return core.tree[depthKey] || [];
  }

  /**
   * Get a specific tech by ID from a core
   * @param {string} coreId
   * @param {string} techId
   * @returns {Object|null}
   */
  function getTechById(coreId, techId) {
    var core = CORES[coreId];
    if (!core) return null;

    // Check base
    if (core.tree.base.id === techId) {
      return core.tree.base;
    }

    // Check all depths
    for (var depth = 1; depth <= 3; depth++) {
      var techs = core.tree['depth' + depth] || [];
      for (var i = 0; i < techs.length; i++) {
        if (techs[i].id === techId) {
          return techs[i];
        }
      }
    }

    return null;
  }

  /**
   * Get the depth of a tech
   * @param {string} coreId
   * @param {string} techId
   * @returns {number} -1 if not found
   */
  function getTechDepth(coreId, techId) {
    var core = CORES[coreId];
    if (!core) return -1;

    if (core.tree.base.id === techId) {
      return 0;
    }

    for (var depth = 1; depth <= 3; depth++) {
      var techs = core.tree['depth' + depth] || [];
      for (var i = 0; i < techs.length; i++) {
        if (techs[i].id === techId) {
          return depth;
        }
      }
    }

    return -1;
  }

  /**
   * Get available techs to unlock based on current unlocks
   * @param {string} coreId
   * @param {Object} techTree - TechTree component or unlocked tech map
   * @returns {Array<Object>} Array of tech objects that can be unlocked
   */
  function getAvailableTechs(coreId, techTree) {
    var core = CORES[coreId];
    if (!core) return [];

    var available = [];
    var unlockedTechs = techTree._unlockedTechs || techTree;

    // Helper to check if tech is unlocked
    function isUnlocked(techId) {
      if (unlockedTechs instanceof Map) {
        return unlockedTechs.has(techId);
      }
      return unlockedTechs[techId] !== undefined;
    }

    // Helper to count unlocked techs at a depth
    function countUnlockedAtDepth(depth) {
      var techs = getTechsByDepth(coreId, depth);
      var count = 0;
      for (var i = 0; i < techs.length; i++) {
        if (isUnlocked(techs[i].id)) {
          count++;
        }
      }
      return count;
    }

    // Check each depth
    for (var depth = 1; depth <= 3; depth++) {
      var techs = core.tree['depth' + depth] || [];

      for (var i = 0; i < techs.length; i++) {
        var tech = techs[i];

        // Skip if already unlocked
        if (isUnlocked(tech.id)) continue;

        // Check prerequisites
        var canUnlock = true;

        if (tech.requiresMultiple && tech.requires && tech.requires.length >= 2) {
          // Need ALL required techs
          for (var j = 0; j < tech.requires.length; j++) {
            if (!isUnlocked(tech.requires[j])) {
              canUnlock = false;
              break;
            }
          }
        } else if (tech.requires && tech.requires.length > 0) {
          // Need at least one required tech
          var hasOne = false;
          for (var k = 0; k < tech.requires.length; k++) {
            if (isUnlocked(tech.requires[k])) {
              hasOne = true;
              break;
            }
          }
          canUnlock = hasOne;
        } else {
          // No specific requires - need at least 1 tech from previous depth
          var prevDepthCount = countUnlockedAtDepth(depth - 1);
          canUnlock = prevDepthCount >= 1;
        }

        if (canUnlock) {
          // Add depth info for display
          var techWithDepth = Object.assign({}, tech, { depth: depth });
          available.push(techWithDepth);
        }
      }
    }

    return available;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.TechCoreData = {
    CORES: CORES,
    getCoreData: getCoreData,
    getAllCoreIds: getAllCoreIds,
    getRandomCores: getRandomCores,
    getTechsByDepth: getTechsByDepth,
    getTechById: getTechById,
    getTechDepth: getTechDepth,
    getAvailableTechs: getAvailableTechs,
  };
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
