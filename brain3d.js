/* ============================================================
   Brain3D — вращаемая 3D-модель мозга (Three.js r128).
   Публичный API (window.Brain3D):
     init(container)
     highlight({primary, secondary})     — подсветить зоны
     clear()                              — сбросить подсветку
     pick(id)                             — выделить одну структуру (атлас)
     setView(name)                        — 'side'|'front'|'top'|'threeq'
     showChemistry(list)                  — потоки нейромедиаторов
     clearChemistry()
     showAfter(calm, activate) / showBefore()
     onRegionClick(cb)
   ============================================================ */
(function () {
  const DEG = Math.PI / 180;
  let scene, camera, renderer, controls, raycaster, brainGroup;
  let container, regionClickCb = null, tipEl = null;
  const SIDE_RU = { left: 'левое', right: 'правое' };
  const SIDE_EN = { left: 'left', right: 'right' };
  function isEN() { return typeof lang !== 'undefined' && lang === 'en'; }
  function SIDE_LABEL(s) { if (!s) return ''; return (isEN() ? SIDE_EN[s] + ' hemisphere' : SIDE_RU[s] + ' полушарие'); }
  function regionLabel(id) {
    if (typeof regName === 'function') return regName(id);
    return (REGIONS[id] ? REGIONS[id].name : id).split('(')[0].trim();
  }
  function rebuildLabels() {
    if (!brainGroup) return;
    Object.keys(markers).forEach(id => {
      const m = markers[id]; if (!m) return;
      const vis = m.label.visible, pos = m.label.position.clone();
      brainGroup.remove(m.label);
      if (m.label.material.map) m.label.material.map.dispose();
      m.label.material.dispose();
      const nl = makeLabel(regionLabel(id));
      nl.position.copy(pos); nl.visible = vis;
      brainGroup.add(nl); m.label = nl;
    });
  }
  const markers = {};          // id -> { meshes:[], label, def }
  const lobeMeshes = {};       // lobeId -> surface mesh
  let lobeClickCb = null, pickedLobe = null;
  const LOBE_COL = {
    frontal: 0x7ec27e, parietal: 0xf0a3b4, temporal: 0x7fc4e8,
    occipital: 0xb79be0, cerebellum_lobe: 0xd8a0b8, brainstem_lobe: 0xe6b48c
  };
  let chemGroup, chemFlows = [];
  let afterState = null;        // {calm:Set, activate:Set} когда включён режим «после»
  let idleTimer = 0;
  const clock = { t: 0 };

  const COL = {
    base: 0x8ea0d8, dim: 0x4a5680,
    primary: 0xff5b6b, secondary: 0xffcf5b,
    pick: 0x6ea8ff, calm: 0x64d6a4
  };

  /* ---------- Инициализация сцены ---------- */
  function init(el) {
    container = el;
    scene = new THREE.Scene();

    const w = el.clientWidth, h = el.clientHeight || 460;
    camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(3.4, 1.6, 3.2);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    // Свет
    scene.add(new THREE.AmbientLight(0x8090c0, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(4, 6, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x6ea8ff, 0.7); rim.position.set(-5, 1, -4); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xff9ecb, 0.35); fill.position.set(0, -4, 3); scene.add(fill);

    brainGroup = new THREE.Group();
    scene.add(brainGroup);

    buildBrain();
    buildMarkers();

    chemGroup = new THREE.Group();
    brainGroup.add(chemGroup);

    // Управление вращением
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.6;
    controls.maxDistance = 7;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.addEventListener('start', () => { controls.autoRotate = false; idleTimer = 0; });
    controls.addEventListener('end', () => { idleTimer = 0.001; });

    raycaster = new THREE.Raycaster();
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', hideTip);

    // всплывающая подсказка при наведении
    tipEl = document.createElement('div');
    tipEl.className = 'brain-tip';
    tipEl.style.cssText = 'position:absolute;pointer-events:none;z-index:6;padding:5px 9px;border-radius:8px;background:rgba(10,14,28,.92);border:1px solid #3a466a;color:#e7ecff;font-size:12.5px;font-weight:600;white-space:nowrap;transform:translate(-50%,-140%);opacity:0;transition:opacity .12s;display:none';
    el.style.position = el.style.position || 'relative';
    el.appendChild(tipEl);

    window.addEventListener('resize', onResize);
    animate();
  }

  /* ---------- Мозг из деформированных полушарий ---------- */
  function gyri(geo, amp) {
    const pos = geo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();
      const d = amp * (Math.sin(9 * n.x + 1.5) * Math.sin(7.5 * n.y) * Math.sin(8 * n.z)
        + 0.55 * Math.sin(14 * n.y + 0.4) * Math.sin(12 * n.z));
      v.multiplyScalar(1 + d);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // Классификация точки поверхности коры в долю (локальное пространство мозга)
  function classifyLobe(x, y, z) {
    if (z > 0.34) return 'frontal';                 // лоб — спереди
    if (z < -0.60) return 'occipital';              // затылок — сзади
    if (y < -0.02 && z < 0.34) return 'temporal';   // висок — нижне-боковая
    return 'parietal';                              // темя — верх/задне-средняя
  }

  function lobeMaterial(id) {
    const c = LOBE_COL[id];
    return new THREE.MeshStandardMaterial({
      color: c, emissive: c, emissiveIntensity: 0.05,
      roughness: 0.62, metalness: 0.0, transparent: true, opacity: 0.30,
      depthWrite: false, side: THREE.DoubleSide, flatShading: false
    });
  }

  function buildBrain() {
    // Кора: две полусферы с извилинами, разбитые на доли по положению
    const buckets = { frontal: { p: [], n: [] }, parietal: { p: [], n: [] }, temporal: { p: [], n: [] }, occipital: { p: [], n: [] } };
    [-1, 1].forEach(sign => {
      let g = gyri(new THREE.SphereGeometry(1, 96, 64), 0.06);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {   // «запекаем» масштаб и сдвиг полушария
        pos.setXYZ(i, pos.getX(i) * 0.60 + sign * 0.42, pos.getY(i) * 0.82, pos.getZ(i) * 1.24);
      }
      g.computeVertexNormals();
      g = g.toNonIndexed();
      const P = g.attributes.position, N = g.attributes.normal;
      for (let t = 0; t < P.count; t += 3) {
        const cx = (P.getX(t) + P.getX(t + 1) + P.getX(t + 2)) / 3;
        const cy = (P.getY(t) + P.getY(t + 1) + P.getY(t + 2)) / 3;
        const cz = (P.getZ(t) + P.getZ(t + 1) + P.getZ(t + 2)) / 3;
        const b = buckets[classifyLobe(cx, cy, cz)];
        for (let k = 0; k < 3; k++) {
          b.p.push(P.getX(t + k), P.getY(t + k), P.getZ(t + k));
          b.n.push(N.getX(t + k), N.getY(t + k), N.getZ(t + k));
        }
      }
    });
    Object.keys(buckets).forEach(id => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(buckets[id].p, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(buckets[id].n, 3));
      const mesh = new THREE.Mesh(geo, lobeMaterial(id));
      mesh.userData.lobeId = id;
      brainGroup.add(mesh);
      lobeMeshes[id] = mesh;
    });

    // Мозжечок (складчатый)
    const cg = gyri(new THREE.SphereGeometry(1, 56, 40), 0.11);
    const cm = new THREE.Mesh(cg, lobeMaterial('cerebellum_lobe'));
    cm.scale.set(0.5, 0.34, 0.42); cm.position.set(0, -0.52, -0.9);
    cm.userData.lobeId = 'cerebellum_lobe';
    brainGroup.add(cm); lobeMeshes['cerebellum_lobe'] = cm;

    // Ствол мозга
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 0.7, 24), lobeMaterial('brainstem_lobe'));
    st.position.set(0, -0.72, -0.18); st.rotation.x = 0.35;
    st.userData.lobeId = 'brainstem_lobe';
    brainGroup.add(st); lobeMeshes['brainstem_lobe'] = st;
  }

  /* ---------- Подсветка долей ---------- */
  function setLobe(id, level) {   // level: 0 base, 1 hover, 2 picked
    const m = lobeMeshes[id]; if (!m) return;
    m.material.opacity = level >= 2 ? 0.82 : level === 1 ? 0.55 : 0.30;
    m.material.emissiveIntensity = level >= 2 ? 0.55 : level === 1 ? 0.28 : 0.05;
  }
  function clearLobes() { Object.keys(lobeMeshes).forEach(id => setLobe(id, pickedLobe === id ? 2 : 0)); }
  function pickLobe(id) {
    pickedLobe = id;
    resetAll('dim');                          // приглушить точечные структуры
    Object.keys(lobeMeshes).forEach(k => setLobe(k, k === id ? 2 : 0));
    const m = lobeMeshes[id]; if (m) { /* без движения камеры */ }
  }

  /* ---------- Маркеры структур ---------- */
  function makeMarker(r) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(r, 22, 16),
      new THREE.MeshStandardMaterial({
        color: COL.base, emissive: COL.base, emissiveIntensity: 0.25,
        roughness: 0.35, transparent: true, opacity: 0.9, depthTest: false
      })
    );
    m.renderOrder = 3;
    return m;
  }

  // мягкое свечение вокруг активной структуры (additive-спрайт)
  let haloTex = null;
  function getHaloTex() {
    if (haloTex) return haloTex;
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const ctx = cv.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    haloTex = new THREE.CanvasTexture(cv);
    return haloTex;
  }
  function makeHalo() {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: getHaloTex(), transparent: true, blending: THREE.AdditiveBlending,
      depthTest: false, depthWrite: false, opacity: 0
    }));
    sp.renderOrder = 2; sp.visible = false;
    return sp;
  }

  function makeLabel(text) {
    const pad = 8, fs = 34;
    const cv = document.createElement('canvas');
    const ctx = cv.getContext('2d');
    ctx.font = `600 ${fs}px -apple-system, Arial`;
    const tw = ctx.measureText(text).width;
    cv.width = tw + pad * 2; cv.height = fs + pad * 2;
    ctx.font = `600 ${fs}px -apple-system, Arial`;
    ctx.fillStyle = 'rgba(10,14,28,0.78)';
    roundRect(ctx, 0, 0, cv.width, cv.height, 12); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
    ctx.fillText(text, pad, cv.height / 2 + 1);
    const tex = new THREE.CanvasTexture(cv);
    tex.minFilter = THREE.LinearFilter;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    const scl = 0.0024;
    sp.scale.set(cv.width * scl, cv.height * scl, 1);
    sp.renderOrder = 5;
    sp.visible = false;
    return sp;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function buildMarkers() {
    Object.keys(REGION_POS).forEach(id => {
      const def = REGION_POS[id];
      const meshes = [];
      const pts = def.points ? def.points
        : def.bilateral ? [def.p, [-def.p[0], def.p[1], def.p[2]]]
          : [def.p];
      const halos = [];
      pts.forEach(p => {
        const mk = makeMarker(def.r || 0.11);
        mk.position.set(p[0], p[1], p[2]);
        mk.userData.regionId = id;
        // сторона полушария (для парных структур)
        mk.userData.side = (def.bilateral || def.points) ? (p[0] > 0.02 ? 'right' : p[0] < -0.02 ? 'left' : '') : '';
        brainGroup.add(mk);
        meshes.push(mk);
        const halo = makeHalo();
        halo.position.set(p[0], p[1], p[2]);
        brainGroup.add(halo);
        halos.push(halo);
      });
      const name = (REGIONS[id] ? REGIONS[id].name : id).split('(')[0].trim();
      const label = makeLabel(name);
      const lp = pts[0];
      label.position.set(lp[0], lp[1] + (def.r || 0.11) + 0.16, lp[2]);
      brainGroup.add(label);
      markers[id] = { meshes, halos, label, def, center: new THREE.Vector3(...(def.points ? def.points[0] : def.p)) };
    });
  }

  /* ---------- Подсветка ---------- */
  function setMarker(id, state) {
    const m = markers[id]; if (!m) return;
    m.meshes.forEach(mesh => { mesh.userData.state = state; });
    m.label.visible = (state === 'primary' || state === 'secondary' || state === 'pick');
    const c = state === 'primary' ? COL.primary
      : state === 'secondary' ? COL.secondary
        : state === 'pick' ? COL.pick
          : state === 'calm' ? COL.calm
            : state === 'dim' ? COL.dim : COL.base;
    m.meshes.forEach(mesh => {
      mesh.material.color.setHex(c);
      mesh.material.emissive.setHex(c);
      mesh.material.emissiveIntensity =
        (state === 'primary') ? 0.9 : (state === 'secondary' || state === 'pick' || state === 'calm') ? 0.6 : 0.15;
      mesh.material.opacity = (state === 'dim') ? 0.22 : (state === 'base') ? 0.55 : 0.95;
      mesh.userData.baseScale = (state === 'primary') ? 1.35 : (state === 'secondary') ? 1.15 : 1;
    });
    // свечение вокруг активных структур
    const glow = { primary: 0.95, pick: 0.7, secondary: 0.55, calm: 0.6, activate: 0.9 }[state] || 0;
    const r = m.def.r || 0.11;
    (m.halos || []).forEach(h => {
      h.visible = glow > 0;
      h.material.color.setHex(c);
      h.material.opacity = glow;
      const s = r * (state === 'primary' || state === 'activate' ? 11 : 8);
      h.scale.set(s, s, 1);
    });
  }

  function resetAll(to) {
    Object.keys(markers).forEach(id => setMarker(id, to || 'base'));
  }

  function highlight(opt) {
    afterState = null; pickedLobe = null; if (hoverLobe) hoverLobe = null; clearLobes();
    const primary = opt.primary || [], secondary = opt.secondary || [];
    const active = new Set([...primary, ...secondary]);
    resetAll('dim');
    secondary.forEach(id => setMarker(id, 'secondary'));
    primary.forEach(id => setMarker(id, 'primary'));
    // если ничего не активно — вернуть базовый вид
    if (!active.size) resetAll('base');
  }

  function clear() {
    afterState = null; pickedLobe = null; clearLobes();
    resetAll('base');
    clearChemistry();
  }

  function pick(id, focus) {
    afterState = null; pickedLobe = null; clearLobes();
    clearChemistry();
    resetAll('dim');
    setMarker(id, 'pick');
    if (focus) focusOn(id);   /* камера двигается только по явному запросу, не при клике */
  }

  /* ---------- Нейрохимия ---------- */
  function curveBetween(aId, bId) {
    const a = markers[aId] && markers[aId].center;
    const b = markers[bId] && markers[bId].center;
    if (!a || !b) return null;
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += 0.28 + a.distanceTo(b) * 0.15;           // приподнять дугу
    mid.multiplyScalar(1.04);
    return new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
  }

  function showChemistry(list) {
    clearChemistry();
    if (!list || !list.length) return;
    list.forEach(chem => {
      const c = CHEMISTRY[chem]; if (!c) return;
      const col = new THREE.Color(c.color);
      c.paths.forEach(([a, b]) => {
        const curve = curveBetween(a, b); if (!curve) return;
        // тонкая трубка-русло
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 32, 0.012, 6, false),
          new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.28, depthTest: false })
        );
        tube.renderOrder = 2; chemGroup.add(tube);
        // летящие частицы
        const N = 5;
        for (let i = 0; i < N; i++) {
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.035, 10, 8),
            new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.95, depthTest: false })
          );
          dot.renderOrder = 4;
          chemGroup.add(dot);
          chemFlows.push({ curve, dot, t: i / N, speed: 0.28 + Math.random() * 0.12 });
        }
      });
    });
  }
  function clearChemistry() {
    chemFlows = [];
    if (chemGroup) while (chemGroup.children.length) {
      const o = chemGroup.children.pop();
      o.geometry && o.geometry.dispose();
      o.material && o.material.dispose();
    }
  }

  // Связь «конфликта»: встречные потоки между двумя спорящими зонами
  function showConflict(aId, bId) {
    const curve = curveBetween(aId, bId); if (!curve) return;
    const col = new THREE.Color(0xffffff);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 32, 0.014, 6, false),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35, depthTest: false })
    );
    tube.renderOrder = 2; chemGroup.add(tube);
    for (let i = 0; i < 4; i++) {
      [1, -1].forEach(dir => {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 10, 8),
          new THREE.MeshBasicMaterial({ color: dir > 0 ? 0xff7b8a : 0x8ea0ff, transparent: true, opacity: 0.95, depthTest: false })
        );
        dot.renderOrder = 4; chemGroup.add(dot);
        chemFlows.push({ curve, dot, t: i / 4, speed: dir * (0.3 + Math.random() * 0.08), rev: dir < 0 });
      });
    }
  }

  /* ---------- Режим «до / после» ---------- */
  function showAfter(calm, activate) {
    afterState = { calm: new Set(calm || []), activate: new Set(activate || []) };
    // приглушаем всё, кроме участников
    Object.keys(markers).forEach(id => {
      if (afterState.calm.has(id)) setMarker(id, 'calm');
      else if (afterState.activate.has(id)) setMarker(id, 'primary'), setMarker(id, 'calm'); // включённые тоже зелёные, но ярче
      else setMarker(id, 'dim');
    });
    // включённые делаем ярко-зелёными
    (activate || []).forEach(id => {
      const m = markers[id]; if (!m) return;
      m.label.visible = true;
      m.meshes.forEach(mesh => {
        mesh.material.color.setHex(COL.calm); mesh.material.emissive.setHex(COL.calm);
        mesh.material.emissiveIntensity = 0.95; mesh.userData.baseScale = 1.3; mesh.userData.state = 'activate';
      });
    });
    (calm || []).forEach(id => { const m = markers[id]; if (m) m.label.visible = true; });
  }

  /* ---------- Сигнал по пути (для сценариев курса) ---------- */
  function showSignal(ids, color) {
    pickedLobe = null; clearLobes(); afterState = null;
    clearChemistry();
    resetAll('dim');
    ids.forEach((id, i) => { if (markers[id]) setMarker(id, i === 0 ? 'primary' : 'secondary'); });
    const col = new THREE.Color(color || 0x8ea0ff);
    for (let i = 0; i < ids.length - 1; i++) {
      const curve = curveBetween(ids[i], ids[i + 1]); if (!curve) continue;
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.012, 6, false),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.28, depthTest: false }));
      tube.renderOrder = 2; chemGroup.add(tube);
      for (let k = 0; k < 4; k++) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.033, 10, 8),
          new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.95, depthTest: false }));
        dot.renderOrder = 4; chemGroup.add(dot);
        chemFlows.push({ curve, dot, t: k / 4, speed: 0.32 });
      }
    }
  }

  /* ---------- Ракурсы ---------- */
  const VIEWS = {
    side: [3.9, 0.5, 0.2], front: [0.2, 0.4, 4.4],
    top: [0.1, 4.4, 0.15], threeq: [3.2, 1.9, 3.0]
  };
  let camTween = null;
  function setView(name) {
    const v = VIEWS[name] || VIEWS.threeq;
    controls.autoRotate = false;
    camTween = { to: new THREE.Vector3(v[0], v[1], v[2]), from: camera.position.clone(), t: 0 };
  }
  function focusOn(id) {
    const m = markers[id]; if (!m) return;
    const dir = m.center.clone().normalize();
    const to = dir.multiplyScalar(4.2); to.y += 0.6;
    controls.autoRotate = false;
    camTween = { to, from: camera.position.clone(), t: 0 };
  }

  /* ---------- Взаимодействие ---------- */
  let downXY = null, hoverLobe = null;
  function onPointerDown(e) { downXY = [e.clientX, e.clientY]; }

  function screenRay(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1), camera);
    return rect;
  }
  function hitMarker(e) {
    screenRay(e);
    const all = []; Object.values(markers).forEach(m => m.meshes.forEach(x => all.push(x)));
    const h = raycaster.intersectObjects(all, false);
    return h.length ? h[0].object : null;
  }
  function hitLobe(e) {
    screenRay(e);
    const h = raycaster.intersectObjects(Object.values(lobeMeshes), false);
    return h.length ? h[0].object : null;
  }

  function onPointerUp(e) {
    if (!downXY) return;
    const moved = Math.hypot(e.clientX - downXY[0], e.clientY - downXY[1]);
    downXY = null;
    if (moved > 6) return;                                  // это было вращение
    const mk = hitMarker(e);
    if (mk) { if (regionClickCb) regionClickCb(mk.userData.regionId); return; }
    const lb = hitLobe(e);
    if (lb && lobeClickCb) lobeClickCb(lb.userData.lobeId);
  }

  function setHoverLobe(id) {
    if (hoverLobe === id) return;
    if (hoverLobe && hoverLobe !== pickedLobe) setLobe(hoverLobe, 0);
    hoverLobe = id;
    if (id && id !== pickedLobe) setLobe(id, 1);
  }
  function showTipAt(e, text) {
    const rect = renderer.domElement.getBoundingClientRect();
    tipEl.textContent = text;
    tipEl.style.left = Math.max(70, Math.min(rect.width - 70, e.clientX - rect.left)) + 'px';
    tipEl.style.top = Math.max(30, e.clientY - rect.top) + 'px';
    tipEl.style.display = 'block'; tipEl.style.opacity = '1';
  }
  function lobeName(id) {
    if (typeof LOBES !== 'undefined' && LOBES[id]) return LOBES[id].name;
    return id;
  }
  function onPointerMove(e) {
    if (downXY) { hideTip(); return; }                     // идёт вращение
    const mk = hitMarker(e);
    if (mk) {
      setHoverLobe(null);
      const id = mk.userData.regionId, side = SIDE_LABEL(mk.userData.side);
      showTipAt(e, side ? `${regionLabel(id)} · ${side}` : regionLabel(id));
      renderer.domElement.style.cursor = 'pointer'; return;
    }
    const lb = hitLobe(e);
    if (lb) {
      setHoverLobe(lb.userData.lobeId);
      showTipAt(e, lobeName(lb.userData.lobeId));
      renderer.domElement.style.cursor = 'pointer'; return;
    }
    setHoverLobe(null); hideTip(); renderer.domElement.style.cursor = 'grab';
  }
  function hideTip() { if (tipEl) { tipEl.style.opacity = '0'; tipEl.style.display = 'none'; } }

  function onRegionClick(cb) { regionClickCb = cb; }
  function onLobeClick(cb) { lobeClickCb = cb; }

  /* ---------- Цикл ---------- */
  function onResize() {
    if (!renderer) return;
    const w = container.clientWidth, h = container.clientHeight || 460;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function animate() {
    requestAnimationFrame(animate);
    clock.t += 0.016;

    // пульсация активных маркеров
    Object.values(markers).forEach(m => {
      m.meshes.forEach(mesh => {
        const st = mesh.userData.state;
        const base = mesh.userData.baseScale || 1;
        let s = base;
        if (st === 'primary' || st === 'activate') s = base * (1 + 0.08 * Math.sin(clock.t * 3.2));
        mesh.scale.setScalar(s);
      });
    });

    // частицы нейрохимии
    chemFlows.forEach(f => {
      f.t += f.speed * 0.016;
      f.t = ((f.t % 1) + 1) % 1;
      f.dot.position.copy(f.curve.getPoint(f.t));
    });

    // авто-возврат вращения после простоя
    if (idleTimer > 0) {
      idleTimer += 0.016;
      if (idleTimer > 3.5) { controls.autoRotate = true; idleTimer = 0; }
    }

    // плавный переход камеры к ракурсу
    if (camTween) {
      camTween.t = Math.min(1, camTween.t + 0.045);
      const e = 1 - Math.pow(1 - camTween.t, 3);
      camera.position.lerpVectors(camTween.from, camTween.to, e);
      if (camTween.t >= 1) camTween = null;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  window.Brain3D = {
    init, highlight, clear, pick, setView,
    showChemistry, clearChemistry, showConflict, showAfter, onRegionClick, rebuildLabels,
    pickLobe, clearLobes, onLobeClick, showSignal
  };
})();
