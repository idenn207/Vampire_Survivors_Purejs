/**
 * @fileoverview Boss health bar UI - displays boss health at screen top
 * @module UI/BossHealthBar
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Health = window.VampireSurvivors.Components.Health;
  var BossData = window.VampireSurvivors.Data.BossData;
  var UIScale = window.VampireSurvivors.Core.UIScale;

  // ============================================
  // Constants (base values at 800x600)
  // ============================================
  var BASE_BAR_WIDTH = 400;
  var BASE_BAR_HEIGHT = 20;
  var BASE_BAR_Y = 50; // Below EXP bar
  var BASE_BAR_BORDER = 3;

  var BG_COLOR = '#1A1A2E';
  var BORDER_COLOR = '#0F0F1A';
  var TEXT_COLOR = '#FFFFFF';
  var SHADOW_COLOR = '#000000';

  var BASE_NAME_FONT_SIZE = 16;
  var BASE_PHASE_INDICATOR_HEIGHT = 4;
  var BASE_PHASE_INDICATOR_Y = 5; // Below main bar

  var FADE_SPEED = 3.0;
  var SHOW_DELAY = 0.3; // Delay before showing after boss spawn

  // ============================================
  // Class Definition
  // ============================================
  class BossHealthBar {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _boss = null;
    _visible = false;
    _alpha = 0;
    _showDelay = 0;

    // Cached values for smooth animation
    _displayHealth = 0;
    _displayMaxHealth = 0;
    _healthAnimSpeed = 500; // Health change per second

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Set the boss to display
     * @param {Boss} boss
     */
    setBoss(boss) {
      this._boss = boss;
      this._visible = true;
      this._showDelay = SHOW_DELAY;
      this._alpha = 0;

      // Initialize health display
      if (boss) {
        var health = boss.getComponent(Health);
        if (health) {
          this._displayHealth = health.currentHealth;
          this._displayMaxHealth = health.maxHealth;
        }
      }
    }

    /**
     * Clear the boss reference
     */
    clearBoss() {
      this._boss = null;
      // Keep visible while fading out
    }

    /**
     * Update animation
     * @param {number} deltaTime
     */
    update(deltaTime) {
      // Handle show delay
      if (this._showDelay > 0) {
        this._showDelay -= deltaTime;
        return;
      }

      // Handle visibility
      if (this._boss && this._boss.isActive) {
        // Fade in
        this._alpha += FADE_SPEED * deltaTime;
        if (this._alpha > 1) this._alpha = 1;

        // Animate health toward actual value
        var health = this._boss.getComponent(Health);
        if (health) {
          this._displayMaxHealth = health.maxHealth;

          var diff = health.currentHealth - this._displayHealth;
          if (Math.abs(diff) > 1) {
            var change = Math.sign(diff) * this._healthAnimSpeed * deltaTime;
            if (Math.abs(change) > Math.abs(diff)) {
              this._displayHealth = health.currentHealth;
            } else {
              this._displayHealth += change;
            }
          } else {
            this._displayHealth = health.currentHealth;
          }
        }
      } else {
        // Fade out
        this._alpha -= FADE_SPEED * deltaTime;
        if (this._alpha < 0) {
          this._alpha = 0;
          this._visible = false;
        }
      }
    }

    /**
     * Render the health bar
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} canvasWidth
     */
    render(ctx, canvasWidth) {
      if (!this._visible || this._alpha <= 0) return;

      // Scale dimensions
      var barWidth = UIScale.scale(BASE_BAR_WIDTH);
      var barHeight = UIScale.scale(BASE_BAR_HEIGHT);
      var barBorder = UIScale.scale(BASE_BAR_BORDER);
      var phaseIndicatorHeight = UIScale.scale(BASE_PHASE_INDICATOR_HEIGHT);
      var phaseIndicatorY = UIScale.scale(BASE_PHASE_INDICATOR_Y);

      var centerX = canvasWidth / 2;
      var barX = centerX - barWidth / 2;
      var barY = UIScale.scale(BASE_BAR_Y);

      ctx.save();
      ctx.globalAlpha = this._alpha;

      // Draw background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(barX - barBorder, barY - barBorder, barWidth + barBorder * 2, barHeight + barBorder * 2);

      // Draw border
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = UIScale.scale(2);
      ctx.strokeRect(barX - barBorder, barY - barBorder, barWidth + barBorder * 2, barHeight + barBorder * 2);

      // Calculate health percentage
      var healthPercent = this._displayMaxHealth > 0 ? this._displayHealth / this._displayMaxHealth : 0;
      healthPercent = Math.max(0, Math.min(1, healthPercent));

      // Get phase color
      var phaseIndex = 0;
      if (this._boss) {
        phaseIndex = BossData.getPhaseIndex(this._boss.bossType, healthPercent);
      }
      var fillColor = BossData.getPhaseColor(phaseIndex);

      // Draw health fill
      ctx.fillStyle = fillColor;
      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

      // Draw phase indicators (small segments)
      this._renderPhaseIndicators(ctx, barX, barY + barHeight + phaseIndicatorY, barWidth, phaseIndicatorHeight);

      // Draw boss name
      if (this._boss) {
        ctx.font = UIScale.font(BASE_NAME_FONT_SIZE, 'bold');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        var shadowOffset = UIScale.scale(2);
        var nameOffset = UIScale.scale(5);

        // Shadow
        ctx.fillStyle = SHADOW_COLOR;
        ctx.fillText(this._boss.name, centerX + shadowOffset, barY - nameOffset + shadowOffset);

        // Text
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(this._boss.name, centerX, barY - nameOffset);
      }

      // Draw health numbers
      var healthText = Math.floor(this._displayHealth) + ' / ' + Math.floor(this._displayMaxHealth);
      ctx.font = UIScale.font(12);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = TEXT_COLOR;
      ctx.fillText(healthText, centerX, barY + barHeight / 2);

      ctx.restore();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _renderPhaseIndicators(ctx, x, y, width, indicatorHeight) {
      if (!this._boss || !this._boss.config || !this._boss.config.phases) return;

      var phases = this._boss.config.phases;
      var segmentWidth = width / phases.length;

      for (var i = 0; i < phases.length; i++) {
        var segmentX = x + i * segmentWidth;
        var isCurrentPhase = i === this._boss.currentPhaseIndex;

        // Background
        ctx.fillStyle = isCurrentPhase ? BossData.getPhaseColor(i) : '#333333';
        ctx.fillRect(segmentX + 1, y, segmentWidth - 2, indicatorHeight);

        // Border between segments
        if (i > 0) {
          ctx.fillStyle = BORDER_COLOR;
          ctx.fillRect(segmentX - 1, y, 2, indicatorHeight);
        }
      }
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isVisible() {
      return this._visible && this._alpha > 0;
    }

    get boss() {
      return this._boss;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._boss = null;
      this._visible = false;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.BossHealthBar = BossHealthBar;
})(window.VampireSurvivors.UI);
