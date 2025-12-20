/**
 * @fileoverview Tech unlock popup - shown after boss defeat
 * @module UI/TechUnlockPopup
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var TechCoreData = window.VampireSurvivors.Data.TechCoreData;
  var TechEffectData = window.VampireSurvivors.Data.TechEffectData;
  var i18n = window.VampireSurvivors.Core.i18n;

  // ============================================
  // Constants
  // ============================================
  var POPUP_WIDTH = 550;
  var POPUP_HEIGHT = 380;
  var CARD_WIDTH = 150;
  var CARD_HEIGHT = 200;
  var CARD_GAP = 15;

  // Depth colors
  var DEPTH_COLORS = {
    0: '#FFFFFF', // Base
    1: '#3498DB', // Blue
    2: '#9B59B6', // Purple
    3: '#F39C12', // Orange/Gold
  };

  // ============================================
  // Class Definition
  // ============================================
  class TechUnlockPopup {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _isVisible = false;
    _player = null;
    _choices = [];
    _canvasWidth = 800;
    _canvasHeight = 600;
    _popupX = 0;
    _popupY = 0;
    _cardRects = [];
    _hoveredIndex = -1;
    _coreData = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._cardRects = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Show the popup with tech choices
     * @param {Entity} player
     * @param {Array<Object>} choices - Array of tech objects with depth info
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    show(player, choices, canvasWidth, canvasHeight) {
      this._isVisible = true;
      this._player = player;
      this._choices = choices || [];
      this._canvasWidth = canvasWidth;
      this._canvasHeight = canvasHeight;
      this._hoveredIndex = -1;

      // Get core data for colors
      var techTree = player.getComponent(window.VampireSurvivors.Components.TechTree);
      if (techTree) {
        this._coreData = techTree.getCoreData();
      }

      this._calculateLayout();
    }

    /**
     * Hide the popup
     */
    hide() {
      this._isVisible = false;
    }

    /**
     * Handle input
     * @param {Input} input
     * @returns {Object|null} { action: 'select', techId: string } or null
     */
    handleInput(input) {
      if (!this._isVisible) return null;

      var mousePos = input.mousePosition;
      this._updateHoverState(mousePos.x, mousePos.y);

      if (input.isMousePressed(0) && this._hoveredIndex >= 0) {
        return {
          action: 'select',
          techId: this._choices[this._hoveredIndex].id,
        };
      }

      return null;
    }

    /**
     * Render the popup
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._isVisible) return;

      ctx.save();

      // Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);

      // Popup background
      ctx.fillStyle = '#1A2332';
      ctx.fillRect(this._popupX, this._popupY, POPUP_WIDTH, POPUP_HEIGHT);

      // Popup border (green for success)
      ctx.strokeStyle = '#2ECC71';
      ctx.lineWidth = 3;
      ctx.strokeRect(this._popupX, this._popupY, POPUP_WIDTH, POPUP_HEIGHT);

      // Title with glow
      ctx.shadowColor = '#2ECC71';
      ctx.shadowBlur = 10;
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#2ECC71';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.t('tech.bossDefeated'), this._popupX + POPUP_WIDTH / 2, this._popupY + 35);
      ctx.shadowBlur = 0;

      // Subtitle
      ctx.font = '16px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        i18n.t('tech.chooseTech'),
        this._popupX + POPUP_WIDTH / 2,
        this._popupY + 65
      );

      // Core name indicator
      if (this._coreData) {
        ctx.font = '12px Arial';
        ctx.fillStyle = this._coreData.color;
        ctx.fillText(
          this._coreData.name + ' ' + i18n.t('tech.techTree'),
          this._popupX + POPUP_WIDTH / 2,
          this._popupY + 85
        );
      }

      // Render tech cards
      for (var i = 0; i < this._choices.length; i++) {
        this._renderTechCard(ctx, i);
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
    // Private Methods
    // ----------------------------------------
    /**
     * Calculate popup and card positions
     */
    _calculateLayout() {
      // Center popup
      this._popupX = (this._canvasWidth - POPUP_WIDTH) / 2;
      this._popupY = (this._canvasHeight - POPUP_HEIGHT) / 2;

      // Calculate card positions
      this._cardRects = [];

      var totalCardsWidth =
        this._choices.length * CARD_WIDTH + (this._choices.length - 1) * CARD_GAP;
      var startX = this._popupX + (POPUP_WIDTH - totalCardsWidth) / 2;
      var startY = this._popupY + 105;

      for (var i = 0; i < this._choices.length; i++) {
        this._cardRects.push({
          x: startX + i * (CARD_WIDTH + CARD_GAP),
          y: startY,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        });
      }
    }

    /**
     * Update hover state
     * @param {number} mouseX
     * @param {number} mouseY
     */
    _updateHoverState(mouseX, mouseY) {
      this._hoveredIndex = -1;

      for (var i = 0; i < this._cardRects.length; i++) {
        var rect = this._cardRects[i];
        if (
          mouseX >= rect.x &&
          mouseX <= rect.x + rect.width &&
          mouseY >= rect.y &&
          mouseY <= rect.y + rect.height
        ) {
          this._hoveredIndex = i;
          break;
        }
      }
    }

    /**
     * Render a tech card
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} index
     */
    _renderTechCard(ctx, index) {
      var tech = this._choices[index];
      var rect = this._cardRects[index];
      var isHovered = index === this._hoveredIndex;
      var depthColor = DEPTH_COLORS[tech.depth] || DEPTH_COLORS[1];

      // Card background
      ctx.fillStyle = isHovered ? '#3D566E' : '#2C3E50';
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Card border
      ctx.strokeStyle = isHovered ? depthColor : '#4A6278';
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Glow effect when hovered
      if (isHovered) {
        ctx.shadowColor = depthColor;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = depthColor;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.shadowBlur = 0;
      }

      // Depth badge
      ctx.fillStyle = depthColor;
      ctx.fillRect(rect.x, rect.y, rect.width, 22);

      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i18n.t('tech.depth') + ' ' + tech.depth, rect.x + rect.width / 2, rect.y + 11);

      // Tech name
      ctx.font = 'bold 13px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(tech.name, rect.x + rect.width / 2, rect.y + 45);

      // Max level indicator
      ctx.font = '10px Arial';
      ctx.fillStyle = '#95A5A6';
      ctx.fillText(i18n.t('tech.maxLevel') + ' ' + tech.maxLevel, rect.x + rect.width / 2, rect.y + 62);

      // Effects list
      this._renderEffects(ctx, tech.effects, rect.x + 8, rect.y + 80, rect.width - 16);

      // Select hint when hovered
      if (isHovered) {
        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = '#2ECC71';
        ctx.fillText(i18n.t('tech.clickToUnlock'), rect.x + rect.width / 2, rect.y + rect.height - 15);
      }
    }

    /**
     * Render effect descriptions
     * @param {CanvasRenderingContext2D} ctx
     * @param {Array} effects
     * @param {number} x
     * @param {number} y
     * @param {number} maxWidth
     */
    _renderEffects(ctx, effects, x, y, maxWidth) {
      if (!effects || effects.length === 0) return;

      ctx.font = '10px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      var currentY = y;
      var lineHeight = 14;

      for (var i = 0; i < Math.min(effects.length, 4); i++) {
        var effect = effects[i];
        var desc = this._getEffectDescription(effect);

        ctx.fillStyle = this._getEffectColor(effect.type);
        ctx.fillText('\u2022 ' + desc, x, currentY);
        currentY += lineHeight;
      }

      if (effects.length > 4) {
        ctx.fillStyle = '#7F8C8D';
        ctx.fillText('+ ' + (effects.length - 4) + ' more...', x, currentY);
      }
    }

    /**
     * Get human-readable effect description
     * @param {Object} effect
     * @returns {string}
     */
    _getEffectDescription(effect) {
      var EffectType = TechEffectData.EffectType;
      var value = effect.valuePerLevel || effect.baseValue || 0;

      switch (effect.type) {
        case EffectType.STAT_BONUS:
          return this._formatStatName(effect.stat) + ': +' + this._formatValue(value) + '/lv';

        case EffectType.UNIQUE_MECHANIC:
          return this._formatMechanicName(effect.mechanic) + ': +' + this._formatValue(value) + '/lv';

        case EffectType.WEAPON_MODIFIER:
          return 'Weapon ' + this._formatStatName(effect.stat) + ': +' + this._formatValue(value) + '/lv';

        case EffectType.PASSIVE_PROC:
          return this._formatProcName(effect.procType) + ': +' + this._formatPercent(value) + '/lv';

        default:
          return 'Unknown effect';
      }
    }

    /**
     * Format stat name for display
     * @param {string} stat
     * @returns {string}
     */
    _formatStatName(stat) {
      var names = {
        damage: 'Damage',
        critChance: 'Crit Chance',
        critDamage: 'Crit Damage',
        attackSpeed: 'Attack Speed',
        maxHealth: 'Max Health',
        armor: 'Armor',
        damageReduction: 'Damage Reduction',
        moveSpeed: 'Move Speed',
        range: 'Range',
        area: 'Area',
        pierce: 'Pierce',
        projectileCount: 'Projectiles',
        projectileSpeed: 'Proj Speed',
        cooldownReduction: 'Cooldown',
        duration: 'Duration',
        pickupRange: 'Pickup Range',
        xpGain: 'XP Gain',
        goldGain: 'Gold Gain',
      };
      return names[stat] || stat;
    }

    /**
     * Format mechanic name for display
     * @param {string} mechanic
     * @returns {string}
     */
    _formatMechanicName(mechanic) {
      var names = {
        lifesteal: 'Lifesteal',
        healthRegen: 'HP Regen',
        shieldOnKill: 'Shield on Kill',
        damageScalesWithSpeed: 'Speed Scaling',
        damageScalesWithMissingHp: 'Low HP Damage',
        executeThreshold: 'Execute',
        damageReflect: 'Reflect',
        evasion: 'Evasion',
        phoenixRevive: 'Phoenix',
        burnDamage: 'Burn',
        slowOnHit: 'Slow',
        freezeChance: 'Freeze',
        weaknessDebuff: 'Weaken',
        chainAttack: 'Chain',
        summonMinion: 'Summon',
        timeSlowAura: 'Time Slow',
      };
      return names[mechanic] || mechanic;
    }

    /**
     * Format proc name for display
     * @param {string} proc
     * @returns {string}
     */
    _formatProcName(proc) {
      var names = {
        explosionOnKill: 'Explosion (Kill)',
        explosionOnCrit: 'Explosion (Crit)',
        lightningStrike: 'Lightning',
        fireSpread: 'Fire Spread',
        iceShatter: 'Shatter',
        voidRift: 'Void Rift',
        holySmite: 'Smite',
        ricochet: 'Ricochet',
        bleedOnHit: 'Bleed',
      };
      return names[proc] || proc;
    }

    /**
     * Format value for display
     * @param {number} value
     * @returns {string}
     */
    _formatValue(value) {
      if (value < 1) {
        return Math.round(value * 100) + '%';
      }
      return Math.round(value * 10) / 10;
    }

    /**
     * Format as percentage
     * @param {number} value
     * @returns {string}
     */
    _formatPercent(value) {
      return Math.round(value * 100) + '%';
    }

    /**
     * Get color for effect type
     * @param {string} type
     * @returns {string}
     */
    _getEffectColor(type) {
      var EffectType = TechEffectData.EffectType;
      var colors = {
        [EffectType.STAT_BONUS]: '#3498DB',
        [EffectType.UNIQUE_MECHANIC]: '#9B59B6',
        [EffectType.WEAPON_MODIFIER]: '#E67E22',
        [EffectType.PASSIVE_PROC]: '#E74C3C',
      };
      return colors[type] || '#BDC3C7';
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.TechUnlockPopup = TechUnlockPopup;
})(window.VampireSurvivors.UI = window.VampireSurvivors.UI || {});
