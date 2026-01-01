/**
 * @fileoverview Main entry point for Weapon Debug Tool
 */

import { DebugLogger } from './DebugLogger.js';
import { TestHarness } from './TestHarness.js';
import { EventTracker } from './EventTracker.js';
import { UIController } from './UIController.js';

// ========================================
// Namespace Initialization
// ========================================
window.VampireSurvivors = window.VampireSurvivors || {};
window.VampireSurvivors.Core = {};
window.VampireSurvivors.Data = {};
window.VampireSurvivors.Pool = {};
window.VampireSurvivors.Behaviors = {};
window.VampireSurvivors.Entities = {};
window.VampireSurvivors.Components = {};
window.VampireSurvivors.Systems = {};
window.VampireSurvivors.Managers = {};
window.VampireSurvivors.UI = {};
window.VampireSurvivors.Utils = {};
window.VampireSurvivors.Debug = {};

// ========================================
// Global UI Functions
// ========================================
window.toggleCollapse = function(headerElement) {
  const section = headerElement.parentElement;
  section.classList.toggle('collapsed');
};

// ========================================
// Script Loader
// ========================================
const SCRIPTS = [
  // Phase 2: Utilities
  '../../src/utils/Vector2.js',
  '../../src/utils/GlobalStatsHelper.js',

  // Phase 2.5: Object Pools
  '../../src/pool/ObjectPool.js',

  // Phase 3: Core Systems
  '../../src/core/EventBus.js',
  '../../src/core/Time.js',
  '../../src/core/Input.js',
  '../../src/core/UIScale.js',
  '../../src/core/i18n.js',
  '../../src/core/Game.js',

  // Phase 4: Components
  '../../src/components/Component.js',
  '../../src/components/Transform.js',
  '../../src/components/Velocity.js',
  '../../src/components/Sprite.js',
  '../../src/components/Collider.js',
  '../../src/components/Health.js',
  '../../src/components/Projectile.js',
  '../../src/components/AreaEffect.js',
  '../../src/components/Weapon.js',
  '../../src/components/WeaponSlot.js',
  '../../src/components/Pickup.js',
  '../../src/components/Experience.js',
  '../../src/components/Gold.js',

  // Phase 4.6: Data (needed by PlayerStats)
  '../../src/data/StatUpgradeData.js',

  // Phase 4.7: Additional Components
  '../../src/components/PlayerStats.js',
  '../../src/components/PlayerData.js',
  '../../src/components/Shield.js',
  '../../src/components/ActiveBuff.js',

  // Phase 4.5: Data
  '../../src/data/PickupConfig.js',
  '../../src/data/ImageConfig.js',

  // Phase 4.57: Asset Loader
  '../../src/core/AssetLoader.js',

  // Phase 5: Entities
  '../../src/entities/Entity.js',
  '../../src/entities/Player.js',
  '../../src/entities/Enemy.js',
  '../../src/entities/TraversalEnemy.js',
  '../../src/entities/Projectile.js',
  '../../src/entities/AreaEffect.js',
  '../../src/entities/Pickup.js',
  '../../src/entities/Mine.js',
  '../../src/entities/Summon.js',

  // Phase 5.5: Pools
  '../../src/pool/ProjectilePool.js',
  '../../src/pool/AreaEffectPool.js',
  '../../src/pool/PickupPool.js',
  '../../src/pool/MinePool.js',
  '../../src/pool/SummonPool.js',
  '../../src/pool/EnemyProjectilePool.js',

  // Phase 5.7: Weapon Data
  '../../src/data/weapons/WeaponConstants.js',

  // Basic Common Weapons
  '../../src/data/weapons/basic/common/arcane_dart.js',
  '../../src/data/weapons/basic/common/stone_throw.js',
  '../../src/data/weapons/basic/common/ice_shard.js',
  '../../src/data/weapons/basic/common/ember_bolt.js',
  '../../src/data/weapons/basic/common/spectral_arrow.js',
  '../../src/data/weapons/basic/common/scatter_shot.js',
  '../../src/data/weapons/basic/common/venom_fang.js',
  '../../src/data/weapons/basic/common/wind_cutter.js',
  '../../src/data/weapons/basic/common/rusty_blade.js',
  '../../src/data/weapons/basic/common/monks_fist.js',
  '../../src/data/weapons/basic/common/cleaver.js',
  '../../src/data/weapons/basic/common/whip_lash.js',
  '../../src/data/weapons/basic/common/battle_axe.js',
  '../../src/data/weapons/basic/common/claw_strike.js',
  '../../src/data/weapons/basic/common/poison_puddle.js',
  '../../src/data/weapons/basic/common/frost_circle.js',
  '../../src/data/weapons/basic/common/ember_field.js',
  '../../src/data/weapons/basic/common/shadow_pool.js',
  '../../src/data/weapons/basic/common/holy_ground.js',
  '../../src/data/weapons/basic/common/orbiting_stones.js',
  '../../src/data/weapons/basic/common/spark_chain.js',
  '../../src/data/weapons/basic/common/spirit_wisps.js',
  '../../src/data/weapons/basic/common/fire_motes.js',
  '../../src/data/weapons/basic/common/spike_trap.js',
  '../../src/data/weapons/basic/common/flash_bomb.js',
  '../../src/data/weapons/basic/common/ice_bomb.js',
  '../../src/data/weapons/basic/common/light_ray.js',
  '../../src/data/weapons/basic/common/shadow_beam.js',
  '../../src/data/weapons/basic/common/skeleton_minion.js',
  '../../src/data/weapons/basic/common/fire_sprite.js',

  // Basic Uncommon Weapons
  '../../src/data/weapons/basic/uncommon/bifrost_bolt.js',
  '../../src/data/weapons/basic/uncommon/homing_missile.js',
  '../../src/data/weapons/basic/uncommon/ricochet_shot.js',
  '../../src/data/weapons/basic/uncommon/split_arrow.js',
  '../../src/data/weapons/basic/uncommon/plasma_orb.js',
  '../../src/data/weapons/basic/uncommon/chakram.js',
  '../../src/data/weapons/basic/uncommon/void_bullet.js',
  '../../src/data/weapons/basic/uncommon/crystal_lance.js',
  '../../src/data/weapons/basic/uncommon/phantom_blade.js',
  '../../src/data/weapons/basic/uncommon/flame_scythe.js',
  '../../src/data/weapons/basic/uncommon/thunder_hammer.js',
  '../../src/data/weapons/basic/uncommon/blood_razor.js',
  '../../src/data/weapons/basic/uncommon/crescent_moon.js',
  '../../src/data/weapons/basic/uncommon/toxic_spores.js',
  '../../src/data/weapons/basic/uncommon/gravity_well.js',
  '../../src/data/weapons/basic/uncommon/hallowed_ring.js',
  '../../src/data/weapons/basic/uncommon/meteor_crater.js',
  '../../src/data/weapons/basic/uncommon/blizzard_zone.js',
  '../../src/data/weapons/basic/uncommon/soul_orbit.js',
  '../../src/data/weapons/basic/uncommon/arc_lightning.js',
  '../../src/data/weapons/basic/uncommon/blade_vortex.js',
  '../../src/data/weapons/basic/uncommon/toxic_chain.js',
  '../../src/data/weapons/basic/uncommon/flame_dancers.js',
  '../../src/data/weapons/basic/uncommon/cluster_mine.js',
  '../../src/data/weapons/basic/uncommon/magnetic_mine.js',
  '../../src/data/weapons/basic/uncommon/chain_reaction_mine.js',
  '../../src/data/weapons/basic/uncommon/prismatic_ray.js',
  '../../src/data/weapons/basic/uncommon/piercing_gaze.js',
  '../../src/data/weapons/basic/uncommon/shadow_clone.js',
  '../../src/data/weapons/basic/uncommon/frost_elemental.js',
  '../../src/data/weapons/basic/uncommon/arcane_cannon.js',
  '../../src/data/weapons/basic/uncommon/death_ray.js',
  '../../src/data/weapons/basic/uncommon/blade_storm.js',
  '../../src/data/weapons/basic/uncommon/toxic_inferno.js',
  '../../src/data/weapons/basic/uncommon/storm_blades.js',
  '../../src/data/weapons/basic/uncommon/spread_seeker.js',
  '../../src/data/weapons/basic/uncommon/blood_cleaver.js',
  '../../src/data/weapons/basic/uncommon/blazing_bolt.js',
  '../../src/data/weapons/basic/uncommon/frozen_burst.js',
  '../../src/data/weapons/basic/uncommon/phantom_volley.js',
  '../../src/data/weapons/basic/uncommon/storm_scatter.js',
  '../../src/data/weapons/basic/uncommon/venomous_surge.js',
  '../../src/data/weapons/basic/uncommon/primal_strike.js',
  '../../src/data/weapons/basic/uncommon/berserker_blade.js',
  '../../src/data/weapons/basic/uncommon/lightning_lash.js',
  '../../src/data/weapons/basic/uncommon/mystic_arrow.js',
  '../../src/data/weapons/basic/uncommon/umbral_wave.js',
  '../../src/data/weapons/basic/uncommon/radiant_ground.js',
  '../../src/data/weapons/basic/uncommon/explosive_trap.js',
  '../../src/data/weapons/basic/uncommon/rock_storm.js',
  '../../src/data/weapons/basic/uncommon/undead_legion.js',
  '../../src/data/weapons/basic/uncommon/elemental_clash.js',
  '../../src/data/weapons/basic/uncommon/inferno_swarm.js',
  '../../src/data/weapons/basic/uncommon/arcane_scatter.js',

  // Basic Rare Weapons
  '../../src/data/weapons/basic/rare/constellation_arrow.js',
  '../../src/data/weapons/basic/rare/singularity_orb.js',
  '../../src/data/weapons/basic/rare/phoenix_feather.js',
  '../../src/data/weapons/basic/rare/temporal_bolt.js',
  '../../src/data/weapons/basic/rare/dragonbreath_volley.js',
  '../../src/data/weapons/basic/rare/void_reaver.js',
  '../../src/data/weapons/basic/rare/storm_caller.js',
  '../../src/data/weapons/basic/rare/mirrorblade.js',
  '../../src/data/weapons/basic/rare/soulrender.js',
  '../../src/data/weapons/basic/rare/aurora_field.js',
  '../../src/data/weapons/basic/rare/dimensional_rift.js',
  '../../src/data/weapons/basic/rare/supernova_core.js',
  '../../src/data/weapons/basic/rare/celestial_orbit.js',
  '../../src/data/weapons/basic/rare/cascade_lightning.js',
  '../../src/data/weapons/basic/rare/orbital_bombardment.js',
  '../../src/data/weapons/basic/rare/quantum_mine.js',
  '../../src/data/weapons/basic/rare/void_anchor.js',
  '../../src/data/weapons/basic/rare/sunbeam.js',
  '../../src/data/weapons/basic/rare/moonlight_slash.js',
  '../../src/data/weapons/basic/rare/phoenix_guardian.js',

  // Basic Epic Weapons
  '../../src/data/weapons/basic/epic/ragnarok.js',
  '../../src/data/weapons/basic/epic/cosmic_annihilator.js',
  '../../src/data/weapons/basic/epic/world_serpent.js',
  '../../src/data/weapons/basic/epic/infinity_gauntlet.js',
  '../../src/data/weapons/basic/epic/chrono_shatter.js',
  '../../src/data/weapons/basic/epic/void_emperor.js',
  '../../src/data/weapons/basic/epic/heavens_wrath.js',
  '../../src/data/weapons/basic/epic/soul_nexus.js',
  '../../src/data/weapons/basic/epic/apocalypse_engine.js',
  '../../src/data/weapons/basic/epic/genesis_blade.js',

  // Weapon Aggregator
  '../../src/data/weapons/WeaponAggregator.js',
  '../../src/data/WeaponTierData.js',
  '../../src/data/WeaponEvolutionData.js',
  '../../src/data/PropertyDescriptions.js',
  '../../src/data/DropTable.js',
  '../../src/data/WaveData.js',

  // Traversal Enemy Data
  '../../src/data/traversalenemies/TraversalConstants.js',
  '../../src/data/traversalenemies/circular.js',
  '../../src/data/traversalenemies/dash.js',
  '../../src/data/traversalenemies/laser.js',
  '../../src/data/traversalenemies/TraversalAggregator.js',

  // Boss Data
  '../../src/data/bosses/BossConstants.js',
  '../../src/data/bosses/elite.js',
  '../../src/data/bosses/miniboss.js',
  '../../src/data/bosses/boss.js',
  '../../src/data/bosses/BossAggregator.js',

  // Enemy Data
  '../../src/data/enemies/EnemyConstants.js',
  '../../src/data/enemies/normal.js',
  '../../src/data/enemies/fast.js',
  '../../src/data/enemies/flying.js',
  '../../src/data/enemies/self_destruct.js',
  '../../src/data/enemies/invisible.js',
  '../../src/data/enemies/dash_attack.js',
  '../../src/data/enemies/projectile.js',
  '../../src/data/enemies/jump_drop.js',
  '../../src/data/enemies/EnemyAggregator.js',

  // Summon Data
  '../../src/data/summons/SummonConstants.js',
  '../../src/data/summons/spirit.js',
  '../../src/data/summons/turret.js',
  '../../src/data/summons/wolf.js',
  '../../src/data/summons/golem.js',
  '../../src/data/summons/fairy.js',
  '../../src/data/summons/SummonAggregator.js',

  // Tech Tree Data
  '../../src/data/TechEffectData.js',

  // Buff/Debuff Data
  '../../src/data/buffdebuff/BuffDebuffConstants.js',
  '../../src/data/buffdebuff/effects/debuffs/burn.js',
  '../../src/data/buffdebuff/effects/debuffs/poison.js',
  '../../src/data/buffdebuff/effects/debuffs/bleed.js',
  '../../src/data/buffdebuff/effects/debuffs/freeze.js',
  '../../src/data/buffdebuff/effects/debuffs/slow.js',
  '../../src/data/buffdebuff/effects/debuffs/stun.js',
  '../../src/data/buffdebuff/effects/debuffs/weakness.js',
  '../../src/data/buffdebuff/effects/debuffs/mark.js',
  '../../src/data/buffdebuff/effects/debuffs/pull.js',
  '../../src/data/buffdebuff/effects/buffs/attack_boost.js',
  '../../src/data/buffdebuff/effects/buffs/speed_boost.js',
  '../../src/data/buffdebuff/effects/buffs/defense_boost.js',
  '../../src/data/buffdebuff/effects/buffs/regen.js',
  '../../src/data/buffdebuff/effects/buffs/shield_buff.js',
  '../../src/data/buffdebuff/effects/buffs/aurora.js',
  '../../src/data/buffdebuff/effects/buffs/magnet.js',
  '../../src/data/buffdebuff/BuffDebuffAggregator.js',

  // Tech Core Data
  '../../src/data/techcores/TechCoreConstants.js',
  '../../src/data/techcores/fire_core.js',
  '../../src/data/techcores/ice_core.js',
  '../../src/data/techcores/lightning_core.js',
  '../../src/data/techcores/shadow_core.js',
  '../../src/data/techcores/blood_core.js',
  '../../src/data/techcores/arcane_core.js',
  '../../src/data/techcores/nature_core.js',
  '../../src/data/techcores/steel_core.js',
  '../../src/data/techcores/wind_core.js',
  '../../src/data/techcores/earth_core.js',
  '../../src/data/techcores/void_core.js',
  '../../src/data/techcores/holy_core.js',
  '../../src/data/techcores/tech_core.js',
  '../../src/data/techcores/beast_core.js',
  '../../src/data/techcores/time_core.js',
  '../../src/data/techcores/TechCoreAggregator.js',

  // Character Data
  '../../src/data/CharacterData.js',
  '../../src/data/ActiveSkillData.js',

  // Core Weapon Files
  '../../src/data/weapons/core/common/inferno_bolt.js',
  '../../src/data/weapons/core/common/frost_shard.js',
  '../../src/data/weapons/core/common/thunder_strike.js',
  '../../src/data/weapons/core/common/shadow_blade.js',
  '../../src/data/weapons/core/common/blood_scythe.js',
  '../../src/data/weapons/core/common/arcane_barrage.js',
  '../../src/data/weapons/core/common/venom_spore.js',
  '../../src/data/weapons/core/common/steel_hammer.js',
  '../../src/data/weapons/core/common/wind_cutter_core.js',
  '../../src/data/weapons/core/common/earth_spike.js',
  '../../src/data/weapons/core/common/void_rift.js',
  '../../src/data/weapons/core/common/holy_lance.js',
  '../../src/data/weapons/core/common/tech_turret.js',
  '../../src/data/weapons/core/common/beast_claw.js',
  '../../src/data/weapons/core/common/chrono_beam.js',
  '../../src/data/weapons/core/CoreWeaponAggregator.js',

  // Evolved Core Weapons
  '../../src/data/weapons/core/EvolvedConstants.js',
  '../../src/data/weapons/core/EvolvedWeaponRegistry.js',

  // Core Uncommon Evolved
  '../../src/data/weapons/core/uncommon/inferno_surge.js',
  '../../src/data/weapons/core/uncommon/glacial_spike.js',
  '../../src/data/weapons/core/uncommon/storm_bolt.js',
  '../../src/data/weapons/core/uncommon/phantom_edge.js',
  '../../src/data/weapons/core/uncommon/crimson_reaper.js',
  '../../src/data/weapons/core/uncommon/mystic_storm.js',
  '../../src/data/weapons/core/uncommon/toxic_bloom.js',
  '../../src/data/weapons/core/uncommon/iron_crusher.js',
  '../../src/data/weapons/core/uncommon/gale_blade.js',
  '../../src/data/weapons/core/uncommon/stone_cascade.js',
  '../../src/data/weapons/core/uncommon/null_tear.js',
  '../../src/data/weapons/core/uncommon/divine_spear.js',
  '../../src/data/weapons/core/uncommon/auto_sentinel.js',
  '../../src/data/weapons/core/uncommon/feral_strike.js',
  '../../src/data/weapons/core/uncommon/temporal_ray.js',

  // Core Rare Evolved
  '../../src/data/weapons/core/rare/phoenix_storm.js',
  '../../src/data/weapons/core/rare/blizzard_lance.js',
  '../../src/data/weapons/core/rare/tempest_fury.js',
  '../../src/data/weapons/core/rare/nightmare_slash.js',
  '../../src/data/weapons/core/rare/soul_harvester.js',
  '../../src/data/weapons/core/rare/arcane_tempest.js',
  '../../src/data/weapons/core/rare/plague_forest.js',
  '../../src/data/weapons/core/rare/titan_maul.js',
  '../../src/data/weapons/core/rare/hurricane_slash.js',
  '../../src/data/weapons/core/rare/tectonic_surge.js',
  '../../src/data/weapons/core/rare/dimension_rend.js',
  '../../src/data/weapons/core/rare/seraph_judgment.js',
  '../../src/data/weapons/core/rare/siege_platform.js',
  '../../src/data/weapons/core/rare/alpha_predator.js',
  '../../src/data/weapons/core/rare/time_distortion.js',

  // Core Epic Evolved
  '../../src/data/weapons/core/epic/blazing_apocalypse.js',
  '../../src/data/weapons/core/epic/absolute_zero.js',
  '../../src/data/weapons/core/epic/lightning_god.js',
  '../../src/data/weapons/core/epic/void_assassin.js',
  '../../src/data/weapons/core/epic/blood_lord.js',
  '../../src/data/weapons/core/epic/reality_shatter.js',
  '../../src/data/weapons/core/epic/nature_wrath.js',
  '../../src/data/weapons/core/epic/adamantine_breaker.js',
  '../../src/data/weapons/core/epic/storm_emperor.js',
  '../../src/data/weapons/core/epic/earthquake.js',
  '../../src/data/weapons/core/epic/reality_collapse.js',
  '../../src/data/weapons/core/epic/heaven_decree.js',
  '../../src/data/weapons/core/epic/war_machine.js',
  '../../src/data/weapons/core/epic/beast_king.js',
  '../../src/data/weapons/core/epic/chrono_master.js',

  // Core Legendary Evolved
  '../../src/data/weapons/core/legendary/solar_annihilation.js',
  '../../src/data/weapons/core/legendary/eternal_winter.js',
  '../../src/data/weapons/core/legendary/thor_judgment.js',
  '../../src/data/weapons/core/legendary/oblivion_blade.js',
  '../../src/data/weapons/core/legendary/eternal_bloodlust.js',
  '../../src/data/weapons/core/legendary/cosmic_weave.js',
  '../../src/data/weapons/core/legendary/world_tree.js',
  '../../src/data/weapons/core/legendary/mjolnir.js',
  '../../src/data/weapons/core/legendary/primordial_wind.js',
  '../../src/data/weapons/core/legendary/continental_drift.js',
  '../../src/data/weapons/core/legendary/void_god.js',
  '../../src/data/weapons/core/legendary/god_light.js',
  '../../src/data/weapons/core/legendary/omega_protocol.js',
  '../../src/data/weapons/core/legendary/primal_god.js',
  '../../src/data/weapons/core/legendary/eternity_weaver.js',
  '../../src/data/weapons/core/EvolvedAggregator.js',

  // TechTree Component
  '../../src/components/TechTree.js',
  '../../src/components/BuffDebuff.js',
  '../../src/components/ActiveSkill.js',

  // Boss Entity
  '../../src/entities/Boss.js',

  // Managers
  '../../src/managers/EntityManager.js',
  '../../src/managers/BlacklistManager.js',
  '../../src/managers/BuffDebuffManager.js',

  // Systems
  '../../src/systems/System.js',
  '../../src/systems/BackgroundSystem.js',
  '../../src/systems/WaveSystem.js',
  '../../src/systems/PlayerSystem.js',
  '../../src/systems/ActiveSkillSystem.js',
  '../../src/systems/EnemySystem.js',
  '../../src/systems/TraversalEnemySystem.js',
  '../../src/systems/BossSystem.js',
  '../../src/systems/MovementSystem.js',
  '../../src/systems/ProjectileSystem.js',
  '../../src/systems/AreaEffectSystem.js',
  '../../src/systems/MineSystem.js',
  '../../src/systems/SummonSystem.js',
  '../../src/systems/CollisionSystem.js',
  '../../src/systems/BuffDebuffSystem.js',

  // Combat System
  '../../src/systems/combat/CombatConstants.js',
  '../../src/systems/combat/DamageProcessor.js',
  '../../src/systems/combat/EffectHandlers.js',
  '../../src/systems/combat/RicochetHandler.js',
  '../../src/systems/combat/ExplosionHandler.js',
  '../../src/systems/combat/CombatSystem.js',
  '../../src/systems/DropSystem.js',
  '../../src/systems/PickupSystem.js',
  '../../src/systems/CameraSystem.js',
  '../../src/systems/RenderSystem.js',

  // Behaviors
  '../../src/behaviors/WeaponBehavior.js',
  '../../src/behaviors/ProjectileBehavior.js',
  '../../src/behaviors/LaserBehavior.js',
  '../../src/behaviors/MeleeBehavior.js',
  '../../src/behaviors/ThrustBehavior.js',
  '../../src/behaviors/AreaBehavior.js',
  '../../src/behaviors/ParticleBehavior.js',
  '../../src/behaviors/MineBehavior.js',
  '../../src/behaviors/SummonBehavior.js',

  // Enemy Behaviors
  '../../src/behaviors/EnemyBehavior.js',
  '../../src/behaviors/ChaseEnemyBehavior.js',
  '../../src/behaviors/FlyingEnemyBehavior.js',
  '../../src/behaviors/InvisibleEnemyBehavior.js',
  '../../src/behaviors/SelfDestructBehavior.js',
  '../../src/behaviors/DashAttackBehavior.js',
  '../../src/behaviors/JumpDropBehavior.js',
  '../../src/behaviors/ProjectileEnemyBehavior.js',

  // Weapon System
  '../../src/systems/WeaponSystem.js',

  // Camera
  '../../src/core/Camera.js',
];

let loadedCount = 0;
const progressBar = document.getElementById('loading-progress-bar');
const loadingText = document.getElementById('loading-text');

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / SCRIPTS.length) * 100);
      progressBar.style.width = percent + '%';
      loadingText.textContent = 'Loading: ' + src.split('/').pop();
      resolve();
    };
    script.onerror = () => {
      console.warn('Failed to load: ' + src);
      loadedCount++;
      resolve(); // Continue anyway
    };
    document.body.appendChild(script);
  });
}

async function loadAllScripts() {
  for (let i = 0; i < SCRIPTS.length; i++) {
    await loadScript(SCRIPTS[i]);
  }
}

// ========================================
// Main Initialization
// ========================================
async function main() {
  try {
    // Start capturing debug logs early
    DebugLogger.getInstance().startCapturing();

    // Load all scripts
    await loadAllScripts();

    document.getElementById('loading-text').textContent = 'Initializing game systems...';

    // Small delay to ensure scripts are executed
    await new Promise((resolve) => { setTimeout(resolve, 500); });

    // Initialize harness
    const harness = new TestHarness();
    harness.initialize('game-canvas');

    // Initialize tracker
    const tracker = new EventTracker();

    // Initialize UI
    const ui = new UIController(harness, tracker);
    ui.initialize();

    // Hide loading overlay
    document.getElementById('loading-overlay').style.display = 'none';

    console.log('Weapon Debug Tool initialized successfully!');
  } catch (e) {
    console.error('Failed to initialize:', e);
    document.getElementById('loading-text').textContent = 'Error: ' + e.message;
  }
}

// Start
main();
