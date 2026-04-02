/**
 * BAYES NOIR — Minecraft Pixel Art Renderer
 * Draws 3 distinct case scenes in Minecraft block style.
 * Logical canvas: 320 × 220 units (40 × 27.5 "blocks" of 8px each)
 */

// ── Minecraft Palette ─────────────────────────────────────────────────────────
const MC = {
  // Stone / Cobblestone
  stone:    '#7a7a7a', stoneLt:'#909090', stoneDk:'#5a5a5a',
  cobble:   '#686868', cobbleLt:'#7e7e7e', cobbleDk:'#4e4e4e',
  brick:    '#6e3b2a', brickLt:'#8a4a35', brickDk:'#4a2010',
  // Wood
  plank:    '#A0742A', plankLt:'#C09040', plankDk:'#7a5010',
  log:      '#5a3c10', logLt:'#7a5420',
  // Nature
  grass:    '#5c8a00', grassLt:'#7aba00', dirt:'#7D5524', dirtDk:'#5a3a10',
  leaf:     '#2d6b15', leafLt:'#3d8b25',
  // Glass / Sky
  glassBlue:'rgba(120,180,230,0.35)', sky:'#1a2e6a', skyLt:'#2a4a9a',
  // Ore / Metal
  gold:     '#fcfa42', goldOre:'#c8aa00',
  iron:     '#d8d8d8', ironDk:'#a0a0a0',
  diamond:  '#5de8e8', diamondDk:'#2ab8b8',
  // UI / Misc
  torch:    '#ff8800', torchGlow:'rgba(255,140,0,0.25)',
  quartz:   '#e8e0d8', quartzDk:'#c8c0b8',
  obsidian: '#1a0a2e',
  // Museum
  marble:   '#f0ece8', marbleDk:'#d8d4d0',
  gold2:    '#c9a84c', // our classic gold
};

// ── Drawing Primitives ────────────────────────────────────────────────────────
function r(ctx, x, y, w, h, c, SX, SY) {
  ctx.fillStyle = c;
  ctx.fillRect(x * SX, y * SY, w * SX, h * SY);
}

function block(ctx, bx, by, SX, SY, main, hi, sh) {
  // One 8px block with beveled Minecraft edges
  r(ctx, bx, by, 8, 8, main, SX, SY);
  if (hi) { r(ctx, bx, by, 8, 1, hi, SX, SY); r(ctx, bx, by, 1, 8, hi, SX, SY); }
  if (sh) { r(ctx, bx, by + 7, 8, 1, sh, SX, SY); r(ctx, bx + 7, by, 1, 8, sh, SX, SY); }
}

function stoneBrick(ctx, bx, by, SX, SY, variant=0) {
  const mains = [MC.stone, MC.cobble, '#707070'];
  const mis = [MC.stoneLt, MC.cobbleLt, '#888888'];
  const shs = [MC.stoneDk, MC.cobbleDk, '#505050'];
  block(ctx, bx, by, SX, SY, mains[variant], mis[variant], shs[variant]);
  // Mortar lines
  r(ctx, bx, by + 4, 8, 1, shs[variant], SX, SY);
  const vx = (Math.floor(by / 8) % 2 === 0) ? 4 : 0;
  r(ctx, bx + vx, by, 1, 4, shs[variant], SX, SY);
}

function plankBlock(ctx, bx, by, SX, SY) {
  block(ctx, bx, by, SX, SY, MC.plank, MC.plankLt, MC.plankDk);
  r(ctx, bx, by + 4, 8, 1, MC.plankDk, SX, SY);
  r(ctx, bx, by + 2, 1, 2, MC.plankDk, SX, SY);
  r(ctx, bx, by + 5, 1, 2, MC.plankDk, SX, SY);
}

function grassBlock(ctx, bx, by, SX, SY) {
  block(ctx, bx, by, SX, SY, MC.dirt, MC.dirtDk, '#3a1a08');
  r(ctx, bx, by, 8, 2, MC.grass, SX, SY);
  r(ctx, bx, by + 2, 8, 1, MC.grassLt, SX, SY);
}

function cobbleBlock(ctx, bx, by, SX, SY) {
  block(ctx, bx, by, SX, SY, MC.cobble, MC.cobbleLt, MC.cobbleDk);
  // Irregular cracks
  r(ctx, bx + 2, by + 3, 2, 1, MC.cobbleDk, SX, SY);
  r(ctx, bx + 5, by + 1, 1, 3, MC.cobbleDk, SX, SY);
}

function glassBlock(ctx, bx, by, SX, SY) {
  r(ctx, bx, by, 8, 8, MC.glassBlue, SX, SY);
  r(ctx, bx, by, 8, 1, 'rgba(255,255,255,0.3)', SX, SY);
  r(ctx, bx, by, 1, 8, 'rgba(255,255,255,0.3)', SX, SY);
  r(ctx, bx + 3, by + 1, 2, 2, 'rgba(255,255,255,0.15)', SX, SY);
}

function glowRect(ctx, x, y, w, h, color, blur, SX) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur * SX;
  ctx.fillStyle = color;
  ctx.fillRect(x * SX, y * SX, w * SX, h * SX);
  ctx.restore();
}

// Torch: drawn at logical coords, with animated flicker
function drawTorch(ctx, tx, ty, SX, SY, t) {
  // Stick
  r(ctx, tx + 3, ty + 4, 2, 8, MC.plankDk, SX, SY);
  // Flame (animated)
  const flicker = Math.sin(t * 0.15) * 0.5 + 0.5;
  ctx.save();
  ctx.shadowColor = `rgba(255,140,0,${0.6 + flicker * 0.3})`;
  ctx.shadowBlur = 10 * SX;
  r(ctx, tx + 2, ty, 4, 5, MC.torch, SX, SY);
  r(ctx, tx + 3, ty, 2, 3, '#ffda00', SX, SY);
  ctx.restore();
  // Glow halo on wall
  ctx.save();
  const g = ctx.createRadialGradient(
    (tx + 4) * SX, (ty + 2) * SY, 0,
    (tx + 4) * SX, (ty + 2) * SY, 40 * SX
  );
  g.addColorStop(0, `rgba(255,160,0,${0.15 + flicker * 0.08})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect((tx - 30) * SX, (ty - 20) * SY, 70 * SX, 60 * SY);
  ctx.restore();
}

// Chest block (Minecraft style)
function drawChest(ctx, x, y, w, h, SX, SY, hovered, t) {
  ctx.save();
  if (hovered) { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 16 * SX; }
  r(ctx, x, y, w, h, MC.plank, SX, SY);
  r(ctx, x, y, w, 2, MC.plankLt, SX, SY);
  r(ctx, x, y + h - 2, w, 2, MC.plankDk, SX, SY);
  r(ctx, x, y + 2, w, 1, MC.log, SX, SY);  // rim
  r(ctx, x + w / 2 - 3, y + h / 2 - 3, 6, 6, MC.gold2, SX, SY); // lock
  r(ctx, x + w / 2 - 1, y + h / 2 - 1, 2, 2, MC.log, SX, SY);
  ctx.restore();
}

// ── SCENE 0: Stone Mansion ────────────────────────────────────────────────────
function drawMansion(ctx, SX, SY, t, hoveredId, used) {
  // Sky/ceiling strip
  r(ctx, 0, 0, 320, 16, '#06060f', SX, SY);

  // Back stone-brick wall
  for (let bx = 0; bx < 40; bx++) {
    for (let by = 2; by < 19; by++) {
      stoneBrick(ctx, bx * 8, by * 8, SX, SY, (bx + by) % 3);
    }
  }

  // Floor planks
  for (let bx = 0; bx < 40; bx++) {
    for (let by = 19; by < 28; by++) {
      plankBlock(ctx, bx * 8, by * 8, SX, SY);
    }
  }

  // Torches on walls
  drawTorch(ctx, 70, 88, SX, SY, t);
  drawTorch(ctx, 220, 88, SX, SY, t);

  // ── Vault door ──
  const vUsed = used.includes('footprint');
  r(ctx, 16, 24, 64, 112, '#1a1a2e', SX, SY);
  r(ctx, 20, 28, 56, 104, MC.iron, SX, SY);
  r(ctx, 22, 30, 52, 100, MC.ironDk, SX, SY);
  // Rivets
  [[24,34],[68,34],[24,120],[68,120]].forEach(([rx,ry]) => {
    r(ctx, rx, ry, 4, 4, MC.stoneLt, SX, SY);
  });
  // Lock wheel
  ctx.save();
  if (!vUsed && hoveredId === 'footprint') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 20 * SX; }
  r(ctx, 32, 64, 32, 32, '#1a1a2e', SX, SY);
  r(ctx, 34, 66, 28, 28, MC.gold2, SX, SY);
  r(ctx, 38, 70, 20, 20, '#1e1e30', SX, SY);
  r(ctx, 42, 74, 12, 12, MC.gold2, SX, SY);
  r(ctx, 45, 77, 6, 6, '#090910', SX, SY);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + t * 0.006;
    const sx2 = 48 + Math.cos(a) * 13, sy2 = 80 + Math.sin(a) * 13;
    r(ctx, sx2 - 1, sy2 - 1, 2, 2, MC.goldOre, SX, SY);
  }
  ctx.restore();
  if (vUsed) r(ctx, 20, 28, 56, 104, 'rgba(20,20,40,0.7)', SX, SY);

  // Footprints on floor
  if (!vUsed) {
    ctx.save();
    if (hoveredId === 'footprint') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 14 * SX; }
    [[20, 162], [48, 165]].forEach(([fx, fy]) => {
      r(ctx, fx, fy, 18, 8, '#3a2010', SX, SY);
      r(ctx, fx + 2, fy + 2, 14, 5, '#4a3018', SX, SY);
      [0, 4, 8, 12].forEach(tx2 => r(ctx, fx + tx2, fy - 4, 3, 5, '#3a2010', SX, SY));
    });
    if (hoveredId === 'footprint') {
      const a = 0.2 + 0.1 * Math.sin(t * 0.08);
      ctx.fillStyle = `rgba(252,250,66,${a})`;
      ctx.fillRect(15 * SX, 155 * SY, 60 * SX, 24 * SY);
    }
    ctx.restore();
  } else r(ctx, 15, 155, 60, 24, 'rgba(20,20,40,0.7)', SX, SY);

  // ── Window (center back wall) ──
  const wUsed = used.includes('window');
  if (!wUsed) {
    r(ctx, 104, 16, 96, 80, '#1a1008', SX, SY);
    r(ctx, 108, 20, 88, 72, '#281a0c', SX, SY);
    // 4 glass panes
    [[110,22,40,32],[152,22,40,32],[110,57,40,30],[152,57,40,30]].forEach(([px,py,pw,ph], i) => {
      glassBlock(ctx, px, py, SX, SY);
      glassBlock(ctx, px + 8, py, SX, SY);
      glassBlock(ctx, px + 16, py, SX, SY);
      glassBlock(ctx, px + 24, py, SX, SY);
      if (i === 1) r(ctx, px + 20, py + 5, 8, 8, 'rgba(200,220,255,0.15)', SX, SY);
    });
    r(ctx, 148, 22, 4, 68, '#281a0c', SX, SY);
    r(ctx, 108, 54, 84, 4, '#281a0c', SX, SY);
    // Crack
    ctx.save();
    if (hoveredId === 'window') { ctx.shadowColor = 'rgba(100,180,255,0.8)'; ctx.shadowBlur = 18 * SX; }
    ctx.strokeStyle = 'rgba(200,220,255,0.6)'; ctx.lineWidth = SX;
    ctx.beginPath(); ctx.moveTo(155 * SX, 24 * SY); ctx.lineTo(168 * SX, 42 * SY); ctx.lineTo(164 * SX, 54 * SY); ctx.stroke();
    ctx.restore();
  } else {
    r(ctx, 108, 20, 88, 72, 'rgba(20,20,40,0.7)', SX, SY);
    r(ctx, 110, 22, 84, 68, '#0d1020', SX, SY);
  }

  // ── Fireplace+watch (right) ──
  const watchUsed = used.includes('watch');
  r(ctx, 232, 20, 72, 96, '#1a0e08', SX, SY);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const bxf = 234 + col * 16, byf = 22 + row * 16;
      r(ctx, bxf, byf, 14, 14, row % 2 === 0 ? MC.brick : '#5a2a18', SX, SY);
    }
  }
  r(ctx, 228, 112, 80, 6, MC.plankDk, SX, SY);
  r(ctx, 228, 110, 80, 2, MC.plankLt, SX, SY);
  r(ctx, 248, 36, 40, 70, '#080808', SX, SY);
  const ea = 0.5 + 0.25 * Math.sin(t * 0.07);
  ctx.save();
  ctx.shadowColor = `rgba(255,110,20,${ea})`;
  ctx.shadowBlur = 14 * SX;
  r(ctx, 250, 90, 36, 8, '#c03010', SX, SY);
  r(ctx, 252, 86, 32, 6, `rgba(255,140,40,${ea})`, SX, SY);
  ctx.restore();
  // Watch on mantel
  if (!watchUsed) {
    ctx.save();
    if (hoveredId === 'watch') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 12 * SX; }
    const wx = 266, wy = 108;
    ctx.fillStyle = MC.gold2; ctx.beginPath(); ctx.ellipse(wx * SX, wy * SY, 7 * SX, 7 * SY, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#101020'; ctx.beginPath(); ctx.ellipse(wx * SX, wy * SY, 5 * SX, 5 * SY, 0, 0, Math.PI * 2); ctx.fill();
    const sec = t * 0.02;
    ctx.strokeStyle = MC.gold2; ctx.lineWidth = SX;
    ctx.beginPath(); ctx.moveTo(wx * SX, wy * SY); ctx.lineTo((wx + Math.cos(sec) * 4) * SX, (wy + Math.sin(sec) * 4) * SY); ctx.stroke();
    ctx.restore();
  }
  if (watchUsed) r(ctx, 232, 20, 72, 96, 'rgba(20,20,40,0.7)', SX, SY);

  // ── Desk + glove ──
  const gloveUsed = used.includes('glove');
  ctx.save();
  if (!gloveUsed && hoveredId === 'glove') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 14 * SX; }
  // Table
  r(ctx, 92, 148, 132, 44, MC.plankDk, SX, SY);
  r(ctx, 92, 148, 132, 6, MC.plankLt, SX, SY);
  // Legs
  r(ctx, 96, 192, 6, 30, MC.log, SX, SY);
  r(ctx, 212, 192, 6, 30, MC.log, SX, SY);
  // Papers
  if (!gloveUsed) {
    r(ctx, 104, 136, 28, 18, '#c8c0a0', SX, SY);
    r(ctx, 108, 132, 24, 16, '#d4cc9c', SX, SY);
    // Glove
    r(ctx, 164, 133, 22, 20, '#1e1e2e', SX, SY);
    r(ctx, 166, 131, 18, 14, '#2a2a40', SX, SY);
    r(ctx, 162, 136, 6, 8, '#1e1e2e', SX, SY);
    r(ctx, 164, 150, 22, 4, '#252538', SX, SY);
    [0, 4, 8, 12].forEach(i => r(ctx, 166 + i, 127, 3, 6, '#1e1e2e', SX, SY));
  }
  if (gloveUsed) r(ctx, 92, 148, 132, 44, 'rgba(20,20,40,0.7)', SX, SY);
  ctx.restore();

  // ── Plant + key ──
  const keyUsed = used.includes('key');
  ctx.save();
  if (!keyUsed && hoveredId === 'key') { ctx.shadowColor = '#5de8e8'; ctx.shadowBlur = 14 * SX; }
  // Pot
  r(ctx, 260, 186, 40, 4, MC.brickLt, SX, SY);
  r(ctx, 262, 190, 36, 28, MC.brick, SX, SY);
  r(ctx, 264, 192, 32, 24, MC.brickDk, SX, SY);
  // Leaves (sway)
  const sway2 = Math.sin(t * 0.04) * 3;
  [[270, 170, -15], [280, 165, 5], [275, 162, 20]].forEach(([lx, ly, ang]) => {
    ctx.save();
    ctx.translate((lx) * SX, (ly) * SY);
    ctx.rotate((ang + sway2) * Math.PI / 180);
    r(ctx, 0, -18, 12, 18, MC.leaf, SX, SY);
    r(ctx, 2, -16, 8, 14, MC.leafLt, SX, SY);
    ctx.restore();
  });
  // Key
  if (!keyUsed) {
    const kx = 264, ky = 185;
    if (hoveredId === 'key') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 12 * SX; }
    ctx.fillStyle = MC.goldOre; ctx.beginPath(); ctx.ellipse(kx * SX, ky * SY, 5 * SX, 5 * SY, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0d0d18'; ctx.beginPath(); ctx.ellipse(kx * SX, ky * SY, 3 * SX, 3 * SY, 0, 0, Math.PI * 2); ctx.fill();
    r(ctx, kx + 4, ky - 1, 14, 2, MC.gold2, SX, SY);
    r(ctx, kx + 14, ky - 2, 2, 2, MC.gold2, SX, SY);
    r(ctx, kx + 17, ky - 2, 2, 2, MC.gold2, SX, SY);
  }
  if (keyUsed) r(ctx, 258, 162, 46, 56, 'rgba(20,20,40,0.7)', SX, SY);
  ctx.restore();
}

// ── SCENE 1: Museum ───────────────────────────────────────────────────────────
function drawMuseum(ctx, SX, SY, t, hoveredId, used) {
  // Ceiling
  r(ctx, 0, 0, 320, 16, '#1a1828', SX, SY);
  // Quartz/marble back wall
  for (let bx = 0; bx < 40; bx++) {
    for (let by = 2; by < 20; by++) {
      const shade = (bx + by) % 2 === 0 ? MC.quartz : MC.quartzDk;
      block(ctx, bx * 8, by * 8, SX, SY, shade, '#f8f4f0', '#b8b4b0');
    }
  }
  // White marble floor
  for (let bx = 0; bx < 40; bx++) {
    for (let by = 20; by < 28; by++) {
      const shade = (bx + by) % 4 < 2 ? MC.marble : MC.marbleDk;
      block(ctx, bx * 8, by * 8, SX, SY, shade, '#ffffff', '#c0bcb8');
      if ((bx + by) % 8 === 0) r(ctx, bx * 8 + 3, by * 8 + 3, 2, 2, '#c0bcb8', SX, SY);
    }
  }
  // Columns
  [32, 272].forEach(cx => {
    for (let cy = 18; cy < 190; cy += 8) block(ctx, cx, cy, SX, SY, MC.marble, '#ffffff', '#b8b4b0');
    for (let cy = 18; cy < 190; cy += 8) block(ctx, cx + 8, cy, SX, SY, MC.marbleDk, '#e0dcd8', '#a0a8a0');
    r(ctx, cx, 155, 22, 6, '#d8d4d0', SX, SY);
  });
  // Spotlights from ceiling
  [90, 230].forEach(lx => {
    r(ctx, lx - 4, 0, 8, 4, '#c8c0b8', SX, SY);
    ctx.save();
    const sg = ctx.createLinearGradient(lx * SX, 4 * SY, lx * SX, 140 * SY);
    sg.addColorStop(0, `rgba(255,250,220,${0.12 + 0.04 * Math.sin(t * 0.05)})`);
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.moveTo((lx - 2) * SX, 4 * SY);
    ctx.lineTo((lx - 30) * SX, 140 * SY);
    ctx.lineTo((lx + 30) * SX, 140 * SY);
    ctx.lineTo((lx + 2) * SX, 4 * SY);
    ctx.fill();
    ctx.restore();
  });

  // Frame (the missing painting spot)
  const frameUsed = used.includes('frame');
  r(ctx, 100, 14, 120, 88, '#c8a030', SX, SY);
  r(ctx, 104, 18, 112, 80, '#b89028', SX, SY);
  if (!frameUsed) {
    r(ctx, 108, 22, 104, 72, '#1a1420', SX, SY);
    r(ctx, 112, 26, 96, 64, '#100c18', SX, SY);
    ctx.save();
    if (hoveredId === 'frame') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 18 * SX; }
    r(ctx, 130, 48, 60, 24, '#1a1428', SX, SY);
    ctx.fillStyle = '#2a2030'; ctx.font = `${7 * Math.min(SX, SY)}px monospace`;
    ctx.textAlign = 'center'; ctx.fillText('?', 160 * SX, 66 * SY);
    ctx.restore();
  } else r(ctx, 108, 22, 104, 72, 'rgba(0,0,10,0.8)', SX, SY);

  // Security camera (right wall)
  const camUsed = used.includes('camera');
  ctx.save();
  if (!camUsed && hoveredId === 'camera') { ctx.shadowColor = '#ff3030'; ctx.shadowBlur = 14 * SX; }
  r(ctx, 262, 16, 44, 42, '#282830', SX, SY);
  r(ctx, 266, 20, 36, 24, '#3a3a44', SX, SY);
  r(ctx, 270, 24, 20, 16, '#1a1a20', SX, SY);
  // Lens
  ctx.fillStyle = '#0a0a14';
  ctx.beginPath(); ctx.ellipse(286 * SX, 32 * SY, 8 * SX, 8 * SY, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a2a40';
  ctx.beginPath(); ctx.ellipse(286 * SX, 32 * SY, 5 * SX, 5 * SY, 0, 0, Math.PI * 2); ctx.fill();
  // Blink LED
  const blink = Math.floor(t / 30) % 2 === 0;
  ctx.fillStyle = camUsed ? '#333' : (blink ? '#ff0000' : '#660000');
  ctx.beginPath(); ctx.ellipse(294 * SX, 20 * SY, 3 * SX, 3 * SY, 0, 0, Math.PI * 2); ctx.fill();
  if (!camUsed) ctx.shadowColor = '#ff0000';
  ctx.restore();
  if (camUsed) r(ctx, 262, 16, 44, 42, 'rgba(0,0,10,0.7)', SX, SY);

  // Coffee area (left floor)
  const coffeeUsed = used.includes('coffee');
  ctx.save();
  if (!coffeeUsed && hoveredId === 'coffee') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 12 * SX; }
  r(ctx, 18, 162, 78, 40, '#3a2e28', SX, SY);
  r(ctx, 18, 162, 78, 4, '#4a3e38', SX, SY);
  if (!coffeeUsed) {
    r(ctx, 30, 148, 24, 18, '#6a4030', SX, SY);
    r(ctx, 32, 150, 20, 14, '#3a1808', SX, SY);
    r(ctx, 36, 144, 12, 6, '#7a5040', SX, SY);
    // Steam
    const st = Math.sin(t * 0.1) * 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = SX;
    ctx.beginPath(); ctx.moveTo(38 * SX, 142 * SY); ctx.quadraticCurveTo((40 + st) * SX, 135 * SY, 38 * SX, 128 * SY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(46 * SX, 140 * SY); ctx.quadraticCurveTo((48 - st) * SX, 133 * SY, 46 * SX, 126 * SY); ctx.stroke();
  }
  if (coffeeUsed) r(ctx, 18, 148, 78, 54, 'rgba(0,0,10,0.7)', SX, SY);
  ctx.restore();

  // Filing cabinet (right floor)
  const cabUsed = used.includes('cabinet');
  ctx.save();
  if (!cabUsed && hoveredId === 'cabinet') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 12 * SX; }
  r(ctx, 242, 150, 64, 72, '#4a4a5a', SX, SY);
  [158, 170, 182, 194].forEach(fy => r(ctx, 246, fy, 56, 10, '#5a5a6a', SX, SY));
  r(ctx, 265, 160, 8, 24, '#c8a030', SX, SY);
  if (cabUsed) r(ctx, 242, 150, 64, 72, 'rgba(0,0,10,0.7)', SX, SY);
  ctx.restore();

  // Latch (left wall exit)
  const latchUsed = used.includes('latch');
  ctx.save();
  if (!latchUsed && hoveredId === 'latch') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 12 * SX; }
  r(ctx, 18, 24, 56, 80, '#3a2a1a', SX, SY);
  r(ctx, 22, 28, 48, 72, '#4a3a2a', SX, SY);
  r(ctx, 40, 60, 12, 12, '#c8a030', SX, SY);
  r(ctx, 44, 64, 4, 8, '#1a1010', SX, SY);
  r(ctx, 22, 28, 8, 72, 'rgba(0,0,0,0.3)', SX, SY);
  if (latchUsed) r(ctx, 18, 24, 56, 80, 'rgba(0,0,10,0.7)', SX, SY);
  ctx.restore();
}

// ── SCENE 2: Minecraft Village ────────────────────────────────────────────────
function drawVillage(ctx, SX, SY, t, hoveredId, used) {
  // Night sky
  r(ctx, 0, 0, 320, 220, MC.sky, SX, SY);
  r(ctx, 0, 0, 320, 16, '#0d1840', SX, SY);
  // Stars
  [[20,4],[60,8],[140,3],[200,9],[280,5],[110,11],[240,2]].forEach(([sx,sy]) => {
    const twinkle = 0.5 + 0.5 * Math.sin(t * 0.05 + sx);
    r(ctx, sx, sy, 2, 2, `rgba(255,255,240,${twinkle})`, SX, SY);
  });
  // Moon
  ctx.save();
  ctx.fillStyle = '#e8e0c8';
  ctx.beginPath(); ctx.ellipse(290 * SX, 10 * SY, 14 * SX, 14 * SY, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = MC.sky;
  ctx.beginPath(); ctx.ellipse(296 * SX, 8 * SY, 12 * SX, 12 * SY, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Stone cottage back wall
  for (let bx = 2; bx < 38; bx++) {
    for (let by = 2; by < 18; by++) {
      const shade = (bx + by) % 3;
      stoneBrick(ctx, bx * 8, by * 8, SX, SY, shade === 0 ? 0 : (shade === 1 ? 1 : 2));
    }
  }
  // Roof
  r(ctx, 0, 14, 320, 4, MC.log, SX, SY);
  r(ctx, 0, 12, 320, 2, MC.plankDk, SX, SY);

  // Trees on sides
  [8, 296].forEach(tx => {
    r(ctx, tx - 4, 60, 8, 96, MC.log, SX, SY);
    for (let lx = -24; lx <= 24; lx += 8) {
      for (let ly = 20; ly <= 56; ly += 8) {
        if (Math.abs(lx) + Math.abs(ly - 20) < 48) block(ctx, tx + lx, ly, SX, SY, MC.leaf, MC.leafLt, '#1d5010');
      }
    }
  });

  // Grass ground (y=18-28)
  for (let bx = 0; bx < 40; bx++) {
    for (let by = 18; by < 28; by++) {
      if (by === 18) grassBlock(ctx, bx * 8, by * 8, SX, SY);
      else { r(ctx, bx * 8, by * 8, 8, 8, MC.dirt, SX, SY); }
    }
  }

  // Torches on wall
  drawTorch(ctx, 60, 100, SX, SY, t);
  drawTorch(ctx, 230, 100, SX, SY, t);

  // ── Anvil ──
  const anvilUsed = used.includes('anvil');
  ctx.save();
  if (!anvilUsed && hoveredId === 'anvil') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 14 * SX; }
  r(ctx, 22, 148, 56, 12, MC.iron, SX, SY);
  r(ctx, 28, 136, 44, 14, MC.ironDk, SX, SY);
  r(ctx, 36, 128, 28, 10, MC.iron, SX, SY);
  r(ctx, 22, 158, 56, 4, MC.stoneDk, SX, SY);
  if (!anvilUsed) r(ctx, 30, 124, 16, 4, MC.stoneDk, SX, SY); // hammer mark
  if (anvilUsed) r(ctx, 20, 124, 60, 40, 'rgba(0,0,10,0.7)', SX, SY);
  ctx.restore();

  // ── Gold pile ──
  const goldUsed = used.includes('gold');
  ctx.save();
  if (!goldUsed && hoveredId === 'gold') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 14 * SX; }
  if (!goldUsed) {
    [[122, 166, 16, 12], [138, 170, 20, 8], [126, 158, 12, 10]].forEach(([gx, gy, gw, gh]) => {
      r(ctx, gx, gy, gw, gh, MC.gold, SX, SY);
      r(ctx, gx, gy, gw, 2, '#fffca8', SX, SY);
      r(ctx, gx, gy + gh - 2, gw, 2, MC.goldOre, SX, SY);
    });
    // Sparkle
    if (Math.floor(t / 15) % 2 === 0) r(ctx, 138, 155, 4, 4, '#ffffff', SX, SY);
  }
  if (goldUsed) r(ctx, 118, 155, 65, 30, 'rgba(0,0,10,0.7)', SX, SY);
  ctx.restore();

  // ── Village chest ──
  const chestUsed = used.includes('chest');
  ctx.save();
  if (!chestUsed && hoveredId === 'chest') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 14 * SX; }
  drawChest(ctx, 196, 146, 62, 52, SX, SY, hoveredId === 'chest' && !chestUsed, t);
  if (chestUsed) r(ctx, 196, 146, 62, 52, 'rgba(0,0,10,0.7)', SX, SY);
  ctx.restore();

  // ── Market stall ──
  const stallUsed = used.includes('stall');
  ctx.save();
  if (!stallUsed && hoveredId === 'stall') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 14 * SX; }
  // Posts
  r(ctx, 256, 72, 6, 110, MC.log, SX, SY);
  r(ctx, 304, 72, 6, 110, MC.log, SX, SY);
  // Canopy
  r(ctx, 252, 68, 72, 8, '#c0392b', SX, SY);
  r(ctx, 252, 68, 72, 3, '#e74c3c', SX, SY);
  if (!stallUsed) {
    r(ctx, 258, 76, 60, 48, '#8b4513', SX, SY);
    r(ctx, 258, 76, 60, 4, '#a0522d', SX, SY);
    // Torn banner piece
    r(ctx, 295, 103, 20, 30, '#c0392b', SX, SY);
    r(ctx, 295, 103, 20, 3, '#e74c3c', SX, SY);
    r(ctx, 295, 130, 20, 4, '#7a1a0a', SX, SY);
  } else {
    r(ctx, 252, 68, 72, 116, 'rgba(0,0,10,0.7)', SX, SY);
  }
  ctx.restore();

  // ── Broken fence ──
  const fenceUsed = used.includes('fence');
  ctx.save();
  if (!fenceUsed && hoveredId === 'fence') { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 14 * SX; }
  [88, 116].forEach(fx => r(ctx, fx, 108, 6, 60, MC.plankDk, SX, SY));
  r(ctx, 88, 116, 34, 5, MC.plank, SX, SY);
  r(ctx, 88, 130, 34, 5, MC.plank, SX, SY);
  if (!fenceUsed) {
    r(ctx, 88, 142, 28, 5, MC.plank, SX, SY); // broken piece fallen
    r(ctx, 88, 148, 20, 5, MC.plankLt, SX, SY);
  }
  if (fenceUsed) r(ctx, 84, 104, 56, 72, 'rgba(0,0,10,0.7)', SX, SY);
  ctx.restore();
}

// ── BAYES-BOT (Minecraft pixel art character) ─────────────────────────────────
function drawBayesBotMC(ctx, SX, SY, t, talking) {
  const bx = 6, by = 118;
  const S = SX;
  // Antenna
  r(ctx, bx + 8, by - 18, 2, 14, MC.ironDk, SX, SY);
  const antennaGlow = talking ? MC.gold2 : '#4a4a6a';
  ctx.save();
  if (talking) { ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 8 * S; }
  r(ctx, bx + 6, by - 20, 6, 6, antennaGlow, SX, SY);
  ctx.restore();
  // Head (square! Minecraft style)
  r(ctx, bx, by - 8, 18, 18, MC.iron, SX, SY);
  r(ctx, bx + 1, by - 7, 16, 16, MC.ironDk, SX, SY);
  // Screen face
  r(ctx, bx + 2, by - 6, 14, 12, '#0a1830', SX, SY);
  // Eyes (blinking)
  const blink = t % 80 < 4;
  ctx.save();
  if (!blink) {
    ctx.shadowColor = 'rgba(50,255,255,0.8)'; ctx.shadowBlur = 5 * S;
    r(ctx, bx + 4, by - 2, 3, 3, '#40ffff', SX, SY);
    r(ctx, bx + 11, by - 2, 3, 3, '#40ffff', SX, SY);
  } else {
    r(ctx, bx + 4, by - 1, 3, 1, '#0a1830', SX, SY);
    r(ctx, bx + 11, by - 1, 3, 1, '#0a1830', SX, SY);
  }
  ctx.restore();
  // Body (square Minecraft style)
  r(ctx, bx - 2, by + 10, 22, 24, MC.stone, SX, SY);
  r(ctx, bx, by + 12, 18, 20, MC.stoneDk, SX, SY);
  r(ctx, bx + 2, by + 14, 14, 12, '#0a1830', SX, SY);
  // Chest LEDs
  const pulse = Math.floor(t * 0.1) % 3;
  [0, 1, 2].forEach(i => r(ctx, bx + 3 + i * 4, by + 19, 3, 3, i === pulse ? '#40ffff' : '#1a3a5c', SX, SY));
  // Arms
  r(ctx, bx - 8, by + 10, 6, 18, MC.cobble, SX, SY);
  r(ctx, bx + 20, by + 10, 6, 18, MC.cobble, SX, SY);
  // Legs
  r(ctx, bx + 2, by + 34, 7, 14, MC.cobbleDk, SX, SY);
  r(ctx, bx + 11, by + 34, 7, 14, MC.cobbleDk, SX, SY);
  // Feet
  r(ctx, bx, by + 48, 9, 4, MC.iron, SX, SY);
  r(ctx, bx + 10, by + 48, 9, 4, MC.iron, SX, SY);

  // Speech indicator
  if (talking) {
    ctx.save();
    ctx.shadowColor = '#fcfa42'; ctx.shadowBlur = 6 * S;
    r(ctx, bx + 19, by - 4, 12, 8, '#0a1020', SX, SY);
    r(ctx, bx + 19, by - 5, 12, 1, '#fcfa42', SX, SY);
    ctx.fillStyle = '#fcfa42'; ctx.font = `${5 * Math.min(SX, SY)}px monospace`;
    ctx.textAlign = 'center'; ctx.fillText('...', (bx + 25) * SX, (by + 2) * SY);
    ctx.restore();
  }
}

// ── HOVER LABELS ──────────────────────────────────────────────────────────────
function drawHoverLabelMC(ctx, SX, SY, spot, t) {
  const cx = spot.x + spot.w / 2;
  const cy = spot.y - 8;
  const pulse = 0.85 + 0.15 * Math.sin(t * 0.1);
  ctx.save(); ctx.globalAlpha = pulse;
  ctx.font = `bold ${Math.round(7 * Math.min(SX, SY))}px 'Press Start 2P', monospace`;
  const tw = ctx.measureText(spot.label).width;
  const px = cx * SX - tw / 2 - 5 * Math.min(SX, SY);
  const py = (cy - 10) * SY;
  const pw = tw + 10 * Math.min(SX, SY), ph = 12 * Math.min(SX, SY);
  // Minecraft inventory style: beveled border
  ctx.fillStyle = '#0d0d18';
  ctx.fillRect(px, py, pw, ph);
  ctx.strokeStyle = '#fcfa42'; ctx.lineWidth = 2 * Math.min(SX, SY);
  ctx.strokeRect(px + Math.min(SX, SY), py + Math.min(SX, SY), pw - 2 * Math.min(SX, SY), ph - 2 * Math.min(SX, SY));
  ctx.fillStyle = '#fcfa42';
  ctx.textAlign = 'center';
  ctx.fillText(spot.label, cx * SX, (cy + 1) * SY);
  ctx.restore();
}

// ── SCANLINES ─────────────────────────────────────────────────────────────────
function drawScanlines(ctx, W, H) {
  ctx.save(); ctx.globalAlpha = 0.03; ctx.fillStyle = '#000';
  for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1);
  ctx.restore();
}

// ── INTRO SCREEN ──────────────────────────────────────────────────────────────
export function drawIntroFrame(ctx, W, H, t, caseData) {
  ctx.fillStyle = '#0a0a1e'; ctx.fillRect(0, 0, W, H);
  // Pixel rain
  ctx.fillStyle = 'rgba(30,50,30,0.04)'; ctx.fillRect(0, 0, W, H);
  drawScanlines(ctx, W, H);
  const cx = W / 2, cy = H / 2;

  // Pixelated border (Minecraft style)
  const bw = 8, bs = 16;
  for (let x = 0; x < W; x += bs) {
    ctx.fillStyle = x % (bs * 2) === 0 ? MC.grass : MC.grassLt;
    ctx.fillRect(x, 0, bs, bw);
    ctx.fillRect(x, H - bw, bs, bw);
  }
  for (let y = bw; y < H - bw; y += bs) {
    ctx.fillStyle = y % (bs * 2) === 0 ? MC.stone : MC.stoneDk;
    ctx.fillRect(0, y, bw, bs);
    ctx.fillRect(W - bw, y, bw, bs);
  }

  // Case icon (bouncing)
  const bounce = Math.sin(t * 0.06) * 8;
  ctx.font = `${H * 0.1}px serif`; ctx.textAlign = 'center';
  ctx.fillText(caseData.icon, cx, cy - H * 0.2 + bounce);

  // Title
  ctx.save();
  ctx.shadowColor = MC.gold; ctx.shadowBlur = 20;
  ctx.font = `bold ${Math.round(H * 0.06)}px 'Press Start 2P', monospace`;
  ctx.fillStyle = MC.gold; ctx.textAlign = 'center';
  ctx.fillText('BAYES NOIR', cx, cy - H * 0.06);
  ctx.restore();

  ctx.fillStyle = '#5c8a00';
  ctx.font = `${Math.round(H * 0.028)}px 'Press Start 2P', monospace`;
  ctx.fillText(caseData.title.toUpperCase(), cx, cy + H * 0.04);

  ctx.fillStyle = '#4a4a6a';
  ctx.font = `${Math.round(H * 0.022)}px monospace`;
  ctx.fillText(caseData.subtitle, cx, cy + H * 0.09);

  if (Math.floor(t / 30) % 2 === 0) {
    ctx.shadowColor = MC.green; ctx.shadowBlur = 10;
    ctx.fillStyle = '#31c84a';
    ctx.font = `${Math.round(H * 0.025)}px 'Press Start 2P', monospace`;
    ctx.fillText('▶ CLICK TO INVESTIGATE', cx, cy + H * 0.22);
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#2a2a3a';
  ctx.font = `${Math.round(H * 0.018)}px monospace`;
  ctx.fillText('BAYESIAN INFERENCE · FUZZY LOGIC · UNCERTAINTY MODELING', cx, H - bw - 10);
}

// ── MAIN DRAW FRAME ───────────────────────────────────────────────────────────
export function drawFrame(ctx, W, H, SX, SY, { hoveredId, time, usedClueIds, caseIndex }) {
  if (!SY) SY = SX;
  ctx.clearRect(0, 0, W, H);

  const t = time;
  const used = usedClueIds || [];
  const ci = caseIndex || 0;

  // Draw case-specific scene
  if (ci === 0) drawMansion(ctx, SX, SY, t, hoveredId, used);
  else if (ci === 1) drawMuseum(ctx, SX, SY, t, hoveredId, used);
  else drawVillage(ctx, SX, SY, t, hoveredId, used);

  // BayesBot
  drawBayesBotMC(ctx, SX, SY, t, hoveredId !== null && hoveredId !== undefined);

  // Hover label
  if (hoveredId) {
    const { CASES } = { CASES: null };
    // Get hotspot from the case's hotspot data (passed via usedClueIds context)
    // We'll find the hovered spot from the global HOTSPOTS set on state
    drawScanlines(ctx, W, H);
    return;
  }

  drawScanlines(ctx, W, H);
}

export { drawHoverLabelMC };
