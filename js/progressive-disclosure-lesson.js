const allMode = document.getElementById('all-mode');
const stagedMode = document.getElementById('staged-mode');
const optionalFields = document.getElementById('optional-fields');
const advancedButton = document.getElementById('advanced-button');
const fieldCount = document.getElementById('field-count');
const explanation = document.getElementById('lab-explanation');

function setMode(mode) {
  const staged = mode === 'staged';
  allMode.classList.toggle('is-active', !staged);
  stagedMode.classList.toggle('is-active', staged);
  allMode.setAttribute('aria-pressed', String(!staged));
  stagedMode.setAttribute('aria-pressed', String(staged));
  optionalFields.hidden = staged;
  advancedButton.hidden = !staged;
  advancedButton.setAttribute('aria-expanded', 'false');
  advancedButton.lastElementChild.textContent = '+';
  fieldCount.textContent = staged
    ? '2 decisions before the first action'
    : '7 decisions before the first action';
  explanation.textContent = staged
    ? 'The first step asks only for what is needed to create a workspace. Five specialized choices are still available under Advanced setup.'
    : 'The form presents every choice before the user can start. Scan the optional fields: each creates another question the user must answer or skip.';
}

allMode.addEventListener('click', () => setMode('all'));
stagedMode.addEventListener('click', () => setMode('staged'));
advancedButton.addEventListener('click', () => {
  const expanded = advancedButton.getAttribute('aria-expanded') === 'true';
  optionalFields.hidden = expanded;
  advancedButton.setAttribute('aria-expanded', String(!expanded));
  advancedButton.lastElementChild.textContent = expanded ? '+' : '−';
  fieldCount.textContent = expanded
    ? '2 decisions before the first action'
    : '7 choices visible on request';
  explanation.textContent = expanded
    ? 'The first step asks only for what is needed to create a workspace. Five specialized choices are still available under Advanced setup.'
    : 'An experienced user can reach the advanced choices immediately. The control makes this second layer visible and reversible.';
});

const feedback = document.getElementById('decision-feedback');
document.querySelectorAll('[data-answer]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach((option) => {
      option.classList.toggle('is-selected', option === button);
      option.setAttribute('aria-pressed', String(option === button));
    });
    const correct = button.dataset.answer === 'correct';
    feedback.hidden = false;
    feedback.classList.toggle('is-correction', !correct);
    feedback.textContent = correct
      ? 'Exactly. That warning changes the decision. Keep it visible at the moment of submission.'
      : 'Try the safety warning. Optional preferences can wait; information needed for a safe decision should stay in view.';
  });
});

const incoming = new URLSearchParams(window.location.search);
const returnParams = new URLSearchParams();
for (const key of ['goal', 'context', 'problem']) {
  if (incoming.get(key)) returnParams.set(key, incoming.get(key));
}
const returnLink = document.getElementById('return-link');
const returnUrl = `../index.html${returnParams.size ? `?${returnParams}` : ''}`;
returnLink.href = returnUrl;
document.querySelector('.site-footer a').href = returnUrl;

const promptParams = new URLSearchParams({
  principle: 'progressive-disclosure',
  goal: incoming.get('goal') || 'improve-completion',
  context: incoming.get('context') || 'data-entry-forms',
  problem: incoming.get('problem') || 'New users abandon account setup because the form asks for too much information before they understand the value.',
  source: 'field-guide'
});
document.getElementById('apply-link').href = `../advanced-prompt-generator.html?${promptParams}`;
