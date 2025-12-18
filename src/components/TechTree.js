/**
 * @fileoverview TechTree component - tracks player's tech tree progression
 * @module Components/TechTree
 */
(function (Components) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var Component = Components.Component;
  var TechCoreData = window.VampireSurvivors.Data.TechCoreData;
  var TechEffectData = window.VampireSurvivors.Data.TechEffectData;

  // ============================================
  // Class Definition
  // ============================================
  class TechTree extends Component {
    // ----------------------------------------
    // Static Properties
    // ----------------------------------------
    static TYPE = 'TechTree';

    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _coreId = null;
    _unlockedTechs = null; // Map<techId, level>
    _techEffects = null; // Stores applied effect values for combat lookup

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor(coreId) {
      super();
      this._coreId = coreId;
      this._unlockedTechs = new Map();
      this._techEffects = {
        statBonuses: {},
        mechanics: {},
        weaponModifiers: {},
        passiveProcs: {},
      };

      // Auto-unlock base tech at level 0 (unlocked but not upgraded)
      if (coreId) {
        var coreData = TechCoreData.getCoreData(coreId);
        if (coreData && coreData.tree && coreData.tree.base) {
          this._unlockedTechs.set(coreData.tree.base.id, 0);
        }
      }
    }

    // ----------------------------------------
    // Public Methods - Core Info
    // ----------------------------------------
    /**
     * Get the selected core ID
     * @returns {string|null}
     */
    getCoreId() {
      return this._coreId;
    }

    /**
     * Get the core data
     * @returns {Object|null}
     */
    getCoreData() {
      return TechCoreData.getCoreData(this._coreId);
    }

    /**
     * Get tech effects tracker for combat/system use
     * @returns {Object}
     */
    getTechEffects() {
      return this._techEffects;
    }

    // ----------------------------------------
    // Public Methods - Tech Queries
    // ----------------------------------------
    /**
     * Get tech level (0 = unlocked but not upgraded, >0 = upgraded)
     * @param {string} techId
     * @returns {number} 0 if not unlocked or at base level
     */
    getTechLevel(techId) {
      if (!this._unlockedTechs.has(techId)) return 0;
      return this._unlockedTechs.get(techId);
    }

    /**
     * Check if tech is unlocked (at any level including 0)
     * @param {string} techId
     * @returns {boolean}
     */
    isTechUnlocked(techId) {
      return this._unlockedTechs.has(techId);
    }

    /**
     * Check if tech is at max level
     * @param {string} techId
     * @returns {boolean}
     */
    isTechMaxLevel(techId) {
      if (!this._unlockedTechs.has(techId)) return false;

      var techData = TechCoreData.getTechById(this._coreId, techId);
      if (!techData) return false;

      return this._unlockedTechs.get(techId) >= techData.maxLevel;
    }

    /**
     * Get all unlocked techs as an array
     * @returns {Array<{techId: string, level: number}>}
     */
    getAllUnlockedTechs() {
      var result = [];
      this._unlockedTechs.forEach(function (level, techId) {
        result.push({ techId: techId, level: level });
      });
      return result;
    }

    /**
     * Get unlocked techs by depth
     * @param {number} depth - 0 for base, 1-3 for depths
     * @returns {Array<{techId: string, level: number, techData: Object}>}
     */
    getUnlockedTechsByDepth(depth) {
      var techs = TechCoreData.getTechsByDepth(this._coreId, depth);
      var result = [];

      for (var i = 0; i < techs.length; i++) {
        var tech = techs[i];
        if (this._unlockedTechs.has(tech.id)) {
          result.push({
            techId: tech.id,
            level: this._unlockedTechs.get(tech.id),
            techData: tech,
          });
        }
      }

      return result;
    }

    /**
     * Count unlocked techs at a specific depth
     * @param {number} depth
     * @returns {number}
     */
    countUnlockedAtDepth(depth) {
      var techs = TechCoreData.getTechsByDepth(this._coreId, depth);
      var count = 0;

      for (var i = 0; i < techs.length; i++) {
        if (this._unlockedTechs.has(techs[i].id)) {
          count++;
        }
      }

      return count;
    }

    // ----------------------------------------
    // Public Methods - Tech Unlocking
    // ----------------------------------------
    /**
     * Check if a tech can be unlocked
     * @param {string} techId
     * @returns {boolean}
     */
    canUnlockTech(techId) {
      // Already unlocked?
      if (this._unlockedTechs.has(techId)) return false;

      var techData = TechCoreData.getTechById(this._coreId, techId);
      if (!techData) return false;

      var depth = TechCoreData.getTechDepth(this._coreId, techId);
      if (depth < 0) return false;

      // Base is always unlockable (but auto-unlocked on core selection)
      if (depth === 0) return true;

      // Check prerequisites
      if (techData.requiresMultiple && techData.requires && techData.requires.length >= 2) {
        // Need ALL required techs
        for (var i = 0; i < techData.requires.length; i++) {
          if (!this._unlockedTechs.has(techData.requires[i])) {
            return false;
          }
        }
        return true;
      } else if (techData.requires && techData.requires.length > 0) {
        // Need at least one required tech
        for (var j = 0; j < techData.requires.length; j++) {
          if (this._unlockedTechs.has(techData.requires[j])) {
            return true;
          }
        }
        return false;
      } else {
        // No specific requires - need at least 1 tech from previous depth
        return this.countUnlockedAtDepth(depth - 1) >= 1;
      }
    }

    /**
     * Unlock a tech (set level to 1)
     * @param {string} techId
     * @returns {boolean} True if successfully unlocked
     */
    unlockTech(techId) {
      if (!this.canUnlockTech(techId)) return false;

      this._unlockedTechs.set(techId, 1);
      return true;
    }

    /**
     * Get available techs to unlock
     * @returns {Array<Object>} Array of tech objects with depth info
     */
    getAvailableTechs() {
      return TechCoreData.getAvailableTechs(this._coreId, this);
    }

    // ----------------------------------------
    // Public Methods - Tech Upgrading
    // ----------------------------------------
    /**
     * Check if a tech can be upgraded
     * @param {string} techId
     * @returns {boolean}
     */
    canUpgradeTech(techId) {
      if (!this._unlockedTechs.has(techId)) return false;

      var techData = TechCoreData.getTechById(this._coreId, techId);
      if (!techData) return false;

      var currentLevel = this._unlockedTechs.get(techId);
      return currentLevel < techData.maxLevel;
    }

    /**
     * Get upgrade cost for a tech
     * @param {string} techId
     * @returns {number} Cost in gold, or Infinity if can't upgrade
     */
    getUpgradeCost(techId) {
      if (!this._unlockedTechs.has(techId)) return Infinity;

      var techData = TechCoreData.getTechById(this._coreId, techId);
      if (!techData) return Infinity;

      var currentLevel = this._unlockedTechs.get(techId);
      if (currentLevel >= techData.maxLevel) return Infinity;

      return techData.costPerLevel[currentLevel] || Infinity;
    }

    /**
     * Upgrade a tech by 1 level
     * @param {string} techId
     * @returns {boolean} True if successfully upgraded
     */
    upgradeTech(techId) {
      if (!this.canUpgradeTech(techId)) return false;

      var currentLevel = this._unlockedTechs.get(techId);
      this._unlockedTechs.set(techId, currentLevel + 1);
      return true;
    }

    // ----------------------------------------
    // Public Methods - Effect Application
    // ----------------------------------------
    /**
     * Apply all effects for a tech at given level
     * @param {Entity} player
     * @param {string} techId
     * @param {number} level
     */
    applyTechEffects(player, techId, level) {
      var techData = TechCoreData.getTechById(this._coreId, techId);
      if (!techData || !techData.effects) return;

      for (var i = 0; i < techData.effects.length; i++) {
        TechEffectData.applyEffect(player, techData.effects[i], level, this._techEffects);
      }
    }

    /**
     * Remove all effects for a tech
     * @param {Entity} player
     * @param {string} techId
     */
    removeTechEffects(player, techId) {
      var techData = TechCoreData.getTechById(this._coreId, techId);
      if (!techData || !techData.effects) return;

      for (var i = 0; i < techData.effects.length; i++) {
        TechEffectData.removeEffect(player, techData.effects[i], this._techEffects);
      }
    }

    /**
     * Update effects when tech level changes
     * @param {Entity} player
     * @param {string} techId
     * @param {number} oldLevel
     * @param {number} newLevel
     */
    updateTechEffects(player, techId, oldLevel, newLevel) {
      var techData = TechCoreData.getTechById(this._coreId, techId);
      if (!techData || !techData.effects) return;

      for (var i = 0; i < techData.effects.length; i++) {
        TechEffectData.updateEffect(
          player,
          techData.effects[i],
          oldLevel,
          newLevel,
          this._techEffects
        );
      }
    }

    /**
     * Apply all current tech effects (used on game start)
     * @param {Entity} player
     */
    applyAllEffects(player) {
      var self = this;
      this._unlockedTechs.forEach(function (level, techId) {
        if (level > 0) {
          self.applyTechEffects(player, techId, level);
        }
      });
    }

    // ----------------------------------------
    // Public Methods - Effect Getters
    // ----------------------------------------
    /**
     * Get stat bonus value
     * @param {string} statId
     * @returns {number}
     */
    getStatBonus(statId) {
      return TechEffectData.getStatBonus(this._techEffects, statId);
    }

    /**
     * Get mechanic value
     * @param {string} mechanicId
     * @returns {number}
     */
    getMechanicValue(mechanicId) {
      return TechEffectData.getMechanicValue(this._techEffects, mechanicId);
    }

    /**
     * Check if mechanic is active
     * @param {string} mechanicId
     * @returns {boolean}
     */
    hasMechanic(mechanicId) {
      return TechEffectData.hasMechanic(this._techEffects, mechanicId);
    }

    /**
     * Get weapon modifier value
     * @param {string} statId
     * @returns {number}
     */
    getWeaponModifier(statId) {
      return TechEffectData.getWeaponModifier(this._techEffects, statId);
    }

    /**
     * Get passive proc chance
     * @param {string} procId
     * @returns {number}
     */
    getProcChance(procId) {
      return TechEffectData.getProcChance(this._techEffects, procId);
    }

    /**
     * Roll for a passive proc
     * @param {string} procId
     * @returns {boolean}
     */
    rollProc(procId) {
      return TechEffectData.rollProc(this._techEffects, procId);
    }

    // ----------------------------------------
    // Public Methods - Stats Display
    // ----------------------------------------
    /**
     * Get display info for all unlocked techs
     * @returns {Array<Object>}
     */
    getDisplayInfo() {
      var result = [];
      var self = this;

      // Group by depth
      for (var depth = 0; depth <= 3; depth++) {
        var techs = TechCoreData.getTechsByDepth(this._coreId, depth);

        for (var i = 0; i < techs.length; i++) {
          var tech = techs[i];
          if (self._unlockedTechs.has(tech.id)) {
            var level = self._unlockedTechs.get(tech.id);
            var canUpgrade = self.canUpgradeTech(tech.id);
            var cost = canUpgrade ? self.getUpgradeCost(tech.id) : null;

            result.push({
              depth: depth,
              techId: tech.id,
              name: tech.name,
              level: level,
              maxLevel: tech.maxLevel,
              canUpgrade: canUpgrade,
              upgradeCost: cost,
              effects: tech.effects,
            });
          }
        }
      }

      return result;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    /**
     * Reset tech tree (for new run)
     */
    reset() {
      this._unlockedTechs.clear();
      this._techEffects = {
        statBonuses: {},
        mechanics: {},
        weaponModifiers: {},
        passiveProcs: {},
      };

      // Re-unlock base tech
      if (this._coreId) {
        var coreData = TechCoreData.getCoreData(this._coreId);
        if (coreData && coreData.tree && coreData.tree.base) {
          this._unlockedTechs.set(coreData.tree.base.id, 0);
        }
      }
    }

    dispose() {
      this._unlockedTechs.clear();
      this._unlockedTechs = null;
      this._techEffects = null;
      this._coreId = null;
      super.dispose();
    }

    // ----------------------------------------
    // Debug Info
    // ----------------------------------------
    getDebugInfo() {
      return {
        coreId: this._coreId,
        unlockedCount: this._unlockedTechs.size,
        techs: this.getAllUnlockedTechs(),
      };
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Components.TechTree = TechTree;
})(window.VampireSurvivors.Components = window.VampireSurvivors.Components || {});
