/* ============================================================
   Explore — послойное «путешествие» по мозгу.
   Слой за слоем: доли → лимбическая система → мотивация/ствол →
   нейромедиаторы. У каждого слоя карточки с ассоциациями и мини-тест,
   который открывает следующий слой. Плюс режим «Атлас» (свободно).
   Публичный API: window.Explore.mount(), .render(), .setMode(m)
   ============================================================ */
(function () {
  const JKEY = 'neuromirror_course_v2';
  let mode = 'journey';
  const openTest = {};      // levelId -> текущий тест
  const LVL_COL = ['#6ea8ff', '#8b7bff', '#ff8a4c', '#68f0a0', '#c78bff', '#7ec8ec', '#f0a3b4', '#ffcf5b', '#5fd6a8'];
  const DATA = (typeof COURSE !== 'undefined') ? COURSE : [];

  function loadJ() { try { return JSON.parse(localStorage.getItem(JKEY)) || { viewed: {}, done: [], exam: false }; } catch { return { viewed: {}, done: [], exam: false }; } }
  function saveJ(j) { localStorage.setItem(JKEY, JSON.stringify(j)); }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function cardById(level, id) { return level.cards.find(c => c.id === id); }
  function colOf(level) { return LVL_COL[DATA.indexOf(level) % LVL_COL.length]; }
  function levelUnlocked(idx, j) { return idx === 0 || j.done.includes(DATA[idx - 1].id); }

  function applyHi(hi) {
    if (!window.Brain3D) return;
    if (!hi || hi.t === 'none') { Brain3D.clear(); return; }
    if (hi.t === 'region') Brain3D.pick(hi.v);
    else if (hi.t === 'lobe') (Brain3D.pickLobe ? Brain3D.pickLobe(hi.v) : Brain3D.pick(hi.v));
    else if (hi.t === 'chem') Brain3D.showChemistry([hi.v]);
    else if (hi.t === 'path') (Brain3D.showSignal ? Brain3D.showSignal(hi.v) : Brain3D.clear());
    else Brain3D.clear();
  }

  /* ---------- Рендер курса ---------- */
  function mythHtml(level) { return `<div class="myth-box"><div class="myth-q">❌ ${lang === 'en' ? 'Myth' : 'Миф'}: ${level.myth.myth}</div><div class="myth-a">✅ ${level.myth.truth}</div></div>`; }
  function scenarioHtml(level) { return `<div class="scenario-box"><div class="sc-title">🎬 ${level.scenario.title}</div><button class="ghost-btn sc-play" data-lvl="${level.id}">▶ ${lang === 'en' ? 'Play on the 3D model' : 'Проиграть на 3D-модели'}</button><div class="sc-steps" id="sc-${level.id}"></div></div>`; }
  function testBtn(level, j, allViewed) {
    if (j.done.includes(level.id)) return `<button class="ghost-btn" data-retest="${level.id}">${t('retest')}</button>`;
    if (allViewed) return `<button class="analyze-btn small" data-test="${level.id}">${t('take_test')}</button>`;
    return `<p class="muted small">${t('unlock_hint')}</p>`;
  }

  function renderJourney() {
    const j = loadJ();
    const area = document.getElementById('journeyArea');
    const pct = Math.round(j.done.length / DATA.length * 100);
    const badges = j.done.map(id => { const L = DATA.find(x => x.id === id); return L ? `<span class="jbadge" title="${L.badge.name}">${L.badge.emoji}</span>` : ''; }).join('');
    let html = `<div class="journey-progress">
        <div class="jp-bar"><span style="width:${pct}%"></span></div>
        <span class="jp-num">${lang === 'en' ? 'You understand the brain at' : 'Ты понимаешь мозг на'} ${pct}%</span>
      </div>${badges ? `<div class="jbadges">${lang === 'en' ? 'Badges' : 'Бейджи'}: ${badges}</div>` : ''}`;

    html += DATA.map((level, idx) => {
      const col = colOf(level);
      const unlocked = levelUnlocked(idx, j);
      const viewed = new Set(j.viewed[level.id] || []);
      const allViewed = level.cards.every(c => viewed.has(c.id));
      const done = j.done.includes(level.id);
      const status = done ? `<span class="ls-badge ok">${level.badge.emoji} ${t('badge_passed')}</span>`
        : !unlocked ? `<span class="ls-badge lock">${t('badge_locked')}</span>`
          : `<span class="ls-badge">${viewed.size}/${level.cards.length}${t('studied')}</span>`;
      const cards = level.cards.map(c => {
        const seen = viewed.has(c.id);
        return `<button class="jcard ${seen ? 'seen' : ''}" data-lvl="${level.id}" data-id="${c.id}" style="--acc:${col}">
            <span class="jc-emoji">${c.emoji}</span>
            <span class="jc-name">${c.name}${seen ? ' <span class="jc-tick">✓</span>' : ''}</span>
            <span class="jc-short">${c.simple}</span>
          </button>`;
      }).join('');
      return `<section class="layer ${unlocked ? '' : 'locked'} ${done ? 'done' : ''}" data-lvl="${level.id}" style="--acc:${col}">
          <div class="layer-head"><div><h3>${idx + 1}. ${level.title}</h3><p class="muted">${level.sub}</p></div>${status}</div>
          <div class="layer-body ${unlocked ? '' : 'hidden'}">
            ${level.note ? `<div class="lvl-note">ℹ️ ${level.note}</div>` : ''}
            <div class="jcards">${cards}</div>
            <div class="jdetail hidden" id="jd-${level.id}"></div>
            ${level.scenario ? scenarioHtml(level) : ''}
            ${level.myth ? mythHtml(level) : ''}
            <div class="jtest" id="jt-${level.id}">${testBtn(level, j, allViewed)}</div>
          </div>
        </section>`;
    }).join('');

    const allDone = DATA.length && DATA.every(l => j.done.includes(l.id));
    html += `<section class="layer exam-layer ${allDone ? '' : 'locked'}">
        <div class="layer-head"><div><h3>🎓 ${lang === 'en' ? 'Final exam' : 'Итоговый экзамен'}</h3><p class="muted">${allDone ? (lang === 'en' ? 'Put it all together and earn the “Brain Master” title.' : 'Собери всё вместе и получи звание «Мастер мозга».') : (lang === 'en' ? 'Complete all levels to unlock.' : 'Пройди все уровни, чтобы открыть.')}</p></div>${j.exam ? '<span class="ls-badge ok">🏆 ' + (lang === 'en' ? 'passed' : 'сдан') + '</span>' : ''}</div>
        ${allDone ? `<div class="layer-body"><div class="jtest" id="jt-exam"><button class="analyze-btn small" data-exam>${lang === 'en' ? 'Take the exam →' : 'Пройти экзамен →'}</button></div></div>` : ''}
      </section>`;

    area.innerHTML = html;
    wireJourney(area);
  }

  function wireJourney(area) {
    area.querySelectorAll('.jcard').forEach(c => c.addEventListener('click', () => openCard(c.dataset.lvl, c.dataset.id)));
    area.querySelectorAll('[data-test]').forEach(b => b.addEventListener('click', () => startTest(b.dataset.test)));
    area.querySelectorAll('[data-retest]').forEach(b => b.addEventListener('click', () => startTest(b.dataset.retest)));
    area.querySelectorAll('.sc-play').forEach(b => b.addEventListener('click', () => playScenario(b.dataset.lvl)));
    const ex = area.querySelector('[data-exam]'); if (ex) ex.addEventListener('click', startExam);
  }

  function openCard(lvlId, id) {
    const level = DATA.find(l => l.id === lvlId); const c = cardById(level, id);
    applyHi(c.hi);
    const jj = loadJ(); jj.viewed[lvlId] = [...new Set([...(jj.viewed[lvlId] || []), id])]; saveJ(jj);
    const box = document.getElementById('jd-' + lvlId); box.classList.remove('hidden');
    box.innerHTML = `<div class="jd-inner" style="--acc:${colOf(level)}">
        <div class="jd-title">${c.emoji} ${c.name}</div>
        <p class="jd-simple">${c.simple}</p>
        <button class="jd-more">${lang === 'en' ? 'Go deeper ▾' : 'Поглубже ▾'}</button>
        <div class="jd-deep hidden">
          <p>${c.deeper}</p>
          ${c.fact ? `<div class="fact-box">💡 ${c.fact}</div>` : ''}
          ${c.life ? `<div class="life-box">🧩 ${lang === 'en' ? 'In life' : 'В жизни'}: ${c.life}</div>` : ''}
        </div>
      </div>`;
    const more = box.querySelector('.jd-more');
    more.addEventListener('click', () => { box.querySelector('.jd-deep').classList.toggle('hidden'); more.style.display = 'none'; });
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    markSeen(lvlId);
  }

  function markSeen(lvlId) {
    const j = loadJ(); const level = DATA.find(l => l.id === lvlId);
    const viewed = new Set(j.viewed[lvlId] || []);
    const sec = document.querySelector(`.layer[data-lvl="${lvlId}"]`); if (!sec) return;
    sec.querySelectorAll('.jcard').forEach(c => {
      if (viewed.has(c.dataset.id) && !c.classList.contains('seen')) {
        c.classList.add('seen');
        const nm = c.querySelector('.jc-name'); if (nm && !nm.querySelector('.jc-tick')) nm.innerHTML += ' <span class="jc-tick">✓</span>';
      }
    });
    const badge = sec.querySelector('.ls-badge');
    if (badge && !j.done.includes(lvlId)) badge.textContent = `${viewed.size}/${level.cards.length}${t('studied')}`;
    const allViewed = level.cards.every(c => viewed.has(c.id));
    const tb = document.getElementById('jt-' + lvlId);
    if (allViewed && !j.done.includes(lvlId) && tb && !tb.querySelector('[data-test]')) {
      tb.innerHTML = `<button class="analyze-btn small" data-test="${lvlId}">${t('take_test')}</button>`;
      tb.querySelector('[data-test]').addEventListener('click', () => startTest(lvlId));
    }
  }

  function playScenario(lvlId) {
    const level = DATA.find(l => l.id === lvlId); const sc = level.scenario;
    if (window.Brain3D && Brain3D.showSignal) Brain3D.showSignal(sc.steps.map(s => s.region), sc.color);
    const box = document.getElementById('sc-' + lvlId); box.innerHTML = '';
    sc.steps.forEach((s, i) => setTimeout(() => {
      const d = document.createElement('div'); d.className = 'sc-step'; d.textContent = s.text; box.appendChild(d);
    }, i * 1100));
  }

  /* ---------- Тесты ---------- */
  function makeQ(level, q) {
    const others = shuffle(level.cards.filter(c => c.id !== q.answer)).slice(0, 3).map(c => c.id);
    const options = shuffle([q.answer, ...others]).map(id => ({ id, name: cardById(level, id).name }));
    return { clue: q.clue, answer: q.answer, options };
  }
  function startTest(lvlId) {
    const level = DATA.find(l => l.id === lvlId);
    const pool = shuffle(level.quiz.slice()).slice(0, Math.min(4, level.quiz.length));
    openTest[lvlId] = { qs: pool.map(q => makeQ(level, q)), i: 0, correct: 0 };
    renderTest(lvlId);
  }
  function renderTest(lvlId) {
    const T = openTest[lvlId], box = document.getElementById('jt-' + lvlId);
    if (T.i >= T.qs.length) {
      const passed = T.correct >= Math.ceil(T.qs.length * 0.67);
      if (passed) { const j = loadJ(); if (!j.done.includes(lvlId)) j.done.push(lvlId); saveJ(j); }
      box.innerHTML = `<div class="test-result ${passed ? 'pass' : 'fail'}"><strong>${passed ? t('test_great') : t('test_almost')}</strong> ${t('correct_prefix')}${T.correct}${t('of_word')}${T.qs.length}. ${passed ? t('next_open') : t('need_more')}<div class="tr-actions"><button class="ghost-btn" data-again="${lvlId}">${t('again')}</button>${passed ? `<button class="analyze-btn small" data-next="${lvlId}">${t('to_next')}</button>` : ''}</div></div>`;
      box.querySelector('[data-again]').addEventListener('click', () => startTest(lvlId));
      const nx = box.querySelector('[data-next]');
      if (nx) nx.addEventListener('click', () => { renderJourney(); const secs = document.querySelectorAll('.layer'); const idx = DATA.findIndex(l => l.id === lvlId); if (secs[idx + 1]) secs[idx + 1].scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      if (passed) renderJourney();
      return;
    }
    renderQ(box, T.qs[T.i], () => { T.i++; renderTest(lvlId); }, ok => { if (ok) T.correct++; });
  }

  function startExam() {
    const all = []; DATA.forEach(l => l.quiz.forEach(q => all.push({ level: l, q })));
    openTest.__exam = { qs: shuffle(all).slice(0, 8).map(p => makeQ(p.level, p.q)), i: 0, correct: 0 };
    renderExam();
  }
  function renderExam() {
    const T = openTest.__exam, box = document.getElementById('jt-exam'); if (!box) return;
    if (T.i >= T.qs.length) {
      const passed = T.correct >= Math.ceil(T.qs.length * 0.7);
      if (passed) { const j = loadJ(); j.exam = true; saveJ(j); }
      box.innerHTML = `<div class="test-result ${passed ? 'pass' : 'fail'}"><strong>${passed ? (lang === 'en' ? '🏆 Passed! You are a Brain Master' : '🏆 Сдано! Ты — Мастер мозга') : t('test_almost')}</strong> ${t('correct_prefix')}${T.correct}${t('of_word')}${T.qs.length}.<div class="tr-actions"><button class="ghost-btn" data-examagain>${t('again')}</button></div></div>`;
      box.querySelector('[data-examagain]').addEventListener('click', startExam);
      if (passed) renderJourney();
      return;
    }
    renderQ(box, T.qs[T.i], () => { T.i++; renderExam(); }, ok => { if (ok) T.correct++; });
  }

  function renderQ(box, q, next, mark) {
    box.innerHTML = `<div class="mini-q"><div class="mq-progress"></div><div class="mq-clue">${t('who_for')}<br><em>«${q.clue}»</em></div><div class="mq-opts">${q.options.map(o => `<button class="mq-opt" data-pick="${o.id}">${o.name}</button>`).join('')}</div></div>`;
    box.querySelectorAll('.mq-opt').forEach(b => b.addEventListener('click', () => {
      mark(b.dataset.pick === q.answer);
      box.querySelectorAll('.mq-opt').forEach(x => { x.disabled = true; if (x.dataset.pick === q.answer) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
      setTimeout(next, 800);
    }));
  }

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

  let emoMounted = false;
  function mount() {
    document.querySelectorAll('#exploreModes .em-btn').forEach(b =>
      b.addEventListener('click', () => setMode(b.dataset.mode)));
    if (window.EmotionMap && !emoMounted) { EmotionMap.mount(document.getElementById('schemaArea')); emoMounted = true; }
    setMode('schema');
  }
  function render() { setMode(mode); }

  window.Explore = { mount, render, setMode };
})();
