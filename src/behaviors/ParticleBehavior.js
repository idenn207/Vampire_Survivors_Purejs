/**
 * @fileoverview Particle weapon behavior - rotating blades and chain lightning
 * @module Behaviors/ParticleBehavior
 */
(function (Behaviors) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var WeaponBehavior = Behaviors.WeaponBehavior;
  var TargetingMode = window.VampireSurvivors.Data.TargetingMode;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class ParticleBehavior extends WeaponBehavior {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _rotatingBlades = [];
    _currentAngle = 0;
    _bladeHitCooldowns = null; // Map<bladeIndex_enemyId, lastHitTime>
    _chainLightningVisuals = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
      this._rotatingBlades = [];
      this._bladeHitCooldowns = new Map();
      this._chainLightningVisuals = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Execute particle weapon behavior
     * @param {Weapon} weapon
     * @param {Entity} player
     * @returns {Array}
     */
    execute(weapon, player) {
      var targetingMode = weapon.targetingMode;

      if (targetingMode === TargetingMode.ROTATING) {
        return this._executeRotatingBlades(weapon, player);
      } else if (targetingMode === TargetingMode.CHAIN) {
        return this._executeChainLightning(weapon, player);
      }

      return [];
    }

    /**
     * Update rotating blades and chain visuals
     * @param {number} deltaTime
     * @param {Entity} player
     * @param {Weapon} weapon
     */
    update(deltaTime, player, weapon) {
      if (!weapon) return;

      // Update rotating blades
      if (weapon.targetingMode === TargetingMode.ROTATING) {
        this._updateRotatingBlades(deltaTime, player, weapon);
      }

      // Update chain lightning visuals
      this._updateChainLightningVisuals(deltaTime);
    }

    /**
     * Initialize rotating blades for a weapon
     * @param {Weapon} weapon
     */
    initializeRotatingBlades(weapon) {
      var bladeCount = weapon.getStat('bladeCount', 4);

      this._rotatingBlades = [];
      for (var i = 0; i < bladeCount; i++) {
        this._rotatingBlades.push({
          x: 0,
          y: 0,
          angleOffset: (i / bladeCount) * Math.PI * 2,
        });
      }
    }

    /**
     * Get rotating blades for rendering
     * @returns {Array}
     */
    getRotatingBlades() {
      return this._rotatingBlades;
    }

    /**
     * Get chain lightning visuals for rendering
     * @returns {Array}
     */
    getChainLightningVisuals() {
      return this._chainLightningVisuals;
    }

    /**
     * Render particle effects
     * @param {CanvasRenderingContext2D} ctx
     * @param {Camera} camera
     * @param {Weapon} weapon
     */
    render(ctx, camera, weapon) {
      if (!weapon) return;

      var cameraX = camera ? camera.x : 0;
      var cameraY = camera ? camera.y : 0;

      if (weapon.targetingMode === TargetingMode.ROTATING) {
        this._renderRotatingBlades(ctx, cameraX, cameraY, weapon);
      }

      this._renderChainLightning(ctx, cameraX, cameraY);
    }

    // ----------------------------------------
    // Rotating Blades
    // ----------------------------------------
    _executeRotatingBlades(weapon, player) {
      // Rotating blades are continuously active, handled by update
      // This just ensures blades are initialized
      if (this._rotatingBlades.length === 0) {
        this.initializeRotatingBlades(weapon);
      }
      return this._rotatingBlades;
    }

    _updateRotatingBlades(deltaTime, player, weapon) {
      if (!player || !player.isActive) return;

      var playerPos = this.getPlayerCenter(player);
      var orbitRadius = weapon.getStat('orbitRadius', 80);
      var rotationSpeed = weapon.getStat('rotationSpeed', 3);
      var bladeCount = weapon.getStat('bladeCount', 4);
      var damage = weapon.damage;
      var hitCooldown = weapon.getStat('hitCooldown', 0.5);
      var size = weapon.getStat('size', 12);

      // Update angle
      this._currentAngle += rotationSpeed * deltaTime;
      if (this._currentAngle > Math.PI * 2) {
        this._currentAngle -= Math.PI * 2;
      }

      // Reinitialize blades if count changed (from upgrade)
      if (this._rotatingBlades.length !== bladeCount) {
        this.initializeRotatingBlades(weapon);
      }

      // Update blade positions and check for hits
      var currentTime = Date.now() / 1000;

      for (var i = 0; i < this._rotatingBlades.length; i++) {
        var blade = this._rotatingBlades[i];
        var angle = this._currentAngle + blade.angleOffset;

        // Store the current angle for rendering (FIXES blade angle bug)
        blade.currentAngle = angle;

        blade.x = playerPos.x + Math.cos(angle) * orbitRadius;
        blade.y = playerPos.y + Math.sin(angle) * orbitRadius;

        // Check for enemy hits
        this._checkBladeHits(i, blade, size, damage, hitCooldown, currentTime, weapon);
      }
    }

    _checkBladeHits(bladeIndex, blade, size, damage, hitCooldown, currentTime, weapon) {
      if (!this._entityManager) return;

      var enemies = this._entityManager.getByTag('enemy');
      var bladeRadius = size / 2;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        var health = enemy.getComponent(Health);
        if (!health || health.isDead) continue;

        // Check collision
        var dx = transform.centerX - blade.x;
        var dy = transform.centerY - blade.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var enemyRadius = transform.width / 2;

        if (dist < bladeRadius + enemyRadius) {
          // Check hit cooldown
          var cooldownKey = bladeIndex + '_' + enemy.id;
          var lastHit = this._bladeHitCooldowns.get(cooldownKey);

          if (!lastHit || currentTime - lastHit >= hitCooldown) {
            health.takeDamage(damage);
            this._bladeHitCooldowns.set(cooldownKey, currentTime);

            events.emit('weapon:hit', {
              weapon: weapon,
              enemy: enemy,
              damage: damage,
              type: 'rotating_blade',
            });
          }
        }
      }
    }

    _renderRotatingBlades(ctx, cameraX, cameraY, weapon) {
      var color = weapon.getStat('color', '#CCCCCC');
      var size = weapon.getStat('size', 12);
      var assetLoader = window.VampireSurvivors.Core.assetLoader;

      // Get image config for sprite rendering
      var bladeImageId = weapon.getStat('bladeImageId', null) ||
                         weapon.getStat('imageId', null);

      // Check if we have an image to render
      var image = null;
      if (bladeImageId && assetLoader && assetLoader.hasImage(bladeImageId)) {
        image = assetLoader.getImage(bladeImageId);
      }

      ctx.save();

      for (var i = 0; i < this._rotatingBlades.length; i++) {
        var blade = this._rotatingBlades[i];
        var screenX = blade.x - cameraX;
        var screenY = blade.y - cameraY;

        if (image) {
          // Image rendering: draw rotated blade image
          ctx.save();
          ctx.translate(screenX, screenY);
          ctx.rotate(blade.currentAngle || 0);
          ctx.drawImage(image, -size, -size, size * 2, size * 2);
          ctx.restore();
        } else {
          // Fallback: draw blade as a diamond/rhombus
          ctx.fillStyle = color;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;

          ctx.beginPath();
          ctx.moveTo(screenX, screenY - size);
          ctx.lineTo(screenX + size * 0.6, screenY);
          ctx.lineTo(screenX, screenY + size);
          ctx.lineTo(screenX - size * 0.6, screenY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    // ----------------------------------------
    // Chain Lightning
    // ----------------------------------------
    _executeChainLightning(weapon, player) {
      var playerPos = this.getPlayerCenter(player);
      var range = weapon.getStat('range', 400);
      var chainCount = weapon.getStat('chainCount', 3);
      var chainRange = weapon.getStat('chainRange', 150);
      var chainDamageDecay = weapon.getStat('chainDamageDecay', 0.7);
      var damage = weapon.damage;
      var color = weapon.getStat('color', '#FFFF00');

      // Find initial target
      var initialTarget = this.findNearestEnemy(player, range);
      if (!initialTarget) {
        return [];
      }

      var chainedEnemies = [initialTarget];
      var chainVisual = {
        points: [playerPos],
        color: color,
        duration: 0.3,
        elapsed: 0,
        alpha: 1,
      };

      // Add initial target position
      var targetTransform = initialTarget.getComponent(Transform);
      if (targetTransform) {
        chainVisual.points.push({
          x: targetTransform.centerX,
          y: targetTransform.centerY,
        });
      }

      // Apply damage to initial target
      var currentDamage = damage;
      var initialHealth = initialTarget.getComponent(Health);
      if (initialHealth && !initialHealth.isDead) {
        initialHealth.takeDamage(currentDamage);

        events.emit('weapon:hit', {
          weapon: weapon,
          enemy: initialTarget,
          damage: currentDamage,
          type: 'chain_lightning',
        });
      }

      // Chain to additional enemies
      var lastEnemy = initialTarget;
      for (var i = 1; i < chainCount; i++) {
        var nextEnemy = this._findNextChainTarget(lastEnemy, chainedEnemies, chainRange);
        if (!nextEnemy) break;

        chainedEnemies.push(nextEnemy);
        currentDamage *= chainDamageDecay;

        var nextTransform = nextEnemy.getComponent(Transform);
        if (nextTransform) {
          chainVisual.points.push({
            x: nextTransform.centerX,
            y: nextTransform.centerY,
          });
        }

        var nextHealth = nextEnemy.getComponent(Health);
        if (nextHealth && !nextHealth.isDead) {
          nextHealth.takeDamage(Math.floor(currentDamage));

          events.emit('weapon:hit', {
            weapon: weapon,
            enemy: nextEnemy,
            damage: Math.floor(currentDamage),
            type: 'chain_lightning',
          });
        }

        lastEnemy = nextEnemy;
      }

      this._chainLightningVisuals.push(chainVisual);

      return chainedEnemies;
    }

    _findNextChainTarget(fromEnemy, excludeEnemies, chainRange) {
      if (!this._entityManager) return null;

      var fromTransform = fromEnemy.getComponent(Transform);
      if (!fromTransform) return null;

      var fromX = fromTransform.centerX;
      var fromY = fromTransform.centerY;
      var rangeSq = chainRange * chainRange;

      var enemies = this._entityManager.getByTag('enemy');
      var nearest = null;
      var nearestDist = rangeSq;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;
        if (excludeEnemies.indexOf(enemy) !== -1) continue;

        var health = enemy.getComponent(Health);
        if (!health || health.isDead) continue;

        var transform = enemy.getComponent(Transform);
        if (!transform) continue;

        var dx = transform.centerX - fromX;
        var dy = transform.centerY - fromY;
        var distSq = dx * dx + dy * dy;

        if (distSq < nearestDist) {
          nearestDist = distSq;
          nearest = enemy;
        }
      }

      return nearest;
    }

    _updateChainLightningVisuals(deltaTime) {
      for (var i = this._chainLightningVisuals.length - 1; i >= 0; i--) {
        var visual = this._chainLightningVisuals[i];
        visual.elapsed += deltaTime;
        visual.alpha = 1 - visual.elapsed / visual.duration;

        if (visual.elapsed >= visual.duration) {
          this._chainLightningVisuals.splice(i, 1);
        }
      }
    }

    _renderChainLightning(ctx, cameraX, cameraY) {
      for (var i = 0; i < this._chainLightningVisuals.length; i++) {
        var visual = this._chainLightningVisuals[i];
        var points = visual.points;

        if (points.length < 2) continue;

        ctx.save();
        ctx.globalAlpha = visual.alpha;
        ctx.strokeStyle = visual.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw main lightning bolt
        ctx.beginPath();
        ctx.moveTo(points[0].x - cameraX, points[0].y - cameraY);

        for (var j = 1; j < points.length; j++) {
          // Add some jitter for lightning effect
          var jitterX = (Math.random() - 0.5) * 10;
          var jitterY = (Math.random() - 0.5) * 10;
          ctx.lineTo(points[j].x - cameraX + jitterX, points[j].y - cameraY + jitterY);
        }
        ctx.stroke();

        // Glow effect
        ctx.globalAlpha = visual.alpha * 0.3;
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.restore();
      }
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._rotatingBlades = [];
      this._bladeHitCooldowns.clear();
      this._bladeHitCooldowns = null;
      this._chainLightningVisuals = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Behaviors.ParticleBehavior = ParticleBehavior;
})(window.VampireSurvivors.Behaviors);
