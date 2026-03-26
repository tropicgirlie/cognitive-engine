# API Endpoints for Cognitive Load Intervention Engine

## Core APIs for MVP

### Principles
```
GET /api/principles
Query params:
- problem_id: UUID
- context_id: UUID  
- sector_id: UUID
- limit: number (default 20)
- offset: number (default 0)

Response:
{
  "principles": [
    {
      "id": "uuid",
      "name": "Hick's Law",
      "definition": "Decision time increases...",
      "cognitive_load_impact": "low",
      "evidence_strength": "strong",
      "relevance_score": 95,
      "actions": [...],
      "examples": [...]
    }
  ],
  "total": 128,
  "has_more": true
}

GET /api/principles/:id
Response: Full principle with all actions and examples
```

### Filters (Taxonomy)
```
GET /api/filters
Response:
{
  "disciplines": [...],
  "contexts": [...],
  "problems": [...],
  "sectors": [...]
}
```

### Recommendations
```
GET /api/recommendations
Query params:
- problem: string (required)
- context: UUID (required)
- sector: UUID (optional)
- limit: number (default 5)

Response:
{
  "recommendations": [
    {
      "principle": {...},
      "relevance_score": 95,
      "reasoning": "Directly addresses choice overload...",
      "primary_actions": [...],
      "sector_examples": [...]
    }
  ]
}
```

### Problem Analysis (AI)
```
POST /api/analyze-problem
Body:
{
  "problem_text": "Users are abandoning our multi-step form...",
  "context_id": "uuid",
  "sector_id": "uuid"
}

Response:
{
  "classified_problem": {
    "id": "uuid",
    "name": "Form Abandonment",
    "confidence": 0.87
  },
  "suggested_context": {
    "id": "uuid", 
    "name": "Data Entry & Forms"
  },
  "key_issues": ["complexity", "time_pressure", "unclear_progress"],
  "recommendations": [...],
  "session_id": "uuid"
}
```

### Collections (User Features)
```
POST /api/collections
Body: { "title": "E-commerce Checkout", "description": "..." }

GET /api/collections
Response: User's saved collections

POST /api/collections/:id/items
Body: { "principle_id": "uuid", "notes": "Apply to payment flow" }

DELETE /api/collections/:id/items/:principle_id
```

### Search
```
GET /api/search
Query params:
- q: string (search term)
- filters: JSON object
- limit: number

Response:
{
  "results": [...],
  "facets": {
    "disciplines": [...],
    "contexts": [...]
  }
}
```

## Implementation Notes

### Recommendation Logic
```sql
-- Core recommendation query
SELECT 
  p.*,
  prr.relevance_score,
  prr.reasoning,
  -- Include top 3 actions
  (SELECT json_agg(json_build_object(
    'action_title', pa.action_title,
    'action_description', pa.action_description,
    'ui_pattern', pa.ui_pattern
  )) FROM principle_actions pa 
  WHERE pa.principle_id = p.id 
  ORDER BY pa.order_index LIMIT 3) as primary_actions
FROM principles p
JOIN principle_relevance_rules prr ON p.id = prr.principle_id
WHERE prr.problem_id = $1 
  AND prr.context_id = $2
  AND ($3 IS NULL OR prr.sector_id = $3)
ORDER BY prr.relevance_score DESC
LIMIT $4;
```

### AI Classification Prompt
```
Classify this UX problem into our taxonomy:

Problem: "{problem_text}"

Available Problems:
- Alert Fatigue: Too many notifications...
- Form Abandonment: Users starting but not completing forms...
- Decision Paralysis: Inability to make decisions...
- Error Rate: High frequency of mistakes...

Available Contexts:
- Data Entry & Forms
- Decision & Approvals  
- Navigation & Search
- Monitoring & Alerts
- Collaboration & Handover

Return JSON:
{
  "problem": {"name": "Form Abandonment", "confidence": 0.87},
  "context": {"name": "Data Entry & Forms", "confidence": 0.92},
  "key_issues": ["complexity", "time_pressure"],
  "urgency": "high"
}
```

### Error Handling
- 400: Bad request (missing required params)
- 401: Unauthorized (protected endpoints)
- 404: Not found (invalid IDs)
- 429: Rate limited (AI endpoints)
- 500: Server error

### Rate Limiting
- `/api/analyze-problem`: 10 requests/minute per user
- Search: 100 requests/minute per user
- Other endpoints: 1000 requests/minute per user

### Caching Strategy
- Principle data: 1 hour cache
- Recommendations: 15 minute cache
- Search results: 5 minute cache
- Taxonomy: 24 hour cache
