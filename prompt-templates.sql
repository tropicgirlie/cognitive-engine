-- Prompt Templates Database for Cognitive Load Intervention Engine
-- Stores structured templates for generating AI-ready design prompts

-- Design tools supported
CREATE TABLE design_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL, -- 'visual', 'code', 'strategy', 'workflow'
  icon TEXT, -- Material Symbols icon name
  capabilities JSONB, -- Array of tool capabilities
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompt templates for each tool and principle combination
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  principle_id UUID NOT NULL REFERENCES principles(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES design_tools(id) ON DELETE CASCADE,
  context_id UUID REFERENCES contexts(id),
  sector_id UUID REFERENCES sectors(id),
  
  -- Template structure
  template_name TEXT NOT NULL,
  template_description TEXT,
  
  -- Prompt components
  introduction_template TEXT,
  requirements_template TEXT,
  implementation_template TEXT,
  anti_patterns_template TEXT,
  success_criteria_template TEXT,
  
  -- Tool-specific optimizations
  tool_specific_instructions TEXT,
  code_snippets JSONB, -- Pre-written code examples
  design_patterns JSONB, -- UI/UX patterns to include
  
  -- Metadata
  complexity_level TEXT CHECK (complexity_level IN ('basic', 'intermediate', 'advanced')),
  estimated_time TEXT, -- e.g., "30-60 minutes"
  prerequisites JSONB, -- Required knowledge or tools
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(principle_id, tool_id, context_id, sector_id)
);

-- Prompt generation history for analytics
CREATE TABLE prompt_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  problem_text TEXT NOT NULL,
  context_id UUID REFERENCES contexts(id),
  sector_id UUID REFERENCES sectors(id),
  tool_id UUID REFERENCES design_tools(id),
  generated_prompt TEXT NOT NULL,
  principles_applied JSONB, -- Array of principle IDs used
  user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5),
  usage_outcome TEXT, -- 'successful', 'modified', 'abandoned'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert design tools
INSERT INTO design_tools (name, description, category, icon, capabilities) VALUES
('Figma Make', 'AI-powered visual design and component generation', 'visual', 'design_services', 
 '["component_generation", "visual_design", "design_systems", "prototyping"]'),
('Windsurf Builder', 'Code generation for responsive web interfaces', 'code', 'code',
 '["html_generation", "css_styling", "javascript_interactivity", "responsive_design"]'),
('ChatGPT/Claude', 'Strategic design guidance and UX planning', 'strategy', 'chat',
 '["ux_strategy", "design_thinking", "user_research", "problem_solving"]'),
('Linear/Notion', 'Workflow design and team collaboration tools', 'workflow', 'linear_scale',
 '["process_design", "team_coordination", "project_management", "documentation"]');

-- Sample prompt templates for Hick's Law
INSERT INTO prompt_templates (
  principle_id, tool_id, context_id, sector_id,
  template_name, template_description,
  introduction_template, requirements_template, implementation_template,
  anti_patterns_template, success_criteria_template,
  tool_specific_instructions, complexity_level, estimated_time
) VALUES
-- Figma template for Hick's Law in Data Entry context
((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 (SELECT id FROM design_tools WHERE name = 'Figma Make'),
 (SELECT id FROM contexts WHERE name = 'Data Entry & Forms'),
 NULL,
 'Payment Method Selector - Hick''s Law Implementation',
 'Create payment selection components that reduce decision complexity using Hick''s Law principles',
 
 'Create a payment method selector component that applies Hick''s Law to reduce decision time and cognitive load:',
 
 '## Components Required
1. **Primary Payment Options**
   - Limit to 3-4 most common payment methods
   - Use visual cards with clear branding and trust indicators
   - Implement smart defaults based on user history

2. **Secondary Options Grouping**
   - Group less common methods under "More Options"
   - Use dropdown or accordion pattern
   - Maintain discoverability without overwhelming users

3. **Visual Hierarchy**
   - Primary options: Larger size, prominent placement
   - Secondary options: Smaller size, grouped presentation
   - Selected state: Clear visual feedback

## Design System Integration
- **Primary Actions**: 48px min height, 16px radius, cyan gradient
- **Secondary Options**: 40px height, 8px radius, gray background
- **Smart Defaults**: Auto-select user''s last payment method
- **Mobile Optimization**: Bottom sheet for payment selection',
 
 '## Component Specifications
### Primary Payment Cards
- **Size**: 120px width × 80px height (desktop), 100% width (mobile)
- **Border**: 2px solid, changes to cyan on selection
- **Background**: White with subtle shadow
- **Hover**: Transform translateY(-2px), border-color cyan

### Advanced Options Dropdown
- **Trigger**: "More payment options" button with chevron
- **Content**: List of additional methods with icons
- **Animation**: Smooth slide-down (300ms ease)
- **Position**: Below primary options, left-aligned

### Mobile Adaptations
- **Layout**: Stacked cards, full-width buttons
- **Touch Targets**: Minimum 44px height
- **Gesture**: Swipe to reveal more options',
 
 '## Anti-Patterns to Avoid
❌ **Choice Overload**: Don''t show all 10+ payment options simultaneously
❌ **Equal Weight**: Don''t give equal visual prominence to all options
❌ **Hidden Defaults**: Don''t force users to re-select common options
❌ **Poor Grouping**: Don''t mix primary and secondary options randomly

## Alternative Approaches
- **Smart Recommendations**: AI-powered payment method suggestions
- **Progressive Disclosure**: Reveal options based on user context
- **Personalization**: Remember and surface user preferences',
 
 '## Success Metrics
- **Decision Time**: Reduce from 45s to 18s (60% improvement)
- **Selection Accuracy**: Increase to 95% first-time selection
- **User Confidence**: Improve satisfaction score to 4.5/5.0
- **Conversion Rate**: Increase checkout completion by 40%

## Validation Checklist
- [ ] Primary options limited to 3-4 choices
- [ ] Secondary options clearly grouped
- [ ] Visual hierarchy guides attention
- [ ] Mobile touch targets meet accessibility standards
- [ ] Smart defaults implemented where possible',
 
 '## Figma-Specific Instructions
- Use **Auto Layout** for responsive component behavior
- Create **Component Properties** for dynamic content
- Implement **Variants** for different states (default, hover, selected, disabled)
- Use **Design Tokens** for consistent styling
- Add **Interactive Components** for prototyping
- Include **Device Frames** for mobile/desktop preview

## Component Properties to Include
- **paymentMethods**: Array of available options
- **selectedMethod**: Currently selected payment type
- **showAdvanced**: Boolean for secondary options visibility
- **userPreferences**: User''s payment history

## Export Settings
- **Format**: SVG for icons, PNG for images
- **Resolution**: 2x for retina displays
- **Compression**: Optimize for web performance',
 
 'intermediate', '45-60 minutes'),

-- Windsurf template for Hick's Law in Data Entry context  
((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 (SELECT id FROM design_tools WHERE name = 'Windsurf Builder'),
 (SELECT id FROM contexts WHERE name = 'Data Entry & Forms'),
 NULL,
 'Responsive Payment Form - Hick''s Law Implementation',
 'Build a responsive checkout form with Hick''s Law principles for reduced cognitive load',
 
 'Build a responsive checkout flow that implements Hick''s Law to reduce decision complexity and improve completion rates:',
 
 '## HTML Structure
```html
<form class="payment-form" role="form">
  <div class="progress-indicator" aria-label="Checkout progress">
    <div class="step active" data-step="1">Shipping</div>
    <div class="step" data-step="2">Payment</div>
    <div class="step" data-step="3">Review</div>
  </div>
  
  <fieldset class="payment-section">
    <legend>Choose Payment Method</legend>
    <div class="primary-options" role="radiogroup">
      <!-- 3-4 primary payment methods -->
    </div>
    <details class="advanced-options">
      <summary>More payment options</summary>
      <div class="secondary-options">
        <!-- Additional payment methods -->
      </div>
    </details>
  </fieldset>
</form>
```',
 
 '## CSS Implementation
```css
.payment-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.primary-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.payment-method {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.payment-method:hover {
  border-color: #0891b2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.15);
}

.payment-method.selected {
  border-color: #0891b2;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
}

.payment-method input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.advanced-options {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.advanced-options summary {
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  padding: 0.5rem 0;
}

@media (max-width: 768px) {
  .primary-options {
    grid-template-columns: 1fr;
  }
  
  .payment-method {
    padding: 1rem;
    min-height: 60px; /* 44px touch target + padding */
  }
}
```',
 
 '## Anti-Patterns to Avoid
❌ **Information Overload**: Don''t display all payment options simultaneously
❌ **Poor Visual Hierarchy**: Don''t use equal styling for all options
❌ **Inaccessible Design**: Don''t forget keyboard navigation and screen readers
❌ **Performance Issues**: Don\"t load all payment method assets upfront

## Alternative Approaches
- **Lazy Loading**: Load secondary options only when needed
- **Smart Defaults**: Use AI to predict user preferences
- **Progressive Enhancement**: Ensure functionality without JavaScript',
 
 '## Success Metrics
- **Form Completion**: Increase from 60% to 85%
- **Decision Time**: Reduce from 45s to under 20s
- **Error Rate**: Decrease validation errors by 50%
- **Mobile Conversion**: Improve mobile completion by 40%

## Performance Targets
- **First Contentful Paint**: < 1.5s
- **Interaction Response**: < 100ms
- **Bundle Size**: < 45KB gzipped
- **Lighthouse Score**: > 90',
 
 '## Code Generation Requirements
- Use **semantic HTML5** elements for accessibility
- Implement **CSS Grid/Flexbox** for responsive layouts
- Add **ARIA attributes** for screen reader support
- Include **form validation** with clear error messages
- Use **CSS custom properties** for theming
- Implement **progressive enhancement** patterns

## JavaScript Functionality
- **Form Validation**: Real-time validation with helpful messages
- **State Management**: Track user selections and progress
- **Analytics Integration**: Track user interactions and drop-off points
- **Error Handling**: Graceful degradation for unsupported features

## Testing Requirements
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: Mobile, tablet, desktop viewports
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization',
 
 'intermediate', '60-90 minutes'),

-- ChatGPT template for Hick's Law in Data Entry context
((SELECT id FROM principles WHERE name = 'Hick''s Law'),
 (SELECT id FROM design_tools WHERE name = 'ChatGPT/Claude'),
 (SELECT id FROM contexts WHERE name = 'Data Entry & Forms'),
 NULL,
 'UX Strategy for Payment Form - Hick''s Law Application',
 'Strategic guidance for redesigning payment forms using cognitive load principles',
 
 'You are a senior UX designer specializing in e-commerce cognitive load reduction. I need strategic guidance for redesigning a payment form where users are abandoning due to decision paralysis.',
 
 '## Strategic Analysis Required

### 1. Current Problem Assessment
Analyze the cognitive burden in the existing payment form:
- **Choice Overload**: How many payment options are presented?
- **Decision Complexity**: What makes the selection process difficult?
- **Visual Hierarchy**: How is attention guided through the options?
- **User Confidence**: What factors affect trust and decision-making?

### 2. Hick''s Law Application
**Principle**: Decision time increases logarithmically with the number of choices

**Strategic Questions**:
- What is the optimal number of primary payment options? (Research suggests 3-4)
- How should secondary options be presented without overwhelming users?
- What visual cues can guide users to the best choice?
- How can we use smart defaults to reduce decision burden?

### 3. Implementation Strategy
#### Primary Options Design
- **Selection Criteria**: Which 3-4 payment methods should be primary?
- **Visual Presentation**: How to make primary options stand out?
- **Default Selection**: When and how to pre-select options?
- **Mobile Considerations**: How to adapt for touch interfaces?

#### Secondary Options Strategy
- **Grouping Method**: Dropdown, accordion, or progressive disclosure?
- **Discoverability**: How to ensure users can find less common options?
- **Context Relevance**: When to show different secondary options?
- **Performance Impact**: How to handle loading and rendering?

### 4. Business Considerations
#### Conversion Optimization
- **Balance**: Simplicity vs. payment method diversity
- **Analytics**: How to measure the impact on conversion rates?
- **A/B Testing**: What variations should we test?
- **User Segmentation**: How do different user groups behave?

#### Technical Implementation
- **Progressive Enhancement**: Ensure functionality without JavaScript
- **Performance**: Load times and interaction responsiveness
- **Accessibility**: Screen readers, keyboard navigation, cognitive disabilities
- **International**: Different payment methods by region',
 
 '## Anti-Patterns to Avoid
❌ **Analysis Paralysis**: Too many choices presented simultaneously
❌ **Hidden Complexity**: Buried options that users can''t find
❌ **Poor Defaults**: No intelligent pre-selections
❌ **Inconsistent Patterns**: Different interaction models across similar tasks

## Risk Mitigation
- **User Testing**: Validate decisions with real users
- **Analytics Monitoring**: Track behavior changes
- **Fallback Options**: Ensure all payment methods remain accessible
- **Iterative Improvement**: Continuous optimization based on data',
 
 '## Success Metrics
### Quantitative Measures
- **Completion Rate**: Target 40% improvement (60% → 85%)
- **Decision Time**: Reduce by 60% (45s → 18s)
- **Error Rate**: Decrease by 50% in form validation errors
- **User Satisfaction**: Improve to 4.5/5.0 rating

### Qualitative Measures
- **User Confidence**: Increased trust in payment process
- **Perceived Simplicity**: User feedback on ease of use
- **Task Success**: Higher first-time success rates
- **Return Usage**: Increased repeat purchase rates

## Implementation Roadmap
1. **Research Phase** (2 weeks): User testing, analytics review
2. **Design Phase** (3 weeks): Wireframes, prototypes, user validation
3. **Development Phase** (4 weeks): Implementation, testing, optimization
4. **Launch Phase** (1 week): Deployment, monitoring, iteration

## Deliverables
1. **Design Strategy Document** (3-5 pages)
2. **User Flow Redesign** (wireframes + annotations)
3. **Component Library** (design specifications)
4. **Implementation Guidelines** (technical requirements)
5. **Success Metrics Framework** (KPIs and analytics)',
 
 '## Strategic Guidance Requirements
- **Evidence-Based**: Use research and data to support recommendations
- **Business-Aware**: Balance user experience with conversion goals
- **Practical Focus**: Provide actionable, implementable solutions
- **Risk Assessment**: Identify potential issues and mitigation strategies
- **Measurement Plan**: Define clear success metrics and tracking methods

## Analysis Framework
- **Cognitive Psychology**: Apply established principles correctly
- **User Research**: Incorporate real user needs and behaviors
- **Competitive Analysis**: Learn from industry best practices
- **Technical Constraints**: Consider implementation limitations
- **Business Context**: Understand organizational requirements and constraints',
 
 'advanced', '90-120 minutes');

-- Create indexes for performance
CREATE INDEX idx_prompt_templates_lookup ON prompt_templates(principle_id, tool_id, context_id, sector_id);
CREATE INDEX idx_prompt_generations_user ON prompt_generations(user_id, created_at);
CREATE INDEX idx_prompt_generations_analytics ON prompt_generations(tool_id, context_id, created_at);

-- Function to generate prompts based on inputs
CREATE OR REPLACE FUNCTION generate_design_prompt(
  p_principle_id UUID,
  p_tool_id UUID,
  p_context_id UUID DEFAULT NULL,
  p_sector_id UUID DEFAULT NULL
) RETURNS TABLE (
  template_name TEXT,
  introduction TEXT,
  requirements TEXT,
  implementation TEXT,
  anti_patterns TEXT,
  success_criteria TEXT,
  tool_specific TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.template_name,
    pt.introduction_template,
    pt.requirements_template,
    pt.implementation_template,
    pt.anti_patterns_template,
    pt.success_criteria_template,
    pt.tool_specific_instructions
  FROM prompt_templates pt
  WHERE pt.principle_id = p_principle_id
    AND pt.tool_id = p_tool_id
    AND (p_context_id IS NULL OR pt.context_id = p_context_id)
    AND (p_sector_id IS NULL OR pt.sector_id = p_sector_id)
  ORDER BY 
    CASE WHEN pt.context_id = p_context_id THEN 1 ELSE 2 END,
    CASE WHEN pt.sector_id = p_sector_id THEN 1 ELSE 2 END;
END;
$$ LANGUAGE plpgsql;
