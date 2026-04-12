import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATABASE — 684 parole italiane certe, 5 lettere ─────────────────────────
const WORDLE_POOL = [
  "ABETE","ABITO","ABUSO","ACETO","ACIDO","ACQUA","AGILE","AGIRE","AGLIO","AIUTO",
  "ALITO","ALONE","ALTRO","AMARO","AMBRA","AMICO","AMORE","AMPIA","AMPIO","ANIMA",
  "ANSIA","APICE","APNEA","ARABO","ARARE","ARENA","ARIDO","ARNIA","AROMA","ARSO",
  "ARTE","ASINO","ASPRO","ASTRO","ATOMO","AUDIO","AVERE","AVIDO","BABBO","BACIO",
  "BAGNO","BALDO","BALLA","BALZO","BANCO","BANDA","BANDO","BARBA","BARCA","BARDO",
  "BASSO","BASTO","BAULE","BEFFA","BELLO","BELVA","BIECO","BINGO","BIRBO","BIRRA",
  "BOCCA","BOCCE","BOLLA","BOMBA","BONGO","BORDO","BORSA","BOSCO","BOSSO","BRACA",
  "BRAMA","BRANO","BRAVO","BREVE","BRINA","BRODO","BRUNA","BULBO","BULLO","BUONO",
  "BURLA","BUSTO","CACCA","CACTO","CALCE","CALDO","CALMA","CALMO","CALVO","CALZA",
  "CAMPO","CANOA","CANTO","CAPPA","CAPRA","CAPRO","CARMA","CARPA","CARRO","CARSO",
  "CARTA","CASCO","CASSA","CASTA","CASTO","CAUSA","CAVIA","CEDRO","CELLA","CENNO",
  "CENSO","CEPPO","CERCO","CERTO","CERVO","CESTA","CESTO","CHINA","CIGNO","CIPPO",
  "CIRCA","CIRCO","CLAVA","CLERO","CLIMA","CLONE","CLORO","COBRA","COCCO","COFFA",
  "COLLA","COLLO","COLMO","COLPA","COLPO","COLTO","CONCA","CONTA","CONTE","COPIA",
  "COPPA","CORDA","CORNO","CORPO","CORSA","CORTE","CORVO","COSCA","COSMO","COSTA",
  "COSTO","COZZO","CREMA","CROCE","CRUDO","CUNEO","CUORE","CURDO","CURVA","DAINO",
  "DANNO","DANZA","DARDO","DENSO","DENTE","DETTO","DISCO","DITTA","DOCCE","DOGMA",
  "DOLCE","DONNA","DORSO","DOSSO","DOTTO","DRAGO","DROGA","DUOMO","EBANO","EBETE",
  "EDEMA","EDERA","EGIDA","ELICA","EMPIO","EMULO","ENTRO","EPICA","EPOCA","ERNIA",
  "ERODE","EROSO","ESAME","ESITO","ESODO","ESTRO","ETERE","ETICA","ETILE","ETNIA",
  "EVASO","EVOCA","FALCO","FALDA","FALLO","FALSA","FANGO","FARRO","FARSA","FATTO",
  "FERMA","FERMO","FERRO","FESTA","FETTA","FIABA","FIATO","FIBRA","FIENO","FIERO",
  "FIORE","FISSO","FIUME","FLEBO","FLORA","FOBIA","FOGNA","FOLLA","FOLTO","FONDO",
  "FONTE","FORTE","FORZA","FOSCO","FOSSO","FRANA","FRATE","FRENO","FRIGO","FRODE",
  "FUNGO","FUOCO","FUORI","FURBO","FURIA","FUSTO","GABBA","GALLA","GALLO","GAMBA",
  "GAMBO","GARBO","GARZA","GATTO","GEMMA","GENIO","GERME","GESTO","GHIRO","GHISA",
  "GIOCO","GIOIA","GLOBO","GNOMO","GOBBA","GOGNA","GOLFO","GOLPE","GOMMA","GONNA",
  "GONZO","GORGO","GOZZO","GRANO","GRECA","GRETO","GRIDO","GRIFO","GRUMO","GUADO",
  "GUAIO","GUANO","GUIDA","GUSTO","ICONA","IDOLO","IGLOO","IMAGO","INDIA","INDIO",
  "INVIO","IRIDE","IROSO","ISOLA","ISTMO","LACCA","LAIDO","LAMPO","LARDO","LARGO",
  "LASCA","LATTE","LAUTO","LAZIO","LECCO","LEGGE","LEGNO","LEMMA","LENTO","LENZA",
  "LEONE","LEPRE","LIEVE","LIGIO","LILLA","LIMBO","LINCE","LINFA","LISTA","LITRO",
  "LIUTO","LOMBO","LONZA","LORDO","LOSCO","LOTTA","LOTTO","LUCCA","LUCRO","LUNGA",
  "LUNGO","LUOGO","LUSSO","MAGMA","MAGNA","MALGA","MALTO","MAMBO","MANCA","MANCO",
  "MANIA","MANNA","MANTO","MANZO","MAPPA","MARCA","MARMO","MARZO","MASSA","MAZZO",
  "MEDIO","MELMA","MENTA","MENTO","MERLO","MESTO","METRO","MEZZO","MIELE","MIRRA",
  "MIRTO","MISTO","MOGNO","MOLLA","MOLLE","MOLLO","MOLTO","MONDO","MONTE","MORBO",
  "MORSA","MORSO","MORTO","MOSCA","MOSSO","MOTTO","MUCCA","MULTA","MUSEO","NANNA",
  "NARDO","NERBO","NERVO","NETTO","NIMBO","NINFA","NITRO","NOCCA","NONNA","NORMA",
  "NOTTE","NULLA","NUORA","OBLIO","ODORE","OLIVA","OLIVO","OMBRA","OMERO","ONORE",
  "OPACO","OPERA","OPPIO","ORMAI","OSARE","OSSIA","OSTIA","OSTRA","OVAIA","PACCO",
  "PADRE","PAESE","PALCO","PALIO","PALLA","PALMO","PANNA","PANNO","PARCO","PARSO",
  "PARTO","PASSO","PASTA","PASTO","PATIO","PATTO","PAURA","PAUSA","PAZZO","PECCA",
  "PEGNO","PELLE","PENTO","PERDO","PERLA","PERNO","PERSO","PESCA","PESCE","PETTO",
  "PIAGA","PIANO","PICCO","PIEDE","PIENO","PIGNA","PIGRO","PINTO","PINZA","PIUMA",
  "PIZZA","PIZZO","PODIO","POLLO","POLPA","POLSO","POMPA","PONTE","POPPA","PORCO",
  "PORTA","PORTO","POSSO","POSTO","POZZO","PREDA","PREGO","PREMO","PRESA","PRIMA",
  "PRIMO","PRIVO","PRODE","PRONA","PRORA","PROSA","PROVA","PUNTO","PURGA","RADIO",
  "RAFFO","RAGNO","RAMPA","RANGO","RATTO","RAZZA","REALE","REGNO","RESTO","RETTA",
  "RETTO","RICCO","RIONE","RISMA","RISSO","RITMO","ROCCA","ROGNA","ROMBA","ROMBO",
  "RONCO","ROSSA","ROSSO","ROTTA","RULLA","RULLO","RUMBA","RUOLO","RUOTA","RUSSA",
  "RUSSO","SACCA","SACCO","SACRO","SAGRA","SALMO","SALSA","SALTO","SALVO","SAMBA",
  "SANTO","SARTO","SASSO","SAVIO","SCALA","SCALO","SCEMO","SCENA","SCOPA","SCOPO",
  "SCUDO","SECCO","SEDIA","SEGNO","SENNO","SENSO","SERVO","SESTO","SFERA","SFIDA",
  "SFOGO","SISMA","SODIO","SOGNO","SOLCO","SOLDO","SOMMA","SONNO","SOPRA","SORDO",
  "SORGO","SORSO","SORTE","SORTO","SOTTO","SPADA","SPAGO","SPARO","SPESA","SPIGA",
  "SPORT","STARE","STATO","STELO","STILE","STIMA","STIVA","STOLA","STRIA","STUFA",
  "SULLA","SUOLO","SUONO","SVAGO","SVEVO","TACCO","TALCO","TALPA","TANGO","TANTO",
  "TAPPA","TAPPO","TARDO","TARMA","TASSA","TASTO","TAZZA","TEDIO","TEMPO","TENDA",
  "TENSO","TENTA","TENTO","TENUE","TERGO","TERME","TERNA","TERNO","TERRA","TERSA",
  "TERSO","TERZA","TERZO","TESTA","TESTO","TIGRE","TINCA","TINTO","TOCCA","TOCCO",
  "TOMBA","TONDO","TONNO","TOPPA","TORBA","TORDO","TORMA","TORNA","TORNO","TORSO",
  "TORTA","TORTO","TORVO","TOSCA","TOSSE","TOSTO","TRAMA","TRAVE","TREMO","TRENO",
  "TRONO","TROTA","TURBA","TURBO","TURCO","TURNO","TUTTO","UDIRE","ULIVO","ULTRA",
  "UMANO","UMIDO","UMILE","UNICO","UNIRE","UNITO","USATO","USCIO","USURA","UTILE",
  "VACCA","VANGA","VANTO","VARCA","VARCO","VARIA","VARIO","VASCA","VASTO","VENTO",
  "VERBO","VERDE","VERGA","VERSO","VESTA","VESTO","VETRO","VIGNA","VILLA","VIOLA",
  "VIRTU","VISTA","VOLPE","VOLTA","ZEBRA","ZECCA","ZINCO","ZOLFO","ZOLLA","ZOMBI",
  "ZOPPO","ZUCCA","ZUFFA","ZUPPA"
];
const POOL_SIZE = WORDLE_POOL.length;

// ─── SEED ────────────────────────────────────────────────────────────────────
function getWordleWord(seed) {
  let s = (seed + 200001) >>> 0; // offset cambiato → reset archivio
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b)) >>> 0;
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b)) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0;
  return WORDLE_POOL[s % POOL_SIZE];
}
const EPOCH = new Date("2020-01-01");
function seedFromDate(d) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function formatDate(d) {
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

// ─── EVALUATE ────────────────────────────────────────────────────────────────
function evaluate(guess, target) {
  const result = Array(5).fill("absent");
  const tArr = target.split(""), gArr = guess.split(""), used = Array(5).fill(false);
  for (let i = 0; i < 5; i++) if (gArr[i] === tArr[i]) { result[i] = "correct"; used[i] = true; }
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && gArr[i] === tArr[j]) { result[i] = "present"; used[j] = true; break; }
    }
  }
  return result;
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────
function spawnConfetti() {
  const colors = ["#6aaa64","#c9b458","#538d4e","#b59f3b","#ffffff","#85c0f9"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;top:0;left:${Math.random()*100}vw;
      width:${6+Math.random()*6}px;height:${8+Math.random()*8}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>.5?"50%":"2px"};pointer-events:none;z-index:9999;
      animation:confettiFall ${1.5+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #121213;
  --surface: #1a1a1b;
  --border: #3a3a3c;
  --text: #ffffff;
  --muted: #818384;
  --correct: #6aaa64;
  --present: #c9b458;
  --absent: #787c7e;
}

.wordle-root {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100svh;
}

@keyframes confettiFall {
  0%   { transform: translateY(-10px) rotate(0deg); opacity:1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity:0; }
}
@keyframes revealCell {
  0%   { transform: scale(0.75); opacity:0; }
  60%  { transform: scale(1.06); }
  100% { transform: scale(1); opacity:1; }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-5px); }
  40%,80% { transform: translateX(5px); }
}
@keyframes pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity:0; transform:translateY(-6px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes slideUp {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ── Header ── */
.header {
  width: 100%;
  max-width: 480px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 10px 12px 8px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.header-left  { display: flex; justify-content: flex-start; }
.header-right { display: flex; justify-content: flex-end; gap: 4px; }
.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}
.header-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 3px;
  line-height: 1;
  white-space: nowrap;
}
.header-date {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.3px;
}
.icon-btn {
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: 18px; padding: 5px;
  transition: color .2s; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
}
.icon-btn:hover { color: var(--text); }

/* ── Toast ── */
.toast-container {
  position: fixed; top: 58px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  z-index: 100; pointer-events: none;
}
.toast {
  background: var(--text); color: var(--bg);
  font-weight: 700; font-size: 13px;
  padding: 9px 16px; border-radius: 6px;
  animation: fadeIn .2s ease both;
  white-space: nowrap;
}

/* ── Game area ── */
.game-area {
  flex: 1;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 12px 8px 16px;
}

/* ── Board ── */
.board {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}
.board.shake { animation: shake .4s ease; }
.board-row { display: flex; gap: 5px; }

/* ── Celle ── */
.cell {
  width: 56px; height: 56px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  border: 2px solid var(--border);
  background: var(--bg);
  color: var(--text);
  user-select: none;
}
.cell.filled {
  border-color: #565758;
  animation: pop .1s ease;
}
.cell.revealed {
  border-color: var(--status);
  background: var(--status);
  color: #fff;
  animation: revealCell .22s ease both;
}

/* ── Tastiera ── */
.keyboard {
  width: 100%;
  max-width: 480px;
  display: flex; flex-direction: column; gap: 6px;
}
.kb-row { display: flex; justify-content: center; gap: 5px; }
.kb-key {
  height: 52px; min-width: 36px; max-width: 36px; flex: 1;
  border-radius: 4px; border: none;
  background: #818384; color: #fff;
  font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: background .25s, transform .1s;
  user-select: none;
}
.kb-key.wide { min-width: 58px; max-width: 58px; font-size: 11px; }
.kb-key:active { transform: scale(.95); }
.kb-key.kb-correct { background: var(--correct); }
.kb-key.kb-present { background: var(--present); }
.kb-key.kb-absent  { background: #3a3a3c; }

/* ── Modal ── */
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.78);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; animation: fadeIn .2s ease;
}
.modal {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  width: min(92%, 360px); padding: 22px 18px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  animation: slideUp .3s ease;
}
.modal h2 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; }
.modal p  { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.5; }
.modal-word {
  font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 3px;
  color: var(--correct);
}
.stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; width: 100%; }
.stat-box   { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-num   { font-family: 'Bebas Neue', sans-serif; font-size: 28px; line-height: 1; }
.stat-label { font-size: 10px; color: var(--muted); text-align: center; }
.dist-wrap  { width: 100%; }
.dist-row   { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 3px; }
.dist-num   { width: 10px; text-align: right; color: var(--muted); font-weight: 700; flex-shrink:0; }
.dist-bar   {
  height: 18px; min-width: 18px; background: var(--absent); border-radius: 3px;
  display: flex; align-items: center; justify-content: flex-end; padding-right: 5px;
  font-size: 11px; font-weight: 700; transition: width .5s ease; color: #fff;
}
.dist-bar.hi { background: var(--correct); }
.btn {
  padding: 10px 18px; border-radius: 6px; border: none;
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 13px;
  cursor: pointer; transition: filter .15s, transform .1s;
  white-space: nowrap;
}
.btn:hover  { filter: brightness(1.1); }
.btn:active { transform: scale(.97); }
.btn-primary   { background: var(--correct); color: #fff; }
.btn-secondary { background: var(--border);  color: var(--text); }
.btn-row {
  display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; width: 100%;
}
.share-box {
  background: var(--bg); border-radius: 8px; padding: 10px 14px;
  font-family: monospace; font-size: 16px; letter-spacing: 2px;
  line-height: 1.5; text-align: center; border: 1px solid var(--border);
  white-space: pre; width: 100%;
}
.tutorial-examples { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.tutorial-row { display: flex; gap: 4px; justify-content: center; }
.tutorial-cell {
  width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bebas Neue', sans-serif; font-size: 22px;
  border: 2px solid var(--border); border-radius: 2px;
}
.tutorial-cell.correct { background: var(--correct); border-color: var(--correct); }
.tutorial-cell.present { background: var(--present); border-color: var(--present); }
.tutorial-cell.absent  { background: var(--absent);  border-color: var(--absent);  }
.archive-wrap {
  display: flex; flex-wrap: wrap; gap: 6px;
  max-height: 160px; overflow-y: auto; padding: 2px; width: 100%;
}
.chip {
  padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  cursor: pointer; border: none; background: var(--border); color: var(--text);
  transition: background .2s;
}
.chip:hover  { background: #5a5a5c; }
.chip.today  { background: var(--correct); color: #fff; }

@media (max-width: 380px) {
  .cell { width: 50px; height: 50px; font-size: 24px; }
  .kb-key { min-width: 30px; max-width: 30px; height: 46px; font-size: 10px; }
  .kb-key.wide { min-width: 50px; max-width: 50px; }
  .header-title { font-size: 18px; letter-spacing: 2px; }
}
`;

// ─── COSTANTI ────────────────────────────────────────────────────────────────
const LS = "wi2_";            // prefix cambiato → reset automatico vecchio localStorage
const RESET_FLAG = "wi2_reset_v1";
const MAX_GUESSES = 6;
const WIN_MSGS = [
  "Perfetto! 🎯","Brillante! ✨","Ottimo! 💪","Bravo! 🎉","Ce l'hai fatta!","Salvato in extremis 😅"
];
const KB_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["INVIO","Z","X","C","V","B","N","M","⌫"]
];

function statusColor(s) {
  if (s === "correct") return "var(--correct)";
  if (s === "present") return "var(--present)";
  if (s === "absent")  return "var(--absent)";
  return "transparent";
}

function Keyboard({ onKey, letterStates }) {
  return (
    <div className="keyboard">
      {KB_ROWS.map((row, ri) => (
        <div className="kb-row" key={ri}>
          {row.map(k => {
            const st = letterStates[k] || "";
            return (
              <button key={k}
                className={`kb-key${k.length > 1 ? " wide" : ""}${st ? ` kb-${st}` : ""}`}
                onClick={() => onKey(k)}>
                {k}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [target, setTarget]             = useState("");
  const [dateLabel, setDateLabel]       = useState("");
  const [archiveDate, setArchiveDate]   = useState(null);
  const [guesses, setGuesses]           = useState([]);
  const [revealingRow, setRevealingRow] = useState(null);
  const [revealedCells, setRevealedCells] = useState(0);
  const [current, setCurrent]           = useState("");
  const [gameOver, setGameOver]         = useState(false);
  const [won, setWon]                   = useState(false);
  const [toasts, setToasts]             = useState([]);
  const [shaking, setShaking]           = useState(false);
  const [modal, setModal]               = useState(null);
  const [stats, setStats]               = useState({
    played:0, wins:0, streak:0, maxStreak:0, dist:{1:0,2:0,3:0,4:0,5:0,6:0}
  });
  const [hardMode, setHardMode]         = useState(false);
  const guessesRef = useRef(guesses);
  useEffect(() => { guessesRef.current = guesses; }, [guesses]);

  // ── Init ──
  useEffect(() => {
    if (!localStorage.getItem(RESET_FLAG)) {
      // Cancella vecchio localStorage (prefix wi_) e imposta nuovo
      Object.keys(localStorage)
        .filter(k => k.startsWith("wi_") || k.startsWith("wi2_"))
        .forEach(k => localStorage.removeItem(k));
      localStorage.setItem(RESET_FLAG, "1");
    }
    try { const s = JSON.parse(localStorage.getItem(LS+"stats")||"null"); if(s) setStats(s); } catch {}
    setHardMode(localStorage.getItem(LS+"hard") === "1");
    if (!localStorage.getItem(LS+"seen_tutorial")) {
      setModal("tutorial");
      localStorage.setItem(LS+"seen_tutorial", "1");
    }
  }, []);

  // ── Carica partita ──
  const loadGame = useCallback((date) => {
    const seed = seedFromDate(date);
    setTarget(getWordleWord(seed));
    setDateLabel(formatDate(date));
    setRevealingRow(null); setRevealedCells(0); setCurrent("");
    try {
      const saved = JSON.parse(localStorage.getItem(LS+"game_"+seed)||"null");
      if (saved?.guesses?.length > 0) {
        setGuesses(saved.guesses); setWon(saved.won||false); setGameOver(saved.gameOver||false);
      } else { setGuesses([]); setWon(false); setGameOver(false); }
    } catch { setGuesses([]); setWon(false); setGameOver(false); }
  }, []);

  useEffect(() => { loadGame(archiveDate || new Date()); }, [archiveDate, loadGame]);

  useEffect(() => {
    if (!target) return;
    const seed = seedFromDate(archiveDate || new Date());
    localStorage.setItem(LS+"game_"+seed, JSON.stringify({ guesses, won, gameOver }));
  }, [guesses, won, gameOver, target, archiveDate]);

  // ── Toast ──
  const toast = useCallback((msg, dur=2000) => {
    const id = Date.now() + Math.random();
    setToasts(t => [{id,msg},...t]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), dur);
  }, []);

  // ── Lettera stati ──
  const letterStates = (() => {
    const map = {};
    const all = [...guesses, ...(revealingRow ? [revealingRow] : [])];
    for (const g of all) {
      if (!g.result) continue;
      g.result.forEach((r, i) => {
        const l = g.word[i], prev = map[l];
        if (prev === "correct") return;
        if (r === "correct" || !prev || (r === "present" && prev === "absent")) map[l] = r;
      });
    }
    return map;
  })();

  // ── Rivelazione cella per cella ──
  function revealSequentially(newGuess, onDone) {
    setRevealingRow(newGuess);
    setRevealedCells(0);
    let col = 0;
    const iv = setInterval(() => {
      col++;
      setRevealedCells(col);
      if (col >= 5) {
        clearInterval(iv);
        setTimeout(() => { setRevealingRow(null); setRevealedCells(0); onDone(); }, 120);
      }
    }, 280);
  }

  // ── Submit ──
  const submitGuess = useCallback(() => {
    if (gameOver || revealingRow) return;
    const norm = current.toUpperCase().replace(/[^A-Z]/g, "");
    if (norm.length !== 5) {
      toast("La parola deve avere 5 lettere");
      setShaking(true); setTimeout(() => setShaking(false), 400); return;
    }
    if (hardMode && guessesRef.current.length > 0) {
      const last = guessesRef.current[guessesRef.current.length - 1];
      for (let i = 0; i < 5; i++) {
        if (last.result[i] === "correct" && norm[i] !== last.word[i]) {
          toast(`La ${i+1}ª lettera deve essere ${last.word[i]}`);
          setShaking(true); setTimeout(() => setShaking(false), 400); return;
        }
      }
      const pn = last.word.split("").filter((_,i) => last.result[i] === "present");
      for (const l of pn) {
        if (!norm.includes(l)) {
          toast(`La parola deve contenere ${l}`);
          setShaking(true); setTimeout(() => setShaking(false), 400); return;
        }
      }
    }
    const result = evaluate(norm, target);
    const newGuess = { word: norm, result };
    const attemptNum = guessesRef.current.length + 1;
    setCurrent("");
    revealSequentially(newGuess, () => {
      setGuesses(prev => {
        const next = [...prev, newGuess];
        const isWin  = result.every(r => r === "correct");
        const isLose = !isWin && next.length >= MAX_GUESSES;
        if (isWin) {
          setWon(true); setGameOver(true);
          spawnConfetti();
          toast(WIN_MSGS[Math.min(attemptNum-1, WIN_MSGS.length-1)], 2500);
          updateStats(true, attemptNum);
          setTimeout(() => setModal("end"), 2200);
        } else if (isLose) {
          setGameOver(true);
          toast(target, 3500);
          updateStats(false, 0);
          setTimeout(() => setModal("end"), 3200);
        }
        return next;
      });
    });
  }, [gameOver, revealingRow, current, target, hardMode, toast]);

  function updateStats(win, guessCount) {
    setStats(prev => {
      const d = {...prev.dist};
      if (win) d[guessCount] = (d[guessCount]||0) + 1;
      const streak = win ? prev.streak+1 : 0;
      const maxStreak = Math.max(prev.maxStreak, streak);
      const next = { played:prev.played+1, wins:prev.wins+(win?1:0), streak, maxStreak, dist:d };
      localStorage.setItem(LS+"stats", JSON.stringify(next));
      return next;
    });
  }

  const handleKey = useCallback((k) => {
    if (gameOver || revealingRow) return;
    if (k === "⌫" || k === "Backspace") { setCurrent(c => c.slice(0,-1)); }
    else if (k === "INVIO" || k === "Enter") { submitGuess(); }
    else if (/^[A-Za-z]$/.test(k) && current.length < 5) { setCurrent(c => c + k.toUpperCase()); }
  }, [gameOver, revealingRow, current, submitGuess]);

  useEffect(() => {
    const fn = (e) => handleKey(e.key==="Backspace"?"⌫":e.key==="Enter"?"INVIO":e.key);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handleKey]);

  function buildShare() {
    const h = `🇮🇹 Wordle Italiano — ${dateLabel}\n`;
    const rows = guesses.map(g =>
      g.result.map(r => r==="correct"?"🟩":r==="present"?"🟨":"⬛").join("")
    ).join("\n");
    const score = won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    return h + rows + "\n" + score;
  }

  function playRandom() {
    const offset = 1 + Math.floor(Math.random() * 29);
    const d = new Date(); d.setDate(d.getDate() - offset);
    setArchiveDate(d); setModal(null);
  }

  // ── Render griglia ──
  function renderRows() {
    const rows = [];
    for (let r = 0; r < MAX_GUESSES; r++) {
      if (r < guesses.length) {
        const g = guesses[r];
        rows.push(
          <div className="board-row" key={r}>
            {g.word.split("").map((l,i) => (
              <div key={i} className="cell revealed"
                style={{"--status": statusColor(g.result[i])}}>{l}</div>
            ))}
          </div>
        );
      } else if (revealingRow && r === guesses.length) {
        rows.push(
          <div className="board-row" key={r}>
            {revealingRow.word.split("").map((l,i) => {
              const revealed = i < revealedCells;
              return (
                <div key={i}
                  className={`cell${revealed?" revealed":" filled"}`}
                  style={revealed ? {"--status": statusColor(revealingRow.result[i])} : {}}>
                  {l}
                </div>
              );
            })}
          </div>
        );
      } else if (!gameOver && !revealingRow && r === guesses.length) {
        const letters = current.padEnd(5," ").split("");
        rows.push(
          <div className="board-row" key={r}>
            {letters.map((l,i) => (
              <div key={i} className={`cell${l!==" "?" filled":""}`}>
                {l===" " ? "" : l}
              </div>
            ))}
          </div>
        );
      } else {
        rows.push(
          <div className="board-row" key={r}>
            {Array(5).fill("").map((_,i) => <div key={i} className="cell"></div>)}
          </div>
        );
      }
    }
    return rows;
  }

  // ── Modali ──
  function ModalTutorial() {
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>Come si gioca</h2>
          <p>Indovina la parola in 6 tentativi.<br/>Ogni tentativo deve essere di 5 lettere.</p>
          <div className="tutorial-examples">
            <p style={{fontSize:"12px",color:"var(--muted)"}}>🟩 Lettera corretta nella posizione giusta</p>
            <div className="tutorial-row">
              {["P","I","A","N","O"].map((l,i) => (
                <div key={i} className={`tutorial-cell${i===0?" correct":""}`}>{l}</div>
              ))}
            </div>
            <p style={{fontSize:"12px",color:"var(--muted)"}}>🟨 Lettera presente ma in posizione sbagliata</p>
            <div className="tutorial-row">
              {["F","I","U","M","E"].map((l,i) => (
                <div key={i} className={`tutorial-cell${i===2?" present":""}`}>{l}</div>
              ))}
            </div>
            <p style={{fontSize:"12px",color:"var(--muted)"}}>⬛ Lettera non presente</p>
            <div className="tutorial-row">
              {["V","E","N","T","O"].map((l,i) => (
                <div key={i} className={`tutorial-cell${i===3?" absent":""}`}>{l}</div>
              ))}
            </div>
          </div>
          <p>Una nuova parola ogni giorno!</p>
          <button className="btn btn-primary" onClick={() => setModal(null)}>Inizia!</button>
        </div>
      </div>
    );
  }

  function ModalStats() {
    const maxBar = Math.max(...Object.values(stats.dist), 1);
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>📊 Statistiche</h2>
          <div className="stats-grid">
            <div className="stat-box"><span className="stat-num">{stats.played}</span><span className="stat-label">Partite</span></div>
            <div className="stat-box"><span className="stat-num">{stats.played ? Math.round(stats.wins/stats.played*100) : 0}%</span><span className="stat-label">Vittorie</span></div>
            <div className="stat-box"><span className="stat-num">{stats.streak}</span><span className="stat-label">Serie</span></div>
            <div className="stat-box"><span className="stat-num">{stats.maxStreak}</span><span className="stat-label">Record</span></div>
          </div>
          <div className="dist-wrap">
            {[1,2,3,4,5,6].map(n => (
              <div className="dist-row" key={n}>
                <span className="dist-num">{n}</span>
                <div className={`dist-bar${guesses.length===n&&won?" hi":""}`}
                  style={{width:`${Math.max(18,(stats.dist[n]||0)/maxBar*160)}px`}}>
                  {stats.dist[n]||0}
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => setModal(null)}>Chiudi</button>
        </div>
      </div>
    );
  }

  function ModalEnd() {
    const [copied, setCopied] = useState(false);
    const shareText = buildShare();
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>{won ? "🎉 Hai vinto!" : "😔 Peccato"}</h2>
          {!won && (
            <>
              <p>La parola era:</p>
              <div className="modal-word">{target}</div>
            </>
          )}
          <div className="share-box">{shareText}</div>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => {
              navigator.clipboard.writeText(shareText).then(() => setCopied(true));
              setTimeout(() => setCopied(false), 2000);
            }}>
              {copied ? "✓ Copiato!" : "Condividi"}
            </button>
            <button className="btn btn-secondary" onClick={() => setModal("stats")}>
              📊 Statistiche
            </button>
          </div>
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={playRandom}>
              🎲 Gioca ancora
            </button>
            <button className="btn btn-secondary" onClick={() => setModal("archive")}>
              📅 Archivio
            </button>
          </div>
        </div>
      </div>
    );
  }

  function ModalArchive() {
    const today = new Date();
    const chips = Array.from({length:30}, (_,i) => {
      const d = new Date(today); d.setDate(today.getDate()-i);
      const label = i===0 ? "Oggi" : d.toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"});
      return {d, label, isToday: i===0};
    });
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>📅 Archivio</h2>
          <p>Gioca le sfide degli ultimi 30 giorni</p>
          <div className="archive-wrap">
            {chips.map(({d, label, isToday}, i) => (
              <button key={i} className={`chip${isToday?" today":""}`}
                onClick={() => { setArchiveDate(isToday?null:d); setModal(null); }}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => setModal(null)}>Chiudi</button>
        </div>
      </div>
    );
  }

  function toggleHard() {
    if (guesses.length > 0) { toast("Impossibile cambiare durante la partita"); return; }
    const next = !hardMode; setHardMode(next);
    localStorage.setItem(LS+"hard", next?"1":"0");
    toast(next ? "Modalità difficile attivata 🔥" : "Modalità normale");
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="wordle-root">

        <header className="header">
          <div className="header-left">
            <button className="icon-btn" onClick={() => setModal("tutorial")} title="Come si gioca">?</button>
          </div>
          <div className="header-center">
            <span className="header-title">🇮🇹 WORDLE ITALIANO</span>
            <span className="header-date">{dateLabel}</span>
          </div>
          <div className="header-right">
            <button className="icon-btn" onClick={toggleHard} title="Modalità difficile"
              style={{color: hardMode ? "#f5a000" : "var(--muted)"}}>🔥</button>
            <button className="icon-btn" onClick={() => setModal("stats")} title="Statistiche">📊</button>
            <button className="icon-btn" onClick={() => setModal("archive")} title="Archivio">📅</button>
          </div>
        </header>

        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
        </div>

        <div className="game-area">
          <div className={`board${shaking?" shake":""}`}>
            {renderRows()}
          </div>
          <Keyboard onKey={handleKey} letterStates={letterStates} />
        </div>

      </div>

      {modal==="tutorial" && <ModalTutorial />}
      {modal==="stats"    && <ModalStats />}
      {modal==="end"      && <ModalEnd />}
      {modal==="archive"  && <ModalArchive />}
    </>
  );
}

