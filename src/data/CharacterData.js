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
    // Default base values (before character multipliers)
    BASE_VALUES: {
      attack: 10,
      speed: 200,
      maxHealth: 100,
      critChance: 0.05,
      luck: 0
    },

    CHARACTERS: {
      knight: {
        id: 'knight',
        name: 'Knight',
        description: 'Balanced fighter with strong defense',
        icon: 'shield',
        color: '#3498DB',

        // Base Stats (multipliers to default values)
        baseStats: {
          attack: 1.0,        // Normal attack
          speed: 0.9,         // Slightly slower
          maxHealth: 1.3,     // 30% more HP
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

        baseStats: {
          attack: 0.85,       // 15% less base attack
          speed: 1.2,         // 20% faster
          maxHealth: 0.8,     // 20% less HP
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

        baseStats: {
          attack: 1.25,       // 25% more base attack
          speed: 1.0,         // Normal speed
          maxHealth: 0.7,     // 30% less HP
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
     * Get calculated base stat for a character
     * @param {string} characterId
     * @param {string} statId
     * @returns {number}
     */
    getCalculatedStat: function (characterId, statId) {
      var character = this.getCharacter(characterId);
      if (!character) {
        return this.BASE_VALUES[statId] || 0;
      }

      var baseValue = this.BASE_VALUES[statId];
      var multiplier = character.baseStats[statId];

      // For critChance and luck, the value is the actual value, not a multiplier
      if (statId === 'critChance' || statId === 'luck') {
        return multiplier;
      }

      return baseValue * multiplier;
    }
  };

  // ============================================
  // Export to Namespace
  // ============================================
  Data.CharacterData = CharacterData;
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});
