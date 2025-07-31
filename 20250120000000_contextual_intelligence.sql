-- Enhanced Chat Sessions Table for Contextual Intelligence
-- Migration: 20250120000000_contextual_intelligence

-- Create enhanced chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain TEXT DEFAULT 'nutrition' CHECK (domain IN ('nutrition', 'fitness', 'sleep', 'supplements', 'stress', 'mental-health', 'longevity')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    context_snapshot JSONB DEFAULT '{}',
    personalization_score FLOAT DEFAULT 0.0,
    goals TEXT[],
    preferences JSONB DEFAULT '{}',
    session_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Enhanced chat_history table with context support
ALTER TABLE chat_history 
ADD COLUMN IF NOT EXISTS session_id TEXT REFERENCES chat_sessions(session_id),
ADD COLUMN IF NOT EXISTS domain TEXT DEFAULT 'nutrition',
ADD COLUMN IF NOT EXISTS context_enhanced BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS confidence_score FLOAT,
ADD COLUMN IF NOT EXISTS personalization_metadata JSONB DEFAULT '{}';

-- Create context_snapshots table for storing user context at different points in time
CREATE TABLE IF NOT EXISTS context_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT REFERENCES chat_sessions(session_id),
    snapshot_type TEXT DEFAULT 'conversation' CHECK (snapshot_type IN ('conversation', 'health_update', 'goal_change', 'preference_update')),
    context_data JSONB NOT NULL,
    health_metrics JSONB DEFAULT '{}',
    user_profile JSONB DEFAULT '{}',
    conversation_history JSONB DEFAULT '{}',
    domain_context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversation_flows table for managing multi-turn conversations
CREATE TABLE IF NOT EXISTS conversation_flows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT REFERENCES chat_sessions(session_id),
    flow_type TEXT DEFAULT 'question_answer' CHECK (flow_type IN ('question_answer', 'goal_setting', 'assessment', 'troubleshooting', 'education')),
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER,
    flow_data JSONB DEFAULT '{}',
    completion_status TEXT DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress', 'completed', 'abandoned', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create intelligent_insights table for storing AI-generated insights about users
CREATE TABLE IF NOT EXISTS intelligent_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('health_pattern', 'behavior_trend', 'goal_progress', 'recommendation', 'risk_factor', 'success_factor')),
    domain TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    confidence_score FLOAT DEFAULT 0.0,
    evidence_strength TEXT DEFAULT 'moderate' CHECK (evidence_strength IN ('weak', 'moderate', 'strong', 'very_strong')),
    actionable_recommendations TEXT[],
    related_metrics TEXT[],
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_domain ON chat_sessions(domain);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_activity ON chat_sessions(last_activity);

CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_domain ON chat_history(domain);
CREATE INDEX IF NOT EXISTS idx_chat_history_context_enhanced ON chat_history(context_enhanced);

CREATE INDEX IF NOT EXISTS idx_context_snapshots_user_id ON context_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_context_snapshots_session_id ON context_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_context_snapshots_type ON context_snapshots(snapshot_type);

CREATE INDEX IF NOT EXISTS idx_conversation_flows_session_id ON conversation_flows(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_flows_type ON conversation_flows(flow_type);
CREATE INDEX IF NOT EXISTS idx_conversation_flows_status ON conversation_flows(completion_status);

CREATE INDEX IF NOT EXISTS idx_intelligent_insights_user_id ON intelligent_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_intelligent_insights_type ON intelligent_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_intelligent_insights_domain ON intelligent_insights(domain);
CREATE INDEX IF NOT EXISTS idx_intelligent_insights_active ON intelligent_insights(is_active);

-- Create GIN indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_context_snapshot_gin ON chat_sessions USING GIN (context_snapshot);
CREATE INDEX IF NOT EXISTS idx_context_snapshots_context_data_gin ON context_snapshots USING GIN (context_data);
CREATE INDEX IF NOT EXISTS idx_intelligent_insights_insight_data_gin ON intelligent_insights USING GIN (insight_data);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_chat_sessions_updated_at 
    BEFORE UPDATE ON chat_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_flows_updated_at 
    BEFORE UPDATE ON conversation_flows 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Archive expired sessions instead of deleting them
    UPDATE chat_sessions 
    SET status = 'archived'
    WHERE expires_at < NOW() 
    AND status != 'archived';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Clean up very old archived sessions (older than 1 year)
    DELETE FROM chat_sessions 
    WHERE status = 'archived' 
    AND created_at < NOW() - INTERVAL '1 year';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies for security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligent_insights ENABLE ROW LEVEL SECURITY;

-- Policies for chat_sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for context_snapshots
CREATE POLICY "Users can view own context snapshots" ON context_snapshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own context snapshots" ON context_snapshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for conversation_flows
CREATE POLICY "Users can view own conversation flows" ON conversation_flows
    FOR SELECT USING (
        auth.uid() = (
            SELECT user_id FROM chat_sessions 
            WHERE chat_sessions.session_id = conversation_flows.session_id
        )
    );

CREATE POLICY "Users can create own conversation flows" ON conversation_flows
    FOR INSERT WITH CHECK (
        auth.uid() = (
            SELECT user_id FROM chat_sessions 
            WHERE chat_sessions.session_id = conversation_flows.session_id
        )
    );

CREATE POLICY "Users can update own conversation flows" ON conversation_flows
    FOR UPDATE USING (
        auth.uid() = (
            SELECT user_id FROM chat_sessions 
            WHERE chat_sessions.session_id = conversation_flows.session_id
        )
    );

-- Policies for intelligent_insights
CREATE POLICY "Users can view own insights" ON intelligent_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage insights" ON intelligent_insights
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE chat_sessions IS 'Enhanced chat sessions with contextual intelligence support';
COMMENT ON TABLE context_snapshots IS 'Snapshots of user context at different points in time for better personalization';
COMMENT ON TABLE conversation_flows IS 'Multi-turn conversation flow management';
COMMENT ON TABLE intelligent_insights IS 'AI-generated insights about user health patterns and behaviors';

COMMENT ON COLUMN chat_sessions.context_snapshot IS 'Current context snapshot for the session including health data, preferences, and conversation state';
COMMENT ON COLUMN chat_sessions.personalization_score IS 'Score indicating how well personalized the session is (0.0 to 1.0)';
COMMENT ON COLUMN chat_sessions.domain IS 'Health domain focus for the session (nutrition, fitness, sleep, etc.)';

COMMENT ON COLUMN intelligent_insights.confidence_score IS 'AI confidence in the insight (0.0 to 1.0)';
COMMENT ON COLUMN intelligent_insights.evidence_strength IS 'Strength of evidence supporting the insight';
COMMENT ON COLUMN intelligent_insights.actionable_recommendations IS 'Specific actionable recommendations based on the insight';
