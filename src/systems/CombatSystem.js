/**
 * @fileoverview Combat system - handles damage from collisions
 * @module Systems/CombatSystem
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
  var Velocity = window.VampireSurvivors.Components.Velocity;
  var WeaponSlot = window.VampireSurvivors.Components.WeaponSlot;
  var StatusEffect = window.VampireSurvivors.Components.StatusEffect;
  var StatusEffectConfig = window.VampireSurvivors.Data.StatusEffectConfig;
  var events = window.VampireSurvivors.Core.events;
  var projectilePool = window.VampireSurvivors.Pool.projectilePool;
  var areaEffectPool = window.VampireSurvivors.Pool.areaEffectPool;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_INVINCIBILITY_DURATION = 1; // seconds

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

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
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

    update(deltaTime) {
      if (!this._entityManager || !this._collisionSystem) return;

      // Update all health components' invincibility timers
      this._updateHealthTimers(deltaTime);

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

        // Calculate enhanced damage
        var damageResult = this._calculateEnhancedDamage(
          projectileComp.damage,
          enemy,
          weaponConfig
        );

        // Apply damage
        var wasAlive = !enemyHealth.isDead;
        enemyHealth.takeDamage(damageResult.finalDamage);
        this._damageDealt += damageResult.finalDamage;

        // Apply status effects
        if (weaponConfig && weaponConfig.statusEffects) {
          this._applyStatusEffects(enemy, weaponConfig.statusEffects, hitbox);
        }

        // Apply knockback
        if (weaponConfig && weaponConfig.knockback && weaponConfig.knockback > 0) {
          this._applyKnockback(hitbox, enemy, weaponConfig.knockback);
        }

        // Process lifesteal
        if (weaponConfig && weaponConfig.lifesteal && weaponConfig.lifesteal > 0) {
          this._processLifesteal(damageResult.finalDamage, weaponConfig.lifesteal);
        }

        // Process heal on hit
        if (weaponConfig && weaponConfig.healOnHit && weaponConfig.healOnHit > 0) {
          this._processHealOnHit(weaponConfig.healOnHit);
        }

        // Emit weapon hit event
        events.emit('weapon:hit', {
          hitbox: hitbox,
          enemy: enemy,
          damage: damageResult.finalDamage,
          isCrit: damageResult.isCrit,
          type: 'projectile',
          weaponId: projectileComp.sourceWeaponId,
        });

        // Check for kill and process on-kill effects
        var wasKilled = wasAlive && enemyHealth.isDead;
        if (wasKilled && weaponConfig && weaponConfig.onKill) {
          this._processOnKillEffects(enemy, weaponConfig.onKill, hitbox);
        }

        // Handle pierce - returns true if projectile should be destroyed
        var shouldDestroy = projectileComp.onHit(enemy.id);

        if (shouldDestroy) {
          // Check if we can ricochet before destroying
          if (projectileComp.canRicochet()) {
            this._handleRicochet(hitbox, enemy, projectileComp);
          } else {
            projectilePool.despawn(hitbox);
          }
        }
      }
    }

    /**
     * Handle projectile ricochet to a new target
     * @param {Entity} hitbox - The projectile
     * @param {Entity} hitEnemy - The enemy that was hit
     * @param {Projectile} projectileComp - Projectile component
     */
    _handleRicochet(hitbox, hitEnemy, projectileComp) {
      // Perform ricochet (reduces bounces, applies damage decay)
      if (!projectileComp.doRicochet()) {
        projectilePool.despawn(hitbox);
        return;
      }

      var hitboxTransform = hitbox.getComponent(Transform);
      if (!hitboxTransform) {
        projectilePool.despawn(hitbox);
        return;
      }

      // Find nearest enemy that hasn't been hit
      var newTarget = this._findRicochetTarget(
        hitbox,
        hitEnemy,
        projectileComp
      );

      if (!newTarget) {
        projectilePool.despawn(hitbox);
        return;
      }

      // Redirect projectile toward new target
      var targetTransform = newTarget.getComponent(Transform);
      if (!targetTransform) {
        projectilePool.despawn(hitbox);
        return;
      }

      var dx = targetTransform.centerX - hitboxTransform.x;
      var dy = targetTransform.centerY - hitboxTransform.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        var Velocity = window.VampireSurvivors.Components.Velocity;
        var velocity = hitbox.getComponent(Velocity);
        if (velocity) {
          var speed = velocity.speed || 400;
          velocity.vx = (dx / distance) * speed;
          velocity.vy = (dy / distance) * speed;
        }
      }

      events.emit('projectile:ricochet', {
        projectile: hitbox,
        from: hitEnemy,
        to: newTarget,
        remainingBounces: projectileComp.ricochetBounces,
      });
    }

    /**
     * Find a valid ricochet target
     * @param {Entity} hitbox
     * @param {Entity} hitEnemy
     * @param {Projectile} projectileComp
     * @returns {Entity|null}
     */
    _findRicochetTarget(hitbox, hitEnemy, projectileComp) {
      if (!this._entityManager) return null;

      var hitboxTransform = hitbox.getComponent(Transform);
      if (!hitboxTransform) return null;

      var range = projectileComp.ricochetRange;
      var rangeSq = range * range;

      var enemies = this._entityManager.getByTag('enemy');
      var bestTarget = null;
      var bestDistSq = Infinity;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive || enemy === hitEnemy) continue;

        // Skip already-hit enemies
        if (projectileComp.hasHitEnemy(enemy.id)) continue;

        var enemyHealth = enemy.getComponent(Health);
        if (!enemyHealth || enemyHealth.isDead) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        var dx = enemyTransform.centerX - hitboxTransform.x;
        var dy = enemyTransform.centerY - hitboxTransform.y;
        var distSq = dx * dx + dy * dy;

        if (distSq <= rangeSq && distSq < bestDistSq) {
          bestDistSq = distSq;
          bestTarget = enemy;
        }
      }

      return bestTarget;
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
     * Calculate enhanced damage with crits, execute, weakness modifiers
     * @param {number} baseDamage
     * @param {Entity} enemy
     * @param {Object} weaponConfig
     * @returns {Object} { finalDamage, isCrit }
     */
    _calculateEnhancedDamage(baseDamage, enemy, weaponConfig) {
      var damage = baseDamage;
      var isCrit = false;

      // 1. Roll for critical hit
      if (weaponConfig) {
        var critChance = weaponConfig.critChance || 0;
        var critMultiplier = weaponConfig.critMultiplier || 2;

        if (critChance > 0 && Math.random() < critChance) {
          damage *= critMultiplier;
          isCrit = true;
          this._criticalHits++;
        }
      }

      // 2. Apply execute bonus (bonus damage to low HP enemies)
      if (weaponConfig && weaponConfig.executeThreshold) {
        var enemyHealth = enemy.getComponent(Health);
        if (enemyHealth) {
          var hpPercent = enemyHealth.currentHealth / enemyHealth.maxHealth;
          if (hpPercent <= weaponConfig.executeThreshold) {
            var executeMultiplier = weaponConfig.executeMultiplier || 2;
            damage *= executeMultiplier;
          }
        }
      }

      // 3. Apply weakness/mark damage modifiers from status effects
      var statusEffect = enemy.getComponent(StatusEffect);
      if (statusEffect) {
        var damageTakenModifier = statusEffect.getDamageTakenModifier();
        damage *= damageTakenModifier;
      }

      // 4. Apply armor penetration (if enemy has armor)
      // Note: Armor system would need to be added to enemies
      // For now, armor pierce is a placeholder for future implementation

      return {
        finalDamage: Math.round(damage),
        isCrit: isCrit,
      };
    }

    /**
     * Apply status effects to enemy
     * @param {Entity} enemy
     * @param {Array} statusEffects
     * @param {Entity} hitbox - Source for position
     */
    _applyStatusEffects(enemy, statusEffects, hitbox) {
      if (!statusEffects || statusEffects.length === 0) return;

      // Get or add StatusEffect component
      var statusEffect = enemy.getComponent(StatusEffect);
      if (!statusEffect) {
        statusEffect = new StatusEffect();
        enemy.addComponent(statusEffect);
      }

      // Get hitbox position for pull source
      var hitboxTransform = hitbox.getComponent(Transform);
      var sourcePosition = hitboxTransform
        ? { x: hitboxTransform.x, y: hitboxTransform.y }
        : null;

      for (var i = 0; i < statusEffects.length; i++) {
        var effectConfig = statusEffects[i];

        // Check proc chance
        var chance = effectConfig.chance !== undefined ? effectConfig.chance : 1;
        if (Math.random() > chance) continue;

        // Apply the effect
        var config = Object.assign({}, effectConfig);
        config.sourcePosition = sourcePosition;

        statusEffect.applyEffect(effectConfig.type, config);
        this._statusEffectsApplied++;
      }
    }

    /**
     * Apply knockback to enemy
     * @param {Entity} hitbox
     * @param {Entity} enemy
     * @param {number} force
     */
    _applyKnockback(hitbox, enemy, force) {
      var enemyVelocity = enemy.getComponent(Velocity);
      if (!enemyVelocity) return;

      var hitboxTransform = hitbox.getComponent(Transform);
      var enemyTransform = enemy.getComponent(Transform);
      if (!hitboxTransform || !enemyTransform) return;

      // Calculate direction from hitbox to enemy
      var dx = enemyTransform.x - hitboxTransform.x;
      var dy = enemyTransform.y - hitboxTransform.y;

      // Apply knockback
      enemyVelocity.applyKnockback(dx, dy, force);
    }

    /**
     * Process lifesteal healing
     * @param {number} damage
     * @param {number} lifestealPercent
     */
    _processLifesteal(damage, lifestealPercent) {
      if (!this._player) return;

      var healAmount = Math.floor(damage * lifestealPercent);
      if (healAmount <= 0) return;

      var playerHealth = this._player.getComponent(Health);
      if (playerHealth && !playerHealth.isDead) {
        playerHealth.heal(healAmount);
        this._lifestealHealed += healAmount;

        events.emit('player:lifesteal', {
          amount: healAmount,
          source: 'weapon',
        });
      }
    }

    /**
     * Process flat heal on hit
     * @param {number} healAmount
     */
    _processHealOnHit(healAmount) {
      if (!this._player || healAmount <= 0) return;

      var playerHealth = this._player.getComponent(Health);
      if (playerHealth && !playerHealth.isDead) {
        playerHealth.heal(healAmount);

        events.emit('player:healed', {
          amount: healAmount,
          source: 'heal_on_hit',
        });
      }
    }

    /**
     * Process on-kill effects (explosions, etc.)
     * @param {Entity} killedEnemy
     * @param {Object} onKill
     * @param {Entity} hitbox
     */
    _processOnKillEffects(killedEnemy, onKill, hitbox) {
      if (!onKill) return;

      // Check proc chance
      var chance = onKill.chance !== undefined ? onKill.chance : 1;
      if (Math.random() > chance) return;

      var enemyTransform = killedEnemy.getComponent(Transform);
      if (!enemyTransform) return;

      // Process explosion
      if (onKill.explosion) {
        this._createExplosion(
          enemyTransform.x,
          enemyTransform.y,
          onKill.explosion.radius || 60,
          onKill.explosion.damage || 25
        );
      }

      // Process shatter (for frozen enemies)
      if (onKill.shatter) {
        var statusEffect = killedEnemy.getComponent(StatusEffect);
        if (statusEffect && statusEffect.isFrozen()) {
          this._createExplosion(
            enemyTransform.x,
            enemyTransform.y,
            onKill.shatter.radius || 50,
            onKill.shatter.damage || 20
          );
        }
      }

      // Emit on-kill event for other systems (frenzy stacking, etc.)
      events.emit('weapon:on_kill', {
        enemy: killedEnemy,
        weaponId: hitbox.getComponent(ProjectileComponent)?.sourceWeaponId,
        onKillConfig: onKill,
      });
    }

    /**
     * Create an explosion area effect
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {number} damage
     */
    _createExplosion(x, y, radius, damage) {
      // Check if areaEffectPool is available
      if (!areaEffectPool) {
        console.warn('[CombatSystem] areaEffectPool not available');
        return;
      }

      // Spawn explosion area effect
      var explosion = areaEffectPool.spawn(
        x,
        y,
        radius,
        damage,
        0.1, // Very short duration (single hit)
        0, // No tick rate (instant damage)
        'explosion_on_kill'
      );

      if (explosion) {
        events.emit('effect:explosion', {
          x: x,
          y: y,
          radius: radius,
          damage: damage,
        });
      }
    }

    _handlePlayerEnemyCollision(player, enemy) {
      var playerHealth = player.getComponent(Health);
      if (!playerHealth || playerHealth.isDead || playerHealth.isInvincible) {
        return;
      }

      // Get enemy damage (from _damage property or default)
      var damage = enemy.damage !== undefined ? enemy.damage : 10;

      // Apply damage
      var damageApplied = playerHealth.takeDamage(damage);

      if (damageApplied) {
        // Set invincibility
        playerHealth.setInvincible(DEFAULT_INVINCIBILITY_DURATION);

        // Track stats
        this._damageReceived += damage;

        // Emit player-specific event
        events.emit('player:damaged', {
          player: player,
          enemy: enemy,
          amount: damage,
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
      this._collisionSystem = null;
      this._player = null;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.CombatSystem = CombatSystem;
})(window.VampireSurvivors.Systems);
