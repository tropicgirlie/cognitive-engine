export async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.json();
}

export async function loadAppData() {
  const [principlesData, contextsData, disciplinesData, problemTypesData, rulesData, goalsData, toolsData] = await Promise.all([
    loadJson('data/principles-v2.json'),
    loadJson('data/contexts.json'),
    loadJson('data/disciplines.json'),
    loadJson('data/problem-types.json'),
    loadJson('data/rules.json'),
    loadJson('data/goals.json'),
    loadJson('data/tools.json')
  ]);

  return {
    principles: principlesData.principles,
    contexts: contextsData.contexts,
    disciplines: disciplinesData.disciplines,
    problemTypes: problemTypesData.problemTypes,
    rules: rulesData,
    goals: goalsData.goals,
    tools: toolsData.tools
  };
}
