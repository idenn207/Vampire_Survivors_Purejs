/**
 * @fileoverview Character data definitions - 3 playable characters with unique stats and passives
 * @module Data/CharacterData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Character Data
  // ============================================
  var CharacterData = {
    CHARACTERS: {
      knight: {
        id: 'knight',
        name: 'Knight',
        description: 'Balanced fighter with strong defense',
        icon: 'shield',
        color: '#3498DB',

        // Base Stats (fixed values)
        baseStats: {
          attack: 15,         // Fixed attack value
          speed: 80,          // Fixed speed value
          maxHealth: 120,     // Fixed health value
          critChance: 0.05,   // 5% base crit
          luck: 0.0           // No base luck
        },

        // Unique Passive
        passive: {
          id: 'stalwart',
          name: 'Stalwart',
          description: 'Take 15% less damage from all sources',
          effect: {
            type: 'damage_reduction',
            value: 0.15
          }
        }
      },

      rogue: {
        id: 'rogue',
        name: 'Rogue',
        description: 'Fast and lucky with critical strikes',
        icon: 'dagger',
        color: '#9B59B6',

        // Base Stats (fixed values)
        baseStats: {
          attack: 10,         // Fixed attack value
          speed: 140,         // Fixed speed value
          maxHealth: 100,     // Fixed health value
          critChance: 0.15,   // 15% base crit
          luck: 0.1           // 10% base luck
        },

        passive: {
          id: 'backstab',
          name: 'Backstab',
          description: 'Critical hits deal 50% extra damage',
          effect: {
            type: 'crit_damage_bonus',
            value: 0.5
          }
        }
      },

      mage: {
        id: 'mage',
        name: 'Mage',
        description: 'Powerful but fragile spell caster',
        icon: 'magic_orb',
        color: '#E74C3C',

        // Base Stats (fixed values)
        baseStats: {
          attack: 20,         // Fixed attack value
          speed: 100,         // Fixed speed value
          maxHealth: 80,      // Fixed health value
          critChance: 0.05,   // 5% base crit
          luck: 0.05          // 5% base luck
        },

        passive: {
          id: 'arcane_mastery',
          name: 'Arcane Mastery',
          description: 'Weapon cooldowns reduced by 10%',
          effect: {
            type: 'cooldown_reduction',
            value: 0.1
          }
        }
      }
    },

    /**
     * Get character by ID
     * @param {string} id - Character ID
     * @returns {Object|null}
     */
    getCharacter: function (id) {
      return this.CHARACTERS[id] || null;
    },

    /**
     * Get all characters as array
     * @returns {Array<Object>}
     */
    getAllCharacters: function () {
      return Object.values(this.CHARACTERS);
    },

    /**
     * Get all character IDs
     * @returns {Array<string>}
     */
    getCharacterIds: function () {
      return Object.keys(this.CHARACTERS);
    },

    /**
     * Get base stat for a character (now returns fixed values directly)
     * @param {string} characterId
     * @param {string} statId
     * @returns {number}
     */
    getCalculatedStat: function (characterId, statId) {
      var character = this.getCharacter(characterId);
      if (!character) {
        // Default fallback values
        var defaults = { attack: 10, speed: 100, maxHealth: 100, critChance: 0.05, luck: 0 };
        return defaults[statId] || 0;
      }

      // Return fixed value directly from character's baseStats
      return character.baseStats[statId] || 0;
    }
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Data.CharacterData = CharacterData;
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
