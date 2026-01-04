/**
 * @fileoverview PDF Export - Export class diagrams to PDF using html2canvas
 * Supports exporting individual tabs or all diagrams combined
 * Optimized for A4 paper printing with maximum diagram visibility
 */

// ============================================
// Constants
// ============================================
const TAB_ORDER = ['overview', 'core', 'components', 'entities', 'systems', 'behaviors', 'managers', 'ui'];
const TAB_TITLES = {
  overview: 'Overview',
  core: 'Core',
  components: 'Components',
  entities: 'Entities',
  systems: 'Systems',
  behaviors: 'Behaviors',
  managers: 'Managers & Pools',
  ui: 'UI',
};

// A4 dimensions in mm
const A4_WIDTH_LANDSCAPE = 297;
const A4_HEIGHT_LANDSCAPE = 210;
const MARGIN = 5;
const HEADER_HEIGHT = 10;

// Rendering quality
const CANVAS_SCALE = 2.5; // Higher = sharper text but larger file

// ============================================
// PDF Export Class
// ============================================
class PDFExport {
  constructor() {
    this._isExporting = false;
  }

  // ----------------------------------------
  // Public Methods
  // ----------------------------------------

  /**
   * Export current tab's diagram to PDF
   */
  async exportCurrentTab() {
    if (this._isExporting) return;

    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) {
      alert('No active tab found');
      return;
    }

    const tabId = activeTab.id.replace('tab-', '');
    const title = TAB_TITLES[tabId] || tabId;

    this._isExporting = true;
    this._showProgress(`Exporting ${title}...`);

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      await this._addTabToPDF(pdf, activeTab, title);

      pdf.save(`class-diagram-${tabId}.pdf`);
      this._hideProgress();
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Error exporting PDF: ' + err.message);
      this._hideProgress();
    } finally {
      this._isExporting = false;
    }
  }

  /**
   * Export all diagrams to a single PDF
   */
  async exportAllTabs() {
    if (this._isExporting) return;

    this._isExporting = true;
    this._showProgress('Preparing all diagrams...');

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Add title page
      this._addTitlePage(pdf);

      // Render and add each tab
      for (let i = 0; i < TAB_ORDER.length; i++) {
        const tabId = TAB_ORDER[i];
        const title = TAB_TITLES[tabId];

        this._showProgress(`Exporting ${title} (${i + 1}/${TAB_ORDER.length})...`);

        // Ensure tab is rendered
        if (window.renderTab) {
          await window.renderTab(tabId);
        }

        const tabContent = document.getElementById('tab-' + tabId);
        if (tabContent) {
          pdf.addPage('a4', 'landscape');
          await this._addTabToPDF(pdf, tabContent, title);
        }

        // Small delay to allow rendering
        await this._delay(300);
      }

      pdf.save('class-diagram-complete.pdf');
      this._hideProgress();
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Error exporting PDF: ' + err.message);
      this._hideProgress();
    } finally {
      this._isExporting = false;
    }
  }

  // ----------------------------------------
  // Private Methods
  // ----------------------------------------

  _addTitlePage(pdf) {
    const pageWidth = A4_WIDTH_LANDSCAPE;
    const pageHeight = A4_HEIGHT_LANDSCAPE;

    // Background
    pdf.setFillColor(26, 26, 46); // #1a1a2e
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Title
    pdf.setTextColor(0, 212, 255); // #00d4ff
    pdf.setFontSize(28);
    pdf.text('Vampire Survivors', pageWidth / 2, 60, { align: 'center' });

    pdf.setFontSize(22);
    pdf.text('Class Diagram', pageWidth / 2, 75, { align: 'center' });

    // Subtitle
    pdf.setTextColor(136, 136, 136); // #888
    pdf.setFontSize(11);
    pdf.text('System architecture and class dependencies', pageWidth / 2, 90, { align: 'center' });

    // Table of contents - left column
    pdf.setTextColor(238, 238, 238); // #eee
    pdf.setFontSize(12);
    pdf.text('Contents:', 30, 115);

    pdf.setFontSize(10);
    TAB_ORDER.forEach((tabId, index) => {
      const title = TAB_TITLES[tabId];
      const x = index < 4 ? 35 : 160;
      const y = 128 + (index % 4) * 10;
      pdf.text(`${index + 1}. ${title}`, x, y);
    });

    // Date
    pdf.setTextColor(136, 136, 136);
    pdf.setFontSize(9);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    pdf.text(`Generated: ${date}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  }

  async _addTabToPDF(pdf, tabContent, title) {
    const pageWidth = A4_WIDTH_LANDSCAPE;
    const pageHeight = A4_HEIGHT_LANDSCAPE;

    // Background
    pdf.setFillColor(26, 26, 46); // #1a1a2e
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header bar
    pdf.setFillColor(22, 33, 62); // #16213e
    pdf.rect(0, 0, pageWidth, HEADER_HEIGHT, 'F');

    pdf.setTextColor(0, 212, 255); // #00d4ff
    pdf.setFontSize(10);
    pdf.text(title, MARGIN, 7);

    // Find the diagram wrapper
    const diagramWrapper = tabContent.querySelector('.diagram-wrapper');
    if (!diagramWrapper) {
      pdf.setTextColor(255, 107, 107); // #ff6b6b
      pdf.setFontSize(12);
      pdf.text('Diagram not found', pageWidth / 2, pageHeight / 2, { align: 'center' });
      return;
    }

    try {
      // Temporarily show the tab if it's hidden (for rendering)
      const wasHidden = !tabContent.classList.contains('active');
      if (wasHidden) {
        tabContent.style.display = 'block';
        tabContent.style.position = 'absolute';
        tabContent.style.left = '-9999px';
        tabContent.style.visibility = 'hidden';
      }

      // Wait for Mermaid to finish rendering
      await this._delay(100);

      // Use html2canvas with high quality settings for readable text
      const canvas = await html2canvas(diagramWrapper, {
        backgroundColor: '#16213e',
        scale: CANVAS_SCALE, // Higher scale for sharper text
        logging: false,
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
      });

      // Restore hidden state
      if (wasHidden) {
        tabContent.style.display = '';
        tabContent.style.position = '';
        tabContent.style.left = '';
        tabContent.style.visibility = '';
      }

      // Calculate dimensions to maximize visibility on A4
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Available space on page (accounting for margins and header)
      const availableWidth = pageWidth - MARGIN * 2;
      const availableHeight = pageHeight - HEADER_HEIGHT - MARGIN;

      // Convert canvas pixels to mm (using the capture scale)
      const diagramWidthMm = canvasWidth / CANVAS_SCALE;
      const diagramHeightMm = canvasHeight / CANVAS_SCALE;

      // Calculate scale to fit diagram in available space
      const scaleX = availableWidth / diagramWidthMm;
      const scaleY = availableHeight / diagramHeightMm;
      // Use the smaller scale to fit, but allow upscale up to 1.5x for small diagrams
      const scale = Math.min(scaleX, scaleY, 1.5);

      const scaledWidth = diagramWidthMm * scale;
      const scaledHeight = diagramHeightMm * scale;

      // Center horizontally, align to top with small margin
      const x = (pageWidth - scaledWidth) / 2;
      const y = HEADER_HEIGHT + 2;

      // Use JPEG for smaller file size (0.92 quality for better text)
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
    } catch (err) {
      console.error('Error capturing diagram:', err);
      pdf.setTextColor(255, 107, 107);
      pdf.setFontSize(10);
      pdf.text('Error rendering diagram: ' + err.message, MARGIN, 25);
    }
  }

  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  _showProgress(message) {
    let overlay = document.getElementById('pdf-progress-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'pdf-progress-overlay';
      overlay.className = 'pdf-progress-overlay';
      overlay.innerHTML = `
        <div class="pdf-progress-content">
          <div class="pdf-progress-spinner"></div>
          <div class="pdf-progress-text"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    overlay.querySelector('.pdf-progress-text').textContent = message;
    overlay.classList.add('visible');
  }

  _hideProgress() {
    const overlay = document.getElementById('pdf-progress-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
    }
  }
}

// ============================================
// Export Singleton
// ============================================
export const pdfExport = new PDFExport();

// Global bindings for onclick handlers
window.exportCurrentTabPDF = () => pdfExport.exportCurrentTab();
window.exportAllTabsPDF = () => pdfExport.exportAllTabs();
