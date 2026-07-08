/* ============================================================
   Лента «Открытия о мозге».
   - DISCOVERIES_SEED — стартовый набор реальных находок с метками
     достоверности (verified / emerging / unverified) и источниками.
   - Механизм авто-обновления:
       * window.NEURO_UPDATES_URL — URL JSON-ленты (массив находок).
         Если задан и есть сеть — новые пункты подмешиваются и кэшируются.
       * window.NEURO_RESEARCH_PROVIDER(topic) — async-хук под ИИ,
         который возвращает свежие находки того же формата.
   - Всё, что не подтверждено надёжно, помечается как «ещё не подтверждено».
   ------------------------------------------------------------
   Формат находки: { id, date, title, summary, level, source, url, region? }
   ============================================================ */

const DISCOVERIES_SEED = [
  {
    id: "glymphatic-sleep", date: "2013", region: "brainstem",
    title: "Мозг «моется» во сне",
    summary: "Во сне межклеточные пространства расширяются, и глимфатическая система вымывает продукты обмена (включая бета-амилоид). Ещё один довод, почему сон критичен для мозга.",
    level: "verified", source: "Xie et al., 2013, Science", url: "https://doi.org/10.1126/science.1241224"
  },
  {
    id: "exercise-hippocampus", date: "2011", region: "hippocampus",
    title: "Аэробные нагрузки увеличивают гиппокамп",
    summary: "Год регулярной ходьбы увеличил объём гиппокампа у пожилых людей и улучшил память — мозг сохраняет пластичность во взрослом возрасте.",
    level: "verified", source: "Erickson et al., 2011, PNAS", url: "https://doi.org/10.1073/pnas.1015950108"
  },
  {
    id: "cyclic-sighing", date: "2023", region: "amygdala",
    title: "5 минут дыхания эффективнее медитации для настроения",
    summary: "В прямом РКИ «циклический вздох» (короткий двойной вдох + долгий выдох) снижал тревогу и улучшал настроение сильнее, чем медитация той же длительности.",
    level: "verified", source: "Balban et al., 2023, Cell Reports Medicine", url: "https://doi.org/10.1016/j.xcrm.2022.100895"
  },
  {
    id: "exercise-depression", date: "2024", region: "raphe",
    title: "Физнагрузка — доказанное средство при депрессии",
    summary: "Крупный сетевой мета-анализ РКИ подтвердил: ходьба, бег, силовые и йога дают клинически значимый антидепрессивный эффект.",
    level: "verified", source: "Noetel et al., 2024, BMJ", url: "https://doi.org/10.1136/bmj-2023-075847"
  },
  {
    id: "creatine-sleep", date: "2024", region: "pfc",
    title: "Разовая доза креатина улучшает мышление при недосыпе",
    summary: "Высокая доза креатина временно улучшала когнитивные показатели и меняла энергетический обмен мозга у невыспавшихся участников.",
    level: "emerging", source: "Gordji-Nejad et al., 2024, Scientific Reports", url: "https://doi.org/10.1038/s41598-024-54249-9"
  },
  {
    id: "gut-brain", date: "2019", region: "insula",
    title: "Микробиом кишечника связан с настроением",
    summary: "Крупные когорты показали связь состава кишечных бактерий с депрессией и качеством жизни. Причинность у людей пока уточняется.",
    level: "emerging", source: "Valles-Colomer et al., 2019, Nature Microbiology", url: "https://doi.org/10.1038/s41564-018-0337-x"
  },
  {
    id: "psilocybin-depression", date: "2022", region: "dmn",
    title: "Психоделики «перезагружают» сеть пассивного режима",
    summary: "Псилоцибин под контролем снижал жёсткость сети пассивного режима и облегчал устойчивую депрессию в ранних испытаниях. Метод экспериментальный.",
    level: "emerging", source: "Daws et al., 2022, Nature Medicine", url: "https://doi.org/10.1038/s41591-022-01744-z"
  },
  {
    id: "glp1-reward", date: "2023", region: "accumbens",
    title: "Препараты типа GLP-1 приглушают тягу через систему награды",
    summary: "Средства для похудения (семаглутид и др.) действуют не только на желудок, но и на дофаминовую систему награды, снижая тягу к еде и, возможно, к другим стимулам.",
    level: "emerging", source: "Обзор GLP-1 и мозг", url: "https://pubmed.ncbi.nlm.nih.gov/?term=GLP-1+reward+dopamine+brain"
  },
  {
    id: "adult-neurogenesis", date: "2023", region: "hippocampus",
    title: "Рождаются ли новые нейроны у взрослых — всё ещё спор",
    summary: "Одни работы находят нейрогенез в гиппокампе взрослого человека, другие — почти нет. Единого мнения пока нет.",
    level: "unverified", source: "Дискуссия о нейрогенезе (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=adult+hippocampal+neurogenesis+humans+controversy"
  },
  {
    id: "wimhof", date: "2014", region: "hypothalamus",
    title: "Дыхание + холод могут влиять на автономную систему",
    summary: "Метод Вима Хофа (гипервентиляция + холод) в малом исследовании влиял на воспалительный ответ. Данных мало, нужны крупные проверки.",
    level: "unverified", source: "Kox et al., 2014, PNAS", url: "https://doi.org/10.1073/pnas.1322174111"
  },
  {
    id: "awe-walk", date: "2020", region: "dmn",
    title: "«Прогулки благоговения» уменьшают само-фокус",
    summary: "Прогулки с намеренным вниманием к большому и красивому усиливали позитивные эмоции и снижали зацикленность на себе у пожилых.",
    level: "emerging", source: "Sturm et al., 2020, Emotion", url: "https://doi.org/10.1037/emo0000876"
  },
  {
    id: "cold-dopamine", date: "2000", region: "vta",
    title: "Холодная вода надолго поднимает дофамин",
    summary: "Погружение в холодную воду повышало уровень дофамина в крови примерно в 2,5 раза с длительным эффектом — основа «холодовых» протоколов бодрости.",
    level: "emerging", source: "Šrámek et al., 2000, Eur J Appl Physiol", url: "https://doi.org/10.1007/s004210050065"
  }
];

const LEVEL_META = {
  verified:   { ru: "проверено", en: "verified", color: "#5fd6a8", icon: "✅" },
  emerging:   { ru: "новые данные", en: "emerging", color: "#ffcf5b", icon: "🧪" },
  unverified: { ru: "ещё не подтверждено", en: "unverified", color: "#ff9f6e", icon: "❓" }
};

/* ---------- Загрузка/обновление ленты ---------- */
const UPDATES_CACHE = 'neuromirror_updates_v1';

async function fetchDiscoveries() {
  let items = DISCOVERIES_SEED.slice();

  // кэш ранее подтянутых обновлений
  try {
    const cached = JSON.parse(localStorage.getItem(UPDATES_CACHE) || '[]');
    items = mergeDiscoveries(items, cached);
  } catch (e) { }

  // 1) удалённая лента (если настроена)
  if (window.NEURO_UPDATES_URL) {
    try {
      const res = await fetch(window.NEURO_UPDATES_URL, { cache: 'no-store' });
      if (res.ok) {
        const remote = await res.json();
        if (Array.isArray(remote)) {
          items = mergeDiscoveries(items, remote);
          cacheNew(remote);
        }
      }
    } catch (e) { /* офлайн — используем то, что есть */ }
  }

  // 2) ИИ-хук свежих находок
  if (typeof window.NEURO_RESEARCH_PROVIDER === 'function') {
    try {
      const ai = await window.NEURO_RESEARCH_PROVIDER('brain latest findings');
      if (Array.isArray(ai) && ai.length) { items = mergeDiscoveries(items, ai); cacheNew(ai); }
    } catch (e) { }
  }

  // сортировка: сначала новое по дате
  return items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function mergeDiscoveries(base, extra) {
  const map = {};
  [...base, ...extra].forEach(d => { if (d && d.id) map[d.id] = { level: 'unverified', ...map[d.id], ...d }; });
  return Object.values(map);
}
function cacheNew(items) {
  try {
    const cached = JSON.parse(localStorage.getItem(UPDATES_CACHE) || '[]');
    localStorage.setItem(UPDATES_CACHE, JSON.stringify(mergeDiscoveries(cached, items)));
  } catch (e) { }
}
