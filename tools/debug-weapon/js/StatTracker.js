/**
 * @fileoverview StatTracker - Numeric measurement collection and analysis
 */

class StatTracker {
  constructor() {
    this._measurements = {};      // { statName: { values: [], min, max, sum, count } }
    this._projectileTracking = {}; // { projectileId: { pierceCount, ricochetBounces, ... } }
    this._fireTimestamps = [];     // For cooldown measurement
  }

  /**
   * Record a numeric measurement
   * @param {string} statName - Name of the stat to track
   * @param {number} value - Value to record
   */
  record(statName, value) {
    if (typeof value !== 'number' || isNaN(value)) return;

    if (!this._measurements[statName]) {
      this._measurements[statName] = {
        values: [],
        min: Infinity,
        max: -Infinity,
        sum: 0,
        count: 0
      };
    }

    const stat = this._measurements[statName];
    stat.values.push(value);
    stat.min = Math.min(stat.min, value);
    stat.max = Math.max(stat.max, value);
    stat.sum += value;
    stat.count++;
  }

  /**
   * Record a weapon fire event for cooldown tracking
   */
  recordFire() {
    const now = performance.now();
    this._fireTimestamps.push(now);

    // Calculate interval from last fire
    if (this._fireTimestamps.length >= 2) {
      const lastTwo = this._fireTimestamps.slice(-2);
      const interval = (lastTwo[1] - lastTwo[0]) / 1000; // Convert to seconds
      this.record('fire_interval', interval);
    }
  }

  /**
   * Track projectile-specific data
   * @param {string} projectileId - Unique projectile identifier
   * @param {string} property - Property name
   * @param {number} value - Value to record
   */
  recordProjectile(projectileId, property, value) {
    if (!this._projectileTracking[projectileId]) {
      this._projectileTracking[projectileId] = {};
    }
    this._projectileTracking[projectileId][property] = value;
  }

  /**
   * Get aggregated statistics for a measurement
   * @param {string} statName - Name of the stat
   * @returns {object|null} Statistics object or null if no data
   */
  getStats(statName) {
    const stat = this._measurements[statName];
    if (!stat || stat.count === 0) return null;

    return {
      min: stat.min,
      max: stat.max,
      avg: stat.sum / stat.count,
      sum: stat.sum,
      count: stat.count,
      values: stat.values
    };
  }

  /**
   * Get max value observed for a stat
   */
  getMax(statName) {
    const stat = this._measurements[statName];
    return stat ? stat.max : null;
  }

  /**
   * Get count of measurements for a stat
   */
  getCount(statName) {
    const stat = this._measurements[statName];
    return stat ? stat.count : 0;
  }

  /**
   * Get proc rate (occurrences / total hits)
   * @param {string} effectStatName - Stat tracking effect applications
   * @param {string} hitStatName - Stat tracking total hits (defaults to 'total_hits')
   */
  getProcRate(effectStatName, hitStatName = 'total_hits') {
    const effectCount = this.getCount(effectStatName);
    const hitCount = this.getCount(hitStatName);

    if (hitCount === 0) return null;

    return {
      rate: effectCount / hitCount,
      effectCount: effectCount,
      hitCount: hitCount,
      sampleSize: hitCount
    };
  }

  /**
   * Get projectile tracking data
   */
  getProjectileStats() {
    const stats = {
      maxPierceUsed: 0,
      maxRicochetBounces: 0,
      projectileCount: Object.keys(this._projectileTracking).length
    };

    for (const id in this._projectileTracking) {
      const proj = this._projectileTracking[id];
      if (proj.pierceCount !== undefined) {
        stats.maxPierceUsed = Math.max(stats.maxPierceUsed, proj.pierceCount);
      }
      if (proj.ricochetBounces !== undefined) {
        stats.maxRicochetBounces = Math.max(stats.maxRicochetBounces, proj.ricochetBounces);
      }
    }

    return stats;
  }

  /**
   * Get all stats as a summary object
   */
  getAllStats() {
    const summary = {};
    for (const statName in this._measurements) {
      summary[statName] = this.getStats(statName);
    }
    return summary;
  }

  /**
   * Reset all measurements
   */
  reset() {
    this._measurements = {};
    this._projectileTracking = {};
    this._fireTimestamps = [];
  }
}

export { StatTracker };
export default StatTracker;
