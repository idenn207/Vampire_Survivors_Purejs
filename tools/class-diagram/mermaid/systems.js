export const systems = {
  title: 'Systems',
  description: 'VampireSurvivors.Systems - Logic processors with priority-based execution (27+ classes)',
  content: `
classDiagram
    class System {
        <<abstract>>
        #Game _game
        #EntityManager _entityManager
        #number _priority
        #boolean _isEnabled
        #boolean _updatesDuringPause
        +initialize(game, entityManager)
        +update(deltaTime)
        +render(ctx)
        +dispose()
    }

    class BackgroundSystem {
        +setCamera(camera)
        +setTileSpriteSheet(sheet)
    }
    note for BackgroundSystem "priority: 0"

    class CoreSelectionSystem {
        +startSelection()
        +setupPlayerWithCore(coreId)
    }
    note for CoreSelectionSystem "priority: 1"

    class WaveSystem {
        +currentWave
        +waveTimer
        +getDifficultyModifiers()
    }
    note for WaveSystem "priority: 4"

    class PlayerSystem {
        +setPlayer(player)
        +handleInput()
    }
    note for PlayerSystem "priority: 5"

    class EnemySystem {
        +setPlayer(player)
        +spawnEnemy(type)
        +getBehavior(type)
    }
    note for EnemySystem "priority: 8"

    class TraversalEnemySystem {
        +spawnTraversal(pattern)
    }
    note for TraversalEnemySystem "priority: 8"

    class BossSystem {
        +setPlayer(player)
        +spawnBoss(type)
        +updateAttacks()
    }
    note for BossSystem "priority: 8"

    class MovementSystem {
        +applyVelocity()
        +handleKnockback()
    }
    note for MovementSystem "priority: 10"

    class ProjectileSystem {
        +updateLifetimes()
        +despawnProjectiles()
    }
    note for ProjectileSystem "priority: 12"

    class AreaEffectSystem {
        +processTicks()
        +applyDamage()
    }
    note for AreaEffectSystem "priority: 13"

    class WeaponSystem {
        +setPlayer(player)
        +setInput(input)
        +setCamera(camera)
        +initializeBehaviors()
        +fireWeapon(weapon)
    }
    note for WeaponSystem "priority: 15"

    class MineSystem {
        +updateMines()
        +checkTriggers()
    }
    note for MineSystem "priority: 15"

    class SummonSystem {
        +updateSummons()
        +updateAI()
    }
    note for SummonSystem "priority: 15"

    class CollisionSystem {
        +detectCollisions()
        +registerCallback(tagA, tagB, fn)
        +getCollisionsByTags(tagA, tagB)
    }
    note for CollisionSystem "priority: 20"

    class CombatSystem {
        +setCollisionSystem(system)
        +setPlayer(player)
        +processCollisions()
        +applyDamage(source, target)
    }
    note for CombatSystem "priority: 25"

    class DropSystem {
        +handleEntityDeath(entity)
        +spawnPickup(type, pos)
    }
    note for DropSystem "priority: 26"

    class PickupSystem {
        +setPlayer(player)
        +processPickups()
        +magnetizePickups()
    }
    note for PickupSystem "priority: 27"

    class CameraSystem {
        +setCamera(camera)
    }
    note for CameraSystem "priority: 50"

    class RenderSystem {
        +setCamera(camera)
        +renderEntities()
        +zSort()
    }
    note for RenderSystem "priority: 100"

    class HUDSystem {
        +setPlayer(player)
        +renderHUD()
        +showIndicators()
    }
    note for HUDSystem "priority: 110"

    class TechTreeSystem {
        +setPlayer(player)
        +showUnlockPopup()
        +upgradeTech(techId)
    }
    note for TechTreeSystem "priority: 112"

    class LevelUpSystem {
        +setPlayer(player)
        +showLevelUpScreen()
        +processUpgrade(option)
    }
    note for LevelUpSystem "priority: 115"

    class TabScreenSystem {
        +showStats()
        +showEvolutions()
    }
    note for TabScreenSystem "priority: 116"

    class GameOverSystem {
        +showGameOver()
        +showStats()
    }
    note for GameOverSystem "priority: 120"

    System <|-- BackgroundSystem
    System <|-- CoreSelectionSystem
    System <|-- WaveSystem
    System <|-- PlayerSystem
    System <|-- EnemySystem
    System <|-- TraversalEnemySystem
    System <|-- BossSystem
    System <|-- MovementSystem
    System <|-- ProjectileSystem
    System <|-- AreaEffectSystem
    System <|-- WeaponSystem
    System <|-- MineSystem
    System <|-- SummonSystem
    System <|-- CollisionSystem
    System <|-- CombatSystem
    System <|-- DropSystem
    System <|-- PickupSystem
    System <|-- CameraSystem
    System <|-- RenderSystem
    System <|-- HUDSystem
    System <|-- TechTreeSystem
    System <|-- LevelUpSystem
    System <|-- TabScreenSystem
    System <|-- GameOverSystem
    `
};
