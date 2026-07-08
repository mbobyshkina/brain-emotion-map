/* ============================================================
   НейроЗеркало — логика приложения
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const HISTORY_KEY = 'neuromirror_history_v1';
const COURSE_KEY = 'neuromirror_course_v1';
const LANG_KEY = 'neuromirror_lang';

let lastMatches = [];
let lastLifestyle = [];
let selectedTriggers = new Set();
let lang = localStorage.getItem(LANG_KEY) || 'ru';

/* ---------- i18n ---------- */
const t = k => (I18N[lang] && I18N[lang][k]) || (I18N.ru[k] || k);
const regName = id => (lang === 'en' && REGION_EN[id]) ? REGION_EN[id] : (REGIONS[id] ? REGIONS[id].name.split('(')[0].trim() : id);
const stateLabel = s => (lang === 'en' && STATE_EN[s.id]) ? STATE_EN[s.id] : s.label;

function applyLang() {
  document.documentElement.lang = lang;
  if (typeof applyContentLang === 'function') applyContentLang(lang);   // подмена контента RU/EN
  $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
  $$('[data-i18n-ph]').forEach(el => { const v = t(el.dataset.i18nPh); if (v) el.setAttribute('placeholder', v); });
  $$('#langSwitch button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  buildChips(); buildRegionList(); buildLibrary(); buildCourse(); buildTriggerChips();
  Brain3D.rebuildLabels && Brain3D.rebuildLabels();
  if (window.Friendly) Friendly.setLang(lang);
  const active = $('.tab.active'); const tab = active ? active.dataset.tab : 'analyze';
  if (tab === 'brain' && window.Explore) Explore.render();
  if (tab === 'programs' && window.Programs) Programs.render();
  if (tab === 'history') renderHistory();
  $('#quizScore').textContent = t('score') + (quiz.answered ? quiz.score + ' / ' + quiz.answered : '0');
  setAnalyzeHint();
  if (lastMatches.length) showState(lastMatches, '', { save: false, keepTriggers: true });
}

/* ---------- 3D-мозг ---------- */
Brain3D.init($('#brainWrap'));
Brain3D.onRegionClick(id => { if (REGIONS[id]) { switchTab('brain'); if (window.Explore) Explore.setMode('atlas'); showRegionInfo(id); } });
Brain3D.onLobeClick(id => { switchTab('brain'); if (window.Explore) Explore.setMode('atlas'); showLobeInfo(id); });

/* ---------- Движок анализа ---------- */
async function analyzeText(text) {
  const clean = text.toLowerCase().replace(/ё/g, 'е');
  if (typeof window.NEURO_AI_PROVIDER === 'function') {
    try {
      const ai = await window.NEURO_AI_PROVIDER(text);
      if (Array.isArray(ai) && ai.length)
        return ai.map(r => ({ state: STATES.find(s => s.id === r.id), score: r.score || 1, matched: [] })).filter(r => r.state);
    } catch (e) { }
  }
  const results = [];
  for (const state of STATES) {
    let score = 0;
    for (const kw of state.keywords) {
      const k = kw.toLowerCase().replace(/ё/g, 'е');
      if (clean.includes(k)) score += k.length >= 6 ? 2 : 1;
    }
    if (score > 0) results.push({ state, score, matched: [] });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 3);
}

function detectLifestyle(text) {
  const clean = text.toLowerCase().replace(/ё/g, 'е');
  return Object.entries(LIFESTYLE)
    .filter(([, f]) => f.keywords.some(k => clean.includes(k.toLowerCase().replace(/ё/g, 'е'))))
    .map(([id]) => id);
}

/* ---------- Нейрохимия: легенда ---------- */
function renderChemLegend(chemList) {
  const box = $('#chemLegend');
  if (!chemList || !chemList.length) { box.innerHTML = ''; box.classList.remove('show'); return; }
  box.innerHTML = `<span class="cl-title">${t('chem_title')}</span>` + chemList.map(c => {
    const ch = CHEMISTRY[c]; if (!ch) return '';
    return `<span class="cl-item"><span class="cl-dot" style="background:${ch.color};box-shadow:0 0 8px ${ch.color}"></span>${ch.label}</span>`;
  }).join('');
  box.classList.add('show');
}

/* ---------- Уровни достоверности ---------- */
function levelBadge(level) {
  const L = LEVELS[level]; if (!L) return '';
  return `<span class="lvl" style="color:${L.color};border-color:${L.color}55">${lang === 'en' ? L.en : L.ru}</span>`;
}

/* ---------- Добавки ---------- */
const STATE_SUPP = {
  fatigue: ["Креатин моногидрат 3–5 г", "Родиола розовая", "Витамин D3"],
  depression: ["Омега-3 (EPA/DHA)", "Витамин D3"],
  anxiety: ["Магний (глицинат / L-треонат)", "L-теанин (+ кофеин)"],
  stress: ["Магний (глицинат / L-треонат)", "Родиола розовая"],
  apathy: ["Креатин моногидрат 3–5 г", "Витамин D3"],
  insomnia: ["Магний (глицинат / L-треонат)"],
  focus: ["L-теанин (+ кофеин)", "Креатин моногидрат 3–5 г"]
};
function gatherSupplements(factorIds, stateIds) {
  const names = new Set();
  factorIds.forEach(f => (SUPP_HINTS[f] || []).forEach(n => names.add(n)));
  stateIds.forEach(s => (STATE_SUPP[s] || []).forEach(n => names.add(n)));
  return [...names].map(n => SUPPLEMENTS.find(s => s.name === n)).filter(Boolean).slice(0, 5);
}

/* ---------- Рендер результатов ---------- */
function regionTag(id, type) {
  const r = REGIONS[id]; if (!r) return '';
  return `<span class="region-tag ${type}" data-region="${id}"><span class="dot"></span>${regName(id)}
    <small>· ${r.system}</small></span>`;
}

async function runAnalyze() {
  const text = $('#feelInput').value.trim();
  if (!text) { $('#feelInput').focus(); return; }
  const btn = $('#analyzeBtn');
  btn.textContent = '…'; btn.disabled = true;
  const matches = await analyzeText(text);
  const factors = detectLifestyle(text);
  showState(matches, text, { save: true, factors });
  btn.textContent = t('analyze_btn'); btn.disabled = false;
  setAnalyzeHint();
}

function showState(matches, sourceText, opt = {}) {
  const box = $('#results');
  lastMatches = matches;
  lastLifestyle = opt.factors || lastLifestyle;
  const factors = lastLifestyle;

  if (!matches.length && !factors.length) {
    Brain3D.clear(); renderChemLegend([]);
    box.innerHTML = `<div class="empty-state"><div class="empty-emoji">🤔</div>
      <p>${t('not_recognized')}</p></div>`;
    return;
  }

  // Подсветка мозга
  const allPrimary = new Set(), allSecondary = new Set();
  matches.forEach((m, i) => {
    m.state.regions.primary.forEach(id => allPrimary.add(id));
    if (i === 0) m.state.regions.secondary.forEach(id => allSecondary.add(id));
  });
  if (allPrimary.size || allSecondary.size)
    Brain3D.highlight({ primary: [...allPrimary], secondary: [...allSecondary].filter(id => !allPrimary.has(id)) });
  else Brain3D.clear();

  const chem = [...new Set(matches.flatMap(m => (STATE_EXTRAS[m.state.id] || {}).chemicals || []))];
  Brain3D.showChemistry(chem); renderChemLegend(chem);
  for (const m of matches) {
    const cf = (STATE_EXTRAS[m.state.id] || {}).conflict;
    if (cf) { Brain3D.showConflict(cf.a.region, cf.b.region); break; }
  }

  // Блок образа жизни
  let html = '';
  if (factors.length) {
    html += `<div class="lifestyle-card">
      <div class="ls-head">🧬 ${t('lifestyle_title')}</div>
      ${factors.map(f => { const L = LIFESTYLE[f]; return `
        <div class="ls-item"><div class="ls-title">${L.emoji} ${L.label}</div>
          <div class="ls-effect">${L.effect}</div>
          <ul class="ls-tips">${L.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>`; }).join('')}
    </div>`;
  }

  if (matches.length > 1)
    html += `<div class="mixed-note">🧩 ${t('mixed_note')}</div>`;

  html += matches.map((m, i) => renderStateCard(m.state, i)).join('');

  // Добавки
  const supps = gatherSupplements(factors, matches.map(m => m.state.id));
  if (supps.length) {
    html += `<div class="supp-card">
      <div class="section-label">💊 ${t('supp_title')}</div>
      ${supps.map(s => `<div class="supp-item">
        <div class="supp-name">${s.name} ${levelBadge(s.level)}</div>
        <div class="supp-for">${t('supp_for')}${s.for}</div>
        <div class="supp-note">${s.note}</div>
        <a class="ref-link" href="${s.url}" target="_blank" rel="noopener">📄 ${s.source}</a>
      </div>`).join('')}
      <div class="supp-disclaimer">⚠️ ${t('supp_disclaimer')}</div>
    </div>`;
  }

  box.innerHTML = html;

  $$('.region-tag', box).forEach(tag =>
    tag.addEventListener('click', () => { switchTab('brain'); if (window.Explore) Explore.setMode('atlas'); showRegionInfo(tag.dataset.region); }));
  wireAfterButtons(box);

  if (opt.save !== false) saveHistory(sourceText, matches, factors);
}

function renderStateCard(s, i) {
  const ex = STATE_EXTRAS[s.id] || {};
  const primaryTags = s.regions.primary.map(id => regionTag(id, 'primary')).join('');
  const secondaryTags = s.regions.secondary.map(id => regionTag(id, 'secondary')).join('');
  const advice = s.advice.map(a => `<li>${a}</li>`).join('');

  const conflictBlock = ex.conflict ? `
    <div class="section-label">${t('sec_conflict')}</div>
    <div class="conflict-box"><div class="cf-sides">
      <span class="cf-side a">${ex.conflict.a.label}</span>
      <span class="cf-vs">${t('conflict_word')}</span>
      <span class="cf-side b">${ex.conflict.b.label}</span></div>
      <div class="cf-note">${ex.conflict.note}</div></div>` : '';

  const research = (STATE_RESEARCH[s.id] || []);
  const researchBlock = research.length ? `
    <div class="section-label">🔬 ${t('research_title')}</div>
    <ul class="research-list">${research.map(r => `<li>
      <div class="rs-tip">${r.tip} ${levelBadge(r.level)}</div>
      <a class="ref-link" href="${r.url}" target="_blank" rel="noopener">📄 ${r.source}</a>
    </li>`).join('')}</ul>` : '';

  const afterBtn = ex.after ? `
    <button class="after-btn" data-state="${s.id}">${t('after_btn')}</button>
    <div class="after-text hidden" data-after="${s.id}">${ex.after.text}</div>` : '';

  return `<div class="state-card">
    <div class="state-head">
      <span class="state-emoji">${s.emoji}</span>
      <h3 class="state-title">${stateLabel(s)}</h3>
      <span class="state-match">${i === 0 ? t('primary_state') : t('also_possible')}</span>
    </div>
    <div class="state-body">
      <div class="section-label">${t('sec_structures')}</div>
      <div class="region-tags">${primaryTags}${secondaryTags}</div>
      ${conflictBlock}
      <div class="section-label">${t('sec_mechanism')}</div>
      <div class="mechanism">${s.mechanism}</div>
      <div class="section-label">${t('sec_advice')}</div>
      <ul class="advice-list">${advice}</ul>
      ${researchBlock}
      ${afterBtn}
    </div></div>`;
}

function wireAfterButtons(box) {
  $$('.after-btn', box).forEach(btn => {
    let on = false;
    btn.addEventListener('click', () => {
      const ex = STATE_EXTRAS[btn.dataset.state] || {};
      const txt = $(`[data-after="${btn.dataset.state}"]`, box);
      on = !on;
      if (on) {
        Brain3D.clearChemistry();
        Brain3D.showAfter(ex.after.calm, ex.after.activate);
        btn.textContent = t('after_back'); btn.classList.add('active');
        txt.classList.remove('hidden');
        $('#brainHint').textContent = t('hint_after');
      } else {
        replayHighlight();
        btn.textContent = t('after_btn'); btn.classList.remove('active');
        txt.classList.add('hidden'); setAnalyzeHint();
      }
    });
  });
}

function replayHighlight() {
  if (!lastMatches.length) return;
  const p = new Set(), sec = new Set();
  lastMatches.forEach((m, i) => {
    m.state.regions.primary.forEach(id => p.add(id));
    if (i === 0) m.state.regions.secondary.forEach(id => sec.add(id));
  });
  Brain3D.highlight({ primary: [...p], secondary: [...sec].filter(id => !p.has(id)) });
  const chem = [...new Set(lastMatches.flatMap(m => (STATE_EXTRAS[m.state.id] || {}).chemicals || []))];
  Brain3D.showChemistry(chem);
  for (const m of lastMatches) { const cf = (STATE_EXTRAS[m.state.id] || {}).conflict; if (cf) { Brain3D.showConflict(cf.a.region, cf.b.region); break; } }
}

/* ---------- История ---------- */
function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } }
function saveHistory(text, matches, factors) {
  const hist = loadHistory();
  hist.unshift({
    ts: Date.now(), text,
    states: matches.map(m => ({ id: m.state.id, label: m.state.label, emoji: m.state.emoji })),
    regions: [...new Set(matches.flatMap(m => m.state.regions.primary))],
    triggers: [...selectedTriggers],
    lifestyle: factors || []
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(0, 200)));
}
function clearHistoryData() { localStorage.removeItem(HISTORY_KEY); renderHistory(); }
function fmtDate(ts) { return new Date(ts).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }); }

function renderHistory() {
  const hist = loadHistory();
  const box = $('#historyList');
  const charts = $('#chartsCard');
  if (!hist.length) {
    box.innerHTML = `<div class="empty-state"><div class="empty-emoji">📖</div>
      <p>${t('history_empty')}</p></div>`;
    charts.classList.add('hidden'); return;
  }
  // графики
  charts.classList.remove('hidden');
  $('#moodChart').innerHTML = Charts.moodLine(hist);
  $('#weekdayChart').innerHTML = Charts.weekdayBars(hist);
  const tc = Charts.triggerCorrelation(hist);
  $('#trigCorrBlock').style.display = tc ? '' : 'none';
  $('#trigChart').innerHTML = tc;
  const ins = Charts.patternInsights(hist);
  $('#insights').innerHTML = ins.length ? `<div class="ins-title">${t('patterns_title')}</div>` +
    ins.map(x => `<div class="ins-item">${x}</div>`).join('') : '';

  // записи
  box.innerHTML = hist.map(h => `<div class="history-item">
    <div class="h-date">${fmtDate(h.ts)}</div>
    <div class="h-text">«${escapeHtml(h.text)}»</div>
    <div class="h-states">${h.states.map(s => `<span class="h-badge">${s.emoji} ${s.label}</span>`).join('')}
      ${(h.triggers || []).map(id => { const tr = TRIGGERS.find(x => x.id === id); return tr ? `<span class="h-trg">${tr.emoji} ${tr.label}</span>` : ''; }).join('')}</div>
  </div>`).join('');
}
function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* ---------- Триггеры ---------- */
function buildTriggerChips() {
  const box = $('#triggerChips');
  box.innerHTML = TRIGGERS.map(tr =>
    `<button class="trg-chip ${tr.kind}" data-trg="${tr.id}">${tr.emoji} ${tr.label}</button>`).join('');
  $$('#triggerChips .trg-chip').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.trg;
    if (selectedTriggers.has(id)) { selectedTriggers.delete(id); b.classList.remove('on'); }
    else { selectedTriggers.add(id); b.classList.add('on'); }
  }));
}

/* ---------- Исследовать ---------- */
function buildRegionList() {
  const list = $('#regionList');
  list.innerHTML = Object.keys(REGIONS).map(id => `<button data-region="${id}">${regName(id)}</button>`).join('');
  $$('#regionList button').forEach(b => b.addEventListener('click', () => showRegionInfo(b.dataset.region)));
}
function showRegionInfo(id) {
  const r = REGIONS[id]; if (!r) return;
  $$('#regionList button').forEach(b => b.classList.toggle('sel', b.dataset.region === id));
  renderChemLegend([]); Brain3D.pick(id);
  const related = STATES.filter(s => s.regions.primary.includes(id) || s.regions.secondary.includes(id));
  $('#exploreInfo').innerHTML = `<div class="state-card region-detail"><div class="state-body">
    <span class="region-system">${r.system}</span>
    <h3>${lang === 'en' && REGION_EN[id] ? REGION_EN[id] : r.name}</h3>
    <div class="mechanism">${r.detail}</div>
    ${FACTS[id] ? `<div class="fact-box">💡 ${FACTS[id]}</div>` : ''}
    <div class="section-label">${t('related_states')}</div>
    <div class="h-states">${related.length ? related.map(s => `<span class="h-badge" data-state="${s.id}" style="cursor:pointer">${s.emoji} ${stateLabel(s)}</span>`).join('') : '<span class="muted">—</span>'}</div>
  </div></div>`;
  $$('#exploreInfo [data-state]').forEach(b => b.addEventListener('click', () => showStateById(b.dataset.state)));
  $('#brainHint').textContent = r.short;
}

function showLobeInfo(id) {
  const l = (typeof LOBES !== 'undefined') && LOBES[id]; if (!l) return;
  $$('#regionList button').forEach(b => b.classList.remove('sel'));
  renderChemLegend([]); if (Brain3D.pickLobe) Brain3D.pickLobe(id);
  $('#exploreInfo').innerHTML = `<div class="state-card region-detail"><div class="state-body">
    <span class="region-system">${lang === 'en' ? 'Cerebral lobe' : 'Доля мозга'}</span>
    <h3>${l.emoji} ${l.name}</h3>
    <div class="mechanism">${l.detail}</div>
    ${l.assoc ? `<div class="assoc-box">${l.assoc}</div>` : ''}
    ${l.fun ? `<div class="fact-box">💡 ${l.fun}</div>` : ''}
  </div></div>`;
  $('#brainHint').textContent = l.short;
}

/* ---------- Открытия о мозге ---------- */
let discoveries = [];
let discFilter = 'all';
async function renderDiscoveries() {
  const box = $('#updList');
  if (!discoveries.length) {
    box.innerHTML = `<div class="empty-state"><div class="empty-emoji">🔬</div><p>${t('loading_findings')}</p></div>`;
    discoveries = await fetchDiscoveries();
  }
  const items = discoveries.filter(d => discFilter === 'all' || d.level === discFilter);
  box.innerHTML = items.map(d => {
    const m = LEVEL_META[d.level] || LEVEL_META.unverified;
    const reg = d.region && REGIONS[d.region];
    return `<div class="disc-card" data-region="${d.region || ''}">
      <div class="disc-head">
        <span class="disc-badge" style="--bc:${m.color}">${m.icon} ${lang === 'en' ? m.en : m.ru}</span>
        <span class="disc-date">${d.date}</span>
      </div>
      <h3 class="disc-title">${d.title}</h3>
      <p class="disc-sum">${d.summary}</p>
      <div class="disc-foot">
        ${reg ? `<button class="disc-region" data-region="${d.region}">🧠 ${regName(d.region)}</button>` : ''}
        ${d.url ? `<a class="disc-src" href="${d.url}" target="_blank" rel="noopener">${d.source || t('source_word')} ↗</a>` : `<span class="disc-src muted">${d.source || ''}</span>`}
      </div>
    </div>`;
  }).join('') || `<div class="empty-state"><p>${t('no_findings')}</p></div>`;
  $$('#updList .disc-region').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.region; if (REGIONS[id]) Brain3D.pick(id);
  }));
}
function buildUpdatesUI() {
  $$('#updFilters .uf-btn').forEach(b => b.addEventListener('click', () => {
    $$('#updFilters .uf-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); discFilter = b.dataset.level; renderDiscoveries();
  }));
  $('#updRefresh').addEventListener('click', async () => {
    discoveries = await fetchDiscoveries(); renderDiscoveries();
  });
}

/* ---------- Библиотека ---------- */
function buildLibrary(filter = '') {
  const grid = $('#libGrid');
  const f = filter.toLowerCase();
  const items = STATES.filter(s => !f || stateLabel(s).toLowerCase().includes(f) || s.label.toLowerCase().includes(f));
  grid.innerHTML = items.map(s => {
    const v = VALENCE[s.id] || 0;
    const cls = v >= 1 ? 'pos' : v <= -1 ? 'neg' : 'neu';
    return `<button class="lib-item ${cls}" data-state="${s.id}">
      <span class="li-emoji">${s.emoji}</span><span class="li-label">${stateLabel(s)}</span></button>`;
  }).join('');
  $$('#libGrid .lib-item').forEach(b => b.addEventListener('click', () => showStateById(b.dataset.state)));
}
function showStateById(id) {
  const s = STATES.find(x => x.id === id); if (!s) return;
  switchTab('analyze');
  $('#feelInput').value = stateLabel(s);
  lastLifestyle = [];
  showState([{ state: s, score: 5, matched: [] }], s.label, { save: false, factors: [] });
  setAnalyzeHint();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Мини-курс ---------- */
function loadCourse() { try { return new Set(JSON.parse(localStorage.getItem(COURSE_KEY)) || []); } catch { return new Set(); } }
function saveCourse(set) { localStorage.setItem(COURSE_KEY, JSON.stringify([...set])); }
function buildCourse() {
  if (!document.getElementById('lessonList')) return; /* курс влит в «Погружение» */
  const ids = Object.keys(REGIONS);
  const done = loadCourse();
  $('#courseProgress').innerHTML =
    `<div class="cp-bar"><span style="width:${(done.size / ids.length * 100).toFixed(0)}%"></span></div>
     <span class="cp-num">${done.size} / ${ids.length} изучено</span>`;
  $('#lessonList').innerHTML = ids.map((id, i) => {
    const r = REGIONS[id];
    return `<div class="lesson ${done.has(id) ? 'done' : ''}" data-region="${id}">
      <div class="ls-head-row"><span class="ls-idx">${i + 1}</span>
        <span class="ls-name">${lang === 'en' && REGION_EN[id] ? REGION_EN[id] : r.name}</span>
        <span class="ls-sys">${r.system}</span>
        <span class="ls-check">${done.has(id) ? '✓' : ''}</span></div>
      <div class="lesson-body hidden">
        <p>${r.detail}</p>
        ${FACTS[id] ? `<div class="fact-box">💡 ${FACTS[id]}</div>` : ''}
      </div></div>`;
  }).join('');
  $$('#lessonList .lesson').forEach(l => l.addEventListener('click', () => {
    const id = l.dataset.region;
    const body = $('.lesson-body', l);
    body.classList.toggle('hidden');
    if (!body.classList.contains('hidden')) {
      switchTabKeep('course'); Brain3D.pick(id);
      const done = loadCourse(); done.add(id); saveCourse(done);
      l.classList.add('done'); $('.ls-check', l).textContent = '✓';
      updateCourseProgress();
    }
  }));
}
function updateCourseProgress() {
  const ids = Object.keys(REGIONS), done = loadCourse();
  $('#courseProgress').innerHTML =
    `<div class="cp-bar"><span style="width:${(done.size / ids.length * 100).toFixed(0)}%"></span></div>
     <span class="cp-num">${done.size} / ${ids.length} изучено</span>`;
}

/* ---------- Викторина ---------- */
let quiz = { score: 0, answered: 0, current: null };
function newQuestion() {
  const ids = Object.keys(REGIONS);
  const correct = ids[Math.floor(Math.random() * ids.length)];
  const opts = [correct];
  while (opts.length < 4) { const r = ids[Math.floor(Math.random() * ids.length)]; if (!opts.includes(r)) opts.push(r); }
  opts.sort(() => Math.random() - 0.5);
  quiz.current = { correct, opts };
  const clue = REGIONS[correct].short;
  $('#quizArea').innerHTML = `<div class="quiz-card">
    <div class="q-clue">${t('quiz_clue')}<br><b>«${clue}»</b></div>
    <div class="q-opts">${opts.map(id => `<button class="q-opt" data-region="${id}">${regName(id)}</button>`).join('')}</div>
    <div class="q-feedback" id="qFeedback"></div>
  </div>`;
  $$('#quizArea .q-opt').forEach(b => b.addEventListener('click', () => answerQuiz(b.dataset.region, b)));
}
function answerQuiz(picked, btn) {
  if (btn.closest('.quiz-card').classList.contains('answered')) return;
  btn.closest('.quiz-card').classList.add('answered');
  const correct = quiz.current.correct;
  quiz.answered++;
  const ok = picked === correct;
  if (ok) quiz.score++;
  $$('#quizArea .q-opt').forEach(b => {
    if (b.dataset.region === correct) b.classList.add('correct');
    else if (b.dataset.region === picked) b.classList.add('wrong');
    b.disabled = true;
  });
  Brain3D.pick(correct);
  $('#qFeedback').innerHTML = `${ok ? t('quiz_correct') : t('quiz_wrong_pre') + ' <b>' + regName(correct) + '</b>'}
    <div class="q-explain">${REGIONS[correct].detail}</div>
    <button class="next-q" id="nextQ">${t('quiz_next')}</button>`;
  $('#quizScore').textContent = `${t('score')}${quiz.score} / ${quiz.answered}`;
  $('#nextQ').addEventListener('click', newQuestion);
}
function restartQuiz() { quiz = { score: 0, answered: 0, current: null }; $('#quizScore').textContent = t('score') + '0'; newQuestion(); }

/* ---------- Экспорт / бэкап / шеринг ---------- */
function exportCsv() {
  const hist = loadHistory();
  const rows = [[t('csv_date'), t('csv_text'), t('csv_states'), t('csv_zones'), t('csv_triggers'), t('csv_mood')]];
  hist.forEach(h => rows.push([
    new Date(h.ts).toISOString(),
    h.text,
    h.states.map(s => s.label).join('; '),
    (h.regions || []).map(id => regName(id)).join('; '),
    (h.triggers || []).map(id => (TRIGGERS.find(t => t.id === id) || {}).label || id).join('; '),
    Charts.entryValence(h).toFixed(1)
  ]));
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  download(new Blob(['﻿' + csv], { type: 'text/csv' }), 'neuromirror-dnevnik.csv');
}
function exportPdf() {
  const hist = loadHistory();
  const w = window.open('', '_blank');
  w.document.write(`<html><head><meta charset="utf-8"><title>${t('diary_title')}</title>
    <style>body{font-family:-apple-system,Arial,sans-serif;padding:24px;color:#111}
    h1{font-size:20px}.e{border-bottom:1px solid #ddd;padding:10px 0}.d{color:#666;font-size:12px}
    .b{background:#eef;border-radius:10px;padding:2px 8px;font-size:12px;margin-right:4px}</style></head><body>
    <h1>${t('diary_h1')}</h1>
    ${hist.map(h => `<div class="e"><div class="d">${fmtDate(h.ts)}</div>
      <div>«${escapeHtml(h.text)}»</div>
      <div>${h.states.map(s => `<span class="b">${s.emoji} ${s.label}</span>`).join('')}</div></div>`).join('')}
    </body></html>`);
  w.document.close(); setTimeout(() => w.print(), 400);
}
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function shareCard() {
  const m = lastMatches[0];
  const title = m ? stateLabel(m.state) : t('my_state');
  const regions = m ? m.state.regions.primary.map(id => regName(id)).join(', ') : '';
  const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1080;
  const c = cv.getContext('2d');
  const g = c.createLinearGradient(0, 0, 1080, 1080); g.addColorStop(0, '#141a2e'); g.addColorStop(1, '#0b0f1c');
  c.fillStyle = g; c.fillRect(0, 0, 1080, 1080);
  c.fillStyle = '#6ea8ff'; c.font = 'bold 44px -apple-system,Arial'; c.fillText('🧠 Brain Emotion Map', 80, 130);
  c.fillStyle = '#fff'; c.font = 'bold 90px -apple-system,Arial';
  c.fillText((m ? m.state.emoji + ' ' : '') + title, 80, 300);
  c.fillStyle = '#ffcf5b'; c.font = '34px -apple-system,Arial';
  c.fillText(t('active_zones'), 80, 420);
  c.fillStyle = '#e7ecff'; c.font = '40px -apple-system,Arial';
  wrapText(c, regions || '—', 80, 490, 920, 52);
  if (m && m.state.mechanism) { c.fillStyle = '#9aa6cf'; c.font = '30px -apple-system,Arial'; wrapText(c, m.state.mechanism, 80, 700, 920, 42); }
  c.fillStyle = '#5b6a95'; c.font = '26px -apple-system,Arial'; c.fillText(t('edu_footer'), 80, 1010);
  cv.toBlob(async blob => {
    const file = new File([blob], 'neuromirror.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Brain Emotion Map' }); return; } catch (e) { }
    }
    download(blob, 'neuromirror-card.png');
  });
}
function wrapText(c, text, x, y, maxW, lh) {
  const words = String(text).split(' '); let line = '', yy = y;
  for (const w of words) {
    if (c.measureText(line + w).width > maxW && line) { c.fillText(line.trim(), x, yy); line = ''; yy += lh; }
    line += w + ' ';
  }
  c.fillText(line.trim(), x, yy);
}

/* Шифрованный бэкап (Web Crypto, AES-GCM + PBKDF2) */
async function deriveKey(pass, salt) {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function backup() {
  const pass = prompt(t('backup_new'));
  if (!pass) return;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pass, salt);
  const data = new TextEncoder().encode(localStorage.getItem(HISTORY_KEY) || '[]');
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  const payload = JSON.stringify({ v: 1, salt: b64(salt), iv: b64(iv), data: b64(ct) });
  download(new Blob([payload], { type: 'application/json' }), 'neuromirror-backup.nmbak');
}
async function restore(file) {
  const pass = prompt(t('backup_open'));
  if (!pass) return;
  try {
    const obj = JSON.parse(await file.text());
    const key = await deriveKey(pass, unb64(obj.salt));
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(obj.iv) }, key, unb64(obj.data));
    const restored = JSON.parse(new TextDecoder().decode(pt));
    const cur = loadHistory();
    const merged = [...restored, ...cur].filter((h, i, a) => a.findIndex(x => x.ts === h.ts) === i)
      .sort((a, b) => b.ts - a.ts).slice(0, 200);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));
    renderHistory();
    alert(t('restore_done') + restored.length + t('restore_entries'));
  } catch (e) { alert(t('restore_fail')); }
}

/* ---------- Вкладки ---------- */
function setAnalyzeHint() {
  $('#brainHint').textContent = lastMatches.length
    ? t('hint_analyze_done')
    : t('hint_default');
}
function switchTabKeep(name) { /* переключение без сброса подсветки */ switchTab(name, true); }
function switchTab(name, keep) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.view').forEach(v => v.classList.add('hidden'));
  $('#view-' + name).classList.remove('hidden');
  if (name === 'history') renderHistory();
  if (name === 'analyze') { setAnalyzeHint(); if (lastMatches.length && !keep) replayHighlight(); }
  if (name === 'brain') { renderChemLegend([]); if (window.Explore) Explore.render(); }
  if (name === 'programs') { $('#brainHint').textContent = t('hint_programs'); if (window.Programs) Programs.render(); }
}

/* ---------- Примеры ---------- */
const EXAMPLES = ['Тревожусь', 'Мне лень', 'Не могу уснуть', 'Мало спал и много ел',
  'Ничего не радует', 'Навязчивые мысли', 'Нет сил', 'Ни с кем не общалась'];
function buildChips() {
  const list = (lang === 'en' && window.EN_EXAMPLES) ? EN_EXAMPLES : EXAMPLES;
  $('#exampleChips').innerHTML = list.map(e => `<span class="chip">${e}</span>`).join('');
  $$('#exampleChips .chip').forEach(c => c.addEventListener('click', () => { $('#feelInput').value = c.textContent; runAnalyze(); }));
}

/* ---------- Ракурсы ---------- */
function buildViewBar() {
  $$('#viewBar button').forEach(b => b.addEventListener('click', () => {
    $$('#viewBar button').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); Brain3D.setView(b.dataset.view);
  }));
}

/* ---------- Инструменты 3D: системы, рентген, разрез, экскурсия ---------- */
const SYSTEMS = {
  limbic: { name: 'Лимбическая система', color: '#c78bff',
    regions: ['amygdala', 'hippocampus', 'hypothalamus', 'thalamus', 'acc', 'insula'],
    links: [['thalamus', 'amygdala'], ['amygdala', 'hypothalamus'], ['amygdala', 'hippocampus'], ['hippocampus', 'acc']] },
  reward: { name: 'Система вознаграждения', color: '#68f0a0', label: 'дофамин',
    regions: ['vta', 'accumbens', 'pfc', 'striatum', 'ofc'],
    links: [['vta', 'accumbens'], ['accumbens', 'pfc'], ['accumbens', 'striatum']] },
  stress: { name: 'Ось стресса (HPA)', color: '#ff8a4c', label: 'кортизол',
    regions: ['amygdala', 'hypothalamus', 'pituitary', 'brainstem', 'pfc'],
    links: [['amygdala', 'hypothalamus'], ['hypothalamus', 'pituitary'], ['pituitary', 'brainstem']] },
  dopamine: { name: 'Дофаминовые пути', color: '#68f0a0', label: 'дофамин',
    regions: ['vta', 'accumbens', 'pfc', 'striatum'],
    links: [['vta', 'accumbens'], ['vta', 'pfc'], ['vta', 'striatum']] }
};
const TOUR = [
  { id: 'pfc', t: 'Префронтальная кора', d: '«Дирижёр» мозга: планирует, принимает решения, тормозит импульсы. В связке с амигдалой держит эмоции под контролем — при стрессе слабеет, и верх берут эмоции.' },
  { id: 'amygdala', t: 'Амигдала', d: 'Главная сигнализация: за миллисекунды поднимает тревогу и страх. Работает в паре с гипоталамусом (запускает реакцию тела) и гиппокампом (добавляет контекст: реальна ли угроза).' },
  { id: 'hippocampus', t: 'Гиппокамп', d: 'Архив памяти: превращает события в долговременные воспоминания и хранит контекст. Тесно связан с амигдалой — та «окрашивает» воспоминания эмоцией.' },
  { id: 'thalamus', t: 'Таламус', d: 'Коммутатор мозга: почти все сигналы органов чувств проходят через него и распределяются по коре. Решает, что пропустить в сознание.' },
  { id: 'hypothalamus', t: 'Гипоталамус', d: 'Гормональный штаб: управляет сном, голодом, температурой и стрессом через гипофиз. Получает команды от амигдалы и запускает выброс кортизола.' },
  { id: 'accumbens', t: 'Прилежащее ядро', d: 'Центр «хочу»: предвкушение награды и мотивация. Получает дофамин из VTA и подталкивает префронтальную кору к действию.' },
  { id: 'vta', t: 'Вентральная область покрышки (VTA)', d: 'Источник дофамина мотивации. Питает прилежащее ядро и кору — это «топливо» желания и обучения на награде.' },
  { id: 'insula', t: 'Островковая доля (инсула)', d: 'Чувство тела изнутри: сердцебиение, дыхание, «нутром чую». Превращает сигналы тела в осознанные эмоции, тесно работает с амигдалой.' },
  { id: 'cerebellum', t: 'Мозжечок', d: 'Координация, баланс и точность движений, чувство ритма. Незаметно «сглаживает» и автоматизирует не только движения, но и мысли с эмоциями.' },
  { id: 'brainstem', t: 'Ствол мозга', d: 'Автопилот жизни: дыхание, сердцебиение, давление, бодрствование. Работает без перерыва всю жизнь, даже во сне.' }
];
let touring = false;
function buildBrainTools() {
  $$('#brainTools [data-sys]').forEach(b => b.addEventListener('click', () => {
    const s = SYSTEMS[b.dataset.sys];
    if (!s) { Brain3D.clear(); $('#brainHint').textContent = t('hint_default'); return; }
    Brain3D.showSystem(s.regions, s.links, s.color, s.label);
    $('#brainHint').textContent = '🕸 ' + s.name + (s.label ? ' · медиатор: ' + s.label : '');
  }));
  const slider = $('#xraySlider');
  if (slider) slider.addEventListener('input', () => Brain3D.setXray(slider.value / 100));
  $$('#brainTools [data-cut]').forEach(b => b.addEventListener('click', () => {
    $$('#brainTools .cut').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); Brain3D.setCut(b.dataset.cut);
  }));
  const tb = $('#tourBtn');
  function endTour() { touring = false; tb.textContent = '▶ Экскурсия по мозгу'; $('#tourCap').classList.add('hidden'); setAnalyzeHint(); }
  if (tb) tb.addEventListener('click', () => {
    if (touring) { Brain3D.stopTour(); endTour(); return; }
    touring = true; tb.textContent = '⏹ Остановить экскурсию';
    Brain3D.tour(TOUR, (it, pos, total) => {
      if (!it) { endTour(); return; }
      $('#tcTitle').textContent = it.t || regName(it.id);
      $('#tcDesc').textContent = it.d || '';
      $('#tcPos').textContent = pos + ' / ' + total;
      $('#tourCap').classList.remove('hidden');
      $('#brainHint').textContent = '🎥 Экскурсия по мозгу…';
    });
  });
}

/* ---------- PWA ---------- */
let deferredPrompt = null;
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
function openInstallModal(html) { $('#installBody').innerHTML = html; $('#installModal').classList.remove('hidden'); }
function closeInstallModal() { $('#installModal').classList.add('hidden'); }
$('#installClose').addEventListener('click', closeInstallModal);
$('#installModal').addEventListener('click', e => { if (e.target === $('#installModal')) closeInstallModal(); });
$('#installBtn').addEventListener('click', async () => {
  if (isStandalone()) { openInstallModal('<p>✅ Приложение уже установлено и открыто как отдельное приложение.</p>'); return; }
  if (deferredPrompt) {
    deferredPrompt.prompt(); const r = await deferredPrompt.userChoice; deferredPrompt = null;
    if (r && r.outcome === 'accepted') { openInstallModal('<p>✅ Установка началась — ищите иконку на экране.</p>'); }
    return;
  }
  if (isIOS()) {
    openInstallModal(`
      <p><b>Установка на iPhone / iPad (Safari):</b></p>
      <ol class="install-steps">
        <li>Откройте это приложение в <b>Safari</b> (не в другом браузере).</li>
        <li>Нажмите кнопку <b>«Поделиться»</b> <span class="ios-share">􀈂</span> (квадрат со стрелкой вверх) внизу экрана.</li>
        <li>Выберите <b>«На экран “Домой”»</b> (Add to Home Screen).</li>
        <li>Нажмите <b>«Добавить»</b> — появится иконка, приложение будет работать офлайн.</li>
      </ol>
      <p class="muted small">Адрес этой страницы: <span class="url-pill">${location.href}</span></p>`);
    return;
  }
  openInstallModal(`
    <p><b>Установка на компьютере / Android:</b></p>
    <ol class="install-steps">
      <li>В адресной строке браузера (Chrome/Edge) нажмите значок <b>установки</b> ⤓ или «…» → <b>«Установить приложение»</b>.</li>
      <li>Подтвердите — появится иконка, приложение открывается в отдельном окне и работает офлайн.</li>
    </ol>
    <p class="muted small">Если приложение открыто как файл, для установки запустите его через сервер: <span class="url-pill">python3 server.py</span></p>`);
});

/* ---------- Слушатели ---------- */
$$('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
$('#analyzeBtn').addEventListener('click', runAnalyze);
$('#feelInput').addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') runAnalyze(); });
$('#clearHistory').addEventListener('click', () => { if (confirm('Удалить все записи дневника?')) clearHistoryData(); });
$('#exportCsv').addEventListener('click', exportCsv);
$('#exportPdf').addEventListener('click', exportPdf);
$('#shareBtn').addEventListener('click', shareCard);
$('#backupBtn').addEventListener('click', backup);
$('#restoreBtn').addEventListener('click', () => $('#restoreFile').click());
$('#restoreFile').addEventListener('change', e => { if (e.target.files[0]) restore(e.target.files[0]); e.target.value = ''; });
$('#quizRestart').addEventListener('click', restartQuiz);
$('#libSearch').addEventListener('input', e => buildLibrary(e.target.value));
$$('#langSwitch button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lang; localStorage.setItem(LANG_KEY, lang); applyLang(); }));

/* ---------- Старт ---------- */
buildChips(); buildRegionList(); buildViewBar(); buildBrainTools(); buildTriggerChips();
buildLibrary(); buildCourse(); renderHistory(); applyLang();
buildUpdatesUI(); if (window.Explore) Explore.mount();
