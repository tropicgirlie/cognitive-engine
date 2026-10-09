/**
 * Cognitive Engine Tour — Editorial Spotlight + Side Panel
 *
 * Design rationale (from cognitive science perspective):
 * - Spotlight pattern: Von Restorff effect — the highlighted element is the
 *   only bright thing on screen, making it impossible to miss
 * - Side panel: Reduces cognitive load by separating explanation from action
 * - Progressive disclosure: Each step reveals only what's needed right now
 * - User control: every step can be skipped, the whole tour discarded with
 *   Esc / ✕ / "Skip tour" — autonomy bias works for onboarding too
 *
 * Page keys: 'library' (index.html), 'prompt-generator' (advanced-prompt-generator.html)
 */

class CognitiveTour {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.tourSteps = [];
    this.overlay = null;
    this.spotlight = null;
    this.sidePanel = null;
    this.connector = null;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  defineTourSteps(page) {
    const tours = {
      dashboard: [
        {
          id: 'welcome',
          icon: 'psychology',
          title: 'I study how people think under pressure.',
          body: 'This dashboard turns your UX problem into ranked, research-backed interventions. I\'ll show you the flow in about a minute — discard it any time with Esc.',
          detail: 'The principles here come from peer-reviewed research in cognitive load theory, attention, and behavioural economics — not guesswork.',
          target: null
        },
        {
          id: 'goal',
          icon: 'flag',
          title: 'Start with the outcome you want.',
          body: 'Reduce errors, speed decisions, cut overload — each goal re-ranks the principles the engine pulls from the research literature.',
          detail: '"Reduce errors" pulls from error prevention and defensive design. "Speed up decisions" draws on Hick\'s Law and recognition over recall.',
          target: '#goal-group'
        },
        {
          id: 'context',
          icon: 'explore',
          title: 'Context changes which principles apply.',
          body: 'A clinical dashboard under time pressure triggers different cognitive processes than a casual settings page. Choose where your interface lives.',
          detail: 'A clinician making a triage decision operates in System 1 (fast, automatic). Someone filling an expense report is in System 2 (slow, deliberate). The principles that help are different.',
          target: '#ctx-group'
        },
        {
          id: 'problem',
          icon: 'edit_note',
          title: 'Describe what you observe — not the solution you imagine.',
          body: '"Technicians miss out-of-range values" tells us more than "add more colour". The engine matches principles to the actual behaviour.',
          detail: 'This is the difference between a symptom and a diagnosis. Cognitive science gives us frameworks for understanding why a behaviour occurs — and that is what leads to better design.',
          target: '#problem-input'
        },
        {
          id: 'principles',
          icon: 'auto_stories',
          title: 'Each card is an evidence file, not a hunch.',
          body: 'Every intervention card shows why the principle applies, the UI patterns to use, and the anti-patterns to avoid.',
          detail: 'Expand a card to see the reasoning. The goal is a defensible design decision you can explain to a sceptical team.',
          target: '.pcard'
        },
        {
          id: 'generate',
          icon: 'auto_awesome',
          title: 'One click turns a principle into a design brief.',
          body: '"Generate Prompt" packages the principle, rationale, actions, anti-patterns, and validation criteria into a structured brief.',
          detail: 'Hand it to your team or paste it into an AI design tool — the structure (Role → Problem → Principle → Actions → Constraints → Validation) keeps the output testable.',
          target: '.btn-tonal'
        },
        {
          id: 'atlas',
          icon: 'hub',
          title: 'Want the whole landscape? Open the Atlas.',
          body: 'The Atlas maps all 115 principles across 14 fields of study, with every connection drawn. Its Grand Tour teaches you the territory behind these cards.',
          detail: 'The dashboard answers "what should I do now?". The Atlas answers "what is there to learn?". Dots you open there stay marked as explored.',
          target: '.ntab[href="cognitive-atlas.html"]'
        }
      ],
      library: [
        {
          id: 'welcome',
          icon: 'psychology',
          title: 'I study how people think under pressure.',
          body: 'This engine translates cognitive science research into design decisions. I\'ll show you how to use it in about 90 seconds — and why each step matters. Discard it any time with Esc.',
          detail: 'The principles here come from peer-reviewed research in cognitive load theory, attention, and behavioural economics — not guesswork.',
          target: null
        },
        {
          id: 'goal',
          icon: 'flag',
          title: 'Start with the outcome you want.',
          body: 'Are you trying to reduce errors? Speed up decisions? Each goal activates a different set of principles from the research literature.',
          detail: 'For example, "reduce errors" pulls from error prevention and defensive design. "Speed up decisions" draws on Hick\'s Law and recognition over recall.',
          target: '#goal-group'
        },
        {
          id: 'context',
          icon: 'explore',
          title: 'Context matters more than most designers think.',
          body: 'A form used under time pressure triggers different cognitive processes than one used at leisure. Choose where your interface lives.',
          detail: 'A clinician making a triage decision operates in System 1 (fast, automatic). Someone filling an expense report is in System 2 (slow, deliberate). The principles that help are different.',
          target: '#ctx-group'
        },
        {
          id: 'problem',
          icon: 'edit_note',
          title: 'Describe what you observe — not what you think the solution is.',
          body: '"Users miss the save button" tells us more than "make the button bigger". The engine matches principles to the actual behaviour.',
          detail: 'This is the difference between a symptom and a diagnosis. Cognitive science gives us frameworks for understanding why a behaviour occurs — and that\'s what leads to better design.',
          target: '#problem-description'
        },
        {
          id: 'principles',
          icon: 'auto_stories',
          title: 'These aren\'t random suggestions.',
          body: 'Each principle is ranked with visible evidence: goal rules, context fit, and keywords from your description. Open a card to inspect the reasoning.',
          detail: 'Every card carries the research basis, recommended UI patterns, and anti-patterns that contradict the principle. Think of it as an evidence file for your design decision.',
          target: '#principles-container .pcard'
        },
        {
          id: 'example',
          icon: 'compare',
          title: 'Every principle becomes a visible before/after.',
          body: 'This panel translates the selected principle into an interface decision — what changes on screen, and why it works.',
          detail: 'Abstract theory is hard to act on. A concrete before/after gives you a testable design move: one primary action, one chunking scheme, one salience decision.',
          target: '#live-example'
        },
        {
          id: 'generate',
          icon: 'auto_awesome',
          title: 'One click turns a principle into a design brief.',
          body: 'From any card, "Generate AI Prompt" seeds the Prompt Generator with your principle, goal, context, and problem description — pre-filled, not re-typed.',
          detail: 'The generated brief is a structured argument: principle, rationale, actions, anti-patterns, and validation criteria you can hand to a team or an AI design tool.',
          target: '.results-head .btn-primary'
        },
        {
          id: 'atlas',
          icon: 'hub',
          title: 'Want the whole landscape? Open the Atlas.',
          body: 'The Atlas lays out all 115 principles as a living map — 14 fields of study, every connection drawn. Take its Grand Tour to learn the territory behind these rankings.',
          detail: 'The Library answers "what should I do now?". The Atlas answers "what is there to learn?". Dots you open there stay marked as explored.',
          target: '.ntab[href="cognitive-atlas.html"]'
        }
      ],
      'prompt-generator': [
        {
          id: 'welcome-pg',
          icon: 'psychology',
          title: 'This is where cognitive science becomes a design brief.',
          body: 'You\'ll get a prompt grounded in research, not guesswork. Let me walk you through it. Discard it any time with Esc.',
          detail: 'The prompt generator takes your specific UX problem and maps it to the most relevant cognitive principle — then structures a complete design brief around it.',
          target: null
        },
        {
          id: 'problem-pg',
          icon: 'edit_note',
          title: 'Be specific about the friction.',
          body: '"Nurses are overriding drug interaction alerts" tells us more than "alerts aren\'t working". Describe the behaviour you observe.',
          detail: 'The more specific your problem description, the more precisely the engine can match a principle. Vague inputs lead to generic outputs — this is Garbage In, Garbage Out, but for cognitive science.',
          target: '#problemInput'
        },
        {
          id: 'selectors-pg',
          icon: 'explore',
          title: 'These narrow the principle space.',
          body: 'The context and goal selectors tell the engine which research domain to pull from. The more specific you are, the more targeted the output.',
          detail: 'Think of it like a differential diagnosis in medicine. The same symptom (e.g. "users ignore warnings") has different causes depending on context — alarm fatigue in healthcare vs. banner blindness in e-commerce.',
          target: '#contextSelect'
        },
        {
          id: 'generate-pg',
          icon: 'auto_awesome',
          title: 'Your prompt is a structured argument.',
          body: 'It includes the principle, rationale, design actions, anti-patterns, and validation criteria. Copy it, download it, or hand it to your team.',
          detail: 'Each generated prompt follows a consistent structure: Role → Problem → Principle → Actions → Constraints → Deliverables → Validation. This structure makes it actionable and testable.',
          target: '.btn-primary'
        }
      ]
    };

    return tours[page] || tours.library;
  }

  detectPage() {
    const path = window.location.pathname;
    if (path.includes('prompt-generator')) return 'prompt-generator';
    if (path.includes('dashboard')) return 'dashboard';
    return 'library';
  }

  startTour(page) {
    if (this.isActive) return;

    this.tourSteps = this.defineTourSteps(page || this.detectPage());
    this.currentStep = 0;
    this.isActive = true;
    this.returnFocusTo = document.activeElement;

    this.buildUI();
    this.showStep();
  }

  buildUI() {
    this.cleanup();

    this.overlay = document.createElement('div');
    this.overlay.id = 'cog-tour-overlay';
    this.overlay.addEventListener('click', () => this.endTour());

    this.spotlight = document.createElement('div');
    this.spotlight.id = 'cog-tour-spotlight';

    this.connector = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.connector.id = 'cog-tour-connector';

    this.sidePanel = document.createElement('div');
    this.sidePanel.id = 'cog-tour-panel';
    this.sidePanel.setAttribute('role', 'dialog');
    this.sidePanel.setAttribute('aria-modal', 'true');
    this.sidePanel.setAttribute('aria-labelledby', 'cog-tour-title');
    this.sidePanel.tabIndex = -1;
    this.sidePanel.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(this.sidePanel.querySelectorAll('button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.body.appendChild(this.overlay);
    document.body.appendChild(this.spotlight);
    document.body.appendChild(this.connector);
    document.body.appendChild(this.sidePanel);

    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
      this.connector.style.opacity = '1';
      this.sidePanel.style.transform = 'translateX(0)';
    });
  }

  showStep() {
    if (this.currentStep >= this.tourSteps.length) {
      this.celebrateAndEnd();
      return;
    }

    const step = this.tourSteps[this.currentStep];
    const total = this.tourSteps.length;
    const progress = ((this.currentStep + 1) / total) * 100;
    const number = String(this.currentStep + 1).padStart(2, '0');
    const totalLabel = String(total).padStart(2, '0');

    this.sidePanel.innerHTML = `
      <div class="cog-tour-progress" aria-hidden="true"><div class="cog-tour-progress-fill" style="width:${progress}%"></div></div>
      <div class="cog-tour-header">
        <span class="cog-tour-kicker">Cognitive Engine / Field notes</span>
        <button id="cog-tour-close" class="cog-tour-close" type="button" aria-label="Close guided tour">×</button>
      </div>
      <div class="cog-tour-body">
        <p class="cog-tour-step-label"><strong>${number}</strong> / ${totalLabel} &nbsp; Guided tour</p>
        <div class="cog-tour-icon" aria-hidden="true"><span class="mi">${step.icon}</span></div>
        <h2 id="cog-tour-title" tabindex="-1">${step.title}</h2>
        <p class="cog-tour-description">${step.body}</p>
        <button id="cog-tour-detail-toggle" class="cog-tour-detail-toggle" type="button" aria-expanded="false" aria-controls="cog-tour-detail-content">
          <span class="cog-tour-detail-arrow" aria-hidden="true">▸</span> Why this matters
        </button>
        <div id="cog-tour-detail-content" class="cog-tour-detail-content" hidden><p>${step.detail}</p></div>
      </div>
      <div class="cog-tour-footer">
        <div class="cog-tour-footer-top">
          <span class="cog-tour-footer-label">Step ${number} of ${totalLabel}</span>
          <div class="cog-tour-dashes" aria-hidden="true">
            ${this.tourSteps.map((_, i) => `<span class="cog-tour-dash${i === this.currentStep ? ' is-current' : i < this.currentStep ? ' is-done' : ''}"></span>`).join('')}
          </div>
        </div>
        <div class="cog-tour-actions">
          <button id="cog-tour-skip" class="cog-tour-skip" type="button">Skip tour</button>
          ${this.currentStep > 0 ? '<button id="cog-tour-back" class="cog-tour-back" type="button">Back</button>' : ''}
          <button id="cog-tour-next" class="cog-tour-next" type="button">${this.currentStep === total - 1 ? 'Finish' : 'Next'} →</button>
        </div>
      </div>
    `;

    this.sidePanel.querySelector('#cog-tour-close').addEventListener('click', () => this.endTour());
    this.sidePanel.querySelector('#cog-tour-skip').addEventListener('click', () => this.endTour());
    this.sidePanel.querySelector('#cog-tour-next').addEventListener('click', () => this.nextStep());
    const backBtn = this.sidePanel.querySelector('#cog-tour-back');
    if (backBtn) backBtn.addEventListener('click', () => this.previousStep());

    const toggleBtn = this.sidePanel.querySelector('#cog-tour-detail-toggle');
    const detailContent = this.sidePanel.querySelector('#cog-tour-detail-content');
    toggleBtn.addEventListener('click', () => {
      const open = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!open));
      detailContent.hidden = open;
    });

    this.sidePanel.querySelector('#cog-tour-title').focus({ preventScroll: true });
    this.positionSpotlight(step);
    this.drawConnector(step);
  }

  positionSpotlight(step) {
    if (!step.target) {
      this.spotlight.style.opacity = '0';
      this.overlay.style.backgroundColor = 'rgba(13,32,27,.72)';
      return;
    }

    const target = document.querySelector(step.target);
    if (!target) {
      this.spotlight.style.opacity = '0';
      this.overlay.style.backgroundColor = 'rgba(13,32,27,.72)';
      return;
    }

    target.scrollIntoView({ behavior: this.reduced ? 'auto' : 'smooth', block: 'center' });

    const activeStep = this.currentStep;
    setTimeout(() => {
      if (!this.isActive || !this.spotlight || this.currentStep !== activeStep) return;
      const rect = target.getBoundingClientRect();
      const pad = 6;

      this.overlay.style.backgroundColor = 'transparent';
      this.spotlight.style.opacity = '1';
      this.spotlight.style.boxShadow = '0 0 0 3px #ba5538, 0 0 0 9999px rgba(13,32,27,0.72)';
      this.spotlight.style.top = (rect.top - pad) + 'px';
      this.spotlight.style.left = (rect.left - pad) + 'px';
      this.spotlight.style.width = (rect.width + pad * 2) + 'px';
      this.spotlight.style.height = (rect.height + pad * 2) + 'px';
    }, this.reduced ? 60 : 350);
  }

  drawConnector(step) {
    this.connector.innerHTML = '';

    if (!step.target) return;

    const target = document.querySelector(step.target);
    if (!target) return;

    const activeStep = this.currentStep;
    setTimeout(() => {
      if (!this.isActive || !this.connector || this.currentStep !== activeStep) return;
      const rect = target.getBoundingClientRect();
      const panelLeft = window.innerWidth - Math.min(420, window.innerWidth);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', rect.right + 6);
      line.setAttribute('y1', rect.top + rect.height / 2);
      line.setAttribute('x2', panelLeft);
      line.setAttribute('y2', rect.top + rect.height / 2);
      line.setAttribute('stroke', '#ba5538');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '6,4');
      line.setAttribute('opacity', '0.5');

      this.connector.appendChild(line);
    }, this.reduced ? 80 : 400);
  }

  nextStep() {
    this.currentStep++;
    this.showStep();
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep();
    }
  }

  celebrateAndEnd() {
    if (this.reduced) { this.endTour(); return; }

    const celebration = document.createElement('div');
    celebration.className = 'cog-tour-celebration';
    celebration.innerHTML = `
      <div class="cog-tour-celebration-card">
        <img src="assets/brand/cognitive-engine-mark.svg" width="46" height="46" alt="">
        <h2>You're ready.</h2>
        <p>Use the Library to turn the next observed problem into a design decision you can explain.</p>
      </div>
    `;
    document.body.appendChild(celebration);

    setTimeout(() => {
      celebration.remove();
      this.endTour();
    }, 2200);
  }

  endTour() {
    this.isActive = false;
    this.cleanup();
    if (this.returnFocusTo && this.returnFocusTo.focus) {
      this.returnFocusTo.focus({ preventScroll: true });
    }
    this.returnFocusTo = null;
    try { localStorage.setItem('cognitiveEngineTourSeen', 'true'); } catch (e) { /* private mode */ }
  }

  cleanup() {
    [this.overlay, this.spotlight, this.connector, this.sidePanel].forEach((el) => {
      if (el && el.parentNode) el.remove();
    });
    this.overlay = null;
    this.spotlight = null;
    this.connector = null;
    this.sidePanel = null;
  }
}

// ── Global instance ──
const cognitiveTour = new CognitiveTour();

// ── Discard with Escape at any moment ──
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && cognitiveTour.isActive) cognitiveTour.endTour();
});

// ── Any element with [data-tour-start] launches the tour ──
document.addEventListener('click', (ev) => {
  const trigger = ev.target.closest('[data-tour-start]');
  if (trigger) cognitiveTour.startTour();
});

// ── Auto-start for first-time visitors ──
document.addEventListener('DOMContentLoaded', function() {
  let hasSeenTour = null;
  try { hasSeenTour = localStorage.getItem('cognitiveEngineTourSeen'); } catch (e) { /* ignore */ }

  if (!hasSeenTour) {
    // wait for the library cards to render before spotlighting them
    setTimeout(() => {
      let seen = false;
      try { seen = localStorage.getItem('cognitiveEngineTourSeen') === 'true'; } catch (e) { /* private mode */ }
      if (!seen && !cognitiveTour.isActive) cognitiveTour.startTour();
    }, 1500);
  }
});

// ── Floating entry point ──
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.createElement('button');
  btn.id = 'cog-tour-trigger';
  btn.type = 'button';
  btn.innerHTML = '<span class="mi" aria-hidden="true">school</span><span>Take the tour</span>';
  btn.setAttribute('aria-label', 'Start the guided tour');
  btn.addEventListener('click', () => cognitiveTour.startTour());
  document.body.appendChild(btn);
});
