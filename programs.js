/* ============================================================
   Programs — пошаговые программы с трекером прогресса.
   window.Programs.render()
   ============================================================ */
(function () {
  const KEY = 'neuromirror_programs_v1';
  let openId = null;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  function todayStr() { return new Date().toISOString().slice(0, 10); }

  function render() {
    const area = document.getElementById('programsArea');
    const state = load();
    if (!openId) {
      // список программ
      area.innerHTML = PROGRAMS.map(p => {
        const st = state[p.id] || { done: [] };
        const pct = Math.round((st.done.length / p.steps.length) * 100);
        return `<div class="prog-card" data-prog="${p.id}">
          <div class="prog-emoji">${p.emoji}</div>
          <div class="prog-main">
            <h3>${p.title}</h3>
            <p class="muted">${p.goal}</p>
            <div class="prog-mini"><div class="prog-bar"><span style="width:${pct}%"></span></div>
              <span class="prog-pct">${pct}%</span></div>
          </div>
          <div class="prog-go">${t('prog_open')}</div>
        </div>`;
      }).join('');
      area.querySelectorAll('.prog-card').forEach(c => c.addEventListener('click', () => { openId = c.dataset.prog; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
      return;
    }

    // одна программа
    const p = PROGRAMS.find(x => x.id === openId);
    const st = state[p.id] || { done: [], streak: 0, last: null };
    const pct = Math.round((st.done.length / p.steps.length) * 100);
    area.innerHTML = `
      <button class="ghost-btn back-btn" id="progBack">${t('prog_back')}</button>
      <div class="prog-detail">
        <div class="pd-head"><span class="prog-emoji big">${p.emoji}</span>
          <div><h2>${p.title}</h2><p class="muted">${p.goal}</p></div></div>
        <div class="pd-why"><b>${t('prog_why')}</b> ${p.why}
          ${p.ref ? `<div class="pd-ref">📄 <a href="${p.ref.url}" target="_blank" rel="noopener">${p.ref.text} ↗</a></div>` : ''}</div>

        <div class="pd-progress"><div class="prog-bar big"><span style="width:${pct}%"></span></div>
          <span class="prog-pct">${st.done.length} / ${p.steps.length}</span></div>

        ${p.streak ? `<div class="streak-box">${t('streak_label')}<b>${st.streak || 0}</b> ${plural(st.streak || 0)}
          <button class="analyze-btn small" id="markToday" ${st.last === todayStr() ? 'disabled' : ''}>
            ${st.last === todayStr() ? t('streak_marked') : t('streak_mark')}</button></div>` : ''}

        <ol class="pd-steps">
          ${p.steps.map((s, i) => `<li class="pd-step ${st.done.includes(i) ? 'done' : ''}" data-step="${i}">
            <button class="pd-check">${st.done.includes(i) ? '✓' : ''}</button>
            <div class="pd-step-body"><div class="pd-step-t">${s.t}</div><div class="pd-step-d">${s.d}</div></div>
          </li>`).join('')}
        </ol>
        ${p.region ? `<button class="ghost-btn" id="progRegion" data-region="${p.region}">${t('show_region')}</button>` : ''}
      </div>`;

    document.getElementById('progBack').addEventListener('click', () => { openId = null; render(); });
    area.querySelectorAll('.pd-step').forEach(li => li.querySelector('.pd-check').addEventListener('click', () => {
      const i = +li.dataset.step;
      const s = load(); const rec = s[p.id] || { done: [], streak: 0, last: null };
      if (rec.done.includes(i)) rec.done = rec.done.filter(x => x !== i);
      else rec.done.push(i);
      s[p.id] = rec; save(s); render();
    }));
    const mt = document.getElementById('markToday');
    if (mt) mt.addEventListener('click', () => {
      const s = load(); const rec = s[p.id] || { done: [], streak: 0, last: null };
      const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      rec.streak = (rec.last === y) ? (rec.streak || 0) + 1 : 1;
      rec.last = todayStr(); s[p.id] = rec; save(s); render();
    });
    const pr = document.getElementById('progRegion');
    if (pr) pr.addEventListener('click', () => { if (REGIONS[p.region]) Brain3D.pick(p.region); });
  }

  function plural(n) { if (lang === 'en') return n === 1 ? t('day_one') : t('day_many'); const a = n % 10, b = n % 100; if (a === 1 && b !== 11) return 'день'; if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return 'дня'; return 'дней'; }

  window.Programs = { render };
})();
