/**
 * @fileoverview Weapon and Tech slots UI - left column for weapons, right column for tech tree
 * @module UI/WeaponSlots
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var TechTree = window.VampireSurvivors.Components.TechTree;
  var TechCoreData = window.VampireSurvivors.Data.TechCoreData;

  // ============================================
  // Constants
  // ============================================
  var SLOTS_X = 10;
  var SLOTS_Y = 150; // Below status panel

  var SLOT_SIZE = 36;
  var SLOT_GAP = 3;
  var SLOT_BORDER = 2;
  var COLUMN_GAP = 6; // Gap between weapon and tech columns
  var WEAPON_COLUMNS = 2;
  var WEAPON_ROWS = 5;
  var TOTAL_WEAPON_SLOTS = WEAPON_COLUMNS * WEAPON_ROWS; // 10 weapon slots
  var TECH_SLOTS = 5; // 5 tech slots (1 column)

  // Weapon slot colors (left column)
  var WEAPON_EMPTY_BG = '#F5E6E8'; // Light pink
  var WEAPON_EMPTY_BORDER = '#D4A5A5'; // Muted pink
  var WEAPON_EMPTY_X_COLOR = '#C9A5A5';
  var WEAPON_FILLED_BG = '#E8E0F0'; // Light purple

  // Tech slot colors (right column)
  var TECH_EMPTY_BG = '#E6F5E8'; // Light green
  var TECH_EMPTY_BORDER = '#A5D4A5'; // Muted green
  var TECH_EMPTY_X_COLOR = '#A5C9A5';
  var TECH_FILLED_BG = '#E0F0E8'; // Light teal

  // Weapon type colors for icons
  var WEAPON_COLORS = {
    projectile: '#3498DB', // Blue
    laser: '#E74C3C', // Red
    melee: '#2ECC71', // Green
    area: '#F39C12', // Orange
    particle: '#9B59B6', // Purple
  };

  // Tech depth colors for icons
  var DEPTH_COLORS = {
    0: '#FFFFFF',
    1: '#3498DB',
    2: '#9B59B6',
    3: '#F39C12',
  };

  // Tech icons based on core icons
  var TECH_ICONS = {
    flame: '🔥',
    snowflake: '❄',
    bolt: '⚡',
    moon: '🌙',
    droplet: '💧',
    star: '✦',
    leaf: '🍃',
    shield: '🛡',
    wind: '💨',
    mountain: '⛰',
    void: '◉',
    sun: '☀',
    gear: '⚙',
    paw: '🐾',
    clock: '⏱',
  };

  // Tech type colors for icons (legacy, kept for fallback)
  var TECH_COLORS = {
    passive: '#27AE60', // Green
    buff: '#F1C40F', // Yellow
    utility: '#3498DB', // Blue
  };

  // ============================================
  // Class Definition
  // ============================================
  class WeaponSlots {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _player = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {}

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    setPlayer(player) {
      this._player = player;
    }

    render(ctx) {
      var weapons = this._getWeapons();
      var techItems = this._getTechItems();

      // Render weapon slots (2 columns x 5 rows = 10 slots)
      for (var i = 0; i < TOTAL_WEAPON_SLOTS; i++) {
        var col = i % WEAPON_COLUMNS;
        var row = Math.floor(i / WEAPON_COLUMNS);
        var x = SLOTS_X + col * (SLOT_SIZE + SLOT_GAP);
        var y = SLOTS_Y + row * (SLOT_SIZE + SLOT_GAP);
        var weapon = weapons[i] || null;

        if (weapon) {
          this._renderFilledWeaponSlot(ctx, x, y, weapon);
        } else {
          this._renderEmptySlot(ctx, x, y, 'weapon');
        }
      }

      // Render tech slots (1 column x 5 rows = 5 slots, to the right of weapons)
      var techStartX = SLOTS_X + WEAPON_COLUMNS * (SLOT_SIZE + SLOT_GAP) + COLUMN_GAP;
      for (var j = 0; j < TECH_SLOTS; j++) {
        var techX = techStartX;
        var techY = SLOTS_Y + j * (SLOT_SIZE + SLOT_GAP);
        var tech = techItems[j] || null;

        if (tech) {
          this._renderFilledTechSlot(ctx, techX, techY, tech);
        } else {
          this._renderEmptySlot(ctx, techX, techY, 'tech');
        }
      }
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _getWeapons() {
      if (!this._player || !this._player.weaponSlot) {
        return [];
      }
      return this._player.weaponSlot.weapons || [];
    }

    _getTechItems() {
      if (!this._player) {
        return [];
      }

      // Get TechTree component (lazy import for circular dependency)
      var TechTreeComponent = TechTree || window.VampireSurvivors.Components.TechTree;
      if (!TechTreeComponent) {
        return [];
      }

      var techTree = this._player.getComponent(TechTreeComponent);
      if (!techTree) {
        return [];
      }

      var coreData = techTree.getCoreData();
      if (!coreData) {
        return [];
      }

      var displayInfo = techTree.getDisplayInfo();
      var techItems = [];

      for (var i = 0; i < displayInfo.length && techItems.length < TECH_SLOTS; i++) {
        var info = displayInfo[i];
        techItems.push({
          name: info.name,
          level: info.level,
          depth: info.depth,
          coreIcon: coreData.icon,
          coreColor: coreData.color,
        });
      }

      // Sort by depth for display priority
      techItems.sort(function (a, b) {
        return a.depth - b.depth;
      });

      return techItems;
    }

    _renderEmptySlot(ctx, x, y, type) {
      var bgColor = type === 'weapon' ? WEAPON_EMPTY_BG : TECH_EMPTY_BG;
      var borderColor = type === 'weapon' ? WEAPON_EMPTY_BORDER : TECH_EMPTY_BORDER;
      var xColor = type === 'weapon' ? WEAPON_EMPTY_X_COLOR : TECH_EMPTY_X_COLOR;

      // Border
      ctx.fillStyle = borderColor;
      ctx.fillRect(x, y, SLOT_SIZE, SLOT_SIZE);

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(
        x + SLOT_BORDER,
        y + SLOT_BORDER,
        SLOT_SIZE - SLOT_BORDER * 2,
        SLOT_SIZE - SLOT_BORDER * 2
      );

      // X pattern
      ctx.strokeStyle = xColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      var padding = 10;
      ctx.beginPath();
      ctx.moveTo(x + padding, y + padding);
      ctx.lineTo(x + SLOT_SIZE - padding, y + SLOT_SIZE - padding);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + SLOT_SIZE - padding, y + padding);
      ctx.lineTo(x + padding, y + SLOT_SIZE - padding);
      ctx.stroke();
    }

    _renderFilledWeaponSlot(ctx, x, y, weapon) {
      var weaponType = this._getWeaponType(weapon);
      var borderColor = WEAPON_COLORS[weaponType] || '#9B59B6';

      ctx.fillStyle = borderColor;
      ctx.fillRect(x, y, SLOT_SIZE, SLOT_SIZE);

      ctx.fillStyle = WEAPON_FILLED_BG;
      ctx.fillRect(
        x + SLOT_BORDER,
        y + SLOT_BORDER,
        SLOT_SIZE - SLOT_BORDER * 2,
        SLOT_SIZE - SLOT_BORDER * 2
      );

      this._renderWeaponIcon(ctx, x, y, weapon, weaponType);
      this._renderLevel(ctx, x, y, weapon.level || 1);
    }

    _renderFilledTechSlot(ctx, x, y, tech) {
      // Use depth color for border
      var depthColor = DEPTH_COLORS[tech.depth] || DEPTH_COLORS[0];
      var borderColor = tech.coreColor || depthColor;

      ctx.fillStyle = borderColor;
      ctx.fillRect(x, y, SLOT_SIZE, SLOT_SIZE);

      ctx.fillStyle = TECH_FILLED_BG;
      ctx.fillRect(
        x + SLOT_BORDER,
        y + SLOT_BORDER,
        SLOT_SIZE - SLOT_BORDER * 2,
        SLOT_SIZE - SLOT_BORDER * 2
      );

      this._renderTechIcon(ctx, x, y, tech);
      this._renderLevel(ctx, x, y, tech.level || 1);

      // Render depth indicator (small colored dot in top-left)
      this._renderDepthIndicator(ctx, x, y, tech.depth);
    }

    _renderDepthIndicator(ctx, x, y, depth) {
      var depthColor = DEPTH_COLORS[depth] || DEPTH_COLORS[0];
      var dotX = x + 6;
      var dotY = y + 6;
      var dotRadius = 4;

      ctx.fillStyle = depthColor;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    _getWeaponType(weapon) {
      if (!weapon || !weapon.data) return 'projectile';

      var attackType = weapon.data.attackType || '';
      if (attackType === 'laser') return 'laser';
      if (attackType === 'melee_swing') return 'melee';
      if (attackType === 'area_damage') return 'area';
      if (attackType === 'particle') return 'particle';
      return 'projectile';
    }

    _renderWeaponIcon(ctx, x, y, weapon, weaponType) {
      var iconColor = WEAPON_COLORS[weaponType] || '#FFFFFF';
      var centerX = x + SLOT_SIZE / 2;
      var centerY = y + SLOT_SIZE / 2;
      var iconSize = 20;

      // Try to render image if available
      var assetLoader = window.VampireSurvivors.Core.assetLoader;
      var imageId = weapon && weapon.data ? weapon.data.imageId : null;
      if (imageId && assetLoader && assetLoader.hasImage(imageId)) {
        var img = assetLoader.getImage(imageId);
        var imgSize = 24;
        ctx.drawImage(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);
        return;
      }

      // Use weapon color if available
      if (weapon && weapon.data && weapon.data.color) {
        iconColor = weapon.data.color;
      }

      ctx.fillStyle = iconColor;
      ctx.strokeStyle = iconColor;
      ctx.lineWidth = 2;

      // Get specific icon from weapon data
      var icon = weapon && weapon.data ? weapon.data.icon : null;

      // Render based on specific icon, fallback to weapon type
      switch (icon) {
        case 'magic_orb':
          // Glowing orb with inner highlight
          ctx.beginPath();
          ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(centerX - 2, centerY - 2, iconSize / 4, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'rifle':
          // Gun barrel
          ctx.fillRect(centerX - iconSize / 2, centerY - 2, iconSize * 0.8, 4);
          ctx.fillRect(centerX - iconSize / 3, centerY - 6, 4, 10);
          break;

        case 'shotgun':
          // Double barrel
          ctx.fillRect(centerX - iconSize / 2, centerY - 3, iconSize * 0.7, 2);
          ctx.fillRect(centerX - iconSize / 2, centerY + 1, iconSize * 0.7, 2);
          ctx.fillRect(centerX - iconSize / 3, centerY - 6, 5, 12);
          break;

        case 'laser_beam':
          // Concentrated beam
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 2, centerY);
          ctx.lineTo(centerX + iconSize / 2, centerY);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(centerX + iconSize / 2, centerY, 4, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'auto_laser':
          // Auto-targeting beam with crosshair
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 2, centerY);
          ctx.lineTo(centerX + iconSize / 3, centerY);
          ctx.stroke();
          ctx.strokeStyle = iconColor;
          ctx.beginPath();
          ctx.arc(centerX + iconSize / 3, centerY, 4, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'sword':
          // Sword blade
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 2, centerY + iconSize / 3);
          ctx.lineTo(centerX + iconSize / 2, centerY - iconSize / 3);
          ctx.lineWidth = 3;
          ctx.stroke();
          // Guard
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 4, centerY + iconSize / 6);
          ctx.lineTo(centerX + iconSize / 6, centerY - iconSize / 4);
          ctx.lineWidth = 5;
          ctx.stroke();
          break;

        case 'dagger':
          // Quick dagger
          ctx.beginPath();
          ctx.moveTo(centerX - iconSize / 3, centerY + iconSize / 4);
          ctx.lineTo(centerX + iconSize / 3, centerY - iconSize / 4);
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillRect(centerX - iconSize / 6, centerY + iconSize / 8, 5, 3);
          break;

        case 'poison':
          // Toxic cloud bubbles
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(centerX - 5, centerY + 4, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(centerX + 5, centerY + 3, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          break;

        case 'fire':
          // Flame shape
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - iconSize / 2);
          ctx.quadraticCurveTo(centerX + iconSize / 3, centerY - iconSize / 4, centerX + iconSize / 4, centerY + iconSize / 3);
          ctx.lineTo(centerX, centerY + iconSize / 6);
          ctx.lineTo(centerX - iconSize / 4, centerY + iconSize / 3);
          ctx.quadraticCurveTo(centerX - iconSize / 3, centerY - iconSize / 4, centerX, centerY - iconSize / 2);
          ctx.fill();
          break;

        case 'spinning_blade':
          // Circular blade
          ctx.strokeStyle = iconColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
          ctx.stroke();
          // Inner spokes
          for (var i = 0; i < 4; i++) {
            var angle = (Math.PI / 2) * i;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * iconSize / 2, centerY + Math.sin(angle) * iconSize / 2);
            ctx.stroke();
          }
          break;

        case 'lightning':
          // Lightning bolt
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - iconSize / 2);
          ctx.lineTo(centerX - iconSize / 4, centerY);
          ctx.lineTo(centerX + iconSize / 6, centerY);
          ctx.lineTo(centerX - iconSize / 6, centerY + iconSize / 2);
          ctx.lineWidth = 2;
          ctx.stroke();
          break;

        default:
          // Fallback to type-based icons
          switch (weaponType) {
            case 'projectile':
              ctx.beginPath();
              ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
              ctx.fill();
              break;

            case 'laser':
              ctx.beginPath();
              ctx.moveTo(centerX - iconSize / 2, centerY);
              ctx.lineTo(centerX + iconSize / 2, centerY);
              ctx.lineWidth = 4;
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(centerX + iconSize / 2, centerY, 3, 0, Math.PI * 2);
              ctx.fill();
              break;

            case 'melee':
              ctx.beginPath();
              ctx.moveTo(centerX - iconSize / 2, centerY + iconSize / 3);
              ctx.lineTo(centerX + iconSize / 2, centerY - iconSize / 3);
              ctx.lineWidth = 3;
              ctx.stroke();
              break;

            case 'area':
              ctx.globalAlpha = 0.7;
              ctx.beginPath();
              ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1.0;
              break;

            case 'particle':
              this._drawStar(ctx, centerX, centerY, 5, iconSize / 2, iconSize / 4);
              ctx.fill();
              break;
          }
      }
    }

    _renderTechIcon(ctx, x, y, tech) {
      var centerX = x + SLOT_SIZE / 2;
      var centerY = y + SLOT_SIZE / 2;
      var depthColor = DEPTH_COLORS[tech.depth] || '#FFFFFF';

      // Try to render image if available
      var assetLoader = window.VampireSurvivors.Core.assetLoader;
      var imageId = tech.imageId;
      if (imageId && assetLoader && assetLoader.hasImage(imageId)) {
        var img = assetLoader.getImage(imageId);
        var imgSize = 24;
        ctx.drawImage(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);
        return;
      }

      // Fallback: Get core icon character
      var coreIcon = tech.coreIcon || 'star';
      var iconChar = TECH_ICONS[coreIcon] || '✦';

      // Draw icon with depth color
      ctx.font = '16px Arial';
      ctx.fillStyle = depthColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(iconChar, centerX, centerY);
    }

    _drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
      var rot = (Math.PI / 2) * 3;
      var step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);

      for (var i = 0; i < spikes; i++) {
        var x = cx + Math.cos(rot) * outerRadius;
        var y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }

      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    }

    _renderLevel(ctx, x, y, level) {
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var lvlX = x + SLOT_SIZE - 8;
      var lvlY = y + SLOT_SIZE - 8;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(lvlX, lvlY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(level.toString(), lvlX, lvlY);
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.WeaponSlots = WeaponSlots;
})(window.VampireSurvivors.UI);
