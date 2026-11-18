(() => {
  'use strict';

  // =========================================================
  // 1. REFERENCIAS DOM Y ESTADO GLOBAL
  // =========================================================
  const bgCanvas = document.getElementById('bgCanvas');
  const bgCtx = bgCanvas.getContext('2d');
  const glCanvas = document.getElementById('glCanvas');
  const hudCanvas = document.getElementById('hudCanvas');
  const hudCtx = hudCanvas.getContext('2d');
  const stageWrapper = document.getElementById('stageWrapper');
  const recIndicator = document.getElementById('recIndicator');

  const aspectSelect = document.getElementById('aspectSelect');
  const cameraSelect = document.getElementById('cameraSelect');
  const moodSelect = document.getElementById('moodSelect');
  const avatarSelect = document.getElementById('avatarSelect');
  const customAvatarInput = document.getElementById('customAvatarInput');
  const capeToggle = document.getElementById('capeToggle');
  const avatarStatus = document.getElementById('avatarStatus');
  const heroNameInput = document.getElementById('heroNameInput');
  const headlineInput = document.getElementById('headlineInput');
  const contextInput = document.getElementById('contextInput');
  const heroizeBtn = document.getElementById('heroizeBtn');
  const screenModeSelect = document.getElementById('screenModeSelect');
  const galleryStyleSelect = document.getElementById('galleryStyleSelect');
  const imageFitSelect = document.getElementById('imageFitSelect');
  const addImagesBtn = document.getElementById('addImagesBtn');
  const newsImagesInput = document.getElementById('newsImagesInput');
  const clearImagesBtn = document.getElementById('clearImagesBtn');
  const imageThumbs = document.getElementById('imageThumbs');
  const imagesStatus = document.getElementById('imagesStatus');

  const voiceSelect = document.getElementById('voiceSelect');
  const fxSelect = document.getElementById('fxSelect');
  const pitchRange = document.getElementById('pitchRange');
  const pitchVal = document.getElementById('pitchVal');
  const rateRange = document.getElementById('rateRange');
  const rateVal = document.getElementById('rateVal');
  const audioFileInput = document.getElementById('audioFileInput');
  const clearAudioBtn = document.getElementById('clearAudioBtn');
  const audioStatus = document.getElementById('audioStatus');

  const broadcastBtn = document.getElementById('broadcastBtn');
  const stopBtn = document.getElementById('stopBtn');
  const recordBtn = document.getElementById('recordBtn');

  const MOODS = {
    epic: {
      label: 'TRANSMISIÓN HEROICA',
      accent: '#00e5ff',
      secondary: '#ffcc33',
      bgTop: 0x07132c,
      rimColor: 0x00e5ff,
      eyeColor: 0x66ffff,
      browAngle: 0.14,
      capeSpeed: 3.4,
    },
    alert: {
      label: 'ALERTA ROJA',
      accent: '#ff2e54',
      secondary: '#ffae00',
      bgTop: 0x260812,
      rimColor: 0xff2e54,
      eyeColor: 0xff5566,
      browAngle: 0.34,
      capeSpeed: 5.2,
    },
    tech: {
      label: 'REPORTE CYBER',
      accent: '#00ffa6',
      secondary: '#38bdf8',
      bgTop: 0x051f24,
      rimColor: 0x00ffa6,
      eyeColor: 0x55ffcc,
      browAngle: 0.08,
      capeSpeed: 2.8,
    },
    chill: {
      label: 'EDICIÓN ESPECIAL',
      accent: '#a855f7',
      secondary: '#fbbf24',
      bgTop: 0x160c2e,
      rimColor: 0xc084fc,
      eyeColor: 0xffe066,
      browAngle: -0.05,
      capeSpeed: 2.2,
    },
  };

  const state = {
    aspect: '9:16',
    width: 720,
    height: 1280,
    mood: 'epic',
    cameraMode: 'auto',
    isSpeaking: false,
    isRecording: false,
    speechEnergy: 0,
    targetSpeechEnergy: 0,
    speechPulseTime: 0,
    currentSubtitle: '',
    subtitleWords: [],
    wordTimings: [],
    activeWordIndex: -1,
    tickerX: 0,
    customAudioUrl: null,
    customAudioName: '',
    screenMode: 'backdrop',
    galleryStyle: 'carousel',
    imageFit: 'contain',
    newsImages: [], // hasta 5: [{ id, url, name, img, blurCanvas }]
    activeImageIndex: 0,
    prevImageIndex: -1,
    imageTransition: 1,
    imageCycleTimer: 0,
    blinkTimer: 2.5,
    blinkProgress: 0,
    gesturePhase: 0,
    autoCamIndex: 0,
    autoCamTimer: 0,
  };

  // =========================================================
  // 2. ESCENA THREE.JS (ESTILO VIDEOJUEGO TOON / CEL-SHADING)
  // =========================================================
  const renderer = new THREE.WebGLRenderer({
    canvas: glCanvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(MOODS.epic.bgTop);
  scene.fog = new THREE.FogExp2(0x07132c, 0.032);

  const camera = new THREE.PerspectiveCamera(36, 9 / 16, 0.1, 100);
  camera.position.set(0, 1.55, 5.2);

  // Textura gradiente de 4 tonos para efecto Cel-Shading (estilo cómic / videojuego)
  function createToonGradient() {
    const colors = new Uint8Array([
      70, 70, 85, 255,
      135, 135, 150, 255,
      205, 205, 215, 255,
      255, 255, 255, 255,
    ]);
    const tex = new THREE.DataTexture(colors, 4, 1, THREE.RGBAFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }
  const toonGradient = createToonGradient();

  function toonMat(color, emissive = 0x000000, emissiveIntensity = 0) {
    return new THREE.MeshToonMaterial({
      color,
      gradientMap: toonGradient,
      emissive,
      emissiveIntensity,
    });
  }

  // Luces del estudio (piel humana natural, sin sobreexposición)
  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.72);
  scene.add(hemiLight);

  const ambientLight = new THREE.AmbientLight(0xbcd0ff, 0.32);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.02);
  keyLight.position.set(2.2, 4.2, 4.5);
  scene.add(keyLight);

  const frontFillLight = new THREE.DirectionalLight(0xe0f2fe, 0.36);
  frontFillLight.position.set(-2.0, 2.2, 3.8);
  scene.add(frontFillLight);

  const rimLight = new THREE.DirectionalLight(MOODS.epic.rimColor, 1.35);
  rimLight.position.set(-3.0, 2.6, -2.5);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xffbb55, 0.45, 12);
  fillLight.position.set(2.4, 1.6, 2.0);
  scene.add(fillLight);

  // =========================================================
  // 3. PERSONAJE SUPERHÉROE 3D PROCEDURAL (SIEMPRE EL MISMO)
  // =========================================================
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  const matSuitBlue = toonMat(0x1642a8);
  const matSuitDark = toonMat(0x0d2152);
  const matRed = toonMat(0xe11d48);
  const matGold = toonMat(0xffc933, 0xaa6600, 0.2);
  const matSkin = toonMat(0xf2be9b);
  const matEyeGlow = new THREE.MeshBasicMaterial({ color: MOODS.epic.eyeColor });
  const matEmblemGlow = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
  const matMouthInside = new THREE.MeshBasicMaterial({ color: 0x260912 });
  const matTeeth = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // Torso superior (pecho ancho heroico)
  const bodyGroup = new THREE.Group();
  heroGroup.add(bodyGroup);

  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.44, 1.05, 8), matSuitBlue);
  chest.position.set(0, 0.78, 0);
  chest.scale.set(1.12, 1, 0.72);
  bodyGroup.add(chest);

  // Detalle lateral oscuro del traje
  const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.48, 0.35, 8), matSuitDark);
  waist.position.set(0, 0.12, 0);
  waist.scale.set(1.06, 1, 0.72);
  bodyGroup.add(waist);

  // Cinturón dorado + hebilla brillante
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.14, 10), matGold);
  belt.position.set(0, 0.25, 0);
  belt.scale.set(1.08, 1, 0.75);
  bodyGroup.add(belt);

  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.17, 0.12), matEmblemGlow);
  buckle.position.set(0, 0.25, 0.33);
  bodyGroup.add(buckle);

  // Emblema heroico en el pecho (escudo + rayo)
  const emblemShield = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.08, 6), matGold);
  emblemShield.rotation.x = Math.PI / 2;
  emblemShield.position.set(0, 0.94, 0.43);
  bodyGroup.add(emblemShield);

  const emblemCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), matEmblemGlow);
  emblemCore.scale.set(0.85, 1.15, 0.4);
  emblemCore.position.set(0, 0.94, 0.47);
  bodyGroup.add(emblemCore);

  // Hombreras estilizadas
  [-1, 1].forEach((side) => {
    const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), matRed);
    pauldron.scale.set(1.15, 0.85, 0.95);
    pauldron.position.set(side * 0.74, 1.18, 0);
    bodyGroup.add(pauldron);

    const trim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 6, 12), matGold);
    trim.rotation.y = Math.PI / 2;
    trim.position.set(side * 0.72, 1.14, 0);
    bodyGroup.add(trim);
  });

  // Cuello
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.24, 8), matSuitDark);
  neck.position.set(0, 1.38, 0);
  bodyGroup.add(neck);

  // Brazos articulados (para gesticular al dar noticias)
  function createArm(side) {
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(side * 0.78, 1.12, 0);

    const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.42, 6, 8), matSuitBlue);
    upperArm.position.set(0, -0.26, 0);
    shoulderPivot.add(upperArm);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, -0.52, 0);
    shoulderPivot.add(elbowPivot);

    const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.36, 6, 8), matRed);
    forearm.position.set(0, -0.22, 0.06);
    forearm.rotation.x = -0.25;
    elbowPivot.add(forearm);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.07, 8), matGold);
    cuff.position.set(0, -0.05, 0.02);
    elbowPivot.add(cuff);

    const fist = new THREE.Mesh(new THREE.DodecahedronGeometry(0.13, 0), matRed);
    fist.position.set(0, -0.44, 0.14);
    elbowPivot.add(fist);

    return { shoulderPivot, elbowPivot };
  }

  const leftArm = createArm(-1);
  const rightArm = createArm(1);
  bodyGroup.add(leftArm.shoulderPivot);
  bodyGroup.add(rightArm.shoulderPivot);

  // Capa heroica animada con ondas de viento
  const capeGeo = new THREE.PlaneGeometry(1.45, 1.85, 8, 10);
  const capeBasePositions = capeGeo.attributes.position.array.slice();
  const capeMat = new THREE.MeshToonMaterial({
    color: 0xe11d48,
    gradientMap: toonGradient,
    side: THREE.DoubleSide,
  });
  const cape = new THREE.Mesh(capeGeo, capeMat);
  cape.position.set(0, 0.42, -0.46);
  cape.rotation.x = 0.14;
  bodyGroup.add(cape);

  // Cabeza + Máscara + Ojos brillantes + Boca animada (Lip-Sync)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.54, 0);
  bodyGroup.add(headGroup);

  // Cráneo / rostro inferior (piel)
  const faceLower = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.46, 0.52), matSkin);
  faceLower.position.set(0, 0.18, 0.02);
  headGroup.add(faceLower);

  // Mentón heroico marcado
  const chin = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.48), matSkin);
  chin.position.set(0, -0.05, 0.05);
  headGroup.add(chin);

  // Casco / Capucha azul de superhéroe (parte superior)
  const cowlTop = new THREE.Mesh(new THREE.SphereGeometry(0.39, 12, 10), matSuitBlue);
  cowlTop.scale.set(0.95, 1.0, 1.04);
  cowlTop.position.set(0, 0.40, -0.02);
  headGroup.add(cowlTop);

  // Antifaz / Visor frontal del casco
  const maskBand = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.24, 0.56), matSuitBlue);
  maskBand.position.set(0, 0.34, 0.03);
  headGroup.add(maskBand);

  // Cresta dorada del casco
  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.20, 0.55), matGold);
  crest.position.set(0, 0.72, -0.02);
  crest.rotation.x = -0.15;
  headGroup.add(crest);

  // Aletas aerodinámicas laterales en la máscara (estilo Flash / Capitán)
  [-1, 1].forEach((side) => {
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.34, 4), matGold);
    fin.position.set(side * 0.36, 0.40, -0.05);
    fin.rotation.z = side * -0.45;
    fin.rotation.x = -0.55;
    headGroup.add(fin);
  });

  // Ojos brillantes + Cejas expresivas
  const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.075, 0.05), matEyeGlow);
  leftEye.position.set(-0.13, 0.34, 0.31);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.075, 0.05), matEyeGlow);
  rightEye.position.set(0.13, 0.34, 0.31);
  headGroup.add(rightEye);

  const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.06), matSuitDark);
  leftBrow.position.set(-0.13, 0.42, 0.32);
  headGroup.add(leftBrow);

  const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.06), matSuitDark);
  rightBrow.position.set(0.13, 0.42, 0.32);
  headGroup.add(rightBrow);

  // Nariz sutil estilizada
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.11, 4), matSkin);
  nose.position.set(0, 0.22, 0.30);
  nose.rotation.x = 0.2;
  headGroup.add(nose);

  // Boca animada (lip-sync)
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, 0.07, 0.285);
  headGroup.add(mouthGroup);

  const mouthOpening = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), matMouthInside);
  mouthGroup.add(mouthOpening);

  const upperTeeth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.028, 0.045), matTeeth);
  upperTeeth.position.set(0, 0.015, 0.005);
  mouthGroup.add(upperTeeth);

  // =========================================================
  // 3B. AVATAR HUMANO 3D REALISTA (GLB + ARKit / VISEMES)
  // =========================================================
  const AVATAR_PRESETS = {
    avatarsdk: { url: 'avatars/avatarsdk.glb', label: 'Hombre Realista 3D (Noticiero)' },
    avaturn: { url: 'avatars/avaturn.glb', label: 'Mujer Realista 3D (Traje Ejecutivo)' },
    brunette: { url: 'avatars/brunette.glb', label: 'Mujer Estilizada 3D (Presentadora)' },
  };

  const humanContainer = new THREE.Group();
  scene.add(humanContainer);

  // Capa heroica opcional detrás del avatar humano (carmesí oscuro estilizado)
  const humanCapeGeo = new THREE.PlaneGeometry(1.18, 1.55, 8, 10);
  const humanCapePosAttr = humanCapeGeo.attributes.position;
  for (let i = 0; i < humanCapePosAttr.count; i++) {
    const x = humanCapePosAttr.getX(i);
    const y = humanCapePosAttr.getY(i);
    // Forma trapezoidal: más angosta en hombros, más ancha abajo
    const topFactor = Math.max(0, (y + 0.775) / 1.55);
    humanCapePosAttr.setX(i, x * (1.15 - topFactor * 0.48));
  }
  const humanCapeBase = humanCapeGeo.attributes.position.array.slice();
  const humanCapeMat = new THREE.MeshStandardMaterial({
    color: 0x8f0f24,
    roughness: 0.82,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  const humanCape = new THREE.Mesh(humanCapeGeo, humanCapeMat);
  humanCape.position.set(0, 0.38, -0.32);
  humanCape.rotation.x = 0.16;
  humanCape.visible = false;
  humanContainer.add(humanCape);

  const gltfLoader = typeof THREE.GLTFLoader !== 'undefined' ? new THREE.GLTFLoader() : null;
  const humanState = {
    mode: 'avatarsdk',
    model: null,
    morphMeshes: [],
    bones: {},
    restRot: {},
    armDropRad: 1.22,
    loadingId: 0,
  };

  function setHumanMorph(name, value) {
    for (let i = 0; i < humanState.morphMeshes.length; i++) {
      const m = humanState.morphMeshes[i];
      const idx = m.morphTargetDictionary[name];
      if (idx !== undefined) {
        m.morphTargetInfluences[idx] = value;
      }
    }
  }

  function clearHumanModel() {
    if (humanState.model) {
      humanContainer.remove(humanState.model);
      humanState.model.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((mat) => mat && mat.dispose && mat.dispose());
        }
      });
      humanState.model = null;
    }
    humanState.morphMeshes = [];
    humanState.bones = {};
    humanState.restRot = {};
  }

  function updateCapeVisibility() {
    const showCape = capeToggle ? capeToggle.checked : true;
    cape.visible = showCape;
    humanCape.visible = showCape && humanState.mode !== 'procedural' && !!humanState.model;
  }

  function loadHumanAvatar(url, label) {
    if (!gltfLoader) {
      avatarStatus.textContent = 'GLTFLoader no disponible; usando héroe clásico.';
      switchAvatarMode('procedural');
      return;
    }

    const reqId = ++humanState.loadingId;
    avatarStatus.textContent = `Cargando ${label}...`;

    gltfLoader.load(
      url,
      (gltf) => {
        if (reqId !== humanState.loadingId) return;

        clearHumanModel();
        const model = gltf.scene;
        humanState.model = model;

        // Recolectar morph targets faciales y huesos principales
        model.traverse((obj) => {
          if (obj.isMesh) {
            obj.frustumCulled = false;
            if (obj.morphTargetDictionary && obj.morphTargetInfluences) {
              humanState.morphMeshes.push(obj);
            }
            // Evitar que la niebla azul apague la piel/rostro del humano
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((mat) => {
              if (mat) {
                mat.fog = false;
                if (mat.roughness !== undefined && mat.roughness < 0.25) {
                  mat.roughness = 0.35;
                }
              }
            });
          }
          if (obj.isBone) {
            const n = obj.name;
            if (/head$/i.test(n) && !humanState.bones.head) humanState.bones.head = obj;
            else if (/neck$/i.test(n) && !humanState.bones.neck) humanState.bones.neck = obj;
            else if (/spine2$/i.test(n) && !humanState.bones.spine2) humanState.bones.spine2 = obj;
            else if (/spine1$/i.test(n) && !humanState.bones.spine1) humanState.bones.spine1 = obj;
            else if (/leftarm$/i.test(n) && !humanState.bones.leftArm) humanState.bones.leftArm = obj;
            else if (/rightarm$/i.test(n) && !humanState.bones.rightArm) humanState.bones.rightArm = obj;
            else if (/leftforearm$/i.test(n) && !humanState.bones.leftForeArm) humanState.bones.leftForeArm = obj;
            else if (/rightforearm$/i.test(n) && !humanState.bones.rightForeArm) humanState.bones.rightForeArm = obj;
          }
        });

        // Escalar para plano medio tipo presentador de TV (pecho arriba bien nítido)
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const targetHeight = 3.15;
        const scale = size.y > 0.01 ? targetHeight / size.y : 1.75;
        model.scale.setScalar(scale);

        model.updateMatrixWorld(true);
        const scaledBox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        scaledBox.getCenter(center);

        // Alinear la cabeza al nivel ideal del noticiero (y = 1.46)
        let headY = scaledBox.max.y - 0.28;
        if (humanState.bones.head) {
          const headWorld = new THREE.Vector3();
          humanState.bones.head.getWorldPosition(headWorld);
          headY = headWorld.y;
        }

        model.position.set(-center.x, 1.46 - headY, 0.22 - center.z);
        model.updateMatrixWorld(true);

        // Detectar cuánto bajar los brazos (T-pose vs A-pose)
        humanState.armDropRad = 1.24;
        if (humanState.bones.leftArm && humanState.bones.leftForeArm) {
          const aPos = new THREE.Vector3();
          const fPos = new THREE.Vector3();
          humanState.bones.leftArm.getWorldPosition(aPos);
          humanState.bones.leftForeArm.getWorldPosition(fPos);
          const armLen = Math.max(0.01, aPos.distanceTo(fPos));
          const dropRatio = (aPos.y - fPos.y) / armLen;
          if (dropRatio > 0.72) humanState.armDropRad = 0.25;
          else if (dropRatio > 0.35) humanState.armDropRad = 0.55;
          else humanState.armDropRad = 1.26;
        }

        // Guardar rotaciones base de huesos para animar encima sin deformar
        Object.keys(humanState.bones).forEach((k) => {
          const b = humanState.bones[k];
          humanState.restRot[k] = b.rotation.clone();
        });

        humanContainer.add(model);
        heroGroup.visible = false;
        humanContainer.visible = true;
        updateCapeVisibility();

        const hasLipSync = humanState.morphMeshes.length > 0;
        avatarStatus.textContent = hasLipSync
          ? `Listo: ${label} (Lip-Sync facial real activado)`
          : `Listo: ${label}`;
      },
      undefined,
      (err) => {
        console.error('Error cargando avatar GLB:', err);
        if (reqId !== humanState.loadingId) return;
        avatarStatus.textContent = 'No se pudo cargar el .glb; mostrando héroe clásico.';
        switchAvatarMode('procedural');
      }
    );
  }

  function switchAvatarMode(mode) {
    humanState.mode = mode;
    if (mode === 'procedural') {
      heroGroup.visible = true;
      humanContainer.visible = false;
      updateCapeVisibility();
      avatarStatus.textContent = 'Usando Superhéroe Low-Poly clásico.';
      return;
    }

    const preset = AVATAR_PRESETS[mode];
    if (preset) {
      loadHumanAvatar(preset.url, preset.label);
    }
  }

  function animateHumanAvatar(t, dt, openAmt, blinkScale) {
    if (!humanState.model || humanState.mode === 'procedural') return;

    const mood = MOODS[state.mood];
    const b = humanState.bones;
    const r = humanState.restRot;

    // 1) Lip-Sync realista y natural (apertura moderada sin exagerar la lengua)
    const smoothOpen = Math.min(1, openAmt * 0.85);
    const vowelA = Math.max(0, Math.sin(t * 11.5)) * smoothOpen;
    const vowelO = Math.max(0, Math.sin(t * 8.3 + 2.0)) * smoothOpen;
    const vowelE = Math.max(0, Math.cos(t * 13.0 + 1.0)) * smoothOpen;

    setHumanMorph('jawOpen', Math.min(0.32, smoothOpen * 0.30));
    setHumanMorph('mouthOpen', Math.min(0.24, smoothOpen * 0.22));
    setHumanMorph('viseme_aa', Math.min(0.45, vowelA * 0.42));
    setHumanMorph('viseme_O', Math.min(0.40, vowelO * 0.36));
    setHumanMorph('viseme_E', Math.min(0.35, vowelE * 0.32));
    setHumanMorph('viseme_I', Math.min(0.30, vowelE * 0.26));

    // 2) Parpadeo natural humano
    const blinkAmt = 1 - blinkScale;
    setHumanMorph('eyeBlinkLeft', blinkAmt);
    setHumanMorph('eyeBlinkRight', blinkAmt);
    setHumanMorph('eyesClosed', blinkAmt);

    // 3) Expresión facial según el estado / mood
    const smileTarget = state.mood === 'chill' ? 0.42 : state.mood === 'alert' ? 0.0 : 0.16;
    const browTarget = state.mood === 'alert' ? 0.42 : state.mood === 'epic' ? 0.14 : 0.0;
    setHumanMorph('mouthSmile', smileTarget);
    setHumanMorph('mouthSmileLeft', smileTarget);
    setHumanMorph('mouthSmileRight', smileTarget);
    setHumanMorph('browDownLeft', browTarget);
    setHumanMorph('browDownRight', browTarget);
    setHumanMorph('eyeWideLeft', state.mood === 'alert' ? 0.18 : 0.0);
    setHumanMorph('eyeWideRight', state.mood === 'alert' ? 0.18 : 0.0);

    // 4) Movimiento natural de cabeza, cuello y respiración corporal
    if (b.head && r.head) {
      b.head.rotation.y = r.head.y + Math.sin(t * (state.isSpeaking ? 2.1 : 0.8)) * (state.isSpeaking ? 0.12 : 0.05);
      b.head.rotation.x = r.head.x + Math.sin(t * 2.8) * (state.isSpeaking ? 0.06 : 0.02);
      b.head.rotation.z = r.head.z + Math.sin(t * 1.4) * (state.isSpeaking ? 0.045 : 0.015);
    }
    if (b.neck && r.neck) {
      b.neck.rotation.y = r.neck.y + Math.sin(t * 1.1) * 0.04;
    }
    if (b.spine2 && r.spine2) {
      b.spine2.rotation.x = r.spine2.x + Math.sin(t * 1.8) * 0.025;
      b.spine2.rotation.y = r.spine2.y + Math.sin(t * (state.isSpeaking ? 1.5 : 0.6)) * 0.03;
    }

    // 5) Postura relajada de presentador (rotación en eje X local baja ambos brazos naturalmente)
    const armDrop = humanState.armDropRad;
    const speakGesture = state.isSpeaking ? Math.sin(t * 2.8) * 0.06 : 0;
    if (b.leftArm && r.leftArm) {
      b.leftArm.rotation.x = r.leftArm.x + armDrop - Math.abs(speakGesture);
      b.leftArm.rotation.z = r.leftArm.z - 0.08;
    }
    if (b.rightArm && r.rightArm) {
      b.rightArm.rotation.x = r.rightArm.x + armDrop - Math.abs(speakGesture * 0.8);
      b.rightArm.rotation.z = r.rightArm.z + 0.08;
    }
    if (b.leftForeArm && r.leftForeArm) {
      b.leftForeArm.rotation.z = r.leftForeArm.z + 0.22 + speakGesture;
      b.leftForeArm.rotation.x = r.leftForeArm.x + 0.14;
    }
    if (b.rightForeArm && r.rightForeArm) {
      b.rightForeArm.rotation.z = r.rightForeArm.z - 0.22 - speakGesture;
      b.rightForeArm.rotation.x = r.rightForeArm.x + 0.14;
    }

    // 6) Capa heroica ondeando detrás del humano (si está activada)
    if (humanCape.visible) {
      const posAttr = humanCapeGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const bx = humanCapeBase[i * 3];
        const by = humanCapeBase[i * 3 + 1];
        const bz = humanCapeBase[i * 3 + 2];
        const weight = Math.max(0, (0.875 - by) / 1.75);
        const wave = Math.sin(t * mood.capeSpeed + by * 3.0 + bx * 2.0) * 0.20 * weight;
        posAttr.setZ(i, bz + wave - weight * 0.16);
      }
      posAttr.needsUpdate = true;
      humanCapeGeo.computeVertexNormals();
    }
  }

  // =========================================================
  // 4. ESTUDIO DE NOTICIAS + CIUDAD NOCTURNA + HOLOGRAMA
  // =========================================================
  // Escritorio futurista de noticiero
  const deskGroup = new THREE.Group();
  deskGroup.position.set(0, -0.35, 1.05);
  scene.add(deskGroup);

  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 0.14, 1.15),
    toonMat(0x131d36)
  );
  deskTop.position.set(0, 0.45, 0);
  deskGroup.add(deskTop);

  const deskBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.9, 0.9),
    toonMat(0x0b1224)
  );
  deskBody.position.set(0, -0.05, 0);
  deskGroup.add(deskBody);

  const deskNeonMat = new THREE.MeshBasicMaterial({ color: MOODS.epic.rimColor });
  const deskTrim = new THREE.Mesh(new THREE.BoxGeometry(3.84, 0.045, 1.18), deskNeonMat);
  deskTrim.position.set(0, 0.45, 0.01);
  deskGroup.add(deskTrim);

  // Micrófono flotante/cyber en el escritorio
  const micStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.42, 6), toonMat(0x334155));
  micStand.position.set(0.75, 0.68, -0.1);
  micStand.rotation.z = 0.25;
  deskGroup.add(micStand);

  const micHead = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.08, 4, 8), toonMat(0x1e293b));
  micHead.position.set(0.68, 0.90, -0.1);
  micHead.rotation.z = 0.45;
  deskGroup.add(micHead);

  // Pantalla TV / Holográfica detrás del héroe (HD 1024x640 para fotos reales nítidas)
  const holoCanvas = document.createElement('canvas');
  holoCanvas.width = 1024;
  holoCanvas.height = 640;
  const holoCtx = holoCanvas.getContext('2d');
  const holoTexture = new THREE.CanvasTexture(holoCanvas);
  holoTexture.encoding = THREE.sRGBEncoding;
  holoTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const holoGroup = new THREE.Group();
  scene.add(holoGroup);

  const holoFrameMat = new THREE.MeshBasicMaterial({ color: 0x0b1328, fog: false });
  const holoFrame = new THREE.Mesh(new THREE.BoxGeometry(2.44, 1.56, 0.06), holoFrameMat);
  holoFrame.position.set(0, 0, -0.04);
  holoGroup.add(holoFrame);

  const holoMat = new THREE.MeshBasicMaterial({
    map: holoTexture,
    transparent: true,
    opacity: 0.98,
    fog: false,
  });
  const holoScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.34, 1.46), holoMat);
  holoGroup.add(holoScreen);

  // Helpers responsivos + Galería Elegante (hasta 5 imágenes)
  const MAX_NEWS_IMAGES = 5;

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
  }

  function createBlurCanvas(img) {
    const c = document.createElement('canvas');
    c.width = 240;
    c.height = 240;
    const cctx = c.getContext('2d');
    cctx.filter = 'blur(18px) brightness(0.42) saturate(1.15)';
    drawImageCover(cctx, img, -20, -20, 280, 280, 1.12, 0.25);
    cctx.filter = 'none';
    return c;
  }

  function drawImageCover(ctx, img, x, y, w, h, zoom = 1.0, alignY = 0.08) {
    const srcW = img.naturalWidth || img.width || 1;
    const srcH = img.naturalHeight || img.height || 1;
    const imgRatio = srcW / Math.max(1, srcH);
    const boxRatio = w / Math.max(1, h);
    let drawW, drawH;
    if (imgRatio > boxRatio) {
      drawH = h * zoom;
      drawW = drawH * imgRatio;
    } else {
      drawW = w * zoom;
      drawH = drawW / imgRatio;
    }
    const dx = x + (w - drawW) / 2;
    const dy = y + (h - drawH) * alignY;
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }

  function computeContainRect(img, x, y, w, h, pad = 0) {
    const innerW = Math.max(1, w - pad * 2);
    const innerH = Math.max(1, h - pad * 2);
    const srcW = img.naturalWidth || img.width || 1;
    const srcH = img.naturalHeight || img.height || 1;
    const imgRatio = srcW / Math.max(1, srcH);
    const boxRatio = innerW / innerH;
    let drawW, drawH;
    if (imgRatio > boxRatio) {
      drawW = innerW;
      drawH = drawW / imgRatio;
    } else {
      drawH = innerH;
      drawW = drawH * imgRatio;
    }
    const dx = x + (w - drawW) / 2;
    const dy = y + (h - drawH) / 2;
    return { dx, dy, drawW, drawH };
  }

  function drawBlurredBackdrop(ctx, item, x, y, w, h) {
    if (item && item.blurCanvas) {
      ctx.drawImage(item.blurCanvas, x, y, w, h);
      return;
    }
    if (item && item.img) {
      ctx.save();
      ctx.filter = 'blur(24px) brightness(0.42)';
      drawImageCover(ctx, item.img, x - 24, y - 24, w + 48, h + 48, 1.08, 0.25);
      ctx.restore();
    }
  }

  function drawPhotoCard(ctx, item, x, y, w, h, opts = {}) {
    const {
      radius = 14,
      borderColor = '#00e5ff',
      borderWidth = 3,
      fitMode = 'contain',
      alpha = 1,
      zoom = 1.0,
      shadow = true,
      glowColor = null,
    } = opts;

    ctx.save();
    ctx.globalAlpha = alpha;

    let rx = x;
    let ry = y;
    let rw = w;
    let rh = h;

    if (fitMode === 'contain') {
      const r = computeContainRect(item.img, x, y, w, h, 0);
      rx = r.dx;
      ry = r.dy;
      rw = r.drawW;
      rh = r.drawH;
    }

    if (shadow) {
      ctx.save();
      ctx.shadowColor = glowColor || 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = glowColor ? 26 : 22;
      ctx.shadowOffsetY = glowColor ? 0 : 8;
      ctx.fillStyle = '#070c1a';
      roundRect(ctx, rx, ry, rw, rh, radius);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    roundRect(ctx, rx, ry, rw, rh, radius);
    ctx.clip();
    if (fitMode === 'contain') {
      const zw = rw * zoom;
      const zh = rh * zoom;
      ctx.drawImage(item.img, rx + (rw - zw) / 2, ry + (rh - zh) / 2, zw, zh);
    } else {
      drawImageCover(ctx, item.img, rx, ry, rw, rh, zoom, 0.08);
    }
    ctx.restore();

    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      roundRect(ctx, rx, ry, rw, rh, radius);
      ctx.stroke();
    }

    ctx.restore();
    return { rx, ry, rw, rh };
  }

  function drawPaginationDots(ctx, centerX, y, total, activeIdx, mood) {
    if (total <= 1) return;
    const pillW = total * 22 + 24;
    const pillH = 22;
    ctx.save();
    ctx.fillStyle = 'rgba(6, 12, 28, 0.78)';
    roundRect(ctx, centerX - pillW / 2, y - pillH / 2, pillW, pillH, 11);
    ctx.fill();

    const startX = centerX - ((total - 1) * 20) / 2;
    for (let i = 0; i < total; i++) {
      const isAct = i === activeIdx;
      ctx.fillStyle = isAct ? mood.secondary : 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(startX + i * 20, y, isAct ? 5.5 : 3.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function getMosaicSlots(count, x, y, w, h, gap) {
    if (count === 1) return [{ x, y, w, h }];
    if (count === 2) {
      const cw = (w - gap) / 2;
      return [
        { x, y, w: cw, h },
        { x: x + cw + gap, y, w: cw, h },
      ];
    }
    if (count === 3) {
      const topH = h * 0.56 - gap / 2;
      const botH = h - topH - gap;
      const cw = (w - gap) / 2;
      return [
        { x, y, w, h: topH },
        { x, y: y + topH + gap, w: cw, h: botH },
        { x: x + cw + gap, y: y + topH + gap, w: cw, h: botH },
      ];
    }
    if (count === 4) {
      const cw = (w - gap) / 2;
      const ch = (h - gap) / 2;
      return [
        { x, y, w: cw, h: ch },
        { x: x + cw + gap, y, w: cw, h: ch },
        { x, y: y + ch + gap, w: cw, h: ch },
        { x: x + cw + gap, y: y + ch + gap, w: cw, h: ch },
      ];
    }
    // 5 imágenes: 2 protagonistas arriba + 3 elegantes abajo
    const topH = h * 0.54 - gap / 2;
    const botH = h - topH - gap;
    const topW = (w - gap) / 2;
    const botW = (w - gap * 2) / 3;
    return [
      { x, y, w: topW, h: topH },
      { x: x + topW + gap, y, w: topW, h: topH },
      { x, y: y + topH + gap, w: botW, h: botH },
      { x: x + botW + gap, y: y + topH + gap, w: botW, h: botH },
      { x: x + (botW + gap) * 2, y: y + topH + gap, w: botW, h: botH },
    ];
  }

  function drawElegantGalleryInBox(ctx, boxX, boxY, boxW, boxH, mood, time) {
    const imgs = state.newsImages;
    const count = imgs.length;
    if (count === 0) return;

    const actIdx = state.activeImageIndex % count;
    const activeItem = imgs[actIdx];
    const prevItem =
      state.prevImageIndex >= 0 && state.prevImageIndex < count ? imgs[state.prevImageIndex] : null;
    const ease = easeOutCubic(state.imageTransition);
    const style = state.galleryStyle;

    // A) MOSAICO ELEGANTE (todas las 2..5 imágenes a la vez detrás del avatar)
    if (style === 'mosaic' && count > 1) {
      const gap = 12;
      const slots = getMosaicSlots(count, boxX, boxY, boxW, boxH - 22, gap);

      // Primero dibujar las no activas y al final la activa para que su brillo quede arriba
      slots.forEach((slot, idx) => {
        if (idx === actIdx) return;
        drawPhotoCard(ctx, imgs[idx], slot.x, slot.y, slot.w, slot.h, {
          radius: 13,
          borderColor: 'rgba(255, 255, 255, 0.25)',
          borderWidth: 2,
          fitMode: 'cover-top',
          alpha: 0.84,
          zoom: 1.0,
          shadow: true,
        });
      });

      const actSlot = slots[actIdx];
      const pop = 4 * ease;
      drawPhotoCard(
        ctx,
        imgs[actIdx],
        actSlot.x - pop,
        actSlot.y - pop,
        actSlot.w + pop * 2,
        actSlot.h + pop * 2,
        {
          radius: 14,
          borderColor: mood.secondary,
          borderWidth: 4,
          fitMode: state.imageFit === 'contain' && count <= 2 ? 'contain' : 'cover-top',
          alpha: 1,
          zoom: 1.02 + Math.sin(time * 0.8) * 0.015,
          shadow: true,
          glowColor: mood.secondary,
        }
      );

      drawPaginationDots(ctx, boxX + boxW / 2, boxY + boxH - 4, count, actIdx, mood);
      return;
    }

    // B) CARRUSEL ELEGANTE (con tarjetas laterales asomando + deslizamiento suave)
    if (style === 'carousel') {
      const cardAreaH = count > 1 ? boxH - 30 : boxH;
      const sidePad = count > 1 ? Math.round(boxW * 0.11) : 0;
      const mainX = boxX + sidePad;
      const mainW = boxW - sidePad * 2;

      // Tarjetas laterales tenues (previa a la izquierda, siguiente a la derecha)
      if (count > 1) {
        const leftIdx = (actIdx - 1 + count) % count;
        const rightIdx = (actIdx + 1) % count;
        const peekW = Math.round(mainW * 0.38);
        const peekH = Math.round(cardAreaH * 0.72);
        const peekY = boxY + (cardAreaH - peekH) / 2;

        drawPhotoCard(ctx, imgs[leftIdx], boxX - 6, peekY, peekW, peekH, {
          radius: 12,
          borderColor: 'rgba(255,255,255,0.18)',
          borderWidth: 2,
          fitMode: 'cover-top',
          alpha: 0.42,
          shadow: false,
        });

        if (count > 2 || rightIdx !== leftIdx) {
          drawPhotoCard(ctx, imgs[rightIdx], boxX + boxW - peekW + 6, peekY, peekW, peekH, {
            radius: 12,
            borderColor: 'rgba(255,255,255,0.18)',
            borderWidth: 2,
            fitMode: 'cover-top',
            alpha: 0.42,
            shadow: false,
          });
        }
      }

      const slideDist = Math.round(boxW * 0.18);
      if (prevItem && state.imageTransition < 1) {
        // Tarjeta anterior saliendo suavemente a la izquierda
        drawPhotoCard(
          ctx,
          prevItem,
          mainX - slideDist * ease,
          boxY,
          mainW,
          cardAreaH,
          {
            radius: 16,
            borderColor: mood.accent,
            borderWidth: 2,
            fitMode: state.imageFit,
            alpha: Math.max(0, 1 - ease * 1.15),
            zoom: 1.0,
            shadow: false,
          }
        );
      }

      // Tarjeta activa entrando suavemente desde la derecha con zoom sutil
      const enterOffset = (1 - ease) * slideDist;
      const subtleZoom = state.imageFit === 'contain' ? 1.0 : 1.02 + Math.sin(time * 0.5) * 0.02;
      drawPhotoCard(ctx, activeItem, mainX + enterOffset, boxY, mainW, cardAreaH, {
        radius: 16,
        borderColor: mood.accent,
        borderWidth: 3.5,
        fitMode: state.imageFit,
        alpha: Math.min(1, 0.25 + ease * 0.75),
        zoom: subtleZoom,
        shadow: true,
      });

      drawPaginationDots(ctx, boxX + boxW / 2, boxY + boxH - 8, count, actIdx, mood);
      return;
    }

    // C) CINE (Fade suave 1 a 1)
    const cardAreaH = count > 1 ? boxH - 28 : boxH;
    if (prevItem && state.imageTransition < 1) {
      drawPhotoCard(ctx, prevItem, boxX, boxY, boxW, cardAreaH, {
        radius: 16,
        borderColor: mood.accent,
        borderWidth: 3,
        fitMode: state.imageFit,
        alpha: 1,
        zoom: 1.0,
        shadow: true,
      });
    }
    drawPhotoCard(ctx, activeItem, boxX, boxY, boxW, cardAreaH, {
      radius: 16,
      borderColor: mood.accent,
      borderWidth: 3,
      fitMode: state.imageFit,
      alpha: ease,
      zoom: state.imageFit === 'contain' ? 1.0 : 1.03 + Math.sin(time * 0.45) * 0.025,
      shadow: true,
    });
    drawPaginationDots(ctx, boxX + boxW / 2, boxY + boxH - 8, count, actIdx, mood);
  }

  function updateScreenVisibility() {
    const hasImages = state.newsImages.length > 0;
    const useBackdrop = state.screenMode === 'backdrop' && hasImages;
    holoGroup.visible = !useBackdrop;
    cityGroup.visible = !useBackdrop;

    if (useBackdrop) {
      scene.background = null;
    } else {
      const mood = MOODS[state.mood];
      scene.background = new THREE.Color(mood.bgTop);
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    }
  }

  function renderStudioScreens(time = 0) {
    const mood = MOODS[state.mood];
    const hasImages = state.newsImages.length > 0;
    const activeItem = hasImages ? state.newsImages[state.activeImageIndex % state.newsImages.length] : null;
    const prevItem =
      hasImages && state.prevImageIndex >= 0 && state.prevImageIndex < state.newsImages.length
        ? state.newsImages[state.prevImageIndex]
        : null;

    // 1) Modo Fondo TV (2D responsivo en bgCanvas, 100% libre de recortes 3D)
    if (state.screenMode === 'backdrop' && activeItem) {
      const bw = bgCanvas.width;
      const bh = bgCanvas.height;
      const isVertical = state.aspect === '9:16';

      bgCtx.fillStyle = '#050814';
      bgCtx.fillRect(0, 0, bw, bh);

      // Si es 1 foto en modo Llenar (cover-top) con estilo Cine/Fade, llenar fondo completo anclado arriba
      if (state.imageFit === 'cover-top' && state.galleryStyle === 'fade') {
        if (prevItem && state.imageTransition < 1) {
          drawImageCover(bgCtx, prevItem.img, 0, 0, bw, bh, 1.02, 0.06);
          bgCtx.save();
          bgCtx.globalAlpha = easeOutCubic(state.imageTransition);
          drawImageCover(bgCtx, activeItem.img, 0, 0, bw, bh, 1.02, 0.06);
          bgCtx.restore();
        } else {
          drawImageCover(bgCtx, activeItem.img, 0, 0, bw, bh, 1.02, 0.06);
        }
        const botGrad = bgCtx.createLinearGradient(0, bh * 0.62, 0, bh);
        botGrad.addColorStop(0, 'rgba(5, 10, 24, 0)');
        botGrad.addColorStop(1, 'rgba(5, 10, 24, 0.72)');
        bgCtx.fillStyle = botGrad;
        bgCtx.fillRect(0, bh * 0.62, bw, bh * 0.38);
        drawPaginationDots(bgCtx, bw / 2, isVertical ? 108 : 96, state.newsImages.length, state.activeImageIndex, mood);
        return;
      }

      // Fondo ambiental difuminado ultra-rápido (sin barras negras)
      if (prevItem && state.imageTransition < 1) {
        drawBlurredBackdrop(bgCtx, prevItem, 0, 0, bw, bh);
        bgCtx.save();
        bgCtx.globalAlpha = easeOutCubic(state.imageTransition);
        drawBlurredBackdrop(bgCtx, activeItem, 0, 0, bw, bh);
        bgCtx.restore();
      } else {
        drawBlurredBackdrop(bgCtx, activeItem, 0, 0, bw, bh);
      }

      // Zona segura elegante: en 9:16 arriba del presentador; en 16:9 mitad derecha limpia
      const boxX = isVertical ? 22 : Math.round(bw * 0.46);
      const boxY = isVertical ? 96 : 88;
      const boxW = isVertical ? bw - 44 : Math.round(bw * 0.51);
      const boxH = isVertical ? Math.round(bh * 0.43) : Math.round(bh * 0.68);

      drawElegantGalleryInBox(bgCtx, boxX, boxY, boxW, boxH, mood, time);
      return;
    }

    // Limpiar bgCanvas si estamos en modo monitor 3D
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // 2) Modo Pantalla TV 3D detrás del presentador
    const w = holoCanvas.width;
    const h = holoCanvas.height;
    holoCtx.clearRect(0, 0, w, h);

    if (activeItem) {
      holoCtx.save();
      holoCtx.beginPath();
      holoCtx.rect(10, 10, w - 20, h - 20);
      holoCtx.clip();

      drawBlurredBackdrop(holoCtx, activeItem, 0, 0, w, h);
      drawElegantGalleryInBox(holoCtx, 22, 22, w - 44, h - 44, mood, time);

      // Etiqueta discreta arriba a la izquierda
      const badgeLabel =
        state.newsImages.length > 1
          ? `● FOTO ${state.activeImageIndex + 1}/${state.newsImages.length}`
          : '● IMAGEN EN VIVO';
      holoCtx.fillStyle = 'rgba(6, 12, 28, 0.84)';
      roundRect(holoCtx, 26, 26, 220, 40, 8);
      holoCtx.fill();
      holoCtx.fillStyle = mood.accent;
      holoCtx.font = '900 19px Segoe UI, sans-serif';
      holoCtx.fillText(badgeLabel, 40, 53);

      holoCtx.restore();

      holoCtx.strokeStyle = mood.accent;
      holoCtx.lineWidth = 12;
      holoCtx.strokeRect(6, 6, w - 12, h - 12);
    } else {
      // Sin imágenes cargadas: pantalla holográfica de texto por defecto
      const grad = holoCtx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(6, 20, 46, 0.88)');
      grad.addColorStop(1, 'rgba(10, 32, 68, 0.78)');
      holoCtx.fillStyle = grad;
      holoCtx.fillRect(0, 0, w, h);

      holoCtx.fillStyle = 'rgba(255,255,255,0.035)';
      for (let y = 0; y < h; y += 12) {
        holoCtx.fillRect(0, y, w, 3);
      }

      holoCtx.strokeStyle = mood.accent;
      holoCtx.lineWidth = 14;
      holoCtx.strokeRect(7, 7, w - 14, h - 14);

      holoCtx.fillStyle = mood.accent;
      holoCtx.fillRect(32, 32, w - 64, 86);
      holoCtx.fillStyle = '#050814';
      holoCtx.font = '900 44px Segoe UI, sans-serif';
      holoCtx.fillText('⚡ ' + mood.label, 56, 90);

      holoCtx.fillStyle = '#ffffff';
      holoCtx.font = '800 60px Segoe UI, sans-serif';
      const headline = (headlineInput.value || 'NOTICIA DE ÚLTIMA HORA').toUpperCase();
      wrapCanvasText(holoCtx, headline, 56, 224, w - 112, 76, 4);

      holoCtx.fillStyle = mood.secondary;
      holoCtx.font = '700 32px Segoe UI, sans-serif';
      holoCtx.fillText('HERO NEWS NETWORK // SAT-LINK 01', 56, h - 44);
    }

    holoTexture.needsUpdate = true;
  }

  function updateHoloTexture() {
    renderStudioScreens(clock ? clock.elapsedTime : 0);
  }

  // Skyline de ciudad nocturna estilizada
  const cityGroup = new THREE.Group();
  scene.add(cityGroup);

  const buildingMat = toonMat(0x0a1328);
  const windowColors = [0x00e5ff, 0xffcc33, 0x38bdf8, 0xff4d6d];

  for (let i = 0; i < 28; i++) {
    const bw = 0.7 + Math.random() * 1.1;
    const bh = 2.5 + Math.random() * 6.5;
    const bd = 0.8 + Math.random() * 1.0;
    const x = (i - 14) * 1.15 + (Math.random() - 0.5) * 0.4;
    const z = -6.5 - Math.random() * 7.5;

    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), buildingMat);
    bMesh.position.set(x, bh / 2 - 2.6, z);
    cityGroup.add(bMesh);

    // Ventanas brillantes en algunos edificios
    const winCount = 3 + Math.floor(Math.random() * 5);
    const winCol = windowColors[i % windowColors.length];
    const winMat = new THREE.MeshBasicMaterial({ color: winCol });
    for (let w = 0; w < winCount; w++) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(bw * 0.65, 0.08), winMat);
      win.position.set(
        x,
        -1.2 + Math.random() * (bh - 1.2),
        z + bd / 2 + 0.02
      );
      cityGroup.add(win);
    }
  }

  // Partículas flotantes de energía
  const particleCount = 70;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 10;
    pPositions[i * 3 + 1] = Math.random() * 6 - 1;
    pPositions[i * 3 + 2] = -4 + Math.random() * 6;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: MOODS.epic.rimColor,
    size: 0.07,
    transparent: true,
    opacity: 0.75,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // =========================================================
  // 5. PRESETS DE CÁMARA Y ASPECT RATIO
  // =========================================================
  const CAM_PRESETS = {
    front: { pos: new THREE.Vector3(0.0, 1.55, 4.9), look: new THREE.Vector3(0.0, 1.32, 0) },
    hero: { pos: new THREE.Vector3(-1.35, 1.38, 4.55), look: new THREE.Vector3(0.25, 1.48, 0) },
    closeup: { pos: new THREE.Vector3(0.35, 1.72, 3.35), look: new THREE.Vector3(0.0, 1.62, 0) },
  };
  const AUTO_CAM_ORDER = ['front', 'hero', 'closeup'];
  const currentCamPos = CAM_PRESETS.front.pos.clone();
  const currentCamLook = CAM_PRESETS.front.look.clone();

  function applyAspectRatio() {
    state.aspect = aspectSelect.value;
    if (state.aspect === '9:16') {
      state.width = 720;
      state.height = 1280;
      stageWrapper.classList.remove('ratio-16-9');
      stageWrapper.classList.add('ratio-9-16');
      // Monitor TV nítido debajo del badge EN VIVO y encima de la cabeza del presentador
      holoGroup.position.set(0.0, 2.48, -1.65);
      holoGroup.rotation.y = 0.0;
      holoGroup.scale.set(0.84, 0.84, 0.84);
    } else {
      state.width = 1280;
      state.height = 720;
      stageWrapper.classList.remove('ratio-9-16');
      stageWrapper.classList.add('ratio-16-9');
      // Monitor TV grande al lado derecho del héroe
      holoGroup.position.set(1.92, 1.82, -1.35);
      holoGroup.rotation.y = -0.26;
      holoGroup.scale.set(1.1, 1.1, 1.1);
    }

    renderer.setSize(state.width, state.height, false);
    camera.aspect = state.width / state.height;
    camera.updateProjectionMatrix();

    bgCanvas.width = state.width;
    bgCanvas.height = state.height;
    hudCanvas.width = state.width;
    hudCanvas.height = state.height;
    updateScreenVisibility();
    renderStudioScreens(0);
  }

  function applyMood() {
    state.mood = moodSelect.value;
    const mood = MOODS[state.mood];
    const useBackdrop = state.screenMode === 'backdrop' && state.newsImages.length > 0;
    if (!useBackdrop) {
      scene.background = new THREE.Color(mood.bgTop);
    }
    scene.fog.color.setHex(mood.bgTop);
    rimLight.color.setHex(mood.rimColor);
    matEyeGlow.color.setHex(mood.eyeColor);
    matEmblemGlow.color.setHex(mood.rimColor);
    deskNeonMat.color.setHex(mood.rimColor);
    pMat.color.setHex(mood.rimColor);
    updateHoloTexture();
  }

  // =========================================================
  // 6. HUD DE VIDEOJUEGO EN CANVAS 2D (SUBTÍTULOS + TICKER)
  // =========================================================
  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const words = text.split(/\s+/);
    let line = '';
    let lineCount = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, y + lineCount * lineHeight);
        line = words[i];
        lineCount++;
        if (lineCount >= maxLines - 1) {
          // Última línea
          const rest = [line, ...words.slice(i + 1)].join(' ');
          ctx.fillText(rest.slice(0, 38) + (rest.length > 38 ? '…' : ''), x, y + lineCount * lineHeight);
          return;
        }
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
    }
  }

  function drawHUD(time, dt) {
    const w = hudCanvas.width;
    const h = hudCanvas.height;
    const isVertical = state.aspect === '9:16';
    const mood = MOODS[state.mood];
    const ctx = hudCtx;

    ctx.clearRect(0, 0, w, h);

    // Marco sutil estilo HUD de videojuego en las esquinas
    const pad = isVertical ? 24 : 28;
    ctx.strokeStyle = mood.accent;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 3;
    const corner = 26;

    // Esquina sup-izq
    ctx.beginPath();
    ctx.moveTo(pad, pad + corner);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + corner, pad);
    ctx.stroke();

    // Esquina sup-der
    ctx.beginPath();
    ctx.moveTo(w - pad - corner, pad);
    ctx.lineTo(w - pad, pad);
    ctx.lineTo(w - pad, pad + corner);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Badge EN VIVO + Nombre del canal
    const topY = isVertical ? 44 : 36;
    ctx.fillStyle = '#ff2e54';
    roundRect(ctx, pad + 10, topY, 118, 38, 8);
    ctx.fill();

    // Punto parpadeante
    const pulse = 0.5 + 0.5 * Math.sin(time * 6);
    ctx.fillStyle = `rgba(255,255,255,${0.35 + pulse * 0.65})`;
    ctx.beginPath();
    ctx.arc(pad + 30, topY + 19, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px Segoe UI, sans-serif';
    ctx.fillText('EN VIVO', pad + 44, topY + 25);

    // Etiqueta del Mood junto a EN VIVO
    ctx.fillStyle = 'rgba(8, 16, 36, 0.82)';
    roundRect(ctx, pad + 136, topY, 240, 38, 8);
    ctx.fill();
    ctx.strokeStyle = mood.accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = mood.accent;
    ctx.font = '800 15px Segoe UI, sans-serif';
    ctx.fillText(mood.label, pad + 150, topY + 24);

    // Ecualizador de voz (arriba a la derecha)
    const eqX = w - pad - 110;
    const eqY = topY + 34;
    for (let i = 0; i < 10; i++) {
      const wave = state.isSpeaking
        ? 6 + Math.abs(Math.sin(time * 12 + i * 0.9)) * (26 * (0.35 + state.speechEnergy))
        : 4 + Math.abs(Math.sin(time * 2 + i)) * 4;
      ctx.fillStyle = i % 2 === 0 ? mood.accent : mood.secondary;
      ctx.fillRect(eqX + i * 10, eqY - wave, 6, wave);
    }

    // Subtítulos dinámicos estilo juego / Shorts (cuando habla, con palabra activa resaltada)
    if (state.isSpeaking && state.subtitleWords.length > 0) {
      const idx = Math.max(0, state.activeWordIndex);
      const chunkSize = isVertical ? 4 : 6;
      const chunkStart = Math.floor(idx / chunkSize) * chunkSize;
      const chunk = state.subtitleWords.slice(chunkStart, chunkStart + chunkSize);
      const localActive = idx - chunkStart;

      const subY = isVertical ? h - 250 : h - 185;
      const boxW = Math.min(w - 56, isVertical ? 650 : 900);
      const boxX = (w - boxW) / 2;

      ctx.fillStyle = 'rgba(6, 11, 26, 0.86)';
      roundRect(ctx, boxX, subY - 46, boxW, 84, 14);
      ctx.fill();
      ctx.strokeStyle = mood.secondary;
      ctx.lineWidth = 3;
      ctx.stroke();

      const fontSize = isVertical ? 30 : 32;
      ctx.font = `900 ${fontSize}px Segoe UI, sans-serif`;
      const upperWords = chunk.map((word) => word.toUpperCase());
      const spaceW = ctx.measureText(' ').width;
      const wordWidths = upperWords.map((word) => ctx.measureText(word).width);
      const totalW =
        wordWidths.reduce((acc, ww) => acc + ww, 0) +
        Math.max(0, upperWords.length - 1) * spaceW;

      const scale = Math.min(1, (boxW - 40) / Math.max(1, totalW));
      ctx.save();
      ctx.translate(w / 2, subY + 8);
      ctx.scale(scale, scale);

      let cursorX = -totalW / 2;
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 8;
      upperWords.forEach((word, i) => {
        ctx.fillStyle = i === localActive ? mood.secondary : '#ffffff';
        ctx.fillText(word, cursorX, 0);
        cursorX += wordWidths[i] + spaceW;
      });
      ctx.restore();
      ctx.shadowBlur = 0;
    }

    // Lower-third / Cintillo de Noticias estilo videojuego
    const barH = isVertical ? 132 : 108;
    const barY = h - barH - 22;
    const barX = 22;
    const barW = w - 44;

    // Fondo del cintillo
    ctx.fillStyle = 'rgba(8, 14, 30, 0.9)';
    roundRect(ctx, barX, barY, barW, barH, 14);
    ctx.fill();
    ctx.strokeStyle = mood.accent;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Etiqueta del nombre del superhéroe
    const heroName = (heroNameInput.value || 'CAPITÁN NOVA').toUpperCase();
    ctx.fillStyle = mood.secondary;
    roundRect(ctx, barX + 16, barY - 18, 220, 32, 7);
    ctx.fill();
    ctx.fillStyle = '#080c18';
    ctx.font = '900 16px Segoe UI, sans-serif';
    ctx.fillText('⚡ ' + heroName, barX + 28, barY + 4);

    // Titular principal
    const headline = (headlineInput.value || 'ÚLTIMA HORA').toUpperCase();
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isVertical ? 24 : 28}px Segoe UI, sans-serif`;
    ctx.fillText(headline, barX + 20, barY + (isVertical ? 54 : 52), barW - 40);

    // Banda inferior deslizante (ticker)
    const tickerY = barY + barH - 36;
    ctx.save();
    ctx.beginPath();
    ctx.rect(barX + 12, tickerY, barW - 24, 28);
    ctx.clip();

    ctx.fillStyle = 'rgba(0, 229, 255, 0.14)';
    ctx.fillRect(barX + 12, tickerY, barW - 24, 28);

    const tickerText = `  ★ ÚLTIMA HORA: ${headline}   ★ TRANSMITIENDO DESDE LA BASE CENTRAL   ★ ${heroName} EN VIVO   `;
    ctx.font = '700 15px Segoe UI, sans-serif';
    ctx.fillStyle = mood.accent;
    const textWidth = ctx.measureText(tickerText).width;
    state.tickerX -= dt * 85;
    if (state.tickerX < -textWidth) state.tickerX = 0;

    ctx.fillText(tickerText, barX + 16 + state.tickerX, tickerY + 20);
    ctx.fillText(tickerText, barX + 16 + state.tickerX + textWidth, tickerY + 20);
    ctx.restore();
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // =========================================================
  // 7. MOTOR DE VOZ NEURAL IA + EFECTOS SUPERHÉROE + LIP-SYNC
  // =========================================================
  let audioEl = null;
  let audioCtx = null;
  let analyser = null;
  let freqData = null;
  let mediaDest = null;
  let subtitleInterval = null;
  const ttsCache = new Map();

  // Transformar cualquier contexto normal en guion con tono de superhéroe
  heroizeBtn.addEventListener('click', () => {
    const raw = contextInput.value.trim();
    if (!raw) return;
    const heroName = (heroNameInput.value || 'Capitán Nova').trim();
    const cleaned = raw.replace(/\s+/g, ' ');
    const intros = [
      `¡Atención ciudadanos! Aquí ${heroName} interrumpiendo la señal con un reporte urgente.`,
      `¡Escuchen bien, metrópolis! ${heroName} en línea directa desde la torre de vigilancia.`,
      `¡Alerta informativa! Les habla ${heroName} con noticias que nadie puede ignorar.`,
    ];
    const outros = [
      `¡Manténganse firmes y atentos! ${heroName} fuera.`,
      `¡La verdad nunca duerme! Nos vemos en la próxima transmisión heroica.`,
      `¡Sigan en sintonía y nunca bajen la guardia!`,
    ];
    const intro = intros[Math.floor(Math.random() * intros.length)];
    const outro = outros[Math.floor(Math.random() * outros.length)];
    contextInput.value = `${intro} ${cleaned} ${outro}`;
  });

  // Manejo de audio externo (MP3 / WAV)
  audioFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (state.customAudioUrl) URL.revokeObjectURL(state.customAudioUrl);
    state.customAudioUrl = URL.createObjectURL(file);
    state.customAudioName = file.name;
    audioStatus.textContent = `Audio propio cargado: ${file.name} (lip-sync real)`;
  });

  clearAudioBtn.addEventListener('click', () => {
    if (state.customAudioUrl) URL.revokeObjectURL(state.customAudioUrl);
    state.customAudioUrl = null;
    state.customAudioName = '';
    audioFileInput.value = '';
    audioStatus.textContent = 'Listo: Voz Neural IA + Lip-Sync real + Audio incluido en video.';
  });

  function base64ToBlobUrl(b64, mime = 'audio/mpeg') {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  }

  async function fetchNeuralTTS(text) {
    const voice = voiceSelect.value || 'es-MX-JorgeNeural';
    const pitchHz = parseInt(pitchRange.value, 10) || -10;
    const ratePct = parseInt(rateRange.value, 10) || 5;
    const cacheKey = `${voice}|${pitchHz}|${ratePct}|${text}`;

    if (ttsCache.has(cacheKey)) {
      return ttsCache.get(cacheKey);
    }

    audioStatus.textContent = 'Generando voz neural de superhéroe...';
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, pitchHz, ratePct }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const audioUrl = base64ToBlobUrl(data.audioBase64, 'audio/mpeg');
    const result = { audioUrl, words: data.words || [] };
    ttsCache.set(cacheKey, result);
    return result;
  }

  function buildVoiceEffectsChain(ctx, sourceNode, fxMode) {
    if (fxMode === 'heroic') {
      // Graves profundos + claridad de locutor + compresor épico
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = 'lowshelf';
      lowShelf.frequency.value = 135;
      lowShelf.gain.value = 6.5;

      const presence = ctx.createBiquadFilter();
      presence.type = 'peaking';
      presence.frequency.value = 2800;
      presence.Q.value = 1.1;
      presence.gain.value = 3.2;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -20;
      comp.knee.value = 12;
      comp.ratio.value = 4.5;
      comp.attack.value = 0.005;
      comp.release.value = 0.14;

      const gain = ctx.createGain();
      gain.gain.value = 1.25;

      sourceNode.connect(lowShelf);
      lowShelf.connect(presence);
      presence.connect(comp);
      comp.connect(gain);
      return gain;
    }

    if (fxMode === 'comms') {
      // Efecto comunicador / radio de casco de videojuego
      const highPass = ctx.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.value = 260;

      const lowPass = ctx.createBiquadFilter();
      lowPass.type = 'lowpass';
      lowPass.frequency.value = 3600;

      const midPeak = ctx.createBiquadFilter();
      midPeak.type = 'peaking';
      midPeak.frequency.value = 1450;
      midPeak.Q.value = 1.6;
      midPeak.gain.value = 5.5;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -24;
      comp.ratio.value = 6;

      const gain = ctx.createGain();
      gain.gain.value = 1.3;

      sourceNode.connect(highPass);
      highPass.connect(lowPass);
      lowPass.connect(midPeak);
      midPeak.connect(comp);
      comp.connect(gain);
      return gain;
    }

    return sourceNode;
  }

  function playAudioWithLipSync(audioUrl, wordTimings, onDoneCallback) {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();

    audioEl = new Audio(audioUrl);
    audioEl.crossOrigin = 'anonymous';

    const source = audioCtx.createMediaElementSource(audioEl);
    const processed = buildVoiceEffectsChain(audioCtx, source, fxSelect ? fxSelect.value : 'heroic');

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    freqData = new Uint8Array(analyser.frequencyBinCount);

    mediaDest = audioCtx.createMediaStreamDestination();
    processed.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.connect(mediaDest);

    if (wordTimings && wordTimings.length > 0) {
      state.wordTimings = wordTimings;
      state.subtitleWords = wordTimings.map((w) => w.text);
      state.activeWordIndex = 0;
    } else {
      state.wordTimings = [];
      audioEl.onloadedmetadata = () => {
        const dur = audioEl.duration || 10;
        const totalWords = Math.max(1, state.subtitleWords.length);
        const msPerWord = (dur * 1000) / totalWords;
        subtitleInterval = setInterval(() => {
          if (state.activeWordIndex < totalWords - 1) {
            state.activeWordIndex++;
          }
        }, msPerWord);
      };
    }

    audioEl.onended = () => {
      finishBroadcast();
      if (onDoneCallback) onDoneCallback();
    };

    audioEl.play().catch((err) => {
      console.error('Error reproduciendo audio:', err);
      finishBroadcast();
      if (onDoneCallback) onDoneCallback();
    });
  }

  function startBrowserFallbackTTS(text, onDoneCallback) {
    if (!window.speechSynthesis) {
      alert('No se pudo conectar al servidor de voz neural y este navegador no soporta TTS.');
      finishBroadcast();
      return;
    }
    audioStatus.textContent = 'Servidor neural no disponible: usando voz del navegador.';
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.pitch = 0.72;
    utter.rate = 1.0;

    const estWordsPerSec = 2.6;
    subtitleInterval = setInterval(() => {
      if (state.isSpeaking && state.activeWordIndex < state.subtitleWords.length - 1) {
        state.activeWordIndex++;
      }
    }, Math.max(180, 1000 / estWordsPerSec));

    utter.onend = () => {
      finishBroadcast();
      if (onDoneCallback) onDoneCallback();
    };
    utter.onerror = () => {
      finishBroadcast();
      if (onDoneCallback) onDoneCallback();
    };
    window.speechSynthesis.speak(utter);
  }

  async function startBroadcast(onDoneCallback, keepRecordingState = false) {
    stopBroadcast(keepRecordingState);

    const text = contextInput.value.trim();
    state.subtitleWords = text ? text.split(/\s+/) : [];
    state.wordTimings = [];
    state.activeWordIndex = 0;
    state.autoCamTimer = 0;
    if (state.newsImages.length > 0) {
      state.activeImageIndex = 0;
      state.prevImageIndex = -1;
      state.imageTransition = 1;
      state.imageCycleTimer = 0;
      updateThumbHighlights();
    }
    broadcastBtn.disabled = true;
    stopBtn.disabled = false;

    // Caso A: Audio propio subido por el usuario (ElevenLabs / MP3 / WAV)
    if (state.customAudioUrl) {
      state.isSpeaking = true;
      audioStatus.textContent = `Transmitiendo audio: ${state.customAudioName}`;
      playAudioWithLipSync(state.customAudioUrl, [], onDoneCallback);
      return true;
    }

    if (!text) {
      finishBroadcast();
      return false;
    }

    // Caso B: Voz Neural IA vía servidor local (/api/tts)
    try {
      broadcastBtn.textContent = '⏳ Generando voz...';
      const { audioUrl, words } = await fetchNeuralTTS(text);
      broadcastBtn.textContent = '▶ Transmitir Noticia';

      // Si el usuario detuvo mientras se generaba
      if (stopBtn.disabled) return false;

      state.isSpeaking = true;
      audioStatus.textContent = `Transmitiendo con voz neural (${voiceSelect.options[voiceSelect.selectedIndex].text})`;
      playAudioWithLipSync(audioUrl, words, onDoneCallback);
      return true;
    } catch (err) {
      console.warn('Fallo /api/tts, usando fallback:', err);
      broadcastBtn.textContent = '▶ Transmitir Noticia';
      state.isSpeaking = true;
      startBrowserFallbackTTS(text, onDoneCallback);
      return false;
    }
  }

  function finishBroadcast() {
    state.isSpeaking = false;
    state.targetSpeechEnergy = 0;
    broadcastBtn.disabled = false;
    broadcastBtn.textContent = '▶ Transmitir Noticia';
    if (subtitleInterval) {
      clearInterval(subtitleInterval);
      subtitleInterval = null;
    }
    if (!state.isRecording) {
      stopBtn.disabled = true;
    }
  }

  function stopBroadcast(keepRecordingState = false) {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioEl) {
      audioEl.pause();
      audioEl = null;
    }
    analyser = null;
    if (subtitleInterval) {
      clearInterval(subtitleInterval);
      subtitleInterval = null;
    }
    state.isSpeaking = false;
    state.targetSpeechEnergy = 0;
    broadcastBtn.disabled = false;
    broadcastBtn.textContent = '▶ Transmitir Noticia';
    stopBtn.disabled = !keepRecordingState;

    if (!keepRecordingState && state.isRecording) {
      stopRecording();
    }
  }

  // =========================================================
  // 8. GRABADORA DE VIDEO (3D + HUD + VOZ NEURAL -> .WEBM)
  // =========================================================
  const captureCanvas = document.createElement('canvas');
  const captureCtx = captureCanvas.getContext('2d');
  let mediaRecorder = null;
  let recordedChunks = [];

  async function startRecordingAndBroadcast() {
    if (state.isRecording) {
      stopBroadcast(false);
      return;
    }

    captureCanvas.width = state.width;
    captureCanvas.height = state.height;

    state.isRecording = true;
    recIndicator.classList.add('active');
    recordBtn.textContent = '■ Detener Grabación';
    stopBtn.disabled = false;

    // Esperar a que la voz neural esté lista antes de abrir MediaRecorder
    const hasAudioTrack = await startBroadcast(() => {
      if (state.isRecording) {
        setTimeout(() => stopRecording(), 450);
      }
    }, true);

    if (!state.isRecording) return;

    const videoStream = captureCanvas.captureStream(30);
    const tracks = [...videoStream.getVideoTracks()];

    if (hasAudioTrack && mediaDest) {
      tracks.push(...mediaDest.stream.getAudioTracks());
    }

    const combinedStream = new MediaStream(tracks);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 5_000_000,
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hero-news-${Date.now()}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    };

    mediaRecorder.start(100);
  }

  function stopRecording() {
    state.isRecording = false;
    recIndicator.classList.remove('active');
    recordBtn.textContent = '● Grabar y Descargar Video (.webm)';
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (!state.isSpeaking) {
      stopBtn.disabled = true;
    }
  }

  // =========================================================
  // 9. BUCLE DE ANIMACIÓN PRINCIPAL (60 FPS)
  // =========================================================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const mood = MOODS[state.mood];

    // 1) Calcular nivel de voz para Lip-Sync y sincronizar subtítulo exacto
    if (state.isSpeaking) {
      if (audioEl && state.wordTimings.length > 0) {
        const cur = audioEl.currentTime;
        for (let i = state.wordTimings.length - 1; i >= 0; i--) {
          if (cur >= state.wordTimings[i].start - 0.04) {
            state.activeWordIndex = i;
            break;
          }
        }
      }

      if (analyser && freqData) {
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        for (let i = 2; i < 30; i++) sum += freqData[i];
        const avg = sum / (28 * 255);
        state.targetSpeechEnergy = Math.min(1, avg * 2.8);
      } else {
        // Oscilación silábica natural para fallback Web Speech API
        state.speechPulseTime += dt * 15;
        const syllable =
          0.45 +
          0.35 * Math.sin(state.speechPulseTime) +
          0.2 * Math.sin(state.speechPulseTime * 2.3);
        state.targetSpeechEnergy = Math.max(0.08, syllable);
      }
    } else {
      state.targetSpeechEnergy = 0;
    }

    state.speechEnergy += (state.targetSpeechEnergy - state.speechEnergy) * Math.min(1, dt * 18);

    // 2) Animar boca y mentón (Lip-Sync)
    const openAmt = state.speechEnergy;
    mouthOpening.scale.y = 0.25 + openAmt * 3.1;
    mouthOpening.scale.x = 0.85 + Math.sin(t * 14) * 0.18 * openAmt;
    upperTeeth.visible = openAmt > 0.22;
    upperTeeth.position.y = 0.012 + openAmt * 0.025;
    chin.position.y = -0.05 - openAmt * 0.032;

    // 3) Animar parpadeo y cejas según Mood
    let currentBlinkScale = 1;
    state.blinkTimer -= dt;
    if (state.blinkTimer <= 0) {
      state.blinkProgress += dt * 12;
      currentBlinkScale = Math.max(0.05, Math.abs(Math.cos(state.blinkProgress)));
      leftEye.scale.y = currentBlinkScale;
      rightEye.scale.y = currentBlinkScale;
      if (state.blinkProgress >= Math.PI) {
        state.blinkProgress = 0;
        state.blinkTimer = 2.2 + Math.random() * 2.8;
        currentBlinkScale = 1;
        leftEye.scale.y = 1;
        rightEye.scale.y = 1;
      }
    }

    // Animar avatar humano 3D realista (si está activo)
    animateHumanAvatar(t, dt, openAmt, currentBlinkScale);

    const browBoost = state.isSpeaking ? 0.06 * openAmt : 0;
    leftBrow.rotation.z = -(mood.browAngle + browBoost);
    rightBrow.rotation.z = mood.browAngle + browBoost;

    // 4) Animación corporal del superhéroe (respiración + gestos al hablar)
    bodyGroup.position.y = Math.sin(t * 2.2) * 0.035;
    headGroup.rotation.y = Math.sin(t * (state.isSpeaking ? 2.4 : 0.9)) * (state.isSpeaking ? 0.14 : 0.06);
    headGroup.rotation.x = Math.sin(t * 3.1) * (state.isSpeaking ? 0.06 : 0.02) - 0.02;
    headGroup.rotation.z = Math.sin(t * 1.7) * (state.isSpeaking ? 0.05 : 0.015);

    if (state.isSpeaking) {
      state.gesturePhase += dt * 3.5;
      // Gesto de manos de presentador superhéroe
      rightArm.shoulderPivot.rotation.x = -0.55 + Math.sin(state.gesturePhase) * 0.25;
      rightArm.shoulderPivot.rotation.z = -0.18 + Math.cos(state.gesturePhase * 0.7) * 0.1;
      rightArm.elbowPivot.rotation.x = -0.65 - openAmt * 0.35;

      leftArm.shoulderPivot.rotation.x = -0.45 + Math.cos(state.gesturePhase * 0.85) * 0.22;
      leftArm.shoulderPivot.rotation.z = 0.18;
      leftArm.elbowPivot.rotation.x = -0.55 - openAmt * 0.25;
    } else {
      // Pose heroica de descanso
      rightArm.shoulderPivot.rotation.x += (-0.15 - rightArm.shoulderPivot.rotation.x) * dt * 4;
      rightArm.shoulderPivot.rotation.z += (-0.12 - rightArm.shoulderPivot.rotation.z) * dt * 4;
      rightArm.elbowPivot.rotation.x += (-0.35 - rightArm.elbowPivot.rotation.x) * dt * 4;

      leftArm.shoulderPivot.rotation.x += (-0.15 - leftArm.shoulderPivot.rotation.x) * dt * 4;
      leftArm.shoulderPivot.rotation.z += (0.12 - leftArm.shoulderPivot.rotation.z) * dt * 4;
      leftArm.elbowPivot.rotation.x += (-0.35 - leftArm.elbowPivot.rotation.x) * dt * 4;
    }

    // 5) Ondulación de la capa con viento heroico
    const posAttr = capeGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const bx = capeBasePositions[i * 3];
      const by = capeBasePositions[i * 3 + 1];
      const bz = capeBasePositions[i * 3 + 2];
      // Más movimiento en la parte baja de la capa
      const weight = Math.max(0, (0.925 - by) / 1.85);
      const wave = Math.sin(t * mood.capeSpeed + by * 3.2 + bx * 2.0) * 0.22 * weight;
      posAttr.setZ(i, bz + wave - weight * 0.18);
    }
    posAttr.needsUpdate = true;
    capeGeo.computeVertexNormals();

    // 6) Flotación del monitor TV, partículas y transición de imágenes reales
    holoGroup.position.y = (state.aspect === '9:16' ? 2.48 : 1.82) + Math.sin(t * 2.0) * 0.03;
    emblemCore.rotation.y = t * 1.4;

    if (state.newsImages.length > 0) {
      // Cambio automático entre múltiples imágenes
      if (state.newsImages.length > 1) {
        if (state.isSpeaking && audioEl && audioEl.duration > 0) {
          const progress = Math.min(0.999, audioEl.currentTime / audioEl.duration);
          const targetIdx = Math.floor(progress * state.newsImages.length);
          if (targetIdx !== state.activeImageIndex) {
            setActiveImage(targetIdx);
          }
        } else {
          state.imageCycleTimer += dt;
          const interval = state.isSpeaking ? 3.5 : 4.5;
          if (state.imageCycleTimer >= interval) {
            state.imageCycleTimer = 0;
            setActiveImage((state.activeImageIndex + 1) % state.newsImages.length);
          }
        }
      }

      if (state.imageTransition < 1) {
        state.imageTransition = Math.min(1, state.imageTransition + dt * 2.4);
        renderStudioScreens(t);
      } else if (state.screenMode === 'monitor' && state.imageFit === 'cover-top') {
        renderStudioScreens(t);
      }
    }

    const pArr = pGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pArr[i * 3 + 1] += dt * 0.35;
      if (pArr[i * 3 + 1] > 5) pArr[i * 3 + 1] = -1;
    }
    pGeo.attributes.position.needsUpdate = true;

    // 7) Cámara suave (TV automática o fija)
    let targetCamKey = state.cameraMode;
    if (state.cameraMode === 'auto') {
      state.autoCamTimer += dt;
      if (state.autoCamTimer > 5.5) {
        state.autoCamTimer = 0;
        state.autoCamIndex = (state.autoCamIndex + 1) % AUTO_CAM_ORDER.length;
      }
      targetCamKey = AUTO_CAM_ORDER[state.autoCamIndex];
    }

    const preset = CAM_PRESETS[targetCamKey] || CAM_PRESETS.front;
    const zOffset = state.aspect === '9:16' ? 0.85 : 0;
    const targetPos = preset.pos.clone();
    const targetLook = preset.look.clone();
    targetPos.z += zOffset;
    targetPos.x += Math.sin(t * 0.55) * 0.08;

    // En 16:9 con foto completa al costado derecho, encuadrar al presentador a la izquierda
    if (
      state.aspect === '16:9' &&
      state.screenMode === 'backdrop' &&
      state.imageFit === 'contain' &&
      state.newsImages.length > 0
    ) {
      targetPos.x += 0.95;
      targetLook.x += 0.95;
    }

    currentCamPos.lerp(targetPos, Math.min(1, dt * 2.8));
    currentCamLook.lerp(targetLook, Math.min(1, dt * 2.8));
    camera.position.copy(currentCamPos);
    camera.lookAt(currentCamLook);

    // 8) Render 3D + HUD 2D
    renderer.render(scene, camera);
    drawHUD(t, dt);

    // 9) Si está grabando, componer Fondo 2D + 3D + HUD en el canvas de exportación
    if (state.isRecording) {
      captureCtx.fillStyle = '#050814';
      captureCtx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
      if (state.screenMode === 'backdrop' && state.newsImages.length > 0) {
        captureCtx.drawImage(bgCanvas, 0, 0, captureCanvas.width, captureCanvas.height);
      }
      captureCtx.drawImage(glCanvas, 0, 0, captureCanvas.width, captureCanvas.height);
      captureCtx.drawImage(hudCanvas, 0, 0, captureCanvas.width, captureCanvas.height);
    }
  }

  // =========================================================
  // 10. GESTIÓN DE GALERÍA HASTA 5 IMÁGENES (CLIC / ARRASTRAR / CTRL+V)
  // =========================================================
  function setActiveImage(index) {
    if (state.newsImages.length === 0) return;
    const clamped = ((index % state.newsImages.length) + state.newsImages.length) % state.newsImages.length;
    if (clamped !== state.activeImageIndex) {
      state.prevImageIndex = state.activeImageIndex;
      state.activeImageIndex = clamped;
      state.imageTransition = 0;
    }
    updateThumbHighlights();
    renderStudioScreens(clock.elapsedTime);
  }

  function updateThumbHighlights() {
    const items = imageThumbs.querySelectorAll('.thumb-item:not(.slot-empty)');
    items.forEach((el, idx) => {
      el.classList.toggle('active', idx === state.activeImageIndex);
    });
  }

  function renderImageThumbs() {
    imageThumbs.innerHTML = '';

    for (let idx = 0; idx < MAX_NEWS_IMAGES; idx++) {
      const item = state.newsImages[idx];
      const div = document.createElement('div');

      if (item) {
        div.className = 'thumb-item' + (idx === state.activeImageIndex ? ' active' : '');
        div.title = `Foto ${idx + 1}: ${item.name} (clic para mostrar ahora)`;

        const imgEl = document.createElement('img');
        imgEl.src = item.url;
        imgEl.alt = item.name;
        div.appendChild(imgEl);

        const num = document.createElement('span');
        num.className = 'slot-num';
        num.textContent = String(idx + 1);
        div.appendChild(num);

        const rmBtn = document.createElement('button');
        rmBtn.type = 'button';
        rmBtn.className = 'thumb-remove';
        rmBtn.textContent = '✕';
        rmBtn.title = 'Quitar foto';
        rmBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          URL.revokeObjectURL(item.url);
          state.newsImages.splice(idx, 1);
          state.prevImageIndex = -1;
          state.imageTransition = 1;
          if (state.activeImageIndex >= state.newsImages.length) {
            state.activeImageIndex = Math.max(0, state.newsImages.length - 1);
          }
          renderImageThumbs();
          updateScreenVisibility();
          renderStudioScreens(clock.elapsedTime);
        });
        div.appendChild(rmBtn);

        div.addEventListener('click', () => {
          state.imageCycleTimer = 0;
          setActiveImage(idx);
        });
      } else {
        div.className = 'thumb-item slot-empty';
        div.title = `Agregar Foto ${idx + 1}`;
        div.innerHTML = `<span>＋</span><span>${idx + 1}</span>`;
        div.addEventListener('click', () => {
          newsImagesInput.click();
        });
      }

      imageThumbs.appendChild(div);
    }

    const count = state.newsImages.length;
    if (addImagesBtn) {
      addImagesBtn.textContent = count >= MAX_NEWS_IMAGES ? `✓ Lleno (${count}/5)` : `＋ Agregar (${count}/5)`;
      addImagesBtn.disabled = count >= MAX_NEWS_IMAGES;
    }

    if (count === 0) {
      imagesStatus.textContent =
        'Haz clic en los recuadros 1–5, arrastra fotos o pega con Ctrl+V (hasta 5).';
    } else if (count === 1) {
      imagesStatus.textContent = '1/5 foto cargada. Agrega más para activar el carrusel o mosaico.';
    } else {
      const modeName =
        state.galleryStyle === 'mosaic'
          ? 'Mosaico (todas visibles)'
          : state.galleryStyle === 'carousel'
            ? 'Carrusel elegante'
            : 'Cine (Fade suave)';
      imagesStatus.textContent = `${count}/5 fotos listas en modo ${modeName}.`;
    }
  }

  function addImageFiles(fileList) {
    const remaining = MAX_NEWS_IMAGES - state.newsImages.length;
    if (remaining <= 0) {
      imagesStatus.textContent = 'Ya tienes el máximo de 5 imágenes. Quita una (✕) para agregar otra.';
      return;
    }

    const files = Array.from(fileList || [])
      .filter((f) => f.type && f.type.startsWith('image/'))
      .slice(0, remaining);
    if (files.length === 0) return;

    const hadNone = state.newsImages.length === 0;
    let loadedCount = 0;

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        if (state.newsImages.length >= MAX_NEWS_IMAGES) {
          URL.revokeObjectURL(url);
          return;
        }
        const blurCanvas = createBlurCanvas(img);
        state.newsImages.push({
          id: `${Date.now()}-${Math.random()}`,
          url,
          name: file.name || 'imagen.png',
          img,
          blurCanvas,
        });
        loadedCount++;
        if (loadedCount === 1 && hadNone) {
          state.activeImageIndex = 0;
          state.prevImageIndex = -1;
          state.imageTransition = 1;
        }
        renderImageThumbs();
        updateScreenVisibility();
        renderStudioScreens(clock.elapsedTime);
      };
      img.src = url;
    });
  }

  if (addImagesBtn) {
    addImagesBtn.addEventListener('click', () => newsImagesInput.click());
  }

  newsImagesInput.addEventListener('change', (e) => {
    addImageFiles(e.target.files);
    newsImagesInput.value = '';
  });

  // Arrastrar y soltar fotos sobre los 5 recuadros
  imageThumbs.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageThumbs.classList.add('drag-over');
  });
  imageThumbs.addEventListener('dragleave', () => {
    imageThumbs.classList.remove('drag-over');
  });
  imageThumbs.addEventListener('drop', (e) => {
    e.preventDefault();
    imageThumbs.classList.remove('drag-over');
    if (e.dataTransfer && e.dataTransfer.files) {
      addImageFiles(e.dataTransfer.files);
    }
  });

  clearImagesBtn.addEventListener('click', () => {
    state.newsImages.forEach((item) => URL.revokeObjectURL(item.url));
    state.newsImages = [];
    state.activeImageIndex = 0;
    state.prevImageIndex = -1;
    state.imageTransition = 1;
    newsImagesInput.value = '';
    renderImageThumbs();
    updateScreenVisibility();
    renderStudioScreens(clock.elapsedTime);
  });

  screenModeSelect.addEventListener('change', () => {
    state.screenMode = screenModeSelect.value;
    updateScreenVisibility();
    renderImageThumbs();
    renderStudioScreens(clock.elapsedTime);
  });

  galleryStyleSelect.addEventListener('change', () => {
    state.galleryStyle = galleryStyleSelect.value;
    renderImageThumbs();
    renderStudioScreens(clock.elapsedTime);
  });

  imageFitSelect.addEventListener('change', () => {
    state.imageFit = imageFitSelect.value;
    renderStudioScreens(clock.elapsedTime);
  });

  // Permitir pegar imágenes directo desde el portapapeles (Ctrl+V)
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    const imgFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const f = items[i].getAsFile();
        if (f) imgFiles.push(f);
      }
    }
    if (imgFiles.length > 0) {
      addImageFiles(imgFiles);
    }
  });

  // =========================================================
  // 11. EVENTOS UI E INICIALIZACIÓN
  // =========================================================
  avatarSelect.addEventListener('change', () => {
    switchAvatarMode(avatarSelect.value);
  });

  capeToggle.addEventListener('change', updateCapeVisibility);

  let customAvatarUrl = null;
  customAvatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (customAvatarUrl) URL.revokeObjectURL(customAvatarUrl);
    customAvatarUrl = URL.createObjectURL(file);
    humanState.mode = 'custom';
    loadHumanAvatar(customAvatarUrl, file.name);
  });

  aspectSelect.addEventListener('change', applyAspectRatio);
  cameraSelect.addEventListener('change', () => {
    state.cameraMode = cameraSelect.value;
  });
  moodSelect.addEventListener('change', applyMood);
  headlineInput.addEventListener('input', updateHoloTexture);
  pitchRange.addEventListener('input', () => {
    const v = parseInt(pitchRange.value, 10);
    pitchVal.textContent = `${v >= 0 ? '+' : ''}${v} Hz`;
  });
  rateRange.addEventListener('input', () => {
    const v = parseInt(rateRange.value, 10);
    rateVal.textContent = `${v >= 0 ? '+' : ''}${v}%`;
  });

  broadcastBtn.addEventListener('click', () => startBroadcast());
  stopBtn.addEventListener('click', () => stopBroadcast(false));
  recordBtn.addEventListener('click', startRecordingAndBroadcast);

  applyAspectRatio();
  applyMood();
  updateHoloTexture();
  renderImageThumbs();
  switchAvatarMode(avatarSelect.value || 'avatarsdk');
  animate();
})();
