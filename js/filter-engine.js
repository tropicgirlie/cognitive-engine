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

  if (problemDescription) {
    scored.forEach((principle) => {
      const haystack = [
        principle.name,
        principle.summary,
        principle.description,
        principle.whenToUse,
        principle.whyItMatches,
        ...(principle.tags || []),
        ...(principle.categories || []),
        ...(principle.actions || []).map((action) => action.title),
        ...(principle.actions || []).map((action) => action.description),
        ...(principle.uiPatterns || []),
        ...(principle.antiPatterns || []),
        ...(principle.examples || [])
      ].join(' ').toLowerCase();

      const terms = problemDescription.split(/\s+/).filter(Boolean);
      const matches = terms.filter((term) => haystack.includes(term)).length;

      if (matches > 0) {
        principle.score += matches * 4;
        principle.evidence.push({
          type: 'keyword',
          label: 'Problem description match',
          reason: `Matches problem description (${matches} keyword${matches > 1 ? 's' : ''})`,
          weight: matches * 4
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

    const haystack = [
      principle.name,
      principle.summary,
      principle.description,
      principle.whenToUse,
      principle.whyItMatches,
      ...(principle.tags || []),
      ...(principle.categories || []),
      ...(principle.actions || []).map((action) => action.title),
      ...(principle.actions || []).map((action) => action.description),
      ...(principle.uiPatterns || []),
      ...(principle.antiPatterns || []),
      ...(principle.examples || [])
    ].join(' ').toLowerCase();

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
