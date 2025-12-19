/**
 * @fileoverview Floating damage numbers UI - shows damage dealt as floating text
 * @module UI/DamageNumbers
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
  var FLOAT_SPEED = 50; // pixels per second (world units)
  var FLOAT_DURATION = 1.0; // seconds
  var FADE_START = 0.5; // start fading at this ratio of duration remaining

  var FONT_SIZE = 18;
  var FONT_FAMILY = 'Arial';
  var FONT_WEIGHT = 'bold';

  var DAMAGE_COLOR = '#FFFFFF'; // White
  var DAMAGE_OUTLINE = '#000000'; // Black outline
  var OUTLINE_WIDTH = 3;

  var CRIT_COLOR = '#FFD700'; // Gold for critical hits
  var HEAL_COLOR = '#2ECC71'; // Green for healing

  var RANDOM_OFFSET_X = 20; // Random horizontal spread
  var RANDOM_OFFSET_Y = 10; // Random vertical spread

  var MAX_NUMBERS = 50; // Maximum floating numbers at once

  // ============================================
  // DamageNumber Class (single floating number)
  // ============================================
  class DamageNumber {
    constructor(worldX, worldY, amount, type) {
      // Store WORLD coordinates, not screen coordinates
      this.worldX = worldX + (Math.random() - 0.5) * RANDOM_OFFSET_X * 2;
      this.worldY = worldY + (Math.random() - 0.5) * RANDOM_OFFSET_Y * 2;
      this.amount = Math.floor(amount);
      this.type = type || 'damage'; // 'damage', 'crit', 'heal'
      this.timer = FLOAT_DURATION;
      this.alpha = 1;
      this.scale = 1;
      this.isActive = true;

      // Initial pop effect
      if (type === 'crit') {
        this.scale = 1.5;
      }
    }

    update(deltaTime) {
      if (!this.isActive) return;

      // Float upward in WORLD space
      this.worldY -= FLOAT_SPEED * deltaTime;

      // Update timer
      this.timer -= deltaTime;

      // Scale animation (pop effect)
      if (this.scale > 1) {
        this.scale = Math.max(1, this.scale - deltaTime * 3);
      }

      // Fade out
      var fadeRatio = this.timer / FLOAT_DURATION;
      if (fadeRatio < FADE_START) {
        this.alpha = fadeRatio / FADE_START;
      }

      // Mark as inactive when done
      if (this.timer <= 0) {
        this.isActive = false;
      }
    }

    render(ctx, camera) {
      if (!this.isActive || this.alpha <= 0) return;

      // Convert world to screen position each frame
      var screenPos = camera.worldToScreen(this.worldX, this.worldY);

      ctx.save();

      // Set alpha
      ctx.globalAlpha = this.alpha;

      // Determine color based on type
      var color = DAMAGE_COLOR;
      if (this.type === 'crit') {
        color = CRIT_COLOR;
      } else if (this.type === 'heal') {
        color = HEAL_COLOR;
      }

      // Scale
      var fontSize = FONT_SIZE * this.scale;
      ctx.font = FONT_WEIGHT + ' ' + fontSize + 'px ' + FONT_FAMILY;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var text = this.amount.toString();
      if (this.type === 'heal') {
        text = '+' + text;
      }

      // Outline
      ctx.strokeStyle = DAMAGE_OUTLINE;
      ctx.lineWidth = OUTLINE_WIDTH;
      ctx.strokeText(text, screenPos.x, screenPos.y);

      // Fill
      ctx.fillStyle = color;
      ctx.fillText(text, screenPos.x, screenPos.y);

      ctx.restore();
    }
  }

  // ============================================
  // DamageNumbers Class (manager)
  // ============================================
  class DamageNumbers {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _camera = null;
    _numbers = [];

    // Event handlers
    _boundOnEntityDamaged = null;
    _boundOnEntityHealed = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._boundOnEntityDamaged = this._onEntityDamaged.bind(this);
      this._boundOnEntityHealed = this._onEntityHealed.bind(this);

      events.on('entity:damaged', this._boundOnEntityDamaged);
      events.on('entity:healed', this._boundOnEntityHealed);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setCamera(camera) {
      this._camera = camera;
    }

    update(deltaTime) {
      // Update all numbers
      for (var i = this._numbers.length - 1; i >= 0; i--) {
        var num = this._numbers[i];
        num.update(deltaTime);

        // Remove inactive numbers
        if (!num.isActive) {
          this._numbers.splice(i, 1);
        }
      }
    }

    render(ctx) {
      if (!this._camera) return;

      for (var i = 0; i < this._numbers.length; i++) {
        this._numbers[i].render(ctx, this._camera);
      }
    }

    /**
     * Manually spawn a damage number (for custom effects)
     */
    spawn(worldX, worldY, amount, type) {
      // Limit max numbers
      if (this._numbers.length >= MAX_NUMBERS) {
        // Remove oldest
        this._numbers.shift();
      }

      // Store world coordinates directly
      this._numbers.push(new DamageNumber(worldX, worldY, amount, type));
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _onEntityDamaged(data) {
      if (!data.entity) return;

      var transform = data.entity.getComponent(Transform);
      if (!transform) return;

      // Spawn damage number at entity position (world coordinates)
      var worldX = transform.x + transform.width / 2;
      var worldY = transform.y;

      // Use crit type if isCrit flag is set (displays in gold with larger scale)
      var type = data.isCrit ? 'crit' : 'damage';

      this.spawn(worldX, worldY, data.amount, type);
    }

    _onEntityHealed(data) {
      if (!data.entity) return;

      var transform = data.entity.getComponent(Transform);
      if (!transform) return;

      var worldX = transform.x + transform.width / 2;
      var worldY = transform.y;

      this.spawn(worldX, worldY, data.amount, 'heal');
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      events.off('entity:damaged', this._boundOnEntityDamaged);
      events.off('entity:healed', this._boundOnEntityHealed);
      this._numbers = [];
      this._camera = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.DamageNumbers = DamageNumbers;
})(window.VampireSurvivors.UI);
