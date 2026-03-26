# Structured Prompt Templates for AI Design Tools

## 🎯 Prompt Engineering Philosophy

**From Generic to Specific**: Transform abstract principles into concrete, actionable instructions that tell AI tools exactly what to build, not just what to consider.

## 📋 Universal Prompt Structure

Every generated prompt follows this rigorous structure:

```
1. ROLE & CONTEXT
   - Specific expertise domain
   - Precise problem definition
   - Target user characteristics
   - Business objectives

2. PROBLEM ANALYSIS
   - Cognitive load issues identified
   - Specific improvements needed
   - Root cause analysis

3. DESIGN CONSTRAINTS
   - Technical limitations
   - Platform requirements
   - Performance targets
   - Brand/compliance requirements

4. REQUIRED DESIGN PATTERNS
   - Exact patterns to implement
   - Specific interaction details
   - Visual hierarchy specifications

5. ANTI-PATTERNS TO AVOID
   - Explicit "do not" instructions
   - Common mistakes to prevent
   - Alternative approaches

6. REQUIRED DELIVERABLES
   - Specific component requirements
   - Documentation needs
   - Testing requirements

7. VALIDATION CRITERIA
   - Measurable success metrics
   - Quality standards
   - Submission requirements
```

## 🛠️ Tool-Specific Prompt Templates

### Figma Make Prompts

#### Structure for Component Generation
```
You are a senior product designer specializing in [specific domain] with expertise in cognitive load reduction and mobile-first design.

ROLE & CONTEXT:
- Platform: [specific platform requirements]
- User expertise: [technical level]
- Business constraints: [specific limitations]
- Performance requirements: [exact metrics]

PROBLEM ANALYSIS:
COGNITIVE LOAD ISSUES:
1. [Specific issue 1] - [quantified impact]
2. [Specific issue 2] - [quantified impact]
3. [Specific issue 3] - [quantified impact]

REQUIRED IMPROVEMENTS:
- [Specific improvement 1] with [measurable target]
- [Specific improvement 2] with [measurable target]

DESIGN CONSTRAINTS:
MUST RESPECT:
- [Technical constraint 1]: [specific requirement]
- [Platform constraint 2]: [specific requirement]
- [Accessibility constraint 3]: [specific requirement]

PERFORMANCE TARGETS:
- [Metric 1]: [specific target]
- [Metric 2]: [specific target]

REQUIRED DESIGN PATTERNS:
1. [PATTERN NAME]
   - Implementation: [exact specifications]
   - Visual specs: [precise measurements]
   - Interaction: [specific behaviors]
   - States: [all required states]

2. [PATTERN NAME]
   - Implementation: [exact specifications]
   - Visual specs: [precise measurements]
   - Interaction: [specific behaviors]

ANTI-PATTERNS TO AVOID:
❌ [Anti-pattern 1]: [Specific reason to avoid]
❌ [Anti-pattern 2]: [Specific reason to avoid]

REQUIRED DELIVERABLES:
1. COMPONENT LIBRARY
   - [Component 1]: [exact specifications]
   - [Component 2]: [exact specifications]
   - [Component 3]: [exact specifications]

2. DESIGN SYSTEM INTEGRATION
   - Colors: [specific color requirements]
   - Typography: [specific font requirements]
   - Spacing: [specific spacing system]
   - Interactions: [specific animation requirements]

VALIDATION CRITERIA:
✅ [Quality standard 1]: [specific measurement]
✅ [Quality standard 2]: [specific measurement]
✅ [Quality standard 3]: [specific measurement]
```

### Windsurf Builder Prompts

#### Structure for Code Generation
```
You are a senior frontend developer specializing in [specific domain] with deep expertise in responsive design and performance optimization.

ROLE & CONTEXT:
- Project: [specific application type]
- Tech stack: [exact requirements]
- Target browsers: [specific support]
- Performance budget: [specific constraints]

PROBLEM ANALYSIS:
TECHNICAL ISSUES IDENTIFIED:
1. [Technical issue 1]: [performance impact]
2. [Technical issue 2]: [user experience impact]
3. [Technical issue 3]: [accessibility impact]

REQUIRED IMPROVEMENTS:
- [Technical improvement 1] with [specific implementation]
- [Technical improvement 2] with [specific implementation]

DESIGN CONSTRAINTS:
TECHNICAL REQUIREMENTS:
- HTML5 semantic structure: [specific elements required]
- CSS methodology: [specific approach required]
- JavaScript framework: [specific constraints]
- Build tools: [specific requirements]

PERFORMANCE TARGETS:
- First Contentful Paint: [specific target]
- Time to Interactive: [specific target]
- Bundle size: [specific limit]
- Lighthouse score: [specific minimum]

REQUIRED IMPLEMENTATION PATTERNS:
1. [PATTERN NAME]
   ```html
   [Exact HTML structure required]
   ```
   ```css
   [Exact CSS implementation required]
   ```
   ```javascript
   [Exact JavaScript functionality required]
   ```

2. [PATTERN NAME]
   ```html
   [Exact HTML structure required]
   ```
   ```css
   [Exact CSS implementation required]
   ```

ANTI-PATTERNS TO AVOID:
❌ [Technical anti-pattern 1]: [specific performance impact]
❌ [Technical anti-pattern 2]: [specific accessibility impact]

REQUIRED DELIVERABLES:
1. CODE STRUCTURE
   - File organization: [specific structure]
   - Component architecture: [specific pattern]
   - State management: [specific approach]

2. OPTIMIZATION
   - Critical rendering path: [specific optimizations]
   - Asset loading: [specific strategy]
   - Caching strategy: [specific approach]

VALIDATION CRITERIA:
✅ [Performance standard 1]: [specific measurement]
✅ [Code quality standard 2]: [specific requirements]
✅ [Accessibility standard 3]: [specific compliance]
```

### ChatGPT/Claude Prompts

#### Structure for Strategic Guidance
```
You are a senior UX strategist with 15+ years of experience in [specific domain] and expertise in cognitive psychology applied to digital interfaces.

ROLE & CONTEXT:
- Client: [specific industry/company type]
- Project scope: [specific deliverables]
- Timeline: [specific constraints]
- Budget: [specific limitations]

PROBLEM ANALYSIS:
STRATEGIC ISSUES IDENTIFIED:
1. [Business issue 1]: [revenue/impact analysis]
2. [User experience issue 2]: [user research findings]
3. [Technical feasibility issue 3]: [implementation constraints]

STRATEGIC REQUIREMENTS:
- [Business objective 1] with [specific KPI]
- [User experience objective 2] with [measurement approach]
- [Technical objective 3] with [success criteria]

STRATEGIC CONSTRAINTS:
BUSINESS LIMITATIONS:
- [Business constraint 1]: [specific impact on design]
- [Market constraint 2]: [competitive considerations]
- [Resource constraint 3]: [team/budget limitations]

REQUIREMENTS:
- [Compliance requirement 1]: [specific regulations]
- [Brand requirement 2]: [specific guidelines]
- [Platform requirement 3]: [technical limitations]

REQUIRED STRATEGIC APPROACH:
1. [STRATEGY NAME]
   - Rationale: [specific reasoning with evidence]
   - Implementation: [step-by-step approach]
   - Risk mitigation: [specific contingency plans]
   - Success metrics: [specific measurement approach]

2. [STRATEGY NAME]
   - Rationale: [specific reasoning with evidence]
   - Implementation: [step-by-step approach]
   - Risk mitigation: [specific contingency plans]

ANTI-PATTERNS TO AVOID:
❌ [Strategic anti-pattern 1]: [business impact]
❌ [Strategic anti-pattern 2]: [user experience impact]

REQUIRED DELIVERABLES:
1. STRATEGIC DOCUMENTATION
   - Strategy deck: [specific slides/content]
   - Implementation roadmap: [specific timeline]
   - Success framework: [specific metrics]

2. STAKEHOLDER MATERIALS
   - Executive summary: [specific audience focus]
   - Team guidelines: [specific implementation details]
   - Training materials: [specific user education needs]

VALIDATION CRITERIA:
✅ [Business validation 1]: [specific success metrics]
✅ [User validation 2]: [specific research approach]
✅ [Technical validation 3]: [specific feasibility criteria]
```

## 🎨 Example: Complete Structured Prompt

### Scenario: E-commerce Payment Form Redesign

#### Generated Figma Prompt:
```
You are a senior product designer specializing in e-commerce payment systems with deep expertise in cognitive load reduction and mobile-first design.

ROLE & CONTEXT:
- Platform: Mobile e-commerce app (iOS/Android)
- User expertise: Mixed technical literacy (ages 25-45)
- Business constraints: Must support 12+ payment methods, 2-second load time
- Performance requirements: 60% reduction in decision time, 40% conversion increase

PROBLEM ANALYSIS:
COGNITIVE LOAD ISSUES:
1. Choice Overload - 12 payment options exceed Hick's Law optimal range (3-4 choices)
2. Visual Hierarchy - Equal visual weight prevents attention guidance
3. Touch Target Issues - Mobile touch targets below 44px minimum
4. Memory Burden - Users must remember and compare option details

REQUIRED IMPROVEMENTS:
- Reduce visible choices from 12 to 3-4 primary options with 60% decision time reduction
- Implement smart defaults based on user history with 40% error rate reduction
- Add progressive disclosure for secondary options with 30% improved findability

DESIGN CONSTRAINTS:
MUST RESPECT:
- Mobile-first responsive design (320px minimum width)
- Touch targets minimum 44px × 44px for accessibility
- WCAG 2.1 AA compliance with 4.5:1 contrast ratio minimum
- Support for iOS 14+ and Android 8+ with 95% device coverage
- Brand colors: Primary #6366f1, Secondary #8b5cf6 with specific hex codes
- Load time under 2 seconds on 3G with 1.5MB maximum bundle size

PERFORMANCE TARGETS:
- Decision time: Reduce from 45s to under 15s (66% improvement)
- Form completion: Increase from 30% to 70% (133% improvement)
- Error rate: Decrease by 60% with specific error tracking
- User satisfaction: Improve to 4.5/5.0 with specific survey methodology

REQUIRED DESIGN PATTERNS:
1. PROGRESSIVE DISCLOSURE PAYMENT SELECTOR
   - Implementation: Primary section shows 3-4 most common methods, secondary accordion for remaining
   - Visual specs: Primary options 120px × 80px, secondary in 44px height rows
   - Interaction: Smooth 300ms accordion animation, haptic feedback on selection
   - States: Default (gray border), Selected (purple border + background), Disabled (50% opacity)

2. CONTEXT-AWARE ADAPTATION
   - Implementation: Purchase amount < $50 shows 3 options, > $500 shows 5 options
   - Visual specs: Dynamic layout using CSS Grid with auto-fit
   - Interaction: Real-time adaptation without layout shift
   - Personalization: User history stored in localStorage with 30-day retention

ANTI-PATTERNS TO AVOID:
❌ CHOICE PARALYSIS: Never show all 12+ payment options simultaneously
❌ MOBILE USABILITY: No touch targets smaller than 44px or hover-only interactions
❌ TRUST ISSUES: Never hide security information or surprise fees

REQUIRED DELIVERABLES:
1. COMPONENT LIBRARY
   - PaymentMethodCard: 120px × 80px with auto layout, component properties for icon/text
   - PaymentSelector: Container with smart default logic and responsive behavior
   - TrustBadge: 24px × 24px security indicators with specific badge requirements
   - ProgressIndicator: Step indicators with specific color states and animations

2. DESIGN SYSTEM INTEGRATION
   - Colors: Primary #6366f1, Secondary #8b5cf6, Success #22c55e, Error #ef4444
   - Typography: Inter font, Mobile: 16px base, Desktop: 14px base with specific line heights
   - Spacing: 8px grid system with 4px half-units for fine-tuning
   - Interactions: 200ms ease-out transitions, 300ms for complex animations

VALIDATION CRITERIA:
✅ COGNITIVE LOAD: Decision time measured using analytics, reduced by 60%+ with specific A/B test
✅ USABILITY: All touch targets 44px+, WCAG 2.1 AA verified with axe testing tool
✅ PERFORMANCE: 2-second load time on 3G, Lighthouse score 95+ with specific optimization
```

## 🔄 Prompt Quality Assurance

### Validation Checklist
- [ ] **Specificity**: Contains exact measurements, colors, and requirements
- [ ] **Actionability**: Provides clear implementation instructions
- [ ] **Completeness**: Includes all necessary constraints and requirements
- [ ] **Measurability**: Defines success criteria with specific metrics
- [ ] **Tool Appropriateness**: Optimized for target AI tool capabilities
- [ ] **Anti-Pattern Coverage**: Explicitly prevents common mistakes

### Quality Metrics
- **Prompt Length**: 800-2000 characters for optimal AI processing
- **Structure Score**: All 7 sections present and well-defined
- **Specificity Score**: Contains concrete, measurable requirements
- **Actionability Score**: Provides step-by-step implementation guidance

This structured approach ensures every prompt tells the AI exactly what to build, how to build it, and what success looks like—eliminating ambiguity and maximizing output quality.
