/* ============================================================
   Charts — лёгкие SVG-графики динамики (без внешних библиотек).
   window.Charts.moodLine(hist), weekdayBars(hist),
   triggerCorrelation(hist), patternInsights(hist)
   ============================================================ */
(function () {
  const WD = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const dayKey = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const wd = ts => (new Date(ts).getDay() + 6) % 7; // 0 = Пн

  function entryValence(h) {
    const vals = (h.states || []).map(s => (typeof VALENCE !== 'undefined' ? VALENCE[s.id] : 0))
      .filter(v => typeof v === 'number');
    if (h.mood != null) return h.mood;                 // явная оценка 1..5 → -2..2
    if (!vals.length) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  /* Линия настроения за N дней */
  function moodLine(hist, days = 14) {
    if (!hist.length) return '';
    const now = dayKey(Date.now());
    const buckets = {};
    hist.forEach(h => {
      const k = dayKey(h.ts);
      (buckets[k] = buckets[k] || []).push(entryValence(h));
    });
    const pts = [];
    for (let i = days - 1; i >= 0; i--) {
      const k = now - i * 86400000;
      const arr = buckets[k];
      pts.push({ k, v: arr ? arr.reduce((a, b) => a + b, 0) / arr.length : null });
    }
    const W = 640, H = 180, pad = 26;
    const x = i => pad + (W - pad * 2) * (i / (days - 1));
    const y = v => pad + (H - pad * 2) * (1 - (v + 2) / 4);
    // линия по существующим точкам
    let d = '', started = false;
    pts.forEach((p, i) => {
      if (p.v == null) return;
      d += (started ? ' L' : 'M') + x(i).toFixed(1) + ' ' + y(p.v).toFixed(1);
      started = true;
    });
    const dots = pts.map((p, i) => p.v == null ? '' :
      `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3.5"
        fill="${p.v >= 0.5 ? '#5fd6a8' : p.v <= -0.5 ? '#ff7b8a' : '#ffcf5b'}"/>`).join('');
    const midY = y(0).toFixed(1);
    return `<svg viewBox="0 0 ${W} ${H}" class="chart">
      <line x1="${pad}" y1="${y(2)}" x2="${W - pad}" y2="${y(2)}" class="grid"/>
      <line x1="${pad}" y1="${midY}" x2="${W - pad}" y2="${midY}" class="grid mid"/>
      <line x1="${pad}" y1="${y(-2)}" x2="${W - pad}" y2="${y(-2)}" class="grid"/>
      <text x="2" y="${+y(2) + 4}" class="ctick">😄</text>
      <text x="2" y="${+midY + 4}" class="ctick">😐</text>
      <text x="2" y="${+y(-2) + 4}" class="ctick">😔</text>
      <path d="${d}" fill="none" stroke="url(#moodGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots}
      <defs><linearGradient id="moodGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#6ea8ff"/><stop offset="1" stop-color="#8b7bff"/>
      </linearGradient></defs>
    </svg>`;
  }

  /* Активность по дням недели (сколько записей) */
  function weekdayBars(hist) {
    if (!hist.length) return '';
    const cnt = [0, 0, 0, 0, 0, 0, 0];
    hist.forEach(h => cnt[wd(h.ts)]++);
    const max = Math.max(...cnt, 1);
    return `<div class="wd-bars">${cnt.map((n, i) => `
      <div class="wd-col">
        <div class="wd-bar" style="height:${(n / max * 80 + 4).toFixed(0)}px" title="${n}"></div>
        <div class="wd-lbl">${WD[i]}</div>
      </div>`).join('')}</div>`;
  }

  /* Корреляция триггеров со средним настроением */
  function triggerCorrelation(hist) {
    const map = {};
    hist.forEach(h => (h.triggers || []).forEach(t => {
      (map[t] = map[t] || []).push(entryValence(h));
    }));
    const rows = Object.entries(map).map(([id, arr]) => {
      const tr = (typeof TRIGGERS !== 'undefined') ? TRIGGERS.find(x => x.id === id) : null;
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      return { id, label: tr ? `${tr.emoji} ${tr.label}` : id, avg, n: arr.length };
    }).sort((a, b) => b.avg - a.avg);
    if (!rows.length) return '';
    return `<div class="trig-corr">${rows.map(r => {
      const pct = ((r.avg + 2) / 4 * 100).toFixed(0);
      const col = r.avg >= 0.5 ? '#5fd6a8' : r.avg <= -0.5 ? '#ff7b8a' : '#ffcf5b';
      return `<div class="tc-row">
        <span class="tc-name">${r.label}</span>
        <span class="tc-track"><span class="tc-fill" style="width:${pct}%;background:${col}"></span></span>
        <span class="tc-num">${r.avg > 0 ? '+' : ''}${r.avg.toFixed(1)} · ${r.n}×</span>
      </div>`;
    }).join('')}</div>`;
  }

  /* Текстовые закономерности */
  function patternInsights(hist) {
    if (hist.length < 3) return [];
    const out = [];
    // самый частый день недели для тяжёлых состояний
    const byWdNeg = [0, 0, 0, 0, 0, 0, 0], byWd = [0, 0, 0, 0, 0, 0, 0];
    hist.forEach(h => { const w = wd(h.ts); byWd[w]++; if (entryValence(h) <= -1) byWdNeg[w]++; });
    let worst = -1, worstVal = 0;
    byWdNeg.forEach((n, i) => { if (n > worstVal) { worstVal = n; worst = i; } });
    if (worst >= 0 && worstVal >= 2)
      out.push(`Тяжёлые состояния у вас чаще по ${["понедельникам","вторникам","средам","четвергам","пятницам","субботам","воскресеньям"][worst]}.`);

    // самая частая зона
    const freq = {};
    hist.forEach(h => (h.regions || []).forEach(id => freq[id] = (freq[id] || 0) + 1));
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= 3 && typeof REGIONS !== 'undefined' && REGIONS[top[0]])
      out.push(`Чаще всего активна: ${REGIONS[top[0]].name.split('(')[0].trim()} (${top[1]} раз).`);

    // лучший/худший триггер
    const map = {};
    hist.forEach(h => (h.triggers || []).forEach(t => (map[t] = map[t] || []).push(entryValence(h))));
    const scored = Object.entries(map).filter(([, a]) => a.length >= 2)
      .map(([id, a]) => ({ id, avg: a.reduce((x, y) => x + y, 0) / a.length }));
    const best = scored.slice().sort((a, b) => b.avg - a.avg)[0];
    const worstT = scored.slice().sort((a, b) => a.avg - b.avg)[0];
    const trg = id => (typeof TRIGGERS !== 'undefined' ? (TRIGGERS.find(t => t.id === id) || {}) : {});
    if (best && best.avg >= 0.5) out.push(`В дни с «${(trg(best.id).label || best.id)}» настроение заметно лучше.`);
    if (worstT && worstT.avg <= -0.8 && (!best || worstT.id !== best.id))
      out.push(`«${(trg(worstT.id).label || worstT.id)}» связан с более тяжёлыми днями.`);
    return out;
  }

  window.Charts = { moodLine, weekdayBars, triggerCorrelation, patternInsights, entryValence };
})();
