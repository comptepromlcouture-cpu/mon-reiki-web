const screens = [...document.querySelectorAll('[data-screen]')];
const historyStack = ['home'];
const mainScreens = ['home', 'center', 'discover'];
const noteToast = document.querySelector('.note-toast');
const swipeGuide = document.querySelector('.swipe-guide');
const swipeDots = [...document.querySelectorAll('.swipe-guide i')];
const welcome = document.querySelector('[data-welcome]');
const appShell = document.querySelector('.app-shell');
const rippleLayer = document.querySelector('[data-water-ripples]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let entered = false;
let transitioning = false;
function storageGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); } catch {} }
let completedDays = Math.min(21, Math.max(0, Number(storageGet('mon-reiki.completed-days')) || 0));
function updateJourney() {
  const day = Math.min(21, completedDays + 1);
  document.querySelector('[data-current-day]').textContent = day;
  document.querySelector('[data-journey-caption]').textContent = completedDays >= 21 ? '21 jours de présence. Ce chemin est le tien.' : 'Un jour après l’autre, à ton rythme.';
  const svg = document.querySelector('.journey-trail');
  const path = svg.querySelector('.trail-line');
  const stones = svg.querySelector('[data-trail-stones]');
  const length = path.getTotalLength();
  stones.replaceChildren();
  for (let i = 0; i < 21; i++) {
    const point = path.getPointAtLength(length * i / 20);
    const stone = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    stone.setAttribute('cx', point.x); stone.setAttribute('cy', point.y);
    stone.setAttribute('r', i === day - 1 ? 9 : i === 20 ? 7 : 5);
    stone.setAttribute('class', 'trail-stone' + (i < completedDays ? ' is-done' : i === day - 1 ? ' is-next' : i === 20 ? ' trail-destination' : ''));
    if (i < completedDays) stone.style.fill = i === 20 ? '#cba45d' : ['#b65a72','#c18b68','#c3ac6c','#86a188','#7b9dae','#8d82ab','#ad83a3'][Math.min(6,Math.floor(i/3))];
    stones.append(stone);
  }
}
function finishEntry() {
  if (entered) return;
  entered = true; transitioning = false;
  welcome.remove();
  document.body.classList.remove('is-starting', 'is-entering-app');
  document.body.classList.add('has-entered');
  appShell.inert = false;
  document.querySelector('#home-title').focus({preventScroll:true});
}
function enterApp(event) {
  if (entered || transitioning) return;
  transitioning = true;
  const ripple = document.createElement('span');
  ripple.style.left = `${event.clientX || innerWidth / 2}px`;
  ripple.style.top = `${event.clientY || innerHeight * .51}px`;
  rippleLayer.append(ripple);
  navigator.vibrate?.(18);
  welcome.classList.add('is-entering');
  document.body.classList.add('is-entering-app');
  window.setTimeout(finishEntry, reducedMotion.matches ? 0 : 1300);
}
document.querySelector('[data-enter-app]').addEventListener('click', enterApp);
document.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || reducedMotion.matches || entered) return;
  document.documentElement.style.setProperty('--depth-x', `${(event.clientX / innerWidth - .5) * 14}px`);
  document.documentElement.style.setProperty('--depth-y', `${(event.clientY / innerHeight - .5) * 12}px`);
}, {passive:true});
function updateSwipeGuide(name) {
  const index = mainScreens.indexOf(name);
  swipeGuide.hidden = index < 0;
  document.querySelector('.settings-entry').hidden = index < 0;
  swipeDots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
}
function showScreen(name, push = true) {
  const target = document.querySelector(`[data-screen="${name}"]`);
  if (!target) return;
  const current = document.querySelector('[data-screen].is-active');
  if (current === target) return;
  if (current?.dataset.screen === 'settings') stopPreview();
  const from = mainScreens.indexOf(current?.dataset.screen);
  const to = mainScreens.indexOf(name);
  screens.forEach(screen => screen.classList.toggle('is-active', screen === target));
  if (push && historyStack.at(-1) !== name) historyStack.push(name);
  updateSwipeGuide(name);
  target.scrollTop = 0;
  if (!reducedMotion.matches) target.animate([
    {opacity:0,transform:`translateX(${from >= 0 && to >= 0 && to < from ? '-5%' : '5%'})`},
    {opacity:1,transform:'translateX(0)'}
  ],{duration:550,easing:'cubic-bezier(.22,.61,.36,1)'});
  target.querySelector('h1')?.setAttribute('tabindex','-1');
  target.querySelector('h1')?.focus({preventScroll:true});
}
document.addEventListener('click', (event) => {
  const go = event.target.closest('[data-go]');
  if (go) showScreen(go.dataset.go);
  if (event.target.closest('[data-back]')) { historyStack.pop(); showScreen(historyStack.at(-1) || 'home', false); }
});
function navigatePortal(direction) {
  if (!entered || transitioning || !centeringMode.hidden || !treatmentSession.hidden) return;
  const current = mainScreens.indexOf(document.querySelector('[data-screen].is-active')?.dataset.screen);
  if (current < 0) return;
  showScreen(mainScreens[(current + direction + mainScreens.length) % mainScreens.length]);
}
document.querySelector('[data-page-prev]').addEventListener('click', () => navigatePortal(-1));
document.querySelector('[data-page-next]').addEventListener('click', () => navigatePortal(1));
let swipeStart = null;
appShell.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button,a,input,select')) return;
  swipeStart = {x:event.clientX,y:event.clientY};
});
appShell.addEventListener('pointerup', (event) => {
  if (!swipeStart) return;
  const dx=event.clientX-swipeStart.x, dy=event.clientY-swipeStart.y;
  swipeStart=null;
  if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.4) navigatePortal(dx<0?1:-1);
});
appShell.addEventListener('pointercancel', () => {swipeStart=null;});
let wheelLock = 0;
appShell.addEventListener('wheel',(event)=>{
  if (Math.abs(event.deltaX)<18 || Math.abs(event.deltaX)<=Math.abs(event.deltaY)*1.3) return;
  event.preventDefault();
  if(Date.now()-wheelLock<750) return;
  wheelLock=Date.now(); navigatePortal(event.deltaX>0?1:-1);
},{passive:false});
document.addEventListener('keydown',event=>{
  if (event.key==='ArrowRight' || event.key==='ArrowLeft') {
    if(event.target.closest('input,select,textarea')) return;
    navigatePortal(event.key==='ArrowRight'?1:-1);
  }
});
updateJourney();

function showNote(message) {
  noteToast.textContent = message;
  noteToast.classList.add('is-visible');
  window.clearTimeout(showNote.timer);
  showNote.timer = window.setTimeout(() => noteToast.classList.remove('is-visible'), 3200);
}
document.querySelectorAll('[data-show-note]').forEach((button) => button.addEventListener('click', () => showNote(button.dataset.showNote)));

document.querySelectorAll('[data-chakra]').forEach((button) => button.addEventListener('click', () => {
  const chakra = chakras[Number(button.dataset.chakra)];
  document.querySelector('[data-learning-chakra]').innerHTML = treatmentVisualMarkup({type:'chakra',chakra}) + `<figcaption>${chakra.name} · ${chakra.phrase}</figcaption>`;
  document.querySelectorAll('[data-chakra]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  document.querySelector('[data-screen="chakras"]').scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});
}));

let audioMuted = false;
const musicTracks = [
  {id:'piano',name:'Piano zen',mood:'Des notes légères',file:'marlowemusic-zen-piano-585966.mp3',duration:'3:28',art:'rose'},
  {id:'zen',name:'Douceur',mood:'Un espace tranquille',file:'atlasaudio-zen-594877.mp3',duration:'5:06',art:'lilac'},
  {id:'nature',name:'Nature',mood:'Une pause au vert',file:'chribonn-nature-216798.mp3',duration:'7:09',art:'sage'},
  {id:'boat',name:'Voyage lent',mood:'Au fil de la séance',file:'natureseye-slow-boat-meditation-7744.mp3',duration:'16:23',art:'blue'},
  {id:'calm',name:'Calme intérieur',mood:'Prendre son temps',file:'prettyjohn1-calming-zen-537655.mp3',duration:'4:48',art:'gold'}
];
const ambientAudio = document.querySelector('#ambient-audio');
const bowlAudio = document.querySelector('#bowl-audio');
const previewAudio = document.querySelector('#preview-audio');
let selectedMusic = storageGet('mon-reiki.music') || 'piano';
if (!musicTracks.some(track=>track.id===selectedMusic) && selectedMusic!=='silence') selectedMusic='piano';
function storedVolume(key, fallback) {
  const raw=storageGet(key); const value=raw===null?fallback:Number(raw);
  return Number.isFinite(value)?Math.min(1,Math.max(0,value)):fallback;
}
let musicVolume=storedVolume('mon-reiki.music-volume',.35);
let bowlVolume=storedVolume('mon-reiki.bowl-volume',.6);
let previewId=null;
function audioError() { showNote('Le son n’a pas pu démarrer. Vérifie le volume puis réessaie.'); }
function safePlay(element) { element.play().catch(error=>{if(error.name!=='AbortError') audioError();}); }
function startAmbient(reset=false) {
  if (audioMuted || selectedMusic==='silence') return;
  const track=musicTracks.find(item=>item.id===selectedMusic);
  const source=`assets/audio/${track.file}`;
  if (ambientAudio.getAttribute('src')!==source) ambientAudio.src=source;
  if(reset) ambientAudio.currentTime=0;
  ambientAudio.volume=musicVolume; ambientAudio.loop=true; safePlay(ambientAudio);
}
function stopAmbient(reset=false) { ambientAudio.pause(); if(reset) ambientAudio.currentTime=0; }
function stopBowl() { bowlAudio.pause(); bowlAudio.currentTime=0; }
function playBowl() {
  if(audioMuted || bowlVolume===0) return;
  bowlAudio.pause(); bowlAudio.currentTime=0; bowlAudio.volume=bowlVolume; safePlay(bowlAudio);
}
function stopPreview() {
  previewAudio.pause(); previewAudio.currentTime=0; previewId=null; renderPreviewState();
}
function renderPreviewState() {
  document.querySelectorAll('[data-preview-music],[data-preview-bowl]').forEach(button=>{
    const id=button.dataset.previewMusic || 'bowl';
    const playing=id===previewId && !previewAudio.paused;
    button.textContent=playing?'Ⅱ':'▷'; button.setAttribute('aria-pressed',String(playing));
    const name=id==='bowl'?'le bol tibétain':musicTracks.find(track=>track.id===id).name;
    button.setAttribute('aria-label',`${playing?'Arrêter':'Écouter'} ${name}`);
  });
}
function previewSound(id) {
  if(previewId===id && !previewAudio.paused) {stopPreview();return;}
  stopPreview(); previewId=id;
  previewAudio.src=id==='bowl'?'assets/audio/bol-tibetain-2553.wav':`assets/audio/${musicTracks.find(track=>track.id===id).file}`;
  previewAudio.volume=id==='bowl'?bowlVolume:musicVolume;
  previewAudio.loop=false; safePlay(previewAudio);
}
previewAudio.addEventListener('play',renderPreviewState);
previewAudio.addEventListener('ended',stopPreview);
previewAudio.addEventListener('error',()=>{stopPreview();audioError();});
document.querySelector('[data-music-grid]').innerHTML=musicTracks.map(track=>`<article class="music-card"><button class="music-choice" type="button" data-music-select="${track.id}" aria-pressed="false" aria-label="Choisir ${track.name}"><span class="sound-landscape ${track.art}" aria-hidden="true"><i class="landscape-moon"></i><i class="landscape-hill far"></i><i class="landscape-hill near"></i><i class="landscape-water"></i><b class="track-check">✓</b></span><strong>${track.name}</strong><small>${track.mood}</small></button><div class="track-foot"><span>${track.duration}</span><button class="sound-preview" type="button" data-preview-music="${track.id}" aria-label="Écouter ${track.name}" aria-pressed="false">▷</button></div></article>`).join('');
function renderMusicSelection() {
  document.querySelectorAll('[data-music-select]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.musicSelect===selectedMusic)));
}
document.querySelectorAll('[data-music-select]').forEach(button=>button.addEventListener('click',()=>{
  selectedMusic=button.dataset.musicSelect; storageSet('mon-reiki.music',selectedMusic); stopPreview(); renderMusicSelection();
  document.querySelector('[data-audio-status]').textContent=selectedMusic==='silence'?'Séance sans musique. Le bol reste disponible.':`${musicTracks.find(track=>track.id===selectedMusic).name} accompagnera ta prochaine séance.`;
}));
document.querySelectorAll('[data-preview-music]').forEach(button=>button.addEventListener('click',()=>previewSound(button.dataset.previewMusic)));
document.querySelector('[data-preview-bowl]').addEventListener('click',()=>previewSound('bowl'));
const musicVolumeInput=document.querySelector('#music-volume');
const bowlVolumeInput=document.querySelector('#bowl-volume');
function updateVolumes() {
  musicVolume=Number(musicVolumeInput.value)/100; bowlVolume=Number(bowlVolumeInput.value)/100;
  ambientAudio.volume=musicVolume; bowlAudio.volume=bowlVolume;
  previewAudio.volume=previewId==='bowl'?bowlVolume:musicVolume;
  document.querySelector('[data-music-volume]').textContent=`${Math.round(musicVolume*100)} %`;
  document.querySelector('[data-bowl-volume]').textContent=`${Math.round(bowlVolume*100)} %`;
  storageSet('mon-reiki.music-volume',String(musicVolume)); storageSet('mon-reiki.bowl-volume',String(bowlVolume));
}
musicVolumeInput.value=musicVolume*100; bowlVolumeInput.value=bowlVolume*100;
musicVolumeInput.addEventListener('input',updateVolumes); bowlVolumeInput.addEventListener('input',updateVolumes);
updateVolumes(); renderMusicSelection();

const centeringMode = document.querySelector('.centering-mode');
const centerTimer = document.querySelector('[data-center-timer]');
const breathLabel = document.querySelector('[data-breath-label]');
const breathCount = document.querySelector('[data-breath-count]');
const pauseCenterButton = document.querySelector('[data-pause-centering]');
const muteCenterButton = document.querySelector('[data-mute-centering]');
let centerInterval, centerRemaining = 180, centerPaused = false, breathRemaining = 5, inhaling = true;
function updateCenterDisplay() {
  centerTimer.textContent = `${String(Math.floor(centerRemaining / 60)).padStart(2, '0')}:${String(centerRemaining % 60).padStart(2, '0')}`;
  breathLabel.textContent = inhaling ? 'Inspire doucement' : 'Expire doucement'; breathCount.textContent = breathRemaining;
}
function closeCentering() { appShell.inert = false; centeringMode.hidden = true; document.body.style.overflow = ''; window.clearInterval(centerInterval); stopAmbient(true); stopBowl(); }
function tickCentering() {
  if (centerPaused) return;
  centerRemaining -= 1; breathRemaining -= 1;
  if (breathRemaining <= 0) { inhaling = !inhaling; breathRemaining = 5; }
  if (centerRemaining <= 0) { closeCentering(); playBowl(); showNote('Centrage terminé. Prends un instant avant de reprendre.'); return; }
  updateCenterDisplay();
}
function openCentering() {
  appShell.inert = true; audioMuted = false;
  centerRemaining = 180; centerPaused = false; breathRemaining = 5; inhaling = true;
  pauseCenterButton.textContent = 'Pause'; centeringMode.classList.remove('is-paused'); centeringMode.hidden = false;
  muteCenterButton.textContent = '♪'; muteCenterButton.setAttribute('aria-label','Couper le son'); document.body.style.overflow = 'hidden'; stopPreview(); startAmbient(true); updateCenterDisplay();
  window.clearInterval(centerInterval); centerInterval = window.setInterval(tickCentering, 1000);
}
document.querySelector('[data-start-centering]')?.addEventListener('click', openCentering);
document.querySelector('[data-close-centering]')?.addEventListener('click', closeCentering);
pauseCenterButton?.addEventListener('click', () => { centerPaused = !centerPaused; centeringMode.classList.toggle('is-paused', centerPaused); pauseCenterButton.textContent = centerPaused ? 'Reprendre' : 'Pause'; if(centerPaused){stopAmbient();stopBowl();}else startAmbient(); });
muteCenterButton?.addEventListener('click', () => { audioMuted = !audioMuted; if (audioMuted) {stopAmbient();stopBowl();} else if(!centerPaused) startAmbient(); muteCenterButton.textContent = audioMuted ? '♩' : '♪'; muteCenterButton.setAttribute('aria-label',audioMuted?'Activer le son':'Couper le son'); });

const durationButtons = [...document.querySelectorAll('[data-treatment-duration]')];
const totalLabel = document.querySelector('[data-treatment-total]');
let treatmentDuration = 60;
function updateTreatmentTotal() { totalLabel.textContent = `${1 + 21 * treatmentDuration / 60} min 42 s`; }
durationButtons.forEach((button) => button.addEventListener('click', () => {
  treatmentDuration = Number(button.dataset.treatmentDuration);
  durationButtons.forEach((item) => item.classList.toggle('is-active', item === button)); updateTreatmentTotal();
}));
updateTreatmentTotal();

const chakras = [
  { key: 'root', name: 'Chakra racine', phrase: 'Je suis', asset: '01-racine.webp', color: '#d85757' },
  { key: 'sacral', name: 'Chakra sacré', phrase: 'Je ressens', asset: '02-sacre.webp', color: '#dd9658' },
  { key: 'solar', name: 'Plexus solaire', phrase: 'Je rayonne', asset: '03-plexus.webp', color: '#d8c746' },
  { key: 'heart', name: 'Chakra du cœur', phrase: 'J’aime', asset: '04-coeur.webp', color: '#61b97e' },
  { key: 'throat', name: 'Chakra de la gorge', phrase: 'J’exprime', asset: '05-gorge.webp', color: '#62a3ce' },
  { key: 'eye', name: 'Troisième œil', phrase: 'Je vois', asset: '06-troisieme-oeil.webp', color: '#7770ba' },
  { key: 'crown', name: 'Chakra coronal', phrase: 'Je sais', asset: '07-coronal.webp', color: '#a977b8' }
];
const poses = [
  ['Yeux', 'Paumes posées sur les yeux'], ['Oreilles', 'Paumes posées sur les oreilles'], ['Sommet du crâne', 'Doigts au sommet de la tête'],
  ['Arrière de la tête', 'Paumes derrière la tête'], ['Gorge et cœur', 'Une main sur la gorge, une sur le cœur'], ['Épaules', 'Paumes près du cou'],
  ['Haut de la poitrine', 'Paumes au-dessus de la poitrine'], ['Côtes basses', 'Paumes sur les côtes'], ['Milieu de l’abdomen', 'Paumes au centre du ventre'],
  ['Bas-ventre', 'Mains en diagonale sur le bassin'], ['Milieu du dos', 'Paumes sur les côtes et les reins'], ['Bas du dos', 'Doigts dirigés vers le coccyx'],
  ['Genoux', 'Paumes posées sur les genoux'], ['Pieds', 'Chaque pied placé entre les paumes']
];
const closingSteps = [
  ['8 ou « cacahuète » Reiki', 'Réalise le geste trois fois.', 10, '3×'], ['Remonter les énergies', 'Remonte deux fois, puis termine par le nœud.', 8, '2×'],
  ['Lissage de l’aura', 'Lisse l’aura trois fois avec un geste continu.', 8, '3×'], ['Kenyoku', '« Ce qui est à toi est à toi ; ce qui est à moi reste à moi. »', 8, '乾'],
  ['Lavage', 'Lave les mains et les avant-bras pour terminer.', 8, '✓']
];
// Preserve the supplied artwork: viewport crops, never regenerated hand positions.
const poseCrops = [
  [8,119,245,264],[267,119,244,264],[521,119,252,264],[779,119,244,264],
  [8,440,245,293],[267,440,244,293],[521,440,252,293],[779,440,244,293],
  [8,804,245,292],[267,804,244,292],[521,804,252,292],[779,804,244,292],
  [8,1167,311,280],[336,1167,339,280],[690,1167,331,280]
];
let poseRenderId = 0;
function poseMarkup(position) {
  const [x,y,w,h] = poseCrops[position-1];
  const id = `pose-crop-${++poseRenderId}`;
  const label = position === 15 ? 'Gasshō, paumes jointes devant le cœur' : poses[position-1][1];
  return `<svg class="pose-art" viewBox="${x} ${y} ${w} ${h}" role="img" aria-label="${label}"><defs><filter id="${id}-paper" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 -1 0 1"/></filter><mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white"/><rect x="${x}" y="${y}" width="66" height="61" fill="black"/></mask></defs><image href="assets/practice/positions-watercolor.png" width="1024" height="1536" filter="url(#${id}-paper)" mask="url(#${id})"/></svg>`;
}
document.querySelectorAll('[data-pose-art]').forEach(node => { node.innerHTML = poseMarkup(Number(node.dataset.poseArt)); });
let previewPosition = 1;
function renderPositionPreview() {
  document.querySelector('[data-position-preview]').innerHTML = poseMarkup(previewPosition);
  document.querySelector('[data-position-count]').textContent = `${previewPosition} / 14`;
  document.querySelector('[data-position-name]').textContent = poses[previewPosition-1][0];
  document.querySelector('[data-position-description]').textContent = poses[previewPosition-1][1];
  document.querySelector('[data-position-prev]').disabled = previewPosition === 1;
  document.querySelector('[data-position-next]').disabled = previewPosition === 14;
}
document.querySelector('[data-position-prev]').addEventListener('click',()=>{previewPosition=Math.max(1,previewPosition-1);renderPositionPreview();});
document.querySelector('[data-position-next]').addEventListener('click',()=>{previewPosition=Math.min(14,previewPosition+1);renderPositionPreview();});
renderPositionPreview();
function buildTreatmentSteps() {
  const opening = [{ phase: 'OUVERTURE', title: 'Gasshō et préceptes', duration: 60, type: 'gassho', copy: 'Juste pour aujourd’hui : 1. pas de colère · 2. pas de souci · 3. gratitude · 4. travail honnête · 5. bienveillance. « Je demande à la force du Reiki de bien vouloir apporter la guérison à mon corps, mon âme et mon esprit, pour mon plus grand bien. J’en accorde toute ma reconnaissance. »' }];
  const chakraSteps = chakras.map((chakra) => ({ phase: '7 CHAKRAS', title: chakra.name, duration: treatmentDuration, type: 'chakra', chakra, copy: `Une main reste sur le foie. L’autre se place ici. ${chakra.phrase}.` }));
  const poseSteps = poses.map(([title, copy], index) => ({ phase: 'AUTO-TRAITEMENT', title, copy, duration: treatmentDuration, type: 'pose', pose: index + 1 }));
  const closing = closingSteps.map(([title, copy, duration, mark]) => ({ phase: 'REFERMER LE SOIN', title, copy, duration, type: 'closing', mark }));
  return [...opening, ...chakraSteps, ...poseSteps, ...closing];
}

const treatmentSession = document.querySelector('.treatment-session');
const treatmentPhase = document.querySelector('[data-treatment-phase]');
const treatmentProgress = document.querySelector('[data-treatment-progress]');
const treatmentStep = document.querySelector('[data-treatment-step]');
const treatmentVisual = document.querySelector('[data-treatment-visual]');
const treatmentTitle = document.querySelector('[data-treatment-title]');
const treatmentCopy = document.querySelector('[data-treatment-copy]');
const treatmentTimer = document.querySelector('[data-treatment-timer]');
const treatmentTimerBox = document.querySelector('.treatment-timer');
const treatmentPause = document.querySelector('[data-treatment-pause]');
const treatmentNext = document.querySelector('[data-treatment-next]');
const treatmentMute = document.querySelector('[data-mute-treatment]');
let treatmentSteps = [], treatmentIndex = 0, treatmentRemaining = 0, treatmentInterval, treatmentPaused = false, treatmentComplete = false;
function treatmentVisualMarkup(step) {
  if (step.type === 'gassho') return poseMarkup(15);
  if (step.type === 'pose') return poseMarkup(step.pose);
  if (step.type === 'chakra') return `<div class="treatment-body-map"><img src="assets/visuals/chakra-body-v4.png" alt="Figure lumineuse en méditation"><span class="active-chakra ${step.chakra.key}" style="--active-chakra:${step.chakra.color}"><img src="assets/chakras/${step.chakra.asset}" alt="${step.chakra.name}"></span></div>`;
  return `<span class="closing-mark">${step.mark}</span>`;
}
function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
function renderTreatment() {
  const step = treatmentSteps[treatmentIndex];
  treatmentSession.classList.remove('is-complete'); treatmentPhase.textContent = step.phase;
  treatmentStep.textContent = `ÉTAPE ${treatmentIndex + 1} SUR ${treatmentSteps.length}`;
  treatmentProgress.style.width = `${((treatmentIndex + 1) / treatmentSteps.length) * 100}%`;
  // Keep the body node and its frame stable; only replace the active symbol.
  const existingMap=step.type==='chakra' && treatmentVisual.querySelector('.treatment-body-map');
  treatmentVisual.className = `treatment-visual ${step.type}`;
  if(existingMap) {
    const marker=existingMap.querySelector('.active-chakra');
    marker.className=`active-chakra ${step.chakra.key}`;
    marker.style.setProperty('--active-chakra',step.chakra.color);
    marker.querySelector('img').src=`assets/chakras/${step.chakra.asset}`;
    marker.querySelector('img').alt=step.chakra.name;
  } else treatmentVisual.innerHTML = treatmentVisualMarkup(step);
  treatmentTitle.textContent = step.title; treatmentCopy.textContent = step.copy; treatmentRemaining = step.duration;
  treatmentSession.classList.toggle('is-opening',step.type==='gassho');
  treatmentSession.classList.toggle('is-chakra',step.type==='chakra');
  treatmentSession.style.setProperty('--session-color',step.chakra?.color || '#d99caa');
  if(step.type==='gassho') treatmentCopy.innerHTML='<span class="opening-precepts"><strong>Juste pour aujourd’hui</strong><span>1. Je laisse la colère s’apaiser.</span><span>2. Je laisse les soucis s’apaiser.</span><span>3. Je cultive la gratitude.</span><span>4. J’accomplis mon travail honnêtement.</span><span>5. Je suis bienveillant envers les êtres vivants.</span></span><span class="opening-invocation">« Je demande à la force du Reiki de bien vouloir apporter la guérison à mon corps, mon âme et mon esprit, pour mon plus grand bien. J’en accorde toute ma reconnaissance. »</span>';
  treatmentTimer.textContent = formatTime(treatmentRemaining); treatmentTimerBox.style.setProperty('--timer-progress', '100%');
  treatmentTimerBox.hidden = false; treatmentPause.hidden = false; treatmentNext.innerHTML = 'Étape suivante <span>→</span>';
}
function renderTreatmentComplete() {
  stopAmbient(true);
  treatmentSession.classList.remove('is-chakra');
  treatmentComplete = true; window.clearInterval(treatmentInterval); treatmentSession.classList.add('is-complete');
  treatmentPhase.textContent = 'SOIN TERMINÉ'; treatmentStep.textContent = 'PRENDS UN INSTANT'; treatmentProgress.style.width = '100%';
  const today = new Date().toLocaleDateString('sv-SE');
  if (storageGet('mon-reiki.last-day') !== today && completedDays < 21) {
    completedDays += 1; storageSet('mon-reiki.completed-days', String(completedDays)); storageSet('mon-reiki.last-day', today);
  }
  updateJourney();
  treatmentVisual.className = 'treatment-visual complete'; treatmentVisual.innerHTML = `<span class="completion-ring"><strong>${completedDays}</strong><small>/21</small></span>`;
  treatmentTitle.textContent = completedDays >= 21 ? 'Félicitations' : 'Merci pour ce soin'; treatmentCopy.textContent = completedDays >= 21 ? 'Tes 21 jours sont accomplis. Prends un instant pour apprécier ce chemin.' : 'Ce jour est posé. Tu reprends ton chemin à ton rythme.';
  treatmentTimerBox.hidden = true; treatmentPause.hidden = true; treatmentNext.innerHTML = 'Terminer <span>✓</span>'; playBowl();
}
function nextTreatmentStep() {
  if (treatmentComplete) { closeTreatment(); return; }
  if (treatmentIndex >= treatmentSteps.length - 1) { renderTreatmentComplete(); return; }
  treatmentIndex += 1; playBowl(); renderTreatment();
}
function tickTreatment() {
  if (treatmentPaused || treatmentComplete) return;
  treatmentRemaining -= 1;
  if (treatmentRemaining <= 0) { nextTreatmentStep(); return; }
  const duration = treatmentSteps[treatmentIndex].duration;
  treatmentTimer.textContent = formatTime(treatmentRemaining);
  treatmentTimerBox.style.setProperty('--timer-progress', `${(treatmentRemaining / duration) * 100}%`);
}
function openTreatment() {
  appShell.inert = true; audioMuted = false; treatmentMute.textContent = '♪'; treatmentMute.setAttribute('aria-label','Couper le son'); treatmentSession.classList.remove('is-paused'); stopPreview();
  treatmentSteps = buildTreatmentSteps(); treatmentIndex = 0; treatmentPaused = false; treatmentComplete = false;
  treatmentPause.textContent = 'Pause'; treatmentSession.hidden = false; document.body.style.overflow = 'hidden'; renderTreatment(); startAmbient(true);
  window.clearInterval(treatmentInterval); treatmentInterval = window.setInterval(tickTreatment, 1000);
}
function closeTreatment() { appShell.inert = false; treatmentSession.hidden = true; document.body.style.overflow = ''; window.clearInterval(treatmentInterval); stopAmbient(true); stopBowl(); }
document.querySelector('[data-start-treatment]')?.addEventListener('click', openTreatment);
document.querySelector('[data-close-treatment]')?.addEventListener('click', closeTreatment);
treatmentNext?.addEventListener('click', nextTreatmentStep);
treatmentPause?.addEventListener('click', () => { treatmentPaused = !treatmentPaused; treatmentPause.textContent = treatmentPaused ? 'Reprendre' : 'Pause'; treatmentSession.classList.toggle('is-paused', treatmentPaused); if(treatmentPaused){stopAmbient();stopBowl();}else startAmbient(); });
treatmentMute?.addEventListener('click', () => { audioMuted = !audioMuted; if (audioMuted) {stopAmbient();stopBowl();} else if(!treatmentPaused && !treatmentComplete) startAmbient(); treatmentMute.textContent = audioMuted ? '♩' : '♪'; treatmentMute.setAttribute('aria-label',audioMuted?'Activer le son':'Couper le son'); });

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!centeringMode.hidden) closeCentering();
  if (!treatmentSession.hidden) closeTreatment();
});
updateSwipeGuide('home');

// Installable app: Android/desktop prompt when available, clear iPhone guidance otherwise.
let installPrompt = null;
const installButton = document.querySelector('[data-install-app]');
const installHelp = document.querySelector('[data-install-help]');
const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
function updateInstallUI() {
  if (standalone) {
    installButton.hidden = true;
    installHelp.textContent = 'Mon Reiki est installé sur cet appareil.';
  } else if (installPrompt) {
    installButton.hidden = false;
    installHelp.textContent = 'Installe l’application pour l’ouvrir en plein écran.';
  } else {
    installButton.hidden = true;
    installHelp.textContent = isiOS ? 'Dans Safari : Partager, puis « Sur l’écran d’accueil ».' : 'Dans le menu du navigateur, choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».';
  }
}
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event; updateInstallUI();
});
window.addEventListener('appinstalled', () => { installPrompt = null; installHelp.textContent = 'Mon Reiki est installé sur cet appareil.'; installButton.hidden = true; });
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; updateInstallUI();
});
updateInstallUI();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js?v=10').then(registration => registration.update()).catch(() => showNote('Le mode hors ligne sera disponible après la prochaine ouverture.')));

document.querySelector('[data-learning-chakra]').innerHTML = treatmentVisualMarkup({type:'chakra',chakra:chakras[0]}) + '<figcaption>Chakra racine · Je suis</figcaption>';
document.querySelectorAll('[data-chakra]').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.chakra==='0')));
