/* ============================================================
   Friendly — дружелюбная кликабельная схема головы с мозгом.
   Клик по структуре → сразу простая карточка: эмодзи, функция,
   ассоциация. Плюс подсветка на 3D-модели.
   window.Friendly.mount(container) / .render()
   ============================================================ */
(function () {

  // Контент (простыми словами + ассоциация)
  const FRIENDLY = {
    frontal:     { emoji: "🧑‍💼", name: "Лобные доли",     func: "думаю, планирую, сдерживаюсь",        mnem: "Лоб = логика",        en: { name: "Frontal lobes", func: "think, plan, hold back", mnem: "Front = logic" } },
    parietal:    { emoji: "🧭",   name: "Теменная доля",    func: "тело, пространство, «где я»",           mnem: "Темя = тело",         en: { name: "Parietal lobe", func: "body, space, «where am I»", mnem: "Parietal = position" } },
    temporal:    { emoji: "👂",   name: "Височные доли",    func: "слух, речь, распознавание лиц",         mnem: "Виски = слышу",       en: { name: "Temporal lobes", func: "hearing, speech, faces", mnem: "Temporal = tune in" } },
    occipital:   { emoji: "👀",   name: "Затылочная доля",  func: "зрение",                                mnem: "Затылок = вижу",      en: { name: "Occipital lobe", func: "vision", mnem: "Back = sight" } },
    cerebellum:  { emoji: "🤸",   name: "Мозжечок",         func: "координация, точность, автоматизм",     mnem: "Мозжечок = моторика", en: { name: "Cerebellum", func: "coordination, precision", mnem: "Little brain = moves" } },
    brainstem:   { emoji: "❤️",   name: "Ствол мозга",      func: "дыхание, сердце, бодрствование",        mnem: "Ствол = живу",        en: { name: "Brainstem", func: "breathing, heartbeat", mnem: "Stem = alive" } },
    amygdala:    { emoji: "🚨",   name: "Амигдала",         func: "страх, тревога, «опасность!»",          mnem: "Амигдала = alarm",    en: { name: "Amygdala", func: "fear, anxiety, «danger!»", mnem: "Amygdala = alarm" } },
    hippocampus: { emoji: "📚",   name: "Гиппокамп",        func: "память, обучение, контекст",            mnem: "Hippo = history",     en: { name: "Hippocampus", func: "memory, learning, context", mnem: "Hippo = history" } },
    thalamus:    { emoji: "🎛️",   name: "Таламус",          func: "фильтрую сигналы — что пускать в сознание", mnem: "Таламус = трафик", en: { name: "Thalamus", func: "filters signals into awareness", mnem: "Thalamus = traffic" } },
    hypothalamus:{ emoji: "⚖️",   name: "Гипоталамус",      func: "сон, голод, гормоны, баланс",           mnem: "Гипо = баланс тела",  en: { name: "Hypothalamus", func: "sleep, hunger, hormones", mnem: "Hypo = body balance" } }
  };
  // привязка к 3D-структуре
  const PICK = { frontal: "pfc", parietal: "sensory", temporal: "hippocampus", occipital: "visual",
    cerebellum: "cerebellum", brainstem: "brainstem", amygdala: "amygdala", hippocampus: "hippocampus",
    thalamus: "thalamus", hypothalamus: "hypothalamus" };
  // цвета как на анатомических атласах (лат. вид)
  const COLORS = { frontal: "#7ec27e", parietal: "#ef9fb0", temporal: "#7ec8ec", occipital: "#b79be0",
    cerebellum: "#e2b48a", brainstem: "#d98a76", amygdala: "#ff5b6b", hippocampus: "#ffcf5b",
    thalamus: "#8b7bff", hypothalamus: "#5fd6a8" };

  const SVG = `
  <svg id="frSvg" viewBox="0 0 620 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Схема мозга">
    <defs>
      <filter id="frGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="skin" cx="42%" cy="40%" r="70%">
        <stop offset="0" stop-color="#243052"/><stop offset="1" stop-color="#161d33"/>
      </radialGradient>
    </defs>

    <!-- Голова в профиль (лицом влево) -->
    <path d="M214,92 C240,56 320,46 396,66 C474,86 520,150 516,224
             C513,286 480,330 440,354 C458,370 438,384 414,378
             C424,400 398,410 374,402 C330,430 276,432 240,412
             C214,398 210,366 228,346 C190,332 168,312 178,282
             C150,276 150,250 182,236 C179,198 181,150 194,122
             C200,106 206,100 214,92 Z"
          fill="url(#skin)" stroke="#3a466a" stroke-width="2"/>
    <!-- ухо (ориентир) -->
    <path d="M300,300 C286,304 282,326 296,336 C306,342 316,336 316,324" fill="none" stroke="#3a466a" stroke-width="2" opacity="0.7"/>

    <!-- ================= ДОЛИ КОРЫ (кликабельные) ================= -->
    <!-- Лобная (спереди-слева) -->
    <g class="fr-region" data-fr="frontal">
      <path d="M176,214 C165,172 182,132 226,120 C264,111 298,120 302,150
               C303,180 300,206 296,232 C296,236 296,236 296,236
               C266,248 226,247 199,234 C184,226 178,222 176,214 Z"/>
    </g>
    <!-- Теменная (верх-середина) -->
    <g class="fr-region" data-fr="parietal">
      <path d="M302,150 C304,120 336,112 378,118 C414,123 434,142 430,178
               C427,206 410,222 384,232 C360,236 328,236 302,232
               C300,206 302,178 302,150 Z"/>
    </g>
    <!-- Затылочная (сзади) -->
    <g class="fr-region" data-fr="occipital">
      <path d="M430,178 C460,185 472,220 458,252 C444,276 416,276 398,254
               C392,236 396,208 408,192 C418,183 424,179 430,178 Z"/>
    </g>
    <!-- Височная (низ-середина) -->
    <g class="fr-region" data-fr="temporal">
      <path d="M199,234 C226,247 266,248 302,240 C340,246 372,242 398,254
               C396,286 366,306 322,308 C276,310 228,302 204,280
               C190,266 190,246 199,234 Z"/>
    </g>
    <!-- Мозжечок (складчатый, сзади-снизу) -->
    <g class="fr-region" data-fr="cerebellum">
      <path d="M398,254 C438,252 466,276 458,308 C448,334 412,334 394,306
               C387,288 388,266 398,254 Z"/>
    </g>
    <!-- Ствол мозга (спускается) -->
    <g class="fr-region" data-fr="brainstem">
      <path d="M320,306 C330,338 348,366 340,396 C328,412 308,402 306,372
               C304,346 306,322 320,306 Z"/>
    </g>

    <!-- извилины (декор, не кликабельны) -->
    <g id="frGyri" fill="none" stroke-linecap="round" opacity="0.5" stroke-width="2">
      <path d="M196,150 C214,160 210,178 226,186" stroke="#4a7a4a"/>
      <path d="M232,128 C246,142 236,160 252,172" stroke="#4a7a4a"/>
      <path d="M264,124 C276,140 264,160 280,172" stroke="#4a7a4a"/>
      <path d="M188,196 C206,196 214,208 210,224" stroke="#4a7a4a"/>
      <path d="M318,132 C332,146 322,166 336,178" stroke="#b56a80"/>
      <path d="M356,122 C368,138 356,158 370,172" stroke="#b56a80"/>
      <path d="M392,132 C404,146 394,166 408,180" stroke="#b56a80"/>
      <path d="M330,196 C348,196 356,210 350,224" stroke="#b56a80"/>
      <path d="M418,196 C432,204 430,222 444,230" stroke="#7a5aa0"/>
      <path d="M410,224 C424,230 424,246 436,252" stroke="#7a5aa0"/>
      <path d="M224,258 C244,256 252,270 246,282" stroke="#4a86a8"/>
      <path d="M282,262 C302,260 310,274 304,286" stroke="#4a86a8"/>
      <path d="M340,262 C360,262 366,276 360,288" stroke="#4a86a8"/>
      <path d="M406,270 C420,268 428,282 422,294" stroke="#a07a4a"/>
      <path d="M414,290 C428,288 436,300 430,312" stroke="#a07a4a"/>
    </g>

    <!-- Мозолистое тело (ориентир) -->
    <path d="M238,222 C286,196 360,196 404,220 C360,208 292,208 250,230 Z" fill="#54608a" opacity="0.55"/>

    <!-- ================= ГЛУБОКИЕ СТРУКТУРЫ ================= -->
    <!-- Гиппокамп (изогнутая форма, «морской конёк») -->
    <g class="fr-region fr-deep" data-fr="hippocampus">
      <path d="M300,258 C330,252 352,266 352,286 C352,300 340,308 328,302
               C338,290 326,278 306,278 C292,278 288,268 300,258 Z"/>
    </g>
    <!-- Амигдала (миндалина) -->
    <g class="fr-region fr-deep" data-fr="amygdala">
      <path d="M258,258 C274,250 292,262 292,278 C292,296 270,304 256,294
               C244,286 244,266 258,258 Z"/>
    </g>
    <!-- Таламус (парное яйцо) -->
    <g class="fr-region fr-deep" data-fr="thalamus"><ellipse cx="316" cy="216" rx="22" ry="16"/></g>
    <!-- Гипоталамус -->
    <g class="fr-region fr-deep" data-fr="hypothalamus"><ellipse cx="292" cy="244" rx="13" ry="10"/></g>

    <g id="frLabels"></g>
  </svg>`;

  let container, lang = 'ru';

  function label(x, y, text, anchor) {
    return `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" class="fr-lab">${text}</text>`;
  }

  function mount(el) {
    container = el;
    el.innerHTML = `
      <div class="fr-wrap">
        <div class="fr-diagram">${SVG}</div>
        <div class="fr-detail" id="frDetail">
          <div class="fr-hello">👆 Нажмите структуру на схеме, чтобы узнать, за что она отвечает.</div>
        </div>
      </div>`;
    // подписи с эмодзи прямо на схеме
    const L = el.querySelector('#frLabels');
    const pos = {
      frontal: [226, 176], parietal: [362, 170], occipital: [426, 216],
      temporal: [262, 282], cerebellum: [424, 292], brainstem: [322, 352]
    };
    L.innerHTML = Object.entries(pos).map(([id, p]) => label(p[0], p[1], FRIENDLY[id].emoji)).join('');

    el.querySelectorAll('.fr-region').forEach(g => {
      g.style.setProperty('--acc', COLORS[g.dataset.fr]);
      g.addEventListener('click', () => select(g.dataset.fr));
    });
  }

  function select(id) {
    const f = FRIENDLY[id]; if (!f) return;
    container.querySelectorAll('.fr-region').forEach(g => g.classList.toggle('sel', g.dataset.fr === id));
    const c = COLORS[id];
    const nm = (lang === 'en' && f.en) ? f.en.name : f.name;
    const fn = (lang === 'en' && f.en) ? f.en.func : f.func;
    const mn = (lang === 'en' && f.en) ? f.en.mnem : f.mnem;
    const funcLabel = lang === 'en' ? 'Function' : 'Функция';
    const moreLabel = lang === 'en' ? 'More →' : 'Подробнее →';
    container.querySelector('#frDetail').innerHTML = `
      <div class="fr-card" style="--acc:${c}">
        <div class="fr-emoji">${f.emoji}</div>
        <div class="fr-name">${nm}</div>
        <div class="fr-func"><b>${funcLabel}:</b> ${fn}</div>
        <div class="fr-mnem">👉 ${mn}</div>
        <button class="fr-more" data-region="${PICK[id]}">${moreLabel}</button>
      </div>`;
    const btn = container.querySelector('.fr-more');
    if (btn) btn.addEventListener('click', () => { if (window.showRegionInfo) { window.Explore && Explore.setMode('atlas'); showRegionInfo(PICK[id]); } });
    if (window.Brain3D && PICK[id]) Brain3D.pick(PICK[id]);
  }

  function render(l) { if (l) lang = l; }
  window.Friendly = { mount, render, setLang: l => lang = l };
})();
