/**
 * @fileoverview ActiveSkill component - tracks active skill state for player
 * @module Components/ActiveSkill
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class ActiveSkill extends Component {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _skillId = null; // Skill ID
    _skillType = null; // SHIELD, COMBO_SLASH, ROTATING_BUFF
    _skillData = null; // Full skill configuration

    // Cooldown (for Knight, Mage)
    _cooldown = 0;
    _cooldownMax = 0;

    // Charges (for Rogue)
    _charges = 0;
    _maxCharges = 0;
    _chargeRegenTimer = 0;
    _chargeRegenInterval = 0;

    // Combo state (for Rogue)
    _comboSlashIndex = 0; // 0=horizontal, 1=vertical, 2=x_slash
    _comboTimer = 0;
    _comboWindow = 0;
    _isInCombo = false;

    // Buff cycle (for Mage)
    _buffCycleIndex = 0; // 0=attack, 1=speed, 2=aurora

    // Cast cooldown (for Rogue - prevents rapid consecutive casts)
    _castCooldown = 0;
    _castCooldownMax = 0.5; // 0.5 second cooldown after casting

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Initialize skill for a character
     * @param {Object} skillData - Skill configuration from ActiveSkillData
     */
    initialize(skillData) {
      if (!skillData) return;

      this._skillId = skillData.id;
      this._skillType = skillData.type;
      this._skillData = skillData;

      // Initialize based on skill type
      if (skillData.type === 'shield' || skillData.type === 'rotating_buff') {
        this._cooldownMax = skillData.cooldown || 0;
        this._cooldown = 0; // Ready to use at start
      }

      if (skillData.type === 'combo_slash') {
        this._maxCharges = skillData.maxCharges || 3;
        this._charges = this._maxCharges; // Start with full charges
        this._chargeRegenInterval = skillData.chargeRegenTime || 15;
        this._chargeRegenTimer = 0;
        this._comboWindow = skillData.comboWindow || 3.0;
        this._comboSlashIndex = 0;
        this._isInCombo = false;
      }

      if (skillData.type === 'rotating_buff') {
        this._buffCycleIndex = 0;
      }
    }

    /**
     * Update skill timers
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
      // Update cooldown
      if (this._cooldown > 0) {
        this._cooldown -= deltaTime;
        if (this._cooldown < 0) this._cooldown = 0;
      }

      // Update cast cooldown (for Rogue)
      if (this._castCooldown > 0) {
        this._castCooldown -= deltaTime;
        if (this._castCooldown < 0) this._castCooldown = 0;
      }

      // Update charge regeneration (for Rogue)
      if (this._skillType === 'combo_slash' && this._charges < this._maxCharges) {
        this._chargeRegenTimer += deltaTime;
        if (this._chargeRegenTimer >= this._chargeRegenInterval) {
          this._chargeRegenTimer -= this._chargeRegenInterval;
          this._charges++;

          events.emit('skill:charge_gained', {
            entity: this._entity,
            charges: this._charges,
            maxCharges: this._maxCharges,
          });
        }
      }

      // Update combo timer (for Rogue)
      if (this._isInCombo) {
        this._comboTimer -= deltaTime;
        if (this._comboTimer <= 0) {
          this._resetCombo();
        }
      }
    }

    /**
     * Check if skill can be used
     * @returns {boolean}
     */
    canUse() {
      if (!this._skillType) return false;

      if (this._skillType === 'combo_slash') {
        return this._charges > 0 && this._castCooldown <= 0;
      }

      return this._cooldown <= 0;
    }

    /**
     * Use the skill (starts cooldown/consumes charge)
     * @returns {boolean} True if skill was used
     */
    use() {
      if (!this.canUse()) return false;

      if (this._skillType === 'combo_slash') {
        this._charges--;
        this._castCooldown = this._castCooldownMax; // Start 1-second cast cooldown

        // Handle combo
        if (this._isInCombo) {
          // Advance to next slash
          this._comboSlashIndex = (this._comboSlashIndex + 1) % 3;
        } else {
          // Start new combo
          this._comboSlashIndex = 0;
        }

        // Start/reset combo timer
        this._isInCombo = true;
        this._comboTimer = this._comboWindow;

        events.emit('skill:activated', {
          entity: this._entity,
          skillId: this._skillId,
          skillType: this._skillType,
          slashIndex: this._comboSlashIndex,
        });
      } else {
        // Cooldown-based skill
        this._cooldown = this._cooldownMax;

        // For mage, advance buff cycle after use
        if (this._skillType === 'rotating_buff' && this._skillData && this._skillData.buffs) {
          var buffIndex = this._buffCycleIndex;
          this._buffCycleIndex = (this._buffCycleIndex + 1) % this._skillData.buffs.length;

          events.emit('skill:activated', {
            entity: this._entity,
            skillId: this._skillId,
            skillType: this._skillType,
            buffIndex: buffIndex,
          });
        } else {
          events.emit('skill:activated', {
            entity: this._entity,
            skillId: this._skillId,
            skillType: this._skillType,
          });
        }
      }

      return true;
    }

    /**
     * Get current slash data for Rogue
     * @returns {Object|null}
     */
    getCurrentSlash() {
      if (this._skillType !== 'combo_slash' || !this._skillData) return null;
      return this._skillData.slashes[this._comboSlashIndex] || null;
    }

    /**
     * Get current buff data for Mage
     * @returns {Object|null}
     */
    getCurrentBuffData() {
      if (this._skillType !== 'rotating_buff' || !this._skillData) return null;
      return this._skillData.buffs[this._buffCycleIndex] || null;
    }

    /**
     * Get next buff type that will be applied (for UI display)
     * @returns {Object|null}
     */
    getNextBuffData() {
      return this.getCurrentBuffData();
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _resetCombo() {
      this._isInCombo = false;
      this._comboTimer = 0;
      this._comboSlashIndex = 0;

      events.emit('combo:reset', {
        entity: this._entity,
      });
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get skillId() {
      return this._skillId;
    }

    get skillType() {
      return this._skillType;
    }

    get skillData() {
      return this._skillData;
    }

    get cooldown() {
      return this._cooldown;
    }

    get cooldownMax() {
      return this._cooldownMax;
    }

    get cooldownProgress() {
      if (this._cooldownMax <= 0) return 1;
      return 1 - this._cooldown / this._cooldownMax;
    }

    get charges() {
      return this._charges;
    }

    get maxCharges() {
      return this._maxCharges;
    }

    get chargeRegenProgress() {
      if (this._chargeRegenInterval <= 0) return 0;
      return this._chargeRegenTimer / this._chargeRegenInterval;
    }

    get chargeRegenRemaining() {
      if (this._chargeRegenInterval <= 0) return 0;
      return this._chargeRegenInterval - this._chargeRegenTimer;
    }

    get comboSlashIndex() {
      return this._comboSlashIndex;
    }

    get isInCombo() {
      return this._isInCombo;
    }

    get comboTimer() {
      return this._comboTimer;
    }

    get comboWindow() {
      return this._comboWindow;
    }

    get buffCycleIndex() {
      return this._buffCycleIndex;
    }

    get castCooldown() {
      return this._castCooldown;
    }

    get castCooldownMax() {
      return this._castCooldownMax;
    }

    get castCooldownProgress() {
      if (this._castCooldownMax <= 0) return 1;
      return 1 - this._castCooldown / this._castCooldownMax;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugEntries() {
      var entries = [{ key: 'Skill', value: this._skillId || 'None' }];

      if (this._skillType === 'combo_slash') {
        entries.push({ key: 'Charges', value: this._charges + '/' + this._maxCharges });
        if (this._isInCombo) {
          entries.push({ key: 'Combo', value: 'Slash ' + (this._comboSlashIndex + 1) });
        }
      } else if (this._cooldownMax > 0) {
        entries.push({
          key: 'Cooldown',
          value: this._cooldown > 0 ? this._cooldown.toFixed(1) + 's' : 'Ready',
        });
      }

      return entries;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._skillId = null;
      this._skillType = null;
      this._skillData = null;
      this._cooldown = 0;
      this._charges = 0;
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.ActiveSkill = ActiveSkill;
})(window.VampireSurvivors.Components);
