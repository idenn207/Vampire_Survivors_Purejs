/**
 * @fileoverview Player overhead UI - health bar and cooldown indicator above player
 * @module UI/PlayerOverhead
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Transform = window.VampireSurvivors.Components.Transform;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Constants
  // ============================================
  var HEALTH_BAR_WIDTH = 60;
  var HEALTH_BAR_HEIGHT = 8;
  var HEALTH_BAR_OFFSET_Y = -10; // Above player sprite
  var HEALTH_BAR_BORDER = 1;

  var HEALTH_BAR_BG = 'rgba(0, 0, 0, 0.5)';
  var HEALTH_BAR_BORDER_COLOR = '#000000';
  var HEALTH_FULL_COLOR = '#2ECC71'; // Green
  var HEALTH_MEDIUM_COLOR = '#F1C40F'; // Yellow
  var HEALTH_LOW_COLOR = '#E74C3C'; // Red

  var HEALTH_MEDIUM_THRESHOLD = 0.5;
  var HEALTH_LOW_THRESHOLD = 0.25;

  var HEALTH_BAR_FADE_DURATION = 3; // seconds to show HP bar after damage
  var HEALTH_BAR_FADE_OUT_SPEED = 2; // fade speed

  var COOLDOWN_SIZE = 28;
  var COOLDOWN_OFFSET_X = 45; // Right of player
  var COOLDOWN_OFFSET_Y = 0;
  var COOLDOWN_BG = 'rgba(0, 0, 0, 0.6)';
  var COOLDOWN_FILL = '#4ECDC4';
  var COOLDOWN_BORDER = '#FFFFFF';

  // ============================================
  // Class Definition
  // ============================================
  class PlayerOverhead {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;
    _camera = null;
    _hasBeenDamaged = false;
    _healthBarTimer = 0; // Time remaining to show HP bar
    _healthBarAlpha = 0; // Current opacity

    // Event handlers
    _boundOnPlayerDamaged = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._boundOnPlayerDamaged = this._onPlayerDamaged.bind(this);
      // Listen to entity:damaged (Health component emits this, not player:damaged)
      events.on('entity:damaged', this._boundOnPlayerDamaged);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setPlayer(player) {
      this._player = player;
    }

    setCamera(camera) {
      this._camera = camera;
    }

    update(deltaTime) {
      // Update health bar visibility timer
      if (this._healthBarTimer > 0) {
        this._healthBarTimer -= deltaTime;
        this._healthBarAlpha = Math.min(1, this._healthBarAlpha + deltaTime * HEALTH_BAR_FADE_OUT_SPEED);
      } else if (this._healthBarAlpha > 0) {
        this._healthBarAlpha = Math.max(0, this._healthBarAlpha - deltaTime * HEALTH_BAR_FADE_OUT_SPEED);
      }
    }

    render(ctx) {
      if (!this._player || !this._camera) return;

      var transform = this._player.getComponent(Transform);
      if (!transform) return;

      // Convert world position to screen position
      var screenPos = this._camera.worldToScreen(
        transform.x + transform.width / 2,
        transform.y
      );

      // Only render health bar if player has been damaged and alpha > 0
      if (this._hasBeenDamaged && this._healthBarAlpha > 0) {
        this._renderHealthBar(ctx, screenPos.x, screenPos.y + HEALTH_BAR_OFFSET_Y);
      }

      // Cooldown indicator removed - was causing UI issues
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onPlayerDamaged(data) {
      if (!this._player) return;

      // Check if this damage event is for our player
      if (data.entity === this._player) {
        this._hasBeenDamaged = true;
        this._healthBarTimer = HEALTH_BAR_FADE_DURATION;
        this._healthBarAlpha = 1;
      }
    }

    _renderHealthBar(ctx, centerX, y) {
      var health = this._player.health;
      if (!health) return;

      var current = health.currentHealth;
      var max = health.maxHealth;
      var ratio = max > 0 ? current / max : 0;

      var x = centerX - HEALTH_BAR_WIDTH / 2;

      // Apply alpha
      ctx.globalAlpha = this._healthBarAlpha;

      // Background
      ctx.fillStyle = HEALTH_BAR_BG;
      ctx.fillRect(x - HEALTH_BAR_BORDER, y - HEALTH_BAR_BORDER, HEALTH_BAR_WIDTH + HEALTH_BAR_BORDER * 2, HEALTH_BAR_HEIGHT + HEALTH_BAR_BORDER * 2);

      // Border
      ctx.strokeStyle = HEALTH_BAR_BORDER_COLOR;
      ctx.lineWidth = HEALTH_BAR_BORDER;
      ctx.strokeRect(x - HEALTH_BAR_BORDER, y - HEALTH_BAR_BORDER, HEALTH_BAR_WIDTH + HEALTH_BAR_BORDER * 2, HEALTH_BAR_HEIGHT + HEALTH_BAR_BORDER * 2);

      // Determine color based on health ratio
      var fillColor = HEALTH_FULL_COLOR;
      if (ratio <= HEALTH_LOW_THRESHOLD) {
        fillColor = HEALTH_LOW_COLOR;
      } else if (ratio <= HEALTH_MEDIUM_THRESHOLD) {
        fillColor = HEALTH_MEDIUM_COLOR;
      }

      // Fill
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, HEALTH_BAR_WIDTH * ratio, HEALTH_BAR_HEIGHT);

      // Reset alpha
      ctx.globalAlpha = 1;
    }

    _renderCooldownIndicator(ctx, centerX, centerY) {
      // Get the first weapon with cooldown info
      var weaponSlot = this._player.weaponSlot;
      if (!weaponSlot || !weaponSlot.weapons || weaponSlot.weapons.length === 0) {
        return;
      }

      var weapon = weaponSlot.weapons[0]; // Primary weapon
      if (!weapon) return;

      var cooldownRatio = this._getCooldownRatio(weapon);

      // Background circle
      ctx.fillStyle = COOLDOWN_BG;
      ctx.beginPath();
      ctx.arc(centerX, centerY, COOLDOWN_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Progress arc (clockwise fill)
      if (cooldownRatio < 1) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
          centerX,
          centerY,
          COOLDOWN_SIZE / 2 - 2,
          -Math.PI / 2,
          -Math.PI / 2 + Math.PI * 2 * (1 - cooldownRatio),
          false
        );
        ctx.closePath();
        ctx.fill();
      }

      // Ready indicator (full circle when ready)
      if (cooldownRatio >= 1) {
        ctx.strokeStyle = COOLDOWN_FILL;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, COOLDOWN_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Border
      ctx.strokeStyle = COOLDOWN_BORDER;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, COOLDOWN_SIZE / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Weapon icon (simple representation)
      this._renderWeaponMiniIcon(ctx, centerX, centerY, weapon);
    }

    _getCooldownRatio(weapon) {
      if (!weapon || !weapon.data) return 1;

      var cooldown = weapon.data.cooldown || 1;
      var currentCooldown = weapon.currentCooldown || 0;

      // Ratio 1 means ready, 0 means just fired
      return currentCooldown <= 0 ? 1 : 1 - currentCooldown / cooldown;
    }

    _renderWeaponMiniIcon(ctx, centerX, centerY, weapon) {
      // Simple dot/shape to represent weapon
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('entity:damaged', this._boundOnPlayerDamaged);
      this._player = null;
      this._camera = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.PlayerOverhead = PlayerOverhead;
})(window.VampireSurvivors.UI);
