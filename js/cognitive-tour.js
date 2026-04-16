/**
 * Cognitive Engine Tour — Figma-style Spotlight + Side Panel
 * 
 * Design rationale (from cognitive science perspective):
 * - Spotlight pattern: Von Restorff effect — the highlighted element is the 
 *   only bright thing on screen, making it impossible to miss
 * - Side panel: Reduces cognitive load by separating explanation from action
 * - Progressive disclosure: Each step reveals only what's needed right now
 * - Emotional micro-rewards: Completion triggers a small dopamine response
 * 
 * Inspired by: Figma, Linear, Stripe onboarding (audited via Mobbin)
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
  }

  defineTourSteps(page) {
    const tours = {
      dashboard: [
        {
          id: 'welcome',
          icon: '🧠',
          title: 'I study how people think under pressure.',
          body: 'This engine translates cognitive science research into design decisions. I\'ll show you how to use it in about 90 seconds — and why each step matters.',
          detail: 'The principles here come from peer-reviewed research in cognitive load theory, attention, and behavioural economics — not guesswork.',
          target: null,
          side: 'right'
        },
        {
          id: 'goal',
          icon: '🎯',
          title: 'Start with the outcome you want.',
          body: 'Are you trying to reduce errors? Speed up decisions? Each goal activates a different set of principles from the research literature.',
          detail: 'For example, "reduce errors" pulls from error prevention and defensive design. "Speed up decisions" draws on Hick\'s Law and recognition over recall.',
          target: '#goal-group',
          side: 'right'
        },
        {
          id: 'context',
          icon: '📍',
          title: 'Context matters more than most designers think.',
          body: 'A form used under time pressure triggers different cognitive processes than one used at leisure. Choose where your interface lives.',
          detail: 'A clinician making a triage decision operates in System 1 (fast, automatic). Someone filling an expense report is in System 2 (slow, deliberate). The principles that help are different.',
          target: '#ctx-group',
          side: 'right'
        },
        {
          id: 'problem',
          icon: '🔍',
          title: 'Describe what you observe — not what you think the solution is.',
          body: '"Users miss the save button" tells us more than "make the button bigger". The engine matches principles to the actual behaviour.',
          detail: 'This is the difference between a symptom and a diagnosis. Cognitive science gives us frameworks for understanding why a behaviour occurs — and that\'s what leads to better design.',
          target: '#problem-input',
          side: 'right'
        },
        {
          id: 'principles',
          icon: '📖',
          title: 'These aren\'t random suggestions.',
          body: 'Each principle is backed by peer-reviewed research. The cards show you why it applies, what patterns to use, and what to avoid.',
          detail: 'Click any card to expand it. You\'ll see the research basis, recommended UI patterns, and anti-patterns that contradict the principle. Think of it as an evidence file for your design decision.',
          target: '.pcard:first-child',
          side: 'right'
        },
        {
          id: 'generate',
          icon: '✨',
          title: 'One click gives you a research-backed design brief.',
          body: 'The generated prompt includes the principle, rationale, design actions, anti-patterns, and validation criteria. Hand it to your team.',
          detail: 'This isn\'t just a prompt — it\'s a structured argument for why a design decision should be made. It includes the evidence, the constraints, and how to validate that it worked.',
          target: '.btn-tonal',
          side: 'right'
        }
      ],
      'prompt-generator': [
        {
          id: 'welcome-pg',
          icon: '🧠',
          title: 'This is where cognitive science becomes a design brief.',
          body: 'You\'ll get a prompt grounded in research, not guesswork. Let me walk you through it.',
          detail: 'The prompt generator takes your specific UX problem and maps it to the most relevant cognitive principle — then structures a complete design brief around it.',
          target: null,
          side: 'right'
        },
        {
          id: 'problem-pg',
          icon: '🔍',
          title: 'Be specific about the friction.',
          body: '"Nurses are overriding drug interaction alerts" tells us more than "alerts aren\'t working". Describe the behaviour you observe.',
          detail: 'The more specific your problem description, the more precisely the engine can match a principle. Vague inputs lead to generic outputs — this is Garbage In, Garbage Out, but for cognitive science.',
          target: '#problemInput',
          side: 'right'
        },
        {
          id: 'selectors-pg',
          icon: '📍',
          title: 'These narrow the principle space.',
          body: 'The context and goal selectors tell the engine which research domain to pull from. The more specific you are, the more targeted the output.',
          detail: 'Think of it like a differential diagnosis in medicine. The same symptom (e.g. "users ignore warnings") has different causes depending on context — alarm fatigue in healthcare vs. banner blindness in e-commerce.',
          target: '#contextSelect',
          side: 'right'
        },
        {
          id: 'generate-pg',
          icon: '✨',
          title: 'Your prompt is a structured argument.',
          body: 'It includes the principle, rationale, design actions, anti-patterns, and validation criteria. Copy it, download it, or hand it to your team.',
          detail: 'Each generated prompt follows a consistent structure: Role → Problem → Principle → Actions → Constraints → Deliverables → Validation. This structure makes it actionable and testable.',
          target: '.btn-primary',
          side: 'right'
        }
      ]
    };

    return tours[page] || tours.dashboard;
  }

  startTour(page = 'dashboard') {
    if (this.isActive) return;
    
    this.tourSteps = this.defineTourSteps(page);
    this.currentStep = 0;
    this.isActive = true;
    
    this.buildUI();
    this.showStep();
  }

  buildUI() {
    this.cleanup();

    // Full-screen overlay with spotlight cutout
    this.overlay = document.createElement('div');
    this.overlay.id = 'cog-tour-overlay';
    this.overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      z-index: 10000;
      pointer-events: none;
      transition: opacity 0.4s ease;
      opacity: 0;
    `;

    // Spotlight ring around target element
    this.spotlight = document.createElement('div');
    this.spotlight.id = 'cog-tour-spotlight';
    this.spotlight.style.cssText = `
      position: fixed;
      border-radius: 8px;
      box-shadow: 0 0 0 4px rgba(61,99,221,0.6), 0 0 0 9999px rgba(15,14,20,0.72);
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      pointer-events: none;
      z-index: 10001;
      opacity: 0;
    `;

    // SVG connector line from spotlight to panel
    this.connector = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.connector.id = 'cog-tour-connector';
    this.connector.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 10001; pointer-events: none; opacity: 0;
      transition: opacity 0.35s ease;
    `;

    // Side panel
    this.sidePanel = document.createElement('div');
    this.sidePanel.id = 'cog-tour-panel';
    this.sidePanel.style.cssText = `
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: 420px;
      background: #FFFFFF;
      box-shadow: -8px 0 40px rgba(0,0,0,0.18);
      z-index: 10002;
      display: flex; flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
      overflow-y: auto;
      font-family: 'Roboto', -apple-system, sans-serif;
    `;

    document.body.appendChild(this.overlay);
    document.body.appendChild(this.spotlight);
    document.body.appendChild(this.connector);
    document.body.appendChild(this.sidePanel);

    // Animate in
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
      this.spotlight.style.opacity = '1';
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

    // ── Side panel content ──
    this.sidePanel.innerHTML = `
      <!-- Progress bar -->
      <div style="height:4px; background:#E9E7EE; border-radius:2px; margin:0;">
        <div style="height:4px; width:${progress}%; background:linear-gradient(90deg,#3D63DD,#6B8FFF); border-radius:2px; transition:width 0.4s ease;"></div>
      </div>

      <!-- Close button -->
      <button id="cog-tour-close" style="
        position:absolute; top:16px; right:16px;
        width:36px; height:36px; border-radius:50%;
        border:none; background:transparent; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        color:#767680; font-size:20px; transition:all 0.15s;
      " onmouseover="this.style.background='#F5F3FA';this.style.color='#1C1B1F'" onmouseout="this.style.background='transparent';this.style.color='#767680'">
        ✕
      </button>

      <!-- Panel body -->
      <div style="padding:40px 32px 32px; flex:1; display:flex; flex-direction:column; justify-content:center;">
        <!-- Step icon -->
        <div style="
          width:56px; height:56px; border-radius:16px;
          background:linear-gradient(135deg,#DBE1FF,#DFE0F9);
          display:flex; align-items:center; justify-content:center;
          font-size:28px; margin-bottom:24px;
        ">${step.icon}</div>

        <!-- Title -->
        <h2 style="
          font-size:22px; font-weight:700; line-height:1.3;
          color:#1C1B1F; margin:0 0 16px; letter-spacing:-0.01em;
        ">${step.title}</h2>

        <!-- Body -->
        <p style="
          font-size:16px; line-height:1.6; color:#46464F;
          margin:0 0 20px;
        ">${step.body}</p>

        <!-- Detail (progressive disclosure — collapsible) -->
        <button id="cog-tour-detail-toggle" style="
          display:flex; align-items:center; gap:6px;
          background:none; border:none; cursor:pointer;
          font-size:14px; font-weight:500; color:#3D63DD;
          padding:0; margin:0 0 8px; transition:color 0.15s;
        " onmouseover="this.style.color='#4B73F7'" onmouseout="this.style.color='#3D63DD'">
          <span style="font-size:18px; transition:transform 0.2s;" id="cog-tour-detail-arrow">▸</span>
          Why this matters
        </button>
        <div id="cog-tour-detail-content" style="
          max-height:0; overflow:hidden; transition:max-height 0.3s ease;
        ">
          <p style="
            font-size:14px; line-height:1.65; color:#767680;
            margin:0; padding:12px 16px; background:#F5F3FA;
            border-radius:8px; border-left:3px solid #3D63DD;
          ">${step.detail}</p>
        </div>
      </div>

      <!-- Footer navigation -->
      <div style="
        padding:20px 32px 28px; border-top:1px solid #E9E7EE;
        display:flex; align-items:center; justify-content:space-between;
      ">
        <!-- Progress dots -->
        <div style="display:flex; gap:6px; align-items:center;">
          ${this.tourSteps.map((_, i) => `
            <div style="
              width:${i === this.currentStep ? '20px' : '6px'};
              height:6px; border-radius:3px;
              background:${i === this.currentStep ? '#3D63DD' : i < this.currentStep ? '#6B8FFF' : '#C7C5D0'};
              transition:all 0.3s ease;
            "></div>
          `).join('')}
        </div>

        <!-- Navigation buttons -->
        <div style="display:flex; gap:8px; align-items:center;">
          ${this.currentStep > 0 ? `
            <button id="cog-tour-back" style="
              padding:10px 18px; border-radius:8px;
              border:1px solid #C7C5D0; background:white;
              font-size:14px; font-weight:500; color:#46464F;
              cursor:pointer; transition:all 0.15s;
            " onmouseover="this.style.background='#F5F3FA'" onmouseout="this.style.background='white'">
              Back
            </button>
          ` : ''}
          <button id="cog-tour-next" style="
            padding:10px 24px; border-radius:8px;
            border:none; background:#3D63DD;
            font-size:14px; font-weight:600; color:white;
            cursor:pointer; transition:all 0.15s;
            box-shadow:0 1px 3px rgba(61,99,221,0.3);
          " onmouseover="this.style.background='#4B73F7'" onmouseout="this.style.background='#3D63DD'">
            ${this.currentStep === total - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    `;

    // Wire up panel interactions
    this.sidePanel.querySelector('#cog-tour-close').addEventListener('click', () => this.endTour());
    this.sidePanel.querySelector('#cog-tour-next').addEventListener('click', () => this.nextStep());
    const backBtn = this.sidePanel.querySelector('#cog-tour-back');
    if (backBtn) backBtn.addEventListener('click', () => this.previousStep());

    // Progressive disclosure toggle
    const toggleBtn = this.sidePanel.querySelector('#cog-tour-detail-toggle');
    const detailContent = this.sidePanel.querySelector('#cog-tour-detail-content');
    const detailArrow = this.sidePanel.querySelector('#cog-tour-detail-arrow');
    if (toggleBtn && detailContent) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = detailContent.style.maxHeight !== '0px' && detailContent.style.maxHeight !== '';
        if (isOpen) {
          detailContent.style.maxHeight = '0px';
          detailArrow.style.transform = 'rotate(0deg)';
        } else {
          detailContent.style.maxHeight = '200px';
          detailArrow.style.transform = 'rotate(90deg)';
        }
      });
    }

    // Position spotlight on target
    this.positionSpotlight(step);

    // Draw connector line
    this.drawConnector(step);
  }

  positionSpotlight(step) {
    if (!step.target) {
      // No target — hide spotlight, full overlay
      this.spotlight.style.opacity = '0';
      this.spotlight.style.boxShadow = '0 0 0 9999px rgba(15,14,20,0.72)';
      return;
    }

    const target = document.querySelector(step.target);
    if (!target) {
      this.spotlight.style.opacity = '0';
      return;
    }

    // Scroll target into view first
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const pad = 6;

      this.spotlight.style.opacity = '1';
      this.spotlight.style.top = (rect.top - pad) + 'px';
      this.spotlight.style.left = (rect.left - pad) + 'px';
      this.spotlight.style.width = (rect.width + pad * 2) + 'px';
      this.spotlight.style.height = (rect.height + pad * 2) + 'px';
    }, 350);
  }

  drawConnector(step) {
    // Clear previous
    this.connector.innerHTML = '';

    if (!step.target) return;

    const target = document.querySelector(step.target);
    if (!target) return;

    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const panelLeft = window.innerWidth - 420;

      // Draw a subtle dashed line from spotlight right edge to panel
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', rect.right + 6);
      line.setAttribute('y1', rect.top + rect.height / 2);
      line.setAttribute('x2', panelLeft);
      line.setAttribute('y2', rect.top + rect.height / 2);
      line.setAttribute('stroke', '#3D63DD');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '6,4');
      line.setAttribute('opacity', '0.5');

      this.connector.appendChild(line);
    }, 400);
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
    // Small celebration before closing
    const celebration = document.createElement('div');
    celebration.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      z-index: 10003; display: flex; align-items: center; justify-content: center;
      background: rgba(15,14,20,0.6); pointer-events: none;
    `;
    celebration.innerHTML = `
      <div style="
        background: white; border-radius: 20px; padding: 48px;
        text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        animation: cogTourPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
      ">
        <div style="font-size:48px; margin-bottom:16px;">🧠</div>
        <h2 style="font-size:24px; font-weight:700; color:#1C1B1F; margin:0 0 8px;">
          You\'re ready.
        </h2>
        <p style="font-size:16px; color:#46464F; margin:0; max-width:300px; line-height:1.5;">
          Go diagnose some cognitive friction. The principles are waiting.
        </p>
      </div>
    `;

    // Add pop-in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cogTourPopIn {
        from { transform: scale(0.7); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(celebration);

    setTimeout(() => {
      celebration.remove();
      style.remove();
      this.endTour();
    }, 2200);
  }

  endTour() {
    this.isActive = false;
    this.cleanup();
    localStorage.setItem('cognitiveEngineTourSeen', 'true');
  }

  cleanup() {
    [this.overlay, this.spotlight, this.connector, this.sidePanel].forEach(el => {
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

// ── Auto-start for first-time visitors ──
document.addEventListener('DOMContentLoaded', function() {
  const hasSeenTour = localStorage.getItem('cognitiveEngineTourSeen');
  const page = window.location.pathname.includes('prompt-generator') ? 'prompt-generator' : 'dashboard';

  if (!hasSeenTour) {
    setTimeout(() => cognitiveTour.startTour(page), 800);
  }
});

// ── Tour trigger button (bottom-right, always accessible) ──
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.createElement('button');
  btn.id = 'cog-tour-trigger';
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D63DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
    <span>Guide</span>
  `;
  btn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    display: flex; align-items: center; gap: 8px;
    background: white; border: 1px solid #C7C5D0;
    border-radius: 24px; padding: 10px 18px;
    font: 500 14px 'Roboto', sans-serif; color: #3D63DD;
    cursor: pointer; z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  `;
  btn.addEventListener('mouseenter', () => {
    btn.style.boxShadow = '0 4px 16px rgba(61,99,221,0.25)';
    btn.style.borderColor = '#3D63DD';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    btn.style.borderColor = '#C7C5D0';
  });
  btn.addEventListener('click', () => {
    const page = window.location.pathname.includes('prompt-generator') ? 'prompt-generator' : 'dashboard';
    cognitiveTour.startTour(page);
  });

  document.body.appendChild(btn);
});
