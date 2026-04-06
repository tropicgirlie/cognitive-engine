/**
 * Consent Stepper Component
 * Implements: Granular consent, Pacing over efficiency
 */

class ConsentStepper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentStep = 0;
    this.consents = {};
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['steps', 'required'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get steps() {
    const stepsAttr = this.getAttribute('steps');
    return stepsAttr ? JSON.parse(stepsAttr) : [
      {
        id: 'data-collection',
        title: 'Data Collection',
        description: 'We collect usage data to improve this experience',
        required: true
      },
      {
        id: 'communications',
        title: 'Communications',
        description: 'Optional updates about new features',
        required: false
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'Anonymous usage statistics',
        required: false
      }
    ];
  }

  get required() {
    return this.hasAttribute('required');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/css/trauma-informed-ui.css');
        
        .stepper-container {
          background: var(--ti-surface);
          border: 1px solid var(--ti-border);
          border-radius: var(--ti-radius-xl);
          padding: var(--ti-space-xl);
          font-family: var(--ti-font-family);
          max-width: 500px;
          margin: 0 auto;
        }
        
        .stepper-header {
          margin-bottom: var(--ti-space-lg);
        }
        
        .stepper-title {
          font-size: var(--ti-font-size-lg);
          font-weight: 700;
          color: var(--ti-text);
          margin: 0 0 var(--ti-space-sm);
        }
        
        .stepper-subtitle {
          color: var(--ti-text);
          opacity: 0.8;
          font-size: var(--ti-font-size-sm);
          margin: 0;
        }
        
        .progress-indicator {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--ti-space-xl);
          position: relative;
        }
        
        .progress-indicator::before {
          content: '';
          position: absolute;
          top: 12px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--ti-border);
          z-index: 0;
        }
        
        .progress-line {
          position: absolute;
          top: 12px;
          left: 0;
          height: 2px;
          background: var(--ti-primary);
          z-index: 1;
          transition: width 0.3s ease;
        }
        
        .step-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--ti-bg);
          border: 2px solid var(--ti-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--ti-text);
          position: relative;
          z-index: 2;
          transition: var(--ti-transition-gentle);
        }
        
        .step-indicator.active {
          background: var(--ti-primary);
          color: white;
          border-color: var(--ti-primary);
        }
        
        .step-indicator.completed {
          background: var(--ti-secondary);
          color: white;
          border-color: var(--ti-secondary);
        }
        
        .step-content {
          min-height: 200px;
        }
        
        .step-card {
          background: var(--ti-bg);
          border: 1px solid var(--ti-border);
          border-radius: var(--ti-radius-lg);
          padding: var(--ti-space-lg);
          margin-bottom: var(--ti-space-lg);
        }
        
        .step-card-title {
          font-size: var(--ti-font-size-base);
          font-weight: 600;
          color: var(--ti-text);
          margin: 0 0 var(--ti-space-sm);
          display: flex;
          align-items: center;
          gap: var(--ti-space-sm);
        }
        
        .required-badge {
          background: var(--ti-danger);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: var(--ti-radius-sm);
          font-weight: 500;
        }
        
        .optional-badge {
          background: var(--ti-secondary);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: var(--ti-radius-sm);
          font-weight: 500;
        }
        
        .step-card-description {
          color: var(--ti-text);
          font-size: var(--ti-font-size-sm);
          line-height: var(--ti-line-height-relaxed);
          margin: 0 0 var(--ti-space-md);
        }
        
        .consent-options {
          display: flex;
          flex-direction: column;
          gap: var(--ti-space-sm);
        }
        
        .consent-option {
          display: flex;
          align-items: flex-start;
          gap: var(--ti-space-sm);
          padding: var(--ti-space-sm);
          border-radius: var(--ti-radius-md);
          cursor: pointer;
          transition: var(--ti-transition-gentle);
        }
        
        .consent-option:hover {
          background: var(--ti-primary-soft);
        }
        
        .consent-option input[type="radio"] {
          margin: 0;
          accent-color: var(--ti-primary);
        }
        
        .consent-option label {
          flex: 1;
          cursor: pointer;
          font-size: var(--ti-font-size-sm);
          line-height: var(--ti-line-height-relaxed);
        }
        
        .consent-option .option-description {
          font-size: var(--ti-font-size-sm);
          color: var(--ti-text);
          opacity: 0.7;
          margin-top: 2px;
        }
        
        .stepper-actions {
          display: flex;
          justify-content: space-between;
          gap: var(--ti-space-sm);
        }
        
        .stepper-button {
          padding: var(--ti-space-sm) var(--ti-space-lg);
          border: 1px solid var(--ti-border);
          border-radius: var(--ti-radius-md);
          font-family: var(--ti-font-family);
          font-size: var(--ti-font-size-sm);
          cursor: pointer;
          transition: var(--ti-transition-gentle);
          background: var(--ti-bg);
          color: var(--ti-text);
        }
        
        .stepper-button:hover:not(:disabled) {
          background: var(--ti-primary-soft);
          border-color: var(--ti-primary);
        }
        
        .stepper-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .stepper-button.primary {
          background: var(--ti-primary);
          color: white;
          border-color: var(--ti-primary);
        }
        
        .stepper-button.primary:hover:not(:disabled) {
          background: var(--ti-secondary);
        }
        
        .summary-section {
          background: var(--ti-bg);
          border: 1px solid var(--ti-border);
          border-radius: var(--ti-radius-lg);
          padding: var(--ti-space-lg);
          margin-top: var(--ti-space-lg);
        }
        
        .summary-title {
          font-weight: 600;
          margin-bottom: var(--ti-space-sm);
          color: var(--ti-text);
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--ti-space-xs) 0;
          font-size: var(--ti-font-size-sm);
        }
        
        .summary-consent {
          color: var(--ti-secondary);
          font-weight: 500;
        }
        
        .summary-decline {
          color: var(--ti-danger);
          font-weight: 500;
        }
      </style>
      
      <div class="stepper-container">
        <div class="stepper-header">
          <h2 class="stepper-title">Privacy & Consent</h2>
          <p class="stepper-subtitle">Please review each option at your own pace</p>
        </div>
        
        <div class="progress-indicator">
          <div class="progress-line" id="progressLine"></div>
          ${this.steps.map((_, index) => `
            <div class="step-indicator" data-step="${index}">
              ${index + 1}
            </div>
          `).join('')}
        </div>
        
        <div class="step-content" id="stepContent">
          <!-- Step content will be rendered here -->
        </div>
        
        <div class="stepper-actions">
          <button class="stepper-button" id="backBtn" style="visibility: hidden;">
            Back
          </button>
          <button class="stepper-button primary" id="nextBtn">
            Next
          </button>
        </div>
        
        <div class="summary-section" id="summarySection" style="display: none;">
          <h3 class="summary-title">Your Choices</h3>
          <div id="summaryContent">
            <!-- Summary will be rendered here -->
          </div>
        </div>
      </div>
    `;
    
    this.renderStep();
    this.updateProgress();
  }

  setupEventListeners() {
    const backBtn = this.shadowRoot.getElementById('backBtn');
    const nextBtn = this.shadowRoot.getElementById('nextBtn');

    backBtn.addEventListener('click', () => {
      this.previousStep();
    });

    nextBtn.addEventListener('click', () => {
      this.nextStep();
    });
  }

  renderStep() {
    const step = this.steps[this.currentStep];
    const stepContent = this.shadowRoot.getElementById('stepContent');
    const backBtn = this.shadowRoot.getElementById('backBtn');
    const nextBtn = this.shadowRoot.getElementById('nextBtn');

    stepContent.innerHTML = `
      <div class="step-card">
        <h3 class="step-card-title">
          ${step.title}
          ${step.required ? 
            '<span class="required-badge">Required</span>' : 
            '<span class="optional-badge">Optional</span>'
          }
        </h3>
        <p class="step-card-description">${step.description}</p>
        
        <div class="consent-options">
          <div class="consent-option">
            <input type="radio" 
                   id="consent-${step.id}-yes" 
                   name="consent-${step.id}" 
                   value="yes"
                   ${this.consents[step.id] === 'yes' ? 'checked' : ''}>
            <label for="consent-${step.id}-yes">
              <strong>I agree</strong>
              <div class="option-description">
                ${step.required ? 'This is required to use this service' : 'You can change this later'}
              </div>
            </label>
          </div>
          
          ${!step.required ? `
            <div class="consent-option">
              <input type="radio" 
                     id="consent-${step.id}-no" 
                     name="consent-${step.id}" 
                     value="no"
                     ${this.consents[step.id] === 'no' ? 'checked' : ''}>
              <label for="consent-${step.id}-no">
                <strong>I decline</strong>
                <div class="option-description">
                  You won't receive this feature
                </div>
              </label>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Update button states
    backBtn.style.visibility = this.currentStep === 0 ? 'hidden' : 'visible';
    
    if (this.currentStep === this.steps.length - 1) {
      nextBtn.textContent = 'Complete';
    } else {
      nextBtn.textContent = 'Next';
    }

    // Add radio button listeners
    const radios = stepContent.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.consents[step.id] = radio.value;
        this.updateSummary();
      });
    });

    // Auto-select required options
    if (step.required && !this.consents[step.id]) {
      const yesRadio = stepContent.querySelector(`#consent-${step.id}-yes`);
      if (yesRadio) {
        yesRadio.checked = true;
        this.consents[step.id] = 'yes';
      }
    }
  }

  updateProgress() {
    const progressLine = this.shadowRoot.getElementById('progressLine');
    const indicators = this.shadowRoot.querySelectorAll('.step-indicator');
    
    const progress = ((this.currentStep) / (this.steps.length - 1)) * 100;
    progressLine.style.width = `${progress}%`;
    
    indicators.forEach((indicator, index) => {
      indicator.classList.remove('active', 'completed');
      if (index === this.currentStep) {
        indicator.classList.add('active');
      } else if (index < this.currentStep) {
        indicator.classList.add('completed');
      }
    });
  }

  updateSummary() {
    const summarySection = this.shadowRoot.getElementById('summarySection');
    const summaryContent = this.shadowRoot.getElementById('summaryContent');
    
    summaryContent.innerHTML = this.steps.map(step => {
      const consent = this.consents[step.id];
      if (!consent) return '';
      
      return `
        <div class="summary-item">
          <span>${step.title}</span>
          <span class="${consent === 'yes' ? 'summary-consent' : 'summary-decline'}">
            ${consent === 'yes' ? '✓ Agreed' : '✗ Declined'}
          </span>
        </div>
      `;
    }).join('');
    
    if (Object.keys(this.consents).length > 0) {
      summarySection.style.display = 'block';
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStep();
      this.updateProgress();
    }
  }

  nextStep() {
    // Validate current step
    const step = this.steps[this.currentStep];
    if (step.required && this.consents[step.id] !== 'yes') {
      // Auto-select required if not selected
      this.consents[step.id] = 'yes';
    }
    
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.renderStep();
      this.updateProgress();
    } else {
      this.completeConsent();
    }
  }

  completeConsent() {
    this.updateSummary();
    
    // Fire completion event
    this.dispatchEvent(new CustomEvent('consent-complete', {
      detail: {
        consents: { ...this.consents },
        timestamp: Date.now()
      }
    }));
    
    // Show completion state
    const nextBtn = this.shadowRoot.getElementById('nextBtn');
    nextBtn.textContent = '✓ Completed';
    nextBtn.disabled = true;
  }
}

customElements.define('ti-consent-stepper', ConsentStepper);
