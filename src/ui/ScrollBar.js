/**
 * @fileoverview ScrollBar - reusable click-only scrollbar component
 * @module UI/ScrollBar
 */
(function (UI) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var TRACK_COLOR = '#1A252F';
  var THUMB_COLOR = '#4A6278';
  var THUMB_HOVER_COLOR = '#5D7A94';
  var THUMB_DRAG_COLOR = '#6B8FAB';
  var MIN_THUMB_HEIGHT = 30;

  // ============================================
  // Class Definition
  // ============================================
  class ScrollBar {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _x = 0;
    _y = 0;
    _width = 12;
    _height = 100;
    _contentHeight = 100;
    _viewportHeight = 100;
    _scrollOffset = 0;
    _maxScroll = 0;
    _thumbHeight = 30;
    _thumbY = 0;
    _isDragging = false;
    _dragStartY = 0;
    _dragStartOffset = 0;
    _isHovered = false;
    _isVisible = true;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Set scrollbar position and dimensions
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     */
    setBounds(x, y, width, height) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._updateThumb();
    }

    /**
     * Set content and viewport heights
     * @param {number} contentHeight - Total content height
     * @param {number} viewportHeight - Visible viewport height
     */
    setContentHeight(contentHeight, viewportHeight) {
      this._contentHeight = Math.max(1, contentHeight);
      this._viewportHeight = Math.max(1, viewportHeight);
      this._maxScroll = Math.max(0, this._contentHeight - this._viewportHeight);
      this._scrollOffset = Math.min(this._scrollOffset, this._maxScroll);
      this._updateThumb();
    }

    /**
     * Handle mouse down event
     * @param {number} mouseX - Mouse X position
     * @param {number} mouseY - Mouse Y position
     * @returns {boolean} True if scrollbar handled the click
     */
    handleMouseDown(mouseX, mouseY) {
      if (!this._isVisible || !this._needsScrollbar()) return false;

      // Check if click is within scrollbar bounds
      if (!this._isPointInTrack(mouseX, mouseY)) return false;

      var thumbTop = this._y + this._thumbY;
      var thumbBottom = thumbTop + this._thumbHeight;

      // Check if clicking on thumb
      if (mouseY >= thumbTop && mouseY <= thumbBottom) {
        this._isDragging = true;
        this._dragStartY = mouseY;
        this._dragStartOffset = this._scrollOffset;
        return true;
      }

      // Click on track - page scroll
      if (mouseY < thumbTop) {
        // Click above thumb - scroll up by viewport
        this._scrollOffset = Math.max(0, this._scrollOffset - this._viewportHeight);
      } else {
        // Click below thumb - scroll down by viewport
        this._scrollOffset = Math.min(this._maxScroll, this._scrollOffset + this._viewportHeight);
      }
      this._updateThumb();
      return true;
    }

    /**
     * Handle mouse move event
     * @param {number} mouseX - Mouse X position
     * @param {number} mouseY - Mouse Y position
     */
    handleMouseMove(mouseX, mouseY) {
      // Check hover state
      this._isHovered = this._isPointInTrack(mouseX, mouseY);

      if (!this._isDragging) return;

      // Calculate scroll from drag
      var deltaY = mouseY - this._dragStartY;
      var trackHeight = this._height - this._thumbHeight;

      if (trackHeight > 0) {
        var scrollRatio = deltaY / trackHeight;
        var newOffset = this._dragStartOffset + scrollRatio * this._maxScroll;
        this._scrollOffset = Math.max(0, Math.min(this._maxScroll, newOffset));
        this._updateThumb();
      }
    }

    /**
     * Handle mouse up event
     */
    handleMouseUp() {
      this._isDragging = false;
    }

    /**
     * Get current scroll offset
     * @returns {number}
     */
    getScrollOffset() {
      return this._scrollOffset;
    }

    /**
     * Set scroll offset directly
     * @param {number} offset
     */
    setScrollOffset(offset) {
      this._scrollOffset = Math.max(0, Math.min(this._maxScroll, offset));
      this._updateThumb();
    }

    /**
     * Reset scroll to top
     */
    resetScroll() {
      this._scrollOffset = 0;
      this._updateThumb();
    }

    /**
     * Check if scrollbar is needed
     * @returns {boolean}
     */
    needsScrollbar() {
      return this._needsScrollbar();
    }

    /**
     * Show scrollbar
     */
    show() {
      this._isVisible = true;
    }

    /**
     * Hide scrollbar
     */
    hide() {
      this._isVisible = false;
      this._isDragging = false;
    }

    /**
     * Render scrollbar
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._isVisible || !this._needsScrollbar()) return;

      // Draw track
      ctx.fillStyle = TRACK_COLOR;
      this._roundRect(ctx, this._x, this._y, this._width, this._height, 4);
      ctx.fill();

      // Draw thumb
      var thumbTop = this._y + this._thumbY;
      if (this._isDragging) {
        ctx.fillStyle = THUMB_DRAG_COLOR;
      } else if (this._isHovered) {
        ctx.fillStyle = THUMB_HOVER_COLOR;
      } else {
        ctx.fillStyle = THUMB_COLOR;
      }
      this._roundRect(ctx, this._x + 2, thumbTop, this._width - 4, this._thumbHeight, 3);
      ctx.fill();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _updateThumb() {
      if (!this._needsScrollbar()) {
        this._thumbHeight = this._height;
        this._thumbY = 0;
        return;
      }

      // Calculate thumb height proportional to viewport/content ratio
      var ratio = this._viewportHeight / this._contentHeight;
      this._thumbHeight = Math.max(MIN_THUMB_HEIGHT, Math.floor(this._height * ratio));

      // Calculate thumb position
      var trackSpace = this._height - this._thumbHeight;
      if (this._maxScroll > 0) {
        this._thumbY = Math.floor((this._scrollOffset / this._maxScroll) * trackSpace);
      } else {
        this._thumbY = 0;
      }
    }

    _needsScrollbar() {
      return this._contentHeight > this._viewportHeight;
    }

    _isPointInTrack(x, y) {
      return (
        x >= this._x &&
        x <= this._x + this._width &&
        y >= this._y &&
        y <= this._y + this._height
      );
    }

    _roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isDragging() {
      return this._isDragging;
    }

    get isVisible() {
      return this._isVisible;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._isDragging = false;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.ScrollBar = ScrollBar;
})(window.VampireSurvivors.UI);
