export const managers = {
  title: 'Managers & Pools',
  description: 'VampireSurvivors.Managers and VampireSurvivors.Pool - Entity management and object pooling (10 classes)',
  content: `
classDiagram
    class EntityManager {
        -Map _entities
        -Map _entitiesByTag
        -number _nextId
        +create(EntityClass)
        +add(entity)
        +remove(entity)
        +destroy(entity)
        +getById(id)
        +getByTag(tag)
        +getWithComponents(Classes)
        +getAll()
        +getCount()
        +clear()
    }

    class BuffDebuffManager {
        -Map _activeEffects
        +apply(entity, effectId)
        +remove(entity, effectId)
        +update(deltaTime)
        +getEffects(entity)
        +clearAll(entity)
    }

    class BlacklistManager {
        -Set _blacklistedWeapons
        +add(weaponId)
        +remove(weaponId)
        +has(weaponId)
        +clear()
        +getAll()
    }

    class ObjectPool {
        <<abstract>>
        #Array _pool
        #Set _active
        #number _maxSize
        +get()
        +release(obj)
        +reset(obj, args)
        +getActiveObjects()
        +releaseAll()
        +clear()
        +activeCount()
        +availableCount()
    }

    class ProjectilePool {
        +get()
        +release(projectile)
        +reset(projectile, config)
    }

    class AreaEffectPool {
        +get()
        +release(areaEffect)
        +reset(areaEffect, config)
    }

    class PickupPool {
        +get()
        +release(pickup)
        +reset(pickup, type, value)
    }

    class MinePool {
        +get()
        +release(mine)
        +reset(mine, config)
    }

    class SummonPool {
        +get()
        +release(summon)
        +reset(summon, config)
    }

    class EnemyProjectilePool {
        +get()
        +release(projectile)
        +reset(projectile, config)
    }

    ObjectPool <|-- ProjectilePool
    ObjectPool <|-- AreaEffectPool
    ObjectPool <|-- PickupPool
    ObjectPool <|-- MinePool
    ObjectPool <|-- SummonPool
    ObjectPool <|-- EnemyProjectilePool

    EntityManager --> Entity : manages
    EntityManager --> ObjectPool : uses pools
    `
};
