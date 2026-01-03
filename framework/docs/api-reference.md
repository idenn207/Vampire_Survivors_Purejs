# API Reference

Complete API documentation for RoguelikeFramework.

## Core Module

### Game

Main game loop and state management.

```javascript
var Game = window.RoguelikeFramework.Core.Game;
```

#### Constructor

```javascript
new Game(config)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| config.width | number | Canvas width (default: 800) |
| config.height | number | Canvas height (default: 600) |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `initialize(canvasId)` | Promise | Initialize with canvas element |
| `start()` | Promise | Start game loop |
| `pause()` | void | Pause the game |
| `resume()` | void | Resume the game |
| `stop()` | void | Stop the game |
| `addSystem(system)` | void | Add a system (auto-sorted by priority) |
| `removeSystem(system)` | void | Remove a system |
| `getSystem(SystemClass)` | System\|null | Get system by class |
| `dispose()` | void | Clean up resources |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `state` | string | Current state: 'initializing', 'running', 'paused', 'stopped' |
| `time` | Time | Time manager instance |
| `input` | Input | Input manager instance |
| `canvas` | HTMLCanvasElement | Canvas element |
| `ctx` | CanvasRenderingContext2D | Canvas context |
| `width` | number | Canvas width |
| `height` | number | Canvas height |
| `systems` | Array | Registered systems |

---

### Time

Time management for frame timing.

```javascript
var time = game.time;
// or
var Time = window.RoguelikeFramework.Core.Time;
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `deltaTime` | number | Seconds since last frame |
| `elapsedTime` | number | Total elapsed time |
| `frameCount` | number | Total frames rendered |
| `fps` | number | Current frames per second |
| `timeScale` | number | Time multiplier (1.0 = normal) |
| `isPaused` | boolean | Is time paused? |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `pause()` | void | Pause time |
| `resume()` | void | Resume time |
| `reset()` | void | Reset all timers |

---

### Input

Keyboard and mouse input handling.

```javascript
var input = game.input;
// or via world
var input = world.input;
```

#### Keyboard Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `isKeyDown(key)` | string | boolean | Key currently held |
| `isKeyPressed(key)` | string | boolean | Key pressed this frame |
| `isKeyReleased(key)` | string | boolean | Key released this frame |
| `getMovementDirection()` | - | {x, y} | Normalized WASD/Arrow direction |

#### Mouse Properties

| Property | Type | Description |
|----------|------|-------------|
| `mousePosition` | {x, y} | Screen coordinates |
| `mouseWorldPosition` | {x, y} | World coordinates (camera-adjusted) |
| `isMouseDown` | boolean | Left button held |
| `isMousePressed` | boolean | Left button pressed this frame |
| `isMouseReleased` | boolean | Left button released this frame |

---

### Camera

Viewport and camera control.

```javascript
var camera = world.camera;
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `follow(entity)` | Entity | void | Follow an entity |
| `stopFollowing()` | - | void | Stop following |
| `worldToScreen(x, y)` | number, number | {x, y} | Convert world to screen coords |
| `screenToWorld(x, y)` | number, number | {x, y} | Convert screen to world coords |
| `setPosition(x, y)` | number, number | void | Set camera position |
| `update(deltaTime)` | number | void | Update camera (smooth following) |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | number | Camera X position |
| `y` | number | Camera Y position |
| `viewportWidth` | number | Viewport width |
| `viewportHeight` | number | Viewport height |
| `smoothing` | number | Follow smoothing (0-1) |

---

### EventBus

Pub/sub event system.

```javascript
var events = window.RoguelikeFramework.Core.events;
// or via world
var events = world.events;
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `on(event, callback)` | string, Function | Function | Subscribe, returns unsubscribe fn |
| `once(event, callback)` | string, Function | Function | One-time subscription |
| `off(event, callback)` | string, Function | void | Unsubscribe |
| `emit(event, data)` | string, any | Promise | Async emit |
| `emitSync(event, data)` | string, any | void | Synchronous emit |

---

## ECS Module

### World

High-level container for game state.

```javascript
var World = window.RoguelikeFramework.ECS.World;
var world = new World({ width: 800, height: 600 });
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `initialize(canvasId)` | string | Promise | Initialize with canvas |
| `start()` | - | Promise | Start game loop |
| `pause()` | - | void | Pause game |
| `resume()` | - | void | Resume game |
| `stop()` | - | void | Stop game |
| `addSystem(system)` | System | void | Add system |
| `removeSystem(system)` | System | void | Remove system |
| `getSystem(SystemClass)` | Function | System\|null | Get system by class |
| `createEntity(EntityClass)` | Function | Entity | Create entity |
| `destroyEntity(entity)` | Entity | void | Destroy entity |
| `createQuery(...Components)` | ...Function | Query | Create cached query |
| `cameraFollow(entity)` | Entity | void | Camera follows entity |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `game` | Game | Game instance |
| `entityManager` | EntityManager | Entity manager |
| `queryManager` | QueryManager | Query manager |
| `camera` | Camera | Camera instance |
| `events` | EventBus | Event bus |
| `time` | Time | Time manager |
| `input` | Input | Input manager |
| `canvas` | HTMLCanvasElement | Canvas element |
| `ctx` | CanvasRenderingContext2D | Canvas context |
| `width` | number | Canvas width |
| `height` | number | Canvas height |

---

### Entity

Base entity class.

```javascript
var Entity = window.RoguelikeFramework.ECS.Entity;
var entity = world.createEntity(Entity);
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `addComponent(component)` | Component | Entity | Add component (chainable) |
| `getComponent(ComponentClass)` | Function | Component\|null | Get component |
| `hasComponent(ComponentClass)` | Function | boolean | Check for component |
| `removeComponent(ComponentClass)` | Function | boolean | Remove component |
| `addTag(tag)` | string | Entity | Add tag (chainable) |
| `hasTag(tag)` | string | boolean | Check for tag |
| `removeTag(tag)` | string | boolean | Remove tag |
| `dispose()` | - | void | Clean up |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | number | Unique entity ID |
| `tags` | Set | Entity tags |
| `isActive` | boolean | Is entity active? |

---

### Component

Base component class.

```javascript
var Component = window.RoguelikeFramework.ECS.Component;

class Health extends Component {
  constructor(max) {
    super();
    this.max = max;
    this.current = max;
  }
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `entity` | Entity | Parent entity (set automatically) |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getDebugEntries()` | Array | Debug info (optional override) |
| `dispose()` | void | Clean up (optional override) |

---

### System

Base system class.

```javascript
var System = window.RoguelikeFramework.ECS.System;

class MySystem extends System {
  constructor() {
    super();
    this._priority = 10;
  }

  update(deltaTime) { }
  render(ctx) { }
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `game` | Game | Game instance |
| `entityManager` | EntityManager | Entity manager |
| `priority` | number | Execution priority (lower = earlier) |
| `isEnabled` | boolean | Is system enabled? |
| `updatesDuringPause` | boolean | Run during pause? |

#### Lifecycle Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `initialize(game, entityManager)` | Game, EntityManager | Called when added |
| `update(deltaTime)` | number | Called each frame |
| `render(ctx)` | CanvasRenderingContext2D | Called each frame after update |
| `dispose()` | - | Called when removed |

---

### EntityManager

Entity registry and querying.

```javascript
var entityManager = world.entityManager;
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `create(EntityClass)` | Function | Entity | Create entity |
| `add(entity)` | Entity | void | Add existing entity |
| `destroy(entity)` | Entity | void | Destroy entity |
| `remove(entity)` | Entity | void | Remove without disposing |
| `getById(id)` | number | Entity\|null | Get by ID |
| `getByTag(tag)` | string | Array | Get by tag |
| `getWithComponents(...Classes)` | ...Function | Array | Get by components |
| `getAll()` | - | Array | Get all entities |
| `getCount()` | - | number | Total entity count |

---

## Components

### Transform

Position, size, and rotation.

```javascript
var Transform = window.RoguelikeFramework.Components.Transform;
var transform = new Transform(x, y, width, height);
```

#### Constructor

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| x | number | 0 | X position |
| y | number | 0 | Y position |
| width | number | 32 | Width |
| height | number | 32 | Height |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | number | X position |
| `y` | number | Y position |
| `width` | number | Width |
| `height` | number | Height |
| `rotation` | number | Rotation in radians |
| `scale` | number | Scale multiplier |
| `centerX` | number | Center X (computed) |
| `centerY` | number | Center Y (computed) |
| `position` | Vector2 | Position as Vector2 |

---

### Velocity

Movement vector.

```javascript
var Velocity = window.RoguelikeFramework.Components.Velocity;
var velocity = new Velocity(vx, vy, maxSpeed);
```

#### Constructor

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| vx | number | 0 | X velocity |
| vy | number | 0 | Y velocity |
| maxSpeed | number | 0 | Max speed (0 = unlimited) |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `vx` | number | X velocity |
| `vy` | number | Y velocity |
| `velocity` | Vector2 | Velocity as Vector2 |
| `maxSpeed` | number | Maximum speed |
| `speed` | number | Current speed (computed) |
| `direction` | number | Direction in radians (computed) |

---

## Utils

### Vector2

2D vector math.

```javascript
var Vector2 = window.RoguelikeFramework.Utils.Vector2;
var vec = new Vector2(x, y);
```

#### Constructor

| Parameter | Type | Default |
|-----------|------|---------|
| x | number | 0 |
| y | number | 0 |

#### Instance Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `set(x, y)` | number, number | Vector2 | Set components |
| `copy(v)` | Vector2 | Vector2 | Copy from another |
| `clone()` | - | Vector2 | Create copy |
| `add(v)` | Vector2 | Vector2 | Add vector |
| `sub(v)` | Vector2 | Vector2 | Subtract vector |
| `scale(s)` | number | Vector2 | Scale by scalar |
| `normalize()` | - | Vector2 | Normalize to unit |
| `length()` | - | number | Get magnitude |
| `lengthSquared()` | - | number | Get squared magnitude |
| `distanceTo(v)` | Vector2 | number | Distance to other |
| `distanceToSquared(v)` | Vector2 | number | Squared distance |
| `dot(v)` | Vector2 | number | Dot product |
| `angle()` | - | number | Angle in radians |
| `angleTo(v)` | Vector2 | number | Angle to other |
| `rotate(angle)` | number | Vector2 | Rotate by angle |
| `lerp(v, t)` | Vector2, number | Vector2 | Interpolate |

#### Static Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `Vector2.add(a, b)` | Vector2, Vector2 | Vector2 | Add (new vector) |
| `Vector2.sub(a, b)` | Vector2, Vector2 | Vector2 | Subtract (new) |
| `Vector2.scale(v, s)` | Vector2, number | Vector2 | Scale (new) |
| `Vector2.normalize(v)` | Vector2 | Vector2 | Normalize (new) |
| `Vector2.distance(a, b)` | Vector2, Vector2 | number | Distance |
| `Vector2.fromAngle(angle)` | number | Vector2 | From angle |
| `Vector2.lerp(a, b, t)` | Vector2, Vector2, number | Vector2 | Interpolate (new) |
| `Vector2.zero()` | - | Vector2 | Zero vector |

---

## Library (Lib)

See [Patterns](./patterns.md) for detailed library documentation.

### Quick Reference

```javascript
var Lib = window.RoguelikeFramework.Lib;

// Core
new Lib.Core.ObjectPool(createFn, resetFn, initial, max)
new Lib.Core.StateMachine(initialState, states, context)
new Lib.Core.Cooldown(duration, startReady)
new Lib.Core.Duration(duration)
new Lib.Core.Interval(interval, callback)

// Math
Lib.Math.MathUtils.clamp(value, min, max)
Lib.Math.MathUtils.lerp(a, b, t)
Lib.Math.Random.int(min, max)
Lib.Math.Random.element(array)
Lib.Math.Collision.circleVsCircle(x1, y1, r1, x2, y2, r2)

// Physics
Lib.Physics.CollisionLayers.PLAYER
Lib.Physics.CollisionLayers.canCollide(layerA, maskA, layerB, maskB)
new Lib.Physics.Targeting(entityManager, TransformClass, HealthClass)

// Patterns
new Lib.Patterns.Registry(name)
new Lib.Patterns.Behavior()

// Debug
new Lib.Debug.DebugPanel()
new Lib.Debug.DebugConsole()
```
