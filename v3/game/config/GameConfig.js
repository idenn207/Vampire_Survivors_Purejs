/**
 * @fileoverview Game configuration constants for V3
 * @module Game/Config/GameConfig
 */

// ============================================
// Canvas Configuration
// ============================================
export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 600,
  BACKGROUND_COLOR: '#1a1a2e',
};

// ============================================
// Player Configuration
// ============================================
export const PLAYER = {
  SIZE: 32,
  SPEED: 200,
  HEALTH: 100,
  COLOR: '#4cc9f0',
  INVINCIBILITY_DURATION: 1.0,
};

// ============================================
// Enemy Configuration
// ============================================
export const ENEMY = {
  SIZE: 24,
  SPEED: 80,
  HEALTH: 30,
  DAMAGE: 10,
  COLOR: '#f72585',
  SPAWN_INTERVAL: 2.0,
  MAX_COUNT: 20,
  SPAWN_DISTANCE: 100, // Distance outside screen to spawn
};

// ============================================
// Weapon Configuration
// ============================================
export const WEAPON = {
  DAMAGE: 10,
  COOLDOWN: 0.5,
  RANGE: 400,
  PROJECTILE_SPEED: 500,
  PROJECTILE_SIZE: 8,
  PROJECTILE_COLOR: '#ffff00',
  PROJECTILE_LIFETIME: 3.0,
};

// ============================================
// HUD Configuration
// ============================================
export const HUD = {
  HEALTH_BAR: {
    X: 20,
    Y: 20,
    WIDTH: 200,
    HEIGHT: 20,
    BACKGROUND_COLOR: '#333333',
    FILL_COLOR: '#4ade80',
    LOW_HEALTH_COLOR: '#ef4444',
    BORDER_COLOR: '#ffffff',
    BORDER_WIDTH: 2,
    LOW_HEALTH_THRESHOLD: 0.3,
  },
};

// ============================================
// Colors (for easy reference)
// ============================================
export const COLORS = {
  PLAYER: '#4cc9f0',
  ENEMY: '#f72585',
  PROJECTILE: '#ffff00',
  BACKGROUND: '#1a1a2e',
  HEALTH_GOOD: '#4ade80',
  HEALTH_LOW: '#ef4444',
};
