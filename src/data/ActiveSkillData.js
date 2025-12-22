/**
 * @fileoverview Active skill definitions for each character class
 * @module Data/ActiveSkillData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Skill Type Constants
  // ============================================
  var ActiveSkillType = {
    SHIELD: 'shield',
    COMBO_SLASH: 'combo_slash',
    ROTATING_BUFF: 'rotating_buff',
  };

  // ============================================
  // Buff Type Constants
  // ============================================
  var BuffType = {
    ATTACK: 'attack',
    SPEED: 'speed',
    AURORA: 'aurora',
  };

  // ============================================
  // Slash Pattern Constants
  // ============================================
  var SlashPattern = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
    X_SLASH: 'x_slash',
  };

  // ============================================
  // Active Skill Data
  // ============================================
  var ActiveSkillData = {
    SKILLS: {
      knight: {
        id: 'divine_shield',
        name: 'Divine Shield',
        description: 'Grants temporary shield equal to 200% of max HP. Stacks with existing shields.',
        icon: 'shield_skill',
        type: ActiveSkillType.SHIELD,
        cooldown: 120, // seconds
        shieldPercent: 2.0, // 200% of max HP
        color: '#4A90D9',
      },

      rogue: {
        id: 'combo_slash',
        name: 'Combo Slash',
        description: 'Screen-wide slash attack with 100% crit chance. Chain within 3s for stronger combos.',
        icon: 'slash_skill',
        type: ActiveSkillType.COMBO_SLASH,
        maxCharges: 3,
        chargeRegenTime: 15, // seconds per charge
        comboWindow: 3.0, // seconds to chain next slash
        forceCrit: true, // 100% critical hit chance
        slashes: [
          {
            name: 'Horizontal Slash',
            pattern: SlashPattern.HORIZONTAL,
            damageMultiplier: 3.0, // 300% of attack power
            color: '#E74C3C',
          },
          {
            name: 'Vertical Slash',
            pattern: SlashPattern.VERTICAL,
            damageMultiplier: 5.0, // 500% of attack power
            color: '#F39C12',
          },
          {
            name: 'X Slash',
            pattern: SlashPattern.X_SLASH,
            damageMultiplier: 8.0, // 800% of attack power
            color: '#9B59B6',
          },
        ],
      },

      mage: {
        id: 'arcane_attunement',
        name: 'Arcane Attunement',
        description: 'Cycles through 3 powerful buffs: Attack, Speed, and Aurora.',
        icon: 'buff_skill',
        type: ActiveSkillType.ROTATING_BUFF,
        cooldown: 90, // seconds
        buffDuration: 30, // seconds
        buffs: [
          {
            id: BuffType.ATTACK,
            name: 'Attack Buff',
            description: 'Increases offensive power',
            color: '#E74C3C',
            attackBonus: 0.3, // +30% attack power
            critChanceBonus: 0.2, // +20% crit chance
            critDamageBonus: 0.4, // +40% crit damage
          },
          {
            id: BuffType.SPEED,
            name: 'Speed Buff',
            description: 'Enhances speed and efficiency',
            color: '#2ECC71',
            moveSpeedBonus: 0.25, // +25% movement speed
            cooldownReductionBonus: 0.25, // +25% cooldown reduction
            durationBonus: 0.3, // +30% duration on effects
          },
          {
            id: BuffType.AURORA,
            name: 'Aurora Buff',
            description: 'Creates damaging aura with status effects',
            color: '#9B59B6',
            auraRadius: 450, // pixels
            auraDamagePercent: 0.1, // 10% of attack per tick
            auraTickRate: 0.5, // damage tick every 0.5 seconds
            statusEffects: ['burn', 'poison', 'freeze', 'slow', 'weakness', 'mark'],
          },
        ],
      },
    },

    /**
     * Get skill data for a character
     * @param {string} characterId - Character ID (knight, rogue, mage)
     * @returns {Object|null} Skill data or null
     */
    getSkillForCharacter: function (characterId) {
      return this.SKILLS[characterId] || null;
    },

    /**
     * Get all available skills
     * @returns {Object} Map of character ID to skill data
     */
    getAllSkills: function () {
      return this.SKILLS;
    },
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Data.ActiveSkillType = ActiveSkillType;
  Data.BuffType = BuffType;
  Data.SlashPattern = SlashPattern;
  Data.ActiveSkillData = ActiveSkillData;
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
