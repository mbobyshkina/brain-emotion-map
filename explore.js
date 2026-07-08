/* ============================================================
   Explore — послойное «путешествие» по мозгу.
   Слой за слоем: доли → лимбическая система → мотивация/ствол →
   нейромедиаторы. У каждого слоя карточки с ассоциациями и мини-тест,
   который открывает следующий слой. Плюс режим «Атлас» (свободно).
   Публичный API: window.Explore.mount(), .render(), .setMode(m)
   ============================================================ */
(function () {
  const JKEY = 'neuromirror_journey_v1';
  let mode = 'journey';
  const openTest = {};      // layerId -> данные текущего мини-теста

  function loadJ() { try { return JSON.parse(localStorage.getItem(JKEY)) || { viewed: {}, done: [] }; } catch { return { viewed: {}, done: [] }; } }
  function saveJ(j) { localStorage.setItem(JKEY, JSON.stringify(j)); }

  /* ---------- Универсальный доступ к элементу слоя ---------- */
  function getItem(kind, id) {
    if (kind === 'lobes') {
      const l = LOBES[id];
      return { name: l.name, emoji: l.emoji, color: l.color, short: l.short,
        detail: l.detail, assoc: l.assoc, extra: '💡 ' + l.fun,
        hi: () => (Brain3D.pickLobe ? Brain3D.pickLobe(id) : Brain3D.pick(LOBE_ANCHOR[id])) };
    }
    if (kind === 'chem') {
      const c = NEUROTRANSMITTERS[id];
      return { name: c.name, emoji: c.emoji, color: c.color, short: c.short,
        detail: c.detail, assoc: c.assoc, extra: t('nt_boost') + c.boost,
        hi: () => (typeof CHEMISTRY !== 'undefined' && CHEMISTRY[id]) ? Brain3D.showChemistry([id]) : Brain3D.clear() };
    }
    // regions
    const r = REGIONS[id];
    return { name: (window.regName ? regName(id) : r.name.split('(')[0].trim()), emoji: '🔸', color: '#8ea0d8',
      short: r.short, detail: r.detail, assoc: '', extra: (typeof FACTS !== 'undefined' && FACTS[id]) ? '💡 ' + FACTS[id] : '',
      hi: () => Brain3D.pick(id) };
  }

  function layerUnlocked(idx, j) { return idx === 0 || j.done.includes(EXPLORE_LAYERS[idx - 1].id); }

  /* ---------- Рендер путешествия ---------- */
  function renderJourney() {
    const j = loadJ();
    const area = document.getElementById('journeyArea');
    const totalDone = j.done.length;
    area.innerHTML = `<div class="journey-progress">
        <div class="jp-bar"><span style="width:${(totalDone / EXPLORE_LAYERS.length * 100).toFixed(0)}%"></span></div>
        <span class="jp-num">${t('layers_open')}${totalDone} / ${EXPLORE_LAYERS.length}</span>
      </div>` +
      EXPLORE_LAYERS.map((layer, idx) => {
        const unlocked = layerUnlocked(idx, j);
        const viewed = new Set(j.viewed[layer.id] || []);
        const allViewed = layer.items.every(id => viewed.has(id));
        const done = j.done.includes(layer.id);
        const status = done ? `<span class="ls-badge ok">${t('badge_passed')}</span>`
          : !unlocked ? `<span class="ls-badge lock">${t('badge_locked')}</span>`
            : `<span class="ls-badge">${viewed.size}/${layer.items.length}${t('studied')}</span>`;
        const cards = layer.items.map(id => {
          const it = getItem(layer.kind, id);
          const seen = viewed.has(id);
          return `<button class="jcard ${seen ? 'seen' : ''}" data-layer="${layer.id}" data-kind="${layer.kind}" data-id="${id}" style="--acc:${it.color}">
              <span class="jc-emoji">${it.emoji}</span>
              <span class="jc-name">${it.name}${seen ? ' <span class="jc-tick">✓</span>' : ''}</span>
              <span class="jc-short">${it.short}</span>
            </button>`;
        }).join('');
        return `<section class="layer ${unlocked ? '' : 'locked'} ${done ? 'done' : ''}" data-layer="${layer.id}">
            <div class="layer-head">
              <div><h3>${layer.title}</h3><p class="muted">${layer.subtitle}</p></div>
              ${status}
            </div>
            <div class="layer-body ${unlocked ? '' : 'hidden'}">
              <div class="jcards">${cards}</div>
              <div class="jdetail hidden" id="jdetail-${layer.id}"></div>
              <div class="jtest" id="jtest-${layer.id}">
                ${done ? `<button class="ghost-btn" data-retest="${layer.id}">${t('retest')}</button>`
            : allViewed ? `<button class="analyze-btn small" data-test="${layer.id}">${t('take_test')}</button>`
              : `<p class="muted small">${t('unlock_hint')}</p>`}
              </div>
            </div>
          </section>`;
      }).join('');

    // клики по карточкам
    area.querySelectorAll('.jcard').forEach(c => c.addEventListener('click', () => {
      const { layer, kind, id } = c.dataset;
      const it = getItem(kind, id);
      it.hi();
      // отметить как изученную
      const jj = loadJ();
      jj.viewed[layer] = [...new Set([...(jj.viewed[layer] || []), id])];
      saveJ(jj);
      // показать детальную панель
      const box = document.getElementById('jdetail-' + layer);
      box.classList.remove('hidden');
      box.innerHTML = `<div class="jd-inner" style="--acc:${it.color}">
          <div class="jd-title">${it.emoji} ${it.name}</div>
          <p>${it.detail}</p>
          ${it.assoc ? `<div class="assoc-box">${it.assoc}</div>` : ''}
          ${it.extra ? `<div class="fact-box">${it.extra}</div>` : ''}
        </div>`;
      box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      renderJourneyStatusOnly(layer);
    }));

    area.querySelectorAll('[data-test]').forEach(b => b.addEventListener('click', () => startTest(b.dataset.test)));
    area.querySelectorAll('[data-retest]').forEach(b => b.addEventListener('click', () => startTest(b.dataset.retest)));
  }

  // Обновить только счётчик/кнопку теста внутри слоя без полной перерисовки
  function renderJourneyStatusOnly(layerId) {
    const j = loadJ();
    const layer = EXPLORE_LAYERS.find(l => l.id === layerId);
    const viewed = new Set(j.viewed[layerId] || []);
    const sec = document.querySelector(`.layer[data-layer="${layerId}"]`);
    if (!sec) return;
    sec.querySelectorAll('.jcard').forEach(c => {
      if (viewed.has(c.dataset.id) && !c.classList.contains('seen')) {
        c.classList.add('seen');
        const nm = c.querySelector('.jc-name');
        if (nm && !nm.querySelector('.jc-tick')) nm.innerHTML += ' <span class="jc-tick">✓</span>';
      }
    });
    const badge = sec.querySelector('.ls-badge');
    if (badge && !j.done.includes(layerId)) badge.textContent = `${viewed.size}/${layer.items.length}${t('studied')}`;
    const allViewed = layer.items.every(id => viewed.has(id));
    const testBox = document.getElementById('jtest-' + layerId);
    if (allViewed && !j.done.includes(layerId) && !testBox.querySelector('[data-test]')) {
      testBox.innerHTML = `<button class="analyze-btn small" data-test="${layerId}">${t('take_test')}</button>`;
      testBox.querySelector('[data-test]').addEventListener('click', () => startTest(layerId));
    }
  }

  /* ---------- Мини-тест слоя ---------- */
  function startTest(layerId) {
    const layer = EXPLORE_LAYERS.find(l => l.id === layerId);
    const pool = layer.items.slice();
    const n = Math.min(3, pool.length);
    const picks = shuffle(pool).slice(0, n);
    openTest[layerId] = { qs: picks.map(id => makeQ(layer, id)), i: 0, correct: 0 };
    renderTest(layerId);
  }
  function makeQ(layer, id) {
    const it = getItem(layer.kind, id);
    const others = shuffle(layer.items.filter(x => x !== id)).slice(0, 3);
    const options = shuffle([id, ...others]).map(x => ({ id: x, name: getItem(layer.kind, x).name }));
    return { clue: it.short, answer: id, options };
  }
  function renderTest(layerId) {
    const T = openTest[layerId];
    const box = document.getElementById('jtest-' + layerId);
    if (T.i >= T.qs.length) {
      const passed = T.correct >= Math.ceil(T.qs.length * 0.67);
      if (passed) {
        const j = loadJ(); if (!j.done.includes(layerId)) j.done.push(layerId); saveJ(j);
      }
      box.innerHTML = `<div class="test-result ${passed ? 'pass' : 'fail'}">
          <strong>${passed ? t('test_great') : t('test_almost')}</strong>
          ${t('correct_prefix')}${T.correct}${t('of_word')}${T.qs.length}.
          ${passed ? t('next_open') : t('need_more')}
          <div class="tr-actions">
            <button class="ghost-btn" data-again="${layerId}">${t('again')}</button>
            ${passed ? `<button class="analyze-btn small" data-next>${t('to_next')}</button>` : ''}
          </div></div>`;
      box.querySelector('[data-again]').addEventListener('click', () => startTest(layerId));
      const nx = box.querySelector('[data-next]');
      if (nx) nx.addEventListener('click', () => { renderJourney(); const secs = document.querySelectorAll('.layer'); const idx = EXPLORE_LAYERS.findIndex(l => l.id === layerId); if (secs[idx + 1]) secs[idx + 1].scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      if (passed) { const j = loadJ(); renderJourney(); } // перерисовать прогресс
      return;
    }
    const q = T.qs[T.i];
    box.innerHTML = `<div class="mini-q">
        <div class="mq-progress">${t('q_word')}${T.i + 1} / ${T.qs.length}</div>
        <div class="mq-clue">${t('who_for')}<br><em>«${q.clue}»</em></div>
        <div class="mq-opts">${q.options.map(o => `<button class="mq-opt" data-pick="${o.id}">${o.name}</button>`).join('')}</div>
      </div>`;
    box.querySelectorAll('.mq-opt').forEach(b => b.addEventListener('click', () => {
      const ok = b.dataset.pick === q.answer;
      if (ok) T.correct++;
      box.querySelectorAll('.mq-opt').forEach(x => {
        x.disabled = true;
        if (x.dataset.pick === q.answer) x.classList.add('right');
        else if (x === b) x.classList.add('wrong');
      });
      setTimeout(() => { T.i++; renderTest(layerId); }, 850);
    }));
  }

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* ---------- Режимы ---------- */
  const AREAS = { schema: 'schemaArea', journey: 'journeyArea', atlas: 'atlasArea', quiz: 'quizPanel', updates: 'updatesPanel' };
  const INTROS = { schema: 'schemaIntro', journey: 'journeyIntro', atlas: 'atlasIntro', quiz: 'quizIntro', updates: 'updatesIntro' };
  const HINT_KEYS = { schema: 'hint_schema', journey: 'hint_journey', atlas: 'hint_atlas', quiz: 'hint_quiz', updates: 'hint_updates' };
  function setMode(m) {
    mode = m;
    document.querySelectorAll('#exploreModes .em-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    Object.entries(AREAS).forEach(([k, id]) => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', k !== m); });
    Object.entries(INTROS).forEach(([k, id]) => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', k !== m); });
    if (m === 'journey') renderJourney();
    if (m === 'quiz' && typeof newQuestion === 'function' && (typeof quiz === 'undefined' || !quiz.current)) newQuestion();
    if (m === 'updates' && typeof renderDiscoveries === 'function') renderDiscoveries();
    const h = document.getElementById('brainHint'); if (h && HINT_KEYS[m]) h.textContent = t(HINT_KEYS[m]);
  }

  let friendlyMounted = false;
  function mount() {
    document.querySelectorAll('#exploreModes .em-btn').forEach(b =>
      b.addEventListener('click', () => setMode(b.dataset.mode)));
    if (window.Friendly && !friendlyMounted) { Friendly.mount(document.getElementById('schemaArea')); friendlyMounted = true; }
    setMode('schema');
  }
  function render() { setMode(mode); }

  window.Explore = { mount, render, setMode };
})();
