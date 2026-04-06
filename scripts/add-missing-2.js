#!/usr/bin/env node
// add-missing-2.js — Social Psychology, Neuroscience, Evolutionary, Info Theory, Linguistics, Anthropology, Philosophy
// Run: node scripts/add-missing-2.js
const fs = require('fs'), path = require('path');
const DATA_PATH = path.join(__dirname, '../data/principles-v2.json');

const NEW = [
  // SOCIAL PSYCHOLOGY
  {
    id:'social-facilitation', name:'Social Facilitation', aliases:['Audience Effect','Social Enhancement'],
    icon:'groups', color:'#E8F8F5', iconColor:'#1A7A64',
    impactLevel:'moderate', baseRelevance:72,
    categories:['Social Context','Performance','Collaboration'],
    disciplines:['social-psychology'],
    contexts:['collaborative-review','onboarding-learning'],
    problemTypes:['low-engagement','adoption-barriers'],
    tags:['social facilitation','audience','performance','visibility','social presence'],
    summary:'The presence of others improves performance on familiar tasks but impairs performance on complex or novel ones.',
    description:'Social visibility in collaborative tools increases effort on familiar tasks but creates anxiety on new or complex ones.',
    designPrompt:'Design collaborative visibility for familiar tasks. Shield users from social observation during learning or complex new tasks.',
    whenToUse:'In collaborative tools, shared dashboards, and any interface where users\' actions are visible to others.',
    whyItMatches:'Social facilitation explains why live-editing features increase output on familiar tasks but reduce exploration of new features.',
    actions:[
      {title:'Make social visibility opt-in for complex tasks', description:'Allow users to work privately on new or complex tasks before making work visible to others.'},
      {title:'Use social presence positively for motivation', description:'Surface who else is active or has completed a task — social presence motivates on familiar workflows.'}
    ],
    antiPatterns:['Exposing beginner-mode work to an audience','Making all actions visible to the team by default during onboarding'],
    uiPatterns:['Private draft states before sharing','Optional presence indicators','"Who completed this" social proof on routine tasks'],
    examples:['"Your team has submitted their reports" shown on a reporting dashboard motivates the remaining user — social presence on a familiar task drives completion.']
  },
  {
    id:'attribution-theory', name:'Attribution Theory', aliases:['Causal Attribution','Locus of Control'],
    icon:'psychology', color:'#E8F8F5', iconColor:'#1A7A64',
    impactLevel:'moderate', baseRelevance:74,
    categories:['Error Perception','Blame Attribution','Trust'],
    disciplines:['social-psychology'],
    contexts:['error-states','onboarding-learning'],
    problemTypes:['error-recovery','adoption-barriers'],
    tags:['attribution','blame','causality','internal','external','error'],
    summary:'People explain events by attributing them to internal factors (skill) or external factors (system) — and the attribution shapes future behaviour.',
    description:'When users fail at a task, whether they blame themselves or the system determines whether they retry or abandon.',
    designPrompt:'Write error messages that attribute failure to the system or to correctable external factors — never to user incompetence.',
    whenToUse:'In error flows, onboarding friction points, and any scenario where users may fail and form attributions about why.',
    whyItMatches:'Attribution theory explains why "You entered an invalid value" causes abandonment but an explanatory message causes retry.',
    actions:[
      {title:'Attribute errors externally', description:'Frame errors as system requirements or environmental constraints, not user failures.'},
      {title:'Make retry feel worthwhile', description:'After an error, give users a concrete reason why trying again will work this time.'}
    ],
    antiPatterns:['Error messages that imply user fault','Validation errors with no explanation','Forms that reset on error without explanation'],
    uiPatterns:['Explanatory error messages with next steps','Inline validation with positive attribution framing'],
    examples:['"This field requires DD/MM/YYYY format" — external attribution — drives retry. "Invalid date" — internal attribution — drives abandonment.']
  },
  {
    id:'autonomy-bias', name:'Autonomy Bias', aliases:['Psychological Autonomy','Autonomy Need'],
    icon:'person_play', color:'#E8F8F5', iconColor:'#1A7A64',
    impactLevel:'moderate', baseRelevance:73,
    categories:['Motivation','Control','User Empowerment'],
    disciplines:['social-psychology'],
    contexts:['data-entry-forms','onboarding-learning'],
    problemTypes:['low-engagement','adoption-barriers'],
    tags:['autonomy','control','self-direction','freedom','empowerment'],
    summary:'People have a fundamental psychological need to feel in control of their own choices and actions.',
    description:'Interfaces that remove user control — through forced flows, locked options, or opaque automation — create resistance and reduce engagement.',
    designPrompt:'Always provide a visible escape, override, or manual option alongside any automation. Never remove the illusion of control.',
    whenToUse:'In any system with automation, mandatory flows, or locked states where users feel their agency is constrained.',
    whyItMatches:'Autonomy bias explains why even rarely-used manual overrides dramatically increase user satisfaction — their existence matters more than their use.',
    actions:[
      {title:'Provide visible overrides', description:'Every automation should have a visible manual alternative — even if users rarely use it.'},
      {title:'Explain system decisions', description:'When the system makes a choice on behalf of the user, explain why and offer to change it.'}
    ],
    antiPatterns:['Locked fields with no explanation','Automation with no override option','Forced defaults that cannot be changed'],
    uiPatterns:['Manual override options alongside automations','Editable system-suggested values','Transparent automation with clear override paths'],
    examples:['An auto-filled form field with a visible edit option feels like convenience; the same field locked feels like loss of control — even if users never change it.']
  },
  // NEUROSCIENCE
  {
    id:'mirror-neurons-empathic-design', name:'Mirror Neurons & Empathic Design', aliases:['Empathic Design','Mirror System'],
    icon:'self_improvement', color:'#FFF3E8', iconColor:'#C45D00',
    impactLevel:'moderate', baseRelevance:73,
    categories:['Empathy','Social Cognition','Emotional Design'],
    disciplines:['neuroscience'],
    contexts:['onboarding-learning','collaborative-review'],
    problemTypes:['low-engagement','adoption-barriers'],
    tags:['mirror neurons','empathy','observation','imitation','social brain'],
    summary:'Neurons that fire when performing an action also fire when observing the same action — the neural basis of empathy and imitation learning.',
    description:'Observing others perform tasks activates the same neural pathways as doing the task — making demonstration more effective than instruction.',
    designPrompt:'Show, don\'t tell. Video demonstrations and animated walkthroughs are processed with significantly less cognitive effort than written instructions.',
    whenToUse:'In onboarding, help documentation, and any scenario where users must learn a new behaviour or workflow.',
    whyItMatches:'Mirror neuron activation from observation reduces the cognitive load of learning — watching is neurologically cheaper than reading then imagining.',
    actions:[
      {title:'Use demonstration over description', description:'Replace instructional text with animated demos, video clips, or interactive walkthroughs wherever possible.'},
      {title:'Show real user journeys', description:'Case study walkthroughs of real users completing tasks activate mirror systems and build empathy.'}
    ],
    antiPatterns:['Text-only instructions for visual or procedural tasks','Abstract descriptions of physical interactions'],
    uiPatterns:['Animated feature demos on first encounter','Video walkthroughs in help panels','Interactive product tours with live previews'],
    examples:['An animated walkthrough of a multi-step process is processed with less cognitive load than the same steps written as numbered instructions.']
  },
  // EVOLUTIONARY PSYCHOLOGY
  {
    id:'pattern-recognition-apophenia', name:'Pattern Recognition & Apophenia', aliases:['Apophenia','Pareidolia','Clustering Illusion'],
    icon:'pattern', color:'#EEFAF2', iconColor:'#1A7A4A',
    impactLevel:'moderate', baseRelevance:71,
    categories:['Perception','Data Interpretation','Cognitive Bias'],
    disciplines:['evolutionary-psychology'],
    contexts:['decision-approvals','navigation-search'],
    problemTypes:['risk-misperception','information-overload'],
    tags:['pattern recognition','apophenia','false patterns','randomness','data'],
    summary:'The brain is wired to find patterns — even in random noise — which leads to seeing meaningful trends in meaningless data.',
    description:'Users will construct causal narratives from random variation in data visualisations, creating confident but false conclusions.',
    designPrompt:'Surface statistical significance alongside data. Never show data visualisation without context for what counts as a meaningful pattern.',
    whenToUse:'In data dashboards, analytics tools, and any interface where users interpret visualised data.',
    whyItMatches:'Apophenia explains why users confidently draw wrong conclusions from dashboards — the brain is optimised to find patterns, not to ignore them.',
    actions:[
      {title:'Add statistical context to data', description:'Show confidence intervals, sample sizes, and baseline comparisons alongside all metrics.'},
      {title:'Flag random variation explicitly', description:'When variance is within noise, say so. Don\'t leave users to interpret random fluctuation as a trend.'}
    ],
    antiPatterns:['Data visualisations without confidence ranges','Charts that make random variation look like trends','No baseline comparisons for metrics'],
    uiPatterns:['Confidence interval bands on charts','Statistical significance indicators','Trend comparisons with baseline periods'],
    examples:['A week-on-week chart should indicate whether the difference is statistically significant — otherwise users will act on noise.']
  },
  // INFORMATION THEORY
  {
    id:'shannon-entropy', name:'Shannon Entropy', aliases:["Information Entropy","Shannon's Information Theory"],
    icon:'shuffle', color:'#F5F6FA', iconColor:'#5C5F7A',
    impactLevel:'moderate', baseRelevance:70,
    categories:['Information Density','Cognitive Load','Signal Processing'],
    disciplines:['information-theory'],
    contexts:['navigation-search','data-entry-forms'],
    problemTypes:['information-overload','navigation-fatigue'],
    tags:['entropy','information density','predictability','uncertainty','signal'],
    summary:'Information entropy measures the unpredictability of a system — high entropy means high cognitive load for the receiver.',
    description:'Highly unpredictable interfaces require users to expend more cognitive resources to interpret each new element.',
    designPrompt:'Reduce interface entropy by making behaviour predictable. Every surprise costs working memory.',
    whenToUse:'In navigation design, interaction patterns, and any system where unpredictability creates user overhead.',
    whyItMatches:'Shannon entropy provides a formal framework for why inconsistent, surprising interfaces are harder to use — they are literally higher-entropy systems.',
    actions:[
      {title:'Make interactions predictable', description:'Same action → same result, every time. Reduce the number of exceptions and special cases.'},
      {title:'Reduce information entropy in layouts', description:'Consistent layout patterns allow users to process pages faster because they know where to look.'}
    ],
    antiPatterns:['Contextual menus that change based on hidden state','Inconsistent responses to the same action','Dynamic layouts that rearrange between sessions'],
    uiPatterns:['Consistent navigation patterns across all screens','Predictable state transitions','Stable layout grids'],
    examples:['A navigation menu that shows different items based on hidden context (without explaining why) is high-entropy — users must re-evaluate it every time.']
  },
  {
    id:'occams-razor', name:"Occam's Razor", aliases:['Law of Parsimony','Principle of Simplicity'],
    icon:'cut', color:'#F5F6FA', iconColor:'#5C5F7A',
    impactLevel:'high', baseRelevance:82,
    categories:['Simplicity','Design Principle','Cognitive Load'],
    disciplines:['information-theory','philosophy'],
    contexts:['navigation-search','data-entry-forms','decision-approvals'],
    problemTypes:['information-overload','choice-paralysis'],
    tags:["Occam's razor",'simplicity','parsimony','complexity','reduction'],
    summary:'Among competing explanations or designs, the simplest one that fully satisfies the requirements should be preferred.',
    description:'Every added element, feature, or decision point adds cognitive overhead. The simplest solution that works is always the correct starting point.',
    designPrompt:'Before adding any element, ask: what does this remove? If the answer is nothing, remove the element instead.',
    whenToUse:'At every design decision point — as a default principle for evaluating whether to add, keep, or remove any element.',
    whyItMatches:"Occam's Razor is the meta-principle underlying most cognitive load reduction. Simpler = less load, always.",
    actions:[
      {title:'Apply subtractive design', description:'For every feature request, ask first whether removing an existing element achieves the same goal.'},
      {title:'Audit for redundancy ruthlessly', description:'Regularly remove features, labels, and UI elements that users have not engaged with.'}
    ],
    antiPatterns:['Adding features without removing others','Keeping redundant options "just in case"','Complexity added through feature accumulation'],
    uiPatterns:['Minimal viable interfaces with progressive complexity','Regular simplification audits','Feature usage tracking to justify retention'],
    examples:['A settings screen with 40 options should be audited against usage data — in most cases, 80% of users interact with fewer than 8 options.']
  },
  // LINGUISTICS
  {
    id:'sapir-whorf-hypothesis', name:'Sapir-Whorf Hypothesis', aliases:['Linguistic Relativity','Language Shapes Thought'],
    icon:'translate', color:'#FFF0F5', iconColor:'#C4006A',
    impactLevel:'moderate', baseRelevance:73,
    categories:['Language','Cognition','Mental Models'],
    disciplines:['linguistics'],
    contexts:['onboarding-learning','data-entry-forms'],
    problemTypes:['adoption-barriers','information-overload'],
    tags:['Sapir-Whorf','linguistic relativity','language','mental model','terminology'],
    summary:'The language we use shapes how we think about and categorise the world — different terminology creates different mental models.',
    description:'The words your interface uses to label categories and actions directly shape the mental model users build of your system.',
    designPrompt:'Choose your UI vocabulary with the same care as your visual design. Labels are architecture — they constrain how users think.',
    whenToUse:'In information architecture, navigation design, and any interface where the naming of categories and actions determines how users conceptualise the system.',
    whyItMatches:'Sapir-Whorf explains why renaming a feature category often changes user behaviour more than redesigning its visual appearance.',
    actions:[
      {title:'Source terminology from users', description:'Use language users already use to describe the domain — not internal system or engineering terminology.'},
      {title:'Test labels for mental model alignment', description:'Ask users to sort items labelled with your proposed terminology — does the grouping match your intended IA?'}
    ],
    antiPatterns:['Using engineering-derived labels in user-facing navigation','Naming features after internal codenames','Inconsistent terminology between marketing and product'],
    uiPatterns:['User-research-sourced navigation labels','Consistent vocabulary across all touchpoints','Terminology glossaries in onboarding'],
    examples:['Whether a section is called "Orders", "Requests", or "Submissions" fundamentally changes what users expect to find in it — the word is the mental model.']
  },
  // ANTHROPOLOGY
  {
    id:'ritual-theory', name:'Ritual Theory', aliases:['Ritual Design','Ritualistic Behaviour'],
    icon:'celebration', color:'#FFF5E8', iconColor:'#A05000',
    impactLevel:'moderate', baseRelevance:68,
    categories:['Habit Formation','Engagement','Cultural Design'],
    disciplines:['anthropology'],
    contexts:['onboarding-learning','data-entry-forms'],
    problemTypes:['low-engagement','adoption-barriers'],
    tags:['ritual','habit','ceremony','routine','engagement'],
    summary:'Rituals — structured, repeated sequences of action — create meaning, identity, and strong habitual bonds.',
    description:'Designing deliberate rituals into digital products creates strong habitual use patterns and emotional attachment.',
    designPrompt:'Identify the daily or weekly routine use case for your product. Design it as a ritual — consistent, distinctive, meaningful.',
    whenToUse:'In products intended for recurring daily use where habit formation is a key success metric.',
    whyItMatches:'Ritual theory explains why certain products become habits while functionally equivalent alternatives are forgotten — ritualised design creates identity, not just utility.',
    actions:[
      {title:'Design for the recurring use case', description:'Identify the use case that will repeat most frequently and make it as smooth and distinctive as possible.'},
      {title:'Create meaningful opening moments', description:'The start of each session should feel consistent and intentional — a ritual opener that cues habitual use.'}
    ],
    antiPatterns:['Changing core UX patterns between app versions','Inconsistent onboarding across user cohorts','No deliberate design for recurring use'],
    uiPatterns:['Consistent daily entry points','Session-opening summaries that feel like ritual greetings','Progress streaks and recurring milestone acknowledgements'],
    examples:['A daily lab logging tool with a consistent "Good morning, here\'s today\'s checklist" opener builds ritual — users return because the routine feels familiar.']
  },
  {
    id:'distributed-cognition-ext', name:'Cultural Schema Theory', aliases:['Cultural Schemata','Cross-Cultural Design'],
    icon:'public', color:'#FFF5E8', iconColor:'#A05000',
    impactLevel:'moderate', baseRelevance:71,
    categories:['Cultural Context','Mental Models','Global Design'],
    disciplines:['anthropology'],
    contexts:['onboarding-learning','navigation-search'],
    problemTypes:['adoption-barriers','information-overload'],
    tags:['culture','schema','cross-cultural','globalisation','mental model'],
    summary:'Cultural background shapes the schemas users apply to interpret interfaces — the same design can mean different things across cultures.',
    description:'Interface metaphors, colour meanings, and interaction conventions that feel intuitive in one culture can be opaque or offensive in another.',
    designPrompt:'Audit every metaphor, colour, and icon for cultural portability. What feels universal is often deeply local.',
    whenToUse:'When designing products for users across multiple cultural or geographic contexts.',
    whyItMatches:'Cultural schema theory explains why a design that tests perfectly with one user group can fail completely with another.',
    actions:[
      {title:'Test with culturally diverse users', description:'Usability testing with users from different cultural backgrounds must be a standard practice, not an afterthought.'},
      {title:'Audit cultural assumptions in metaphors', description:'Every visual metaphor (folder, envelope, cart) carries cultural assumptions that may not translate.'}
    ],
    antiPatterns:['Assuming visual metaphors are universal','Designing exclusively with users from one cultural context','Translating language without translating cultural context'],
    uiPatterns:['Culture-neutral iconography where possible','Localisation that goes beyond translation','Regional user testing in diverse markets'],
    examples:['A thumbs-up icon is positive in most Western markets but can be offensive in others — cultural schema testing before launch prevents this.']
  },
  {
    id:'gift-economy-reciprocity', name:'Gift Economy & Reciprocity', aliases:['Mauss Reciprocity','Gift Exchange Theory'],
    icon:'card_giftcard', color:'#FFF5E8', iconColor:'#A05000',
    impactLevel:'moderate', baseRelevance:69,
    categories:['Reciprocity','Engagement','Trust Building'],
    disciplines:['anthropology','social-psychology'],
    contexts:['onboarding-learning','decision-approvals'],
    problemTypes:['low-engagement','adoption-barriers'],
    tags:['gift economy','reciprocity','Mauss','giving','social obligation'],
    summary:'In all human cultures, gifts create social obligations — receiving something creates a felt need to give in return.',
    description:'Digital products that give generously before asking receive significantly higher engagement and conversion in return.',
    designPrompt:'Calculate what you give before what you ask. Your free offer should feel genuinely valuable, not like a calculated hook.',
    whenToUse:'In freemium products, onboarding flows, and any scenario where the product needs to earn the right to ask for something.',
    whyItMatches:'Gift economy theory explains why generous free tiers outperform restrictive trials — the gift creates social obligation to reciprocate with commitment.',
    actions:[
      {title:'Give before you ask', description:'Provide meaningful value — tools, insights, saved time — before requesting sign-up, data, or payment.'},
      {title:'Make gifts feel genuine', description:'Gifts that feel calculated reduce rather than increase reciprocity. The give must feel ungated.'}
    ],
    antiPatterns:['Free tiers so restricted they create frustration rather than gratitude','Immediately asking for data after a free offer'],
    uiPatterns:['Generous free tier features','Value delivery before paywall','Insight or output delivery before account creation'],
    examples:['A tool that delivers a genuinely useful result before asking users to create an account creates stronger reciprocal obligation than a feature-limited trial.']
  },
  // PHILOSOPHY
  {
    id:'signifiers-vs-affordances', name:'Signifiers vs Affordances', aliases:['Norman Signifiers','Perceived Affordances'],
    icon:'touch_app', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'high', baseRelevance:85,
    categories:['Interaction Design','Discoverability','Affordances'],
    disciplines:['philosophy','ux-design'],
    contexts:['navigation-search','data-entry-forms'],
    problemTypes:['navigation-fatigue','error-prone-input','adoption-barriers'],
    tags:['signifier','affordance','Norman','perceived affordance','discoverability'],
    summary:'Affordances are action possibilities; signifiers are the signals that communicate those affordances. Without signifiers, affordances are invisible.',
    description:'An affordance that has no signifier does not exist in the user\'s mental model — it will not be discovered or used.',
    designPrompt:'For every affordance in your interface: what is the signifier? If you can\'t name it, the affordance is invisible.',
    whenToUse:'When evaluating whether interactive elements are discoverable — particularly in minimal or icon-heavy interfaces.',
    whyItMatches:'The signifiers/affordances distinction explains why "clean" interfaces with implicit interactions are consistently underperformed — the affordances exist but users can\'t see them.',
    actions:[
      {title:'Name signifiers explicitly', description:'For every interactive element, identify the visual or textual signal that communicates its affordance.'},
      {title:'Test for discoverability', description:'Ask users to find a feature without guidance. If they can\'t find it, the signifier is failing.'}
    ],
    antiPatterns:['Icon-only navigation without labels','Interactive elements that look like static decorations','Hidden gestures with no signifier'],
    uiPatterns:['Labelled interactive elements','Hover states that reveal affordances','Persistent visible signifiers for primary actions'],
    examples:['A gesture-based navigation with no visible indicator is an affordance without a signifier — users cannot discover what they cannot perceive.']
  },
  {
    id:'wittgensteins-language-games', name:"Wittgenstein's Language Games", aliases:['Language Games','Meaning as Use'],
    icon:'menu_book', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'moderate', baseRelevance:70,
    categories:['Language','Context','Meaning Making'],
    disciplines:['philosophy','linguistics'],
    contexts:['onboarding-learning','data-entry-forms'],
    problemTypes:['adoption-barriers','information-overload'],
    tags:['Wittgenstein','language games','meaning','context','usage'],
    summary:"Word meaning is determined by use within a community, not by abstract definition — context is everything.",
    description:'The same term means different things in different professional or cultural contexts. Interface language must match the specific language game of the target user community.',
    designPrompt:'Don\'t define your terms — find the terms your users already use and use them. Meaning is use, not definition.',
    whenToUse:'In any interface serving a specific professional community with its own established vocabulary.',
    whyItMatches:"Wittgenstein's framework explains why technically correct but professionally unfamiliar terminology fails — it's not playing the right language game.",
    actions:[
      {title:'Embed in user vocabulary', description:'Conduct interviews specifically to capture the language users use naturally for your domain concepts.'},
      {title:'Respect community terminology', description:'Professional communities have established language games. Using their terms signals belonging; using alien terms signals outsider status.'}
    ],
    antiPatterns:['Imposing product terminology over established domain vocabulary','Defining terms that users already have their own word for'],
    uiPatterns:['Domain-specific vocabulary in all labels','User-research-derived navigation language','Contextual terminology help that explains system terms in domain terms'],
    examples:['A platform serving finance professionals that uses "transactions" where they say "trades" is playing the wrong language game — the mismatch creates friction.']
  },
  {
    id:'heideggers-ready-to-hand', name:"Heidegger's Ready-to-Hand", aliases:['Ready-to-Hand','Present-at-Hand','Tool Transparency'],
    icon:'build', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'high', baseRelevance:78,
    categories:['Tool Transparency','Flow State','Cognitive Load'],
    disciplines:['philosophy'],
    contexts:['data-entry-forms','navigation-search'],
    problemTypes:['slow-task-completion','adoption-barriers'],
    tags:['Heidegger','ready-to-hand','tool','transparency','flow','invisible interface'],
    summary:'Tools in skilled use become transparent — they disappear from consciousness and the user focuses entirely on the goal.',
    description:'The best interface is one the user stops thinking about. Friction breaks the "ready-to-hand" state and forces the tool itself into attention.',
    designPrompt:'Design for invisibility. Every moment a user thinks about the interface, they are not thinking about their work.',
    whenToUse:'In task-focused productivity tools where deep work and flow state are the goal.',
    whyItMatches:"Heidegger's framework explains why friction is so cognitively costly — it breaks the ready-to-hand state and forces the tool into conscious attention.",
    actions:[
      {title:'Remove interface friction from expert flows', description:'For experienced users, every dialog, confirmation, and interruption breaks the ready-to-hand state. Minimise ruthlessly.'},
      {title:'Invest in keyboard and shortcut access', description:'Expert users who have internalised the tool need frictionless access that bypasses visual interface entirely.'}
    ],
    antiPatterns:['Mandatory confirmation dialogs for routine expert tasks','Forced onboarding interruptions for experienced users','Interface elements that draw attention to themselves'],
    uiPatterns:['Progressive reduction of interface chrome for expert users','Keyboard shortcuts for all primary actions','Distraction-free modes for focused workflows'],
    examples:['A data analyst who has to click through three confirmation dialogs for routine operations is forced to think about the tool instead of their analysis.']
  },
  {
    id:'merleau-pontys-body-schema', name:"Merleau-Ponty's Body Schema", aliases:['Body Schema','Embodied Interface','Extended Body'],
    icon:'accessibility_new', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'moderate', baseRelevance:72,
    categories:['Embodied Cognition','Motor Learning','Interaction Design'],
    disciplines:['philosophy','neuroscience'],
    contexts:['onboarding-learning','data-entry-forms'],
    problemTypes:['adoption-barriers','slow-task-completion'],
    tags:['Merleau-Ponty','body schema','embodied','motor','gesture','tool extension'],
    summary:'The body\'s schema extends to include tools in skilled use — a practised tool becomes felt as an extension of the body, not a separate object.',
    description:'Interfaces that become "body-like" through practice are used with near-zero conscious cognitive load — the skill becomes embodied.',
    designPrompt:'Design for the moment when the interface disappears into muscle memory. Consistent interaction patterns are the prerequisite for embodied mastery.',
    whenToUse:'In tools that professionals use repeatedly for years — where transition from conscious to automatic use is a key UX milestone.',
    whyItMatches:"Merleau-Ponty's body schema explains why expert users resist interface changes so strongly — they're not resisting learning; they're resisting un-embodying a skill.",
    actions:[
      {title:'Stabilise core interaction patterns', description:'The foundational interactions of a professional tool should never change — they are being built into muscle memory.'},
      {title:'Provide keyboard and gesture alternatives', description:'Keyboard shortcuts and consistent gestures allow the interface to become embodied — click-based flows do not.'}
    ],
    antiPatterns:['Changing keyboard shortcuts between versions','Reorganising navigation that expert users have internalised','Removing established interaction patterns without replacement'],
    uiPatterns:['Stable, version-persistent keyboard shortcuts','Consistent gesture vocabulary','Customisable toolbars that users can stabilise to their own body schema'],
    examples:['Expert users of a spreadsheet tool have its keyboard shortcuts embodied — changing them is felt as physical disorientation, not just inconvenience.']
  },
  {
    id:'alan-kays-simplicity', name:"Alan Kay's Simplicity Principle", aliases:['Simple Things Simple','Simplicity Spectrum'],
    icon:'balance', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'high', baseRelevance:80,
    categories:['Design Principle','Simplicity','Cognitive Load'],
    disciplines:['philosophy','information-theory'],
    contexts:['onboarding-learning','navigation-search','data-entry-forms'],
    problemTypes:['information-overload','choice-paralysis','adoption-barriers'],
    tags:["Alan Kay",'simplicity','power','novice','expert','design philosophy'],
    summary:'"Simple things should be simple; complex things should be possible." The best systems make easy things easy and hard things achievable.',
    description:'Good design serves both the novice who needs simplicity and the expert who needs power — failing either group is a design failure.',
    designPrompt:'Design your product at two levels: one interaction for the common case (simple), one path for the expert case (powerful). Neither should compromise the other.',
    whenToUse:'In any product serving both novice and expert users — which is most enterprise and productivity software.',
    whyItMatches:"Alan Kay's principle explains why expert-only tools feel alienating to beginners, and why over-simplified tools feel limiting to experts — both are design failures.",
    actions:[
      {title:'Design the simple path first', description:'Identify the most common 20% of use cases. Make those require zero learning. Then design the power features.'},
      {title:'Layer complexity progressively', description:'Build from simple to complex — the novice path is the foundation on which expert features are layered.'}
    ],
    antiPatterns:['Forcing expert complexity onto novices','Hiding power features so deeply that experts can\'t find them','Designing only for the average user'],
    uiPatterns:['Progressive complexity from simple to advanced','Expert shortcuts that don\'t interrupt novice flows','Mode-based interfaces that reveal complexity gradually'],
    examples:['A data tool that shows a simple 3-field form for common cases and an "Advanced" mode for complex configurations serves both users without compromising either.']
  }
];

const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const existingIds = new Set(raw.principles.map(p => p.id));
const toAdd = NEW.filter(p => !existingIds.has(p.id));
const all = [...raw.principles, ...toAdd];
all.forEach((p, i) => { p.number = String(i + 1).padStart(2, '0'); });
fs.writeFileSync(DATA_PATH, JSON.stringify({ principles: all }, null, 2));
console.log(`Done. Added ${toAdd.length} principles. Total: ${all.length}`);
