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
     * Get translated weapon name with fallback
     * @param {string} weaponId - Weapon ID (e.g., 'arcane_dart')
     * @param {string} [fallback] - Fallback name if translation not found
     * @returns {string}
     */
    tw(weaponId, fallback) {
      var key = 'weapon.' + weaponId;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, use fallback or weaponId
      if (translation === key) {
        return fallback || weaponId;
      }

      return translation;
    }

    /**
     * Get translated weapon description with fallback
     * @param {string} weaponId - Weapon ID (e.g., 'arcane_dart')
     * @param {string} [fallback] - Fallback description if translation not found
     * @returns {string}
     */
    twd(weaponId, fallback) {
      var key = 'weaponDesc.' + weaponId;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, use fallback or empty string
      if (translation === key) {
        return fallback || '';
      }

      return translation;
    }

    /**
     * Get translated attack type
     * @param {string} attackType - Attack type (e.g., 'projectile', 'laser')
     * @returns {string}
     */
    tat(attackType) {
      var key = 'attackType.' + attackType;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, return formatted attack type
      if (translation === key) {
        return attackType.replace(/_/g, ' ');
      }

      return translation;
    }

    /**
     * Get translated targeting mode
     * @param {string} targetingMode - Targeting mode (e.g., 'nearest', 'random')
     * @returns {string}
     */
    ttm(targetingMode) {
      var key = 'targetingMode.' + targetingMode;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, return formatted targeting mode
      if (translation === key) {
        return targetingMode.replace(/_/g, ' ');
      }

      return translation;
    }

    /**
     * Get translated core name
     * @param {string} coreId - Core ID (e.g., 'fire_core')
     * @param {string} [fallback] - Fallback name if translation not found
     * @returns {string}
     */
    tcn(coreId, fallback) {
      var key = 'coreName.' + coreId;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, use fallback or coreId
      if (translation === key) {
        return fallback || coreId;
      }

      return translation;
    }

    /**
     * Get translated core description
     * @param {string} coreId - Core ID (e.g., 'fire_core')
     * @param {string} [fallback] - Fallback description if translation not found
     * @returns {string}
     */
    tcd(coreId, fallback) {
      var key = 'coreDesc.' + coreId;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, use fallback or empty string
      if (translation === key) {
        return fallback || '';
      }

      return translation;
    }

    /**
     * Get translated theme name
     * @param {string} theme - Theme name (e.g., 'fire', 'ice')
     * @returns {string}
     */
    tth(theme) {
      var key = 'theme.' + theme;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, return capitalized theme
      if (translation === key) {
        return theme.charAt(0).toUpperCase() + theme.slice(1);
      }

      return translation;
    }

    /**
     * Get translated tech name
     * @param {string} techId - Tech ID (e.g., 'fire_base', 'fire_d1_intensity')
     * @param {string} [fallback] - Fallback name if translation not found
     * @returns {string}
     */
    ttn(techId, fallback) {
      var key = 'techName.' + techId;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, use fallback or techId
      if (translation === key) {
        return fallback || techId;
      }

      return translation;
    }

    /**
     * Get translated stat name
     * @param {string} statId - Stat ID (e.g., 'maxHealth', 'damage')
     * @param {string} [fallback] - Fallback name if translation not found
     * @returns {string}
     */
    tsn(statId, fallback) {
      var key = 'statName.' + statId;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, use fallback or statId
      if (translation === key) {
        return fallback || statId;
      }

      return translation;
    }

    /**
     * Get translated stat description
     * @param {string} statId - Stat ID (e.g., 'maxHealth', 'damage')
     * @param {string} [fallback] - Fallback description if translation not found
     * @returns {string}
     */
    tsd(statId, fallback) {
      var key = 'statDesc.' + statId;
      var translation = this._getTranslation(key, this._currentLanguage);

      // Fallback to English if not found in current language
      if (translation === key && this._currentLanguage !== 'en') {
        translation = this._getTranslation(key, 'en');
      }

      // If still not found, use fallback or empty string
      if (translation === key) {
        return fallback || '';
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
