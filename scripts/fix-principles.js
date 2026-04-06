#!/usr/bin/env node
// fix-principles.js — Run: node scripts/fix-principles.js
// Removes duplicates, adds designPrompt, renames non-research IDs
const fs = require('fs'), path = require('path');

const DATA_PATH = path.join(__dirname, '../data/principles-v2.json');

// IDs to remove (duplicates appear twice; non-research noise)
const REMOVE = new Set([
  'split-attention-effect','working-memory-model','goal-gradient-effect',
  'aesthetic-usability-effect','fittss-law','ethics-of-attention',
  'mental-model-theory','normans-action-cycle','steering-law',
  'fogg-behavior-model','desirable-difficulty','cognitive-tunnelling',
  'expertise-reversal-effect','narrative-transportation'
]);

// designPrompt for each existing principle (generic life-science examples)
const PROMPTS = {
  'hicks-law':'Identify the top 3 actions per screen. Demote everything else to secondary or overflow.',
  'millers-law':'Count every item in every menu. More than 7? Group or collapse. No exceptions.',
  'von-restorff-effect':'Reserve your highest visual contrast for one element per screen only. Everything else stays neutral.',
  'fitts-law':'Make the primary action the largest and most central button on any key screen.',
  'serial-position-effect':'Critical items go first or last in any list. Never bury them in the middle.',
  'jakobs-law':'Audit complex components: do they match conventions from the top 3 tools your users already know?',
  'peak-end-rule':'Design the last screen of every task flow as carefully as the first.',
  'progressive-disclosure':'Design every screen at two levels: basic (immediate) and advanced (discoverable).',
  'doherty-threshold':'Define a 400ms SLA for every user-triggered action. Show a skeleton loader for anything slower.',
  'social-proof':'Surface aggregate usage data wherever users face unfamiliar decisions.',
  'cognitive-load-theory':'For every design element, ask: does this reduce task load or add to it?',
  'inattentional-blindness':'Place critical information in the direct path of the user\'s primary task gaze.',
  'change-blindness':'Any data that changes asynchronously must have a visible change indicator.',
  'attentional-blink':'Never stack critical alerts. One at a time with clear dismissal before the next appears.',
  'stroop-effect':'Audit every status indicator: does visual style match semantic meaning? Red = danger, always.',
  'recognition-over-recall':'Replace every free-text input that has finite valid values with a selection component.',
  'zeigarnik-effect':'Persist and surface incomplete tasks. Closure reduces cognitive residue.',
  'satisficing':'Assume users take the first option they see. Make the first path the correct path.',
  'confirmation-bias':'Never ask users "did you find that easy?" Watch behaviour — don\'t ask.',
  'cognitive-ease':'Run every user-facing string through a plain-language check. Jargon equals distrust.',
  'spacing-effect':'Design feature discovery that unfolds over the first week of use, not a single tutorial.',
  'dual-coding-theory':'Never use icons without labels in enterprise tools. Pair every symbol with words.',
  'law-of-proximity':'Use spacing as your primary grouping tool. Close = related. Far = separate.',
  'law-of-similarity':'Define a strict visual language: one style per role. Never mix.',
  'figure-ground':'What is the figure on this screen? Make it unambiguous before anything else.',
  'law-of-praegnanz':'Every layout decision: is this simpler than the alternative? Default to simple.',
  'law-of-closure':'Trust users to complete partial patterns. Don\'t over-explain the obvious.',
  'law-of-continuity':'Use connecting visual elements to imply flow continuity across steps.',
  'law-of-common-fate':'Use consistent motion direction to communicate object relationships.',
  'law-of-symmetry':'Default to symmetric layouts. Add asymmetry only for deliberate emphasis.',
  'loss-aversion':'Reframe destructive actions as protecting something, not losing something.',
  'default-effect':'Set defaults that serve 80% of users. Make changing the default easy but non-default.',
  'anchoring-effect':'Always show a reference number first. Let users orient before they decide.',
  'framing-effect':'Test positive vs negative framing for every critical message. Choose intentionally.',
  'status-quo-bias':'Preserve familiar patterns when redesigning. Change one thing at a time.',
  'availability-heuristic':'Treat session history as a promise. If you showed it once, users expect it always.',
  'representativeness-heuristic':'Design every warning for the user who believes it doesn\'t apply to them.',
  'decoy-effect':'Structure pricing or option tiers with an asymmetrically dominated middle option.',
  'planning-fallacy':'Add honest time estimates to every multi-step process. Under-promise, over-deliver.',
  'dual-process-theory':'Map each screen task to System 1 or System 2. Reduce System 2 requirements relentlessly.',
  'neural-habituation':'High-priority alerts: rare and prominent. Low-priority: suppressible after 3 dismissals.',
  'attentional-spotlight':'On every screen, where does the eye go first? There should be exactly one answer.',
  'emotional-memory-encoding':'Test error messages emotionally. High-anxiety messages are remembered as negative experiences.',
  'dopaminergic-reward-system':'Create clear, predictable milestone rewards at each step of long workflows.',
  'embodied-cognition':'Map complex digital interactions to physical-world analogies.',
  'colour-as-cognitive-shortcut':'Define a strict colour-to-meaning map. Apply it without exception across all products.',
  'optimism-bias':'Design for the optimistic user who won\'t use your safety features. Make safeguards invisible-by-default.',
  'anterior-cingulate-error-detection':'Inconsistency is neurological load. Audit interaction patterns relentlessly.',
  'cognitive-dissonance':'When breaking established patterns, always explain why. Unexplained change creates dissonance.',
  'authority-bias':'Your system is an authority. Defaults are authoritative recommendations — use that responsibility carefully.',
  'reactance-theory':'Every mandatory field needs a micro-explanation of why it\'s required.',
  'learned-helplessness':'Detect repeated failures on the same step. Offer contextual help after 2 failed attempts.',
  'ikea-effect':'Build meaningful customisation into complex workflows. Participation creates ownership.',
  'mere-exposure-effect':'Use the most common patterns from tools your users already know. Familiarity equals perceived simplicity.',
  'reciprocity-norm':'Give users something useful before asking them to do work. Help first, ask later.',
  'self-determination-theory':'For every major workflow: does it give choice (autonomy), build skill (competence), and connect to others?',
  'negativity-bias':'Map your worst-case flows. They define your product reputation more than best-case flows.',
  'threat-detection-bias':'Reserve red exclusively for critical errors. Use amber for warnings.',
  'face-detection-bias':'If trust matters, put a human face in the interface. It activates social trust circuitry.',
  'effort-heuristic':'In high-stakes workflows, one deliberate pause signals importance and reduces error rates.',
  'in-group-bias':'Show team context in collaborative tools. We trust our group more than the system.',
  'biophilia-effect':'Consider subtle organic shapes and muted natural tones in high-stress technical tools.',
  'signal-to-noise-ratio':'For every data table: remove grid lines and colour fills unless they carry information.',
  'information-hierarchy':'Design three visual weight levels: large = critical, medium = supporting, small = context.',
  'modality-effect':'For complex onboarding, use audio + visual together. Complement — don\'t duplicate.',
  'redundancy-principle':'Never use icon + label + tooltip when one suffices. Pick the right form; remove the rest.',
  'zipfs-law':'Run usage analytics. Surface the top 5 actions in 1 click. Deprioritise the long tail.',
  'gricean-maxims':'Apply Grice to every string: Is it true? No more than needed? Relevant? Clear?',
  'processing-fluency':'Replace any navigation label over 3 syllables with its simplest equivalent.',
  'speech-act-theory':'Audit every CTA label: what speech act does it perform? Is that the right one?',
  'prototype-theory':'For every category: what is the prototypical example your user imagines? Lead with it.',
  'garden-path-effect':'Read every destructive-action dialog aloud. Does it lead users to the right conclusion first time?',
  'markedness-theory':'Set the unmarked (neutral) form as default. Filtered or exceptional states are the marked form.',
  'distributed-cognition':'What cognitive work can your system absorb so users don\'t have to hold it in working memory?',
  'situated-cognition':'Observe users in their actual context before designing. Mental models are physically situated.',
  'activity-theory':'Map the full social context of your task: who else is affected? What rules apply?',
  'proxemics':'Permission requests should come after users experience benefit. Never on the first screen.',
  'phenomenology':'Name the primary intentional object on each screen. If you can\'t name it, the screen has a problem.',
  'pragmatism':'Test every feature for pragmatic value: does its existence change what users do? If not, remove it.',
  'affordance-theory':'Test every interactive element: is its affordance immediately perceivable without instruction?',
  'sunk-cost-fallacy':'Make abandonment and undo explicit and frictionless. Don\'t punish quitting.',
  'chunking':'Never present raw lists. Always group into meaningful categories of 3–5 items.'
};

const raw = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const seen = new Set();

const cleaned = raw.principles
  .filter(p => {
    if (REMOVE.has(p.id)) return false;
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  })
  .map(p => ({
    ...p,
    designPrompt: PROMPTS[p.id] || p.designPrompt || ''
  }));

// Renumber
cleaned.forEach((p, i) => { p.number = String(i + 1).padStart(2, '0'); });

fs.writeFileSync(DATA_PATH, JSON.stringify({ principles: cleaned }, null, 2));
console.log(`Done. ${cleaned.length} principles. Duplicates and non-research entries removed.`);
