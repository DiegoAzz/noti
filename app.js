/**
 * PROFE PIZARRA IA - Motor de Animación Educativa
 * Pizarra con mano hiperrealista, sonido de marcador acrílico, Profesor animado y Voz Neural
 */

// Motor de audio para sonido auténtico de marcador de pizarra
class WhiteboardSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.destStreamNode = null;
    this.audioBuffer = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.isWriting = false;
    this.volume = 0.35;
    this.isLoaded = false;
  }

  async init(sharedCtx, destStreamNode = null) {
    if (this.ctx) return;
    this.ctx = sharedCtx || new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    this.masterGain.connect(this.ctx.destination);
    if (destStreamNode) {
      this.masterGain.connect(destStreamNode);
      this.destStreamNode = destStreamNode;
    }

    // Ganancia controladora de fade in / fade out de la escritura
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.connect(this.masterGain);

    // Cargar el archivo de sonido real subido por el usuario (marker_sound.mp3)
    try {
      const res = await fetch("/marker_sound.mp3");
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        this.audioBuffer = await this.ctx.decodeAudioData(arrayBuf);
        this.isLoaded = true;
        this.startLoop();
      }
    } catch (err) {
      console.warn("Cargando sonido de marcador:", err);
    }
  }

  startLoop() {
    if (!this.audioBuffer || !this.ctx) return;
    try {
      if (this.sourceNode) {
        try { this.sourceNode.stop(); } catch(e) {}
      }
      this.sourceNode = this.ctx.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.loop = true;
      this.sourceNode.connect(this.gainNode);
      this.sourceNode.start(0);
    } catch (e) {
      console.error("Error al iniciar bucle de audio de pizarra:", e);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.04);
    }
  }

  updateWriting(isWritingNow, time = 0) {
    if (!this.ctx || !this.gainNode) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;

    if (isWritingNow && this.volume > 0.01) {
      if (!this.isWriting) {
        this.isWriting = true;
        // Si no está corriendo el source, reiniciarlo
        if (!this.sourceNode) {
          this.startLoop();
        }
        // Subida suave (fade in) de 35ms
        this.gainNode.gain.cancelScheduledValues(t);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, t);
        this.gainNode.gain.linearRampToValueAtTime(1.0, t + 0.035);
      }
    } else {
      if (this.isWriting) {
        this.isWriting = false;
        // Bajada suave (fade out) de 50ms
        this.gainNode.gain.cancelScheduledValues(t);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, t);
        this.gainNode.gain.linearRampToValueAtTime(0, t + 0.05);
      }
    }
  }
}

const soundEngine = new WhiteboardSoundEngine();

// Estado global de la aplicación
const state = {
  voice: "es-CO-SalomeNeural",
  avatar: "bellum",
  outfit: "red",
  theme: "classroom",
  cameraMode: "director",
  format: "9:16",
  soundVolume: 0.35,
  musicTrack: "suave",
  musicVolume: 0.12,
  voiceVolume: 0.90,
  bgMusicAudio: null,
  bgMusicSourceNode: null,
  bgMusicGainNode: null,
  voiceGainNode: null,
  steps: [],
  isPlaying: false,
  isRecording: false,
  currentTime: 0,
  duration: 0,
  audioElement: null,
  audioContext: null,
  destAudioStreamNode: null,
  wordsTimeline: [],
  mediaRecorder: null,
  recordedChunks: [],
  lastHandX: null,
  lastHandY: null,
  isWritingNow: false,
  titleFontSize: 66,
  boardTitleFontSize: 66,
  bannerTitleFontSize: 46,
  isShowingCoverPreview: false,
  isShowingChallengePreview: false,
  audioElementSourceNode: null,
  recordingMimeType: ""
};

// Prompt Maestro Pedagógico para ChatGPT / Claude / Gemini
const MASTER_AI_PROMPT = `Actúa como guionista pedagógico profesional para "La Profe Rochi" (canal educativo oficial de La Profe Rochi, en formato vertical para TikTok, Reels y Shorts con pizarra animada interactiva).

Tu misión es crear una lección en video atractiva, concisa, entretenida y muy fácil de entender sobre el tema que te pida el usuario.

ESTRUCTURA Y REGLAS TÉCNICAS OBLIGATORIAS:
1. El guion debe estar compuesto por pasos usando ÚNICAMENTE estas etiquetas:
TÍTULO: [Título del tema en MAYÚSCULAS, máx 24 caracteres]
HABLA: [Frase dicha por la docente, con entusiasmo, calidez y tono pedagógico, MÁXIMO 130 caracteres por frase]
PIZARRA: [Palabra clave, número, ecuación o ejemplo corto que se escribe en la pizarra, MÁXIMO 20 caracteres]

2. REGLA FUNDAMENTAL DE PIZARRA Y TIEMPOS (SIN DEMORAS):
- En la pizarra la profesora escribe primero la palabra clave de forma ágil y luego se pone a un costado para que el público lea con total claridad mientras ella sigue explicando.
- Por tanto, el texto de PIZARRA debe ser MUY CORTO (ejemplos: "1 2 2 1", "reconocer", "camión", "a² + b² = c²", "Fotosíntesis"). NUNCA pongas oraciones largas en PIZARRA.
- Cada línea de HABLA debe ser breve (máximo 130 caracteres) para que la voz vaya perfectamente sincronizada con la pizarra.

3. SECUENCIA ÓPTIMA DE LA LECCIÓN (6 PASOS):
- Paso 1 (Gancho): TÍTULO y saludo con energía.
- Paso 2 (Concepto): HABLA explicando qué es en una sola frase sencilla.
- Paso 3 (Ejemplo 1): PIZARRA con el primer ejemplo + HABLA explicando por qué cumple la regla.
- Paso 4 (Detalle visual): HABLA destacando el truco o detalle clave del ejemplo.
- Paso 5 (Ejemplo 2): PIZARRA con el segundo ejemplo + HABLA explicándolo.
- Paso 6 (Llamado a la acción): HABLA invitando a comentar (ej: "¿Conoces otro ejemplo? ¡Déjalo aquí en los comentarios!").

4. ETIQUETAS / TAGS OBLIGATORIAS AL FINAL (Separadas por coma para YouTube / TikTok / Reels):
- Al final de todo el guion, incluye OBLIGATORIAMENTE una línea con las etiquetas separadas por comas. Debe iniciar SIEMPRE con "profe rochi, profe monica" seguido de las palabras clave del tema, ortografía, RAE, dudas frecuentes, etc.:
ETIQUETAS: profe rochi, profe monica, [etiquetas del tema separadas por coma]

EJEMPLO DE SALIDA EXACTA:
TÍTULO: PALABRAS AGUDAS
HABLA: ¡Aprende las palabras agudas en solo 30 segundos!
HABLA: ¿Sabías cuándo una palabra aguda lleva tilde? ¡Es muy fácil!
PIZARRA: camión
HABLA: Llevan tilde cuando terminan en N, S o vocal, como camión.
PIZARRA: compás
HABLA: ¡Otro ejemplo perfecto es compás! Termina en S y se acentúa al final.
HABLA: ¿Cuál otra palabra aguda con tilde conoces? ¡Coméntala!
ETIQUETAS: profe rochi, profe monica, palabras agudas, acentuacion, reglas de ortografia, rae, aprender español, lengua castellana, educacion, trucos de ortografia, profe de español, shorts

¡Genera ahora el guion para el siguiente tema!: `;

// Plantillas educativas iniciales
const TEMPLATES = {
  capicua: [
    {
      speech: "¡Hoy aprenderemos qué son los números capicúa!",
      action: "write",
      text: "NÚMEROS CAPICÚA",
      target: "title",
      camera: "board"
    },
    {
      speech: "¡Hola! ¿Sabías que hay números que se leen exactamente igual al derecho y al revés?",
      action: "talk",
      text: "",
      target: "intro",
      camera: "teacher"
    },
    {
      speech: "A estos números tan curiosos se les llama números CAPICÚA.",
      action: "write",
      text: "1 2 2 1",
      target: "example1",
      camera: "board"
    },
    {
      speech: "Fíjate muy bien: el uno de adelante es igual al uno del final, y los doses del centro coinciden.",
      action: "arc",
      text: "1 2 2 1",
      target: "example1",
      fromIdx: 0,
      toIdx: 3,
      fromIdx2: 1,
      toIdx2: 2,
      camera: "board"
    },
    {
      speech: "Otro ejemplo perfecto es el ochenta y siete mil setecientos ochenta y siete.",
      action: "write",
      text: "8 7 7 8",
      target: "example2",
      camera: "board"
    },
    {
      speech: "¿Conoces otro número capicúa? ¡Déjalo aquí en los comentarios!",
      action: "talk",
      text: "",
      target: "outro",
      camera: "teacher"
    }
  ],
  palindromos: [
    {
      speech: "¡Hoy aprenderemos qué son los palíndromos!",
      action: "write",
      text: "PALÍNDROMOS",
      target: "title",
      camera: "board"
    },
    {
      speech: "Un palíndromo es una palabra o frase que se lee exactamente igual al derecho y al revés.",
      action: "talk",
      text: "",
      target: "intro",
      camera: "teacher"
    },
    {
      speech: "Por ejemplo, fíjate en la palabra reconocer.",
      action: "write",
      text: "reconocer",
      target: "example1",
      camera: "board"
    },
    {
      speech: "Mira cómo la R del inicio se une con la R del final, la E con la E, la C con la C, hasta la O central.",
      action: "arc",
      text: "reconocer",
      target: "example1",
      fromIdx: 0,
      toIdx: 8,
      camera: "board"
    },
    {
      speech: "Y también ocurre con palabras largas como: sometemos o anilina.",
      action: "write",
      text: "sometemos",
      target: "example2",
      camera: "board"
    },
    {
      speech: "¿Conoces otro palíndromo? ¡Déjalo aquí en los comentarios!",
      action: "talk",
      text: "",
      target: "outro",
      camera: "teacher"
    }
  ],
  acentuacion: [
    {
      speech: "¡Aprende las palabras agudas en solo 30 segundos!",
      action: "write",
      text: "PALABRAS AGUDAS",
      target: "title",
      camera: "board"
    },
    {
      speech: "¿Sabías cuándo una palabra aguda lleva tilde? ¡Es muy fácil!",
      action: "talk",
      text: "",
      target: "intro",
      camera: "teacher"
    },
    {
      speech: "Llevan el acento en la última sílaba. Y llevan tilde cuando terminan en N, S o Vocal.",
      action: "write",
      text: "ca - mión",
      target: "example1",
      camera: "board"
    },
    {
      speech: "Termina en N, por lo tanto lleva tilde en la O.",
      action: "arc",
      text: "ca - mión",
      target: "example1",
      fromIdx: 6,
      toIdx: 7,
      camera: "board"
    },
    {
      speech: "Otro ejemplo clásico: ca - fé. Termina en vocal, ¡lleva tilde!",
      action: "write",
      text: "ca - fé",
      target: "example2",
      camera: "board"
    },
    {
      speech: "¡Sigue la cuenta para no volver a dudar de tu ortografía!",
      action: "talk",
      text: "",
      target: "outro",
      camera: "teacher"
    }
  ],
  mates: [
    {
      speech: "¡No le tengas miedo a las ecuaciones! Resolver esto es facilísimo.",
      action: "write",
      text: "ECUACIÓN DE PRIMER GRADO",
      target: "title",
      camera: "teacher"
    },
    {
      speech: "Tenemos x más cinco igual a doce. El objetivo es dejar a la x completamente sola.",
      action: "write",
      text: "x + 5 = 12",
      target: "example1",
      camera: "board"
    },
    {
      speech: "El cinco que está sumando en la izquierda, pasa al otro lado de la igualdad a restar.",
      action: "write",
      text: "x = 12 - 5",
      target: "example2",
      camera: "board"
    },
    {
      speech: "Doce menos cinco nos da siete. ¡Y listo! La x vale siete.",
      action: "write",
      text: "x = 7 ✓",
      target: "result",
      camera: "board"
    },
    {
      speech: "¿Ves qué fácil? ¡Comparte este truco con quien lo necesite!",
      action: "highlight",
      text: "x = 7",
      camera: "teacher"
    }
  ]
};

// Elementos del DOM
const canvas = document.getElementById("stageCanvas");
const ctx = canvas.getContext("2d");
const stepsListEl = document.getElementById("stepsList");
const btnPlayPreview = document.getElementById("btnPlayPreview");
const btnRecord = document.getElementById("btnRecord");
const btnRestart = document.getElementById("btnRestart");
const btnTogglePlay = document.getElementById("btnTogglePlay");
const statusNotice = document.getElementById("statusNotice");
const badgeTime = document.getElementById("badgeTime");
const badgeRecording = document.getElementById("badgeRecording");
const selectVoice = document.getElementById("selectVoice");
const selectAvatar = document.getElementById("selectAvatar");
const selectTheme = document.getElementById("selectTheme");
const selectCameraMode = document.getElementById("selectCameraMode");
const selectFormat = document.getElementById("selectFormat");
const aiTopicInput = document.getElementById("aiTopicInput");
const btnAiGenerate = document.getElementById("btnAiGenerate");
const sliderVoiceVol = document.getElementById("sliderVoiceVol");
const labelVoiceVol = document.getElementById("labelVoiceVol");
const sliderMarkerSound = document.getElementById("sliderMarkerSound");
const labelSoundVol = document.getElementById("labelSoundVol");
const selectBgMusic = document.getElementById("selectBgMusic");
const sliderMusicVol = document.getElementById("sliderMusicVol");
const labelMusicVol = document.getElementById("labelMusicVol");
const btnDownloadThumbnail = document.getElementById("btnDownloadThumbnail");
const btnTogglePasteScript = document.getElementById("btnTogglePasteScript");
const btnClosePasteScript = document.getElementById("btnClosePasteScript");
const btnProcessRawScript = document.getElementById("btnProcessRawScript");
const btnCopyPrompt = document.getElementById("btnCopyPrompt");
const btnCopyPromptInside = document.getElementById("btnCopyPromptInside");
const btnLoadExampleScript = document.getElementById("btnLoadExampleScript");
const pasteScriptPanel = document.getElementById("pasteScriptPanel");
const rawScriptText = document.getElementById("rawScriptText");
const tabBtnPreview = document.getElementById("tabBtnPreview");
const tabBtnSteps = document.getElementById("tabBtnSteps");
const tabBtnChallenges = document.getElementById("tabBtnChallenges");
const tabBtnSettings = document.getElementById("tabBtnSettings");
const btnMobilePlay = document.getElementById("btnMobilePlay");
const btnMobileRecord = document.getElementById("btnMobileRecord");
const customGlbInput = document.getElementById("customGlbInput");
const label3dStatus = document.getElementById("label3dStatus");

// =========================================================
// MOTOR 3D THREE.JS (AVATAR GLB REALISTA)
// =========================================================
let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let threeModel = null;
let threeLoaded = false;
let threeCanvas = null;

function initThree3D() {
  if (typeof THREE === "undefined") {
    console.warn("Three.js cargando...");
    return;
  }

  threeScene = new THREE.Scene();

  // Cámara 3D con perspectiva para retrato/figura
  threeCamera = new THREE.PerspectiveCamera(36, canvas.width / canvas.height, 0.1, 100);
  threeCamera.position.set(0, 1.25, 3.8);

  // Iluminación de estudio profesional
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  threeScene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfff5eb, 1.9);
  mainLight.position.set(2.5, 4, 3.5);
  threeScene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
  fillLight.position.set(-3, 2, 2.5);
  threeScene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xf97316, 1.5);
  rimLight.position.set(0, 3, -4);
  threeScene.add(rimLight);

  // Canvas WebGL offscreen de alta definición
  threeCanvas = document.createElement("canvas");
  threeCanvas.width = 1080;
  threeCanvas.height = 1920;

  threeRenderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true
  });
  threeRenderer.setClearColor(0x000000, 0);
  threeRenderer.outputEncoding = THREE.sRGBEncoding;

  loadDefault3DModel();
}

function loadDefault3DModel() {
  if (label3dStatus) label3dStatus.textContent = "Cargando 3D...";

  const loader = new THREE.GLTFLoader();
  loader.load(
    "/avatars/profe_3d.glb",
    (gltf) => {
      setup3DCharacter(gltf.scene);
      threeLoaded = true;
      if (label3dStatus) label3dStatus.textContent = "✅ Modelo 3D Activo";
    },
    (xhr) => {
      if (xhr.lengthComputable && label3dStatus) {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        label3dStatus.textContent = `Cargando ${percent}%`;
      }
    },
    (err) => {
      console.warn("No se pudo cargar /avatars/profe_3d.glb automáticamente:", err);
      if (label3dStatus) label3dStatus.textContent = "Sube tu .glb";
    }
  );
}

function setup3DCharacter(model) {
  if (threeModel) {
    threeScene.remove(threeModel);
  }
  threeModel = model;

  // Centrar y escalar automáticamente
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const targetHeight = 2.4;
  const scale = targetHeight / (maxDim || 1);
  model.scale.setScalar(scale);

  // Centrar la modelo en el encuadre
  model.position.x = -center.x * scale;
  model.position.y = (-center.y * scale) - 0.15;
  model.position.z = -center.z * scale;

  threeScene.add(model);
}

// Iniciar aplicación
window.addEventListener("DOMContentLoaded", () => {
  try { initTopicsSelector(); } catch (e) { console.error("Error al iniciar temas:", e); }
  try { initChallengesModule(); } catch (e) { console.error("Error al iniciar retos:", e); }
  try { setupEventListeners(); } catch (e) { console.error("Error al iniciar listeners:", e); }
  try { loadTemplate("capicua"); } catch (e) { console.error("Error al cargar plantilla:", e); }
  try { initAudio(); } catch (e) { console.error("Error al iniciar audio:", e); }
  try { initThree3D(); } catch (e) { console.error("Error al iniciar 3D:", e); }
  try { resizeCanvas(); } catch (e) { console.error("Error al redimensionar canvas:", e); }
  requestAnimationFrame(renderLoop);
});

function setupEventListeners() {
  const bindClick = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  };
  bindClick("btnTplCapicua", (e) => switchActiveTemplate(e, "capicua"));
  bindClick("btnTplPalindromos", (e) => switchActiveTemplate(e, "palindromos"));
  bindClick("btnTplAcentuacion", (e) => switchActiveTemplate(e, "acentuacion"));
  bindClick("btnTplMates", (e) => switchActiveTemplate(e, "mates"));

  document.getElementById("btnAddStep").addEventListener("click", () => {
    state.steps.push({
      speech: "Escribe aquí la explicación de este paso.",
      action: "write",
      text: "Nuevo Texto",
      camera: "board"
    });
    renderStepsUI();
    updateYoutubeCopy();
  });

  if (selectVoice) selectVoice.addEventListener("change", (e) => state.voice = e.target.value);
  if (selectAvatar && selectAvatar.tagName === "SELECT") {
    selectAvatar.addEventListener("change", (e) => state.avatar = e.target.value);
  } else {
    state.avatar = "bellum";
  }
  if (selectTheme) selectTheme.addEventListener("change", (e) => state.theme = e.target.value);
  if (selectCameraMode) selectCameraMode.addEventListener("change", (e) => state.cameraMode = e.target.value);
  if (selectFormat) {
    selectFormat.addEventListener("change", (e) => {
      state.format = e.target.value;
      resizeCanvas();
    });
  }

  // Botones para copiar el Prompt Maestro pedagógico para ChatGPT/Claude
  const handleCopyPrompt = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(MASTER_AI_PROMPT).then(() => {
        updateStatus("✅ ¡Prompt copiado al portapapeles! Pégalo en ChatGPT o Claude con tu tema.");
        alert("✅ ¡Prompt Maestro Copiado!\n\nPégalo en ChatGPT, Claude o Gemini con el tema que quieras y te devolverá el guion perfecto listo para pegar.");
      }).catch(() => {
        promptFallback();
      });
    } else {
      promptFallback();
    }
  };

  const promptFallback = () => {
    if (rawScriptText) {
      rawScriptText.value = MASTER_AI_PROMPT;
      if (pasteScriptPanel) pasteScriptPanel.style.display = "block";
      updateStatus("📋 Prompt insertado en el cuadro de texto.");
    }
  };

  if (btnCopyPrompt) btnCopyPrompt.addEventListener("click", handleCopyPrompt);
  if (btnCopyPromptInside) btnCopyPromptInside.addEventListener("click", handleCopyPrompt);

  if (btnLoadExampleScript) {
    btnLoadExampleScript.addEventListener("click", () => {
      if (rawScriptText) {
        rawScriptText.value = `TÍTULO: PALABRAS AGUDAS
HABLA: ¡Aprende las palabras agudas en solo 30 segundos!
HABLA: ¿Sabías cuándo una palabra aguda lleva tilde? ¡Es muy fácil!
PIZARRA: camión
HABLA: Llevan tilde cuando terminan en N, S o vocal, como camión.
PIZARRA: compás
HABLA: ¡Otro ejemplo perfecto es compás! Termina en S y se acentúa al final.
HABLA: ¿Cuál otra palabra aguda con tilde conoces? ¡Coméntala!
ETIQUETAS: profe rochi, profe monica, palabras agudas, acentuacion, reglas de ortografia, rae, aprender español, lengua castellana, educacion, trucos de ortografia, profe de español, shorts`;
        updateStatus("💡 Ejemplo con etiquetas cargado en el cuadro. Haz clic en '⚡ Auto-Dividir'.");
      }
    });
  }

  // Pestañas de navegación para escritorio
  const switchSidebarTab = (tabName) => {
    const tabBtns = document.querySelectorAll(".sidebar-tab-btn");
    tabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    const panes = {
      settings: document.getElementById("paneSettings"),
      steps: document.getElementById("paneSteps"),
      challenges: document.getElementById("paneChallenges")
    };

    Object.keys(panes).forEach(k => {
      if (panes[k]) {
        panes[k].classList.toggle("active", k === tabName);
      }
    });
  };
  window.switchSidebarTab = switchSidebarTab;

  const desktopTabBtns = document.querySelectorAll(".sidebar-tab-btn");
  desktopTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchSidebarTab(btn.dataset.tab);
    });
  });

  // Pestañas de navegación para celulares y pantallas pequeñas
  const setMobileTab = (tabName) => {
    document.body.classList.remove("mobile-tab-preview", "mobile-tab-steps", "mobile-tab-settings", "mobile-tab-challenges");
    document.body.classList.add(`mobile-tab-${tabName}`);

    if (tabBtnPreview) tabBtnPreview.classList.toggle("active", tabName === "preview");
    if (tabBtnSteps) tabBtnSteps.classList.toggle("active", tabName === "steps");
    if (tabBtnChallenges) tabBtnChallenges.classList.toggle("active", tabName === "challenges");
    if (tabBtnSettings) tabBtnSettings.classList.toggle("active", tabName === "settings");

    if (tabName === "steps" || tabName === "challenges" || tabName === "settings") {
      switchSidebarTab(tabName);
    }
  };
  window.setMobileTab = setMobileTab;

  if (tabBtnPreview) tabBtnPreview.addEventListener("click", () => setMobileTab("preview"));
  if (tabBtnSteps) tabBtnSteps.addEventListener("click", () => setMobileTab("steps"));
  if (tabBtnChallenges) tabBtnChallenges.addEventListener("click", () => setMobileTab("challenges"));
  if (tabBtnSettings) tabBtnSettings.addEventListener("click", () => setMobileTab("settings"));

  // Inicializar en pestaña Preview en móvil
  setMobileTab("preview");

  // Botones flotantes móviles
  if (btnMobilePlay) btnMobilePlay.addEventListener("click", () => generateAndPlay());
  if (btnMobileRecord) btnMobileRecord.addEventListener("click", () => toggleRecording());

  // Panel para pegar texto completo y dividir pasos automáticamente
  if (btnTogglePasteScript) {
    btnTogglePasteScript.addEventListener("click", () => {
      if (pasteScriptPanel) {
        pasteScriptPanel.style.display = (pasteScriptPanel.style.display === "none" || !pasteScriptPanel.style.display) ? "block" : "none";
      }
    });
  }
  if (btnClosePasteScript) {
    btnClosePasteScript.addEventListener("click", () => {
      if (pasteScriptPanel) pasteScriptPanel.style.display = "none";
    });
  }
  if (btnProcessRawScript) {
    btnProcessRawScript.addEventListener("click", () => {
      if (rawScriptText) parseScriptText(rawScriptText.value);
    });
  }

  // Botón para descargar miniatura de portada
  if (btnDownloadThumbnail) {
    btnDownloadThumbnail.addEventListener("click", downloadThumbnailCover);
  }

  // Deslizador configurable para tamaño de título (Pizarra y Portada)
  const sliderTitleSize = document.getElementById("sliderTitleSize");
  const labelTitleSize = document.getElementById("labelTitleSize");
  if (sliderTitleSize) {
    sliderTitleSize.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      state.titleFontSize = val;
      state.boardTitleFontSize = val;
      state.bannerTitleFontSize = Math.round(val * 0.68);
      if (labelTitleSize) labelTitleSize.textContent = `${val} px`;
    });
  }

  // Botón para alternar la vista previa de portada sensual
  const btnPreviewCover = document.getElementById("btnPreviewCover");
  const btnMobileCover = document.getElementById("btnMobileCover");
  const toggleCoverPreview = () => {
    if (window.innerWidth <= 920 && window.setMobileTab) {
      window.setMobileTab("preview");
    }
    if (state.audioElement && !state.audioElement.paused) {
      state.audioElement.pause();
      state.isPlaying = false;
    }
    state.isShowingCoverPreview = !state.isShowingCoverPreview;
    if (state.isShowingCoverPreview) {
      state.isShowingChallengePreview = false;
    }
    if (btnPreviewCover) {
      btnPreviewCover.textContent = state.isShowingCoverPreview ? "🎬 Video" : "👁️ Ver";
      btnPreviewCover.style.background = state.isShowingCoverPreview ? "#7c3aed" : "rgba(168, 85, 247, 0.2)";
    }
    if (btnMobileCover) {
      btnMobileCover.textContent = state.isShowingCoverPreview ? "🎬 Video" : "📸 Portada";
    }
    if (state.isShowingCoverPreview) {
      updateStatus("📸 Vista previa de Portada Sensual activa (docente de espaldas escribiendo). Ajusta el tamaño del título.");
    } else {
      updateStatus("🎬 Volviendo a reproducción normal de video.");
    }
  };
  if (btnPreviewCover) btnPreviewCover.addEventListener("click", toggleCoverPreview);
  if (btnMobileCover) btnMobileCover.addEventListener("click", toggleCoverPreview);

  // Botón móvil directo para guardar portada HD en galería o compartir
  const btnMobileSaveCover = document.getElementById("btnMobileSaveCover");
  if (btnMobileSaveCover) {
    btnMobileSaveCover.addEventListener("click", downloadThumbnailCover);
  }

  // Selector de Outfit elegante y sensual para La Profe Rochi
  const selectOutfit = document.getElementById("selectOutfit");
  if (selectOutfit) {
    selectOutfit.value = state.outfit || "red";
    selectOutfit.addEventListener("change", (e) => {
      setAvatarOutfit(e.target.value);
      const badge = document.getElementById("badgeOutfitActive");
      if (badge) {
        const badgeNames = {
          red: "🔴 Rojo",
          black: "⚫ Negro",
          blue: "🔵 Azul",
          purple: "🟣 Púrpura"
        };
        badge.textContent = badgeNames[e.target.value] || "Sensual";
      }
      updateStatus(`👗 Outfit cambiado a: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  // Control de volumen de voz del docente
  if (sliderVoiceVol) {
    sliderVoiceVol.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      state.voiceVolume = val / 100;
      if (labelVoiceVol) labelVoiceVol.textContent = `${val}%`;
      if (state.audioElement) {
        state.audioElement.volume = state.voiceVolume;
      }
      if (state.voiceGainNode && state.audioContext) {
        state.voiceGainNode.gain.setTargetAtTime(state.voiceVolume, state.audioContext.currentTime, 0.04);
      }
    });
  }

  if (sliderMarkerSound) {
    sliderMarkerSound.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      state.soundVolume = val / 100;
      if (labelSoundVol) labelSoundVol.textContent = `${val}%`;
      soundEngine.setVolume(state.soundVolume);
    });
  }

  // Controles de música suave de fondo
  if (sliderMusicVol) {
    sliderMusicVol.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      state.musicVolume = val / 100;
      if (labelMusicVol) labelMusicVol.textContent = `${val}%`;
      if (state.bgMusicGainNode && state.audioContext) {
        state.bgMusicGainNode.gain.setTargetAtTime(state.musicVolume, state.audioContext.currentTime, 0.04);
      }
      if (val === 0 && state.bgMusicAudio) {
        state.bgMusicAudio.pause();
      } else if (state.isPlaying && state.bgMusicAudio && state.bgMusicAudio.paused && state.musicTrack !== "none") {
        state.bgMusicAudio.play().catch(() => {});
      }
    });
  }

  if (selectBgMusic) {
    selectBgMusic.addEventListener("change", (e) => {
      state.musicTrack = e.target.value;
      if (state.musicTrack === "none") {
        if (state.bgMusicAudio) state.bgMusicAudio.pause();
      } else {
        if (state.isPlaying && state.bgMusicAudio) {
          state.bgMusicAudio.play().catch(() => {});
        }
      }
    });
  }

  btnPlayPreview.addEventListener("click", generateAndPlay);
  btnRecord.addEventListener("click", toggleRecording);
  btnRestart.addEventListener("click", restartPlayback);
  btnTogglePlay.addEventListener("click", togglePausePlayback);

  btnAiGenerate.addEventListener("click", generateAiTopic);

  // Desbloquear audio en el primer clic de la página
  document.body.addEventListener("click", () => {
    if (!state.audioContext) {
      initAudio();
    }
  }, { once: true });
}

function switchActiveTemplate(event, key) {
  document.querySelectorAll(".template-chips .chip").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  loadTemplate(key);
}

function loadTemplate(key) {
  stopAndResetAllAudio();
  state.steps = JSON.parse(JSON.stringify(TEMPLATES[key] || TEMPLATES.capicua));
  state.steps.forEach(s => {
    s.progress = 0;
    delete s.startTime;
    delete s.speechEndTime;
  });
  renderStepsUI();
  updateYoutubeCopy();
  updateStatus(`Plantilla cargada: ${key.toUpperCase()}`);
}

function renderStepsUI() {
  stepsListEl.innerHTML = "";
  state.steps.forEach((step, idx) => {
    const card = document.createElement("div");
    card.className = "step-card";
    const speechLen = (step.speech || "").length;
    const textLen = (step.text || "").length;
    const speechCounterClass = speechLen > 130 ? "char-counter danger" : (speechLen > 110 ? "char-counter warning" : "char-counter");
    const textCounterClass = textLen > 28 ? "char-counter danger" : (textLen > 22 ? "char-counter warning" : "char-counter");

    card.innerHTML = `
      <div class="step-card-header">
        <span class="step-number">Paso ${idx + 1}</span>
        <div class="step-actions">
          <button class="btn-icon-danger" onclick="removeStep(${idx})" title="Eliminar">✕</button>
        </div>
      </div>
      <div class="form-group">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <label>Lo que dice el docente:</label>
          <span class="${speechCounterClass}" id="speech-counter-${idx}">${speechLen}/140</span>
        </div>
        <textarea class="form-control" maxlength="140" oninput="onStepSpeechInput(${idx}, this)" onchange="updateStepSpeech(${idx}, this.value)">${escapeHtml(step.speech)}</textarea>
      </div>
      <div class="step-card-footer">
        <div class="form-group">
          <label>Acción pizarra:</label>
          <select class="form-control" onchange="updateStepAction(${idx}, this.value)">
            <option value="write" ${step.action === "write" ? "selected" : ""}>✍️ Escribir texto</option>
            <option value="arc" ${step.action === "arc" ? "selected" : ""}>🔗 Flecha de unión</option>
            <option value="highlight" ${step.action === "highlight" ? "selected" : ""}>🟡 Resaltar</option>
            <option value="talk" ${step.action === "talk" ? "selected" : ""}>💬 Solo hablar</option>
            <option value="clear" ${step.action === "clear" ? "selected" : ""}>🧹 Borrar pizarra</option>
          </select>
        </div>
        <div class="form-group">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <label>Texto pizarra:</label>
            <span class="${textCounterClass}" id="text-counter-${idx}">${textLen}/30</span>
          </div>
          <input type="text" class="form-control" maxlength="30" value="${escapeHtml(step.text || '')}" oninput="onStepTextInput(${idx}, this)" onchange="updateStepText(${idx}, this.value)">
        </div>
      </div>
    `;
    stepsListEl.appendChild(card);
  });
}

window.onStepSpeechInput = (idx, el) => {
  if (state.steps[idx]) state.steps[idx].speech = el.value;
  const counter = document.getElementById(`speech-counter-${idx}`);
  if (counter) {
    const len = el.value.length;
    counter.textContent = `${len}/140`;
    counter.className = len > 130 ? "char-counter danger" : (len > 110 ? "char-counter warning" : "char-counter");
  }
};

window.onStepTextInput = (idx, el) => {
  if (state.steps[idx]) state.steps[idx].text = el.value;
  const counter = document.getElementById(`text-counter-${idx}`);
  if (counter) {
    const len = el.value.length;
    counter.textContent = `${len}/30`;
    counter.className = len > 28 ? "char-counter danger" : (len > 22 ? "char-counter warning" : "char-counter");
  }
};

function splitIntoChunks(text, maxChars = 135) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const chunks = [];
  let cur = "";
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + " " + w).length <= maxChars) {
      cur += " " + w;
    } else {
      chunks.push(cur);
      cur = w;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

function parseScriptText(raw) {
  if (!raw || !raw.trim()) {
    alert("Pega primero el texto o guion en el cuadro.");
    return;
  }
  const lines = raw.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const newSteps = [];
  let explicitTitle = "";

  const hasTags = lines.some(l => /^(T[ÍI]TULO|HABLA|PROFE|DOCENTE|PIZARRA|TEXTO|ESCRIBE|ARCO|FLECHA|ETIQUETAS|TAGS|KEYWORDS):/i.test(l));
  let explicitTags = "";

  if (hasTags) {
    let pendingText = "";
    let pendingAction = "talk";

    for (const line of lines) {
      if (/^(T[ÍI]TULO):/i.test(line)) {
        explicitTitle = line.replace(/^(T[ÍI]TULO):/i, "").trim().slice(0, 30);
      } else if (/^(ETIQUETAS|TAGS|KEYWORDS):/i.test(line)) {
        explicitTags = line.replace(/^(ETIQUETAS|TAGS|KEYWORDS):/i, "").trim();
      } else if (/^(PIZARRA|TEXTO|ESCRIBE):/i.test(line)) {
        pendingText = line.replace(/^(PIZARRA|TEXTO|ESCRIBE):/i, "").trim().slice(0, 30);
        pendingAction = "write";
        if (newSteps.length > 0 && newSteps[newSteps.length - 1].action === "talk") {
          newSteps[newSteps.length - 1].action = "write";
          newSteps[newSteps.length - 1].text = pendingText;
          newSteps[newSteps.length - 1].camera = "board";
          pendingText = "";
          pendingAction = "talk";
        }
      } else if (/^(HABLA|PROFE|DOCENTE):/i.test(line)) {
        const speech = line.replace(/^(HABLA|PROFE|DOCENTE):/i, "").trim();
        const chunks = splitIntoChunks(speech, 135);
        chunks.forEach((chunk, cIdx) => {
          newSteps.push({
            speech: chunk,
            action: (cIdx === 0 && pendingText) ? pendingAction : "talk",
            text: (cIdx === 0 && pendingText) ? pendingText : "",
            camera: (cIdx === 0 && pendingText) ? "board" : "teacher"
          });
          pendingText = "";
          pendingAction = "talk";
        });
      } else if (/^(ARCO|FLECHA):/i.test(line)) {
        const text = line.replace(/^(ARCO|FLECHA):/i, "").trim().slice(0, 30);
        newSteps.push({
          speech: "Observa con atención cómo coinciden.",
          action: "arc",
          text: text,
          camera: "board"
        });
      }
    }
  } else {
    // Texto libre sin etiquetas
    const sentences = raw.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [raw];
    sentences.forEach((sent, sIdx) => {
      const clean = sent.trim();
      if (!clean) return;
      const chunks = splitIntoChunks(clean, 135);
      chunks.forEach((chunk, cIdx) => {
        if (sIdx === 0 && cIdx === 0) {
          explicitTitle = chunk.slice(0, 26).toUpperCase();
          newSteps.push({
            speech: chunk,
            action: "write",
            text: explicitTitle,
            target: "title",
            camera: "board"
          });
        } else {
          const isWrite = (sIdx % 2 === 1 && cIdx === 0);
          newSteps.push({
            speech: chunk,
            action: isWrite ? "write" : "talk",
            text: isWrite ? chunk.split(/\s+/).slice(0, 3).join(" ").slice(0, 28) : "",
            camera: isWrite ? "board" : "teacher"
          });
        }
      });
    });
  }

  if (newSteps.length > 0) {
    if (explicitTitle) {
      newSteps[0].text = explicitTitle;
      newSteps[0].target = "title";
      newSteps[0].action = "write";
    }
    state.steps = newSteps;
    state.customTags = explicitTags || null;
    renderStepsUI();
    updateYoutubeCopy();
    if (pasteScriptPanel) pasteScriptPanel.style.display = "none";
    updateStatus(`✅ ¡Guion importado! Se generaron ${newSteps.length} pasos con etiquetas optimizadas.`);
  }
}

/* =========================================================
   PALETAS CROMÁTICAS TEMÁTICAS POR ASIGNATURA (FEED & PIZARRA)
   Permiten diferenciar al instante en TikTok/Shorts/Reels cada materia
   ========================================================= */
const SUBJECT_PALETTES = {
  math: {
    id: "math",
    name: "Matemáticas",
    badgeName: "MATEMÁTICAS",
    badgeIcon: "📐",
    wallColor: "rgba(30, 64, 175, 0.68)", // Azul Real tecnológico
    boardBg: "#f0f7ff",                   // Superficie blanco hielo
    boardBorder: "#2563eb",               // Marco azul brillante
    hasGrid: true,                        // Cuadrícula matemática
    gridColor: "rgba(59, 130, 246, 0.18)",
    bannerGrad: ["#1e40af", "#3b82f6", "#60a5fa"],
    bannerTextColor: "#ffffff",
    bannerBorder: "#1d4ed8",
    badgeBg: "#2563eb",
    mainInk: "#0f172a",
    accentInk: "#1d4ed8",
    redInk: "#dc2626"
  },
  science: {
    id: "science",
    name: "Ciencias Naturales",
    badgeName: "CIENCIAS NATURALES",
    badgeIcon: "🌱",
    wallColor: "rgba(6, 95, 70, 0.68)",   // Verde bosque esmeralda
    boardBg: "#f0fdf4",                   // Superficie menta limpia
    boardBorder: "#059669",               // Marco esmeralda
    hasGrid: false,
    bannerGrad: ["#065f46", "#059669", "#34d399"],
    bannerTextColor: "#ffffff",
    bannerBorder: "#047857",
    badgeBg: "#059669",
    mainInk: "#064e3b",
    accentInk: "#059669",
    redInk: "#dc2626"
  },
  social: {
    id: "social",
    name: "Ciencias Sociales",
    badgeName: "CIENCIAS SOCIALES",
    badgeIcon: "🗺️",
    wallColor: "rgba(154, 52, 18, 0.68)", // Terracota / Ámbar tierra
    boardBg: "#fffbeb",                   // Pergamino cálido
    boardBorder: "#d97706",               // Marco ámbar
    hasGrid: false,
    bannerGrad: ["#9a3412", "#d97706", "#fbbf24"],
    bannerTextColor: "#ffffff",
    bannerBorder: "#78350f",
    badgeBg: "#d97706",
    mainInk: "#1c1917",
    accentInk: "#b45309",
    redInk: "#dc2626"
  },
  spanish: {
    id: "spanish",
    name: "Lengua Castellana",
    badgeName: "LENGUA CASTELLANA",
    badgeIcon: "📖",
    wallColor: "rgba(107, 33, 168, 0.50)", // Púrpura oficial La Profe Rochi
    boardBg: "#ffffff",                   // Pizarra blanca acrílica clásica
    boardBorder: "#f59e0b",               // Marco dorado tradicional
    hasGrid: false,
    bannerGrad: ["#fbbf24", "#fef08a", "#f59e0b"],
    bannerTextColor: "#1e1b4b",
    bannerBorder: "#78350f",
    badgeBg: "#ef4444",
    mainInk: "#111827",
    accentInk: "#1d4ed8",
    redInk: "#dc2626"
  },
  english: {
    id: "english",
    name: "Inglés",
    badgeName: "INGLÉS",
    badgeIcon: "🇬🇧",
    wallColor: "rgba(49, 46, 129, 0.70)", // Azul marino real británico / Índigo
    boardBg: "#f8fafc",                   // Pizarra moderna pizarra-hielo
    boardBorder: "#4f46e5",               // Marco índigo
    hasGrid: false,
    bannerGrad: ["#312e81", "#4f46e5", "#818cf8"],
    bannerTextColor: "#ffffff",
    bannerBorder: "#3730a3",
    badgeBg: "#4f46e5",
    mainInk: "#0f172a",
    accentInk: "#4338ca",
    redInk: "#dc2626"
  },
  ethics: {
    id: "ethics",
    name: "Ética y Valores",
    badgeName: "ÉTICA Y VALORES",
    badgeIcon: "🤝",
    wallColor: "rgba(15, 118, 110, 0.68)", // Verde azulado / Aguamarina
    boardBg: "#f0fdfa",                   // Superficie agua suave
    boardBorder: "#0d9488",               // Marco aguamarina
    hasGrid: false,
    bannerGrad: ["#0f766e", "#0d9488", "#2dd4bf"],
    bannerTextColor: "#ffffff",
    bannerBorder: "#115e59",
    badgeBg: "#0d9488",
    mainInk: "#134e4a",
    accentInk: "#0d9488",
    redInk: "#dc2626"
  },
  rae: {
    id: "rae",
    name: "Ortografía RAE",
    badgeName: "ORTOGRAFÍA RAE",
    badgeIcon: "✍️",
    wallColor: "rgba(157, 23, 77, 0.68)", // Rubí vino / Carmesí viral
    boardBg: "#fff1f2",                   // Rosa pálido elegante
    boardBorder: "#e11d48",               // Marco carmesí
    hasGrid: false,
    bannerGrad: ["#9d174d", "#e11d48", "#fb7185"],
    bannerTextColor: "#ffffff",
    bannerBorder: "#be123c",
    badgeBg: "#e11d48",
    mainInk: "#111827",
    accentInk: "#be123c",
    redInk: "#dc2626"
  }
};

function getCurrentSubjectPalette() {
  const select = document.getElementById("selectRaeTopic");
  const topicId = select ? select.value : "";
  const topics = window.RAE_TOPICS || window.PROFE_TOPICS || [];
  const curTopic = topics.find(t => t.id === topicId);
  const cat = (curTopic ? (curTopic.category || "") : "").toLowerCase();
  const title = getLessonTitle().toLowerCase();

  if (cat.includes("matemát") || title.includes("capicúa") || title.includes("número") || title.includes("tabla") || title.includes("suma") || title.includes("conjunto") || title.includes("descomposi") || title.includes("multiplica")) {
    return SUBJECT_PALETTES.math;
  }
  if (cat.includes("natural") || cat.includes("ciencia") || title.includes("célula") || title.includes("tejido") || title.includes("tierra") || title.includes("rotación")) {
    return SUBJECT_PALETTES.science;
  }
  if (cat.includes("social") || title.includes("colombia") || title.includes("sector") || title.includes("cardinal") || title.includes("departamento")) {
    return SUBJECT_PALETTES.social;
  }
  if (cat.includes("ingl") || title.includes("english") || title.includes("number") || title.includes("color") || title.includes("house") || title.includes("school") || title.includes("material")) {
    return SUBJECT_PALETTES.english;
  }
  if (cat.includes("ética") || cat.includes("valor") || title.includes("conflicto") || title.includes("democracia") || title.includes("ambiente") || title.includes("agresión")) {
    return SUBJECT_PALETTES.ethics;
  }
  if (cat.includes("lengua") || title.includes("sustantivo") || title.includes("tilde") || title.includes("sega") || title.includes("adjetivo") || title.includes("verbo") || title.includes("sinónimo") || title.includes("antónimo") || title.includes("palíndrom")) {
    return SUBJECT_PALETTES.spanish;
  }
  return SUBJECT_PALETTES.rae;
}

/* =========================================================
   PORTADA SENSUAL HD Y SELECTOR DE TEMAS - LA PROFE ROCHI
   ========================================================= */

function renderSensualCover(targetCanvas) {
  const tCtx = targetCanvas.getContext("2d");
  const w = targetCanvas.width;
  const h = targetCanvas.height;

  const palette = getCurrentSubjectPalette();

  // 1. Fondo de aula ilustrada oficial (formato 9:16 vertical)
  const isLandscape = (w > h);
  const bg = isLandscape ? bgClassroomH : bgClassroomV;
  if (bg && bg.complete && bg.naturalWidth > 0) {
    tCtx.drawImage(bg, 0, 0, w, h);
  } else {
    tCtx.fillStyle = "#81399d";
    tCtx.fillRect(0, 0, w, h);
  }

  // 1b. Tinte temático de la pared según la asignatura (Diferenciación instantánea en el Feed)
  if (palette && palette.wallColor) {
    tCtx.save();
    tCtx.globalCompositeOperation = "color";
    tCtx.fillStyle = palette.wallColor;
    tCtx.fillRect(0, 0, w, 1340);
    tCtx.restore();
  }

  // Reloj de pared dinámico con hora exacta en la portada
  drawLiveWallClock(tCtx, w, h);

  // Cuadrícula sutil solo para Matemáticas (sin recuadros ni marcos artificiales)
  if (palette && palette.hasGrid) {
    const bx0 = 215, by0 = 695, bw = 675, bh = 470;
    tCtx.save();
    tCtx.strokeStyle = palette.gridColor || "rgba(59, 130, 246, 0.16)";
    tCtx.lineWidth = 1.5;
    for (let gy = by0 + 20; gy < by0 + bh; gy += 32) {
      tCtx.beginPath();
      tCtx.moveTo(bx0, gy);
      tCtx.lineTo(bx0 + bw, gy);
      tCtx.stroke();
    }
    for (let gx = bx0 + 20; gx < bx0 + bw; gx += 32) {
      tCtx.beginPath();
      tCtx.moveTo(gx, by0);
      tCtx.lineTo(gx, by0 + bh);
      tCtx.stroke();
    }
    tCtx.restore();
  }

  // 2. Logo oficial "La Profe Rochi" en la pared superior (centrado en x=540, y=255)
  const cx = w / 2;
  const cy = 255;
  const size = 330;
  if (logoProfeRochi && logoProfeRochi.complete && logoProfeRochi.naturalWidth > 0) {
    tCtx.save();
    tCtx.translate(cx, cy);
    tCtx.save();
    tCtx.shadowColor = "rgba(0, 0, 0, 0.45)";
    tCtx.shadowBlur = 24;
    tCtx.shadowOffsetY = 10;
    tCtx.drawImage(logoProfeRochi, -size / 2, -size / 2, size, size);
    tCtx.restore();
    tCtx.drawImage(logoProfeRochi, -size / 2, -size / 2, size, size);
    tCtx.restore();
  }

  // 3. Banner superior con el Título del Tema y Badge temático
  const lessonTitle = getLessonTitle();
  const bannerFontSize = state.bannerTitleFontSize || Math.round((state.titleFontSize || 66) * 0.68);
  const bannerY = 465;

  tCtx.save();
  tCtx.font = `900 ${bannerFontSize}px 'Inter', sans-serif`;
  const textW = tCtx.measureText(lessonTitle).width;
  const bannerW = Math.min(960, Math.max(480, textW + 80));
  const bannerH = Math.max(68, bannerFontSize + 32);

  tCtx.translate(cx, bannerY);
  tCtx.save();
  tCtx.shadowColor = "rgba(0, 0, 0, 0.45)";
  tCtx.shadowBlur = 20;
  tCtx.shadowOffsetY = 8;
  const grad = tCtx.createLinearGradient(-bannerW / 2, 0, bannerW / 2, 0);
  grad.addColorStop(0, palette.bannerGrad[0]);
  grad.addColorStop(0.5, palette.bannerGrad[1]);
  grad.addColorStop(1, palette.bannerGrad[2]);
  tCtx.fillStyle = grad;
  tCtx.beginPath();
  tCtx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 18);
  tCtx.fill();
  tCtx.restore();

  // Borde temático marcado
  tCtx.lineWidth = 4;
  tCtx.strokeStyle = palette.bannerBorder;
  tCtx.beginPath();
  tCtx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 18);
  tCtx.stroke();

  // Etiqueta distintiva de Asignatura (Badge temático para el Feed)
  tCtx.font = "bold 14px 'Inter', sans-serif";
  const badgeLabel = `${palette.badgeIcon} ${palette.badgeName}`;
  const badgeTextW = tCtx.measureText(badgeLabel).width;
  const tagW = Math.max(160, badgeTextW + 28);
  const tagH = 26;
  tCtx.fillStyle = palette.badgeBg;
  tCtx.beginPath();
  tCtx.roundRect(-tagW / 2, -bannerH / 2 - 13, tagW, tagH, 8);
  tCtx.fill();
  tCtx.fillStyle = "#ffffff";
  tCtx.textAlign = "center";
  tCtx.textBaseline = "middle";
  tCtx.fillText(badgeLabel, 0, -bannerH / 2);

  // Texto del título con tamaño configurable
  tCtx.font = `900 ${bannerFontSize}px 'Inter', sans-serif`;
  tCtx.fillStyle = palette.bannerTextColor;
  tCtx.textAlign = "center";
  tCtx.textBaseline = "middle";
  tCtx.fillText(lessonTitle, 0, 4);
  tCtx.restore();

  // 3b. Texto escrito en la pizarra en la portada
  const boardText = lessonTitle;
  if (boardText) {
    tCtx.save();
    let bFontSize = 52;
    tCtx.font = `bold ${bFontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
    let bTextW = tCtx.measureText(boardText).width;
    const maxBW = 400;
    if (bTextW > maxBW) {
      bFontSize = Math.max(32, Math.floor(bFontSize * (maxBW / bTextW)));
      tCtx.font = `bold ${bFontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
      bTextW = tCtx.measureText(boardText).width;
    }
    const bStartX = 250;
    const bStartY = 880;

    tCtx.fillStyle = palette.accentInk || "#1d4ed8";
    tCtx.textAlign = "left";
    tCtx.fillText(boardText, bStartX, bStartY);
    tCtx.restore();
  }

  // 4. Pose Ultra Sensual y Glamurosa de La Profe Rochi (Cuerpo completo, curvas de reloj de arena, escote, tacones y mirada seductora)
  let sensualImg = bellumSprites.sensualCover;
  if (!sensualImg || !sensualImg.complete || sensualImg.naturalWidth === 0) {
    sensualImg = (bellumSprites.turn && (bellumSprites.turn[1] || bellumSprites.turn[0])) || (bellumSprites.talk && bellumSprites.talk[0]);
  }

  if (sensualImg && sensualImg.complete && sensualImg.naturalWidth > 0) {
    const targetH = 1200; // Gran tamaño protagonista para cautivar en el feed
    const targetW = (sensualImg.naturalWidth / sensualImg.naturalHeight) * targetH;
    const teacherX = w * 0.61; // 660px - elegante y visible frente a la pizarra
    const teacherY = 1790;     // Pies apoyados con firmeza en el suelo
    const drawX = teacherX - targetW / 2;
    const drawY = teacherY - targetH;

    tCtx.save();
    tCtx.save();
    tCtx.shadowColor = "rgba(15, 23, 42, 0.40)";
    tCtx.shadowBlur = 30;
    tCtx.shadowOffsetX = 12;
    tCtx.shadowOffsetY = 16;
    tCtx.drawImage(sensualImg, drawX, drawY, targetW, targetH);
    tCtx.restore();

    // Dibujar la figura con máxima resolución y curvas definidas
    tCtx.drawImage(sensualImg, drawX, drawY, targetW, targetH);
    tCtx.restore();
  }
}

function downloadThumbnailCover() {
  try {
    updateStatus("📸 Generando portada sensual HD...");
    const offCanvas = document.createElement("canvas");
    offCanvas.width = canvas.width || 1080;
    offCanvas.height = canvas.height || 1920;
    renderSensualCover(offCanvas);

    offCanvas.toBlob(async (blob) => {
      if (!blob) {
        // Fallback rápido si toBlob no responde
        const dataUrl = offCanvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `portada_sensual_${getLessonTitle().toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        updateStatus("📸 ¡Portada HD guardada con éxito!");
        return;
      }
      const filename = `portada_sensual_${getLessonTitle().toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`;
      await downloadBlob(blob, filename);
      updateStatus("📸 ¡Portada HD guardada con éxito!");
    }, "image/png");
  } catch (err) {
    console.error("Error al guardar miniatura de portada:", err);
    alert("No se pudo generar la portada: " + err.message);
  }
}

function initTopicsSelector() {
  const select = document.getElementById("selectRaeTopic");
  if (!select) return;

  const topics = window.RAE_TOPICS || window.PROFE_TOPICS || [];
  if (!topics || topics.length === 0) {
    if (!window._initTopicsRetryCount) window._initTopicsRetryCount = 0;
    window._initTopicsRetryCount++;

    // En Coolify, si la red retrasa el script o hay desincronización de caché, descargarlo directamente
    if (window._initTopicsRetryCount === 6 && !window._fetchingTopicsScript) {
      window._fetchingTopicsScript = true;
      fetch("rae_topics.js?t=" + Date.now())
        .then(res => res.text())
        .then(code => {
          try {
            eval(code);
            initTopicsSelector();
          } catch (e) {
            console.error("Error al evaluar rae_topics.js dinámico:", e);
          }
        })
        .catch(err => console.error("Error al hacer fetch dinámico de rae_topics.js:", err));
    }

    if (window._initTopicsRetryCount < 100) {
      setTimeout(initTopicsSelector, 50);
    }
    return;
  }

  // Si ya tiene más de 5 opciones (está poblado con las 60 lecciones), no duplicar
  if (select.options.length > 5 && select.dataset.populated === "true") return;
  select.dataset.populated = "true";

  const groups = {};
  topics.forEach(t => {
    const cat = t.category || "General";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(t);
  });

  select.innerHTML = '<option value="" disabled selected>👉 Selecciona un tema de la lista...</option>';

  for (const [catName, catTopics] of Object.entries(groups)) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = `📚 ${catName}`;
    catTopics.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.icon || "✍️"} ${t.name} - ${t.summary || ""}`;
      optgroup.appendChild(opt);
    });
    select.appendChild(optgroup);
  }

  if (!select.dataset.bound) {
    select.dataset.bound = "true";
    select.addEventListener("change", (e) => {
      if (e.target.value) loadTopicLesson(e.target.value);
    });
    select.addEventListener("focus", () => {
      if (select.options.length <= 1) initTopicsSelector();
    });
    select.addEventListener("pointerdown", () => {
      if (select.options.length <= 1) initTopicsSelector();
    });
  }

  const btnLoad = document.getElementById("btnLoadRaeTopic");
  if (btnLoad && !btnLoad.dataset.bound) {
    btnLoad.dataset.bound = "true";
    btnLoad.addEventListener("click", () => {
      if (select.value) {
        loadTopicLesson(select.value);
      } else {
        alert("Por favor selecciona un tema de la lista primero.");
      }
    });
  }

  const btnRandom = document.getElementById("btnRandomRaeTopic");
  if (btnRandom && !btnRandom.dataset.bound) {
    btnRandom.dataset.bound = "true";
    btnRandom.addEventListener("click", () => {
      const rand = topics[Math.floor(Math.random() * topics.length)];
      if (rand) {
        select.value = rand.id;
        loadTopicLesson(rand.id);
      }
    });
  }

  setupYoutubeCopyButtons();
  if (topics.length > 0) {
    updateYoutubeCopy(topics[0]);
  }
}

// Exponer en window y escuchar evento load para máxima fiabilidad
window.initTopicsSelector = initTopicsSelector;
window.addEventListener("load", () => {
  initTopicsSelector();
});

function generateTopicTags(topic, steps) {
  // Si el usuario especificó etiquetas manuales en un guion pegado, se respetan
  if (state.customTags && state.customTags.trim().length > 0) {
    let custom = state.customTags.trim();
    if (!/profe\s+rochi/i.test(custom)) custom = "profe rochi, " + custom;
    if (!/profe\s+monica/i.test(custom)) custom = custom.replace(/profe\s+rochi,?\s*/i, "profe rochi, profe monica, ");
    return custom;
  }

  const tags = [];

  // 1. REGLA OBLIGATORIA (Solicitado expresamente por el usuario):
  // "profe rochi, profe monica" SIEMPRE de primero
  tags.push("profe rochi", "profe monica");

  // 2. Marca personal y canal educativo
  tags.push("la profe rochi", "profesora rochi", "educacion", "clases online");

  // 3. Extracción de palabras clave del título del tema
  const titleText = topic ? topic.name : getLessonTitle();
  const cleanTitle = (titleText || "")
    .replace(/[¿?¡!]/g, "")
    .trim()
    .toLowerCase();

  if (cleanTitle) {
    tags.push(cleanTitle);

    // Si tiene " o " (ej: "¿ay, hay o ahí?", "¿haiga o haya?", "b o v")
    if (cleanTitle.includes(" o ")) {
      const parts = cleanTitle.split(/\s+o\s+/);
      parts.forEach(p => {
        const item = p.trim();
        if (item && item.length > 1) tags.push(item);
      });
      if (parts.length >= 2) {
        tags.push(`diferencia entre ${parts.join(" y ")}`);
        tags.push(`como se escribe ${parts.join(" o ")}`);
      }
    }

    // Palabras compuestas
    const words = cleanTitle.split(/[\s,]+/).filter(w => w.length > 2 && !["los", "las", "del", "con", "por", "que", "una", "uno"].includes(w));
    if (words.length >= 2 && words.length <= 4) {
      tags.push(words.join(" "));
    }
  }

  // 4. Categoría y términos pedagógicos afines
  const cat = (topic && topic.category ? topic.category : "").toLowerCase();
  if (cat.includes("ortograf") || cat.includes("rae") || cat.includes("errores") || cat.includes("lengua") || !cat) {
    tags.push(
      "ortografia",
      "rae",
      "lengua castellana",
      "aprender español",
      "reglas de ortografia",
      "español correcto",
      "dudas frecuentes",
      "gramatica",
      "como escribir bien",
      "trucos de ortografia",
      "errores comunes",
      "un libro lleno de errores",
      "profe de español",
      "palabras dudosas"
    );
  } else if (cat.includes("matem")) {
    tags.push("matematicas", "trucos de matematicas", "aprender matematicas", "profe de matematicas", "calculo mental", "algebra");
  } else if (cat.includes("ciencias") || cat.includes("naturales")) {
    tags.push("ciencias naturales", "biologia", "aprender ciencias", "curiosidades cientificas", "experimentos");
  } else if (cat.includes("sociales") || cat.includes("historia")) {
    tags.push("ciencias sociales", "historia", "geografia", "cultura general");
  } else if (cat.includes("ingl")) {
    tags.push("ingles facil", "aprender ingles", "ingles desde cero", "pronunciacion en ingles");
  }

  // 5. Palabras clave desde las palabras escritas en la pizarra
  const currentSteps = steps || (state && state.steps) || (topic ? topic.steps : []);
  if (Array.isArray(currentSteps)) {
    currentSteps.forEach(s => {
      if (s.text && s.target !== "title") {
        const parts = s.text.replace(/[¿?¡!=:;]/g, " ").split(/\||\n/);
        parts.forEach(p => {
          const item = p.trim().toLowerCase();
          if (item.length > 2 && item.length < 25 && !item.includes("ejemplo") && !item.includes("espero") && !item.includes("recuerda")) {
            tags.push(item);
          }
        });
      }
    });
  }

  // 6. Formatos y etiquetas virales de alto alcance
  tags.push("shorts", "reels", "tiktok educativo", "aprende en tiktok", "viral", "whiteboard animation");

  // 7. Deduplicar manteniendo estrictamente "profe rochi, profe monica" al inicio
  const seen = new Set();
  const result = [];
  result.push("profe rochi", "profe monica");
  seen.add("profe rochi");
  seen.add("profe monica");

  tags.forEach(t => {
    if (!t) return;
    const clean = t.trim().toLowerCase().replace(/\s+/g, " ");
    if (clean.length > 1 && !seen.has(clean)) {
      seen.add(clean);
      result.push(clean);
    }
  });

  return result.join(", ");
}

function exportCurrentScriptWithTags() {
  const lines = [];
  const title = getLessonTitle();
  lines.push(`TÍTULO: ${title}`);
  lines.push("");

  const topics = window.RAE_TOPICS || window.PROFE_TOPICS || [];
  const currentTopic = topics.find(t => t.name === title || t.id === (state.currentTopicId || ""));

  (state.steps || []).forEach((s, idx) => {
    if (s.target === "title" && idx === 0) return;
    if (s.action === "clear") {
      lines.push("ACCION: BORRAR PIZARRA");
    }
    if (s.speech && s.speech.trim()) {
      lines.push(`HABLA: ${s.speech.trim()}`);
    }
    if (s.text && s.text.trim()) {
      lines.push(`PIZARRA: ${s.text.trim()}`);
    }
    lines.push("");
  });

  const tags = generateTopicTags(currentTopic, state.steps);
  lines.push(`ETIQUETAS: ${tags}`);

  return lines.join("\n");
}

function updateYoutubeCopy(topic) {
  const ytTitleInput = document.getElementById("ytCopyTitle");
  const ytDescInput = document.getElementById("ytCopyDesc");
  const ytTagsInput = document.getElementById("ytCopyTags");
  if (!ytTitleInput || !ytDescInput) return;

  const currentTopic = topic || (window.RAE_TOPICS || []).find(t => t.id === state.currentTopicId) || null;
  const titleText = currentTopic ? currentTopic.name : getLessonTitle();
  const summaryText = currentTopic ? (currentTopic.summary || "") : "Explicación interactiva en pizarra con La Profe Rochi.";
  const categoryText = currentTopic ? (currentTopic.category || "Educación") : "Educación";

  // 1. Título Viral optimizado para YouTube / Shorts / Reels / TikTok
  const cleanTitle = titleText.replace(/^¿/, "").replace(/\?$/, "").trim();
  const viralTitle = `🔥 ${titleText} ¡Aprende la regla en 1 minuto! | La Profe Rochi 🎓 #Shorts`;

  // 2. Extraer puntos clave de la pizarra
  const keyPoints = [];
  if (state.steps && state.steps.length > 0) {
    state.steps.forEach(s => {
      if (s.text && s.text.trim().length > 0 && s.target !== "title") {
        keyPoints.push(`✍️ En la pizarra: "${s.text.trim()}"`);
      }
    });
  }
  const keyPointsStr = keyPoints.length > 0 
    ? keyPoints.join("\n") 
    : `✍️ Regla explicada paso a paso en la pizarra interactiva.`;

  // 3. Generar Etiquetas dinámicas separadas por coma
  const tagsString = generateTopicTags(currentTopic, state.steps);

  // 4. Descripción completa profesional para YouTube
  const viralDescription = `¿Tienes dudas con "${cleanTitle}"? ¡En esta clase rápida de 1 minuto, La Profe Rochi te lo explica de forma súper sencilla y entretenida en la pizarra animada!

📚 REGLA RÁPIDA:
${summaryText}

🎯 PUNTOS CLAVE VISTOS EN LA PIZARRA:
${keyPointsStr}

🔔 ¡Suscríbete al canal de La Profe Rochi para no perderte ninguna lección de ortografía, matemáticas, ciencias y curiosidades!
💬 Déjame en los comentarios: ¿qué otro tema te gustaría que explique en la pizarra?
👍 Dale like y comparte con alguien a quien le sirva este video.

----------------------------------------
📌 Asignatura: ${categoryText}
#LaProfeRochi #Educacion #AprendeEnTikTok #Shorts #Reels #WhiteboardAnimation #ProfePizarra #ClasesOnline #RAE

----------------------------------------
🏷️ ETIQUETAS / TAGS (Copia y pega en YouTube / TikTok):
${tagsString}`;

  ytTitleInput.value = viralTitle;
  ytDescInput.value = viralDescription;
  if (ytTagsInput) {
    ytTagsInput.value = tagsString;
  }
}

function setupYoutubeCopyButtons() {
  const btnCopyAll = document.getElementById("btnCopyAllYoutube");
  const btnCopyTitle = document.getElementById("btnCopyYtTitle");
  const btnCopyDesc = document.getElementById("btnCopyYtDesc");
  const btnCopyTags = document.getElementById("btnCopyYtTags");
  const btnCopyFullScript = document.getElementById("btnCopyFullScript");
  const btnExportScriptToPanel = document.getElementById("btnExportScriptToPanel");
  const ytTitleInput = document.getElementById("ytCopyTitle");
  const ytDescInput = document.getElementById("ytCopyDesc");
  const ytTagsInput = document.getElementById("ytCopyTags");

  const copyText = (text, msg) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        updateStatus(msg);
        alert(msg);
      }).catch(() => fallbackCopy(text, msg));
    } else {
      fallbackCopy(text, msg);
    }
  };

  const fallbackCopy = (text, msg) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    updateStatus(msg);
    alert(msg);
  };

  if (btnCopyAll) {
    btnCopyAll.addEventListener("click", () => {
      const title = ytTitleInput ? ytTitleInput.value : "";
      const desc = ytDescInput ? ytDescInput.value : "";
      const tags = ytTagsInput ? ytTagsInput.value : "";
      const full = `📌 TÍTULO:\n${title}\n\n📝 DESCRIPCIÓN:\n${desc}\n\n🏷️ ETIQUETAS:\n${tags}`;
      copyText(full, "✅ ¡Título, Descripción y Etiquetas completas para YouTube copiados al portapapeles!");
    });
  }
  if (btnCopyTitle) {
    btnCopyTitle.addEventListener("click", () => {
      copyText(ytTitleInput ? ytTitleInput.value : "", "✅ ¡Título de YouTube copiado al portapapeles!");
    });
  }
  if (btnCopyDesc) {
    btnCopyDesc.addEventListener("click", () => {
      copyText(ytDescInput ? ytDescInput.value : "", "✅ ¡Descripción de YouTube copiada al portapapeles!");
    });
  }
  if (btnCopyTags) {
    btnCopyTags.addEventListener("click", () => {
      copyText(ytTagsInput ? ytTagsInput.value : "", "✅ ¡Etiquetas copiadas al portapapeles (separadas por coma)!");
    });
  }
  if (btnCopyFullScript) {
    btnCopyFullScript.addEventListener("click", () => {
      const script = exportCurrentScriptWithTags();
      copyText(script, "✅ ¡Guion completo con pasos y etiquetas copiado al portapapeles!");
    });
  }
  if (btnExportScriptToPanel) {
    btnExportScriptToPanel.addEventListener("click", () => {
      const rawScriptText = document.getElementById("rawScriptText");
      if (rawScriptText) {
        rawScriptText.value = exportCurrentScriptWithTags();
        updateStatus("📋 Guion actual con etiquetas cargado en el editor.");
      }
    });
  }
}

function loadTopicLesson(topicId) {
  const topics = window.RAE_TOPICS || window.PROFE_TOPICS || [];
  const topic = topics.find(t => t.id === topicId);
  if (!topic) return;

  // 1. Limpiar completamente audio previo, timers y caché para que nunca se mezcle con el tema anterior
  stopAndResetAllAudio();

  state.currentTopicId = topicId;
  state.customTags = null;

  // 2. Cargar pasos limpios sin timestamps residuales
  state.steps = JSON.parse(JSON.stringify(topic.steps));
  state.steps.forEach(s => {
    s.progress = 0;
    delete s.startTime;
    delete s.speechEndTime;
  });
  renderStepsUI();

  // Actualizar automáticamente el Copy de YouTube con este tema
  updateYoutubeCopy(topic);

  // Actualizar badge de Asignatura activa si existe en la UI
  const badgeActive = document.getElementById("activeSubjectBadge");
  const pal = getCurrentSubjectPalette();
  if (badgeActive && pal) {
    badgeActive.textContent = `${pal.badgeIcon} ${pal.badgeName}`;
    badgeActive.style.background = pal.badgeBg;
  }

  updateStatus(`✅ ¡Lección cargada: "${topic.name}" (${pal ? pal.name : ''})! Haz clic en '▶ Generar y Reproducir'.`);
}

window.removeStep = (idx) => {
  if (state.steps.length <= 1) return;
  state.steps.splice(idx, 1);
  renderStepsUI();
  updateYoutubeCopy();
};

window.updateStepSpeech = (idx, val) => {
  state.steps[idx].speech = val;
  updateYoutubeCopy();
};
window.updateStepAction = (idx, val) => {
  state.steps[idx].action = val;
  updateYoutubeCopy();
};
window.updateStepText = (idx, val) => {
  state.steps[idx].text = val;
  updateYoutubeCopy();
};

/* =========================================================
   MÓDULO DE RETOS VIRALES & ACERTIJOS (ESTILO MEME / FACEBOOK / TIKTOK)
   Permite crear retos visuales con opciones A, B, C, D como en redes sociales
   ========================================================= */

function renderChallengeGraphic(targetCanvas, challenge, isVertical = false) {
  const tCtx = targetCanvas.getContext("2d");
  const w = targetCanvas.width;
  const h = targetCanvas.height;

  // 1. Marco de Madera Realista
  const bw = 46;
  tCtx.save();
  tCtx.fillStyle = "#8a5227";
  tCtx.fillRect(0, 0, w, h);

  // Vetas de madera
  tCtx.strokeStyle = "rgba(65, 32, 10, 0.35)";
  tCtx.lineWidth = 2.5;
  for (let i = 0; i < w; i += 24) {
    tCtx.beginPath();
    tCtx.moveTo(i, 0);
    tCtx.lineTo(i + 14, bw);
    tCtx.moveTo(i, h - bw);
    tCtx.lineTo(i + 14, h);
    tCtx.stroke();
  }
  for (let j = 0; j < h; j += 24) {
    tCtx.beginPath();
    tCtx.moveTo(0, j);
    tCtx.lineTo(bw, j + 14);
    tCtx.moveTo(w - bw, j);
    tCtx.lineTo(w, j + 14);
    tCtx.stroke();
  }

  // 2. Fondo de Pizarra Verde Escolar
  const pGrad = tCtx.createLinearGradient(0, bw, 0, h - bw);
  pGrad.addColorStop(0, "#1a4635");
  pGrad.addColorStop(0.5, "#143a2b");
  pGrad.addColorStop(1, "#0f2d22");
  tCtx.fillStyle = pGrad;
  tCtx.fillRect(bw, bw, w - bw * 2, h - bw * 2);

  // Bisel interior oscuro
  tCtx.lineWidth = 8;
  tCtx.strokeStyle = "rgba(8, 24, 18, 0.85)";
  tCtx.strokeRect(bw, bw, w - bw * 2, h - bw * 2);

  // Garabatos tenues de tiza (fórmulas matemáticas escolares)
  tCtx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  tCtx.lineWidth = 2;
  tCtx.beginPath();
  tCtx.moveTo(110, isVertical ? 320 : 220);
  tCtx.lineTo(210, isVertical ? 320 : 220);
  tCtx.lineTo(210, isVertical ? 220 : 120);
  tCtx.closePath();
  tCtx.stroke();

  tCtx.beginPath();
  tCtx.arc(w - 140, isVertical ? 260 : 160, 44, 0, Math.PI * 2);
  tCtx.moveTo(w - 140, isVertical ? 260 : 160);
  tCtx.lineTo(w - 96, isVertical ? 260 : 160);
  tCtx.stroke();

  tCtx.font = "italic 22px 'Caveat', cursive";
  tCtx.fillStyle = "rgba(255, 255, 255, 0.08)";
  tCtx.fillText("a² + b² = c²", 120, isVertical ? 360 : 260);
  tCtx.fillText("E = mc²", w - 190, isVertical ? 340 : 240);

  // 3. Hashtag superior dorado
  tCtx.font = "bold 22px 'Inter', sans-serif";
  tCtx.fillStyle = "#fbbf24";
  tCtx.textAlign = "center";
  tCtx.fillText("#LaProfeRochi", w / 2, bw + (isVertical ? 48 : 34));

  // 4. Encabezado en letra cursiva estilo pizarra escolar (Caveat / Kalam)
  const whiteText = challenge.headerWhite || "Cuando te preguntan algo de";
  const highlightText = challenge.headerHighlight || "matemáticas";

  const topY1 = bw + (isVertical ? 110 : 80);
  const topY2 = bw + (isVertical ? 175 : 138);

  tCtx.save();
  tCtx.shadowColor = "rgba(0, 0, 0, 0.6)";
  tCtx.shadowBlur = 8;
  tCtx.font = `700 ${isVertical ? 58 : 52}px 'Caveat', 'Kalam', cursive, sans-serif`;
  tCtx.fillStyle = "#ffffff";
  tCtx.fillText(whiteText, w / 2, topY1);

  tCtx.font = `700 ${isVertical ? 66 : 58}px 'Caveat', 'Kalam', cursive, sans-serif`;
  tCtx.fillStyle = "#fef08a";
  tCtx.fillText(highlightText, w / 2, topY2);
  tCtx.restore();

  // 5. La Profe Rochi como protagonista en el centro
  let sensualImg = bellumSprites.sensualCover;
  if (!sensualImg || !sensualImg.complete || sensualImg.naturalWidth === 0) {
    sensualImg = (bellumSprites.talk && bellumSprites.talk[0]) || bellumSprites.base;
  }

  if (sensualImg && sensualImg.complete && sensualImg.naturalWidth > 0) {
    tCtx.save();
    tCtx.shadowColor = "rgba(0, 0, 0, 0.55)";
    tCtx.shadowBlur = 24;
    tCtx.shadowOffsetY = 12;

    if (isVertical) {
      const targetH = 820;
      const targetW = (sensualImg.naturalWidth / sensualImg.naturalHeight) * targetH;
      const drawX = (w - targetW) / 2;
      const drawY = 320;
      tCtx.drawImage(sensualImg, drawX, drawY, targetW, targetH);
    } else {
      const cropRatio = 0.60;
      const srcW = sensualImg.naturalWidth;
      const srcH = sensualImg.naturalHeight * cropRatio;
      const targetH = 435;
      const targetW = (srcW / srcH) * targetH;
      const drawX = (w - targetW) / 2;
      const drawY = 200;
      tCtx.drawImage(sensualImg, 0, 0, srcW, srcH, drawX, drawY, targetW, targetH);
    }
    tCtx.restore();
  }

  // 6. Tarjeta del Reto / Acertijo
  const cardMargin = 80;
  const cardW = w - cardMargin * 2;
  const cardY = isVertical ? 1180 : 640;
  const cardH = isVertical ? 220 : 165;

  tCtx.save();
  tCtx.shadowColor = "rgba(0, 0, 0, 0.4)";
  tCtx.shadowBlur = 16;
  tCtx.shadowOffsetY = 6;
  tCtx.fillStyle = "rgba(8, 34, 26, 0.92)";
  tCtx.beginPath();
  tCtx.roundRect(cardMargin, cardY, cardW, cardH, 18);
  tCtx.fill();
  tCtx.lineWidth = 3;
  tCtx.strokeStyle = "#34d399";
  tCtx.stroke();
  tCtx.restore();

  // Texto de la pregunta
  tCtx.save();
  tCtx.textAlign = "center";
  tCtx.textBaseline = "middle";
  const question = challenge.question || "";
  const qParts = question.split(/(¿[^?]+\?)/);
  let mainPart = question;
  let subPart = "";
  if (qParts.length > 1) {
    mainPart = qParts[0].trim();
    subPart = qParts[1].trim();
  }

  tCtx.font = "bold 26px 'Inter', sans-serif";
  tCtx.fillStyle = "#ffffff";
  if (mainPart.length > 55) {
    const words = mainPart.split(" ");
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    tCtx.fillText(line1, w / 2, cardY + (cardH * 0.28));
    tCtx.fillText(line2, w / 2, cardY + (cardH * 0.52));
  } else {
    tCtx.fillText(mainPart, w / 2, cardY + (cardH * 0.36));
  }

  if (subPart) {
    tCtx.font = "900 28px 'Inter', sans-serif";
    tCtx.fillStyle = "#fde047";
    tCtx.fillText(subPart, w / 2, cardY + (cardH * 0.78));
  }
  tCtx.restore();

  // 7. Las 4 Opciones A, B, C, D en dos columnas
  const opts = challenge.options || [
    { key: "A", text: "Opción A" },
    { key: "B", text: "Opción B" },
    { key: "C", text: "Opción C" },
    { key: "D", text: "Opción D" }
  ];

  const btnW = (cardW - 20) / 2;
  const btnH = isVertical ? 74 : 64;
  const btnRow1Y = isVertical ? 1425 : 822;
  const btnRow2Y = isVertical ? 1515 : 898;
  const col1X = cardMargin;
  const col2X = cardMargin + btnW + 20;

  const positions = [
    { x: col1X, y: btnRow1Y, opt: opts[0] },
    { x: col2X, y: btnRow1Y, opt: opts[1] },
    { x: col1X, y: btnRow2Y, opt: opts[2] },
    { x: col2X, y: btnRow2Y, opt: opts[3] }
  ];

  positions.forEach(pos => {
    if (!pos.opt) return;
    tCtx.save();
    tCtx.fillStyle = "rgba(10, 36, 28, 0.95)";
    tCtx.beginPath();
    tCtx.roundRect(pos.x, pos.y, btnW, btnH, 12);
    tCtx.fill();
    tCtx.lineWidth = 2.5;
    tCtx.strokeStyle = "#34d399";
    tCtx.stroke();

    tCtx.font = "900 26px 'Inter', sans-serif";
    tCtx.fillStyle = "#ef4444";
    tCtx.textAlign = "left";
    tCtx.textBaseline = "middle";
    tCtx.fillText(`${pos.opt.key}:`, pos.x + 20, pos.y + btnH / 2);

    tCtx.font = "bold 25px 'Inter', sans-serif";
    tCtx.fillStyle = "#ffffff";
    tCtx.fillText(pos.opt.text, pos.x + 60, pos.y + btnH / 2);
    tCtx.restore();
  });

  // 8. Pie de página
  tCtx.save();
  tCtx.font = "bold 22px 'Inter', sans-serif";
  tCtx.fillStyle = "#6ee7b7";
  tCtx.textAlign = "center";
  tCtx.textBaseline = "middle";
  tCtx.fillText("💡 Retos La Profe Rochi", w / 2, isVertical ? 1640 : (h - bw - 20));
  tCtx.restore();

  tCtx.restore();
}

function loadChallengeToVideo(challenge) {
  if (!challenge) return;
  state.isShowingChallengePreview = false;
  state.isShowingCoverPreview = false;
  stopAndResetAllAudio();
  resizeCanvas();

  const optA = (challenge.options && challenge.options[0] && challenge.options[0].text) || "Opción A";
  const optB = (challenge.options && challenge.options[1] && challenge.options[1].text) || "Opción B";
  const optC = (challenge.options && challenge.options[2] && challenge.options[2].text) || "Opción C";
  const optD = (challenge.options && challenge.options[3] && challenge.options[3].text) || "Opción D";

  const ctaSpeech = challenge.ctaSpeech || "¡Cuidado que tiene trampa! ¿Tú cuál dices que es la respuesta correcta? ¿A, B, C o D? ¡Déjamela en los comentarios y dime por qué, los leo a todos!";
  const ctaText = challenge.ctaText || "¿CUÁL ES LA CORRECTA?\n🤔 A, B, C o D\n👇 ¡DÉJALA EN LOS COMENTARIOS!";

  let steps = challenge.videoSteps;
  if (!steps || steps.length === 0) {
    steps = [
      {
        speech: `¡A ver si eres capaz de resolver este reto de ${challenge.category || 'lógica'}! Presta mucha atención a la pizarra.`,
        action: "write",
        text: `RETO: ${challenge.title ? challenge.title.toUpperCase() : 'DESAFÍO VIRAL'}`,
        target: "title",
        camera: "teacher"
      },
      {
        speech: `${challenge.question} Las opciones son: A, ${optA}. B, ${optB}. C, ${optC}. O D, ${optD}.`,
        action: "write",
        text: `A: ${optA} | B: ${optB}\nC: ${optC} | D: ${optD}`,
        target: "example1",
        camera: "board"
      },
      {
        speech: ctaSpeech,
        action: "highlight",
        text: ctaText,
        target: "result",
        camera: "board"
      }
    ];
  } else {
    // Si viene de un preset, asegurar siempre que el paso 3 NUNCA diga la respuesta
    steps[2].speech = ctaSpeech;
    steps[2].text = ctaText;
  }

  state.steps = JSON.parse(JSON.stringify(steps));
  state.steps.forEach(s => {
    s.progress = 0;
    delete s.startTime;
    delete s.speechEndTime;
  });
  renderStepsUI();

  updateYoutubeCopy({
    name: `Reto Viral: ${challenge.title || '¿Podrás resolverlo?'} 🤔 (A, B, C o D)`,
    summary: `${challenge.question}\n\nOpciones:\nA) ${optA}\nB) ${optB}\nC) ${optC}\nD) ${optD}\n\n¿Cuál crees que es la respuesta correcta? ¡Déjala en los comentarios y dime por qué! 👇\n\n#LaProfeRochi #RetoViral #Acertijo #Quiz #MenteActiva`,
    category: challenge.category || "Retos Virales"
  });

  if (window.setMobileTab) {
    window.setMobileTab("preview");
  } else if (window.switchSidebarTab) {
    window.switchSidebarTab("steps");
  }

  updateStatus(`🎯 ¡Reto cargado en video! Deja a la audiencia pensando con llamada a comentar. Haz clic en '▶ Generar y Reproducir'.`);
}

function initChallengesModule() {
  const select = document.getElementById("selectChallenge");
  if (!select) return;

  const challenges = window.CHALLENGES_DATA || [];
  if (challenges.length === 0) return;

  if (select.options.length <= 1) {
    select.innerHTML = '<option value="">🎯 Selecciona un reto viral...</option>';
    challenges.forEach((ch, idx) => {
      const opt = document.createElement("option");
      opt.value = ch.id;
      opt.textContent = `[${ch.category}] ${ch.title}`;
      if (idx === 0) opt.selected = true;
      select.appendChild(opt);
    });
  }

  const loadChallengeIntoForm = (ch) => {
    if (!ch) return;
    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    setVal("challengeHeaderWhite", ch.headerWhite || "Cuando te preguntan algo de");
    setVal("challengeHeaderHighlight", ch.headerHighlight || "matemáticas");
    setVal("challengeQuestion", ch.question || "");
    setVal("challengeOptA", (ch.options[0] && ch.options[0].text) || "");
    setVal("challengeOptB", (ch.options[1] && ch.options[1].text) || "");
    setVal("challengeOptC", (ch.options[2] && ch.options[2].text) || "");
    setVal("challengeOptD", (ch.options[3] && ch.options[3].text) || "");
    setVal("challengeCtaText", ch.ctaSpeech || "¡Cuidado que tiene trampa! ¿Tú cuál dices que es la correcta? ¿A, B, C o D? ¡Déjamela en los comentarios!");
    setVal("challengeCorrectOpt", ch.correct || "A");
    setVal("challengeExplanation", ch.explanation || "");
  };

  if (challenges[0]) loadChallengeIntoForm(challenges[0]);

  select.addEventListener("change", (e) => {
    const ch = challenges.find(c => c.id === e.target.value);
    if (ch) loadChallengeIntoForm(ch);
  });

  const btnRandom = document.getElementById("btnRandomChallenge");
  if (btnRandom && !btnRandom.dataset.bound) {
    btnRandom.dataset.bound = "true";
    btnRandom.addEventListener("click", () => {
      const rand = challenges[Math.floor(Math.random() * challenges.length)];
      if (rand) {
        select.value = rand.id;
        loadChallengeIntoForm(rand);
      }
    });
  }

  const getFormData = () => {
    const selectedCh = challenges.find(c => c.id === select.value) || {};
    const getVal = (id, fallback) => { const el = document.getElementById(id); return el ? el.value.trim() : fallback; };
    const customCta = getVal("challengeCtaText", "¡Cuidado que tiene trampa! ¿Tú cuál dices que es la correcta? ¿A, B, C o D? ¡Déjamela en los comentarios!");
    return {
      title: selectedCh.title || "Reto Viral",
      category: selectedCh.category || "Matemáticas",
      headerWhite: getVal("challengeHeaderWhite", "Cuando te preguntan algo de"),
      headerHighlight: getVal("challengeHeaderHighlight", "matemáticas"),
      question: getVal("challengeQuestion", "Acertijo matemático"),
      options: [
        { key: "A", text: getVal("challengeOptA", "Opción A") },
        { key: "B", text: getVal("challengeOptB", "Opción B") },
        { key: "C", text: getVal("challengeOptC", "Opción C") },
        { key: "D", text: getVal("challengeOptD", "Opción D") }
      ],
      ctaSpeech: customCta,
      ctaText: "¿CUÁL ES LA CORRECTA?\n🤔 A, B, C o D\n👇 ¡DÉJALA EN LOS COMENTARIOS!",
      videoSteps: null
    };
  };

  const btnSquare = document.getElementById("btnExportChallengeSquare");
  if (btnSquare && !btnSquare.dataset.bound) {
    btnSquare.dataset.bound = "true";
    btnSquare.addEventListener("click", () => {
      updateStatus("📸 Generando post cuadrado del reto (1:1)...");
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 1080;
      offCanvas.height = 1080;
      const ch = getFormData();
      renderChallengeGraphic(offCanvas, ch, false);
      offCanvas.toBlob(async (blob) => {
        if (!blob) return alert("Error al generar imagen");
        const filename = `reto_rochi_1x1_${Date.now()}.png`;
        await downloadBlob(blob, filename);
        updateStatus("📸 ¡Post de Reto 1:1 guardado con éxito!");
      }, "image/png");
    });
  }

  const btnVertical = document.getElementById("btnExportChallengeVertical");
  if (btnVertical && !btnVertical.dataset.bound) {
    btnVertical.dataset.bound = "true";
    btnVertical.addEventListener("click", () => {
      updateStatus("📱 Generando post vertical del reto (9:16)...");
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 1080;
      offCanvas.height = 1920;
      const ch = getFormData();
      renderChallengeGraphic(offCanvas, ch, true);
      offCanvas.toBlob(async (blob) => {
        if (!blob) return alert("Error al generar imagen");
        const filename = `reto_rochi_9x16_${Date.now()}.png`;
        await downloadBlob(blob, filename);
        updateStatus("📱 ¡Post de Reto 9:16 guardado con éxito!");
      }, "image/png");
    });
  }

  const btnLoadVideo = document.getElementById("btnLoadChallengeToVideo");
  if (btnLoadVideo && !btnLoadVideo.dataset.bound) {
    btnLoadVideo.dataset.bound = "true";
    btnLoadVideo.addEventListener("click", () => {
      const ch = getFormData();
      loadChallengeToVideo(ch);
    });
  }

  const btnPreview = document.getElementById("btnPreviewChallengeInCanvas");
  if (btnPreview && !btnPreview.dataset.bound) {
    btnPreview.dataset.bound = "true";
    btnPreview.addEventListener("click", () => {
      const ch = getFormData();
      state.isShowingChallengePreview = true;
      state.isShowingCoverPreview = false;
      stopAndResetAllAudio();
      if (window.setMobileTab) window.setMobileTab("preview");
      canvas.width = 1080;
      canvas.height = 1080;
      const badge = document.getElementById("badgeResolution");
      if (badge) badge.textContent = "1080 × 1080 (1:1 Reto Redes)";
      renderChallengeGraphic(canvas, ch, false);
      updateStatus("👁️ Visualizando Reto en Pizarra. Listo para exportar imagen o cargar en video.");
    });
  }
}
window.initChallengesModule = initChallengesModule;

function resizeCanvas() {
  if (state.format === "9:16") {
    canvas.width = 1080;
    canvas.height = 1920;
    document.getElementById("badgeResolution").textContent = "1080 × 1920 (9:16 TikTok)";
  } else {
    canvas.width = 1920;
    canvas.height = 1080;
    document.getElementById("badgeResolution").textContent = "1920 × 1080 (16:9 YouTube)";
  }

  if (threeCamera && threeRenderer && threeCanvas) {
    threeCanvas.width = canvas.width;
    threeCanvas.height = canvas.height;
    threeCamera.aspect = canvas.width / canvas.height;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(canvas.width, canvas.height);
  }
}

function updateStatus(msg) {
  statusNotice.textContent = msg;
}

function escapeHtml(str) {
  return (str || "").replace(/"/g, '&quot;');
}

/* AUDIO & SÍNTESIS CON EDGE-TTS Y MÚSICA SUAVE DE FONDO */
function initAudio() {
  if (!state.audioContext) {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  soundEngine.init(state.audioContext);

  // Inicializar reproductor de música suave y agradable de fondo
  if (!state.bgMusicAudio) {
    state.bgMusicAudio = new Audio("/assets/music_suave.mp3");
    state.bgMusicAudio.loop = true;
    state.bgMusicAudio.preload = "auto";
  }

  if (state.audioContext && !state.bgMusicSourceNode && state.bgMusicAudio) {
    try {
      state.bgMusicSourceNode = state.audioContext.createMediaElementSource(state.bgMusicAudio);
      state.bgMusicGainNode = state.audioContext.createGain();
      state.bgMusicGainNode.gain.setValueAtTime(state.musicVolume, state.audioContext.currentTime);
      state.bgMusicSourceNode.connect(state.bgMusicGainNode);
      state.bgMusicGainNode.connect(state.audioContext.destination);
    } catch (e) {
      console.warn("Conexión de música suave de fondo:", e);
    }
  }

  if (!state.audioElement) {
    state.audioElement = new Audio();
    state.audioElement.volume = state.voiceVolume;
    state.audioElement.addEventListener("timeupdate", () => {
      state.currentTime = state.audioElement.currentTime;
      updateTimeBadge();
    });
    state.audioElement.addEventListener("ended", () => {
      state.isPlaying = false;
      btnTogglePlay.textContent = "▶";
      soundEngine.updateWriting(false);
      pauseAllAudio();
      if (state.isRecording) {
        setTimeout(() => stopRecording(), 500);
      }
    });
  }
}

function playAllAudio() {
  if (state.audioContext && state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }
  if (state.audioElement) {
    state.audioElement.play().catch(e => console.warn("Audio voz play:", e));
  }
  if (state.bgMusicAudio && state.musicTrack !== "none" && state.musicVolume > 0.01) {
    state.bgMusicAudio.play().catch(e => console.warn("Música fondo play:", e));
  }
}

function pauseAllAudio() {
  if (state.audioElement) {
    state.audioElement.pause();
  }
  if (state.bgMusicAudio) {
    state.bgMusicAudio.pause();
  }
}

function restartAllAudio() {
  if (state.audioElement) {
    state.audioElement.currentTime = 0;
  }
  if (state.bgMusicAudio) {
    state.bgMusicAudio.currentTime = 0;
  }
  playAllAudio();
}

function stopAndResetAllAudio() {
  try {
    if (state.audioElement) {
      state.audioElement.pause();
      state.audioElement.removeAttribute("src");
      state.audioElement.load();
    }
  } catch (e) {}
  try {
    if (state.bgMusicAudio) {
      state.bgMusicAudio.pause();
      state.bgMusicAudio.currentTime = 0;
    }
  } catch (e) {}
  try {
    if (typeof soundEngine !== "undefined" && soundEngine && soundEngine.stopMarker) {
      soundEngine.stopMarker();
    }
  } catch (e) {}

  state.wordsTimeline = [];
  state.currentTime = 0;
  state.duration = 0;
  state.isPlaying = false;
  state.isRecording = false;
  state.isShowingCoverPreview = false;
  state.recordedChunks = [];

  if (typeof btnTogglePlay !== "undefined" && btnTogglePlay) btnTogglePlay.textContent = "▶";
  if (typeof badgeRecording !== "undefined" && badgeRecording) badgeRecording.style.display = "none";
  updateTimeBadge();
}

function updateTimeBadge() {
  const cur = formatTime(state.currentTime);
  const dur = formatTime(state.duration);
  badgeTime.textContent = `${cur} / ${dur}`;

  // Actualización en tiempo real del progreso de grabación (móvil y escritorio)
  if (state.isRecording) {
    const recTimer = document.getElementById("recBannerTimer");
    if (recTimer) recTimer.textContent = `● GRABANDO MP4: ${cur} / ${dur}`;
    if (btnMobileRecord) btnMobileRecord.textContent = `⏹ Grabando (${cur})`;
    if (btnRecord) btnRecord.textContent = `⏹ Grabando (${cur} / ${dur}) - Descarga automática`;
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

async function synthesizeLessonAudio() {
  if (!state.audioContext) {
    initAudio();
  }
  if (state.audioContext && state.audioContext.state === "suspended") {
    try { await state.audioContext.resume(); } catch (e) {}
  }

  const fullScript = state.steps.map(s => s.speech.trim()).join(" ... ");

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: fullScript,
      voice: state.voice,
      pitchHz: 0,
      ratePct: 2
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al sintetizar voz");
  }

  const data = await res.json();
  state.wordsTimeline = data.words || [];

  assignTimestampsToSteps();

  const audioBlob = b64toBlob(data.audioBase64, data.mimeType || "audio/mpeg");
  const audioUrl = URL.createObjectURL(audioBlob);
  state.audioElement.src = audioUrl;

  // Esperar a que el audio cargue completamente sus metadatos y buffer
  await new Promise((resolve) => {
    let resolved = false;
    const onReady = () => {
      if (!resolved) {
        resolved = true;
        state.audioElement.removeEventListener("canplaythrough", onReady);
        resolve();
      }
    };
    state.audioElement.addEventListener("canplaythrough", onReady);
    setTimeout(onReady, 500);
  });

  if (state.audioElement.duration && !isNaN(state.audioElement.duration)) {
    state.duration = Math.max(state.duration, state.audioElement.duration);
  }
}

async function generateAndPlay() {
  state.isShowingChallengePreview = false;
  state.isShowingCoverPreview = false;
  if (window.innerWidth <= 920 && window.setMobileTab) {
    window.setMobileTab("preview");
  }
  btnPlayPreview.disabled = true;
  updateStatus("🎙️ Sintetizando voz con Inteligencia Artificial...");

  try {
    await synthesizeLessonAudio();
    state.currentTime = 0;
    restartAllAudio();
    state.isPlaying = true;
    btnTogglePlay.textContent = "⏸";
    btnRecord.disabled = false;
    updateStatus("▶ Reproduciendo lección con música suave y pizarra interactiva.");
  } catch (err) {
    console.error(err);
    alert("Hubo un error: " + err.message);
    updateStatus("Error en la síntesis.");
  } finally {
    btnPlayPreview.disabled = false;
  }
}

function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

function assignTimestampsToSteps() {
  if (!state.wordsTimeline || state.wordsTimeline.length === 0) return;

  const totalWords = state.wordsTimeline.length;
  let currentWordIdx = 0;

  state.steps.forEach((step, idx) => {
    const stepWords = step.speech.trim().split(/\s+/).filter(w => w.length > 0);
    const stepWordCount = Math.max(1, stepWords.length);

    const startIdx = Math.min(currentWordIdx, totalWords - 1);
    const endIdx = Math.min(currentWordIdx + stepWordCount - 1, totalWords - 1);

    const startWord = state.wordsTimeline[startIdx];
    const endWord = state.wordsTimeline[endIdx];

    step.startWordIdx = startIdx;
    step.endWordIdx = endIdx;
    // Guardar el segmento de palabras exacto para subtítulos milimétricos (Karaoke)
    step.words = state.wordsTimeline.slice(startIdx, endIdx + 1);

    currentWordIdx += stepWordCount;

    // Tiempo de inicio del paso (cuando empieza la primera palabra)
    step.startTime = startWord ? startWord.start : (idx * 3);

    // Momento exacto en que termina de pronunciarse la última palabra hablada del paso
    step.speechEndTime = endWord ? (endWord.start + endWord.duration) : (step.startTime + 2.5);

    // El paso concluye cuando empieza la primera palabra del paso siguiente, o tras una pausa natural
    const nextStartWord = (currentWordIdx < totalWords) ? state.wordsTimeline[currentWordIdx] : null;
    if (nextStartWord) {
      step.endTime = nextStartWord.start;
    } else {
      step.endTime = endWord ? (endWord.start + endWord.duration + 0.5) : ((idx + 1) * 3);
    }
  });

  const lastWord = state.wordsTimeline[totalWords - 1];
  // Duración real garantizada: nunca se corta a los 10 segundos
  state.duration = lastWord ? (lastWord.start + lastWord.duration + 0.8) : 15;
}

function restartPlayback() {
  state.isShowingChallengePreview = false;
  state.isShowingCoverPreview = false;
  restartAllAudio();
  state.isPlaying = true;
  btnTogglePlay.textContent = "⏸";
}

function togglePausePlayback() {
  if (state.isPlaying) {
    pauseAllAudio();
    state.isPlaying = false;
    btnTogglePlay.textContent = "▶";
    soundEngine.updateWriting(false);
  } else {
    playAllAudio();
    state.isPlaying = true;
    btnTogglePlay.textContent = "⏸";
  }
}

function generateAiTopic() {
  const topic = aiTopicInput.value.trim();
  if (!topic) {
    alert("Por favor ingresa un tema educativo (ej: Reglas de la B y la V, Palabras Agudas, Fracciones).");
    return;
  }

  updateStatus(`💡 Generando lección interactiva para: "${topic}"...`);

  setTimeout(() => {
    const cleanTopic = topic.replace(/[¡!¿?]/g, "").trim();
    const upperTopic = cleanTopic.toUpperCase().slice(0, 24);

    // Heurísticas pedagógicas inteligentes según palabras clave del tema
    let ex1 = "Ejemplo 1";
    let ex2 = "Ejemplo 2";
    let expl1 = `Fíjate cómo aplicamos la regla fundamental en este primer caso.`;
    let expl2 = `Y mira cómo se mantiene la misma lógica en este segundo ejemplo.`;

    const lower = cleanTopic.toLowerCase();
    if (lower.includes("signo") || lower.includes("signos")) {
      ex1 = "(+) · (-) = (-)";
      ex2 = "(-) · (-) = (+)";
      expl1 = "Signos diferentes multiplicados siempre dan resultado negativo.";
      expl2 = "¡Y signos iguales multiplicados siempre dan resultado positivo!";
    } else if (lower.includes("aguda") || lower.includes("agudas")) {
      ex1 = "camión";
      ex2 = "compás";
      expl1 = "Lleva tilde en la O porque termina en la letra N.";
      expl2 = "¡Y compás lleva tilde porque termina en la letra S!";
    } else if (lower.includes("llana") || lower.includes("llanas") || lower.includes("grave")) {
      ex1 = "árbol";
      ex2 = "lápiz";
      expl1 = "Lleva tilde porque termina en L, es decir, no termina en N ni en S.";
      expl2 = "¡Y lápiz lleva tilde porque termina en la letra Z!";
    } else if (lower.includes("esdrújula") || lower.includes("esdrujula")) {
      ex1 = "música";
      ex2 = "pájaro";
      expl1 = "El acento está en la antepenúltima sílaba, por eso siempre lleva tilde.";
      expl2 = "¡Todas las palabras esdrújulas se acentúan sin excepción!";
    } else if (lower.includes("fraccion") || lower.includes("fracciones")) {
      ex1 = "1/2 + 1/4 = 3/4";
      ex2 = "2/4 = 1/2";
      expl1 = "Convertimos al mismo denominador para poder sumar fácilmente.";
      expl2 = "¡Y simplificamos dividiendo numerador y denominador entre dos!";
    } else if (lower.includes("b") && lower.includes("v")) {
      ex1 = "cantaba";
      ex2 = "iba";
      expl1 = "Las terminaciones del pretérito imperfecto en -aba van siempre con B.";
      expl2 = "¡Y los derivados del verbo ir también se escriben con B!";
    } else if (lower.includes("pitagoras") || lower.includes("pitágoras")) {
      ex1 = "a² + b² = c²";
      ex2 = "3² + 4² = 5²";
      expl1 = "La suma de los catetos al cuadrado equivale a la hipotenusa al cuadrado.";
      expl2 = "Fíjate: nueve más dieciséis es veinticinco. ¡Exacto!";
    } else if (lower.includes("fotosintesis") || lower.includes("fotosíntesis")) {
      ex1 = "CO₂ + Luz → O₂";
      ex2 = "Clorofila";
      expl1 = "Las plantas absorben dióxido de carbono y liberan oxígeno vital.";
      expl2 = "¡La clorofila es el pigmento verde encargado de atrapar la luz solar!";
    } else {
      const words = cleanTopic.split(/\s+/);
      ex1 = words.slice(0, 2).join(" ").slice(0, 20);
      ex2 = words.length > 2 ? words.slice(2, 4).join(" ").slice(0, 20) : "Regla Clave";
    }

    state.steps = [
      {
        speech: `¡Hola! Hoy aprenderás de forma súper fácil: ${cleanTopic}.`,
        action: "write",
        text: upperTopic,
        target: "title",
        camera: "board"
      },
      {
        speech: "Presta mucha atención a la pizarra para dominar este concepto en un minuto.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: expl1,
        action: "write",
        text: ex1,
        target: "example1",
        camera: "board"
      },
      {
        speech: "Observa con cuidado cómo se cumple la regla paso a paso.",
        action: "highlight",
        text: ex1,
        target: "example1",
        camera: "board"
      },
      {
        speech: expl2,
        action: "write",
        text: ex2,
        target: "example2",
        camera: "board"
      },
      {
        speech: `¿Tienes alguna duda sobre ${cleanTopic}? ¡Déjala aquí en los comentarios!`,
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ];

    renderStepsUI();
    updateStatus(`✅ ¡Lección para "${topic}" lista! Haz clic en '▶ Generar y Reproducir'.`);
  }, 300);
}

/* =========================================================
   SISTEMA DE RENDERIZADO VISUAL EN CANVAS (60 FPS)
   ========================================================= */

function renderLoop(time) {
  const w = canvas.width;
  const h = canvas.height;

  // Si está activa la vista previa estática del reto:
  if (state.isShowingChallengePreview) {
    requestAnimationFrame(renderLoop);
    return;
  }

  // Si está activa la vista previa de la portada sensual:
  if (state.isShowingCoverPreview) {
    renderSensualCover(canvas);
    requestAnimationFrame(renderLoop);
    return;
  }

  // Sincronización continua de alta precisión (60 FPS) entre audio y fotogramas visuales
  if (state.audioElement && !state.audioElement.paused) {
    state.currentTime = state.audioElement.currentTime;
    updateTimeBadge();
  }

  // Auto-finalización garantizada de la grabación cuando la lección llega al final exacto
  if (state.isRecording && state.duration > 4 && state.currentTime >= (state.duration - 0.2)) {
    stopRecording(true);
  }

  const currentStep = getCurrentStep();
  const cameraType = getEffectiveCamera(currentStep);

  // 1. Dibujar Fondo de la Pizarra
  drawWhiteboardBackground(w, h);

  // 1.5. Emblema Oficial del Canal ("La Profe Rochi") en la pared superior
  drawChannelLogo(w, h, time);

  // 2. Renderizar Contenido de la Pizarra y la Mano con Marcador
  drawBoardContent(w, h, currentStep, time);

  // 3. Renderizar Docente (Siempre presente: explicando al frente o escribiendo de espaldas)
  drawTeacher(w, h, cameraType, time, currentStep);

  // 4. Subtítulos dinámicos estilo TikTok
  drawViralCaptions(w, h, currentStep);

  requestAnimationFrame(renderLoop);
}

function getCurrentStep() {
  if (!state.steps || state.steps.length === 0) return null;
  const t = state.currentTime;

  for (let i = 0; i < state.steps.length; i++) {
    const s = state.steps[i];
    if (t >= (s.startTime || 0) && t < (s.endTime || 9999)) {
      const stepStart = s.startTime || 0;
      const stepEnd = s.endTime || (stepStart + 3);
      const stepDur = Math.max(0.1, stepEnd - stepStart);
      const speechEnd = s.speechEndTime || stepEnd;
      const speechDur = Math.max(0.1, speechEnd - stepStart);

      // Progreso 1:1 de la voz: va exactamente a la velocidad con que se pronuncian las palabras
      const speechProgress = Math.min(1.0, Math.max(0.0, (t - stepStart) / speechDur));

      // Progreso global del paso (incluyendo la pausa de lectura antes del siguiente)
      const overallProgress = Math.min(1.0, Math.max(0.0, (t - stepStart) / stepDur));

      return {
        ...s,
        index: i,
        progress: overallProgress,
        speechProgress: speechProgress,
        isSpeakingPhase: (t <= speechEnd + 0.1)
      };
    }
  }

  return {
    ...state.steps[state.steps.length - 1],
    index: state.steps.length - 1,
    progress: 1.0,
    speechProgress: 1.0,
    isSpeakingPhase: false
  };
}

function getEffectiveCamera(step) {
  if (state.cameraMode === "board_focus") return "board";
  if (state.cameraMode === "split") return "split";
  return step ? (step.camera || "board") : "teacher";
}

const bgClassroomV = new Image();
bgClassroomV.src = "/backgrounds/classroom_9_16.jpg";

const bgClassroomH = new Image();
bgClassroomH.src = "/backgrounds/classroom_16_9.jpg";

/* =========================================================
   EMBLEMA OFICIAL: "LA PROFE ROCHI" Y BANNER MINIATURA COVER
   ========================================================= */

const logoProfeRochi = new Image();
logoProfeRochi.src = "/assets/logo_profe_rochi.png";

function getLessonTitle() {
  const tStep = (state.steps && state.steps.find(s => s.target === "title" || (s.action === "write" && s.text)));
  if (tStep && tStep.text) return tStep.text.toUpperCase();
  return "CLASE CON LA PROFE ROCHI";
}

function drawChannelLogo(w, h, time) {
  // Solo se dibuja en formato vertical 9:16 donde está el espacio superior del aula
  if (state.format !== "9:16") return;

  const cx = w / 2; // 540 (centrado en la pared superior)
  const cy = 255;
  const size = 330;

  // Sutil flotación suave estilo caricatura
  const bobY = Math.sin(time * 0.002) * 3;

  if (logoProfeRochi.complete && logoProfeRochi.naturalWidth > 0) {
    ctx.save();
    ctx.translate(cx, cy + bobY);

    // Sombra suave en la pared morada del aula
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.drawImage(logoProfeRochi, -size / 2, -size / 2, size, size);
    ctx.restore();

    // Dibujar el logo oficial con sus bordes amarillos nítidos
    ctx.drawImage(logoProfeRochi, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  // BANNER DE MINIATURA VIRAL CON EL TÍTULO DEL TEMA (ZONA SUPERIOR PARA PORTADA)
  const lessonTitle = getLessonTitle();
  const bannerFontSize = state.bannerTitleFontSize || Math.round((state.titleFontSize || 66) * 0.68);
  const bannerY = 465 + bobY * 0.5;

  ctx.save();
  ctx.font = `900 ${bannerFontSize}px 'Inter', sans-serif`;
  const textW = ctx.measureText(lessonTitle).width;
  const bannerW = Math.min(960, Math.max(480, textW + 80));
  const bannerH = Math.max(68, bannerFontSize + 32);

  ctx.translate(cx, bannerY);

  const palette = getCurrentSubjectPalette();

  // Sombra del banner
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  // Fondo gradiente temático según asignatura
  const grad = ctx.createLinearGradient(-bannerW / 2, 0, bannerW / 2, 0);
  grad.addColorStop(0, palette.bannerGrad[0]);
  grad.addColorStop(0.5, palette.bannerGrad[1]);
  grad.addColorStop(1, palette.bannerGrad[2]);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 18);
  ctx.fill();
  ctx.restore();

  // Borde temático marcado
  ctx.lineWidth = 4;
  ctx.strokeStyle = palette.bannerBorder;
  ctx.beginPath();
  ctx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 18);
  ctx.stroke();

  // Mini etiqueta superior temática con Asignatura
  ctx.font = "bold 14px 'Inter', sans-serif";
  const badgeLabel = `${palette.badgeIcon} ${palette.badgeName}`;
  const badgeTextW = ctx.measureText(badgeLabel).width;
  const tagW = Math.max(160, badgeTextW + 28);
  const tagH = 26;
  ctx.fillStyle = palette.badgeBg;
  ctx.beginPath();
  ctx.roundRect(-tagW / 2, -bannerH / 2 - 13, tagW, tagH, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeLabel, 0, -bannerH / 2);

  // Texto del título
  ctx.font = `900 ${bannerFontSize}px 'Inter', sans-serif`;
  ctx.fillStyle = palette.bannerTextColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(lessonTitle, 0, 4);

  ctx.restore();
}

/* DIBUJAR RELOJ DE PARED EN VIVO CON LA HORA EXACTA Y SEGUNDERO EN MOVIMIENTO */
function drawLiveWallClock(targetCtx, w, h) {
  if (state.theme !== "classroom") return;

  const isLandscape = (w > h);
  // Coordenadas milimétricas exactas alineadas con el marco del reloj de pared
  const cx = isLandscape ? 217 : 160;
  const cy = isLandscape ? 176 : 160;
  const r = isLandscape ? 72 : 76;

  targetCtx.save();

  // 1. Esfera limpia del reloj (cubre manecillas estáticas y da fondo nítido)
  targetCtx.beginPath();
  targetCtx.arc(cx, cy, r, 0, Math.PI * 2);
  const dialGrad = targetCtx.createRadialGradient(cx - r * 0.25, cy - r * 0.25, r * 0.1, cx, cy, r);
  dialGrad.addColorStop(0, "#ffffff");
  dialGrad.addColorStop(1, "#fffcf0");
  targetCtx.fillStyle = dialGrad;
  targetCtx.fill();
  targetCtx.lineWidth = 3;
  targetCtx.strokeStyle = "#1e1e24";
  targetCtx.stroke();

  // 2. 12 marcas de las horas (3, 6, 9, 12 destacadas)
  for (let i = 0; i < 12; i++) {
    const ang = (i * Math.PI) / 6;
    const isMajor = (i % 3 === 0);
    const tickLen = isMajor ? 10 : 6;
    const rIn = r - 4 - tickLen;
    const rOut = r - 4;
    targetCtx.beginPath();
    targetCtx.moveTo(cx + Math.sin(ang) * rIn, cy - Math.cos(ang) * rIn);
    targetCtx.lineTo(cx + Math.sin(ang) * rOut, cy - Math.cos(ang) * rOut);
    targetCtx.strokeStyle = isMajor ? "#0f172a" : "#64748b";
    targetCtx.lineWidth = isMajor ? 3.5 : 2;
    targetCtx.lineCap = "round";
    targetCtx.stroke();
  }

  // 3. Hora real del momento exacto (avanza en tiempo real o en sincronía con el video)
  const now = new Date();
  const baseMs = now.getTime() + (state.isPlaying ? (state.currentTime * 1000) : 0);
  const d = new Date(baseMs);
  const hours = d.getHours() % 12;
  const minutes = d.getMinutes();
  const seconds = d.getSeconds() + d.getMilliseconds() / 1000;

  // 4. Manecilla de las Horas
  const hAng = ((hours + minutes / 60) * Math.PI) / 6;
  targetCtx.beginPath();
  targetCtx.moveTo(cx - Math.sin(hAng) * 7, cy + Math.cos(hAng) * 7);
  targetCtx.lineTo(cx + Math.sin(hAng) * (r * 0.52), cy - Math.cos(hAng) * (r * 0.52));
  targetCtx.strokeStyle = "#0f172a";
  targetCtx.lineWidth = 5;
  targetCtx.lineCap = "round";
  targetCtx.stroke();

  // 5. Manecilla de los Minutos
  const mAng = ((minutes + seconds / 60) * Math.PI) / 30;
  targetCtx.beginPath();
  targetCtx.moveTo(cx - Math.sin(mAng) * 9, cy + Math.cos(mAng) * 9);
  targetCtx.lineTo(cx + Math.sin(mAng) * (r * 0.75), cy - Math.cos(mAng) * (r * 0.75));
  targetCtx.strokeStyle = "#1e293b";
  targetCtx.lineWidth = 3.5;
  targetCtx.lineCap = "round";
  targetCtx.stroke();

  // 6. Segundero Dinámico (aguja roja continua que se mueve visiblemente)
  const sAng = (seconds * Math.PI) / 30;
  targetCtx.beginPath();
  targetCtx.moveTo(cx - Math.sin(sAng) * 14, cy + Math.cos(sAng) * 14);
  targetCtx.lineTo(cx + Math.sin(sAng) * (r * 0.84), cy - Math.cos(sAng) * (r * 0.84));
  targetCtx.strokeStyle = "#dc2626";
  targetCtx.lineWidth = 2;
  targetCtx.lineCap = "round";
  targetCtx.stroke();

  // 7. Eje central del reloj
  targetCtx.beginPath();
  targetCtx.arc(cx, cy, 4, 0, Math.PI * 2);
  targetCtx.fillStyle = "#dc2626";
  targetCtx.fill();
  targetCtx.beginPath();
  targetCtx.arc(cx, cy, 1.5, 0, Math.PI * 2);
  targetCtx.fillStyle = "#ffffff";
  targetCtx.fill();

  // 8. Reflejo de luz y cristal
  targetCtx.beginPath();
  targetCtx.arc(cx, cy, r - 4, -Math.PI * 0.78, -Math.PI * 0.22);
  targetCtx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  targetCtx.lineWidth = 3;
  targetCtx.stroke();

  targetCtx.restore();
}

/* 1. FONDO DE PIZARRA Y AULA */
function drawWhiteboardBackground(w, h) {
  // Fondo de Aula Ilustrada oficial (Pizarra con marco amarillo, reloj y pupitres)
  if (state.theme === "classroom") {
    const isLandscape = (w > h);
    const bg = isLandscape ? bgClassroomH : bgClassroomV;
    if (bg && bg.complete && bg.naturalWidth > 0) {
      ctx.drawImage(bg, 0, 0, w, h);
    } else {
      ctx.fillStyle = "#81399d";
      ctx.fillRect(0, 0, w, h);
    }

    // Aplicar paleta por materia en la pared del aula durante la reproducción
    const palette = getCurrentSubjectPalette();
    if (palette && palette.wallColor) {
      ctx.save();
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = palette.wallColor;
      ctx.fillRect(0, 0, w, 1340);
      ctx.restore();
    }

    // Reloj dinámico de pared en vivo
    drawLiveWallClock(ctx, w, h);

    // Cuadrícula sutil solo para Matemáticas (sin recuadros ni marcos artificiales)
    if (palette && palette.hasGrid) {
      const bx0 = 215, by0 = 695, bw = 675, bh = 470;
      ctx.save();
      ctx.strokeStyle = palette.gridColor || "rgba(59, 130, 246, 0.16)";
      ctx.lineWidth = 1.5;
      for (let gy = by0 + 20; gy < by0 + bh; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(bx0, gy);
        ctx.lineTo(bx0 + bw, gy);
        ctx.stroke();
      }
      for (let gx = bx0 + 20; gx < bx0 + bw; gx += 32) {
        ctx.beginPath();
        ctx.moveTo(gx, by0);
        ctx.lineTo(gx, by0 + bh);
        ctx.stroke();
      }
      ctx.restore();
    }
    return;
  }
  if (state.theme === "blackboard_green") {
    ctx.fillStyle = "#1e3d2f";
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 24;
    ctx.strokeStyle = "#8b5a2b";
    ctx.strokeRect(12, 12, w - 24, h - 24);
    return;
  }

  if (state.theme === "blackboard_dark") {
    ctx.fillStyle = "#1a1e24";
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#374151";
    ctx.strokeRect(10, 10, w - 20, h - 20);
    return;
  }

  // Pizarra Blanca Acrílica (La Profe Rochi)
  ctx.fillStyle = "#fafafa";
  ctx.fillRect(0, 0, w, h);

  // Cuadrícula sutil de pizarra de aula
  if (state.theme === "whiteboard_grid") {
    ctx.strokeStyle = "rgba(215, 225, 238, 0.55)";
    ctx.lineWidth = 1.6;
    const gridSize = 48;
    for (let x = 24; x < w - 24; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 24);
      ctx.lineTo(x, h - 24);
      ctx.stroke();
    }
    for (let y = 24; y < h - 24; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(w - 24, y);
      ctx.stroke();
    }
  }

  // Marco de aluminio anodizado
  ctx.lineWidth = 18;
  ctx.strokeStyle = "#cbd5e1";
  ctx.strokeRect(9, 9, w - 18, h - 18);

  // Reflejo realista de luz superior en el acrílico
  const grad = ctx.createLinearGradient(0, 0, 0, 260);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(20, 20, w - 40, 240);
}

/* 2. CONTENIDO ESCRITO Y ANIMACIÓN DE LA MANO */
function drawBoardContent(w, h, currentStep, time) {
  if (!state.steps || state.steps.length === 0) return;

  const currentIdx = currentStep ? currentStep.index : 0;
  const palette = getCurrentSubjectPalette();
  const isDark = state.theme.includes("blackboard");
  const mainInk = isDark ? "#ffffff" : palette.mainInk;
  const blueInk = isDark ? "#60a5fa" : palette.accentInk;
  const redInk = isDark ? "#f87171" : palette.redInk;

  const isClassroom = (state.theme === "classroom");
  const startY = isClassroom ? 760 : (h * 0.18);
  const rowHeight = isClassroom ? 115 : (h * 0.115);

  let handTargetX = null;
  let handTargetY = null;
  let handAngle = -0.15;
  let isWritingNow = false;

  const t = state.currentTime;

  // 1. TÍTULO DE LA LECCIÓN (FILA 0): Siempre visible y destacado en la cabecera de la pizarra
  const titleStep = state.steps.find(s => s.target === "title") || state.steps[0];
  if (titleStep && titleStep.action === "write") {
    const isCurrentTitle = (currentIdx === 0);
    const fullTitle = titleStep.text || "";
    const stepStart = titleStep.startTime || 0;
    const speechEnd = titleStep.speechEndTime || (stepStart + 2.5);
    const speechDur = Math.max(0.8, speechEnd - stepStart);

    // Duración de escritura ágil y natural (máx 50% del paso o ~10 letras por segundo)
    const writeDurTitle = Math.min(speechDur * 0.50, Math.max(0.8, fullTitle.length * 0.08));
    const elapsedTitle = Math.max(0, t - stepStart);
    const isTitleWriting = isCurrentTitle && (elapsedTitle < writeDurTitle) && state.isPlaying;
    const writeProgTitle = isCurrentTitle ? Math.min(1.0, elapsedTitle / Math.max(0.01, writeDurTitle)) : 1.0;

    const charCount = Math.floor(fullTitle.length * writeProgTitle);
    const textToShow = fullTitle.substring(0, charCount);

    let baseFontSize = state.boardTitleFontSize || state.titleFontSize || 66;
    let fontSize = baseFontSize;
    ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
    let totalW = ctx.measureText(fullTitle).width;
    const maxTitleW = 760;
    if (totalW > maxTitleW) {
      fontSize = Math.max(34, Math.floor(baseFontSize * (maxTitleW / totalW)));
      ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
      totalW = ctx.measureText(fullTitle).width;
    }
    const startX = (w / 2) - (totalW / 2);
    ctx.fillStyle = blueInk;
    ctx.textAlign = "left";
    ctx.fillText(textToShow, startX, startY);

    // Escribe activamente solo durante la fase ágil de escritura
    if (isTitleWriting && fullTitle.length > 0) {
      const textW = ctx.measureText(textToShow).width;
      handTargetX = startX + textW;
      handTargetY = startY - 14;
      handAngle = -0.12;
      isWritingNow = true;
    }
  }

  // Si estamos en el paso 0 (título), la pizarra en el cuerpo queda limpia
  if (currentIdx === 0) {
    soundEngine.updateWriting(isWritingNow, time);
    state.lastHandX = handTargetX;
    state.lastHandY = handTargetY;
    state.isWritingNow = isWritingNow;
    return;
  }

  // 2. ACCIÓN EXPLÍCITA DE BORRADO DE PIZARRA (clear)
  if (currentStep && currentStep.action === "clear") {
    const s = currentStep;
    const stepStart = s.startTime || 0;
    const speechEnd = s.speechEndTime || (stepStart + 2.0);
    const wipeDur = Math.max(0.6, speechEnd - stepStart);
    const elapsed = Math.max(0, t - stepStart);
    const wipeProg = Math.min(1.0, elapsed / wipeDur);

    drawEraserWipe(ctx, w, startY + 60, startY + 340, wipeProg);

    if (state.isPlaying && wipeProg < 1.0) {
      handTargetX = (w * 0.22) + (w * 0.56) * wipeProg;
      handTargetY = startY + 180 + Math.sin(wipeProg * Math.PI * 4) * 40;
      handAngle = 0;
      isWritingNow = true;
    }
    soundEngine.updateWriting(isWritingNow, time);
    state.lastHandX = handTargetX;
    state.lastHandY = handTargetY;
    state.isWritingNow = isWritingNow;
    return;
  }

  // 3. DETERMINACIÓN DEL PASO ACTIVO DEL CUERPO (AUTO-LIMPIEZA ENTRE PASOS)
  // Cada nuevo paso con contenido borra la pizarra y se actualiza limpiamente sin amontonarse nunca
  let activeStep = null;
  let activeStepIdx = -1;

  if (currentStep && (
    (currentStep.text && currentStep.text.trim().length > 0) ||
    currentStep.action === "write" ||
    currentStep.action === "highlight" ||
    currentStep.action === "arc"
  )) {
    activeStep = currentStep;
    activeStepIdx = currentIdx;
  } else {
    // Si el paso actual es solo charla (talk) sin texto, mantenemos visible el paso previo más reciente
    for (let k = currentIdx - 1; k >= 1; k--) {
      const prev = state.steps[k];
      if (!prev) continue;
      if (prev.action === "clear") {
        // Un paso previo ordenó borrar la pizarra
        break;
      }
      if ((prev.text && prev.text.trim().length > 0) || prev.action === "write" || prev.action === "highlight" || prev.action === "arc") {
        activeStep = prev;
        activeStepIdx = k;
        break;
      }
    }
  }

  if (!activeStep) {
    soundEngine.updateWriting(isWritingNow, time);
    state.lastHandX = handTargetX;
    state.lastHandY = handTargetY;
    state.isWritingNow = isWritingNow;
    return;
  }

  // Texto a dibujar en la zona de contenido
  const fullRawText = (activeStep.text || "").trim();
  if (!fullRawText) {
    soundEngine.updateWriting(isWritingNow, time);
    state.lastHandX = handTargetX;
    state.lastHandY = handTargetY;
    state.isWritingNow = isWritingNow;
    return;
  }

  // División inteligente en 1 o 2 líneas si contiene separadores o es largo
  let lines = [];
  if (fullRawText.includes("\n")) {
    lines = fullRawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  } else if (fullRawText.includes("|")) {
    lines = fullRawText.split("|").map(l => l.trim()).filter(l => l.length > 0);
  } else if (fullRawText.includes("//")) {
    lines = fullRawText.split("//").map(l => l.trim()).filter(l => l.length > 0);
  } else if (fullRawText.length > 24 && (fullRawText.includes(". ") || fullRawText.includes(": "))) {
    const sep = fullRawText.includes(". ") ? ". " : ": ";
    const parts = fullRawText.split(sep);
    lines = [parts[0] + (sep === ". " ? "." : ":"), parts.slice(1).join(sep).trim()];
  } else {
    lines = [fullRawText];
  }

  const isCurrent = (activeStepIdx === currentIdx);
  const stepStart = activeStep.startTime || 0;
  const speechEnd = activeStep.speechEndTime || (stepStart + 2.5);
  const speechDur = Math.max(0.8, speechEnd - stepStart);

  const writeDur = Math.min(speechDur * 0.48, Math.max(0.75, fullRawText.length * 0.08));
  const elapsed = Math.max(0, t - stepStart);
  const isWritingActive = isCurrent && (elapsed < writeDur) && state.isPlaying;
  const writeProg = isCurrent ? Math.min(1.0, elapsed / Math.max(0.01, writeDur)) : 1.0;

  if (lines.length === 1) {
    // 1 SOLA LÍNEA (Centrada verticalmente en la zona de contenido de la pizarra)
    const lineY = startY + rowHeight * 1.35;
    let fontSize = 72;
    ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
    let lineW = ctx.measureText(lines[0]).width;
    if (lineW > 740) {
      fontSize = Math.max(38, Math.floor(fontSize * (740 / lineW)));
      ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
      lineW = ctx.measureText(lines[0]).width;
    }
    const lineX = (w / 2) - (lineW / 2);

    const charCount = Math.floor(lines[0].length * writeProg);
    const textToShow = lines[0].substring(0, charCount);

    if (activeStep.action === "highlight") {
      const hlW = lineW * writeProg;
      ctx.save();
      ctx.fillStyle = "rgba(250, 204, 21, 0.42)";
      ctx.fillRect(lineX - 8, lineY - 54, hlW + 16, 64);
      ctx.restore();
    }

    ctx.fillStyle = (activeStep.action === "highlight") ? blueInk : mainInk;
    ctx.textAlign = "left";
    ctx.fillText(textToShow, lineX, lineY);

    if (isWritingActive && lines[0].length > 0) {
      const textW = ctx.measureText(textToShow).width;
      handTargetX = lineX + textW;
      handTargetY = lineY - 14;
      handAngle = -0.12;
      isWritingNow = true;
    }

    // Arco curvo de unión entre letras
    if (activeStep.action === "arc") {
      const subProg = isCurrent ? Math.min(1.0, elapsed / Math.max(0.01, speechDur * 0.40)) : 1.0;
      const text = lines[0];
      const charWidth = lineW / Math.max(1, text.length);
      const p1X = lineX + (activeStep.fromIdx || 0) * charWidth + charWidth / 2;
      const p2X = lineX + (activeStep.toIdx !== undefined ? activeStep.toIdx : (text.length - 1)) * charWidth + charWidth / 2;

      drawCurvedArrow(ctx, p1X, lineY - 58, p2X, lineY - 58, -42, redInk, subProg);

      if (activeStep.fromIdx2 !== undefined && activeStep.toIdx2 !== undefined) {
        const q1X = lineX + activeStep.fromIdx2 * charWidth + charWidth / 2;
        const q2X = lineX + activeStep.toIdx2 * charWidth + charWidth / 2;
        drawCurvedArrow(ctx, q1X, lineY - 52, q2X, lineY - 52, -26, blueInk, subProg);
      }

      if (isWritingActive && subProg < 1.0) {
        const tArc = Math.min(1, subProg);
        const midX = (p1X + p2X) / 2;
        const midY = (lineY - 58) - 42;
        handTargetX = (1 - tArc) * (1 - tArc) * p1X + 2 * (1 - tArc) * tArc * midX + tArc * tArc * p2X;
        handTargetY = (1 - tArc) * (1 - tArc) * (lineY - 58) + 2 * (1 - tArc) * tArc * midY + tArc * tArc * (lineY - 58);
        handAngle = Math.atan2(midY - (lineY - 58), p2X - p1X) * 0.4;
        isWritingNow = true;
      }
    }
  } else {
    // 2 LÍNEAS (Línea 1 concepto principal, Línea 2 ejemplo o aclaración)
    const line1Y = startY + rowHeight * 0.95;
    const line2Y = startY + rowHeight * 1.95;

    let fontSize1 = 68;
    ctx.font = `bold ${fontSize1}px 'Caveat', 'Kalam', cursive, sans-serif`;
    let line1W = ctx.measureText(lines[0]).width;
    if (line1W > 740) {
      fontSize1 = Math.max(38, Math.floor(fontSize1 * (740 / line1W)));
      ctx.font = `bold ${fontSize1}px 'Caveat', 'Kalam', cursive, sans-serif`;
      line1W = ctx.measureText(lines[0]).width;
    }
    const line1X = (w / 2) - (line1W / 2);

    const prog1 = Math.min(1.0, writeProg / 0.5);
    const prog2 = Math.max(0.0, Math.min(1.0, (writeProg - 0.5) / 0.5));

    const chars1 = Math.floor(lines[0].length * prog1);
    const text1ToShow = lines[0].substring(0, chars1);

    ctx.fillStyle = mainInk;
    ctx.textAlign = "left";
    ctx.fillText(text1ToShow, line1X, line1Y);

    let fontSize2 = 56;
    ctx.font = `bold ${fontSize2}px 'Caveat', 'Kalam', cursive, sans-serif`;
    let line2W = ctx.measureText(lines[1]).width;
    if (line2W > 740) {
      fontSize2 = Math.max(34, Math.floor(fontSize2 * (740 / line2W)));
      ctx.font = `bold ${fontSize2}px 'Caveat', 'Kalam', cursive, sans-serif`;
      line2W = ctx.measureText(lines[1]).width;
    }
    const line2X = (w / 2) - (line2W / 2);

    const chars2 = Math.floor(lines[1].length * prog2);
    const text2ToShow = lines[1].substring(0, chars2);

    if (activeStep.action === "highlight" && prog2 > 0) {
      const hlW = line2W * prog2;
      ctx.save();
      ctx.fillStyle = "rgba(250, 204, 21, 0.42)";
      ctx.fillRect(line2X - 8, line2Y - 48, hlW + 16, 56);
      ctx.restore();
    }

    ctx.fillStyle = (activeStep.action === "highlight") ? blueInk : (palette.accentInk || blueInk);
    ctx.textAlign = "left";
    ctx.fillText(text2ToShow, line2X, line2Y);

    if (isWritingActive) {
      if (prog1 < 1.0) {
        const textW = ctx.measureText(text1ToShow).width;
        handTargetX = line1X + textW;
        handTargetY = line1Y - 14;
        handAngle = -0.12;
        isWritingNow = true;
      } else if (prog2 < 1.0 && lines[1].length > 0) {
        const textW = ctx.measureText(text2ToShow).width;
        handTargetX = line2X + textW;
        handTargetY = line2Y - 14;
        handAngle = -0.12;
        isWritingNow = true;
      }
    }
  }

  // Notificar al motor de sonido sobre el estado de escritura
  soundEngine.updateWriting(isWritingNow, time);
  state.lastHandX = handTargetX;
  state.lastHandY = handTargetY;
  state.isWritingNow = isWritingNow;
}

/* 2b. ANIMACIÓN REALISTA DEL BORRADOR DE PIZARRA (ACCIÓN CLEAR) */
function drawEraserWipe(ctx, w, topY, bottomY, progress) {
  if (progress <= 0 || progress >= 1.0) return;
  const startX = w * 0.22;
  const endX = w * 0.78;
  const curX = startX + (endX - startX) * progress;
  const curY = topY + ((bottomY - topY) / 2) + Math.sin(progress * Math.PI * 6) * 35;

  ctx.save();
  ctx.translate(curX, curY);
  ctx.rotate(-0.08);

  // Sombra suave del borrador sobre la pizarra
  ctx.shadowColor = "rgba(0,0,0,0.30)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 8;

  // Bloque de madera (cuerpo del borrador)
  ctx.fillStyle = "#854d0e";
  ctx.beginPath();
  ctx.roundRect(-45, -28, 90, 56, 8);
  ctx.fill();

  // Relieve de madera superior
  ctx.fillStyle = "#a16207";
  ctx.beginPath();
  ctx.roundRect(-42, -26, 84, 20, 5);
  ctx.fill();

  // Capa de fieltro (base que limpia la pizarra)
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.roundRect(-45, 16, 90, 14, [0, 0, 6, 6]);
  ctx.fill();

  ctx.restore();
}

/* FLECHA / ARCO CURVO DE UNIÓN ENTRE LETRAS */
function drawCurvedArrow(ctx, x1, y1, x2, y2, curveOffset, color, progress) {
  if (progress <= 0) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 6.5;
  ctx.lineCap = "round";

  const midX = (x1 + x2) / 2;
  const midY = ((y1 + y2) / 2) + curveOffset;

  ctx.beginPath();
  ctx.moveTo(x1, y1);

  const t = Math.min(1, progress);
  const curX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
  const curY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

  ctx.quadraticCurveTo(midX, midY, curX, curY);
  ctx.stroke();

  if (progress > 0.8) {
    const angle = Math.atan2(y2 - midY, x2 - midX);
    ctx.beginPath();
    ctx.moveTo(curX, curY);
    ctx.lineTo(curX - 20 * Math.cos(angle - Math.PI / 6), curY - 20 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(curX - 20 * Math.cos(angle + Math.PI / 6), curY - 20 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/* =========================================================
   DIBUJO HIPERREALISTA DE LA MANO Y EL MARCADOR DE PIZARRA
   Inspirado en la pizarra oficial de "La Profe Rochi"
   ========================================================= */
function drawUltraRealisticHand(ctx, x, y, time, tiltAngle = 0, isTouching = true) {
  ctx.save();

  // Micro-movimientos orgánicos al escribir (letras, curvas, trazos)
  const microX = isTouching ? Math.sin(time * 0.045) * 2.5 : 0;
  const microY = isTouching ? Math.cos(time * 0.06) * 3 : 0;

  ctx.translate(x + microX, y + microY);
  ctx.rotate(tiltAngle);

  // 1. SOMBRA DIRECCIONAL EN EL ACRÍLICO DE LA PIZARRA
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.22)";
  ctx.shadowBlur = isTouching ? 14 : 26;
  ctx.shadowOffsetX = isTouching ? 16 : 28;
  ctx.shadowOffsetY = isTouching ? 20 : 36;

  // Silueta de sombra de contacto
  ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
  ctx.beginPath();
  ctx.ellipse(4, 6, isTouching ? 9 : 18, isTouching ? 5 : 12, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. PUNTA DE FIELTRO BISELADA DEL MARCADOR (CHISEL NIB)
  ctx.save();
  ctx.rotate(-0.65); // Ángulo natural ergonómico hacia arriba a la derecha

  // Fieltro oscuro
  ctx.fillStyle = "#181b20";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(14, -22);
  ctx.lineTo(26, -18);
  ctx.lineTo(10, 4);
  ctx.closePath();
  ctx.fill();

  // Bisel con brillo de tinta fresca
  const nibGrad = ctx.createLinearGradient(0, 0, 14, -22);
  nibGrad.addColorStop(0, "#0f172a");
  nibGrad.addColorStop(0.5, "#334155");
  nibGrad.addColorStop(1, "#0f172a");
  ctx.fillStyle = nibGrad;
  ctx.fill();

  // Anillo negro de sujeción de la punta
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(8, -25, 22, 12);

  // 3. CUERPO DEL MARCADOR (CILINDRO 3D CON DEGRADADO REALISTA)
  const markerW = 38;
  const markerL = 190;
  const barrelX = 2;
  const barrelY = -34;

  const barrelGrad = ctx.createLinearGradient(barrelX, barrelY, barrelX + markerW, barrelY);
  barrelGrad.addColorStop(0, "#cbd5e1");    // Sombra izquierda
  barrelGrad.addColorStop(0.3, "#ffffff");  // Brillo especular central
  barrelGrad.addColorStop(0.7, "#f8fafc");  // Blanco puro
  barrelGrad.addColorStop(1, "#94a3b8");    // Sombra derecha

  ctx.fillStyle = barrelGrad;
  ctx.beginPath();
  ctx.roundRect(barrelX, barrelY, markerW, markerL, 6);
  ctx.fill();

  // Línea sutil de contorno
  ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Banda de color de la marca (Azul Expo profesional)
  const bandGrad = ctx.createLinearGradient(barrelX, barrelY + 45, barrelX + markerW, barrelY + 45);
  bandGrad.addColorStop(0, "#1d4ed8");
  bandGrad.addColorStop(0.4, "#60a5fa");
  bandGrad.addColorStop(1, "#1e40af");
  ctx.fillStyle = bandGrad;
  ctx.fillRect(barrelX, barrelY + 45, markerW, 35);

  // Tipografía pequeña en el marcador
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 8px sans-serif";
  ctx.fillText("EXPO", barrelX + 7, barrelY + 66);

  // Tapa trasera azul
  ctx.fillStyle = "#1d4ed8";
  ctx.beginPath();
  ctx.roundRect(barrelX, barrelY + markerL - 10, markerW, 20, [0, 0, 8, 8]);
  ctx.fill();

  ctx.restore();

  // 4. LA MANO HUMANA (ANATOMÍA, PIEL, SOMBREADO Y MANICURA)
  const isRedTeacher = (state.avatar === "bellum" || state.avatar === "bellum_full" || state.avatar === "scarlet");
  const skinBase = isRedTeacher ? "#fcd34d" : "#f2c5a2";
  const skinShadow = isRedTeacher ? "#f59e0b" : "#d69871";
  const skinHighlight = isRedTeacher ? "#fef08a" : "#fce8d7";
  const nailPink = isRedTeacher ? "#dc2626" : "#fbcfe8";

  // A. Dedo medio (debajo del marcador dándole soporte)
  ctx.save();
  const midFingerGrad = ctx.createLinearGradient(20, 20, 60, 60);
  midFingerGrad.addColorStop(0, skinShadow);
  midFingerGrad.addColorStop(1, skinBase);
  ctx.fillStyle = midFingerGrad;
  ctx.beginPath();
  ctx.ellipse(36, 42, 16, 32, 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // B. Dedo índice (arqueado sobre el marcador con nudillos y manicura)
  ctx.save();
  const indexGrad = ctx.createLinearGradient(10, -5, 55, 35);
  indexGrad.addColorStop(0, skinHighlight);
  indexGrad.addColorStop(0.5, skinBase);
  indexGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = indexGrad;

  // Falange distal y media del índice
  ctx.beginPath();
  ctx.ellipse(22, 14, 15, 34, 0.32, 0, Math.PI * 2);
  ctx.fill();

  // Líneas de pliegues en los nudillos
  ctx.strokeStyle = "rgba(180, 110, 80, 0.4)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(26, 20, 8, -0.6, 0.6);
  ctx.stroke();

  // Uña con manicura francesa elegante (como en el video)
  ctx.fillStyle = nailPink;
  ctx.beginPath();
  ctx.ellipse(12, 0, 5.5, 9, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Punta blanca de la manicura
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(10.5, -3.5, 4, 3.5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Reflejo de brillo en la uña
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.ellipse(13, 1, 1.5, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // C. Dedo pulgar (sujetando el cuerpo del marcador)
  ctx.save();
  const thumbGrad = ctx.createLinearGradient(35, 20, 75, 60);
  thumbGrad.addColorStop(0, skinHighlight);
  thumbGrad.addColorStop(0.6, skinBase);
  thumbGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = thumbGrad;

  ctx.beginPath();
  ctx.ellipse(48, 38, 18, 38, 0.85, 0, Math.PI * 2);
  ctx.fill();

  // Uña del pulgar
  ctx.fillStyle = nailPink;
  ctx.beginPath();
  ctx.ellipse(32, 28, 6, 8, 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(29, 25, 4, 3, 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // D. Palma y dorso de la mano (conexión fluida hacia la muñeca)
  ctx.save();
  const palmGrad = ctx.createLinearGradient(40, 50, 140, 130);
  palmGrad.addColorStop(0, skinBase);
  palmGrad.addColorStop(0.5, skinShadow);
  palmGrad.addColorStop(1, "#c4835b");
  ctx.fillStyle = palmGrad;

  ctx.beginPath();
  ctx.moveTo(35, 45);
  ctx.quadraticCurveTo(80, 60, 120, 110);
  ctx.quadraticCurveTo(100, 150, 55, 115);
  ctx.quadraticCurveTo(30, 85, 35, 45);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // E. Muñeca y Manga de Chaqueta (Adaptada dinámicamente al Outfit activo de La Profe Rochi)
  ctx.save();
  const sleeveGrad = ctx.createLinearGradient(70, 90, 160, 180);
  const curOutfit = state.outfit || "red";
  if (curOutfit === "black") {
    sleeveGrad.addColorStop(0, "#27272a");
    sleeveGrad.addColorStop(0.4, "#18181b");
    sleeveGrad.addColorStop(1, "#09090b");
  } else if (curOutfit === "blue") {
    sleeveGrad.addColorStop(0, "#3b82f6");
    sleeveGrad.addColorStop(0.4, "#1d4ed8");
    sleeveGrad.addColorStop(1, "#1e3a8a");
  } else if (curOutfit === "purple") {
    sleeveGrad.addColorStop(0, "#a855f7");
    sleeveGrad.addColorStop(0.4, "#7e22ce");
    sleeveGrad.addColorStop(1, "#581c87");
  } else {
    sleeveGrad.addColorStop(0, "#ef4444");
    sleeveGrad.addColorStop(0.4, "#dc2626");
    sleeveGrad.addColorStop(1, "#991b1b");
  }
  ctx.fillStyle = sleeveGrad;

  ctx.beginPath();
  ctx.moveTo(75, 95);
  ctx.lineTo(190, 175);
  ctx.lineTo(135, 260);
  ctx.lineTo(35, 145);
  ctx.closePath();
  ctx.fill();

  // Borde de la manga / puño con textura
  ctx.strokeStyle = (curOutfit === "black") ? "rgba(255, 255, 255, 0.25)" : "#000000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(75, 95);
  ctx.lineTo(35, 145);
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}

const bellumImg = new Image();
bellumImg.src = "/avatars/bellum_exact.png";

// SPRITES ANIMADOS PROFESIONALES (Extraídos de la hoja de sprites original)
const bellumSprites = {
  talk: [],
  write: [],
  turn: [],
  base: new Image(),
  sensualCover: new Image()
};

// Inicializar arrays de imágenes
for (let i = 1; i <= 8; i++) bellumSprites.talk.push(new Image());
for (let i = 1; i <= 6; i++) bellumSprites.write.push(new Image());
for (let i = 1; i <= 6; i++) bellumSprites.turn.push(new Image());

function setAvatarOutfit(outfit = "red") {
  state.outfit = outfit;
  const isRed = (outfit === "red");
  const cleanPath = isRed ? "/avatars/clean_sprites" : `/avatars/outfits/${outfit}`;
  const spritesPath = isRed ? "/avatars/sprites" : `/avatars/outfits/${outfit}`;

  bellumSprites.base.src = `${spritesPath}/base_pose.png`;
  bellumSprites.sensualCover.src = `${cleanPath}/sensual_cover_pose.png`;

  for (let i = 1; i <= 8; i++) {
    bellumSprites.talk[i - 1].src = `${spritesPath}/talk_${i}.png`;
  }
  for (let i = 1; i <= 6; i++) {
    bellumSprites.write[i - 1].src = `${spritesPath}/write_${i}.png`;
  }
  for (let i = 1; i <= 6; i++) {
    bellumSprites.turn[i - 1].src = `${spritesPath}/turn_${i}.png`;
  }
}

// Cargar outfit inicial
setAvatarOutfit(state.outfit || "red");

// Coordenadas milimétricas de la punta del marcador en write_1..write_6 (tamaño 500x800)
const WRITE_MARKER_TIPS = [
  { x: 420, y: 262 }, // write_1
  { x: 470, y: 240 }, // write_2
  { x: 499, y: 203 }, // write_3
  { x: 499, y: 140 }, // write_4
  { x: 432, y: 107 }, // write_5
  { x: 488, y: 56 }   // write_6
];

/* =========================================================
   3. PROFESOR ANIMADO (SEÑORITA BELLUM 2D CON SPRITES O 3D)
   ========================================================= */
function drawTeacher(w, h, cameraType, time, currentStep) {
  if (state.avatar === "pizarra_only") return;

  if (state.avatar === "custom_3d" && threeLoaded && threeModel) {
    draw3DTeacher(w, h, cameraType, time);
    return;
  }

  const isSpeaking = state.isPlaying;
  const isWriting = (state.isWritingNow && isSpeaking && state.lastHandX !== null && state.lastHandY !== null);
  const isPointing = (currentStep && (currentStep.action === "arc" || currentStep.action === "highlight"));

  // ¡SI ESTÁ ESCRIBIENDO: La Señorita Bellum se ancla directamente con su marcador sobre la letra activa!
  if (isWriting && (state.avatar === "bellum" || state.avatar === "bellum_sprites")) {
    drawBellumWritingOnBoard(ctx, time, state.lastHandX, state.lastHandY);
    return;
  }

  // AL TERMINAR DE ESCRIBIR O EN PASOS DE EXPLICACIÓN / ARCO / RESALTADO:
  // ¡LA DOCENTE SE POSICIONA A UN COSTADO (DERECHA) PARA NO TAPAR LA PIZARRA Y DEJAR LEER AL PÚBLICO!
  ctx.save();

  const blink = Math.sin(time * 0.003) > 0.96;
  const mouthOpen = isSpeaking ? (Math.sin(time * 0.02) * 0.5 + 0.5) : 0;
  const headBob = Math.sin(time * 0.004) * 4;
  const sway = Math.sin(time * 0.0025) * 3;

  const currentStepIdx = currentStep ? currentStep.index : 0;
  const hasBoardText = (state.steps && state.steps.some((s, idx) => s.action === "write" && idx <= currentStepIdx));

  // Posición a un costado (derecha del aula: 853px) para que la pizarra quede 100% visible
  const targetSideX = w * 0.79;
  let teacherX = targetSideX;
  let teacherY = 1750; // Pies firmes en el suelo
  let teacherScale = 0.92;

  // Si no se ha escrito nada en la pizarra aún y es el comienzo, saludo inicial en el centro
  if (!hasBoardText && currentStepIdx === 0 && (currentStep ? (currentStep.speechProgress || 0) : 0) < 0.08) {
    teacherX = w / 2;
    teacherScale = 1.08;
  }

  ctx.translate(teacherX, teacherY + headBob);
  ctx.scale(teacherScale, teacherScale);

  if (state.avatar === "bellum" || state.avatar === "bellum_sprites") {
    drawBellumAnimatedSprites(ctx, blink, mouthOpen, time, sway, cameraType, isWriting, isPointing);
  } else if (state.avatar === "bellum_full") {
    drawBellumFullBody(ctx, blink, mouthOpen, time, sway);
  } else if (state.avatar === "scarlet") {
    drawScarletAvatar(ctx, blink, mouthOpen, time, sway);
  } else {
    drawClassicTeacherAvatar(ctx, blink, mouthOpen, time);
  }

  ctx.restore();
}

/* SEÑORITA BELLUM ESCRIBIENDO EN LA PIZARRA CON PUNTA DEL MARCADOR BLOQUEADA SOBRE LA LETRA */
function drawBellumWritingOnBoard(ctx, time, targetX, targetY) {
  if (!bellumSprites.write || bellumSprites.write.length === 0) return;

  // Seleccionar frames acordes a la altura del texto en la pizarra (título alto, ejemplos medios)
  let framePool = [0, 1, 2, 3, 4, 5];
  if (targetY < 830) {
    framePool = [4, 5]; // Título arriba: brazo estirado alcanzando la cabecera
  } else if (targetY < 940) {
    framePool = [3, 4, 5]; // Ejemplo 1 a media altura
  } else {
    framePool = [1, 2, 3]; // Ejemplo 2 más abajo
  }

  const writeIdx = framePool[Math.floor(time * 0.008) % framePool.length];
  const img = bellumSprites.write[writeIdx];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const tip = WRITE_MARKER_TIPS[writeIdx] || { x: 480, y: 150 };

  // Micro vibración realista del trazo
  const microX = Math.sin(time * 0.045) * 2;
  const microY = Math.cos(time * 0.06) * 1.5;

  const targetH = 1080;
  const scale = targetH / 800; // 1.35
  const targetW = (img.naturalWidth / img.naturalHeight) * targetH;

  // ¡PIES SIEMPRE APOYADOS EN EL SUELO (1750)! Nunca queda flotando en el aire
  const teacherY = 1750;
  const drawY = teacherY - (targetH * (780 / 800));

  // Clamping seguro para que NUNCA se salga de la pantalla hacia la izquierda ni derecha
  const idealDrawX = (targetX + microX) - (tip.x * scale);
  const minDrawX = 60;
  const maxDrawX = Math.max(minDrawX, (ctx.canvas.width || 1080) - targetW - 60);
  const drawX = Math.max(minDrawX, Math.min(maxDrawX, idealDrawX));

  ctx.save();

  // Sombra suave proyectada en la pizarra
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.28)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetX = 12;
  ctx.shadowOffsetY = 16;
  ctx.drawImage(img, drawX, drawY, targetW, targetH);
  ctx.restore();

  // Dibujar la figura de espaldas trazando la letra en tiempo real
  ctx.drawImage(img, drawX, drawY, targetW, targetH);

  ctx.restore();
}

function draw3DTeacher(w, h, cameraType, time) {
  if (!threeRenderer || !threeScene || !threeCamera || !threeModel) return;

  const isSpeaking = state.isPlaying;
  const swayY = Math.sin(time * 0.0018) * 0.12;
  const bobY = Math.sin(time * 0.003) * 0.02;
  const speakBounce = isSpeaking ? (Math.sin(time * 0.018) * 0.02) : 0;

  threeModel.rotation.y = swayY;
  threeModel.rotation.x = isSpeaking ? (Math.sin(time * 0.012) * 0.015) : 0;
  threeModel.position.y = (-0.15) + bobY + speakBounce;

  threeRenderer.render(threeScene, threeCamera);

  if (cameraType === "split") {
    ctx.drawImage(threeRenderer.domElement, 0, h * 0.38, w, h * 0.62);
  } else {
    ctx.drawImage(threeRenderer.domElement, 0, 0, w, h);
  }
}

/* AVATAR: SEÑORITA SARA BELLUM (Sprites Animados Limpios: Habla + Gestos vivos + Pizarra) */
function drawBellumAnimatedSprites(ctx, blink, mouthOpen, time, sway, cameraType, isWriting, isPointing) {
  const isSpeaking = state.isPlaying;
  const bobY = Math.sin(time * 0.0035) * 4;
  const speakBounce = isSpeaking ? (Math.sin(time * 0.016) * 3) : 0;
  const swayAngle = Math.sin(time * 0.002) * 0.012;

  ctx.save();
  ctx.translate(0, bobY + speakBounce);
  ctx.rotate(swayAngle);

  let img = null;
  const currentStep = state.steps[state.currentStepIdx];
  const progress = currentStep ? (currentStep.progress || 0) : 0;

  // Lógica inteligente de eventos:
  if (isWriting && bellumSprites.write.length > 0) {
    // ¡ANIMACIÓN DE ESCRIBIR EN LA PIZARRA! (Fila 3 de los sprites limpios)
    // Se muestra de espaldas sosteniendo el marcador y trazando en la pizarra
    const writeIdx = Math.floor(time * 0.007) % bellumSprites.write.length;
    img = bellumSprites.write[writeIdx];
  } else if (isPointing && bellumSprites.turn.length > 0) {
    // Pose de giro señalando hacia la pizarra
    img = bellumSprites.turn[2] || bellumSprites.turn[1];
  } else if (bellumSprites.talk.length > 0) {
    if (isSpeaking) {
      // 8 frames de animación explicando con gestos expresivos vivos (apuntando arriba, explicando, presentando)
      const talkIdx = Math.floor(time * 0.0032) % bellumSprites.talk.length;
      img = bellumSprites.talk[talkIdx];
    } else {
      // En reposo elegante: pose 1 (manos en cadera, atenta)
      img = bellumSprites.talk[0];
    }
  }

  // Fallback si aún están en carga
  if (!img || !img.complete || img.naturalWidth === 0) {
    img = bellumImg;
  }

  if (img && img.complete && img.naturalWidth > 0) {
    const targetH = 1000;
    const targetW = (img.naturalWidth / img.naturalHeight) * targetH;
    const drawX = -targetW / 2;
    // Anclaje exacto de los pies al suelo
    const drawY = -targetH * (780 / 800);

    // Sombra suave proyectada en el suelo
    ctx.save();
    ctx.shadowColor = "rgba(15, 23, 42, 0.25)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 14;
    ctx.drawImage(img, drawX, drawY, targetW, targetH);
    ctx.restore();

    // Dibujar el frame del sprite 100% limpio y completo
    ctx.drawImage(img, drawX, drawY, targetW, targetH);
  }

  ctx.restore();
}

/* AVATAR: SEÑORITA SARA BELLUM (Ilustración original de cuerpo entero con Lip-Sync) */
function drawBellumFullBody(ctx, blink, mouthOpen, time, sway) {
  if (!bellumImg.complete || bellumImg.naturalWidth === 0) return;

  const isSpeaking = state.isPlaying;
  const bobY = Math.sin(time * 0.0035) * 5;
  const speakBounce = isSpeaking ? (Math.sin(time * 0.016) * 4) : 0;
  const swayAngle = Math.sin(time * 0.002) * 0.015;

  ctx.save();

  // Escalar y centrar la muñeca original para encuadre vertical
  const targetH = 1000;
  const targetW = (564 / 1024) * targetH; // ~550px

  ctx.translate(0, bobY + speakBounce);
  ctx.rotate(swayAngle);

  const drawX = -targetW / 2;
  const drawY = -340;

  // Sombra suave proyectada detrás para profundidad en la pizarra
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.32)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 16;
  ctx.drawImage(bellumImg, drawX, drawY, targetW, targetH);
  ctx.restore();

  // Dibujar la ilustración original 100% idéntica
  ctx.drawImage(bellumImg, drawX, drawY, targetW, targetH);

  // Coordenadas exactas para boca y ojo en la ilustración
  const lipX = drawX + (targetW * (281.5 / 564));
  const lipY = drawY + (targetH * (221.0 / 1024));

  // Animación de boca con Lip-Sync en tiempo real cuando habla
  if (isSpeaking && mouthOpen > 0.16) {
    const lipOpenH = Math.max(3.5, mouthOpen * 14);

    ctx.save();
    // Cavidad bucal oscura
    ctx.fillStyle = "#4c0519";
    ctx.beginPath();
    ctx.ellipse(lipX, lipY, 11, lipOpenH, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dientes blancos
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(lipX - 7, lipY - 3, 14, 4.5, 1.5);
    ctx.fill();

    // Contorno de labios rojos carmesí
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.ellipse(lipX, lipY, 11, lipOpenH, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Animación de parpadeo de ojos
  if (blink) {
    const eyeX = drawX + (targetW * (246.0 / 564));
    const eyeY = drawY + (targetH * (170.0 / 1024));
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(eyeX - 12, eyeY);
    ctx.quadraticCurveTo(eyeX, eyeY + 5, eyeX + 12, eyeY - 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/* AVATAR: PROFE ESCARLATA (Pelirroja sensual con gafas de diseño y escote elegante) */
function drawScarletAvatar(ctx, blink, mouthOpen, time, sway) {
  // 1. CABELLO POSTERIOR (ONDAS ROJAS VOLUMINOSAS EN CASCADA)
  ctx.save();
  const hairBackGrad = ctx.createLinearGradient(-120, -60, 120, 260);
  hairBackGrad.addColorStop(0, "#9a1c0b");   // Caoba intenso
  hairBackGrad.addColorStop(0.35, "#c2410c"); // Cobre rojizo vibrante
  hairBackGrad.addColorStop(0.7, "#ea580c");  // Bermellón dorado
  hairBackGrad.addColorStop(1, "#7c2d12");    // Sombra profunda
  ctx.fillStyle = hairBackGrad;

  // Gran masa de cabello posterior con ondas
  ctx.beginPath();
  ctx.arc(0, 5, 125, 0, Math.PI * 2);
  ctx.fill();

  // Mechones largos que caen por detrás de los hombros
  ctx.beginPath();
  ctx.moveTo(-120, 50);
  ctx.quadraticCurveTo(-145 + sway, 160, -90, 270);
  ctx.lineTo(-40, 270);
  ctx.quadraticCurveTo(-90, 160, -80, 50);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(120, 50);
  ctx.quadraticCurveTo(145 - sway, 160, 90, 270);
  ctx.lineTo(40, 270);
  ctx.quadraticCurveTo(90, 160, 80, 50);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. HOMBROS, BUSTO Y ESCOTE SENSUAL
  const skinBase = "#fee2d5";
  const skinShadow = "#e7a98e";
  const skinCleavage = "#d08c6f";

  // Base del pecho y hombros descubiertos
  ctx.save();
  const chestGrad = ctx.createLinearGradient(0, 90, 0, 220);
  chestGrad.addColorStop(0, skinBase);
  chestGrad.addColorStop(0.6, skinBase);
  chestGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = chestGrad;

  ctx.beginPath();
  ctx.moveTo(-160, 280);
  ctx.lineTo(160, 280);
  ctx.lineTo(140, 140);
  ctx.quadraticCurveTo(80, 125, 30, 120);
  ctx.lineTo(-30, 120);
  ctx.quadraticCurveTo(-80, 125, -140, 140);
  ctx.closePath();
  ctx.fill();

  // Sombreado anatómico de la clavícula (collarbone femenino)
  ctx.strokeStyle = "rgba(208, 140, 111, 0.45)";
  ctx.lineWidth = 2.2;
  // Clavícula izquierda
  ctx.beginPath();
  ctx.moveTo(-22, 128);
  ctx.quadraticCurveTo(-65, 126, -115, 138);
  ctx.stroke();
  // Clavícula derecha
  ctx.beginPath();
  ctx.moveTo(22, 128);
  ctx.quadraticCurveTo(65, 126, 115, 138);
  ctx.stroke();

  // Curvas de busto y sombra suave de escote (cleavage)
  ctx.save();
  const cleavGrad = ctx.createLinearGradient(0, 140, 0, 205);
  cleavGrad.addColorStop(0, "rgba(208, 140, 111, 0)");
  cleavGrad.addColorStop(0.5, "rgba(185, 105, 80, 0.55)");
  cleavGrad.addColorStop(1, "rgba(160, 80, 60, 0.7)");
  ctx.strokeStyle = cleavGrad;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, 148);
  ctx.lineTo(0, 195);
  ctx.stroke();

  // Relieve de senos con sombreado sutil
  ctx.fillStyle = "rgba(235, 160, 135, 0.18)";
  ctx.beginPath();
  ctx.arc(-38, 185, 42, 0.2, Math.PI * 0.9);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(38, 185, 42, 0.1, Math.PI * 0.8);
  ctx.fill();
  ctx.restore();

  // Vestido verde esmeralda con profundo escote en corazón / V
  const dressGrad = ctx.createLinearGradient(-150, 150, 150, 280);
  dressGrad.addColorStop(0, "#064e3b");  // Verde esmeralda oscuro
  dressGrad.addColorStop(0.4, "#047857"); // Esmeralda satinado
  dressGrad.addColorStop(1, "#022c22");  // Profundidad
  ctx.fillStyle = dressGrad;

  ctx.beginPath();
  ctx.moveTo(-160, 280);
  ctx.lineTo(160, 280);
  ctx.lineTo(135, 175);
  // Escote corazón profundo
  ctx.quadraticCurveTo(90, 175, 45, 170);
  ctx.quadraticCurveTo(20, 168, 0, 198); // Punta inferior del escote
  ctx.quadraticCurveTo(-20, 168, -45, 170);
  ctx.quadraticCurveTo(-90, 175, -135, 175);
  ctx.closePath();
  ctx.fill();

  // Borde dorado fino y seductor a lo largo del escote
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(135, 175);
  ctx.quadraticCurveTo(90, 175, 45, 170);
  ctx.quadraticCurveTo(20, 168, 0, 198);
  ctx.quadraticCurveTo(-20, 168, -45, 170);
  ctx.quadraticCurveTo(-90, 175, -135, 175);
  ctx.stroke();

  // Fina cadena de oro y colgante de rubí/esmeralda descansando en el escote
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-35, 115);
  ctx.quadraticCurveTo(0, 160, 35, 115);
  ctx.stroke();
  // Dije brillante
  ctx.fillStyle = "#ef4444"; // Gema rubí rojo
  ctx.beginPath();
  ctx.arc(0, 148, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fef08a";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // 3. CUELLO Y ROSTRO
  ctx.save();
  const neckGrad = ctx.createLinearGradient(0, 60, 0, 120);
  neckGrad.addColorStop(0, skinShadow);
  neckGrad.addColorStop(0.5, skinBase);
  neckGrad.addColorStop(1, skinBase);
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.roundRect(-24, 60, 48, 65, 10);
  ctx.fill();

  // Rostro estilizado femenino
  const faceGrad = ctx.createLinearGradient(0, -20, 0, 85);
  faceGrad.addColorStop(0, "#fff1eb");
  faceGrad.addColorStop(0.6, skinBase);
  faceGrad.addColorStop(1, skinShadow);
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.ellipse(0, 28, 72, 88, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rubor rosado seductor en las mejillas
  ctx.fillStyle = "rgba(244, 63, 94, 0.2)";
  ctx.beginPath();
  ctx.ellipse(-42, 40, 18, 12, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(42, 40, 18, 12, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Lunar seductor (beauty mark) sobre el labio superior
  ctx.fillStyle = "#271c19";
  ctx.beginPath();
  ctx.arc(26, 62, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. OJOS VERDES IMPACTANTES CON DELINEADO CAT-EYE
  ctx.save();
  const eyeY = 16;
  const eyeDist = 28;

  // Sombra de ojos cálida cobriza
  ctx.fillStyle = "rgba(234, 88, 12, 0.22)";
  ctx.beginPath();
  ctx.ellipse(-eyeDist, eyeY - 6, 18, 10, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(eyeDist, eyeY - 6, 18, 10, 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Esclerótica (blanco del ojo)
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-eyeDist, eyeY, 15, blink ? 2 : 10, -0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(eyeDist, eyeY, 15, blink ? 2 : 10, 0.06, 0, Math.PI * 2);
  ctx.fill();

  if (!blink) {
    // Iris verde esmeralda seductor
    const irisGrad = ctx.createRadialGradient(-eyeDist, eyeY, 1, -eyeDist, eyeY, 8);
    irisGrad.addColorStop(0, "#34d399"); // Verde brillante
    irisGrad.addColorStop(0.7, "#059669"); // Esmeralda
    irisGrad.addColorStop(1, "#064e3b"); // Borde oscuro
    ctx.fillStyle = irisGrad;

    ctx.beginPath();
    ctx.arc(-eyeDist, eyeY, 7.5, 0, Math.PI * 2);
    ctx.arc(eyeDist, eyeY, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupila
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(-eyeDist, eyeY, 3.5, 0, Math.PI * 2);
    ctx.arc(eyeDist, eyeY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Brillo de luz en la mirada
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-eyeDist - 2, eyeY - 2.5, 1.8, 0, Math.PI * 2);
    ctx.arc(eyeDist - 2, eyeY - 2.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Delineado negro alado estilo "Cat-Eye" y pestañas
  ctx.strokeStyle = "#09090b";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-eyeDist - 16, eyeY + 1);
  ctx.quadraticCurveTo(-eyeDist, eyeY - 11, -eyeDist + 16, eyeY - 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(eyeDist - 16, eyeY - 5);
  ctx.quadraticCurveTo(eyeDist, eyeY - 11, eyeDist + 16, eyeY + 1);
  ctx.stroke();

  // Cejas pelirrojas arqueadas y estilizadas
  ctx.strokeStyle = "#9a3412";
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(-eyeDist - 15, eyeY - 14);
  ctx.quadraticCurveTo(-eyeDist, eyeY - 22, -eyeDist + 14, eyeY - 13);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(eyeDist - 14, eyeY - 13);
  ctx.quadraticCurveTo(eyeDist, eyeY - 22, eyeDist + 15, eyeY - 14);
  ctx.stroke();
  ctx.restore();

  // 5. GAFAS SENSUALES DE DISEÑO (CAT-EYE EN CAREY/NEGRO CON DETALLES DE ORO)
  ctx.save();
  const glassY = 14;
  ctx.strokeStyle = "#18181b"; // Montura negra brillante
  ctx.lineWidth = 3.8;
  ctx.fillStyle = "rgba(240, 248, 255, 0.22)"; // Cristal con brillo

  // Lente izquierdo Cat-Eye (puntas alzadas hacia afuera)
  ctx.beginPath();
  ctx.moveTo(-48, glassY - 14); // Punta alzada exterior
  ctx.lineTo(-8, glassY - 5);
  ctx.quadraticCurveTo(-10, glassY + 15, -28, glassY + 17);
  ctx.quadraticCurveTo(-46, glassY + 15, -48, glassY - 14);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // Lente derecho Cat-Eye
  ctx.beginPath();
  ctx.moveTo(48, glassY - 14); // Punta alzada exterior
  ctx.lineTo(8, glassY - 5);
  ctx.quadraticCurveTo(10, glassY + 15, 28, glassY + 17);
  ctx.quadraticCurveTo(46, glassY + 15, 48, glassY - 14);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  // Puente dorado de las gafas
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-8, glassY - 2);
  ctx.quadraticCurveTo(0, glassY - 6, 8, glassY - 2);
  ctx.stroke();

  // Remaches dorados en las esquinas de las gafas
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(-46, glassY - 12, 2.2, 0, Math.PI * 2);
  ctx.arc(46, glassY - 12, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Reflejo diagonal de luz en los cristales
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-40, glassY - 6);
  ctx.lineTo(-24, glassY + 12);
  ctx.moveTo(24, glassY - 6);
  ctx.lineTo(40, glassY + 12);
  ctx.stroke();
  ctx.restore();

  // 6. NARIZ DELICADA
  ctx.save();
  ctx.strokeStyle = "#d08c6f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.lineTo(2, 38);
  ctx.quadraticCurveTo(-2, 44, -5, 42);
  ctx.stroke();
  ctx.restore();

  // 7. LABIOS ROJOS CARNOSOS CON GLOSS Y LIP-SYNC
  ctx.save();
  const lipY = 74;
  const lipHeight = 6 + (mouthOpen * 19);

  // Labio carmesí
  ctx.fillStyle = "#be123c";
  ctx.beginPath();
  ctx.ellipse(0, lipY, 21, lipHeight, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cavidad bucal y dientes cuando habla
  if (mouthOpen > 0.25) {
    ctx.fillStyle = "#4c0519";
    ctx.beginPath();
    ctx.ellipse(0, lipY, 14, lipHeight * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    // Dientes blancos
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-8, lipY - 3, 16, 4.5, 2);
    ctx.fill();
  }

  // Brillo gloss seductor en el labio inferior
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.beginPath();
  ctx.ellipse(2, lipY + 3, 7, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 8. CABELLO FRONTAL (MECHONES ONDULADOS QUE CAEN SOBRE EL PECHO)
  ctx.save();
  const frontHairGrad = ctx.createLinearGradient(-100, -50, 100, 240);
  frontHairGrad.addColorStop(0, "#ea580c");  // Cobre ardiente
  frontHairGrad.addColorStop(0.5, "#c2410c"); // Rojo profundo
  frontHairGrad.addColorStop(1, "#9a1c0b");  // Caoba

  ctx.fillStyle = frontHairGrad;

  // Flequillo lateral con volumen peinado hacia la izquierda
  ctx.beginPath();
  ctx.moveTo(-65, -15);
  ctx.quadraticCurveTo(0, -65, 75, -25);
  ctx.quadraticCurveTo(35, 10, -35, 0);
  ctx.closePath();
  ctx.fill();

  // Mechón izquierdo cayendo sinuoso sobre el hombro y escote
  ctx.beginPath();
  ctx.moveTo(-60, 10);
  ctx.quadraticCurveTo(-95, 90, -75, 165);
  ctx.quadraticCurveTo(-65 + sway, 230, -45, 260);
  ctx.quadraticCurveTo(-75, 190, -85, 130);
  ctx.quadraticCurveTo(-80, 50, -55, 10);
  ctx.closePath();
  ctx.fill();

  // Mechón derecho ondeando sutilmente
  ctx.beginPath();
  ctx.moveTo(60, 10);
  ctx.quadraticCurveTo(95, 90, 78, 165);
  ctx.quadraticCurveTo(70 - sway, 230, 55, 260);
  ctx.quadraticCurveTo(80, 190, 88, 130);
  ctx.quadraticCurveTo(82, 50, 55, 10);
  ctx.closePath();
  ctx.fill();

  // Pendientes colgantes dorados elegantes
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 2.5;
  // Pendiente izq
  ctx.beginPath();
  ctx.moveTo(-74, 45);
  ctx.lineTo(-76, 75);
  ctx.stroke();
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(-76, 78, 4.5, 0, Math.PI * 2);
  ctx.fill();
  // Pendiente der
  ctx.beginPath();
  ctx.moveTo(74, 45);
  ctx.lineTo(76, 75);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(76, 78, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* AVATAR: DOCENTE CLÁSICA */
function drawClassicTeacherAvatar(ctx, blink, mouthOpen, time) {
  // Cuerpo / Traje negro
  ctx.fillStyle = "#1e1b2e";
  ctx.beginPath();
  ctx.moveTo(-160, 280);
  ctx.lineTo(160, 280);
  ctx.lineTo(120, 130);
  ctx.lineTo(-120, 130);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f6c8a2";
  ctx.fillRect(-28, 70, 56, 70);

  ctx.fillStyle = "#b58742";
  ctx.beginPath();
  ctx.arc(0, 10, 115, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fed7aa";
  ctx.beginPath();
  ctx.ellipse(0, 30, 78, 92, 0, 0, Math.PI * 2);
  ctx.fill();

  // Aretes dobles circulares
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(-82, 60, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-82, 95, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(82, 60, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(82, 95, 22, 0, Math.PI * 2);
  ctx.stroke();

  // Ojos
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-28, 15, 14, blink ? 2 : 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(28, 15, 14, blink ? 2 : 9, 0, 0, Math.PI * 2);
  ctx.fill();

  if (!blink) {
    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.arc(-26, 15, 6, 0, Math.PI * 2);
    ctx.arc(30, 15, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Gafas
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 4;
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  ctx.roundRect(-46, -2, 38, 34, 8);
  ctx.stroke();
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(8, -2, 38, 34, 8);
  ctx.stroke();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-8, 10);
  ctx.lineTo(8, 10);
  ctx.stroke();

  // Nariz
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 15);
  ctx.lineTo(3, 40);
  ctx.lineTo(-4, 45);
  ctx.stroke();

  // Boca
  const lipHeight = 4 + (mouthOpen * 18);
  ctx.fillStyle = "#be123c";
  ctx.beginPath();
  ctx.ellipse(0, 75, 18, lipHeight, 0, 0, Math.PI * 2);
  ctx.fill();

  if (mouthOpen > 0.3) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-8, 72, 16, 4);
  }

  // Cabello frontal
  ctx.fillStyle = "#ca8a04";
  ctx.beginPath();
  ctx.moveTo(-75, -20);
  ctx.quadraticCurveTo(0, -60, 75, -20);
  ctx.quadraticCurveTo(20, -10, -75, -20);
  ctx.fill();
}

/* =========================================================
   4. SUBTÍTULOS DINÁMICOS TIKTOK / REELS (KARAOKE EN CÁPSULA)
   ========================================================= */
function drawViralCaptions(w, h, currentStep) {
  if (!currentStep) return;

  const text = (currentStep.speech || "").trim();
  if (!text) return;

  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return;

  let activeWordIdx = 0;
  if (currentStep.words && currentStep.words.length > 0) {
    const curTime = state.currentTime;
    for (let k = 0; k < currentStep.words.length; k++) {
      const wInfo = currentStep.words[k];
      if (curTime >= wInfo.start && curTime < (wInfo.start + wInfo.duration + 0.12)) {
        activeWordIdx = Math.min(words.length - 1, k);
        break;
      } else if (curTime >= (wInfo.start + wInfo.duration)) {
        activeWordIdx = Math.min(words.length - 1, k);
      }
    }
  } else {
    const progress = Math.max(0, Math.min(0.999, (currentStep.speechProgress !== undefined) ? currentStep.speechProgress : (currentStep.progress || 0)));
    activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));
  }

  // Bloques dinámicos de 3 palabras para que nunca se desborde ni tape a la docente
  const wordsPerChunk = 3;
  const chunkIdx = Math.floor(activeWordIdx / wordsPerChunk);
  const startIdx = chunkIdx * wordsPerChunk;
  const endIdx = Math.min(words.length, startIdx + wordsPerChunk);
  const chunkWords = words.slice(startIdx, endIdx);
  const activeInChunk = activeWordIdx - startIdx;

  ctx.save();
  ctx.font = "900 46px 'Inter', sans-serif";
  ctx.textBaseline = "middle";

  const wordWidths = chunkWords.map(w => ctx.measureText(w).width);
  const spaceW = ctx.measureText(" ").width;
  const totalChunkW = wordWidths.reduce((a, b) => a + b, 0) + (spaceW * Math.max(0, chunkWords.length - 1));

  const pillPadX = 30;
  const pillW = Math.max(220, totalChunkW + (pillPadX * 2));
  const pillH = 72;
  const pillY = h * 0.88; // 1689px en 1080x1920

  // Fondo cápsula oscura traslúcida con sombra
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "rgba(10, 15, 30, 0.88)";
  ctx.beginPath();
  ctx.roundRect((w / 2) - (pillW / 2), pillY - (pillH / 2), pillW, pillH, 20);
  ctx.fill();
  ctx.restore();

  // Borde sutil brillante
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.beginPath();
  ctx.roundRect((w / 2) - (pillW / 2), pillY - (pillH / 2), pillW, pillH, 20);
  ctx.stroke();

  // Renderizar palabras con efecto karaoke activo
  let curX = (w / 2) - (totalChunkW / 2);
  chunkWords.forEach((word, wIdx) => {
    const isCurrent = (wIdx === activeInChunk && state.isPlaying);
    ctx.textAlign = "left";

    // Borde negro grueso para contraste absoluto
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#000000";
    ctx.strokeText(word, curX, pillY);

    if (isCurrent) {
      // Palabra que se está pronunciando en este instante: Amarillo eléctrico estilo TikTok
      ctx.fillStyle = "#facc15";
    } else {
      // Resto de palabras del fragmento: Blanco brillante
      ctx.fillStyle = "#ffffff";
    }
    ctx.fillText(word, curX, pillY);

    curX += wordWidths[wIdx] + spaceW;
  });

  ctx.restore();
}

/* =========================================================
   GRABACIÓN Y CONVERSIÓN PROFESIONAL DE VIDEO MP4 (YOUTUBE READY)
   ========================================================= */
function toggleRecording() {
  if (state.isRecording) {
    // Protección anti-corte accidental: si lleva menos de 5 segundos y la lección dura más de 8s
    const elapsedSec = (performance.now() - (state.recordingStartTime || performance.now())) / 1000;
    if (elapsedSec < 4.5 && state.duration > 8) {
      const ok = confirm(
        `⚠️ La lección apenas lleva ${Math.floor(elapsedSec)} segundos (duración completa: ${Math.floor(state.duration)}s).\n\n` +
        `Si detienes ahora, el video solo durará 3 segundos y fallará en YouTube.\n\n` +
        `El video se descargará solo al finalizar la explicación completa.\n\n` +
        `¿Deseas esperar a que termine? (Recomendado: Cancelar para seguir grabando)`
      );
      if (!ok) {
        return; // Sigue grabando
      }
    }
    stopRecording(true);
  } else {
    startRecording();
  }
}

async function startRecording() {
  state.isShowingChallengePreview = false;
  state.isShowingCoverPreview = false;
  if (window.innerWidth <= 920 && window.setMobileTab) {
    window.setMobileTab("preview");
  }
  if (state.isRecording) {
    stopRecording(true);
    return;
  }

  // 1. Despertar AudioContext de inmediato en el gesto del usuario
  if (!state.audioContext) {
    initAudio();
  }
  if (state.audioContext && state.audioContext.state === "suspended") {
    try { await state.audioContext.resume(); } catch (e) {}
  }

  // 2. Si no se ha generado el audio aún, sintetizarlo primero
  if (!state.audioElement || !state.audioElement.src) {
    updateStatus("🎙️ Sintetizando audio de la lección antes de grabar...");
    try {
      await synthesizeLessonAudio();
    } catch (err) {
      alert("Error al preparar el audio para grabación: " + err.message);
      return;
    }
  }

  state.isRecording = true;
  state.recordedChunks = [];
  state.recordingStartTime = performance.now();

  // Actualizar UI visualmente para indicar grabación activa (escritorio y móvil)
  updateRecordingUI(true);

  // Pausar y asegurar inicio exacto en segundo 0 para captura completa
  pauseAllAudio();
  state.audioElement.currentTime = 0;
  if (state.bgMusicAudio) state.bgMusicAudio.currentTime = 0;
  state.currentTime = 0;

  // Esperar confirmación de seek a 0
  await new Promise((resolve) => {
    if (state.audioElement.currentTime === 0) return resolve();
    const onSeeked = () => {
      state.audioElement.removeEventListener("seeked", onSeeked);
      resolve();
    };
    state.audioElement.addEventListener("seeked", onSeeked, { once: true });
    setTimeout(resolve, 250);
  });

  const canvasStream = canvas.captureStream(30);
  let audioTracks = [];

  try {
    if (!state.destAudioStreamNode) {
      state.destAudioStreamNode = state.audioContext.createMediaStreamDestination();
    }

    if (!state.audioElementSourceNode) {
      state.audioElementSourceNode = state.audioContext.createMediaElementSource(state.audioElement);
      state.voiceGainNode = state.audioContext.createGain();
      state.voiceGainNode.gain.setValueAtTime(state.voiceVolume, state.audioContext.currentTime);
      state.audioElementSourceNode.connect(state.voiceGainNode);
      state.voiceGainNode.connect(state.destAudioStreamNode);
      state.voiceGainNode.connect(state.audioContext.destination);
    }

    if (soundEngine && soundEngine.masterGain) {
      try { soundEngine.masterGain.connect(state.destAudioStreamNode); } catch (e) {}
    }

    if (state.bgMusicGainNode && state.destAudioStreamNode) {
      try { state.bgMusicGainNode.connect(state.destAudioStreamNode); } catch (e) {}
    }

    audioTracks = state.destAudioStreamNode.stream.getAudioTracks();
  } catch (e) {
    console.warn("Audio Context setup:", e);
    if (state.destAudioStreamNode) {
      audioTracks = state.destAudioStreamNode.stream.getAudioTracks();
    }
  }

  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioTracks
  ]);

  // Selección de códec compatible con MediaRecorder
  const supportedTypes = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4;codecs=avc1,mp4a.40.2",
    "video/mp4"
  ];
  let chosenMime = "";
  for (let m of supportedTypes) {
    if (MediaRecorder.isTypeSupported(m)) {
      chosenMime = m;
      break;
    }
  }
  state.recordingMimeType = chosenMime;

  try {
    state.mediaRecorder = new MediaRecorder(combinedStream, chosenMime ? {
      mimeType: chosenMime,
      videoBitsPerSecond: 4500000
    } : undefined);
  } catch (err) {
    console.warn("Fallo con mimeType " + chosenMime + ", usando MediaRecorder predeterminado:", err);
    state.mediaRecorder = new MediaRecorder(combinedStream);
  }

  state.mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      state.recordedChunks.push(e.data);
    }
  };

  state.mediaRecorder.onstop = saveRecordedVideo;

  // Iniciar MediaRecorder capturando fragmentos cada 500ms
  state.mediaRecorder.start(500);

  // Iniciar reproducción simultánea de audio sincronizada
  restartAllAudio();
  state.isPlaying = true;
  updateStatus("⏺ Grabando video en alta calidad... Deja que termine la lección completa para descargar el MP4.");
}

function stopRecording(force = false) {
  if (!state.isRecording) return;

  const elapsedSec = (performance.now() - (state.recordingStartTime || performance.now())) / 1000;
  if (!force && elapsedSec < 4.5 && state.duration > 8) {
    const ok = confirm(
      `⚠️ La lección apenas lleva ${Math.floor(elapsedSec)} segundos (duración completa: ${Math.floor(state.duration)}s).\n\n` +
      `Si detienes ahora, el video solo durará 3 segundos y fallará en YouTube.\n\n` +
      `¿Deseas esperar a que termine toda la lección automáticamente?\n\n` +
      `(Presiona Cancelar para seguir grabando la lección completa)`
    );
    if (!ok) {
      return;
    }
  }

  state.isRecording = false;
  updateRecordingUI(false);

  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    try { state.mediaRecorder.requestData(); } catch (e) {}
    state.mediaRecorder.stop();
  }
}

function updateRecordingUI(isRec) {
  const recBanner = document.getElementById("recordingFloatingBanner");

  if (isRec) {
    if (badgeRecording) badgeRecording.style.display = "inline-block";
    if (recBanner) recBanner.style.display = "flex";

    if (btnRecord) {
      btnRecord.classList.add("btn-accent");
      btnRecord.textContent = "⏹ Grabando... (Espere al final)";
    }
    if (btnMobileRecord) {
      btnMobileRecord.textContent = "⏹ Grabando...";
      btnMobileRecord.style.background = "#dc2626";
      btnMobileRecord.style.color = "#ffffff";
      btnMobileRecord.style.fontWeight = "900";
    }
  } else {
    if (badgeRecording) badgeRecording.style.display = "none";
    if (recBanner) recBanner.style.display = "none";

    if (btnRecord) {
      btnRecord.classList.remove("btn-accent");
      btnRecord.textContent = "⏺ Grabar y Descargar Video MP4";
    }
    if (btnMobileRecord) {
      btnMobileRecord.textContent = "⏺ Guardar MP4";
      btnMobileRecord.style.background = "";
      btnMobileRecord.style.color = "";
      btnMobileRecord.style.fontWeight = "";
    }
  }
}

async function saveRecordedVideo() {
  updateStatus("⚙️ Procesando video con FFmpeg para garantizar 100% de compatibilidad con YouTube...");

  if (!state.recordedChunks || state.recordedChunks.length === 0) {
    updateStatus("❌ No se capturaron fotogramas de video.");
    return;
  }

  const rawBlob = new Blob(state.recordedChunks, { type: state.recordingMimeType || "video/webm" });

  if (rawBlob.size < 5000) {
    updateStatus("⚠️ Grabación demasiado corta o vacía.");
    return;
  }

  // SIEMPRE CONVERTIR EN EL SERVIDOR CON FFMPEG:
  // FFmpeg genera el contenedor MP4 estándar con perfil H.264 High/Main,
  // formato de color yuv420p universal, audio estéreo AAC y el átomo 'moov'
  // al inicio (-movflags +faststart) que YouTube Shorts, TikTok y Reels exigen.
  try {
    updateStatus("⚙️ Convirtiendo a MP4 optimizado para YouTube (con duración y audio completo)...");
    const resp = await fetch("/api/convert-mp4", {
      method: "POST",
      headers: { "Content-Type": state.recordingMimeType || "video/webm" },
      body: rawBlob
    });

    if (resp.ok) {
      const mp4Blob = await resp.blob();
      const filename = `profe_rochi_${getLessonTitle().toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}.mp4`;
      downloadBlob(mp4Blob, filename);
      updateStatus("✅ ¡Video MP4 listo y descargado! 100% compatible con YouTube Shorts.");
      return;
    } else {
      const err = await resp.json().catch(() => ({}));
      console.warn("Fallo conversión backend:", resp.status, err);
      updateStatus(`⚠️ Aviso del servidor: ${err.error || "error en conversión"}. Descargando video directo.`);
    }
  } catch (e) {
    console.warn("No se pudo conectar con el servicio FFmpeg:", e);
    updateStatus("⚠️ No se pudo conectar con el convertidor del servidor. Descargando video...");
  }

  // Fallback si no hubo conexión con el servidor
  const isMp4 = state.recordingMimeType && state.recordingMimeType.includes("mp4");
  const fallbackExt = isMp4 ? "mp4" : "webm";
  downloadBlob(rawBlob, `profe_rochi_${Date.now()}.${fallbackExt}`);
}

async function downloadBlob(blob, filename) {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  // En móvil: intentar primero Web Share nativo con archivo para guardar directo en la galería / fotos
  if (isMobile && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: filename,
          text: "Archivo generado por La Profe Rochi"
        });
        updateStatus("✅ ¡Archivo guardado en tu dispositivo!");
        return;
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.warn("Share fallback:", err);
      } else {
        return; // Usuario canceló el modal nativo
      }
    }
  }

  // Descarga directa con blob URL universal
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    updateStatus("✅ ¡Archivo descargado con éxito! Listo para publicar.");
  }, 1000);
}
