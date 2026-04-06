/**
 * Trauma-Informed Button Component
 * Implements: Pacing over efficiency, Repair is always possible
 */

class TraumaInformedButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.regretTimeout = null;
    this.countdownInterval = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['label', 'window-ms', 'variant', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get label() {
    return this.getAttribute('label') || 'Submit';
  }

  get windowMs() {
    return parseInt(this.getAttribute('window-ms')) || 7000;
  }

  get variant() {
    return this.getAttribute('variant') || 'primary';
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/css/trauma-informed-ui.css');
        
        :host {
          display: inline-block;
        }
        
        .ti-button {
          font-family: var(--ti-font-family);
          font-size: var(--ti-font-size-base);
          line-height: var(--ti-line-height-relaxed);
          padding: var(--ti-space-sm) var(--ti-space-lg);
          border: 2px solid transparent;
          border-radius: var(--ti-radius-lg);
          background: var(--ti-primary);
          color: white;
          cursor: pointer;
          transition: var(--ti-transition-gentle);
          position: relative;
          overflow: hidden;
          min-height: 44px; /* WCAG touch target size */
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ti-space-xs);
          text-decoration: none;
          font-weight: 600;
        }
        
        .ti-button:hover:not(:disabled) {
          background: var(--ti-secondary);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .ti-button:focus-visible {
          outline: none;
          box-shadow: var(--ti-focus-ring);
        }
        
        .ti-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .ti-button.secondary {
          background: var(--ti-surface);
          color: var(--ti-text);
          border-color: var(--ti-border);
        }
        
        .ti-button.secondary:hover:not(:disabled) {
          background: var(--ti-primary-soft);
          border-color: var(--ti-primary);
        }
        
        .ti-button.danger {
          background: var(--ti-danger);
        }
        
        .countdown-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: var(--ti-font-size-sm);
          border-radius: var(--ti-radius-lg);
        }
        
        .countdown-number {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: var(--ti-space-xs);
        }
        
        .countdown-text {
          text-align: center;
          max-width: 200px;
        }
        
        .undo-button {
          background: var(--ti-secondary);
          color: white;
          border: none;
          padding: var(--ti-space-xs) var(--ti-space-sm);
          border-radius: var(--ti-radius-md);
          cursor: pointer;
          margin-top: var(--ti-space-sm);
          font-size: var(--ti-font-size-sm);
        }
        
        .undo-button:hover {
          background: var(--ti-primary);
        }
      </style>
      
      <button class="ti-button ${this.variant}" id="mainButton">
        <span class="button-text">${this.label}</span>
        <span class="icon" style="display:none;">⏳</span>
      </button>
    `;
  }

  setupEventListeners() {
    const button = this.shadowRoot.getElementById('mainButton');
    
    button.addEventListener('click', (e) => {
      if (!this.hasAttribute('disabled')) {
        this.initiateAction();
      }
    });
  }

  initiateAction() {
    const button = this.shadowRoot.getElementById('mainButton');
    const icon = this.shadowRoot.querySelector('.icon');
    
    // Show loading state
    icon.style.display = 'inline';
    button.setAttribute('disabled', 'true');
    
    // Start regret window
    this.startRegretWindow();
    
    // Fire the action event
    this.dispatchEvent(new CustomEvent('action', {
      detail: { label: this.label, timestamp: Date.now() }
    }));
  }

  startRegretWindow() {
    let timeLeft = this.windowMs / 1000;
    
    // Create countdown overlay
    const overlay = document.createElement('div');
    overlay.className = 'countdown-overlay';
    overlay.innerHTML = `
      <div class="countdown-number">${timeLeft}</div>
      <div class="countdown-text">
        Action submitted. You can undo if this was a mistake.
      </div>
      <button class="undo-button">Undo</button>
    `;
    
    this.shadowRoot.appendChild(overlay);
    
    // Start countdown
    this.countdownInterval = setInterval(() => {
      timeLeft--;
      const numberEl = overlay.querySelector('.countdown-number');
      if (numberEl) {
        numberEl.textContent = timeLeft;
      }
      
      if (timeLeft <= 0) {
        this.finalizeAction();
      }
    }, 1000);
    
    // Setup undo button
    const undoButton = overlay.querySelector('.undo-button');
    undoButton.addEventListener('click', () => {
      this.undoAction();
    });
    
    // Auto-finalize after window
    this.regretTimeout = setTimeout(() => {
      this.finalizeAction();
    }, this.windowMs);
  }

  undoAction() {
    this.cleanup();
    
    const button = this.shadowRoot.getElementById('mainButton');
    const icon = this.shadowRoot.querySelector('.icon');
    
    button.removeAttribute('disabled');
    icon.style.display = 'none';
    
    // Show gentle feedback
    button.style.background = 'var(--ti-warning)';
    button.textContent = 'Action undone';
    
    setTimeout(() => {
      button.style.background = '';
      button.innerHTML = `<span class="button-text">${this.label}</span><span class="icon" style="display:none;">⏳</span>`;
    }, 2000);
    
    this.dispatchEvent(new CustomEvent('undo', {
      detail: { label: this.label, timestamp: Date.now() }
    }));
  }

  finalizeAction() {
    this.cleanup();
    
    const button = this.shadowRoot.getElementById('mainButton');
    const icon = this.shadowRoot.querySelector('.icon');
    
    button.style.background = 'var(--ti-secondary)';
    icon.textContent = '✓';
    
    this.dispatchEvent(new CustomEvent('finalized', {
      detail: { label: this.label, timestamp: Date.now() }
    }));
    
    // Reset after a moment
    setTimeout(() => {
      button.removeAttribute('disabled');
      button.style.background = '';
      icon.style.display = 'none';
      icon.textContent = '⏳';
    }, 2000);
  }

  cleanup() {
    if (this.regretTimeout) {
      clearTimeout(this.regretTimeout);
      this.regretTimeout = null;
    }
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    
    const overlay = this.shadowRoot.querySelector('.countdown-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  disconnectedCallback() {
    this.cleanup();
  }
}

customElements.define('ti-button', TraumaInformedButton);
