/**
 * Interactive Tour System for Cognitive Engine
 * Implements cognitive science principles for onboarding
 */

class CognitiveTour {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.tourSteps = [];
    this.overlay = null;
    this.highlightBox = null;
    this.tooltip = null;
  }

  // Define tour steps based on cognitive load principles
  defineTourSteps(page) {
    const tours = {
      dashboard: [
        {
          id: 'welcome',
          title: 'Welcome to Cognitive Engine',
          content: 'This tool helps you apply cognitive science principles to UX design. Let me show you around in 60 seconds.',
          target: null,
          position: 'center',
          action: () => {}
        },
        {
          id: 'workflow',
          title: 'Start with Your Goal',
          content: 'Begin by selecting what you want to improve. Each goal maps to specific cognitive principles.',
          target: '#goal-group .fchip:first-child',
          position: 'bottom',
          action: () => this.highlightElement('#goal-group')
        },
        {
          id: 'context',
          title: 'Choose Your Context',
          content: 'Where will this design be used? Different contexts need different approaches.',
          target: '#ctx-group .fchip:first-child',
          position: 'bottom',
          action: () => this.highlightElement('#ctx-group')
        },
        {
          id: 'problem',
          title: 'Describe Your Problem',
          content: 'Be specific about the user friction you\'re observing. The more detail, the better the match.',
          target: '#problem-input',
          position: 'top',
          action: () => this.highlightElement('#problem-input')
        },
        {
          id: 'principles',
          title: 'Get Matched Principles',
          content: 'We\'ll find principles that directly address your problem. Click any card to learn more.',
          target: '.pcard:first-child',
          position: 'right',
          action: () => this.highlightElement('.pcard')
        },
        {
          id: 'generate',
          title: 'Generate Your Prompt',
          content: 'When you find a principle that fits, generate a structured prompt for your design work.',
          target: '.btn-tonal',
          position: 'top',
          action: () => {}
        }
      ],
      'prompt-generator': [
        {
          id: 'welcome-pg',
          title: 'Prompt Generator',
          content: 'Create detailed UX prompts based on cognitive science principles.',
          target: null,
          position: 'center',
          action: () => {}
        },
        {
          id: 'problem-pg',
          title: 'Your UX Problem',
          content: 'Describe the specific friction point users are experiencing.',
          target: '#problemInput',
          position: 'top',
          action: () => {}
        },
        {
          id: 'generate-pg',
          title: 'Generate Your Prompt',
          content: 'Click here to create a structured design prompt based on cognitive principles.',
          target: '.btn-primary',
          position: 'top',
          action: () => {}
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
    
    this.createOverlay();
    this.showStep();
  }

  createOverlay() {
    // Remove existing overlay
    this.endTour();
    
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    this.highlightBox = document.createElement('div');
    this.highlightBox.style.cssText = `
      position: absolute;
      border: 3px solid #3D63DD;
      border-radius: 8px;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
      transition: all 0.3s ease;
      pointer-events: none;
    `;
    
    this.tooltip = document.createElement('div');
    this.tooltip.style.cssText = `
      position: absolute;
      background: white;
      border-radius: 12px;
      padding: 20px;
      max-width: 320px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      opacity: 0;
      transform: scale(0.9);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.highlightBox);
    document.body.appendChild(this.tooltip);
    
    // Fade in
    setTimeout(() => {
      this.overlay.style.opacity = '1';
    }, 10);
  }

  showStep() {
    if (this.currentStep >= this.tourSteps.length) {
      this.endTour();
      return;
    }
    
    const step = this.tourSteps[this.currentStep];
    
    // Update tooltip content
    this.tooltip.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1C1B1F;">
          ${step.title}
        </h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #46464F;">
          ${step.content}
        </p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <span style="font-size: 12px; color: #767680;">
          ${this.currentStep + 1} of ${this.tourSteps.length}
        </span>
        <div style="display: flex; gap: 8px;">
          ${this.currentStep > 0 ? `
            <button onclick="cognitiveTour.previousStep()" style="
              padding: 8px 16px;
              border: 1px solid #C7C5D0;
              background: white;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
            ">Back</button>
          ` : ''}
          <button onclick="cognitiveTour.nextStep()" style="
            padding: 8px 16px;
            background: #3D63DD;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
          ">${this.currentStep === this.tourSteps.length - 1 ? 'Finish' : 'Next'}</button>
          <button onclick="cognitiveTour.endTour()" style="
            padding: 8px 16px;
              background: transparent;
              color: #767680;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
              text-decoration: underline;
          ">Skip</button>
        </div>
      </div>
    `;
    
    // Position elements
    this.positionElements(step);
    
    // Execute step action
    if (step.action) {
      step.action();
    }
    
    // Animate in
    setTimeout(() => {
      this.tooltip.style.opacity = '1';
      this.tooltip.style.transform = 'scale(1)';
    }, 10);
  }

  positionElements(step) {
    if (!step.target) {
      // Center screen
      this.highlightBox.style.display = 'none';
      this.tooltip.style.position = 'fixed';
      this.tooltip.style.top = '50%';
      this.tooltip.style.left = '50%';
      this.tooltip.style.transform = 'translate(-50%, -50%)';
      return;
    }
    
    const target = document.querySelector(step.target);
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    
    // Position highlight box
    this.highlightBox.style.display = 'block';
    this.highlightBox.style.top = rect.top - 5 + 'px';
    this.highlightBox.style.left = rect.left - 5 + 'px';
    this.highlightBox.style.width = rect.width + 10 + 'px';
    this.highlightBox.style.height = rect.height + 10 + 'px';
    
    // Position tooltip
    this.tooltip.style.position = 'fixed';
    
    switch (step.position) {
      case 'top':
        this.tooltip.style.bottom = (window.innerHeight - rect.top + 15) + 'px';
        this.tooltip.style.left = rect.left + (rect.width / 2) - 160 + 'px';
        break;
      case 'bottom':
        this.tooltip.style.top = (rect.bottom + 15) + 'px';
        this.tooltip.style.left = rect.left + (rect.width / 2) - 160 + 'px';
        break;
      case 'left':
        this.tooltip.style.right = (window.innerWidth - rect.left + 15) + 'px';
        this.tooltip.style.top = rect.top + (rect.height / 2) - 60 + 'px';
        break;
      case 'right':
        this.tooltip.style.left = (rect.right + 15) + 'px';
        this.tooltip.style.top = rect.top + (rect.height / 2) - 60 + 'px';
        break;
      default:
        this.tooltip.style.top = rect.bottom + 15 + 'px';
        this.tooltip.style.left = rect.left + 'px';
    }
    
    // Adjust if tooltip goes off screen
    const tooltipRect = this.tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth - 20) {
      this.tooltip.style.left = (window.innerWidth - tooltipRect.width - 20) + 'px';
    }
    if (tooltipRect.left < 20) {
      this.tooltip.style.left = '20px';
    }
  }

  highlightElement(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.transition = 'all 0.3s ease';
      el.style.transform = 'scale(1.02)';
      el.style.boxShadow = '0 0 0 3px rgba(61, 99, 221, 0.3)';
    });
    
    setTimeout(() => {
      elements.forEach(el => {
        el.style.transform = '';
        el.style.boxShadow = '';
      });
    }, 2000);
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

  endTour() {
    this.isActive = false;
    
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    if (this.highlightBox) {
      this.highlightBox.remove();
      this.highlightBox = null;
    }
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }
}

// Global instance
const cognitiveTour = new CognitiveTour();

// Auto-start tour for first-time visitors
document.addEventListener('DOMContentLoaded', function() {
  const hasSeenTour = localStorage.getItem('cognitiveEngineTourSeen');
  const page = window.location.pathname.includes('prompt-generator') ? 'prompt-generator' : 'dashboard';
  
  if (!hasSeenTour) {
    setTimeout(() => {
      cognitiveTour.startTour(page);
    }, 1000);
  }
});

// Add tour trigger buttons
document.addEventListener('DOMContentLoaded', function() {
  const tourBtn = document.createElement('button');
  tourBtn.innerHTML = '<span class="mi" style="font-size: 18px;">help_outline</span> Tour';
  tourBtn.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    background: white;
    border: 1px solid #C7C5D0;
    border-radius: 20px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    font: 500 14px 'Roboto';
    color: #1C1B1F;
    cursor: pointer;
    box-shadow: var(--el3);
    transition: all 0.2s;
    z-index: 1000;
  `;
  
  tourBtn.addEventListener('click', () => {
    const page = window.location.pathname.includes('prompt-generator') ? 'prompt-generator' : 'dashboard';
    cognitiveTour.startTour(page);
  });
  
  tourBtn.addEventListener('mouseenter', () => {
    tourBtn.style.transform = 'translateY(-2px)';
    tourBtn.style.boxShadow = '0 6px 14px 4px rgba(0,0,0,0.15), 0 2px 5px rgba(0,0,0,0.3)';
  });
  
  tourBtn.addEventListener('mouseleave', () => {
    tourBtn.style.transform = '';
    tourBtn.style.boxShadow = 'var(--el3)';
  });
  
  document.body.appendChild(tourBtn);
  
  // Mark tour as seen when completed
  const originalEndTour = cognitiveTour.endTour.bind(cognitiveTour);
  cognitiveTour.endTour = function() {
    originalEndTour();
    localStorage.setItem('cognitiveEngineTourSeen', 'true');
  };
});
