/**
 * @fileoverview Weapon Catalog PDF Generator
 * Generates a PDF catalog of all weapons with Korean translations
 *
 * Usage: node tools/generate-weapon-catalog.js
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  pageWidth: 595.28,  // A4 width in points
  pageHeight: 841.89, // A4 height in points
  margin: 35,
  imageSize: 40,
  columnGap: 15,      // Gap between columns
  fontPath: path.join(__dirname, 'fonts', 'NotoSansKR-Regular.ttf'),
  outputPath: path.join(__dirname, '..', 'docs', 'weapon-catalog.pdf'),
  basePath: path.join(__dirname, '..'),
};

// All black text for maximum visibility
const COLORS = {
  weaponName: '#000000',
  koreanName: '#000000',
  description: '#000000',
  stats: '#000000',
  features: '#000000',
  sectionHeader: '#000000',
  subHeader: '#000000',
  coreTitle: '#000000',
  coreDesc: '#000000',
  separator: '#dddddd',
  titlePage: '#000000',
  titlePageSub: '#000000',
};

// Korean translation maps
const RARITY_KO = {
  common: '일반',
  uncommon: '고급',
  rare: '희귀',
  epic: '에픽',
  legendary: '전설',
};

const ATTACK_TYPE_KO = {
  projectile: '투사체',
  laser: '레이저',
  melee_swing: '근접 휘두르기',
  melee_thrust: '근접 찌르기',
  area_damage: '범위 피해',
  particle: '파티클',
  mine: '지뢰',
  summon: '소환',
};

const TARGETING_MODE_KO = {
  nearest: '가장 가까운 적',
  random: '무작위',
  weakest: '가장 약한 적',
  mouse: '마우스 위치',
  rotating: '회전',
  chain: '연쇄',
};

const STATUS_EFFECT_KO = {
  burn: '화상',
  freeze: '빙결',
  slow: '둔화',
  poison: '독',
  bleed: '출혈',
  stun: '기절',
  fear: '공포',
  blind: '실명',
};

const CORE_ORDER = [
  'fire_core', 'ice_core', 'lightning_core', 'shadow_core', 'blood_core',
  'arcane_core', 'nature_core', 'steel_core', 'wind_core', 'earth_core',
  'void_core', 'holy_core', 'tech_core', 'beast_core', 'time_core'
];

const ATTACK_TYPE_ORDER = [
  'projectile', 'laser', 'melee_swing', 'melee_thrust',
  'area_damage', 'particle', 'mine', 'summon'
];

// Load Korean translations
function loadTranslations() {
  const koPath = path.join(CONFIG.basePath, 'src', 'data', 'locales', 'ko.json');
  const content = fs.readFileSync(koPath, 'utf8');
  return JSON.parse(content);
}

// Extract weapon data from JS file
function extractWeaponFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Match the weapon registry assignment
  const match = content.match(/(?:Data\.WeaponRegistry|Data\.CoreWeaponRegistry|Data\.EvolvedWeaponRegistry)\.([\w_]+)\s*=\s*\{/);
  if (!match) return null;

  const weaponId = match[1];

  // Extract key properties using regex
  const weapon = { id: weaponId };

  // Basic properties
  const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
  if (nameMatch) weapon.name = nameMatch[1];

  const descMatch = content.match(/description:\s*['"]([^'"]+)['"]/);
  if (descMatch) weapon.description = descMatch[1];

  const coreIdMatch = content.match(/coreId:\s*['"]([^'"]+)['"]/);
  if (coreIdMatch) weapon.coreId = coreIdMatch[1];

  // Attack type
  const attackTypeMatch = content.match(/attackType:\s*AttackType\.(\w+)/);
  if (attackTypeMatch) weapon.attackType = attackTypeMatch[1].toLowerCase();

  // Targeting mode
  const targetingMatch = content.match(/targetingMode:\s*TargetingMode\.(\w+)/);
  if (targetingMatch) weapon.targetingMode = targetingMatch[1].toLowerCase();

  // Rarity (for basic weapons)
  const rarityMatch = content.match(/rarity:\s*Rarity\.(\w+)/);
  if (rarityMatch) weapon.rarity = rarityMatch[1].toLowerCase();

  // Tier
  const tierMatch = content.match(/tier:\s*(\d+)/);
  if (tierMatch) weapon.tier = parseInt(tierMatch[1]);

  // isAuto
  const isAutoMatch = content.match(/isAuto:\s*(true|false)/);
  if (isAutoMatch) weapon.isAuto = isAutoMatch[1] === 'true';

  // Damage
  const damageMatch = content.match(/damage:\s*(\d+)/);
  if (damageMatch) weapon.damage = parseInt(damageMatch[1]);

  // Cooldown
  const cooldownMatch = content.match(/cooldown:\s*([\d.]+)/);
  if (cooldownMatch) weapon.cooldown = parseFloat(cooldownMatch[1]);

  // Range
  const rangeMatch = content.match(/range:\s*(\d+)/);
  if (rangeMatch) weapon.range = parseInt(rangeMatch[1]);

  // Pierce
  const pierceMatch = content.match(/pierce:\s*(\d+)/);
  if (pierceMatch) weapon.pierce = parseInt(pierceMatch[1]);

  // Projectile count
  const projCountMatch = content.match(/projectileCount:\s*(\d+)/);
  if (projCountMatch) weapon.projectileCount = parseInt(projCountMatch[1]);

  // Status effects
  if (content.includes('statusEffect') || content.includes('StatusEffectType')) {
    weapon.statusEffects = [];
    const effectMatches = content.matchAll(/type:\s*StatusEffectType\.(\w+)/g);
    for (const m of effectMatches) {
      const effectType = m[1].toLowerCase();
      if (!weapon.statusEffects.includes(effectType)) {
        weapon.statusEffects.push(effectType);
      }
    }
  }

  // Lifesteal
  if (content.includes('lifesteal')) {
    const lifestealMatch = content.match(/lifesteal:\s*([\d.]+)/);
    if (lifestealMatch) weapon.lifesteal = parseFloat(lifestealMatch[1]);
  }

  // Icon
  const iconMatch = content.match(/icon:\s*['"]([^'"]+)['"]/);
  if (iconMatch) weapon.icon = iconMatch[1];

  return weapon;
}

// Scan weapon directories and extract all weapons
function loadAllWeapons() {
  const weapons = {
    basic: [],
    core: {},
  };

  // Initialize core buckets
  CORE_ORDER.forEach(coreId => {
    weapons.core[coreId] = [];
  });

  // Load basic weapons
  const basicRarities = ['common', 'uncommon', 'rare', 'epic'];
  basicRarities.forEach(rarity => {
    const dir = path.join(CONFIG.basePath, 'src', 'data', 'weapons', 'basic', rarity);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
      files.forEach(file => {
        const weapon = extractWeaponFromFile(path.join(dir, file));
        if (weapon) {
          weapon.rarity = rarity;
          weapons.basic.push(weapon);
        }
      });
    }
  });

  // Load core weapons
  const coreTiers = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  coreTiers.forEach(tier => {
    const dir = path.join(CONFIG.basePath, 'src', 'data', 'weapons', 'core', tier);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
      files.forEach(file => {
        const weapon = extractWeaponFromFile(path.join(dir, file));
        if (weapon && weapon.coreId) {
          weapon.rarity = tier;
          if (weapons.core[weapon.coreId]) {
            weapons.core[weapon.coreId].push(weapon);
          }
        }
      });
    }
  });

  // Sort core weapons by tier
  const tierOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
  Object.keys(weapons.core).forEach(coreId => {
    weapons.core[coreId].sort((a, b) => tierOrder[a.rarity] - tierOrder[b.rarity]);
  });

  return weapons;
}

// Get image path for weapon
function getWeaponImagePath(weapon) {
  const basePath = path.join(CONFIG.basePath, 'styles', 'imgs', 'weapons');

  // Try core path first
  if (weapon.coreId) {
    const corePath = path.join(basePath, 'core', `${weapon.id}.png`);
    if (fs.existsSync(corePath)) return corePath;
  }

  // Try basic path
  const basicPath = path.join(basePath, 'basic', `${weapon.id}.png`);
  if (fs.existsSync(basicPath)) return basicPath;

  // Try by attack type
  const attackDirs = ['projectiles', 'melee', 'lasers', 'areas', 'particles', 'mines', 'summons'];
  for (const dir of attackDirs) {
    const typePath = path.join(basePath, dir, `${weapon.id}.png`);
    if (fs.existsSync(typePath)) return typePath;
  }

  return null;
}

// Get weapon features as Korean list
function getWeaponFeatures(weapon, translations) {
  const features = [];

  // Auto/Manual
  features.push(weapon.isAuto ? '자동 발사' : '수동 발사');

  // Status effects
  if (weapon.statusEffects && weapon.statusEffects.length > 0) {
    weapon.statusEffects.forEach(effect => {
      const koEffect = STATUS_EFFECT_KO[effect] || effect;
      features.push(koEffect);
    });
  }

  // Lifesteal
  if (weapon.lifesteal) {
    features.push(`생명력 흡수 ${Math.round(weapon.lifesteal * 100)}%`);
  }

  // Pierce
  if (weapon.pierce && weapon.pierce > 0) {
    features.push(`관통 ${weapon.pierce}`);
  }

  // Multi-shot
  if (weapon.projectileCount && weapon.projectileCount > 1) {
    features.push(`다중 발사 x${weapon.projectileCount}`);
  }

  return features;
}

// Generate PDF
function generatePDF(weapons, translations) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: CONFIG.margin, bottom: CONFIG.margin, left: CONFIG.margin, right: CONFIG.margin },
    bufferPages: true,
  });

  // Register Korean font
  if (fs.existsSync(CONFIG.fontPath)) {
    doc.registerFont('Korean', CONFIG.fontPath);
  } else {
    console.warn('Korean font not found, using default font');
  }

  const output = fs.createWriteStream(CONFIG.outputPath);
  doc.pipe(output);

  const contentWidth = CONFIG.pageWidth - (CONFIG.margin * 2);
  const columnWidth = (contentWidth - CONFIG.columnGap) / 2;
  let y = CONFIG.margin;
  let currentColumn = 0; // 0 = left, 1 = right

  // Helper function to check page break
  function checkPageBreak(neededHeight) {
    if (y + neededHeight > CONFIG.pageHeight - CONFIG.margin) {
      doc.addPage();
      y = CONFIG.margin;
      currentColumn = 0;
      return true;
    }
    return false;
  }

  // Helper function to use Korean font safely
  function setFont(size, color = '#000000') {
    if (fs.existsSync(CONFIG.fontPath)) {
      doc.font('Korean').fontSize(size).fillColor(color);
    } else {
      doc.font('Helvetica').fontSize(size).fillColor(color);
    }
  }

  // Get column X position
  function getColumnX(col) {
    return CONFIG.margin + col * (columnWidth + CONFIG.columnGap);
  }

  // Title page
  setFont(32, COLORS.titlePage);
  doc.text('무기 카탈로그', CONFIG.margin, 300, { align: 'center', width: contentWidth });
  setFont(18, COLORS.titlePageSub);
  doc.text('Weapon Catalog', CONFIG.margin, 340, { align: 'center', width: contentWidth });
  setFont(14, COLORS.titlePageSub);
  doc.text('Vampire Survivors Pure JS', CONFIG.margin, 380, { align: 'center', width: contentWidth });
  doc.text(`총 ${weapons.basic.length + Object.values(weapons.core).flat().length}개 무기`, CONFIG.margin, 410, { align: 'center', width: contentWidth });
  doc.text(new Date().toLocaleDateString('ko-KR'), CONFIG.margin, 440, { align: 'center', width: contentWidth });

  doc.addPage();
  y = CONFIG.margin;

  // Track row heights for two-column layout
  let leftColumnY = y;
  let rightColumnY = y;

  // Draw a weapon entry in two-column layout
  function drawWeapon(weapon) {
    const entryHeight = 95;

    // Determine which column to use
    const useRightColumn = currentColumn === 1;
    const colX = getColumnX(currentColumn);
    const colY = useRightColumn ? rightColumnY : leftColumnY;

    // Check if we need a new page
    if (colY + entryHeight > CONFIG.pageHeight - CONFIG.margin) {
      if (currentColumn === 0) {
        // Try right column first
        currentColumn = 1;
        if (rightColumnY + entryHeight > CONFIG.pageHeight - CONFIG.margin) {
          // Both columns full, new page
          doc.addPage();
          y = CONFIG.margin;
          leftColumnY = y;
          rightColumnY = y;
          currentColumn = 0;
        }
        drawWeapon(weapon);
        return;
      } else {
        // Right column full, new page
        doc.addPage();
        y = CONFIG.margin;
        leftColumnY = y;
        rightColumnY = y;
        currentColumn = 0;
        drawWeapon(weapon);
        return;
      }
    }

    const startY = currentColumn === 0 ? leftColumnY : rightColumnY;

    // Try to embed image
    const imagePath = getWeaponImagePath(weapon);
    if (imagePath) {
      try {
        doc.image(imagePath, colX, startY, { width: CONFIG.imageSize, height: CONFIG.imageSize });
      } catch (e) {
        doc.rect(colX, startY, CONFIG.imageSize, CONFIG.imageSize).stroke('#cccccc');
      }
    } else {
      doc.rect(colX, startY, CONFIG.imageSize, CONFIG.imageSize).stroke('#cccccc');
    }

    const textX = colX + CONFIG.imageSize + 8;
    const textWidth = columnWidth - CONFIG.imageSize - 8;

    // Weapon name (English + Korean)
    const koName = translations.weapon[weapon.id] || weapon.name;
    setFont(11, COLORS.weaponName);
    doc.text(`${weapon.name}`, textX, startY, { width: textWidth });
    setFont(10, COLORS.koreanName);
    doc.text(`(${koName})`, textX, startY + 14, { width: textWidth });

    // Description in Korean
    const koDesc = translations.weaponDesc[weapon.id] || weapon.description || '';
    setFont(9, COLORS.description);
    doc.text(koDesc, textX, startY + 28, { width: textWidth, height: 22, ellipsis: true });

    // Stats line
    const rarity = RARITY_KO[weapon.rarity] || weapon.rarity || '일반';
    const attackType = ATTACK_TYPE_KO[weapon.attackType] || weapon.attackType || '알 수 없음';

    setFont(9, COLORS.stats);
    doc.text(`등급: ${rarity} | 공격: ${attackType}`, textX, startY + 52, { width: textWidth });

    // Stats numbers
    const damageStr = weapon.damage ? `피해: ${weapon.damage}` : '';
    const cdStr = weapon.cooldown ? `쿨: ${weapon.cooldown}초` : '';
    const numStats = [damageStr, cdStr].filter(s => s).join(' | ');
    if (numStats) {
      doc.text(numStats, textX, startY + 64, { width: textWidth });
    }

    // Features
    const features = getWeaponFeatures(weapon, translations);
    if (features.length > 0) {
      setFont(9, COLORS.features);
      const featStr = features.slice(0, 3).join(', ');
      doc.text(`특성: ${featStr}`, textX, startY + 76, { width: textWidth });
    }

    // Update column position
    if (currentColumn === 0) {
      leftColumnY = startY + entryHeight;
      currentColumn = 1;
    } else {
      rightColumnY = startY + entryHeight;
      currentColumn = 0;
      // Sync rows - move to the lower of the two
      const maxY = Math.max(leftColumnY, rightColumnY);
      leftColumnY = maxY;
      rightColumnY = maxY;
    }
  }

  // Reset columns for new section
  function resetColumns() {
    const maxY = Math.max(leftColumnY, rightColumnY);
    y = maxY;
    leftColumnY = y;
    rightColumnY = y;
    currentColumn = 0;
  }

  // Draw section header (centered)
  function drawSectionHeader(title, subtitle = '') {
    resetColumns();
    checkPageBreak(50);

    setFont(16, COLORS.sectionHeader);
    doc.text(title, CONFIG.margin, y, { align: 'center', width: contentWidth });

    if (subtitle) {
      setFont(10, COLORS.subHeader);
      doc.text(subtitle, CONFIG.margin, y + 22, { align: 'center', width: contentWidth });
    }

    y += subtitle ? 45 : 30;
    leftColumnY = y;
    rightColumnY = y;

    // Draw line under header
    doc.strokeColor(COLORS.sectionHeader).lineWidth(1);
    doc.moveTo(CONFIG.margin, y - 10).lineTo(CONFIG.pageWidth - CONFIG.margin, y - 10).stroke();
  }

  // Draw attack type subheader (centered)
  function drawSubHeader(title) {
    resetColumns();
    checkPageBreak(30);

    setFont(11, COLORS.subHeader);
    doc.text(`── ${title} ──`, CONFIG.margin, y, { align: 'center', width: contentWidth });
    y += 25;
    leftColumnY = y;
    rightColumnY = y;
  }

  // === CORE WEAPONS SECTION ===
  drawSectionHeader('코어 무기 (Core Weapons)', '15개 원소 코어별 진화 체인');

  CORE_ORDER.forEach(coreId => {
    const coreWeapons = weapons.core[coreId];
    if (!coreWeapons || coreWeapons.length === 0) return;

    // Core header (centered)
    const coreName = translations.coreName[coreId] || coreId;
    const coreDesc = translations.coreDesc[coreId] || '';

    resetColumns();
    checkPageBreak(70);
    setFont(14, COLORS.coreTitle);
    doc.text(`━━━ ${coreName} ━━━`, CONFIG.margin, y, { align: 'center', width: contentWidth });
    y += 20;
    leftColumnY = y;
    rightColumnY = y;

    if (coreDesc) {
      setFont(9, COLORS.coreDesc);
      doc.text(coreDesc, CONFIG.margin, y, { align: 'center', width: contentWidth });
      y += 20;
      leftColumnY = y;
      rightColumnY = y;
    }

    // Group by attack type
    const byType = {};
    coreWeapons.forEach(w => {
      const type = w.attackType || 'unknown';
      if (!byType[type]) byType[type] = [];
      byType[type].push(w);
    });

    // Draw weapons grouped by attack type
    ATTACK_TYPE_ORDER.forEach(attackType => {
      if (!byType[attackType] || byType[attackType].length === 0) return;

      const typeName = ATTACK_TYPE_KO[attackType] || attackType;
      drawSubHeader(typeName);

      byType[attackType].forEach(weapon => {
        drawWeapon(weapon);
      });
    });

    // Handle any remaining types
    Object.keys(byType).forEach(type => {
      if (ATTACK_TYPE_ORDER.includes(type)) return;
      if (byType[type].length === 0) return;

      const typeName = ATTACK_TYPE_KO[type] || type;
      drawSubHeader(typeName);

      byType[type].forEach(weapon => {
        drawWeapon(weapon);
      });
    });

    resetColumns();
    y += 10; // Space between cores
    leftColumnY = y;
    rightColumnY = y;
  });

  // === BASIC WEAPONS SECTION ===
  doc.addPage();
  y = CONFIG.margin;
  leftColumnY = y;
  rightColumnY = y;
  currentColumn = 0;

  drawSectionHeader('기본 무기 (Basic Weapons)', `총 ${weapons.basic.length}개 무기`);

  // Group basic weapons by attack type
  const basicByType = {};
  weapons.basic.forEach(w => {
    const type = w.attackType || 'unknown';
    if (!basicByType[type]) basicByType[type] = [];
    basicByType[type].push(w);
  });

  // Sort each group by rarity
  const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4 };
  Object.keys(basicByType).forEach(type => {
    basicByType[type].sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  });

  // Draw basic weapons by attack type
  ATTACK_TYPE_ORDER.forEach(attackType => {
    if (!basicByType[attackType] || basicByType[attackType].length === 0) return;

    const typeName = ATTACK_TYPE_KO[attackType] || attackType;
    drawSubHeader(`${typeName} (${basicByType[attackType].length})`);

    basicByType[attackType].forEach(weapon => {
      drawWeapon(weapon);
    });
  });

  // Handle any remaining types
  Object.keys(basicByType).forEach(type => {
    if (ATTACK_TYPE_ORDER.includes(type)) return;
    if (basicByType[type].length === 0) return;

    const typeName = ATTACK_TYPE_KO[type] || type;
    drawSubHeader(`${typeName} (${basicByType[type].length})`);

    basicByType[type].forEach(weapon => {
      drawWeapon(weapon);
    });
  });

  // Finalize
  doc.end();

  return new Promise((resolve, reject) => {
    output.on('finish', () => {
      const totalWeapons = weapons.basic.length + Object.values(weapons.core).flat().length;
      resolve(totalWeapons);
    });
    output.on('error', reject);
  });
}

// Main execution
async function main() {
  console.log('무기 카탈로그 PDF 생성기');
  console.log('========================');

  // Check font
  if (!fs.existsSync(CONFIG.fontPath)) {
    console.warn(`경고: 한글 폰트가 없습니다 (${CONFIG.fontPath})`);
    console.warn('한글이 제대로 표시되지 않을 수 있습니다.');
    console.log('');
  }

  console.log('1. 번역 파일 로드 중...');
  const translations = loadTranslations();
  console.log(`   - weapon: ${Object.keys(translations.weapon).length}개`);
  console.log(`   - weaponDesc: ${Object.keys(translations.weaponDesc).length}개`);

  console.log('2. 무기 데이터 로드 중...');
  const weapons = loadAllWeapons();
  console.log(`   - 기본 무기: ${weapons.basic.length}개`);
  const coreTotal = Object.values(weapons.core).flat().length;
  console.log(`   - 코어 무기: ${coreTotal}개`);

  console.log('3. PDF 생성 중...');
  const totalWeapons = await generatePDF(weapons, translations);

  console.log('');
  console.log('========================');
  console.log(`완료! 총 ${totalWeapons}개 무기가 카탈로그에 추가되었습니다.`);
  console.log(`출력 파일: ${CONFIG.outputPath}`);
}

main().catch(err => {
  console.error('오류 발생:', err);
  process.exit(1);
});
