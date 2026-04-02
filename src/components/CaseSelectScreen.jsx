/**
 * CaseSelectScreen — Minecraft-themed level select
 */
import { CASES } from '../data/cases.js';

const MC = {
  bg:       '#1a1a2e',
  panel:    '#c6c6c6',
  panelDk:  '#8b8b8b',
  border:   '#373737',
  borderLt: '#ffffff',
  gold:     '#fcfa42',
  greenBar: '#31c84a',
  slot:     '#373737',
};

function StarRating({ stars }) {
  return (
    <div style={{ display:'flex', gap:4 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ fontSize:14, filter: i < stars ? 'none':'grayscale(1) brightness(0.4)' }}>⭐</span>
      ))}
    </div>
  );
}

function CaseCard({ caseData, onSelect, totalXP }) {
  const solved = caseData.stars > 0;
  return (
    <div
      onClick={() => onSelect(caseData.id)}
      style={{
        cursor:'pointer',
        background: solved ? '#1a2a1a' : '#1a1a26',
        border:'4px solid',
        borderColor: solved ? '#5c8a00 #2d5c00 #2d5c00 #5c8a00' : '#4a4a6a #1a1a2a #1a1a2a #4a4a6a',
        borderRadius:0,
        padding:16,
        display:'flex',
        flexDirection:'column',
        gap:10,
        transition:'transform 0.1s',
        userSelect:'none',
        position:'relative',
        overflow:'hidden',
      }}
      onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
    >
      {/* Minecraft dirt/grass stripe at top */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:6,
        background: solved
          ? 'linear-gradient(90deg, #5c8a00, #3d7a10, #5c8a00)'
          : 'linear-gradient(90deg, #4a4a6a, #2a2a3a, #4a4a6a)'
      }} />

      {/* Case icon + title */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:8 }}>
        <div style={{
          width:48, height:48,
          background: MC.slot,
          border:'3px solid', borderColor:`${MC.borderLt} ${MC.border} ${MC.border} ${MC.borderLt}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:24, flexShrink:0,
        }}>
          {caseData.icon}
        </div>
        <div>
          <div style={{
            fontFamily:"'Press Start 2P', monospace",
            fontSize:9, color:'#e6c97a', letterSpacing:0,
            lineHeight:1.5,
          }}>
            {caseData.title.toUpperCase()}
          </div>
          <div style={{ fontSize:10, color:'#7a7a8e', marginTop:4, fontFamily:'Courier Prime, monospace' }}>
            {caseData.subtitle}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height:2, background:'#2a2a3a' }} />

      {/* Difficulty + Stars */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{
          fontFamily:"'Press Start 2P', monospace",
          fontSize:7, color: caseData.difficultyColor,
          border:'2px solid',
          borderColor:`${caseData.difficultyColor}44`,
          padding:'3px 8px',
        }}>
          {caseData.difficulty}
        </div>
        <StarRating stars={caseData.stars} />
      </div>

      {/* Suspects preview */}
      <div style={{ display:'flex', gap:6 }}>
        {caseData.suspects.map(s => (
          <div key={s.id} style={{
            width:32, height:32,
            background:'#0d0d18',
            border:'2px solid', borderColor:`${MC.borderLt}44 ${MC.border}44 ${MC.border}44 ${MC.borderLt}44`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16,
          }}>{s.emoji}</div>
        ))}
        <div style={{
          flex:1, display:'flex', alignItems:'center',
          fontFamily:'Courier Prime, monospace', fontSize:10, color:'#4a4a60',
          paddingLeft:8,
        }}>
          {caseData.suspects.map(s=>s.name.split(' ')[0]).join(' · ')}
        </div>
      </div>

      {/* Start button */}
      <div style={{
        background: 'linear-gradient(180deg, #5c8a00, #3d7a10)',
        border:'3px solid', borderColor:`#7aba00 #1a4a00 #1a4a00 #7aba00`,
        padding:'8px 0',
        textAlign:'center',
        fontFamily:"'Press Start 2P', monospace",
        fontSize:8, color:'#ffffff',
        letterSpacing:1,
      }}>
        {solved ? '▶ PLAY AGAIN' : '▶ INVESTIGATE'}
      </div>

      {/* Solved badge */}
      {solved && (
        <div style={{
          position:'absolute', top:10, right:10,
          background:'#5c8a00', color:'white',
          fontFamily:"'Press Start 2P', monospace",
          fontSize:6, padding:'3px 6px',
          border:'2px solid #7aba00',
        }}>✓ SOLVED</div>
      )}
    </div>
  );
}

export default function CaseSelectScreen({ onSelect, totalXP, completedCases }) {
  const enriched = CASES.map(c => ({
    ...c,
    stars: completedCases[c.id]?.stars || 0,
  }));

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:500,
      background:'linear-gradient(180deg, #0a0a1e 0%, #0d1a0d 100%)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      overflow:'auto', padding:24,
    }}>
      {/* Minecraft dirt-stripe header */}
      <div style={{ width:'100%', maxWidth:900, marginBottom:24 }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{
            fontFamily:"'Press Start 2P', monospace",
            fontSize:24, color:'#fcfa42',
            textShadow:'3px 3px #373737, -1px -1px #5a5a00',
            letterSpacing:2, lineHeight:1.5,
          }}>
            ⚒ BAYES NOIR ⚒
          </div>
          <div style={{
            fontFamily:"'Press Start 2P', monospace",
            fontSize:9, color:'#5c8a00', marginTop:8, letterSpacing:3,
          }}>
            SELECT CASE
          </div>

          {/* XP Bar */}
          <div style={{ marginTop:16, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:'#fcfa42' }}>XP</span>
            <div style={{
              width:200, height:10,
              background:'#0d0d0d',
              border:'2px solid', borderColor:`${MC.borderLt} ${MC.border} ${MC.border} ${MC.borderLt}`,
              position:'relative', overflow:'hidden',
            }}>
              <div style={{
                height:'100%',
                width:`${Math.min(100, (totalXP / 300) * 100)}%`,
                background:'linear-gradient(90deg, #31c84a, #5dfa6a)',
                transition:'width 0.5s ease',
              }} />
            </div>
            <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:'#31c84a' }}>
              {totalXP} XP
            </span>
          </div>
        </div>

        {/* Pixelated ground border */}
        <div style={{
          height:8,
          background:'repeating-linear-gradient(90deg, #5c8a00 0px, #5c8a00 8px, #3d7a10 8px, #3d7a10 16px)',
          marginBottom:2,
        }} />
        <div style={{
          height:8,
          background:'repeating-linear-gradient(90deg, #7D5524 0px, #7D5524 8px, #6d4a1a 8px, #6d4a1a 16px)',
          marginBottom:16,
        }} />

        {/* Case cards grid */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))',
          gap:16,
        }}>
          {enriched.map(c => (
            <CaseCard key={c.id} caseData={c} onSelect={onSelect} totalXP={totalXP} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop:20, textAlign:'center',
          fontFamily:"'Press Start 2P', monospace",
          fontSize:7, color:'#2a2a3a', letterSpacing:1,
        }}>
          BAYESIAN INFERENCE · FUZZY LOGIC · UNCERTAINTY MODELING
        </div>
      </div>
    </div>
  );
}
