/**
 * @fileoverview EventTracker - Event monitoring and verification system
 */

import { StatTracker } from './StatTracker.js';
import { PropertyVerifier } from './PropertyVerifier.js';

class EventTracker {
  constructor() {
    this._expectedEffects = {};
    this._detectedEvents = {};
    this._eventCounts = {};
    this._previouslyDetected = {};
    this._listeners = [];
    this._onEventCallback = null;
    this._statTracker = null;
    this._propertyVerifier = null;
  }

  setExpectedFromWeapon(weaponData) {
    this._expectedEffects = {};

    // Always expect weapon:fired
    this._expectedEffects['weapon:fired'] = true;

    // Expect weapon:hit if damage > 0
    if (weaponData.damage > 0) {
      this._expectedEffects['weapon:hit'] = true;
    }

    // Lifesteal
    if (weaponData.lifesteal) {
      this._expectedEffects['player:lifesteal'] = true;
    }

    // Heal on hit
    if (weaponData.healOnHit) {
      this._expectedEffects['player:healed'] = true;
    }

    // Status effects
    if (weaponData.statusEffects && weaponData.statusEffects.length > 0) {
      weaponData.statusEffects.forEach((effect) => {
        if (effect && effect.type) {
          this._expectedEffects['buffdebuff:' + effect.type.toLowerCase()] = true;
        }
      });
    }

    // Single status effect
    if (weaponData.statusEffect && weaponData.statusEffect.type) {
      this._expectedEffects['buffdebuff:' + weaponData.statusEffect.type.toLowerCase()] = true;
    }

    // Ricochet
    if (weaponData.ricochet && weaponData.ricochet.enabled) {
      this._expectedEffects['projectile:ricochet'] = true;
    }

    // On-kill effects
    if (weaponData.onKill) {
      this._expectedEffects['weapon:on_kill'] = true;
    }

    // Explosions (from various sources)
    if (weaponData.explosionRadius || (weaponData.onKill && weaponData.onKill.explosion)) {
      this._expectedEffects['effect:explosion'] = true;
    }

    // Cascade
    if (weaponData.cascade && weaponData.cascade.enabled) {
      this._expectedEffects['cascade:active'] = true;
    }

    // Split
    if (weaponData.split && weaponData.split.enabled) {
      this._expectedEffects['projectile:split'] = true;
    }

    // Knockback (tracked via weapon:hit)
    if (weaponData.knockback && weaponData.knockback > 0) {
      this._expectedEffects['knockback'] = true;
    }

    // Entity death (for on-kill verification)
    this._expectedEffects['entity:died'] = true;

    // ========================================
    // Attack Type Specific Expected Events
    // ========================================
    const AttackType = window.VampireSurvivors.Data.AttackType;

    // MINE weapons
    if (weaponData.attackType === 'MINE' ||
        (AttackType && weaponData.attackType === AttackType.MINE)) {
      this._expectedEffects['mine:deployed'] = true;
      this._expectedEffects['mine:triggered'] = true;
      if (weaponData.explosionRadius) {
        this._expectedEffects['effect:explosion'] = true;
      }
    }

    // SUMMON weapons
    if (weaponData.attackType === 'SUMMON' ||
        (AttackType && weaponData.attackType === AttackType.SUMMON)) {
      this._expectedEffects['summon:spawned'] = true;
      if (weaponData.summonDuration && weaponData.summonDuration > 0) {
        this._expectedEffects['summon:expired'] = true;
      }
    }

    // MELEE weapons (already tracked via weapon:hit with type='melee')
    // LASER weapons (already tracked via weapon:hit with type='laser')

    // ========================================
    // Advanced Weapon System Expected Events
    // ========================================

    // Kill Stacking System (Void Reaver)
    if (weaponData.killStacking && weaponData.killStacking.enabled) {
      this._expectedEffects['killstack:increased'] = true;
    }

    // Void Rift System (Void Reaver)
    if (weaponData.voidRift) {
      this._expectedEffects['voidrift:created'] = true;
      this._expectedEffects['voidrift:damage'] = true;
    }

    // Soul Collection System (Soul Nexus)
    if (weaponData.soulCollection) {
      this._expectedEffects['soul:collected'] = true;
      if (weaponData.soulCollection.soulOrbit) {
        this._expectedEffects['soul:orbit_active'] = true;
      }
    }
    if (weaponData.soulExplosion) {
      this._expectedEffects['soul:explosion'] = true;
    }

    // Soul Storm Ultimate (Soul Nexus)
    if (weaponData.soulStorm) {
      this._expectedEffects['soulstorm:activated'] = true;
      if (weaponData.soulStorm.soulBarrage) {
        this._expectedEffects['soulstorm:barrage'] = true;
      }
      if (weaponData.soulStorm.damageAura) {
        this._expectedEffects['soulstorm:aura'] = true;
      }
    }

    // Heat Buildup System (Dragonbreath Volley)
    if (weaponData.heatSystem) {
      this._expectedEffects['heat:changed'] = true;
      if (weaponData.overcharge) {
        this._expectedEffects['heat:overcharge'] = true;
      }
    }

    // Channel Growth System (Sunbeam)
    if (weaponData.channelGrowth) {
      this._expectedEffects['channel:started'] = true;
      this._expectedEffects['channel:growth'] = true;
    }
    if (weaponData.solarFlare) {
      this._expectedEffects['channel:flare'] = true;
    }

    // Mine Chain Reaction
    if (weaponData.chainReaction) {
      this._expectedEffects['mine:chain_triggered'] = true;
    }

    return this._expectedEffects;
  }

  _subscribe(events, eventName, callback) {
    events.on(eventName, callback);
    this._listeners.push({ events: events, name: eventName, callback: callback });
  }

  startTracking() {
    const events = window.VampireSurvivors.Core.events;
    if (!events) return;

    this._detectedEvents = {};
    this._eventCounts = {};

    // Initialize StatTracker if not already done
    if (!this._statTracker) {
      this._statTracker = new StatTracker();
    } else {
      this._statTracker.reset();
    }

    const self = this;

    const trackEvent = (eventName, specificKey) => {
      return (data) => {
        self._detectedEvents[eventName] = true;
        self._eventCounts[eventName] = (self._eventCounts[eventName] || 0) + 1;

        if (specificKey) {
          self._detectedEvents[specificKey] = true;
          self._eventCounts[specificKey] = (self._eventCounts[specificKey] || 0) + 1;
        }

        if (self._onEventCallback) {
          self._onEventCallback(eventName, data);
        }
      };
    };

    // Core weapon events - Enhanced with numeric tracking
    this._subscribe(events, 'weapon:fired', (data) => {
      self._detectedEvents['weapon:fired'] = true;
      self._eventCounts['weapon:fired'] = (self._eventCounts['weapon:fired'] || 0) + 1;

      // Track fire timing for cooldown verification
      if (self._statTracker) {
        self._statTracker.recordFire();

        // Track projectile count from result
        if (data && data.result && Array.isArray(data.result)) {
          self._statTracker.record('projectiles_spawned', data.result.length);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('weapon:fired', data);
      }
    });

    this._subscribe(events, 'weapon:hit', (data) => {
      self._detectedEvents['weapon:hit'] = true;
      self._eventCounts['weapon:hit'] = (self._eventCounts['weapon:hit'] || 0) + 1;

      // Track knockback from hit data
      if (data && data.knockback) {
        self._detectedEvents['knockback'] = true;
        if (self._statTracker) {
          self._statTracker.record('knockback_applied', 1);
        }
      }

      // Enhanced: Track numeric damage and pierce data
      if (self._statTracker && data) {
        // Track damage dealt
        if (typeof data.damage === 'number') {
          self._statTracker.record('damage_dealt', data.damage);
          self._statTracker.record('total_hits', 1);

          // Track critical hits and crit damage ratio
          // Note: Only record crit_rate on crits; probability is calculated via getProcRate
          if (data.isCrit) {
            self._statTracker.record('crit_rate', 1);
            // Calculate crit damage ratio if we have base damage info
            if (data.baseDamage && data.baseDamage > 0) {
              const critRatio = data.damage / data.baseDamage;
              self._statTracker.record('crit_damage_ratio', critRatio);
            } else {
              // Fallback: estimate base damage from weapon data or use default 2.0x
              self._statTracker.record('crit_damage_ratio', 2.0);
            }
          }
        }

        // Track hit distance from player (for range verification)
        if (data.enemy || data.target) {
          const target = data.enemy || data.target;
          const player = self._getPlayer();
          if (player && target) {
            const distance = self._calculateDistance(player, target);
            if (distance > 0) {
              self._statTracker.record('hit_distance', distance);
            }
          }
        }

        // ========================================
        // Attack Type Specific Tracking
        // ========================================
        const hitType = data.type || 'unknown';

        // MELEE tracking
        if (hitType === 'melee') {
          // Track melee-specific data from weapon component
          if (data.weapon) {
            const weaponComp = data.weapon;
            if (weaponComp.arcAngle) {
              self._statTracker.record('melee_arc_angle', weaponComp.arcAngle);
            }
            if (weaponComp.hitsPerSwing) {
              self._statTracker.record('melee_hits_per_swing', weaponComp.hitsPerSwing);
            }
            if (weaponComp.swingDuration) {
              self._statTracker.record('melee_swing_duration', weaponComp.swingDuration);
            }
            if (weaponComp.doubleSwing) {
              self._statTracker.record('melee_double_swing', 1);
            }
          }
        }

        // LASER tracking
        if (hitType === 'laser') {
          if (data.weapon) {
            const weaponComp = data.weapon;
            if (weaponComp.width) {
              self._statTracker.record('laser_width', weaponComp.width);
            }
            if (weaponComp.duration) {
              self._statTracker.record('laser_duration', weaponComp.duration);
            }
          }
          // Track laser hit rate (hits per second)
          self._statTracker.record('laser_hit_rate', 1);
        }

        // SUMMON tracking
        if (hitType === 'summon') {
          self._statTracker.record('summon_damage_dealt', data.damage || 0);
          // Track summon attack timing
          self._statTracker.recordFire(); // Reuse fire timing for summon attacks
        }

        // MINE tracking (hits from mine explosions)
        if (hitType === 'mine') {
          // Mine explosion data is tracked via effect:explosion event
        }

        // Track pierce from projectile component
        if (data.hitbox) {
          const Components = window.VampireSurvivors.Components;
          if (Components && Components.Projectile) {
            const projComp = data.hitbox.getComponent(Components.Projectile);
            if (projComp && projComp._hitEnemies) {
              const pierceUsed = projComp._hitEnemies.size;
              self._statTracker.record('max_pierce_used', pierceUsed);

              // Track per-projectile data
              const projId = data.hitbox.id || ('proj_' + Date.now());
              self._statTracker.recordProjectile(projId, 'pierceCount', pierceUsed);
            }

            // Track projectile speed if available
            if (projComp && projComp._speed) {
              self._statTracker.record('projectile_travel_speed', projComp._speed);
            }
          }

          // Alternative: get speed from Velocity component
          if (Components && Components.Velocity) {
            const velComp = data.hitbox.getComponent(Components.Velocity);
            if (velComp) {
              const speed = Math.sqrt(velComp.x * velComp.x + velComp.y * velComp.y);
              if (speed > 0) {
                self._statTracker.record('projectile_travel_speed', speed);
              }
            }
          }
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('weapon:hit', data);
      }
    });

    this._subscribe(events, 'weapon:on_kill', trackEvent('weapon:on_kill'));

    // Projectile events - Enhanced with ricochet tracking
    this._subscribe(events, 'projectile:ricochet', (data) => {
      self._detectedEvents['projectile:ricochet'] = true;
      self._eventCounts['projectile:ricochet'] = (self._eventCounts['projectile:ricochet'] || 0) + 1;

      // Track ricochet bounces
      if (self._statTracker && data) {
        self._statTracker.record('ricochet_bounces', 1);
        if (typeof data.remainingBounces === 'number') {
          // Track max bounces achieved (inverse of remaining)
          const bouncesUsed = (data.initialBounces || 0) - data.remainingBounces;
          if (bouncesUsed > 0) {
            self._statTracker.record('ricochet_bounces_used', bouncesUsed);
          }
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('projectile:ricochet', data);
      }
    });

    // Buff/Debuff events - Enhanced with effect type tracking
    this._subscribe(events, 'buffdebuff:applied', (data) => {
      self._detectedEvents['buffdebuff:applied'] = true;
      self._eventCounts['buffdebuff:applied'] = (self._eventCounts['buffdebuff:applied'] || 0) + 1;

      if (data && data.effectId) {
        const key = 'buffdebuff:' + data.effectId.toLowerCase();
        self._detectedEvents[key] = true;
        self._eventCounts[key] = (self._eventCounts[key] || 0) + 1;

        // Track effect application for proc rate calculation
        if (self._statTracker) {
          self._statTracker.record('effect_proc_rate', 1);
          self._statTracker.record('effect_type_' + data.effectId.toLowerCase(), 1);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('buffdebuff:applied', data);
      }
    });

    // DOT damage tracking
    this._subscribe(events, 'buffdebuff:dot_damage', (data) => {
      self._detectedEvents['buffdebuff:dot_damage'] = true;
      self._eventCounts['buffdebuff:dot_damage'] = (self._eventCounts['buffdebuff:dot_damage'] || 0) + 1;

      if (self._statTracker && data && typeof data.damage === 'number') {
        self._statTracker.record('dot_tick_damage', data.damage);
      }

      if (self._onEventCallback) {
        self._onEventCallback('buffdebuff:dot_damage', data);
      }
    });

    // Healing events - Enhanced with amount tracking
    this._subscribe(events, 'player:lifesteal', (data) => {
      self._detectedEvents['player:lifesteal'] = true;
      self._eventCounts['player:lifesteal'] = (self._eventCounts['player:lifesteal'] || 0) + 1;

      if (self._statTracker && data && typeof data.amount === 'number') {
        self._statTracker.record('lifesteal_amount', data.amount);
        // Calculate lifesteal percentage if we have damage data
        const damageStats = self._statTracker.getStats('damage_dealt');
        if (damageStats && damageStats.count > 0) {
          const avgDamage = damageStats.avg;
          if (avgDamage > 0) {
            self._statTracker.record('lifesteal_percent', data.amount / avgDamage);
          }
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('player:lifesteal', data);
      }
    });

    this._subscribe(events, 'player:healed', trackEvent('player:healed'));

    // Explosion events - Enhanced with radius/damage tracking
    this._subscribe(events, 'effect:explosion', (data) => {
      self._detectedEvents['effect:explosion'] = true;
      self._eventCounts['effect:explosion'] = (self._eventCounts['effect:explosion'] || 0) + 1;

      if (self._statTracker && data) {
        if (typeof data.radius === 'number') {
          self._statTracker.record('explosion_radius', data.radius);
          // Track mine explosion radius specifically
          self._statTracker.record('mine_explosion_radius', data.radius);
        }
        if (typeof data.damage === 'number') {
          self._statTracker.record('explosion_damage', data.damage);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('effect:explosion', data);
      }
    });

    // ========================================
    // Mine-specific events
    // ========================================
    this._subscribe(events, 'mine:deployed', (data) => {
      self._detectedEvents['mine:deployed'] = true;
      self._eventCounts['mine:deployed'] = (self._eventCounts['mine:deployed'] || 0) + 1;

      if (self._statTracker && data) {
        // Track active mine count
        if (typeof data.activeCount === 'number') {
          self._statTracker.record('mine_active_count', data.activeCount);
        }
        // Track trigger radius
        if (typeof data.triggerRadius === 'number') {
          self._statTracker.record('mine_trigger_radius', data.triggerRadius);
        }
        // Track detonation time for timed mines
        if (typeof data.detonationTime === 'number') {
          self._statTracker.record('mine_detonation_time', data.detonationTime);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('mine:deployed', data);
      }
    });

    this._subscribe(events, 'mine:triggered', (data) => {
      self._detectedEvents['mine:triggered'] = true;
      self._eventCounts['mine:triggered'] = (self._eventCounts['mine:triggered'] || 0) + 1;

      if (self._onEventCallback) {
        self._onEventCallback('mine:triggered', data);
      }
    });

    // ========================================
    // Summon-specific events
    // ========================================
    this._subscribe(events, 'summon:spawned', (data) => {
      self._detectedEvents['summon:spawned'] = true;
      self._eventCounts['summon:spawned'] = (self._eventCounts['summon:spawned'] || 0) + 1;

      if (self._statTracker && data) {
        // Track active summon count
        if (typeof data.activeCount === 'number') {
          self._statTracker.record('summon_active_count', data.activeCount);
        }
        // Track summon lifetime/duration
        if (typeof data.duration === 'number') {
          self._statTracker.record('summon_lifetime', data.duration);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('summon:spawned', data);
      }
    });

    this._subscribe(events, 'summon:attack', (data) => {
      self._detectedEvents['summon:attack'] = true;
      self._eventCounts['summon:attack'] = (self._eventCounts['summon:attack'] || 0) + 1;

      if (self._statTracker && data) {
        // Track summon attack interval
        self._statTracker.record('summon_attack_interval', 1);
      }

      if (self._onEventCallback) {
        self._onEventCallback('summon:attack', data);
      }
    });

    this._subscribe(events, 'summon:expired', (data) => {
      self._detectedEvents['summon:expired'] = true;
      self._eventCounts['summon:expired'] = (self._eventCounts['summon:expired'] || 0) + 1;

      if (self._onEventCallback) {
        self._onEventCallback('summon:expired', data);
      }
    });

    // Entity death
    this._subscribe(events, 'entity:died', trackEvent('entity:died'));

    // Chain/cascade events
    this._subscribe(events, 'cascade:active', (data) => {
      self._detectedEvents['cascade:active'] = true;
      self._eventCounts['cascade:active'] = (self._eventCounts['cascade:active'] || 0) + 1;

      if (self._statTracker && data && typeof data.chainCount === 'number') {
        self._statTracker.record('chain_hits', data.chainCount);
      }

      if (self._onEventCallback) {
        self._onEventCallback('cascade:active', data);
      }
    });

    // Split events
    this._subscribe(events, 'projectile:split', trackEvent('projectile:split'));

    // ========================================
    // Advanced Weapon System Events
    // ========================================

    // Kill Stacking System (Void Reaver)
    this._subscribe(events, 'killstack:increased', (data) => {
      self._detectedEvents['killstack:increased'] = true;
      self._eventCounts['killstack:increased'] = (self._eventCounts['killstack:increased'] || 0) + 1;

      if (self._statTracker && data) {
        self._statTracker.record('killstack_active', 1);
        if (typeof data.currentStacks === 'number') {
          self._statTracker.record('killstack_current', data.currentStacks);
        }
        if (typeof data.damagePerKill === 'number') {
          self._statTracker.record('killstack_damage_per_kill', data.damagePerKill);
        }
        if (typeof data.totalBonusDamage === 'number') {
          self._statTracker.record('killstack_growth_detected', 1);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('killstack:increased', data);
      }
    });

    // Void Rift System (Void Reaver)
    this._subscribe(events, 'voidrift:created', (data) => {
      self._detectedEvents['voidrift:created'] = true;
      self._eventCounts['voidrift:created'] = (self._eventCounts['voidrift:created'] || 0) + 1;

      if (self._statTracker && data) {
        self._statTracker.record('voidrift_created', 1);
        if (typeof data.activeCount === 'number') {
          self._statTracker.record('voidrift_active_count', data.activeCount);
        }
        if (typeof data.radius === 'number') {
          self._statTracker.record('voidrift_radius', data.radius);
        }
        if (typeof data.duration === 'number') {
          self._statTracker.record('voidrift_duration', data.duration);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('voidrift:created', data);
      }
    });

    this._subscribe(events, 'voidrift:damage', (data) => {
      self._detectedEvents['voidrift:damage'] = true;
      self._eventCounts['voidrift:damage'] = (self._eventCounts['voidrift:damage'] || 0) + 1;

      if (self._statTracker && data) {
        if (typeof data.damage === 'number') {
          self._statTracker.record('voidrift_tick_damage', data.damage);
        }
        if (data.pulled) {
          self._statTracker.record('voidrift_pull_detected', 1);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('voidrift:damage', data);
      }
    });

    // Soul Collection System (Soul Nexus)
    this._subscribe(events, 'soul:collected', (data) => {
      self._detectedEvents['soul:collected'] = true;
      self._eventCounts['soul:collected'] = (self._eventCounts['soul:collected'] || 0) + 1;

      if (self._statTracker && data) {
        if (typeof data.soulsGained === 'number') {
          self._statTracker.record('soul_per_kill', data.soulsGained);
        }
        if (typeof data.currentSouls === 'number') {
          self._statTracker.record('soul_current', data.currentSouls);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('soul:collected', data);
      }
    });

    this._subscribe(events, 'soul:orbit_active', (data) => {
      self._detectedEvents['soul:orbit_active'] = true;
      self._eventCounts['soul:orbit_active'] = (self._eventCounts['soul:orbit_active'] || 0) + 1;

      if (self._statTracker) {
        self._statTracker.record('soul_orbit_active', 1);
        if (data && typeof data.damage === 'number') {
          self._statTracker.record('soul_orbit_damage', data.damage);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('soul:orbit_active', data);
      }
    });

    this._subscribe(events, 'soul:explosion', (data) => {
      self._detectedEvents['soul:explosion'] = true;
      self._eventCounts['soul:explosion'] = (self._eventCounts['soul:explosion'] || 0) + 1;

      if (self._statTracker) {
        self._statTracker.record('soul_explosion_triggered', 1);
      }

      if (self._onEventCallback) {
        self._onEventCallback('soul:explosion', data);
      }
    });

    // Soul Storm Ultimate (Soul Nexus)
    this._subscribe(events, 'soulstorm:activated', (data) => {
      self._detectedEvents['soulstorm:activated'] = true;
      self._eventCounts['soulstorm:activated'] = (self._eventCounts['soulstorm:activated'] || 0) + 1;

      if (self._statTracker && data) {
        self._statTracker.record('soulstorm_triggered', 1);
        if (typeof data.duration === 'number') {
          self._statTracker.record('soulstorm_duration', data.duration);
        }
        if (typeof data.radius === 'number') {
          self._statTracker.record('soulstorm_radius', data.radius);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('soulstorm:activated', data);
      }
    });

    this._subscribe(events, 'soulstorm:barrage', (data) => {
      self._detectedEvents['soulstorm:barrage'] = true;
      self._eventCounts['soulstorm:barrage'] = (self._eventCounts['soulstorm:barrage'] || 0) + 1;

      if (self._statTracker && data && typeof data.damage === 'number') {
        self._statTracker.record('soulstorm_barrage_damage', data.damage);
      }

      if (self._onEventCallback) {
        self._onEventCallback('soulstorm:barrage', data);
      }
    });

    this._subscribe(events, 'soulstorm:aura', (data) => {
      self._detectedEvents['soulstorm:aura'] = true;
      self._eventCounts['soulstorm:aura'] = (self._eventCounts['soulstorm:aura'] || 0) + 1;

      if (self._statTracker && data && typeof data.damagePerSecond === 'number') {
        self._statTracker.record('soulstorm_aura_dps', data.damagePerSecond);
      }

      if (self._onEventCallback) {
        self._onEventCallback('soulstorm:aura', data);
      }
    });

    // Heat Buildup System (Dragonbreath Volley)
    this._subscribe(events, 'heat:changed', (data) => {
      self._detectedEvents['heat:changed'] = true;
      self._eventCounts['heat:changed'] = (self._eventCounts['heat:changed'] || 0) + 1;

      if (self._statTracker && data) {
        if (typeof data.currentHeat === 'number') {
          self._statTracker.record('heat_current', data.currentHeat);
        }
        if (typeof data.heatGained === 'number') {
          self._statTracker.record('heat_per_shot', data.heatGained);
        }
        if (typeof data.decayRate === 'number') {
          self._statTracker.record('heat_decay_rate', data.decayRate);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('heat:changed', data);
      }
    });

    this._subscribe(events, 'heat:overcharge', (data) => {
      self._detectedEvents['heat:overcharge'] = true;
      self._eventCounts['heat:overcharge'] = (self._eventCounts['heat:overcharge'] || 0) + 1;

      if (self._statTracker && data) {
        self._statTracker.record('heat_overcharge_triggered', 1);
        if (typeof data.damageMultiplier === 'number') {
          self._statTracker.record('heat_overcharge_damage_mult', data.damageMultiplier);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('heat:overcharge', data);
      }
    });

    // Channel Growth System (Sunbeam)
    this._subscribe(events, 'channel:started', (data) => {
      self._detectedEvents['channel:started'] = true;
      self._eventCounts['channel:started'] = (self._eventCounts['channel:started'] || 0) + 1;

      if (self._statTracker) {
        self._statTracker.record('channel_active', 1);
      }

      if (self._onEventCallback) {
        self._onEventCallback('channel:started', data);
      }
    });

    this._subscribe(events, 'channel:growth', (data) => {
      self._detectedEvents['channel:growth'] = true;
      self._eventCounts['channel:growth'] = (self._eventCounts['channel:growth'] || 0) + 1;

      if (self._statTracker && data) {
        if (typeof data.damageMultiplier === 'number') {
          self._statTracker.record('channel_damage_growth', data.damageMultiplier);
        }
        if (typeof data.widthMultiplier === 'number') {
          self._statTracker.record('channel_width_growth', data.widthMultiplier);
        }
        if (data.heatStacks) {
          self._statTracker.record('channel_heat_stacks', 1);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('channel:growth', data);
      }
    });

    this._subscribe(events, 'channel:flare', (data) => {
      self._detectedEvents['channel:flare'] = true;
      self._eventCounts['channel:flare'] = (self._eventCounts['channel:flare'] || 0) + 1;

      if (self._statTracker && data) {
        self._statTracker.record('channel_flare_triggered', 1);
        if (typeof data.damage === 'number') {
          self._statTracker.record('channel_flare_damage', data.damage);
        }
        if (typeof data.radius === 'number') {
          self._statTracker.record('channel_flare_radius', data.radius);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('channel:flare', data);
      }
    });

    // Mine Chain Reaction
    this._subscribe(events, 'mine:chain_triggered', (data) => {
      self._detectedEvents['mine:chain_triggered'] = true;
      self._eventCounts['mine:chain_triggered'] = (self._eventCounts['mine:chain_triggered'] || 0) + 1;

      if (self._statTracker && data) {
        self._statTracker.record('chain_reaction_active', 1);
        if (typeof data.chainCount === 'number') {
          self._statTracker.record('chain_explosion_count', data.chainCount);
        }
        if (typeof data.triggerRadius === 'number') {
          self._statTracker.record('chain_trigger_radius', data.triggerRadius);
        }
        if (typeof data.delay === 'number') {
          self._statTracker.record('chain_delay', data.delay);
        }
        if (typeof data.damageMultiplier === 'number') {
          self._statTracker.record('chain_damage_multiplier', data.damageMultiplier);
        }
      }

      if (self._onEventCallback) {
        self._onEventCallback('mine:chain_triggered', data);
      }
    });
  }

  stopTracking() {
    this._listeners.forEach((listener) => {
      listener.events.off(listener.name, listener.callback);
    });
    this._listeners = [];
  }

  getVerificationResults() {
    const results = {};
    for (const effect in this._expectedEffects) {
      results[effect] = {
        expected: this._expectedEffects[effect],
        detected: !!this._detectedEvents[effect],
        count: this._eventCounts[effect] || 0
      };
    }
    return results;
  }

  isAllPassed() {
    for (const effect in this._expectedEffects) {
      if (this._expectedEffects[effect] && !this._detectedEvents[effect]) {
        return false;
      }
    }
    return true;
  }

  reset() {
    this.stopTracking();
    this._expectedEffects = {};
    this._detectedEvents = {};
    this._eventCounts = {};
    this._previouslyDetected = {};
    if (this._statTracker) {
      this._statTracker.reset();
    }
    if (this._propertyVerifier) {
      this._propertyVerifier.reset();
    }
  }

  getNewlyDetectedEffects() {
    const newlyDetected = [];
    for (const effect in this._detectedEvents) {
      if (this._detectedEvents[effect] && !this._previouslyDetected[effect]) {
        newlyDetected.push(effect);
        this._previouslyDetected[effect] = true;
      }
    }
    return newlyDetected;
  }

  getCounters() {
    return {
      fired: this._eventCounts['weapon:fired'] || 0,
      hit: this._eventCounts['weapon:hit'] || 0,
      kill: this._eventCounts['entity:died'] || 0,
      effect: (this._eventCounts['buffdebuff:applied'] || 0) +
              (this._eventCounts['projectile:ricochet'] || 0) +
              (this._eventCounts['player:lifesteal'] || 0) +
              (this._eventCounts['effect:explosion'] || 0)
    };
  }

  initPropertyVerifier(weaponData) {
    if (!this._statTracker) {
      this._statTracker = new StatTracker();
    }
    this._propertyVerifier = new PropertyVerifier(this._statTracker);
    this._propertyVerifier.setExpectedFromWeapon(weaponData);
  }

  getPropertyVerifier() {
    return this._propertyVerifier;
  }

  getStatTracker() {
    return this._statTracker;
  }

  onEvent(callback) {
    this._onEventCallback = callback;
  }

  /**
   * Get player entity from game
   * @returns {Entity|null} Player entity or null
   */
  _getPlayer() {
    const Entities = window.VampireSurvivors.Entities;
    const Managers = window.VampireSurvivors.Managers;

    // Try to get player from EntityManager
    if (Managers && Managers.EntityManager) {
      const entities = Managers.EntityManager.getEntitiesByTag('player');
      if (entities && entities.length > 0) {
        return entities[0];
      }
    }

    // Fallback: look for player in entities
    if (Entities && Entities.Player && Entities.Player._instance) {
      return Entities.Player._instance;
    }

    return null;
  }

  /**
   * Calculate distance between two entities
   * @param {Entity} entity1 - First entity
   * @param {Entity} entity2 - Second entity
   * @returns {number} Distance in pixels
   */
  _calculateDistance(entity1, entity2) {
    const Components = window.VampireSurvivors.Components;
    if (!Components || !Components.Transform) return 0;

    const transform1 = entity1.getComponent(Components.Transform);
    const transform2 = entity2.getComponent(Components.Transform);

    if (!transform1 || !transform2) return 0;

    const dx = transform2.x - transform1.x;
    const dy = transform2.y - transform1.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}

export { EventTracker };
export default EventTracker;
