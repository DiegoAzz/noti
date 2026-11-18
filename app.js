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
    this.volume = 0.85;
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
  theme: "classroom",
  cameraMode: "director",
  format: "9:16",
  soundVolume: 0.8,
  musicTrack: "suave",
  musicVolume: 0.18,
  bgMusicAudio: null,
  bgMusicSourceNode: null,
  bgMusicGainNode: null,
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
  audioElementSourceNode: null,
  recordingMimeType: ""
};

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
const sliderMarkerSound = document.getElementById("sliderMarkerSound");
const labelSoundVol = document.getElementById("labelSoundVol");
const selectBgMusic = document.getElementById("selectBgMusic");
const sliderMusicVol = document.getElementById("sliderMusicVol");
const labelMusicVol = document.getElementById("labelMusicVol");
const btnDownloadThumbnail = document.getElementById("btnDownloadThumbnail");
const btnTogglePasteScript = document.getElementById("btnTogglePasteScript");
const btnClosePasteScript = document.getElementById("btnClosePasteScript");
const btnProcessRawScript = document.getElementById("btnProcessRawScript");
const pasteScriptPanel = document.getElementById("pasteScriptPanel");
const rawScriptText = document.getElementById("rawScriptText");
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
  setupEventListeners();
  loadTemplate("capicua");
  initAudio();
  initThree3D();
  resizeCanvas();
  requestAnimationFrame(renderLoop);
});

function setupEventListeners() {
  document.getElementById("btnTplCapicua").addEventListener("click", (e) => switchActiveTemplate(e, "capicua"));
  document.getElementById("btnTplPalindromos").addEventListener("click", (e) => switchActiveTemplate(e, "palindromos"));
  document.getElementById("btnTplAcentuacion").addEventListener("click", (e) => switchActiveTemplate(e, "acentuacion"));
  document.getElementById("btnTplMates").addEventListener("click", (e) => switchActiveTemplate(e, "mates"));

  document.getElementById("btnAddStep").addEventListener("click", () => {
    state.steps.push({
      speech: "Escribe aquí la explicación de este paso.",
      action: "write",
      text: "Nuevo Texto",
      camera: "board"
    });
    renderStepsUI();
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
  state.steps = JSON.parse(JSON.stringify(TEMPLATES[key] || TEMPLATES.capicua));
  renderStepsUI();
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

  const hasTags = lines.some(l => /^(T[ÍI]TULO|HABLA|PROFE|DOCENTE|PIZARRA|TEXTO|ESCRIBE|ARCO|FLECHA):/i.test(l));

  if (hasTags) {
    let pendingText = "";
    let pendingAction = "talk";

    for (const line of lines) {
      if (/^(T[ÍI]TULO):/i.test(line)) {
        explicitTitle = line.replace(/^(T[ÍI]TULO):/i, "").trim().slice(0, 30);
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
    renderStepsUI();
    if (pasteScriptPanel) pasteScriptPanel.style.display = "none";
    updateStatus(`✅ ¡Guion importado! Se generaron ${newSteps.length} pasos respetando los límites.`);
  }
}

function downloadThumbnailCover() {
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `miniatura_${getLessonTitle().toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    updateStatus("📸 ¡Miniatura HD guardada con éxito!");
  } catch (err) {
    console.error("Error al guardar miniatura:", err);
    alert("No se pudo descargar la miniatura.");
  }
}

window.removeStep = (idx) => {
  if (state.steps.length <= 1) return;
  state.steps.splice(idx, 1);
  renderStepsUI();
};

window.updateStepSpeech = (idx, val) => state.steps[idx].speech = val;
window.updateStepAction = (idx, val) => state.steps[idx].action = val;
window.updateStepText = (idx, val) => state.steps[idx].text = val;

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

function updateTimeBadge() {
  const cur = formatTime(state.currentTime);
  const dur = formatTime(state.duration);
  badgeTime.textContent = `${cur} / ${dur}`;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

async function generateAndPlay() {
  btnPlayPreview.disabled = true;
  updateStatus("🎙️ Sintetizando voz con Inteligencia Artificial...");

  if (!state.audioContext) {
    initAudio();
  }
  if (state.audioContext.state === "suspended") {
    await state.audioContext.resume();
  }

  const fullScript = state.steps.map(s => s.speech.trim()).join(" ... ");

  try {
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
      const err = await res.json();
      throw new Error(err.error || "Error al sintetizar voz");
    }

    const data = await res.json();
    state.wordsTimeline = data.words || [];

    assignTimestampsToSteps();

    const audioBlob = b64toBlob(data.audioBase64, data.mimeType || "audio/mpeg");
    const audioUrl = URL.createObjectURL(audioBlob);
    state.audioElement.src = audioUrl;

    restartAllAudio();
    state.isPlaying = true;
    state.duration = state.audioElement.duration || 10;
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
  if (state.wordsTimeline.length === 0) return;

  const totalWords = state.wordsTimeline.length;
  let currentWordIdx = 0;
  state.steps.forEach((step, idx) => {
    const stepWordCount = Math.max(1, step.speech.split(/\s+/).length);
    const startWord = state.wordsTimeline[Math.min(currentWordIdx, totalWords - 1)];
    currentWordIdx += stepWordCount;
    const endWord = state.wordsTimeline[Math.min(currentWordIdx, totalWords - 1)];

    step.startTime = startWord ? startWord.start : (idx * 3);
    step.endTime = endWord ? endWord.start + endWord.duration : ((idx + 1) * 3);
  });

  const lastWord = state.wordsTimeline[totalWords - 1];
  state.duration = (lastWord.start + lastWord.duration) || 15;
}

function restartPlayback() {
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
    alert("Por favor ingresa un tema educativo (ej: Reglas de la B y la V).");
    return;
  }

  updateStatus(`💡 Generando lección interactiva para: "${topic}"...`);

  setTimeout(() => {
    state.steps = [
      {
        speech: `¡Hola a todos! Hoy vamos a aprender de forma super fácil todo sobre: ${topic}.`,
        action: "write",
        text: topic.toUpperCase(),
        camera: "teacher"
      },
      {
        speech: "Presta mucha atención a la pizarra para que no se te olvide este concepto clave.",
        action: "write",
        text: "Regla Principal",
        camera: "board"
      },
      {
        speech: "Fíjate en este primer ejemplo práctico y cómo se conectan los elementos.",
        action: "arc",
        text: "Ejemplo 1",
        fromIdx: 0,
        toIdx: 8,
        camera: "board"
      },
      {
        speech: "Si aplicas esta regla, jamás volverás a equivocarte en tus exámenes o trabajos.",
        action: "highlight",
        text: "¡Aprobado! ✓",
        camera: "board"
      },
      {
        speech: "¿Te ha quedado claro? ¡Dale me gusta y comparte este video con tus compañeros!",
        action: "highlight",
        text: "¡Comparte!",
        camera: "teacher"
      }
    ];

    renderStepsUI();
    updateStatus(`Lección para "${topic}" lista. Presiona 'Generar y Reproducir'.`);
  }, 400);
}

/* =========================================================
   SISTEMA DE RENDERIZADO VISUAL EN CANVAS (60 FPS)
   ========================================================= */

function renderLoop(time) {
  const w = canvas.width;
  const h = canvas.height;

  // Sincronización continua de alta precisión (60 FPS) entre audio y fotogramas visuales
  if (state.audioElement && !state.audioElement.paused) {
    state.currentTime = state.audioElement.currentTime;
    updateTimeBadge();
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
    if (t >= (s.startTime || 0) && t <= (s.endTime || 9999)) {
      return {
        ...s,
        index: i,
        progress: Math.min(1, Math.max(0, (t - (s.startTime || 0)) / Math.max(0.1, (s.endTime - s.startTime) || 1)))
      };
    }
  }
  return { ...state.steps[state.steps.length - 1], index: state.steps.length - 1, progress: 1 };
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
  const bannerY = 465 + bobY * 0.5;
  const bannerW = Math.min(840, Math.max(500, lessonTitle.length * 28 + 120));
  const bannerH = 68;

  ctx.save();
  ctx.translate(cx, bannerY);

  // Sombra del banner
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  // Fondo gradiente dorado
  const grad = ctx.createLinearGradient(-bannerW / 2, 0, bannerW / 2, 0);
  grad.addColorStop(0, "#fbbf24");
  grad.addColorStop(0.5, "#fef08a");
  grad.addColorStop(1, "#f59e0b");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 18);
  ctx.fill();
  ctx.restore();

  // Borde oscuro marcado
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#78350f";
  ctx.beginPath();
  ctx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 18);
  ctx.stroke();

  // Mini etiqueta superior "🔴 TEMA DE HOY"
  const tagW = 150;
  const tagH = 26;
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.roundRect(-tagW / 2, -bannerH / 2 - 13, tagW, tagH, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🔴 TEMA DE HOY", 0, -bannerH / 2);

  // Texto del título
  ctx.font = "900 36px 'Inter', sans-serif";
  ctx.fillStyle = "#1e1b4b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(lessonTitle, 0, 4);

  ctx.restore();
}

/* 1. FONDO DE PIZARRA Y AULA */
function drawWhiteboardBackground(w, h) {
  // Fondo de Aula Ilustrada oficial (Pizarra con marco amarillo, reloj y pupitres)
  if (state.theme === "classroom") {
    const isLandscape = (w > h);
    const bg = isLandscape ? bgClassroomH : bgClassroomV;
    if (bg && bg.complete && bg.naturalWidth > 0) {
      ctx.drawImage(bg, 0, 0, w, h);
      return;
    }
    // Fallback mientras carga la imagen
    ctx.fillStyle = "#81399d";
    ctx.fillRect(0, 0, w, h);
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

  // Pizarra Blanca Acrílica (Estilo Profe Mónica)
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
  const isDark = state.theme.includes("blackboard");
  const mainInk = isDark ? "#ffffff" : "#111827";
  const blueInk = isDark ? "#60a5fa" : "#1d4ed8";
  const redInk = isDark ? "#f87171" : "#b91c1c";

  const isClassroom = (state.theme === "classroom");
  const startY = isClassroom ? 760 : (h * 0.18);
  const rowHeight = isClassroom ? 115 : (h * 0.115);

  let handTargetX = null;
  let handTargetY = null;
  let handAngle = -0.15;
  let isWritingNow = false;

  // 1. TÍTULO DE LA LECCIÓN (FILA 0): Siempre visible y destacado en la cabecera de la pizarra
  const titleStep = state.steps.find(s => s.target === "title") || state.steps[0];
  if (titleStep && titleStep.action === "write") {
    const isCurrentTitle = (currentIdx === 0);
    const rawProgTitle = isCurrentTitle ? (currentStep.progress || 0) : 1;
    // La escritura se realiza en el primer 45% del paso; el 55% restante es para que el usuario lea libremente
    const writeProgTitle = isCurrentTitle ? Math.min(1.0, rawProgTitle / 0.45) : 1;
    const fullTitle = titleStep.text || "";
    const charCount = Math.floor(fullTitle.length * writeProgTitle);
    const textToShow = fullTitle.substring(0, charCount);

    let fontSize = 66;
    ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
    let totalW = ctx.measureText(fullTitle).width;
    if (totalW > 740) {
      fontSize = Math.max(44, Math.floor(fontSize * (740 / totalW)));
      ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
      totalW = ctx.measureText(fullTitle).width;
    }
    const startX = (w / 2) - (totalW / 2);
    ctx.fillStyle = blueInk;
    ctx.textAlign = "left";
    ctx.fillText(textToShow, startX, startY);

    // Solo se considera en escritura activa durante la primera mitad (rawProgTitle < 0.45)
    if (isCurrentTitle && rawProgTitle < 0.45 && fullTitle.length > 0 && state.isPlaying) {
      const textW = ctx.measureText(textToShow).width;
      handTargetX = startX + textW;
      handTargetY = startY - 14;
      handAngle = -0.12;
      isWritingNow = true;
    }
  }

  // 2. CONTENIDO INFERIOR: Se auto-limpia con cada nuevo paso de escritura (no se sobreescribe)
  let activeWriteIdx = -1;
  for (let k = currentIdx; k >= 1; k--) {
    if (state.steps[k] && state.steps[k].action === "write") {
      activeWriteIdx = k;
      break;
    }
  }

  // Si hay un paso de escritura activo posterior al título, dibujamos ese paso y sus derivados (arcos/resaltados)
  if (activeWriteIdx >= 1) {
    const s = state.steps[activeWriteIdx];
    const isCurrent = (activeWriteIdx === currentIdx);
    const rawProg = isCurrent ? (currentStep.progress || 0) : 1;
    // La escritura se completa en el primer 45% del paso; el 55% restante es tiempo para que el usuario lea
    const writeProg = isCurrent ? Math.min(1.0, rawProg / 0.45) : 1;
    const yPos = startY + rowHeight; // Fila 1

    const fullText = s.text || "";
    const charCount = Math.floor(fullText.length * writeProg);
    const textToShow = fullText.substring(0, charCount);

    let fontSize = 72;
    ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
    let totalW = ctx.measureText(fullText).width;
    if (totalW > 740) {
      fontSize = Math.max(44, Math.floor(fontSize * (740 / totalW)));
      ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
      totalW = ctx.measureText(fullText).width;
    }
    const startX = (w / 2) - (totalW / 2);

    ctx.fillStyle = mainInk;
    ctx.textAlign = "left";
    ctx.fillText(textToShow, startX, yPos);

    // Solo escribe activamente con la mano durante el primer 45% del paso
    if (isCurrent && rawProg < 0.45 && fullText.length > 0 && state.isPlaying) {
      const textW = ctx.measureText(textToShow).width;
      handTargetX = startX + textW;
      handTargetY = yPos - 14;
      handAngle = -0.12;
      isWritingNow = true;
    }

    // Dibujar arcos o resaltados pertenecientes a este paso activo
    for (let j = activeWriteIdx + 1; j <= currentIdx; j++) {
      const subStep = state.steps[j];
      if (!subStep) continue;
      const isSubCurrent = (j === currentIdx);
      const subProg = isSubCurrent ? (currentStep.progress || 1) : 1;

      if (subStep.action === "arc") {
        const text = s.text || subStep.text || "";
        ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
        const arcTotalW = ctx.measureText(text).width;
        const arcStartX = (w / 2) - (arcTotalW / 2);
        const charWidth = arcTotalW / Math.max(1, text.length);

        const p1X = arcStartX + (subStep.fromIdx || 0) * charWidth + charWidth / 2;
        const p2X = arcStartX + (subStep.toIdx !== undefined ? subStep.toIdx : (text.length - 1)) * charWidth + charWidth / 2;

        drawCurvedArrow(ctx, p1X, yPos - 58, p2X, yPos - 58, -42, redInk, subProg);

        if (subStep.fromIdx2 !== undefined && subStep.toIdx2 !== undefined) {
          const q1X = arcStartX + subStep.fromIdx2 * charWidth + charWidth / 2;
          const q2X = arcStartX + subStep.toIdx2 * charWidth + charWidth / 2;
          drawCurvedArrow(ctx, q1X, yPos - 52, q2X, yPos - 52, -26, blueInk, subProg);
        }

        if (isSubCurrent && subProg < 0.98 && state.isPlaying) {
          const t = Math.min(1, subProg);
          const midX = (p1X + p2X) / 2;
          const midY = (yPos - 58) - 42;
          handTargetX = (1 - t) * (1 - t) * p1X + 2 * (1 - t) * t * midX + t * t * p2X;
          handTargetY = (1 - t) * (1 - t) * (yPos - 58) + 2 * (1 - t) * t * midY + t * t * (yPos - 58);
          handAngle = Math.atan2(midY - (yPos - 58), p2X - p1X) * 0.4;
          isWritingNow = true;
        }
      } else if (subStep.action === "highlight") {
        ctx.font = `bold ${fontSize}px 'Caveat', 'Kalam', cursive, sans-serif`;
        const hlText = subStep.text || s.text || "";
        const hlTotalW = ctx.measureText(hlText).width;
        const hlStartX = (w / 2) - (hlTotalW / 2);
        const textW = hlTotalW * subProg;

        ctx.fillStyle = "rgba(250, 204, 21, 0.45)";
        ctx.fillRect(hlStartX, yPos - 52, textW, 58);

        ctx.fillStyle = blueInk;
        ctx.textAlign = "left";
        ctx.fillText(hlText, hlStartX, yPos);

        if (isSubCurrent && subProg < 0.98 && state.isPlaying) {
          handTargetX = hlStartX + textW;
          handTargetY = yPos - 22;
          handAngle = -0.05;
          isWritingNow = true;
        }
      }
    }
  }

  // Notificar al motor de sonido sobre el estado de escritura
  soundEngine.updateWriting(isWritingNow, time);
  state.lastHandX = handTargetX;
  state.lastHandY = handTargetY;
  state.isWritingNow = isWritingNow;
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
   Inspirado en la toma real de "La Profe Mónica"
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

  // E. Muñeca y Manga de Chaqueta (Roja para Bellum, Negra para clásica)
  ctx.save();
  const sleeveGrad = ctx.createLinearGradient(70, 90, 160, 180);
  if (isRedTeacher) {
    sleeveGrad.addColorStop(0, "#ef4444");
    sleeveGrad.addColorStop(0.4, "#dc2626");
    sleeveGrad.addColorStop(1, "#991b1b");
  } else {
    sleeveGrad.addColorStop(0, "#27272a");
    sleeveGrad.addColorStop(0.4, "#18181b");
    sleeveGrad.addColorStop(1, "#09090b");
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
  ctx.strokeStyle = isRedTeacher ? "#000000" : "rgba(255, 255, 255, 0.15)";
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
  base: new Image()
};

bellumSprites.base.src = "/avatars/sprites/base_pose.png";

// 8 frames de animación explicando con gestos expresivos (hablando, apuntando, sonriendo)
for (let i = 1; i <= 8; i++) {
  const img = new Image();
  img.src = `/avatars/sprites/talk_${i}.png`;
  bellumSprites.talk.push(img);
}

// 6 frames de animación escribiendo en la pizarra
for (let i = 1; i <= 6; i++) {
  const img = new Image();
  img.src = `/avatars/sprites/write_${i}.png`;
  bellumSprites.write.push(img);
}

// 6 frames de giro hacia la pizarra
for (let i = 1; i <= 6; i++) {
  const img = new Image();
  img.src = `/avatars/sprites/turn_${i}.png`;
  bellumSprites.turn.push(img);
}

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

  const rawProg = currentStep ? (currentStep.progress || 0) : 0;
  const currentStepIdx = currentStep ? currentStep.index : 0;
  const hasBoardText = (state.steps && state.steps.some((s, idx) => s.action === "write" && idx <= currentStepIdx));

  // Posición a un costado (derecha del aula: 853px) para que la pizarra quede 100% visible
  const targetSideX = w * 0.79;
  let teacherX = targetSideX;
  let teacherY = 1750; // Pies firmes en el suelo
  let teacherScale = 0.92;

  // Transición suave: al terminar de trazar la letra (entre 45% y 60% del paso),
  // se aparta elegantemente hacia la derecha para revelar lo que escribió
  if (currentStep && currentStep.action === "write" && rawProg >= 0.45 && rawProg < 0.60 && state.lastHandX) {
    const slideT = (rawProg - 0.45) / 0.15; // 0.0 a 1.0
    const startX = Math.min(targetSideX, state.lastHandX + 160);
    teacherX = (1 - slideT) * startX + slideT * targetSideX;
  } else if (!hasBoardText && currentStepIdx === 0 && rawProg < 0.45) {
    // Si no se ha escrito nada en la pizarra aún, saludo inicial en el centro
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
    drawMonicaAvatar(ctx, blink, mouthOpen, time);
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

/* AVATAR: PROFE MÓNICA (Clásico original) */
function drawMonicaAvatar(ctx, blink, mouthOpen, time) {
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

  const progress = Math.max(0, Math.min(0.999, currentStep.progress || 0));
  const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

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
   GRABACIÓN Y DESCARGA DIRECTA DE VIDEO (MP4)
   ========================================================= */
function toggleRecording() {
  if (state.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  if (state.isRecording) {
    stopRecording();
    return;
  }

  // Si no se ha generado el audio aún, generarlo primero automáticamente
  if (!state.audioElement || !state.audioElement.src) {
    updateStatus("🎙️ Sintetizando lección primero para iniciar la grabación...");
    await generateAndPlay();
    await new Promise(r => setTimeout(r, 600));
  }

  state.isRecording = true;
  state.recordedChunks = [];
  btnRecord.classList.add("btn-accent");
  btnRecord.textContent = "⏹ Detener y Guardar MP4";
  badgeRecording.style.display = "inline-block";

  // Despertar AudioContext si estaba suspendido
  if (!state.audioContext) {
    initAudio();
  }
  if (state.audioContext && state.audioContext.state === "suspended") {
    await state.audioContext.resume();
  }

  // Reiniciar reproducción desde el inicio para captura completa
  state.audioElement.currentTime = 0;
  state.currentTime = 0;

  const canvasStream = canvas.captureStream(30);
  let audioTracks = [];

  try {
    if (!state.destAudioStreamNode) {
      state.destAudioStreamNode = state.audioContext.createMediaStreamDestination();
    }

    if (!state.audioElementSourceNode) {
      state.audioElementSourceNode = state.audioContext.createMediaElementSource(state.audioElement);
      state.audioElementSourceNode.connect(state.destAudioStreamNode);
      state.audioElementSourceNode.connect(state.audioContext.destination);
    }

    if (soundEngine && soundEngine.masterGain) {
      try {
        soundEngine.masterGain.connect(state.destAudioStreamNode);
      } catch (e) {}
    }

    if (state.bgMusicGainNode && state.destAudioStreamNode) {
      try {
        state.bgMusicGainNode.connect(state.destAudioStreamNode);
      } catch (e) {}
    }

    audioTracks = state.destAudioStreamNode.stream.getAudioTracks();
  } catch (e) {
    console.warn("Audio Context ya conectado:", e);
    if (state.destAudioStreamNode) {
      audioTracks = state.destAudioStreamNode.stream.getAudioTracks();
    }
  }

  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioTracks
  ]);

  // Selección de códec compatible con MP4
  const mp4Types = [
    "video/mp4;codecs=avc1,mp4a.40.2",
    "video/mp4;codecs=avc1",
    "video/mp4;codecs=h264,aac",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm"
  ];
  let chosenMime = "video/webm";
  for (let m of mp4Types) {
    if (MediaRecorder.isTypeSupported(m)) {
      chosenMime = m;
      break;
    }
  }
  state.recordingMimeType = chosenMime;

  try {
    state.mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: chosenMime,
      videoBitsPerSecond: 5000000
    });
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

  // Auto-detener y descargar automáticamente cuando finalice el audio de la lección
  state.audioElement.onended = () => {
    state.isPlaying = false;
    btnTogglePlay.textContent = "▶";
    if (state.isRecording) {
      setTimeout(() => {
        stopRecording();
      }, 500);
    }
  };

  state.mediaRecorder.start(250);
  restartAllAudio();
  state.isPlaying = true;
  updateStatus("⏺ Grabando video MP4 con música y pizarra... Se descargará automáticamente al terminar.");
}

function stopRecording() {
  if (!state.isRecording) return;
  state.isRecording = false;
  badgeRecording.style.display = "none";
  btnRecord.textContent = "⏺ Grabar y Descargar Video MP4";

  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    state.mediaRecorder.stop();
  }
}

async function saveRecordedVideo() {
  updateStatus("💾 Procesando y preparando archivo MP4 para descarga...");

  const isNativeMp4 = state.recordingMimeType && state.recordingMimeType.includes("mp4");
  const blobType = isNativeMp4 ? "video/mp4" : "video/webm";
  const rawBlob = new Blob(state.recordedChunks, { type: blobType });

  if (isNativeMp4) {
    downloadBlob(rawBlob, `profe_rochi_${Date.now()}.mp4`);
    return;
  }

  // Si grabó en WebM, intentar conversión en backend a MP4 si está disponible
  try {
    const formData = new FormData();
    formData.append("video", rawBlob, "recording.webm");

    const resp = await fetch("/api/convert-mp4", {
      method: "POST",
      body: formData
    });

    if (resp.ok) {
      const mp4Blob = await resp.blob();
      downloadBlob(mp4Blob, `profe_rochi_${Date.now()}.mp4`);
      return;
    }
  } catch (e) {
    console.warn("Conversión remota no disponible, descargando localmente:", e);
  }

  // Descargar con extensión .mp4
  const mp4Blob = new Blob(state.recordedChunks, { type: "video/mp4" });
  downloadBlob(mp4Blob, `profe_rochi_${Date.now()}.mp4`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    updateStatus("✅ ¡Video MP4 descargado con éxito! Listo para publicar.");
  }, 100);
}
