/**
 * BAYES NOIR — All Cases
 * 3 complete uncertainty cases with Bayesian datasets.
 */

export const CASES = [
  // ───────────────────────────────────────────────────────────────────────────
  // CASE 0: The Vanishing Diamond (Stone Mansion)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 0,
    title: 'The Vanishing Diamond',
    subtitle: 'A gem worth millions. Three suspects. One truth.',
    sceneType: 'mansion',
    difficulty: 'EASY',
    difficultyColor: '#5c8a00',
    icon: '💎',
    stars: 0,
    priors: [0.34, 0.33, 0.33],
    culpritIndex: 2, // Gardener Voss
    suspects: [
      { id:'chef',     name:'Chef Moreau',      role:'The temperamental cook',   emoji:'👨‍🍳', color:'#e67e22', barColor:'linear-gradient(90deg,#e67e22,#f39c12)', alibi:'Preparing the midnight soufflé.' },
      { id:'butler',   name:'Butler Ashworth',  role:'The meticulous servant',   emoji:'🧐', color:'#3498db', barColor:'linear-gradient(90deg,#2980b9,#3498db)', alibi:'Polishing silver in the east wing.' },
      { id:'gardener', name:'Gardener Voss',    role:'The quiet outsider',       emoji:'🌿', color:'#27ae60', barColor:'linear-gradient(90deg,#27ae60,#2ecc71)', alibi:'Pruning the hedges after dark.' },
    ],
    clues: [
      { id:'footprint', name:'Muddy Footprint',  icon:'👣', description:'A size-11 boot print pressed into the Persian rug.', baseLikelihoods:[0.3,0.65,0.55], flavor:'Mud matches the east garden path.' },
      { id:'glove',     name:'Leather Glove',    icon:'🧤', description:'A fine monogrammed glove. The other is missing.', baseLikelihoods:[0.7,0.35,0.4], flavor:'Stitch pattern matches kitchen workwear.' },
      { id:'window',    name:'Broken Window',    icon:'🪟', description:'Shattered from outside. Glass points inward.',    baseLikelihoods:[0.45,0.5,0.75], flavor:'Someone knew where the latch was weak.' },
      { id:'watch',     name:'Pocket Watch',     icon:'⌚', description:'Stopped at 11:42 PM. Initials scratched off.',    baseLikelihoods:[0.5,0.5,0.5],   flavor:'All three suspects were unaccounted for.' },
      { id:'key',       name:'Duplicate Key',    icon:'🗝️', description:'A poorly-cut copy of the vault key.',             baseLikelihoods:[0.55,0.6,0.35], flavor:'Two keys were ordered separately.' },
    ],
    hotspots: [
      { id:'footprint', x:20,  y:155, w:55,  h:28, label:'👣 Footprint', clue:'footprint' },
      { id:'window',    x:108, y:18,  w:88,  h:72, label:'🪟 Window',    clue:'window'    },
      { id:'watch',     x:230, y:22,  w:70,  h:88, label:'⌚ Watch',     clue:'watch'     },
      { id:'glove',     x:96,  y:155, w:120, h:42, label:'🧤 Glove',     clue:'glove'     },
      { id:'key',       x:258, y:160, w:42,  h:45, label:'🗝 Key',        clue:'key'       },
    ],
    intro: [
      "The Harrington Diamond — flawless and priceless — has vanished.",
      "The estate was sealed. No forced entry beyond one broken window.",
      "Three suspects had motive, means, and opportunity.",
      "Evidence lies. Treat every clue with suspicion, Detective.",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CASE 1: The Missing Masterpiece (Museum)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'The Missing Masterpiece',
    subtitle: 'Priceless art. Compromised cameras. Uncertain motives.',
    sceneType: 'museum',
    difficulty: 'MEDIUM',
    difficultyColor: '#c9a84c',
    icon: '🖼️',
    stars: 0,
    priors: [0.34, 0.33, 0.33],
    culpritIndex: 1, // Night Guard
    suspects: [
      { id:'curator',   name:'Curator Bellamy', role:'The obsessed archivist',   emoji:'🎨', color:'#9b59b6', barColor:'linear-gradient(90deg,#8e44ad,#9b59b6)', alibi:'Cataloguing the new Flemish collection.' },
      { id:'guard',     name:'Night Guard Fox',  role:'The underpaid watchman',  emoji:'💂', color:'#2980b9', barColor:'linear-gradient(90deg,#1a6090,#2980b9)', alibi:'Claims the cameras malfunctioned on his shift.' },
      { id:'dealer',    name:'Dealer Marchetti', role:'The shady art broker',    emoji:'💼', color:'#c0392b', barColor:'linear-gradient(90deg,#962d22,#c0392b)', alibi:'Was hosting a private viewing across town.' },
    ],
    clues: [
      { id:'frame',    name:'Empty Frame',      icon:'🖼️', description:'The Vermeer canvas cleanly sliced out. No torn edges.', baseLikelihoods:[0.45,0.6,0.5],  flavor:'A professional cut — not a rushed job.' },
      { id:'camera',   name:'Security Log',     icon:'📷', description:'Footage deleted between 2–3 AM. Requires admin PIN.', baseLikelihoods:[0.35,0.75,0.4],  flavor:'Only three people knew the system login.' },
      { id:'coffee',   name:'Coffee Cup',       icon:'☕', description:'Still warm. Lipstick on the rim. Left in the gallery.', baseLikelihoods:[0.6,0.4,0.5],  flavor:'The brand matches the curator\'s desk supply.' },
      { id:'cabinet',  name:'Pried Cabinet',    icon:'🗄️', description:'The insurance filing cabinet — forced open.',          baseLikelihoods:[0.65,0.4,0.55], flavor:'Insurance docs on the Vermeer are missing.' },
      { id:'latch',    name:'Broken Latch',     icon:'🚪', description:'The service exit latch — bent from inside.',           baseLikelihoods:[0.4,0.55,0.7],  flavor:'The dealer used this exit last week.' },
    ],
    hotspots: [
      { id:'frame',   x:100, y:15,  w:120, h:80,  label:'🖼️ Frame',    clue:'frame'   },
      { id:'camera',  x:260, y:15,  w:55,  h:50,  label:'📷 Camera',   clue:'camera'  },
      { id:'coffee',  x:20,  y:155, w:75,  h:45,  label:'☕ Coffee',   clue:'coffee'  },
      { id:'cabinet', x:240, y:145, w:65,  h:60,  label:'🗄️ Cabinet',  clue:'cabinet' },
      { id:'latch',   x:20,  y:20,  w:60,  h:80,  label:'🚪 Latch',    clue:'latch'   },
    ],
    intro: [
      "The Vermeer — acquired just last month — has disappeared overnight.",
      "Security footage shows a deleted window from 2-3 AM.",
      "Three people had after-hours access to the museum.",
      "In a world of forgeries and lies, trust only the math.",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CASE 2: The Village Heist (Minecraft Village — outdoor!)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'The Village Heist',
    subtitle: 'Gold gone from the chest. The village demands justice.',
    sceneType: 'village',
    difficulty: 'HARD',
    difficultyColor: '#c0392b',
    icon: '⚒️',
    stars: 0,
    priors: [0.34, 0.33, 0.33],
    culpritIndex: 1, // Merchant
    suspects: [
      { id:'blacksmith', name:'Blacksmith Grum',  role:'The gruff ironworker',    emoji:'⚒️', color:'#7f8c8d', barColor:'linear-gradient(90deg,#616a6b,#7f8c8d)', alibi:'Forging a sword order until midnight.' },
      { id:'merchant',   name:'Merchant Silas',   role:'The cunning trader',      emoji:'🪙', color:'#f1c40f', barColor:'linear-gradient(90deg,#d4ac0d,#f1c40f)', alibi:'Reordering stocks in his back room.' },
      { id:'farmer',     name:'Farmer Bret',      role:'The desperate debtor',    emoji:'🌾', color:'#27ae60', barColor:'linear-gradient(90deg,#1d8348,#27ae60)', alibi:'Claims he was tending to the livestock.' },
    ],
    clues: [
      { id:'anvil',   name:'Hammer Mark',         icon:'🔨', description:'A fresh iron-hammer dent on the chest lock.',           baseLikelihoods:[0.7,0.3,0.4],   flavor:'Only the blacksmith uses this sized hammer.' },
      { id:'gold',    name:'Gold Dust Trail',      icon:'✨', description:'Gold dust leading from the chest toward the market.',   baseLikelihoods:[0.3,0.75,0.35], flavor:'Gold weighing scales found nearby.' },
      { id:'chest',   name:'Broken Lock',          icon:'🔑', description:'The village chest — lock broken with precision.',       baseLikelihoods:[0.5,0.5,0.5],   flavor:'No improvised tool could do this cleanly.' },
      { id:'stall',   name:'Torn Banner',          icon:'🏴', description:'A torn piece of fabric near the market stall.',         baseLikelihoods:[0.35,0.6,0.55], flavor:'Matches the merchant\'s flag colors.' },
      { id:'fence',   name:'Broken Fence',         icon:'🟫', description:'Fence posts snapped — someone fled through the field.', baseLikelihoods:[0.45,0.4,0.7],  flavor:'Farmer\'s field. His boots match the gap.' },
    ],
    hotspots: [
      { id:'anvil',   x:20,  y:145, w:55,  h:55,  label:'🔨 Anvil',    clue:'anvil'  },
      { id:'gold',    x:120, y:155, w:60,  h:45,  label:'✨ Gold',     clue:'gold'   },
      { id:'chest',   x:195, y:145, w:65,  h:55,  label:'🔑 Chest',    clue:'chest'  },
      { id:'stall',   x:255, y:70,  w:60,  h:110, label:'🏴 Stall',    clue:'stall'  },
      { id:'fence',   x:85,  y:95,  w:50,  h:75,  label:'🟫 Fence',    clue:'fence'  },
    ],
    intro: [
      "The village communal chest — stuffed with gold ingots — was emptied last night.",
      "The lock was broken with precision. No signs of struggle.",
      "Three village members owed debts or had reason to steal.",
      "The village needs answers. Evidence is scarce. Think carefully.",
    ],
  },
];

export function getCaseById(id) {
  return CASES[id] || CASES[0];
}
