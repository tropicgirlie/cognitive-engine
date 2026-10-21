(() => {
  'use strict';

  const settings = {
    challenge: {
      labels: ['Supportive', 'Balanced', 'Challenging'],
      instruction: [
        'Start by helping me develop the idea. Mention a material objection when it affects the decision.',
        'Be constructive without reflexive agreement. Surface important assumptions and tradeoffs.',
        'Act as a thoughtful critic. Challenge weak assumptions, identify counterarguments, and explain what would change your view.'
      ],
      sample: [
        'AI summaries could make studies easier to scan. The idea is promising if people can still reach the original evidence.',
        'AI summaries could help people find studies, but the main risk is that a short synthesis hides important context.',
        'I would question the assumption that faster reading produces better research decisions. Summaries may flatten disagreement and make weak evidence look settled.'
      ]
    },
    uncertainty: {
      labels: ['Light', 'Calibrated', 'Explicit'],
      instruction: [
        'Keep caveats brief. Never present speculation as a verified fact.',
        'Distinguish what is known, what is inferred, and what needs checking when it matters.',
        'Clearly label evidence, inference, and uncertainty. State what information is missing before making a strong recommendation.'
      ],
      sample: [
        "This depends on the quality of the summaries and the team's review habits.",
        'I cannot tell from this question whether people currently struggle to find studies or interpret them; that distinction matters.',
        'Known: summaries reduce reading effort. Unverified here: whether they improve decisions for your team. Missing: search logs, current usage patterns, and checks for summary errors.'
      ]
    },
    guidance: {
      labels: ['Answer only', 'One step', 'Coach me'],
      instruction: [
        'Answer the question directly. Do not add a process unless I ask for one.',
        'After the answer, suggest one useful next step.',
        'Help me reason through the decision with a short sequence of steps and a question I should answer next.'
      ],
      sample: [
        '',
        'Next step: test a few summaries against the source studies with the people who use the repository.',
        'First, identify the decisions people use the repository to make. Then test summaries against source studies for omissions. Finally, observe whether readers open the evidence. Which decision is currently hardest for your team?'
      ]
    },
    length: {
      labels: ['Brief', 'Standard', 'Detailed'],
      instruction: [
        'Keep responses short. Lead with the answer and omit background that does not affect the decision.',
        'Use enough detail to explain the reasoning, with a clear answer first.',
        'Give a thorough but structured answer. Include reasoning, tradeoffs, and concrete implications without repeating yourself.'
      ],
      sample: [
        '',
        'A useful design safeguard is to keep the source study one click away from every summary.',
        'Treat the summary as an entry point, not the final evidence. Show the study source, preserve contradictory findings, and let readers inspect the research behind each claim. Measure whether this changes both discovery and decision quality.'
      ]
    }
  };

  const ids = Object.keys(settings);
  const inputs = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  const sample = document.getElementById('sample-response');
  const output = document.getElementById('instruction-output');
  const status = document.getElementById('copy-status');

  function render() {
    const values = Object.fromEntries(ids.map(id => [id, Number(inputs[id].value)]));
    ids.forEach(id => {
      document.getElementById(`${id}-value`).value = settings[id].labels[values[id]];
    });

    const paragraphs = [
      settings.challenge.sample[values.challenge],
      settings.uncertainty.sample[values.uncertainty],
      settings.length.sample[values.length],
      settings.guidance.sample[values.guidance]
    ].filter(Boolean);
    sample.replaceChildren(...paragraphs.map(value => {
      const p = document.createElement('p');
      p.textContent = value;
      return p;
    }));

    output.value = [
      'When responding to me:',
      ...ids.map(id => `• ${settings[id].instruction[values[id]]}`),
      '',
      'Apply these as preferences, not rigid rules. Follow the task, available evidence, and safety requirements.'
    ].join('\n');
    status.textContent = '';
  }

  ids.forEach(id => inputs[id].addEventListener('input', render));
  document.getElementById('reset-controls').addEventListener('click', () => {
    ids.forEach(id => { inputs[id].value = '1'; });
    render();
  });
  document.getElementById('copy-instructions').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      status.textContent = 'Copied to clipboard.';
    } catch {
      output.focus();
      output.select();
      status.textContent = 'Clipboard unavailable. Select and copy the text above.';
    }
  });
  render();
})();
