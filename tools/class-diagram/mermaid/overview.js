export const overview = {
  title: 'Architecture Overview',
  description: 'High-level namespace relationships and data flow between major subsystems',
  content: `
flowchart TB
    subgraph Core["Core (8 classes)"]
        Game["Game"]
        EventBus["EventBus"]
        Time["Time"]
        Input["Input"]
        Camera["Camera"]
    end

    subgraph ECS["ECS Pattern"]
        Entity["Entity (10 types)"]
        Component["Component (20 types)"]
        System["System (27 types)"]
    end

    subgraph Managers["Managers"]
        EntityManager["EntityManager"]
        BuffDebuffManager["BuffDebuffManager"]
        BlacklistManager["BlacklistManager"]
    end

    subgraph Pools["Object Pools (7)"]
        ObjectPool["ObjectPool"]
        ProjectilePool["ProjectilePool"]
        AreaEffectPool["AreaEffectPool"]
        PickupPool["PickupPool"]
    end

    subgraph Behaviors["Behaviors (17)"]
        WeaponBehavior["WeaponBehavior (8)"]
        EnemyBehavior["EnemyBehavior (8)"]
    end

    subgraph Data["Data Registries"]
        WeaponData["WeaponData"]
        EnemyData["EnemyData"]
        TechCoreData["TechCoreData"]
    end

    subgraph UI["UI (28 classes)"]
        HUD["HUD"]
        Screens["Screens"]
        Panels["Panels"]
    end

    Game --> Time
    Game --> Input
    Game --> EventBus
    Game --> System

    System --> EntityManager
    System --> EventBus
    System --> Behaviors
    System --> Pools

    EntityManager --> Entity
    Entity --> Component

    Behaviors --> Pools
    Behaviors --> Data

    System --> UI
    `
};
