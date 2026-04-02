/**
 * BAYES NOIR — Pixel Art Game Renderer
 * Pure canvas drawing — no React imports.
 * Logical canvas: 320 × 220 units, scaled by S.
 */

// ── Palette ──────────────────────────────────────────────────────────────────
export const C = {
  bg:         '#04040a', ceil:      '#06060f',
  wall:       '#0f0f1e', wallMid:   '#141426', wallLight: '#1c1c2e',
  stone1:     '#181828', stone2:    '#1e1e30',
  floorDk:    '#100a04', floorMid:  '#180e06', floorLt:   '#22140a',
  gold:       '#c9a84c', goldLt:    '#e6c97a', goldDk:    '#8a6a20',
  steel:      '#252538', steelLt:   '#353550', steelHi:   '#454568',
  wood:       '#2e1e08', woodLt:    '#3e2e12',
  clay:       '#5a2a10', leaf:      '#1a4020', leafLt:    '#2a6030',
  brick1:     '#2a1010', brick2:    '#201818',
  glassBlue:  '#0d1830', glassMoon: 'rgba(120,160,220,0.18)',
  botHead:    '#c9a84c', botBody:   '#1a3060', botEye:    '#40ffff',
  botScreen:  '#0a1830',
  gGold:      'rgba(201,168,76,0.4)',     gBlue: 'rgba(80,140,255,0.4)',
  gGreen:     'rgba(40,180,80,0.4)',      gRed:  'rgba(200,50,50,0.35)',
  used:       'rgba(20,20,40,0.65)',
};

// ── Primitives ────────────────────────────────────────────────────────────────
const R = (x, y, w, h, c, ctx, SX, SY) => {
  ctx.fillStyle = c; ctx.fillRect(x*SX, y*SY, w*SX, h*SY);
};
const Circle = (cx, cy, r, c, ctx, SX, SY) => {
  ctx.fillStyle = c; ctx.beginPath();
  ctx.ellipse(cx*SX, cy*SY, r*SX, r*SY, 0, 0, Math.PI*2); ctx.fill();
};
const Line = (x1,y1,x2,y2,c,lw,ctx,SX,SY) => {
  ctx.strokeStyle=c; ctx.lineWidth=lw*Math.min(SX,SY);
  ctx.beginPath(); ctx.moveTo(x1*SX,y1*SY); ctx.lineTo(x2*SX,y2*SY); ctx.stroke();
};
function glow(ctx, color, blur, SX, fn) {
  ctx.save(); ctx.shadowColor=color; ctx.shadowBlur=blur*SX; fn(); ctx.restore();
}

// ── HOTSPOTS (logical coords) ─────────────────────────────────────────────────
export const HOTSPOTS = [
  { id:'footprint', x:20, y:155, w:55, h:28, label:'👣 Footprint', clue:'footprint' },
  { id:'window',    x:108,y:18,  w:88, h:72, label:'🪟 Window',    clue:'window'    },
  { id:'watch',     x:230,y:22,  w:70, h:88, label:'⌚ Watch',     clue:'watch'     },
  { id:'glove',     x:96, y:155, w:120,h:42, label:'🧤 Glove',     clue:'glove'     },
  { id:'key',       x:258,y:160, w:42, h:45, label:'🗝 Key',        clue:'key'       },
];

// ── Hit test ──────────────────────────────────────────────────────────────────
export function hitTest(mx, my, S) {
  const lx = mx/S, ly = my/S;
  return HOTSPOTS.find(h => lx>=h.x && lx<=h.x+h.w && ly>=h.y && ly<=h.y+h.h) || null;
}

// ── ROOM SECTIONS ─────────────────────────────────────────────────────────────
function drawCeiling(ctx, S) {
  R(0,0,320,16,C.ceil,ctx,S);
  R(0,14,320,2,'#0a0a18',ctx,S);
  // Two lamp fixtures
  [90,230].forEach(lx => {
    R(lx-6,0,12,4,'#181828',ctx,S);
    glow(ctx,'rgba(255,245,180,0.9)',18,S,()=>{ Circle(lx,8,4,'#fffce0',ctx,S); });
    // Glow halo on wall
    ctx.save();
    const g=ctx.createRadialGradient(lx*S,12*S,0,lx*S,12*S,55*S);
    g.addColorStop(0,'rgba(255,240,160,0.10)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect((lx-55)*S,10*S,110*S,60*S);
    ctx.restore();
  });
}

function drawBrickWall(ctx, S) {
  R(0,16,320,138,C.wall,ctx,S);
  const BH=14, BW=26;
  for(let row=0;row<10;row++){
    const y=16+row*BH, off=(row%2)*13;
    const bc = row%3===0 ? C.stone1 : row%3===1 ? C.stone2 : C.wallMid;
    for(let col=-1;col<14;col++){
      const x=col*BW+off;
      R(x+1,y+1,BW-2,BH-2,bc,ctx,S);
    }
  }
  // Top fade
  ctx.save();
  const g=ctx.createLinearGradient(0,16*S,0,30*S);
  g.addColorStop(0,'rgba(0,0,0,0.6)'); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.fillRect(0,16*S,320*S,14*S); ctx.restore();
  // Baseboard
  R(0,152,320,4,'#1a0e06',ctx,S);
  R(0,152,320,1,'#2a1a0a',ctx,S);
}

function drawFloor(ctx, S) {
  R(0,156,320,64,C.floorDk,ctx,S);
  for(let y=156;y<220;y+=7){
    const t=(y-156)/64;
    const col = t<0.3?C.floorMid:t<0.6?C.floorLt:'#2a180c';
    R(0,y,320,6,col,ctx,S);
    R(0,y+6,320,1,C.floorDk,ctx,S);
    // Grain
    for(let x=15+((y*7)%30);x<320;x+=35+(y%4)*6)
      R(x,y,1,6,C.floorDk,ctx,S);
  }
  // Wall-floor shadow
  ctx.save();
  const sg=ctx.createLinearGradient(0,153*S,0,165*S);
  sg.addColorStop(0,'rgba(0,0,0,0.5)'); sg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sg; ctx.fillRect(0,153*S,320*S,12*S); ctx.restore();
}

// ── CLUE OBJECTS ──────────────────────────────────────────────────────────────

function drawVault(ctx, S, hovered, used, t) {
  const vx=20, vy=22, vw=58, vh=120;
  // Door
  ctx.save();
  if(hovered&&!used){ ctx.shadowColor=C.gGold; ctx.shadowBlur=20*S; }
  R(vx-2,vy-2,vw+4,vh+4,'#0d0d18',ctx,S);
  R(vx,vy,vw,vh,C.steel,ctx,S);
  R(vx+3,vy+3,vw-6,vh-6,'#2e2e48',ctx,S);
  // Rivets
  [[vx+6,vy+7],[vx+vw-6,vy+7],[vx+6,vy+vh-8],[vx+vw-6,vy+vh-8]].forEach(([rx,ry])=>{
    Circle(rx,ry,3,'#3a3a55',ctx,S); Circle(rx-1,ry-1,1,'#5a5a80',ctx,S);
  });
  // Lock wheel
  const lx=vx+29, ly=vy+62;
  Circle(lx,ly,18,C.goldDk,ctx,S);
  Circle(lx,ly,15,'#1e1e30',ctx,S);
  Circle(lx,ly,9,C.gold,ctx,S);
  Circle(lx,ly,4,'#141420',ctx,S);
  for(let i=0;i<6;i++){
    const a=(i/6)*Math.PI*2+t*0.008;
    Line(lx,ly,lx+Math.cos(a)*14,ly+Math.sin(a)*14,C.goldDk,2,ctx,S);
  }
  // Handle
  R(vx+vw-10,vy+55,8,16,C.steelLt,ctx,S);
  R(vx+vw-8,vy+57,4,12,C.goldDk,ctx,S);
  ctx.restore();
  // Footprint on floor
  drawFootprint(ctx,S,hovered,used,t);
}

function drawFootprint(ctx, S, hovered, used, t) {
  const fx=20,fy=157;
  if(used){ R(fx-2,fy-2,58,25,C.used,ctx,S); return; }
  ctx.save();
  if(hovered){ ctx.shadowColor=C.gGold; ctx.shadowBlur=14*S; }
  // Two prints
  [[fx,fy],[fx+28,fy+3]].forEach(([px2,py2])=>{
    R(px2,py2,18,9,'#3a2410',ctx,S);
    R(px2+2,py2+2,14,6,'#4a3018',ctx,S);
    for(let t2=0;t2<4;t2++) R(px2+t2*4,py2-4,3,5,'#3a2410',ctx,S);
  });
  if(hovered){
    const a=0.25+0.12*Math.sin(t*0.08);
    ctx.fillStyle=`rgba(201,168,76,${a})`;
    ctx.fillRect((fx-4)*S,(fy-5)*S,60*S,28*S);
  }
  ctx.restore();
}

function drawWindow(ctx, S, hovered, used, t) {
  const wx=108, wy=18, ww=88, wh=72;
  ctx.save();
  if(hovered&&!used){ ctx.shadowColor='rgba(100,160,255,0.6)'; ctx.shadowBlur=22*S; }
  // Frame
  R(wx-4,wy-4,ww+8,wh+8,'#1e1008',ctx,S);
  R(wx,wy,ww,wh,'#281a0c',ctx,S);
  // Panes
  const panes=[[wx+3,wy+3,40,32],[wx+46,wy+3,39,32],[wx+3,wy+38,40,29],[wx+46,wy+38,39,29]];
  panes.forEach(([px2,py2,pw,ph],i)=>{
    R(px2,py2,pw,ph,i===1?'rgba(60,80,130,0.5)':C.glassBlue,ctx,S);
    // Moonlight glow
    ctx.save();
    const g=ctx.createRadialGradient(
      (px2+pw/2)*S,(py2+ph/2)*S,0,(px2+pw/2)*S,(py2+ph/2)*S,pw*S
    );
    g.addColorStop(0,C.glassMoon); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(px2*S,py2*S,pw*S,ph*S); ctx.restore();
  });
  // Dividers
  R(wx+42,wy+3,4,wh-6,'#281a0c',ctx,S);
  R(wx+3,wy+34,ww-6,4,'#281a0c',ctx,S);
  // Crack on top-right pane
  if(!used){
    ctx.strokeStyle='rgba(200,220,255,0.5)'; ctx.lineWidth=S;
    ctx.beginPath(); ctx.moveTo(146*S,23*S); ctx.lineTo(159*S,40*S);
    ctx.lineTo(155*S,52*S); ctx.stroke();
    // Shards on floor
    [[112,153],[116,157],[119,152]].forEach(([sx,sy])=>{
      R(sx,sy,3,2,'rgba(200,220,255,0.25)',ctx,S);
    });
  }
  if(used) R(wx,wy,ww,wh,C.used,ctx,S);
  ctx.restore();
}

function drawFireplace(ctx, S, hovered, used, t) {
  const fx=232, fy=20, fw=70, fh=95;
  ctx.save();
  if(hovered&&!used){ ctx.shadowColor='rgba(200,120,40,0.6)'; ctx.shadowBlur=20*S; }
  // Brick surround
  R(fx-4,fy-4,fw+8,fh+10,'#1a0e08',ctx,S);
  for(let row=0;row<7;row++){
    const by=fy+row*14, off=(row%2)*8;
    for(let col=-1;col<4;col++){
      const bx=fx+col*20+off;
      if(bx<fx||bx>fx+fw) continue; // don't draw outside
      R(bx,by,18,12,row%2===0?C.brick1:C.brick2,ctx,S);
    }
  }
  // Mantel shelf
  R(fx-6,fy+fh-4,fw+12,6,'#2a1a08',ctx,S);
  R(fx-6,fy+fh-6,fw+12,2,'#3a2a10',ctx,S);
  // Firebox
  R(fx+8,fy+20,fw-16,fh-32,'#0a0808',ctx,S);
  // Ember glow
  const emberA=0.5+0.25*Math.sin(t*0.07);
  glow(ctx,`rgba(220,100,30,${emberA})`,12,S,()=>{
    R(fx+8,fy+fh-32,fw-16,8,'#c03010',ctx,S);
    R(fx+12,fy+fh-36,fw-24,6,`rgba(255,160,40,${emberA})`,ctx,S);
  });
  // Watch on mantel
  drawWatch(ctx,S,fx+fw/2+8,fy+fh-6,hovered,used,t);
  if(used) R(fx,fy,fw,fh+4,C.used,ctx,S);
  ctx.restore();
}

function drawWatch(ctx,S,cx,cy,hovered,used,t){
  if(used) return;
  ctx.save();
  if(hovered){ ctx.shadowColor=C.gGold; ctx.shadowBlur=12*S; }
  Circle(cx,cy-5,7,C.goldDk,ctx,S);
  Circle(cx,cy-5,5,'#101020',ctx,S);
  Circle(cx,cy-5,4.5,'#1a1a30',ctx,S);
  // Clock hands
  const sec=t*0.02;
  Line(cx,cy-5,cx+Math.cos(sec)*3,cy-5+Math.sin(sec)*3,C.goldLt,1,ctx,S);
  Line(cx,cy-5,cx+Math.cos(sec*0.5)*2,cy-5+Math.sin(sec*0.5)*2,'#ffffff',1,ctx,S);
  // Chain
  Line(cx-3,cy-5,cx-6,cy+2,C.goldDk,1,ctx,S);
  ctx.restore();
}

function drawDesk(ctx, S, hovered, used, t) {
  const dx=96, dy=154, dw=120, dh=38;
  ctx.save();
  if(hovered&&!used){ ctx.shadowColor=C.gGold; ctx.shadowBlur=14*S; }
  // Legs
  [[dx+5,dy+dh-2],[dx+dw-10,dy+dh-2]].forEach(([lx,ly])=>{
    R(lx,ly,5,26,C.wood,ctx,S);
    R(lx+1,ly,3,25,C.woodLt,ctx,S);
  });
  // Tabletop
  R(dx,dy,dw,dh,C.wood,ctx,S);
  R(dx,dy,dw,4,C.woodLt,ctx,S);
  R(dx,dy+2,dw,1,'#4a3412',ctx,S);
  // Papers
  if(!used){
    R(dx+8,dy+6,24,14,'#c8c0a0',ctx,S);
    R(dx+14,dy+4,20,12,'#d4cc9c',ctx,S);
  }
  // Glove
  drawGlove(ctx,S,dx+60,dy+5,hovered,used,t);
  if(used) R(dx,dy,dw,dh,C.used,ctx,S);
  ctx.restore();
}

function drawGlove(ctx,S,gx,gy,hovered,used,t){
  if(used) return;
  ctx.save();
  if(hovered){ ctx.shadowColor=C.gGold; ctx.shadowBlur=10*S; }
  // Palm
  R(gx,gy+6,20,14,'#1e1e2e',ctx,S);
  R(gx+2,gy+8,16,10,'#2a2a40',ctx,S);
  // Fingers
  for(let i=0;i<4;i++) R(gx+2+i*4,gy,3,8,'#1e1e2e',ctx,S);
  // Thumb
  R(gx-3,gy+7,5,6,'#1e1e2e',ctx,S);
  // Cuff
  R(gx,gy+18,20,5,'#252538',ctx,S);
  ctx.restore();
}

function drawPlant(ctx, S, hovered, used, t) {
  const px2=258,py2=160;
  ctx.save();
  if(hovered&&!used){ ctx.shadowColor=C.gGreen; ctx.shadowBlur=14*S; }
  // Pot
  R(px2+2,py2+26,36,6,'#3a1a08',ctx,S); // rim
  R(px2+5,py2+32,30,24,C.clay,ctx,S);
  R(px2+4,py2+30,32,5,C.clay,ctx,S);
  R(px2+7,py2+32,26,22,'#6a3a18',ctx,S);
  R(px2+5,py2+54,30,3,'#3a1a08',ctx,S);
  // Soil
  R(px2+5,py2+30,30,5,'#2a1808',ctx,S);
  // Leaves (waving)
  const sway=Math.sin(t*0.04)*1.5;
  [[px2+18,py2+28,10,20,-20],[px2+18,py2+28,10,18,18],[px2+18,py2+28,8,22,0]].forEach(([lx,ly,lw,lh,angle])=>{
    ctx.save();
    ctx.translate(lx*S,ly*S);
    ctx.rotate((angle+sway)*Math.PI/180);
    R(0,-lh,lw,lh,C.leaf,ctx,S);
    R(1,-lh+2,lw-2,lh-4,C.leafLt,ctx,S);
    ctx.restore();
  });
  // Key peeking from soil
  drawKey(ctx,S,px2+8,py2+26,hovered,used,t);
  if(used) R(px2,py2+26,42,34,C.used,ctx,S);
  ctx.restore();
}

function drawKey(ctx,S,kx,ky,hovered,used,t){
  if(used) return;
  ctx.save();
  if(hovered){ ctx.shadowColor=C.gGold; ctx.shadowBlur=12*S; }
  Circle(kx,ky,5,C.goldDk,ctx,S);
  Circle(kx,ky,3,'#0d0d18',ctx,S);
  R(kx+4,ky-1,14,2,C.gold,ctx,S);
  R(kx+14,ky-3,2,2,C.gold,ctx,S);
  R(kx+17,ky-3,2,2,C.gold,ctx,S);
  ctx.restore();
}

// ── BAYES-BOT ─────────────────────────────────────────────────────────────────
export function drawBayesBot(ctx, SX, SY, t, talking) {
  const bx=6, by=120;
  const S=SX;
  // Antenna
  Line(bx+9,by-8,bx+9,by-18,C.steel,2,ctx,SX,SY);
  Circle(bx+9,by-19,3,talking?C.gold:C.steelHi,ctx,SX,SY);
  if(talking) glow(ctx,C.gGold,10,S,()=>Circle(bx+9,by-19,3,C.gold,ctx,SX,SY));
  R(bx,by-8,18,16,C.steel,ctx,SX,SY);
  R(bx+1,by-7,16,14,C.steelLt,ctx,SX,SY);
  R(bx+2,by-6,14,10,C.botScreen,ctx,SX,SY);
  const blink=(t%80<4);
  if(!blink){
    glow(ctx,'rgba(50,255,255,0.8)',5,S,()=>{
      Circle(bx+6,by-2,2,C.botEye,ctx,SX,SY);
      Circle(bx+12,by-2,2,C.botEye,ctx,SX,SY);
    });
  }else{
    R(bx+4,by-3,4,1,'#113',ctx,SX,SY);
    R(bx+10,by-3,4,1,'#113',ctx,SX,SY);
  }
  if(talking){
    const mOff=Math.sin(t*0.3)*1;
    ctx.strokeStyle=C.botEye; ctx.lineWidth=Math.min(SX,SY);
    ctx.beginPath();
    ctx.moveTo((bx+4)*SX,(by+3+mOff)*SY);
    ctx.quadraticCurveTo((bx+9)*SX,(by+5)*SY,(bx+14)*SX,(by+3-mOff)*SY);
    ctx.stroke();
  }else{ R(bx+4,by+3,10,1,C.steelHi,ctx,SX,SY); }
  R(bx-2,by+8,22,20,C.botBody,ctx,SX,SY);
  R(bx,by+10,18,16,C.steelLt,ctx,SX,SY);
  R(bx+2,by+12,14,10,C.botScreen,ctx,SX,SY);
  const panelPulse=(t%30)/30;
  for(let i=0;i<3;i++){
    const bc=i===(Math.floor(panelPulse*3))?C.botEye:'#1a3a5c';
    R(bx+3+i*4,by+17,3,2,bc,ctx,SX,SY);
  }
  R(bx-6,by+9,5,12,'#1e1e34',ctx,SX,SY);
  R(bx+22,by+9,5,12,'#1e1e34',ctx,SX,SY);
  R(bx+2,by+28,6,12,'#1e1e34',ctx,SX,SY);
  R(bx+12,by+28,6,12,'#1e1e34',ctx,SX,SY);
  R(bx,by+40,10,4,'#252538',ctx,SX,SY);
  R(bx+10,by+40,10,4,'#252538',ctx,SX,SY);
}

// ── HOTSPOT HOVER LABELS ──────────────────────────────────────────────────────
function drawHoverLabel(ctx, S, spot, t) {
  const cx = spot.x + spot.w/2;
  const cy = spot.y - 6;
  const pulse = 0.85 + 0.15*Math.sin(t*0.1);
  ctx.save();
  ctx.globalAlpha = pulse;
  // Background pill
  const text = spot.label;
  ctx.font = `bold ${8*S}px monospace`;
  const tw = ctx.measureText(text).width;
  const px2 = cx*S - tw/2 - 5*S;
  const py2 = (cy-9)*S;
  const pw = tw + 10*S, ph = 11*S;
  ctx.fillStyle = 'rgba(10,10,20,0.88)';
  ctx.beginPath();
  ctx.roundRect(px2, py2, pw, ph, 3*S);
  ctx.fill();
  ctx.strokeStyle = C.gold; ctx.lineWidth = S;
  ctx.stroke();
  ctx.fillStyle = C.goldLt;
  ctx.textAlign = 'center';
  ctx.fillText(text, cx*S, (cy+1)*S);
  ctx.restore();
}

// ── SCANLINE OVERLAY ──────────────────────────────────────────────────────────
export function drawScanlines(ctx, W, H) {
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#000000';
  for(let y=0;y<H;y+=2) ctx.fillRect(0,y,W,1);
  ctx.restore();
}

// ── MAIN FRAME ────────────────────────────────────────────────────────────────
export function drawFrame(ctx, W, H, SX, SY, { hoveredId, time, usedClueIds }) {
  if(!SY) { SY = SX; } // backwards compat: if called with single S
  ctx.clearRect(0,0,W,H);

  // Draw all room sections — each primitive now uses SX,SY pair
  // Ceiling
  R(0,0,320,16,C.ceil,ctx,SX,SY);
  R(0,14,320,2,'#0a0a18',ctx,SX,SY);
  [90,230].forEach(lx => {
    R(lx-6,0,12,4,'#181828',ctx,SX,SY);
    glow(ctx,'rgba(255,245,180,0.9)',18,SX,()=>{ Circle(lx,8,4,'#fffce0',ctx,SX,SY); });
    ctx.save();
    const g=ctx.createRadialGradient(lx*SX,12*SY,0,lx*SX,12*SY,55*SX);
    g.addColorStop(0,'rgba(255,240,160,0.10)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect((lx-55)*SX,10*SY,110*SX,60*SY);
    ctx.restore();
  });

  // Brick wall
  R(0,16,320,138,C.wall,ctx,SX,SY);
  const BH=14,BW=26;
  for(let row=0;row<10;row++){
    const y=16+row*BH, off=(row%2)*13;
    const bc=row%3===0?C.stone1:row%3===1?C.stone2:C.wallMid;
    for(let col=-1;col<14;col++) R(col*BW+off+1,y+1,BW-2,BH-2,bc,ctx,SX,SY);
  }
  ctx.save();
  const wg=ctx.createLinearGradient(0,16*SY,0,30*SY);
  wg.addColorStop(0,'rgba(0,0,0,0.6)'); wg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=wg; ctx.fillRect(0,16*SY,320*SX,14*SY); ctx.restore();
  R(0,152,320,4,'#1a0e06',ctx,SX,SY);

  // Floor
  R(0,156,320,64,C.floorDk,ctx,SX,SY);
  for(let y=156;y<220;y+=7){
    const tfl=(y-156)/64;
    R(0,y,320,6,tfl<0.3?C.floorMid:tfl<0.6?C.floorLt:'#2a180c',ctx,SX,SY);
    R(0,y+6,320,1,C.floorDk,ctx,SX,SY);
    for(let x=15+((y*7)%30);x<320;x+=35+(y%4)*6) R(x,y,1,6,C.floorDk,ctx,SX,SY);
  }
  ctx.save();
  const sg=ctx.createLinearGradient(0,153*SY,0,165*SY);
  sg.addColorStop(0,'rgba(0,0,0,0.5)'); sg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sg; ctx.fillRect(0,153*SY,320*SX,12*SY); ctx.restore();

  // Side wall strips
  R(0,0,20,220,C.wall,ctx,SX,SY); R(0,16,20,136,C.wallMid,ctx,SX,SY);
  R(300,0,20,220,C.wall,ctx,SX,SY); R(300,16,20,136,C.wallMid,ctx,SX,SY);

  const t = time;
  const used = usedClueIds || [];
  const S = SX; // single scale for shadow blur

  // Vault + footprint
  {
    const vx=20,vy=22,vw=58,vh=120;
    ctx.save();
    if(hoveredId==='footprint'&&!used.includes('footprint')){ ctx.shadowColor=C.gGold; ctx.shadowBlur=20*S; }
    R(vx-2,vy-2,vw+4,vh+4,'#0d0d18',ctx,SX,SY);
    R(vx,vy,vw,vh,C.steel,ctx,SX,SY);
    R(vx+3,vy+3,vw-6,vh-6,'#2e2e48',ctx,SX,SY);
    [[vx+6,vy+7],[vx+vw-6,vy+7],[vx+6,vy+vh-8],[vx+vw-6,vy+vh-8]].forEach(([rx,ry])=>{
      Circle(rx,ry,3,'#3a3a55',ctx,SX,SY); Circle(rx-1,ry-1,1,'#5a5a80',ctx,SX,SY);
    });
    const lx2=vx+29,ly2=vy+62;
    Circle(lx2,ly2,18,C.goldDk,ctx,SX,SY);
    Circle(lx2,ly2,15,'#1e1e30',ctx,SX,SY);
    Circle(lx2,ly2,9,C.gold,ctx,SX,SY);
    Circle(lx2,ly2,4,'#141420',ctx,SX,SY);
    for(let i=0;i<6;i++){
      const a=(i/6)*Math.PI*2+t*0.008;
      Line(lx2,ly2,lx2+Math.cos(a)*14,ly2+Math.sin(a)*14,C.goldDk,2,ctx,SX,SY);
    }
    R(vx+vw-10,vy+55,8,16,C.steelLt,ctx,SX,SY);
    R(vx+vw-8,vy+57,4,12,C.goldDk,ctx,SX,SY);
    ctx.restore();
    // Footprint on floor
    if(!used.includes('footprint')){
      const fx=20,fy=157;
      ctx.save();
      if(hoveredId==='footprint'){ ctx.shadowColor=C.gGold; ctx.shadowBlur=14*S; }
      [[fx,fy],[fx+28,fy+3]].forEach(([px2,py2])=>{
        R(px2,py2,18,9,'#3a2410',ctx,SX,SY);
        R(px2+2,py2+2,14,6,'#4a3018',ctx,SX,SY);
        for(let tt=0;tt<4;tt++) R(px2+tt*4,py2-4,3,5,'#3a2410',ctx,SX,SY);
      });
      if(hoveredId==='footprint'){
        const a=0.25+0.12*Math.sin(t*0.08);
        ctx.fillStyle=`rgba(201,168,76,${a})`;
        ctx.fillRect(16*SX,152*SY,60*SX,28*SY);
      }
      ctx.restore();
    } else { R(18,155,60,26,C.used,ctx,SX,SY); }
  }

  // Window
  {
    const wx=108,wy=18,ww=88,wh=72;
    ctx.save();
    if(hoveredId==='window'&&!used.includes('window')){ ctx.shadowColor='rgba(100,160,255,0.6)'; ctx.shadowBlur=22*S; }
    R(wx-4,wy-4,ww+8,wh+8,'#1e1008',ctx,SX,SY);
    R(wx,wy,ww,wh,'#281a0c',ctx,SX,SY);
    [[wx+3,wy+3,40,32],[wx+46,wy+3,39,32],[wx+3,wy+38,40,29],[wx+46,wy+38,39,29]].forEach(([px2,py2,pw,ph],i)=>{
      R(px2,py2,pw,ph,i===1?'rgba(60,80,130,0.5)':C.glassBlue,ctx,SX,SY);
      ctx.save();
      const gg=ctx.createRadialGradient((px2+pw/2)*SX,(py2+ph/2)*SY,0,(px2+pw/2)*SX,(py2+ph/2)*SY,pw*SX);
      gg.addColorStop(0,C.glassMoon); gg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gg; ctx.fillRect(px2*SX,py2*SY,pw*SX,ph*SY); ctx.restore();
    });
    R(wx+42,wy+3,4,wh-6,'#281a0c',ctx,SX,SY);
    R(wx+3,wy+34,ww-6,4,'#281a0c',ctx,SX,SY);
    if(!used.includes('window')){
      ctx.strokeStyle='rgba(200,220,255,0.5)'; ctx.lineWidth=Math.min(SX,SY);
      ctx.beginPath(); ctx.moveTo(146*SX,23*SY); ctx.lineTo(159*SX,40*SY); ctx.lineTo(155*SX,52*SY); ctx.stroke();
    }
    if(used.includes('window')) R(wx,wy,ww,wh,C.used,ctx,SX,SY);
    ctx.restore();
  }

  // Fireplace + watch
  {
    const fx2=232,fy2=20,fw=70,fh=95;
    ctx.save();
    if(hoveredId==='watch'&&!used.includes('watch')){ ctx.shadowColor='rgba(200,120,40,0.6)'; ctx.shadowBlur=20*S; }
    R(fx2-4,fy2-4,fw+8,fh+10,'#1a0e08',ctx,SX,SY);
    for(let row=0;row<7;row++){
      const by2=fy2+row*14,off=(row%2)*8;
      for(let col=-1;col<4;col++){
        const bx2=fx2+col*20+off;
        if(bx2<fx2||bx2>fx2+fw) continue;
        R(bx2,by2,18,12,row%2===0?C.brick1:C.brick2,ctx,SX,SY);
      }
    }
    R(fx2-6,fy2+fh-4,fw+12,6,'#2a1a08',ctx,SX,SY);
    R(fx2-6,fy2+fh-6,fw+12,2,'#3a2a10',ctx,SX,SY);
    R(fx2+8,fy2+20,fw-16,fh-32,'#0a0808',ctx,SX,SY);
    const emberA=0.5+0.25*Math.sin(t*0.07);
    glow(ctx,`rgba(220,100,30,${emberA})`,12,S,()=>{
      R(fx2+8,fy2+fh-32,fw-16,8,'#c03010',ctx,SX,SY);
      R(fx2+12,fy2+fh-36,fw-24,6,`rgba(255,160,40,${emberA})`,ctx,SX,SY);
    });
    // Watch
    if(!used.includes('watch')){
      const cx2=fx2+fw/2+8,cy2=fy2+fh-6;
      if(hoveredId==='watch'){ ctx.shadowColor=C.gGold; ctx.shadowBlur=12*S; }
      Circle(cx2,cy2-5,7,C.goldDk,ctx,SX,SY);
      Circle(cx2,cy2-5,5,'#101020',ctx,SX,SY);
      Circle(cx2,cy2-5,4.5,'#1a1a30',ctx,SX,SY);
      const sec=t*0.02;
      Line(cx2,cy2-5,cx2+Math.cos(sec)*3,cy2-5+Math.sin(sec)*3,C.goldLt,1,ctx,SX,SY);
      Line(cx2,cy2-5,cx2+Math.cos(sec*.5)*2,cy2-5+Math.sin(sec*.5)*2,'#fff',1,ctx,SX,SY);
    }
    if(used.includes('watch')) R(fx2,fy2,fw,fh+4,C.used,ctx,SX,SY);
    ctx.restore();
  }

  // Desk + glove
  {
    const dx=96,dy=154,dw=120,dh=38;
    ctx.save();
    if(hoveredId==='glove'&&!used.includes('glove')){ ctx.shadowColor=C.gGold; ctx.shadowBlur=14*S; }
    [[dx+5,dy+dh-2],[dx+dw-10,dy+dh-2]].forEach(([lx3,ly3])=>{
      R(lx3,ly3,5,26,C.wood,ctx,SX,SY); R(lx3+1,ly3,3,25,C.woodLt,ctx,SX,SY);
    });
    R(dx,dy,dw,dh,C.wood,ctx,SX,SY);
    R(dx,dy,dw,4,C.woodLt,ctx,SX,SY);
    if(!used.includes('glove')){
      R(dx+8,dy+6,24,14,'#c8c0a0',ctx,SX,SY);
      R(dx+14,dy+4,20,12,'#d4cc9c',ctx,SX,SY);
      const gx=dx+60,gy=dy+5;
      if(hoveredId==='glove'){ ctx.shadowColor=C.gGold; ctx.shadowBlur=10*S; }
      R(gx,gy+6,20,14,'#1e1e2e',ctx,SX,SY);
      R(gx+2,gy+8,16,10,'#2a2a40',ctx,SX,SY);
      for(let i=0;i<4;i++) R(gx+2+i*4,gy,3,8,'#1e1e2e',ctx,SX,SY);
      R(gx-3,gy+7,5,6,'#1e1e2e',ctx,SX,SY);
      R(gx,gy+18,20,5,'#252538',ctx,SX,SY);
    }
    if(used.includes('glove')) R(dx,dy,dw,dh,C.used,ctx,SX,SY);
    ctx.restore();
  }

  // Plant + key
  {
    const px2=258,py2=160;
    ctx.save();
    if(hoveredId==='key'&&!used.includes('key')){ ctx.shadowColor=C.gGreen; ctx.shadowBlur=14*S; }
    R(px2+2,py2+26,36,6,'#3a1a08',ctx,SX,SY);
    R(px2+5,py2+32,30,24,C.clay,ctx,SX,SY);
    R(px2+4,py2+30,32,5,C.clay,ctx,SX,SY);
    R(px2+7,py2+32,26,22,'#6a3a18',ctx,SX,SY);
    R(px2+5,py2+54,30,3,'#3a1a08',ctx,SX,SY);
    R(px2+5,py2+30,30,5,'#2a1808',ctx,SX,SY);
    const sway=Math.sin(t*0.04)*1.5;
    [[px2+18,py2+28,10,20,-20],[px2+18,py2+28,10,18,18],[px2+18,py2+28,8,22,0]].forEach(([lx4,ly4,lw,lh,angle])=>{
      ctx.save();
      ctx.translate(lx4*SX,ly4*SY);
      ctx.rotate((angle+sway)*Math.PI/180);
      ctx.fillStyle=C.leaf; ctx.fillRect(0,-lh*SY,lw*SX,lh*SY);
      ctx.fillStyle=C.leafLt; ctx.fillRect(1*SX,-lh*SY+2*SY,(lw-2)*SX,(lh-4)*SY);
      ctx.restore();
    });
    if(!used.includes('key')){
      const kx=px2+8,ky=py2+26;
      if(hoveredId==='key'){ ctx.shadowColor=C.gGold; ctx.shadowBlur=12*S; }
      Circle(kx,ky,5,C.goldDk,ctx,SX,SY);
      Circle(kx,ky,3,'#0d0d18',ctx,SX,SY);
      R(kx+4,ky-1,14,2,C.gold,ctx,SX,SY);
      R(kx+14,ky-3,2,2,C.gold,ctx,SX,SY);
      R(kx+17,ky-3,2,2,C.gold,ctx,SX,SY);
    }
    if(used.includes('key')) R(px2,py2+26,42,34,C.used,ctx,SX,SY);
    ctx.restore();
  }

  // BayesBot
  drawBayesBot(ctx, SX, SY, t, hoveredId !== null && hoveredId !== undefined);

  // Hover label
  const hspot = HOTSPOTS.find(h => h.id === hoveredId);
  if(hspot && !used.includes(hspot.clue)) {
    const cx3 = hspot.x + hspot.w/2;
    const cy3 = hspot.y - 6;
    const pulse = 0.85 + 0.15*Math.sin(t*0.1);
    ctx.save(); ctx.globalAlpha = pulse;
    ctx.font = `bold ${Math.round(8*Math.min(SX,SY))}px monospace`;
    const tw = ctx.measureText(hspot.label).width;
    const px3 = cx3*SX - tw/2 - 5*Math.min(SX,SY);
    const py3 = (cy3-9)*SY;
    const ph3 = 11*Math.min(SX,SY);
    ctx.fillStyle='rgba(10,10,20,0.88)';
    ctx.beginPath(); ctx.roundRect(px3,py3,tw+10*Math.min(SX,SY),ph3,3*Math.min(SX,SY)); ctx.fill();
    ctx.strokeStyle=C.gold; ctx.lineWidth=Math.min(SX,SY); ctx.stroke();
    ctx.fillStyle=C.goldLt; ctx.textAlign='center';
    ctx.fillText(hspot.label, cx3*SX, (cy3+1)*SY);
    ctx.restore();
  }

  drawScanlines(ctx, W, H);
}

// ── INTRO SCREEN ──────────────────────────────────────────────────────────────
export function drawIntroFrame(ctx, W, H, t) {
  ctx.fillStyle = C.bg; ctx.fillRect(0,0,W,H);
  // Animated pixel rain (subtle)
  ctx.fillStyle='rgba(30,30,60,0.03)'; ctx.fillRect(0,0,W,H);

  const cx=W/2, cy=H/2;
  // Scanlines
  drawScanlines(ctx,W,H);

  // Glowing diamond
  const ds = 0.8+0.08*Math.sin(t*0.06);
  ctx.save();
  ctx.translate(cx, cy-H*0.22);
  ctx.scale(ds,ds);
  ctx.shadowColor='rgba(100,180,255,0.7)'; ctx.shadowBlur=30;
  ctx.font=`${H*0.12}px serif`; ctx.textAlign='center'; ctx.fillStyle='#a0c4ff';
  ctx.fillText('💎',0,0);
  ctx.restore();

  // Title
  ctx.save();
  ctx.shadowColor=C.gGold; ctx.shadowBlur=20;
  ctx.fillStyle=C.goldLt;
  ctx.font=`bold ${Math.round(H*0.08)}px "Courier Prime",monospace`;
  ctx.textAlign='center';
  ctx.fillText('BAYES NOIR',cx,cy-H*0.04);
  ctx.restore();

  ctx.fillStyle='#4a4a60';
  ctx.font=`${Math.round(H*0.04)}px "Courier Prime",monospace`;
  ctx.textAlign='center';
  ctx.fillText('THE UNCERTAIN CASE',cx,cy+H*0.06);

  // Blinking prompt
  if(Math.floor(t/30)%2===0){
    ctx.shadowColor=C.gGold; ctx.shadowBlur=8;
    ctx.fillStyle=C.gold;
    ctx.font=`${Math.round(H*0.03)}px monospace`;
    ctx.fillText('▶  CLICK TO BEGIN  ◀',cx,cy+H*0.22);
  }

  // Bottom credit
  ctx.fillStyle='#2a2a3a';
  ctx.font=`${Math.round(H*0.022)}px monospace`;
  ctx.fillText('BAYESIAN INFERENCE  ·  FUZZY LOGIC  ·  UNCERTAINTY MODELING',cx,H-H*0.04);
}
