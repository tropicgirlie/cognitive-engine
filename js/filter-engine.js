export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildIndexes(appData) {
  return {
    principlesById: Object.fromEntries(appData.principles.map((principle) => [principle.id, principle])),
    contextsById: Object.fromEntries(appData.contexts.map((context) => [context.id, context])),
    disciplinesById: Object.fromEntries(appData.disciplines.map((discipline) => [discipline.id, discipline])),
    problemTypesById: Object.fromEntries(appData.problemTypes.map((problemType) => [problemType.id, problemType])),
    goalsById: Object.fromEntries((appData.goals || []).map((goal) => [goal.id, goal])),
    toolsById: Object.fromEntries((appData.tools || []).map((tool) => [tool.id, tool]))
  };
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'because', 'but', 'by', 'for', 'from',
  'in', 'into', 'is', 'it', 'of', 'on', 'or', 'our', 'that', 'the', 'their',
  'them', 'there', 'they', 'this', 'to', 'too', 'user', 'users', 'with', 'when'
]);

const PROBLEM_KEYWORDS = {
  'choice-paralysis': ['choice', 'choose', 'decision', 'decide', 'hesitate', 'hesitation', 'options', 'overwhelming'],
  'information-overload': ['overload', 'dense', 'clutter', 'complex', 'busy', 'too much', 'confusing', 'noise', 'noisy'],
  'navigation-fatigue': ['find', 'search', 'navigation', 'menu', 'lost', 'where', 'locate', 'discover'],
  'error-prone-input': ['error', 'mistake', 'misclick', 'wrong', 'invalid', 'typo', 'miss', 'missing'],
  'slow-task-completion': ['slow', 'delay', 'takes', 'waiting', 'latency', 'throughput', 'speed'],
  'low-trust': ['trust', 'confidence', 'uncertain', 'risk', 'doubt', 'verify', 'approval'],
  'weak-collaboration': ['handover', 'handoff', 'collaboration', 'team', 'ownership', 'status', 'shared'],
  'alert-fatigue': ['alert', 'notification', 'alarm', 'urgent', 'warning', 'fatigue', 'triage']
};

const CONTEXT_KEYWORDS = {
  'data-entry-forms': ['form', 'input', 'field', 'submit', 'validation', 'checkout', 'setup'],
  'decision-approvals': ['approval', 'approve', 'reject', 'review', 'sign-off', 'manager', 'decision'],
  'navigation-search': ['search', 'navigation', 'menu', 'find', 'browse', 'results'],
  'monitoring-alerts': ['dashboard', 'monitor', 'alert', 'notification', 'triage', 'status'],
  'collaboration-handover': ['handover', 'handoff', 'team', 'owner', 'collaborate', 'async'],
  'onboarding-learning': ['onboarding', 'learn', 'tutorial', 'new users', 'first use'],
  'risk-communication': ['risk', 'consent', 'warning', 'disclosure', 'safety', 'clinical']
};

const GOAL_KEYWORDS = {
  'reduce-errors': ['error', 'mistake', 'misclick', 'wrong', 'miss', 'invalid', 'safe'],
  'speed-up-decisions': ['slow', 'hesitate', 'decision', 'choose', 'approval', 'faster'],
  'reduce-overload': ['overload', 'confusing', 'complex', 'clutter', 'dense', 'too much'],
  'improve-findability': ['find', 'search', 'lost', 'locate', 'discover', 'navigation'],
  'improve-collaboration': ['handover', 'team', 'owner', 'status', 'collaboration', 'shared']
};

export function scorePrinciples(appData, selection) {
  const { principles, rules } = appData;
  const scored = principles.map((principle) => ({
    ...principle,
    score: principle.baseRelevance,
    evidence: []
  }));

  const goalBoosts = rules.goalRules[selection.goal] || [];
  const contextBoosts = rules.contextRules[selection.context] || [];

  applyBoosts(scored, goalBoosts, 'goal');
  applyBoosts(scored, contextBoosts, 'context');

  if (selection.problemType !== 'all') {
    scored.forEach((principle) => {
      if (principle.problemTypes.includes(selection.problemType)) {
        principle.score += 18;
        principle.evidence.push({
          type: 'problem_type',
          label: 'Problem type match',
          reason: 'Matches selected problem type',
          weight: 18
        });
      }
    });
  }

  if (selection.discipline !== 'all') {
    scored.forEach((principle) => {
      if (principle.disciplines.includes(selection.discipline)) {
        principle.score += 10;
        principle.evidence.push({
          type: 'discipline',
          label: 'Discipline alignment',
          reason: 'Aligned with selected discipline',
          weight: 10
        });
      }
    });
  }

  const query = selection.search.trim().toLowerCase();
  const problemDescription = selection.problemDescription.trim().toLowerCase();
  const problemTerms = tokenize(problemDescription);

  if (problemTerms.length) {
    scored.forEach((principle) => {
      const haystack = buildPrincipleHaystack(principle);
      const matches = problemTerms.filter((term) => haystack.includes(term)).length;

      if (matches > 0) {
        const weight = Math.min(matches * 5, 30);
        principle.score += weight;
        principle.evidence.push({
          type: 'keyword',
          label: 'Problem description match',
          reason: `Matches problem description (${matches} keyword${matches > 1 ? 's' : ''})`,
          weight
        });
      }

      const inferredProblemTypes = inferMatches(problemDescription, PROBLEM_KEYWORDS);
      const problemTypeMatches = inferredProblemTypes.filter((problemType) => principle.problemTypes.includes(problemType));
      if (problemTypeMatches.length) {
        const labels = problemTypeMatches
          .map((id) => appData.problemTypes.find((item) => item.id === id)?.label || id)
          .join(', ');
        principle.score += problemTypeMatches.length * 12;
        principle.evidence.push({
          type: 'inferred_problem',
          label: 'Inferred problem type',
          reason: `Problem language suggests ${labels.toLowerCase()}`,
          weight: problemTypeMatches.length * 12
        });
      }

      const inferredContexts = inferMatches(problemDescription, CONTEXT_KEYWORDS);
      const contextMatches = inferredContexts.filter((context) => principle.contexts.includes(context));
      if (contextMatches.length) {
        const labels = contextMatches
          .map((id) => appData.contexts.find((item) => item.id === id)?.label || id)
          .join(', ');
        principle.score += contextMatches.length * 8;
        principle.evidence.push({
          type: 'inferred_context',
          label: 'Inferred context',
          reason: `Problem language resembles ${labels.toLowerCase()}`,
          weight: contextMatches.length * 8
        });
      }

      const inferredGoals = inferMatches(problemDescription, GOAL_KEYWORDS);
      if (inferredGoals.includes(selection.goal)) {
        principle.score += 6;
        principle.evidence.push({
          type: 'goal_language',
          label: 'Goal language',
          reason: 'Problem wording reinforces the selected outcome',
          weight: 6
        });
      }
    });
  }

  let filtered = scored.filter((principle) => {
    if (selection.context !== 'all' && !principle.contexts.includes(selection.context)) {
      return false;
    }

    if (selection.discipline !== 'all' && !principle.disciplines.includes(selection.discipline)) {
      return false;
    }

    if (selection.problemType !== 'all' && !principle.problemTypes.includes(selection.problemType)) {
      return false;
    }

    if (selection.impactLevel !== 'all' && principle.impactLevel !== selection.impactLevel) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = buildPrincipleHaystack(principle);

    return haystack.includes(query);
  });

  filtered = filtered.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  filtered.forEach((principle) => {
    principle.confidence = deriveConfidence(principle.score, principle.evidence.length);
    principle.reasons = principle.evidence.map((item) => item.reason);
  });
  return filtered;
}

function applyBoosts(principles, boosts, label) {
  boosts.forEach((boost) => {
    const target = principles.find((principle) => principle.id === boost.principleId);
    if (!target) return;
    target.score += boost.weight;
    target.evidence.push({
      type: label,
      label: label === 'goal' ? 'Goal rule' : 'Context rule',
      reason: boost.reason,
      weight: boost.weight
    });
  });
}

function deriveConfidence(score, evidenceCount) {
  if (score >= 130 || evidenceCount >= 4) return 'high';
  if (score >= 100 || evidenceCount >= 2) return 'medium';
  return 'low';
}

function buildPrincipleHaystack(principle) {
  return [
    principle.name,
    principle.summary,
    principle.description,
    principle.whenToUse,
    principle.whyItMatches,
    ...(principle.aliases || []),
    ...(principle.tags || []),
    ...(principle.categories || []),
    ...(principle.actions || []).map((action) => action.title),
    ...(principle.actions || []).map((action) => action.description),
    ...(principle.uiPatterns || []),
    ...(principle.antiPatterns || []),
    ...(principle.examples || [])
  ].join(' ').toLowerCase();
}

function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term));
}

function inferMatches(description, keywordMap) {
  return Object.entries(keywordMap)
    .filter(([, keywords]) => keywords.some((keyword) => description.includes(keyword)))
    .map(([id]) => id);
}
