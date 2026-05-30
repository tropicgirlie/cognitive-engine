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

const state = {
  appData: null,
  lookup: null,
  allRankedPrinciples: [],
  pagedPrinciples: [],
  selectedPrincipleId: null,
  currentPage: 1,
  itemsPerPage: 5,
  selection: { ...DEFAULT_SELECTION }
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
      state.selection.problemDescription = button.dataset.sample || '';
      if (elements.problemInput) elements.problemInput.value = state.selection.problemDescription;
      state.currentPage = 1;
      recompute();
      showToast('edit_note', 'Sample problem loaded');
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
        openPromptGenerator(principle);
      }
    }
  });

  elements.rightPanel?.addEventListener('click', (event) => {
    const applyButton = event.target.closest('[data-apply-principle]');
    if (!applyButton) return;
    const principle = state.allRankedPrinciples.find((item) => item.id === applyButton.dataset.applyPrinciple);
    if (principle) {
      openPromptGenerator(principle);
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
  }
}

function updateHeader(totalItems) {
  const goalLabel = document.querySelector('#goal-group .gchip.on')?.textContent.trim() || 'Current goal';
  const contextLabel = document.querySelector('#ctx-group .cchip.on')?.textContent.trim() || 'Current context';
  const problemLabel = state.selection.problemDescription.trim();
  if (elements.headerTitle) {
    elements.headerTitle.textContent = totalItems ? `${totalItems} ranked intervention${totalItems === 1 ? '' : 's'}` : 'No matching principles';
  }
  if (elements.headerSubtitle) {
    const basis = `Based on ${goalLabel.toLowerCase()} in ${contextLabel.toLowerCase()}`;
    elements.headerSubtitle.textContent = problemLabel
      ? `${basis}, with your problem description used as matching evidence.`
      : `${basis}. Add a problem description to sharpen the ranking.`;
  }
}

function openPromptGenerator(principle) {
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

  window.location.href = `advanced-prompt-generator.html?${params.toString()}`;
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
