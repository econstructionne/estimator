/* ============================================================
   EBBERS CONSTRUCTION — Post Frame Estimator
   app.js — All logic, calculations, prices, and rendering
   ============================================================ */

// ─── FRONTIER METAL SUPPLY COLORS (23 colors) ───
const FM_COLORS = [
  { name: 'Arctic White',     hex: '#e8e8e8' },
  { name: 'Polar White',      hex: '#f0efe8' },
  { name: 'Light Stone',      hex: '#c9bfa6' },
  { name: 'Tan',              hex: '#b8a88a' },
  { name: 'Taupe',            hex: '#8a7e6e' },
  { name: 'Ash Gray',         hex: '#9a9a94' },
  { name: 'Charcoal Gray',    hex: '#5a5c5e' },
  { name: 'Charcoal',         hex: '#3b3b3b' },
  { name: 'Black',            hex: '#1a1a1a' },
  { name: 'Burnished Slate',  hex: '#4a5248' },
  { name: 'Cocoa Brown',      hex: '#4a3428' },
  { name: 'Copper Metallic',  hex: '#8b5e3c' },
  { name: 'Burgundy',         hex: '#6b2230' },
  { name: 'Dark Red',         hex: '#7a2b2a' },
  { name: 'Rural Red',        hex: '#8b3029' },
  { name: 'Crimson',          hex: '#9c1c28' },
  { name: 'Ivy Green',        hex: '#3a5634' },
  { name: 'Evergreen',        hex: '#2a4030' },
  { name: 'Gallery Blue',     hex: '#3a5a7c' },
  { name: 'Ocean Blue',       hex: '#28506e' },
  { name: 'Sapphire Blue',    hex: '#264a6e' },
  { name: 'Galvalume',        hex: '#b0b0a8' },
  { name: 'Aged Copper',      hex: '#6a8a6e' },
];

// ─── DEFAULT PRICES (all editable by user) ───
const PRICES = {
  // Lumber per LF
  '2x4_lf':           0.65,
  '2x6_lf':           1.10,
  '2x8_lf':           1.55,
  '2x12_treated_lf':  3.20,
  'lvl_header_lf':    6.50,
  '6x6_timber_lf':    4.25,
  '8x8_timber_lf':    8.50,
  'fascia_2x6_lf':    1.10,

  // Steel panels per LF
  'pro_rib_lf':       2.15,
  'board_batten_lf':  3.75,
  'standing_seam_lf': 5.50,
  'speed_lap_lf':     2.00,
  'trim_lf':          1.50,
  'ridge_cap_lf':     2.25,

  // Concrete & footings
  'concrete_yard':    165.00,
  'rebar_4_20ft':     12.50,
  'wwm_roll':         120.00,
  'fiber_mesh_bag':   22.00,
  'vapor_barrier_roll': 65.00,
  'bracket_wetset':   18.00,
  'bracket_retrofit': 22.00,
  'sonotube_18':      28.00,
  'sonotube_16':      22.00,
  'sonotube_24':      38.00,

  // Doors & Windows (each)
  'oh_door_10x8':     850.00,
  'oh_door_10x10':    1050.00,
  'oh_door_12x10':    1250.00,
  'oh_door_12x12':    1450.00,
  'oh_door_14x12':    1750.00,
  'oh_door_16x14':    2400.00,
  'oh_opener':        350.00,
  'walk_door_3070':   450.00,
  'walk_door_6070':   750.00,
  'window_3x3':       185.00,
  'window_3x4':       220.00,
  'window_4x4':       260.00,

  // Insulation & Misc (per SQFT unless noted)
  'bubble_wrap_sqft':  0.45,
  'r19_batt_sqft':     0.85,
  'r30_batt_sqft':     1.20,
  'spray_closed_sqft': 2.10,
  'spray_open_sqft':   1.30,
  'house_wrap_sqft':   0.18,
  'liner_panel_sqft':  1.25,
  'versetta_stone_sqft': 12.50,
  'ssd_screw_6in':     0.55,
  'x_brace_set':       45.00,
  'ridge_vent_lf':     3.50,
  'eave_vent_ea':      12.00,
  'gutter_6in_lf':     7.50,
  'downspout_ea':      85.00,
  'flashing_tape_roll': 28.00,
  'truss_lf_span':     5.50,
  'electrical_roughin': 3500.00,
  'porch_post_6x6_ea': 85.00,
  'porch_post_8x8_ea': 145.00,
};

// Readable names for price editor
const PRICE_LABELS = {
  '2x4_lf': '2×4 Lumber',
  '2x6_lf': '2×6 Lumber',
  '2x8_lf': '2×8 Lumber',
  '2x12_treated_lf': '2×12 Treated',
  'lvl_header_lf': 'LVL Header',
  '6x6_timber_lf': '6×6 Timber',
  '8x8_timber_lf': '8×8 Timber',
  'fascia_2x6_lf': '2×6 Fascia',
  'pro_rib_lf': 'Pro-Rib 29ga',
  'board_batten_lf': 'Board & Batten 26ga',
  'standing_seam_lf': 'Standing Seam',
  'speed_lap_lf': 'Speed Lap',
  'trim_lf': 'Trim / Flashing',
  'ridge_cap_lf': 'Ridge Cap',
  'concrete_yard': 'Concrete /yd³',
  'rebar_4_20ft': '#4 Rebar 20\'',
  'wwm_roll': 'Welded Wire Mesh Roll',
  'fiber_mesh_bag': 'Fiber Mesh Bag',
  'vapor_barrier_roll': 'Vapor Barrier Roll',
  'bracket_wetset': 'Wet-Set Bracket',
  'bracket_retrofit': 'Retrofit Bracket',
  'sonotube_18': 'Sonotube 18"',
  'sonotube_16': 'Sonotube 16"',
  'sonotube_24': 'Sonotube 24"',
  'oh_door_10x8': 'OH Door 10×8',
  'oh_door_10x10': 'OH Door 10×10',
  'oh_door_12x10': 'OH Door 12×10',
  'oh_door_12x12': 'OH Door 12×12',
  'oh_door_14x12': 'OH Door 14×12',
  'oh_door_16x14': 'OH Door 16×14',
  'oh_opener': 'Door Opener',
  'walk_door_3070': 'Walk Door 3070',
  'walk_door_6070': 'Walk Door 6070',
  'window_3x3': 'Window 3×3',
  'window_3x4': 'Window 3×4',
  'window_4x4': 'Window 4×4',
  'bubble_wrap_sqft': 'Bubble Wrap /sf',
  'r19_batt_sqft': 'R-19 Batt /sf',
  'r30_batt_sqft': 'R-30 Batt /sf',
  'spray_closed_sqft': 'Spray Closed /sf',
  'spray_open_sqft': 'Spray Open /sf',
  'house_wrap_sqft': 'House Wrap /sf',
  'liner_panel_sqft': 'Liner Panel /sf',
  'versetta_stone_sqft': 'Versetta Stone /sf',
  'ssd_screw_6in': '6" SSD Screw',
  'x_brace_set': 'X-Brace Set',
  'ridge_vent_lf': 'Ridge Vent /LF',
  'eave_vent_ea': 'Eave Vent ea',
  'gutter_6in_lf': 'Gutter 6" /LF',
  'downspout_ea': 'Downspout ea',
  'flashing_tape_roll': 'Flashing Tape Roll',
  'truss_lf_span': 'Truss /LF span',
  'electrical_roughin': 'Electrical Rough-In',
  'porch_post_6x6_ea': 'Porch Post 6×6',
  'porch_post_8x8_ea': 'Porch Post 8×8',
};

// Group keys for price editor panels
const PRICE_GROUPS = {
  lumber: ['2x4_lf','2x6_lf','2x8_lf','2x12_treated_lf','lvl_header_lf','6x6_timber_lf','8x8_timber_lf','fascia_2x6_lf'],
  steel:  ['pro_rib_lf','board_batten_lf','standing_seam_lf','speed_lap_lf','trim_lf','ridge_cap_lf'],
  concrete: ['concrete_yard','rebar_4_20ft','wwm_roll','fiber_mesh_bag','vapor_barrier_roll','bracket_wetset','bracket_retrofit','sonotube_18','sonotube_16','sonotube_24'],
  doors: ['oh_door_10x8','oh_door_10x10','oh_door_12x10','oh_door_12x12','oh_door_14x12','oh_door_16x14','oh_opener','walk_door_3070','walk_door_6070','window_3x3','window_3x4','window_4x4'],
  misc:  ['bubble_wrap_sqft','r19_batt_sqft','r30_batt_sqft','spray_closed_sqft','spray_open_sqft','house_wrap_sqft','liner_panel_sqft','versetta_stone_sqft','ssd_screw_6in','x_brace_set','ridge_vent_lf','eave_vent_ea','gutter_6in_lf','downspout_ea','flashing_tape_roll','truss_lf_span','electrical_roughin','porch_post_6x6_ea','porch_post_8x8_ea'],
};

// ─── SELECTED COLORS STATE ───
const selectedColors = {
  roof: 'Charcoal',
  sidewall: 'Light Stone',
  wainscot: 'Burnished Slate',
  trim: 'Charcoal',
  garageDoor: 'Arctic White',
  walkDoor: 'Arctic White',
};

// ─── DOORS / WINDOWS STATE ───
let ohDoors = [{ size: '10x10', opener: true, style: 'commercial-ribbed' }];
let walkDoors = [{ size: '3070', style: 'steel-flush' }];
let windows = [{ size: '3x4' }];

// ─── CURRENT PREVIEW VIEW ───
let previewView = 'front';

// ════════════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initColorGrids();
  initPreviewCards();
  initPriceEditor();
  initDoorWindowLists();
  initToggles();
  initPreviewTabs();
  renderBuildingPreview();
  setTodayDate();

  // Listen for changes to update preview
  document.querySelectorAll('select, input').forEach(el => {
    el.addEventListener('change', () => renderBuildingPreview());
  });
});

// ─── SET TODAY'S DATE ───
function setTodayDate() {
  const d = new Date();
  const formatted = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
  document.getElementById('estDate').value = formatted;
}

// ─── NAVIGATION ───
function initNavigation() {
  const btns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.panel');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuBtn = document.getElementById('mobileMenuBtn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.panel;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === 'panel-' + target) p.classList.add('active');
      });
      sidebar.classList.remove('open');
      overlay.classList.remove('open');

      // Auto-calculate when switching to estimate
      if (target === 'estimate') calculateEstimate();
      if (target === 'preview') renderBuildingPreview();
    });
  });

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
}

// ─── PREVIEW CARDS (roof style, panel profile) ───
function initPreviewCards() {
  setupPreviewGroup('roofStyleGrid', 'roofStyle');
  setupPreviewGroup('panelProfileGrid', 'panelProfile');
  renderProfileSVGs();
  renderRoofStyleSVGs();
}

function setupPreviewGroup(gridId, inputId) {
  const grid = document.getElementById(gridId);
  const input = document.getElementById(inputId);
  grid.querySelectorAll('.preview-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.preview-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      input.value = card.dataset.value;
      renderBuildingPreview();
    });
  });
}

// ─── SVG PROFILE PREVIEWS ───
function renderProfileSVGs() {
  // Pro-Rib
  document.getElementById('pvProRib').innerHTML = `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg"><rect fill="#f0f0ee" width="160" height="80"/>
    ${[0,1,2,3,4].map(i => `<path d="M${10+i*35},75 L${14+i*35},15 L${22+i*35},15 L${26+i*35},75" fill="none" stroke="#888" stroke-width="1.5"/>`).join('')}
    <line x1="0" y1="75" x2="160" y2="75" stroke="#888" stroke-width="1"/></svg>`;

  // Board & Batten
  document.getElementById('pvBoardBatten').innerHTML = `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg"><rect fill="#f0f0ee" width="160" height="80"/>
    ${[0,1,2,3].map(i => `<rect x="${20+i*35}" y="5" width="8" height="70" fill="#999" rx="1"/>`).join('')}
    ${[0,1,2,3,4].map(i => `<line x1="${i*35}" y1="5" x2="${i*35+35}" y2="5" stroke="#bbb" stroke-width=".5"/>`).join('')}</svg>`;

  // Standing Seam
  document.getElementById('pvStandingSeam').innerHTML = `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg"><rect fill="#f0f0ee" width="160" height="80"/>
    ${[0,1,2,3,4].map(i => `<rect x="${13+i*32}" y="5" width="4" height="70" fill="#777" rx="1"/>`).join('')}</svg>`;
}

function renderRoofStyleSVGs() {
  // Gable
  document.getElementById('pvRoofGable').innerHTML = `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,65 80,15 140,65" fill="none" stroke="#333" stroke-width="2"/>
    <rect x="20" y="65" width="120" height="8" fill="none" stroke="#333" stroke-width="1.5"/></svg>`;

  // Single Slope
  document.getElementById('pvRoofSingle').innerHTML = `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,65 20,25 140,45 140,65" fill="none" stroke="#333" stroke-width="2"/></svg>`;
}

// ─── COLOR GRIDS ───
function initColorGrids() {
  const grids = {
    colorGridRoof: { key: 'roof', label: 'labelRoofColor', default: 'Charcoal' },
    colorGridSidewall: { key: 'sidewall', label: 'labelSidewallColor', default: 'Light Stone' },
    colorGridWainscot: { key: 'wainscot', label: 'labelWainscotColor', default: 'Burnished Slate' },
    colorGridTrim: { key: 'trim', label: 'labelTrimColor', default: 'Charcoal' },
    colorGridGarageDoor: { key: 'garageDoor', label: 'labelGarageDoorColor', default: 'Arctic White' },
    colorGridWalkDoor: { key: 'walkDoor', label: 'labelWalkDoorColor', default: 'Arctic White' },
  };

  Object.entries(grids).forEach(([gridId, cfg]) => {
    const grid = document.getElementById(gridId);
    FM_COLORS.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch' + (color.name === cfg.default ? ' selected' : '');
      swatch.style.backgroundColor = color.hex;
      swatch.title = color.name;
      if (['Arctic White','Polar White'].includes(color.name)) {
        swatch.style.border = '1px solid #ddd';
      }
      swatch.addEventListener('click', () => {
        grid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        selectedColors[cfg.key] = color.name;
        document.getElementById(cfg.label).textContent = color.name;
        renderBuildingPreview();
      });
      grid.appendChild(swatch);
    });
  });
}

// ─── PRICE EDITOR ───
function initPriceEditor() {
  Object.entries(PRICE_GROUPS).forEach(([group, keys]) => {
    const container = document.getElementById('prices' + group.charAt(0).toUpperCase() + group.slice(1));
    if (!container) return;
    keys.forEach(key => {
      const item = document.createElement('div');
      item.className = 'price-item';
      item.innerHTML = `
        <span class="price-label">${PRICE_LABELS[key] || key}</span>
        <input type="number" step="0.01" min="0" value="${PRICES[key]}" data-price-key="${key}">
      `;
      item.querySelector('input').addEventListener('change', (e) => {
        PRICES[key] = parseFloat(e.target.value) || 0;
      });
      container.appendChild(item);
    });
  });
}

// ─── DOOR & WINDOW LISTS ───
function initDoorWindowLists() {
  renderOHDoors();
  renderWalkDoors();
  renderWindows();

  document.getElementById('addOHDoor').addEventListener('click', () => {
    ohDoors.push({ size: '10x10', opener: false, style: 'commercial-ribbed' });
    renderOHDoors();
  });

  document.getElementById('addWalkDoor').addEventListener('click', () => {
    walkDoors.push({ size: '3070', style: 'steel-flush' });
    renderWalkDoors();
  });

  document.getElementById('addWindow').addEventListener('click', () => {
    windows.push({ size: '3x4' });
    renderWindows();
  });
}

function renderOHDoors() {
  const list = document.getElementById('ohDoorList');
  list.innerHTML = '';
  ohDoors.forEach((door, i) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <select data-idx="${i}" data-field="size">
        ${['10x8','10x10','12x10','12x12','14x12','16x14'].map(s => 
          `<option value="${s}" ${door.size===s?'selected':''}>${s.replace('x','\'×')}\'</option>`
        ).join('')}
      </select>
      <select data-idx="${i}" data-field="style">
        <option value="commercial-ribbed" ${door.style==='commercial-ribbed'?'selected':''}>Commercial Ribbed</option>
        <option value="commercial-flush" ${door.style==='commercial-flush'?'selected':''}>Commercial Flush</option>
        <option value="raised-panel" ${door.style==='raised-panel'?'selected':''}>Raised Panel</option>
        <option value="raised-panel-windows" ${door.style==='raised-panel-windows'?'selected':''}>Raised Panel + Windows</option>
        <option value="full-view" ${door.style==='full-view'?'selected':''}>Full View Glass</option>
      </select>
      <label style="display:flex;align-items:center;gap:4px;font-size:.82rem;white-space:nowrap">
        <input type="checkbox" ${door.opener?'checked':''} data-idx="${i}" data-field="opener"> Opener
      </label>
      <button class="btn-remove" data-idx="${i}">✕</button>
    `;
    row.querySelectorAll('select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        ohDoors[e.target.dataset.idx][e.target.dataset.field] = e.target.value;
      });
    });
    row.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      ohDoors[e.target.dataset.idx].opener = e.target.checked;
    });
    row.querySelector('.btn-remove').addEventListener('click', (e) => {
      ohDoors.splice(e.target.dataset.idx, 1);
      renderOHDoors();
    });
    list.appendChild(row);
  });
}

function renderWalkDoors() {
  const list = document.getElementById('walkDoorList');
  list.innerHTML = '';
  walkDoors.forEach((door, i) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <select data-idx="${i}" data-field="size">
        <option value="3070" ${door.size==='3070'?'selected':''}>3070 (3'×7')</option>
        <option value="6070" ${door.size==='6070'?'selected':''}>6070 Double (6'×7')</option>
      </select>
      <select data-idx="${i}" data-field="style">
        <option value="steel-flush" ${door.style==='steel-flush'?'selected':''}>Steel Flush</option>
        <option value="steel-halfglass" ${door.style==='steel-halfglass'?'selected':''}>Steel Half-Glass</option>
        <option value="fiberglass" ${door.style==='fiberglass'?'selected':''}>Fiberglass</option>
      </select>
      <button class="btn-remove" data-idx="${i}">✕</button>
    `;
    row.querySelectorAll('select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        walkDoors[e.target.dataset.idx][e.target.dataset.field] = e.target.value;
      });
    });
    row.querySelector('.btn-remove').addEventListener('click', (e) => {
      walkDoors.splice(e.target.dataset.idx, 1);
      renderWalkDoors();
    });
    list.appendChild(row);
  });
}

function renderWindows() {
  const list = document.getElementById('windowList');
  list.innerHTML = '';
  windows.forEach((win, i) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <select data-idx="${i}" data-field="size">
        <option value="3x3" ${win.size==='3x3'?'selected':''}>3'×3'</option>
        <option value="3x4" ${win.size==='3x4'?'selected':''}>3'×4'</option>
        <option value="4x4" ${win.size==='4x4'?'selected':''}>4'×4'</option>
      </select>
      <button class="btn-remove" data-idx="${i}">✕</button>
    `;
    row.querySelector('select').addEventListener('change', (e) => {
      windows[e.target.dataset.idx].size = e.target.value;
    });
    row.querySelector('.btn-remove').addEventListener('click', (e) => {
      windows.splice(e.target.dataset.idx, 1);
      renderWindows();
    });
    list.appendChild(row);
  });
}

// ─── TOGGLES ───
function initToggles() {
  const porchToggle = document.getElementById('porchToggle');
  const porchOpts = document.getElementById('porchOptions');
  porchToggle.addEventListener('change', () => {
    porchOpts.style.display = porchToggle.checked ? 'block' : 'none';
  });

  const floorType = document.getElementById('floorType');
  const concreteOpts = document.getElementById('concreteOptions');
  floorType.addEventListener('change', () => {
    concreteOpts.style.display = floorType.value === 'concrete' ? 'block' : 'none';
  });
}

// ─── PREVIEW TABS ───
function initPreviewTabs() {
  document.querySelectorAll('.preview-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.preview-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      previewView = tab.dataset.view;
      renderBuildingPreview();
    });
  });
}

// ─── ESTIMATE BUTTON ───
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnCalcEstimate').addEventListener('click', calculateEstimate);
  document.getElementById('btnPrintEstimate').addEventListener('click', () => window.print());
});

// ════════════════════════════════════════════════
// HELPER: Get values
// ════════════════════════════════════════════════
function val(id) { return parseFloat(document.getElementById(id).value) || 0; }
function sel(id) { return document.getElementById(id).value; }
function chk(id) { return document.getElementById(id).checked; }
function fmt(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function getColorHex(name) {
  const c = FM_COLORS.find(c => c.name === name);
  return c ? c.hex : '#999';
}

// ════════════════════════════════════════════════
// BUILDING PREVIEW RENDERER
// ════════════════════════════════════════════════
function renderBuildingPreview() {
  const svg = document.getElementById('buildingSVG');
  if (!svg) return;

  const W = val('bldWidth');
  const L = val('bldLength');
  const eave = val('eaveHeight');
  const pitch = val('roofPitch');
  const roofStyle = sel('roofStyle');
  const wainHt = val('wainscotHt');

  const roofColor = getColorHex(selectedColors.roof);
  const wallColor = getColorHex(selectedColors.sidewall);
  const wainColor = getColorHex(selectedColors.wainscot);
  const trimColor = getColorHex(selectedColors.trim);

  const pad = 60;
  const canvasW = 800;
  const canvasH = 500;
  const drawW = canvasW - pad * 2;
  const drawH = canvasH - pad * 2;

  let s = '';

  // Background grid
  s += `<defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8e8e4" stroke-width="0.5"/></pattern></defs>`;
  s += `<rect width="${canvasW}" height="${canvasH}" fill="#fafaf8"/>`;
  s += `<rect width="${canvasW}" height="${canvasH}" fill="url(#grid)"/>`;

  // Ground line
  const groundY = canvasH - pad;
  s += `<line x1="${pad}" y1="${groundY}" x2="${canvasW-pad}" y2="${groundY}" stroke="#888" stroke-width="1.5" stroke-dasharray="6,3"/>`;

  if (previewView === 'front') {
    // Front elevation (endwall view)
    const scale = Math.min(drawW / (W * 1.2), drawH / ((eave + W * pitch / 24) * 1.1));
    const bldW = W * scale;
    const bldH = eave * scale;
    const roofRise = (roofStyle === 'gable') ? (W / 2) * (pitch / 12) * scale : W * (pitch / 12) * scale * 0.3;
    const x0 = (canvasW - bldW) / 2;
    const y0 = groundY - bldH;

    // Wall
    s += `<rect x="${x0}" y="${y0}" width="${bldW}" height="${bldH}" fill="${wallColor}" stroke="${trimColor}" stroke-width="2"/>`;

    // Wainscot
    if (wainHt > 0) {
      const wH = wainHt * scale;
      s += `<rect x="${x0}" y="${groundY - wH}" width="${bldW}" height="${wH}" fill="${wainColor}" stroke="${trimColor}" stroke-width="1.5"/>`;
    }

    // Roof
    if (roofStyle === 'gable') {
      const peakX = x0 + bldW / 2;
      const peakY = y0 - roofRise;
      const overhang = 10;
      s += `<polygon points="${x0 - overhang},${y0} ${peakX},${peakY} ${x0 + bldW + overhang},${y0}" fill="${roofColor}" stroke="${trimColor}" stroke-width="2"/>`;
    } else {
      const overhang = 10;
      s += `<polygon points="${x0 - overhang},${y0} ${x0 - overhang},${y0 - roofRise} ${x0 + bldW + overhang},${y0}" fill="${roofColor}" stroke="${trimColor}" stroke-width="2"/>`;
    }

    // OH Doors on front
    ohDoors.forEach((door, i) => {
      const dims = door.size.split('x').map(Number);
      const dW = dims[0] * scale;
      const dH = dims[1] * scale;
      const dx = x0 + (i + 1) * bldW / (ohDoors.length + 1) - dW / 2;
      const dy = groundY - dH;
      s += `<rect x="${dx}" y="${dy}" width="${dW}" height="${dH}" fill="#ddd" stroke="${trimColor}" stroke-width="1.5" rx="1"/>`;
      // Door lines
      for (let j = 1; j < 4; j++) {
        s += `<line x1="${dx}" y1="${dy + j * dH / 4}" x2="${dx + dW}" y2="${dy + j * dH / 4}" stroke="#bbb" stroke-width=".5"/>`;
      }
    });

    // Walk doors
    walkDoors.forEach((door, i) => {
      const dW = 3 * scale;
      const dH = 7 * scale;
      const dx = x0 + bldW - (i + 1) * 6 * scale;
      const dy = groundY - dH;
      s += `<rect x="${dx}" y="${dy}" width="${dW}" height="${dH}" fill="${getColorHex(selectedColors.walkDoor)}" stroke="${trimColor}" stroke-width="1.5" rx="1"/>`;
    });

    // Windows
    windows.forEach((win, i) => {
      const wDims = win.size.split('x').map(Number);
      const wW = wDims[0] * scale;
      const wH = wDims[1] * scale;
      const wx = x0 + 4 * scale + i * (wW + 2 * scale);
      const wy = y0 + bldH * 0.3;
      s += `<rect x="${wx}" y="${wy}" width="${wW}" height="${wH}" fill="#b8d4e8" stroke="${trimColor}" stroke-width="1.5" rx="1"/>`;
      s += `<line x1="${wx + wW/2}" y1="${wy}" x2="${wx + wW/2}" y2="${wy + wH}" stroke="${trimColor}" stroke-width="1"/>`;
      s += `<line x1="${wx}" y1="${wy + wH/2}" x2="${wx + wW}" y2="${wy + wH/2}" stroke="${trimColor}" stroke-width="1"/>`;
    });

    // Dimensions
    s += `<text x="${canvasW/2}" y="${groundY + 25}" text-anchor="middle" font-size="13" fill="#666" font-family="DM Sans, sans-serif">${W}' Wide</text>`;
    s += `<text x="${x0 - 15}" y="${y0 + bldH/2}" text-anchor="middle" font-size="12" fill="#666" font-family="DM Sans, sans-serif" transform="rotate(-90 ${x0 - 15} ${y0 + bldH/2})">${eave}' Eave</text>`;
    s += `<text x="${canvasW/2}" y="${30}" text-anchor="middle" font-size="15" fill="#333" font-weight="600" font-family="DM Sans, sans-serif">Front Elevation — ${pitch}:12 Pitch</text>`;

  } else if (previewView === 'side') {
    // Side elevation (sidewall view)
    const scale = Math.min(drawW / (L * 1.2), drawH / (eave * 1.3));
    const bldW = L * scale;
    const bldH = eave * scale;
    const x0 = (canvasW - bldW) / 2;
    const y0 = groundY - bldH;

    // Wall
    s += `<rect x="${x0}" y="${y0}" width="${bldW}" height="${bldH}" fill="${wallColor}" stroke="${trimColor}" stroke-width="2"/>`;

    // Wainscot
    if (wainHt > 0) {
      const wH = wainHt * scale;
      s += `<rect x="${x0}" y="${groundY - wH}" width="${bldW}" height="${wH}" fill="${wainColor}" stroke="${trimColor}" stroke-width="1.5"/>`;
    }

    // Roof (flat from side)
    const overhang = 10;
    const roofThick = 5;
    s += `<rect x="${x0 - overhang}" y="${y0 - roofThick}" width="${bldW + overhang * 2}" height="${roofThick}" fill="${roofColor}" stroke="${trimColor}" stroke-width="1.5"/>`;

    // Post lines
    const postSp = val('postSpSide');
    const numBays = Math.round(L / postSp);
    for (let i = 0; i <= numBays; i++) {
      const px = x0 + i * (bldW / numBays);
      s += `<line x1="${px}" y1="${y0}" x2="${px}" y2="${groundY}" stroke="#a08060" stroke-width="3"/>`;
    }

    // Girts
    for (let g = 1; g <= Math.floor(eave / 2); g++) {
      const gy = groundY - g * 2 * scale;
      s += `<line x1="${x0}" y1="${gy}" x2="${x0 + bldW}" y2="${gy}" stroke="#c0a878" stroke-width="1" opacity=".4"/>`;
    }

    // Dimensions
    s += `<text x="${canvasW/2}" y="${groundY + 25}" text-anchor="middle" font-size="13" fill="#666" font-family="DM Sans, sans-serif">${L}' Long — ${postSp}' Post Spacing</text>`;
    s += `<text x="${canvasW/2}" y="${30}" text-anchor="middle" font-size="15" fill="#333" font-weight="600" font-family="DM Sans, sans-serif">Side Elevation</text>`;

  } else if (previewView === 'plan') {
    // Overhead plan view
    const scale = Math.min(drawW / (W * 1.2), drawH / (L * 1.2));
    const bldW = W * scale;
    const bldH = L * scale;
    const x0 = (canvasW - bldW) / 2;
    const y0 = (canvasH - bldH) / 2;

    // Floor
    s += `<rect x="${x0}" y="${y0}" width="${bldW}" height="${bldH}" fill="${sel('floorType') === 'concrete' ? '#d8d8d0' : '#e8dcc8'}" stroke="${trimColor}" stroke-width="2"/>`;

    // Post dots
    const postSp = val('postSpSide');
    const numBaysSide = Math.round(L / postSp);
    const numBaysEnd = 2; // endwall typically 2 bays
    for (let i = 0; i <= numBaysSide; i++) {
      const py = y0 + i * (bldH / numBaysSide);
      // left and right posts
      s += `<rect x="${x0 - 4}" y="${py - 4}" width="8" height="8" fill="#8b6b3d" stroke="#5a4020" stroke-width="1" rx="1"/>`;
      s += `<rect x="${x0 + bldW - 4}" y="${py - 4}" width="8" height="8" fill="#8b6b3d" stroke="#5a4020" stroke-width="1" rx="1"/>`;
    }

    // Ridge line
    if (sel('roofStyle') === 'gable') {
      s += `<line x1="${x0 + bldW/2}" y1="${y0}" x2="${x0 + bldW/2}" y2="${y0 + bldH}" stroke="${roofColor}" stroke-width="2" stroke-dasharray="8,4"/>`;
    }

    // Truss lines
    const trussSp = val('trussSp');
    const numTrusses = Math.round(L / trussSp);
    for (let i = 0; i <= numTrusses; i++) {
      const ty = y0 + i * (bldH / numTrusses);
      s += `<line x1="${x0}" y1="${ty}" x2="${x0 + bldW}" y2="${ty}" stroke="#ccc" stroke-width=".8"/>`;
    }

    // Dims
    s += `<text x="${canvasW/2}" y="${y0 - 15}" text-anchor="middle" font-size="13" fill="#666" font-family="DM Sans, sans-serif">${W}' × ${L}'</text>`;
    s += `<text x="${canvasW/2}" y="${30}" text-anchor="middle" font-size="15" fill="#333" font-weight="600" font-family="DM Sans, sans-serif">Overhead Plan View</text>`;

    // North arrow
    s += `<text x="${canvasW - pad + 10}" y="${y0 + 20}" font-size="12" fill="#999" font-family="DM Sans, sans-serif">N ↑</text>`;
  }

  svg.innerHTML = s;
}

// ════════════════════════════════════════════════
// ESTIMATE CALCULATOR
// ════════════════════════════════════════════════
function calculateEstimate() {
  const W = val('bldWidth');
  const L = val('bldLength');
  const eave = val('eaveHeight');
  const pitch = val('roofPitch');
  const roofStyle = sel('roofStyle');
  const postSp = val('postSpSide');
  const trussSp = val('trussSp');
  const wainHt = val('wainscotHt');
  const wainMat = sel('wainscotMat');
  const panelProfile = sel('panelProfile');
  const wastePct = val('wastePct') / 100;
  const laborPct = val('laborPct') / 100;
  const gcPct = val('gcPct') / 100;

  const perim = 2 * (W + L);
  const floorSF = W * L;
  const slopeLen = Math.sqrt(Math.pow(W / 2, 2) + Math.pow((W / 2) * (pitch / 12), 2));
  const roofSF = (roofStyle === 'gable') ? 2 * slopeLen * L : slopeLen * L;
  const wallSF = perim * eave;
  const roofRise = (W / 2) * (pitch / 12);

  // ── POSTS & FOOTINGS ──
  const numPostsSide = Math.floor(L / postSp) + 1;
  const numPostsEnd = 3; // endwall: corners + center
  const totalPosts = (numPostsSide * 2) + (numPostsEnd * 2) - 4; // subtract corner double-counts
  const postLenFt = eave + 1; // +1 for above eave
  const postSize = sel('postSize');
  let postPlies = 3;
  let postLumberSize = '2x6_lf';
  if (postSize === '3ply-2x8') { postPlies = 3; postLumberSize = '2x8_lf'; }
  if (postSize === '4ply-2x6') { postPlies = 4; }
  if (postSize === '6x6') { postPlies = 1; postLumberSize = '6x6_timber_lf'; }

  const postLF = totalPosts * postLenFt * (postSize === '6x6' ? 1 : postPlies);
  const footingDia = val('footingDia');
  const footingDepth = val('footingDepth');
  const footingVolEa = Math.PI * Math.pow(footingDia / 24, 2) * (footingDepth / 36); // cubic yards each
  const footingYards = totalPosts * footingVolEa;
  const bracketKey = sel('bracketType') === 'wet-set' ? 'bracket_wetset' : 'bracket_retrofit';
  const sonoKey = footingDia <= 16 ? 'sonotube_16' : (footingDia <= 18 ? 'sonotube_18' : 'sonotube_24');

  // ── TRUSSES ──
  const numTrusses = Math.floor(L / trussSp) + 1;
  const trussSpan = W; // span = building width

  // ── WALL GIRTS (2x6 @ 24" oc) ──
  const girtRows = Math.floor(eave * 12 / 24);
  const girtLF = girtRows * perim;

  // ── GRADE BOARD ──
  const gradeBoardLF = perim;

  // ── PURLINS (2x4 @ 24" oc) ──
  const numPurlinRows = Math.floor(slopeLen * 12 / 24);
  const purlinSides = (roofStyle === 'gable') ? 2 : 1;
  const purlinLF = numPurlinRows * L * purlinSides;

  // ── FASCIA ──
  const fasciaLF = (roofStyle === 'gable') ? (L * 2) : (L * 2 + W);

  // ── SSD SCREWS ──
  const purlinConnections = numPurlinRows * purlinSides * numTrusses;
  const ssdScrews = purlinConnections * 2; // 2 screws per connection

  // ── CENTER WAINSCOT BOARD ──
  const wainBoardLF = (wainHt > 0) ? perim : 0;

  // ── STEEL PANELS ──
  const panelKey = panelProfile === 'board-batten' ? 'board_batten_lf' : (panelProfile === 'standing-seam' ? 'standing_seam_lf' : 'pro_rib_lf');
  const wallPanelSF = wallSF - (wainHt * perim); // subtract wainscot area from wall panels
  const wallPanelLF = wallPanelSF / 3; // ~3ft coverage width per panel
  const roofPanelLF = roofSF / 3;

  // ── WAINSCOT STEEL ──
  let wainCost = 0;
  let wainLabel = '';
  const wainSF = wainHt * perim;
  if (wainMat === 'steel' || wainMat === 'board-batten') {
    const wainKey = wainMat === 'board-batten' ? 'board_batten_lf' : 'pro_rib_lf';
    const wainLF = wainSF / 3;
    wainCost = wainLF * PRICES[wainKey];
    wainLabel = wainMat === 'board-batten' ? 'B&B Wainscot Steel' : 'Pro-Rib Wainscot Steel';
  } else if (wainMat === 'versetta-stone') {
    wainCost = wainSF * PRICES['versetta_stone_sqft'];
    wainLabel = 'Versetta Stone Wainscot';
  }

  // ── TRIM ──
  const trimLF = perim * 3 + (W * 2) + (L * 2); // base, corners, eave, gable, ridge approximate
  const ridgeCapLF = L;

  // ── INSULATION ──
  const wallInsul = sel('wallInsul');
  const roofInsul = sel('roofInsul');
  function insulCost(type, sf) {
    const map = { bubble: 'bubble_wrap_sqft', r19: 'r19_batt_sqft', r30: 'r30_batt_sqft', 'spray-closed': 'spray_closed_sqft', 'spray-open': 'spray_open_sqft' };
    return map[type] ? sf * PRICES[map[type]] : 0;
  }
  function insulLabel(type) {
    const map = { bubble: 'Bubble Wrap', r19: 'R-19 Fiberglass Batt', r30: 'R-30 Fiberglass Batt', 'spray-closed': 'Spray Foam Closed', 'spray-open': 'Spray Foam Open' };
    return map[type] || 'None';
  }

  // ── HOUSE WRAP ──
  const houseWrapCost = chk('houseWrap') ? wallSF * PRICES['house_wrap_sqft'] : 0;

  // ── LINER PANELS ──
  const wallLinerCost = chk('wallLiner') ? wallSF * PRICES['liner_panel_sqft'] : 0;
  const ceilingLinerCost = chk('ceilingLiner') ? floorSF * PRICES['liner_panel_sqft'] : 0;

  // ── X BRACING ──
  const xBraceSets = chk('dblXBrace') ? Math.ceil(numPostsSide / 2) * 2 : 0;

  // ── VENTILATION ──
  const ridgeVentCost = chk('ridgeVent') ? L * PRICES['ridge_vent_lf'] : 0;
  const eaveVentCount = chk('eaveVent') ? Math.ceil(L / 8) * 2 : 0;

  // ── GUTTERS ──
  const gutterLF = chk('gutters') ? L * 2 : 0;
  let dsCount = 0;
  if (chk('gutters')) {
    dsCount = sel('downspouts') === 'auto' ? Math.ceil(L * 2 / 40) : parseInt(sel('downspouts'));
  }

  // ── LVL HEADERS ──
  let lvlLF = 0;
  ohDoors.forEach(d => {
    const dims = d.size.split('x').map(Number);
    lvlLF += dims[0] + 2; // span + 1ft each side bearing
  });

  // ── DOORS ──
  let doorsCost = 0;
  let doorLines = [];
  ohDoors.forEach(d => {
    const key = 'oh_door_' + d.size;
    const cost = PRICES[key] || 1000;
    const openerCost = d.opener ? PRICES['oh_opener'] : 0;
    doorsCost += cost + openerCost;
    doorLines.push({ desc: `OH Door ${d.size.replace('x', '\'×')}\' — ${d.style}${d.opener ? ' + opener' : ''}`, qty: 1, unit: 'ea', cost: cost + openerCost });
  });

  walkDoors.forEach(d => {
    const key = 'walk_door_' + d.size;
    const cost = PRICES[key] || 450;
    doorsCost += cost;
    doorLines.push({ desc: `Walk Door ${d.size} — ${d.style}`, qty: 1, unit: 'ea', cost });
  });

  windows.forEach(w => {
    const key = 'window_' + w.size;
    const cost = PRICES[key] || 200;
    doorsCost += cost;
    doorLines.push({ desc: `Window ${w.size.replace('x', '\'×')}'`, qty: 1, unit: 'ea', cost });
  });

  // Flashing tape — 1 roll per 4 windows
  const flashTapeRolls = Math.ceil(windows.length / 4);
  const flashTapeCost = flashTapeRolls * PRICES['flashing_tape_roll'];

  // ── CONCRETE FLOOR ──
  let concreteCost = 0;
  let concreteLines = [];
  if (sel('floorType') === 'concrete') {
    const slabThick = val('slabThick');
    const slabYards = floorSF * (slabThick / 12) / 27;
    concreteCost += slabYards * PRICES['concrete_yard'];
    concreteLines.push({ desc: `Concrete Slab ${slabThick}" — ${floorSF} SF`, qty: Math.ceil(slabYards * 10) / 10, unit: 'yd³', cost: slabYards * PRICES['concrete_yard'] });

    const rebar = sel('rebarType');
    if (rebar === '4-rebar') {
      const rebarCount = Math.ceil(floorSF / 16) * 2; // roughly
      const rebarBars = Math.ceil(rebarCount / 2); // 20ft bars
      concreteLines.push({ desc: '#4 Rebar Grid', qty: rebarBars, unit: 'bars', cost: rebarBars * PRICES['rebar_4_20ft'] });
      concreteCost += rebarBars * PRICES['rebar_4_20ft'];
    } else if (rebar === 'wwm') {
      const rolls = Math.ceil(floorSF / 750);
      concreteLines.push({ desc: 'Welded Wire Mesh', qty: rolls, unit: 'rolls', cost: rolls * PRICES['wwm_roll'] });
      concreteCost += rolls * PRICES['wwm_roll'];
    } else if (rebar === 'fiber') {
      const bags = Math.ceil(slabYards * 1.5);
      concreteLines.push({ desc: 'Fiber Mesh', qty: bags, unit: 'bags', cost: bags * PRICES['fiber_mesh_bag'] });
      concreteCost += bags * PRICES['fiber_mesh_bag'];
    }

    if (chk('vaporBarrier')) {
      const vbRolls = Math.ceil(floorSF / 1500);
      concreteLines.push({ desc: 'Vapor Barrier 6mil', qty: vbRolls, unit: 'rolls', cost: vbRolls * PRICES['vapor_barrier_roll'] });
      concreteCost += vbRolls * PRICES['vapor_barrier_roll'];
    }
  }

  // ── PORCH ──
  let porchCost = 0;
  let porchLines = [];
  if (chk('porchToggle')) {
    const pDepth = val('porchDepth');
    const pLen = val('porchLength');
    const pPostSize = sel('porchPostSize');
    const pFooting = val('porchFooting');
    const pPosts = Math.ceil(pLen / 8) + 1;
    const pPostKey = pPostSize === '8x8' ? 'porch_post_8x8_ea' : 'porch_post_6x6_ea';
    const pSonoKey = pFooting <= 16 ? 'sonotube_16' : 'sonotube_18';
    porchCost += pPosts * PRICES[pPostKey];
    porchCost += pPosts * PRICES[pSonoKey];
    porchCost += pPosts * PRICES[bracketKey];
    const pFootingVol = pPosts * Math.PI * Math.pow(pFooting / 24, 2) * (42 / 36);
    porchCost += pFootingVol * PRICES['concrete_yard'];
    porchLines.push({ desc: `Porch Posts (${pPostSize})`, qty: pPosts, unit: 'ea', cost: pPosts * PRICES[pPostKey] });
    porchLines.push({ desc: `Porch Footings (${pFooting}")`, qty: pPosts, unit: 'ea', cost: pPosts * PRICES[pSonoKey] + pFootingVol * PRICES['concrete_yard'] });
  }

  // ── ELECTRICAL ──
  const elecCost = chk('elecRoughIn') ? PRICES['electrical_roughin'] : 0;

  // ════ BUILD LINE ITEMS ════
  const sections = [];

  // -- Foundation
  const foundationLines = [
    { desc: `Concrete Footings (${footingDia}" × ${footingDepth}")`, qty: Math.ceil(footingYards * 10) / 10, unit: 'yd³', cost: footingYards * PRICES['concrete_yard'] },
    { desc: `Sonotube ${footingDia}"`, qty: totalPosts, unit: 'ea', cost: totalPosts * PRICES[sonoKey] },
    { desc: sel('bracketType') === 'wet-set' ? 'Wet-Set Brackets w/ Rebar' : 'Retrofit Brackets', qty: totalPosts, unit: 'ea', cost: totalPosts * PRICES[bracketKey] },
  ];
  sections.push({ title: 'Foundation & Footings', lines: foundationLines });

  // -- Framing
  const framingLines = [
    { desc: `Posts — ${sel('postSize').replace(/-/g, ' ')} × ${postLenFt}'`, qty: totalPosts, unit: 'ea', cost: postLF * PRICES[postLumberSize] },
    { desc: `Trusses — ${trussSpan}' span @ ${trussSp}' o.c.`, qty: numTrusses, unit: 'ea', cost: numTrusses * trussSpan * PRICES['truss_lf_span'] },
    { desc: '2×6 Wall Girts @ 24" o.c.', qty: Math.ceil(girtLF), unit: 'LF', cost: girtLF * PRICES['2x6_lf'] },
    { desc: '2×4 Purlins @ 24" o.c.', qty: Math.ceil(purlinLF), unit: 'LF', cost: purlinLF * PRICES['2x4_lf'] },
    { desc: '2×12 Treated Grade Board', qty: Math.ceil(gradeBoardLF), unit: 'LF', cost: gradeBoardLF * PRICES['2x12_treated_lf'] },
    { desc: '2×6 Fascia Board', qty: Math.ceil(fasciaLF), unit: 'LF', cost: fasciaLF * PRICES['fascia_2x6_lf'] },
    { desc: '6" SSD Screws', qty: ssdScrews, unit: 'ea', cost: ssdScrews * PRICES['ssd_screw_6in'] },
    { desc: 'LVL Headers (OH Doors)', qty: Math.ceil(lvlLF), unit: 'LF', cost: lvlLF * PRICES['lvl_header_lf'] },
  ];
  if (wainBoardLF > 0) framingLines.push({ desc: '2×6 Center Wainscot Board', qty: Math.ceil(wainBoardLF), unit: 'LF', cost: wainBoardLF * PRICES['2x6_lf'] });
  if (xBraceSets > 0) framingLines.push({ desc: 'Double X Brace Sets', qty: xBraceSets, unit: 'sets', cost: xBraceSets * PRICES['x_brace_set'] });
  sections.push({ title: 'Framing', lines: framingLines });

  // -- Steel & Exterior
  const steelLines = [
    { desc: `Wall Panels — ${panelProfile}`, qty: Math.ceil(wallPanelLF), unit: 'LF', cost: wallPanelLF * PRICES[panelKey] },
    { desc: `Roof Panels — ${panelProfile}`, qty: Math.ceil(roofPanelLF), unit: 'LF', cost: roofPanelLF * PRICES[panelKey] },
  ];
  if (wainCost > 0) steelLines.push({ desc: wainLabel, qty: Math.ceil(wainSF), unit: 'SF', cost: wainCost });
  steelLines.push({ desc: 'Trim & Flashing', qty: Math.ceil(trimLF), unit: 'LF', cost: trimLF * PRICES['trim_lf'] });
  steelLines.push({ desc: 'Ridge Cap', qty: Math.ceil(ridgeCapLF), unit: 'LF', cost: ridgeCapLF * PRICES['ridge_cap_lf'] });
  sections.push({ title: 'Steel & Exterior', lines: steelLines });

  // -- Insulation & Wrap
  const insulLines = [];
  if (houseWrapCost > 0) insulLines.push({ desc: 'Block-it House Wrap', qty: Math.ceil(wallSF), unit: 'SF', cost: houseWrapCost });
  if (wallInsul !== 'none') insulLines.push({ desc: `Wall Insulation — ${insulLabel(wallInsul)}`, qty: Math.ceil(wallSF), unit: 'SF', cost: insulCost(wallInsul, wallSF) });
  if (roofInsul !== 'none') insulLines.push({ desc: `Roof Insulation — ${insulLabel(roofInsul)}`, qty: Math.ceil(roofSF), unit: 'SF', cost: insulCost(roofInsul, roofSF) });
  if (wallLinerCost > 0) insulLines.push({ desc: 'Wall Liner Panels', qty: Math.ceil(wallSF), unit: 'SF', cost: wallLinerCost });
  if (ceilingLinerCost > 0) insulLines.push({ desc: 'Ceiling Liner Panels', qty: Math.ceil(floorSF), unit: 'SF', cost: ceilingLinerCost });
  if (insulLines.length > 0) sections.push({ title: 'Insulation & Liner', lines: insulLines });

  // -- Ventilation & Gutters
  const ventLines = [];
  if (ridgeVentCost > 0) ventLines.push({ desc: 'Ridge Vent', qty: Math.ceil(L), unit: 'LF', cost: ridgeVentCost });
  if (eaveVentCount > 0) ventLines.push({ desc: 'Eave Vents', qty: eaveVentCount, unit: 'ea', cost: eaveVentCount * PRICES['eave_vent_ea'] });
  if (gutterLF > 0) ventLines.push({ desc: '6" Seamless Gutters', qty: Math.ceil(gutterLF), unit: 'LF', cost: gutterLF * PRICES['gutter_6in_lf'] });
  if (dsCount > 0) ventLines.push({ desc: 'Downspouts', qty: dsCount, unit: 'ea', cost: dsCount * PRICES['downspout_ea'] });
  if (ventLines.length > 0) sections.push({ title: 'Ventilation & Gutters', lines: ventLines });

  // -- Doors & Windows
  if (doorLines.length > 0) {
    if (flashTapeCost > 0) doorLines.push({ desc: 'Flashing Tape (windows)', qty: flashTapeRolls, unit: 'rolls', cost: flashTapeCost });
    sections.push({ title: 'Doors & Windows', lines: doorLines });
  }

  // -- Concrete Floor
  if (concreteLines.length > 0) sections.push({ title: 'Concrete Floor', lines: concreteLines });

  // -- Porch
  if (porchLines.length > 0) sections.push({ title: 'Timber Porch', lines: porchLines });

  // -- Electrical
  if (elecCost > 0) sections.push({ title: 'Electrical', lines: [{ desc: 'Electrical Rough-In Allowance', qty: 1, unit: 'lot', cost: elecCost }] });

  // ════ TOTALS ════
  let materialTotal = 0;
  sections.forEach(sec => {
    sec.subtotal = 0;
    sec.lines.forEach(l => { sec.subtotal += l.cost; });
    materialTotal += sec.subtotal;
  });

  const wasteAmt = materialTotal * wastePct;
  const materialWithWaste = materialTotal + wasteAmt;
  const laborAmt = materialWithWaste * laborPct;
  const subtotal = materialWithWaste + laborAmt;
  const gcAmt = subtotal * gcPct;
  const grandTotal = subtotal + gcAmt;
  const costPerSF = grandTotal / floorSF;

  // ════ RENDER ════
  const output = document.getElementById('estimateOutput');
  let html = '';

  // Building summary
  html += `<div class="section-card" style="margin-bottom:20px">
    <h3>Building Summary</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:.88rem">
      <div><strong>${W}' × ${L}'</strong> — ${floorSF.toLocaleString()} SF</div>
      <div><strong>${eave}' Eave</strong> — ${pitch}:12 Pitch</div>
      <div><strong>${roofStyle}</strong> roof</div>
      <div><strong>${panelProfile}</strong> panels</div>
      <div>Roof: <strong>${selectedColors.roof}</strong></div>
      <div>Walls: <strong>${selectedColors.sidewall}</strong></div>
      <div>Wainscot: <strong>${selectedColors.wainscot}</strong> (${wainHt}')</div>
      <div>Trim: <strong>${selectedColors.trim}</strong></div>
      <div>Posts: ${totalPosts} @ ${postSp}' o.c.</div>
    </div>
  </div>`;

  // Sections
  sections.forEach(sec => {
    html += `<div class="estimate-section">
      <h4>${sec.title}</h4>
      <table class="estimate-table">
        <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th class="text-right">Cost</th></tr></thead>
        <tbody>`;
    sec.lines.forEach(l => {
      html += `<tr><td>${l.desc}</td><td>${l.qty}</td><td>${l.unit}</td><td class="text-right">${fmt(l.cost)}</td></tr>`;
    });
    html += `<tr class="section-total"><td colspan="3">${sec.title} Subtotal</td><td class="text-right">${fmt(sec.subtotal)}</td></tr>`;
    html += `</tbody></table></div>`;
  });

  // Totals
  html += `<div class="estimate-section">
    <h4>Totals</h4>
    <table class="estimate-table"><tbody>
      <tr><td>Material Subtotal</td><td></td><td></td><td class="text-right">${fmt(materialTotal)}</td></tr>
      <tr><td>Waste Factor (${(wastePct*100).toFixed(0)}%)</td><td></td><td></td><td class="text-right">${fmt(wasteAmt)}</td></tr>
      <tr><td>Materials w/ Waste</td><td></td><td></td><td class="text-right">${fmt(materialWithWaste)}</td></tr>
      <tr><td>Labor (${(laborPct*100).toFixed(0)}%)</td><td></td><td></td><td class="text-right">${fmt(laborAmt)}</td></tr>
      <tr><td>GC Overhead (${(gcPct*100).toFixed(0)}%)</td><td></td><td></td><td class="text-right">${fmt(gcAmt)}</td></tr>
    </tbody></table>
  </div>`;

  html += `<div class="grand-total">
    <div>
      <div class="total-label">Grand Total</div>
      <div class="cost-sqft">${fmt(costPerSF)} per sq ft</div>
    </div>
    <div class="total-amount">${fmt(grandTotal)}</div>
  </div>`;

  // Footer
  html += `<div style="text-align:center;margin-top:24px;padding:16px;border-top:1px solid #eee;font-size:.82rem;color:#888">
    Ebbers Construction · SE Nebraska · 402-580-5977 · ebbersconstruction.com<br>
    Estimate generated ${new Date().toLocaleDateString()} — Prices subject to change
  </div>`;

  output.innerHTML = html;
}
