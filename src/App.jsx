/**
 * BAYES NOIR: The Uncertain Case — Minecraft Edition
 * App.jsx — orchestrates game state, XP system, multi-case management
 */
import { useState, useCallback, useEffect } from 'react';

import { CASES } from './data/cases.js';
import { bayesUpdate, maxBelief, argMax } from './logic/bayesEngine.js';
import { processEvidence } from './logic/noiseEngine.js';
import { witnessToLikelihoods, describeFuzzyUpdate } from './logic/fuzzyLogic.js';
import { generateExplanation, shortExplanation } from './logic/explanationEngine.js';

import GameCanvas         from './game/GameCanvas.jsx';
import CaseSelectScreen   from './components/CaseSelectScreen.jsx';
import SuspectBoard       from './components/SuspectBoard.jsx';
import BayesBot           from './components/BayesBot.jsx';
import EvidenceLog        from './components/EvidenceLog.jsx';
import AccusePanel        from './components/AccusePanel.jsx';
import EndScreen          from './components/EndScreen.jsx';
import RainEffect         from './components/RainEffect.jsx';
import WitnessSlider      from './components/WitnessSlider.jsx';

const MAX_CLUES = 4;

// ── XP & Persistence ─────────────────────────────────────────────────────────
function loadProgress() {
  try {
    const saved = localStorage.getItem('bayesNoir_progress');
    return saved ? JSON.parse(saved) : { xp: 0, cases: {} };
  } catch { return { xp: 0, cases: {} }; }
}
function saveProgress(progress) {
  try { localStorage.setItem('bayesNoir_progress', JSON.stringify(progress)); } catch {}
}
function calcXP(correct, cluesUsed, confidence) {
  let xp = correct ? 50 : 10;
  xp += correct ? Math.max(0, (MAX_CLUES - cluesUsed) * 15) : 0;
  xp += Math.round(confidence * 20);
  return xp;
}
function calcStars(correct, cluesUsed) {
  if (!correct) return 0;
  if (cluesUsed <= 2) return 3;
  if (cluesUsed <= 3) return 2;
  return 1;
}

// ── Game State Factory ────────────────────────────────────────────────────────
function newGame(caseData) {
  return {
    beliefs:     [...caseData.priors],
    prevBeliefs: [...caseData.priors],
    usedClueIds: [],
    cluesUsed:   0,
    log:         [{ type:'system', text:`Case opened: "${caseData.title}"` }],
    botLines:    [],
    witnessUsed: false,
    gamePhase:   'intro',
    accusedIndex: null,
    xpEarned:    0,
  };
}

export default function App() {
  const [progress, setProgress]     = useState(loadProgress);
  const [currentCaseId, setCaseId]  = useState(null); // null = case select
  const [state, setState]           = useState(null);

  const caseData = currentCaseId !== null ? CASES[currentCaseId] : null;

  // Save progress whenever it changes
  useEffect(() => saveProgress(progress), [progress]);

  // ── Case Select ──────────────────────────────────────────────────────────────
  const handleSelectCase = useCallback((id) => {
    setCaseId(id);
    setState(newGame(CASES[id]));
  }, []);

  // ── Start ────────────────────────────────────────────────────────────────────
  const handleStart = useCallback(() =>
    setState(p => ({ ...p, gamePhase: 'playing' })), []);

  // ── Clue click ───────────────────────────────────────────────────────────────
  const handleClueClick = useCallback(({ id: clueId }) => {
    if (!caseData) return;
    const clue = caseData.clues.find(c => c.id === clueId);
    if (!clue) return;
    setState(prev => {
      if (prev.usedClueIds.includes(clueId) || prev.cluesUsed >= MAX_CLUES) return prev;
      const { likelihoods, wasMisleading } = processEvidence(clue.baseLikelihoods);
      const newBeliefs = bayesUpdate(prev.beliefs, likelihoods);
      const names = caseData.suspects.map(s => s.name);
      const botLines = generateExplanation({
        clueName: clue.name, likelihoods, prevBeliefs: prev.beliefs, newBeliefs,
        suspectNames: names, wasMisleading,
      });
      return {
        ...prev,
        beliefs:     newBeliefs,
        prevBeliefs: prev.beliefs,
        usedClueIds: [...prev.usedClueIds, clueId],
        cluesUsed:   prev.cluesUsed + 1,
        log: [...prev.log, {
          type: 'clue', icon: clue.icon, clue: clue.name,
          text: shortExplanation(clue.name, likelihoods, names)
               + (wasMisleading ? ' ⚠ [UNRELIABLE]' : ''),
        }],
        botLines,
      };
    });
  }, [caseData]);

  // ── Witness slider ───────────────────────────────────────────────────────────
  const handleWitnessApply = useCallback((likelihoods) => {
    if (!caseData) return;
    setState(prev => {
      if (prev.witnessUsed) return prev;
      const newBeliefs = bayesUpdate(prev.beliefs, likelihoods);
      const names = caseData.suspects.map(s => s.name);
      return {
        ...prev,
        beliefs: newBeliefs, prevBeliefs: prev.beliefs,
        witnessUsed: true,
        log: [...prev.log, { type:'fuzzy', text: describeFuzzyUpdate(likelihoods, names) }],
        botLines: generateExplanation({
          clueName:'Witness (Fuzzy)', likelihoods, prevBeliefs: prev.beliefs, newBeliefs,
          suspectNames: names, wasMisleading: false,
        }),
      };
    });
  }, [caseData]);

  // ── Accuse ───────────────────────────────────────────────────────────────────
  const handleAccuse = useCallback((suspectIndex) => {
    if (!caseData) return;
    const correct = suspectIndex === caseData.culpritIndex;
    const conf    = maxBelief(state.beliefs);
    const xpEarned = calcXP(correct, state.cluesUsed, conf);
    const stars     = calcStars(correct, state.cluesUsed);
    setState(prev => ({ ...prev, accusedIndex: suspectIndex, gamePhase: 'accused', xpEarned }));
    setProgress(prev => {
      const prevCase  = prev.cases[caseData.id] || { stars: 0, played: 0 };
      return {
        xp: prev.xp + xpEarned,
        cases: {
          ...prev.cases,
          [caseData.id]: {
            stars: Math.max(prevCase.stars, stars),
            played: prevCase.played + 1,
          },
        },
      };
    });
  }, [caseData, state]);

  // ── Reset current case ───────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    if (caseData) setState(newGame(caseData));
  }, [caseData]);

  // ── Back to case select ──────────────────────────────────────────────────────
  const handleBackToSelect = useCallback(() => {
    setCaseId(null);
    setState(null);
  }, []);

  // ── Case Select Screen ───────────────────────────────────────────────────────
  if (currentCaseId === null) {
    return (
      <CaseSelectScreen
        onSelect={handleSelectCase}
        totalXP={progress.xp}
        completedCases={progress.cases}
      />
    );
  }

  const {
    beliefs, prevBeliefs, usedClueIds, cluesUsed,
    log, botLines, witnessUsed, gamePhase, accusedIndex, xpEarned,
  } = state;

  const cluesRemaining = MAX_CLUES - cluesUsed;
  const canAccuse = cluesUsed >= 1 && gamePhase === 'playing';

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh',
      overflow: 'hidden', background: '#04040a',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <RainEffect />

      {/* Vignette */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:100,
        background:'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)' }} />

      {/* End screen */}
      {gamePhase === 'accused' && (
        <EndScreen
          beliefs={beliefs} accusedIndex={accusedIndex}
          cluesUsed={cluesUsed} onReset={handleReset}
          caseData={caseData} xpEarned={xpEarned}
          onBackToSelect={handleBackToSelect}
        />
      )}

      {/* ── HEADER (Minecraft style) ─────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 14px',
        background: 'linear-gradient(90deg,#0a0a0f,#101018,#0a0a0f)',
        borderBottom: '3px solid', borderColor: '#5c8a00 #0a0a0f #0a0a0f #5c8a00',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Back button */}
          <button
            onClick={handleBackToSelect}
            style={{
              background:'#373737', border:'2px solid',
              borderColor:'#8b8b8b #1a1a1a #1a1a1a #8b8b8b',
              color:'#d4d4c8', fontFamily:"'Press Start 2P', monospace",
              fontSize:7, padding:'4px 8px', cursor:'pointer',
            }}
          >
            ◀ CASES
          </button>
          <span style={{ fontSize:16 }}>{caseData.icon}</span>
          <div>
            <div style={{ fontSize:9, color:'#fcfa42', letterSpacing:1, lineHeight:1.4 }}>
              {caseData.title.toUpperCase()}
            </div>
            <div style={{ fontSize:7, color:'#3a3a4a', letterSpacing:1 }}>
              BAYES NOIR · PIXEL EDITION
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          {gamePhase === 'playing' && (
            <div style={{ fontSize:8, color:'#fcfa42' }}>
              CLUE: <span style={{ color: cluesRemaining > 0 ? '#31c84a' : '#c0392b' }}>
                {cluesUsed}/{MAX_CLUES}
              </span>
            </div>
          )}
          {/* XP display */}
          <div style={{ fontSize:7, color:'#31c84a' }}>XP: {progress.xp}</div>
          <div style={{
            width:70, height:8, background:'#0d0d0d',
            border:'2px solid', borderColor:'#8b8b8b #373737 #373737 #8b8b8b',
          }}>
            <div style={{
              height:'100%', background:'linear-gradient(90deg,#31c84a,#5dfa6a)',
              width:`${Math.min(100, (progress.xp / 300) * 100)}%`,
            }} />
          </div>
          <button onClick={handleReset} style={{
            background:'#373737', border:'2px solid',
            borderColor:'#8b8b8b #1a1a1a #1a1a1a #8b8b8b',
            color:'#d4d4c8', fontFamily:"'Press Start 2P', monospace",
            fontSize:7, padding:'4px 8px', cursor:'pointer',
          }}>
            ↺ RESET
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div style={{
        flex:1, display:'grid', gridTemplateColumns:'1fr 300px',
        overflow:'hidden', position:'relative', zIndex:10,
      }}>
        {/* LEFT — Pixel Art Canvas */}
        <div style={{ display:'flex', flexDirection:'column', overflow:'hidden', gap:6, padding:8 }}>
          <div style={{ flex:1, minHeight:0, overflow:'hidden', position:'relative',
            border:'3px solid', borderColor:'#5c8a00 #2d5c00 #2d5c00 #5c8a00' }}>
            <GameCanvas
              usedClueIds={usedClueIds}
              onClueClick={handleClueClick}
              cluesRemaining={cluesRemaining}
              gamePhase={gamePhase}
              onStartGame={handleStart}
              caseData={caseData}
            />
          </div>

          {/* Witness slider */}
          {gamePhase === 'playing' && (
            <WitnessSlider
              onApply={handleWitnessApply}
              disabled={witnessUsed}
              suspects={caseData.suspects}
              witnessContext={
                caseData.id === 0 ? 'in the garden' :
                caseData.id === 1 ? 'leaving the museum' :
                'near the village square'
              }
            />
          )}

          {/* BayesBot */}
          <BayesBot lines={botLines} isLoading={false} />

          {/* Evidence log */}
          <EvidenceLog entries={log} />
        </div>

        {/* RIGHT — Suspect board */}
        <div style={{
          borderLeft:'3px solid #1a1a2a', padding:8,
          overflow:'hidden', display:'flex', flexDirection:'column',
        }}>
          <SuspectBoard
            beliefs={beliefs}
            prevBeliefs={prevBeliefs}
            canAccuse={canAccuse}
            onAccuse={handleAccuse}
            suspects={caseData.suspects}
          />
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────────── */}
      {gamePhase === 'playing' && (
        <div style={{
          flexShrink:0, zIndex:10, position:'relative',
          borderTop:'3px solid', borderColor:'#5c8a00 #2d5c00 #2d5c00 #5c8a00',
          padding:'6px 12px',
          background:'linear-gradient(90deg,#060610,#0a0a14,#060610)',
        }}>
          <AccusePanel
            beliefs={beliefs} cluesUsed={cluesUsed}
            suspects={caseData.suspects}
            onReset={handleReset} canAccuse={canAccuse}
          />
        </div>
      )}
    </div>
  );
}
