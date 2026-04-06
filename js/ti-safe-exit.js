/**
 * Safe Exit Component
 * Implements: Exit is always visible, Granular consent
 */

class SafeExit extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['redirect-to', 'clear-history', 'position', 'message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get redirectTo() {
    return this.getAttribute('redirect-to') || 'https://weather.com';
  }

  get clearHistory() {
    return this.hasAttribute('clear-history');
  }

  get position() {
    return this.getAttribute('position') || 'top-right';
  }

  get message() {
    return this.getAttribute('message') || 'Need a break?';
  }

  render() {
    const positionStyles = {
      'top-right': 'top: 1rem; right: 1rem;',
      'top-left': 'top: 1rem; left: 1rem;',
      'bottom-right': 'bottom: 1rem; right: 1rem;',
      'bottom-left': 'bottom: 1rem; left: 1rem;'
    };

    this.shadowRoot.innerHTML = `
      <style>
        @import url('/css/trauma-informed-ui.css');
        
        :host {
          position: fixed;
          z-index: 9999;
          ${positionStyles[this.position] || positionStyles['top-right']}
        }
        
        .safe-exit {
          display: flex;
          align-items: center;
          gap: var(--ti-space-xs);
          padding: var(--ti-space-sm) var(--ti-space-md);
          background: var(--ti-surface);
          border: 1px solid var(--ti-border);
          border-radius: var(--ti-radius-lg);
          color: var(--ti-text);
          text-decoration: none;
          font-family: var(--ti-font-family);
          font-size: var(--ti-font-size-sm);
          transition: var(--ti-transition-gentle);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .safe-exit:hover {
          background: var(--ti-primary-soft);
          border-color: var(--ti-primary);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .safe-exit:focus-visible {
          outline: none;
          box-shadow: var(--ti-focus-ring);
        }
        
        .exit-icon {
          font-size: 1.2em;
          opacity: 0.7;
        }
        
        .exit-text {
          font-weight: 500;
        }
        
        /* Pulse animation for attention */
        @keyframes gentle-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        .safe-exit {
          animation: gentle-pulse 3s ease-in-out infinite;
        }
        
        .safe-exit:hover {
          animation: none;
        }
        
        /* Confirmation modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          visibility: hidden;
          transition: var(--ti-transition-slow);
        }
        
        .modal-overlay.show {
          opacity: 1;
          visibility: visible;
        }
        
        .modal-content {
          background: var(--ti-bg);
          border-radius: var(--ti-radius-xl);
          padding: var(--ti-space-xl);
          max-width: 400px;
          width: 90%;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          transform: scale(0.9);
          transition: var(--ti-transition-gentle);
        }
        
        .modal-overlay.show .modal-content {
          transform: scale(1);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          gap: var(--ti-space-sm);
          margin-bottom: var(--ti-space-md);
        }
        
        .modal-title {
          font-family: var(--ti-font-family);
          font-size: var(--ti-font-size-lg);
          font-weight: 700;
          color: var(--ti-text);
          margin: 0;
        }
        
        .modal-body {
          font-family: var(--ti-font-family);
          font-size: var(--ti-font-size-base);
          line-height: var(--ti-line-height-relaxed);
          color: var(--ti-text);
          margin-bottom: var(--ti-space-lg);
        }
        
        .modal-actions {
          display: flex;
          gap: var(--ti-space-sm);
          justify-content: flex-end;
        }
        
        .modal-button {
          padding: var(--ti-space-sm) var(--ti-space-md);
          border: 1px solid var(--ti-border);
          border-radius: var(--ti-radius-md);
          font-family: var(--ti-font-family);
          font-size: var(--ti-font-size-sm);
          cursor: pointer;
          transition: var(--ti-transition-gentle);
        }
        
        .modal-button.primary {
          background: var(--ti-primary);
          color: white;
          border-color: var(--ti-primary);
        }
        
        .modal-button.primary:hover {
          background: var(--ti-secondary);
        }
        
        .modal-button.secondary {
          background: var(--ti-surface);
          color: var(--ti-text);
        }
        
        .modal-button.secondary:hover {
          background: var(--ti-primary-soft);
        }
      </style>
      
      <a href="#" class="safe-exit" id="exitButton">
        <span class="exit-icon">🚪</span>
        <span class="exit-text">${this.message}</span>
      </a>
      
      <div class="modal-overlay" id="modal">
        <div class="modal-content">
          <div class="modal-header">
            <span style="font-size: 1.5em;">🚪</span>
            <h2 class="modal-title">Safe Exit</h2>
          </div>
          <div class="modal-body">
            <p>You're about to leave this page. This is completely okay - take all the time you need.</p>
            <br>
            <p>${this.clearHistory ? 
              'Your browsing history on this site will be cleared for privacy.' : 
              'You can return to this page at any time.'}</p>
          </div>
          <div class="modal-actions">
            <button class="modal-button secondary" id="cancelBtn">Stay here</button>
            <button class="modal-button primary" id="confirmBtn">Continue to exit</button>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const exitButton = this.shadowRoot.getElementById('exitButton');
    const modal = this.shadowRoot.getElementById('modal');
    const cancelBtn = this.shadowRoot.getElementById('cancelBtn');
    const confirmBtn = this.shadowRoot.getElementById('confirmBtn');

    // Prevent default link behavior
    exitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.showModal();
    });

    // Close modal on cancel
    cancelBtn.addEventListener('click', () => {
      this.hideModal();
    });

    // Confirm exit
    confirmBtn.addEventListener('click', () => {
      this.performExit();
    });

    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideModal();
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        this.hideModal();
      }
    });
  }

  showModal() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.classList.add('show');
    
    // Focus management
    setTimeout(() => {
      const confirmBtn = this.shadowRoot.getElementById('confirmBtn');
      confirmBtn.focus();
    }, 100);
  }

  hideModal() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.classList.remove('show');
  }

  performExit() {
    // Clear history if requested
    if (this.clearHistory) {
      try {
        window.history.replaceState(null, '', window.location.href);
        if (window.sessionStorage) {
          window.sessionStorage.clear();
        }
      } catch (e) {
        console.warn('Could not clear history:', e);
      }
    }

    // Fire exit event
    this.dispatchEvent(new CustomEvent('safe-exit', {
      detail: { 
        redirectTo: this.redirectTo,
        clearHistory: this.clearHistory,
        timestamp: Date.now()
      }
    }));

    // Redirect after a brief moment
    setTimeout(() => {
      window.location.href = this.redirectTo;
    }, 300);
  }
}

customElements.define('ti-safe-exit', SafeExit);
