# Vampire Survivors (Pure JS)

A Vampire Survivors-inspired roguelike game built in **pure JavaScript** with Canvas 2D rendering. No build tools, no bundlers - just open and play.

## Features

### Weapons
- **110+ weapons** across 5 rarity tiers (Common → Legendary)
- **Evolution system** with 60+ evolved weapon chains
- **5 attack types**: Projectile, Laser, Melee, Area Damage, Particle
- **Multiple targeting modes**: Nearest, Random, Mouse-aimed, Rotating, Chain

### Enemies & Bosses
- **8 enemy types** with unique AI behaviors (dash, stealth, ranged, self-destruct, etc.)
- **3-tier boss system**: Elites (wave 5), Minibosses (wave 10), Main Bosses (wave 15)
- Multi-phase boss mechanics with adaptive attacks

### Progression
- **15 Tech Cores**: Element-based progression paths (Fire, Ice, Lightning, Shadow, etc.)
- **11 stat upgrades**: Health, Damage, Speed, Crit, Range, and more
- **5 summon types**: Spirit, Turret, Wolf, Golem, Fairy

## Getting Started

### Requirements
- Modern web browser with JavaScript enabled

### Running the Game

**Option 1**: Open `index.html` directly in your browser

**Option 2**: Use a local server (recommended)
```bash
npx http-server -p 8080 -o
```

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move |
| Mouse | Aim (mouse-targeted weapons) |
| Tab | Stats / Evolution screen |
| F3 | Toggle debug panel |

## Project Structure

```
src/
├── core/       # Game engine (Game loop, EventBus, Input, Camera)
├── components/ # ECS components (Transform, Health, Weapon, etc.)
├── entities/   # Game objects (Player, Enemy, Boss, Projectile)
├── systems/    # Game logic (Movement, Combat, Weapon, Render)
├── behaviors/  # Weapon and enemy behavior patterns
├── data/       # Game configuration and definitions
│   └── weapons/  # 120+ weapon definitions organized by tier
├── ui/         # HUD and menu components
├── managers/   # Entity and state management
├── pool/       # Object pooling for performance
└── debug/      # Development tools
```

## Architecture

### ECS (Entity Component System)
- **Entity**: Container with unique ID and component map
- **Component**: Pure data (Transform, Velocity, Health, Weapon)
- **System**: Logic processors with priority-based execution

### Module Pattern
Uses IIFE (Immediately Invoked Function Expression) with a global `VampireSurvivors` namespace. All files are loaded via `<script>` tags in dependency order.

### Weapon System
Data-driven weapon definitions with behavior patterns. Each weapon specifies:
- Attack type and targeting mode
- Damage, cooldown, and projectile stats
- Evolution recipes and tier progression

## Debug Mode

Press **F3** to toggle the debug panel:
- Real-time FPS counter
- Entity count display
- Collision visualization
- In-game console logging

## License

MIT
