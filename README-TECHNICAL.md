# Cognitive Load Intervention Engine - Technical Architecture

## 🏗️ Architecture Overview

**Decision acceleration system** that transforms UX problems into actionable design principles through structured recommendation engine.

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Postgres + Auth + API)
- **AI**: OpenAI API for problem classification
- **Hosting**: Vercel (frontend) + Supabase (backend)

## 📊 Database Schema

### Core Entities
- **principles**: Core UX principles with evidence ratings
- **principle_actions**: Actionable design steps (the real value)
- **principle_examples**: Real-world implementations by sector
- **principle_relevance_rules**: Recommendation engine logic

### Taxonomy
- **contexts**: Decision environments (Data Entry, Decisions, Navigation, etc.)
- **problems**: UX issues (Alert Fatigue, Form Abandonment, etc.)
- **sectors**: Workflow-based (Commercial, Document, Laboratory, etc.)
- **disciplines**: Academic domains (UX Psychology, Neuroscience, etc.)

### User Features
- **saved_collections**: Personal principle libraries
- **analysis_sessions**: AI-powered problem analysis

## 🎯 Recommendation Engine

### Core Logic
```sql
-- Simple rules-based ranking
SELECT p.*, prr.relevance_score
FROM principles p
JOIN principle_relevance_rules prr ON p.id = prr.principle_id
WHERE prr.problem_id = $1 
  AND prr.context_id = $2
  AND ($3 IS NULL OR prr.sector_id = $3)
ORDER BY prr.relevance_score DESC
```

### Scoring Factors
- **Problem-Context Match**: Base relevance (0-100)
- **Sector Specificity**: Bonus for industry alignment
- **Evidence Strength**: Weight by research quality
- **Cognitive Load Impact**: Prioritize low-load solutions

## 🤖 AI Integration

### Classification Pipeline
1. **User Input**: Natural language problem description
2. **LLM Classification**: Map to taxonomy (problem + context)
3. **Database Lookup**: Retrieve relevant principles
4. **Rule Application**: Apply relevance scoring
5. **Result Presentation**: Ranked recommendations with actions

### Prompt Strategy
```
Classify UX problem into predefined taxonomy.
Return structured JSON with confidence scores.
Do NOT generate principles - only classify and rank existing ones.
```

## 🚀 Deployment Strategy

### MVP Architecture
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Vercel    │    │  Supabase   │    │   OpenAI    │
│  (Frontend) │◄──►│ (Database)  │◄──►│    API      │
│             │    │   + Auth    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Scaling Considerations
- **Search**: Postgres full-text → Meilisearch (if needed)
- **AI**: OpenAI API → Local models (cost optimization)
- **CDN**: Supabase storage → CloudFront (global assets)

## 📝 Key Design Decisions

### Why Supabase?
- **Integrated Stack**: Postgres + Auth + API in one service
- **Row-Level Security**: Built-in data protection
- **Real-time**: Live updates for collaborative features
- **Edge Functions**: Serverless when needed

### Why Rules-Based AI?
- **Quality Control**: Curated principles vs LLM hallucinations
- **Explainability**: Clear reasoning for each recommendation
- **Performance**: Fast database lookups vs API calls
- **Reliability**: Consistent results vs model variability

### Why Workflow-Based Sectors?
- **Decision Context**: Maps to actual user thinking
- **Cross-Industry**: Patterns transfer between domains
- **Action-Oriented**: Focus on what users do, not tools they use

## 🔧 Development Setup

### Local Development
```bash
# Install dependencies
npm install

# Start Supabase
supabase start

# Run migrations
supabase db push

# Seed data
supabase db seed

# Start frontend
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENAI_API_KEY=your-openai-key
```

## 📈 Success Metrics

### User Engagement
- **Problem Analysis Completion Rate**: % users finish AI analysis
- **Action Application Rate**: % users click "Apply This Principle"
- **Collection Creation Rate**: % users save principle sets

### System Performance
- **Recommendation Accuracy**: User feedback on relevance
- **Search Success Rate**: % queries return relevant results
- **API Response Time**: <500ms for recommendations

### Business Impact
- **Decision Time Reduction**: Measured through user feedback
- **Cognitive Load Reduction**: Self-reported assessments
- **Design Confidence**: Pre/post usage surveys

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- [x] Database schema
- [x] Recommendation engine
- [x] Basic UI components
- [ ] AI classification
- [ ] User collections

### Phase 2: Enhancement
- [ ] Advanced search with facets
- [ ] Collaboration features
- [ ] Analytics dashboard
- [ ] Mobile optimization

### Phase 3: Scale
- [ ] Enterprise features
- [ ] API for integrations
- [ ] Custom principle libraries
- [ ] Advanced AI insights

## 🎯 Competitive Advantage

1. **Decision-First**: Focus on accelerating decisions, not organizing knowledge
2. **Action-Oriented**: Every principle comes with concrete implementation steps
3. **Context-Aware**: Recommendations based on actual workflow environments
4. **Evidence-Based**: Research-backed principles with strength ratings
5. **Sector-Specific**: Real examples from relevant industries

This isn't another UX encyclopedia—it's decision infrastructure for designers.
