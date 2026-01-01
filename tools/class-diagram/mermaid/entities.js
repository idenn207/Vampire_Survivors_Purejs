export const entities = {
  title: 'Entities',
  description: 'VampireSurvivors.Entities - Game objects with component composition (10 classes)',
  content: `
classDiagram
    direction TB

    class Entity {
        <<abstract>>
        #number _id
        #Map _components
        #Set _tags
        #boolean _isActive
        +addComponent(component)
        +getComponent(Class)
        +hasComponent(Class)
        +removeComponent(Class)
        +hasTag(tag)
        +addTag(tag)
        +dispose()
    }

    class Player {
        +Transform transform
        +Velocity velocity
        +Sprite sprite
        +Collider collider
        +Health health
        +WeaponSlot weaponSlot
        +Experience experience
        +Gold gold
        +PlayerStats stats
        +TechTree techTree
        +ActiveSkill activeSkill
        +Shield shield
        +dash()
        +activateMagnet()
    }

    class Enemy {
        +Transform transform
        +Velocity velocity
        +Sprite sprite
        +Collider collider
        +Health health
        +string enemyType
        +Object behaviorState
        +reset(config)
    }

    class Boss {
        +number phase
        +Array phaseThresholds
        +Object attackCooldowns
        +boolean isTelegraphing
        +advancePhase()
        +executeAttack(pattern)
    }

    class TraversalEnemy {
        +string pattern
        +number decayTimer
        +Object patternState
        +updatePattern()
    }

    class ProjectileEntity {
        +Transform transform
        +Velocity velocity
        +Sprite sprite
        +Collider collider
        +Projectile projectile
        +string sourceWeaponId
        +reset(config)
    }

    class AreaEffectEntity {
        +Transform transform
        +Sprite sprite
        +AreaEffect areaEffect
        +reset(config)
    }

    class PickupEntity {
        +Transform transform
        +Velocity velocity
        +Sprite sprite
        +Collider collider
        +Pickup pickup
        +reset(type, value)
    }

    class Mine {
        +Transform transform
        +Sprite sprite
        +string triggerMode
        +number armDelay
        +boolean isArmed
        +arm()
        +detonate()
    }

    class Summon {
        +Transform transform
        +Velocity velocity
        +Sprite sprite
        +Health health
        +string attackMode
        +number attackCooldown
        +Entity target
        +updateAI()
        +attack()
    }

    Entity <|-- Player
    Entity <|-- Enemy
    Enemy <|-- Boss
    Enemy <|-- TraversalEnemy
    Entity <|-- ProjectileEntity
    Entity <|-- AreaEffectEntity
    Entity <|-- PickupEntity
    Entity <|-- Mine
    Entity <|-- Summon

    Player "1" *-- "1" Transform : has
    Player "1" *-- "1" Velocity : has
    Player "1" *-- "1" Health : has
    Player "1" *-- "1" WeaponSlot : has
    Player "1" *-- "0..1" TechTree : has
    Player "1" *-- "0..1" Shield : has
    `
};
