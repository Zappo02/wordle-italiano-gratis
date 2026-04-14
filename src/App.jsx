import { useState, useEffect, useCallback, useRef, memo } from "react";

// ─── DATABASE ─────────────────────────────────────────────────────────────────
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

// ─── SEED & DATE ──────────────────────────────────────────────────────────────
function getWordleWord(seed) {
  let s = (seed + 200001) >>> 0;
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b)) >>> 0;
  s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b)) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0;
  return WORDLE_POOL[s % POOL_SIZE];
}
function seedFromDate(d) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function formatDate(d) {
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}
function isToday(d) {
  const t = new Date();
  return d.getFullYear()===t.getFullYear() && d.getMonth()===t.getMonth() && d.getDate()===t.getDate();
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
  for (let i = 0; i < 90; i++) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;top:0;left:${Math.random()*100}vw;
      width:${5+Math.random()*7}px;height:${7+Math.random()*9}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>.5?"50%":"2px"};pointer-events:none;z-index:9999;
      animation:confettiFall ${1.5+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.6}s;`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────
const Countdown = memo(function Countdown() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    function tick() {
      const now = new Date();
      const midnight = new Date(now); midnight.setHours(24,0,0,0);
      const diff = midnight - now;
      const h = String(Math.floor(diff/3600000)).padStart(2,"0");
      const m = String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
      const s = String(Math.floor((diff%60000)/1000)).padStart(2,"0");
      setTime(`${h}:${m}:${s}`);
    }
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return <span className="countdown-time">{time}</span>;
});

// ─── SWIPE-DOWN hook per chiudere modal ───────────────────────────────────────
function useSwipeDown(onSwipe) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startY = 0;
    const onTouchStart = (e) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e) => { if (e.changedTouches[0].clientY - startY > 60) onSwipe(); };
    el.addEventListener("touchstart", onTouchStart, {passive:true});
    el.addEventListener("touchend", onTouchEnd, {passive:true});
    return () => { el.removeEventListener("touchstart",onTouchStart); el.removeEventListener("touchend",onTouchEnd); };
  }, [onSwipe]);
  return ref;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#121213;--surface:#1a1a1b;--border:#3a3a3c;
  --text:#fff;--muted:#818384;
  --correct:#6aaa64;--present:#c9b458;--absent:#787c7e;
}
.light{
  --bg:#f9f9f9;--surface:#fff;--border:#d3d6da;
  --text:#1a1a1b;--muted:#6e7275;--absent:#878a8c;
}
.light .kb-key{background:#d3d6da;color:#1a1a1b}
.light .kb-key.kb-correct{background:var(--correct);color:#fff}
.light .kb-key.kb-present{background:var(--present);color:#fff}
.light .kb-key.kb-absent{background:#787c7e;color:#fff}
.light .cell{background:var(--bg);color:var(--text)}
.light .btn-secondary{background:#c5c7c9!important;color:#1a1a1b!important}
.light .share-box{background:#efefef}
.light .toast{background:#1a1a1b;color:#fff}

.wordle-root{
  background:var(--bg);color:var(--text);
  font-family:'Inter',sans-serif;
  display:flex;flex-direction:column;align-items:center;
  width:100%;
  /* Usa altezza dinamica del viewport — si adatta quando la tastiera nativa appare */
  min-height:100dvh;
  transition:background .25s,color .25s;
}

@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
@keyframes revealCell{0%{transform:scale(.75);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
@keyframes bounceWin{0%,100%{transform:translateY(0)}40%{transform:translateY(-10px)}60%{transform:translateY(-4px)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes streakPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}

/* Header — griglia 3 colonne per centrare il titolo */
.header{
  width:100%;max-width:480px;
  display:grid;grid-template-columns:1fr auto 1fr;
  align-items:center;padding:10px 10px 8px;
  border-bottom:1px solid var(--border);flex-shrink:0;
}
.header-left{display:flex;justify-content:flex-start;align-items:center;gap:2px}
.header-right{display:flex;justify-content:flex-end;align-items:center;gap:2px}
.header-center{
  display:flex;flex-direction:column;
  /* Lieve offset a sinistra per bilanciare visivamente i tasti a destra */
  align-items:flex-start;
  padding-left:6px;
  gap:1px;
}
.header-title{
  font-family:'Bebas Neue',sans-serif;font-size:22px;
  letter-spacing:3px;line-height:1;white-space:nowrap;color:var(--text);
}
.header-date{font-size:10px;color:var(--muted);letter-spacing:.3px}

.icon-btn{
  background:none;border:none;cursor:pointer;color:var(--muted);
  font-size:16px;line-height:1;
  display:flex;align-items:center;justify-content:center;
  width:28px;height:28px;border-radius:6px;transition:color .2s,background .2s;
}
.icon-btn:hover{color:var(--text);background:rgba(128,128,128,.12)}

.streak-badge{
  display:flex;align-items:center;gap:2px;font-size:12px;font-weight:700;color:#f5a000;
  padding:2px 6px;border-radius:10px;
  background:rgba(245,160,0,.12);border:1px solid rgba(245,160,0,.25);
  margin-right:2px;white-space:nowrap;
}
.streak-badge.pulse{animation:streakPulse .4s ease}

/* Toast */
.toast-container{
  position:fixed;top:56px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:8px;
  z-index:100;pointer-events:none;
}
.toast{
  background:var(--text);color:var(--bg);
  font-weight:700;font-size:13px;padding:9px 16px;border-radius:6px;
  animation:fadeIn .2s ease both;white-space:nowrap;
}

/* Game area — usa flex con overflow hidden per non sforare */
.game-area{
  flex:1;width:100%;max-width:480px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:8px;
  /* Padding bottom generoso per lasciare spazio alla tastiera visuale */
  padding:8px 8px 12px;
  overflow:hidden;
}

/* Board */
.board{display:flex;flex-direction:column;gap:5px;align-items:center}
.board.shake{animation:shake .4s ease}
.board-row{display:flex;gap:5px}

/* Celle — dimensione adattiva con clamp */
.cell{
  width:clamp(44px,11vw,56px);
  height:clamp(44px,11vw,56px);
  display:flex;align-items:center;justify-content:center;
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(22px,5.5vw,28px);
  border:2px solid var(--border);background:var(--bg);color:var(--text);
  user-select:none;transition:border-color .1s;cursor:pointer;
}
.cell.filled{border-color:#787c7e;animation:pop .1s ease}
.cell.revealed{border-color:var(--status);background:var(--status);color:#fff;animation:revealCell .22s ease both}
.cell.bounce{animation:bounceWin .5s ease var(--delay) both}
/* Riga corrente: bordo luminoso in dark mode */
.cell.current-row{border-color:#909090}
.cell.current-row.filled{border-color:#c8c8c8}
.light .cell.current-row{border-color:#888}
.light .cell.current-row.filled{border-color:#444}

/* Input nascosto per tastiera nativa */
.hidden-input{
  position:absolute;opacity:0;width:1px;height:1px;
  top:50%;left:50%;pointer-events:none;
  font-size:16px; /* Evita zoom automatico su iOS */
  border:none;outline:none;background:transparent;
  /* autocomplete e autocorrect disabilitati */
}

/* Contatore */
.attempt-counter{
  font-size:11px;color:var(--muted);font-weight:600;
  letter-spacing:.5px;text-align:center;min-height:15px;
}

/* Tastiera visuale — tasti ridimensionati con clamp */
.keyboard{width:100%;max-width:480px;display:flex;flex-direction:column;gap:5px;flex-shrink:0}
.kb-row{display:flex;justify-content:center;gap:4px}
.kb-key{
  height:clamp(42px,10.5vw,52px);
  min-width:clamp(28px,7vw,36px);
  max-width:clamp(28px,7vw,36px);
  flex:1;border-radius:4px;border:none;
  background:#818384;color:#fff;
  font-family:'Inter',sans-serif;
  font-size:clamp(10px,2.8vw,12px);
  font-weight:700;cursor:pointer;
  transition:background .25s,transform .1s;user-select:none;
  /* Niente touch-action per risposta immediata */
  touch-action:manipulation;
}
.kb-key.wide{
  min-width:clamp(46px,11.5vw,58px);
  max-width:clamp(46px,11.5vw,58px);
  font-size:clamp(9px,2.5vw,11px);
}
.kb-key:active{transform:scale(.94)}
.kb-key.kb-correct{background:var(--correct)}
.kb-key.kb-present{background:var(--present)}
.kb-key.kb-absent{background:#3a3a3c}

/* Modal */
.overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.82);
  display:flex;align-items:center;justify-content:center;
  z-index:200;padding:16px;
}
.modal{
  background:var(--surface);border:1px solid var(--border);border-radius:14px;
  width:100%;max-width:340px;padding:20px 16px;
  display:flex;flex-direction:column;align-items:center;gap:13px;
  animation:slideUp .25s ease both;
  max-height:90dvh;overflow-y:auto;
}
/* Handle per swipe su mobile */
.modal-handle{
  width:36px;height:4px;border-radius:2px;
  background:var(--border);margin-bottom:-4px;flex-shrink:0;
}
.modal h2{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:2px;color:var(--text)}
.modal p{font-size:13px;color:var(--muted);text-align:center;line-height:1.5}
.modal-word{
  font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:4px;
  color:var(--correct);background:rgba(106,170,100,.12);
  padding:6px 20px;border-radius:8px;border:1px solid rgba(106,170,100,.3);
}
.countdown-wrap{
  display:flex;flex-direction:column;align-items:center;gap:3px;width:100%;
  padding:10px;border-radius:10px;border:1px solid var(--border);
  background:rgba(255,255,255,.03);
}
.countdown-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
.countdown-time{font-family:'Bebas Neue',sans-serif;font-size:34px;letter-spacing:4px;color:var(--text);line-height:1}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;width:100%}
.stat-box{display:flex;flex-direction:column;align-items:center;gap:2px}
.stat-num{font-family:'Bebas Neue',sans-serif;font-size:30px;line-height:1;color:var(--text)}
.stat-label{font-size:10px;color:var(--muted);text-align:center}
.dist-wrap{width:100%}
.dist-row{display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:4px}
.dist-num{width:10px;text-align:right;color:var(--muted);font-weight:700;flex-shrink:0}
.dist-bar{
  height:20px;min-width:24px;background:var(--absent);border-radius:3px;
  display:flex;align-items:center;justify-content:flex-end;padding-right:6px;
  font-size:11px;font-weight:700;color:#fff;
}
.dist-bar.hi{background:var(--correct)}
.btn{
  padding:11px 16px;border-radius:8px;border:none;
  font-family:'Inter',sans-serif;font-weight:700;font-size:13px;
  cursor:pointer;transition:filter .15s,transform .1s;
  white-space:nowrap;color:#fff!important;touch-action:manipulation;
}
.btn:hover{filter:brightness(1.12)}
.btn:active{transform:scale(.97)}
.btn-primary{background:var(--correct)}
.btn-secondary{background:#4a4a4c}
.btn-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%}
.share-box{
  background:#0e0e0f;border-radius:10px;padding:12px 14px;
  border:1px solid var(--border);width:100%;
  display:flex;flex-direction:column;align-items:center;gap:4px;
}
.share-header{font-size:12px;color:var(--muted);text-align:center}
.share-grid{font-size:19px;line-height:1.5;display:flex;flex-direction:column;align-items:center}
.share-score{font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--correct);letter-spacing:1px;margin-top:3px}
.tutorial-examples{display:flex;flex-direction:column;gap:10px;width:100%}
.tutorial-row{display:flex;gap:4px;justify-content:center}
.tutorial-cell{
  width:42px;height:42px;display:flex;align-items:center;justify-content:center;
  font-family:'Bebas Neue',sans-serif;font-size:22px;
  border:2px solid var(--border);border-radius:2px;color:var(--text);
}
.tutorial-cell.correct{background:var(--correct);border-color:var(--correct);color:#fff}
.tutorial-cell.present{background:var(--present);border-color:var(--present);color:#fff}
.tutorial-cell.absent{background:var(--absent);border-color:var(--absent);color:#fff}
.archive-wrap{display:flex;flex-wrap:wrap;gap:6px;max-height:155px;overflow-y:auto;padding:2px;width:100%}
.chip{
  padding:5px 10px;border-radius:20px;font-size:11px;font-weight:600;
  cursor:pointer;border:1px solid transparent;background:var(--border);color:var(--text);
  display:flex;align-items:center;gap:4px;touch-action:manipulation;
}
.chip:hover{filter:brightness(1.2)}
.chip.today{background:var(--correct);color:#fff}
.chip.done-w{background:rgba(106,170,100,.2);color:var(--correct);border-color:rgba(106,170,100,.35)}
.chip.done-l{background:rgba(120,124,126,.15);color:var(--muted);border-color:rgba(120,124,126,.3)}
.chip-dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
.archive-legend{font-size:11px;color:var(--muted);display:flex;gap:12px;justify-content:center}
.archive-legend span{display:flex;align-items:center;gap:4px}
`;

// ─── COSTANTI ────────────────────────────────────────────────────────────────
const LS = "wi2_", RESET_FLAG = "wi2_reset_v1", MAX_GUESSES = 6;
const WIN_MSGS = ["Perfetto! 🎯","Brillante! ✨","Ottimo! 💪","Bravo! 🎉","Ce l'hai fatta!","Salvato in extremis 😅"];
const KB_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["INVIO","Z","X","C","V","B","N","M","⌫"]
];

function statusColor(s) {
  if (s==="correct") return "var(--correct)";
  if (s==="present") return "var(--present)";
  if (s==="absent")  return "var(--absent)";
  return "transparent";
}

// ─── KEYBOARD ────────────────────────────────────────────────────────────────
const Keyboard = memo(function Keyboard({onKey, letterStates}) {
  return (
    <div className="keyboard">
      {KB_ROWS.map((row,ri) => (
        <div className="kb-row" key={ri}>
          {row.map(k => {
            const st = letterStates[k]||"";
            return (
              <button key={k}
                className={`kb-key${k.length>1?" wide":""}${st?` kb-${st}`:""}`}
                onTouchEnd={e => { e.preventDefault(); onKey(k); }}
                onClick={e => { e.preventDefault(); onKey(k); }}>
                {k}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
});

// ─── MODALI ──────────────────────────────────────────────────────────────────
const ModalTutorial = memo(function ModalTutorial({onClose}) {
  const ref = useSwipeDown(onClose);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" ref={ref} onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
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
        <p>Una nuova parola ogni giorno!<br/>Puoi digitare dalla tastiera del telefono toccando la griglia.</p>
        <button className="btn btn-primary" onClick={onClose}>Inizia!</button>
      </div>
    </div>
  );
});

const ModalStats = memo(function ModalStats({stats, guesses, won, onClose}) {
  const ref = useSwipeDown(onClose);
  const maxBar = Math.max(...Object.values(stats.dist), 1);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" ref={ref} onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <h2>Statistiche</h2>
        <div className="stats-grid">
          <div className="stat-box"><span className="stat-num">{stats.played}</span><span className="stat-label">Partite</span></div>
          <div className="stat-box"><span className="stat-num">{stats.played?Math.round(stats.wins/stats.played*100):0}%</span><span className="stat-label">Vittorie</span></div>
          <div className="stat-box"><span className="stat-num">{stats.streak}</span><span className="stat-label">Serie</span></div>
          <div className="stat-box"><span className="stat-num">{stats.maxStreak}</span><span className="stat-label">Record</span></div>
        </div>
        <div className="dist-wrap">
          {[1,2,3,4,5,6].map(n => (
            <div className="dist-row" key={n}>
              <span className="dist-num">{n}</span>
              <div className={`dist-bar${guesses.length===n&&won?" hi":""}`}
                style={{width:`${Math.max(24,(stats.dist[n]||0)/maxBar*160)}px`}}>
                {stats.dist[n]||0}
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={onClose}>Chiudi</button>
      </div>
    </div>
  );
});

const ModalEnd = memo(function ModalEnd({won, target, guesses, dateLabel, archiveDate, share, onClose, onStats, onRandom, onArchive}) {
  const [copied, setCopied] = useState(false);
  const ref = useSwipeDown(onClose);
  const showCountdown = !archiveDate || isToday(archiveDate);

  function doShare() {
    if (navigator.share) {
      navigator.share({ text: share.plainText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(share.plainText).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" ref={ref} onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <h2>{won ? "Hai vinto!" : "Peccato"}</h2>
        {!won && <><p>La parola era:</p><div className="modal-word">{target}</div></>}
        <div className="share-box">
          <div className="share-header">{share.header}</div>
          <div className="share-grid">{share.rows.map((row,i) => <div key={i}>{row}</div>)}</div>
          <div className="share-score">{share.score}</div>
        </div>
        {showCountdown && (
          <div className="countdown-wrap">
            <span className="countdown-label">Prossima parola tra</span>
            <Countdown />
          </div>
        )}
        <div className="btn-row">
          <button className="btn btn-primary" onClick={doShare}>
            {navigator.share ? "Condividi" : (copied ? "✓ Copiato!" : "Copia")}
          </button>
          <button className="btn btn-secondary" onClick={onStats}>Statistiche</button>
        </div>
        <div className="btn-row">
          <button className="btn btn-secondary" onClick={onRandom}>Gioca ancora</button>
          <button className="btn btn-secondary" onClick={onArchive}>Archivio</button>
        </div>
      </div>
    </div>
  );
});

const ModalArchive = memo(function ModalArchive({onSelect, onClose, getStatus}) {
  const ref = useSwipeDown(onClose);
  const today = new Date();
  const chips = Array.from({length:30}, (_,i) => {
    const d = new Date(today); d.setDate(today.getDate()-i);
    const label = i===0 ? "Oggi" : d.toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"});
    return {d, label, isToday: i===0, status: getStatus(d)};
  });
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" ref={ref} onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <h2>Archivio</h2>
        <p>Gioca le sfide degli ultimi 30 giorni</p>
        <div className="archive-wrap">
          {chips.map(({d, label, isToday: it, status}, i) => {
            let cls = "chip";
            if (it) cls += " today";
            else if (status==="w") cls += " done-w";
            else if (status==="l") cls += " done-l";
            return (
              <button key={i} className={cls} onClick={() => onSelect(it ? null : d)}>
                {status && <span className="chip-dot"/>}
                {label}
              </button>
            );
          })}
        </div>
        <div className="archive-legend">
          <span><span style={{color:"var(--correct)"}}>●</span> vinta</span>
          <span><span style={{color:"var(--muted)"}}>●</span> persa</span>
        </div>
        <button className="btn btn-secondary" onClick={onClose}>Chiudi</button>
      </div>
    </div>
  );
});

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [target,setTarget]               = useState("");
  const [dateLabel,setDateLabel]         = useState("");
  const [archiveDate,setArchiveDate]     = useState(null);
  const [guesses,setGuesses]             = useState([]);
  const [revealingRow,setRevealingRow]   = useState(null);
  const [revealedCells,setRevealedCells] = useState(0);
  const [bounceRow,setBounceRow]         = useState(false);
  const [current,setCurrent]             = useState("");
  const [gameOver,setGameOver]           = useState(false);
  const [won,setWon]                     = useState(false);
  const [toasts,setToasts]               = useState([]);
  const [shaking,setShaking]             = useState(false);
  const [modal,setModal]                 = useState(null);
  const [lightMode,setLightMode]         = useState(false);
  const [hardMode,setHardMode]           = useState(false);
  const [stats,setStats]                 = useState({played:0,wins:0,streak:0,maxStreak:0,dist:{1:0,2:0,3:0,4:0,5:0,6:0}});
  const [streakPulse,setStreakPulse]     = useState(false);

  const guessesRef  = useRef(guesses);
  const inputRef    = useRef(null);  // input nascosto per tastiera nativa
  const gameOverRef = useRef(gameOver);
  const revealRef   = useRef(revealingRow);

  useEffect(() => { guessesRef.current  = guesses;      }, [guesses]);
  useEffect(() => { gameOverRef.current = gameOver;     }, [gameOver]);
  useEffect(() => { revealRef.current   = revealingRow; }, [revealingRow]);

  // postMessage altezza iframe WordPress
  useEffect(() => {
    function send() { window.parent?.postMessage({type:"wordle-height",height:document.body.scrollHeight},"*"); }
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  // Init
  useEffect(() => {
    if (!localStorage.getItem(RESET_FLAG)) {
      Object.keys(localStorage).filter(k=>k.startsWith("wi_")||k.startsWith("wi2_")).forEach(k=>localStorage.removeItem(k));
      localStorage.setItem(RESET_FLAG,"1");
    }
    try { const s=JSON.parse(localStorage.getItem(LS+"stats")||"null"); if(s) setStats(s); } catch {}
    setHardMode(localStorage.getItem(LS+"hard")==="1");
    setLightMode(localStorage.getItem(LS+"light")==="1");
    if (!localStorage.getItem(LS+"seen_tutorial")) {
      setModal("tutorial");
      localStorage.setItem(LS+"seen_tutorial","1");
    }
  }, []);

  // Salva draft
  useEffect(() => {
    if (!target||gameOver) return;
    localStorage.setItem(LS+"draft_"+seedFromDate(archiveDate||new Date()), current);
  }, [current, target, gameOver, archiveDate]);

  // Carica partita
  const loadGame = useCallback((date) => {
    const seed = seedFromDate(date);
    setTarget(getWordleWord(seed));
    setDateLabel(formatDate(date));
    setRevealingRow(null); setRevealedCells(0); setBounceRow(false);
    try {
      const saved = JSON.parse(localStorage.getItem(LS+"game_"+seed)||"null");
      if (saved?.guesses?.length > 0) {
        setGuesses(saved.guesses); setWon(saved.won||false); setGameOver(saved.gameOver||false); setCurrent("");
      } else {
        setGuesses([]); setWon(false); setGameOver(false);
        setCurrent(localStorage.getItem(LS+"draft_"+seed)||"");
      }
    } catch { setGuesses([]); setWon(false); setGameOver(false); setCurrent(""); }
  }, []);

  useEffect(() => { loadGame(archiveDate||new Date()); }, [archiveDate, loadGame]);

  useEffect(() => {
    if (!target) return;
    localStorage.setItem(LS+"game_"+seedFromDate(archiveDate||new Date()), JSON.stringify({guesses,won,gameOver}));
  }, [guesses, won, gameOver, target, archiveDate]);

  // Toast
  const toast = useCallback((msg, dur=2000) => {
    const id = Date.now()+Math.random();
    setToasts(t => [{id,msg},...t]);
    setTimeout(() => setToasts(t => t.filter(x=>x.id!==id)), dur);
  }, []);

  // Lettera stati
  const letterStates = (() => {
    const map = {};
    const all = [...guesses, ...(revealingRow?[revealingRow]:[])];
    for (const g of all) {
      if (!g.result) continue;
      g.result.forEach((r,i) => {
        const l=g.word[i], prev=map[l];
        if (prev==="correct") return;
        if (r==="correct"||!prev||(r==="present"&&prev==="absent")) map[l]=r;
      });
    }
    return map;
  })();

  // Rivelazione cella per cella
  function revealSequentially(newGuess, onDone) {
    setRevealingRow(newGuess); setRevealedCells(0);
    let col = 0;
    const iv = setInterval(() => {
      col++; setRevealedCells(col);
      if (col >= 5) { clearInterval(iv); setTimeout(() => { setRevealingRow(null); setRevealedCells(0); onDone(); }, 120); }
    }, 280);
  }

  // Submit (useCallback con ref per evitare closure stale)
  const submitGuess = useCallback(() => {
    if (gameOverRef.current || revealRef.current) return;
    const norm = current.toUpperCase().replace(/[^A-Z]/g,"");
    if (norm.length !== 5) {
      toast("La parola deve avere 5 lettere");
      setShaking(true); setTimeout(()=>setShaking(false),400); return;
    }
    if (navigator.vibrate) navigator.vibrate(30);
    if (hardMode && guessesRef.current.length > 0) {
      const last = guessesRef.current[guessesRef.current.length-1];
      for (let i=0;i<5;i++) {
        if (last.result[i]==="correct"&&norm[i]!==last.word[i]) {
          toast(`La ${i+1}ª lettera deve essere ${last.word[i]}`);
          setShaking(true); setTimeout(()=>setShaking(false),400); return;
        }
      }
      for (const l of last.word.split("").filter((_,i)=>last.result[i]==="present")) {
        if (!norm.includes(l)) { toast(`La parola deve contenere ${l}`); setShaking(true); setTimeout(()=>setShaking(false),400); return; }
      }
    }
    const result = evaluate(norm, target);
    const newGuess = {word:norm, result};
    const attemptNum = guessesRef.current.length+1;
    setCurrent("");
    // Resetta e ri-focalizza l'input nascosto
    if (inputRef.current) { inputRef.current.value = ""; }
    localStorage.removeItem(LS+"draft_"+seedFromDate(archiveDate||new Date()));
    revealSequentially(newGuess, () => {
      setGuesses(prev => {
        const next = [...prev, newGuess];
        const isWin  = result.every(r=>r==="correct");
        const isLose = !isWin && next.length >= MAX_GUESSES;
        if (isWin) {
          setWon(true); setGameOver(true);
          setTimeout(()=>{setBounceRow(true);setTimeout(()=>setBounceRow(false),1600);},80);
          setTimeout(()=>spawnConfetti(),250);
          if (navigator.vibrate) navigator.vibrate([50,30,50,30,100]);
          toast(WIN_MSGS[Math.min(attemptNum-1,WIN_MSGS.length-1)],2500);
          updateStats(true,attemptNum);
          setTimeout(()=>setModal("end"),2200);
        } else if (isLose) {
          setGameOver(true);
          if (navigator.vibrate) navigator.vibrate([100,50,100]);
          toast(target,3500);
          updateStats(false,0);
          setTimeout(()=>setModal("end"),3200);
        }
        return next;
      });
    });
  }, [current, target, hardMode, archiveDate, toast]);

  function updateStats(win, guessCount) {
    setStats(prev => {
      const d = {...prev.dist};
      if (win) d[guessCount] = (d[guessCount]||0)+1;
      const streak = win ? prev.streak+1 : 0;
      const maxStreak = Math.max(prev.maxStreak, streak);
      const next = {played:prev.played+1,wins:prev.wins+(win?1:0),streak,maxStreak,dist:d};
      localStorage.setItem(LS+"stats",JSON.stringify(next));
      if (win&&streak>1) { setStreakPulse(true); setTimeout(()=>setStreakPulse(false),500); }
      return next;
    });
  }

  // Gestione tasto fisico
  const handleKey = useCallback((k) => {
    if (gameOverRef.current || revealRef.current) return;
    if (k==="⌫"||k==="Backspace") setCurrent(c=>c.slice(0,-1));
    else if (k==="INVIO"||k==="Enter") submitGuess();
    else if (/^[A-Za-zàáèéìíòóùú]$/i.test(k) && current.length<5) {
      const upper = k.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Z]/g,"");
      if (upper) setCurrent(c=>c+upper);
    }
  }, [current, submitGuess]);

  // Tastiera fisica del computer
  useEffect(() => {
    const fn = (e) => {
      if (e.ctrlKey||e.metaKey||e.altKey) return;
      handleKey(e.key==="Backspace"?"⌫":e.key==="Enter"?"INVIO":e.key);
    };
    window.addEventListener("keydown",fn);
    return () => window.removeEventListener("keydown",fn);
  }, [handleKey]);

  // Input nascosto per tastiera nativa mobile
  // Intercetta ogni carattere digitato e lo invia a handleKey
  const handleNativeInput = useCallback((e) => {
    const val = e.target.value;
    if (!val) return;
    // Ogni carattere inserito viene processato
    for (const ch of val) {
      if (/^[A-Za-zàáèéìíòóùú]$/.test(ch)) handleKey(ch);
    }
    e.target.value = "";
  }, [handleKey]);

  const handleNativeKeyDown = useCallback((e) => {
    if (e.key === "Backspace") { e.preventDefault(); handleKey("⌫"); }
    if (e.key === "Enter")     { e.preventDefault(); handleKey("INVIO"); }
  }, [handleKey]);

  // Focus sull'input nascosto quando si tocca la griglia
  const focusInput = useCallback(() => {
    if (gameOver || modal) return;
    inputRef.current?.focus();
  }, [gameOver, modal]);

  const buildShare = useCallback(() => {
    const header = `Wordle Italiano — ${dateLabel}`;
    const rows = guesses.map(g=>g.result.map(r=>r==="correct"?"🟩":r==="present"?"🟨":"⬛").join(""));
    const score = won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    return {header, rows, score, plainText:`🇮🇹 ${header}\n${rows.join("\n")}\n${score}`};
  }, [guesses, won, dateLabel]);

  const playRandom = useCallback(() => {
    const offset = 1+Math.floor(Math.random()*29);
    const d = new Date(); d.setDate(d.getDate()-offset);
    setArchiveDate(d); setModal(null);
  }, []);

  const getArchiveStatus = useCallback((d) => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS+"game_"+seedFromDate(d))||"null");
      if (!saved?.guesses?.length) return null;
      return saved.won ? "w" : "l";
    } catch { return null; }
  }, []);

  // Render griglia
  function renderRows() {
    const rows = [];
    const winRow = won ? guesses.length-1 : -1;
    const currentRowIdx = gameOver ? -1 : guesses.length;

    for (let r=0; r<MAX_GUESSES; r++) {
      if (r < guesses.length) {
        const g = guesses[r];
        const isBounce = r===winRow && bounceRow;
        rows.push(
          <div className="board-row" key={r}>
            {g.word.split("").map((l,i) => (
              <div key={i} className={`cell revealed${isBounce?" bounce":""}`}
                style={{"--status":statusColor(g.result[i]),...(isBounce?{"--delay":`${i*80}ms`}:{})}}>{l}</div>
            ))}
          </div>
        );
      } else if (revealingRow && r===guesses.length) {
        rows.push(
          <div className="board-row" key={r}>
            {revealingRow.word.split("").map((l,i) => {
              const rev = i < revealedCells;
              return (
                <div key={i} className={`cell${rev?" revealed":" filled"}`}
                  style={rev?{"--status":statusColor(revealingRow.result[i])}:{}}>{l}</div>
              );
            })}
          </div>
        );
      } else if (r === currentRowIdx) {
        const letters = current.padEnd(5," ").split("");
        rows.push(
          <div className="board-row" key={r}>
            {letters.map((l,i) => (
              <div key={i} className={`cell current-row${l!==" "?" filled":""}`}>{l===" "?"":l}</div>
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

  const attemptText = gameOver
    ? (won ? `Indovinata in ${guesses.length}/${MAX_GUESSES}` : "Non indovinata")
    : revealingRow ? "" : `${guesses.length}/${MAX_GUESSES}`;

  const share = buildShare();

  return (
    <>
      <style>{STYLES}</style>
      <div className={`wordle-root${lightMode?" light":""}`}>

        {/* Input nascosto — cattura tastiera nativa mobile */}
        <input
          ref={inputRef}
          className="hidden-input"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck="false"
          onInput={handleNativeInput}
          onKeyDown={handleNativeKeyDown}
          readOnly={gameOver}
          aria-hidden="true"
        />

        <header className="header">
          <div className="header-left">
            <button className="icon-btn" onClick={()=>setModal("tutorial")} title="Come si gioca">?</button>
          </div>
          <div className="header-center">
            <span className="header-title">WORDLE ITALIANO</span>
            <span className="header-date">{dateLabel}</span>
          </div>
          <div className="header-right">
            {stats.streak>=2 && (
              <div className={`streak-badge${streakPulse?" pulse":""}`}>🔥{stats.streak}</div>
            )}
            <button className="icon-btn" title="Tema"
              onClick={()=>{setLightMode(n=>{const v=!n;localStorage.setItem(LS+"light",v?"1":"0");return v;});}}>
              {lightMode?"🌙":"☀️"}
            </button>
            <button className="icon-btn" title="Modalità difficile"
              style={{color:hardMode?"#f5a000":"var(--muted)"}}
              onClick={()=>{
                if(guesses.length>0){toast("Impossibile cambiare durante la partita");return;}
                setHardMode(n=>{const v=!n;localStorage.setItem(LS+"hard",v?"1":"0");toast(v?"Modalità difficile 🔥":"Modalità normale");return v;});
              }}>
              {hardMode?"★":"☆"}
            </button>
            <button className="icon-btn" title="Statistiche" style={{fontSize:"18px",fontWeight:"700"}}
              onClick={()=>setModal("stats")}>≡</button>
            <button className="icon-btn" title="Archivio" style={{fontSize:"15px"}}
              onClick={()=>setModal("archive")}>◷</button>
          </div>
        </header>

        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
        </div>

        <div className="game-area">
          {/* Tap sulla griglia → focus input nascosto → tastiera nativa */}
          <div className={`board${shaking?" shake":""}`} onClick={focusInput}>
            {renderRows()}
          </div>
          <div className="attempt-counter">{attemptText}</div>
          <Keyboard onKey={handleKey} letterStates={letterStates}/>
        </div>

      </div>

      {modal==="tutorial" && <ModalTutorial onClose={()=>setModal(null)}/>}
      {modal==="stats"    && <ModalStats stats={stats} guesses={guesses} won={won} onClose={()=>setModal(null)}/>}
      {modal==="end"      && (
        <ModalEnd
          won={won} target={target} guesses={guesses}
          dateLabel={dateLabel} archiveDate={archiveDate}
          share={share}
          onClose={()=>setModal(null)}
          onStats={()=>setModal("stats")}
          onRandom={playRandom}
          onArchive={()=>setModal("archive")}
        />
      )}
      {modal==="archive" && (
        <ModalArchive
          onSelect={(d)=>{setArchiveDate(d);setModal(null);}}
          onClose={()=>setModal(null)}
          getStatus={getArchiveStatus}
        />
      )}
    </>
  );
}

