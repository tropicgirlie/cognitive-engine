-- Supabase Schema for Cognitive Load Intervention Engine
-- Core database structure for decision acceleration system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core taxonomy tables
CREATE TABLE disciplines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE contexts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Material Symbols icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Material Symbols icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core principle table
CREATE TABLE principles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  definition TEXT NOT NULL,
  discipline_id UUID REFERENCES disciplines(id),
  mechanism TEXT,
  cognitive_load_impact TEXT NOT NULL CHECK (cognitive_load_impact IN ('low', 'medium', 'high', 'conditional')),
  evidence_strength TEXT NOT NULL CHECK (evidence_strength IN ('strong', 'moderate', 'emerging')),
  founder TEXT,
  source TEXT,
  year INTEGER,
  icon TEXT, -- Material Symbols icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Action layer - this is the real value
CREATE TABLE principle_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  principle_id UUID NOT NULL REFERENCES principles(id) ON DELETE CASCADE,
  action_title TEXT NOT NULL,
  action_description TEXT NOT NULL,
  ui_pattern TEXT,
  anti_pattern TEXT,
  when_to_use TEXT,
  when_not_to_use TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-world examples
CREATE TABLE principle_examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  principle_id UUID NOT NULL REFERENCES principles(id) ON DELETE CASCADE,
  sector_id UUID REFERENCES sectors(id),
  example_type TEXT NOT NULL, -- 'success', 'failure', 'implementation'
  scenario TEXT NOT NULL,
  example_text TEXT NOT NULL,
  impact_metrics TEXT, -- JSON object with measurable outcomes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendation engine - the heart of the app
CREATE TABLE principle_relevance_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  principle_id UUID NOT NULL REFERENCES principles(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES problems(id),
  context_id UUID REFERENCES contexts(id),
  sector_id UUID REFERENCES sectors(id),
  relevance_score INTEGER NOT NULL CHECK (relevance_score >= 0 AND relevance_score <= 100),
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(principle_id, problem_id, context_id, sector_id)
);

-- User management
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved collections for users
CREATE TABLE saved_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE saved_collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES saved_collections(id) ON DELETE CASCADE,
  principle_id UUID NOT NULL REFERENCES principles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, principle_id)
);

-- AI analysis sessions
CREATE TABLE analysis_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  problem_text TEXT NOT NULL,
  selected_context_id UUID REFERENCES contexts(id),
  selected_problem_id UUID REFERENCES problems(id),
  output_json JSONB, -- Store AI analysis results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_principles_discipline ON principles(discipline_id);
CREATE INDEX idx_principle_actions_principle ON principle_actions(principle_id);
CREATE INDEX idx_principle_examples_principle ON principle_examples(principle_id);
CREATE INDEX idx_principle_examples_sector ON principle_examples(sector_id);
CREATE INDEX idx_relevance_rules_lookup ON principle_relevance_rules(problem_id, context_id, sector_id);
CREATE INDEX idx_saved_collections_user ON saved_collections(user_id);
CREATE INDEX idx_collection_items_collection ON saved_collection_items(collection_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own collections" ON saved_collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own collections" ON saved_collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON saved_collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON saved_collections FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own collection items" ON saved_collection_items FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM saved_collections WHERE id = collection_id)
);
CREATE POLICY "Users can manage own collection items" ON saved_collection_items FOR ALL USING (
  auth.uid() = (SELECT user_id FROM saved_collections WHERE id = collection_id)
);

CREATE POLICY "Users can view own analysis sessions" ON analysis_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own analysis sessions" ON analysis_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_disciplines_updated_at BEFORE UPDATE ON disciplines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contexts_updated_at BEFORE UPDATE ON contexts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON problems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_principles_updated_at BEFORE UPDATE ON principles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_principle_actions_updated_at BEFORE UPDATE ON principle_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_principle_examples_updated_at BEFORE UPDATE ON principle_examples FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_principle_relevance_rules_updated_at BEFORE UPDATE ON principle_relevance_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_collections_updated_at BEFORE UPDATE ON saved_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_collection_items_updated_at BEFORE UPDATE ON saved_collection_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
