/**
 * @fileoverview Pickup system - handles pickup magnetization and collection
 * @module Systems/PickupSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var events = window.VampireSurvivors.Core.events;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Velocity = window.VampireSurvivors.Components.Velocity;
  var PickupComponent = window.VampireSurvivors.Components.Pickup;
  var Experience = window.VampireSurvivors.Components.Experience;
  var Gold = window.VampireSurvivors.Components.Gold;
  var Health = window.VampireSurvivors.Components.Health;
  var pickupPool = window.VampireSurvivors.Pool.pickupPool;
  var PickupConfig = window.VampireSurvivors.Data.PickupConfig;

  // ============================================
  // Class Definition
  // ============================================
  class PickupSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 27; // After DropSystem (26)
    _player = null;
    _collisionSystem = null;
    _pickupsCollected = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Set the player reference
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
    }

    /**
     * Set the collision system reference
     * @param {CollisionSystem} collisionSystem
     */
    setCollisionSystem(collisionSystem) {
      this._collisionSystem = collisionSystem;
    }

    /**
     * Update pickups each frame
     * @param {number} deltaTime
     */
    update(deltaTime) {
      if (!this._player || !this._player.isActive) return;

      // Get all active pickups
      var pickups = this._entityManager.getByTag('pickup');
      if (!pickups || pickups.length === 0) return;

      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) return;

      var playerCenterX = playerTransform.centerX;
      var playerCenterY = playerTransform.centerY;

      // Process magnetization for each pickup
      for (var i = 0; i < pickups.length; i++) {
        var pickup = pickups[i];
        if (!pickup.isActive) continue;

        this._updatePickupMagnetization(pickup, playerCenterX, playerCenterY, deltaTime);
      }

      // Process pickup collisions
      this._processPickupCollisions();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Update magnetization for a single pickup
     * @param {Entity} pickup
     * @param {number} playerX
     * @param {number} playerY
     * @param {number} deltaTime
     */
    _updatePickupMagnetization(pickup, playerX, playerY, deltaTime) {
      var pickupTransform = pickup.getComponent(Transform);
      var pickupComp = pickup.getComponent(PickupComponent);
      var velocity = pickup.getComponent(Velocity);

      if (!pickupTransform || !pickupComp || !velocity) return;

      var pickupCenterX = pickupTransform.centerX;
      var pickupCenterY = pickupTransform.centerY;

      // Calculate distance to player
      var dx = playerX - pickupCenterX;
      var dy = playerY - pickupCenterY;
      var distanceSquared = dx * dx + dy * dy;
      var distance = Math.sqrt(distanceSquared);

      // Check if player has magnet active - ALL pickups magnetize regardless of distance
      if (this._player.isMagnetActive) {
        if (!pickupComp.isMagnetized) {
          pickupComp.startMagnetizing();
        }

        // Apply velocity toward player with max speed cap
        if (distance > 1) {
          var dirX = dx / distance;
          var dirY = dy / distance;
          var speed = Math.min(this._player.magnetMaxSpeed, pickupComp.magnetSpeed * 2);
          velocity.vx = dirX * speed;
          velocity.vy = dirY * speed;
        } else {
          velocity.vx = 0;
          velocity.vy = 0;
        }
        return; // Skip normal magnetization logic
      }

      // Normal magnetization (only within pickup's magnetRadius)
      var magnetRadius = pickupComp.magnetRadius;

      // Check if within magnet radius
      if (distance < magnetRadius && !pickupComp.isMagnetized) {
        pickupComp.startMagnetizing();
      }

      // Apply magnetization velocity
      if (pickupComp.isMagnetized && distance > 1) {
        // Normalize direction
        var dirX = dx / distance;
        var dirY = dy / distance;

        // Set velocity toward player
        velocity.vx = dirX * pickupComp.magnetSpeed;
        velocity.vy = dirY * pickupComp.magnetSpeed;
      } else if (pickupComp.isMagnetized && distance <= 1) {
        // Very close, stop moving
        velocity.vx = 0;
        velocity.vy = 0;
      }
    }

    /**
     * Process pickup collisions with player
     */
    _processPickupCollisions() {
      if (!this._collisionSystem) return;

      var collisions = this._collisionSystem.getCollisionsByTags('player', 'pickup');
      if (!collisions || collisions.length === 0) return;

      for (var i = 0; i < collisions.length; i++) {
        var collision = collisions[i];
        var player = collision.entityA.hasTag('player') ? collision.entityA : collision.entityB;
        var pickup = collision.entityA.hasTag('pickup') ? collision.entityA : collision.entityB;

        if (pickup.isActive) {
          this._collectPickup(player, pickup);
        }
      }
    }

    /**
     * Collect a pickup and apply its effect
     * @param {Entity} player
     * @param {Entity} pickup
     */
    _collectPickup(player, pickup) {
      var pickupComp = pickup.getComponent(PickupComponent);
      if (!pickupComp) return;

      var type = pickupComp.type;
      var value = pickupComp.value;

      // Apply pickup effect based on type
      if (type === 'exp') {
        var experience = player.getComponent(Experience);
        if (experience) {
          experience.addExperience(value);
        }
      } else if (type === 'gold') {
        var gold = player.getComponent(Gold);
        if (gold) {
          gold.addGold(value);
        }
      } else if (type === 'health') {
        var health = player.getComponent(Health);
        if (health) {
          health.heal(value);
        }
      } else if (type === 'magnet') {
        var config = PickupConfig.getPickupConfig('magnet');
        if (config && player.activateMagnet) {
          player.activateMagnet(config.duration, config.maxPullSpeed);
        }
      }

      // Emit collection event
      events.emit('pickup:collected', {
        player: player,
        pickup: pickup,
        type: type,
        value: value,
      });

      // Return to pool
      pickupPool.despawn(pickup);

      // Update stats
      this._pickupsCollected++;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get pickupsCollected() {
      return this._pickupsCollected;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var activePickups = this._entityManager
        ? this._entityManager.getCountByTag('pickup')
        : 0;

      return {
        label: 'Pickup System',
        entries: [
          { key: 'Active', value: activePickups },
          { key: 'Collected', value: this._pickupsCollected },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      this._collisionSystem = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.PickupSystem = PickupSystem;
})(window.VampireSurvivors.Systems);
