import { loadAppData } from './data-loader.js';
import { buildIndexes, scorePrinciples } from './filter-engine.js';
import { renderPagination, renderPrinciples, renderRightPanel, renderSelectOptions } from './renderers.js';

const DEFAULT_SELECTION = {
  goal: 'reduce-errors',
  context: 'all',
  discipline: 'all',
  problemType: 'all',
  impactLevel: 'all',
  search: '',
  problemDescription: ''
};

const FLOW_STEPS = ['define', 'signals', 'rank', 'prompt'];

const SAMPLE_TYPING_MS = 360;

const state = {
  appData: null,
  lookup: null,
  allRankedPrinciples: [],
  pagedPrinciples: [],
  selectedPrincipleId: null,
  currentPage: 1,
  itemsPerPage: 5,
  selection: { ...DEFAULT_SELECTION },
  sampleToken: 0
};

const elements = {};

document.addEventListener('DOMContentLoaded', async () => {
  cacheElements();
  bindStaticEvents();
  await initialize();
});

function cacheElements() {
  elements.searchInput = document.getElementById('library-search');
  elements.problemInput = document.getElementById('problem-description');
  elements.disciplineSelect = document.getElementById('discipline-filter');
  elements.problemTypeSelect = document.getElementById('problem-type-filter');
  elements.contextSelect = document.getElementById('context-filter');
  elements.impactSelect = document.getElementById('impact-filter');
  elements.principlesContainer = document.getElementById('principles-container');
  elements.paginationInfo = document.getElementById('pagination-info');
  elements.paginationButtons = document.getElementById('pagination-buttons');
  elements.headerTitle = document.getElementById('principles-header-title');
  elements.headerSubtitle = document.getElementById('principles-header-subtitle');
  elements.rightPanel = document.getElementById('right-panel');
  elements.goalGroup = document.getElementById('goal-group');
  elements.contextGroup = document.getElementById('ctx-group');
  elements.workflowSteps = Array.from(document.querySelectorAll('.workflow-step'));
  elements.flowSteps = Array.from(document.querySelectorAll('[data-flow-step]'));
  elements.liveExample = document.getElementById('live-example');
  elements.liveExampleSubtitle = document.getElementById('live-example-subtitle');
  elements.liveExampleBody = document.getElementById('live-example-body');
  elements.resetButtons = [
    document.getElementById('reset-filters'),
    document.getElementById('reset-filters-inline')
  ].filter(Boolean);
  elements.sampleButtons = Array.from(document.querySelectorAll('[data-sample]'));
}

async function initialize() {
  try {
    state.appData = await loadAppData();
    state.lookup = buildIndexes(state.appData);
    hydrateFilters();
    syncGoalChips(state.selection.goal);
    syncContextSelect();
    syncContextChips(state.selection.context);
    recompute();
  } catch (error) {
    console.error(error);
    elements.principlesContainer.innerHTML = '<div style="padding:40px;text-align:center;color:var(--on-surf-var);background:var(--surf-white);border:1px solid var(--outline-var);border-radius:12px;">Failed to load the cognitive library. Check that the local data files are available.</div>';
  }
}

function hydrateFilters() {
  renderSelectOptions(elements.disciplineSelect, state.appData.disciplines, 'All disciplines');
  renderSelectOptions(elements.problemTypeSelect, state.appData.problemTypes, 'Any problem type');
  renderSelectOptions(elements.contextSelect, state.appData.contexts, 'All contexts');
  elements.impactSelect.innerHTML = [
    '<option value="all">All levels</option>',
    '<option value="high">High impact</option>',
    '<option value="moderate">Moderate</option>',
    '<option value="low">Supporting</option>'
  ].join('');
}

function bindStaticEvents() {
  elements.searchInput?.addEventListener('input', (event) => {
    state.selection.search = event.target.value;
    state.currentPage = 1;
    recompute();
  });

  elements.problemInput?.addEventListener('input', (event) => {
    state.selection.problemDescription = event.target.value;
    state.currentPage = 1;
    recompute();
  });

  elements.disciplineSelect?.addEventListener('change', (event) => {
    state.selection.discipline = event.target.value;
    state.currentPage = 1;
    recompute();
  });

  elements.problemTypeSelect?.addEventListener('change', (event) => {
    state.selection.problemType = event.target.value;
    state.currentPage = 1;
    recompute();
  });

  elements.contextSelect?.addEventListener('change', (event) => {
    state.selection.context = event.target.value;
    syncContextChips(event.target.value);
    state.currentPage = 1;
    recompute();
  });

  elements.impactSelect?.addEventListener('change', (event) => {
    state.selection.impactLevel = event.target.value;
    state.currentPage = 1;
    recompute();
  });

  elements.resetButtons?.forEach((button) => {
    button.addEventListener('click', () => {
      resetAnalysis();
      showToast('restart_alt', 'Analysis reset');
    });
  });

  elements.sampleButtons?.forEach((button) => {
    button.addEventListener('click', () => {
      fillSampleProblem(button.dataset.sample || '');
    });
  });

  elements.goalGroup?.addEventListener('click', (event) => {
    const button = event.target.closest('.gchip');
    if (!button) return;
    setChipSelection(elements.goalGroup, '.gchip', button);
    state.selection.goal = button.dataset.goal;
    state.currentPage = 1;
    recompute();
  });

  elements.contextGroup?.addEventListener('click', (event) => {
    const button = event.target.closest('.cchip');
    if (!button) return;
    setChipSelection(elements.contextGroup, '.cchip', button);
    state.selection.context = button.dataset.context;
    if (elements.contextSelect) elements.contextSelect.value = button.dataset.context;
    state.currentPage = 1;
    recompute();
  });

  elements.paginationButtons?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    const page = Number(button.dataset.page);
    const totalPages = Math.max(1, Math.ceil(state.allRankedPrinciples.length / state.itemsPerPage));
    if (page < 1 || page > totalPages) return;
    state.currentPage = page;
    render();
  });

  elements.principlesContainer?.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-card-toggle]');
    if (toggle) {
      const principleId = toggle.dataset.cardToggle;
      state.selectedPrincipleId = principleId;
      const card = document.getElementById(`card-${principleId}`);
      card?.classList.toggle('open');
      const principle = state.allRankedPrinciples.find((item) => item.id === principleId);
      if (principle) renderRightPanel(elements.rightPanel, principle, state.lookup);
      return;
    }

    const selectButton = event.target.closest('[data-select-principle]');
    if (selectButton) {
      const principleId = selectButton.dataset.selectPrinciple;
      state.selectedPrincipleId = principleId;
      render();
      return;
    }

    const applyButton = event.target.closest('[data-apply-principle]');
    if (applyButton) {
      const principleId = applyButton.dataset.applyPrinciple;
      const principle = state.allRankedPrinciples.find((item) => item.id === principleId);
      if (principle) {
        openPromptGenerator(principle, applyButton);
      }
    }
  });

  elements.rightPanel?.addEventListener('click', (event) => {
    const applyButton = event.target.closest('[data-apply-principle]');
    if (!applyButton) return;
    const principle = state.allRankedPrinciples.find((item) => item.id === applyButton.dataset.applyPrinciple);
    if (principle) {
      openPromptGenerator(principle, applyButton);
    }
  });
}

function resetAnalysis() {
  state.selection = { ...DEFAULT_SELECTION };
  state.currentPage = 1;
  state.selectedPrincipleId = null;

  if (elements.searchInput) elements.searchInput.value = '';
  if (elements.problemInput) elements.problemInput.value = '';
  if (elements.disciplineSelect) elements.disciplineSelect.value = state.selection.discipline;
  if (elements.problemTypeSelect) elements.problemTypeSelect.value = state.selection.problemType;
  if (elements.impactSelect) elements.impactSelect.value = state.selection.impactLevel;
  syncGoalChips(state.selection.goal);
  syncContextSelect();
  syncContextChips(state.selection.context);
  recompute();
}

function setChipSelection(group, selector, button) {
  group.querySelectorAll(selector).forEach((item) => item.classList.remove('on'));
  button.classList.add('on');
}

function syncGoalChips(goalId) {
  if (!elements.goalGroup) return;
  const target = elements.goalGroup.querySelector(`[data-goal="${goalId}"]`);
  if (!target) return;
  setChipSelection(elements.goalGroup, '.gchip', target);
}

function syncContextChips(contextId) {
  if (!elements.contextGroup) return;
  const target = elements.contextGroup.querySelector(`[data-context="${contextId}"]`);
  if (!target) return;
  setChipSelection(elements.contextGroup, '.cchip', target);
}

function syncContextSelect() {
  if (elements.contextSelect) {
    elements.contextSelect.value = state.selection.context;
  }
}

function recompute() {
  state.allRankedPrinciples = scorePrinciples(state.appData, state.selection);
  if (!state.selectedPrincipleId || !state.allRankedPrinciples.some((item) => item.id === state.selectedPrincipleId)) {
    state.selectedPrincipleId = state.allRankedPrinciples[0]?.id || null;
  }
  render();
  updateFlowState();
}

function render() {
  const totalItems = state.allRankedPrinciples.length;
  const start = (state.currentPage - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  state.pagedPrinciples = state.allRankedPrinciples.slice(start, end);

  renderPrinciples(elements.principlesContainer, state.pagedPrinciples, state);
  renderPagination(elements.paginationInfo, elements.paginationButtons, totalItems, state.currentPage, state.itemsPerPage);
  updateHeader(totalItems);

  const selected = state.allRankedPrinciples.find((item) => item.id === state.selectedPrincipleId) || state.pagedPrinciples[0];
  if (selected) {
    renderRightPanel(elements.rightPanel, selected, state.lookup);
    renderLiveExample(selected);
  }
}

function updateHeader(totalItems) {
  const goalLabel = state.lookup?.goalsById[state.selection.goal]?.label || 'current goal';
  const contextLabel = state.selection.context === 'all'
    ? 'all contexts'
    : state.lookup?.contextsById[state.selection.context]?.label || 'current context';
  const problemLabel = state.selection.problemDescription.trim();
  if (elements.headerTitle) {
    elements.headerTitle.textContent = totalItems ? `${totalItems} ranked intervention${totalItems === 1 ? '' : 's'}` : 'No matching principles';
  }
  if (elements.headerSubtitle) {
    const contextPhrase = state.selection.context === 'all'
      ? 'across all contexts'
      : `in ${contextLabel.toLowerCase()}`;
    const basis = `Based on ${goalLabel.toLowerCase()} ${contextPhrase}`;
    elements.headerSubtitle.textContent = problemLabel
      ? `${basis}, with your problem description used as matching evidence.`
      : `${basis}. Add a problem description to sharpen the ranking.`;
  }
}

function renderLiveExample(principle) {
  if (!elements.liveExampleBody || !principle) return;
  const example = getLiveExample(principle);
  if (elements.liveExampleSubtitle) {
    elements.liveExampleSubtitle.textContent = `${principle.name}: ${example.summary}`;
  }
  elements.liveExampleBody.innerHTML = `
    <div class="example-grid">
      <div class="example-pane">
        <p class="example-label">Before</p>
        ${example.before}
      </div>
      <div class="example-pane after">
        <p class="example-label">After applying ${escapeHtml(principle.name)}</p>
        ${example.after}
      </div>
    </div>
    <p class="demo-note">${example.takeaway}</p>
  `;
  elements.liveExample?.classList.remove('is-refreshing');
  void elements.liveExample?.offsetWidth;
  elements.liveExample?.classList.add('is-refreshing');
}

function getLiveExample(principle) {
  const name = principle.name.toLowerCase();
  const categories = (principle.categories || []).join(' ').toLowerCase();
  const contexts = (principle.contexts || []).join(' ');

  if (principle.id === 'hicks-law' || name.includes('hick')) {
    return {
      summary: 'reduce competing choices so the next action is obvious.',
      before: demoStack([
        ['Approve', 'Equal'],
        ['Reject', 'Equal'],
        ['Escalate', 'Equal'],
        ['Assign', 'Equal'],
        ['Export', 'Equal']
      ]),
      after: `${demoStack([
        ['Approve', 'Primary', 'primary'],
        ['Request changes', 'Secondary'],
        ['More actions', 'Overflow', 'muted']
      ])}<span class="demo-cta"><span class="mi" style="font-size:14px;">check</span>Recommended next action</span>`,
      takeaway: 'The principle becomes a layout decision: one primary action, a small set of secondary choices, and the rest tucked away.'
    };
  }

  if (principle.id === 'progressive-disclosure' || name.includes('progressive')) {
    return {
      summary: 'show what matters now and reveal complexity when it becomes relevant.',
      before: demoStack([
        ['Required fields', 'Visible'],
        ['Advanced permissions', 'Visible'],
        ['Audit settings', 'Visible'],
        ['Optional metadata', 'Visible']
      ]),
      after: `${demoStack([
        ['Required fields', 'Visible', 'primary'],
        ['Advanced options', 'Collapsed'],
        ['Audit settings', 'On demand', 'muted']
      ])}<p class="demo-note">Secondary controls stay available without making first use feel heavy.</p>`,
      takeaway: 'The design move is not hiding information forever. It is sequencing the burden so the user handles one layer at a time.'
    };
  }

  if (principle.id === 'von-restorff-effect' || name.includes('restorff') || categories.includes('salience')) {
    return {
      summary: 'make the genuinely important item stand out from routine information.',
      before: demoStack([
        ['Routine sync complete', 'Info'],
        ['Lab result critical', 'Info'],
        ['Message received', 'Info']
      ]),
      after: `${demoStack([
        ['Routine sync complete', 'Normal', 'muted'],
        ['Lab result critical', 'High salience', 'primary'],
        ['Message received', 'Normal', 'muted']
      ])}<div class="demo-warning"><span class="mi" style="font-size:16px;">priority_high</span><span>Critical alert gets contrast, position, and wording that separate it from background noise.</span></div>`,
      takeaway: 'Use salience sparingly. If everything shouts, nothing is actually salient.'
    };
  }

  if (principle.id === 'millers-law' || name.includes('miller') || categories.includes('chunk')) {
    return {
      summary: 'chunk dense information into smaller groups users can hold in working memory.',
      before: `<div class="demo-token-row">${['Name','Role','Team','Status','Risk','Owner','Date','Notes','History','Evidence'].map((item) => `<span class="demo-token">${item}</span>`).join('')}</div>`,
      after: `<div class="demo-stack">
        <div class="demo-row primary"><span>Identity</span><strong>Name, role, team</strong></div>
        <div class="demo-row"><span>Decision context</span><strong>Status, risk, owner</strong></div>
        <div class="demo-row"><span>Evidence</span><strong>Date, notes, history</strong></div>
      </div>`,
      takeaway: 'The principle becomes information architecture: users scan groups first, then details.'
    };
  }

  if (principle.id === 'fitts-law' || name.includes('fitts')) {
    return {
      summary: 'make frequent or important targets larger, closer, and easier to hit.',
      before: demoStack([
        ['Save', 'Small'],
        ['Submit approval', 'Small'],
        ['Cancel', 'Small']
      ]),
      after: `${demoStack([
        ['Submit approval', 'Large target', 'primary'],
        ['Save draft', 'Secondary'],
        ['Cancel', 'Text link', 'muted']
      ])}<p class="demo-note">The highest-value action gets the easiest motor path.</p>`,
      takeaway: 'A behavior science principle turns into target size, placement, and spacing choices.'
    };
  }

  if (contexts.includes('navigation') || categories.includes('navigation') || name.includes('jakob')) {
    return {
      summary: 'use familiar patterns so users can rely on recognition instead of relearning.',
      before: demoStack([
        ['Mystery icon', 'No label'],
        ['Custom menu name', 'Low scent'],
        ['Hidden search', 'Hard to find']
      ]),
      after: demoStack([
        ['Search', 'Visible', 'primary'],
        ['Projects', 'Familiar label'],
        ['Settings', 'Expected place']
      ]),
      takeaway: 'Useful design often feels unsurprising. Familiarity frees attention for the actual task.'
    };
  }

  return {
    summary: 'translate the principle into visible hierarchy, feedback, and constraints.',
    before: demoStack([
      ['Problem signal', 'Unclear'],
      ['Recommended action', 'Hidden'],
      ['Risk or cost', 'Unexplained']
    ]),
    after: demoStack([
      ['Problem signal', 'Named', 'primary'],
      ['Recommended action', 'Visible'],
      ['Risk or cost', 'Explained']
    ]),
    takeaway: principle.designPrompt || 'Turn the principle into one concrete interface decision the user can see, test, and understand.'
  };
}

function demoStack(rows) {
  return `<div class="demo-stack">${rows.map(([label, meta, tone]) => `<div class="demo-row ${tone || ''}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(meta)}</strong></div>`).join('')}</div>`;
}

async function fillSampleProblem(sample) {
  state.sampleToken += 1;
  const token = state.sampleToken;
  const shouldAnimate = !prefersReducedMotion() && sample.length < 180;

  if (!elements.problemInput || !shouldAnimate) {
    state.selection.problemDescription = sample;
    if (elements.problemInput) elements.problemInput.value = sample;
    state.currentPage = 1;
    recompute();
    showToast('edit_note', 'Sample problem loaded');
    return;
  }

  elements.problemInput.value = '';
  state.selection.problemDescription = '';
  updateFlowState();

  const step = Math.max(1, Math.ceil(sample.length / 44));
  const delay = Math.max(8, Math.floor(SAMPLE_TYPING_MS / Math.ceil(sample.length / step)));
  for (let index = 0; index <= sample.length; index += step) {
    if (token !== state.sampleToken) return;
    elements.problemInput.value = sample.slice(0, index);
    await wait(delay);
  }
  elements.problemInput.value = sample;
  state.selection.problemDescription = sample;
  state.currentPage = 1;
  recompute();
  showToast('edit_note', 'Sample problem analysed');
}

function updateFlowState() {
  const hasProblem = Boolean(state.selection.problemDescription.trim());
  const hasResults = state.allRankedPrinciples.length > 0;
  const activeCount = hasProblem ? (hasResults ? 4 : 2) : 1;

  elements.flowSteps?.forEach((step, index) => {
    step.classList.toggle('is-active', index < activeCount);
  });
  elements.workflowSteps?.forEach((step, index) => {
    step.classList.toggle('is-active', index < activeCount);
  });
}

async function openPromptGenerator(principle, triggerButton) {
  const payload = {
    principleId: principle.id,
    principleName: principle.name,
    goal: state.selection.goal,
    context: state.selection.context,
    discipline: state.selection.discipline,
    problemType: state.selection.problemType,
    impactLevel: state.selection.impactLevel,
    search: state.selection.search,
    problemDescription: state.selection.problemDescription,
    reasons: principle.reasons,
    score: principle.score
  };

  sessionStorage.setItem('cognitiveEnginePromptSeed', JSON.stringify(payload));

  const params = new URLSearchParams({
    principle: principle.id,
    goal: state.selection.goal,
    context: state.selection.context,
    problem: state.selection.problemDescription || '',
    source: 'library'
  });

  if (triggerButton) {
    triggerButton.classList.add('prompt-seeding');
    triggerButton.disabled = true;
    const label = triggerButton.querySelector('[data-button-label]');
    if (label) label.textContent = 'Seeding prompt...';
  }
  showToast('auto_awesome', `Seeded with ${principle.name}`);

  if (!prefersReducedMotion()) {
    await wait(520);
  }

  window.location.href = `advanced-prompt-generator.html?${params.toString()}`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showToast(icon, msg) {
  const toast = document.getElementById('toast');
  const iconEl = document.getElementById('t-icon');
  const msgEl = document.getElementById('t-msg');
  if (!toast || !iconEl || !msgEl) return;

  iconEl.textContent = icon;
  msgEl.textContent = msg;
  toast.style.display = 'flex';
  toast.style.opacity = '1';
  clearTimeout(window._cognitiveEngineToast);
  window._cognitiveEngineToast = setTimeout(() => {
    toast.style.transition = 'opacity .4s';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.display = 'none';
      toast.style.transition = '';
    }, 400);
  }, 2600);
}

window.selectChip = () => {};
window.toggleCard = () => {};
window.changePage = () => {};
window.applyPrinciple = () => {};
