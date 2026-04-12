import { useState, useEffect, useCallback, useRef } from "react";

// ─── DATABASE — parole italiane comuni e certe, 5 lettere ────────────────────
const DB_RAW = [
  // A
  "ABETE","ABITO","ACETO","ACIDO","ACQUA","AGILE","AGLIO","AGIRE","AIUTO","ALITO",
  "ALONE","ALTRO","AMARO","AMBRA","AMICO","AMORE","ANIMA","ANSIA","APICE","ARENA",
  "ARIDO","AROMA","ARCO","ARSO","ARTE","ASINO","ASPRO","ASTRO","ATOMO","AUDIO",
  "AVERE","AVIDO","ABUSO","ALARE","ALGHE","AMACA","AMEBO","AMENO","AMPIO","ANETO",
  "APNEA","ARABO","ARNIA","ARSIA","ANIME","ARARE","AGONE","ALONE","AMPIA","ANNUO",
  // B
  "BABBO","BACIO","BANCO","BARCA","BASSO","BELLO","BIRRA","BOCCA","BORDO","BOSCO",
  "BRAVO","BREVE","BUONO","BUSTO","BAGNO","BALDO","BALLA","BALSA","BALZO","BANDA",
  "BARBA","BARDO","BAULE","BELVA","BIECO","BIRBO","BOLLA","BOMBA","BONGO","BORSA",
  "BRACA","BRAMA","BRANO","BRINA","BRODO","BRUNA","BULBO","BULLO","BURLA","BASTO",
  "BANDO","BEFFA","BINGO","BOSSO","BOCCE","BABEA",
  // C
  "CALDO","CALVO","CAMPO","CANTO","CAPRA","CARTA","CARRO","CASCO","CASSA","CAUSA",
  "CELLA","CERTO","CIELO","CIRCO","COBRA","COLLA","COLLO","COLMO","COLPA","COLPO",
  "CORDA","CORPO","CORSA","CORTE","COSMO","CREMA","CROCE","CUORE","CURVA","CALCE",
  "CALMA","CALMO","CALZA","CANOA","CAPPA","CAPRO","CARMA","CARPA","CARSO","CASTA",
  "CASTO","CAVIA","CEDRO","CENNO","CENSO","CERVO","CESTA","CESTO","CHINA","CIGNO",
  "CIPPO","CLAVA","CLERO","CLIMA","CLONE","CLORO","COCCO","COFFA","CONCA","CONTA",
  "CONTE","COPIA","COPPA","CORNO","CORVO","COSCA","COSTA","COSTO","COZZO","CRASI",
  "CRUDO","CUNEO","CURDO","COLTO","CACCA","CACTO","CAMPO","CAPOC","CARBO","CARPE",
  "CAUSA","CEFFO","CENERE","CEPPO","CERCO","CHELA","CIPRIA","CIRCA","CIVILE","CLAVA",
  // D
  "DANNO","DANZA","DARDO","DENTE","DOSSO","DRAGO","DUOMO","DAINO","DENSO","DISCO",
  "DIODO","DOCCE","DOGMA","DOLCE","DORSO","DROGA","DUOLO","DETTO","DITTA","DOLCO",
  "DONNA","DOPPIO","DOTTO","DRITTO",
  // E
  "EBANO","EDERA","ELMO","ERBA","ESAME","ESITO","ESTRO","ETICA","ETNIA","EBETE",
  "EDEMA","EGIDA","ELICA","EMPIO","EMULO","ENTRO","EPICA","EPOCA","ERNIA","ERODE",
  "EROSO","ESODO","ETERE","ETILE","EVASO","EVOCA",
  // F
  "FANGO","FARRO","FERRO","FESTA","FIATO","FIBRA","FIERO","FIORE","FISSO","FIUME",
  "FOBIA","FOLLA","FOLTO","FONTE","FORZA","FOSSO","FRENO","FUOCO","FURBO","FURIA",
  "FUSTO","FALCO","FALDA","FALLO","FALSA","FARSA","FATTO","FERMA","FERMO","FIABA",
  "FIENO","FILMA","FIOCO","FLEBO","FLORA","FOGNA","FONDO","FORTE","FRANA","FRATE",
  "FRODE","FRIGO","FABIO","FANNO","FARNE","FEBBRE","FETTA","FIGLIO","FIUME","FOGLIO",
  "FORMO","FOSCO","FRUTTO","FUNGO","FUORI",
  // G
  "GAMBA","GARZA","GATTO","GENIO","GESTO","GHIRO","GIOCO","GIOIA","GLOBO","GORGO",
  "GRANO","GRIDO","GUSTO","GABBA","GALIO","GALLA","GALLO","GAMBO","GARBO","GEMMA",
  "GENOA","GERME","GIBBO","GNOMO","GOGNA","GOLFO","GOMMA","GONNA","GONZO","GOZZO",
  "GRECA","GRETO","GRIFO","GRUMO","GUADO","GUAIO","GUANO","GUIDA","GATTO","GENERE",
  "GHISA","GIGLIO","GIORNO","GOBBA","GOLPE","GRANO","GROPPA","GROTTA","GUANCIA",
  // I
  "IDOLO","INDIA","ISOLA","ICONA","IGLOO","IMAGO","INDIO","INNO","INVIO","IRIDE",
  "IROSO","ISTMO","IMENE","IPNOSI",
  // L
  "LACCA","LAMPO","LARDO","LARGO","LATTE","LENZA","LEONE","LEPRE","LIBRO","LIMBO",
  "LINCE","LINFA","LISTA","LITRO","LOTTA","LUCRO","LUOGO","LUSSO","LAIDO","LAMBA",
  "LANCIA","LARGO","LASCA","LAUTO","LAZIO","LECCO","LEGNO","LEMMA","LENTO","LEUCA",
  "LIGIO","LIGNA","LILLA","LIMAO","LINCO","LITIO","LIUTO","LOGIO","LOMBO","LONZA",
  "LOPPA","LORDO","LOSCO","LOTTO","LUCCA","LUNGA","LUNGO","LARDO","LASTRA","LAVORO",
  "LEGGE","LENTO","LIBRO","LIEVE","LINCE","LINGUA","LISTA","LITRO","LOTTA","LUCE",
  // M
  "MAGMA","MALTO","MAPPA","MAZZO","MEZZO","MIELE","MIRTO","MOLLE","MONDO","MONTE",
  "MORSA","MOSSO","MOTTO","MULTA","MAGNA","MAGNO","MALGA","MANCA","MANCO","MANGA",
  "MANIA","MANNA","MANTO","MARCA","MARMO","MARZO","MASSA","MAZZO","MEDIO","MELLA",
  "MELMA","MENTA","MENTO","MERLO","MERSO","MESCO","MOGIO","MOGNO","MOLLA","MOLLO",
  "MONCO","MONGO","MONNA","MONTO","MORBO","MORSO","MORTO","MOSCA","MUCCA","MUNTA",
  "MUSCO","MUSEO","MUSSA","MUSSO","MAMBO","MANIO","MANZO","MARZO","MASCA","MATITA",
  "MEDICO","MESTO","METRO","MEZZO","MIRRA","MISTO","MITRO","MOLTI","MOLTO","MONDO",
  "MONTE","MORSO","MOSSO","MOTTO","MULINO",
  // N
  "NARDO","NETTO","NORMA","NOTTE","NABBA","NANNA","NAPPO","NEGRO","NELLO","NERBO",
  "NERVO","NIMBO","NINFA","NITRO","NOCCA","NUBIA","NUCCA","NULLA","NUORA","NUVOLA",
  "NAZIONE","NEBBIA","NERVO","NETTO","NIPOTE","NOBILE","NOCCA","NONNA","NORMA","NOSCO",
  // O
  "OBLIO","OMBRA","OPERA","ORCO","ORLO","ORZO","OSARE","OSSO","OSTIA","ODEON",
  "ODORE","OLIVO","OMERO","OPACO","OPPIO","ORMAI","OSTEO","OSTRA","OVAIA",
  "OCCHIO","OFFERTA","OGNUNO","OLIVA","ONDE","ONORE","OPERE","ORARIO","ORDINE","ORTICA",
  // P
  "PALLA","PALMO","PANNA","PARCO","PASTO","PAURA","PEGNO","PELLE","PERLA","PESCA",
  "PIANO","PIENO","PIZZA","POLSO","POMPA","PORTA","PORTO","POZZO","PRIMA","PROVA",
  "PUNTO","PACCO","PADRE","PALCO","PALIO","PANNO","PARMA","PARSO","PARTO","PASSO",
  "PASTA","PATIO","PAZZO","PECCA","PECTO","PENTO","PERDO","PERMA","PERNO","PERSO",
  "PERTO","PESO","PETTO","PIAGA","PICCO","PIGNA","PINCO","PINTO","PINZA","PIOTA",
  "PIPPO","PISCA","PISTO","PLANA","PODIO","POLCA","POLIA","POLLO","POLPA","POLSO",
  "POLZA","POPPA","PORCO","PORGA","PORNO","POSSO","POSTO","PREDA","PREMO","PRESA",
  "PRETO","PRIMO","PRIVO","PRODE","PRONA","PRORA","PROSA","PUPPA","PURGA","PUSCA",
  "PAESE","PALCO","PANE","PASSO","PATTO","PAUSA","PAZZO","PECORA","PELO","PENNELLO",
  "PEPE","PESCE","PETTO","PIATTO","PIEDE","PIETRA","PIGRO","PILOTA","PINETA","PIUMA",
  "PIZZO","POLSO","PONTE","POSTO","POTERE","PRANZO","PREGO","PRESTO","PRIMO","PROBO",
  // R
  "RADIO","RAZZA","REGNO","RESTO","RETTA","RICCO","RITMO","ROCCA","ROSSO","ROTTA",
  "RUOLO","RUOTA","RUSSO","RAGNA","RAGNO","RALLO","RAMBA","RAMPA","RANCA","RANGO",
  "RANTO","RAPIO","RAPPA","RASCO","RASIO","RASSO","RASTO","RATTO","RECCO","REGIO",
  "RISCA","RISCO","RISMA","RISSO","RISTO","RIUSA","RIUSO","ROGNA","ROMBA","ROMBO",
  "RONCA","RONCO","RONGA","ROSCO","ROSMA","ROSSA","ROSTO","RULCO","RULLA","RULLO",
  "RUMBA","RUSCA","RUSSA","RUSTO","RAFFO","RASPA","RASPO","RADIA","RADICE","RAGONE",
  "RAMO","RAPIDO","REALE","RETTO","RICCO","RIONE","RISO","RITMO","ROCCIA","RONDINE",
  // S
  "SACRO","SAGRA","SALMO","SALTO","SALVO","SASSO","SCALA","SCENA","SCOPA","SCOPO",
  "SCUDO","SENSO","SERVO","SFERA","SOGNO","SOLCO","SORTE","SOTTO","SPADA","SPIGA",
  "SUOLO","SUONO","SACCA","SACCO","SALIO","SALSA","SAMBA","SANCA","SANGO","SANNA",
  "SANTO","SARCO","SARIO","SARSA","SARTO","SAVIO","SECCO","SEDIA","SEGNO","SELLO",
  "SENNA","SESTO","SFIDA","SFOGO","SIENA","SILVA","SINCO","SIRIO","SISMA","SISTO",
  "SLOGA","SNODA","SODIO","SOLIO","SOLLO","SOLMA","SOMMA","SONNA","SONNO","SOPRA",
  "SORDO","SORGO","SORSA","SORSO","SORTO","STARE","STATO","STELO","STILE","STIMA",
  "STIPA","STIVA","STOLA","STONA","STRIA","STUFA","STUFO","SULLA","SURCO","SVAGO",
  "SVELA","SVEVO","SABBIA","SALIRE","SALUTE","SAPER","SAPERE","SASSO","SCALO","SCEMO",
  "SCENA","SCHEDA","SCOPA","SCORTA","SCUDO","SEDIA","SEGNO","SEMPRE","SENNO","SENSO",
  "SERA","SERVO","SOGLIA","SOLDO","SOLE","SONNO","SOPRA","SORTE","SOTTO","SPADA",
  "SPAGO","SPALLA","SPARO","SPAZIO","SPESA","SPIGA","SPORT","SPUNTO","STAMPO","STANCO",
  "STELLA","STILE","STOMACO","STORIA","STRADA","STRANO","SUONO",
  // T
  "TACCO","TANGO","TANTO","TARDO","TASTO","TEMPO","TENDA","TERRA","TESTA","TIGRE",
  "TINTO","TONDO","TOPPA","TORTA","TRAMA","TRONO","TUTTO","TACCA","TALCO","TALPA",
  "TAMBA","TAMPA","TANCA","TANGO","TANNA","TANZA","TAPPA","TAPPO","TARMA","TARRO",
  "TARSA","TARSO","TASSA","TASTO","TAZZA","TECCO","TEDIO","TELLA","TEMPO","TENCA",
  "TENSO","TENTA","TENTO","TERGO","TERMA","TERMO","TERNA","TERNO","TERSA","TERSO",
  "TERZA","TERZO","TESSA","TESTO","TINCA","TINGO","TINTO","TIRSO","TISCA","TISCO",
  "TOCCA","TOGNA","TOLCO","TOLLA","TOMBA","TONNO","TOPPA","TORBA","TORDO","TORGO",
  "TORIA","TORMA","TORNA","TORNO","TORSA","TORSO","TORTO","TORVO","TOSCA","TOSCO",
  "TOSSA","TOSTO","TRAGA","TRAMO","TRASA","TRAVO","TREMO","TRENO","TRETO","TRINO",
  "TULCO","TULLO","TUMBA","TUMBO","TUNCO","TURBA","TURBO","TURCO","TURNO","TUSCA",
  "TUTTO","TABACCO","TACERE","TAGLIO","TALE","TARDI","TASTO","TAZZE","TEATRO","TEMPO",
  "TENER","TENUE","TERME","TERRA","TESTA","TIGRE","TIMORE","TINTA","TIPO","TITOLO",
  "TOCCO","TOPO","TORO","TORTO","TOSSE","TRAINO","TRATTO","TRAVE","TRENO","TRISTE",
  "TRONCO","TRONO","TROPPO","TROTA","TURNO",
  // U
  "ULTRA","UMANO","UMIDO","UNIRE","UNICO","UNITO","URLO","USATO","USCIO","UTILE",
  "UDIRE","UGUALE","ULIVO","UMILE","UNGHIA","UNICO","UNIRE","UOMO","USURA",
  // V
  "VANGA","VANTO","VASTO","VENTO","VERDE","VERSO","VETRO","VIOLA","VISTA","VOLPE",
  "VOLTA","VACCA","VALLA","VALLO","VALSA","VAMPA","VANCA","VANNA","VARCA","VARCO",
  "VARIA","VARIO","VASCA","VASSA","VENNA","VENTA","VERBA","VERBO","VERDA","VERGA",
  "VERGO","VERMA","VERNA","VERRA","VERSA","VERTO","VESSA","VESTA","VESTO","VICCO",
  "VIGNA","VIGNO","VILLA","VILLO","VIRGA","VIRGO","VIRTU","VISCA","VISCO","VISSO",
  "VOLCA","VOLIO","VOLLA","VOLLO","VOLMA","VOLSA","VOLSO","VOLTO","VORSO","VORTO",
  "VOSSO","VULCO","VULLA","VULLO","VALCO","VALORE","VECCHIO","VELOCE","VENIRE","VENTO",
  "VERBO","VERDE","VERSO","VETRO","VIGORE","VINO","VIRTÙ","VISITA","VITA","VIVERE",
  "VOCE","VOGLIA","VOLARE","VOLERE","VOLPE","VOLTA",
  // Z
  "ZAINO","ZAMPA","ZAPPA","ZEBRA","ZUPPA","ZANNA","ZECCA","ZOLLA","ZUCCA","ZUFFA",
  "ZINCO","ZOLFO","ZOMBI","ZONA","ZOPPO",
];

function normStr(s) {
  return s.toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "");
}
const WORDLE_POOL = [...new Set(DB_RAW.map(normStr).filter(w => w.length === 5))];
const POOL_SIZE = WORDLE_POOL.length;

// ─── SEED ────────────────────────────────────────────────────────────────────
function getWordleWord(seed) {
  let s = (seed + 100001) >>> 0;
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

/* Wrapper principale — si adatta a qualsiasi altezza disponibile */
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
/* Rivelazione cella: scala + fade */
@keyframes revealCell {
  0%   { transform: scale(0.8); opacity: 0; }
  60%  { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-5px); }
  40%,80% { transform: translateX(5px); }
}
@keyframes pop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity:0; transform:translateY(-8px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes slideUp {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ── Header ── */
.header {
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 8px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}
.header-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 3px;
  line-height: 1;
}
.header-date {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.5px;
  text-transform: lowercase;
}
.icon-btn {
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: 18px; padding: 4px;
  transition: color .2s; line-height: 1; min-width: 28px;
  display: flex; align-items: center; justify-content: center;
}
.icon-btn:hover { color: var(--text); }
.header-btns { display: flex; gap: 6px; }

/* ── Toast ── */
.toast-container {
  position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
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

/* ── Game area — tutto centrato ── */
.game-area {
  flex: 1;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
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
  transition: border-color .1s;
}
.cell.filled {
  border-color: #565758;
  animation: pop .1s ease;
}
.cell.revealed {
  border-color: var(--status);
  background: var(--status);
  color: #fff;
  animation: revealCell .25s ease var(--delay) both;
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
  width: 90%; max-width: 360px; padding: 22px 18px;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  animation: slideUp .3s ease;
}
.modal h2 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; }
.modal p  { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.5; }
.modal-word {
  font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3px;
  color: var(--correct);
}
.stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; width: 100%; }
.stat-box   { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-num   { font-family: 'Bebas Neue', sans-serif; font-size: 28px; }
.stat-label { font-size: 10px; color: var(--muted); text-align: center; }
.dist-wrap  { width: 100%; }
.dist-row   { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 3px; }
.dist-num   { width: 12px; text-align: right; color: var(--muted); font-weight: 700; }
.dist-bar   {
  height: 18px; min-width: 18px; background: var(--absent); border-radius: 3px;
  display: flex; align-items: center; justify-content: flex-end; padding-right: 5px;
  font-size: 11px; font-weight: 700; transition: width .5s ease;
}
.dist-bar.current { background: var(--correct); }
.btn {
  padding: 10px 20px; border-radius: 6px; border: none;
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 13px;
  cursor: pointer; transition: opacity .2s, transform .1s;
}
.btn:active { transform: scale(.97); }
.btn-primary   { background: var(--correct); color: #fff; }
.btn-secondary { background: var(--border);  color: var(--text); }
.btn-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; width: 100%; }
.share-box {
  background: var(--bg); border-radius: 8px; padding: 10px 14px;
  font-family: monospace; font-size: 16px; letter-spacing: 2px;
  line-height: 1.4; text-align: center; border: 1px solid var(--border); white-space: pre;
  width: 100%;
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
.chip:hover { background: #5a5a5c; }
.chip.today { background: var(--correct); color: #fff; }

/* ── Responsive ── */
@media (max-width: 380px) {
  .cell { width: 50px; height: 50px; font-size: 24px; }
  .kb-key { min-width: 30px; max-width: 30px; height: 46px; font-size: 10px; }
  .kb-key.wide { min-width: 50px; max-width: 50px; }
  .header-title { font-size: 20px; }
}
`;

// ─── COSTANTI ────────────────────────────────────────────────────────────────
const LS = "wi_", RESET_FLAG = "wi_reset_v1", MAX_GUESSES = 6;
const WIN_MSGS = ["Perfetto! 🎯","Brillante! ✨","Ottimo! 💪","Bravo! 🎉","Ce l'hai fatta!","Salvato in extremis 😅"];
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

// ─── KEYBOARD ────────────────────────────────────────────────────────────────
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
  const [target, setTarget]           = useState("");
  const [dateLabel, setDateLabel]     = useState("");
  const [archiveDate, setArchiveDate] = useState(null); // null = oggi
  const [guesses, setGuesses]         = useState([]);
  const [revealingRow, setRevealingRow] = useState(null); // {word, result} — in rivelazione
  const [revealedCells, setRevealedCells] = useState(0); // quante celle della riga corrente sono già rivelate
  const [current, setCurrent]         = useState("");
  const [gameOver, setGameOver]       = useState(false);
  const [won, setWon]                 = useState(false);
  const [toasts, setToasts]           = useState([]);
  const [shaking, setShaking]         = useState(false);
  const [modal, setModal]             = useState(null);
  const [stats, setStats]             = useState({
    played:0, wins:0, streak:0, maxStreak:0, dist:{1:0,2:0,3:0,4:0,5:0,6:0}
  });
  const [hardMode, setHardMode]       = useState(false);
  const guessesRef = useRef(guesses);
  useEffect(() => { guessesRef.current = guesses; }, [guesses]);

  // ── Init ──
  useEffect(() => {
    if (!localStorage.getItem(RESET_FLAG)) {
      Object.keys(localStorage).filter(k => k.startsWith(LS)).forEach(k => localStorage.removeItem(k));
      localStorage.setItem(RESET_FLAG, "1");
    }
    try { const s = JSON.parse(localStorage.getItem(LS+"stats")||"null"); if(s) setStats(s); } catch {}
    setHardMode(localStorage.getItem(LS+"hard") === "1");
    if (!localStorage.getItem(LS+"seen_tutorial")) {
      setModal("tutorial");
      localStorage.setItem(LS+"seen_tutorial", "1");
    }
  }, []);

  // ── Carica partita per data ──
  const loadGame = useCallback((date) => {
    const seed = seedFromDate(date);
    setTarget(getWordleWord(seed));
    setDateLabel(formatDate(date));
    setRevealingRow(null);
    setRevealedCells(0);
    setCurrent("");
    try {
      const saved = JSON.parse(localStorage.getItem(LS+"game_"+seed)||"null");
      if (saved && Array.isArray(saved.guesses) && saved.guesses.length > 0) {
        setGuesses(saved.guesses); setWon(saved.won||false); setGameOver(saved.gameOver||false);
      } else { setGuesses([]); setWon(false); setGameOver(false); }
    } catch { setGuesses([]); setWon(false); setGameOver(false); }
  }, []);

  useEffect(() => { loadGame(archiveDate || new Date()); }, [archiveDate, loadGame]);

  // ── Salva ──
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

  // ── Lettera stati tastiera ──
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
  // Ogni 250ms una cella in più diventa colorata, fino a 5.
  // Poi la riga viene "fissata" nelle guesses.
  function revealSequentially(newGuess, onDone) {
    setRevealingRow(newGuess);
    setRevealedCells(0);
    let col = 0;
    const interval = setInterval(() => {
      col++;
      setRevealedCells(col);
      if (col >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          setRevealingRow(null);
          setRevealedCells(0);
          onDone();
        }, 100);
      }
    }, 300); // 300ms tra una cella e l'altra
  }

  // ── Submit ──
  const submitGuess = useCallback(() => {
    if (gameOver || revealingRow) return;
    const norm = current.toUpperCase().replace(/[^A-Z]/g, "");
    if (norm.length !== 5) {
      toast("La parola deve avere 5 lettere");
      setShaking(true); setTimeout(() => setShaking(false), 400);
      return;
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
          setTimeout(() => setModal("end"), 2000);
        } else if (isLose) {
          setGameOver(true);
          toast(target, 3500);
          updateStats(false, 0);
          setTimeout(() => setModal("end"), 3000);
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
      const next = { played: prev.played+1, wins: prev.wins+(win?1:0), streak, maxStreak, dist: d };
      localStorage.setItem(LS+"stats", JSON.stringify(next));
      return next;
    });
  }

  // ── Tastiera fisica ──
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

  // ── Share ──
  function buildShare() {
    const h = `🇮🇹 Wordle Italiano — ${dateLabel}\n`;
    const r = guesses.map(g =>
      g.result.map(r => r==="correct"?"🟩":r==="present"?"🟨":"⬛").join("")
    ).join("\n");
    return h + r + (won ? "" : " X") + `/${MAX_GUESSES}`;
  }

  // ── Gioca ancora (random dall'archivio) ──
  function playRandom() {
    const today = new Date();
    // Sceglie un giorno random tra gli ultimi 30 escludendo oggi
    const offset = 1 + Math.floor(Math.random() * 29);
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    setArchiveDate(d);
    setModal(null);
  }

  // ── Render griglia ──
  function renderRows() {
    const rows = [];
    for (let r = 0; r < MAX_GUESSES; r++) {
      if (r < guesses.length) {
        // Riga già completata
        const g = guesses[r];
        rows.push(
          <div className="board-row" key={r}>
            {g.word.split("").map((l, i) => (
              <div key={i} className="cell revealed"
                style={{ "--status": statusColor(g.result[i]), "--delay": "0ms" }}>
                {l}
              </div>
            ))}
          </div>
        );
      } else if (revealingRow && r === guesses.length) {
        // Riga in rivelazione cella per cella
        rows.push(
          <div className="board-row" key={r}>
            {revealingRow.word.split("").map((l, i) => {
              const isRevealed = i < revealedCells;
              return (
                <div key={i}
                  className={`cell${isRevealed ? " revealed" : " filled"}`}
                  style={isRevealed ? {
                    "--status": statusColor(revealingRow.result[i]),
                    "--delay": "0ms"
                  } : {}}>
                  {l}
                </div>
              );
            })}
          </div>
        );
      } else if (!gameOver && !revealingRow && r === guesses.length) {
        // Riga corrente (input utente)
        const letters = current.padEnd(5, " ").split("");
        rows.push(
          <div className="board-row" key={r}>
            {letters.map((l, i) => (
              <div key={i} className={`cell${l !== " " ? " filled" : ""}`}>
                {l === " " ? "" : l}
              </div>
            ))}
          </div>
        );
      } else {
        // Riga vuota
        rows.push(
          <div className="board-row" key={r}>
            {Array(5).fill("").map((_, i) => (
              <div key={i} className="cell"></div>
            ))}
          </div>
        );
      }
    }
    return rows;
  }

  // ── Modali ──
  function ModalStats() {
    const maxBar = Math.max(...Object.values(stats.dist), 1);
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>📊 Statistiche</h2>
          <div className="stats-grid">
            <div className="stat-box"><span className="stat-num">{stats.played}</span><span className="stat-label">Partite</span></div>
            <div className="stat-box"><span className="stat-num">{stats.played?Math.round(stats.wins/stats.played*100):0}%</span><span className="stat-label">Vittorie</span></div>
            <div className="stat-box"><span className="stat-num">{stats.streak}</span><span className="stat-label">Serie</span></div>
            <div className="stat-box"><span className="stat-num">{stats.maxStreak}</span><span className="stat-label">Migliore</span></div>
          </div>
          <div className="dist-wrap">
            {[1,2,3,4,5,6].map(n => (
              <div className="dist-row" key={n}>
                <span className="dist-num">{n}</span>
                <div className={`dist-bar${guesses.length===n&&won?" current":""}`}
                  style={{ width: `${Math.max(18,(stats.dist[n]||0)/maxBar*160)}px` }}>
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
            <p style={{fontSize:"12px",color:"var(--muted)"}}>⬛ Lettera non presente nella parola</p>
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

  function ModalEnd() {
    const [copied, setCopied] = useState(false);
    const text = buildShare();
    function copy() {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      });
    }
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>{won ? "🎉 Hai vinto!" : "😔 Peccato"}</h2>
          {!won && <><p>La parola era:</p><div className="modal-word">{target}</div></>}
          <div className="share-box">{text}</div>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={copy}>
              {copied ? "✓ Copiato!" : "Condividi"}
            </button>
            <button className="btn btn-secondary" onClick={() => setModal("stats")}>
              Statistiche
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
    const chips = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const label = i === 0
        ? "Oggi"
        : d.toLocaleDateString("it-IT", {day:"2-digit", month:"2-digit"});
      chips.push({ d, label, isToday: i === 0 });
    }
    return (
      <div className="overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>📅 Archivio</h2>
          <p>Gioca le sfide degli ultimi 30 giorni</p>
          <div className="archive-wrap">
            {chips.map(({ d, label, isToday }, i) => (
              <button key={i} className={`chip${isToday?" today":""}`}
                onClick={() => { setArchiveDate(isToday ? null : d); setModal(null); }}>
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
    localStorage.setItem(LS+"hard", next ? "1" : "0");
    toast(next ? "Modalità difficile attivata 🔥" : "Modalità normale");
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="wordle-root">

        {/* Header */}
        <header className="header">
          <button className="icon-btn" onClick={() => setModal("tutorial")} title="Come si gioca">?</button>
          <div className="header-center">
            <span className="header-title">🇮🇹 WORDLE ITALIANO</span>
            <span className="header-date">{dateLabel}</span>
          </div>
          <div className="header-btns">
            <button className="icon-btn" onClick={toggleHard} title={hardMode?"Difficile ON":"Difficile OFF"}
              style={{ color: hardMode ? "#f5a000" : "var(--muted)" }}>🔥</button>
            <button className="icon-btn" onClick={() => setModal("stats")} title="Statistiche">📊</button>
            <button className="icon-btn" onClick={() => setModal("archive")} title="Archivio">📅</button>
          </div>
        </header>

        {/* Toast */}
        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
        </div>

        {/* Griglia + Tastiera */}
        <div className="game-area">
          <div className={`board${shaking ? " shake" : ""}`}>
            {renderRows()}
          </div>
          <Keyboard onKey={handleKey} letterStates={letterStates} />
        </div>

      </div>

      {modal === "tutorial" && <ModalTutorial />}
      {modal === "stats"    && <ModalStats />}
      {modal === "end"      && <ModalEnd />}
      {modal === "archive"  && <ModalArchive />}
    </>
  );
}

