/**
 * @fileoverview WeaponRegistry Reference - All Available Properties
 *
 * This file documents EVERY possible property that can appear in WeaponRegistry
 * weapon definitions. Use this as a reference guide when creating new weapons.
 *
 * NOTE: This is NOT a functional weapon - it's a documentation reference.
 * Properties are organized by category with inline comments explaining usage.
 *
 * @module Data/Weapons/ExampleWeapon
 */
(function (Data) {
  'use strict';

  // Import constants for reference
  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  /**
   * EXAMPLE WEAPON - Reference Documentation
   *
   * Attack Types Available:
   *   - AttackType.PROJECTILE    : Fires projectiles (darts, bolts, arrows)
   *   - AttackType.LASER         : Continuous beam attacks
   *   - AttackType.MELEE_SWING   : Arc-based melee attacks (swords, axes)
   *   - AttackType.MELEE_THRUST  : Thrust-based attacks (spears, punches)
   *   - AttackType.AREA_DAMAGE   : Ground/area effects (pools, fields)
   *   - AttackType.MINE          : Deployable traps/mines
   *   - AttackType.SUMMON        : Summons minions/entities
   *   - AttackType.PARTICLE      : Orbiting/rotating particles
   *
   * Targeting Modes Available:
   *   - TargetingMode.NEAREST    : Targets closest enemy
   *   - TargetingMode.RANDOM     : Targets random enemy in range
   *   - TargetingMode.MOUSE      : Follows mouse cursor direction
   *   - TargetingMode.ROTATING   : Fires in rotating pattern
   *   - TargetingMode.CHAIN      : Chains between targets
   *   - TargetingMode.WEAKEST    : Targets lowest health enemy
   */
  Data.WeaponRegistry['example_weapon'] = {

    // ============================================
    // CORE METADATA (Required)
    // ============================================

    // id: string - Unique identifier for the weapon
    id: 'example_weapon',

    // name: string - Display name shown in UI
    name: 'Example Weapon',

    // description: string - Flavor text describing the weapon
    description: 'A comprehensive reference weapon demonstrating all available properties.',

    // attackType: AttackType constant - Determines attack behavior
    // Options: PROJECTILE, LASER, MELEE_SWING, MELEE_THRUST, AREA_DAMAGE, MINE, SUMMON, PARTICLE
    attackType: AttackType.PROJECTILE,

    // targetingMode: TargetingMode constant - How targets are selected
    // Options: NEAREST, RANDOM, MOUSE, ROTATING, CHAIN, WEAKEST
    targetingMode: TargetingMode.NEAREST,

    // isAuto: boolean - true = auto-fires, false = requires mouse click
    isAuto: true,

    // rarity: Rarity constant - Affects drop rates and tier multipliers
    // Options: COMMON, UNCOMMON, RARE, EPIC
    rarity: Rarity.COMMON,

    // ============================================
    // TIER & EVOLUTION PROPERTIES
    // ============================================

    // tier: number (1-5) - Current evolution tier
    // 1=Common, 2=Uncommon, 3=Rare, 4=Epic, 5=Legendary
    tier: 1,

    // maxTier: number - Maximum evolution tier (typically 4 for basic, 5 for core)
    maxTier: 4,

    // maxLevel: number - Maximum upgrade level (typically 5)
    maxLevel: 5,

    // isExclusive: boolean - If true, only one of this weapon per loadout
    isExclusive: false,

    // isEvolved: boolean - True if this is an evolved form
    isEvolved: false,

    // isCore: boolean - True if this is a tech core weapon chain
    isCore: false,

    // coreId: string - ID of originating tech core (for core weapons only)
    // coreId: 'blood_core',

    // baseWeaponId: string - ID of base weapon this evolved from
    // baseWeaponId: 'blood_scythe',

    // evolutionChain: string - Name of evolution chain group
    // evolutionChain: 'blood',

    // ============================================
    // BASIC STATS
    // ============================================

    // damage: number - Base damage per hit
    damage: 25,

    // cooldown: number - Seconds between attacks
    cooldown: 1.0,

    // range: number - Attack range in pixels
    range: 300,

    // ============================================
    // PROJECTILE PROPERTIES
    // (For AttackType.PROJECTILE)
    // ============================================

    // projectileCount: number - Number of projectiles fired per attack
    projectileCount: 1,

    // projectileSpeed: number - Pixels per second projectile travels
    projectileSpeed: 350,

    // pierce: number - Number of enemies projectile can pass through
    // 0 = stops on first hit, 99 = effectively infinite
    pierce: 1,

    // spread: number - Spread angle in degrees between projectiles
    spread: 15,

    // lifetime: number - Seconds before projectile despawns
    lifetime: 3.0,

    // size: number - Projectile visual/collision size in pixels
    size: 10,

    // ============================================
    // MELEE PROPERTIES
    // (For AttackType.MELEE_SWING / MELEE_THRUST)
    // ============================================

    // --- MELEE_SWING Properties ---

    // arcAngle: number - Swing arc width in degrees
    arcAngle: 120,

    // swingDuration: number - Duration of swing animation in seconds
    swingDuration: 0.2,

    // hitsPerSwing: number - Maximum enemies hit per swing
    hitsPerSwing: 3,

    // doubleSwing: boolean - Performs forward and back swing
    doubleSwing: false,

    // meleeFrameCount: number - Animation frame count
    meleeFrameCount: 2,

    // --- MELEE_THRUST Properties ---

    // thrustStyle: string - Type of thrust ('punch', 'scythe', 'thrust')
    thrustStyle: 'thrust',

    // thrustDuration: number - Total thrust motion duration
    thrustDuration: 0.35,

    // extendTime: number - Time to extend/reach forward
    extendTime: 0.3,

    // holdTime: number - Time held at full extension
    holdTime: 0.1,

    // retractTime: number - Time to retract
    retractTime: 0.45,

    // thrustWidth: number - Width of thrust hitbox
    thrustWidth: 25,

    // coneExpansion: number - Cone spread multiplier at end of thrust
    coneExpansion: 3.0,

    // ============================================
    // LASER PROPERTIES
    // (For AttackType.LASER)
    // ============================================

    // width: number - Width of laser beam in pixels
    width: 12,

    // duration: number - How long laser persists in seconds
    // duration: 0.5, // (already defined above, would override)

    // laserImageId: string - Sprite ID for laser visual
    laserImageId: 'example_laser',

    // ============================================
    // AREA DAMAGE PROPERTIES
    // (For AttackType.AREA_DAMAGE)
    // ============================================

    // radius: number - Area effect radius in pixels
    radius: 100,

    // tickRate: number - Seconds between damage ticks
    tickRate: 0.5,

    // tickDamage: number - Damage per tick (alternative to main damage)
    tickDamage: 10,

    // cloudCount: number - Number of area zones spawned
    cloudCount: 1,

    // spawnRange: number - Distance from player to spawn area
    spawnRange: 200,

    // followPlayer: boolean - Area follows player movement
    followPlayer: false,

    // areaImageId: string - Sprite ID for area effect visual
    areaImageId: 'example_area',

    // ============================================
    // MINE PROPERTIES
    // (For AttackType.MINE)
    // ============================================

    // mineCount: number - Number of mines deployed per attack
    mineCount: 3,

    // triggerRadius: number - Proximity detection radius in pixels
    triggerRadius: 40,

    // explosionRadius: number - Blast radius when detonated
    explosionRadius: 80,

    // triggerMode: string - How mine triggers ('proximity' or 'timed')
    triggerMode: 'proximity',

    // detonationTime: number - Seconds before auto-detonate (timed mode)
    detonationTime: 2.5,

    // maxMines: number - Maximum mines deployed at once
    maxMines: 5,

    // mineImageId: string - Sprite ID for mine visual
    mineImageId: 'example_mine',

    // ============================================
    // SUMMON PROPERTIES
    // (For AttackType.SUMMON)
    // ============================================

    // summonCount: number - Number of summons created
    summonCount: 2,

    // summonHealth: number - Health of each summon
    summonHealth: 50,

    // summonDuration: number - Seconds summons persist (0 = permanent)
    summonDuration: 15.0,

    // summonSpeed: number - Movement speed of summon
    summonSpeed: 100,

    // summonSize: number - Visual size of summon
    summonSize: 25,

    // summonImageId: string - Sprite ID for summon visual
    summonImageId: 'example_summon',

    // attackWindup: number - Seconds before summon attacks
    attackWindup: 0.25,

    // attackPattern: string - Summon attack type ('melee' or 'projectile')
    attackPattern: 'melee',

    // attackRange: number - Summon attack range
    attackRange: 45,

    // summonStats: object - Container for summon properties (alternative format)
    summonStats: {
      health: 50,
      speed: 100,
      attackCooldown: 1.0,
      attackRange: 45,
      size: 25
    },

    // ============================================
    // PARTICLE/ROTATING PROPERTIES
    // (For AttackType.PARTICLE or rotating weapons)
    // ============================================

    // bladeCount: number - Number of rotating blades/orbs
    bladeCount: 4,

    // rotationSpeed: number - Degrees per second rotation
    rotationSpeed: 180,

    // orbitRadius: number - Distance from player center
    orbitRadius: 75,

    // orbitSpeed: number - Pixels per second orbit movement
    orbitSpeed: 200,

    // hitCooldown: number - Seconds between hitting same enemy
    hitCooldown: 0.5,

    // particleCount: number - Number of orbital particles
    particleCount: 4,

    // particleSize: number - Size of each particle
    particleSize: 12,

    // bladeImageId: string - Sprite ID for rotating blade
    bladeImageId: 'example_blade',

    // chainCount: number - Chain lightning target count
    chainCount: 4,

    // chainRange: number - Range per chain jump
    chainRange: 180,

    // chainDamageDecay: number - Damage multiplier per chain (0.0-1.0)
    chainDamageDecay: 0.75,

    // ============================================
    // VISUAL PROPERTIES
    // ============================================

    // color: string - Primary hex color
    color: '#9966FF',

    // secondaryColor: string - Secondary hex color
    secondaryColor: '#FFCC00',

    // tertiaryColor: string - Tertiary hex color (for complex visuals)
    tertiaryColor: '#660099',

    // visualScale: number - Visual size multiplier
    visualScale: 1.0,

    // shape: string - Projectile shape type
    // Options: 'dart', 'feather', 'sphere', 'ring', 'singularity', etc.
    shape: 'dart',

    // icon: string - UI icon identifier (usually matches weapon id)
    icon: 'example_weapon',

    // imageId: string - Base sprite/image ID
    imageId: 'weapon_example',

    // projectileImageId: string - Sprite for projectile visual
    projectileImageId: 'example_projectile',

    // meleeImageId: string - Sprite for melee attack visual
    meleeImageId: 'example_melee',

    // thrustImageId: string - Sprite for thrust attack visual
    thrustImageId: 'example_thrust',

    // ============================================
    // STATUS EFFECTS
    // ============================================

    // statusEffect: object - Single status effect configuration
    statusEffect: {
      // type: string - Effect type
      // Options: 'bleed', 'burn', 'poison', 'slow', 'stun', 'freeze', 'weakness'
      type: 'bleed',

      // damage: number - Damage per tick
      damage: 5,

      // damagePerTick: number - Alternative to damage
      damagePerTick: 5,

      // duration: number - Effect duration in seconds
      duration: 3.0,

      // tickRate: number - Seconds between damage ticks
      tickRate: 0.5,

      // chance: number - Chance to apply effect (0.0-1.0)
      chance: 0.25,

      // speedModifier: number - Speed multiplier for slow effects
      speedModifier: 0.5,

      // stackable: boolean - Can stack multiple times
      stackable: true
    },

    // statusEffects: array - Multiple status effects
    // statusEffects: [
    //   { type: 'burn', damage: 3, duration: 2.0, chance: 0.5 },
    //   { type: 'slow', speedModifier: 0.6, duration: 1.5, chance: 0.3 }
    // ],

    // ============================================
    // SPECIAL BEHAVIORS - RICOCHET
    // ============================================

    // ricochet: object - Projectile bouncing behavior
    ricochet: {
      enabled: true,
      bounces: 4,              // Maximum number of bounces
      bounceRange: 150,        // Range to find next target
      damageRetention: 0.9,    // Damage kept per bounce (0.0-1.0)
      speedMultiplier: 1.1     // Speed increase per bounce
    },

    // ============================================
    // SPECIAL BEHAVIORS - HOMING
    // ============================================

    // homing: object - Target tracking configuration
    homing: {
      enabled: true,
      turnRate: 6.0,           // Degrees per second turn rate
      trackingRange: 350,      // Max range to track target
      lockOnDelay: 0.1         // Delay before tracking starts
    },

    // ============================================
    // SPECIAL BEHAVIORS - BOOMERANG
    // ============================================

    // boomerang: object - Returning projectile behavior
    boomerang: {
      enabled: true,
      returnDamageMultiplier: 1.5,  // Damage multiplier on return
      returnSpeed: 400,             // Speed returning to player
      curveStrength: 0.3            // Arc curve of return path
    },

    // ============================================
    // SPECIAL BEHAVIORS - GROWTH
    // ============================================

    // growth: object - Projectile growth on pierce
    growth: {
      enabled: true,
      sizePerPierce: 1.15,     // Size multiplier per pierce
      damagePerPierce: 1.1,    // Damage multiplier per pierce
      maxScale: 2.5            // Maximum size multiplier
    },

    // ============================================
    // SPECIAL BEHAVIORS - SINGULARITY (Black Hole)
    // ============================================

    // singularity: object - Black hole/pull effect
    singularity: {
      enabled: true,
      createOnHit: true,
      pullRadius: 140,         // Pull effect radius
      pullForce: 100,          // Pull strength
      duration: 3.0,           // How long singularity lasts
      tickDamage: 10,          // Damage while pulling
      tickRate: 0.5,           // Damage tick frequency
      implodeDamage: 80,       // Explosion damage at end
      implodeRadius: 120       // Explosion radius
    },

    // ============================================
    // SPECIAL BEHAVIORS - MAGNETIC PULL
    // ============================================

    // magneticPull: object - Continuous magnetic attraction
    magneticPull: {
      enabled: true,
      pullRadius: 140,         // Magnetic field radius
      pullStrength: 100,       // Pull force strength
      continuous: true         // Constant pull effect
    },

    // ============================================
    // SPECIAL BEHAVIORS - CHAIN REACTION (Mines)
    // ============================================

    // chainReaction: object - Mine chain detonation
    chainReaction: {
      enabled: true,
      triggerRadius: 120,                // Radius to trigger other mines
      chainDelay: 0.1,                   // Delay between chain explosions
      damageMultiplierPerChain: 1.15     // Damage boost per chain
    },

    // ============================================
    // SPECIAL BEHAVIORS - PHOENIX
    // ============================================

    // phoenix: object - Respawning projectile behavior
    phoenix: {
      enabled: true,
      respawnCount: 3,           // Times projectile respawns
      respawnDelay: 0.2,         // Delay before respawn
      respawnDamageBonus: 0.2,   // Damage increase per respawn

      // Sub-effect: Explosion on death
      deathExplosion: {
        enabled: true,
        radius: 60,
        damage: 25,
        burnDuration: 2.0
      },

      // Sub-effect: Fire trail
      fireTrail: {
        enabled: true,
        width: 20,
        damage: 8,
        duration: 1.5
      }
    },

    // ============================================
    // SPECIAL BEHAVIORS - PERMANENT GROWTH
    // ============================================

    // permanentGrowth: object - Persistent stat growth (like Void Emperor)
    permanentGrowth: {
      enabled: true,
      radiusPerKill: 0.5,        // Radius growth per kill
      maxRadius: 300,            // Maximum possible radius
      damagePerKill: 0.1,        // Damage growth per kill
      maxDamageBonus: 100,       // Maximum damage bonus

      // Growth stage milestones
      growthStages: [
        { kills: 25, name: 'Awakening', tentacles: 6, eyeCount: 2 },
        { kills: 75, name: 'Ascension', tentacles: 10, eyeCount: 4 },
        { kills: 150, name: 'Apotheosis', tentacles: 16, eyeCount: 9 }
      ]
    },

    // ============================================
    // SPECIAL BEHAVIORS - VOID EFFECTS
    // ============================================

    // voidEffects: object - Multiple void-themed mechanics
    voidEffects: {
      // Gravitational pull towards center
      gravitationalPull: {
        enabled: true,
        force: 50,
        radius: 100
      },

      // Percentage-based damage over time
      voidCorrosion: {
        enabled: true,
        damagePercent: 0.02,     // 2% max HP per tick
        applyWeakness: true,
        weaknessAmount: 0.15     // 15% increased damage taken
      },

      // Fear effect causing enemies to flee
      terrorAura: {
        enabled: true,
        radius: 80,
        fleeChance: 0.25,
        fleeDuration: 2.0
      }
    },

    // ============================================
    // SPECIAL BEHAVIORS - VOID MINIONS
    // ============================================

    // voidMinions: object - Minion spawning system
    voidMinions: {
      enabled: true,
      spawnInterval: 8.0,        // Seconds between spawns
      maxMinions: 5,             // Max active minions

      minionTypes: [
        { type: 'tendril', weight: 50 },
        { type: 'eye', weight: 30 },
        { type: 'maw', weight: 20 }
      ],

      minionScaling: {
        healthPerStage: 0.2,
        damagePerStage: 0.15
      }
    },

    // ============================================
    // SPECIAL BEHAVIORS - SOUL GAIN
    // ============================================

    // soulGain: object - Soul collection mechanics
    soulGain: {
      enabled: true,
      maxBonusSouls: 5,          // Maximum bonus souls
      killsPerSoul: 8,           // Kills needed per soul
      temporaryDuration: 0       // 0 = permanent
    },

    // ============================================
    // SPECIAL BEHAVIORS - ELEMENT CYCLE
    // ============================================

    // elementCycle: object - Cycling element effects (like Aurora)
    elementCycle: {
      enabled: true,
      cycleTime: 3.5,            // Seconds per element

      elements: [
        {
          name: 'Fire',
          color: '#FF6600',
          damage: 1.2,
          statusEffect: { type: 'burn', damage: 5, duration: 2.0 },
          particles: { color: '#FF9900', count: 10 }
        },
        {
          name: 'Ice',
          color: '#66CCFF',
          damage: 0.9,
          statusEffect: { type: 'slow', speedModifier: 0.5, duration: 2.0 },
          particles: { color: '#AADDFF', count: 8 }
        },
        {
          name: 'Lightning',
          color: '#FFFF00',
          damage: 1.5,
          statusEffect: { type: 'stun', duration: 0.5, chance: 0.3 },
          particles: { color: '#FFFFFF', count: 12 }
        }
      ],

      transitionEffect: {
        duration: 0.5,
        flash: true
      }
    },

    // ============================================
    // SPECIAL BEHAVIORS - CLONE
    // ============================================

    // cloneBehavior: object - Shadow clone mechanics
    cloneBehavior: {
      enabled: true,
      damageMultiplier: 0.5,     // Clone damage percentage
      copyWeapons: true,         // Clone uses player weapons
      followDistance: 80,        // Distance to stay from player
      mirrorMovement: true       // Mirror player actions
    },

    // ============================================
    // SPECIAL BEHAVIORS - TRAP/EXPLOSION
    // ============================================

    // trap: object - Trap behavior configuration
    trap: {
      maxTraps: 4,
      duration: 10.0,
      triggerOnContact: true
    },

    // explosion: object - Explosion effect
    explosion: {
      enabled: true,
      radius: 100,
      damage: 50
    },

    // ============================================
    // VISUAL EFFECTS - TRAIL
    // ============================================

    // trail: object - Movement trail visual
    trail: {
      enabled: true,
      color: '#9966FF',
      length: 20,              // Trail length in pixels
      fade: 0.6,               // Trail fade strength (or true/false)
      type: 'energy',          // Trail style: 'fire', 'shadow', 'streak', 'energy', 'smoke'
      width: 6,                // Trail width
      glow: true               // Add glow to trail
    },

    // ============================================
    // VISUAL EFFECTS - GLOW
    // ============================================

    // glow: object - Glow effect around projectile/weapon
    glow: {
      enabled: true,
      radius: 20,              // Glow size
      intensity: 0.5,          // Glow brightness (0.0-1.0)
      color: '#9966FF',        // Glow color
      pulse: true,             // Glow pulses
      pulseSpeed: 2.0          // Pulse frequency
    },

    // ============================================
    // VISUAL EFFECTS - PARTICLES
    // ============================================

    // particles: object - Particle effect spawning
    particles: {
      enabled: true,
      type: 'sparks',          // Particle type name
      color: '#9966FF',        // Single particle color
      colors: ['#9966FF', '#FFCC00', '#FF6600'],  // Multiple colors
      count: 8,                // Particles spawned per effect
      spread: 30,              // Spawn spread angle
      lifetime: 0.4,           // Particle duration
      inward: false,           // Spiral inward effect
      onBounce: false          // Only spawn on bounce
    },

    // ============================================
    // VISUAL EFFECTS - DISTORTION
    // ============================================

    // distortion: object - Screen/visual distortion effect
    distortion: {
      enabled: true,
      type: 'reality_warp',    // Distortion style
      radius: 100,             // Distortion area
      intensity: 0.5,          // Distortion strength
      growWithSize: true       // Scales with projectile size
    },

    // ============================================
    // VISUAL EFFECTS - SCREEN EFFECTS
    // ============================================

    // screenEffects: object - Screen-level visual effects
    screenEffects: {
      // Passive effects always active
      passive: {
        vignette: {
          color: '#660099',
          intensity: 0.2,
          growWithSize: true
        }
      },

      // Effects on growth stage change
      onGrowthStage: {
        shake: { intensity: 5, duration: 0.3 },
        flash: { color: '#9966FF', intensity: 0.3 }
      },

      // Effects on implosion/explosion
      onImplode: {
        shake: { intensity: 8, duration: 0.4 },
        flash: { color: '#660099', intensity: 0.4 }
      }
    },

    // ============================================
    // VISUAL EFFECTS - IMPACT
    // ============================================

    // impactEffect: object - Projectile impact visuals
    impactEffect: {
      type: 'explosion',       // Impact style
      radius: 40,              // Impact radius
      color: '#FF6600',        // Impact color
      shake: true              // Screen shake on impact
    },

    // ============================================
    // COMPLEX VISUAL CONTAINERS
    // ============================================

    // projectileVisual: object - Detailed projectile appearance
    projectileVisual: {
      type: 'energy_bolt',
      size: 12,
      shape: 'dart',
      metallic: false,
      rotation: true,
      rotationSpeed: 360,
      coreColor: '#9966FF',
      outerColor: '#FFCC00',
      ghostly: false,
      fadeTrail: true
    },

    // mineVisual: object - Mine appearance configuration
    mineVisual: {
      type: 'magnetic',
      hidden: false,
      revealOnProximity: true,
      coreColor: '#FF0000',
      fieldColor: '#FF6600',
      magneticField: true,
      fieldPulse: true,
      linked: true,            // Connected to other mines visually
      connectionLines: true,
      blinkSync: true          // All mines blink together
    },

    // summonVisual: object - Summon appearance configuration
    summonVisual: {
      type: 'skeleton',
      boneColor: '#DDDDDD',
      eyeGlow: '#00FF00',
      transparency: 0.9,
      shadowColor: '#000000',
      distortion: false
    },

    // voidVisual: object - Void creature appearance (complex entities)
    voidVisual: {
      type: 'eldritch',

      tentacles: {
        count: 8,
        length: 50,
        grabEnemies: true,
        color: '#330066'
      },

      eyes: {
        count: 4,
        glowColor: '#FF0000',
        blinkRate: 3.0
      },

      mass: {
        bubbling: true,
        distortion: true,
        starfieldInside: true,
        baseColor: '#000000'
      }
    },

    // auraVisual: object - Aura appearance configuration
    auraVisual: {
      type: 'pulsing',
      layerCount: 3,
      waveSpeed: 2.0,
      alphaOscillate: true,
      innerGlow: true
    },

    // areaVisual: object - Area effect appearance
    areaVisual: {
      type: 'pool',
      coreColor: '#9966FF',
      edgeColor: '#660099',
      spiralLines: true,
      distortion: true
    },

    // ============================================
    // SPECIAL ABILITIES (T4+ Weapons)
    // ============================================

    // specialAbility: object - Unique weapon abilities
    specialAbility: {
      name: 'Blood Harvest',
      description: 'Enemies explode on death, healing the player',

      // Blood explosion on kill
      bloodExplosion: {
        enabled: true,
        explosionRadius: 80,
        explosionDamage: 30,
        applyBleed: true,
        bleedChance: 0.5
      },

      // Soul reap damage boost
      soulReap: {
        enabled: true,
        damageBoost: 0.25,
        boostDuration: 5.0,
        maxStacks: 5
      },

      // Blood drain healing
      bloodDrain: {
        enabled: true,
        healPercent: 0.05,
        maxHealPerHit: 10
      }
    },

    // lifesteal: number - Percentage of damage converted to healing (0.0-1.0)
    lifesteal: 0.15,

    // execute: object - Execute enemies below health threshold
    execute: {
      enabled: true,
      threshold: 0.15,         // Execute below 15% HP
      bonusDamage: 2.0         // 2x damage to low HP targets
    },

    // knockback: number - Knockback force applied to enemies
    knockback: 50,

    // ============================================
    // UPGRADES (Level Progression)
    // ============================================

    // upgrades: object - Stats at each level (2-5)
    // Each level can override any stat defined above
    upgrades: {
      2: {
        damage: 35,
        projectileCount: 2,
        pierce: 2
      },
      3: {
        damage: 50,
        cooldown: 0.85,
        projectileCount: 3,
        pierce: 3
      },
      4: {
        damage: 70,
        cooldown: 0.7,
        projectileCount: 4,
        pierce: 4,
        // Can add new effects at higher levels
        statusEffect: {
          type: 'bleed',
          damage: 8,
          duration: 3.0,
          chance: 0.4
        }
      },
      5: {
        damage: 100,
        cooldown: 0.5,
        projectileCount: 5,
        pierce: 5,
        // Complex properties can also be upgraded
        ricochet: {
          enabled: true,
          bounces: 6,
          bounceRange: 180,
          damageRetention: 0.95
        }
      }
    }
  };

  // ============================================
  // NOTES FOR DEVELOPERS
  // ============================================
  /*
   * ATTACK TYPE REQUIREMENTS:
   *
   * PROJECTILE requires: projectileCount, projectileSpeed, size, lifetime
   * LASER requires: width, duration, range
   * MELEE_SWING requires: arcAngle, swingDuration, range
   * MELEE_THRUST requires: thrustDuration, range, thrustStyle
   * AREA_DAMAGE requires: radius, duration, tickRate
   * MINE requires: mineCount, triggerRadius, explosionRadius, maxMines
   * SUMMON requires: summonCount, summonHealth, summonDuration
   * PARTICLE requires: particleCount, orbitRadius, rotationSpeed
   *
   * VISUAL SPRITES:
   * - Weapon icons go in: styles/imgs/weapons/icons/
   * - Projectile sprites go in: styles/imgs/weapons/projectiles/
   * - Melee sprites go in: styles/imgs/weapons/melee/
   * - Area effect sprites go in: styles/imgs/weapons/area/
   *
   * ADDING TO GAME:
   * 1. Create weapon file in appropriate folder (basic/common, basic/rare, etc.)
   * 2. Register to Data.WeaponRegistry[weaponId]
   * 3. Add <script> tag in index.html BEFORE WeaponAggregator.js
   * 4. Aggregator auto-merges into WeaponData on load
   */

})(window.VampireSurvivors.Data);
