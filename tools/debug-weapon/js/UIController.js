/**
 * @fileoverview UIController - UI management and interaction layer
 */

import { DebugLogger } from './DebugLogger.js';

class UIController {
  constructor(harness, tracker) {
    this._harness = harness;
    this._tracker = tracker;
    this._selectedWeaponId = null;
    this._weaponTestResults = {};
    this._currentCategory = 'all';
  }

  initialize() {
    this._initializeWeaponList();
    this._initializeControls();
    this._initializeEventLog();
    this._initializeDebugLog();
  }

  _initializeWeaponList() {
    const self = this;
    const Data = window.VampireSurvivors.Data;

    // Collect all weapons by category
    const weapons = {
      basic: [],
      core: [],
      evolved: []
    };

    // Basic weapons
    for (const id in Data.WeaponData) {
      weapons.basic.push({ id: id, data: Data.WeaponData[id], category: 'basic' });
    }

    // Core weapons
    for (const coreId in Data.CoreWeaponData) {
      weapons.core.push({ id: coreId, data: Data.CoreWeaponData[coreId], category: 'core' });
    }

    // Evolved weapons
    for (const evolvedId in Data.EvolvedWeaponData) {
      weapons.evolved.push({ id: evolvedId, data: Data.EvolvedWeaponData[evolvedId], category: 'evolved' });
    }

    this._allWeapons = weapons;
    this._renderWeaponList();

    // Category tabs
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => { t.classList.remove('active'); });
        tab.classList.add('active');
        self._currentCategory = tab.dataset.category;
        self._renderWeaponList();
      });
    });

    // Search
    const searchInput = document.getElementById('weapon-search');
    searchInput.addEventListener('input', () => {
      self._renderWeaponList();
    });
  }

  _renderWeaponList() {
    const self = this;
    const listContainer = document.getElementById('weapon-list');
    const searchTerm = document.getElementById('weapon-search').value.toLowerCase();

    listContainer.innerHTML = '';

    const categories = this._currentCategory === 'all'
      ? ['basic', 'core', 'evolved']
      : [this._currentCategory];

    categories.forEach((category) => {
      const weapons = self._allWeapons[category] || [];

      // Filter by search
      const filtered = weapons.filter((w) => {
        return w.data.name.toLowerCase().includes(searchTerm) ||
               w.id.toLowerCase().includes(searchTerm);
      });

      if (filtered.length === 0) return;

      // Group by rarity
      const byRarity = { common: [], uncommon: [], rare: [], epic: [], legendary: [] };
      filtered.forEach((w) => {
        const rarity = w.data.rarity || 'common';
        if (byRarity[rarity]) {
          byRarity[rarity].push(w);
        }
      });

      // Render each rarity group
      ['legendary', 'epic', 'rare', 'uncommon', 'common'].forEach((rarity) => {
        const group = byRarity[rarity];
        if (group.length === 0) return;

        const groupDiv = document.createElement('div');
        groupDiv.className = 'rarity-group';

        const header = document.createElement('div');
        header.className = 'rarity-header ' + rarity;
        header.textContent = category.toUpperCase() + ' - ' + rarity.toUpperCase() + ' (' + group.length + ')';
        groupDiv.appendChild(header);

        group.forEach((w) => {
          const item = document.createElement('div');
          item.className = 'weapon-item rarity-' + rarity;
          if (w.id === self._selectedWeaponId) {
            item.classList.add('selected');
          }

          const nameSpan = document.createElement('span');
          nameSpan.textContent = w.data.name;
          item.appendChild(nameSpan);

          // Test status badge
          const statusSpan = document.createElement('span');
          statusSpan.className = 'test-status';
          const result = self._weaponTestResults[w.id];
          if (result === true) {
            statusSpan.className += ' pass';
            statusSpan.textContent = 'PASS';
          } else if (result === false) {
            statusSpan.className += ' fail';
            statusSpan.textContent = 'FAIL';
          } else {
            statusSpan.className += ' pending';
            statusSpan.textContent = '-';
          }
          item.appendChild(statusSpan);

          item.addEventListener('click', () => {
            self.selectWeapon(w.id);
          });

          groupDiv.appendChild(item);
        });

        listContainer.appendChild(groupDiv);
      });
    });
  }

  selectWeapon(weaponId) {
    this._selectedWeaponId = weaponId;

    // Update weapon in harness
    const weaponData = this._harness.selectWeapon(weaponId);
    if (!weaponData) return;

    // Reset tracker
    this._tracker.reset();
    this._tracker.setExpectedFromWeapon(weaponData);
    this._tracker.startTracking();

    // Initialize PropertyVerifier for stats verification
    this._tracker.initPropertyVerifier(weaponData);

    // Update UI
    this._updateCharacteristicsPanel(weaponData);
    this._renderWeaponList();

    // Clear event log
    document.getElementById('event-log').innerHTML = '';
  }

  _updateCharacteristicsPanel(weaponData) {
    // Update header
    document.getElementById('weapon-name').textContent = weaponData.name;
    document.getElementById('weapon-name').className = 'rarity-' + (weaponData.rarity || 'common');
    document.getElementById('weapon-meta').textContent =
      'Tier ' + weaponData.tier + ' | ' +
      (weaponData.attackType || 'unknown').toUpperCase() + ' | ' +
      (weaponData.targetingMode || 'nearest').toUpperCase();

    // Update test badge
    const badge = document.getElementById('test-result-badge');
    badge.className = 'testing';
    badge.textContent = 'TESTING';

    // Update properties table
    this._updatePropertiesTable(weaponData);

    // Update verification table
    this._updateVerificationTable();

    // Update stats verification table
    this._updateStatsVerificationTable();

    // Update effect progress chips
    this._updateEffectProgressChips();

    // Reset counters display
    this._updateCountersDisplay();

    // Initialize real-time overlay
    this._initRealtimeOverlay(weaponData);
  }

  _updateEffectProgressChips() {
    const progressContainer = document.getElementById('effect-progress');
    progressContainer.innerHTML = '';

    const results = this._tracker.getVerificationResults();

    const effectLabels = {
      'weapon:fired': 'Fired',
      'weapon:hit': 'Hit',
      'weapon:on_kill': 'On-Kill',
      'projectile:ricochet': 'Ricochet',
      'player:lifesteal': 'Lifesteal',
      'player:healed': 'Heal',
      'effect:explosion': 'Explosion',
      'entity:died': 'Kill',
      'knockback': 'Knockback',
      'cascade:active': 'Cascade',
      'projectile:split': 'Split'
    };

    for (const effect in results) {
      const result = results[effect];
      let label = effectLabels[effect] || effect;

      // Check for status effect labels
      if (effect.startsWith('buffdebuff:')) {
        const effectType = effect.replace('buffdebuff:', '');
        label = effectType.charAt(0).toUpperCase() + effectType.slice(1);
      }

      const chip = document.createElement('span');
      chip.className = 'effect-chip ' + (result.detected ? 'detected' : 'pending');
      chip.id = 'chip-' + effect.replace(/:/g, '-');
      chip.innerHTML = '<span class="chip-icon">' + (result.detected ? 'O' : '-') + '</span> ' + label;

      if (result.count > 1) {
        chip.innerHTML += ' <span style="opacity:0.7">x' + result.count + '</span>';
      }

      progressContainer.appendChild(chip);
    }
  }

  _updateCountersDisplay() {
    const counters = this._tracker.getCounters();

    document.getElementById('counter-fired').textContent = counters.fired;
    document.getElementById('counter-hit').textContent = counters.hit;
    document.getElementById('counter-kill').textContent = counters.kill;
    document.getElementById('counter-effect').textContent = counters.effect;
  }

  /**
   * Update the stats verification table with measured vs expected values
   */
  _updateStatsVerificationTable() {
    const tbody = document.querySelector('#stats-verify-table tbody');
    tbody.innerHTML = '';

    const verifier = this._tracker.getPropertyVerifier();
    if (!verifier) {
      // No verifier initialized, show empty state
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="4" style="text-align:center;color:#666;padding:20px;">Select a weapon to start verification</td>';
      tbody.appendChild(emptyRow);
      return;
    }

    const results = verifier.verify();
    const summary = verifier.getSummary();

    // Group results by category
    const categories = {};
    results.forEach((result) => {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    });

    // Category labels
    const categoryLabels = {
      basic: 'Basic Stats',
      projectile: 'Projectile',
      area: 'Area Effects',
      statusEffect: 'Status Effects',
      special: 'Special Behaviors'
    };

    // Render by category
    for (const category in categories) {
      // Category header row
      const headerRow = document.createElement('tr');
      headerRow.className = 'stats-category-header';
      headerRow.innerHTML = '<td colspan="4">' + (categoryLabels[category] || category) + '</td>';
      tbody.appendChild(headerRow);

      // Property rows
      categories[category].forEach((result) => {
        const row = document.createElement('tr');
        row.setAttribute('data-property', result.property);

        // Property name
        const nameCell = document.createElement('td');
        nameCell.innerHTML = result.name;
        if (result.description) {
          nameCell.innerHTML += '<span class="property-tooltip">' + result.description + '</span>';
        }
        row.appendChild(nameCell);

        // Expected value
        const expectedCell = document.createElement('td');
        let expectedValue = result.expected;
        if (typeof expectedValue === 'object') {
          expectedValue = JSON.stringify(expectedValue);
        } else if (typeof expectedValue === 'number' && expectedValue < 1 && expectedValue > 0) {
          expectedValue = (expectedValue * 100).toFixed(0) + '%';
        }
        expectedCell.textContent = expectedValue;
        row.appendChild(expectedCell);

        // Measured value
        const measuredCell = document.createElement('td');
        measuredCell.className = 'measured-value ' + result.status;
        measuredCell.textContent = result.measured !== null ? result.measured : '-';
        if (result.message && result.status !== 'pass') {
          measuredCell.title = result.message;
        }
        row.appendChild(measuredCell);

        // Status
        const statusCell = document.createElement('td');
        statusCell.className = 'status-cell';
        const statusIcon = document.createElement('span');
        statusIcon.className = 'status-icon ' + result.status;
        statusCell.appendChild(statusIcon);
        row.appendChild(statusCell);

        tbody.appendChild(row);
      });
    }

    // Update summary counts
    document.getElementById('stats-pass-count').textContent = summary.passed;
    document.getElementById('stats-fail-count').textContent = summary.failed;
    document.getElementById('stats-pending-count').textContent = summary.pending;
    document.getElementById('stats-insufficient-count').textContent = summary.insufficient;
  }

  _updatePropertiesTable(weaponData) {
    const tbody = document.querySelector('#props-table tbody');
    tbody.innerHTML = '';

    const props = [
      ['Damage', weaponData.damage],
      ['Cooldown', weaponData.cooldown ? weaponData.cooldown + 's' : '-'],
      ['Range', weaponData.range || '-'],
      ['Pierce', weaponData.pierce || 0],
      ['Knockback', weaponData.knockback || 0],
      ['Lifesteal', weaponData.lifesteal ? (weaponData.lifesteal * 100) + '%' : '-'],
      ['Auto Fire', weaponData.isAuto ? 'Yes' : 'No'],
    ];

    // Add ricochet if present
    if (weaponData.ricochet && weaponData.ricochet.enabled) {
      props.push(['Ricochet', weaponData.ricochet.bounces + ' bounces']);
    }

    // Add status effects
    if (weaponData.statusEffects) {
      const effects = weaponData.statusEffects.map((e) => {
        return e.type + ' (' + (e.chance * 100) + '%)';
      }).join(', ');
      props.push(['Status Effects', effects]);
    }

    if (weaponData.statusEffect) {
      props.push(['Status Effect', weaponData.statusEffect.type]);
    }

    // Add cascade
    if (weaponData.cascade && weaponData.cascade.enabled) {
      props.push(['Cascade', '+' + (weaponData.cascade.damageGrowth * 100) + '% per hit']);
    }

    // Add split
    if (weaponData.split && weaponData.split.enabled) {
      props.push(['Split', weaponData.split.fragmentCount + ' fragments']);
    }

    // Add on-kill
    if (weaponData.onKill) {
      const onKillEffects = [];
      if (weaponData.onKill.explosion) onKillEffects.push('Explosion');
      if (weaponData.onKill.smite) onKillEffects.push('Smite');
      if (onKillEffects.length > 0) {
        props.push(['On Kill', onKillEffects.join(', ')]);
      }
    }

    props.forEach((prop) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.textContent = prop[0];
      const td2 = document.createElement('td');
      td2.textContent = prop[1];
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    });
  }

  _updateVerificationTable() {
    const tbody = document.querySelector('#verify-table tbody');
    tbody.innerHTML = '';

    const results = this._tracker.getVerificationResults();

    const effectLabels = {
      'weapon:fired': 'Weapon Fired',
      'weapon:hit': 'Weapon Hit',
      'weapon:on_kill': 'On Kill Effect',
      'projectile:ricochet': 'Ricochet',
      'player:lifesteal': 'Lifesteal',
      'player:healed': 'Heal on Hit',
      'effect:explosion': 'Explosion',
      'entity:died': 'Enemy Killed',
      'knockback': 'Knockback',
      'cascade:active': 'Cascade Active',
      'projectile:split': 'Projectile Split'
    };

    for (const effect in results) {
      const result = results[effect];
      let label = effectLabels[effect] || effect;

      // Check for status effect labels
      if (effect.startsWith('buffdebuff:')) {
        const effectType = effect.replace('buffdebuff:', '');
        label = 'Status: ' + effectType.toUpperCase();
      }

      const tr = document.createElement('tr');

      const td1 = document.createElement('td');
      td1.textContent = label;

      const td2 = document.createElement('td');
      td2.textContent = result.expected ? 'Yes' : 'No';

      const td3 = document.createElement('td');
      td3.className = 'status-cell';
      if (result.detected) {
        td3.innerHTML = '<span class="status-pass">O</span>';
        if (result.count > 1) {
          td3.innerHTML += '<span class="trigger-count">x' + result.count + '</span>';
        }
      } else {
        td3.innerHTML = '<span class="status-pending">-</span>';
      }

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tbody.appendChild(tr);
    }

    // Update overall badge
    const badge = document.getElementById('test-result-badge');
    const allPassed = this._tracker.isAllPassed();

    if (Object.keys(results).length === 0) {
      badge.className = 'pending';
      badge.textContent = 'PENDING';
    } else if (allPassed) {
      badge.className = 'pass';
      badge.textContent = 'PASS';
      this._weaponTestResults[this._selectedWeaponId] = true;
      this._renderWeaponList();
    } else {
      badge.className = 'testing';
      badge.textContent = 'TESTING';
    }
  }

  _initializeControls() {
    const self = this;

    document.getElementById('btn-spawn').addEventListener('click', () => {
      self._harness.spawnTestDummies(5);
    });

    document.getElementById('btn-spawn-many').addEventListener('click', () => {
      self._harness.spawnTestDummies(20);
    });

    // Scenario spawn buttons
    document.getElementById('btn-spawn-cluster').addEventListener('click', () => {
      self._harness.spawnCluster(8, 80);
    });

    document.getElementById('btn-spawn-line').addEventListener('click', () => {
      self._harness.spawnLine(6);
    });

    document.getElementById('btn-spawn-weak').addEventListener('click', () => {
      self._harness.spawnWeak(10, 5);
    });

    // Priority 4: Advanced spawn scenarios
    document.getElementById('btn-spawn-boss').addEventListener('click', () => {
      self._harness.spawnBoss(5000);
    });

    document.getElementById('btn-spawn-moving').addEventListener('click', () => {
      self._harness.spawnMoving(8, 50);
    });

    document.getElementById('btn-spawn-mixed').addEventListener('click', () => {
      self._harness.spawnMixed(10);
    });

    document.getElementById('btn-wave-mode').addEventListener('click', () => {
      const waveStatus = self._harness.getWaveModeStatus();
      if (waveStatus && waveStatus.active) {
        self._harness.stopWaveMode();
        document.getElementById('btn-wave-mode').textContent = 'Wave Mode';
        document.getElementById('btn-wave-mode').classList.remove('active');
      } else {
        self._harness.startWaveMode({ waveSize: 10, maxWaves: 10, enemyHP: 20 });
        document.getElementById('btn-wave-mode').textContent = 'Stop Waves';
        document.getElementById('btn-wave-mode').classList.add('active');
      }
    });

    document.getElementById('btn-damage-report').addEventListener('click', () => {
      const statTracker = self._eventTracker.getStatTracker();
      if (statTracker) {
        self._harness.printDamageReport(statTracker);
      } else {
        console.log('No stats collected yet. Fire the weapon first!');
      }
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
      self._harness.clearDummies();
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
      self._harness.reset();
      self._tracker.reset();
      if (self._selectedWeaponId) {
        const weaponData = self._harness.getCurrentWeapon();
        if (weaponData) {
          self._tracker.setExpectedFromWeapon(weaponData);
          self._tracker.initPropertyVerifier(weaponData);
        }
      }
      self._updateVerificationTable();
      self._updateEffectProgressChips();
      self._updateCountersDisplay();
      self._updateStatsVerificationTable();
      document.getElementById('event-log').innerHTML = '';

      // Reset test badge
      const badge = document.getElementById('test-result-badge');
      badge.className = 'testing';
      badge.textContent = 'TESTING';
    });

    document.getElementById('btn-force-fire').addEventListener('click', () => {
      self._harness.forceFire();
    });

    document.getElementById('btn-batch').addEventListener('click', () => {
      self._runBatchTest();
    });

    document.getElementById('btn-close-batch').addEventListener('click', () => {
      document.getElementById('batch-modal').classList.remove('visible');
    });

    document.getElementById('btn-copy-results').addEventListener('click', () => {
      self._copyBatchResults();
    });

    document.getElementById('btn-copy-report').addEventListener('click', () => {
      self._copyFullReport();
    });
  }

  _initializeEventLog() {
    const self = this;
    const logContainer = document.getElementById('event-log');
    const eventLogCount = document.getElementById('event-log-count');
    let eventCount = 0;

    this._tracker.onEvent((eventName, data) => {
      const entry = document.createElement('div');
      entry.className = 'log-entry';

      if (eventName.includes('hit')) entry.className += ' hit';
      else if (eventName.includes('fired')) entry.className += ' fired';
      else if (eventName.includes('died') || eventName.includes('kill')) entry.className += ' kill';
      else entry.className += ' effect';

      const time = new Date().toLocaleTimeString();
      entry.textContent = '[' + time.split(' ')[0] + '] ' + eventName;

      logContainer.insertBefore(entry, logContainer.firstChild);

      // Keep only last 50 entries
      while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.lastChild);
      }

      // Update event log count
      eventCount++;
      eventLogCount.textContent = eventCount;

      // Get newly detected effects for highlighting
      const newlyDetected = self._tracker.getNewlyDetectedEffects();

      // Update verification table with highlighting
      self._updateVerificationTableWithHighlight(newlyDetected);

      // Update effect progress chips with animation
      self._updateEffectProgressChipsRealtime(newlyDetected);

      // Update counters in real-time
      self._updateCountersDisplay();

      // Update stats verification table in real-time
      self._updateStatsVerificationTable();

      // Update failed tests panel in real-time
      self._updateFailedTestsPanel();

      // Update real-time overlay
      self._updateRealtimeOverlay(newlyDetected);
    });
  }

  _updateVerificationTableWithHighlight(newlyDetected) {
    const tbody = document.querySelector('#verify-table tbody');

    const results = this._tracker.getVerificationResults();

    const effectLabels = {
      'weapon:fired': 'Weapon Fired',
      'weapon:hit': 'Weapon Hit',
      'weapon:on_kill': 'On Kill Effect',
      'projectile:ricochet': 'Ricochet',
      'player:lifesteal': 'Lifesteal',
      'player:healed': 'Heal on Hit',
      'effect:explosion': 'Explosion',
      'entity:died': 'Enemy Killed',
      'knockback': 'Knockback',
      'cascade:active': 'Cascade Active',
      'projectile:split': 'Projectile Split'
    };

    // Build a map of existing rows for update instead of full rebuild
    const existingRows = {};
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row) => {
      const effectName = row.dataset.effect;
      if (effectName) {
        existingRows[effectName] = row;
      }
    });

    for (const effect in results) {
      const result = results[effect];
      let label = effectLabels[effect] || effect;

      // Check for status effect labels
      if (effect.startsWith('buffdebuff:')) {
        const effectType = effect.replace('buffdebuff:', '');
        label = 'Status: ' + effectType.toUpperCase();
      }

      let tr = existingRows[effect];
      let isNewRow = false;

      if (!tr) {
        tr = document.createElement('tr');
        tr.dataset.effect = effect;
        isNewRow = true;
      }

      // Check if this effect was newly detected
      const wasJustDetected = newlyDetected.indexOf(effect) !== -1;

      // Remove old highlight class
      tr.classList.remove('just-detected');

      // Build row content
      tr.innerHTML = '';

      const td1 = document.createElement('td');
      td1.textContent = label;

      const td2 = document.createElement('td');
      td2.textContent = result.expected ? 'Yes' : 'No';

      const td3 = document.createElement('td');
      td3.className = 'status-cell';
      if (result.detected) {
        td3.innerHTML = '<span class="status-pass">O</span>';
        td3.classList.add('detected');
        if (result.count > 1) {
          td3.innerHTML += '<span class="trigger-count">x' + result.count + '</span>';
        }
      } else {
        td3.innerHTML = '<span class="status-pending">-</span>';
      }

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);

      if (isNewRow) {
        tbody.appendChild(tr);
      }

      // Add highlight animation for newly detected
      if (wasJustDetected) {
        // Force reflow to restart animation
        void tr.offsetWidth;
        tr.classList.add('just-detected');
      }
    }

    // Update overall badge
    const badge = document.getElementById('test-result-badge');
    const allPassed = this._tracker.isAllPassed();

    if (Object.keys(results).length === 0) {
      badge.className = 'pending';
      badge.textContent = 'PENDING';
    } else if (allPassed) {
      badge.className = 'pass';
      badge.textContent = 'PASS';
      this._weaponTestResults[this._selectedWeaponId] = true;
      this._renderWeaponList();
    } else {
      badge.className = 'testing';
      badge.textContent = 'TESTING';
    }
  }

  _updateEffectProgressChipsRealtime(newlyDetected) {
    const results = this._tracker.getVerificationResults();

    const effectLabels = {
      'weapon:fired': 'Fired',
      'weapon:hit': 'Hit',
      'weapon:on_kill': 'On-Kill',
      'projectile:ricochet': 'Ricochet',
      'player:lifesteal': 'Lifesteal',
      'player:healed': 'Heal',
      'effect:explosion': 'Explosion',
      'entity:died': 'Kill',
      'knockback': 'Knockback',
      'cascade:active': 'Cascade',
      'projectile:split': 'Split'
    };

    for (const effect in results) {
      const result = results[effect];
      const chipId = 'chip-' + effect.replace(/:/g, '-');
      const chip = document.getElementById(chipId);

      if (chip) {
        let label = effectLabels[effect] || effect;

        // Check for status effect labels
        if (effect.startsWith('buffdebuff:')) {
          const effectType = effect.replace('buffdebuff:', '');
          label = effectType.charAt(0).toUpperCase() + effectType.slice(1);
        }

        // Update chip state
        const wasJustDetected = newlyDetected.indexOf(effect) !== -1;

        if (result.detected) {
          chip.className = 'effect-chip detected';
          chip.innerHTML = '<span class="chip-icon">O</span> ' + label;

          if (result.count > 1) {
            chip.innerHTML += ' <span style="opacity:0.7">x' + result.count + '</span>';
          }

          // Add animation for newly detected
          if (wasJustDetected) {
            // Force reflow to restart animation
            chip.style.animation = 'none';
            void chip.offsetWidth;
            chip.style.animation = '';
          }
        }
      }
    }
  }

  // ========================================
  // Real-time Status Overlay Methods
  // ========================================

  /**
   * Initialize the real-time status overlay for a weapon
   */
  _initRealtimeOverlay(weaponData) {
    const nameEl = document.getElementById('realtime-weapon-name');
    const badgeEl = document.getElementById('realtime-status-badge');
    const checklistEl = document.getElementById('realtime-checklist');

    // Set weapon name
    nameEl.textContent = weaponData.name;

    // Set initial badge state
    badgeEl.className = 'testing';
    badgeEl.textContent = 'TESTING';

    // Build checklist from expected effects
    checklistEl.innerHTML = '';

    const results = this._tracker.getVerificationResults();
    const effectLabels = this._getEffectLabels();

    for (const effect in results) {
      const result = results[effect];
      if (!result.expected) continue; // Only show expected effects

      let label = effectLabels[effect] || effect;
      if (effect.startsWith('buffdebuff:')) {
        const effectType = effect.replace('buffdebuff:', '');
        label = effectType.charAt(0).toUpperCase() + effectType.slice(1);
      }

      const item = document.createElement('div');
      item.className = 'checklist-item pending';
      item.id = 'rt-check-' + effect.replace(/:/g, '-');
      item.innerHTML = '<span class="checklist-icon"></span>' +
                       '<span class="checklist-label">' + label + '</span>' +
                       '<span class="checklist-count" id="rt-count-' + effect.replace(/:/g, '-') + '">0</span>';
      checklistEl.appendChild(item);
    }

    // Reset stats
    document.getElementById('rt-fired').textContent = '0';
    document.getElementById('rt-hits').textContent = '0';
    document.getElementById('rt-kills').textContent = '0';
  }

  /**
   * Update the real-time overlay with current verification state
   */
  _updateRealtimeOverlay(newlyDetected) {
    const badgeEl = document.getElementById('realtime-status-badge');
    const results = this._tracker.getVerificationResults();
    const counters = this._tracker.getCounters();

    // Update checklist items
    for (const effect in results) {
      const result = results[effect];
      if (!result.expected) continue;

      const itemId = 'rt-check-' + effect.replace(/:/g, '-');
      const countId = 'rt-count-' + effect.replace(/:/g, '-');
      const item = document.getElementById(itemId);
      const countEl = document.getElementById(countId);

      if (item) {
        const wasJustDetected = newlyDetected && newlyDetected.indexOf(effect) !== -1;

        if (result.detected) {
          item.classList.remove('pending');
          item.classList.add('pass');

          if (wasJustDetected) {
            item.classList.add('just-passed');
            setTimeout(() => item.classList.remove('just-passed'), 400);
          }
        }

        if (countEl && result.count > 0) {
          countEl.textContent = result.count;
        }
      }
    }

    // Update stats
    document.getElementById('rt-fired').textContent = counters.fired;
    document.getElementById('rt-hits').textContent = counters.hit;
    document.getElementById('rt-kills').textContent = counters.kill;

    // Update overall badge
    const allPassed = this._tracker.isAllPassed();
    const hasAnyDetection = counters.fired > 0 || counters.hit > 0;

    if (allPassed && hasAnyDetection) {
      badgeEl.className = 'pass';
      badgeEl.textContent = 'PASS';
    } else if (hasAnyDetection) {
      badgeEl.className = 'testing';
      badgeEl.textContent = 'TESTING';
    } else {
      badgeEl.className = 'pending';
      badgeEl.textContent = 'PENDING';
    }
  }

  /**
   * Get effect label mappings
   */
  _getEffectLabels() {
    return {
      'weapon:fired': 'Fired',
      'weapon:hit': 'Hit',
      'weapon:on_kill': 'On-Kill',
      'projectile:ricochet': 'Ricochet',
      'player:lifesteal': 'Lifesteal',
      'player:healed': 'Heal',
      'effect:explosion': 'Explosion',
      'entity:died': 'Kill',
      'knockback': 'Knockback',
      'cascade:active': 'Cascade',
      'projectile:split': 'Split',
      'mine:deployed': 'Mine Deploy',
      'mine:triggered': 'Mine Trigger',
      'mine:chain_triggered': 'Chain React',
      'summon:spawned': 'Summon',
      'summon:attack': 'Summon Attack',
      'summon:expired': 'Summon End',
      'heat:changed': 'Heat',
      'heat:overcharge': 'Overcharge',
      'channel:started': 'Channel',
      'channel:growth': 'Growth',
      'channel:flare': 'Flare',
      'soul:collected': 'Soul',
      'soul:orbit_active': 'Orbit',
      'soulstorm:activated': 'Storm',
      'killstack:increased': 'Stack',
      'voidrift:created': 'Rift',
      'voidrift:damage': 'Rift DMG'
    };
  }

  _runBatchTest() {
    const self = this;
    const modal = document.getElementById('batch-modal');
    const progressDiv = document.getElementById('batch-progress');
    const resultsBody = document.querySelector('#batch-results-table tbody');

    modal.classList.add('visible');
    resultsBody.innerHTML = '';

    // Collect all weapons
    const allWeapons = [];
    ['basic', 'core', 'evolved'].forEach((category) => {
      self._allWeapons[category].forEach((w) => {
        allWeapons.push({ id: w.id, data: w.data, category: category });
      });
    });

    let current = 0;
    const results = [];

    function testNext() {
      if (current >= allWeapons.length) {
        progressDiv.textContent = 'Complete! Tested ' + allWeapons.length + ' weapons.';
        self._renderWeaponList();
        return;
      }

      const weapon = allWeapons[current];
      progressDiv.textContent = 'Testing ' + (current + 1) + '/' + allWeapons.length + ': ' + weapon.data.name;

      // Select weapon
      self._harness.selectWeapon(weapon.id);
      self._tracker.reset();
      self._tracker.setExpectedFromWeapon(weapon.data);
      self._tracker.startTracking();

      // Spawn enemies
      self._harness.spawnTestDummies(10);

      // Wait for test duration
      setTimeout(() => {
        const verification = self._tracker.getVerificationResults();
        const passed = self._tracker.isAllPassed();

        self._weaponTestResults[weapon.id] = passed;

        // Find failed effects
        const failedEffects = [];
        for (const effect in verification) {
          if (verification[effect].expected && !verification[effect].detected) {
            failedEffects.push(effect);
          }
        }

        results.push({
          weapon: weapon,
          passed: passed,
          failedEffects: failedEffects
        });

        // Add to table
        const tr = document.createElement('tr');
        tr.innerHTML = '<td class="rarity-' + (weapon.data.rarity || 'common') + '">' + weapon.data.name + '</td>' +
                       '<td>' + weapon.category + '</td>' +
                       '<td class="' + (passed ? 'status-pass' : 'status-fail') + '">' + (passed ? 'PASS' : 'FAIL') + '</td>' +
                       '<td>' + (failedEffects.length > 0 ? failedEffects.join(', ') : '-') + '</td>';
        resultsBody.appendChild(tr);

        // Clear and test next
        self._harness.clearDummies();
        current++;
        setTimeout(testNext, 100);
      }, 3000); // 3 seconds per weapon
    }

    testNext();
  }

  _copyBatchResults() {
    const results = [];
    const rows = document.querySelectorAll('#batch-results-table tbody tr');

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      results.push(cells[0].textContent + '\t' + cells[1].textContent + '\t' + cells[2].textContent + '\t' + cells[3].textContent);
    });

    const text = 'Weapon\tCategory\tResult\tFailed Effects\n' + results.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!');
    });
  }

  // ========================================
  // Debug Log Methods
  // ========================================
  _initializeDebugLog() {
    const debugLogger = DebugLogger.getInstance();
    const logContainer = document.getElementById('debug-log');
    const countElement = document.getElementById('debug-log-count');
    let logCount = 0;

    debugLogger.onEntry((entry) => {
      const div = document.createElement('div');
      div.className = 'debug-entry ' + entry.level;

      const time = entry.timestamp.toLocaleTimeString().split(' ')[0];
      div.textContent = '[' + time + '] ' + entry.message;

      logContainer.insertBefore(div, logContainer.firstChild);

      // Keep only last 100 entries in DOM
      while (logContainer.children.length > 100) {
        logContainer.removeChild(logContainer.lastChild);
      }

      // Update count
      logCount++;
      countElement.textContent = logCount;
    });
  }

  // ========================================
  // Failed Tests Methods
  // ========================================
  _getFailedTests() {
    const failedTests = [];
    const verifier = this._tracker.getPropertyVerifier();
    const stats = this._tracker.getStatTracker();

    if (!verifier || !stats) return failedTests;

    const verification = verifier.verify(stats);

    for (const category in verification) {
      const items = verification[category];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.status === 'fail') {
          failedTests.push({
            category: category,
            name: item.name,
            expected: item.expected,
            measured: item.measured,
            hint: this._getFailureHint(item.name, item.expected, item.measured)
          });
        }
      }
    }

    // Also check effect verification
    const effectResults = this._tracker.getVerificationResults();
    for (const effect in effectResults) {
      const result = effectResults[effect];
      if (result.expected && !result.detected) {
        failedTests.push({
          category: 'effects',
          name: effect,
          expected: 'Should trigger',
          measured: 'Not detected',
          hint: this._getEffectHint(effect)
        });
      }
    }

    return failedTests;
  }

  _getFailureHint(name, expected, measured) {
    const hints = {
      'Damage': 'Check if enemies are in range and weapon is hitting targets.',
      'Cooldown': 'Verify weapon is firing multiple times to measure interval.',
      'Projectile Count': 'Check if all projectiles are spawning correctly.',
      'Pierce': 'Need multiple enemies lined up to test pierce.',
      'Ricochet Bounces': 'Need clustered enemies for ricochet to trigger.',
      'Lifesteal': 'Ensure weapon has lifesteal property and is dealing damage.',
      'Chain Count': 'Chain attacks require multiple enemies in range.'
    };
    return hints[name] || 'Verify weapon configuration matches behavior.';
  }

  _getEffectHint(effect) {
    const hints = {
      'weapon:fired': 'Check if weapon is equipped and cooldown has passed.',
      'weapon:hit': 'Ensure enemies are spawned and in range.',
      'projectile:ricochet': 'Spawn clustered enemies for ricochet testing.',
      'player:lifesteal': 'Weapon needs lifesteal property and must deal damage.',
      'effect:explosion': 'On-kill explosions require killing an enemy first.',
      'cascade:active': 'Chain attacks need multiple enemies in range.',
      'entity:died': 'Use weak enemies or wait for kills.'
    };
    return hints[effect] || 'Trigger the required conditions for this effect.';
  }

  _updateFailedTestsPanel() {
    const panel = document.getElementById('failed-tests-panel');
    const countElement = document.getElementById('failed-tests-count');
    const failedTests = this._getFailedTests();

    countElement.textContent = failedTests.length;

    if (failedTests.length === 0) {
      panel.innerHTML = '<div style="padding: 12px; color: #4ade80; font-size: 12px;">All tests passing!</div>';
      return;
    }

    let html = '';
    for (let i = 0; i < failedTests.length; i++) {
      const test = failedTests[i];
      html += '<div class="failed-test">';
      html += '<div class="test-name">[' + test.category.toUpperCase() + '] ' + test.name + '</div>';
      html += '<div class="test-detail">';
      html += '<span class="test-expected">Expected: ' + test.expected + '</span>';
      html += ' | ';
      html += '<span class="test-actual">Actual: ' + test.measured + '</span>';
      html += '</div>';
      if (test.hint) {
        html += '<div class="test-hint">' + test.hint + '</div>';
      }
      html += '</div>';
    }

    panel.innerHTML = html;
  }

  // ========================================
  // Full Report Methods
  // ========================================
  _generateFullReport() {
    const lines = [];
    const weaponData = this._harness.getCurrentWeapon();

    // Header
    lines.push('='.repeat(60));
    lines.push('WEAPON TEST REPORT');
    lines.push('='.repeat(60));
    lines.push('Generated: ' + new Date().toLocaleString());
    lines.push('');

    // Weapon Info
    if (weaponData) {
      lines.push('--- WEAPON INFO ---');
      lines.push('ID: ' + (weaponData.id || this._selectedWeaponId));
      lines.push('Name: ' + (weaponData.name || 'Unknown'));
      lines.push('Attack Type: ' + (weaponData.attackType || 'N/A'));
      lines.push('Targeting: ' + (weaponData.targetingMode || 'N/A'));
      lines.push('Tier: ' + (weaponData.tier || 1));
      lines.push('Damage: ' + (weaponData.damage || 0));
      lines.push('Cooldown: ' + (weaponData.cooldown || 0) + 's');
      if (weaponData.pierce) lines.push('Pierce: ' + weaponData.pierce);
      if (weaponData.projectileCount) lines.push('Projectile Count: ' + weaponData.projectileCount);
      lines.push('');
    }

    // Test Result
    const allPassed = this._tracker.isAllPassed();
    lines.push('--- TEST RESULT ---');
    lines.push('Status: ' + (allPassed ? 'PASS' : 'TESTING/FAIL'));
    lines.push('');

    // Counters
    const counters = this._tracker.getCounters();
    lines.push('--- COUNTERS ---');
    lines.push('Fired: ' + counters.fired);
    lines.push('Hits: ' + counters.hit);
    lines.push('Kills: ' + counters.kill);
    lines.push('Effects: ' + counters.effect);
    lines.push('');

    // Effect Verification
    lines.push('--- EFFECT VERIFICATION ---');
    const effectResults = this._tracker.getVerificationResults();
    for (const effect in effectResults) {
      const result = effectResults[effect];
      const status = result.detected ? 'DETECTED' : (result.expected ? 'MISSING' : 'N/A');
      lines.push(effect + ': ' + status + (result.count > 1 ? ' (x' + result.count + ')' : ''));
    }
    lines.push('');

    // Stats Verification
    const verifier = this._tracker.getPropertyVerifier();
    const stats = this._tracker.getStatTracker();
    if (verifier && stats) {
      lines.push('--- STATS VERIFICATION ---');
      const verification = verifier.verify(stats);
      for (const category in verification) {
        lines.push('[' + category.toUpperCase() + ']');
        const items = verification[category];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          lines.push('  ' + item.name + ': Expected=' + item.expected + ', Measured=' + item.measured + ' [' + item.status.toUpperCase() + ']');
        }
      }
      lines.push('');
    }

    // Failed Tests
    const failedTests = this._getFailedTests();
    if (failedTests.length > 0) {
      lines.push('--- FAILED TESTS (' + failedTests.length + ') ---');
      for (let j = 0; j < failedTests.length; j++) {
        const test = failedTests[j];
        lines.push('[' + test.category + '] ' + test.name);
        lines.push('  Expected: ' + test.expected);
        lines.push('  Actual: ' + test.measured);
        lines.push('  Hint: ' + test.hint);
      }
      lines.push('');
    }

    // Event Log
    lines.push('--- EVENT LOG ---');
    const eventLog = document.getElementById('event-log');
    const entries = eventLog.querySelectorAll('.log-entry');
    entries.forEach((entry) => {
      lines.push(entry.textContent);
    });
    lines.push('');

    // Debug Log
    lines.push('--- DEBUG LOG ---');
    const debugLogger = DebugLogger.getInstance();
    lines.push(debugLogger.getFormattedReport());
    lines.push('');

    lines.push('='.repeat(60));
    lines.push('END OF REPORT');
    lines.push('='.repeat(60));

    return lines.join('\n');
  }

  _copyFullReport() {
    const report = this._generateFullReport();
    navigator.clipboard.writeText(report).then(() => {
      alert('Full report copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy report:', err);
      // Fallback: show in textarea
      const textarea = document.createElement('textarea');
      textarea.value = report;
      textarea.style.position = 'fixed';
      textarea.style.top = '50%';
      textarea.style.left = '50%';
      textarea.style.transform = 'translate(-50%, -50%)';
      textarea.style.width = '80%';
      textarea.style.height = '60%';
      textarea.style.zIndex = '9999';
      document.body.appendChild(textarea);
      textarea.select();
      alert('Could not copy automatically. Press Ctrl+C to copy manually, then click anywhere to close.');
      textarea.addEventListener('blur', () => {
        document.body.removeChild(textarea);
      });
    });
  }
}

export { UIController };
export default UIController;
