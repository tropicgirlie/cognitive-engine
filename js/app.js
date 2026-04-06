import { loadAppData } from './data-loader.js';
import { buildIndexes, scorePrinciples, slugify } from './filter-engine.js';
import { renderPagination, renderPrinciples, renderRightPanel, renderSelectOptions } from './renderers.js';

const state = {
  appData: null,
  lookup: null,
  allRankedPrinciples: [],
  pagedPrinciples: [],
  selectedPrincipleId: null,
  currentPage: 1,
  itemsPerPage: 5,
  selection: {
    goal: 'reduce-errors',
    context: 'all',
    discipline: 'all',
    problemType: 'all',
    impactLevel: 'all',
    search: '',
    problemDescription: ''
  }
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
}

async function initialize() {
  try {
    state.appData = await loadAppData();
    state.lookup = buildIndexes(state.appData);
    hydrateFilters();
    syncContextSelect();
    recompute();
  } catch (error) {
    console.error(error);
    elements.principlesContainer.innerHTML = '<div style="padding:40px; text-align:center; color:#9BAFC8; background:white; border:1px solid #E2E8F2; border-radius:12px;">Failed to load the cognitive library.</div>';
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

function setChipSelection(group, selector, button) {
  group.querySelectorAll(selector).forEach((item) => item.classList.remove('on'));
  button.classList.add('on');
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
  if (elements.headerTitle) {
    elements.headerTitle.textContent = totalItems ? `Top ${Math.min(5, totalItems)} Principles for Your Context` : 'No matching principles';
  }
  if (elements.headerSubtitle) {
    elements.headerSubtitle.textContent = `Based on “${goalLabel}” in “${contextLabel}”`; 
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

window.selectChip = () => {};
window.toggleCard = () => {};
window.changePage = () => {};
window.applyPrinciple = () => {};
window.slugify = slugify;
