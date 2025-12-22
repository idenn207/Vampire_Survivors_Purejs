/**
 * @fileoverview ActiveSkillSystem - handles active skill input and execution
 * @module Systems/ActiveSkillSystem
 */
(function (Systems) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var System = Systems.System;
  var events = window.VampireSurvivors.Core.events;
  var Health = window.VampireSurvivors.Components.Health;
  var Transform = window.VampireSurvivors.Components.Transform;
  var ActiveSkill = window.VampireSurvivors.Components.ActiveSkill;
  var Shield = window.VampireSurvivors.Components.Shield;
  var ActiveBuff = window.VampireSurvivors.Components.ActiveBuff;
  var PlayerData = window.VampireSurvivors.Components.PlayerData;
  var ActiveSkillData = window.VampireSurvivors.Data.ActiveSkillData;
  var Managers = window.VampireSurvivors.Managers;

  // ============================================
  // Constants
  // ============================================
  var SLASH_DURATION = 0.4; // seconds for slash animation
  var AURORA_DAMAGE_BASE = 10; // Base damage for aurora tick

  // ============================================
  // Class Definition
  // ============================================
  class ActiveSkillSystem extends System {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _priority = 6; // After PlayerSystem (5), before StatusEffectSystem (8)
    _player = null;
    _entityManager = null;

    // Slash visual state
    _activeSlashes = [];

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      super();
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setPlayer(player) {
      this._player = player;
    }

    setEntityManager(entityManager) {
      this._entityManager = entityManager;
    }

    update(deltaTime) {
      if (!this._player || !this._player.isActive) return;
      if (!this._game || !this._game.input) return;

      // Don't process during pause/menu/level-up
      if (this._game.isPaused || this._game.state === 'paused') return;

      var activeSkill = this._player.getComponent(ActiveSkill);
      if (!activeSkill) return;

      var input = this._game.input;

      // Update skill timers
      activeSkill.update(deltaTime);

      // Update active buff
      var activeBuff = this._player.getComponent(ActiveBuff);
      if (activeBuff) {
        activeBuff.update(deltaTime);
        this._processAuraBuff(deltaTime, activeBuff);
      }

      // Update active slashes
      this._updateSlashes(deltaTime);

      // Check for space key input
      if (input.isKeyPressed('Space')) {
        this._activateSkill(activeSkill);
      }
    }

    /**
     * Render skill visuals (called from RenderSystem)
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} cameraX
     * @param {number} cameraY
     */
    renderSkillEffects(ctx, cameraX, cameraY) {
      // Render active slashes
      this._renderSlashes(ctx, cameraX, cameraY);

      // Render aurora aura
      this._renderAura(ctx, cameraX, cameraY);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _activateSkill(activeSkill) {
      if (!activeSkill.canUse()) return;

      var skillType = activeSkill.skillType;

      if (skillType === 'combo_slash') {
        // Use first to advance combo index, then execute
        activeSkill.use();
        this._executeRogueSlash(activeSkill);
        return;
      }

      if (skillType === 'shield') {
        this._executeKnightShield(activeSkill);
      } else if (skillType === 'rotating_buff') {
        this._executeMageBuff(activeSkill);
      }

      // Use the skill (starts cooldown/consumes charge)
      activeSkill.use();
    }

    _executeKnightShield(activeSkill) {
      var health = this._player.getComponent(Health);
      if (!health) return;

      var shield = this._player.getComponent(Shield);
      if (!shield) return;

      var skillData = activeSkill.skillData;
      var shieldAmount = health.maxHealth * (skillData.shieldPercent || 2.0);

      shield.addShield(shieldAmount);

      events.emit('skill:shield_activated', {
        player: this._player,
        amount: shieldAmount,
      });
    }

    _executeRogueSlash(activeSkill) {
      var slashData = activeSkill.getCurrentSlash();
      if (!slashData) return;

      var transform = this._player.getComponent(Transform);
      if (!transform) return;

      // Create slash visual
      this._activeSlashes.push({
        pattern: slashData.pattern,
        progress: 0,
        duration: SLASH_DURATION,
        color: slashData.color || '#FFFFFF',
        damageMultiplier: slashData.damageMultiplier || 3.0,
        centerX: transform.centerX,
        centerY: transform.centerY,
        damageApplied: false,
      });

      events.emit('skill:slash_activated', {
        player: this._player,
        slashType: slashData.pattern,
        slashName: slashData.name,
        comboIndex: activeSkill.comboSlashIndex,
      });
    }

    _executeMageBuff(activeSkill) {
      var buffData = activeSkill.getCurrentBuffData();
      if (!buffData) return;

      var skillData = activeSkill.skillData;
      var duration = skillData.buffDuration || 30;

      var activeBuff = this._player.getComponent(ActiveBuff);
      if (!activeBuff) return;

      activeBuff.applyBuff(buffData.id, buffData, duration);

      events.emit('skill:buff_activated', {
        player: this._player,
        buffType: buffData.id,
        buffName: buffData.name,
        duration: duration,
      });
    }

    _updateSlashes(deltaTime) {
      for (var i = this._activeSlashes.length - 1; i >= 0; i--) {
        var slash = this._activeSlashes[i];
        slash.progress += deltaTime / slash.duration;

        // Apply damage at 50% progress
        if (!slash.damageApplied && slash.progress >= 0.5) {
          this._applySlashDamage(slash);
          slash.damageApplied = true;
        }

        // Remove completed slashes
        if (slash.progress >= 1) {
          this._activeSlashes.splice(i, 1);
        }
      }
    }

    _applySlashDamage(slash) {
      if (!this._entityManager) return;

      // Get base attack from PlayerData (character's fixed value)
      var playerData = this._player.getComponent(PlayerData);
      var playerStats = this._player.playerStats;

      var baseAttack = playerData ? playerData.baseAttack : 10;

      // Apply damage multiplier from PlayerStats (gold upgrades)
      var damageMultiplier = playerStats ? playerStats.getMultiplier('damage') : 1;

      var damage = Math.floor(baseAttack * slash.damageMultiplier * damageMultiplier);
      var isCrit = true; // Always critical hit

      // Get all enemies
      var enemies = this._entityManager.getByTag('enemy');

      var enemiesHit = 0;
      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var health = enemy.getComponent(Health);
        if (!health || health.isDead) continue;

        // Apply damage
        health.takeDamage(damage, isCrit);
        enemiesHit++;

        // Emit hit event
        events.emit('slash:hit', {
          enemy: enemy,
          damage: damage,
          isCrit: isCrit,
          slashPattern: slash.pattern,
        });
      }

      events.emit('slash:executed', {
        slashType: slash.pattern,
        damage: damage,
        enemiesHit: enemiesHit,
      });
    }

    _processAuraBuff(deltaTime, activeBuff) {
      if (activeBuff.activeBuff !== 'aurora') return;
      if (!activeBuff.shouldProcessAuraTick()) return;
      if (!this._entityManager) return;

      var transform = this._player.getComponent(Transform);
      if (!transform) return;

      var auraRadius = activeBuff.auraRadius;

      // Get base attack from PlayerData (character's fixed value)
      var playerData = this._player.getComponent(PlayerData);
      var playerStats = this._player.playerStats;

      var baseAttack = playerData ? playerData.baseAttack : 10;

      // Apply damage multiplier from PlayerStats (gold upgrades)
      var damageMultiplier = playerStats ? playerStats.getMultiplier('damage') : 1;

      var auraDamage = Math.floor(baseAttack * activeBuff.auraDamagePercent * damageMultiplier);
      var statusEffects = activeBuff.auraStatusEffects;

      var playerX = transform.centerX;
      var playerY = transform.centerY;

      // Get all enemies
      var enemies = this._entityManager.getByTag('enemy');

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (!enemy.isActive) continue;

        var enemyTransform = enemy.getComponent(Transform);
        if (!enemyTransform) continue;

        // Check distance
        var dx = enemyTransform.centerX - playerX;
        var dy = enemyTransform.centerY - playerY;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > auraRadius) continue;

        var health = enemy.getComponent(Health);
        if (!health || health.isDead) continue;

        // Apply damage
        health.takeDamage(auraDamage);

        // Apply all status effects via BuffDebuffManager
        var buffDebuffManager = Managers.buffDebuffManager;
        if (buffDebuffManager) {
          for (var j = 0; j < statusEffects.length; j++) {
            var effectType = statusEffects[j];
            buffDebuffManager.applyEffectToEntity(enemy, effectType, { level: 1 });
          }
        }

        events.emit('aura:damage', {
          enemy: enemy,
          damage: auraDamage,
          statusEffects: statusEffects,
        });
      }
    }

    _renderSlashes(ctx, cameraX, cameraY) {
      if (this._activeSlashes.length === 0) return;

      var canvasWidth = ctx.canvas.width;
      var canvasHeight = ctx.canvas.height;

      for (var i = 0; i < this._activeSlashes.length; i++) {
        var slash = this._activeSlashes[i];
        var progress = slash.progress;
        var alpha = 1 - progress; // Fade out

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = slash.color;
        ctx.lineWidth = 8 - progress * 4; // Shrink line
        ctx.lineCap = 'round';
        ctx.shadowColor = slash.color;
        ctx.shadowBlur = 20;

        if (slash.pattern === 'horizontal') {
          this._drawHorizontalSlash(ctx, canvasWidth, canvasHeight, progress);
        } else if (slash.pattern === 'vertical') {
          this._drawVerticalSlash(ctx, canvasWidth, canvasHeight, progress);
        } else if (slash.pattern === 'x_slash') {
          this._drawXSlash(ctx, canvasWidth, canvasHeight, progress);
        }

        ctx.restore();
      }
    }

    _drawHorizontalSlash(ctx, width, height, progress) {
      var y1 = height * 0.4;
      var y2 = height * 0.6;
      var offset = progress * width * 0.3;

      // Two horizontal lines
      ctx.beginPath();
      ctx.moveTo(-50 + offset, y1);
      ctx.lineTo(width + 50 - offset, y1);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width + 50 - offset, y2);
      ctx.lineTo(-50 + offset, y2);
      ctx.stroke();
    }

    _drawVerticalSlash(ctx, width, height, progress) {
      var x1 = width * 0.4;
      var x2 = width * 0.6;
      var offset = progress * height * 0.3;

      // Two vertical lines
      ctx.beginPath();
      ctx.moveTo(x1, -50 + offset);
      ctx.lineTo(x1, height + 50 - offset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, height + 50 - offset);
      ctx.lineTo(x2, -50 + offset);
      ctx.stroke();
    }

    _drawXSlash(ctx, width, height, progress) {
      var margin = 50;
      var offset = progress * 100;

      // Two diagonal lines forming X
      ctx.beginPath();
      ctx.moveTo(-margin + offset, -margin + offset);
      ctx.lineTo(width + margin - offset, height + margin - offset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width + margin - offset, -margin + offset);
      ctx.lineTo(-margin + offset, height + margin - offset);
      ctx.stroke();
    }

    _renderAura(ctx, cameraX, cameraY) {
      if (!this._player) return;

      var activeBuff = this._player.getComponent(ActiveBuff);
      if (!activeBuff || activeBuff.activeBuff !== 'aurora') return;

      var transform = this._player.getComponent(Transform);
      if (!transform) return;

      var radius = activeBuff.auraRadius;
      var screenX = transform.centerX - cameraX;
      var screenY = transform.centerY - cameraY;

      ctx.save();

      // Pulsing effect
      var pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
      var drawRadius = radius * pulse;

      // Outer glow
      var gradient = ctx.createRadialGradient(
        screenX,
        screenY,
        0,
        screenX,
        screenY,
        drawRadius
      );
      gradient.addColorStop(0, 'rgba(155, 89, 182, 0.0)');
      gradient.addColorStop(0.5, 'rgba(155, 89, 182, 0.1)');
      gradient.addColorStop(0.8, 'rgba(155, 89, 182, 0.2)');
      gradient.addColorStop(1, 'rgba(155, 89, 182, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(screenX, screenY, drawRadius, 0, Math.PI * 2);
      ctx.fill();

      // Ring border
      ctx.strokeStyle = 'rgba(155, 89, 182, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(screenX, screenY, drawRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // ----------------------------------------
    // Getters / Setters
    // ----------------------------------------
    get activeSlashes() {
      return this._activeSlashes;
    }

    // ----------------------------------------
    // Debug Interface
    // ----------------------------------------
    getDebugInfo() {
      if (!this._player) {
        return { label: 'ActiveSkill', entries: [{ key: 'Status', value: 'No player' }] };
      }

      var activeSkill = this._player.getComponent(ActiveSkill);
      if (!activeSkill) {
        return { label: 'ActiveSkill', entries: [{ key: 'Status', value: 'No skill' }] };
      }

      var entries = [{ key: 'Skill', value: activeSkill.skillId || 'None' }];

      if (activeSkill.skillType === 'combo_slash') {
        entries.push({ key: 'Charges', value: activeSkill.charges + '/' + activeSkill.maxCharges });
        entries.push({ key: 'Combo', value: activeSkill.isInCombo ? 'Active' : 'None' });
      } else {
        entries.push({
          key: 'Cooldown',
          value: activeSkill.cooldown > 0 ? activeSkill.cooldown.toFixed(1) + 's' : 'Ready',
        });
      }

      var activeBuff = this._player.getComponent(ActiveBuff);
      if (activeBuff && activeBuff.hasBuff) {
        entries.push({ key: 'Buff', value: activeBuff.activeBuff });
        entries.push({ key: 'Duration', value: activeBuff.duration.toFixed(1) + 's' });
      }

      var shield = this._player.getComponent(Shield);
      if (shield && shield.hasShield()) {
        entries.push({ key: 'Shield', value: Math.floor(shield.shieldAmount) });
      }

      return { label: 'ActiveSkill', entries: entries };
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      this._entityManager = null;
      this._activeSlashes = [];
      super.dispose();
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Systems.ActiveSkillSystem = ActiveSkillSystem;
})(window.VampireSurvivors.Systems);
