/**
 * @fileoverview Weapon component for player auto-fire
 * @module Game/Components/Weapon
 */
import { Component } from '../../../reference-framework/ecs/Component.js';
import { WEAPON } from '../config/GameConfig.js';

// ============================================
// Weapon Component
// ============================================
export class Weapon extends Component {
  constructor(config = {}) {
    super();

    // Weapon stats
    this.damage = config.damage ?? WEAPON.DAMAGE;
    this.cooldown = config.cooldown ?? WEAPON.COOLDOWN;
    this.range = config.range ?? WEAPON.RANGE;
    this.projectileSpeed = config.projectileSpeed ?? WEAPON.PROJECTILE_SPEED;
    this.projectileSize = config.projectileSize ?? WEAPON.PROJECTILE_SIZE;
    this.projectileColor = config.projectileColor ?? WEAPON.PROJECTILE_COLOR;
    this.projectileLifetime = config.projectileLifetime ?? WEAPON.PROJECTILE_LIFETIME;

    // Cooldown tracking
    this.lastFired = 0;
  }

  /**
   * Check if weapon can fire (cooldown elapsed)
   * @param {number} currentTime - Current game time in seconds
   * @returns {boolean}
   */
  canFire(currentTime) {
    return currentTime - this.lastFired >= this.cooldown;
  }

  /**
   * Mark weapon as fired
   * @param {number} currentTime - Current game time in seconds
   */
  fire(currentTime) {
    this.lastFired = currentTime;
  }
}
