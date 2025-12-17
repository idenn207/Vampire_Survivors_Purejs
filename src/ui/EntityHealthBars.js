/**
 * @fileoverview Entity health bars UI - shows HP bars above damaged entities (enemies, obstacles)
 * @module UI/EntityHealthBars
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Transform = window.VampireSurvivors.Components.Transform;
  var Health = window.VampireSurvivors.Components.Health;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var HEALTH_BAR_WIDTH = 40;
  var HEALTH_BAR_HEIGHT = 5;
  var HEALTH_BAR_OFFSET_Y = -8; // Above entity
  var HEALTH_BAR_BORDER = 1;

  var HEALTH_BAR_BG = 'rgba(0, 0, 0, 0.6)';
  var HEALTH_BAR_BORDER_COLOR = '#000000';
  var HEALTH_BAR_FILL_COLOR = '#E74C3C'; // Red for enemies

  var HEALTH_BAR_DURATION = 3; // Seconds to show HP bar after damage
  var HEALTH_BAR_FADE_SPEED = 2;

  // ============================================
  // Class Definition
  // ============================================
  class EntityHealthBars {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _camera = null;
    _damagedEntities = new Map(); // entity -> { timer, alpha }

    // Event handlers
    _boundOnEntityDamaged = null;
    _boundOnEntityDied = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._boundOnEntityDamaged = this._onEntityDamaged.bind(this);
      this._boundOnEntityDied = this._onEntityDied.bind(this);

      events.on('entity:damaged', this._boundOnEntityDamaged);
      events.on('entity:died', this._boundOnEntityDied);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setCamera(camera) {
      this._camera = camera;
    }

    update(deltaTime) {
      // Update timers and remove expired entries
      var toRemove = [];

      this._damagedEntities.forEach(function (data, entity) {
        if (data.timer > 0) {
          data.timer -= deltaTime;
          data.alpha = Math.min(1, data.alpha + deltaTime * HEALTH_BAR_FADE_SPEED);
        } else {
          data.alpha -= deltaTime * HEALTH_BAR_FADE_SPEED;
          if (data.alpha <= 0) {
            toRemove.push(entity);
          }
        }
      });

      // Remove expired entries
      for (var i = 0; i < toRemove.length; i++) {
        this._damagedEntities.delete(toRemove[i]);
      }
    }

    render(ctx) {
      if (!this._camera) return;

      var self = this;
      this._damagedEntities.forEach(function (data, entity) {
        if (!entity || !entity.isActive) return;
        if (data.alpha <= 0) return;

        self._renderHealthBar(ctx, entity, data.alpha);
      });
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onEntityDamaged(data) {
      var entity = data.entity;
      if (!entity) return;

      // Skip player (handled by PlayerOverhead)
      if (entity.hasTag && entity.hasTag('player')) return;

      // Add or update damaged entity
      this._damagedEntities.set(entity, {
        timer: HEALTH_BAR_DURATION,
        alpha: 1,
      });
    }

    _onEntityDied(data) {
      var entity = data.entity;
      if (!entity) return;

      // Remove from tracking when entity dies
      this._damagedEntities.delete(entity);
    }

    _renderHealthBar(ctx, entity, alpha) {
      var transform = entity.getComponent(Transform);
      var health = entity.getComponent(Health);

      if (!transform || !health) return;

      var current = health.currentHealth;
      var max = health.maxHealth;
      var ratio = max > 0 ? current / max : 0;

      // Skip if at full health (shouldn't happen but just in case)
      if (ratio >= 1) return;

      // Convert world position to screen position
      var screenPos = this._camera.worldToScreen(
        transform.x + transform.width / 2,
        transform.y
      );

      var x = screenPos.x - HEALTH_BAR_WIDTH / 2;
      var y = screenPos.y + HEALTH_BAR_OFFSET_Y;

      // Apply alpha
      ctx.globalAlpha = alpha;

      // Background
      ctx.fillStyle = HEALTH_BAR_BG;
      ctx.fillRect(
        x - HEALTH_BAR_BORDER,
        y - HEALTH_BAR_BORDER,
        HEALTH_BAR_WIDTH + HEALTH_BAR_BORDER * 2,
        HEALTH_BAR_HEIGHT + HEALTH_BAR_BORDER * 2
      );

      // Border
      ctx.strokeStyle = HEALTH_BAR_BORDER_COLOR;
      ctx.lineWidth = HEALTH_BAR_BORDER;
      ctx.strokeRect(
        x - HEALTH_BAR_BORDER,
        y - HEALTH_BAR_BORDER,
        HEALTH_BAR_WIDTH + HEALTH_BAR_BORDER * 2,
        HEALTH_BAR_HEIGHT + HEALTH_BAR_BORDER * 2
      );

      // Fill
      ctx.fillStyle = HEALTH_BAR_FILL_COLOR;
      ctx.fillRect(x, y, HEALTH_BAR_WIDTH * ratio, HEALTH_BAR_HEIGHT);

      // Reset alpha
      ctx.globalAlpha = 1;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('entity:damaged', this._boundOnEntityDamaged);
      events.off('entity:died', this._boundOnEntityDied);
      this._damagedEntities.clear();
      this._camera = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.EntityHealthBars = EntityHealthBars;
})(window.VampireSurvivors.UI);
