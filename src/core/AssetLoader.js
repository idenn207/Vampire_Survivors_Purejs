/**
 * @fileoverview Asset loader for images - handles loading, caching, and sprite sheets
 * @module Core/AssetLoader
 */
(function (Core) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var BASE_PATH = 'styles/imgs/';

  // ============================================
  // Class Definition
  // ============================================
  class AssetLoader {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _images = new Map();           // imageId -> HTMLImageElement
    _spriteSheets = new Map();     // sheetId -> { image, frames: Map<frameId, {x,y,w,h}> }
    _loadingPromises = new Map();  // imageId -> Promise
    _isLoaded = false;
    _loadProgress = 0;
    _totalAssets = 0;
    _loadedAssets = 0;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Loading Methods
    // ----------------------------------------

    /**
     * Load all registered assets from ImageConfig
     * @returns {Promise<void>}
     */
    loadAll() {
      var self = this;
      var ImageConfig = window.VampireSurvivors.Data.ImageConfig;

      if (!ImageConfig) {
        console.warn('[AssetLoader] ImageConfig not found, skipping asset loading');
        this._isLoaded = true;
        return Promise.resolve();
      }

      var assets = ImageConfig.getAllAssets();
      this._totalAssets = assets.length;
      this._loadedAssets = 0;

      if (this._totalAssets === 0) {
        this._isLoaded = true;
        return Promise.resolve();
      }

      var promises = [];
      for (var i = 0; i < assets.length; i++) {
        var asset = assets[i];
        if (asset.type === 'spritesheet') {
          promises.push(this._loadSpriteSheet(asset));
        } else {
          promises.push(this._loadImage(asset.id, asset.path));
        }
      }

      return Promise.all(promises).then(function () {
        self._isLoaded = true;
        console.log('[AssetLoader] All assets loaded:', self._loadedAssets + '/' + self._totalAssets);
      });
    }

    /**
     * Load a single image
     * @param {string} imageId
     * @param {string} path
     * @returns {Promise<HTMLImageElement|null>}
     */
    _loadImage(imageId, path) {
      var self = this;

      if (this._images.has(imageId)) {
        return Promise.resolve(this._images.get(imageId));
      }

      if (this._loadingPromises.has(imageId)) {
        return this._loadingPromises.get(imageId);
      }

      var promise = new Promise(function (resolve) {
        var img = new Image();

        img.onload = function () {
          self._images.set(imageId, img);
          self._loadedAssets++;
          self._loadProgress = self._loadedAssets / self._totalAssets;
          self._loadingPromises.delete(imageId);
          resolve(img);
        };

        img.onerror = function () {
          // Silent fail - fallback to shape rendering will handle missing images
          self._loadedAssets++;
          self._loadProgress = self._loadedAssets / self._totalAssets;
          self._loadingPromises.delete(imageId);
          resolve(null);
        };

        img.src = BASE_PATH + path;
      });

      this._loadingPromises.set(imageId, promise);
      return promise;
    }

    /**
     * Load a sprite sheet with frame definitions
     * @param {Object} sheetConfig
     * @returns {Promise<void>}
     */
    _loadSpriteSheet(sheetConfig) {
      var self = this;

      return this._loadImage(sheetConfig.id, sheetConfig.path).then(function (img) {
        if (!img) return;

        var frames = new Map();
        var frameList = sheetConfig.frames || [];

        for (var i = 0; i < frameList.length; i++) {
          var frame = frameList[i];
          frames.set(frame.id, {
            x: frame.x,
            y: frame.y,
            width: frame.width,
            height: frame.height
          });
        }

        self._spriteSheets.set(sheetConfig.id, {
          image: img,
          frames: frames
        });
      });
    }

    // ----------------------------------------
    // Retrieval Methods
    // ----------------------------------------

    /**
     * Get an image by ID
     * @param {string} imageId
     * @returns {HTMLImageElement|null}
     */
    getImage(imageId) {
      return this._images.get(imageId) || null;
    }

    /**
     * Get sprite sheet frame data
     * @param {string} sheetId
     * @param {string} frameId
     * @returns {Object|null} { image, x, y, width, height }
     */
    getSpriteFrame(sheetId, frameId) {
      var sheet = this._spriteSheets.get(sheetId);
      if (!sheet) return null;

      var frame = sheet.frames.get(frameId);
      if (!frame) return null;

      return {
        image: sheet.image,
        x: frame.x,
        y: frame.y,
        width: frame.width,
        height: frame.height
      };
    }

    /**
     * Check if an image exists and is loaded
     * @param {string} imageId
     * @returns {boolean}
     */
    hasImage(imageId) {
      return this._images.has(imageId);
    }

    /**
     * Check if a sprite sheet frame exists
     * @param {string} sheetId
     * @param {string} frameId
     * @returns {boolean}
     */
    hasSpriteFrame(sheetId, frameId) {
      var sheet = this._spriteSheets.get(sheetId);
      if (!sheet) return false;
      return sheet.frames.has(frameId);
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isLoaded() {
      return this._isLoaded;
    }

    get loadProgress() {
      return this._loadProgress;
    }

    get totalAssets() {
      return this._totalAssets;
    }

    get loadedAssets() {
      return this._loadedAssets;
    }
  }

  // ============================================
  // Singleton Instance
  // ============================================
  var assetLoader = new AssetLoader();

  // ============================================
  // Export to Namespace
  // ============================================
  Core.AssetLoader = AssetLoader;
  Core.assetLoader = assetLoader;
})(window.VampireSurvivors.Core);
