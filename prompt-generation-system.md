# Prompt Generation System Architecture

## 🎯 Core Value Proposition

**From Theory to Action**: Transform cognitive load principles into AI-ready prompts for immediate application in design tools.

## 🔄 Transformation Pipeline

```
Problem + Context → Matched Principles → Design Actions → Tool-Specific Prompts
```

### Step 1: Problem Analysis
- User describes UX problem
- AI classifies into taxonomy (problem type + context)
- Extracts key constraints and requirements

### Step 2: Principle Matching
- Database lookup for relevant principles
- Relevance scoring based on problem-context match
- Top 3-5 principles selected

### Step 3: Action Translation
- Convert principle theory into practical UX recommendations
- Include anti-patterns and specific UI patterns
- Add sector-specific examples

### Step 4: Prompt Generation
- Transform actions into tool-specific prompts
- Optimize for each design tool's capabilities
- Include validation criteria and success metrics

## 🛠️ Design Tool Support

### Figma Make
- **Focus**: Component generation, layout optimization
- **Strengths**: Visual design, component systems
- **Prompt Style**: Component-focused with design tokens

### Windsurf Builder
- **Focus**: Code generation, responsive design
- **Strengths**: HTML/CSS implementation, interactivity
- **Prompt Style**: Technical implementation details

### ChatGPT/Claude
- **Focus**: Design strategy, user research
- **Strengths**: Conceptual thinking, UX strategy
- **Prompt Style**: Strategic design guidance

### Linear/Notion
- **Focus**: Workflow design, team collaboration
- **Strengths**: Process optimization, team coordination
- **Prompt Style**: Workflow and process improvements

## 📝 Prompt Template Structure

### Base Template
```
## Design Task: [Problem Description]

### Context
- **Problem Type**: [Classified Problem]
- **Decision Environment**: [Context]
- **Sector**: [Sector if applicable]
- **Key Constraints**: [Extracted Requirements]

### Applied Principles
1. **[Principle Name]** - [Brief Explanation]
   - **Why it applies**: [Contextual Reasoning]
   - **Cognitive Impact**: [Load Reduction]

### Design Requirements
#### Must-Have Actions
- [Action 1 with specific implementation guidance]
- [Action 2 with specific implementation guidance]
- [Action 3 with specific implementation guidance]

#### Anti-Patterns to Avoid
- [Anti-pattern 1] → [Alternative approach]
- [Anti-pattern 2] → [Alternative approach]

#### Success Criteria
- [Measurable outcome 1]
- [Measurable outcome 2]
- [Measurable outcome 3]

### Tool-Specific Instructions
[Tool-optimized guidance]

### Validation Checklist
- [ ] Cognitive load reduction achieved
- [ ] Decision complexity minimized
- [ ] Recognition over recall implemented
- [ ] Progressive disclosure used appropriately
```

## 🎨 Tool-Specific Optimizations

### Figma Make Prompts
```
Create a Figma component library that implements [Principle]:

## Components Needed
- **Primary Action Button**: [Specific design requirements]
- **Secondary Options**: [Grouping strategy]
- **Progress Indicator**: [Visual design specs]

## Design System Integration
- **Colors**: Use semantic color tokens
- **Typography**: Follow established hierarchy
- **Spacing**: Use 8px grid system
- **Border Radius**: Consistent with design tokens

## Component States
- **Default**: [Visual specifications]
- **Hover**: [Interaction design]
- **Focus**: [Accessibility requirements]
- **Disabled**: [Visual treatment]

## Responsive Behavior
- **Mobile**: [Adaptation strategy]
- **Tablet**: [Layout adjustments]
- **Desktop**: [Full feature set]

Generate complete components with auto layout and component properties.
```

### Windsurf Builder Prompts
```
Build a responsive web interface that applies [Principle]:

## HTML Structure
```html
[Semantic HTML structure with accessibility]
```

## CSS Implementation
```css
[Modern CSS with custom properties, grid/flexbox]
```

## JavaScript Functionality
```javascript
[Interactive behavior with progressive enhancement]
```

## Responsive Design
- **Mobile First**: Start with mobile layout
- **Breakpoints**: 768px, 1024px, 1440px
- **Fluid Typography**: Use clamp() for scalable text
- **Flexible Images**: Use object-fit and aspect-ratio

## Performance Requirements
- **Load Time**: < 2 seconds initial paint
- **Interaction**: < 100ms response time
- **Bundle Size**: < 50KB gzipped

## Accessibility Standards
- **WCAG 2.1 AA**: Color contrast, keyboard navigation
- **Screen Readers**: Proper ARIA labels and landmarks
- **Focus Management**: Logical tab order and focus indicators

Generate production-ready code with modern best practices.
```

### ChatGPT/Claude Prompts
```
You are a senior UX designer specializing in cognitive load reduction. 

## Design Challenge
I need to redesign [specific interface] to address [problem type] in [context].

## Strategic Analysis
Using cognitive psychology principles, analyze:

1. **Current Cognitive Load Issues**
   - Identify memory burden points
   - Spot decision complexity hotspots
   - Find recognition vs recall problems

2. **Strategic Design Approach**
   - Apply [Principle 1]: [Specific application]
   - Apply [Principle 2]: [Specific application]
   - Apply [Principle 3]: [Specific application]

3. **User Experience Strategy**
   - **Onboarding**: How to introduce changes
   - **Learning Curve**: Minimizing training needs
   - **Error Prevention**: Proactive design decisions

## Deliverables
1. **Design Strategy Document** (2-3 pages)
2. **User Flow Optimization** (diagram + explanation)
3. **Interaction Design Guidelines** (specific patterns)
4. **Success Metrics** (how to measure improvement)

Provide strategic recommendations that balance user needs with business constraints.
```

## 🧠 AI Prompt Generation Logic

### Principle-to-Prompt Mapping
```javascript
const principlePromptMappings = {
  "Hick's Law": {
    figma: "Create decision interfaces with 3-5 primary options...",
    windsurf: "Implement dropdown menus and progressive disclosure...",
    chatgpt: "Design choice architecture that reduces decision time..."
  },
  "Miller's Law": {
    figma: "Group information into chunks of 7±2 items...",
    windsurf: "Use card layouts and visual grouping...",
    chatgpt: "Structure information architecture for working memory..."
  }
};
```

### Context-Specific Adaptations
```javascript
const contextAdaptations = {
  "Data Entry & Forms": {
    focus: "form completion, validation, input efficiency",
    patterns: ["progressive disclosure", "smart defaults", "input grouping"],
    antiPatterns: ["long forms", "equal weight fields", "hidden validation"]
  },
  "Decision & Approvals": {
    focus: "risk communication, clear options, confidence building",
    patterns: ["visual hierarchy", "comparison tables", "clear CTAs"],
    antiPatterns: ["information overload", "unclear consequences", "paradox of choice"]
  }
};
```

### Sector-Specific Examples
```javascript
const sectorExamples = {
  "Laboratory operations": {
    hicksLaw: "Test ordering: show common panels first, hide rare tests",
    millersLaw: "Results display: group abnormal values separately",
    fittsLaw: "Equipment controls: large touch targets for gloved hands"
  },
  "Commercial workflows": {
    hicksLaw: "CRM: limit pipeline stages to 5-7 key steps",
    millersLaw: "Dashboard: group metrics by business function",
    fittsLaw: "Mobile: bottom navigation for thumb reach"
  }
};
```

## 📊 Prompt Quality Metrics

### Validation Criteria
- **Specificity**: Clear, actionable instructions
- **Completeness**: All necessary details included
- **Tool Appropriateness**: Optimized for target platform
- **Principle Alignment**: Correctly applies cognitive principles
- **Context Relevance**: Matches user's specific situation

### Success Metrics
- **Prompt Adoption Rate**: % users copy/use generated prompts
- **Design Success Rate**: % prompts lead to successful designs
- **Time Savings**: Reduction in design iteration time
- **Quality Improvement**: Measurable UX improvements

## 🔄 Iteration System

### User Feedback Loop
1. **Generate Prompt** → User applies in design tool
2. **Collect Results** → Screenshots, outcomes, metrics
3. **Analyze Success** → What worked, what didn't
4. **Refine Templates** → Improve prompt generation
5. **Update System** → Better mappings and adaptations

### Continuous Learning
- **Prompt Performance Tracking**: Which templates work best
- **Tool Evolution**: Adapt to new features and capabilities
- **Principle Refinement**: Update based on real-world applications
- **Context Expansion**: Add new problem types and sectors

## 🚀 Implementation Roadmap

### Phase 1: Core System
- [x] Principle database with actions
- [x] Basic prompt templates
- [x] Tool-specific mappings
- [ ] Simple web interface

### Phase 2: Intelligence
- [ ] AI-powered prompt optimization
- [ ] Context-aware adaptations
- [ ] Success prediction models
- [ ] A/B testing framework

### Phase 3: Ecosystem
- [ ] Design tool integrations
- [ ] Community prompt sharing
- [ ] Advanced analytics
- [ ] Enterprise features

This system transforms abstract cognitive principles into concrete, actionable prompts that designers can immediately apply in their preferred tools, bridging the gap between theory and practice.
