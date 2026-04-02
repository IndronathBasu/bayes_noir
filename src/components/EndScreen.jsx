/**
 * EndScreen — Minecraft-themed dramatic case reveal
 */
import { argMax } from '../logic/bayesEngine.js';

function BeliefBar({ belief, color, name, isCulprit, isAccused }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, alignItems:'center' }}>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <span style={{ fontSize:11 }}>{name}</span>
          {isCulprit && <span style={{ fontSize:8, color:'#e74c3c', border:'1px solid rgba(231,76,60,0.4)', padding:'1px 5px' }}>GUILTY</span>}
          {isAccused && !isCulprit && <span style={{ fontSize:8, color:'#e67e22', border:'1px solid rgba(230,126,34,0.4)', padding:'1px 5px' }}>ACCUSED</span>}
        </div>
        <span className="font-mono" style={{ fontSize:12, color: isCulprit ? '#e74c3c':'#7a7a6e' }}>{(belief*100).toFixed(1)}%</span>
      </div>
      <div className="prob-bar-bg">
        <div className="prob-bar-fill" style={{
          width:`${belief*100}%`,
          background: isCulprit ? 'linear-gradient(90deg,#8b0000,#c0392b,#e74c3c)' : isAccused ? 'linear-gradient(90deg,#7f5a00,#c9a84c)' : color,
          transition:'width 1s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  );
}

export default function EndScreen({ beliefs, accusedIndex, cluesUsed, onReset, caseData, xpEarned, onBackToSelect }) {
  const suspects   = caseData?.suspects || [];
  const culpritIdx = caseData?.culpritIndex ?? 0;
  const culprit    = suspects[culpritIdx] || {};
  const accused    = suspects[accusedIndex] || {};
  const correct    = accusedIndex === culpritIdx;
  const confidence = beliefs[accusedIndex] || 0;
  const score      = Math.max(0, Math.round(confidence * 100 - cluesUsed * 10));
  const stars      = correct ? (cluesUsed <= 2 ? 3 : cluesUsed <= 3 ? 2 : 1) : 0;

  return (
    <div style={{
      position:'fixed', inset:0,
      background:'rgba(0,0,0,0.94)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:600, padding:16,
    }}>
      <div className="reveal-in" style={{
        background:'linear-gradient(160deg,#0d0d18,#080810)',
        border:`3px solid ${correct ? '#5c8a00' : '#c0392b'}`,
        borderColor: correct ? '#7aba00 #2d5c00 #2d5c00 #7aba00' : '#e74c3c #8b0000 #8b0000 #e74c3c',
        maxWidth:560, width:'100%',
        boxShadow: correct ? '0 0 60px rgba(92,138,0,0.3)' : '0 0 60px rgba(192,57,43,0.25)',
        position:'relative', overflow:'hidden',
      }}>
        {/* Minecraft grass/dirt stripe at top */}
        <div style={{ height:6, background: correct ? 'linear-gradient(90deg,#5c8a00,#3d7a10,#5c8a00)' : 'linear-gradient(90deg,#8b0000,#6a0000,#8b0000)' }} />
        <div style={{ height:4, background: correct ? '#7D5524' : '#4a0000' }} />

        <div style={{ padding:'24px 28px' }}>
          {/* Title */}
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>{correct ? '🏆' : '❌'}</div>
            <div style={{
              fontFamily:"'Press Start 2P', monospace",
              fontSize:14, color: correct ? '#fcfa42' : '#e74c3c',
              textShadow: correct ? '2px 2px #373737' : '2px 2px #4a0000',
              marginBottom:8,
            }}>
              {correct ? 'CASE SOLVED!' : 'WRONG ACCUSATION'}
            </div>
            <div style={{ fontSize:10, color:'#4a4a40', fontFamily:'Courier Prime, monospace' }}>
              {correct ? 'Your Bayesian reasoning led you to the truth.' : 'The evidence misled you — or you missed a clue.'}
            </div>
          </div>

          {/* Stars */}
          <div style={{ textAlign:'center', marginBottom:16, fontSize:28 }}>
            {[0,1,2].map(i => <span key={i} style={{ filter: i<stars?'none':'grayscale(1) brightness(0.3)', margin:'0 4px' }}>⭐</span>)}
          </div>

          {/* XP earned */}
          <div style={{
            background:'#0a0a14', border:'2px solid',
            borderColor:'#fcfa42 #5a5a00 #5a5a00 #fcfa42',
            padding:'10px 16px', marginBottom:16,
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:8, color:'#5c8a00' }}>XP EARNED</span>
            <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:14, color:'#fcfa42' }}>+{xpEarned || 0}</span>
          </div>

          {/* Culprit reveal */}
          <div style={{
            background:'#0a0a14', border:`1px solid ${correct?'rgba(201,168,76,0.3)':'rgba(192,57,43,0.3)'}`,
            padding:14, marginBottom:14, display:'flex', gap:14, alignItems:'center',
          }}>
            <div style={{ fontSize:38 }}>{culprit.emoji}</div>
            <div>
              <div style={{ fontSize:9, color:'#4a4a40', letterSpacing:2, marginBottom:4 }}>ACTUAL CULPRIT</div>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:11, color:'#e74c3c', marginBottom:4 }}>{culprit.name}</div>
              <div style={{ fontSize:10, color:'#7a7a6e', fontStyle:'italic' }}>{culprit.role}</div>
            </div>
          </div>

          {/* Your accusation */}
          <div style={{ fontSize:11, color:'#4a4a40', marginBottom:14, padding:'8px 12px', background:'#080810', border:'1px solid #1a1a2a' }}>
            You accused: <span style={{ color: correct?'#c9a84c':'#e74c3c', fontWeight:'bold' }}>{accused.name}</span>{' '}
            with <span className="font-mono" style={{ color:'#7a7a6e' }}>{(confidence*100).toFixed(1)}%</span> confidence
          </div>

          {/* Belief bars */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:9, color:'#4a4a40', letterSpacing:1, marginBottom:8, fontFamily:"'Press Start 2P', monospace" }}>FINAL BELIEFS:</div>
            {suspects.map((s, i) => (
              <BeliefBar key={s.id} belief={beliefs[i]} color={s.barColor}
                name={s.name} isCulprit={i===culpritIdx} isAccused={i===accusedIndex} />
            ))}
          </div>

          {/* Score */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            background:'#080810', border:'1px solid #1a1a2a', padding:'10px 14px', marginBottom:16,
          }}>
            <div>
              <div style={{ fontSize:9, color:'#4a4a40', letterSpacing:1, fontFamily:"'Press Start 2P', monospace" }}>SCORE</div>
              <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:24, color: correct?'#fcfa42':'#e74c3c', lineHeight:1.5 }}>{score}</div>
            </div>
            <div style={{ textAlign:'right', fontSize:10, color:'#4a4a40', fontFamily:'Courier Prime, monospace' }}>
              <div>Clues used: <span style={{ color:'#7a7a6e' }}>{cluesUsed}</span></div>
              <div>Confidence: <span style={{ color:'#7a7a6e' }}>{(confidence*100).toFixed(1)}%</span></div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn-accuse" onClick={onReset} style={{
              flex:1, padding:'10px', fontSize:10,
              fontFamily:"'Press Start 2P', monospace", letterSpacing:1, borderRadius:0,
            }}>
              ↺ REINVESTIGATE
            </button>
            <button onClick={onBackToSelect} style={{
              flex:1, padding:'10px', fontSize:10,
              fontFamily:"'Press Start 2P', monospace", letterSpacing:1,
              background:'linear-gradient(180deg,#5c8a00,#3d7a10)',
              border:'3px solid',  borderColor:'#7aba00 #1a4a00 #1a4a00 #7aba00',
              color:'white', cursor:'pointer',
            }}>
              ◀ SELECT CASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
