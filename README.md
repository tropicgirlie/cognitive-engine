# Cognitive Load Intervention Engine

**Transform UX problems into AI-ready design solutions through cognitive and behavioral principles.**

## 🎯 What It Is

A **decision-support and prompt-generation tool** that helps product designers solve UX challenges by:

1. **Analyzing Problems**: Form abandonment, alert fatigue, poor findability, information overload
2. **Matching Principles**: Identifies relevant cognitive/behavioral principles
3. **Generating Actions**: Provides practical UX/UI implementation guidance  
4. **Creating Prompts**: Produces structured, tool-specific instructions for AI design tools

## 🔄 Product Logic

```
Problem + Context → Matched Principles → Practical Actions → Structured Prompts
```

## 🛠️ How It Works

### 1. Define Your Challenge
- Describe your UX problem in natural language
- Select the context (Data Entry, Decisions, Navigation, etc.)
- Choose your target AI design tool

### 2. Get Matched Principles
- System identifies relevant cognitive/behavioral principles
- Explains why each principle applies to your specific problem
- Provides evidence-based reasoning

### 3. Receive Practical Actions
- Specific UX/UI implementation guidance
- Anti-patterns to avoid
- Success criteria and metrics

### 4. Generate Structured Prompts
- Copy-paste ready prompts for Figma Make, Windsurf, ChatGPT, or Claude
- Exact specifications, measurements, and constraints
- Tool-optimized instructions

## 🎨 Supported Problems

- **Form Abandonment**: Users not completing forms
- **Alert Fatigue**: Too many notifications causing overwhelm
- **Poor Findability**: Users unable to locate information
- **Information Overload**: Too much data presented at once
- **Decision Fatigue**: Complexity preventing choices
- **Trust Issues**: Users lacking confidence in system
- **Error Rate**: High frequency of mistakes
- **Navigation Complexity**: Difficult wayfinding

## 🛠️ AI Tool Integration

### Figma Make
- Component generation with exact specifications
- Design system integration and visual hierarchy
- Auto Layout and component properties

### Windsurf Builder  
- Responsive HTML/CSS/JS implementation
- Performance optimization and accessibility
- Semantic structure and modern patterns

### ChatGPT/Claude
- Strategic design guidance and planning
- Business considerations and stakeholder communication
- Implementation roadmaps and frameworks

### Linear/Notion
- Workflow design and team collaboration
- Process optimization and documentation
- Project management patterns

## 🚀 Quick Start

### Web Interface
1. Open `index.html` for the main decision system
2. Use `advanced-prompt-generator.html` for structured prompts
3. Try `prompt-generator-ui.html` for basic prompt generation

### Example Transformation
**Input**: "Users abandoning checkout due to too many payment options"

**Output**: Structured Figma prompt with:
- 3-4 primary payment options (Hick's Law)
- Progressive disclosure for secondary methods
- Exact component specifications (120px × 80px cards)
- Anti-patterns to avoid (choice paralysis)
- Success metrics (60% decision time reduction)

## 📁 Files

### Core System
- `index.html` - Main decision acceleration interface
- `supabase-schema.sql` - Database structure
- `seed-data.sql` - Sample principles and data

### Prompt Generation
- `advanced-prompt-generator.html` - Structured prompt generator
- `prompt-generator-ui.html` - Basic prompt interface
- `prompt-templates.sql` - Template database
- `structured-prompt-templates.md` - Prompt architecture

### Examples & Documentation
- `form-redesign-example.html` - Enterprise form transformation
- `form-redesign-analysis.md` - Cognitive load analysis
- `PRODUCT-OVERVIEW.md` - Complete product documentation
- `README-TECHNICAL.md` - Technical architecture

## 🧠 Technology Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: Supabase (Postgres + Auth + API)
- **AI Integration**: OpenAI API for problem classification
- **Hosting**: Vercel (frontend) + Supabase (backend)

## 🎯 Key Differentiator

**From Theory to Action**: We don't just teach principles—we generate specific, actionable prompts that tell AI tools exactly what to build.

Traditional: "Consider Hick's Law for choice reduction"  
Our Approach: "Create PaymentMethodCard component: 120px × 80px with auto layout, primary options 2x larger than secondary, 300ms accordion animation"

## 📊 Expected Impact

- **70% reduction** in research and planning time
- **80% fewer** common design mistakes  
- **60% faster** design iteration cycles
- **40% improvement** in user satisfaction scores

## 🚀 Getting Started

1. **Clone and Setup**: Install dependencies and configure Supabase
2. **Explore Principles**: Browse the cognitive load principle library
3. **Generate Prompts**: Transform your UX problems into AI-ready solutions
4. **Apply in Tools**: Copy prompts into your preferred AI design tool

## 🤝 Contributing

This is a decision infrastructure product that bridges the gap between UX theory and AI implementation. Every principle is translated into specific, measurable actions that designers can immediately apply.

---

**Transform your design challenges into AI-ready solutions.**
