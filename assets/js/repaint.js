/* Family Art Painting: scroll-driven 3D repaint of a New England colonial */

const section = document.querySelector('[data-repaint]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll timeline (fractions of the pinned section)
const HOLD_END = 0.2;   // weathered house on screen
const PRIME_END = 0.5;  // primer rolled on
const PAINT_END = 0.82; // finish coat rolled on

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const state = { p: 0, s1: 0, s2: 0, t1: 0, t2: 0 };

if (section) {
  const steps = [...section.querySelectorAll('[data-repaint-steps] li')];
  const bar = section.querySelector('[data-repaint-bar]');
  const swatches = section.querySelector('[data-swatches]');
  const swatchName = section.querySelector('[data-swatch-name]');
  let renderer3d = null;

  const readScroll = () => {
    const r = section.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    state.p = clamp01(-r.top / total);
    state.t1 = clamp01((state.p - HOLD_END) / (PRIME_END - HOLD_END));
    state.t2 = clamp01((state.p - PRIME_END) / (PAINT_END - PRIME_END));
    const step = state.p < HOLD_END ? 0 : state.p < PRIME_END ? 1 : 2;
    steps.forEach((li, i) => {
      li.classList.toggle('is-active', i === step);
      li.classList.toggle('is-done', i < step);
    });
    if (bar) bar.style.transform = `scaleX(${state.p.toFixed(4)})`;
    const ready = state.p > PAINT_END - 0.04;
    if (ready !== swatches.classList.contains('is-ready')) {
      swatches.classList.toggle('is-ready', ready);
      const active = section.querySelector('.swatch[aria-checked="true"] .sr-only');
      swatchName.textContent = ready ? active.textContent : 'Unlocks at Paint and Protect';
    }
    if (renderer3d) renderer3d.wake();
  };
  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', readScroll);
  readScroll();

  // Color chips
  const chips = [...section.querySelectorAll('.swatch')];
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-checked', String(c === chip)));
      swatchName.textContent = chip.querySelector('.sr-only').textContent;
      if (renderer3d) renderer3d.setColors(chip.dataset.color, chip.dataset.shutter);
    });
    chip.addEventListener('keydown', (e) => {
      const i = chips.indexOf(chip);
      let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = chips[(i + 1) % chips.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = chips[(i - 1 + chips.length) % chips.length];
      if (n) { e.preventDefault(); n.focus(); n.click(); }
    });
  });

  // Load Three.js only when the section gets close
  const io = new IntersectionObserver(async (entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
      renderer3d = buildScene(THREE, section);
      const active = chips.find((c) => c.getAttribute('aria-checked') === 'true');
      if (active) renderer3d.setColors(active.dataset.color, active.dataset.shutter, true);
      readScroll();
    } catch (err) {
      section.classList.add('no-webgl');
    }
  }, { rootMargin: '800px 0px' });
  io.observe(section);
}

function buildScene(THREE, root) {
  const canvas = root.querySelector('[data-repaint-canvas]');
  const stage = root.querySelector('[data-repaint-stage]');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  const target = new THREE.Vector3(0, 3.7, 0);

  // Light: blue hour sky with a low warm sun
  scene.add(new THREE.HemisphereLight(0xc4d2f2, 0x2a1c24, 1.0));
  const sun = new THREE.DirectionalLight(0xffe7c8, 2.7);
  sun.position.set(9, 11, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 40 });
  sun.shadow.bias = -0.0008;
  sun.shadow.radius = 4;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x8096d6, 0.9);
  rim.position.set(-10, 6, -8);
  scene.add(rim);
  // Low amber horizon light from behind, the same dawn as the hero
  const horizon = new THREE.DirectionalLight(0xf2a25a, 1.1);
  horizon.position.set(6, 1.5, -12);
  scene.add(horizon);
  // Atmospheric perspective: far things sink into the blue hour
  scene.fog = new THREE.Fog(0x16244d, 25, 44);

  // Gouache finish: soft value banding plus paper tooth on every lit surface
  const GOUACHE = `
    vec3 pc = outgoingLight;
    float lum = max(dot(pc, vec3(0.299, 0.587, 0.114)), 1e-3);
    float band = floor(lum * 6.0 + 0.5) / 6.0;
    pc *= mix(1.0, band / lum, 0.5);
    float tooth = fract(sin(dot(floor(gl_FragCoord.xy / 1.5), vec2(12.9898, 78.233))) * 43758.5453);
    pc *= 0.94 + tooth * 0.12;
    outgoingLight = pc;
    #include <opaque_fragment>`;
  const gouache = (m) => {
    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', GOUACHE);
    };
    m.customProgramCacheKey = () => 'family-art-gouache';
    return m;
  };

  // ---------- Textures ----------
  const BOARD = 32, TEX = 512, BOARDS = TEX / BOARD, WORLD = 2.88;
  const mk = () => { const c = document.createElement('canvas'); c.width = c.height = TEX; return c; };
  const rand = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; })();

  function shadeTexture() {
    const c = mk(), g = c.getContext('2d');
    for (let i = 0; i < BOARDS; i++) {
      const y = i * BOARD;
      const grd = g.createLinearGradient(0, y, 0, y + BOARD);
      grd.addColorStop(0, '#ffffff'); grd.addColorStop(0.8, '#dcdcdc'); grd.addColorStop(1, '#8e8e8e');
      g.fillStyle = grd; g.fillRect(0, y, TEX, BOARD);
      g.fillStyle = 'rgba(40,40,40,.6)'; g.fillRect(0, y + BOARD - 2, TEX, 2);
    }
    for (let k = 0; k < 900; k++) {
      g.fillStyle = `rgba(0,0,0,${(rand() * 0.05).toFixed(3)})`;
      g.fillRect(rand() * TEX, rand() * TEX, 20 + rand() * 90, 1);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.NoColorSpace;
    return t;
  }

  function weatherTexture() {
    const c = mk(), g = c.getContext('2d');
    for (let i = 0; i < BOARDS; i++) {
      const y = i * BOARD;
      g.fillStyle = `hsl(${30 + rand() * 8}, ${32 + rand() * 14}%, ${42 + rand() * 14}%)`;
      g.fillRect(0, y, TEX, BOARD);
      for (let k = 0; k < 14; k++) {
        g.fillStyle = `rgba(60,38,20,${(0.1 + rand() * 0.2).toFixed(2)})`;
        g.fillRect(rand() * TEX, y + rand() * BOARD, 30 + rand() * 140, 1 + rand());
      }
      // Old white paint still clinging in jagged strips
      let x = -20;
      while (x < TEX) {
        const w = 18 + rand() * 120;
        if (rand() > 0.38) {
          g.fillStyle = rand() > 0.15 ? '#e8e3d6' : '#cfc8b8';
          g.beginPath();
          g.moveTo(x, y + 2 + rand() * 6);
          for (let s = 0; s <= 6; s++) g.lineTo(x + (w * s) / 6, y + 1 + rand() * 8);
          for (let s = 6; s >= 0; s--) g.lineTo(x + (w * s) / 6, y + BOARD - 4 - rand() * 10);
          g.closePath(); g.fill();
          g.strokeStyle = 'rgba(70,55,40,.35)'; g.lineWidth = 1; g.stroke();
        }
        x += w + rand() * 30;
      }
    }
    // Patches of exposed tar paper, like the real job
    for (let k = 0; k < 4; k++) {
      g.fillStyle = 'rgba(40,44,58,.85)';
      const px = rand() * TEX, py = Math.floor(rand() * BOARDS) * BOARD;
      g.fillRect(px, py, 50 + rand() * 90, BOARD * (1 + Math.floor(rand() * 2)));
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  const shadeTex = shadeTexture();
  const weatherTex = weatherTexture();

  // ---------- Paint material: weathered -> primer -> finish, wiped from the roofline down ----------
  const shared = {
    uS1: { value: 0 }, uS2: { value: 0 },
    uMinY: { value: 0.4 }, uMaxY: { value: 8.1 },
    uShade: { value: shadeTex }, uWeather: { value: weatherTex },
  };
  const sidingColor = { value: new THREE.Color('#f4f3ee') };
  const shutterColor = { value: new THREE.Color('#1f3159') };

  function paintMaterial({ textured, a, b, c, roughness = 0.82 }) {
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness, metalness: 0 });
    const own = {
      uTextured: { value: textured ? 1 : 0 },
      uColorA: { value: new THREE.Color(a || '#000000') },
      uColorB: { value: new THREE.Color(b) },
      uColorC: c.isColorUniform ? c.u : { value: new THREE.Color(c) },
    };
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, shared, own);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nvarying vec3 vWNorm;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWNorm = normalize(mat3(modelMatrix) * objectNormal);');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec3 vWPos; varying vec3 vWNorm;
          uniform sampler2D uShade; uniform sampler2D uWeather;
          uniform float uS1; uniform float uS2; uniform float uMinY; uniform float uMaxY; uniform float uTextured;
          uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;`)
        .replace('#include <map_fragment>', `
          vec2 suv = (abs(vWNorm.x) > 0.5 ? vec2(vWPos.z, vWPos.y) : vec2(vWPos.x, vWPos.y)) / ${WORLD.toFixed(2)};
          float shade = mix(1.0, texture2D(uShade, suv).r, uTextured);
          vec3 cA = mix(uColorA, texture2D(uWeather, suv).rgb, uTextured);
          float wob = sin(suv.x * 37.0) * 0.012 + sin(suv.x * 91.0 + 1.3) * 0.008;
          float h = (vWPos.y - uMinY) / (uMaxY - uMinY);
          float f1 = 1.04 - uS1 * 1.1;
          float f2 = 1.04 - uS2 * 1.1;
          float m1 = smoothstep(f1 - 0.006, f1 + 0.006, h + wob);
          float m2 = smoothstep(f2 - 0.006, f2 + 0.006, h + wob);
          vec3 paintCol = mix(mix(cA, uColorB, m1), uColorC, m2);
          diffuseColor.rgb = paintCol * mix(shade, 1.0 - (1.0 - shade) * 0.7, m1);`)
        .replace('#include <opaque_fragment>', GOUACHE);
    };
    m.customProgramCacheKey = () => 'family-art-paint';
    return m;
  }
  const ref = (u) => ({ isColorUniform: true, u });

  const mSiding = paintMaterial({ textured: true, b: '#d4d7dd', c: ref(sidingColor) });
  const mTrim = paintMaterial({ textured: false, a: '#b9ad94', b: '#e6e8ec', c: '#ffffff', roughness: 0.7 });
  const mShutter = paintMaterial({ textured: false, a: '#4d4a43', b: '#9aa0ab', c: ref(shutterColor), roughness: 0.6 });
  const mDoor = paintMaterial({ textured: false, a: '#6f4e37', b: '#a3a9b3', c: '#c8161c', roughness: 0.5 });
  const mRoof = gouache(new THREE.MeshStandardMaterial({ color: '#2c3148', roughness: 0.92 }));
  const mBrick = gouache(new THREE.MeshStandardMaterial({ color: '#8a3a2c', roughness: 0.95 }));
  const mStone = gouache(new THREE.MeshStandardMaterial({ color: '#5d6172', roughness: 0.95 }));
  const mGlass = new THREE.MeshStandardMaterial({ color: '#1d2a48', roughness: 0.15, metalness: 0.3 });
  const mLit = new THREE.MeshStandardMaterial({ color: '#3a2c1a', emissive: '#f2b24a', emissiveIntensity: 1.25, roughness: 0.4 });

  // ---------- House ----------
  const house = new THREE.Group();
  scene.add(house);
  const W = 6, D = 8, H0 = 0.4, H1 = 5.6, PITCH = 2.5;
  const box = (w, h, d, mat, x, y, z) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true;
    house.add(mesh);
    return mesh;
  };

  box(W + 0.3, H0, D + 0.3, mStone, 0, H0 / 2, 0);
  box(W, H1 - H0, D, mSiding, 0, (H0 + H1) / 2, 0);

  // Gable walls front and back
  const tri = new THREE.Shape();
  tri.moveTo(-W / 2, 0); tri.lineTo(W / 2, 0); tri.lineTo(0, PITCH); tri.closePath();
  const triGeo = new THREE.ShapeGeometry(tri);
  [1, -1].forEach((side) => {
    const g = new THREE.Mesh(triGeo, mSiding);
    g.position.set(0, H1, (side * D) / 2);
    if (side < 0) g.rotation.y = Math.PI;
    g.castShadow = true; g.receiveShadow = true;
    house.add(g);
  });

  // Roof slabs
  const slope = Math.atan2(PITCH, W / 2);
  const slabLen = Math.hypot(W / 2, PITCH) + 0.55;
  [1, -1].forEach((side) => {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(slabLen, 0.2, D + 0.9), mRoof);
    slab.rotation.z = -side * slope;
    slab.position.set(side * (W / 4 + 0.2 * Math.sin(slope) + 0.13), H1 + PITCH / 2 + 0.12 * Math.cos(slope) - 0.05, 0);
    slab.castShadow = true; slab.receiveShadow = true;
    house.add(slab);
  });
  box(0.22, 0.22, D + 0.9, mRoof, 0, H1 + PITCH + 0.06, 0);

  // Chimney
  box(0.7, 2.6, 0.9, mBrick, -1.3, H1 + 1.6, -2.2);
  box(0.86, 0.16, 1.06, mStone, -1.3, H1 + 2.95, -2.2);

  // Corner boards and rake trim
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => box(0.2, H1 - H0, 0.2, mTrim, sx * (W / 2), (H0 + H1) / 2, sz * (D / 2)));
  [1, -1].forEach((sz) => {
    [1, -1].forEach((sx) => {
      const rake = box(Math.hypot(W / 2, PITCH) + 0.3, 0.18, 0.14, mTrim, sx * (W / 4), H1 + PITCH / 2 + 0.02, sz * (D / 2 + 0.08));
      rake.rotation.z = -sx * slope;
    });
    box(W + 0.3, 0.2, 0.14, mTrim, 0, H1 + 0.02, sz * (D / 2 + 0.08));
  });

  // Windows with shutters
  function windowAt(x, y, z, axis, w = 0.9, h = 1.3, lit = false) {
    const g = new THREE.Group();
    const add = (geo, mat, px, py, pz) => { const m = new THREE.Mesh(geo, mat); m.position.set(px, py, pz); m.castShadow = true; g.add(m); return m; };
    add(new THREE.BoxGeometry(w + 0.26, h + 0.26, 0.08), mTrim, 0, 0, 0.03);
    add(new THREE.BoxGeometry(w, h, 0.06), lit ? mLit : mGlass, 0, 0, 0.06);
    add(new THREE.BoxGeometry(0.06, h, 0.06), mTrim, 0, 0, 0.1);
    add(new THREE.BoxGeometry(w, 0.06, 0.06), mTrim, 0, 0, 0.1);
    add(new THREE.BoxGeometry(w + 0.4, 0.08, 0.2), mTrim, 0, -h / 2 - 0.16, 0.1);
    [-1, 1].forEach((s) => add(new THREE.BoxGeometry(0.38, h + 0.1, 0.06), mShutter, s * (w / 2 + 0.36), 0, 0.05));
    g.position.set(x, y, z);
    if (axis === 'x+') g.rotation.y = Math.PI / 2;
    if (axis === 'x-') g.rotation.y = -Math.PI / 2;
    if (axis === 'z-') g.rotation.y = Math.PI;
    house.add(g);
  }
  const F1 = 2.05, F2 = 4.3;
  windowAt(-1.65, F1, D / 2, 'z+', 0.9, 1.3, true);
  windowAt(1.65, F1, D / 2, 'z+');
  windowAt(-1.65, F2, D / 2, 'z+');
  windowAt(1.65, F2, D / 2, 'z+', 0.9, 1.3, true);
  windowAt(0, H1 + 0.95, D / 2, 'z+', 0.6, 0.8, true);
  [-2.6, 0, 2.6].forEach((z, i) => {
    windowAt(W / 2, F1, z, 'x+', 0.9, 1.3, i === 1);
    windowAt(W / 2, F2, z, 'x+');
    windowAt(-W / 2, F1, z, 'x-');
    windowAt(-W / 2, F2, z, 'x-', 0.9, 1.3, i === 2);
  });

  // Front door with pediment and steps
  box(1.24, 2.26, 0.08, mTrim, 0, H0 + 1.13, D / 2 + 0.03);
  box(1.0, 2.05, 0.08, mDoor, 0, H0 + 1.04, D / 2 + 0.07);
  const ped = new THREE.Shape();
  ped.moveTo(-0.95, 0); ped.lineTo(0.95, 0); ped.lineTo(0, 0.5); ped.closePath();
  const pedMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(ped, { depth: 0.5, bevelEnabled: false }), mTrim);
  pedMesh.position.set(0, H0 + 2.35, D / 2);
  pedMesh.castShadow = true;
  house.add(pedMesh);
  box(1.9, 0.12, 0.5, mTrim, 0, H0 + 2.3, D / 2 + 0.25);
  box(1.8, 0.2, 0.7, mStone, 0, 0.3, D / 2 + 0.35);
  box(1.8, 0.2, 0.45, mStone, 0, 0.1, D / 2 + 0.85);

  // ---------- Yard ----------
  const yard = new THREE.Group();
  scene.add(yard);
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 10.3, 0.8, 72),
    [gouache(new THREE.MeshStandardMaterial({ color: '#141d3d', roughness: 1 })), gouache(new THREE.MeshStandardMaterial({ color: '#253260', roughness: 1 })), gouache(new THREE.MeshStandardMaterial({ color: '#141d3d' }))]
  );
  plinth.position.y = -0.4;
  plinth.receiveShadow = true;
  yard.add(plinth);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 5.4), mStone);
  path.rotation.x = -Math.PI / 2; path.position.set(0, 0.012, D / 2 + 3.6); path.receiveShadow = true;
  yard.add(path);

  const maples = ['#8e1c1f', '#a32222', '#c8161c', '#b8401f', '#d0602a', '#7a1a22'];

  // Painted foliage cels: gouache blobs on transparent cards, the same hand as the hero planes
  function foliageTexture(seedShift) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    for (let k = 0; k < seedShift; k++) rand();
    const blob = (x, y, rad, col, a) => {
      g.globalAlpha = a; g.fillStyle = col; g.beginPath();
      for (let i = 0; i <= 18; i++) {
        const t = (i / 18) * Math.PI * 2, rr = rad * (0.82 + rand() * 0.3);
        g.lineTo(x + Math.cos(t) * rr, y + Math.sin(t) * rr);
      }
      g.closePath(); g.fill();
    };
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2, d = rand() * 70;
      blob(128 + Math.cos(a) * d, 132 + Math.sin(a) * d * 0.8, 22 + rand() * 30, maples[Math.floor(rand() * maples.length)], 0.95);
    }
    for (let i = 0; i < 9; i++) blob(150 + (rand() - 0.5) * 90, 96 + (rand() - 0.5) * 60, 8 + rand() * 14, ['#e06a32', '#e88a3e', '#d9542a'][i % 3], 0.8);
    for (let i = 0; i < 7; i++) blob(100 + (rand() - 0.5) * 90, 175 + (rand() - 0.5) * 30, 12 + rand() * 16, '#5e1418', 0.7);
    g.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const foliage = [foliageTexture(0), foliageTexture(11), foliageTexture(23)].map((map) =>
    new THREE.SpriteMaterial({ map, alphaTest: 0.4, fog: true }));
  const blobShadow = new THREE.MeshBasicMaterial({ color: '#070d22', transparent: true, opacity: 0.45, depthWrite: false });

  function tree(x, z, s) {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14 * s, 0.24 * s, 3.4 * s, 8), new THREE.MeshStandardMaterial({ color: '#3a2a26', roughness: 1 }));
    trunk.position.y = 1.7 * s; trunk.castShadow = true; g.add(trunk);
    for (let i = 0; i < 5; i++) {
      const sp = new THREE.Sprite(foliage[i % foliage.length]);
      const size = (2.6 + rand() * 1.4) * s;
      sp.scale.set(size, size, 1);
      sp.position.set((rand() - 0.5) * 2 * s, (3.6 + rand() * 1.5) * s, (rand() - 0.5) * 2 * s);
      g.add(sp);
    }
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.9 * s, 32), blobShadow);
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.015;
    g.add(shadow);
    g.position.set(x, 0, z);
    yard.add(g);
  }
  tree(-6.2, -3.2, 1.05);
  tree(6.4, -2.6, 0.95);
  tree(-3.6, -7, 0.8);

  const leafCanvas = document.createElement('canvas'); leafCanvas.width = leafCanvas.height = 64;
  const lg = leafCanvas.getContext('2d');
  lg.fillStyle = '#fff';
  lg.fill(new Path2D('M32 1 36 13 42 9 40 22 51 15 49 23 62 24 54 32 58 36 44 40 45 45 35 41 33 63 31 63 29 41 19 45 20 40 6 36 10 32 2 24 15 23 13 15 24 22 22 9 28 13Z'));
  const leafTex = new THREE.CanvasTexture(leafCanvas);
  const leafGeo = new THREE.PlaneGeometry(0.34, 0.34);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, side: THREE.DoubleSide, alphaMap: leafTex, alphaTest: 0.5 });
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, 260);
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  for (let i = 0; i < 260; i++) {
    const a = rand() * Math.PI * 2, r = 4.6 + rand() * 5;
    dummy.position.set(Math.cos(a) * r, 0.02, Math.sin(a) * r);
    dummy.rotation.set(-Math.PI / 2, 0, rand() * Math.PI);
    dummy.updateMatrix();
    leaves.setMatrixAt(i, dummy.matrix);
    leaves.setColorAt(i, col.set(maples[Math.floor(rand() * maples.length)]));
  }
  leaves.receiveShadow = true;
  yard.add(leaves);

  // ---------- Roller ----------
  const roller = new THREE.Group();
  const nap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 24), new THREE.MeshStandardMaterial({ color: '#f4f3ee', roughness: 1 }));
  nap.rotation.z = Math.PI / 2;
  roller.add(nap);
  const metal = new THREE.MeshStandardMaterial({ color: '#b9bec8', metalness: 0.8, roughness: 0.3 });
  const rod = (len, x, y, z, rz = 0, rx = 0) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 8), metal);
    m.position.set(x, y, z); m.rotation.set(rx, 0, rz); roller.add(m); return m;
  };
  rod(0.5, 0.65, -0.22, 0.12, 0, 0.5);
  rod(0.7, 0.65, -0.6, 0.3, 0, 0.3);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.1, 12), new THREE.MeshStandardMaterial({ color: '#c8161c', roughness: 0.5 }));
  grip.position.set(0.65, -1.3, 0.55); grip.rotation.x = 0.35;
  roller.add(grip);
  roller.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  roller.scale.setScalar(0.001);
  scene.add(roller);

  // ---------- Layout and loop ----------
  let width = 1, height = 1, wide = true;
  function resize() {
    width = stage.clientWidth; height = stage.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    wide = width > 900;
    if (wide) camera.setViewOffset(width, height, -width * 0.2, 0, width, height);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    wake();
  }
  window.addEventListener('resize', resize);

  const colorFrom = { siding: new THREE.Color(), shutter: new THREE.Color() };
  const colorTo = { siding: new THREE.Color('#f4f3ee'), shutter: new THREE.Color('#1f3159') };
  let colorT = 1;
  function setColors(siding, shutter, instant) {
    colorFrom.siding.copy(sidingColor.value);
    colorFrom.shutter.copy(shutterColor.value);
    colorTo.siding.set(siding);
    colorTo.shutter.set(shutter);
    colorT = instant ? 1 : 0;
    if (instant) { sidingColor.value.copy(colorTo.siding); shutterColor.value.copy(colorTo.shutter); }
    wake();
  }

  let visible = false, running = false, last = performance.now(), idle = 0;
  const clock = { t: 0 };
  function wake() { idle = 0; if (visible && !running) { running = true; last = performance.now(); requestAnimationFrame(tick); } }
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) wake(); }, { rootMargin: '100px 0px' }).observe(root);

  const yMin = shared.uMinY.value, yMax = shared.uMaxY.value;
  const primerColor = new THREE.Color('#d4d7dd');
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock.t += dt;

    const k = 1 - Math.pow(0.0015, dt);
    state.s1 += (state.t1 - state.s1) * k;
    state.s2 += (state.t2 - state.s2) * k;
    shared.uS1.value = state.s1;
    shared.uS2.value = state.s2;

    if (colorT < 1) {
      colorT = Math.min(1, colorT + dt / 0.7);
      const e = 1 - Math.pow(1 - colorT, 3);
      sidingColor.value.copy(colorFrom.siding).lerp(colorTo.siding, e);
      shutterColor.value.copy(colorFrom.shutter).lerp(colorTo.shutter, e);
    }

    // Camera drifts around the front corner as the work progresses
    const theta = -0.62 + state.p * 0.95 + (reduceMotion ? 0 : Math.sin(clock.t * 0.3) * 0.015);
    const radius = wide ? 27 : 30;
    camera.position.set(Math.sin(theta) * radius, 8.2 - state.p * 1.4, Math.cos(theta) * radius);
    camera.lookAt(target);

    // Roller rides the wet edge on the front wall
    const phase1 = state.s1 > 0.005 && state.s1 < 0.995;
    const phase2 = state.s2 > 0.005 && state.s2 < 0.995;
    const activeS = phase2 ? state.s2 : state.s1;
    const show = phase1 || phase2 ? 1 : 0;
    const sc = roller.scale.x + (Math.max(0.001, show) - roller.scale.x) * k;
    roller.scale.setScalar(sc);
    const edge = yMin + (1.04 - activeS * 1.1) * (yMax - yMin);
    const halfWidth = edge > H1 ? Math.max(0.2, (W / 2) * (1 - (edge - H1) / PITCH) - 0.5) : W / 2 - 0.7;
    roller.position.set(Math.sin(clock.t * 2.4) * halfWidth, edge, D / 2 + 0.32);
    roller.rotation.z = Math.sin(clock.t * 2.4 + 1.2) * 0.08;
    nap.material.color.copy(phase2 ? sidingColor.value : primerColor);

    renderer.render(scene, camera);

    const settled = Math.abs(state.t1 - state.s1) < 0.0005 && Math.abs(state.t2 - state.s2) < 0.0005 && colorT >= 1 && sc < 0.01;
    idle = settled ? idle + dt : 0;
    if (visible && (idle < 1.2 || !reduceMotion)) requestAnimationFrame(tick);
    else running = false;
  }

  resize();
  return { wake, setColors };
}
