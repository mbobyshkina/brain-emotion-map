/* ============================================================
   Полный английский контент + переключение языка контента.
   Подход «оверлей»: при выборе EN подменяем поля данных на
   английские (RU-снимок хранится для возврата). Отсутствующие
   переводы падают обратно на русский — ничего не ломается.
   Также подмешиваем английские ключевые слова, чтобы работал
   ввод и примеры на английском.
   ============================================================ */
const EN = {

  ui_en: {
    tagline: "What your brain feels — and why",
    view_side: "Side", view_front: "Front", view_top: "Top",
    hint_default: "3D brain model — drag to rotate. Describe a state and the active regions light up.",
    hint_analyze_done: "🔴 key region · 🟡 secondary · flying dots — neurotransmitters. Drag to rotate.",
    lib_summary: "📚 All states I understand — tap to browse",
    lib_search: "Search a state…",
    analyze_empty: "Describe a state or your lifestyle (“slept little”, “too much coffee”, “didn't talk to anyone”) — the app shows what's happening in the brain and gives fresh science-based tips.",
    results_empty_title: "",
    score: "Score: ",
    uf_all: "All", uf_verified: "✅ verified", uf_emerging: "🧪 emerging", uf_unverified: "❓ unverified",
    upd_refresh: "↻ Refresh",
    explore_empty: "Pick a brain structure to read about it.",
    backup_note: "Entries are stored only in this browser. “Backup” is an encrypted file to move them to another device.",
    chart_mood: "Mood over 2 weeks", chart_weekday: "Entries by weekday", chart_trig: "Triggers vs mood",
    disclaimer_strong: "This is an educational tool",
    disclaimer_rest: ", not a diagnosis. The app shows simplified neurobiology of states and does not replace a doctor or therapist. Supplement tips are not a prescription; discuss them with a doctor. If a state is severe, lasting, or there are thoughts of self-harm — seek professional help.",
    install_head: "Install the app",
    mixed_note: "Mixed state: several brain systems are active — shown together on the model.",
    accompany_title: "Accompanying states",
    also_possible: "also possible", primary_state: "main",
    sec_structures: "Structures involved", sec_mechanism: "What's happening in the brain",
    sec_advice: "How to get out of it — by science", sec_conflict: "Tug-of-war in the brain",
    sec_after: "After applying the tip", after_btn: "▶ Show the tip's effect", after_back: "← Back to original",
    related_states: "Related states", lifestyle_title: "Lifestyle factors today",
    supp_title: "Science-studied supplements (not a prescription)",
    research_title: "Fresh / non-standard techniques (with research)",
    conflict_vs: "vs",
    chem_title: "Neurochemistry:", supp_for: "for: ", conflict_word: "⚡ tug-of-war ⚡",
    hint_after: "🟢 green — how the brain changes after applying the tip.",
    hint_programs: "Programs: step-by-step practices with a tracker.",
    not_recognized: "Couldn't recognize this. Try rephrasing — e.g.: “anxious”, “no energy”, “angry”, “can't sleep”, “slept little”, “too much coffee”.",
    history_empty: "Your entries and trend charts will appear here. Describe a state on the Analyze tab.",
    patterns_title: "🔎 Patterns", related_states: "Related states",
    loading_findings: "Loading findings…", source_word: "source", no_findings: "No findings in this category.",
    quiz_clue: "Which structure is responsible for this?", quiz_correct: "✅ Correct!", quiz_wrong_pre: "❌ Correct answer:",
    quiz_next: "Next question →",
    my_state: "My state", active_zones: "Active brain regions:", edu_footer: "Educational tool · not a diagnosis",
    csv_date: "Date", csv_text: "Text", csv_states: "States", csv_zones: "Regions", csv_triggers: "Triggers", csv_mood: "Mood",
    diary_title: "Diary — Brain Emotion Map", diary_h1: "🧠 Brain Emotion Map — states diary",
    backup_new: "Create a password for the backup (remember it — the file can't be opened without it):",
    backup_open: "Enter the backup password:",
    restore_done: "Done: restored ", restore_entries: " entries.", restore_fail: "Couldn't decrypt — check the password and file.",
    nt_boost: "⬆️ Boost: ", layers_open: "Layers unlocked: ", badge_passed: "✓ passed",
    badge_locked: "🔒 unlock the previous", studied: " studied", retest: "Take the test again",
    take_test: "Take the mini-test and unlock the next layer →", unlock_hint: "Open all the layer's cards to unlock the mini-test.",
    test_great: "🎉 Great!", test_almost: "🙂 Almost!", correct_prefix: "Correct: ", of_word: " of ",
    next_open: "The next layer is unlocked.", need_more: "A bit more needed — try again.",
    again: "Again", to_next: "To the next layer ↓", q_word: "Question ", who_for: "Who is responsible for this?",
    hint_schema: "Pick an emotion — the regions behind it light up on the 3D model.",
    hint_journey: "Deep dive: open the cards — structures light up on the model.",
    hint_atlas: "Atlas: tap a structure in the list or on the 3D model.",
    hint_quiz: "Quiz: guess the brain region from the description.",
    hint_updates: "Fresh discoveries: tap a finding and the related region lights up.",
    prog_open: "Open →", prog_back: "← All programs", prog_why: "Why it works:",
    streak_label: "🔥 Streak: ", streak_marked: "✓ Marked today", streak_mark: "Mark today",
    show_region: "🧠 Show the region on the model", day_one: "day", day_many: "days"
  },

  regions: {
    pfc: { system: "Cerebral cortex", short: "The “conductor”: planning, self-control, impulse inhibition, working memory.", detail: "The dorsolateral and ventromedial prefrontal cortex handle executive functions — goals, impulse control, inhibiting the limbic system. Under stress and sleep deprivation its activity drops and older structures take the wheel." },
    acc: { system: "Limbic system / cortex", short: "Conflict and error detector, links emotion and attention, feels pain.", detail: "The anterior cingulate cortex tracks mismatch between expectation and reality, is involved in social and physical pain, and regulates effort and motivation." },
    amygdala: { system: "Limbic system", short: "Threat and salience detector; triggers fear, anxiety and fight-or-flight.", detail: "The amygdala instantly appraises stimuli for danger and launches an autonomic and hormonal response before you're aware of it. Overactive in anxiety, phobias and PTSD." },
    hippocampus: { system: "Limbic system", short: "Memory formation, context, navigation; brakes the stress axis.", detail: "The hippocampus binds events to context and time and turns short-term into long-term memory. Sensitive to cortisol: chronic stress shrinks it, harming memory and mood." },
    hypothalamus: { system: "Diencephalon", short: "Hormonal HQ: stress (HPA axis), hunger, thirst, sleep, temperature, libido.", detail: "Through the hypothalamus–pituitary–adrenal (HPA) axis it triggers cortisol release. Regulates circadian rhythms, appetite, temperature and sexual behavior." },
    thalamus: { system: "Diencephalon", short: "Main relay: filters and routes sensory signals to the cortex.", detail: "Nearly all sensory information (except smell) passes through the thalamus, which routes it to the right cortical areas and helps regulate sleep and wakefulness." },
    insula: { system: "Cortex", short: "Interoception — sensing the body from within, disgust, empathy, emotional awareness.", detail: "The insula reads the body's internal state (heartbeat, breathing, gut) and turns it into felt emotion. A key hub for disgust, anxiety and bodily emotion." },
    accumbens: { system: "Reward system", short: "Pleasure and motivation center; “wanting” and anticipation of reward.", detail: "The core of the ventral striatum, a key node of the dopamine reward system. Drives anticipation and motivation; overstimulation by fast rewards underlies addictions." },
    vta: { system: "Reward system", short: "Dopamine source: motivation, reward learning, the “fuel” of desire.", detail: "Dopamine neurons of the VTA project to the nucleus accumbens and prefrontal cortex, encoding reward-prediction error — the basis of motivation and learning." },
    striatum: { system: "Basal ganglia", short: "Habits, automaticity, movement initiation, learning by doing.", detail: "The dorsal striatum forms habits and automatic behavior programs. Dopamine imbalance here is linked to procrastination, apathy and compulsions." },
    ofc: { system: "Cortex", short: "Value appraisal, decision-making, flexibility, regulating urges.", detail: "The orbitofrontal cortex assigns subjective value to options and adjusts behavior as rewards and punishments change." },
    cerebellum: { system: "Hindbrain", short: "Coordination, balance, precise movement, plus the rhythm of thought and emotion.", detail: "Beyond motor coordination the cerebellum fine-tunes cognitive and emotional processes, smoothing and automating them." },
    brainstem: { system: "Brainstem", short: "Basic life support: breathing, heartbeat, blood pressure, wakefulness.", detail: "The medulla and pons control vital autonomic functions and contain nuclei that set the overall tone of the nervous system." },
    locus: { system: "Brainstem", short: "Main noradrenaline source: vigilance, anxiety, the arousal response.", detail: "Noradrenaline neurons of the locus coeruleus raise arousal and alertness. Overactivity amplifies anxiety and disrupts sleep." },
    raphe: { system: "Brainstem", short: "Main serotonin source: mood, sleep, appetite, calm.", detail: "Serotonin neurons of the raphe nuclei modulate mood, sleep cycles, pain and impulsivity. SSRIs act on this system." },
    motor: { system: "Cortex", short: "Planning and launching voluntary body movements.", detail: "The primary motor cortex issues commands to contract muscles; premotor areas plan movement sequences." },
    sensory: { system: "Cortex", short: "Processing touch, temperature, pain and body position.", detail: "The parietal somatosensory cortex builds a body map and processes tactile and pain signals." },
    visual: { system: "Cortex", short: "Processing visual information.", detail: "The occipital visual cortex analyzes shape, motion and color, forming a visual image of the world." },
    dmn: { system: "Distributed network", short: "“Mind-wandering”: thoughts about self, past and future; rumination.", detail: "The default mode network (medial prefrontal cortex, posterior cingulate, precuneus) is active at rest and during self-referential thought. Overactivity is linked to rumination and depressive thinking." },
    corpus_callosum: { system: "Commissures", short: "Bridge between hemispheres: passes signals left↔right.", detail: "The largest bundle of nerve fibers (~200 million axons) connecting the left and right hemispheres and enabling their coordinated work." },
    caudate: { system: "Basal ganglia", short: "Part of the striatum: habits, goals, reinforcement learning.", detail: "The caudate nucleus, together with the putamen, forms the striatum; involved in habit formation, goal-directed behavior and reward learning." },
    putamen: { system: "Basal ganglia", short: "Automating movement and motor habits.", detail: "The putamen is part of the striatum, key to initiating and automating movement; affected in Parkinson's disease." },
    pons: { system: "Brainstem", short: "Links cerebellum to cortex, breathing, REM sleep.", detail: "The pons connects the cerebellar hemispheres to the cortex, helps regulate breathing and triggers REM sleep with dreaming." },
    medulla: { system: "Brainstem", short: "Life autopilot: heart, breathing, blood pressure, reflexes.", detail: "The medulla oblongata controls vital autonomic functions — heartbeat, breathing, blood pressure — plus cough, swallow and vomit reflexes." },
    pituitary: { system: "Endocrine", short: "The “master gland”: on the hypothalamus's command it runs the body's hormones.", detail: "Under the hypothalamus's control, the pituitary releases hormones that conduct the thyroid, adrenals, growth and reproduction." },
    pineal: { system: "Endocrine", short: "Produces melatonin — sets the sleep–wake rhythm.", detail: "The pineal gland releases melatonin in darkness, syncing the body's internal clock with the day–night cycle." }
  },

  states: {
    anxiety: { mechanism: "The amygdala reads the situation as a threat and triggers the HPA axis (hypothalamus → cortisol) and noradrenaline from the locus coeruleus. The prefrontal cortex, which should brake this reaction, works weaker under stress — so anxiety grows.", advice: [
      "Extended exhale: inhale for 4, exhale for 8. A long exhale activates the vagus nerve and the parasympathetic system, lowering heart rate.",
      "“Physiological sigh”: two inhales through the nose in a row and a slow exhale through the mouth — the fastest way to lower arousal.",
      "Cold on the face / a splash of cool water triggers the diving reflex and slows the heart.",
      "Name 5 objects around you out loud — this returns activity to the prefrontal cortex and switches off the amygdala's autopilot." ] },
    panic: { mechanism: "A false alarm: the amygdala and insula misread body signals (heartbeat, shortness of breath) as a deadly threat and spin a fear loop through the brainstem. There is no real danger — it's a faulty alarm.", advice: [
      "Slow the exhale: breathe in a 4-4-4-4 box or lengthen the exhale. Hyperventilation feeds panic — breathe slower, not “deeper”.",
      "A strong sensory anchor: an ice cube in your hand, a sour/spicy taste — a sharp signal shifts the brain from inner panic to an outer stimulus.",
      "Say to yourself: “This is a panic attack; it will peak and fade within minutes.” Knowing the mechanics reduces secondary fear.",
      "An attack isn't life-threatening, but if it recurs often, see a doctor — anxiety disorders respond well to treatment." ] },
    fear: { mechanism: "In milliseconds the amygdala launches fight/flight/freeze through the hypothalamus and brainstem: adrenaline, faster heartbeat, blood to the muscles. The hippocampus adds context — is the threat real.", advice: [
      "Assess the reality of the threat out loud — this engages the prefrontal cortex and hippocampus, which brake the amygdala.",
      "Gradual, safe exposure to the fear physically rewires the amygdala's response — the basis of evidence-based phobia therapy.",
      "Slow breathing and grounding lower the adrenaline surge." ] },
    stress: { mechanism: "Chronic HPA-axis activation keeps cortisol high. This weakens the prefrontal cortex (worse control and decisions) and damages the hippocampus (worse memory). The brain shifts into reactivity mode.", advice: [
      "20–30 minutes of aerobic exercise burns off excess cortisol and adrenaline and raises BDNF, a neuron growth factor.",
      "Prioritizing and breaking tasks down unloads the prefrontal cortex's working memory.",
      "Full sleep restores the prefrontal cortex and lowers baseline cortisol.",
      "Time in nature and daylight are proven to reduce stress." ] },
    depression: { mechanism: "Reduced activity of the left prefrontal cortex and reward system (low dopamine/serotonin — pleasure fades), while the default mode network is overactive (rumination). Chronic stress shrinks the hippocampus.", advice: [
      "Behavioral activation: a small concrete action (a walk, a shower, a call) starts the reward system before the “mood” appears.",
      "Regular aerobic exercise rivals antidepressants in mild/moderate cases — it raises serotonin, dopamine and BDNF.",
      "Bright daylight for 10–30 minutes in the morning stabilizes circadian rhythms and the serotonin system.",
      "If it lasts more than two weeks, disrupts life, or brings thoughts of not wanting to live — see a specialist. It's treatable." ] },
    apathy: { mechanism: "Motivation is the work of the dopamine axis VTA → nucleus accumbens → prefrontal cortex. When its tone is low, “wanting” disappears: reward seems unreachable or worthless, effort pointless.", advice: [
      "Minimal-step rule: start for 2 minutes. The action itself raises dopamine, and motivation comes after the start, not before.",
      "Cut fast super-rewards (social feeds, sugar): they blunt dopamine receptors, and ordinary things stop motivating.",
      "Physical activity and sunlight raise baseline dopamine.",
      "Persistent apathy for weeks can be a sign of depression or a hormonal issue — worth checking." ] },
    laziness: { mechanism: "“Laziness” is a conflict: the prefrontal cortex wants the delayed reward, while the reward system pulls toward immediate pleasure. The anterior cingulate rates the effort as too costly, and the brain picks the easy path.", advice: [
      "Break the task into a ridiculously small step and start there — overcoming the start is the most costly part for the brain.",
      "Remove fast dopamine temptations from sight (phone in another room): you're competing with them for the same circuit.",
      "A short warm-up/walk before the task raises dopamine and eases entry into work.",
      "The “5-minute” method: agree to work just 5 minutes — usually the brain gets pulled in and keeps going." ] },
    anger: { mechanism: "The amygdala reads the situation as injustice or threat; the hypothalamus fires an adrenaline volley. The orbitofrontal and prefrontal cortex usually restrain the impulse, but their control weakens when tired and stressed.", advice: [
      "Pause for 90 seconds: the acute neurochemical wave of anger physiologically subsides in about a minute and a half — don't act at the peak.",
      "A slow exhale and relaxing the jaw/shoulders lower autonomic arousal.",
      "Name the emotion in words (“I'm angry because…”) — verbalizing engages the prefrontal cortex and dampens the amygdala.",
      "A physical discharge (brisk walk, push-ups) uses up the released adrenaline." ] },
    sadness: { mechanism: "Sadness activates the anterior cingulate and medial prefrontal cortex and involves the insula (the bodily “heaviness”). It's a normal adaptive emotion that helps process loss and draw support from others.", advice: [
      "Let the emotion be — suppression increases physiological stress. Tears reduce tension.",
      "Social support releases oxytocin and lowers activity in sadness's pain circuits.",
      "Gentle activity and daylight support the serotonin system.",
      "If sadness with no clear cause lasts for weeks and won't lift — that's a reason to seek help." ] },
    rumination: { mechanism: "The default mode network (DMN) is overactive — the brain loops on thoughts about the self and problems, while prefrontal control can't switch focus. The amygdala reinforces the thoughts with an anxious “charge”.", advice: [
      "Switching to a task that demands attention (counting, handwork, sport) physically suppresses the DMN — it goes quiet when the brain is busy with something external.",
      "Mindfulness/meditation practices are proven to reduce DMN activity with regular practice.",
      "Set a “worry window” — 15 minutes when you may think about it; outside it, postpone the thought. This trains prefrontal control.",
      "Write the thought on paper — externalizing it unloads working memory." ] },
    insomnia: { mechanism: "Sleep is run by the hypothalamus (circadian rhythms, melatonin) and the brainstem. Insomnia is fed by over-arousal: an active locus coeruleus (noradrenaline) and amygdala won't let the system “flip the switch” into sleep.", advice: [
      "Bright light right after waking, dim and screen-free in the evening: blue light suppresses melatonin.",
      "Keep the bedroom cool: falling asleep requires body temperature to drop by ~1°C.",
      "Caffeine clears in 6–8 hours — cut it after lunch.",
      "If you can't sleep for 20 minutes — get up and do something calm in dim light, so the brain doesn't link the bed with being awake." ] },
    fatigue: { mechanism: "Adenosine buildup raises “sleep pressure”, while the hypothalamus and brainstem lower the tone of wakefulness. Mental fatigue is also a depletion of prefrontal cortex resources.", advice: [
      "A short nap of 10–20 minutes lowers adenosine without deep sleep and heavy grogginess.",
      "Light, movement and water energize you more reliably than extra caffeine.",
      "Switching activity reboots a depleted prefrontal cortex better than forcing the same thing.",
      "Constant fatigue despite normal sleep is a reason to check iron, thyroid and vitamin D." ] },
    focus: { mechanism: "Sustained attention is held by the prefrontal cortex with dopamine and noradrenaline. Sleep loss, stress and constant switching (notifications) deplete this circuit, and the thalamus filters distractions worse.", advice: [
      "Remove switching sources: one screen, phone out of sight. Every switch costs minutes to get back into focus.",
      "Working in blocks (e.g. 25 minutes focus, 5 rest) matches the brain's attention rhythm.",
      "Light exercise before work raises dopamine and noradrenaline — improving concentration.",
      "Enough sleep and hydration are the baseline for the prefrontal cortex to work." ] },
    brainfog: { mechanism: "“Fog” is temporarily reduced prefrontal cortex function and worse thalamic filtering. Common causes: acute stress (cortisol muffles the prefrontal cortex), sleep loss, dehydration, inflammation, blood-sugar spikes after food. If it switches on with a specific trigger (a call, a person) — it's usually a “freeze” stress response.", advice: [
      "If a specific trigger brings the fog — take 3–5 slow exhales before reacting: this lifts the cortisol “muffler” off the prefrontal cortex.",
      "Water and movement: even 5 minutes of walking boost blood flow and attention.",
      "Check the basics: sleep, food without sharp sugar spikes, caffeine not on an empty stomach.",
      "If the fog is frequent and persistent — check sleep, iron, thyroid and stress with a doctor." ] },
    avoidance: { mechanism: "When a task is tied to an unpleasant experience, the amygdala flags it as a “threat”, and one thought of it triggers a mild stress reaction — energy and motivation drop. The prefrontal cortex avoids the discomfort by putting it off. It's a defense, not “weakness”.", advice: [
      "Separate “fear of the task” from the task itself: write down exactly what's unpleasant (scary/boring/unclear) — this moves activity from the amygdala to the cortex.",
      "Shrink the first step to 2 minutes and to extreme specifics — a tiny safe step doesn't scare the amygdala.",
      "Pair the unpleasant task with something pleasant (temptation bundling): do it with your favorite music/coffee.",
      "Praise yourself right after a small step — this retrains the task from “threat” to “safe”." ] },
    joy: { mechanism: "Pleasant events activate the dopamine reward system (VTA → nucleus accumbens) and the serotonin system, while the prefrontal cortex gives the experience meaning. This state reinforces useful behavior.", advice: [
      "Consciously savor the moment — noting the good strengthens neural links of gratitude and satisfaction.",
      "Share the joy with people close to you: social reinforcement adds oxytocin.",
      "Remember what led to the state so you can recreate it on purpose." ] },
    love: { mechanism: "Romantic attraction resembles the reward system at work: dopamine VTA → nucleus accumbens creates “obsession” with the person, the hypothalamus adds oxytocin and vasopressin (attachment), and serotonin briefly drops — hence intrusive thoughts about them.", advice: [
      "Understanding the neurochemistry helps not to confuse the dopamine “thirst” for novelty with lasting attachment — they rely on different systems.",
      "Shared new experiences strengthen the dopamine bond between partners.",
      "Physical closeness and hugs support the oxytocin attachment." ] },
    craving: { mechanism: "Fast super-rewards cause a sharp dopamine release in the nucleus accumbens. The brain compensates by lowering receptor sensitivity, so you need more and more while ordinary joys fade. Prefrontal control weakens — that's how craving forms.", advice: [
      "Ride the wave: a craving peak usually lasts 15–20 minutes and subsides. Distract yourself and “outlast” the wave without giving in.",
      "Remove triggers from your environment — willpower loses to context, and the environment decides much for you.",
      "A “dopamine pause”: temporarily cut the super-reward source so receptors regain sensitivity.",
      "With real addiction it's hard to cope alone — professional help is effective." ] },
    shame: { mechanism: "Shame and guilt are social emotions: the anterior cingulate and insula signal a breach of your own or the group's norms, and the amygdala adds “rejection” anxiety. It's an ancient mechanism for staying in the social group.", advice: [
      "Separate “I did badly” (guilt, productive) from “I am bad” (shame, destructive) — reframing lowers activation of the pain circuits.",
      "Self-compassion (treating yourself like a friend) is proven to lower cortisol and the activity of self-critical regions.",
      "Voicing the experience to someone close deflates the isolation that shame feeds on." ] },
    disgust: { mechanism: "Disgust is a basic protective emotion of the insula, originally guarding against inedible and contagious things. Later it spread to moral disgust — the same regions react to “impure” behavior.", advice: [
      "Notice the source: physical disgust protects the body, moral disgust protects values; telling them apart helps not to transfer one onto the other.",
      "Slow breathing lowers the nauseous autonomic reaction.",
      "Changing the sensory context (fresh air, water) quickly quiets the insula's reaction." ] },
    loneliness: { mechanism: "The brain processes social pain with the same regions (anterior cingulate, insula) as physical pain. Loneliness is evolutionarily an alarm to “return to your people”; chronically it raises cortisol and inflammation.", advice: [
      "Even a short social contact (a call, a chat) lowers the pain circuit's activity — quality matters more than quantity.",
      "Caring for someone or volunteering activates the reward system and reduces the sense of isolation.",
      "Remember that loneliness distorts perception, making you see more rejection than there is. Check those thoughts." ] },
    boredom: { mechanism: "Boredom is a reward-system signal about a lack of dopamine stimulation and meaning in the current activity. The brain is looking for a more meaningful target for attention.", advice: [
      "Boredom is useful: it switches on the default mode network, the source of ideas and creativity — don't rush to smother it with a screen.",
      "Constant fast-reward stimulation raises future boredom by lifting the dopamine bar — periodically let the brain “be bored”.",
      "Turn boredom into the question “what's meaningful for me now?” and pick an activity with a purpose." ] },
    overwhelm_emotion: { mechanism: "A strong affect has “flooded” the limbic system, and the prefrontal cortex temporarily loses control (an emotional “hijack”). The body is flooded with autonomic signals that the insula reads.", advice: [
      "First lower the physiology, then decide: a long exhale, water, cold — bring the body back to baseline before analyzing.",
      "Name the feeling in a word — verbalizing moves activity from the amygdala to the prefrontal cortex.",
      "Bilateral rhythmic stimulation (walking, rocking) helps the nervous system self-regulate." ] },
    excitement: { mechanism: "The dopamine reward system encodes the anticipation of reward — the anticipation itself is often brighter than the result. Noradrenaline adds bodily mobilization.", advice: [
      "Use the energy surge for action — this state raises motivation and learning.",
      "If excitement gets in the way (before a performance), reframe it as “I'm ready” rather than “I'm scared” — bodily these states are almost identical, and the interpretation changes the effect." ] },
    pain: { mechanism: "A signal from the body goes through the thalamus to the somatosensory cortex (where and how strong) and to the insula and anterior cingulate (how unpleasant). Attention and emotions markedly amplify or ease pain.", advice: [
      "Distracting attention really lowers pain — shifting focus reduces its processing in the brain.",
      "Slow breathing and relaxation reduce muscle tension and the painful autonomic reaction.",
      "Sharp or unexplained pain is a body signal: don't mute it without finding the cause with a doctor." ] },
    nostalgia: { mechanism: "The hippocampus lifts autobiographical memories, the default mode network links them to the sense of “self”, and the reward system colors them with warm value. Nostalgia usually increases the sense of meaning.", advice: [
      "Nostalgia is a resource: it strengthens identity and social connectedness and lowers the anxiety of loneliness.",
      "Use it as a reminder of what's valuable and carry a piece of it into the present (people, activities, places)." ] },
    confusion: { mechanism: "The anterior cingulate flags uncertainty and conflict, while the prefrontal cortex can't find a clear model of the situation. Meanwhile the insula reads body signals poorly — hence the foggy feeling.", advice: [
      "Write your thoughts and feelings on paper — externalizing unloads working memory and clears the picture.",
      "Focus on bodily sensations (where in the body it echoes) — this engages the insula and helps recognize the emotion.",
      "Lower the load and give yourself a pause: in overload the brain doesn't build clear models." ] }
  },

  extras: {
    anxiety: { after: "After a slow exhale the vagus nerve engages: amygdala and locus coeruleus activity drops, and the prefrontal cortex takes control again." },
    panic: { after: "Slowed breathing and a sensory anchor quench the false alarm: insula and amygdala calm down, the panic loop breaks." },
    fear: { after: "Assessing the reality of the threat engages the prefrontal cortex and hippocampus, which brake the amygdala." },
    stress: { conflict: { a: { region: "pfc", label: "Prefrontal cortex · control" }, b: { region: "amygdala", label: "Amygdala · reactivity" }, note: "Under high cortisol the cortex's control weakens, and the reactive amygdala grabs the wheel." }, after: "Aerobic exercise burns off cortisol and adrenaline, the hypothalamus eases off, and the prefrontal cortex recovers." },
    depression: { after: "Behavioral activation and movement gradually return activity to the reward system and quiet the default mode network's rumination." },
    apathy: { conflict: { a: { region: "pfc", label: "Prefrontal cortex · goal" }, b: { region: "vta", label: "Reward system · little “fuel”" }, note: "The goal exists, but dopamine “fuel” from the VTA isn't arriving — effort seems pointless." }, after: "A first small action and sunlight raise dopamine — the reward system revives and “wanting” appears." },
    laziness: { conflict: { a: { region: "pfc", label: "Prefrontal cortex · “should”" }, b: { region: "accumbens", label: "Nucleus accumbens · “want now”" }, note: "The cortex pulls toward the delayed reward, the reward system toward immediate pleasure. The brain picks the easy path." }, after: "After the first tiny step dopamine rises and getting into the task becomes easier — motivation arrives during the process." },
    anger: { conflict: { a: { region: "pfc", label: "Cortex · impulse braking" }, b: { region: "amygdala", label: "Amygdala · urge to attack" }, note: "The amygdala demands an immediate reaction; the cortex tries to hold it back — the outcome depends on fatigue and pausing." }, after: "A 90-second pause and naming the emotion return control to the prefrontal and orbitofrontal cortex, and the amygdala quiets." },
    sadness: { after: "Support from loved ones releases oxytocin and lowers activity in sadness's pain circuit (anterior cingulate, insula)." },
    rumination: { conflict: { a: { region: "dmn", label: "Default mode network · looping thoughts" }, b: { region: "pfc", label: "Prefrontal cortex · switching" }, note: "The default mode network spins thoughts, while prefrontal control can't switch focus." }, after: "Switching to a task with attention physically quiets the default mode network — the mental “carousel” stops." },
    insomnia: { after: "Dim light and cool lower the locus coeruleus's arousal, the hypothalamus gives the melatonin signal — the system switches into sleep." },
    fatigue: { after: "A short nap lowers adenosine; light and movement raise tone — alertness and attention return." },
    focus: { after: "Removing switches and adding movement — the prefrontal cortex and thalamus hold focus better and cut out distractions." },
    craving: { conflict: { a: { region: "pfc", label: "Cortex · self-control" }, b: { region: "accumbens", label: "Nucleus accumbens · craving reward" }, note: "The reward system demands a dose now, and weakened prefrontal control gives in." }, after: "Outlasting the wave for 15–20 minutes and removing triggers — the craving peak subsides and prefrontal control returns." },
    shame: { after: "Self-compassion lowers cortisol and self-critical activity; talking to someone close breaks the isolation of shame." },
    loneliness: { after: "Even a short warm contact lowers the pain circuit's activity, and caring for someone switches on the reward system." },
    overwhelm_emotion: { conflict: { a: { region: "pfc", label: "Cortex · control" }, b: { region: "amygdala", label: "Limbic system · flood of affect" }, note: "A strong affect flooded the limbic system, and the prefrontal cortex temporarily lost control." }, after: "First lower the physiology (exhale, cold, water), then name the feeling — activity returns to the prefrontal cortex." },
    confusion: { after: "Writing thoughts on paper unloads working memory, and focusing on the body engages the insula — the picture clears." },
    brainfog: { after: "Slow exhales lift the cortisol “muffler”, water and movement boost blood flow — the prefrontal cortex and thalamus switch back on." },
    avoidance: { conflict: { a: { region: "amygdala", label: "Amygdala · “threat”" }, b: { region: "pfc", label: "Cortex · avoids discomfort" }, note: "The amygdala flags the unpleasant task as danger, and the cortex avoids the discomfort by postponing it." }, after: "A tiny safe step paired with something pleasant retrains the amygdala: the task stops being a “threat” and energy returns." }
  },

  research: {
    anxiety: ["“Cyclic sighing”: 5 minutes of a double nasal inhale and a long mouth exhale lowers anxiety and breathing rate more than meditation (direct RCT, 2023).", "Naming an emotion in one word (“affect labeling”): verbalizing a feeling measurably lowers amygdala activity on fMRI.", "Peripheral (“panoramic”) vision: deliberately widening your field of view for 30–60 s mechanically lowers arousal — the opposite of stress's “tunnel” vision."],
    panic: ["Slow the exhale, don't “breathe deeper”: lengthening exhalation and light CO₂ tolerance (e.g. box breathing) breaks the hyperventilation loop of panic.", "A sharp sensory anchor (ice, sour taste) shifts the brain from inner catastrophe to an outer stimulus."],
    stress: ["A 20–30 min aerobic “cortisol burn” plus daylight lowers stress reactivity for hours afterward.", "“Stress-is-enhancing” mindset: reframing stress symptoms as the body mobilizing improves performance and physiology."],
    laziness: ["“Temptation bundling”: allow a pleasure (podcast, favorite drink) only together with the avoided task — pairs the reward with the effort.", "NSDR / Yoga Nidra 10–20 min restores dopamine and drive without sleep.", "Don't “stack dopamine” (music + snack + video) on an easy task — it blunts the reward and makes normal effort feel dull."],
    apathy: ["Deliberate cold exposure raises baseline dopamine for hours — a lever for a flat “don't want anything”.", "Morning sunlight within 30–60 min of waking sets the dopamine/cortisol rhythm and lifts drive."],
    depression: ["Exercise is confirmed as an effective treatment for depression on par with therapy in a large 2024 network meta-analysis.", "Behavioral activation (scheduled pleasant/meaningful actions) works even before mood improves — action first, motivation later."],
    rumination: ["Regular mindfulness measurably lowers default-mode-network activity — the physical substrate of looping thoughts.", "A scheduled 15-minute “worry window” trains the prefrontal cortex to postpone intrusive thoughts."],
    insomnia: ["Morning bright light + a cool, dark bedroom (a ~1°C body-temp drop) are the strongest non-drug sleep levers.", "If awake for 20 min, get up: keep the bed linked only with sleep (stimulus control)."],
    focus: ["Ultradian work blocks (~90 min) with real breaks match the brain's natural attention rhythm.", "A short bout of exercise before focused work acutely raises dopamine and noradrenaline and improves attention."],
    fatigue: ["A single dose of creatine temporarily improved cognition and brain energy in sleep-deprived people.", "A 10–20 min “power nap” clears adenosine without deep-sleep grogginess."],
    craving: ["Ride the wave: a craving peak usually passes in ~15–20 minutes — “urge surfing” beats fighting it.", "Remove triggers from the environment — context beats willpower for cravings."],
    anger: ["A 90-second pause: the acute neurochemical wave of anger physiologically subsides in about 90 seconds — don't act at the peak.", "Affect labeling — naming the anger — measurably dampens the amygdala on fMRI."],
    loneliness: ["Even brief “weak ties” (a word with a barista, a neighbor) measurably lift mood and belonging.", "The quality of social ties is among the strongest predictors of health and longevity, comparable to quitting smoking."],
    fear: ["Gradual safe exposure rewires the amygdala via “inhibitory learning” — the basis of evidence-based fear therapy.", "A beta-blocker (propranolol) during memory “rewriting” weakened learned fear — an actively studied reconsolidation method."],
    sadness: ["Behavioral activation (small pleasant actions by plan, not by mood) shifts mood and rivals CBT.", "Crying activates the parasympathetic system and often brings relief; suppressing emotion instead raises physiological stress."],
    brainfog: ["A single aerobic session (20–30 min) quickly improves executive function and mental clarity — an acute effect, not only cumulative.", "Deep sleep “washes” the brain via the glymphatic system; sleep loss is a common cause of fog and slow thinking."],
    avoidance: ["“If–then” plans (implementation intentions) sharply raise the odds of starting an avoided task: a preset trigger bypasses resistance.", "Approach the avoided thing in a tiny step rather than fleeing: exposure breaks the “avoid → relief → more fear” loop."],
    joy: ["“Savoring” a pleasant moment and a gratitude practice measurably raise well-being for months in RCTs.", "Sharing good news with loved ones (“capitalization”) boosts joy more than the event itself and strengthens the bond."],
    love: ["Romantic attraction lights up the dopamine reward system (VTA) — on fMRI it's motivational “wanting”, not just an emotion.", "Shared novel, slightly exciting experiences keep the dopamine “spark” alive in long relationships."],
    shame: ["Self-compassion (treating yourself like a friend) lowers self-criticism and physiological stress — a proven buffer against shame.", "Distinguishing “I did badly” (guilt — productive) from “I am bad” (shame — destructive) reduces getting stuck and self-attack."],
    disgust: ["Disgust is processed by the insula; changing the sensory context (fresh air, cool water) quickly quiets the autonomic reaction.", "Moral disgust relies on the same regions as physical disgust — knowing this helps not to transfer squeamishness onto judgments of people."],
    boredom: ["Brief boredom before a task switches on the default mode network and boosts creativity — don't rush to kill it with a screen.", "Constant fast-reward stimulation raises the boredom threshold; deliberately “being bored” without a phone helps."],
    overwhelm_emotion: ["First lower the physiology with a “physiological sigh” (double inhale + long exhale) — the fastest way to drop acute arousal.", "Then name the feeling in one word: verbalizing moves activity from the amygdala to the prefrontal cortex (fMRI)."],
    excitement: ["Reframing jitters as “I'm excited” (not “I'm afraid”) improves performance — bodily the states nearly coincide, interpretation decides.", "Anticipation of reward is dopamine at work and often brighter than the result itself (“prediction-error” coding)."],
    pain: ["Distraction measurably lowers pain: fMRI shows less processing, partly via the body's own opioid system.", "Expectation and meaning strongly modulate pain — the placebo effect really changes activity in the brain's pain regions."],
    nostalgia: ["Nostalgia raises the sense of meaning and social connectedness and lowers the anxiety of loneliness — a resource, not “living in the past”.", "Nostalgic memories even “warm” you physically — participants felt more warmth: a link between emotion and thermoregulation."],
    confusion: ["Expressive writing (thoughts and feelings on paper for 10–15 min) improves clarity and unloads working memory — a proven effect.", "Focusing on bodily sensations (interoception) helps recognize the emotion more precisely and regulate it better."]
  },

  chem: {
    dopamine: { label: "Dopamine", role: "motivation, reward" },
    cortisol: { label: "Cortisol · stress", role: "anxiety, fight-or-flight" },
    norepinephrine: { label: "Noradrenaline", role: "vigilance, arousal" },
    serotonin: { label: "Serotonin", role: "mood, calm" }
  },

  lobes: {
    frontal: { name: "Frontal lobe", short: "Decisions, planning, will, movement, speech.", detail: "The frontal lobe is the brain's “director”: it sets goals, plans, inhibits impulses, and runs voluntary movement and speech (Broca's area). Your personality and self-control live here.", assoc: "🧑‍💼 Picture a CEO: they decide, plan and say “no” to impulses.", fun: "It matures last — around age 25 — which is why teens find it harder to restrain themselves." },
    parietal: { name: "Parietal lobe", short: "Touch, temperature, pain, spatial orientation.", detail: "The parietal lobe builds a map of the body and space: where your hands are, what you touch, where a sound comes from, and how to move among objects.", assoc: "🗺 Your inner navigator and body map: “where am I and what's around”.", fun: "The body map is distorted: lips and fingers are “bigger” than the back by number of receptors." },
    temporal: { name: "Temporal lobe", short: "Hearing, understanding speech, memory, recognizing faces.", detail: "The temporal lobe processes sound and speech (Wernicke's area), helps recognize faces, and stores memories — the hippocampus sits inside it.", assoc: "👂 “Ears and memory”: it hears, understands words and remembers.", fun: "Hearing is here, not at the back of the head — a common mix-up!" },
    occipital: { name: "Occipital lobe", short: "Vision: shape, color, motion.", detail: "The occipital lobe is the visual center. It assembles a whole picture from the eyes' signals: shape, color, motion, depth.", assoc: "🎬 The brain's cinema: a screen hangs at the back where you “see”.", fun: "About a third of the cortex is involved in processing vision — the human's main sense." },
    cerebellum_lobe: { name: "Cerebellum", short: "Coordination, balance, precision and rhythm.", detail: "The cerebellum smooths and coordinates movement, holds balance and timing, and fine-tunes thought and emotion.", assoc: "🤸 A coordination coach: makes movement smooth and precise.", fun: "10% of the brain's volume — but more than half of all its neurons." },
    brainstem_lobe: { name: "Brainstem", short: "Breathing, heartbeat, sleep and wakefulness.", detail: "The brainstem is life's autopilot: it runs breathing, pulse, blood pressure and the level of wakefulness, working nonstop your whole life.", assoc: "🫀 Life-support autopilot: works even while you sleep.", fun: "It never “switches off” — otherwise breathing and the heart would stop." }
  },

  nt: {
    dopamine: { name: "Dopamine", short: "Motivation, reward, “wanting” and anticipation.", detail: "Dopamine is the currency of motivation. It encodes not pleasure itself but the anticipation of reward and how much it beat expectations. Low dopamine — no drive, “don't want to”.", assoc: "🥕 A carrot on a stick: it makes you move toward a goal.", boost: "Movement, sunlight, hitting small goals, cutting ultra-fast rewards." },
    serotonin: { name: "Serotonin", short: "Mood, calm, sleep, appetite.", detail: "Serotonin gives a calm sense of well-being and contentment and regulates sleep and appetite. Antidepressants (SSRIs) act on this system.", assoc: "🌿 Inner zen: “I'm calm and it's enough”.", boost: "Morning light, walks, gratitude, social ties." },
    norepinephrine: { name: "Noradrenaline", short: "Vigilance, focus, mobilization.", detail: "Noradrenaline raises alertness and readiness and helps you gather yourself. In excess — anxiety and insomnia; its source is the locus coeruleus in the brainstem.", assoc: "⚡ An “attention!” button: switches on vigilance and focus.", boost: "In moderation: cold, exercise. Excess is lowered by breathing and sleep." },
    gaba: { name: "GABA", short: "The brain's main brake: calm and inhibition.", detail: "GABA is the main inhibitory neurotransmitter: it calms neuronal excitation. Sedatives and alcohol act on it.", assoc: "🛑 The brain's brake pedal: “quieter, calmer”.", boost: "Breathing practices, sleep, magnesium (discuss with a doctor)." },
    glutamate: { name: "Glutamate", short: "The brain's main “gas”: excitation and learning.", detail: "Glutamate is the main excitatory neurotransmitter, key for learning and memory. Its balance with GABA decides whether the brain “revs up” or “brakes”.", assoc: "🚀 The brain's gas pedal: accelerates and teaches.", boost: "Works in tandem with GABA; balance matters, not “more”." },
    acetylcholine: { name: "Acetylcholine", short: "Attention, learning, memory, muscle action.", detail: "Acetylcholine sharpens attention and takes part in learning and memory, and relays commands to muscles. Its deficit is linked to worsening memory.", assoc: "🎓 A spotlight of attention: it highlights what we remember.", boost: "Sleep, learning new things, focusing on one task." },
    oxytocin: { name: "Oxytocin", short: "Attachment, trust, closeness.", detail: "Oxytocin strengthens social bonds, trust and attachment; it's released during hugs, closeness and caregiving.", assoc: "🤝 The glue of relationships: it brings people closer and builds trust.", boost: "Hugs, warm connection, caring for someone, pets." },
    endorphins: { name: "Endorphins", short: "Natural painkilling and the “high” of effort.", detail: "Endorphins are the brain's inner “opiates”: they mute pain and give a lift, like the “runner's high” after exertion.", assoc: "🏃 An inner first-aid kit of joy: switches on after effort.", boost: "Exercise, laughter, music, spicy food." },
    adenosine: { name: "Adenosine", short: "The “fatigue sensor”: builds up over the day and pushes for sleep.", detail: "Adenosine accumulates while we're awake, increasing “sleep pressure”. Caffeine temporarily blocks its receptors — which is why it perks you up.", assoc: "😴 An hourglass of sleep: the longer you're awake, the harder it presses.", boost: "Lowered by sleep; a short nap resets the buildup." },
    histamine: { name: "Histamine", short: "Keeps the brain awake and attentive.", detail: "Beyond allergies, brain histamine supports wakefulness. “Allergy” antihistamines cause drowsiness because they block it.", assoc: "🌅 The brain's alarm clock: keeps you in “I'm awake” mode.", boost: "Naturally higher during the day with light and activity." },
    endocannabinoids: { name: "Endocannabinoids", short: "The inner “relax” system: appetite, pain, calm.", detail: "The brain's own “cannabinoids” (anandamide etc.) smooth stress and regulate appetite, pain and mood; they partly drive the “runner's high”.", assoc: "🌈 An inner “let go” mode: softness and relaxation.", boost: "Exercise (especially running), sleep, lowering chronic stress." }
  },

  layers: {
    lobes: { title: "Layer 1 · Brain lobes", subtitle: "The surface: where to start" },
    limbic: { title: "Layer 2 · Emotion and memory", subtitle: "Deeper: the limbic system" },
    reward: { title: "Layer 3 · Motivation and brainstem", subtitle: "Deeper still: reward, habits, the base" },
    chem: { title: "Layer 4 · Neurotransmitters", subtitle: "Chemistry: how neurons “talk”" }
  },

  facts: {
    pfc: "The prefrontal cortex matures last — around age 25; that's why teens find it harder to inhibit impulses.",
    amygdala: "The amygdala reacts to threat in ~12 milliseconds — faster than you're aware of what's happening.",
    hippocampus: "The hippocampus is one of the few regions where new neurons may form even in adulthood (neurogenesis).",
    hypothalamus: "Almond-sized, the hypothalamus runs the whole body's hormones via the HPA axis.",
    thalamus: "Almost all sensory input (except smell) passes through the thalamus — the brain's “switchboard”.",
    insula: "The insula lets you feel your own heartbeat — the basis of intuition about your body's state.",
    accumbens: "The nucleus accumbens lights up more in anticipation of a reward than on receiving it.",
    vta: "VTA dopamine encodes not pleasure but “prediction error” — how much better the reward was than expected.",
    striatum: "The striatum turns repeated actions into automatic habits.",
    ofc: "The orbitofrontal cortex assigns subjective value to things — it decides what's “worth it”.",
    cerebellum: "The cerebellum is 10% of brain volume but holds more than half of all neurons.",
    brainstem: "The brainstem works nonstop your whole life, running breathing and the heart in your sleep.",
    locus: "The locus coeruleus is a tiny nucleus but the only source of noradrenaline for the whole cortex.",
    raphe: "The most common antidepressants (SSRIs) act on the serotonin system of the raphe nuclei.",
    motor: "In the motor cortex the hands and lips take a disproportionately large area — the “homunculus”.",
    sensory: "The somatosensory body map is distorted: lips and fingers are “bigger” than the back by receptor count.",
    visual: "About a third of the cortex is involved in processing vision — the human's dominant sense.",
    acc: "The anterior cingulate feels the social pain of rejection with the same regions as physical pain.",
    dmn: "The default mode network switches on when you “do nothing” — and spins thoughts about yourself."
  },

  programs: {
    dopamine: { title: "Dopamine reset", goal: "Restore the reward system's sensitivity so everyday things feel good again.", why: "Fast super-rewards (feeds, sugar, games) give sharp dopamine spikes; receptors adapt, the pleasure bar rises — and ordinary life dims. Reducing over-stimulation gradually restores sensitivity. This isn't “quitting dopamine” (you always need it) — it's a reset of super-stimuli.", ref: "Lembke, “Dopamine Nation”, 2021; reviews of receptor adaptation", steps: [
      { t: "Find your “cheap dopamine”", d: "Write down 3 habits that give a quick spike: social media, sweets, endless scrolling, shopping, games." },
      { t: "Set a reset day", d: "Pick 1 day to minimize these habits. The goal is a reset, not “forever”." },
      { t: "Remove triggers from sight", d: "Phone in another room, apps off the home screen. Environment beats willpower." },
      { t: "Swap in “slow dopamine”", d: "A walk, sport, a book, handwork, talking in person — rewards that don't overload the system." },
      { t: "Outlast the boredom peak", d: "The first 20–40 minutes you'll be pulled to the habit. That's normal — the wave passes if you wait it out." },
      { t: "Morning light and movement", d: "Daylight and light exercise naturally raise baseline dopamine without overload." },
      { t: "Note what felt better", d: "In the evening write which simple things started to please you again. Repeat the reset about once a week." } ] },
    boredom: { title: "How to be bored properly", goal: "Stop plugging boredom with a screen and turn it into ideas and energy.", why: "Boredom signals a lack of meaning or stimulus. If you constantly plug it with fast rewards, the dopamine bar rises and boredom comes more often. “Allowed” boredom switches on the default mode network — the source of ideas and creativity.", ref: "Sturm et al., 2020 (awe walks); research on DMN and creativity", steps: [
      { t: "Notice boredom without your phone", d: "When you get bored — just pause 60 seconds, don't grab the screen." },
      { t: "Ask: “what's meaningful now?”", d: "Pick an activity with a purpose, not fast dopamine. Boredom hints at what matters to you." },
      { t: "A walk without headphones", d: "10 minutes in silence — the brain shifts into wandering mode and ideas come." },
      { t: "One analog slot a day", d: "An hour without screens: reading, creating, hands. The brain needs “quiet”." },
      { t: "Write down ideas from the silence", d: "Keep a list of thoughts that come when you're not busy with stimulation." } ] },
    rewire: { title: "Rewire a habit", goal: "Replace one automatic reaction with a new one — by the science of habits.", why: "A habit is a “trigger → action → reward” loop in the striatum. It's more effective to change it not by willpower but by redesigning the loop: remove the trigger, make the good easy, tie it to an existing ritual.", ref: "Wood & Rünger, 2016 (psychology of habits); Gollwitzer (implementation intentions)", steps: [
      { t: "Find the habit's trigger", d: "When, where and after what does it kick in? The trigger is the start of the loop." },
      { t: "Phrase “if X then Y”", d: "Implementation intention: “If I open my phone in the morning, then I first drink a glass of water.”" },
      { t: "Make the good easy", d: "Remove barriers to the new habit and add barriers to the old one. Environment > willpower." },
      { t: "Tie it to an existing ritual", d: "Habit stacking: the new habit right after an already automatic one (after coffee — 5 minutes of stretching)." },
      { t: "Reward immediately", d: "A small reward right after the new action locks the loop into the brain." },
      { t: "Don't break the chain", d: "Mark your day streak. A slip ≠ failure — just return the next day. Frequency matters, not perfection." } ] }
  },

  discoveries: {
    "glymphatic-sleep": { title: "The brain “washes” during sleep", summary: "In sleep the spaces between cells widen and the glymphatic system flushes out metabolic waste (including beta-amyloid). Another reason sleep is critical for the brain." },
    "exercise-hippocampus": { title: "Aerobic exercise enlarges the hippocampus", summary: "A year of regular walking increased hippocampal volume in older adults and improved memory — the brain keeps its plasticity in adulthood." },
    "cyclic-sighing": { title: "5 minutes of breathing beat meditation for mood", summary: "In a direct RCT the “cyclic sigh” (short double inhale + long exhale) lowered anxiety and lifted mood more than meditation of the same length." },
    "exercise-depression": { title: "Exercise is a proven treatment for depression", summary: "A large network meta-analysis of RCTs confirmed: walking, running, strength and yoga give a clinically meaningful antidepressant effect." },
    "creatine-sleep": { title: "A single creatine dose improves thinking under sleep loss", summary: "A high dose of creatine temporarily improved cognitive scores and changed the brain's energy metabolism in sleep-deprived participants." },
    "gut-brain": { title: "The gut microbiome is linked to mood", summary: "Large cohorts showed a link between gut bacteria composition and depression and quality of life. Causation in humans is still being clarified." },
    "psilocybin-depression": { title: "Psychedelics “reset” the default mode network", summary: "Under supervision, psilocybin reduced the rigidity of the default mode network and eased treatment-resistant depression in early trials. The method is experimental." },
    "glp1-reward": { title: "GLP-1 drugs dampen cravings via the reward system", summary: "Weight-loss drugs (semaglutide etc.) act not only on the stomach but on the dopamine reward system, reducing food — and possibly other — cravings." },
    "adult-neurogenesis": { title: "Whether adults grow new neurons is still debated", summary: "Some studies find neurogenesis in the adult human hippocampus, others almost none. There's no consensus yet." },
    "wimhof": { title: "Breathing + cold may influence the autonomic system", summary: "The Wim Hof method (hyperventilation + cold) affected the inflammatory response in a small study. Data are limited; larger checks are needed." },
    "awe-walk": { title: "“Awe walks” reduce self-focus", summary: "Walks with deliberate attention to the vast and beautiful boosted positive emotion and lowered self-preoccupation in older adults." },
    "cold-dopamine": { title: "Cold water raises dopamine for a long time", summary: "Immersion in cold water raised blood dopamine roughly 2.5× with a lasting effect — the basis of “cold” alertness protocols." }
  },

  lifestyle: {
    poor_sleep: { label: "Sleep deprivation", effect: "Sleep loss weakens the prefrontal cortex and raises amygdala reactivity — hence irritability, anxiety and “fog”.", tips: ["Today — prioritize an early bedtime and morning light.", "A short 10–20 min nap partly compensates."] },
    overeating: { label: "Overeating / heavy food", effect: "After a big, sugary meal a glucose spike and crash cause drowsiness and sluggishness (postprandial low-alertness), and focus drops.", tips: ["A short 10–15 min walk after eating smooths the glucose spike and restores alertness.", "Protein and fiber instead of fast carbs stabilize energy."] },
    low_social: { label: "Little social contact", effect: "A lack of social contact raises cortisol and activates the loneliness “pain” circuit (anterior cingulate, insula), lowering tone.", tips: ["Even a short warm contact or call lifts mood and oxytocin.", "“Weak ties” count too — a couple of words already helps."] },
    no_exercise: { label: "Little movement", effect: "Inactivity lowers dopamine, BDNF and cerebral blood flow — motivation and mental clarity drop.", tips: ["Even 10–20 min of brisk walking raise dopamine and BDNF.", "A “move every hour” rule clears the stagnation."] },
    caffeine: { label: "Caffeine", effect: "Excess caffeine amplifies the noradrenaline system (locus coeruleus): jitters, anxiety, and spoiled sleep in the evening.", tips: ["Caffeine clears in 6–8 hours — cut it after lunch.", "L-theanine softens caffeine's “jitteriness”."] },
    alcohol: { label: "Alcohol", effect: "Alcohol wrecks sleep architecture (less REM) and lowers serotonin the next day — hence sober anxiety and low mood.", tips: ["Hydration and morning light soften the rebound.", "Give the body a day or two alcohol-free to restore sleep."] },
    screen: { label: "Lots of screen / social media", effect: "A stream of fast rewards overloads the dopamine system and raises its “bar” — ordinary things start to feel boring.", tips: ["A “dopamine pause” for a couple of hours restores sensitivity.", "Screens out of the bedroom improve both sleep and morning motivation."] }
  },

  supplements: [
    { name: "Omega-3 (EPA/DHA)", for: "mood, inflammation, neuron membranes", note: "An EPA share above 60% is linked to an antidepressant effect as an add-on." },
    { name: "Creatine monohydrate 3–5 g", for: "mental fatigue, brain energy, sleep loss", note: "Supports the brain's energy metabolism; more noticeable with sleep deprivation." },
    { name: "Magnesium (glycinate / L-threonate)", for: "anxiety, sleep, relaxation", note: "Magnesium deficiency is linked to anxiety; glycinate/threonate forms absorb better." },
    { name: "Vitamin D3", for: "mood, especially in deficiency and winter", note: "Correcting a deficiency is linked to better mood; check your 25(OH)D level." },
    { name: "L-theanine (+ caffeine)", for: "calm focus without the jitters", note: "L-theanine + caffeine improves attention and lowers caffeine's anxiety." },
    { name: "Rhodiola rosea", for: "mental fatigue, stress", note: "An adaptogen; data are encouraging but study quality varies." }
  ],

  suppHints: {
    poor_sleep: ["Magnesium (glycinate / L-threonate)", "Creatine monohydrate 3–5 g"],
    overeating: ["Omega-3 (EPA/DHA)"],
    low_social: ["Vitamin D3", "Omega-3 (EPA/DHA)"],
    no_exercise: ["Creatine monohydrate 3–5 g"],
    caffeine: ["L-theanine (+ caffeine)", "Magnesium (glycinate / L-threonate)"],
    alcohol: ["Omega-3 (EPA/DHA)", "Magnesium (glycinate / L-threonate)"],
    screen: ["Magnesium (glycinate / L-threonate)"]
  },

  stateSupp: {
    fatigue: ["Creatine monohydrate 3–5 g", "Rhodiola rosea", "Vitamin D3"],
    depression: ["Omega-3 (EPA/DHA)", "Vitamin D3"],
    anxiety: ["Magnesium (glycinate / L-threonate)", "L-theanine (+ caffeine)"],
    stress: ["Magnesium (glycinate / L-threonate)", "Rhodiola rosea"],
    apathy: ["Creatine monohydrate 3–5 g", "Vitamin D3"],
    insomnia: ["Magnesium (glycinate / L-threonate)"],
    focus: ["L-theanine (+ caffeine)", "Creatine monohydrate 3–5 g"]
  },

  triggers: {
    sleep_good: "Well rested", sleep_bad: "Slept little", exercise: "Exercise", sunlight: "Sunlight",
    social: "Socializing", coffee: "Lots of coffee", alcohol: "Alcohol", junk: "Heavy food",
    screen: "Lots of screen", work_stress: "Work crunch"
  },

  examples: ["Anxious", "Feeling lazy", "Can't sleep", "Slept little & ate a lot", "Nothing feels good", "Racing thoughts", "No energy", "Talked to no one"],

  keywords: {
    anxiety: ["anxious", "anxiety", "worried", "worry", "nervous", "on edge", "uneasy", "restless"],
    panic: ["panic", "can't breathe", "cant breathe", "heart racing", "panic attack", "shaking", "going to die"],
    fear: ["afraid", "fear", "scared", "terrified", "phobia", "frightened"],
    stress: ["stress", "stressed", "overwhelmed with work", "burnout", "burned out", "pressure", "deadline", "swamped"],
    depression: ["depress", "hopeless", "empty", "down", "worthless", "no point", "no will to live", "bleak"],
    apathy: ["apathy", "don't care", "dont care", "indifferent", "nothing matters", "no motivation", "unmotivated", "numb"],
    laziness: ["lazy", "procrastinat", "can't start", "cant start", "put it off", "putting off", "don't feel like", "task i don't like", "task i dont like", "don't want to do", "dont want to do", "keep delaying", "unpleasant task"],
    anger: ["angry", "anger", "mad", "furious", "irritated", "irritation", "rage", "annoyed", "pissed"],
    sadness: ["sad", "sadness", "crying", "cry", "grief", "tears", "heartbroken", "sorrow", "down"],
    rumination: ["overthink", "racing thoughts", "can't stop thinking", "cant stop thinking", "ruminat", "looping thoughts", "stuck in my head", "same thoughts"],
    insomnia: ["can't sleep", "cant sleep", "insomnia", "lying awake", "not sleeping", "wake up at night", "sleepless", "tossing and turning"],
    fatigue: ["tired", "fatigue", "no energy", "exhausted", "drained", "sluggish", "weak", "worn out", "no strength", "wiped out"],
    focus: ["can't focus", "cant focus", "distracted", "concentrat", "unfocused", "can't concentrate", "cant concentrate", "attention keeps", "scattered"],
    brainfog: ["brain fog", "foggy", "can't think", "cant think", "slow thinking", "mind goes blank", "spacing out", "zoning out", "muddy head", "can't think straight"],
    avoidance: ["avoid", "avoidance", "dread", "can't face", "cant face", "keep putting off", "drained when i think", "sabotage", "the moment i think about"],
    joy: ["joy", "happy", "happiness", "wonderful", "delighted", "great mood", "elated", "cheerful"],
    love: ["in love", "i love", "have a crush", "crush on", "attracted to", "romantic", "falling for"],
    craving: ["crave", "craving", "urge", "want to drink", "want to smoke", "addicted", "binge", "want sweets", "relapse", "can't stop eating"],
    shame: ["shame", "ashamed", "guilt", "guilty", "embarrassed", "self-critical", "hate myself", "humiliated"],
    disgust: ["disgust", "disgusting", "gross", "nauseous", "revolted", "sickening", "repulsed"],
    loneliness: ["lonely", "loneliness", "isolated", "no one", "nobody", "abandoned", "no one understands", "left out"],
    boredom: ["bored", "boredom", "boring", "nothing to do", "dull", "restless boredom"],
    overwhelm_emotion: ["overwhelmed", "can't take it", "cant take it", "breaking down", "want to scream", "too much", "falling apart"],
    excitement: ["excited", "anticipation", "can't wait", "cant wait", "thrill", "adrenaline", "buzzing", "pumped"],
    pain: ["in pain", "hurts", "ache", "aching", "headache", "sore", "cramp", "my body hurts"],
    nostalgia: ["nostalgia", "miss the past", "nostalgic", "good old days", "miss how it was"],
    confusion: ["confused", "don't understand myself", "dont understand myself", "lost", "don't know what i feel", "dont know what i feel", "mixed up", "muddled"],
    resentment: ["resentful", "resentment", "hold a grudge", "grudge", "offended", "hurt by", "treated unfairly", "took offense", "bitter about"],
    envy: ["envy", "envious", "others have it better", "why not me", "jealous of their success", "everyone has it except me"],
    jealousy: ["jealous", "jealousy", "afraid he'll leave", "afraid she'll leave", "scared of losing my partner", "suspect cheating", "afraid of being cheated on"],
    social_anxiety: ["social anxiety", "shy around people", "afraid of judgment", "afraid to speak up", "afraid of public speaking", "what will they think", "blush around people", "scared to call", "awkward around people"],
    impostor: ["impostor", "imposter", "feel like a fraud", "not good enough", "just got lucky", "they'll find out", "don't deserve", "everyone is smarter", "afraid of being exposed"],
    relief: ["relieved", "relief", "let go", "weight off my shoulders", "finally over", "dodged it", "phew", "it worked out"],
    pride: ["proud of myself", "proud", "i did it", "i made it", "achieved", "accomplished", "i nailed it", "i earned it", "pleased with myself"],
    gratitude: ["grateful", "gratitude", "thankful", "appreciate what i have", "i'm lucky to have", "count my blessings"],
    flow: ["in the flow", "in flow", "calm", "at peace", "serene", "absorbed in", "time flies", "in the zone", "in my element", "balanced"],
    numbness: ["feel nothing", "emotionally numb", "numbness", "detached", "like it's not me", "watching myself", "unreal", "disconnected from emotions", "behind glass", "depersonaliz"],
    hangry: ["hangry", "hungry and angry", "irritable when hungry", "haven't eaten and irritable", "everything annoys me when hungry", "grumpy when hungry"],
    dejavu: ["deja vu", "dejavu", "like it happened before", "feels familiar", "i've seen this before", "i've been here before"],
    frisson: ["chills from music", "goosebumps from music", "musical chills", "shivers down my spine", "aesthetic chills", "frisson"],
    perfectionism: ["perfectionism", "perfectionist", "has to be perfect", "afraid to do it badly", "all or nothing", "fear of mistakes stops me", "keep redoing", "can't finish until perfect"],
    night_rumination: ["thoughts race at night", "can't shut my brain off at night", "mind won't stop at night", "anxious thoughts at night", "lie awake overthinking", "brain won't turn off at night"],
    placebo: ["placebo", "believed it would help", "expectation effect", "felt better because i believed", "thought it was medicine and it helped"],
    nocebo: ["nocebo", "read the symptoms and felt worse", "psyched myself into feeling sick", "expected side effects and got them", "negative expectation made me feel bad"],
    earworm: ["song stuck in my head", "earworm", "can't get the song out of my head", "melody on loop", "tune stuck in my head"],
    butterflies: ["butterflies in my stomach", "stomach flutters", "knot in my stomach before", "stomach drops when nervous", "fluttery stomach"],
    contagious_yawn: ["contagious yawn", "saw someone yawn and yawned", "yawn when others yawn", "yawning is catching"],
    runners_high: ["second wind", "runner's high", "runners high", "suddenly felt light while running", "euphoria from exercise", "endorphin rush from a workout"],
    choice_paralysis: ["choice paralysis", "too many options", "can't decide with so many choices", "overwhelmed by options", "analysis paralysis", "paralyzed by choice"],
    tip_of_tongue: ["tip of my tongue", "on the tip of my tongue", "forgot a word i know", "can't recall the word", "name is right there but won't come"],
    heartbreak: ["heartbroken", "heartbreak", "got dumped", "going through a breakup", "he left me", "she left me", "broke up and it hurts", "broken heart", "can't get over the breakup"],
    homesickness: ["homesick", "homesickness", "miss home", "want to go home", "far from home and it's hard", "miss my family and home"],
    love_first_sight: ["love at first sight", "fell for them instantly", "instant crush", "spark at first sight", "fell in love the moment i saw"],
    emotional_contagion: ["caught their mood", "picked up on the mood", "their anxiety made me anxious", "mood rubbed off on me", "absorbed the room's mood", "the vibe is getting to me"]
  },

  lifestyleKeywords: {
    poor_sleep: ["slept little", "didn't sleep", "didnt sleep", "no sleep", "slept badly", "went to bed late", "only slept", "barely slept", "up all night"],
    overeating: ["ate a lot", "overate", "too much food", "junk food", "ate too much", "lots of sweets", "binged on food", "heavy meal"],
    low_social: ["didn't talk to anyone", "didnt talk to anyone", "no social", "alone all day", "isolated", "saw no one", "talked to no one", "no contact"],
    no_exercise: ["sat all day", "no exercise", "didn't move", "didnt move", "lay all day", "no movement", "didn't work out", "sedentary"],
    caffeine: ["too much coffee", "coffee all day", "energy drink", "too much caffeine", "overdid caffeine"],
    alcohol: ["drank yesterday", "hungover", "hangover", "alcohol", "had drinks"],
    screen: ["on my phone all day", "scrolling", "too much social media", "binge watch", "screen all day", "doomscroll"],
    dehydration: ["forgot to drink", "barely drank water", "hardly any water", "dehydrated", "no water all day", "didn't drink water"],
    pms: ["before my period", "pms", "premenstrual", "hormones", "luteal phase", "period is coming and my mood"],
    sickness: ["getting sick", "caught a cold", "have a fever", "i'm ill", "coming down with something", "body aches", "inflammation", "the flu"],
    stuffy: ["stuffy", "stuffy room", "no fresh air", "stale air", "not enough air", "airless room", "hard to breathe indoors"],
    sugar: ["ate too much sugar", "too many sweets", "sugar crash", "sugar rush", "sugar spike", "ate a ton of dessert", "sweets and now sluggish"],
    skipped_meal: ["skipped a meal", "haven't eaten all day", "skipped lunch", "forgot to eat", "hungry all day", "empty stomach and queasy"],
    low_sunlight: ["not enough sunlight", "no sun", "lack of daylight", "indoors all day no light", "dark winter", "gloomy and sluggish", "no daylight"],
    jetlag: ["jet lag", "jetlag", "flight threw me off", "changed time zones", "can't sleep after the flight", "time difference"],
    overtraining: ["overtrained", "overtraining", "pushed too hard at the gym", "wrecked after a workout", "overdid the exercise"],
    nicotine: ["smoked a lot", "vaping all day", "too much nicotine", "chain smoking", "vaped all day"],
    coffee_empty: ["coffee on an empty stomach", "coffee before eating", "just coffee this morning", "coffee and the jitters", "coffee no food"]
  }
};

/* ---------- Русские значения для новых UI-ключей ---------- */
EN.ui_ru = {
  view_side: "Сбоку", view_front: "Спереди", view_top: "Сверху",
  hint_default: "3D-модель мозга — вращайте её мышью. Опишите состояние, и активные зоны подсветятся.",
  hint_analyze_done: "🔴 ключевая зона · 🟡 сопутствующие · летящие точки — нейромедиаторы. Вращайте мышью.",
  lib_summary: "📚 Все состояния, которые я понимаю — нажмите, чтобы листать",
  lib_search: "Поиск состояния…",
  analyze_empty: "Опишите состояние или образ жизни («мало спал», «много кофе», «ни с кем не общалась») — приложение покажет, что происходит в мозге, и даст свежие научные советы.",
  results_empty_title: "", score: "Счёт: ",
  uf_all: "Все", uf_verified: "✅ проверено", uf_emerging: "🧪 новые данные", uf_unverified: "❓ не подтверждено",
  upd_refresh: "↻ Обновить",
  explore_empty: "Выберите структуру мозга, чтобы прочитать о ней.",
  backup_note: "Записи хранятся только в этом браузере. «Резервная копия» — зашифрованный файл для переноса на другое устройство.",
  chart_mood: "Настроение за 2 недели", chart_weekday: "Записи по дням недели", chart_trig: "Триггеры и настроение",
  disclaimer_strong: "Это образовательный инструмент",
  disclaimer_rest: ", а не диагностика. Приложение показывает упрощённую нейробиологию состояний и не заменяет консультацию врача или психотерапевта. Советы по добавкам — не назначение; обсуждайте их с врачом. Если состояние тяжёлое, длительное или есть мысли о причинении себе вреда — обратитесь за профессиональной помощью.",
  install_head: "Установить приложение",
  mixed_note: "Смешанное состояние: активны несколько систем мозга — они показаны вместе на модели.",
  accompany_title: "Сопутствующие состояния",
  also_possible: "также возможно", primary_state: "основное",
  sec_structures: "Задействованные структуры", sec_mechanism: "Что происходит в мозге",
  sec_advice: "Как выйти из состояния — по науке", sec_conflict: "«Спор» систем в мозге",
  sec_after: "Эффект после совета", after_btn: "▶ Показать эффект совета", after_back: "← Вернуть исходное",
  related_states: "Связанные состояния", lifestyle_title: "Факторы образа жизни сегодня",
  supp_title: "Научно изучаемые добавки (не назначение)",
  research_title: "Свежие / нестандартные техники (с исследованиями)",
  conflict_vs: "против",
  chem_title: "Нейрохимия:", supp_for: "для: ", conflict_word: "⚡ спор ⚡",
  hint_after: "🟢 зелёным — как меняется мозг после применения совета.",
  hint_programs: "Программы: пошаговые практики с трекером.",
  not_recognized: "Не удалось распознать по этим словам. Попробуйте иначе — например: «тревожно», «нет сил», «злюсь», «не могу уснуть», «мало спал», «много кофе».",
  history_empty: "Здесь появятся ваши записи и графики динамики. Опишите состояние на вкладке «Анализ».",
  patterns_title: "🔎 Закономерности", related_states: "Связанные состояния",
  loading_findings: "Загружаю находки…", source_word: "источник", no_findings: "Нет находок в этой категории.",
  quiz_clue: "Какая структура отвечает за это?", quiz_correct: "✅ Верно!", quiz_wrong_pre: "❌ Правильно:",
  quiz_next: "Следующий вопрос →",
  my_state: "Моё состояние", active_zones: "Активные зоны мозга:", edu_footer: "Образовательный инструмент · не диагностика",
  csv_date: "Дата", csv_text: "Текст", csv_states: "Состояния", csv_zones: "Зоны", csv_triggers: "Триггеры", csv_mood: "Настроение",
  diary_title: "Дневник — Brain Emotion Map", diary_h1: "🧠 Brain Emotion Map — дневник состояний",
  backup_new: "Придумайте пароль для резервной копии (запомните его — без него файл не открыть):",
  backup_open: "Введите пароль от резервной копии:",
  restore_done: "Готово: восстановлено ", restore_entries: " записей.", restore_fail: "Не удалось расшифровать — проверьте пароль и файл.",
  nt_boost: "⬆️ Поднять: ", layers_open: "Открыто слоёв: ", badge_passed: "✓ пройден",
  badge_locked: "🔒 откройте предыдущий", studied: " изучено", retest: "Пройти тест ещё раз",
  take_test: "Пройти мини-тест и открыть следующий слой →", unlock_hint: "Откройте все карточки слоя, чтобы разблокировать мини-тест.",
  test_great: "🎉 Отлично!", test_almost: "🙂 Почти!", correct_prefix: "Верно: ", of_word: " из ",
  next_open: "Следующий слой открыт.", need_more: "Нужно чуть больше — попробуйте ещё раз.",
  again: "Ещё раз", to_next: "К следующему слою ↓", q_word: "Вопрос ", who_for: "Кто отвечает за это?",
  hint_schema: "Выберите эмоцию — зоны, которые за неё отвечают, загорятся на 3D-модели.",
  hint_journey: "Погружение: открывайте карточки — структуры подсветятся на модели.",
  hint_atlas: "Атлас: нажмите структуру в списке или на 3D-модели.",
  hint_quiz: "Викторина: угадайте зону мозга по описанию.",
  hint_updates: "Свежие открытия: нажмите находку — связанная зона подсветится.",
  prog_open: "Открыть →", prog_back: "← Все программы", prog_why: "Почему это работает:",
  streak_label: "🔥 Серия: ", streak_marked: "✓ Отмечено сегодня", streak_mark: "Отметить сегодняшний день",
  show_region: "🧠 Показать зону на модели", day_one: "день", day_many: "дней"
};

/* ---------- Слияние UI-ключей в I18N ---------- */
if (typeof I18N !== 'undefined') {
  Object.assign(I18N.en, EN.ui_en);
  Object.assign(I18N.ru, EN.ui_ru);
}

/* ---------- Английские ключевые слова (работают всегда) ---------- */
(function mergeKeywords() {
  if (typeof STATES !== 'undefined') STATES.forEach(s => {
    if (EN.keywords[s.id]) s.keywords = s.keywords.concat(EN.keywords[s.id]);
  });
  if (typeof LIFESTYLE !== 'undefined') Object.keys(LIFESTYLE).forEach(id => {
    if (EN.lifestyleKeywords[id]) LIFESTYLE[id].keywords = LIFESTYLE[id].keywords.concat(EN.lifestyleKeywords[id]);
  });
})();

/* ---------- Переключение языка контента (оверлей) ---------- */
const RU_SNAP = { done: false };
function pick(a, b) { return (a !== undefined && a !== null) ? a : b; }

function snapRU() {
  RU_SNAP.regions = {}; Object.keys(REGIONS).forEach(id => { const r = REGIONS[id]; RU_SNAP.regions[id] = { system: r.system, short: r.short, detail: r.detail }; });
  RU_SNAP.states = {}; STATES.forEach(s => RU_SNAP.states[s.id] = { mechanism: s.mechanism, advice: s.advice.slice() });
  RU_SNAP.extras = {}; if (typeof STATE_EXTRAS !== 'undefined') Object.keys(STATE_EXTRAS).forEach(id => { const e = STATE_EXTRAS[id]; RU_SNAP.extras[id] = { conflict: e.conflict ? JSON.parse(JSON.stringify(e.conflict)) : null, after: e.after ? Object.assign({}, e.after) : null }; });
  RU_SNAP.research = {}; if (typeof STATE_RESEARCH !== 'undefined') Object.keys(STATE_RESEARCH).forEach(id => RU_SNAP.research[id] = STATE_RESEARCH[id].map(r => r.tip));
  RU_SNAP.lobes = {}; if (typeof LOBES !== 'undefined') Object.keys(LOBES).forEach(id => { const l = LOBES[id]; RU_SNAP.lobes[id] = { name: l.name, short: l.short, detail: l.detail, assoc: l.assoc, fun: l.fun }; });
  RU_SNAP.nt = {}; if (typeof NEUROTRANSMITTERS !== 'undefined') Object.keys(NEUROTRANSMITTERS).forEach(id => { const n = NEUROTRANSMITTERS[id]; RU_SNAP.nt[id] = { name: n.name, short: n.short, detail: n.detail, assoc: n.assoc, boost: n.boost }; });
  RU_SNAP.layers = {}; if (typeof EXPLORE_LAYERS !== 'undefined') EXPLORE_LAYERS.forEach(l => RU_SNAP.layers[l.id] = { title: l.title, subtitle: l.subtitle });
  RU_SNAP.chem = {}; if (typeof CHEMISTRY !== 'undefined') Object.keys(CHEMISTRY).forEach(id => { const c = CHEMISTRY[id]; RU_SNAP.chem[id] = { label: c.label, role: c.role }; });
  RU_SNAP.programs = {}; if (typeof PROGRAMS !== 'undefined') PROGRAMS.forEach(p => RU_SNAP.programs[p.id] = { title: p.title, goal: p.goal, why: p.why, ref: p.ref ? p.ref.text : null, steps: p.steps.map(s => ({ t: s.t, d: s.d })) });
  RU_SNAP.disc = {}; if (typeof DISCOVERIES_SEED !== 'undefined') DISCOVERIES_SEED.forEach(d => RU_SNAP.disc[d.id] = { title: d.title, summary: d.summary });
  RU_SNAP.life = {}; if (typeof LIFESTYLE !== 'undefined') Object.keys(LIFESTYLE).forEach(id => { const l = LIFESTYLE[id]; RU_SNAP.life[id] = { label: l.label, effect: l.effect, tips: l.tips.slice() }; });
  RU_SNAP.supp = typeof SUPPLEMENTS !== 'undefined' ? SUPPLEMENTS.map(s => ({ name: s.name, for: s.for, note: s.note })) : [];
  RU_SNAP.suppHints = {}; if (typeof SUPP_HINTS !== 'undefined') Object.keys(SUPP_HINTS).forEach(k => RU_SNAP.suppHints[k] = SUPP_HINTS[k].slice());
  RU_SNAP.stateSupp = {}; if (typeof STATE_SUPP !== 'undefined') Object.keys(STATE_SUPP).forEach(k => RU_SNAP.stateSupp[k] = STATE_SUPP[k].slice());
  RU_SNAP.trig = {}; if (typeof TRIGGERS !== 'undefined') TRIGGERS.forEach(tr => RU_SNAP.trig[tr.id] = tr.label);
  RU_SNAP.facts = {}; if (typeof FACTS !== 'undefined') Object.keys(FACTS).forEach(id => RU_SNAP.facts[id] = FACTS[id]);
  RU_SNAP.done = true;
}

function applyContentLang(lang) {
  if (!RU_SNAP.done) snapRU();
  const en = lang === 'en';

  Object.keys(REGIONS).forEach(id => {
    const v = en ? (EN.regions[id] || {}) : {}, ru = RU_SNAP.regions[id];
    REGIONS[id].system = pick(v.system, ru.system);
    REGIONS[id].short = pick(v.short, ru.short);
    REGIONS[id].detail = pick(v.detail, ru.detail);
  });
  STATES.forEach(s => {
    const v = en ? (EN.states[s.id] || {}) : {}, ru = RU_SNAP.states[s.id];
    s.mechanism = pick(v.mechanism, ru.mechanism);
    s.advice = pick(v.advice, ru.advice);
  });
  if (typeof STATE_EXTRAS !== 'undefined') Object.keys(STATE_EXTRAS).forEach(id => {
    const e = STATE_EXTRAS[id], ru = RU_SNAP.extras[id], v = en ? (EN.extras[id] || {}) : {};
    if (e.conflict) { const cv = en ? v.conflict : null; e.conflict = cv ? cv : ru.conflict; }
    if (e.after) { const av = en ? v.after : null; e.after.text = pick(av, ru.after ? ru.after.text : e.after.text); }
  });
  if (typeof STATE_RESEARCH !== 'undefined') Object.keys(STATE_RESEARCH).forEach(id => {
    const tips = en ? (EN.research[id] || []) : RU_SNAP.research[id];
    STATE_RESEARCH[id].forEach((r, i) => { r.tip = pick(tips[i], RU_SNAP.research[id][i]); });
  });
  if (typeof LOBES !== 'undefined') Object.keys(LOBES).forEach(id => {
    const v = en ? (EN.lobes[id] || {}) : {}, ru = RU_SNAP.lobes[id];
    ['name', 'short', 'detail', 'assoc', 'fun'].forEach(k => LOBES[id][k] = pick(v[k], ru[k]));
  });
  if (typeof NEUROTRANSMITTERS !== 'undefined') Object.keys(NEUROTRANSMITTERS).forEach(id => {
    const v = en ? (EN.nt[id] || {}) : {}, ru = RU_SNAP.nt[id];
    ['name', 'short', 'detail', 'assoc', 'boost'].forEach(k => NEUROTRANSMITTERS[id][k] = pick(v[k], ru[k]));
  });
  if (typeof EXPLORE_LAYERS !== 'undefined') EXPLORE_LAYERS.forEach(l => {
    const v = en ? (EN.layers[l.id] || {}) : {}, ru = RU_SNAP.layers[l.id];
    l.title = pick(v.title, ru.title); l.subtitle = pick(v.subtitle, ru.subtitle);
  });
  if (typeof CHEMISTRY !== 'undefined') Object.keys(CHEMISTRY).forEach(id => {
    const v = en ? (EN.chem[id] || {}) : {}, ru = RU_SNAP.chem[id];
    CHEMISTRY[id].label = pick(v.label, ru.label); CHEMISTRY[id].role = pick(v.role, ru.role);
  });
  if (typeof PROGRAMS !== 'undefined') PROGRAMS.forEach(p => {
    const v = en ? (EN.programs[p.id] || {}) : {}, ru = RU_SNAP.programs[p.id];
    p.title = pick(v.title, ru.title); p.goal = pick(v.goal, ru.goal); p.why = pick(v.why, ru.why);
    if (p.ref) p.ref.text = pick(v.ref, ru.ref);
    const st = en ? v.steps : null;
    p.steps.forEach((s, i) => { s.t = pick(st && st[i] && st[i].t, ru.steps[i].t); s.d = pick(st && st[i] && st[i].d, ru.steps[i].d); });
  });
  if (typeof DISCOVERIES_SEED !== 'undefined') DISCOVERIES_SEED.forEach(d => {
    const v = en ? (EN.discoveries[d.id] || {}) : {}, ru = RU_SNAP.disc[d.id];
    d.title = pick(v.title, ru.title); d.summary = pick(v.summary, ru.summary);
  });
  if (typeof LIFESTYLE !== 'undefined') Object.keys(LIFESTYLE).forEach(id => {
    const v = en ? (EN.lifestyle[id] || {}) : {}, ru = RU_SNAP.life[id];
    LIFESTYLE[id].label = pick(v.label, ru.label); LIFESTYLE[id].effect = pick(v.effect, ru.effect);
    LIFESTYLE[id].tips = pick(v.tips, ru.tips);
  });
  if (typeof SUPPLEMENTS !== 'undefined') SUPPLEMENTS.forEach((s, i) => {
    const v = en ? (EN.supplements[i] || {}) : {}, ru = RU_SNAP.supp[i];
    s.name = pick(v.name, ru.name); s.for = pick(v.for, ru.for); s.note = pick(v.note, ru.note);
  });
  if (typeof SUPP_HINTS !== 'undefined') Object.keys(SUPP_HINTS).forEach(k => {
    SUPP_HINTS[k] = en ? (EN.suppHints[k] || RU_SNAP.suppHints[k]) : RU_SNAP.suppHints[k];
  });
  if (typeof STATE_SUPP !== 'undefined') Object.keys(STATE_SUPP).forEach(k => {
    STATE_SUPP[k] = en ? (EN.stateSupp[k] || RU_SNAP.stateSupp[k]) : RU_SNAP.stateSupp[k];
  });
  if (typeof TRIGGERS !== 'undefined') TRIGGERS.forEach(tr => { tr.label = en ? pick(EN.triggers[tr.id], RU_SNAP.trig[tr.id]) : RU_SNAP.trig[tr.id]; });
  if (typeof FACTS !== 'undefined') Object.keys(FACTS).forEach(id => { FACTS[id] = en ? pick(EN.facts[id], RU_SNAP.facts[id]) : RU_SNAP.facts[id]; });
}
window.applyContentLang = applyContentLang;
window.EN_EXAMPLES = EN.examples;
