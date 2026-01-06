/**
 * @fileoverview V3 Main Entry Point
 * @module V3/Main
 */
import { World } from '../reference-framework/ecs/World.js';
import { System } from '../reference-framework/ecs/System.js';
import { CANVAS } from './game/config/GameConfig.js';

// Entity imports
import { Player } from './game/entities/Player.js';

// System imports
import { PlayerSystem } from './game/systems/PlayerSystem.js';
import { EnemySystem } from './game/systems/EnemySystem.js';
import { MovementSystem } from './game/systems/MovementSystem.js';
import { LifetimeSystem } from './game/systems/LifetimeSystem.js';
import { CollisionSystem } from './game/systems/CollisionSystem.js';
import { CombatSystem } from './game/systems/CombatSystem.js';
import { WeaponSystem } from './game/systems/WeaponSystem.js';
import { RenderSystem } from './game/systems/RenderSystem.js';
import { HUDSystem } from './game/systems/HUDSystem.js';

// Event bus for game events
import { events } from '../reference-framework/core/EventBus.js';

// ============================================
// Background System (Priority 0 - renders first)
// ============================================
class BackgroundSystem extends System {
  constructor() {
    super();
    this._priority = 0;
  }

  render(ctx) {
    ctx.fillStyle = CANVAS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
  }
}

// ============================================
// Game Instance
// ============================================
let world = null;

// ============================================
// Main Entry Point
// ============================================
async function main() {
  console.log('[V3] Initializing...');

  // Create world with canvas dimensions
  world = new World({
    width: CANVAS.WIDTH,
    height: CANVAS.HEIGHT,
  });

  // Initialize with canvas element
  await world.initialize('game-canvas');

  // Add systems (order determined by priority)
  world.addSystem(new BackgroundSystem());  // Priority 0
  world.addSystem(new PlayerSystem());      // Priority 5
  world.addSystem(new EnemySystem());       // Priority 8
  world.addSystem(new MovementSystem());    // Priority 10
  world.addSystem(new LifetimeSystem());    // Priority 15
  world.addSystem(new CollisionSystem());   // Priority 20
  world.addSystem(new CombatSystem());      // Priority 25
  world.addSystem(new WeaponSystem());      // Priority 40
  world.addSystem(new RenderSystem());      // Priority 100
  world.addSystem(new HUDSystem());         // Priority 110

  // Create player entity
  world.createEntity(Player);

  // Listen for player death
  events.on('player:died', () => {
    showGameOver();
  });

  // Start the game loop
  await world.start();

  console.log('[V3] Started successfully');
  console.log(`[V3] Canvas: ${CANVAS.WIDTH}x${CANVAS.HEIGHT}`);
  console.log('[V3] Entities:', world.entityManager.getCount());
}

// ============================================
// Game Over Screen
// ============================================
let isGameOver = false;

function showGameOver() {
  if (isGameOver) return;
  isGameOver = true;

  // Pause the game
  world.pause();

  // Create game over overlay
  const overlay = document.createElement('div');
  overlay.id = 'game-over-overlay';
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  // Game over title
  const title = document.createElement('h1');
  title.textContent = 'GAME OVER';
  title.style.cssText = `
    color: #ef4444;
    font-size: 48px;
    font-family: Arial, sans-serif;
    margin-bottom: 30px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  `;

  // Play again button
  const button = document.createElement('button');
  button.textContent = 'Play Again';
  button.style.cssText = `
    padding: 15px 40px;
    font-size: 24px;
    background: #4ade80;
    color: #000;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    transition: background 0.2s;
  `;
  button.onmouseover = () => button.style.background = '#22c55e';
  button.onmouseout = () => button.style.background = '#4ade80';
  button.onclick = () => location.reload();

  overlay.appendChild(title);
  overlay.appendChild(button);

  // Add to game container
  const container = document.getElementById('game-container');
  container.appendChild(overlay);
}

// ============================================
// DOM Ready Handler
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

// ============================================
// Export for external access
// ============================================
export { world };
