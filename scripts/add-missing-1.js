#!/usr/bin/env node
// add-missing-1.js — Behavioral Economics + Cognitive Psychology additions
// Run: node scripts/add-missing-1.js
const fs = require('fs'), path = require('path');
const DATA_PATH = path.join(__dirname, '../data/principles-v2.json');

const NEW = [
  {
    id:'nudge-theory', name:'Nudge Theory', aliases:['Choice Architecture','Libertarian Paternalism'],
    icon:'route', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'high', baseRelevance:88,
    categories:['Behaviour Change','Default Design','Decision Architecture'],
    disciplines:['behavioral-economics'],
    contexts:['data-entry-forms','onboarding-learning','decision-approvals'],
    problemTypes:['choice-paralysis','low-engagement'],
    tags:['nudge','defaults','choice architecture','friction reduction'],
    summary:'Small environmental changes predictably alter behaviour without restricting freedom of choice.',
    description:'Cognitive load is reduced when the environment is structured so the best option is also the easiest option.',
    designPrompt:'Structure the environment so the desired action is the path of least resistance. Remove friction from good choices; add it to harmful ones.',
    whenToUse:'When users need to be guided toward better choices without being forced — onboarding, consent flows, and default settings.',
    whyItMatches:'Nudge theory is strongest when users are prone to inertia or overwhelm and the designer knows what the optimal choice is.',
    actions:[
      {title:'Engineer default states', description:'Set defaults to the optimal choice for most users. Opt-out beats opt-in for beneficial behaviours.'},
      {title:'Reduce friction on beneficial paths', description:'Make the recommended path require fewer clicks and less cognitive effort than alternatives.'}
    ],
    antiPatterns:['Nudging toward options that benefit the business but not the user','Dark patterns disguised as nudges'],
    uiPatterns:['Pre-selected recommended options','Friction on opt-out flows','Benefit-first prompts before requests'],
    examples:['Pre-selecting the recommended tier in a pricing screen — users can change it, but rarely do.']
  },
  {
    id:'prospect-theory', name:'Prospect Theory', aliases:['Kahneman-Tversky Model'],
    icon:'show_chart', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'high', baseRelevance:85,
    categories:['Risk Perception','Decision Making','Framing'],
    disciplines:['behavioral-economics'],
    contexts:['risk-communication','decision-approvals'],
    problemTypes:['choice-paralysis','risk-misperception'],
    tags:['prospect theory','gains','losses','risk','value function'],
    summary:'People evaluate outcomes relative to a reference point and are more sensitive to losses than equivalent gains.',
    description:'Losses feel approximately twice as impactful as gains of the same size — the psychological value curve is asymmetric.',
    designPrompt:'Anchor all risk communication to a reference point. Frame losses explicitly — users feel them more acutely than gains.',
    whenToUse:'When communicating risk, pricing, plan comparisons, or any scenario where users weigh gains against losses.',
    whyItMatches:'Prospect theory explains why users react disproportionately to warnings, fees, and potential losses.',
    actions:[
      {title:'Establish a clear reference point', description:'Always show users where they are starting from before introducing gain/loss framing.'},
      {title:'Frame critical information as loss prevention', description:'When stakes are high, reframe gains as avoiding losses for stronger motivational effect.'}
    ],
    antiPatterns:['Ignoring the reference point in pricing comparisons','Using gain framing where loss framing would better motivate action'],
    uiPatterns:['Before/after comparisons anchored to current state','Savings framed as costs avoided'],
    examples:['Upgrade screens that show "You\'ll lose these features if you downgrade" outperform purely gain-framed versions.']
  },
  {
    id:'mental-accounting', name:'Mental Accounting', aliases:['Psychological Accounting'],
    icon:'account_balance_wallet', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'moderate', baseRelevance:78,
    categories:['Value Perception','Decision Making','Categorisation'],
    disciplines:['behavioral-economics'],
    contexts:['decision-approvals','data-entry-forms'],
    problemTypes:['choice-paralysis','value-misperception'],
    tags:['mental accounting','budgets','value','categorisation','pricing'],
    summary:'People categorise money and resources into mental "accounts" and treat equivalent amounts differently depending on perceived source.',
    description:'A feature\'s perceived value changes based on which mental budget category it maps to in the user\'s mind.',
    designPrompt:'Frame costs relative to mental accounts your users already hold. Align pricing to how users already think about categories of spend.',
    whenToUse:'In pricing, upsell flows, cost-benefit displays, and any scenario where the user must justify a cost to themselves.',
    whyItMatches:'Mental accounting explains why the same amount feels cheap or expensive depending on context and framing.',
    actions:[
      {title:'Align to existing spend categories', description:'Frame product costs relative to categories users already budget for.'},
      {title:'Separate costs cognitively', description:'Bundle features into named groups that map to distinct user value categories.'}
    ],
    antiPatterns:['Presenting all costs as a single line item','Ignoring the user\'s existing mental budget categories'],
    uiPatterns:['Cost-per-unit breakdowns','Feature bundles named by job role or outcome'],
    examples:['Breaking an annual subscription cost into a per-run cost maps it to an operational budget — not a capital one.']
  },
  {
    id:'endowment-effect', name:'Endowment Effect', aliases:['Ownership Bias'],
    icon:'inventory_2', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'moderate', baseRelevance:76,
    categories:['Ownership Psychology','Retention','Value Perception'],
    disciplines:['behavioral-economics'],
    contexts:['onboarding-learning','decision-approvals'],
    problemTypes:['low-engagement','adoption-barriers'],
    tags:['ownership','endowment','free trial','retention','perceived value'],
    summary:'People value things more highly once they own them — even briefly. Ownership increases perceived worth.',
    description:'Giving users a sense of ownership before a commitment dramatically increases willingness to continue and reduces churn.',
    designPrompt:'Let users experience ownership before the ask. Free trials, saved work, and personalised configurations all create endowment.',
    whenToUse:'In trial-to-paid conversion flows, onboarding, and any scenario where early investment increases commitment.',
    whyItMatches:'The endowment effect explains why users who\'ve invested effort in a product are harder to churn — loss aversion applies to their ownership.',
    actions:[
      {title:'Create early ownership moments', description:'Let users name things, customise views, or save work before the paywall moment.'},
      {title:'Surface their investment', description:'Remind users what they\'ve built or configured — making the cost of leaving visible.'}
    ],
    antiPatterns:['Asking for commitment before users have any stake','Resetting progress or preferences after trial expiry'],
    uiPatterns:['Named workspaces and saved configurations','Progress indicators showing user-built data'],
    examples:['A system that lets users build their own configuration during a trial creates endowment — losing it on expiry is felt as a loss, not a missed gain.']
  },
  {
    id:'present-bias', name:'Present Bias', aliases:['Hyperbolic Discounting','Temporal Discounting'],
    icon:'schedule', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'high', baseRelevance:82,
    categories:['Temporal Reasoning','Motivation','Decision Making'],
    disciplines:['behavioral-economics'],
    contexts:['onboarding-learning','decision-approvals'],
    problemTypes:['low-engagement','slow-task-completion'],
    tags:['present bias','immediate reward','procrastination','time preference'],
    summary:'People disproportionately prefer immediate rewards over future ones, even when the future reward is objectively larger.',
    description:'Long-term benefits are heavily discounted in user decision-making. Immediate feedback loops and quick wins are essential to motivation.',
    designPrompt:'Make the immediate benefit of any action visible at the moment of decision. Long-term payoffs must be made tangible now.',
    whenToUse:'In habit formation, onboarding, and any task that requires deferred gratification or sustained effort.',
    whyItMatches:'Present bias explains why describing long-term benefits fails to motivate immediate adoption — the payoff feels too distant.',
    actions:[
      {title:'Surface immediate value', description:'Show what the user gets right now from completing a step — not what they get in 3 months.'},
      {title:'Build fast feedback loops', description:'Provide instant confirmation, progress indicators, and immediate micro-rewards after each action.'}
    ],
    antiPatterns:['Describing only long-term benefits in onboarding','Delayed confirmation messages'],
    uiPatterns:['Instant progress feedback','Quick-win completion states','Time-bounded prompts with immediate rewards'],
    examples:['"Your first report is ready now" shown immediately after setup outperforms a description of long-term reporting benefits.']
  },
  {
    id:'scarcity-heuristic', name:'Scarcity Heuristic', aliases:['Scarcity Effect','Scarcity Principle'],
    icon:'hourglass_bottom', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'high', baseRelevance:80,
    categories:['Urgency','Value Perception','Decision Making'],
    disciplines:['behavioral-economics'],
    contexts:['decision-approvals','data-entry-forms'],
    problemTypes:['low-engagement','choice-paralysis'],
    tags:['scarcity','urgency','FOMO','limited availability'],
    summary:'People value things more when they are rare or diminishing in availability.',
    description:'Scarcity signals trigger faster decision-making by increasing perceived value — but misuse damages trust irreparably.',
    designPrompt:'Use scarcity only when it is genuine. False scarcity destroys trust the moment users discover it.',
    whenToUse:'When limited availability is real and relevant to the user\'s decision. Never fabricate scarcity.',
    whyItMatches:'The scarcity heuristic accelerates decisions by making inaction feel costly — useful in genuine deadline or capacity scenarios.',
    actions:[
      {title:'Surface genuine constraints', description:'If capacity or availability genuinely limits options, surface this clearly and honestly.'},
      {title:'Time-bound offers transparently', description:'Explain exactly why an offer has a deadline — transparency preserves trust.'}
    ],
    antiPatterns:['Fabricated countdown timers','Artificial stock limits','Urgency cues that reset on page refresh'],
    uiPatterns:['Genuine availability indicators','Deadline explanations with context','Waitlist flows for truly limited access'],
    examples:['Showing "Certification intake closes this quarter on Friday" when that is genuinely true — not a fabricated deadline.']
  },
  {
    id:'recency-bias', name:'Recency Bias', aliases:['Recency Effect','Recency Heuristic'],
    icon:'history', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'moderate', baseRelevance:77,
    categories:['Memory','Decision Making','Risk Perception'],
    disciplines:['behavioral-economics','cognitive-psychology'],
    contexts:['decision-approvals','navigation-search'],
    problemTypes:['information-overload','risk-misperception'],
    tags:['recency','memory','recent events','weighting','decision bias'],
    summary:'People give disproportionate weight to recent events when making judgements about probability or performance.',
    description:'The most recent interaction with a system shapes the user\'s overall perception, overriding a longer history.',
    designPrompt:'Design your most recent touchpoints with the user as carefully as your first. The last interaction defines current perception.',
    whenToUse:'When designing notifications, summary screens, and any post-task or end-of-session experience.',
    whyItMatches:'Recency bias explains why a single bad recent experience can override many previous positive ones — and why end states matter.',
    actions:[
      {title:'Optimise end states', description:'The last screen a user sees in a session shapes their perception of the whole session. Design it deliberately.'},
      {title:'Use recent history as context', description:'Surface recently accessed items prominently — they feel most relevant because they\'re most mentally available.'}
    ],
    antiPatterns:['Ignoring end-of-task states','Generic "completed" confirmations after complex tasks'],
    uiPatterns:['Recently accessed items in navigation','Session end summaries','Deliberate closing screens after complex workflows'],
    examples:['A system that surfaces the last 3 accessed records on the dashboard reduces recall effort and feels immediately contextual.']
  },
  {
    id:'commitment-consistency-bias', name:'Commitment & Consistency Bias', aliases:['Consistency Bias','Commitment Bias'],
    icon:'verified', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'moderate', baseRelevance:79,
    categories:['Behaviour Change','Motivation','Social Psychology'],
    disciplines:['behavioral-economics','social-psychology'],
    contexts:['onboarding-learning','decision-approvals'],
    problemTypes:['low-engagement','adoption-barriers'],
    tags:['commitment','consistency','foot-in-the-door','escalation','follow-through'],
    summary:'Once people commit to something, they are strongly motivated to behave consistently with that commitment.',
    description:'Small initial commitments create psychological pressure to follow through with larger subsequent actions.',
    designPrompt:'Start with the smallest possible commitment. Each small agreement creates momentum toward larger ones.',
    whenToUse:'In onboarding flows, multi-step forms, and any scenario where completion rates need to increase.',
    whyItMatches:'Commitment bias explains why progressive micro-commitments outperform single large asks in conversion and adoption.',
    actions:[
      {title:'Use foot-in-the-door sequencing', description:'Start with a small, easy commitment. Use it as a stepping stone to progressively larger ones.'},
      {title:'Make commitments explicit', description:'Naming and surfacing prior commitments reinforces consistency pressure toward next steps.'}
    ],
    antiPatterns:['Asking for large commitments before establishing rapport','Not referencing prior commitments when prompting next steps'],
    uiPatterns:['Progressive onboarding steps that reference previous choices','Goal-setting screens early in flows'],
    examples:['An onboarding flow that asks "What\'s your primary goal?" in step 1 and references that goal in step 5 leverages consistency pressure.']
  },
  {
    id:'wysiati', name:'WYSIATI', aliases:['What You See Is All There Is','Narrative Fallacy'],
    icon:'visibility', color:'#FFF8E5', iconColor:'#C98B0A',
    impactLevel:'high', baseRelevance:83,
    categories:['Cognitive Shortcuts','Information Processing','Risk Perception'],
    disciplines:['behavioral-economics','cognitive-psychology'],
    contexts:['decision-approvals','data-entry-forms','risk-communication'],
    problemTypes:['information-overload','risk-misperception'],
    tags:['WYSIATI','narrative','missing information','coherence','context'],
    summary:'The mind constructs coherent narratives from available information, ignoring what it doesn\'t know it\'s missing.',
    description:'Users build confident mental models from incomplete data — they don\'t know what they haven\'t seen.',
    designPrompt:'Surface what users need to know, not just what they asked for. Design for the information they don\'t know they\'re missing.',
    whenToUse:'In data dashboards, decision support tools, and any interface where incomplete information could lead to confident but wrong conclusions.',
    whyItMatches:'WYSIATI explains why dashboards can be dangerous — they create confidence from whatever is displayed, even when key data is absent.',
    actions:[
      {title:'Signal data completeness', description:'Always show data coverage, date ranges, and missing values explicitly. Never let absence read as zero.'},
      {title:'Add what-you-might-not-know context', description:'Proactively surface related data or caveats alongside key metrics.'}
    ],
    antiPatterns:['Dashboards that hide missing data behind blank cells','Metrics displayed without coverage context'],
    uiPatterns:['Data freshness indicators','Missing data placeholders with explanations','Confidence intervals alongside metrics'],
    examples:['"Based on 3 of 7 reporting regions — 4 not yet submitted" prevents confident but incomplete decisions.']
  },
  {
    id:'schema-theory', name:'Schema Theory', aliases:['Mental Schemas','Cognitive Schemas'],
    icon:'account_tree', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'high', baseRelevance:86,
    categories:['Mental Models','Pattern Recognition','Cognitive Load'],
    disciplines:['cognitive-psychology'],
    contexts:['onboarding-learning','navigation-search','data-entry-forms'],
    problemTypes:['adoption-barriers','information-overload'],
    tags:['schema','mental model','pattern','expectation','familiarity'],
    summary:'Knowledge is organised into structured mental frameworks (schemas) that shape perception, interpretation, and expectation.',
    description:'Interfaces that violate existing schemas require users to rebuild mental frameworks — a high-load process.',
    designPrompt:'Identify the schemas your users bring from existing tools. Design to extend them, not replace them.',
    whenToUse:'In any interface where users are experienced professionals with established mental models of how their domain works.',
    whyItMatches:'Schema-consistent design is processed automatically (System 1). Schema-violating design forces effortful relearning (System 2).',
    actions:[
      {title:'Audit existing user schemas', description:'Research what tools and workflows users already know. Design to match or clearly extend those patterns.'},
      {title:'Use familiar terminology', description:'Adopt the language of your user\'s domain — not the language of your engineering team.'}
    ],
    antiPatterns:['Renaming familiar concepts with novel terminology','Ignoring domain-specific schemas in enterprise tools'],
    uiPatterns:['Domain-familiar navigation structures','Terminology sourced from user research','Onboarding flows that build on existing knowledge'],
    examples:['A system that uses industry-standard terminology matches practitioner schemas exactly — internal system names create schema conflict.']
  },
  {
    id:'webers-law', name:"Weber's Law", aliases:['Just Noticeable Difference','JND'],
    icon:'tune', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'moderate', baseRelevance:74,
    categories:['Perception','Thresholds','Change Detection'],
    disciplines:['cognitive-psychology'],
    contexts:['data-entry-forms','navigation-search'],
    problemTypes:['change-detection-failure','information-overload'],
    tags:['Weber','JND','perception threshold','change detection','signal'],
    summary:'The smallest detectable change is a constant proportion of the original stimulus, not a fixed amount.',
    description:'Small UI changes relative to a large visual baseline go unnoticed. Changes must be proportionally significant to register.',
    designPrompt:'Make changes proportionally visible — a 1px border change is invisible; a colour shift or size change registers.',
    whenToUse:'When designing state changes, progress indicators, or feedback animations where the user must notice a change.',
    whyItMatches:"Weber's Law explains why subtle UI feedback fails — the change must be large relative to the baseline to cross the perception threshold.",
    actions:[
      {title:'Use proportionally significant changes', description:'State changes, hover effects, and progress indicators must be visually dramatic enough to register.'},
      {title:'Test noticeability explicitly', description:'User-test all state transitions: can users actually see the change?'}
    ],
    antiPatterns:['Tiny colour-shift feedback on dark backgrounds','1px border changes to indicate state','Progress bars that don\'t visibly move for small increments'],
    uiPatterns:['High-contrast state change indicators','Proportionally scaled progress feedback','Animation on state transitions'],
    examples:['A progress bar with a clearly moving fill — not a subtle shift on a grey bar that users miss.']
  },
  {
    id:'interference-theory', name:'Interference Theory', aliases:['Proactive Interference','Retroactive Interference'],
    icon:'compare_arrows', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'moderate', baseRelevance:76,
    categories:['Memory','Learning','Error Prevention'],
    disciplines:['cognitive-psychology'],
    contexts:['onboarding-learning','data-entry-forms'],
    problemTypes:['error-prone-input','adoption-barriers'],
    tags:['interference','memory','forgetting','conflict','proactive','retroactive'],
    summary:'Memory is disrupted when new and old information conflict — old learning interferes with new, and vice versa.',
    description:'When users learn a new interface that conflicts with a previous one, both are recalled less accurately.',
    designPrompt:'When replacing familiar patterns, explicitly contrast old vs new. Don\'t assume old habits will be overwritten cleanly.',
    whenToUse:'In redesigns, migrations, or any flow where users are transitioning from an established system to a new one.',
    whyItMatches:'Interference theory predicts the error spike seen after interface redesigns — users blend old and new memories incorrectly.',
    actions:[
      {title:'Contrast old and new explicitly', description:'During transitions, show users what changed and why — don\'t leave them to relearn through errors.'},
      {title:'Introduce changes sequentially', description:'Change one major pattern at a time to minimise the interference surface.'}
    ],
    antiPatterns:['Full redesigns launched without transition guides','Mixing old and new patterns in the same interface'],
    uiPatterns:['"What\'s new" callouts on changed patterns','Side-by-side old vs new onboarding','Gradual migration flows'],
    examples:['When a navigation structure changes, a "Where did X go?" overlay for the first 3 sessions dramatically reduces errors.']
  },
  {
    id:'disfluency-effect', name:'Disfluency Effect', aliases:['Desirable Difficulty','Processing Difficulty Effect'],
    icon:'text_fields', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'moderate', baseRelevance:71,
    categories:['Learning','Memory','Cognitive Effort'],
    disciplines:['cognitive-psychology'],
    contexts:['onboarding-learning','risk-communication'],
    problemTypes:['adoption-barriers','error-prone-input'],
    tags:['disfluency','desirable difficulty','retention','readability','cognitive effort'],
    summary:'Slightly harder-to-process information is retained better, because it forces deeper cognitive engagement.',
    description:'Extreme clarity reduces retention. A small amount of processing friction drives deeper encoding — but only in non-critical task flows.',
    designPrompt:'Reserve intentional friction for learning moments only. Never add disfluency to task-critical paths.',
    whenToUse:'In onboarding, training flows, and content designed for long-term retention — not for task completion flows.',
    whyItMatches:'Disfluency improves retention in learning contexts but adds unnecessary load in task execution. Context determines whether it helps or hurts.',
    actions:[
      {title:'Add friction only in learning contexts', description:'Quizzes and reflective prompts improve retention in onboarding but should never appear in task flows.'},
      {title:'Test retention, not just completion', description:'Measure whether users remember what they learned — not just whether they clicked through.'}
    ],
    antiPatterns:['Adding difficulty to task-critical paths to "encourage thought"','Applying disfluency to error messages or instructions'],
    uiPatterns:['Spaced recall prompts in onboarding','Reflective questions mid-tutorial','Intentional pauses in learning flows'],
    examples:['A training flow that includes a "What did you just learn?" prompt after each section improves 7-day retention significantly.']
  },
  {
    id:'paradox-of-expertise', name:'Paradox of Expertise', aliases:['Curse of Knowledge','Expert Blind Spot'],
    icon:'psychology_alt', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'high', baseRelevance:84,
    categories:['Communication','Usability','Mental Models'],
    disciplines:['cognitive-psychology'],
    contexts:['onboarding-learning','data-entry-forms'],
    problemTypes:['adoption-barriers','information-overload'],
    tags:['expertise','curse of knowledge','expert blind spot','jargon','communication'],
    summary:"Experts find it difficult to imagine not knowing what they know — leading to explanations that assume knowledge the audience doesn't have.",
    description:'Designers and domain experts unconsciously design for themselves, creating interfaces inaccessible to less experienced users.',
    designPrompt:'Design for the new user, not the power user. Expose every design decision to someone who has never seen your product.',
    whenToUse:'Always — but especially critical when the design team has deep domain expertise in the product they\'re building.',
    whyItMatches:'The paradox of expertise is one of the most common sources of UX failure in expert-built enterprise software.',
    actions:[
      {title:'Test with genuine novices', description:'Every design review must include at least one person with no prior exposure to the system.'},
      {title:'Eliminate insider terminology', description:'Any label written by a domain expert must be reviewed by a non-expert.'}
    ],
    antiPatterns:['Releasing features without non-expert usability testing','Using internal terminology in user-facing labels'],
    uiPatterns:['Plain-language labels reviewed by non-experts','Contextual help written at domain-novice level'],
    examples:['Help text written by domain experts reads as obvious to them but opaque to a first-time user — non-expert review is essential.']
  },
  {
    id:'context-effect', name:'Context Effect', aliases:['Context-Dependent Memory','Environmental Context'],
    icon:'join_inner', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'moderate', baseRelevance:75,
    categories:['Memory','Perception','Situational Design'],
    disciplines:['cognitive-psychology'],
    contexts:['navigation-search','data-entry-forms'],
    problemTypes:['information-overload','error-prone-input'],
    tags:['context','environment','memory','retrieval','situational'],
    summary:'Memory retrieval and perception are improved when the context matches the context in which learning occurred.',
    description:'Information encountered in a specific context is more easily retrieved when that context is reinstated.',
    designPrompt:'Keep task-related information visible during the task. Don\'t force users to navigate away to retrieve context they need mid-task.',
    whenToUse:'In complex multi-step tasks, reference-heavy workflows, and any scenario where users need to recall prior information mid-task.',
    whyItMatches:'Context effect explains why removing related information from a task screen (to "simplify" it) often increases error rates.',
    actions:[
      {title:'Maintain task context on screen', description:'Keep relevant reference information visible during the task — not behind separate navigation.'},
      {title:'Use spatial consistency', description:'Keep UI elements in consistent positions across sessions — spatial memory is a powerful retrieval cue.'}
    ],
    antiPatterns:['Hiding reference information behind separate navigation during a task','Modal dialogs that remove context'],
    uiPatterns:['Persistent side panels for reference data','Consistent element positioning across screens'],
    examples:['A data entry form that shows relevant reference values alongside input fields — without requiring navigation to find them.']
  },
  {
    id:'fluency-heuristic', name:'Fluency Heuristic', aliases:['Processing Fluency Heuristic'],
    icon:'speed', color:'#EEF2FD', iconColor:'#3D63DD',
    impactLevel:'moderate', baseRelevance:77,
    categories:['Perception','Trust','Readability'],
    disciplines:['cognitive-psychology'],
    contexts:['navigation-search','onboarding-learning'],
    problemTypes:['information-overload','adoption-barriers'],
    tags:['fluency','ease','readability','trust','processing speed'],
    summary:'Easy-to-process information is judged as more likely to be true, more familiar, and more credible.',
    description:'Cognitive ease functions as a metacognitive signal — if something is hard to read, users assume it\'s hard to understand or do.',
    designPrompt:'Make information easy to read and easy to scan. Processing difficulty reads as content difficulty, not visual complexity.',
    whenToUse:'In any content-heavy interface, particularly in documentation, instructions, and onboarding copy.',
    whyItMatches:'The fluency heuristic explains why poorly designed interfaces feel harder to use than they actually are — and vice versa.',
    actions:[
      {title:'Optimise typographic readability', description:'Use sufficient font size, line spacing, and contrast. Difficult-to-read text implies difficult-to-do tasks.'},
      {title:'Use high-contrast, clean layouts', description:'Clear visual structure reduces perceived complexity and increases confidence.'}
    ],
    antiPatterns:['Dense, poorly-spaced body text in instructions','Low-contrast interfaces that require effort to read'],
    uiPatterns:['Clear typographic hierarchy','Generous line spacing','Short sentences in all instructional copy'],
    examples:['A help article with clear headers and short paragraphs is perceived as covering simpler content than the same information in dense prose.']
  }
];

const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const existingIds = new Set(raw.principles.map(p => p.id));
const toAdd = NEW.filter(p => !existingIds.has(p.id));
const all = [...raw.principles, ...toAdd];
all.forEach((p, i) => { p.number = String(i + 1).padStart(2, '0'); });
fs.writeFileSync(DATA_PATH, JSON.stringify({ principles: all }, null, 2));
console.log(`Done. Added ${toAdd.length} principles. Total: ${all.length}`);
