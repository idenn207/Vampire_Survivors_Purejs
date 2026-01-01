export const behaviors = {
  title: 'Behaviors',
  description: 'VampireSurvivors.Behaviors - Weapon and enemy behavior patterns (17 classes)',
  content: `
classDiagram
    direction TB

    class WeaponBehavior {
        <<abstract>>
        #EntityManager _entityManager
        #Camera _camera
        #Input _input
        +execute(weapon, player)
        +render(ctx)
    }

    class ProjectileBehavior {
        +execute(weapon, player)
        +spawnProjectile(config)
        +getTargetDirection()
    }

    class LaserBehavior {
        +execute(weapon, player)
        +castRay(start, angle)
        +render(ctx)
    }

    class MeleeBehavior {
        +execute(weapon, player)
        +createSwingArc()
        +render(ctx)
    }

    class ThrustBehavior {
        +execute(weapon, player)
        +createThrustZone()
        +render(ctx)
    }

    class AreaBehavior {
        +execute(weapon, player)
        +spawnAreaEffect(config)
    }

    class ParticleBehavior {
        +execute(weapon, player)
        +spawnParticles(count)
        +render(ctx)
    }

    class MineBehavior {
        +execute(weapon, player)
        +deployMine(position)
    }

    class SummonBehavior {
        +execute(weapon, player)
        +spawnSummon(config)
    }

    WeaponBehavior <|-- ProjectileBehavior
    WeaponBehavior <|-- LaserBehavior
    WeaponBehavior <|-- MeleeBehavior
    WeaponBehavior <|-- ThrustBehavior
    WeaponBehavior <|-- AreaBehavior
    WeaponBehavior <|-- ParticleBehavior
    WeaponBehavior <|-- MineBehavior
    WeaponBehavior <|-- SummonBehavior

    class EnemyBehavior {
        <<abstract>>
        +update(enemy, player, deltaTime)
        +onSpawn(enemy)
    }

    class ChaseEnemyBehavior {
        +update(enemy, player, deltaTime)
        +calculateChaseVector()
    }

    class FlyingEnemyBehavior {
        +update(enemy, player, deltaTime)
        +updateFloatOffset()
    }

    class InvisibleEnemyBehavior {
        +update(enemy, player, deltaTime)
        +toggleVisibility()
    }

    class DashAttackBehavior {
        +update(enemy, player, deltaTime)
        +prepareDash()
        +executeDash()
    }

    class JumpDropBehavior {
        +update(enemy, player, deltaTime)
        +jump()
        +drop()
    }

    class SelfDestructBehavior {
        +update(enemy, player, deltaTime)
        +arm()
        +explode()
    }

    class ProjectileEnemyBehavior {
        +update(enemy, player, deltaTime)
        +fireProjectile()
    }

    EnemyBehavior <|-- ChaseEnemyBehavior
    EnemyBehavior <|-- FlyingEnemyBehavior
    EnemyBehavior <|-- InvisibleEnemyBehavior
    EnemyBehavior <|-- DashAttackBehavior
    EnemyBehavior <|-- JumpDropBehavior
    EnemyBehavior <|-- SelfDestructBehavior
    EnemyBehavior <|-- ProjectileEnemyBehavior
    `
};
