# RoguelikeFramework Architecture

## Overview

RoguelikeFramework is a modular ECS (Entity-Component-System) game framework designed for roguelike-style games. It uses pure JavaScript with the IIFE + Namespace pattern for browser compatibility without bundlers.

## Module Pattern: IIFE + Namespace

All framework files use the Immediately Invoked Function Expression pattern:

```javascript
/**
 * @fileoverview Description of the module
 * @module ModuleName
 */
(function (Namespace) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var OtherClass = window.RoguelikeFramework.Other.OtherClass;

  // ============================================
  // Class Definition
  // ============================================
  class MyClass {
    // Private properties with underscore prefix
    _privateValue = null;

    constructor() { }

    // Public methods
    doSomething() { }

    // Private methods
    _helperMethod() { }

    // Getters/Setters
    get value() { return this._privateValue; }

    // Lifecycle
    dispose() { }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Namespace.MyClass = MyClass;

})(window.RoguelikeFramework.Namespace);
```

### Benefits

1. **No build tools required** - Works directly in browser
2. **Clear dependencies** - Imports at top of each file
3. **Encapsulation** - Private scope within IIFE
4. **No global pollution** - Single `RoguelikeFramework` namespace

## Namespace Structure

```javascript
window.RoguelikeFramework = {
  // Core systems
  Core: {
    Game,           // Game loop, state management
    Time,           // Delta time, FPS, time scale
    Input,          // Keyboard/mouse handling
    Camera,         // Viewport, following
    EventBus,       // Pub/sub messaging
    events          // Global event bus instance
  },

  // Entity-Component-System
  ECS: {
    Entity,         // Base entity class
    Component,      // Base component class
    System,         // Base system class
    EntityManager,  // Entity registry
    QueryManager,   // Cached queries
    Query,          // Query result wrapper
    World           // High-level container
  },

  // Built-in components
  Components: {
    Transform,      // Position, size, rotation
    Velocity        // Movement vector
  },

  // Utilities
  Utils: {
    Vector2         // 2D vector math
  },

  // Library extensions
  Lib: {
    Core: { ObjectPool, StateMachine, Cooldown, Duration, Interval },
    Math: { MathUtils, Random, Collision },
    Physics: { CollisionLayers, Targeting },
    Patterns: { Registry, Behavior },
    Debug: { DebugConfig, DebugConsole, DebugPanel }
  }
};
```

## ECS Architecture

### Entity

Entities are containers with unique IDs that hold components and tags:

```
Entity
├── id: number (unique, auto-increment)
├── components: Map<ComponentClass, instance>
├── tags: Set<string>
└── methods
    ├── addComponent(component)
    ├── getComponent(ComponentClass)
    ├── hasComponent(ComponentClass)
    ├── removeComponent(ComponentClass)
    ├── addTag(tag)
    ├── hasTag(tag)
    └── removeTag(tag)
```

### Component

Components are pure data with no logic (beyond computed properties):

```
Component
├── entity: Entity (back-reference, set automatically)
└── methods
    ├── getDebugEntries() - optional debug info
    └── dispose() - cleanup
```

### System

Systems contain game logic and operate on entities with specific components:

```
System
├── _priority: number (lower = earlier)
├── _isEnabled: boolean
├── _updatesDuringPause: boolean
├── game: Game (set by initialize)
├── entityManager: EntityManager (set by initialize)
└── lifecycle
    ├── initialize(game, entityManager)
    ├── update(deltaTime)
    ├── render(ctx)
    └── dispose()
```

### System Priority

Systems execute in priority order each frame:

| Priority | Typical Use |
|----------|-------------|
| 0-4 | Background, initialization |
| 5-9 | Input processing, AI |
| 10-19 | Physics, movement |
| 20-29 | Collision detection |
| 30-39 | Combat, damage |
| 40-49 | Spawning, drops |
| 50-99 | Camera, effects |
| 100+ | Rendering, UI |

## Game Loop

```
┌─────────────────────────────────────────┐
│           RequestAnimationFrame         │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│          Calculate deltaTime            │
│    (clamped to MAX_DELTA = 100ms)       │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         Update Input State              │
│   (pressed/released detection)          │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│      For each System (by priority)      │
│         system.update(deltaTime)        │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│           Clear Canvas                  │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│      For each System (by priority)      │
│           system.render(ctx)            │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│          Reset per-frame state          │
└─────────────────┬───────────────────────┘
                  │
                  └───── Loop back ────────
```

### Delta Time Clamping

To prevent the "spiral of death" when the browser tab is backgrounded:

```javascript
var MAX_DELTA = 0.1;  // 100ms = 10 FPS minimum
deltaTime = Math.min(deltaTime, MAX_DELTA);
```

## Event-Driven Communication

The EventBus enables decoupled communication:

```
┌──────────────┐     emit('event', data)    ┌──────────────┐
│   System A   │ ──────────────────────────▶│   EventBus   │
└──────────────┘                            └──────┬───────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────────────────┐
                    │                              │                              │
                    ▼                              ▼                              ▼
            ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
            │   System B   │              │   System C   │              │      UI      │
            │ on('event')  │              │ on('event')  │              │ on('event')  │
            └──────────────┘              └──────────────┘              └──────────────┘
```

### Event Types

- **emit()** - Async, returns Promise, handlers can be async
- **emitSync()** - Synchronous, blocks until all handlers complete

## Object Lifecycle

### Entity Creation

```
World.createEntity(EntityClass)
        │
        ▼
EntityManager.create(EntityClass)
        │
        ├── new EntityClass()
        ├── Add to _entities Map
        └── Emit 'entity:created' event
```

### Entity Destruction

```
World.destroyEntity(entity)
        │
        ▼
EntityManager.destroy(entity)
        │
        ├── Remove from _entities Map
        ├── Remove from all tag Sets
        ├── Call entity.dispose()
        │       └── Dispose all components
        └── Emit 'entity:destroyed' event
```

### System Lifecycle

```
World.addSystem(system)
        │
        ├── system.initialize(game, entityManager)
        └── Add to Game's system list (sorted by priority)

World.removeSystem(system)
        │
        ├── Remove from Game's system list
        └── system.dispose()
```

## Memory Management

### Object Pooling

For frequently created/destroyed objects (projectiles, effects):

```javascript
var pool = new ObjectPool(
  createFn,     // Factory function
  resetFn,      // Reset function (optional)
  initialSize,  // Pre-allocate count
  maxSize       // Maximum pool size
);

// Usage
var obj = pool.get();      // Get from pool or create
pool.release(obj);         // Return to pool
pool.releaseAll();         // Return all active objects
```

### Dispose Pattern

All classes implement `dispose()` for cleanup:

```javascript
class MyClass {
  dispose() {
    // Clear references
    this._reference = null;

    // Clear collections
    this._array = [];
    this._map.clear();

    // Dispose owned objects
    this._child.dispose();
  }
}
```

## Query System

### Direct Query

```javascript
// Query by tag
var enemies = entityManager.getByTag('enemy');

// Query by components
var movables = entityManager.getWithComponents(Transform, Velocity);
```

### Cached Query

For frequently-used queries:

```javascript
// Create cached query (via World or QueryManager)
var enemyQuery = world.createQuery(Transform, Health);

// Use cached results
var enemies = enemyQuery.results;  // Auto-refreshes if dirty

// Iterate helpers
enemyQuery.forEach(function(entity) { });
var damaged = enemyQuery.filter(function(e) {
  return e.getComponent(Health).current < 50;
});
```

Queries auto-invalidate when entities are created/destroyed.

## File Loading Order

Scripts must load in dependency order:

```
1. namespace.js       (creates window.RoguelikeFramework)
2. Vector2.js         (no framework deps)
3. EventBus.js        (creates global events instance)
4. Time.js            (no deps)
5. Input.js           (uses Vector2)
6. Camera.js          (uses Vector2)
7. Component.js       (no deps)
8. Entity.js          (uses Component)
9. System.js          (no deps)
10. EntityManager.js  (uses Entity, EventBus)
11. QueryManager.js   (uses EntityManager)
12. Game.js           (uses Time, EventBus)
13. World.js          (uses Game, EntityManager, QueryManager, Camera)
14. Transform.js      (uses Component, Vector2)
15. Velocity.js       (uses Component, Vector2)
```

## Best Practices

### 1. Component Design

- Keep components as pure data
- Use computed getters for derived values
- Avoid logic in components (put in systems)

### 2. System Design

- One responsibility per system
- Use priority to control execution order
- Query for components, not specific entities
- Use events for cross-system communication

### 3. Performance

- Use `distanceSquared` instead of `distance` when possible
- Cache component queries for frequently-accessed entity sets
- Use object pooling for frequently created/destroyed objects
- Clamp delta time to prevent physics explosions

### 4. Memory

- Always call `dispose()` when removing objects
- Clear references in dispose to help garbage collection
- Use pools for short-lived objects
