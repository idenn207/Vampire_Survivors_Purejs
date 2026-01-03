/**
 * @fileoverview Timer utilities: Cooldown, Duration, and Interval
 * @module Lib/Core/Timer
 */
(function (Lib) {
  'use strict';

  // ============================================
  // Ensure namespace exists
  // ============================================
  Lib.Core = Lib.Core || {};

  // ============================================
  // Cooldown Class
  // ============================================
  /**
   * Cooldown timer that counts down to zero
   * Progress goes from 0 (not ready) to 1 (ready)
   */
  class Cooldown {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _duration = 0;
    _remaining = 0;
    _speedMultiplier = 1;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * Create a cooldown timer
     * @param {number} duration - Cooldown duration in seconds
     * @param {boolean} [startReady=false] - Start with cooldown complete
     */
    constructor(duration, startReady) {
      this._duration = duration;
      this._remaining = startReady ? 0 : duration;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Update the cooldown
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
      if (this._remaining > 0) {
        this._remaining -= deltaTime * this._speedMultiplier;
        if (this._remaining < 0) {
          this._remaining = 0;
        }
      }
    }

    /**
     * Reset cooldown to full duration
     */
    reset() {
      this._remaining = this._duration;
    }

    /**
     * If ready, reset and return true; otherwise return false
     * @returns {boolean} True if was ready (and now reset)
     */
    trigger() {
      if (this.isReady) {
        this.reset();
        return true;
      }
      return false;
    }

    /**
     * Set duration (and optionally reset)
     * @param {number} duration - New duration
     * @param {boolean} [reset=false] - Whether to reset remaining time
     */
    setDuration(duration, reset) {
      this._duration = duration;
      if (reset) {
        this._remaining = duration;
      }
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** Is cooldown complete? */
    get isReady() {
      return this._remaining <= 0;
    }

    /** Progress from 0 (just started) to 1 (ready) */
    get progress() {
      if (this._duration <= 0) return 1;
      return 1 - this._remaining / this._duration;
    }

    /** Remaining time in seconds */
    get remaining() {
      return this._remaining;
    }

    /** Total duration */
    get duration() {
      return this._duration;
    }

    /** Speed multiplier (e.g., cooldown reduction) */
    get speedMultiplier() {
      return this._speedMultiplier;
    }

    set speedMultiplier(value) {
      this._speedMultiplier = Math.max(0, value);
    }
  }

  // ============================================
  // Duration Class
  // ============================================
  /**
   * Duration timer that counts down to expiration
   * Progress goes from 0 (just started) to 1 (expired)
   */
  class Duration {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _duration = 0;
    _elapsed = 0;
    _isPaused = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * Create a duration timer
     * @param {number} duration - Duration in seconds
     */
    constructor(duration) {
      this._duration = duration;
      this._elapsed = 0;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Update the duration
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
      if (!this._isPaused && this._elapsed < this._duration) {
        this._elapsed += deltaTime;
        if (this._elapsed > this._duration) {
          this._elapsed = this._duration;
        }
      }
    }

    /**
     * Reset duration to start
     */
    reset() {
      this._elapsed = 0;
    }

    /**
     * Pause the timer
     */
    pause() {
      this._isPaused = true;
    }

    /**
     * Resume the timer
     */
    resume() {
      this._isPaused = false;
    }

    /**
     * Extend the duration
     * @param {number} amount - Seconds to add
     */
    extend(amount) {
      this._duration += amount;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** Has duration expired? */
    get isExpired() {
      return this._elapsed >= this._duration;
    }

    /** Progress from 0 (start) to 1 (expired) */
    get progress() {
      if (this._duration <= 0) return 1;
      return this._elapsed / this._duration;
    }

    /** Remaining time in seconds */
    get remaining() {
      return Math.max(0, this._duration - this._elapsed);
    }

    /** Elapsed time in seconds */
    get elapsed() {
      return this._elapsed;
    }

    /** Total duration */
    get duration() {
      return this._duration;
    }

    /** Is timer paused? */
    get isPaused() {
      return this._isPaused;
    }
  }

  // ============================================
  // Interval Class
  // ============================================
  /**
   * Interval timer that triggers repeatedly
   */
  class Interval {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _interval = 0;
    _elapsed = 0;
    _callback = null;
    _isActive = true;
    _triggerCount = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    /**
     * Create an interval timer
     * @param {number} interval - Interval in seconds
     * @param {Function} [callback] - Callback to execute each interval
     */
    constructor(interval, callback) {
      this._interval = interval;
      this._callback = callback || null;
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------

    /**
     * Update the interval
     * @param {number} deltaTime - Time since last update
     * @returns {number} Number of times interval triggered
     */
    update(deltaTime) {
      if (!this._isActive) return 0;

      this._elapsed += deltaTime;
      var triggers = 0;

      while (this._elapsed >= this._interval) {
        this._elapsed -= this._interval;
        triggers++;
        this._triggerCount++;

        if (this._callback) {
          this._callback(this._triggerCount);
        }
      }

      return triggers;
    }

    /**
     * Reset the interval timer
     */
    reset() {
      this._elapsed = 0;
    }

    /**
     * Start the timer
     */
    start() {
      this._isActive = true;
    }

    /**
     * Stop the timer
     */
    stop() {
      this._isActive = false;
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------

    /** Progress within current interval (0 to 1) */
    get progress() {
      if (this._interval <= 0) return 0;
      return this._elapsed / this._interval;
    }

    /** Time until next trigger */
    get remaining() {
      return Math.max(0, this._interval - this._elapsed);
    }

    /** Interval duration */
    get interval() {
      return this._interval;
    }

    set interval(value) {
      this._interval = Math.max(0, value);
    }

    /** Total number of triggers */
    get triggerCount() {
      return this._triggerCount;
    }

    /** Is timer active? */
    get isActive() {
      return this._isActive;
    }

    /** Callback function */
    set callback(fn) {
      this._callback = fn;
    }
  }

  // ============================================
  // Timer Factory
  // ============================================
  var Timer = {
    /**
     * Create a cooldown timer
     * @param {number} duration - Duration in seconds
     * @param {boolean} [startReady] - Start ready
     * @returns {Cooldown}
     */
    cooldown: function (duration, startReady) {
      return new Cooldown(duration, startReady);
    },

    /**
     * Create a duration timer
     * @param {number} duration - Duration in seconds
     * @returns {Duration}
     */
    duration: function (duration) {
      return new Duration(duration);
    },

    /**
     * Create an interval timer
     * @param {number} interval - Interval in seconds
     * @param {Function} [callback] - Callback on trigger
     * @returns {Interval}
     */
    interval: function (interval, callback) {
      return new Interval(interval, callback);
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Lib.Core.Timer = Timer;
  Lib.Core.Cooldown = Cooldown;
  Lib.Core.Duration = Duration;
  Lib.Core.Interval = Interval;

})(window.RoguelikeFramework.Lib = window.RoguelikeFramework.Lib || {});
