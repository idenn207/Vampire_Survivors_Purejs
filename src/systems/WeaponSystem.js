/**
 * @fileoverview Weapon system - orchestrates weapon firing and behaviors
 * @module Systems/WeaponSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var WeaponSlot = window.VampireSurvivors.Components.WeaponSlot;
  var PlayerStats = window.VampireSurvivors.Components.PlayerStats;
  var AttackType = window.VampireSurvivors.Data.AttackType;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class WeaponSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 15; // After AreaEffect (13), before Collision (20)
    _player = null;
    _input = null;
    _camera = null;

    // Behavior instances
    _projectileBehavior = null;
    _laserBehavior = null;
    _meleeBehavior = null;
    _thrustBehavior = null;
    _areaBehavior = null;
    _particleBehavior = null;
    _mineBehavior = null;
    _summonBehavior = null;

    // Active particle weapons for update
    _activeParticleWeapons = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._activeParticleWeapons = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Set the player entity
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
      // Update behaviors with new player reference
      this.updateBehaviorPlayer();
    }

    /**
     * Set the input handler
     * @param {Input} input
     */
    setInput(input) {
      this._input = input;
    }

    /**
     * Set the camera for world-to-screen conversion
     * @param {Camera} camera
     */
    setCamera(camera) {
      this._camera = camera;
    }

    /**
     * Initialize weapon behaviors
     */
    initializeBehaviors() {
      var Behaviors = window.VampireSurvivors.Behaviors;

      this._projectileBehavior = new Behaviors.ProjectileBehavior();
      this._laserBehavior = new Behaviors.LaserBehavior();
      this._meleeBehavior = new Behaviors.MeleeBehavior();
      this._thrustBehavior = new Behaviors.ThrustBehavior();
      this._areaBehavior = new Behaviors.AreaBehavior();
      this._particleBehavior = new Behaviors.ParticleBehavior();
      this._mineBehavior = new Behaviors.MineBehavior();
      this._summonBehavior = new Behaviors.SummonBehavior();

      // Initialize all behaviors with dependencies
      var behaviors = [
        this._projectileBehavior,
        this._laserBehavior,
        this._meleeBehavior,
        this._thrustBehavior,
        this._areaBehavior,
        this._particleBehavior,
        this._mineBehavior,
        this._summonBehavior,
      ];

      for (var i = 0; i < behaviors.length; i++) {
        behaviors[i].initialize(this._entityManager, this._input, events, this._player);
      }
    }

    /**
     * Update player reference on all behaviors
     * Called when player changes
     */
    updateBehaviorPlayer() {
      var behaviors = [
        this._projectileBehavior,
        this._laserBehavior,
        this._meleeBehavior,
        this._thrustBehavior,
        this._areaBehavior,
        this._particleBehavior,
        this._mineBehavior,
        this._summonBehavior,
      ];

      for (var i = 0; i < behaviors.length; i++) {
        if (behaviors[i] && behaviors[i].setPlayer) {
          behaviors[i].setPlayer(this._player);
        }
      }
    }

    /**
     * Main update loop
     * @param {number} deltaTime
     */
    update(deltaTime) {
      if (!this._player || !this._player.isActive) return;

      var weaponSlot = this._player.getComponent(WeaponSlot);
      if (!weaponSlot) return;

      // Get cooldown reduction from player stats + ActiveBuff (Mage's speed buff)
      var playerStats = this._player.getComponent(PlayerStats);
      var ActiveBuff = window.VampireSurvivors.Components.ActiveBuff;
      var activeBuff = ActiveBuff ? this._player.getComponent(ActiveBuff) : null;
      var GlobalStatsHelper = window.VampireSurvivors.Utils.GlobalStatsHelper;
      var cooldownReduction = GlobalStatsHelper.getCooldownReductionWithBuff(playerStats, activeBuff);

      // Update all weapon cooldowns with reduction
      weaponSlot.updateCooldowns(deltaTime, cooldownReduction);

      // Get all weapons
      var weapons = weaponSlot.getWeapons();

      for (var i = 0; i < weapons.length; i++) {
        var weapon = weapons[i];
        this._processWeapon(weapon, deltaTime);
      }

      // Update behaviors that need continuous updates
      this._updateBehaviors(deltaTime);
    }

    /**
     * Render weapon effects
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._player || !this._player.isActive) return;

      var weaponSlot = this._player.getComponent(WeaponSlot);
      if (!weaponSlot) return;

      // Render laser effects
      if (this._laserBehavior) {
        this._laserBehavior.render(ctx, this._camera);
      }

      // Render melee swings
      if (this._meleeBehavior) {
        this._meleeBehavior.render(ctx, this._camera);
      }

      // Render thrust attacks
      if (this._thrustBehavior) {
        this._thrustBehavior.render(ctx, this._camera);
      }

      // Render particle effects
      if (this._particleBehavior) {
        var particleWeapons = weaponSlot.getWeaponsByType(AttackType.PARTICLE);
        for (var i = 0; i < particleWeapons.length; i++) {
          this._particleBehavior.render(ctx, this._camera, particleWeapons[i]);
        }
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _processWeapon(weapon, deltaTime) {
      var attackType = weapon.attackType;

      // Check if weapon can fire
      if (!weapon.canFire()) {
        return;
      }

      // All weapons fire automatically after cooldown ends
      // (Manual weapons previously required mouse click, now auto-fire)

      // Get the appropriate behavior
      var behavior = this._getBehavior(attackType);
      if (!behavior) {
        return;
      }

      // Execute the behavior
      var result = behavior.execute(weapon, this._player);

      // Fire the weapon (reset cooldown)
      // Note: Rotating blades don't have cooldown
      if (weapon.cooldownMax > 0) {
        weapon.fire();
      }

      // Emit weapon fired event
      events.emit('weapon:fired', {
        weapon: weapon,
        player: this._player,
        result: result,
      });
    }

    _getBehavior(attackType) {
      switch (attackType) {
        case AttackType.PROJECTILE:
          return this._projectileBehavior;
        case AttackType.LASER:
          return this._laserBehavior;
        case AttackType.MELEE_SWING:
          return this._meleeBehavior;
        case AttackType.MELEE_THRUST:
          return this._thrustBehavior;
        case AttackType.AREA_DAMAGE:
          return this._areaBehavior;
        case AttackType.PARTICLE:
          return this._particleBehavior;
        case AttackType.MINE:
          return this._mineBehavior;
        case AttackType.SUMMON:
          return this._summonBehavior;
        default:
          console.warn('[WeaponSystem] Unknown attack type:', attackType);
          return null;
      }
    }

    _updateBehaviors(deltaTime) {
      // Update laser visuals
      if (this._laserBehavior) {
        this._laserBehavior.update(deltaTime);
      }

      // Update melee swing visuals
      if (this._meleeBehavior) {
        this._meleeBehavior.update(deltaTime);
      }

      // Update thrust visuals
      if (this._thrustBehavior) {
        this._thrustBehavior.update(deltaTime);
      }

      // Update particle behaviors (rotating blades, chain lightning visuals)
      if (this._particleBehavior && this._player) {
        var weaponSlot = this._player.getComponent(WeaponSlot);
        if (weaponSlot) {
          var particleWeapons = weaponSlot.getWeaponsByType(AttackType.PARTICLE);
          for (var i = 0; i < particleWeapons.length; i++) {
            this._particleBehavior.update(deltaTime, this._player, particleWeapons[i]);
          }
        }
      }
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var weaponInfo = 'None';

      if (this._player && this._player.isActive) {
        var weaponSlot = this._player.getComponent(WeaponSlot);
        if (weaponSlot) {
          var weapons = weaponSlot.getWeapons();
          weaponInfo = weapons
            .map(function (w) {
              return w.name + ' (Lv' + w.level + ')';
            })
            .join(', ');
        }
      }

      return {
        label: 'Weapons',
        entries: [{ key: 'Equipped', value: weaponInfo || 'None' }],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      if (this._projectileBehavior) {
        this._projectileBehavior.dispose();
        this._projectileBehavior = null;
      }
      if (this._laserBehavior) {
        this._laserBehavior.dispose();
        this._laserBehavior = null;
      }
      if (this._meleeBehavior) {
        this._meleeBehavior.dispose();
        this._meleeBehavior = null;
      }
      if (this._thrustBehavior) {
        this._thrustBehavior.dispose();
        this._thrustBehavior = null;
      }
      if (this._areaBehavior) {
        this._areaBehavior.dispose();
        this._areaBehavior = null;
      }
      if (this._particleBehavior) {
        this._particleBehavior.dispose();
        this._particleBehavior = null;
      }
      if (this._mineBehavior) {
        this._mineBehavior.dispose();
        this._mineBehavior = null;
      }
      if (this._summonBehavior) {
        this._summonBehavior.dispose();
        this._summonBehavior = null;
      }

      this._player = null;
      this._input = null;
      this._camera = null;
      this._activeParticleWeapons = [];

      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.WeaponSystem = WeaponSystem;
})(window.VampireSurvivors.Systems);
