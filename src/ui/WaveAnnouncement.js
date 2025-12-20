/**
 * @fileoverview Wave announcement UI - displays wave transitions
 * @module UI/WaveAnnouncement
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants
  // ============================================
  var FONT_SIZE = 48;
  var SUB_FONT_SIZE = 24;
  var FADE_SPEED = 2.0;
  var DEFAULT_COLOR = '#FFFFFF';
  var SHADOW_COLOR = '#000000';
  var SHADOW_OFFSET = 3;

  // ============================================
  // Class Definition
  // ============================================
  class WaveAnnouncement {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _alpha = 0;
    _fadeDirection = 1; // 1 = fading in, -1 = fading out
    _currentText = '';
    _subText = '';
    _color = DEFAULT_COLOR;
    _duration = 0;
    _timer = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show wave announcement
     * @param {number} waveNumber
     * @param {number} duration - Total display duration
     * @param {Object} [specialWave] - Special wave info
     */
    show(waveNumber, duration, specialWave) {
      this._isVisible = true;
      this._alpha = 0;
      this._fadeDirection = 1;
      this._duration = duration;
      this._timer = 0;

      if (specialWave && specialWave.announcement) {
        this._currentText = specialWave.announcement;
        this._color = specialWave.announcementColor || DEFAULT_COLOR;
        this._subText = i18n.t('wave.waveNumber', { number: waveNumber });
      } else {
        this._currentText = i18n.t('wave.wave') + ' ' + waveNumber;
        this._color = DEFAULT_COLOR;
        this._subText = '';
      }
    }

    /**
     * Hide the announcement
     */
    hide() {
      this._fadeDirection = -1;
    }

    /**
     * Update animation
     * @param {number} deltaTime
     */
    update(deltaTime) {
      if (!this._isVisible) return;

      this._timer += deltaTime;

      // Handle fading
      this._alpha += this._fadeDirection * FADE_SPEED * deltaTime;

      // Clamp alpha
      if (this._alpha > 1) this._alpha = 1;
      if (this._alpha < 0) this._alpha = 0;

      // Fade in complete - start fade out at 70% of duration
      if (this._fadeDirection === 1 && this._alpha >= 1) {
        if (this._timer >= this._duration * 0.7) {
          this._fadeDirection = -1;
        }
      }

      // Fade out complete
      if (this._fadeDirection === -1 && this._alpha <= 0) {
        this._isVisible = false;
      }
    }

    /**
     * Render the announcement
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    render(ctx, canvasWidth, canvasHeight) {
      if (!this._isVisible || this._alpha <= 0) return;

      var centerX = canvasWidth / 2;
      var centerY = canvasHeight / 2 - 50;

      ctx.save();
      ctx.globalAlpha = this._alpha;

      // Main text
      ctx.font = 'bold ' + FONT_SIZE + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shadow
      ctx.fillStyle = SHADOW_COLOR;
      ctx.fillText(this._currentText, centerX + SHADOW_OFFSET, centerY + SHADOW_OFFSET);

      // Main text
      ctx.fillStyle = this._color;
      ctx.fillText(this._currentText, centerX, centerY);

      // Sub text (if any)
      if (this._subText) {
        ctx.font = 'bold ' + SUB_FONT_SIZE + 'px Arial';
        ctx.fillStyle = '#CCCCCC';
        ctx.fillText(this._subText, centerX, centerY + FONT_SIZE);
      }

      ctx.restore();
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isVisible() {
      return this._isVisible;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._isVisible = false;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.WaveAnnouncement = WaveAnnouncement;
})(window.VampireSurvivors.UI);
