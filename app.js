/* ============================================================
   EBBERS CONSTRUCTION — POST FRAME ESTIMATOR
   app.js — Edit this file to change prices, calculations, colors
   ============================================================ */

/* ------------------------------------------------------------
   FRONTIER METAL SUPPLY — COLOR LIST
   Add, remove, or rename colors here to match their current chart
   Format: { name: 'Color Name', hex: '#RRGGBB' }
   ------------------------------------------------------------ */
var FM_COLORS = [
  { name: 'Arctic White',     hex: '#F3F2EF' },
  { name: 'Polar White',      hex: '#EBE9E3' },
  { name: 'Light Stone',      hex: '#D5CA9F' },
  { name: 'Tan',              hex: '#C5A87C' },
  { name: 'Taupe',            hex: '#9D8B71' },
  { name: 'Ash Gray',         hex: '#A9A9A0' },
  { name: 'Charcoal Gray',    hex: '#5C5C59' },
  { name: 'Charcoal',         hex: '#3E3D3A' },
  { name: 'Black',            hex: '#1E1E1B' },
  { name: 'Burnished Slate',  hex: '#7B7E84' },
  { name: 'Cocoa Brown',      hex: '#6C4227' },
  { name: 'Copper Metallic',  hex: '#8C5F3D' },
  { name: 'Burgundy',         hex: '#6C1F2B' },
  { name: 'Dark Red',         hex: '#8C1B1B' },
  { name: 'Rural Red',        hex: '#A62B2B' },
  { name: 'Ivy Green',        hex: '#4B6842' },
  { name: 'Evergreen',        hex: '#2E4B2E' },
  { name: 'Gallery Blue',     hex: '#3B607B' },
  { name: 'Ocean Blue',       hex: '#2C607B' },
  { name: 'Galvalume',        hex: '#B9BFC5' },
];

/* ------------------------------------------------------------
   MATERIAL PRICE LIST
   Update prices here to match your current supplier quotes.
   id        — internal key, do not change
   name      — displays in the Prices tab and on the estimate
   unit      — unit of measure shown on estimate
   p         — default price per unit (you can edit in the app too)
   ------------------------------------------------------------ */
var DEFAULTS = {
  lumber: [
    { id: 'p_2x4_lf',       name: '2x4 lumber (purlins, misc)',            unit: 'LF',       p: 0.62  },
    { id: 'p_2x6_lf',       name: '2x6 lumber (girts, fascia, braces)',    unit: 'LF',       p: 0.98  },
    { id: 'p_2x8_lf',       name: '2x8 lumber',                            unit: 'LF',       p: 1.45  },
    { id: 'p_2x12_lf',      name: '2x12 treated grade board',              unit: 'LF',       p: 3.20  },
    { id: 'p_lvl2x8',       name: 'LVL 2x8 — stacked top plate / header', unit: 'LF',       p: 5.50  },
    { id: 'p_lvl2x10',      name: 'LVL 2x10 — stacked top plate / header',unit: 'LF',       p: 7.25  },
    { id: 'p_3ply2x8',      name: '3-ply 2x8 top plate',                   unit: 'LF',       p: 2.20  },
    { id: 'p_post_3ply2x6', name: '3-ply 2x6 post (assembled, per LF)',    unit: 'LF',       p: 2.10  },
    { id: 'p_post_3ply2x8', name: '3-ply 2x8 post (assembled, per LF)',    unit: 'LF',       p: 3.00  },
    { id: 'p_post_4ply2x6', name: '4-ply 2x6 post (assembled, per LF)',    unit: 'LF',       p: 2.75  },
    { id: 'p_truss_com',    name: 'Common gable truss',                    unit: 'LF span',  p: 8.50  },
    { id: 'p_truss_att',    name: 'Attic storage truss',                   unit: 'LF span',  p: 14.00 },
    { id: 'p_truss_sci',    name: 'Scissor truss',                         unit: 'LF span',  p: 11.00 },
    { id: 'p_ssd6',         name: '6" SSD structural screw',               unit: 'ea',       p: 0.65  },
    { id: 'p_hwrap',        name: 'Block-it House Wrap',                   unit: 'sq ft',    p: 0.18  },
  ],
  steel: [
    { id: 'p_roof_pbr',     name: 'Pro-Rib roof panel — Frontier',         unit: 'sq ft',    p: 1.45  },
    { id: 'p_roof_ss',      name: 'Standing seam roof — Frontier',         unit: 'sq ft',    p: 2.20  },
    { id: 'p_roof_bnb',     name: 'Board & Batten 26ga roof — Frontier',   unit: 'sq ft',    p: 1.85  },
    { id: 'p_wall_pbr',     name: 'Pro-Rib wall panel main color — Frontier',    unit: 'sq ft', p: 1.35 },
    { id: 'p_wall_wain',    name: 'Pro-Rib wall panel wainscot color — Frontier',unit: 'sq ft', p: 1.35 },
    { id: 'p_wall_bnb',     name: 'Board & Batten 26ga wall — Frontier',   unit: 'sq ft',    p: 1.75  },
    { id: 'p_liner',        name: 'VL-34 liner panel — Frontier',          unit: 'sq ft',    p: 1.20  },
    { id: 'p_trim_lf',      name: 'Steel trim (eave / corner / gable)',    unit: 'LF',       p: 2.85  },
    { id: 'p_ridge_std',    name: 'Standard ridge cap',                    unit: 'LF',       p: 3.25  },
    { id: 'p_ridge_vent',   name: 'Vented ridge cap',                      unit: 'LF',       p: 5.50  },
    { id: 'p_base_angle',   name: 'Base angle / rat guard',                unit: 'LF',       p: 1.85  },
    { id: 'p_rev_rib',      name: 'Reverse-rolled Pro-Rib (overhang)',     unit: 'sq ft',    p: 1.45  },
    { id: 'p_versetta',     name: 'Versetta Stone wainscot',               unit: 'sq ft',    p: 9.50  },
    { id: 'p_gutter6',      name: '6" seamless gutters installed',         unit: 'LF',       p: 8.50  },
  ],
  concrete: [
    { id: 'p_conc3000',     name: 'Concrete 3000 PSI',                     unit: 'CY',       p: 165   },
    { id: 'p_conc4000',     name: 'Concrete 4000 PSI',                     unit: 'CY',       p: 185   },
    { id: 'p_brkt_std',     name: 'Wet-set bracket w/ rebar (standard)',   unit: 'ea',       p: 28.00 },
    { id: 'p_brkt_hd',      name: 'Wet-set bracket heavy duty',            unit: 'ea',       p: 42.00 },
    { id: 'p_hw_full',      name: 'Hardware pack per post (structural)',   unit: 'per post', p: 28.00 },
    { id: 'p_mesh',         name: 'Wire mesh 6x6 W1.4',                   unit: 'sq ft',    p: 0.38  },
    { id: 'p_rebar4',       name: 'Rebar #4',                              unit: 'LF',       p: 0.85  },
    { id: 'p_vapor6',       name: '6 mil poly vapor barrier',             unit: 'sq ft',    p: 0.12  },
    { id: 'p_vapor10',      name: '10 mil poly vapor barrier',            unit: 'sq ft',    p: 0.18  },
    { id: 'p_flash_tape',   name: 'Flashing tape (windows)',               unit: 'LF',       p: 1.25  },
  ],
  misc: [
    { id: 'p_oh_10x10',     name: 'Overhead door 10x10',                  unit: 'ea',       p: 1450  },
    { id: 'p_oh_12x12',     name: 'Overhead door 12x12',                  unit: 'ea',       p: 1850  },
    { id: 'p_oh_14x14',     name: 'Overhead door 14x14',                  unit: 'ea',       p: 2400  },
    { id: 'p_oh_16x14',     name: 'Overhead door 16x14',                  unit: 'ea',       p: 2950  },
    { id: 'p_oh_20x14',     name: 'Overhead door 20x14',                  unit: 'ea',       p: 3800  },
    { id: 'p_opener',       name: 'Garage door opener',                   unit: 'ea',       p: 425   },
    { id: 'p_walk_wood',    name: 'Walk door 3x7 wood prehung',           unit: 'ea',       p: 385   },
    { id: 'p_walk_steel',   name: 'Walk door 3x7 steel prehung',          unit: 'ea',       p: 525   },
    { id: 'p_win_3x3',      name: 'Window 3x3',                           unit: 'ea',       p: 185   },
    { id: 'p_win_3x4',      name: 'Window 3x4',                           unit: 'ea',       p: 225   },
    { id: 'p_win_4x4',      name: 'Window 4x4',                           unit: 'ea',       p: 265   },
    { id: 'p_bub',          name: 'Reflective bubble insulation',         unit: 'sq ft',    p: 0.45  },
    { id: 'p_fg_r19',       name: 'Fiberglass batt R-19',                 unit: 'sq ft',    p: 0.85  },
    { id: 'p_fg_r13',       name: 'Fiberglass batt R-13',                 unit: 'sq ft',    p: 0.62  },
    { id: 'p_spray',        name: 'Spray foam 2"',                        unit: 'sq ft',    p: 2.50  },
    { id: 'p_cupola24',     name: '24" Cupola',                           unit: 'ea',       p: 285   },
    { id: 'p_cupola30',     name: '30" Cupola',                           unit: 'ea',       p: 395   },
    { id: 'p_panel200',     name: '200A electrical panel rough-in',       unit: 'ea',       p: 1850  },
    { id: 'p_panel100',     name: '100A electrical panel rough-in',       unit: 'ea',       p: 1150  },
    { id: 'p_outlet',       name: 'Outlet rough-in',                      unit: 'ea',       p: 65    },
    { id: 'p_lightckt',     name: 'Lighting circuit rough-in',            unit: 'ea',       p: 185   },
    { id: 'p_porch_lf',     name: 'Timber framed porch (per LF length)',  unit: 'LF',       p: 285   },
  ]
};

/* ============================================================
   INTERNAL STATE — do not edit below unless you know JS
   ============================================================ */

var PR = {};   // live price map
var selMain = null;  // selected main color
var selWain = null;  // selected wainscot color
var ohDoors  = [];   // overhead door list
var walkDoors = [];  // walk door list
var wins      = [];  // window list
var uid = 0;         // unique id counter for list items

/* ----- Price helpers ----- */
function resetPrices() {
  ['lumber', 'steel', 'concrete', 'misc'].forEach(function(cat) {
    DEFAULTS[cat].forEach(function(item) { PR[item.id] = item.p; });
  });
}
function P(id) { return PR[id] || 0; }

/* ----- Build price input tables ----- */
function buildPriceTables() {
  ['lumber', 'steel', 'concrete', 'misc'].forEach(function(cat) {
    var tb = document.getElementById('ptbl-' + cat);
    tb.innerHTML = '';
    DEFAULTS[cat].forEach(function(item) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + item.name + '</td>' +
        '<td style="font-size:10px;font-family:\'Courier New\',monospace;color:var(--text3);white-space:nowrap">' + item.unit + '</td>' +
        '<td style="white-space:nowrap"><span style="color:var(--text3);font-size:12px">$&nbsp;</span>' +
        '<input style="width:85px;padding:4px 6px;border:1px solid var(--border2);border-radius:var(--rs);font-size:13px;text-align:right;background:var(--surface);color:var(--text);font-family:Georgia,serif"' +
        ' type="number" min="0" step="0.01" value="' + item.p + '"' +
        ' onchange="PR[\'' + item.id + '\']=parseFloat(this.value)||0"></td>';
      tb.appendChild(tr);
    });
  });
}

/* ----- Color swatch builder ----- */
function buildSwatches() {
  buildSwatchGroup('main-swatches', 'main-preview', 'main-color-name', function(c) { selMain = c; });
  buildSwatchGroup('wain-swatches', 'wain-preview', 'wain-color-name', function(c) { selWain = c; });
}
function buildSwatchGroup(gridId, prevId, nameId, setter) {
  var grid = document.getElementById(gridId);
  grid.innerHTML = '';
  FM_COLORS.forEach(function(c) {
    var d = document.createElement('div');
    d.className = 'cswatch';
    d.innerHTML =
      '<div class="cswatch-box" style="background:' + c.hex + '"></div>' +
      '<div class="cswatch-name">' + c.name + '</div>';
    d.addEventListener('click', function() {
      setter(c);
      document.getElementById(prevId).style.background = c.hex;
      document.getElementById(nameId).textContent = c.name;
      grid.querySelectorAll('.cswatch').forEach(function(x) { x.classList.remove('sel'); });
      d.classList.add('sel');
    });
    grid.appendChild(d);
  });
}

/* ----- Tab navigation ----- */
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('tabbar').addEventListener('click', function(e) {
    var btn = e.target.closest('.tab');
    if (!btn) return;
    var pid = btn.getAttribute('data-p');
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('on'); });
    document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('on'); });
    btn.classList.add('on');
    document.getElementById('p-' + pid).classList.add('on');
    if (pid === 'estimate') runCalc();
  });

  // Init
  resetPrices();
  buildPriceTables();
  buildSwatches();
  renderOH();
  renderWalk();
  renderWins();
  refreshOverview();
});

function goCalc() {
  document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('on'); });
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('on'); });
  document.querySelector('[data-p="estimate"]').classList.add('on');
  document.getElementById('p-estimate').classList.add('on');
  runCalc();
}

/* ----- Door/Window list renderers ----- */
function addOH()   { uid++; ohDoors.push({ id: uid, w: 12, h: 12, opener: true }); renderOH(); }
function addWalk() { uid++; walkDoors.push({ id: uid, type: 'steel', qty: 1 }); renderWalk(); }
function addWin()  { uid++; wins.push({ id: uid, size: '3x3', qty: 1 }); renderWins(); }

function removeOH(id)   { ohDoors   = ohDoors.filter(function(d) { return d.id !== id; }); renderOH(); }
function removeWalk(id) { walkDoors = walkDoors.filter(function(d) { return d.id !== id; }); renderWalk(); }
function removeWin(id)  { wins      = wins.filter(function(d) { return d.id !== id; }); renderWins(); }

function renderOH() {
  var el = document.getElementById('oh-list');
  if (!ohDoors.length) { el.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:4px 0">No overhead doors added</div>'; return; }
  el.innerHTML = ohDoors.map(function(d) {
    return '<div class="door-row">' +
      '<div class="fld"><label>Width (ft)</label><select onchange="ohDoors.find(function(x){return x.id==' + d.id + '}).w=+this.value">' +
      ['10','12','14','16','20'].map(function(v) { return '<option ' + (d.w == v ? 'selected' : '') + ' value="' + v + '">' + v + "'</option>"; }).join('') +
      '</select></div>' +
      '<div class="fld"><label>Height (ft)</label><select onchange="ohDoors.find(function(x){return x.id==' + d.id + '}).h=+this.value">' +
      ['10','12','14'].map(function(v) { return '<option ' + (d.h == v ? 'selected' : '') + ' value="' + v + '">' + v + "'</option>"; }).join('') +
      '</select></div>' +
      '<div class="fld"><label>Opener</label><input type="checkbox" style="margin-top:10px;width:20px;height:20px;accent-color:var(--accent)" ' + (d.opener ? 'checked' : '') + ' onchange="ohDoors.find(function(x){return x.id==' + d.id + '}).opener=this.checked"></div>' +
      '<div class="fld"><label>&nbsp;</label><button class="btn btn-d btn-sm" onclick="removeOH(' + d.id + ')">&#10005;</button></div>' +
      '</div>';
  }).join('');
}

function renderWalk() {
  var el = document.getElementById('walk-list');
  if (!walkDoors.length) { el.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:4px 0">No walk doors added</div>'; return; }
  el.innerHTML = walkDoors.map(function(d) {
    return '<div class="door-row">' +
      '<div class="fld"><label>Type</label><select onchange="walkDoors.find(function(x){return x.id==' + d.id + '}).type=this.value">' +
      '<option value="std" '  + (d.type === 'std'   ? 'selected' : '') + '>Wood prehung 3x7</option>' +
      '<option value="steel" '+ (d.type === 'steel' ? 'selected' : '') + '>Steel prehung 3x7</option>' +
      '</select></div>' +
      '<div class="fld"><label>Qty</label><input type="number" value="' + d.qty + '" min="1" max="10" onchange="walkDoors.find(function(x){return x.id==' + d.id + '}).qty=+this.value"></div>' +
      '<div></div>' +
      '<div class="fld"><label>&nbsp;</label><button class="btn btn-d btn-sm" onclick="removeWalk(' + d.id + ')">&#10005;</button></div>' +
      '</div>';
  }).join('');
}

function renderWins() {
  var el = document.getElementById('win-list');
  if (!wins.length) { el.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:4px 0">No windows added</div>'; return; }
  el.innerHTML = wins.map(function(d) {
    return '<div class="door-row">' +
      '<div class="fld"><label>Size</label><select onchange="wins.find(function(x){return x.id==' + d.id + '}).size=this.value">' +
      '<option value="3x3" ' + (d.size === '3x3' ? 'selected' : '') + '>3x3</option>' +
      '<option value="3x4" ' + (d.size === '3x4' ? 'selected' : '') + '>3x4</option>' +
      '<option value="4x4" ' + (d.size === '4x4' ? 'selected' : '') + '>4x4</option>' +
      '</select></div>' +
      '<div class="fld"><label>Qty</label><input type="number" value="' + d.qty + '" min="1" max="20" onchange="wins.find(function(x){return x.id==' + d.id + '}).qty=+this.value"></div>' +
      '<div></div>' +
      '<div class="fld"><label>&nbsp;</label><button class="btn btn-d btn-sm" onclick="removeWin(' + d.id + ')">&#10005;</button></div>' +
      '</div>';
  }).join('');
}

/* ----- Overview metrics ----- */
function refreshOverview() {
  var W = +gv('width'), L = +gv('length'), E = +gv('eave'), pit = +gv('pitch');
  var riseRun = pit / 12;
  var rafter  = Math.sqrt(Math.pow(W / 2, 2) + Math.pow((W / 2) * riseRun, 2));
  var ridgeHt = (W / 2) * riseRun;
  document.getElementById('overview').innerHTML =
    metric('Floor area',    (W * L).toLocaleString() + ' sf', 'gold') +
    metric('Ridge height',  (E + ridgeHt).toFixed(1) + "'") +
    metric('Rafter length', rafter.toFixed(1) + "'") +
    metric('Perimeter',     (2 * (W + L)).toLocaleString() + ' ft');
}
function metric(lbl, val, cls) {
  return '<div class="met"><div class="mlbl">' + lbl + '</div><div class="mval' + (cls ? ' ' + cls : '') + '">' + val + '</div></div>';
}

/* ============================================================
   MAIN CALCULATION ENGINE
   This is where all the math happens.
   ============================================================ */
function runCalc() {
  var W   = +gv('width');
  var L   = +gv('length');
  var E   = +gv('eave');
  var pit = +gv('pitch');
  var wf  = 1 + (+gv('wastePct') / 100);
  var lPct  = +gv('laborPct') / 100;
  var gcPct = +gv('gcPct') / 100;

  /* --- Geometry --- */
  var sqft     = W * L;
  var perim    = 2 * (W + L);
  var riseRun  = pit / 12;
  var rafterLen = Math.sqrt(Math.pow(W / 2, 2) + Math.pow((W / 2) * riseRun, 2));
  var ovhE = +gv('ovhEave')  / 12;   // ft
  var ovhG = +gv('ovhGable') / 12;   // ft
  var roofW    = rafterLen + ovhE;
  var roofLn   = L + 2 * ovhG;
  var roofSqft = roofW * roofLn * 2;
  var ovhSqft  = (ovhE * (L + 2 * ovhG) * 2) + (ovhG * roofW * 2);

  /* --- Posts (Ebbers standard: 3-ply, 8' o.c.) --- */
  var pSp    = +gv('postSp');
  var pSize  = gv('postSize');
  var nSide  = Math.ceil(L / pSp) + 1;
  var nEnd   = Math.ceil(W / pSp) + 1;
  var nPosts = 2 * nSide + 2 * nEnd - 4;
  var postHt = +gv('postHt');
  var postPid = pSize === '3ply2x8' ? 'p_post_3ply2x8' : pSize === '4ply2x6' ? 'p_post_4ply2x6' : 'p_post_3ply2x6';
  var postLF  = Math.ceil(nPosts * postHt * wf);
  var postCost = postLF * P(postPid);

  /* --- Grade board (2x12 treated, full perimeter) --- */
  var gbLF   = Math.ceil(perim * wf);
  var gbCost = gbLF * P('p_2x12_lf');

  /* --- Footings --- */
  var fd      = +gv('footDia')   / 12;  // ft diameter
  var fdepth  = +gv('footDepth') / 12;  // ft depth
  var footVol = Math.PI * Math.pow(fd / 2, 2) * fdepth;
  var concCY  = parseFloat((nPosts * footVol / 27).toFixed(2));
  var concPid = gv('concPSI') === '4000' ? 'p_conc4000' : 'p_conc3000';
  var concCost = concCY * P(concPid);
  var brkCost  = nPosts * P('p_brkt_std');
  var hwCost   = nPosts * P('p_hw_full');

  /* --- Trusses --- */
  var tSp    = +gv('trussSp');
  var nTruss = Math.ceil(L / tSp) + 1;
  var tSpan  = W;
  var tType  = gv('trussType');
  var tPid   = tType === 'attic' ? 'p_truss_att' : tType === 'scissor' ? 'p_truss_sci' : 'p_truss_com';
  var trussCost = nTruss * tSpan * P(tPid);

  /* --- Purlins (2x4 @ 24" o.c., Ebbers standard) --- */
  var purlinRuns = Math.ceil(rafterLen / (24 / 12));
  var purlinLF   = Math.ceil(L * purlinRuns * 2 * wf);
  var purlinCost = purlinLF * P('p_2x4_lf');

  /* --- SSD screws (2 per purlin-truss intersection) --- */
  var ssdQty  = Math.ceil(nTruss * purlinRuns * 2 * 2 * wf);
  var ssdCost = ssdQty * P('p_ssd6');

  /* --- Top plate / header beam --- */
  var tpType = gv('topPlate');
  var tpPid  = tpType === 'lvl2x10' ? 'p_lvl2x10' : tpType === '3ply2x8' ? 'p_3ply2x8' : 'p_lvl2x8';
  var plateLF  = Math.ceil(perim * 2 * wf);  // double, both sides
  var plateCost = plateLF * P(tpPid);

  /* --- Fascia (2x6, Ebbers standard) --- */
  var fasciaLF   = Math.ceil((L + 2 * ovhG) * 2 * wf);
  var fasciaCost = fasciaLF * P('p_2x6_lf');

  /* --- Wall girts (2x6 @ 24" o.c., Ebbers standard) --- */
  var wainHt   = +gv('wainscot');
  var gSp      = +gv('girtSp') / 12;
  var nGirts   = Math.ceil((E - wainHt) / gSp);
  var girtLF   = Math.ceil(perim * nGirts * wf);
  var girtCost = girtLF * P('p_2x6_lf');

  /* --- Double X bracing --- */
  var xbrace     = gv('xbrace') === 'yes';
  var xbraceLF   = xbrace ? Math.ceil(nPosts * 10 * wf) : 0;
  var xbraceCost = xbrace ? xbraceLF * P('p_2x6_lf') : 0;

  /* --- Center wainscot board --- */
  var wbLF   = document.getElementById('wainscotBoard').checked ? Math.ceil(perim * wf) : 0;
  var wbCost = wbLF * P('p_2x6_lf');

  /* --- Block-it House Wrap --- */
  var hwrapSqft = Math.ceil(perim * E * wf);
  var hwrapCost = hwrapSqft * P('p_hwrap');

  /* --- Roof steel --- */
  var rProf       = gv('roofProf');
  var rPid        = rProf === 'ss' ? 'p_roof_ss' : rProf === 'bnb' ? 'p_roof_bnb' : 'p_roof_pbr';
  var roofSteelSF = Math.ceil(roofSqft * wf);
  var roofSteelCost = roofSteelSF * P(rPid);

  /* --- Ridge cap --- */
  var ridgeLF  = Math.ceil((L + 2 * ovhG) * wf);
  var ridgePid = gv('ridgeCap') === 'vented' ? 'p_ridge_vent' : 'p_ridge_std';
  var ridgeCost = ridgeLF * P(ridgePid);

  /* --- Overhang material --- */
  var ovhSF   = Math.ceil(ovhSqft * wf);
  var ovhCost = ovhSF * P('p_rev_rib');

  /* --- Gutters --- */
  var gutterLF   = gv('gutters') === '6in' ? Math.ceil(perim * wf) : 0;
  var gutterCost = gutterLF * P('p_gutter6');

  /* --- Roof insulation / liner --- */
  var roofInsul = document.getElementById('roofInsul').checked;
  var rIType    = gv('roofInsulType');
  var rIPid     = insulPid(rIType);
  var rInsulCost = roofInsul ? roofSteelSF * P(rIPid) : 0;
  var lPanel     = gv('linerPanel');
  var linerCost  = lPanel !== 'none' ? roofSteelSF * P('p_liner') : 0;

  /* --- Vent --- */
  var vType   = gv('ventType');
  var ventCost = vType === 'cupola_24' ? P('p_cupola24') : vType === 'cupola_30' ? P('p_cupola30') : vType === 'ridge_vent' ? ridgeLF * 2.50 : 0;

  /* --- Wall steel --- */
  var wProf   = gv('wallProf');
  var wainMat = gv('wainMat');
  var wPid    = wProf === 'bnb' ? 'p_wall_bnb' : 'p_wall_pbr';
  var mainSF  = Math.ceil(perim * (E - wainHt) * wf);
  var wainSF  = Math.ceil(perim * wainHt * wf);
  var mainWallCost = mainSF * P(wPid);
  var wainCost = wainMat === 'versetta' ? wainSF * P('p_versetta') :
                 wainMat === 'bnb'      ? wainSF * P('p_wall_bnb') :
                 wainMat === 'steel'    ? wainSF * P('p_wall_wain') : 0;

  /* --- Wall insulation / liner --- */
  var wallInsul  = document.getElementById('wallInsul').checked;
  var wIType     = gv('wallInsulType');
  var wIPid      = insulPid(wIType);
  var wInsulCost = wallInsul ? (mainSF + wainSF) * P(wIPid) : 0;
  var wLiner     = gv('wallLiner');
  var wLinerCost = wLiner !== 'none' ? (mainSF + wainSF) * P('p_liner') : 0;

  /* --- Trim --- */
  var eaveLF    = Math.ceil((L + 2 * ovhG) * 2 * wf);
  var cornerLF  = Math.ceil(4 * E * wf);
  var gableLF   = document.getElementById('gableTrim').checked ? Math.ceil(4 * rafterLen * wf) : 0;
  var wainTrimLF = document.getElementById('wainscotTrim').checked ? Math.ceil(perim * wf) : 0;
  var totalTrimLF = eaveLF + cornerLF + gableLF + wainTrimLF;
  var trimCost   = totalTrimLF * P('p_trim_lf');
  var baLF       = document.getElementById('baseAngle').checked ? Math.ceil(perim * wf) : 0;
  var baCost     = baLF * P('p_base_angle');

  /* --- Window flashing tape --- */
  var flashCost = 0;
  if (document.getElementById('flashTape').checked && wins.length) {
    var totalWins = wins.reduce(function(a, w) { return a + w.qty; }, 0);
    flashCost = totalWins * 12 * P('p_flash_tape');
  }

  /* --- Porch --- */
  var hasPorch  = document.getElementById('hasPorch').checked;
  var porchLF   = hasPorch ? +gv('porchLen') : 0;
  var porchCost = porchLF * P('p_porch_lf');

  /* --- Doors & Windows --- */
  var dRows = [], dTotal = 0;
  ohDoors.forEach(function(d) {
    var pid = d.w <= 10 ? 'p_oh_10x10' : d.w <= 12 ? 'p_oh_12x12' : d.w <= 14 ? 'p_oh_14x14' : d.w <= 16 ? 'p_oh_16x14' : 'p_oh_20x14';
    var dp  = P(pid); dTotal += dp;
    dRows.push({ name: 'Overhead door ' + d.w + "' x " + d.h + "'", qty: 1, unit: 'ea', up: dp, tot: dp });
    if (d.opener) { var op = P('p_opener'); dTotal += op; dRows.push({ name: 'Garage door opener', qty: 1, unit: 'ea', up: op, tot: op }); }
  });
  walkDoors.forEach(function(d) {
    var pid = d.type === 'steel' ? 'p_walk_steel' : 'p_walk_wood';
    var dp  = P(pid) * d.qty; dTotal += dp;
    dRows.push({ name: 'Walk door 3x7 (' + (d.type === 'steel' ? 'steel' : 'wood') + ')', qty: d.qty, unit: 'ea', up: P(pid), tot: dp });
  });
  wins.forEach(function(d) {
    var pid = d.size === '3x4' ? 'p_win_3x4' : d.size === '4x4' ? 'p_win_4x4' : 'p_win_3x3';
    var dp  = P(pid) * d.qty; dTotal += dp;
    dRows.push({ name: 'Window ' + d.size, qty: d.qty, unit: 'ea', up: P(pid), tot: dp });
  });
  if (flashCost && wins.length) {
    dRows.push({ name: 'Window flashing tape', qty: wins.reduce(function(a,w){return a+w.qty;},0), unit: 'windows', up: 0, tot: flashCost });
    dTotal += flashCost;
  }

  /* --- Concrete floor --- */
  var hasFloor = document.getElementById('hasFloor').checked;
  var slabCY = 0, slabCost = 0, rebarCost = 0, vaporCost = 0;
  if (hasFloor) {
    var st      = +gv('slabThick') / 12;
    var apron   = +gv('apronDepth');
    var slabSF  = sqft + W * apron;
    slabCY      = parseFloat((slabSF * st / 27).toFixed(2));
    slabCost    = slabCY * P(concPid);
    var rType   = gv('rebarType');
    rebarCost   = rType === 'mesh'   ? slabSF * P('p_mesh') :
                  rType === 'rebar4' ? (slabSF / 1.5) * P('p_rebar4') : 0;
    var vb      = gv('vaporB');
    vaporCost   = vb === '6mil' ? slabSF * P('p_vapor6') : vb === '10mil' ? slabSF * P('p_vapor10') : 0;
  }

  /* --- Electrical --- */
  var hasElec  = document.getElementById('hasElec').checked;
  var elecCost = 0;
  if (hasElec) {
    var amp  = +gv('panelAmp');
    elecCost = P(amp === 100 ? 'p_panel100' : 'p_panel200') +
               (+gv('outletQty')) * P('p_outlet') +
               (+gv('lightCkts')) * P('p_lightckt');
  }

  /* --- Section totals --- */
  var foundTot = postCost + gbCost + concCost + brkCost + hwCost;
  var frameTot = plateCost + trussCost + purlinCost + ssdCost + fasciaCost + girtCost + xbraceCost + wbCost + hwrapCost;
  var roofTot  = roofSteelCost + ridgeCost + ovhCost + rInsulCost + linerCost + ventCost + gutterCost;
  var wallTot  = mainWallCost + wainCost + trimCost + baCost + wInsulCost + wLinerCost + (hasPorch ? porchCost : 0);
  var openTot  = dTotal;
  var extTot   = (hasFloor ? slabCost + rebarCost + vaporCost : 0) + (hasElec ? elecCost : 0);
  var matTot   = foundTot + frameTot + roofTot + wallTot + openTot + extTot;
  var laborTot = matTot * lPct;
  var subtot   = matTot + laborTot;
  var gcTot    = subtot * gcPct;
  var grand    = subtot + gcTot;

  /* ---- RENDER RESULTS ---- */
  document.getElementById('res-ph').style.display = 'none';
  document.getElementById('res-content').style.display = 'block';

  document.getElementById('res-sumline').textContent =
    W + "' × " + L + "'  ·  " + E + "' eave  ·  " + pit + ":12 pitch  ·  " +
    sqft.toLocaleString() + " sf  ·  " + nPosts + " posts  ·  " + nTruss + " trusses";

  document.getElementById('grand-tot').textContent = '$' + Math.round(grand).toLocaleString();
  document.getElementById('mat-only').textContent  = '$' + Math.round(matTot).toLocaleString();

  document.getElementById('sum-metrics').innerHTML =
    metric('Cost / sq ft', '$' + (grand / sqft).toFixed(2), 'gold') +
    metric('Posts',   nPosts.toString()) +
    metric('Trusses', nTruss.toString()) +
    metric('Footing CY', (concCY + (hasFloor ? slabCY : 0)).toFixed(1));

  /* Color callout */
  var cc = document.getElementById('color-callout');
  if (selMain || selWain) {
    cc.style.display = 'block';
    var cb = '<div style="display:flex;flex-wrap:wrap;gap:14px">';
    if (selMain) cb += colorChip(selMain, 'Main / roof color');
    if (selWain) cb += colorChip(selWain, 'Wainscot / accent — bottom ' + wainHt + "'");
    cb += '</div>';
    document.getElementById('color-callout-body').innerHTML = cb;
  } else { cc.style.display = 'none'; }

  /* Section tables */
  renderTbl('tbl-found', [
    row(pSize + ' post × ' + postHt + 'ft', nPosts, 'posts', P(postPid) * postHt, postCost),
    row('2x12 treated grade board', gbLF, 'LF', P('p_2x12_lf'), gbCost),
    row('Poured footing ' + gv('footDia') + '" dia × ' + gv('footDepth') + '" deep', concCY, 'CY', P(concPid), concCost),
    row('Wet-set brackets w/ rebar', nPosts, 'ea', P('p_brkt_std'), brkCost),
    row('Hardware pack (structural)', nPosts, 'ea', P('p_hw_full'), hwCost),
  ], foundTot);

  var fRows = [
    row('Top plate — ' + tpType + ' (stacked, both sides)', plateLF, 'LF', P(tpPid), plateCost),
    row('Trusses — ' + tType + ' (' + nTruss + ' @ ' + tSp + "' o.c., middle-ply bearing)", nTruss, 'ea', tSpan * P(tPid), trussCost),
    row('2x4 purlins @ 24" o.c.', purlinLF, 'LF', P('p_2x4_lf'), purlinCost),
    row('6" SSD screws (purlin-to-truss)', ssdQty, 'ea', P('p_ssd6'), ssdCost),
    row('2x6 fascia board', fasciaLF, 'LF', P('p_2x6_lf'), fasciaCost),
    row('2x6 wall girts @ ' + gv('girtSp') + '" o.c.', girtLF, 'LF', P('p_2x6_lf'), girtCost),
    row('Block-it House Wrap', hwrapSqft, 'sq ft', P('p_hwrap'), hwrapCost),
  ];
  if (wbCost)     fRows.push(row('Center wainscot board (2x6)', wbLF, 'LF', P('p_2x6_lf'), wbCost));
  if (xbraceCost) fRows.push(row('Double X bracing', xbraceLF, 'LF', P('p_2x6_lf'), xbraceCost));
  renderTbl('tbl-frame', fRows, frameTot);

  var rRows = [
    row('Roof steel — ' + rProf + (selMain ? ' (' + selMain.name + ')' : ''), roofSteelSF, 'sq ft', P(rPid), roofSteelCost),
    row((gv('ridgeCap') === 'vented' ? 'Vented' : 'Standard') + ' ridge cap', ridgeLF, 'LF', P(ridgePid), ridgeCost),
    row('Overhang material — ' + gv('ovhMat'), ovhSF, 'sq ft', P('p_rev_rib'), ovhCost),
  ];
  if (rInsulCost) rRows.push(row('Roof insulation — ' + rIType, roofSteelSF, 'sq ft', P(rIPid), rInsulCost));
  if (linerCost)  rRows.push(row('Roof liner panel', roofSteelSF, 'sq ft', P('p_liner'), linerCost));
  if (ventCost)   rRows.push(row('Ventilation — ' + vType, 1, 'ea', ventCost, ventCost));
  if (gutterCost) rRows.push(row('6" seamless gutters', gutterLF, 'LF', P('p_gutter6'), gutterCost));
  renderTbl('tbl-roof', rRows, roofTot);

  var wRows = [
    row('Wall steel — ' + wProf + (selMain ? ' (' + selMain.name + ')' : ''), mainSF, 'sq ft', P(wPid), mainWallCost),
  ];
  if (wainMat !== 'none') wRows.push(row('Wainscot — ' + wainMat + (selWain && wainMat === 'steel' ? ' (' + selWain.name + ')' : '') + ' ' + wainHt + "' ht", wainSF, 'sq ft', 0, wainCost));
  wRows.push(row('Steel trim (eave + corner + gable)', totalTrimLF, 'LF', P('p_trim_lf'), trimCost));
  if (baCost)     wRows.push(row('Base angle / rat guard', baLF, 'LF', P('p_base_angle'), baCost));
  if (wInsulCost) wRows.push(row('Wall insulation — ' + wIType, mainSF + wainSF, 'sq ft', P(wIPid), wInsulCost));
  if (wLinerCost) wRows.push(row('Wall liner panel', mainSF + wainSF, 'sq ft', P('p_liner'), wLinerCost));
  if (porchCost)  wRows.push(row('Timber framed porch', porchLF, 'LF', P('p_porch_lf'), porchCost));
  renderTbl('tbl-wall', wRows, wallTot);

  if (dRows.length) { document.getElementById('sec-openings').style.display = 'block'; renderTbl('tbl-open', dRows, openTot); }
  else document.getElementById('sec-openings').style.display = 'none';

  var extRows = [];
  if (hasFloor) {
    extRows.push(row('Concrete slab ' + gv('slabThick') + '" thick (' + sqft.toLocaleString() + ' sf)', slabCY, 'CY', P(concPid), slabCost));
    if (rebarCost)  extRows.push(row('Reinforcement — ' + gv('rebarType'), sqft, 'sq ft', 0, rebarCost));
    if (vaporCost)  extRows.push(row('Vapor barrier — ' + gv('vaporB'),    sqft, 'sq ft', P(gv('vaporB') === '6mil' ? 'p_vapor6' : 'p_vapor10'), vaporCost));
  }
  if (hasElec) {
    var amp2 = +gv('panelAmp');
    extRows.push(row(amp2 + 'A electrical panel rough-in', 1, 'ea', P(amp2 === 100 ? 'p_panel100' : 'p_panel200'), P(amp2 === 100 ? 'p_panel100' : 'p_panel200')));
    if (+gv('outletQty'))  extRows.push(row('Outlet rough-in',          +gv('outletQty'),  'ea', P('p_outlet'),   +gv('outletQty')  * P('p_outlet')));
    if (+gv('lightCkts'))  extRows.push(row('Lighting circuit rough-in', +gv('lightCkts'), 'ea', P('p_lightckt'), +gv('lightCkts') * P('p_lightckt')));
  }
  if (extRows.length) { document.getElementById('sec-extras').style.display = 'block'; renderTbl('tbl-ext', extRows, extTot); }
  else document.getElementById('sec-extras').style.display = 'none';

  /* Summary table */
  var sRows = [
    ['Foundation & posts',   foundTot],
    ['Structural framing',   frameTot],
    ['Roof system',          roofTot],
    ['Wall system',          wallTot],
  ];
  if (openTot) sRows.push(['Doors & windows',   openTot]);
  if (extTot)  sRows.push(['Extras & options',  extTot]);

  document.getElementById('tbl-summ').innerHTML =
    sRows.map(function(r) {
      return '<tr><td>' + r[0] + '</td><td></td><td></td><td></td><td class="td-r">$' + Math.round(r[1]).toLocaleString() + '</td></tr>';
    }).join('') +
    '<tr class="tr-sub"><td colspan="4">Materials subtotal</td><td class="td-r">$' + Math.round(matTot).toLocaleString() + '</td></tr>' +
    '<tr><td colspan="4">Labor (' + gv('laborPct') + '%)</td><td class="td-r">$' + Math.round(laborTot).toLocaleString() + '</td></tr>' +
    '<tr><td colspan="4">Overhead & profit (' + gv('gcPct') + '%)</td><td class="td-r">$' + Math.round(gcTot).toLocaleString() + '</td></tr>' +
    '<tr class="tr-tot"><td colspan="4">TOTAL ESTIMATE</td><td class="td-r">$' + Math.round(grand).toLocaleString() + '</td></tr>';
}

/* ============================================================
   HELPERS
   ============================================================ */
function insulPid(t) {
  return t === 'fg_r19' ? 'p_fg_r19' : t === 'fg_r13' ? 'p_fg_r13' : t === 'spray' ? 'p_spray' : 'p_bub';
}
function gv(id) {
  var e = document.getElementById(id);
  return e ? e.value : '';
}
function row(name, qty, unit, up, tot) {
  return { name: name, qty: qty, unit: unit, up: up, tot: tot };
}
function renderTbl(id, rows, tot) {
  document.getElementById(id).innerHTML =
    rows.map(function(r) {
      var q = typeof r.qty === 'number' && r.qty % 1 !== 0 ? r.qty.toFixed(2) : typeof r.qty === 'number' ? r.qty.toLocaleString() : r.qty;
      return '<tr><td>' + r.name + '</td>' +
        '<td class="td-r" style="color:var(--text2)">' + q + '</td>' +
        '<td style="color:var(--text3);font-size:10px;font-family:\'Courier New\',monospace;white-space:nowrap">' + r.unit + '</td>' +
        '<td class="td-r" style="color:var(--text2)">' + (r.up > 0 ? '$' + r.up.toFixed(2) : '—') + '</td>' +
        '<td class="td-r" style="font-weight:500">$' + Math.round(r.tot).toLocaleString() + '</td></tr>';
    }).join('') +
    '<tr class="tr-sub"><td colspan="4">Section total</td><td class="td-r">$' + Math.round(tot).toLocaleString() + '</td></tr>';
}
function colorChip(c, label) {
  return '<div style="display:flex;align-items:center;gap:9px">' +
    '<div style="width:32px;height:32px;border-radius:4px;border:1px solid var(--border2);background:' + c.hex + '"></div>' +
    '<div><div style="font-size:13px;font-weight:bold">' + c.name + '</div>' +
    '<div style="font-size:11px;color:var(--text3);font-family:\'Courier New\',monospace">' + label + '</div></div></div>';
}
