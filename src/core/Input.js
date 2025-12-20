/**
 * @fileoverview Input handling for keyboard and mouse
 * @module Core/Input
 */
(function (Core) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Vector2 = window.VampireSurvivors.Utils.Vector2;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class Input {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _keys = new Map();
    _keysPressed = new Set();
    _keysReleased = new Set();
    _mousePosition = new Vector2();
    _mouseWorldPosition = new Vector2();
    _mouseButtons = new Map();
    _mouseButtonsPressed = new Set();
    _mouseButtonsReleased = new Set();
    _canvas = null;
    _camera = null;

    // Auto/Manual mode toggle
    _isAutoMode = false;
    _lastMovementDirection = { x: 1, y: 0 };

    _boundHandleKeyDown = null;
    _boundHandleKeyUp = null;
    _boundHandleMouseMove = null;
    _boundHandleMouseDown = null;
    _boundHandleMouseUp = null;
    _boundHandleContextMenu = null;
    _boundHandleBlur = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._boundHandleKeyDown = this._handleKeyDown.bind(this);
      this._boundHandleKeyUp = this._handleKeyUp.bind(this);
      this._boundHandleMouseMove = this._handleMouseMove.bind(this);
      this._boundHandleMouseDown = this._handleMouseDown.bind(this);
      this._boundHandleMouseUp = this._handleMouseUp.bind(this);
      this._boundHandleContextMenu = this._handleContextMenu.bind(this);
      this._boundHandleBlur = this._handleBlur.bind(this);
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    initialize(canvas) {
      this._canvas = canvas;

      window.addEventListener('keydown', this._boundHandleKeyDown);
      window.addEventListener('keyup', this._boundHandleKeyUp);
      window.addEventListener('blur', this._boundHandleBlur);
      canvas.addEventListener('mousemove', this._boundHandleMouseMove);
      canvas.addEventListener('mousedown', this._boundHandleMouseDown);
      canvas.addEventListener('mouseup', this._boundHandleMouseUp);
      canvas.addEventListener('contextmenu', this._boundHandleContextMenu);
    }

    update() {
      this._keysPressed.clear();
      this._keysReleased.clear();
      this._mouseButtonsPressed.clear();
      this._mouseButtonsReleased.clear();
    }

    setCamera(camera) {
      this._camera = camera;
    }

    isKeyDown(key) {
      return this._keys.get(key) === true;
    }

    isKeyPressed(key) {
      return this._keysPressed.has(key);
    }

    isKeyReleased(key) {
      return this._keysReleased.has(key);
    }

    isMouseDown(button) {
      return this._mouseButtons.get(button) === true;
    }

    isMousePressed(button) {
      return this._mouseButtonsPressed.has(button);
    }

    isMouseReleased(button) {
      return this._mouseButtonsReleased.has(button);
    }

    toggleAutoMode() {
      this._isAutoMode = !this._isAutoMode;
      events.emit('targeting:modeChanged', { isAutoMode: this._isAutoMode });
    }

    getMovementDirection() {
      var direction = new Vector2();

      if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp')) {
        direction.y -= 1;
      }
      if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown')) {
        direction.y += 1;
      }
      if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft')) {
        direction.x -= 1;
      }
      if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight')) {
        direction.x += 1;
      }

      if (direction.lengthSquared() > 0) {
        direction.normalize();
        // Store last non-zero movement direction for auto mode targeting
        this._lastMovementDirection = { x: direction.x, y: direction.y };
      }

      return direction;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _handleKeyDown(e) {
      // Prevent browser default for Tab key (focus switching)
      if (e.code === 'Tab') {
        e.preventDefault();
      }

      // Prevent browser default for Escape key
      if (e.code === 'Escape') {
        e.preventDefault();
      }

      if (!this._keys.get(e.code)) {
        this._keysPressed.add(e.code);
      }
      this._keys.set(e.code, true);

      // Q key toggles auto/manual targeting mode
      if (e.code === 'KeyQ') {
        this.toggleAutoMode();
      }
    }

    _handleKeyUp(e) {
      this._keys.set(e.code, false);
      this._keysReleased.add(e.code);
    }

    _handleMouseMove(e) {
      var rect = this._canvas.getBoundingClientRect();
      var scaleX = this._canvas.width / rect.width;
      var scaleY = this._canvas.height / rect.height;

      this._mousePosition.set((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);

      this._updateMouseWorldPosition();
    }

    _handleMouseDown(e) {
      if (!this._mouseButtons.get(e.button)) {
        this._mouseButtonsPressed.add(e.button);
      }
      this._mouseButtons.set(e.button, true);
    }

    _handleMouseUp(e) {
      this._mouseButtons.set(e.button, false);
      this._mouseButtonsReleased.add(e.button);
    }

    _handleContextMenu(e) {
      e.preventDefault();
    }

    _handleBlur() {
      // Clear all key states when window loses focus
      // This prevents stuck movement when returning to the game
      this._keys.clear();
      this._keysPressed.clear();
      this._keysReleased.clear();
      this._mouseButtons.clear();
      this._mouseButtonsPressed.clear();
      this._mouseButtonsReleased.clear();
    }

    _updateMouseWorldPosition() {
      if (this._camera) {
        this._mouseWorldPosition.set(this._mousePosition.x + this._camera.x, this._mousePosition.y + this._camera.y);
      } else {
        this._mouseWorldPosition.copy(this._mousePosition);
      }
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get mousePosition() {
      return this._mousePosition;
    }

    get mouseWorldPosition() {
      return this._mouseWorldPosition;
    }

    get isAutoMode() {
      return this._isAutoMode;
    }

    get lastMovementDirection() {
      return this._lastMovementDirection;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      var pressedKeys = [];
      var self = this;
      this._keys.forEach(function (isDown, key) {
        if (isDown) pressedKeys.push(key);
      });

      var dir = this.getMovementDirection();

      return {
        label: 'Input',
        entries: [
          { key: 'Keys', value: pressedKeys.join(', ') || 'none' },
          { key: 'Mouse', value: Math.round(this._mousePosition.x) + ', ' + Math.round(this._mousePosition.y) },
          { key: 'Direction', value: dir.x.toFixed(2) + ', ' + dir.y.toFixed(2) },
        ],
      };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      window.removeEventListener('keydown', this._boundHandleKeyDown);
      window.removeEventListener('keyup', this._boundHandleKeyUp);
      window.removeEventListener('blur', this._boundHandleBlur);

      if (this._canvas) {
        this._canvas.removeEventListener('mousemove', this._boundHandleMouseMove);
        this._canvas.removeEventListener('mousedown', this._boundHandleMouseDown);
        this._canvas.removeEventListener('mouseup', this._boundHandleMouseUp);
        this._canvas.removeEventListener('contextmenu', this._boundHandleContextMenu);
      }

      this._keys.clear();
      this._keysPressed.clear();
      this._keysReleased.clear();
      this._mouseButtons.clear();
      this._mouseButtonsPressed.clear();
      this._mouseButtonsReleased.clear();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Core.Input = Input;
})(window.VampireSurvivors.Core);
