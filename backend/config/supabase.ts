import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Create Supabase client for server-side operations
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create Supabase client for client-side operations (with limited permissions)
export const supabaseClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Database types for type safety
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          user_id: string;
          api_keys: any | null;
          config_data: any | null;
          private_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          user_id: string;
          api_keys?: any | null;
          config_data?: any | null;
          private_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          user_id?: string;
          api_keys?: any | null;
          config_data?: any | null;
          private_notes?: string | null;
          created_at?: string;
        };
      };
      audits: {
        Row: {
          id: string;
          project_id: string;
          url: string;
          headline_grade: number | null;
          performance_score: number | null;
          accessibility_score: number | null;
          content_score: number | null;
          detailed_analysis: any | null;
          raw_data: any | null;
          friction_points: any | null;
          suggestions: any | null;
          screenshots: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          url: string;
          headline_grade?: number | null;
          performance_score?: number | null;
          accessibility_score?: number | null;
          content_score?: number | null;
          detailed_analysis?: any | null;
          raw_data?: any | null;
          friction_points?: any | null;
          suggestions?: any | null;
          screenshots?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          url?: string;
          headline_grade?: number | null;
          performance_score?: number | null;
          accessibility_score?: number | null;
          content_score?: number | null;
          detailed_analysis?: any | null;
          raw_data?: any | null;
          friction_points?: any | null;
          suggestions?: any | null;
          screenshots?: string[] | null;
          created_at?: string;
        };
      };
      audit_history: {
        Row: {
          id: string;
          audit_id: string;
          version: number;
          changes: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          audit_id: string;
          version: number;
          changes?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          audit_id?: string;
          version?: number;
          changes?: any | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Get user's projects
  async getUserProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get project with audits
  async getProjectWithAudits(projectId: string, userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        audits (*)
      `)
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new audit
  async createAudit(auditData: Database['public']['Tables']['audits']['Insert']) {
    const { data, error } = await supabase
      .from('audits')
      .insert(auditData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update audit
  async updateAudit(id: string, updates: Database['public']['Tables']['audits']['Update']) {
    const { data, error } = await supabase
      .from('audits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Upload file to storage
  async uploadFile(bucket: string, path: string, file: Buffer, contentType: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true
      });
    
    if (error) throw error;
    return data;
  },

  // Get public URL for file
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}; 