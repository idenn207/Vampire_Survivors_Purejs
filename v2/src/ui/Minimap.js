/**
 * @fileoverview Minimap UI component - radar-style view showing entities around the player
 * @module UI/Minimap
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var UIScale = window.VampireSurvivors.Core.UIScale;
  var Transform = window.VampireSurvivors.Components.Transform;
  var Managers = window.VampireSurvivors.Managers;
  var PickupConfig = window.VampireSurvivors.Data.PickupConfig;

  // ============================================
  // Constants (base values at 800x600)
  // ============================================
  // Position (bottom-right)
  var BASE_X_FROM_RIGHT = 10;
  var BASE_Y_FROM_BOTTOM = 10;

  // Minimap dimensions
  var BASE_MINIMAP_SIZE = 120;
  var BASE_BORDER_WIDTH = 2;

  // World range (how far from player is shown)
  var DEFAULT_WORLD_RANGE = 600;

  // Entity dot sizes
  var BASE_PLAYER_DOT_SIZE = 6;
  var BASE_ENEMY_DOT_SIZE = 3;
  var BASE_BOSS_DOT_SIZE = 6;
  var BASE_PICKUP_DOT_SIZE = 2;
  var BASE_ALLY_DOT_SIZE = 4;

  // Colors
  var MINIMAP_BG = 'rgba(0, 0, 0, 0.5)';
  var MINIMAP_BORDER = 'rgba(255, 255, 255, 0.3)';
  var PLAYER_COLOR = '#4ECDC4';
  var ENEMY_COLOR = '#E74C3C';
  var BOSS_COLOR = '#FF6B6B';
  var ALLY_COLOR = '#2ECC71';
  var DEFAULT_PICKUP_COLOR = '#F1C40F';

  // Performance
  var MAX_ENTITIES_RENDERED = 100;
  var UPDATE_INTERVAL = 0.05;

  // ============================================
  // Class Definition
  // ============================================
  class Minimap {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _worldRange = DEFAULT_WORLD_RANGE;
    _updateTimer = 0;
    _cachedEntities = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setPlayer(player) {
      this._player = player;
    }

    update(deltaTime) {
      this._updateTimer -= deltaTime;
      if (this._updateTimer <= 0) {
        this._updateTimer = UPDATE_INTERVAL;
        this._cacheNearbyEntities();
      }
    }

    render(ctx, canvasWidth, canvasHeight) {
      if (!this._player) return;

      var size = UIScale.scale(BASE_MINIMAP_SIZE);
      var border = UIScale.scale(BASE_BORDER_WIDTH);
      var x = canvasWidth - UIScale.scale(BASE_X_FROM_RIGHT) - size;
      var y = canvasHeight - UIScale.scale(BASE_Y_FROM_BOTTOM) - size;

      this._renderBackground(ctx, x, y, size);
      this._renderEntities(ctx, x, y, size);
      this._renderPlayer(ctx, x, y, size);
      this._renderBorder(ctx, x, y, size, border);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _cacheNearbyEntities() {
      var entityManager = Managers.entityManager;
      if (!entityManager || !this._player) {
        this._cachedEntities = null;
        return;
      }

      var playerTransform = this._player.getComponent(Transform);
      if (!playerTransform) {
        this._cachedEntities = null;
        return;
      }

      var playerX = playerTransform.centerX;
      var playerY = playerTransform.centerY;
      var range = this._worldRange;
      var rangeSq = range * range;

      var result = {
        enemies: [],
        bosses: [],
        pickups: [],
        allies: []
      };

      // Query enemies (excluding bosses)
      var enemies = entityManager.getByTag('enemy');
      for (var i = 0; i < enemies.length && result.enemies.length < MAX_ENTITIES_RENDERED; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive || enemy.hasTag('boss')) continue;
        var t = enemy.getComponent(Transform);
        if (!t) continue;

        var dx = t.centerX - playerX;
        var dy = t.centerY - playerY;
        if (dx * dx + dy * dy <= rangeSq) {
          result.enemies.push({ x: dx, y: dy });
        }
      }

      // Query bosses
      var bosses = entityManager.getByTag('boss');
      for (var i = 0; i < bosses.length; i++) {
        var boss = bosses[i];
        if (!boss.isActive) continue;
        var t = boss.getComponent(Transform);
        if (!t) continue;

        var dx = t.centerX - playerX;
        var dy = t.centerY - playerY;
        if (dx * dx + dy * dy <= rangeSq) {
          result.bosses.push({ x: dx, y: dy });
        }
      }

      // Query pickups (only health potions and magnets)
      var pickups = entityManager.getByTag('pickup');
      var Pickup = window.VampireSurvivors.Components.Pickup;
      for (var i = 0; i < pickups.length && result.pickups.length < MAX_ENTITIES_RENDERED; i++) {
        var pickup = pickups[i];
        if (!pickup.isActive) continue;

        // Filter: only show health and magnet pickups
        if (Pickup) {
          var pickupComp = pickup.getComponent(Pickup);
          if (!pickupComp || (pickupComp.type !== 'health' && pickupComp.type !== 'magnet')) {
            continue;
          }
        }

        var t = pickup.getComponent(Transform);
        if (!t) continue;

        var dx = t.centerX - playerX;
        var dy = t.centerY - playerY;
        if (dx * dx + dy * dy <= rangeSq) {
          var color = DEFAULT_PICKUP_COLOR;
          if (Pickup && PickupConfig) {
            var pickupComp = pickup.getComponent(Pickup);
            if (pickupComp) {
              var config = PickupConfig.getPickupConfig(pickupComp.type, pickupComp.value);
              if (config && config.color) {
                color = config.color;
              }
            }
          }
          result.pickups.push({ x: dx, y: dy, color: color });
        }
      }

      // Query allies/summons
      var allies = entityManager.getByTag('ally');
      for (var i = 0; i < allies.length && result.allies.length < MAX_ENTITIES_RENDERED; i++) {
        var ally = allies[i];
        if (!ally.isActive) continue;
        var t = ally.getComponent(Transform);
        if (!t) continue;

        var dx = t.centerX - playerX;
        var dy = t.centerY - playerY;
        if (dx * dx + dy * dy <= rangeSq) {
          result.allies.push({ x: dx, y: dy });
        }
      }

      this._cachedEntities = result;
    }

    _renderBackground(ctx, x, y, size) {
      ctx.fillStyle = MINIMAP_BG;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    _renderBorder(ctx, x, y, size, border) {
      ctx.strokeStyle = MINIMAP_BORDER;
      ctx.lineWidth = border;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2 - border / 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    _renderPlayer(ctx, x, y, size) {
      var centerX = x + size / 2;
      var centerY = y + size / 2;
      var dotSize = UIScale.scale(BASE_PLAYER_DOT_SIZE);

      ctx.fillStyle = PLAYER_COLOR;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    _renderEntities(ctx, mapX, mapY, mapSize) {
      if (!this._cachedEntities) return;

      var centerX = mapX + mapSize / 2;
      var centerY = mapY + mapSize / 2;
      var scale = (mapSize / 2) / this._worldRange;
      var radius = mapSize / 2;

      function worldToMinimap(dx, dy) {
        var mx = centerX + dx * scale;
        var my = centerY + dy * scale;

        var distFromCenter = Math.sqrt((mx - centerX) * (mx - centerX) + (my - centerY) * (my - centerY));
        if (distFromCenter > radius - 2) {
          var angle = Math.atan2(my - centerY, mx - centerX);
          mx = centerX + Math.cos(angle) * (radius - 2);
          my = centerY + Math.sin(angle) * (radius - 2);
        }

        return { x: mx, y: my };
      }

      // Render pickups (smallest, behind)
      var pickupSize = UIScale.scale(BASE_PICKUP_DOT_SIZE);
      for (var i = 0; i < this._cachedEntities.pickups.length; i++) {
        var p = this._cachedEntities.pickups[i];
        var pos = worldToMinimap(p.x, p.y);
        ctx.fillStyle = p.color;
        ctx.fillRect(pos.x - pickupSize / 2, pos.y - pickupSize / 2, pickupSize, pickupSize);
      }

      // Render allies (green circles)
      var allySize = UIScale.scale(BASE_ALLY_DOT_SIZE);
      ctx.fillStyle = ALLY_COLOR;
      for (var i = 0; i < this._cachedEntities.allies.length; i++) {
        var a = this._cachedEntities.allies[i];
        var pos = worldToMinimap(a.x, a.y);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, allySize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render enemies (red dots)
      var enemySize = UIScale.scale(BASE_ENEMY_DOT_SIZE);
      ctx.fillStyle = ENEMY_COLOR;
      for (var i = 0; i < this._cachedEntities.enemies.length; i++) {
        var e = this._cachedEntities.enemies[i];
        var pos = worldToMinimap(e.x, e.y);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, enemySize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render bosses (larger red dots, on top)
      var bossSize = UIScale.scale(BASE_BOSS_DOT_SIZE);
      ctx.fillStyle = BOSS_COLOR;
      for (var i = 0; i < this._cachedEntities.bosses.length; i++) {
        var b = this._cachedEntities.bosses[i];
        var pos = worldToMinimap(b.x, b.y);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, bossSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      this._cachedEntities = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.Minimap = Minimap;
})(window.VampireSurvivors.UI);
