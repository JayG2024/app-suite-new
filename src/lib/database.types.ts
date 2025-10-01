export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          email: string
          name: string
          role: string
          password_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          name: string
          role?: string
          password_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          name?: string
          role?: string
          password_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: number
          name: string
          company: string | null
          email: string | null
          phone: string | null
          status: string
          value: number | null
          source: string | null
          notes: string | null
          assigned_to: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          company?: string | null
          email?: string | null
          phone?: string | null
          status?: string
          value?: number | null
          source?: string | null
          notes?: string | null
          assigned_to?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          company?: string | null
          email?: string | null
          phone?: string | null
          status?: string
          value?: number | null
          source?: string | null
          notes?: string | null
          assigned_to?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: number
          name: string
          client_id: number | null
          status: string
          progress: number
          start_date: string | null
          end_date: string | null
          budget: number | null
          description: string | null
          assigned_to: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          client_id?: number | null
          status?: string
          progress?: number
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          description?: string | null
          assigned_to?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          client_id?: number | null
          status?: string
          progress?: number
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          description?: string | null
          assigned_to?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "leads"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: number
          title: string
          description: string | null
          project_id: number | null
          assigned_to: number | null
          status: string
          priority: string
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          project_id?: number | null
          assigned_to?: number | null
          status?: string
          priority?: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          project_id?: number | null
          assigned_to?: number | null
          status?: string
          priority?: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: number
          invoice_number: string
          project_id: number | null
          client_id: number | null
          amount: number
          status: string
          due_date: string | null
          paid_date: string | null
          items: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          invoice_number: string
          project_id?: number | null
          client_id?: number | null
          amount: number
          status?: string
          due_date?: string | null
          paid_date?: string | null
          items?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          invoice_number?: string
          project_id?: number | null
          client_id?: number | null
          amount?: number
          status?: string
          due_date?: string | null
          paid_date?: string | null
          items?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: number
          project_id: number | null
          category: string | null
          description: string | null
          amount: number
          date: string
          receipt_url: string | null
          created_by: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          project_id?: number | null
          category?: string | null
          description?: string | null
          amount: number
          date?: string
          receipt_url?: string | null
          created_by?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          project_id?: number | null
          category?: string | null
          description?: string | null
          amount?: number
          date?: string
          receipt_url?: string | null
          created_by?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      email_templates: {
        Row: {
          id: number
          name: string
          subject: string | null
          body: string | null
          category: string | null
          variables: Json | null
          created_by: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          subject?: string | null
          body?: string | null
          category?: string | null
          variables?: Json | null
          created_by?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          subject?: string | null
          body?: string | null
          category?: string | null
          variables?: Json | null
          created_by?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_log: {
        Row: {
          id: number
          user_id: number | null
          action: string | null
          entity_type: string | null
          entity_id: number | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          action?: string | null
          entity_type?: string | null
          entity_id?: number | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          action?: string | null
          entity_type?: string | null
          entity_id?: number | null
          details?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      campaigns: {
        Row: {
          id: number
          name: string
          type: string | null
          status: string
          budget: number | null
          start_date: string | null
          end_date: string | null
          metrics: Json | null
          created_by: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          type?: string | null
          status?: string
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          metrics?: Json | null
          created_by?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string | null
          status?: string
          budget?: number | null
          start_date?: string | null
          end_date?: string | null
          metrics?: Json | null
          created_by?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: number
          name: string
          type: string | null
          url: string | null
          project_id: number | null
          client_id: number | null
          uploaded_by: number | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          type?: string | null
          url?: string | null
          project_id?: number | null
          client_id?: number | null
          uploaded_by?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string | null
          url?: string | null
          project_id?: number | null
          client_id?: number | null
          uploaded_by?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}