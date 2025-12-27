/**
 * @fileoverview Background system - renders tile-based or grid pattern background
 * @module Systems/BackgroundSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;

  // ============================================
  // Constants
  // ============================================
  var DEFAULT_GRID_SIZE = 64;
  var DEFAULT_GRID_COLOR = 'rgba(255, 255, 255, 0.1)';
  var DEFAULT_BACKGROUND_COLOR = '#1a1a2e';
  var DEFAULT_TILE_SIZE = 64;
  var TILE_MAP_SEED = 12345; // Seed for consistent random tile placement

  // ============================================
  // Class Definition
  // ============================================
  class BackgroundSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 0; // Render first (before entities)
    _camera = null;
    _gridSize = DEFAULT_GRID_SIZE;
    _gridColor = DEFAULT_GRID_COLOR;
    _backgroundColor = DEFAULT_BACKGROUND_COLOR;

    // Tile-based background properties
    _tileSize = DEFAULT_TILE_SIZE;
    _spriteSheetId = null; // Spritesheet ID (e.g., 'background_forest')
    _tileFrameIds = []; // Array of frame IDs in the spritesheet
    _tilesLoaded = false;
    _tileMapCache = new Map(); // Cache for tile indices at each grid position

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setCamera(camera) {
      this._camera = camera;
    }

    /**
     * Set the tile spritesheet to use for the background
     * @param {string} spriteSheetId - The spritesheet ID from ImageConfig (e.g., 'background_forest')
     * @param {string[]} frameIds - Array of frame IDs to use as tiles (e.g., ['tile_0', 'tile_1', ...])
     */
    setTileSpriteSheet(spriteSheetId, frameIds) {
      var assetLoader = window.VampireSurvivors.Core.assetLoader;

      this._spriteSheetId = spriteSheetId;
      this._tileFrameIds = frameIds || [];
      this._tileMapCache.clear();

      // Check if any valid frames exist
      var validFrames = 0;
      for (var i = 0; i < this._tileFrameIds.length; i++) {
        if (assetLoader.hasSpriteFrame(spriteSheetId, this._tileFrameIds[i])) {
          validFrames++;
        }
      }

      this._tilesLoaded = validFrames > 0;

      if (this._tilesLoaded) {
        console.log(
          '[BackgroundSystem] Using spritesheet: ' +
            spriteSheetId +
            ' with ' +
            validFrames +
            ' tile frames'
        );
      } else {
        console.log(
          '[BackgroundSystem] No valid tile frames found, using grid fallback'
        );
      }
    }

    render(ctx) {
      var game = this._game;
      if (!game) return;

      var width = game.width;
      var height = game.height;

      // Draw background color first
      ctx.fillStyle = this._backgroundColor;
      ctx.fillRect(0, 0, width, height);

      if (this._tilesLoaded) {
        this._renderTiles(ctx, width, height);
      } else {
        this._renderGrid(ctx, width, height);
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------

    /**
     * Seeded random number generator for consistent tile placement
     * @param {number} x - Grid X position
     * @param {number} y - Grid Y position
     * @returns {number} Random value between 0 and 1
     */
    _seededRandom(x, y) {
      // Simple hash function for consistent pseudo-random values
      var seed = (x * 374761393 + y * 668265263 + TILE_MAP_SEED) | 0;
      seed = ((seed ^ (seed >> 13)) * 1274126177) | 0;
      return ((seed & 0x7fffffff) / 0x7fffffff) * 0.5 + 0.5;
    }

    /**
     * Get tile frame index for a specific grid position
     * @param {number} gridX - Grid X position
     * @param {number} gridY - Grid Y position
     * @returns {number} Tile frame index
     */
    _getTileIndex(gridX, gridY) {
      var key = gridX + ',' + gridY;

      if (!this._tileMapCache.has(key)) {
        var random = this._seededRandom(gridX, gridY);
        var tileIndex = Math.floor(random * this._tileFrameIds.length);
        this._tileMapCache.set(key, tileIndex);
      }

      return this._tileMapCache.get(key);
    }

    /**
     * Render tile-based background using spritesheet
     */
    _renderTiles(ctx, width, height) {
      var assetLoader = window.VampireSurvivors.Core.assetLoader;
      var cameraX = this._camera ? this._camera.x : 0;
      var cameraY = this._camera ? this._camera.y : 0;

      // Calculate starting grid position
      var startGridX = Math.floor(cameraX / this._tileSize);
      var startGridY = Math.floor(cameraY / this._tileSize);

      // Calculate offset for smooth scrolling
      var offsetX = -(cameraX % this._tileSize);
      var offsetY = -(cameraY % this._tileSize);

      // Handle negative modulo
      if (offsetX > 0) offsetX -= this._tileSize;
      if (offsetY > 0) offsetY -= this._tileSize;

      // Calculate number of tiles needed to cover screen
      var tilesX = Math.ceil(width / this._tileSize) + 2;
      var tilesY = Math.ceil(height / this._tileSize) + 2;

      // Disable image smoothing for crisp pixel tiles (prevents gaps)
      ctx.imageSmoothingEnabled = false;

      // Render tiles seamlessly (no grid borders)
      for (var ty = 0; ty < tilesY; ty++) {
        for (var tx = 0; tx < tilesX; tx++) {
          var gridX = startGridX + tx;
          var gridY = startGridY + ty;

          var tileIndex = this._getTileIndex(gridX, gridY);
          var frameId = this._tileFrameIds[tileIndex];
          var frame = assetLoader.getSpriteFrame(this._spriteSheetId, frameId);

          if (!frame) continue;

          // Round to integers and add 1px overlap to prevent gaps
          var screenX = Math.floor(offsetX + tx * this._tileSize);
          var screenY = Math.floor(offsetY + ty * this._tileSize);

          ctx.drawImage(
            frame.image,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            screenX,
            screenY,
            this._tileSize + 1,
            this._tileSize + 1
          );
        }
      }

      // Restore image smoothing
      ctx.imageSmoothingEnabled = true;
    }

    /**
     * Render grid fallback
     */
    _renderGrid(ctx, width, height) {
      var cameraX = this._camera ? this._camera.x : 0;
      var cameraY = this._camera ? this._camera.y : 0;

      // Calculate grid offset based on camera position
      var offsetX = -(cameraX % this._gridSize);
      var offsetY = -(cameraY % this._gridSize);

      // Draw grid lines
      ctx.strokeStyle = this._gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Vertical lines
      for (var x = offsetX; x <= width; x += this._gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      // Horizontal lines
      for (var y = offsetY; y <= height; y += this._gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get gridSize() {
      return this._gridSize;
    }

    set gridSize(value) {
      this._gridSize = Math.max(8, value);
    }

    get gridColor() {
      return this._gridColor;
    }

    set gridColor(value) {
      this._gridColor = value;
    }

    get backgroundColor() {
      return this._backgroundColor;
    }

    set backgroundColor(value) {
      this._backgroundColor = value;
    }

    get tileSize() {
      return this._tileSize;
    }

    set tileSize(value) {
      this._tileSize = Math.max(16, value);
      this._tileMapCache.clear(); // Clear cache when tile size changes
    }

    get tilesLoaded() {
      return this._tilesLoaded;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.BackgroundSystem = BackgroundSystem;
})(window.VampireSurvivors.Systems);
