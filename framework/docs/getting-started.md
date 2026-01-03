# Getting Started with RoguelikeFramework

A modular ECS game framework for roguelike-style games in pure JavaScript.

## Installation

The framework uses script tags for loading. Include files in the correct order in your HTML:

```html
<!-- Framework Core -->
<script src="framework/core/namespace.js"></script>
<script src="framework/utils/Vector2.js"></script>
<script src="framework/core/EventBus.js"></script>
<script src="framework/core/Time.js"></script>
<script src="framework/core/Input.js"></script>
<script src="framework/core/Camera.js"></script>
<script src="framework/ecs/Component.js"></script>
<script src="framework/ecs/Entity.js"></script>
<script src="framework/ecs/System.js"></script>
<script src="framework/ecs/EntityManager.js"></script>
<script src="framework/ecs/QueryManager.js"></script>
<script src="framework/core/Game.js"></script>
<script src="framework/ecs/World.js"></script>

<!-- Framework Components -->
<script src="framework/components/Transform.js"></script>
<script src="framework/components/Velocity.js"></script>

<!-- RF Library (optional) -->
<script src="framework/lib/RF/core/ObjectPool.js"></script>
<script src="framework/lib/RF/core/Timer.js"></script>
<script src="framework/lib/RF/math/MathUtils.js"></script>
<script src="framework/lib/RF/math/Random.js"></script>
<!-- ... additional library files ... -->
```

## Quick Start

### 1. Create an HTML Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Game</title>
  <style>
    canvas { border: 1px solid #333; }
  </style>
</head>
<body>
  <canvas id="game-canvas"></canvas>

  <!-- Include framework scripts here -->

  <script src="game.js"></script>
</body>
</html>
```

### 2. Create Your Game

```javascript
// game.js
(function() {
  'use strict';

  // Import from framework namespace
  var World = window.RoguelikeFramework.ECS.World;
  var System = window.RoguelikeFramework.ECS.System;
  var Entity = window.RoguelikeFramework.ECS.Entity;
  var Transform = window.RoguelikeFramework.Components.Transform;
  var Velocity = window.RoguelikeFramework.Components.Velocity;

  // ========================================
  // Create a Movement System
  // ========================================
  class MovementSystem extends System {
    constructor() {
      super();
      this._priority = 10;  // Lower = runs earlier
    }

    update(deltaTime) {
      // Query entities with both Transform and Velocity
      var entities = this.entityManager.getWithComponents(Transform, Velocity);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var transform = entity.getComponent(Transform);
        var velocity = entity.getComponent(Velocity);

        // Apply velocity to position
        transform.x += velocity.vx * deltaTime;
        transform.y += velocity.vy * deltaTime;
      }
    }
  }

  // ========================================
  // Create a Render System
  // ========================================
  class RenderSystem extends System {
    constructor() {
      super();
      this._priority = 100;  // Render last
    }

    render(ctx) {
      var entities = this.entityManager.getWithComponents(Transform);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var transform = entity.getComponent(Transform);

        ctx.fillStyle = '#4cc9f0';
        ctx.fillRect(
          transform.x,
          transform.y,
          transform.width,
          transform.height
        );
      }
    }
  }

  // ========================================
  // Bootstrap the Game
  // ========================================
  async function main() {
    // Create world with canvas size
    var world = new World({ width: 800, height: 600 });
    await world.initialize('game-canvas');

    // Add systems
    world.addSystem(new MovementSystem());
    world.addSystem(new RenderSystem());

    // Create player entity
    var player = world.createEntity(Entity);
    player.addComponent(new Transform(400, 300, 32, 32));
    player.addComponent(new Velocity(50, 30));
    player.addTag('player');

    // Start game loop
    await world.start();

    console.log('Game started!');
  }

  main();
})();
```

## Core Concepts

### World

The `World` is the main container that manages everything:

```javascript
var world = new World({ width: 800, height: 600 });
await world.initialize('canvas-id');

// Access components
world.entityManager  // Manage entities
world.input          // Input handling
world.time           // Time/deltaTime
world.camera         // Camera control
world.events         // Event bus
```

### Entities

Entities are containers for components:

```javascript
var entity = world.createEntity(Entity);

// Add components
entity.addComponent(new Transform(100, 100, 32, 32));
entity.addComponent(new Velocity(0, 0));

// Add tags for querying
entity.addTag('player');
entity.addTag('controllable');

// Query components
var transform = entity.getComponent(Transform);
entity.hasComponent(Velocity);  // true
entity.hasTag('player');        // true
```

### Components

Components are pure data containers:

```javascript
// Built-in components
var transform = new Transform(x, y, width, height);
transform.x = 100;
transform.centerX;  // Computed property

var velocity = new Velocity(vx, vy);
velocity.speed;     // Magnitude
velocity.direction; // Angle in radians

// Create custom components
class Health extends Component {
  constructor(max) {
    super();
    this.max = max;
    this.current = max;
  }

  takeDamage(amount) {
    this.current = Math.max(0, this.current - amount);
  }

  get isDead() {
    return this.current <= 0;
  }
}
```

### Systems

Systems contain game logic and run each frame:

```javascript
class MySystem extends System {
  constructor() {
    super();
    this._priority = 10;           // Execution order
    this._updatesDuringPause = false; // Run when paused?
  }

  // Called once when system is added
  initialize(game, entityManager) {
    super.initialize(game, entityManager);
    // Setup code here
  }

  // Called every frame
  update(deltaTime) {
    // Game logic here
  }

  // Called every frame after update
  render(ctx) {
    // Drawing code here
  }
}
```

## Using the RF Library

The library provides additional utilities:

```javascript
var Lib = window.RoguelikeFramework.Lib;

// Timers
var cooldown = new Lib.Core.Cooldown(2.0);  // 2 second cooldown
cooldown.update(deltaTime);
if (cooldown.isReady) {
  cooldown.reset();
  // Fire weapon
}

// Random utilities
var Random = Lib.Math.Random;
var enemy = Random.element(enemies);        // Random array element
var damage = Random.int(10, 20);            // Random integer
var point = Random.pointInCircle(100);      // Random point in circle

// Math utilities
var MathUtils = Lib.Math.MathUtils;
var clamped = MathUtils.clamp(value, 0, 100);
var smooth = MathUtils.lerp(current, target, 0.1);

// Object pooling
var pool = new Lib.Core.ObjectPool(
  function() { return new Projectile(); },  // Create function
  function(p) { p.reset(); },               // Reset function
  50,   // Initial size
  200   // Max size
);

var projectile = pool.get();
// ... use projectile ...
pool.release(projectile);
```

## Event System

Use events for decoupled communication:

```javascript
var events = world.events;

// Subscribe to events
events.on('player:damaged', function(data) {
  console.log('Player took ' + data.amount + ' damage');
});

// One-time subscription
events.once('level:complete', function() {
  // Cleanup
});

// Emit events
events.emit('player:damaged', { amount: 10, source: enemy });

// Synchronous emit (blocks until handlers complete)
events.emitSync('game:paused');
```

## Next Steps

- Read [Architecture](./architecture.md) for framework design details
- See [API Reference](./api-reference.md) for complete API documentation
- Check [Patterns](./patterns.md) for common design patterns
