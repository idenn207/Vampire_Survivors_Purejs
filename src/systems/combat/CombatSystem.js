/**
 * @fileoverview Combat system - handles damage from collisions
 * @module Systems/Combat/CombatSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var Health = window.VampireSurvivors.Components.Health;
  var ProjectileComponent = window.VampireSurvivors.Components.Projectile;
  var Transform = window.VampireSurvivors.Components.Transform;
  var WeaponSlot = window.VampireSurvivors.Components.WeaponSlot;
  var StatusEffect = window.VampireSurvivors.Components.StatusEffect;
  var events = window.VampireSurvivors.Core.events;
  var projectilePool = window.VampireSurvivors.Pool.projectilePool;

  // Import modular handlers
  var CombatConstants = Systems.CombatConstants;
  var DamageProcessor = Systems.DamageProcessor;
  var EffectHandlers = Systems.EffectHandlers;
  var RicochetHandler = Systems.RicochetHandler;
  var ExplosionHandler = Systems.ExplosionHandler;

  // ============================================
  // Class Definition
  // ============================================
  class CombatSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 25; // After CollisionSystem (20), before CameraSystem (50)
    _collisionSystem = null;
    _player = null;
    _damageDealt = 0;
    _damageReceived = 0;
    _criticalHits = 0;
    _lifestealHealed = 0;
    _statusEffectsApplied = 0;

    // Per-enemy collision cooldown tracking
    _enemyCollisionCooldowns = new Map();

    // Enemy explosion passive
    _enemyExplosionEnabled = false;
    _enemyExplosionDamage = 30;
    _enemyExplosionRadius = 50;

    // Event handler for entity death
    _boundOnEntityDeath = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._boundOnEntityDeath = this._handleEntityDeath.bind(this);
      events.on('entity:died', this._boundOnEntityDeath);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setCollisionSystem(collisionSystem) {
      this._collisionSystem = collisionSystem;
    }

    setPlayer(player) {
      this._player = player;
    }

    /**
     * Enable enemy explosion passive
     * @param {number} damage - Explosion damage
     * @param {number} radius - Explosion radius
     */
    enableEnemyExplosions(damage, radius) {
      this._enemyExplosionEnabled = true;
      this._enemyExplosionDamage = damage || 30;
      this._enemyExplosionRadius = radius || 50;
    }

    /**
     * Disable enemy explosion passive
     */
    disableEnemyExplosions() {
      this._enemyExplosionEnabled = false;
    }

    /**
     * Check if enemy explosions are enabled
     * @returns {boolean}
     */
    isEnemyExplosionEnabled() {
      return this._enemyExplosionEnabled;
    }

    update(deltaTime) {
      if (!this._entityManager || !this._collisionSystem) return;

      // Update all health components' invincibility timers
      this._updateHealthTimers(deltaTime);

      // Update per-enemy collision cooldowns
      this._updateCollisionCooldowns(deltaTime);

      // Process collisions
      this._processCollisions();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _updateHealthTimers(deltaTime) {
      var entities = this._entityManager.getWithComponents(Health);

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (!entity.isActive) continue;

        var health = entity.getComponent(Health);
        if (health) {
          health.update(deltaTime);
        }
      }
    }

    _updateCollisionCooldowns(deltaTime) {
      // Iterate through all cooldowns and decrease them
      var toRemove = [];
      this._enemyCollisionCooldowns.forEach(function (cooldown, enemyId) {
        var newCooldown = cooldown - deltaTime;
        if (newCooldown <= 0) {
          toRemove.push(enemyId);
        } else {
          this._enemyCollisionCooldowns.set(enemyId, newCooldown);
        }
      }, this);

      // Remove expired cooldowns
      for (var i = 0; i < toRemove.length; i++) {
        this._enemyCollisionCooldowns.delete(toRemove[i]);
      }
    }

    _processCollisions() {
      // Process player-enemy collisions
      if (this._player && this._player.isActive) {
        var playerCollisions = this._collisionSystem.getCollisionsByTags('player', 'enemy');

        for (var i = 0; i < playerCollisions.length; i++) {
          var collision = playerCollisions[i];
          var player = collision.entityA;
          var enemy = collision.entityB;

          this._handlePlayerEnemyCollision(player, enemy);
        }
      }

      // Process hitbox-enemy collisions (projectiles hitting enemies)
      this._processHitboxCollisions();
    }

    _processHitboxCollisions() {
      // Get all hitbox-enemy collisions
      var hitboxCollisions = this._collisionSystem.getCollisionsByTags('hitbox', 'enemy');

      for (var i = 0; i < hitboxCollisions.length; i++) {
        var collision = hitboxCollisions[i];
        var hitbox = collision.entityA;
        var enemy = collision.entityB;

        this._handleHitboxEnemyCollision(hitbox, enemy);
      }
    }

    _handleHitboxEnemyCollision(hitbox, enemy) {
      // Check if hitbox is still active
      if (!hitbox.isActive || !enemy.isActive) return;

      // Get enemy health
      var enemyHealth = enemy.getComponent(Health);
      if (!enemyHealth || enemyHealth.isDead) return;

      // Handle projectile collision
      var projectileComp = hitbox.getComponent(ProjectileComponent);
      if (projectileComp) {
        // Check if already hit this enemy
        if (projectileComp.hasHitEnemy(enemy.id)) {
          return;
        }

        // Get weapon config for enhanced effects
        var weaponConfig = this._getWeaponConfig(projectileComp.sourceWeaponId);

        // Use projectile's pre-calculated damage and crit status
        // (crit already applied in behavior when spawning)
        var finalDamage = projectileComp.damage;
        var isCrit = projectileComp.isCrit;

        // Track crit stats
        if (isCrit) {
          this._criticalHits++;
        }

        // Apply execute bonus (extra damage to low HP enemies) - only non-crit modifier
        finalDamage = DamageProcessor.applyExecuteBonus(finalDamage, enemy, weaponConfig);

        // Apply weakness/mark damage modifiers from status effects
        finalDamage = DamageProcessor.applyStatusEffectModifiers(finalDamage, enemy);

        // Apply damage (pass isCrit for damage number display)
        var wasAlive = !enemyHealth.isDead;
        enemyHealth.takeDamage(finalDamage, isCrit);
        this._damageDealt += finalDamage;

        // Track damage per weapon for Tab screen stats
        this._trackWeaponDamage(projectileComp.sourceWeaponId, finalDamage);

        // Apply status effects
        if (weaponConfig && weaponConfig.statusEffects) {
          EffectHandlers.applyStatusEffects(enemy, weaponConfig.statusEffects, hitbox, this);
        }

        // Apply knockback
        if (weaponConfig && weaponConfig.knockback && weaponConfig.knockback > 0) {
          EffectHandlers.applyKnockback(hitbox, enemy, weaponConfig.knockback);
        }

        // Process lifesteal
        if (weaponConfig && weaponConfig.lifesteal && weaponConfig.lifesteal > 0) {
          EffectHandlers.processLifesteal(this._player, finalDamage, weaponConfig.lifesteal, this);
        }

        // Process heal on hit
        if (weaponConfig && weaponConfig.healOnHit && weaponConfig.healOnHit > 0) {
          EffectHandlers.processHealOnHit(this._player, weaponConfig.healOnHit);
        }

        // Emit weapon hit event
        events.emit('weapon:hit', {
          hitbox: hitbox,
          enemy: enemy,
          damage: finalDamage,
          isCrit: isCrit,
          type: 'projectile',
          weaponId: projectileComp.sourceWeaponId,
        });

        // Check for kill and process on-kill effects
        var wasKilled = wasAlive && enemyHealth.isDead;
        if (wasKilled && weaponConfig && weaponConfig.onKill) {
          ExplosionHandler.processOnKillEffects(enemy, weaponConfig.onKill, hitbox);
        }

        // Handle pierce - returns true if projectile should be destroyed
        var shouldDestroy = projectileComp.onHit(enemy.id);

        if (shouldDestroy) {
          // Check if we can ricochet before destroying
          if (projectileComp.canRicochet()) {
            RicochetHandler.handleRicochet(hitbox, enemy, projectileComp, this._entityManager);
          } else {
            projectilePool.despawn(hitbox);
          }
        }
      }
    }

    /**
     * Get weapon configuration from player's equipped weapon
     * @param {string} weaponId
     * @returns {Object|null}
     */
    _getWeaponConfig(weaponId) {
      if (!weaponId || !this._player) return null;

      var weaponSlot = this._player.getComponent(WeaponSlot);
      if (!weaponSlot) return null;

      var weapon = weaponSlot.getWeapon(weaponId);
      if (!weapon) return null;

      // Return weapon data which contains all config including statusEffects, knockback, etc.
      return weapon.data || weapon.getAllStats();
    }

    /**
     * Track damage dealt by a specific weapon for Tab screen stats
     * @param {string} weaponId - The weapon ID
     * @param {number} damage - Damage amount dealt
     */
    _trackWeaponDamage(weaponId, damage) {
      if (!weaponId || !this._player) return;

      var weaponSlot = this._player.getComponent(WeaponSlot);
      if (!weaponSlot) return;

      var weapon = weaponSlot.getWeapon(weaponId);
      if (weapon && weapon.addDamageDealt) {
        weapon.addDamageDealt(damage);
      }
    }

    _handlePlayerEnemyCollision(player, enemy) {
      var playerHealth = player.getComponent(Health);
      var enemyHealth = enemy.getComponent(Health);

      // Check if this enemy is on cooldown
      if (this._enemyCollisionCooldowns.has(enemy.id)) {
        return;
      }

      // Player takes damage (NO invincibility check, NO invincibility frames)
      if (playerHealth && !playerHealth.isDead) {
        var enemyDamage = enemy.damage !== undefined ? enemy.damage : 10;
        var damageApplied = playerHealth.takeDamage(enemyDamage);

        if (damageApplied) {
          // Track stats
          this._damageReceived += enemyDamage;

          // Emit player-specific event
          events.emit('player:damaged', {
            player: player,
            enemy: enemy,
            amount: enemyDamage,
            currentHealth: playerHealth.currentHealth,
            maxHealth: playerHealth.maxHealth,
          });

          // Check for player death
          if (playerHealth.isDead) {
            events.emit('player:died', {
              player: player,
              killer: enemy,
            });
          }
        }
      }

      // Player deals contact damage to enemy
      if (enemyHealth && !enemyHealth.isDead) {
        var contactDamage = player.contactDamage;
        var wasAlive = !enemyHealth.isDead;
        enemyHealth.takeDamage(contactDamage);
        this._damageDealt += contactDamage;

        // Emit damage event
        events.emit('enemy:damaged', {
          entity: enemy,
          damage: contactDamage,
          source: 'contact',
        });

        // Check if enemy died
        if (wasAlive && enemyHealth.isDead) {
          events.emit('entity:died', { entity: enemy, killer: player });
        }
      }

      // Set cooldown for this enemy
      this._enemyCollisionCooldowns.set(enemy.id, CombatConstants.CONTACT_DAMAGE_COOLDOWN);
    }

    /**
     * Handle entity death for enemy explosion passive
     * @param {Object} data - { entity, killer }
     */
    _handleEntityDeath(data) {
      if (!this._enemyExplosionEnabled) return;
      if (!data.entity || !data.entity.hasTag('enemy')) return;

      ExplosionHandler.handleEnemyDeathExplosion(
        data.entity,
        this._enemyExplosionDamage,
        this._enemyExplosionRadius,
        this._entityManager
      );
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var playerHealth = null;
      var playerInvincible = false;

      if (this._player && this._player.isActive) {
        var health = this._player.getComponent(Health);
        if (health) {
          playerHealth = health.currentHealth + '/' + health.maxHealth;
          playerInvincible = health.isInvincible;
        }
      }

      return {
        label: 'Combat',
        entries: [
          { key: 'Player HP', value: playerHealth || 'N/A' },
          { key: 'Invincible', value: playerInvincible ? 'Yes' : 'No' },
          { key: 'Dmg Dealt', value: this._damageDealt },
          { key: 'Dmg Received', value: this._damageReceived },
          { key: 'Crits', value: this._criticalHits },
          { key: 'Lifesteal', value: this._lifestealHealed },
          { key: 'Status Applied', value: this._statusEffectsApplied },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      if (this._boundOnEntityDeath) {
        events.off('entity:died', this._boundOnEntityDeath);
        this._boundOnEntityDeath = null;
      }
      this._collisionSystem = null;
      this._player = null;
      this._enemyCollisionCooldowns.clear();
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.CombatSystem = CombatSystem;
})(window.VampireSurvivors.Systems);
