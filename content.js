/* ============================================================
   НейроЗеркало — расширенный контент
   - STATE_RESEARCH: свежие/нестандартные техники + референсы
   - LIFESTYLE: анализ образа жизни (сон, еда, общение, спорт…)
   - SUPPLEMENTS: научно изучаемые добавки для работы мозга
   - TRIGGERS: события для таймлайна причин
   - VALENCE: эмоциональный «знак» состояния (для графика настроения)
   - FACTS: факты для мини-курса
   - LEVELS: уровни достоверности
   - I18N / REGION_EN / STATE_EN: мультиязычность (RU/EN)
   ------------------------------------------------------------
   Ссылки ведут либо на DOI исследования, либо на поиск в PubMed.
   Всё носит образовательный характер и не является мед. советом.
   ============================================================ */

/* ---------- Уровни достоверности ---------- */
const LEVELS = {
  strong:      { ru: "доказано", en: "well-established", color: "#5fd6a8" },
  emerging:    { ru: "новые данные", en: "emerging", color: "#ffcf5b" },
  preliminary: { ru: "предварительно", en: "preliminary", color: "#ff9f6e" }
};

/* ---------- Свежие / нестандартные техники по состояниям ---------- */
/* Каждый совет: { tip, level, source, url } */
const STATE_RESEARCH = {
  anxiety: [
    { tip: "«Циклический вздох»: 5 минут двойного вдоха носом и долгого выдоха ртом снижают тревогу и частоту дыхания сильнее, чем медитация (прямое сравнение в РКИ 2023).",
      level: "strong", source: "Balban et al., 2023, Cell Reports Medicine", url: "https://doi.org/10.1016/j.xcrm.2022.100895" },
    { tip: "Назвать эмоцию одним словом («affect labeling»): вербализация чувства измеримо снижает активность амигдалы по данным фМРТ.",
      level: "strong", source: "Lieberman et al., 2007, Psychological Science", url: "https://doi.org/10.1111/j.1467-9280.2007.01916.x" },
    { tip: "Периферийное («панорамное») зрение: намеренно расширить поле зрения на 30–60 сек механически снижает возбуждение — противоположность «туннельному» зрению стресса.",
      level: "emerging", source: "Обзор оптики стресса, Huberman Lab", url: "https://pubmed.ncbi.nlm.nih.gov/?term=peripheral+vision+arousal+stress" }
  ],
  panic: [
    { tip: "Удлинённый выдох важнее глубокого вдоха: соотношение выдоха к вдоху ~2:1 активирует парасимпатику и обрывает петлю паники.",
      level: "strong", source: "Balban et al., 2023, Cell Reports Medicine", url: "https://doi.org/10.1016/j.xcrm.2022.100895" },
    { tip: "Резкий холод на лицо (нырятельный рефлекс) замедляет сердце за секунды — портативная «скорая» при накрывающей волне.",
      level: "emerging", source: "Diving reflex, Šrámek et al., 2000, Eur J Appl Physiol", url: "https://doi.org/10.1007/s004210050065" }
  ],
  stress: [
    { tip: "Zone-2 кардио 20–30 мин утилизирует кортизол и адреналин и повышает BDNF; аэробная нагрузка по эффекту сопоставима с психотерапией при лёгком стрессе.",
      level: "strong", source: "Noetel et al., 2024, BMJ (network meta-analysis)", url: "https://doi.org/10.1136/bmj-2023-075847" },
    { tip: "«Прогулка благоговения» (awe walk): идти, намеренно замечая большое и красивое, сильнее снижает стресс и само-фокус, чем обычная прогулка.",
      level: "emerging", source: "Sturm et al., 2020, Emotion", url: "https://doi.org/10.1037/emo0000876" },
    { tip: "NSDR / йога-нидра 10–20 мин восстанавливает ресурс без сна и мягко поднимает дофамин.",
      level: "emerging", source: "Kjaer et al., 2002, Cognitive Brain Research", url: "https://doi.org/10.1016/S0926-6410(01)00106-9" }
  ],
  laziness: [
    { tip: "«Связка соблазна» (temptation bundling): делать скучное только одновременно с приятным (любимый подкаст ↔ уборка) — поднимает выполнение на десятки процентов.",
      level: "emerging", source: "Milkman et al., 2014, Management Science", url: "https://doi.org/10.1287/mnsc.2013.1784" },
    { tip: "Не «стакать» дофамин: не совмещайте лёгкое дело с музыкой+едой+лентой сразу — иначе рутина на их фоне кажется ещё скучнее. Скуку лучше «недосыщать».",
      level: "emerging", source: "Модель дофаминового базового уровня (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=dopamine+baseline+reward+prediction+motivation" },
    { tip: "Утренний яркий свет в первые 30–60 мин после пробуждения задаёт дофамин-кортизоловый ритм дня и облегчает старт дел.",
      level: "emerging", source: "Circadian light & alertness (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=morning+light+circadian+cortisol+alertness" },
    { tip: "Креатин 5 г/день поддерживает энергетический обмен мозга и снижает умственную усталость, особенно при недосыпе (РКИ 2024).",
      level: "emerging", source: "Gordji-Nejad et al., 2024, Scientific Reports", url: "https://doi.org/10.1038/s41598-024-54249-9" }
  ],
  apathy: [
    { tip: "Действие раньше мотивации: короткое движение поднимает дофамин, и «хочу» появляется уже в процессе — не ждите настроения, создайте его телом.",
      level: "strong", source: "Exercise & mood, Noetel et al., 2024, BMJ", url: "https://doi.org/10.1136/bmj-2023-075847" },
    { tip: "«Дофаминовое голодание» наоборот вредно как крайность; полезнее временно снизить сверхбыстрые награды (короткие видео, сахар), чтобы вернуть чувствительность рецепторов.",
      level: "emerging", source: "Reward sensitivity & hyperstimulation (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=reward+sensitivity+dopamine+overstimulation" }
  ],
  depression: [
    { tip: "Физическая нагрузка — доказанное самостоятельное средство при лёгкой/умеренной депрессии; наибольший эффект у бодрой ходьбы, бега и силовых.",
      level: "strong", source: "Noetel et al., 2024, BMJ", url: "https://doi.org/10.1136/bmj-2023-075847" },
    { tip: "Поведенческая активация (спланировать маленькие приятные/значимые действия) не уступает КПТ по эффективности.",
      level: "strong", source: "Ekers et al., 2014, PLoS ONE (meta-analysis)", url: "https://doi.org/10.1371/journal.pone.0100100" },
    { tip: "EPA-омега-3 (>1 г/сут, доля EPA) показывает антидепрессивный эффект как дополнение — обсудить с врачом.",
      level: "emerging", source: "Liao et al., 2019, Translational Psychiatry", url: "https://doi.org/10.1038/s41398-019-0515-5" }
  ],
  rumination: [
    { tip: "Регулярная медитация осознанности снижает активность сети пассивного режима (DMN) — того самого контура «мыслей по кругу» (фМРТ у опытных практиков).",
      level: "strong", source: "Brewer et al., 2011, PNAS", url: "https://doi.org/10.1073/pnas.1112029108" },
    { tip: "Прогулка на природе ~90 мин снижает руминацию и активность субгенуальной префронтальной коры сильнее, чем прогулка по городу.",
      level: "emerging", source: "Bratman et al., 2015, PNAS", url: "https://doi.org/10.1073/pnas.1510459112" }
  ],
  insomnia: [
    { tip: "«Температурный минимум»: тело засыпает при снижении внутренней температуры — прохладная спальня и тёплый душ за 1–2 ч до сна помогают заснуть.",
      level: "strong", source: "Thermoregulation & sleep onset (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=core+body+temperature+sleep+onset" },
    { tip: "Утренний дневной свет в глаза (без солнцезащитных очков, безопасно) стабилизирует циркадные часы лучше вечерних ограничений.",
      level: "emerging", source: "Light & circadian entrainment (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=morning+light+exposure+circadian+sleep" }
  ],
  focus: [
    { tip: "Короткий блок физнагрузки перед работой поднимает дофамин и норадреналин и улучшает удержание внимания на 1–2 часа.",
      level: "emerging", source: "Acute exercise & executive function (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=acute+exercise+executive+function+attention" },
    { tip: "Взгляд на одну точку 30–60 сек перед задачей («визуальная фокусировка») повышает когнитивную концентрацию — внимание следует за взглядом.",
      level: "preliminary", source: "Visual attention & focus (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=gaze+fixation+cognitive+focus" }
  ],
  fatigue: [
    { tip: "Креатин 5 г/день заметно смягчает когнитивную усталость при недосыпе (разовая доза улучшала мышление в РКИ 2024).",
      level: "emerging", source: "Gordji-Nejad et al., 2024, Scientific Reports", url: "https://doi.org/10.1038/s41598-024-54249-9" },
    { tip: "Короткий сон 10–20 мин («power nap») снижает аденозин без инерции глубокой фазы; кофе прямо перед ним усиливает эффект пробуждения.",
      level: "strong", source: "Nap & alertness (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=short+nap+alertness+adenosine" }
  ],
  craving: [
    { tip: "«Сёрфинг желания» (urge surfing): наблюдать волну тяги как ощущение, не действуя, — пик спадает за 15–20 мин; снижает срывы.",
      level: "emerging", source: "Urge surfing / mindfulness (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=urge+surfing+craving+mindfulness" },
    { tip: "Дизайн среды сильнее силы воли: убрать триггер из поля зрения эффективнее, чем «терпеть».",
      level: "strong", source: "Choice architecture & habits (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=environment+cue+habit+self-control" }
  ],
  anger: [
    { tip: "Правило 90 секунд: острая нейрохимическая волна гнева физиологически спадает примерно за полторы минуты — не решайте и не пишите на пике.",
      level: "emerging", source: "Affect dynamics (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=anger+physiological+arousal+time+course" },
    { tip: "Назвать эмоцию словами снижает активность амигдалы и возвращает контроль префронтальной коре.",
      level: "strong", source: "Lieberman et al., 2007, Psychological Science", url: "https://doi.org/10.1111/j.1467-9280.2007.01916.x" }
  ],
  loneliness: [
    { tip: "Даже короткие «слабые связи» (перекинуться словом с бариста, соседом) измеримо поднимают настроение и чувство принадлежности.",
      level: "emerging", source: "Sandstrom & Dunn, 2014, PSPB", url: "https://doi.org/10.1177/0146167214529799" },
    { tip: "Качество социальных связей — один из сильнейших предикторов здоровья и долголетия, сопоставимый с отказом от курения.",
      level: "strong", source: "Holt-Lunstad et al., 2010, PLoS Medicine", url: "https://doi.org/10.1371/journal.pmed.1000316" }
  ],
  fear: [
    { tip: "Постепенная безопасная экспозиция перестраивает реакцию амигдалы через «обучение торможению» — основа доказательной терапии страхов.",
      level: "strong", source: "Craske et al., 2014, Behaviour Research and Therapy", url: "https://doi.org/10.1016/j.brat.2014.04.006" },
    { tip: "Блокатор адреналина (пропранолол) во время «переписывания» воспоминания ослаблял выученный страх — активно изучаемый метод реконсолидации.",
      level: "emerging", source: "Kindt et al., 2009, Nature Neuroscience", url: "https://doi.org/10.1038/nn.2271" }
  ],
  sadness: [
    { tip: "Поведенческая активация (маленькие приятные действия по плану, а не по настроению) сдвигает настроение и по эффекту близка к КПТ.",
      level: "strong", source: "Ekers et al., 2014, PLoS ONE", url: "https://pubmed.ncbi.nlm.nih.gov/24936656/" },
    { tip: "Плач активирует парасимпатическую систему и часто приносит облегчение; подавление эмоций, наоборот, усиливает физиологический стресс.",
      level: "emerging", source: "Gračanin et al., 2014, Frontiers in Psychology", url: "https://pubmed.ncbi.nlm.nih.gov/24904511/" }
  ],
  brainfog: [
    { tip: "Одна аэробная тренировка (20–30 мин) быстро улучшает исполнительные функции и ясность мышления — острый эффект, а не только накопительный.",
      level: "strong", source: "Chang et al., 2012, Brain Research (мета-анализ)", url: "https://doi.org/10.1016/j.brainres.2012.02.068" },
    { tip: "Глубокий сон «промывает» мозг через глимфатическую систему; недосып — частая причина «тумана» и медленного мышления.",
      level: "strong", source: "Xie et al., 2013, Science", url: "https://doi.org/10.1126/science.1241224" }
  ],
  avoidance: [
    { tip: "«Если–то» планы (implementation intentions) резко повышают шанс начать избегаемое: заранее заданный триггер обходит сопротивление.",
      level: "strong", source: "Gollwitzer & Sheeran, 2006, Adv. Exp. Soc. Psychology", url: "https://doi.org/10.1016/S0065-2601(06)38002-1" },
    { tip: "Приблизиться к избегаемому маленьким шагом, а не убегать: экспозиция разрывает петлю «избегание → облегчение → усиление страха».",
      level: "emerging", source: "Craske et al., 2014, Behaviour Research and Therapy", url: "https://doi.org/10.1016/j.brat.2014.04.006" }
  ],
  joy: [
    { tip: "«Смакование» приятного момента и практика благодарности измеримо повышают благополучие в РКИ на месяцы вперёд.",
      level: "strong", source: "Seligman et al., 2005, American Psychologist", url: "https://doi.org/10.1037/0003-066X.60.5.410" },
    { tip: "Делиться хорошими новостями с близкими («capitalization») усиливает радость сильнее самого события и укрепляет связь.",
      level: "emerging", source: "Gable et al., 2004, JPSP", url: "https://pubmed.ncbi.nlm.nih.gov/15301629/" }
  ],
  love: [
    { tip: "Романтическое влечение зажигает дофаминовую систему вознаграждения (VTA) — по фМРТ это мотивационное «хочу», а не просто эмоция.",
      level: "strong", source: "Aron et al., 2005, Journal of Neurophysiology", url: "https://doi.org/10.1152/jn.00838.2004" },
    { tip: "Совместные новые и слегка волнующие впечатления поддерживают дофаминовую «искру» в долгих отношениях.",
      level: "emerging", source: "Aron et al., 2000, JPSP", url: "https://pubmed.ncbi.nlm.nih.gov/10707330/" }
  ],
  shame: [
    { tip: "Самосострадание (относиться к себе как к другу) снижает самокритику и физиологический стресс — доказанный буфер против стыда.",
      level: "strong", source: "MacBeth & Gumley, 2012, Clinical Psychology Review", url: "https://doi.org/10.1016/j.cpr.2012.06.003" },
    { tip: "Различать «я поступил плохо» (вина — продуктивна) и «я плохой» (стыд — разрушителен) уменьшает застревание и самобичевание.",
      level: "emerging", source: "Tangney et al., 2007, Annual Review of Psychology", url: "https://doi.org/10.1146/annurev.psych.56.091103.070145" }
  ],
  disgust: [
    { tip: "Отвращение обрабатывается островковой долей; смена сенсорного контекста (свежий воздух, прохладная вода) быстро гасит вегетативную реакцию.",
      level: "emerging", source: "Calder et al., 2001, Nature Reviews Neuroscience", url: "https://doi.org/10.1038/35072584" },
    { tip: "Моральное отвращение опирается на те же зоны, что и физическое — осознание этого помогает не переносить брезгливость на суждения о людях.",
      level: "emerging", source: "Chapman et al., 2009, Science", url: "https://doi.org/10.1126/science.1165565" }
  ],
  boredom: [
    { tip: "Короткая скука перед задачей запускает сеть пассивного режима и повышает креативность — не спешите гасить её экраном.",
      level: "emerging", source: "Mann & Cadman, 2014, Creativity Research Journal", url: "https://doi.org/10.1080/10400419.2014.901073" },
    { tip: "Постоянная стимуляция быстрыми наградами поднимает порог скуки; периодически полезно намеренно «поскучать» без телефона.",
      level: "preliminary", source: "Обзор: скука и цифровая стимуляция (PubMed)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=boredom+smartphone+attention" }
  ],
  overwhelm_emotion: [
    { tip: "Сначала снизить физиологию «физиологическим вздохом» (двойной вдох + долгий выдох) — самый быстрый способ сбросить острое возбуждение.",
      level: "strong", source: "Balban et al., 2023, Cell Reports Medicine", url: "https://doi.org/10.1016/j.xcrm.2022.100895" },
    { tip: "Затем назвать чувство одним словом: вербализация переносит активность из амигдалы в префронтальную кору (данные фМРТ).",
      level: "strong", source: "Lieberman et al., 2007, Psychological Science", url: "https://doi.org/10.1111/j.1467-9280.2007.01916.x" }
  ],
  excitement: [
    { tip: "Переосмыслить мандраж как «я в предвкушении» (а не «я боюсь») улучшает результат — телесно эти состояния почти совпадают, решает трактовка.",
      level: "strong", source: "Brooks, 2014, J. Experimental Psychology: General", url: "https://doi.org/10.1037/a0035325" },
    { tip: "Предвкушение награды — работа дофамина и часто ярче самого результата (кодирование «ошибки предсказания»).",
      level: "strong", source: "Schultz, 2016, Nature Reviews Neuroscience", url: "https://doi.org/10.1038/nrn.2015.26" }
  ],
  pain: [
    { tip: "Отвлечение внимания измеримо снижает боль: по фМРТ уменьшается её обработка, частично через собственную опиоидную систему.",
      level: "strong", source: "Sprenger et al., 2012, Current Biology", url: "https://doi.org/10.1016/j.cub.2012.03.001" },
    { tip: "Ожидание и смысл сильно модулируют боль — эффект плацебо реально меняет активность болевых зон мозга.",
      level: "strong", source: "Wager et al., 2004, Science", url: "https://doi.org/10.1126/science.1093065" }
  ],
  nostalgia: [
    { tip: "Ностальгия повышает ощущение смысла и социальной связанности и снижает тревогу одиночества — это ресурс, а не «застревание в прошлом».",
      level: "strong", source: "Sedikides & Wildschut, 2016, Current Directions in Psych. Science", url: "https://doi.org/10.1177/0963721416638540" },
    { tip: "Ностальгические воспоминания даже «согревают» физически — участники ощущали больше тепла: связь эмоции и терморегуляции.",
      level: "emerging", source: "Zhou et al., 2012, Emotion", url: "https://pubmed.ncbi.nlm.nih.gov/22309727/" }
  ],
  confusion: [
    { tip: "Экспрессивное письмо (выписать мысли и чувства на бумагу 10–15 минут) улучшает ясность и разгружает рабочую память — доказанный эффект.",
      level: "strong", source: "Frattaroli, 2006, Psychological Bulletin (мета-анализ)", url: "https://doi.org/10.1037/0033-2909.132.6.823" },
    { tip: "Фокус на телесных ощущениях (интероцепция) помогает точнее распознать эмоцию и лучше её регулировать.",
      level: "emerging", source: "Füstös et al., 2013, SCAN", url: "https://doi.org/10.1093/scan/nss089" }
  ]
};

/* ---------- Анализ образа жизни ---------- */
/* Ключевые слова → фактор, влияние на мозг, что делать */
const LIFESTYLE = {
  poor_sleep: {
    label: "Недосып", emoji: "🌙",
    keywords: ["мало спал","не выспал","недосып","плохо спал","не спала","мало спала","поздно лег","поздно легла","2 часа сна","3 часа сна"],
    effect: "Недосып ослабляет префронтальную кору и усиливает реактивность амигдалы — отсюда раздражительность, тревога и «туман».",
    tips: ["Сегодня — приоритет на ранний отбой и утренний свет.", "Короткий сон 10–20 мин днём частично компенсирует."]
  },
  overeating: {
    label: "Переедание / тяжёлая еда", emoji: "🍔",
    keywords: ["много ел","много ела","переел","переела","объел","наелся","наелась","тяжёлая еда","фастфуд","много сладк","обжор"],
    effect: "После обильной и сладкой еды скачок и спад глюкозы вызывают сонливость и вялость (постпрандиальная гипо-бодрость), падает концентрация.",
    tips: ["Короткая прогулка 10–15 мин после еды сглаживает скачок глюкозы и возвращает бодрость.", "Белок и клетчатка вместо быстрых углеводов стабилизируют энергию."]
  },
  low_social: {
    label: "Мало общения", emoji: "🕸",
    keywords: ["мало общал","мало общала","ни с кем не","одна весь день","один весь день","не выходил","не выходила","изолир","никого не видел","никого не видела"],
    effect: "Дефицит социального контакта повышает кортизол и активирует «болевой» контур одиночества (передняя поясная кора, инсула), снижая тонус.",
    tips: ["Даже короткий тёплый контакт или звонок поднимает настроение и окситоцин.", "«Слабые связи» тоже считаются — перекинуться парой слов уже помогает."]
  },
  no_exercise: {
    label: "Мало движения", emoji: "🪑",
    keywords: ["весь день сидел","весь день сидела","не двигал","не двигала","не занимался спортом","не занималась спортом","лежал весь день","лежала весь день","без движения"],
    effect: "Гиподинамия снижает дофамин, BDNF и мозговой кровоток — падает мотивация и ясность мышления.",
    tips: ["Даже 10–20 мин быстрой ходьбы поднимают дофамин и BDNF.", "Правило «двигаться каждый час» разгоняет застой."]
  },
  caffeine: {
    label: "Кофеин", emoji: "☕",
    keywords: ["много кофе","кофе весь день","энергетик","много энергетик","перепил кофе"],
    effect: "Избыток кофеина усиливает норадреналиновую систему (голубое пятно): дрожь, тревога, а вечером — испорченный сон.",
    tips: ["Кофеин выводится 6–8 часов — уберите его после обеда.", "L-теанин смягчает «дёрганность» кофеина."]
  },
  alcohol: {
    label: "Алкоголь", emoji: "🍷",
    keywords: ["выпил вчера","выпила вчера","похмель","бухал","бухала","алкоголь вчера"],
    effect: "Алкоголь разрушает архитектуру сна (меньше REM) и на следующий день снижает серотонин — отсюда тревога и подавленность «на трезвую».",
    tips: ["Гидратация и свет утром смягчают откат.", "Дать организму день-два без алкоголя для восстановления сна."]
  },
  screen: {
    label: "Много экрана / соцсети", emoji: "📱",
    keywords: ["весь день в телефон","залипал в телефон","залипала в телефон","много соцсет","скроллил","скроллила","много сериал"],
    effect: "Поток быстрых наград перегружает дофаминовую систему и повышает её «планку» — обычные дела начинают казаться скучными.",
    tips: ["«Дофаминовая пауза» на пару часов возвращает чувствительность.", "Экран вне спальни улучшает и сон, и утреннюю мотивацию."]
  },
  dehydration: {
    label: "Обезвоживание", emoji: "💧",
    keywords: ["забыл пить","забыла пить","мало пил воды","мало пила воды","почти не пил","почти не пила","обезвож","весь день без воды","не пил воду","голова тяжёлая от жажды"],
    effect: "Даже лёгкое обезвоживание (потеря 1–2% воды) снижает концентрацию и настроение и вызывает головную боль — мозгу физически труднее работать без достаточной жидкости.",
    tips: ["Выпейте стакан воды сейчас и далее пейте небольшими порциями в течение дня.", "Кофе и алкоголь усиливают потерю жидкости — компенсируйте их водой."]
  },
  pms: {
    label: "Гормональный цикл / ПМС", emoji: "🌗",
    keywords: ["перед месячными","пмс","предменструальн","гормоны шалят","цикл влияет","перед циклом на нервах","месячные скоро и настроение","лютеиновая фаза"],
    effect: "В лютеиновой фазе цикла падение эстрогена и прогестерона снижает серотонин и ГАМК — отсюда раздражительность, тревожность и упадок сил. Это гормональная волна, а не «характер».",
    tips: ["Будьте мягче к себе и планируйте с запасом — в эти дни нормально мочь меньше.", "Движение, дневной свет, магний и стабильный сон заметно смягчают симптомы ПМС."]
  },
  sickness: {
    label: "Болезнь / воспаление", emoji: "🤒",
    keywords: ["заболеваю","простыл","простыла","температура","болею","приболел","приболела","всё тело ломит","воспаление","орви","простуда"],
    effect: "При инфекции иммунные сигналы (цитокины) действуют на мозг и включают «болезненное поведение»: апатию, раздражительность, туман и желание залечь. Это эволюционный режим восстановления, а не слабость.",
    tips: ["Разрешите себе отдых — упадок настроения при болезни нормален и временен.", "Сон, тепло и жидкость сейчас важнее продуктивности."]
  },
  stuffy: {
    label: "Духота / мало воздуха", emoji: "🪟",
    keywords: ["душно","в душной комнате","не проветрен","спёртый воздух","мало воздуха","от духоты туплю","голова от духоты","накурено","нечем дышать в комнате"],
    effect: "В непроветренном помещении растёт уровень CO₂ — это заметно снижает ясность мышления и внимание, вызывает сонливость и тяжесть в голове.",
    tips: ["Проветрите 5–10 минут — самый быстрый способ вернуть ясность.", "Прохлада и свежий воздух бодрят сильнее, чем кажется."]
  }
};

/* ---------- Научно изучаемые добавки ---------- */
const SUPPLEMENTS = [
  { name: "Омега-3 (EPA/DHA)", for: "настроение, воспаление, мембраны нейронов", level: "emerging",
    note: "Доля EPA >60% связана с антидепрессивным эффектом как дополнение.",
    source: "Liao et al., 2019, Translational Psychiatry", url: "https://doi.org/10.1038/s41398-019-0515-5" },
  { name: "Креатин моногидрат 3–5 г", for: "умственная усталость, энергия мозга, недосып", level: "emerging",
    note: "Поддерживает энергетический обмен мозга; заметнее при дефиците сна.",
    source: "Gordji-Nejad et al., 2024, Scientific Reports", url: "https://doi.org/10.1038/s41598-024-54249-9" },
  { name: "Магний (глицинат / L-треонат)", for: "тревога, сон, расслабление", level: "emerging",
    note: "Дефицит магния связан с тревожностью; формы глицината/треоната лучше усваиваются.",
    source: "Boyle et al., 2017, Nutrients (review)", url: "https://doi.org/10.3390/nu9050429" },
  { name: "Витамин D3", for: "настроение, особенно при дефиците и зимой", level: "emerging",
    note: "Коррекция дефицита связана с улучшением настроения; проверьте уровень 25(OH)D.",
    source: "Vitamin D & depression (обзор)", url: "https://pubmed.ncbi.nlm.nih.gov/?term=vitamin+D+depression+meta-analysis" },
  { name: "L-теанин (+ кофеин)", for: "спокойная концентрация без «дёрганности»", level: "emerging",
    note: "Связка L-теанин+кофеин улучшает внимание и снижает тревожность кофеина.",
    source: "Owen et al., 2008, Nutritional Neuroscience", url: "https://doi.org/10.1179/147683008X301513" },
  { name: "Родиола розовая", for: "умственная усталость, стресс", level: "preliminary",
    note: "Адаптоген; данные обнадёживают, но качество исследований разнится.",
    source: "Ishaque et al., 2012, BMC Complement Altern Med", url: "https://doi.org/10.1186/1472-6882-12-70" }
];

/* Какие добавки предлагать при каком образе жизни/состоянии */
const SUPP_HINTS = {
  poor_sleep: ["Магний (глицинат / L-треонат)", "Креатин моногидрат 3–5 г"],
  overeating: ["Омега-3 (EPA/DHA)"],
  low_social: ["Витамин D3", "Омега-3 (EPA/DHA)"],
  no_exercise: ["Креатин моногидрат 3–5 г"],
  caffeine: ["L-теанин (+ кофеин)", "Магний (глицинат / L-треонат)"],
  alcohol: ["Омега-3 (EPA/DHA)", "Магний (глицинат / L-треонат)"],
  screen: ["Магний (глицинат / L-треонат)"]
};

/* ---------- Триггеры для таймлайна причин ---------- */
const TRIGGERS = [
  { id: "sleep_good", label: "Выспался", emoji: "😴", kind: "good" },
  { id: "sleep_bad", label: "Недосып", emoji: "🌙", kind: "bad" },
  { id: "exercise", label: "Спорт", emoji: "🏃", kind: "good" },
  { id: "sunlight", label: "Был на солнце", emoji: "☀️", kind: "good" },
  { id: "social", label: "Общение", emoji: "🫂", kind: "good" },
  { id: "coffee", label: "Много кофе", emoji: "☕", kind: "bad" },
  { id: "alcohol", label: "Алкоголь", emoji: "🍷", kind: "bad" },
  { id: "junk", label: "Тяжёлая еда", emoji: "🍔", kind: "bad" },
  { id: "screen", label: "Много экрана", emoji: "📱", kind: "bad" },
  { id: "work_stress", label: "Аврал/работа", emoji: "💼", kind: "bad" }
];

/* ---------- Эмоциональный «знак» состояния (для графика настроения) ---------- */
/* +2 хорошо … -2 тяжело */
const VALENCE = {
  joy: 2, love: 2, excitement: 1, nostalgia: 1, focus: 1,
  boredom: 0, confusion: 0, pain: -1, disgust: -1, nostalgia_dup: 0,
  anxiety: -2, panic: -2, fear: -2, stress: -1, depression: -2, apathy: -1,
  laziness: 0, anger: -1, sadness: -1, rumination: -1, insomnia: -1,
  fatigue: -1, craving: -1, shame: -1, loneliness: -2, overwhelm_emotion: -2,
  brainfog: -1, avoidance: -1
};

/* ---------- Факты для мини-курса ---------- */
const FACTS = {
  pfc: "Префронтальная кора созревает последней — примерно к 25 годам; поэтому подросткам труднее тормозить импульсы.",
  amygdala: "Амигдала реагирует на угрозу за ~12 миллисекунд — быстрее, чем вы осознаёте, что происходит.",
  hippocampus: "Гиппокамп — одна из немногих зон, где рождаются новые нейроны и во взрослом возрасте (нейрогенез).",
  hypothalamus: "Размером с миндалину, гипоталамус управляет гормонами всего тела через ось HPA.",
  thalamus: "Почти вся сенсорика (кроме запаха) проходит через таламус — это «коммутатор» мозга.",
  insula: "Инсула позволяет чувствовать биение своего сердца — основа интуиции о состоянии тела.",
  accumbens: "Прилежащее ядро загорается сильнее в предвкушении награды, чем при её получении.",
  vta: "Дофамин VTA кодирует не удовольствие, а «ошибку предсказания» — насколько награда лучше ожиданий.",
  striatum: "Полосатое тело превращает повторяемые действия в автоматические привычки.",
  ofc: "Орбитофронтальная кора присваивает вещам субъективную ценность — она решает, что «того стоит».",
  cerebellum: "Мозжечок — 10% объёма мозга, но в нём больше половины всех нейронов.",
  brainstem: "Ствол мозга работает без перерыва всю жизнь, управляя дыханием и сердцем во сне.",
  locus: "Голубое пятно — крошечное ядро, но единственный источник норадреналина для всей коры.",
  raphe: "На серотониновую систему ядер шва действуют самые распространённые антидепрессанты (СИОЗС).",
  motor: "В моторной коре руки и губы занимают непропорционально большую область — «гомункулус».",
  sensory: "Соматосенсорная карта тела искажена: губы и пальцы «крупнее» спины по числу рецепторов.",
  visual: "Треть коры так или иначе занята обработкой зрения — это доминирующее чувство человека.",
  acc: "Передняя поясная кора переживает социальную боль отвержения теми же зонами, что и физическую.",
  dmn: "Сеть пассивного режима включается, когда вы «ничего не делаете» — и гоняет мысли о себе."
};

/* ---------- Мультиязычность: UI ---------- */
const I18N = {
  ru: {
    tagline: "Что чувствует ваш мозг — и почему",
    tab_analyze: "Анализ", tab_explore: "Исследовать", tab_library: "Библиотека",
    tab_course: "Курс", tab_quiz: "Викторина", tab_history: "Дневник",
    tab_brain: "Мозг", tab_programs: "Программы", tab_updates: "Открытия", install: "⤓ Установить",
    mode_schema: "🗺 Схема", mode_journey: "🧭 Погружение", mode_atlas: "🧠 Атлас",
    mode_quiz: "🎯 Викторина", mode_updates: "💡 Новое",
    quiz_title: "Викторина: угадай зону мозга", quiz_sub: "Проверьте, что запомнили. За правильные ответы — очки.",
    quiz_restart: "Начать заново",
    updates_title: "💡 Открытия о мозге", updates_sub: "Свежие находки нейронауки с метками достоверности; неподтверждённое честно помечается.",
    schema_title: "Карта мозга — нажми и узнай",
    schema_sub: "Нажмите структуру на схеме головы — сразу простыми словами, за что она отвечает, с ассоциацией для запоминания.",
    journey_title: "Путешествие по мозгу — слой за слоем",
    journey_sub: "Начнём с поверхности (доли мозга), а затем спустимся глубже — к эмоциям, мотивации и нейромедиаторам.",
    atlas_title: "Атлас структур мозга", atlas_sub: "Нажмите структуру в списке или прямо на 3D-модели.",
    programs_title: "Программы перепрограммирования мозга",
    programs_sub: "Пошаговые практики с трекером: дофаминовое голодание, борьба со скукой, восстановление мотивации. Медленно и по науке.",
    view_label: "Ракурс:", rotate_hint: "🖱 потяните, чтобы вращать",
    ask: "Что вы сейчас чувствуете или испытываете?",
    placeholder: "Например: мало спала, много ела и чувствую себя вялой…",
    analyze_btn: "Показать, что в мозге →",
    lifestyle_title: "Образ жизни сегодня",
    supp_title: "Научно изучаемые добавки",
    supp_disclaimer: "Не назначение. Добавки обсуждайте с врачом; эффект индивидуален.",
    research_title: "Свежие и нестандартные техники",
    triggers_title: "Что было сегодня (причины)",
    charts_title: "Динамика",
    export_csv: "Экспорт CSV", export_pdf: "PDF / печать",
    backup: "Резервная копия", restore: "Восстановить",
    share: "Поделиться", clear: "Очистить"
  },
  en: {
    tagline: "What your brain feels — and why",
    tab_analyze: "Analyze", tab_explore: "Explore", tab_library: "Library",
    tab_course: "Course", tab_quiz: "Quiz", tab_history: "Diary",
    tab_brain: "Brain", tab_programs: "Programs", tab_updates: "Discoveries", install: "⤓ Install",
    mode_schema: "🗺 Map", mode_journey: "🧭 Deep dive", mode_atlas: "🧠 Atlas",
    mode_quiz: "🎯 Quiz", mode_updates: "💡 New",
    quiz_title: "Quiz: guess the brain region", quiz_sub: "Test what you remember. Points for correct answers.",
    quiz_restart: "Restart",
    updates_title: "💡 Brain discoveries", updates_sub: "Fresh neuroscience findings with confidence labels; unverified is flagged honestly.",
    schema_title: "Brain map — tap to learn",
    schema_sub: "Tap a structure on the head diagram — get a plain-language function with an easy mnemonic.",
    journey_title: "Journey through the brain — layer by layer",
    journey_sub: "Start at the surface (lobes), then go deeper — to emotions, motivation and neurotransmitters.",
    atlas_title: "Atlas of brain structures", atlas_sub: "Tap a structure in the list or on the 3D model.",
    programs_title: "Brain rewiring programs",
    programs_sub: "Step-by-step practices with a tracker: dopamine reset, beating boredom, rebuilding motivation. Slow and science-based.",
    view_label: "View:", rotate_hint: "🖱 drag to rotate",
    ask: "What are you feeling right now?",
    placeholder: "E.g.: slept little, ate a lot and feel sluggish…",
    analyze_btn: "Show what's in the brain →",
    lifestyle_title: "Lifestyle today",
    supp_title: "Research-backed supplements",
    supp_disclaimer: "Not medical advice. Discuss supplements with a doctor; effects vary.",
    research_title: "Fresh & unconventional techniques",
    triggers_title: "What happened today (causes)",
    charts_title: "Trends",
    export_csv: "Export CSV", export_pdf: "PDF / print",
    backup: "Backup", restore: "Restore",
    share: "Share", clear: "Clear"
  }
};

/* Названия структур (EN) для мультиязычности */
const REGION_EN = {
  pfc: "Prefrontal cortex", ofc: "Orbitofrontal cortex", motor: "Motor cortex",
  sensory: "Somatosensory cortex", visual: "Visual cortex", acc: "Anterior cingulate cortex",
  dmn: "Default mode network", insula: "Insula", striatum: "Striatum",
  accumbens: "Nucleus accumbens", thalamus: "Thalamus", hypothalamus: "Hypothalamus",
  amygdala: "Amygdala", hippocampus: "Hippocampus", vta: "Ventral tegmental area",
  locus: "Locus coeruleus", raphe: "Raphe nuclei", cerebellum: "Cerebellum", brainstem: "Brainstem",
  corpus_callosum: "Corpus callosum", caudate: "Caudate nucleus", putamen: "Putamen",
  pons: "Pons", medulla: "Medulla oblongata", pituitary: "Pituitary gland", pineal: "Pineal gland"
};
const STATE_EN = {
  anxiety: "Anxiety", panic: "Panic attack", fear: "Fear", stress: "Stress / overload",
  depression: "Low / depressed mood", apathy: "Apathy / no motivation", laziness: "Laziness / procrastination",
  anger: "Anger / irritation", sadness: "Sadness", rumination: "Rumination", insomnia: "Insomnia",
  fatigue: "Fatigue", focus: "Can't focus", joy: "Joy", love: "Love / infatuation",
  craving: "Craving / addiction", shame: "Shame / guilt", disgust: "Disgust", loneliness: "Loneliness",
  boredom: "Boredom", overwhelm_emotion: "Emotional overwhelm", excitement: "Excitement",
  pain: "Physical pain", nostalgia: "Nostalgia", confusion: "Confusion",
  brainfog: "Brain fog", avoidance: "Task avoidance / dread"
};
