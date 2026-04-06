/**
 * Trigger Warning Component
 * Implements: Progressive disclosure, Granular consent
 */

class TriggerWarning extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['type', 'message', 'severity', 'dismissable'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get type() {
    return this.getAttribute('type') || 'general';
  }

  get message() {
    return this.getAttribute('message') || 'This content may be difficult for some readers.';
  }

  get severity() {
    return this.getAttribute('severity') || 'medium';
  }

  get dismissable() {
    return !this.hasAttribute('dismissable') || this.getAttribute('dismissable') !== 'false';
  }

  render() {
    const severityConfig = {
      'low': {
        color: 'var(--ti-warning)',
        icon: '⚠️',
        label: 'Mild content warning'
      },
      'medium': {
        color: 'var(--ti-warning)',
        icon: '⚠️',
        label: 'Content warning'
      },
      'high': {
        color: 'var(--ti-danger)',
        icon: '🚨',
        label: 'Strong content warning'
      }
    };

    const config = severityConfig[this.severity] || severityConfig['medium'];

    this.shadowRoot.innerHTML = `
      <style>
        @import url('/css/trauma-informed-ui.css');
        
        .warning-container {
          background: var(--ti-surface);
          border: 1px solid var(--ti-border);
          border-left: 4px solid ${config.color};
          border-radius: var(--ti-radius-lg);
          padding: var(--ti-space-md);
          margin: var(--ti-space-md) 0;
          font-family: var(--ti-font-family);
          line-height: var(--ti-line-height-relaxed);
        }
        
        .warning-header {
          display: flex;
          align-items: center;
          gap: var(--ti-space-sm);
          margin-bottom: var(--ti-space-sm);
        }
        
        .warning-icon {
          font-size: 1.2em;
        }
        
        .warning-title {
          font-weight: 600;
          color: var(--ti-text);
          margin: 0;
          font-size: var(--ti-font-size-base);
        }
        
        .warning-message {
          color: var(--ti-text);
          margin-bottom: var(--ti-space-md);
          font-size: var(--ti-font-size-sm);
        }
        
        .warning-actions {
          display: flex;
          gap: var(--ti-space-sm);
          flex-wrap: wrap;
        }
        
        .warning-button {
          padding: var(--ti-space-xs) var(--ti-space-sm);
          border: 1px solid var(--ti-border);
          border-radius: var(--ti-radius-md);
          font-family: var(--ti-font-family);
          font-size: var(--ti-font-size-sm);
          cursor: pointer;
          transition: var(--ti-transition-gentle);
          background: var(--ti-bg);
          color: var(--ti-text);
        }
        
        .warning-button:hover {
          background: var(--ti-primary-soft);
          border-color: var(--ti-primary);
        }
        
        .warning-button.primary {
          background: var(--ti-primary);
          color: white;
          border-color: var(--ti-primary);
        }
        
        .warning-button.primary:hover {
          background: var(--ti-secondary);
        }
        
        .warning-button.danger {
          background: ${config.color};
          color: white;
          border-color: ${config.color};
        }
        
        .warning-button.danger:hover {
          opacity: 0.9;
        }
        
        .content-placeholder {
          background: var(--ti-bg);
          border: 2px dashed var(--ti-border);
          border-radius: var(--ti-radius-lg);
          padding: var(--ti-space-xl);
          text-align: center;
          color: var(--ti-text);
          font-family: var(--ti-font-family);
        }
        
        .content-placeholder.hidden {
          display: none;
        }
        
        .actual-content {
          display: none;
        }
        
        .actual-content.revealed {
          display: block;
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .resources-section {
          margin-top: var(--ti-space-md);
          padding-top: var(--ti-space-md);
          border-top: 1px solid var(--ti-border);
          font-size: var(--ti-font-size-sm);
        }
        
        .resources-title {
          font-weight: 600;
          margin-bottom: var(--ti-space-xs);
          color: var(--ti-text);
        }
        
        .resource-link {
          color: var(--ti-primary);
          text-decoration: none;
          display: inline-block;
          margin-right: var(--ti-space-md);
          margin-bottom: var(--ti-space-xs);
        }
        
        .resource-link:hover {
          text-decoration: underline;
        }
      </style>
      
      <div class="warning-container">
        <div class="warning-header">
          <span class="warning-icon">${config.icon}</span>
          <h3 class="warning-title">${config.label}</h3>
        </div>
        
        <div class="warning-message">
          ${this.message}
        </div>
        
        <div class="warning-actions">
          <button class="warning-button primary" id="proceedBtn">
            I understand - show content
          </button>
          <button class="warning-button" id="previewBtn">
            Tell me more first
          </button>
          ${this.dismissable ? `
            <button class="warning-button" id="dismissBtn">
              Hide this warning
            </button>
          ` : ''}
        </div>
        
        <div class="resources-section" id="resourcesSection" style="display: none;">
          <div class="resources-title">Support resources:</div>
          <a href="https://www.crisistextline.org" class="resource-link" target="_blank">Crisis Text Line</a>
          <a href="https://www.nami.org/Help Yourself" class="resource-link" target="_blank">NAMI Support</a>
          <a href="https://www.mentalhealth.gov" class="resource-link" target="_blank">Mental Health Gov</a>
        </div>
      </div>
      
      <div class="content-placeholder" id="placeholder">
        <p>🛡️ Content hidden for your wellbeing</p>
        <p style="font-size: var(--ti-font-size-sm); margin-top: var(--ti-space-sm);">
          You can choose to view this content when you feel ready.
        </p>
      </div>
      
      <div class="actual-content" id="actualContent">
        <slot></slot>
      </div>
    `;
  }

  setupEventListeners() {
    const proceedBtn = this.shadowRoot.getElementById('proceedBtn');
    const previewBtn = this.shadowRoot.getElementById('previewBtn');
    const dismissBtn = this.shadowRoot.getElementById('dismissBtn');
    const resourcesSection = this.shadowRoot.getElementById('resourcesSection');
    const placeholder = this.shadowRoot.getElementById('placeholder');
    const actualContent = this.shadowRoot.getElementById('actualContent');

    // Proceed to show content
    proceedBtn.addEventListener('click', () => {
      this.revealContent();
      this.dispatchEvent(new CustomEvent('warning-accepted', {
        detail: { 
          type: this.type,
          severity: this.severity,
          timestamp: Date.now()
        }
      }));
    });

    // Show more information
    previewBtn.addEventListener('click', () => {
      resourcesSection.style.display = resourcesSection.style.display === 'none' ? 'block' : 'none';
      this.dispatchEvent(new CustomEvent('warning-previewed', {
        detail: { 
          type: this.type,
          severity: this.severity,
          timestamp: Date.now()
        }
      }));
    });

    // Dismiss warning
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        this.dismissWarning();
      });
    }
  }

  revealContent() {
    const placeholder = this.shadowRoot.getElementById('placeholder');
    const actualContent = this.shadowRoot.getElementById('actualContent');
    const container = this.shadowRoot.querySelector('.warning-container');

    placeholder.classList.add('hidden');
    actualContent.classList.add('revealed');
    
    // Hide the warning container after content is revealed
    setTimeout(() => {
      container.style.display = 'none';
    }, 500);
  }

  dismissWarning() {
    const container = this.shadowRoot.querySelector('.warning-container');
    const placeholder = this.shadowRoot.getElementById('placeholder');
    
    container.style.display = 'none';
    placeholder.innerHTML = `
      <p>✅ Warning dismissed</p>
      <p style="font-size: var(--ti-font-size-sm); margin-top: var(--ti-space-sm);">
        Content remains hidden. You can refresh to see the warning again.
      </p>
    `;

    this.dispatchEvent(new CustomEvent('warning-dismissed', {
      detail: { 
        type: this.type,
        severity: this.severity,
        timestamp: Date.now()
      }
    }));
  }
}

customElements.define('ti-trigger-warning', TriggerWarning);
