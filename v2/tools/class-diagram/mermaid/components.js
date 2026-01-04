export const components = {
  title: 'Components',
  description: 'VampireSurvivors.Components - ECS data containers (20 classes)',
  content: `
classDiagram
    direction TB

    class Component {
        <<abstract>>
        #Entity _entity
        +getDebugEntries()
        +dispose()
    }

    class Transform {
        +number x
        +number y
        +number width
        +number height
        +number rotation
        +number scale
        +centerX()
        +centerY()
    }

    class Velocity {
        +number vx
        +number vy
        +number maxSpeed
        +Object knockback
        +applyKnockback(force, angle)
        +update(deltaTime)
    }

    class Sprite {
        +string color
        +string shape
        +number zIndex
        +number alpha
        +boolean visible
        +string imageId
        +Object animation
    }

    class Collider {
        +number radius
        +number layer
        +number mask
        +number offsetX
        +number offsetY
        +boolean isTrigger
        +collidesWith(other)
        +distanceTo(other)
    }

    class Health {
        +number current
        +number max
        +number invincibilityTime
        +boolean isDead
        +takeDamage(amount)
        +heal(amount)
        +reset()
    }

    class Weapon {
        +string id
        +number damage
        +number cooldown
        +number level
        +number tier
        +Object stats
        +upgrade()
        +getDPS()
    }

    class WeaponSlot {
        +Array weapons
        +number maxSlots
        +add(weapon)
        +remove(index)
        +getByType(type)
        +getAutoWeapons()
    }

    class Projectile {
        +number damage
        +number pierceCount
        +number lifetime
        +boolean isCritical
        +Object ricochet
        +reset()
    }

    class AreaEffect {
        +number damage
        +number radius
        +number duration
        +number tickRate
        +Set hitEnemies
        +tick()
        +reset()
    }

    class Pickup {
        +string type
        +number value
        +boolean isMagnetic
        +number magnetSpeed
    }

    class Experience {
        +number current
        +number level
        +number toNextLevel
        +number scaling
        +addXP(amount)
        +levelUp()
    }

    class Gold {
        +number amount
        +add(value)
        +spend(value)
        +canAfford(cost)
    }

    class PlayerStats {
        +Object levels
        +Object bonuses
        +getStatValue(stat)
        +upgradeStat(stat)
        +applyBonuses()
    }

    class PlayerData {
        +string characterId
        +Object baseStats
        +Object passives
        +getPassiveEffect(type)
    }

    class TechTree {
        +string coreId
        +Map unlocked
        +Map levels
        +unlock(techId)
        +upgrade(techId)
        +getEffect(techId)
    }

    class ActiveSkill {
        +string skillId
        +number cooldown
        +number charges
        +number maxCharges
        +use()
        +update(deltaTime)
    }

    class ActiveBuff {
        +string type
        +number duration
        +Object bonuses
        +boolean isActive
        +update(deltaTime)
    }

    class BuffDebuff {
        +string effectId
        +string type
        +number duration
        +Object modifiers
        +string stackMode
        +apply(entity)
        +remove()
    }

    class Shield {
        +number current
        +number max
        +absorb(damage)
        +regenerate(amount)
    }

    Component <|-- Transform
    Component <|-- Velocity
    Component <|-- Sprite
    Component <|-- Collider
    Component <|-- Health
    Component <|-- Weapon
    Component <|-- WeaponSlot
    Component <|-- Projectile
    Component <|-- AreaEffect
    Component <|-- Pickup
    Component <|-- Experience
    Component <|-- Gold
    Component <|-- PlayerStats
    Component <|-- PlayerData
    Component <|-- TechTree
    Component <|-- ActiveSkill
    Component <|-- ActiveBuff
    Component <|-- BuffDebuff
    Component <|-- Shield
    `
};
