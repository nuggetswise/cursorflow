-- CursorFlow Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PROJECTS TABLE
-- =============================================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Encrypted sensitive data
  api_keys JSONB, -- Encrypted API keys
  config_data JSONB, -- Encrypted configuration
  private_notes TEXT, -- Encrypted notes
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AUDITS TABLE
-- =============================================================================
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  
  -- Public results (non-sensitive)
  headline_grade INTEGER CHECK (headline_grade >= 1 AND headline_grade <= 10),
  performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
  accessibility_score INTEGER CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
  content_score INTEGER CHECK (content_score >= 0 AND content_score <= 100),
  
  -- Encrypted detailed results
  detailed_analysis JSONB, -- Encrypted full analysis
  raw_data JSONB, -- Encrypted raw audit data
  friction_points JSONB, -- Encrypted friction points
  suggestions JSONB, -- Encrypted suggestions
  
  -- File storage references
  screenshots TEXT[], -- Supabase Storage URLs
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AUDIT HISTORY TABLE
-- =============================================================================
CREATE TABLE audit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  changes JSONB, -- What changed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_audits_project_id ON audits(project_id);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_audit_history_audit_id ON audit_history(audit_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_history ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Audits policies
CREATE POLICY "Users can view audits from own projects" ON audits
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert audits to own projects" ON audits
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update audits from own projects" ON audits
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete audits from own projects" ON audits
  FOR DELETE USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Audit history policies
CREATE POLICY "Users can view audit history from own projects" ON audit_history
  FOR SELECT USING (
    audit_id IN (
      SELECT a.id FROM audits a
      JOIN projects p ON a.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert audit history for own projects" ON audit_history
  FOR INSERT WITH CHECK (
    audit_id IN (
      SELECT a.id FROM audits a
      JOIN projects p ON a.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON audits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('audit-screenshots', 'audit-screenshots', true),
  ('project-files', 'project-files', false);

-- Storage policies for audit screenshots (public read)
CREATE POLICY "Public read access for audit screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'audit-screenshots');

CREATE POLICY "Authenticated users can upload audit screenshots" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audit-screenshots' 
    AND auth.role() = 'authenticated'
  );

-- Storage policies for project files (private)
CREATE POLICY "Users can view own project files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload own project files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =============================================================================

-- Function to get user's projects with audit count
CREATE OR REPLACE FUNCTION get_user_projects_with_audit_count(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  audit_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.created_at,
    COUNT(a.id)::BIGINT as audit_count
  FROM projects p
  LEFT JOIN audits a ON p.id = a.project_id
  WHERE p.user_id = user_uuid
  GROUP BY p.id, p.name, p.description, p.created_at
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get project with latest audit
CREATE OR REPLACE FUNCTION get_project_with_latest_audit(project_uuid UUID, user_uuid UUID)
RETURNS TABLE (
  project_id UUID,
  project_name TEXT,
  project_description TEXT,
  latest_audit_id UUID,
  latest_audit_url TEXT,
  latest_audit_grade INTEGER,
  latest_audit_created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as project_id,
    p.name as project_name,
    p.description as project_description,
    a.id as latest_audit_id,
    a.url as latest_audit_url,
    a.headline_grade as latest_audit_grade,
    a.created_at as latest_audit_created_at
  FROM projects p
  LEFT JOIN LATERAL (
    SELECT * FROM audits 
    WHERE project_id = p.id 
    ORDER BY created_at DESC 
    LIMIT 1
  ) a ON true
  WHERE p.id = project_uuid AND p.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 