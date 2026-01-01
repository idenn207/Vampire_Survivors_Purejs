/**
 * @fileoverview PropertyVerifier - Compare measured vs expected weapon properties
 */

// Verification rules organized by category
export const VERIFICATION_RULES = {
  basic: [
    { name: 'Damage', property: 'damage', stat: 'damage_dealt', mode: 'range', tolerance: 0.6, description: 'Base damage per hit' },
    { name: 'Cooldown', property: 'cooldown', stat: 'fire_interval', mode: 'timing', tolerance: 0.15, description: 'Time between attacks' },
    { name: 'Range', property: 'range', stat: 'hit_distance', mode: 'range', tolerance: 0.3, description: 'Attack range (distance to hit)' }
  ],
  critical: [
    { name: 'Crit Chance', property: 'critChance', stat: 'crit_rate', mode: 'probability', minSamples: 50, description: 'Critical hit probability' },
    { name: 'Crit Multiplier', property: 'critMultiplier', stat: 'crit_damage_ratio', mode: 'range', tolerance: 0.15, description: 'Critical damage multiplier' }
  ],
  projectile: [
    { name: 'Projectile Count', property: 'projectileCount', stat: 'projectiles_spawned', mode: 'exact', description: 'Projectiles per attack' },
    { name: 'Pierce', property: 'pierce', stat: 'max_pierce_used', mode: 'minimum', description: 'Enemies pierced per projectile' },
    { name: 'Projectile Speed', property: 'projectileSpeed', stat: 'projectile_travel_speed', mode: 'range', tolerance: 0.2, description: 'Projectile velocity' }
  ],
  area: [
    { name: 'Tick Damage', property: 'tickDamage', stat: 'area_tick_damage', mode: 'range', tolerance: 0.1, description: 'Damage per area tick' },
    { name: 'Tick Rate', property: 'tickRate', stat: 'tick_interval', mode: 'timing', tolerance: 0.1, description: 'Time between damage ticks' }
  ],
  statusEffect: [
    { name: 'Effect Type', property: 'statusEffect.type', stat: 'effect_type', mode: 'presence', description: 'Status effect applied' },
    { name: 'Effect Proc Rate', property: 'statusEffect.chance', stat: 'effect_proc_rate', mode: 'probability', minSamples: 30, description: 'Effect application chance' },
    { name: 'DOT Damage', property: 'statusEffect.damage', stat: 'dot_tick_damage', mode: 'exact', description: 'Damage over time per tick' }
  ],
  special: [
    { name: 'Ricochet Bounces', property: 'ricochet.bounces', stat: 'ricochet_bounces', mode: 'maximum', description: 'Max projectile bounces' },
    { name: 'Lifesteal', property: 'lifesteal', stat: 'lifesteal_percent', mode: 'percentage', tolerance: 0.05, description: 'Health restored per damage' },
    { name: 'Knockback', property: 'knockback', stat: 'knockback_applied', mode: 'presence', description: 'Knockback force on hit' },
    { name: 'Chain Count', property: 'chainCount', stat: 'chain_hits', mode: 'maximum', description: 'Chain lightning targets' }
  ],
  melee: [
    { name: 'Arc Angle', property: 'arcAngle', stat: 'melee_arc_angle', mode: 'range', tolerance: 0.1, description: 'Swing arc width in degrees' },
    { name: 'Hits Per Swing', property: 'hitsPerSwing', stat: 'melee_hits_per_swing', mode: 'exact', description: 'Damage instances per swing' },
    { name: 'Swing Duration', property: 'swingDuration', stat: 'melee_swing_duration', mode: 'timing', tolerance: 0.15, description: 'Time to complete swing' },
    { name: 'Double Swing', property: 'doubleSwing', stat: 'melee_double_swing', mode: 'presence', description: 'Weapon swings twice per attack' }
  ],
  mine: [
    { name: 'Max Mines', property: 'maxMines', stat: 'mine_active_count', mode: 'maximum', description: 'Maximum deployable mines' },
    { name: 'Explosion Radius', property: 'explosionRadius', stat: 'mine_explosion_radius', mode: 'range', tolerance: 0.15, description: 'Mine blast radius' },
    { name: 'Trigger Radius', property: 'triggerRadius', stat: 'mine_trigger_radius', mode: 'range', tolerance: 0.15, description: 'Enemy detection range' },
    { name: 'Detonation Time', property: 'detonationTime', stat: 'mine_detonation_time', mode: 'timing', tolerance: 0.2, description: 'Time until timed explosion' }
  ],
  summon: [
    { name: 'Summon Count', property: 'summonCount', stat: 'summon_active_count', mode: 'exact', description: 'Number of active summons' },
    { name: 'Summon Duration', property: 'summonDuration', stat: 'summon_lifetime', mode: 'timing', tolerance: 0.15, description: 'Time summon stays active' },
    { name: 'Summon Damage', property: 'summonStats.damage', stat: 'summon_damage_dealt', mode: 'range', tolerance: 0.3, description: 'Damage dealt by summons' },
    { name: 'Summon Attack Rate', property: 'summonStats.attackCooldown', stat: 'summon_attack_interval', mode: 'timing', tolerance: 0.2, description: 'Time between summon attacks' }
  ],
  laser: [
    { name: 'Laser Width', property: 'width', stat: 'laser_width', mode: 'range', tolerance: 0.15, description: 'Beam width in pixels' },
    { name: 'Laser Duration', property: 'duration', stat: 'laser_duration', mode: 'timing', tolerance: 0.15, description: 'Time beam stays active' },
    { name: 'Hits Per Second', property: 'hitsPerSecond', stat: 'laser_hit_rate', mode: 'range', tolerance: 0.2, description: 'Damage ticks per second' }
  ],
  // ========================================
  // Advanced Weapon Systems
  // ========================================
  killStacking: [
    { name: 'Kill Stack Enabled', property: 'killStacking.enabled', stat: 'killstack_active', mode: 'presence', description: 'Kill stacking system active' },
    { name: 'Damage Per Kill', property: 'killStacking.damagePerKill', stat: 'killstack_damage_per_kill', mode: 'range', tolerance: 0.1, description: 'Bonus damage per kill' },
    { name: 'Max Stacks', property: 'killStacking.maxStacks', stat: 'killstack_current', mode: 'maximum', description: 'Maximum kill stacks' },
    { name: 'Stack Growth', property: 'killStacking.enabled', stat: 'killstack_growth_detected', mode: 'presence', description: 'Damage increases with kills' }
  ],
  voidRift: [
    { name: 'Rift Creation', property: 'voidRift.chanceToCreate', stat: 'voidrift_created', mode: 'probability', minSamples: 20, description: 'Chance to create rift on kill' },
    { name: 'Rift Duration', property: 'voidRift.riftDuration', stat: 'voidrift_duration', mode: 'timing', tolerance: 0.2, description: 'How long rift persists' },
    { name: 'Rift Radius', property: 'voidRift.riftRadius', stat: 'voidrift_radius', mode: 'range', tolerance: 0.15, description: 'Rift damage area' },
    { name: 'Rift Damage', property: 'voidRift.riftDamage', stat: 'voidrift_tick_damage', mode: 'range', tolerance: 0.2, description: 'Damage per rift tick' },
    { name: 'Max Rifts', property: 'voidRift.maxRifts', stat: 'voidrift_active_count', mode: 'maximum', description: 'Maximum simultaneous rifts' },
    { name: 'Pull Force', property: 'voidRift.pullForce', stat: 'voidrift_pull_detected', mode: 'presence', description: 'Enemies pulled toward rift' }
  ],
  soulCollection: [
    { name: 'Souls Per Kill', property: 'soulCollection.soulsPerKill', stat: 'soul_per_kill', mode: 'exact', description: 'Souls gained per enemy kill' },
    { name: 'Max Souls', property: 'soulCollection.maxSouls', stat: 'soul_current', mode: 'maximum', description: 'Maximum collectible souls' },
    { name: 'Soul Orbit Active', property: 'soulCollection.soulOrbit', stat: 'soul_orbit_active', mode: 'presence', description: 'Souls orbiting player' },
    { name: 'Orbit Damage', property: 'orbitDamage', stat: 'soul_orbit_damage', mode: 'range', tolerance: 0.2, description: 'Passive orbit damage' },
    { name: 'Soul Explosion', property: 'soulExplosion', stat: 'soul_explosion_triggered', mode: 'presence', description: 'Soul explosion on hit' }
  ],
  soulStorm: [
    { name: 'Storm Trigger', property: 'soulStorm.soulsRequired', stat: 'soulstorm_triggered', mode: 'presence', description: 'Soul storm activated' },
    { name: 'Storm Duration', property: 'soulStorm.duration', stat: 'soulstorm_duration', mode: 'timing', tolerance: 0.15, description: 'Storm effect duration' },
    { name: 'Storm Radius', property: 'soulStorm.radius', stat: 'soulstorm_radius', mode: 'range', tolerance: 0.15, description: 'Storm effect area' },
    { name: 'Barrage Damage', property: 'soulStorm.soulBarrage.damage', stat: 'soulstorm_barrage_damage', mode: 'range', tolerance: 0.2, description: 'Homing soul projectile damage' },
    { name: 'Aura Damage', property: 'soulStorm.damageAura.damagePerSecond', stat: 'soulstorm_aura_dps', mode: 'range', tolerance: 0.2, description: 'Passive aura DPS' }
  ],
  heatSystem: [
    { name: 'Heat Buildup', property: 'heatSystem.enabled', stat: 'heat_current', mode: 'presence', description: 'Heat system active' },
    { name: 'Max Heat', property: 'heatSystem.maxHeat', stat: 'heat_current', mode: 'maximum', description: 'Maximum heat level' },
    { name: 'Heat Per Shot', property: 'heatSystem.heatPerShot', stat: 'heat_per_shot', mode: 'range', tolerance: 0.1, description: 'Heat gained per attack' },
    { name: 'Heat Decay', property: 'heatSystem.heatDecayRate', stat: 'heat_decay_rate', mode: 'range', tolerance: 0.2, description: 'Heat lost per second' },
    { name: 'Overcharge Trigger', property: 'overcharge', stat: 'heat_overcharge_triggered', mode: 'presence', description: 'Overcharge mode activated' },
    { name: 'Overcharge Damage', property: 'overcharge.damageMultiplier', stat: 'heat_overcharge_damage_mult', mode: 'range', tolerance: 0.15, description: 'Damage multiplier during overcharge' }
  ],
  channelGrowth: [
    { name: 'Channel Active', property: 'channelGrowth', stat: 'channel_active', mode: 'presence', description: 'Channeling weapon active' },
    { name: 'Damage Growth', property: 'channelGrowth.damageGrowth', stat: 'channel_damage_growth', mode: 'range', tolerance: 0.2, description: 'Damage increase rate while channeling' },
    { name: 'Width Growth', property: 'channelGrowth.widthGrowth', stat: 'channel_width_growth', mode: 'range', tolerance: 0.2, description: 'Beam width increase rate' },
    { name: 'Heat Stack', property: 'channelGrowth.heatStack', stat: 'channel_heat_stacks', mode: 'presence', description: 'Heat stacking on enemies' },
    { name: 'Solar Flare', property: 'solarFlare', stat: 'channel_flare_triggered', mode: 'presence', description: 'Solar flare triggered on release' },
    { name: 'Flare Damage', property: 'solarFlare.damage', stat: 'channel_flare_damage', mode: 'range', tolerance: 0.2, description: 'Solar flare explosion damage' },
    { name: 'Flare Radius', property: 'solarFlare.radius', stat: 'channel_flare_radius', mode: 'range', tolerance: 0.15, description: 'Solar flare effect radius' }
  ],
  chainReaction: [
    { name: 'Chain Enabled', property: 'chainReaction', stat: 'chain_reaction_active', mode: 'presence', description: 'Mine chain reaction enabled' },
    { name: 'Chain Trigger Radius', property: 'chainReaction.triggerRadius', stat: 'chain_trigger_radius', mode: 'range', tolerance: 0.15, description: 'Distance to trigger adjacent mines' },
    { name: 'Chain Delay', property: 'chainReaction.chainDelay', stat: 'chain_delay', mode: 'timing', tolerance: 0.2, description: 'Time between chain explosions' },
    { name: 'Chain Damage Mult', property: 'chainReaction.damageMultiplierPerChain', stat: 'chain_damage_multiplier', mode: 'range', tolerance: 0.15, description: 'Damage scaling per chain' },
    { name: 'Chain Count', property: 'chainReaction', stat: 'chain_explosion_count', mode: 'minimum', description: 'Number of chained explosions' }
  ]
};

class PropertyVerifier {
  constructor(statTracker) {
    this._statTracker = statTracker;
    this._expectedProperties = {};
    this._applicableRules = [];
    this._weaponData = null;
  }

  /**
   * Get nested property from object using dot notation
   */
  _getNestedProperty(obj, path) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      if (current === undefined || current === null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  /**
   * Set expected properties from weapon data
   */
  setExpectedFromWeapon(weaponData) {
    this._weaponData = weaponData;
    this._expectedProperties = {};
    this._applicableRules = [];

    // Determine which rules apply based on weapon configuration
    for (const category in VERIFICATION_RULES) {
      const rules = VERIFICATION_RULES[category];
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const expectedValue = this._getNestedProperty(weaponData, rule.property);

        // Check if this property exists in the weapon
        if (expectedValue !== undefined && expectedValue !== null) {
          this._applicableRules.push({
            category: category,
            rule: rule,
            expected: expectedValue
          });
        }
      }
    }

    return this._applicableRules;
  }

  /**
   * Verify a single rule against measured data
   */
  _verifyRule(ruleEntry) {
    const rule = ruleEntry.rule;
    const expected = ruleEntry.expected;
    const result = {
      name: rule.name,
      property: rule.property,
      category: ruleEntry.category,
      expected: expected,
      measured: null,
      status: 'pending', // pending, pass, fail, insufficient
      message: '',
      description: rule.description
    };

    // Get measured value based on stat type
    const stats = this._statTracker.getStats(rule.stat);

    switch (rule.mode) {
      case 'exact':
        if (!stats) {
          result.status = 'pending';
          result.message = 'No data yet';
        } else {
          // For exact match, use the most common value or average
          result.measured = Math.round(stats.avg);
          result.status = (result.measured === expected) ? 'pass' : 'fail';
          result.message = result.status === 'pass' ? 'Matches expected' : 'Expected ' + expected + ', got ' + result.measured;
        }
        break;

      case 'range':
        if (!stats) {
          result.status = 'pending';
          result.message = 'No data yet';
        } else {
          const tolerance = rule.tolerance || 0.5;
          const minExpected = expected * (1 - tolerance);
          const maxExpected = expected * (1 + tolerance);
          result.measured = stats.min + '-' + stats.max + ' (avg ' + stats.avg.toFixed(1) + ')';

          // Pass if average is within range or min/max encompasses expected
          if (stats.avg >= minExpected && stats.avg <= maxExpected) {
            result.status = 'pass';
            result.message = 'Within expected range';
          } else {
            result.status = 'fail';
            result.message = 'Expected ~' + expected + ' (\u00B1' + Math.round(tolerance * 100) + '%)';
          }
        }
        break;

      case 'minimum':
        if (!stats) {
          result.status = 'pending';
          result.message = 'No data yet';
        } else {
          result.measured = stats.max;
          result.status = (stats.max >= expected) ? 'pass' : 'pending';
          result.message = result.status === 'pass' ? 'Achieved ' + stats.max + ' (expected ' + expected + ')' : 'Max observed: ' + stats.max;
        }
        break;

      case 'maximum':
        if (!stats) {
          result.status = 'pending';
          result.message = 'No data yet';
        } else {
          result.measured = stats.max;
          result.status = (stats.max <= expected) ? 'pass' : 'fail';
          result.message = 'Max: ' + stats.max + ' / ' + expected;
        }
        break;

      case 'timing':
        if (!stats || stats.count < 3) {
          result.status = 'pending';
          result.message = 'Need more samples (n=' + (stats ? stats.count : 0) + ')';
        } else {
          const timingTolerance = rule.tolerance || 0.15;
          result.measured = stats.avg.toFixed(2) + 's';
          const diff = Math.abs(stats.avg - expected) / expected;
          result.status = (diff <= timingTolerance) ? 'pass' : 'fail';
          result.message = result.status === 'pass' ? 'Matches expected timing' : 'Expected ' + expected + 's';
        }
        break;

      case 'probability':
        const procResult = this._statTracker.getProcRate(rule.stat, 'total_hits');
        const minSamples = rule.minSamples || 30;

        if (!procResult || procResult.hitCount < minSamples) {
          result.status = 'insufficient';
          result.measured = procResult ? (procResult.rate * 100).toFixed(1) + '% (n=' + procResult.hitCount + ')' : 'No data';
          result.message = 'Need ' + minSamples + '+ samples';
        } else {
          result.measured = (procResult.rate * 100).toFixed(1) + '% (n=' + procResult.hitCount + ')';
          // Allow +/-25% deviation for probability
          const expectedRate = typeof expected === 'number' ? expected : 1.0;
          const deviation = Math.abs(procResult.rate - expectedRate) / expectedRate;
          result.status = (deviation <= 0.25) ? 'pass' : 'fail';
          result.message = 'Expected ' + (expectedRate * 100).toFixed(0) + '%';
        }
        break;

      case 'percentage':
        const lifestealStats = this._statTracker.getStats(rule.stat);
        if (!lifestealStats) {
          result.status = 'pending';
          result.message = 'No data yet';
        } else {
          result.measured = (lifestealStats.avg * 100).toFixed(1) + '%';
          const pctTolerance = rule.tolerance || 0.05;
          const pctDiff = Math.abs(lifestealStats.avg - expected);
          result.status = (pctDiff <= pctTolerance) ? 'pass' : 'fail';
          result.message = 'Expected ' + (expected * 100).toFixed(0) + '%';
        }
        break;

      case 'presence':
        const count = this._statTracker.getCount(rule.stat);
        result.measured = count > 0 ? 'Yes (' + count + 'x)' : 'No';
        result.status = count > 0 ? 'pass' : 'pending';
        result.message = count > 0 ? 'Effect detected' : 'Waiting for trigger';
        break;

      default:
        result.status = 'pending';
        result.message = 'Unknown verification mode';
    }

    return result;
  }

  /**
   * Run all applicable verifications
   */
  verify() {
    const results = [];
    for (let i = 0; i < this._applicableRules.length; i++) {
      results.push(this._verifyRule(this._applicableRules[i]));
    }
    return results;
  }

  /**
   * Get summary of verification status
   */
  getSummary() {
    const results = this.verify();
    let passed = 0;
    let failed = 0;
    let pending = 0;
    let insufficient = 0;

    for (let i = 0; i < results.length; i++) {
      switch (results[i].status) {
        case 'pass': passed++; break;
        case 'fail': failed++; break;
        case 'insufficient': insufficient++; break;
        default: pending++; break;
      }
    }

    return {
      total: results.length,
      passed: passed,
      failed: failed,
      pending: pending,
      insufficient: insufficient,
      allPassed: failed === 0 && pending === 0 && insufficient === 0
    };
  }

  /**
   * Get applicable rules for display
   */
  getApplicableRules() {
    return this._applicableRules;
  }

  /**
   * Reset verifier state
   */
  reset() {
    this._applicableRules = [];
    this._weaponData = null;
  }
}

export { PropertyVerifier };
export default PropertyVerifier;
