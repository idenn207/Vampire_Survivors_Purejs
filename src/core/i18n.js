/**
 * @fileoverview Internationalization system for language support
 * @module Core/i18n
 */
(function (Core) {
  'use strict';

  // ============================================
  // Constants
  // ============================================
  var STORAGE_KEY = 'vampireSurvivors_language';
  var DEFAULT_LANGUAGE = 'en';
  var SUPPORTED_LANGUAGES = ['en', 'ko'];

  // ============================================
  // i18n Class
  // ============================================
  class I18n {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _currentLanguage = DEFAULT_LANGUAGE;
    _translations = {};
    _isLoaded = false;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      // Load saved language preference
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.indexOf(saved) !== -1) {
        this._currentLanguage = saved;
      }
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Load translation files
     * @returns {Promise}
     */
    async load() {
      try {
        // Load all language files
        var promises = SUPPORTED_LANGUAGES.map(async function (lang) {
          var response = await fetch('src/data/locales/' + lang + '.json');
          if (!response.ok) {
            console.warn('[i18n] Failed to load ' + lang + '.json');
            return { lang: lang, data: {} };
          }
          var data = await response.json();
          return { lang: lang, data: data };
        });

        var results = await Promise.all(promises);
        for (var i = 0; i < results.length; i++) {
          this._translations[results[i].lang] = results[i].data;
        }

        this._isLoaded = true;
        console.log('[i18n] Translations loaded');
      } catch (error) {
        console.error('[i18n] Error loading translations:', error);
        // Fallback to empty translations
        this._translations = { en: {}, ko: {} };
        this._isLoaded = true;
      }
    }

    /**
     * Get translated string
     * @param {string} key - Translation key (e.g., 'menu.continue')
     * @param {Object} [params] - Optional parameters for interpolation
     * @returns {string}
     */
    t(key, params) {
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // Interpolate parameters if provided
      if (params && typeof translation === 'string') {
        for (var param in params) {
          if (params.hasOwnProperty(param)) {
            translation = translation.replace(
              new RegExp('\\{' + param + '\\}', 'g'),
              params[param]
            );
          }
        }
      }

      return translation;
    }

    /**
     * Set current language
     * @param {string} langCode - Language code (e.g., 'en', 'ko')
     */
    setLanguage(langCode) {
      if (SUPPORTED_LANGUAGES.indexOf(langCode) === -1) {
        console.warn('[i18n] Unsupported language:', langCode);
        return;
      }

      this._currentLanguage = langCode;
      localStorage.setItem(STORAGE_KEY, langCode);
      console.log('[i18n] Language set to:', langCode);
    }

    /**
     * Get current language
     * @returns {string}
     */
    getLanguage() {
      return this._currentLanguage;
    }

    /**
     * Get list of supported languages
     * @returns {Array}
     */
    getSupportedLanguages() {
      return SUPPORTED_LANGUAGES.slice();
    }

    /**
     * Check if translations are loaded
     * @returns {boolean}
     */
    isLoaded() {
      return this._isLoaded;
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    /**
     * Get translation for a key in a specific language
     * @param {string} key
     * @param {string} lang
     * @returns {string}
     */
    _getTranslation(key, lang) {
      var langData = this._translations[lang];
      if (!langData) return key;

      // Support nested keys like 'menu.continue'
      var parts = key.split('.');
      var value = langData;

      for (var i = 0; i < parts.length; i++) {
        if (value && typeof value === 'object' && value.hasOwnProperty(parts[i])) {
          value = value[parts[i]];
        } else {
          return key;
        }
      }

      return typeof value === 'string' ? value : key;
    }
  }

  // ============================================
  // Create Singleton Instance
  // ============================================
  var i18n = new I18n();

  // ============================================
  // Export to Namespace
  // ============================================
  Core.i18n = i18n;
  Core.I18n = I18n;
})(window.VampireSurvivors.Core);
