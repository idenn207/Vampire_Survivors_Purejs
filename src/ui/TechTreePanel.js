/**
 * @fileoverview TechTreePanel - reusable panel showing full tech tree visualization
 * @module UI/TechTreePanel
 */
(function (UI) {
  'use strict';

  // ============================================
  // Imports
  // ============================================
  var TechCoreData = window.VampireSurvivors.Data.TechCoreData;

  // ============================================
  // Constants
  // ============================================
  var BG_COLOR = '#1A2332';
  var BORDER_COLOR = '#3D566E';
  var TITLE_COLOR = '#FFFFFF';
  var TEXT_COLOR = '#ECF0F1';
  var DESC_COLOR = '#BDC3C7';

  // Node dimensions
  var NODE_SIZE = 50;
  var NODE_GAP_X = 100; // Horizontal gap between depths
  var NODE_GAP_Y = 70; // Vertical gap between nodes at same depth
  var PADDING = 20;

  // Line colors
  var LINE_UNLOCKED_COLOR = '#2ECC71';
  var LINE_LOCKED_COLOR = '#4A6278';
  var LINE_WIDTH = 2;
  var LINE_DASH = [5, 5];

  // Node colors
  var NODE_BG_UNLOCKED = '#2C3E50';
  var NODE_BG_LOCKED = '#1A252F';
  var NODE_BORDER_UNLOCKED = '#2ECC71';
  var NODE_BORDER_LOCKED = '#4A6278';
  var NODE_HOVER_BORDER = '#F39C12';

  // Depth colors
  var DEPTH_COLORS = ['#FFFFFF', '#3498DB', '#9B59B6', '#F39C12'];

  // ============================================
  // Class Definition
  // ============================================
  class TechTreePanel {
    // ----------------------------------------
    // Instance Properties
    // ----------------------------------------
    _x = 0;
    _y = 0;
    _width = 500;
    _height = 400;
    _isVisible = false;
    _player = null;

    // Tech tree data
    _coreId = null;
    _coreData = null;
    _techTree = null; // TechTree component

    // Layout
    _nodeRects = []; // Array of { techId, rect, depth, isUnlocked, level, maxLevel }
    _connections = []; // Array of { fromTechId, toTechId, isUnlocked }

    // Hover
    _hoveredNode = null;

    // ----------------------------------------
    // Constructor
    // ----------------------------------------
    constructor() {
      this._nodeRects = [];
      this._connections = [];
    }

    // ----------------------------------------
    // Public Methods
    // ----------------------------------------
    /**
     * Set player reference for getting TechTree component
     * @param {Entity} player
     */
    setPlayer(player) {
      this._player = player;
      this._updateTechTree();
    }

    /**
     * Set panel position and dimensions
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    setBounds(x, y, width, height) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._buildLayout();
    }

    /**
     * Refresh tech tree data
     */
    refresh() {
      this._updateTechTree();
      this._buildLayout();
    }

    /**
     * Show the panel
     */
    show() {
      this._isVisible = true;
      this.refresh();
    }

    /**
     * Hide the panel
     */
    hide() {
      this._isVisible = false;
    }

    /**
     * Handle mouse move for hover and tooltip
     * @param {number} mouseX
     * @param {number} mouseY
     * @returns {Object|null} Tooltip content or null
     */
    handleMouseMove(mouseX, mouseY) {
      if (!this._isVisible) return null;

      this._hoveredNode = null;

      // Check node hover
      for (var i = 0; i < this._nodeRects.length; i++) {
        var node = this._nodeRects[i];
        if (this._isPointInRect(mouseX, mouseY, node.rect)) {
          this._hoveredNode = node;
          return this._getTechTooltip(node);
        }
      }

      return null;
    }

    /**
     * Render the panel
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
      if (!this._isVisible) return;

      // Background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(this._x, this._y, this._width, this._height);

      // Border
      ctx.strokeStyle = BORDER_COLOR;
      ctx.lineWidth = 2;
      ctx.strokeRect(this._x, this._y, this._width, this._height);

      // Title
      if (this._coreData) {
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = this._coreData.color || TITLE_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(this._coreData.name + ' Tech Tree', this._x + this._width / 2, this._y + 10);
      }

      // Render connections first (behind nodes)
      this._renderConnections(ctx);

      // Render nodes
      this._renderNodes(ctx);

      // Render depth labels
      this._renderDepthLabels(ctx);
    }

    // ----------------------------------------
    // Private Methods
    // ----------------------------------------
    _updateTechTree() {
      if (!this._player) return;

      var TechTree = window.VampireSurvivors.Components.TechTree;
      this._techTree = this._player.getComponent(TechTree);

      if (this._techTree) {
        this._coreId = this._techTree.getCoreId();
        this._coreData = this._techTree.getCoreData();
      }
    }

    _buildLayout() {
      this._nodeRects = [];
      this._connections = [];

      if (!this._coreId || !this._coreData) return;

      // Calculate layout dimensions
      var contentWidth = this._width - PADDING * 2;
      var contentHeight = this._height - PADDING * 2 - 30; // 30 for title
      var startX = this._x + PADDING;
      var startY = this._y + PADDING + 35;

      // Get all techs by depth
      var techsByDepth = [];
      for (var depth = 0; depth <= 3; depth++) {
        techsByDepth[depth] = TechCoreData.getTechsByDepth(this._coreId, depth);
      }

      // Calculate column positions (4 columns for depths 0-3)
      var colWidth = contentWidth / 4;

      // Build node positions
      for (var d = 0; d <= 3; d++) {
        var techs = techsByDepth[d];
        var colX = startX + d * colWidth + colWidth / 2;

        // Center nodes vertically in column
        var totalHeight = techs.length * NODE_SIZE + (techs.length - 1) * (NODE_GAP_Y - NODE_SIZE);
        var colStartY = startY + (contentHeight - totalHeight) / 2;

        for (var i = 0; i < techs.length; i++) {
          var tech = techs[i];
          var nodeY = colStartY + i * NODE_GAP_Y;

          var isUnlocked = this._techTree ? this._techTree.isTechUnlocked(tech.id) : false;
          var level = this._techTree ? this._techTree.getTechLevel(tech.id) : 0;

          this._nodeRects.push({
            techId: tech.id,
            techData: tech,
            rect: {
              x: colX - NODE_SIZE / 2,
              y: nodeY,
              width: NODE_SIZE,
              height: NODE_SIZE,
            },
            depth: d,
            isUnlocked: isUnlocked,
            level: level,
            maxLevel: tech.maxLevel,
          });
        }
      }

      // Build connections based on prerequisites
      for (var j = 0; j < this._nodeRects.length; j++) {
        var node = this._nodeRects[j];
        var techData = node.techData;

        if (node.depth === 0) continue; // Base has no prerequisites

        // Get prerequisites
        var prereqs = techData.requires || [];
        var requiresMultiple = techData.requiresMultiple || false;

        if (prereqs.length > 0) {
          // Connect from each prerequisite
          for (var k = 0; k < prereqs.length; k++) {
            var prereqId = prereqs[k];
            var prereqNode = this._findNodeByTechId(prereqId);
            if (prereqNode) {
              var prereqUnlocked = this._techTree ? this._techTree.isTechUnlocked(prereqId) : false;
              this._connections.push({
                fromTechId: prereqId,
                toTechId: node.techId,
                fromNode: prereqNode,
                toNode: node,
                isUnlocked: prereqUnlocked && node.isUnlocked,
                requiresMultiple: requiresMultiple,
              });
            }
          }
        } else {
          // No specific prereqs - connect from all nodes at previous depth
          for (var m = 0; m < this._nodeRects.length; m++) {
            var prevNode = this._nodeRects[m];
            if (prevNode.depth === node.depth - 1) {
              this._connections.push({
                fromTechId: prevNode.techId,
                toTechId: node.techId,
                fromNode: prevNode,
                toNode: node,
                isUnlocked: prevNode.isUnlocked && node.isUnlocked,
                requiresMultiple: false,
              });
            }
          }
        }
      }
    }

    _findNodeByTechId(techId) {
      for (var i = 0; i < this._nodeRects.length; i++) {
        if (this._nodeRects[i].techId === techId) {
          return this._nodeRects[i];
        }
      }
      return null;
    }

    _getTechTooltip(node) {
      var techData = node.techData;
      if (!techData) return null;

      return {
        type: 'tech',
        title: techData.name,
        depth: node.depth,
        level: node.level,
        maxLevel: node.maxLevel,
        effects: techData.effects || [],
        cost: this._techTree ? this._techTree.getUpgradeCost(node.techId) : null,
        canAfford: true, // Would need currency check
      };
    }

    _renderConnections(ctx) {
      // Group connections by target for requiresMultiple handling
      var connectionsByTarget = {};
      for (var i = 0; i < this._connections.length; i++) {
        var conn = this._connections[i];
        if (!connectionsByTarget[conn.toTechId]) {
          connectionsByTarget[conn.toTechId] = [];
        }
        connectionsByTarget[conn.toTechId].push(conn);
      }

      // Draw connections
      for (var targetId in connectionsByTarget) {
        var conns = connectionsByTarget[targetId];
        if (conns.length === 0) continue;

        var toNode = conns[0].toNode;
        var requiresMultiple = conns[0].requiresMultiple;
        var toRect = toNode.rect;
        var toX = toRect.x;
        var toY = toRect.y + toRect.height / 2;

        if (conns.length > 1 && requiresMultiple) {
          // Multiple prerequisites - lines meet at a center point
          var meetX = toX - NODE_GAP_X / 3;

          // Draw lines from each prerequisite to meet point
          for (var j = 0; j < conns.length; j++) {
            var conn = conns[j];
            var fromRect = conn.fromNode.rect;
            var fromX = fromRect.x + fromRect.width;
            var fromY = fromRect.y + fromRect.height / 2;

            this._setLineStyle(ctx, conn.isUnlocked);

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(meetX, fromY);
            ctx.lineTo(meetX, toY);
            ctx.stroke();
          }

          // Draw line from meet point to target
          this._setLineStyle(ctx, toNode.isUnlocked);
          ctx.beginPath();
          ctx.moveTo(meetX, toY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
        } else {
          // Single or OR prerequisites - direct lines
          for (var k = 0; k < conns.length; k++) {
            var c = conns[k];
            var fRect = c.fromNode.rect;
            var fX = fRect.x + fRect.width;
            var fY = fRect.y + fRect.height / 2;

            this._setLineStyle(ctx, c.isUnlocked);

            ctx.beginPath();
            ctx.moveTo(fX, fY);

            // Use bezier curve for smoother lines
            var midX = (fX + toX) / 2;
            ctx.bezierCurveTo(midX, fY, midX, toY, toX, toY);
            ctx.stroke();
          }
        }
      }

      ctx.setLineDash([]);
    }

    _setLineStyle(ctx, isUnlocked) {
      if (isUnlocked) {
        ctx.strokeStyle = this._coreData ? this._coreData.color : LINE_UNLOCKED_COLOR;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = LINE_LOCKED_COLOR;
        ctx.setLineDash(LINE_DASH);
      }
      ctx.lineWidth = LINE_WIDTH;
    }

    _renderNodes(ctx) {
      for (var i = 0; i < this._nodeRects.length; i++) {
        var node = this._nodeRects[i];
        var rect = node.rect;
        var isHovered = this._hoveredNode === node;

        // Node background
        ctx.fillStyle = node.isUnlocked ? NODE_BG_UNLOCKED : NODE_BG_LOCKED;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        // Node border
        if (isHovered) {
          ctx.strokeStyle = NODE_HOVER_BORDER;
          ctx.lineWidth = 3;
        } else if (node.isUnlocked) {
          ctx.strokeStyle = this._coreData ? this._coreData.color : NODE_BORDER_UNLOCKED;
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = NODE_BORDER_LOCKED;
          ctx.lineWidth = 1;
        }
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // Tech icon (colored circle based on depth)
        var centerX = rect.x + rect.width / 2;
        var centerY = rect.y + rect.height / 2;
        var iconColor = node.isUnlocked
          ? this._coreData ? this._coreData.color : DEPTH_COLORS[node.depth]
          : '#4A6278';

        ctx.fillStyle = iconColor;
        ctx.globalAlpha = node.isUnlocked ? 1.0 : 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 5, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Level text
        if (node.isUnlocked) {
          ctx.font = 'bold 10px Arial';
          ctx.fillStyle = TEXT_COLOR;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText('Lv.' + node.level, centerX, centerY + 10);
        } else {
          // Lock icon for locked nodes
          ctx.font = '12px Arial';
          ctx.fillStyle = DESC_COLOR;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🔒', centerX, centerY + 10);
        }

        // Depth badge
        ctx.font = 'bold 9px Arial';
        ctx.fillStyle = DEPTH_COLORS[node.depth];
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('D' + node.depth, rect.x + 3, rect.y + 3);
      }
    }

    _renderDepthLabels(ctx) {
      var contentWidth = this._width - PADDING * 2;
      var colWidth = contentWidth / 4;
      var labelY = this._y + this._height - 15;

      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      var labels = ['Base', 'Depth 1', 'Depth 2', 'Depth 3'];
      for (var i = 0; i < 4; i++) {
        var labelX = this._x + PADDING + i * colWidth + colWidth / 2;
        ctx.fillStyle = DEPTH_COLORS[i];
        ctx.fillText(labels[i], labelX, labelY);
      }
    }

    _isPointInRect(x, y, rect) {
      if (!rect) return false;
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }

    // ----------------------------------------
    // Getters
    // ----------------------------------------
    get isVisible() {
      return this._isVisible;
    }

    // ----------------------------------------
    // Lifecycle
    // ----------------------------------------
    dispose() {
      this._player = null;
      this._techTree = null;
      this._coreData = null;
      this._nodeRects = [];
      this._connections = [];
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  UI.TechTreePanel = TechTreePanel;
})(window.VampireSurvivors.UI);
