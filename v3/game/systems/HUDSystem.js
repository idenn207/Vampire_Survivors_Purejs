/**
 * @fileoverview HUDSystem - Renders health bar and UI elements
 * @module Game/Systems/HUDSystem
 */
import { System } from '../../../reference-framework/ecs/System.js';
import { Health } from '../../../reference-framework/lib/RF/components/Health.js';
import { HUD } from '../config/GameConfig.js';

// ============================================
// HUDSystem (Priority 110)
// ============================================
export class HUDSystem extends System {
  constructor() {
    super();
    this._priority = 110;
  }

  render(ctx) {
    this._drawHealthBar(ctx);
  }

  /**
   * Draw the player health bar
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawHealthBar(ctx) {
    // Get player health
    const players = this.entityManager.getByTag('player');
    if (players.length === 0) return;

    const player = players[0];
    const health = player.getComponent(Health);
    if (!health) return;

    const config = HUD.HEALTH_BAR;
    const healthRatio = health.current / health.max;

    // Draw background
    ctx.fillStyle = config.BACKGROUND_COLOR;
    ctx.fillRect(config.X, config.Y, config.WIDTH, config.HEIGHT);

    // Draw health fill
    const fillWidth = config.WIDTH * healthRatio;
    ctx.fillStyle = healthRatio <= config.LOW_HEALTH_THRESHOLD
      ? config.LOW_HEALTH_COLOR
      : config.FILL_COLOR;
    ctx.fillRect(config.X, config.Y, fillWidth, config.HEIGHT);

    // Draw border
    ctx.strokeStyle = config.BORDER_COLOR;
    ctx.lineWidth = config.BORDER_WIDTH;
    ctx.strokeRect(config.X, config.Y, config.WIDTH, config.HEIGHT);

    // Draw health text
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `${Math.ceil(health.current)} / ${health.max}`,
      config.X + config.WIDTH / 2,
      config.Y + config.HEIGHT / 2
    );
  }
}
