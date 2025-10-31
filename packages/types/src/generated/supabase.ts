export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          api_key: string
          api_secret: string | null
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_name: string
          last_used_at: string | null
          rate_limit: number | null
          scope: string[] | null
        }
        Insert: {
          api_key: string
          api_secret?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          last_used_at?: string | null
          rate_limit?: number | null
          scope?: string[] | null
        }
        Update: {
          api_key?: string
          api_secret?: string | null
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          last_used_at?: string | null
          rate_limit?: number | null
          scope?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          actions_performed: Json | null
          automation_id: string | null
          error_message: string | null
          executed_at: string | null
          execution_status: string | null
          execution_time_ms: number | null
          id: string
          trigger_data: Json | null
          trigger_event: string
        }
        Insert: {
          actions_performed?: Json | null
          automation_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          execution_status?: string | null
          execution_time_ms?: number | null
          id?: string
          trigger_data?: Json | null
          trigger_event: string
        }
        Update: {
          actions_performed?: Json | null
          automation_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          execution_status?: string | null
          execution_time_ms?: number | null
          id?: string
          trigger_data?: Json | null
          trigger_event?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "workflow_automations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_metrics: {
        Row: {
          active_customers: number | null
          average_ticket_size: number | null
          created_at: string | null
          customer_satisfaction_score: number | null
          gross_profit_margin: number | null
          id: string
          inventory_value: number | null
          jobs_completed: number | null
          jobs_scheduled: number | null
          metric_date: string
          new_customers: number | null
          outstanding_invoices: number | null
          technician_utilization: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          active_customers?: number | null
          average_ticket_size?: number | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          gross_profit_margin?: number | null
          id?: string
          inventory_value?: number | null
          jobs_completed?: number | null
          jobs_scheduled?: number | null
          metric_date: string
          new_customers?: number | null
          outstanding_invoices?: number | null
          technician_utilization?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          active_customers?: number | null
          average_ticket_size?: number | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          gross_profit_margin?: number | null
          id?: string
          inventory_value?: number | null
          jobs_completed?: number | null
          jobs_scheduled?: number | null
          metric_date?: string
          new_customers?: number | null
          outstanding_invoices?: number | null
          technician_utilization?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      collaboration_sessions: {
        Row: {
          ended_at: string | null
          entity_id: string | null
          entity_type: string | null
          host_id: string | null
          id: string
          participants: string[] | null
          session_name: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          ended_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          host_id?: string | null
          id?: string
          participants?: string[] | null
          session_name: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          ended_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          host_id?: string | null
          id?: string
          participants?: string[] | null
          session_name?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          deleted_at: string | null
          edited_at: string | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          mentions: string[] | null
          message: string
          message_type: string | null
          parent_message_id: string | null
          reactions: Json | null
          read_by: string[] | null
          sender_id: string
          thread_id: string
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          mentions?: string[] | null
          message: string
          message_type?: string | null
          parent_message_id?: string | null
          reactions?: Json | null
          read_by?: string[] | null
          sender_id: string
          thread_id: string
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          mentions?: string[] | null
          message?: string
          message_type?: string | null
          parent_message_id?: string | null
          reactions?: Json | null
          read_by?: string[] | null
          sender_id?: string
          thread_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "communication_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "communication_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "communication_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "communication_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_threads: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          id: string
          is_pinned: boolean | null
          job_id: string | null
          last_message_at: string | null
          last_message_preview: string | null
          message_count: number | null
          owner_id: string | null
          participants: string[] | null
          priority: string | null
          status: string | null
          subject: string
          thread_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          id?: string
          is_pinned?: boolean | null
          job_id?: string | null
          last_message_at?: string | null
          last_message_preview?: string | null
          message_count?: number | null
          owner_id?: string | null
          participants?: string[] | null
          priority?: string | null
          status?: string | null
          subject: string
          thread_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          id?: string
          is_pinned?: boolean | null
          job_id?: string | null
          last_message_at?: string | null
          last_message_preview?: string | null
          message_count?: number | null
          owner_id?: string | null
          participants?: string[] | null
          priority?: string | null
          status?: string | null
          subject?: string
          thread_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_threads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_threads_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_threads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "communication_threads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_threads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      company_settings: {
        Row: {
          apt_suite: string | null
          city: string | null
          company_name: string
          created_at: string | null
          currency: string | null
          date_format: string | null
          email: string | null
          id: number
          license_number: string | null
          logo_url: string | null
          phone: string | null
          state: string | null
          street_name: string | null
          street_number: string | null
          street_number_old: string | null
          time_format: string | null
          timezone: string | null
          updated_at: string | null
          website: string | null
          zipcode: string | null
        }
        Insert: {
          apt_suite?: string | null
          city?: string | null
          company_name?: string
          created_at?: string | null
          currency?: string | null
          date_format?: string | null
          email?: string | null
          id?: number
          license_number?: string | null
          logo_url?: string | null
          phone?: string | null
          state?: string | null
          street_name?: string | null
          street_number?: string | null
          street_number_old?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
          zipcode?: string | null
        }
        Update: {
          apt_suite?: string | null
          city?: string | null
          company_name?: string
          created_at?: string | null
          currency?: string | null
          date_format?: string | null
          email?: string | null
          id?: number
          license_number?: string | null
          logo_url?: string | null
          phone?: string | null
          state?: string | null
          street_name?: string | null
          street_number?: string | null
          street_number_old?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      customer_communications: {
        Row: {
          attachments: Json | null
          body: string
          communication_type: string
          contact_method: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          delivered_at: string | null
          direction: string
          email_message_id: string | null
          employee_id: string | null
          id: string
          job_id: string | null
          read_at: string | null
          sent_at: string | null
          sms_message_id: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          body: string
          communication_type: string
          contact_method?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          delivered_at?: string | null
          direction: string
          email_message_id?: string | null
          employee_id?: string | null
          id?: string
          job_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          sms_message_id?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          body?: string
          communication_type?: string
          contact_method?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          delivered_at?: string | null
          direction?: string
          email_message_id?: string | null
          employee_id?: string | null
          id?: string
          job_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          sms_message_id?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_communications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_communications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "customer_communications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_communications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "customer_communications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_documents: {
        Row: {
          category: string | null
          customer_id: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          category?: string | null
          customer_id: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          category?: string | null
          customer_id?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          created_at: string | null
          created_by: string
          customer_id: string
          id: string
          note: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          customer_id: string
          id?: string
          note: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          customer_id?: string
          id?: string
          note?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_portal_tokens: {
        Row: {
          created_at: string | null
          customer_id: string
          expires_at: string
          id: string
          is_used: boolean | null
          token: string
          token_type: string | null
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          expires_at: string
          id?: string
          is_used?: boolean | null
          token: string
          token_type?: string | null
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          expires_at?: string
          id?: string
          is_used?: boolean | null
          token?: string
          token_type?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_portal_tokens_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_reviews: {
        Row: {
          company_response: string | null
          created_at: string | null
          customer_id: string
          external_review_id: string | null
          external_review_url: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          job_id: string | null
          overall_rating: number | null
          professionalism_rating: number | null
          quality_rating: number | null
          responded_at: string | null
          responded_by: string | null
          review_date: string | null
          review_source: string | null
          review_text: string | null
          status: string | null
          technician_id: string | null
          technician_rating: number | null
          timeliness_rating: number | null
          title: string | null
          updated_at: string | null
          value_rating: number | null
          verified_purchase: boolean | null
          would_recommend: boolean | null
        }
        Insert: {
          company_response?: string | null
          created_at?: string | null
          customer_id: string
          external_review_id?: string | null
          external_review_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          job_id?: string | null
          overall_rating?: number | null
          professionalism_rating?: number | null
          quality_rating?: number | null
          responded_at?: string | null
          responded_by?: string | null
          review_date?: string | null
          review_source?: string | null
          review_text?: string | null
          status?: string | null
          technician_id?: string | null
          technician_rating?: number | null
          timeliness_rating?: number | null
          title?: string | null
          updated_at?: string | null
          value_rating?: number | null
          verified_purchase?: boolean | null
          would_recommend?: boolean | null
        }
        Update: {
          company_response?: string | null
          created_at?: string | null
          customer_id?: string
          external_review_id?: string | null
          external_review_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          job_id?: string | null
          overall_rating?: number | null
          professionalism_rating?: number | null
          quality_rating?: number | null
          responded_at?: string | null
          responded_by?: string | null
          review_date?: string | null
          review_source?: string | null
          review_text?: string | null
          status?: string | null
          technician_id?: string | null
          technician_rating?: number | null
          timeliness_rating?: number | null
          title?: string | null
          updated_at?: string | null
          value_rating?: number | null
          verified_purchase?: boolean | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reviews_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "customer_reviews_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reviews_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "customer_reviews_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "customer_reviews_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_reviews_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          billing_address: Json | null
          billing_same_as_service: boolean | null
          city: string | null
          company_name: string | null
          contact_name: string
          created_at: string | null
          customer_number: string
          customer_type: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          mobile: string | null
          notes: string | null
          phone: string | null
          secondary_phone: string | null
          service_address: Json | null
          source: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          billing_address?: Json | null
          billing_same_as_service?: boolean | null
          city?: string | null
          company_name?: string | null
          contact_name: string
          created_at?: string | null
          customer_number: string
          customer_type?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          secondary_phone?: string | null
          service_address?: Json | null
          source?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          billing_address?: Json | null
          billing_same_as_service?: boolean | null
          city?: string | null
          company_name?: string | null
          contact_name?: string
          created_at?: string | null
          customer_number?: string
          customer_type?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          secondary_phone?: string | null
          service_address?: Json | null
          source?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      diagnostic_pricing_suggestions: {
        Row: {
          accepted_at: string | null
          confidence_score: number | null
          created_at: string | null
          declined_at: string | null
          diagnostic_report_id: string | null
          id: string
          issue_type: string
          job_id: string
          priority: number | null
          severity: string | null
          status: string | null
          suggested_price: number | null
          suggested_service: string
        }
        Insert: {
          accepted_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          declined_at?: string | null
          diagnostic_report_id?: string | null
          id?: string
          issue_type: string
          job_id: string
          priority?: number | null
          severity?: string | null
          status?: string | null
          suggested_price?: number | null
          suggested_service: string
        }
        Update: {
          accepted_at?: string | null
          confidence_score?: number | null
          created_at?: string | null
          declined_at?: string | null
          diagnostic_report_id?: string | null
          id?: string
          issue_type?: string
          job_id?: string
          priority?: number | null
          severity?: string | null
          status?: string | null
          suggested_price?: number | null
          suggested_service?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_pricing_suggestions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      document_shares: {
        Row: {
          created_at: string | null
          document_id: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_viewed_at: string | null
          password_hash: string | null
          share_token: string
          shared_by: string
          shared_with_email: string | null
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          document_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_viewed_at?: string | null
          password_hash?: string | null
          share_token: string
          shared_by: string
          shared_with_email?: string | null
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          document_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_viewed_at?: string | null
          password_hash?: string | null
          share_token?: string
          shared_by?: string
          shared_with_email?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_shares_shared_by_fkey"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          template_name: string
          template_type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          template_name: string
          template_type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          template_name?: string
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          description: string | null
          document_type: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_public: boolean | null
          mime_type: string | null
          tags: string[] | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          description?: string | null
          document_type?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          tags?: string[] | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          description?: string | null
          document_type?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          tags?: string[] | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          attachments: Json | null
          body: string
          created_at: string | null
          customer_id: string | null
          id: string
          opened_at: string | null
          recipient: string
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          attachments?: Json | null
          body: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          opened_at?: string | null
          recipient: string
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          attachments?: Json | null
          body?: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          opened_at?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_benefits: {
        Row: {
          beneficiaries: Json | null
          benefit_name: string
          benefit_type: string
          coverage_level: string | null
          created_at: string | null
          deduction_frequency: string | null
          documents: Json | null
          employee_contribution: number | null
          employee_id: string
          employer_contribution: number | null
          end_date: string | null
          id: string
          notes: string | null
          policy_number: string | null
          premium_amount: number | null
          provider: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          beneficiaries?: Json | null
          benefit_name: string
          benefit_type: string
          coverage_level?: string | null
          created_at?: string | null
          deduction_frequency?: string | null
          documents?: Json | null
          employee_contribution?: number | null
          employee_id: string
          employer_contribution?: number | null
          end_date?: string | null
          id?: string
          notes?: string | null
          policy_number?: string | null
          premium_amount?: number | null
          provider?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          beneficiaries?: Json | null
          benefit_name?: string
          benefit_type?: string
          coverage_level?: string | null
          created_at?: string | null
          deduction_frequency?: string | null
          documents?: Json | null
          employee_contribution?: number | null
          employee_id?: string
          employer_contribution?: number | null
          end_date?: string | null
          id?: string
          notes?: string | null
          policy_number?: string | null
          premium_amount?: number | null
          provider?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      employee_certifications: {
        Row: {
          category: string | null
          ce_hours_completed: number | null
          ce_hours_required: number | null
          certification_name: string
          certification_number: string | null
          continuing_education_required: boolean | null
          created_at: string | null
          document_filename: string | null
          document_url: string | null
          employee_id: string
          expiration_date: string | null
          id: string
          issue_date: string
          issuing_organization: string
          level: string | null
          notes: string | null
          reminder_sent_at: string | null
          status: string | null
          updated_at: string | null
          verification_url: string | null
        }
        Insert: {
          category?: string | null
          ce_hours_completed?: number | null
          ce_hours_required?: number | null
          certification_name: string
          certification_number?: string | null
          continuing_education_required?: boolean | null
          created_at?: string | null
          document_filename?: string | null
          document_url?: string | null
          employee_id: string
          expiration_date?: string | null
          id?: string
          issue_date: string
          issuing_organization: string
          level?: string | null
          notes?: string | null
          reminder_sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          verification_url?: string | null
        }
        Update: {
          category?: string | null
          ce_hours_completed?: number | null
          ce_hours_required?: number | null
          certification_name?: string
          certification_number?: string | null
          continuing_education_required?: boolean | null
          created_at?: string | null
          document_filename?: string | null
          document_url?: string | null
          employee_id?: string
          expiration_date?: string | null
          id?: string
          issue_date?: string
          issuing_organization?: string
          level?: string | null
          notes?: string | null
          reminder_sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      employee_training_documents: {
        Row: {
          acknowledgment_required: boolean | null
          applicable_departments: string[] | null
          applicable_roles: string[] | null
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          document_filename: string | null
          document_type: string
          document_url: string
          expiration_days: number | null
          file_size: number | null
          id: string
          is_mandatory: boolean | null
          mime_type: string | null
          published_at: string | null
          quiz_passing_score: number | null
          quiz_required: boolean | null
          status: string | null
          title: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          acknowledgment_required?: boolean | null
          applicable_departments?: string[] | null
          applicable_roles?: string[] | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          document_filename?: string | null
          document_type: string
          document_url: string
          expiration_days?: number | null
          file_size?: number | null
          id?: string
          is_mandatory?: boolean | null
          mime_type?: string | null
          published_at?: string | null
          quiz_passing_score?: number | null
          quiz_required?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          acknowledgment_required?: boolean | null
          applicable_departments?: string[] | null
          applicable_roles?: string[] | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          document_filename?: string | null
          document_type?: string
          document_url?: string
          expiration_days?: number | null
          file_size?: number | null
          id?: string
          is_mandatory?: boolean | null
          mime_type?: string | null
          published_at?: string | null
          quiz_passing_score?: number | null
          quiz_required?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_training_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_training_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_training_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      employee_training_progress: {
        Row: {
          acknowledged_at: string | null
          completed_at: string | null
          created_at: string | null
          employee_id: string
          expires_at: string | null
          id: string
          notes: string | null
          quiz_attempts: number | null
          quiz_passed: boolean | null
          quiz_score: number | null
          started_at: string | null
          status: string | null
          time_spent_minutes: number | null
          training_document_id: string
          updated_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          employee_id: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          quiz_attempts?: number | null
          quiz_passed?: boolean | null
          quiz_score?: number | null
          started_at?: string | null
          status?: string | null
          time_spent_minutes?: number | null
          training_document_id: string
          updated_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          quiz_attempts?: number | null
          quiz_passed?: boolean | null
          quiz_score?: number | null
          started_at?: string | null
          status?: string | null
          time_spent_minutes?: number | null
          training_document_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_training_progress_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_training_progress_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_training_progress_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_training_progress_training_document_id_fkey"
            columns: ["training_document_id"]
            isOneToOne: false
            referencedRelation: "employee_training_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_training_progress_training_document_id_fkey"
            columns: ["training_document_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["training_id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          apt_suite: string | null
          avatar_url: string | null
          bank_account_last_4: string | null
          benefits: Json | null
          birthdate: string | null
          can_clock_in: boolean | null
          can_receive_jobs: boolean | null
          certifications: Json | null
          city: string | null
          created_at: string | null
          created_by: string | null
          default_hourly_rate: number | null
          department: string | null
          drivers_license_number: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employee_number: string
          employment_type: string | null
          first_name: string
          hire_date: string
          id: string
          is_active: boolean | null
          last_name: string
          license_expiry: string | null
          license_number: string | null
          notes: string | null
          overtime_rate: number | null
          payment_method: string | null
          payroll_id: string | null
          phone: string | null
          phone_extension: string | null
          profile_id: string | null
          role: string
          significant_dates: Json | null
          skills: string[] | null
          state: string | null
          status: string | null
          street_name: string | null
          street_number: string | null
          tax_id: string | null
          termination_date: string | null
          title: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
          weekly_hours: number | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          apt_suite?: string | null
          avatar_url?: string | null
          bank_account_last_4?: string | null
          benefits?: Json | null
          birthdate?: string | null
          can_clock_in?: boolean | null
          can_receive_jobs?: boolean | null
          certifications?: Json | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          default_hourly_rate?: number | null
          department?: string | null
          drivers_license_number?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employee_number: string
          employment_type?: string | null
          first_name: string
          hire_date: string
          id?: string
          is_active?: boolean | null
          last_name: string
          license_expiry?: string | null
          license_number?: string | null
          notes?: string | null
          overtime_rate?: number | null
          payment_method?: string | null
          payroll_id?: string | null
          phone?: string | null
          phone_extension?: string | null
          profile_id?: string | null
          role: string
          significant_dates?: Json | null
          skills?: string[] | null
          state?: string | null
          status?: string | null
          street_name?: string | null
          street_number?: string | null
          tax_id?: string | null
          termination_date?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
          weekly_hours?: number | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          apt_suite?: string | null
          avatar_url?: string | null
          bank_account_last_4?: string | null
          benefits?: Json | null
          birthdate?: string | null
          can_clock_in?: boolean | null
          can_receive_jobs?: boolean | null
          certifications?: Json | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          default_hourly_rate?: number | null
          department?: string | null
          drivers_license_number?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employee_number?: string
          employment_type?: string | null
          first_name?: string
          hire_date?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          license_expiry?: string | null
          license_number?: string | null
          notes?: string | null
          overtime_rate?: number | null
          payment_method?: string | null
          payroll_id?: string | null
          phone?: string | null
          phone_extension?: string | null
          profile_id?: string | null
          role?: string
          significant_dates?: Json | null
          skills?: string[] | null
          state?: string | null
          status?: string | null
          street_name?: string | null
          street_number?: string | null
          tax_id?: string | null
          termination_date?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
          weekly_hours?: number | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          created_at: string | null
          customer_id: string | null
          equipment_type: string
          id: string
          install_date: string | null
          is_active: boolean | null
          location: string | null
          maintenance_schedule: Json | null
          manufacturer: string | null
          model_number: string | null
          notes: string | null
          serial_number: string | null
          updated_at: string | null
          warranty_expiry: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          equipment_type: string
          id?: string
          install_date?: string | null
          is_active?: boolean | null
          location?: string | null
          maintenance_schedule?: Json | null
          manufacturer?: string | null
          model_number?: string | null
          notes?: string | null
          serial_number?: string | null
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          equipment_type?: string
          id?: string
          install_date?: string | null
          is_active?: boolean | null
          location?: string | null
          maintenance_schedule?: Json | null
          manufacturer?: string | null
          model_number?: string | null
          notes?: string | null
          serial_number?: string | null
          updated_at?: string | null
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_photos: {
        Row: {
          caption: string | null
          equipment_id: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          equipment_id: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          equipment_id?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_photos_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_equipment"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_uploaded_by"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_line_items: {
        Row: {
          created_at: string | null
          description: string
          discount_amount: number | null
          discount_percent: number | null
          estimate_id: string
          id: string
          inventory_item_id: string | null
          item_type: string
          line_number: number
          line_total: number | null
          quantity: number
          service_catalog_id: string | null
          tax_amount: number | null
          tax_rate: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          discount_amount?: number | null
          discount_percent?: number | null
          estimate_id: string
          id?: string
          inventory_item_id?: string | null
          item_type: string
          line_number: number
          line_total?: number | null
          quantity?: number
          service_catalog_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          discount_amount?: number | null
          discount_percent?: number | null
          estimate_id?: string
          id?: string
          inventory_item_id?: string | null
          item_type?: string
          line_number?: number
          line_total?: number | null
          quantity?: number
          service_catalog_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimate_line_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_line_items_service_catalog_id_fkey"
            columns: ["service_catalog_id"]
            isOneToOne: false
            referencedRelation: "service_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          created_at: string | null
          customer_id: string | null
          discount_amount: number | null
          estimate_date: string | null
          estimate_number: string
          expiration_date: string | null
          id: string
          job_id: string | null
          line_items: Json | null
          notes: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          terms: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          estimate_date?: string | null
          estimate_number: string
          expiration_date?: string | null
          id?: string
          job_id?: string | null
          line_items?: Json | null
          notes?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          estimate_date?: string | null
          estimate_number?: string
          expiration_date?: string | null
          id?: string
          job_id?: string | null
          line_items?: Json | null
          notes?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_reimbursements: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string | null
          denial_reason: string | null
          description: string
          employee_id: string
          expense_date: string
          id: string
          job_id: string | null
          mileage_end: string | null
          mileage_rate: number | null
          mileage_start: string | null
          miles_driven: number | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          receipt_filename: string | null
          receipt_url: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string | null
          denial_reason?: string | null
          description: string
          employee_id: string
          expense_date: string
          id?: string
          job_id?: string | null
          mileage_end?: string | null
          mileage_rate?: number | null
          mileage_start?: string | null
          miles_driven?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          receipt_filename?: string | null
          receipt_url?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string | null
          denial_reason?: string | null
          description?: string
          employee_id?: string
          expense_date?: string
          id?: string
          job_id?: string | null
          mileage_end?: string | null
          mileage_rate?: number | null
          mileage_start?: string | null
          miles_driven?: number | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          receipt_filename?: string | null
          receipt_url?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_reimbursements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "expense_reimbursements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_reimbursements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "expense_reimbursements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "expense_reimbursements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_reimbursements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "expense_reimbursements_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string | null
          description: string | null
          entity_id: string | null
          entity_type: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_vehicles: {
        Row: {
          assigned_employee_id: string | null
          created_at: string | null
          id: string
          last_service_date: string | null
          license_plate: string | null
          make: string | null
          mileage: number | null
          model: string | null
          next_service_date: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
          vehicle_number: string
          vin: string | null
          year: number | null
        }
        Insert: {
          assigned_employee_id?: string | null
          created_at?: string | null
          id?: string
          last_service_date?: string | null
          license_plate?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          next_service_date?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_number: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          assigned_employee_id?: string | null
          created_at?: string | null
          id?: string
          last_service_date?: string | null
          license_plate?: string | null
          make?: string | null
          mileage?: number | null
          model?: string | null
          next_service_date?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_number?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_vehicles_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "fleet_vehicles_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_vehicles_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      followups: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string
          followup_type: string
          id: string
          job_id: string | null
          notes: string | null
          scheduled_date: string
          status: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id: string
          followup_type: string
          id?: string
          job_id?: string | null
          notes?: string | null
          scheduled_date: string
          status?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string
          followup_type?: string
          id?: string
          job_id?: string | null
          notes?: string | null
          scheduled_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "followups_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "followups_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followups_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "followups_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followups_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      geofences: {
        Row: {
          center_location: Json
          created_at: string | null
          customer_id: string | null
          geofence_type: string | null
          id: string
          is_active: boolean | null
          location_id: string | null
          name: string
          polygon: Json | null
          radius_meters: number
        }
        Insert: {
          center_location: Json
          created_at?: string | null
          customer_id?: string | null
          geofence_type?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          name: string
          polygon?: Json | null
          radius_meters: number
        }
        Update: {
          center_location?: Json
          created_at?: string | null
          customer_id?: string | null
          geofence_type?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          name?: string
          polygon?: Json | null
          radius_meters?: number
        }
        Relationships: [
          {
            foreignKeyName: "geofences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "geofences_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_settings: {
        Row: {
          created_at: string | null
          gemini_api_key: string | null
          gmail_api_key: string | null
          google_calendar_api_key: string | null
          google_drive_api_key: string | null
          google_maps_api_key: string | null
          id: number
          stripe_publishable_key: string | null
          stripe_secret_key: string | null
          twilio_account_sid: string | null
          twilio_auth_token: string | null
          twilio_phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gemini_api_key?: string | null
          gmail_api_key?: string | null
          google_calendar_api_key?: string | null
          google_drive_api_key?: string | null
          google_maps_api_key?: string | null
          id?: number
          stripe_publishable_key?: string | null
          stripe_secret_key?: string | null
          twilio_account_sid?: string | null
          twilio_auth_token?: string | null
          twilio_phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gemini_api_key?: string | null
          gmail_api_key?: string | null
          google_calendar_api_key?: string | null
          google_drive_api_key?: string | null
          google_maps_api_key?: string | null
          id?: number
          stripe_publishable_key?: string | null
          stripe_secret_key?: string | null
          twilio_account_sid?: string | null
          twilio_auth_token?: string | null
          twilio_phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          access_token: string | null
          api_key: string | null
          api_secret: string | null
          config: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          integration_name: string
          integration_type: string
          is_enabled: boolean | null
          last_error: string | null
          last_sync_at: string | null
          provider: string
          refresh_token: string | null
          status: string | null
          token_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          integration_name: string
          integration_type: string
          is_enabled?: boolean | null
          last_error?: string | null
          last_sync_at?: string | null
          provider: string
          refresh_token?: string | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          integration_name?: string
          integration_type?: string
          is_enabled?: boolean | null
          last_error?: string | null
          last_sync_at?: string | null
          provider?: string
          refresh_token?: string | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          cost: number
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          description: string | null
          dimensions: string | null
          id: string
          image_url: string | null
          images: Json | null
          is_active: boolean | null
          is_lot_tracked: boolean | null
          is_perishable: boolean | null
          is_serialized: boolean | null
          is_taxable: boolean | null
          item_number: string
          lead_time_days: number | null
          manufacturer: string | null
          markup_percent: number | null
          max_quantity: number | null
          min_quantity: number | null
          model_number: string | null
          msrp: number | null
          name: string
          notes: string | null
          part_number: string | null
          primary_vendor_id: string | null
          reorder_point: number | null
          reorder_quantity: number | null
          sell_price: number
          shelf_life_days: number | null
          spec_sheet_url: string | null
          status: string | null
          subcategory: string | null
          tags: string[] | null
          unit_of_measure: string | null
          updated_at: string | null
          updated_by: string | null
          vendor_part_number: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          category: string
          cost?: number
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_lot_tracked?: boolean | null
          is_perishable?: boolean | null
          is_serialized?: boolean | null
          is_taxable?: boolean | null
          item_number: string
          lead_time_days?: number | null
          manufacturer?: string | null
          markup_percent?: number | null
          max_quantity?: number | null
          min_quantity?: number | null
          model_number?: string | null
          msrp?: number | null
          name: string
          notes?: string | null
          part_number?: string | null
          primary_vendor_id?: string | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          sell_price?: number
          shelf_life_days?: number | null
          spec_sheet_url?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          unit_of_measure?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_part_number?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          category?: string
          cost?: number
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_lot_tracked?: boolean | null
          is_perishable?: boolean | null
          is_serialized?: boolean | null
          is_taxable?: boolean | null
          item_number?: string
          lead_time_days?: number | null
          manufacturer?: string | null
          markup_percent?: number | null
          max_quantity?: number | null
          min_quantity?: number | null
          model_number?: string | null
          msrp?: number | null
          name?: string
          notes?: string | null
          part_number?: string | null
          primary_vendor_id?: string | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          sell_price?: number
          shelf_life_days?: number | null
          spec_sheet_url?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          unit_of_measure?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_part_number?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_primary_vendor_id_fkey"
            columns: ["primary_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_locations: {
        Row: {
          address: string | null
          assigned_employee_id: string | null
          city: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_mobile: boolean | null
          location_code: string
          location_type: string
          manager_id: string | null
          name: string
          notes: string | null
          state: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          assigned_employee_id?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_mobile?: boolean | null
          location_code: string
          location_type: string
          manager_id?: string | null
          name: string
          notes?: string | null
          state?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          assigned_employee_id?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_mobile?: boolean | null
          location_code?: string
          location_type?: string
          manager_id?: string | null
          name?: string
          notes?: string | null
          state?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_locations_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_locations_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_locations_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_locations_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_locations_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_locations_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      inventory_stock: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string
          last_counted_at: string | null
          last_counted_by: string | null
          location_id: string
          lot_number: string | null
          quantity_allocated: number | null
          quantity_available: number | null
          quantity_on_hand: number
          quantity_on_order: number | null
          serial_numbers: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id: string
          last_counted_at?: string | null
          last_counted_by?: string | null
          location_id: string
          lot_number?: string | null
          quantity_allocated?: number | null
          quantity_available?: number | null
          quantity_on_hand?: number
          quantity_on_order?: number | null
          serial_numbers?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string
          last_counted_at?: string | null
          last_counted_by?: string | null
          location_id?: string
          lot_number?: string | null
          quantity_allocated?: number | null
          quantity_available?: number | null
          quantity_on_hand?: number
          quantity_on_order?: number | null
          serial_numbers?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_stock_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_stock_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_stock_last_counted_by_fkey"
            columns: ["last_counted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_stock_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          employee_id: string | null
          from_location_id: string | null
          id: string
          inventory_item_id: string
          job_id: string | null
          lot_number: string | null
          notes: string | null
          purchase_order_id: string | null
          quantity: number
          reason: string | null
          serial_number: string | null
          to_location_id: string | null
          total_cost: number | null
          transaction_date: string
          transaction_number: string
          transaction_type: string
          unit_cost: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          employee_id?: string | null
          from_location_id?: string | null
          id?: string
          inventory_item_id: string
          job_id?: string | null
          lot_number?: string | null
          notes?: string | null
          purchase_order_id?: string | null
          quantity: number
          reason?: string | null
          serial_number?: string | null
          to_location_id?: string | null
          total_cost?: number | null
          transaction_date?: string
          transaction_number: string
          transaction_type: string
          unit_cost?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          employee_id?: string | null
          from_location_id?: string | null
          id?: string
          inventory_item_id?: string
          job_id?: string | null
          lot_number?: string | null
          notes?: string | null
          purchase_order_id?: string | null
          quantity?: number
          reason?: string | null
          serial_number?: string | null
          to_location_id?: string | null
          total_cost?: number | null
          transaction_date?: string
          transaction_number?: string
          transaction_type?: string
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transactions_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transfer_requests: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          created_at: string | null
          from_location_id: string
          id: string
          inventory_item_id: string
          needed_by_date: string | null
          notes: string | null
          priority: string | null
          quantity_received: number | null
          quantity_requested: number
          quantity_shipped: number | null
          reason: string | null
          received_by: string | null
          received_date: string | null
          rejection_reason: string | null
          request_number: string
          requested_by: string | null
          requested_date: string
          shipped_by: string | null
          shipped_date: string | null
          status: string
          to_location_id: string
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string | null
          from_location_id: string
          id?: string
          inventory_item_id: string
          needed_by_date?: string | null
          notes?: string | null
          priority?: string | null
          quantity_received?: number | null
          quantity_requested: number
          quantity_shipped?: number | null
          reason?: string | null
          received_by?: string | null
          received_date?: string | null
          rejection_reason?: string | null
          request_number: string
          requested_by?: string | null
          requested_date?: string
          shipped_by?: string | null
          shipped_date?: string | null
          status?: string
          to_location_id: string
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string | null
          from_location_id?: string
          id?: string
          inventory_item_id?: string
          needed_by_date?: string | null
          notes?: string | null
          priority?: string | null
          quantity_received?: number | null
          quantity_requested?: number
          quantity_shipped?: number | null
          reason?: string | null
          received_by?: string | null
          received_date?: string | null
          rejection_reason?: string | null
          request_number?: string
          requested_by?: string | null
          requested_date?: string
          shipped_by?: string | null
          shipped_date?: string | null
          status?: string
          to_location_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transfer_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_shipped_by_fkey"
            columns: ["shipped_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_shipped_by_fkey"
            columns: ["shipped_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_shipped_by_fkey"
            columns: ["shipped_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_transfer_requests_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          created_at: string | null
          description: string
          discount_amount: number | null
          discount_percent: number | null
          id: string
          inventory_item_id: string | null
          invoice_id: string
          item_type: string
          job_id: string | null
          line_number: number
          line_total: number | null
          quantity: number
          service_catalog_id: string | null
          tax_amount: number | null
          tax_rate: number | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          inventory_item_id?: string | null
          invoice_id: string
          item_type: string
          job_id?: string | null
          line_number: number
          line_total?: number | null
          quantity?: number
          service_catalog_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          inventory_item_id?: string | null
          invoice_id?: string
          item_type?: string
          job_id?: string | null
          line_number?: number
          line_total?: number | null
          quantity?: number
          service_catalog_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_service_catalog_id_fkey"
            columns: ["service_catalog_id"]
            isOneToOne: false
            referencedRelation: "service_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number | null
          balance_due: number | null
          created_at: string | null
          customer_id: string | null
          discount_amount: number | null
          due_date: string | null
          estimate_id: string | null
          id: string
          invoice_date: string | null
          invoice_number: string
          job_id: string | null
          line_items: Json | null
          notes: string | null
          payment_terms: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          balance_due?: number | null
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number: string
          job_id?: string | null
          line_items?: Json | null
          notes?: string | null
          payment_terms?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          balance_due?: number | null
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          due_date?: string | null
          estimate_id?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string
          job_id?: string | null
          line_items?: Json | null
          notes?: string | null
          payment_terms?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_line_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          inventory_item_id: string | null
          item_type: string
          job_id: string
          labor_rate_id: string | null
          line_number: number
          line_total: number
          notes: string | null
          quantity: number
          service_catalog_id: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          inventory_item_id?: string | null
          item_type: string
          job_id: string
          labor_rate_id?: string | null
          line_number: number
          line_total: number
          notes?: string | null
          quantity?: number
          service_catalog_id?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          inventory_item_id?: string | null
          item_type?: string
          job_id?: string
          labor_rate_id?: string | null
          line_number?: number
          line_total?: number
          notes?: string | null
          quantity?: number
          service_catalog_id?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_line_items_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_line_items_labor_rate_id_fkey"
            columns: ["labor_rate_id"]
            isOneToOne: false
            referencedRelation: "labor_rates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_line_items_service_catalog_id_fkey"
            columns: ["service_catalog_id"]
            isOneToOne: false
            referencedRelation: "service_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      job_photos: {
        Row: {
          caption: string | null
          customer_id: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          job_id: string
          photo_type: string | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          customer_id: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          job_id: string
          photo_type?: string | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          customer_id?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          job_id?: string
          photo_type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_uploaded_by_job"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_photos_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_photos_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          actual_end_time: string | null
          actual_start_time: string | null
          assigned_technician_id: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          equipment_ids: string[] | null
          estimated_duration: number | null
          id: string
          job_number: string
          job_type: string
          labor_hours: number | null
          notes: string | null
          parts_used: Json | null
          photos: string[] | null
          priority: Database["public"]["Enums"]["job_priority"] | null
          scheduled_date: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          service_address: Json | null
          status: Database["public"]["Enums"]["job_status"] | null
          updated_at: string | null
        }
        Insert: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          assigned_technician_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          equipment_ids?: string[] | null
          estimated_duration?: number | null
          id?: string
          job_number: string
          job_type: string
          labor_hours?: number | null
          notes?: string | null
          parts_used?: Json | null
          photos?: string[] | null
          priority?: Database["public"]["Enums"]["job_priority"] | null
          scheduled_date?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          service_address?: Json | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Update: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          assigned_technician_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          equipment_ids?: string[] | null
          estimated_duration?: number | null
          id?: string
          job_number?: string
          job_type?: string
          labor_hours?: number | null
          notes?: string | null
          parts_used?: Json | null
          photos?: string[] | null
          priority?: Database["public"]["Enums"]["job_priority"] | null
          scheduled_date?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          service_address?: Json | null
          status?: Database["public"]["Enums"]["job_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      labor_rates: {
        Row: {
          created_at: string | null
          hourly_rate: number
          id: string
          is_active: boolean | null
          is_default: boolean | null
          rate_name: string
          rate_type: string
          skill_level: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hourly_rate: number
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          rate_name: string
          rate_type: string
          skill_level: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hourly_rate?: number
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          rate_name?: string
          rate_type?: string
          skill_level?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      location_events: {
        Row: {
          employee_id: string
          event_time: string | null
          event_type: string
          geofence_id: string | null
          id: string
          job_id: string | null
          location: Json
        }
        Insert: {
          employee_id: string
          event_time?: string | null
          event_type: string
          geofence_id?: string | null
          id?: string
          job_id?: string | null
          location: Json
        }
        Update: {
          employee_id?: string
          event_time?: string | null
          event_type?: string
          geofence_id?: string | null
          id?: string
          job_id?: string | null
          location?: Json
        }
        Relationships: [
          {
            foreignKeyName: "location_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "location_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "location_events_geofence_id_fkey"
            columns: ["geofence_id"]
            isOneToOne: false
            referencedRelation: "geofences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string
          description: string | null
          equipment_id: string
          estimated_cost: number | null
          estimated_duration: number | null
          frequency: string
          frequency_months: number | null
          id: string
          is_active: boolean | null
          is_under_contract: boolean | null
          last_service_date: string | null
          next_service_date: string
          notes: string | null
          preferred_technician_id: string | null
          reminder_days_before: number | null
          schedule_name: string
          send_reminder: boolean | null
          service_agreement_id: string | null
          service_type: string | null
          special_instructions: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          description?: string | null
          equipment_id: string
          estimated_cost?: number | null
          estimated_duration?: number | null
          frequency: string
          frequency_months?: number | null
          id?: string
          is_active?: boolean | null
          is_under_contract?: boolean | null
          last_service_date?: string | null
          next_service_date: string
          notes?: string | null
          preferred_technician_id?: string | null
          reminder_days_before?: number | null
          schedule_name: string
          send_reminder?: boolean | null
          service_agreement_id?: string | null
          service_type?: string | null
          special_instructions?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          description?: string | null
          equipment_id?: string
          estimated_cost?: number | null
          estimated_duration?: number | null
          frequency?: string
          frequency_months?: number | null
          id?: string
          is_active?: boolean | null
          is_under_contract?: boolean | null
          last_service_date?: string | null
          next_service_date?: string
          notes?: string | null
          preferred_technician_id?: string | null
          reminder_days_before?: number | null
          schedule_name?: string
          send_reminder?: boolean | null
          service_agreement_id?: string | null
          service_type?: string | null
          special_instructions?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_schedules_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_schedules_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_schedules_preferred_technician_id_fkey"
            columns: ["preferred_technician_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "maintenance_schedules_preferred_technician_id_fkey"
            columns: ["preferred_technician_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_schedules_preferred_technician_id_fkey"
            columns: ["preferred_technician_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          actual_cost: number | null
          budget: number | null
          campaign_name: string
          campaign_type: string | null
          conversions: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          leads_generated: number | null
          start_date: string | null
          status: string | null
          target_audience: Json | null
        }
        Insert: {
          actual_cost?: number | null
          budget?: number | null
          campaign_name: string
          campaign_type?: string | null
          conversions?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          leads_generated?: number | null
          start_date?: string | null
          status?: string | null
          target_audience?: Json | null
        }
        Update: {
          actual_cost?: number | null
          budget?: number | null
          campaign_name?: string
          campaign_type?: string | null
          conversions?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          leads_generated?: number | null
          start_date?: string | null
          status?: string | null
          target_audience?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      measurequick_equipment_data: {
        Row: {
          diagnostics: Json | null
          efficiency_rating: number | null
          equipment_id: string
          health_score: number | null
          id: string
          job_id: string | null
          measurequick_report_id: string | null
          readings: Json
          recommendations: Json | null
          recorded_at: string | null
          synced_at: string | null
        }
        Insert: {
          diagnostics?: Json | null
          efficiency_rating?: number | null
          equipment_id: string
          health_score?: number | null
          id?: string
          job_id?: string | null
          measurequick_report_id?: string | null
          readings: Json
          recommendations?: Json | null
          recorded_at?: string | null
          synced_at?: string | null
        }
        Update: {
          diagnostics?: Json | null
          efficiency_rating?: number | null
          equipment_id?: string
          health_score?: number | null
          id?: string
          job_id?: string | null
          measurequick_report_id?: string | null
          readings?: Json
          recommendations?: Json | null
          recorded_at?: string | null
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "measurequick_equipment_data_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measurequick_equipment_data_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          delivered_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          notification_type: string
          opened_at: string | null
          recipient: string
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          notification_type: string
          opened_at?: string | null
          recipient: string
          sent_at?: string | null
          status: string
          subject?: string | null
        }
        Update: {
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          notification_type?: string
          opened_at?: string | null
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          customer_message: boolean | null
          email_notifications: boolean | null
          id: string
          invoice_created: boolean | null
          job_assigned: boolean | null
          job_completed: boolean | null
          marketing_emails: boolean | null
          payment_received: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          system_alerts: boolean | null
          team_mention: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_message?: boolean | null
          email_notifications?: boolean | null
          id?: string
          invoice_created?: boolean | null
          job_assigned?: boolean | null
          job_completed?: boolean | null
          marketing_emails?: boolean | null
          payment_received?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          system_alerts?: boolean | null
          team_mention?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_message?: boolean | null
          email_notifications?: boolean | null
          id?: string
          invoice_created?: boolean | null
          job_assigned?: boolean | null
          job_completed?: boolean | null
          marketing_emails?: boolean | null
          payment_received?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          system_alerts?: boolean | null
          team_mention?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          body: string
          created_at: string | null
          error_message: string | null
          id: string
          max_retries: number | null
          notification_type: string
          priority: number | null
          recipient_email: string | null
          recipient_phone: string | null
          recipient_user_id: string | null
          retry_count: number | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          template_data: Json | null
          template_name: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          notification_type: string
          priority?: number | null
          recipient_email?: string | null
          recipient_phone?: string | null
          recipient_user_id?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_data?: Json | null
          template_name?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          notification_type?: string
          priority?: number | null
          recipient_email?: string | null
          recipient_phone?: string | null
          recipient_user_id?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_data?: Json | null
          template_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          category: string | null
          created_at: string | null
          dismissed_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          message: string
          notification_type: string
          priority: string | null
          read_at: string | null
          recipient_id: string
          title: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message: string
          notification_type: string
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          title: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          dismissed_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message?: string
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          card_last_four: string | null
          check_number: string | null
          created_at: string | null
          customer_id: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          payment_processor: string | null
          processed_by: string | null
          reference_number: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          card_last_four?: string | null
          check_number?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          payment_processor?: string | null
          processed_by?: string | null
          reference_number?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          card_last_four?: string | null
          check_number?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          payment_processor?: string | null
          processed_by?: string | null
          reference_number?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          adjustments: Json | null
          approved_at: string | null
          approved_by: string | null
          bonus: number | null
          commission: number | null
          created_at: string | null
          double_time_hours: number | null
          double_time_pay: number | null
          double_time_rate: number | null
          employee_id: string
          federal_tax: number | null
          gross_pay: number
          health_insurance: number | null
          holiday_hours: number | null
          holiday_pay: number | null
          id: string
          medicare: number | null
          net_pay: number | null
          notes: string | null
          other_deductions: number | null
          overtime_hours: number | null
          overtime_pay: number | null
          overtime_rate: number | null
          paid_date: string | null
          pay_date: string
          payment_method: string | null
          payment_reference: string | null
          period_end: string
          period_start: string
          processed_at: string | null
          processed_by: string | null
          pto_hours: number | null
          pto_pay: number | null
          regular_hours: number | null
          regular_pay: number | null
          regular_rate: number
          reimbursements: number | null
          retirement_401k: number | null
          sick_hours: number | null
          sick_pay: number | null
          social_security: number | null
          state_tax: number | null
          status: string | null
          total_deductions: number
          total_hours: number | null
          updated_at: string | null
        }
        Insert: {
          adjustments?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          bonus?: number | null
          commission?: number | null
          created_at?: string | null
          double_time_hours?: number | null
          double_time_pay?: number | null
          double_time_rate?: number | null
          employee_id: string
          federal_tax?: number | null
          gross_pay: number
          health_insurance?: number | null
          holiday_hours?: number | null
          holiday_pay?: number | null
          id?: string
          medicare?: number | null
          net_pay?: number | null
          notes?: string | null
          other_deductions?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          overtime_rate?: number | null
          paid_date?: string | null
          pay_date: string
          payment_method?: string | null
          payment_reference?: string | null
          period_end: string
          period_start: string
          processed_at?: string | null
          processed_by?: string | null
          pto_hours?: number | null
          pto_pay?: number | null
          regular_hours?: number | null
          regular_pay?: number | null
          regular_rate: number
          reimbursements?: number | null
          retirement_401k?: number | null
          sick_hours?: number | null
          sick_pay?: number | null
          social_security?: number | null
          state_tax?: number | null
          status?: string | null
          total_deductions: number
          total_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          adjustments?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          bonus?: number | null
          commission?: number | null
          created_at?: string | null
          double_time_hours?: number | null
          double_time_pay?: number | null
          double_time_rate?: number | null
          employee_id?: string
          federal_tax?: number | null
          gross_pay?: number
          health_insurance?: number | null
          holiday_hours?: number | null
          holiday_pay?: number | null
          id?: string
          medicare?: number | null
          net_pay?: number | null
          notes?: string | null
          other_deductions?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          overtime_rate?: number | null
          paid_date?: string | null
          pay_date?: string
          payment_method?: string | null
          payment_reference?: string | null
          period_end?: string
          period_start?: string
          processed_at?: string | null
          processed_by?: string | null
          pto_hours?: number | null
          pto_pay?: number | null
          regular_hours?: number | null
          regular_pay?: number | null
          regular_rate?: number
          reimbursements?: number | null
          retirement_401k?: number | null
          sick_hours?: number | null
          sick_pay?: number | null
          social_security?: number | null
          state_tax?: number | null
          status?: string | null
          total_deductions?: number
          total_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "payroll_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "payroll_records_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "payroll_records_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      po_line_items: {
        Row: {
          actual_delivery_date: string | null
          created_at: string | null
          description: string
          expected_delivery_date: string | null
          id: string
          inventory_item_id: string | null
          line_number: number
          line_total: number | null
          notes: string | null
          purchase_order_id: string
          quantity_ordered: number
          quantity_received: number | null
          quantity_remaining: number | null
          unit_cost: number
          updated_at: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string | null
          description: string
          expected_delivery_date?: string | null
          id?: string
          inventory_item_id?: string | null
          line_number: number
          line_total?: number | null
          notes?: string | null
          purchase_order_id: string
          quantity_ordered: number
          quantity_received?: number | null
          quantity_remaining?: number | null
          unit_cost: number
          updated_at?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string | null
          description?: string
          expected_delivery_date?: string | null
          id?: string
          inventory_item_id?: string | null
          line_number?: number
          line_total?: number | null
          notes?: string | null
          purchase_order_id?: string
          quantity_ordered?: number
          quantity_received?: number | null
          quantity_remaining?: number | null
          unit_cost?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_line_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_line_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      price_book: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          effective_date: string | null
          expiration_date: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_book_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_book_items: {
        Row: {
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          is_taxable: boolean | null
          item_code: string | null
          item_id: string | null
          item_name: string
          item_type: string
          markup_percentage: number | null
          price_book_id: string
          unit_of_measure: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_taxable?: boolean | null
          item_code?: string | null
          item_id?: string | null
          item_name: string
          item_type: string
          markup_percentage?: number | null
          price_book_id: string
          unit_of_measure?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_taxable?: boolean | null
          item_code?: string | null
          item_id?: string | null
          item_name?: string
          item_type?: string
          markup_percentage?: number | null
          price_book_id?: string
          unit_of_measure?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_book_items_price_book_id_fkey"
            columns: ["price_book_id"]
            isOneToOne: false
            referencedRelation: "price_book"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          applies_to: string | null
          benefits_percentage: number | null
          commission_percentage: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          overhead_percentage: number | null
          rule_name: string
          rule_type: string
          target_profit_percentage: number | null
          tax_rate_percentage: number | null
          updated_at: string | null
          warranty_reserve_percentage: number | null
        }
        Insert: {
          applies_to?: string | null
          benefits_percentage?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          overhead_percentage?: number | null
          rule_name: string
          rule_type: string
          target_profit_percentage?: number | null
          tax_rate_percentage?: number | null
          updated_at?: string | null
          warranty_reserve_percentage?: number | null
        }
        Update: {
          applies_to?: string | null
          benefits_percentage?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          overhead_percentage?: number | null
          rule_name?: string
          rule_type?: string
          target_profit_percentage?: number | null
          tax_rate_percentage?: number | null
          updated_at?: string | null
          warranty_reserve_percentage?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          phone_extension: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          phone_extension?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          phone_extension?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string | null
          delivery_date: string | null
          expected_delivery_date: string | null
          id: string
          line_items: Json | null
          notes: string | null
          order_date: string | null
          po_number: string
          received_at: string | null
          received_by: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          status: string
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_date?: string | null
          expected_delivery_date?: string | null
          id?: string
          line_items?: Json | null
          notes?: string | null
          order_date?: string | null
          po_number: string
          received_at?: string | null
          received_by?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_date?: string | null
          expected_delivery_date?: string | null
          id?: string
          line_items?: Json | null
          notes?: string | null
          order_date?: string | null
          po_number?: string
          received_at?: string | null
          received_by?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          status?: string
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      route_history: {
        Row: {
          created_at: string | null
          employee_id: string
          end_location: Json | null
          id: string
          jobs: string[] | null
          route_date: string
          route_path: Json | null
          start_location: Json | null
          total_distance: number | null
          total_duration: number | null
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          end_location?: Json | null
          id?: string
          jobs?: string[] | null
          route_date: string
          route_path?: Json | null
          start_location?: Json | null
          total_distance?: number | null
          total_duration?: number | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          end_location?: Json | null
          id?: string
          jobs?: string[] | null
          route_date?: string
          route_path?: Json | null
          start_location?: Json | null
          total_distance?: number | null
          total_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "route_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "route_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      route_optimizations: {
        Row: {
          created_at: string | null
          employee_id: string | null
          estimated_distance: number | null
          estimated_duration: number | null
          id: string
          jobs: string[]
          optimization_date: string
          optimized_order: string[] | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          estimated_distance?: number | null
          estimated_duration?: number | null
          id?: string
          jobs: string[]
          optimization_date: string
          optimized_order?: string[] | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          estimated_distance?: number | null
          estimated_duration?: number | null
          id?: string
          jobs?: string[]
          optimization_date?: string
          optimized_order?: string[] | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_optimizations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "route_optimizations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_optimizations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      service_agreements: {
        Row: {
          agreement_name: string
          agreement_number: string
          auto_renew: boolean | null
          billing_amount: number
          billing_day: number | null
          billing_frequency: string
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          contract_document_url: string | null
          coverage_type: string | null
          covered_equipment: string[] | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          description: string | null
          discount_percentage: number | null
          end_date: string
          guaranteed_response_hours: number | null
          id: string
          included_visits: number | null
          next_billing_date: string | null
          notes: string | null
          priority_response: boolean | null
          renewal_date: string | null
          renewal_notice_days: number | null
          signed_by: string | null
          signed_date: string | null
          signed_document_url: string | null
          start_date: string
          status: string | null
          terms_and_conditions: string | null
          updated_at: string | null
          visits_used: number | null
        }
        Insert: {
          agreement_name: string
          agreement_number: string
          auto_renew?: boolean | null
          billing_amount: number
          billing_day?: number | null
          billing_frequency: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          contract_document_url?: string | null
          coverage_type?: string | null
          covered_equipment?: string[] | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          description?: string | null
          discount_percentage?: number | null
          end_date: string
          guaranteed_response_hours?: number | null
          id?: string
          included_visits?: number | null
          next_billing_date?: string | null
          notes?: string | null
          priority_response?: boolean | null
          renewal_date?: string | null
          renewal_notice_days?: number | null
          signed_by?: string | null
          signed_date?: string | null
          signed_document_url?: string | null
          start_date: string
          status?: string | null
          terms_and_conditions?: string | null
          updated_at?: string | null
          visits_used?: number | null
        }
        Update: {
          agreement_name?: string
          agreement_number?: string
          auto_renew?: boolean | null
          billing_amount?: number
          billing_day?: number | null
          billing_frequency?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          contract_document_url?: string | null
          coverage_type?: string | null
          covered_equipment?: string[] | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          description?: string | null
          discount_percentage?: number | null
          end_date?: string
          guaranteed_response_hours?: number | null
          id?: string
          included_visits?: number | null
          next_billing_date?: string | null
          notes?: string | null
          priority_response?: boolean | null
          renewal_date?: string | null
          renewal_notice_days?: number | null
          signed_by?: string | null
          signed_date?: string | null
          signed_document_url?: string | null
          start_date?: string
          status?: string | null
          terms_and_conditions?: string | null
          updated_at?: string | null
          visits_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_agreements_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "service_agreements_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_agreements_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "service_agreements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_agreements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_catalog: {
        Row: {
          base_price: number
          category: string
          created_at: string | null
          description: string | null
          difficulty_level: string
          id: string
          is_active: boolean | null
          labor_hours: number
          service_code: string
          service_name: string
          updated_at: string | null
        }
        Insert: {
          base_price?: number
          category: string
          created_at?: string | null
          description?: string | null
          difficulty_level: string
          id?: string
          is_active?: boolean | null
          labor_hours?: number
          service_code: string
          service_name: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string
          id?: string
          is_active?: boolean | null
          labor_hours?: number
          service_code?: string
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_history: {
        Row: {
          created_at: string | null
          customer_id: string
          equipment_id: string | null
          id: string
          job_id: string | null
          labor_hours: number | null
          notes: string | null
          parts_used: string[] | null
          service_date: string
          service_type: string | null
          services_performed: string[] | null
          technician_id: string | null
          total_cost: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          equipment_id?: string | null
          id?: string
          job_id?: string | null
          labor_hours?: number | null
          notes?: string | null
          parts_used?: string[] | null
          service_date: string
          service_type?: string | null
          services_performed?: string[] | null
          technician_id?: string | null
          total_cost?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          equipment_id?: string | null
          id?: string
          job_id?: string | null
          labor_hours?: number | null
          notes?: string | null
          parts_used?: string[] | null
          service_date?: string
          service_type?: string | null
          services_performed?: string[] | null
          technician_id?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_history_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "service_history_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_history_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      signature_requests: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          document_id: string
          expires_at: string | null
          id: string
          ip_address: unknown
          request_token: string
          signature_data: string | null
          signed_at: string | null
          signer_email: string
          signer_name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          document_id: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          request_token: string
          signature_data?: string | null
          signed_at?: string | null
          signer_email: string
          signer_name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          document_id?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          request_token?: string
          signature_data?: string | null
          signed_at?: string | null
          signer_email?: string
          signer_name?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_messages: {
        Row: {
          created_at: string | null
          customer_id: string | null
          delivered_at: string | null
          id: string
          message: string
          phone_number: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          id?: string
          message: string
          phone_number: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          id?: string
          message?: string
          phone_number?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_messages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_editable: boolean | null
          is_sensitive: boolean | null
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_editable?: boolean | null
          is_sensitive?: boolean | null
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_editable?: boolean | null
          is_sensitive?: boolean | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignments: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          priority: string | null
          status: string | null
          task_name: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          task_name: string
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          task_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "task_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "task_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "task_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      team_comments: {
        Row: {
          attachments: Json | null
          author_id: string
          comment: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          mentions: string[] | null
          parent_comment_id: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          author_id: string
          comment: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          mentions?: string[] | null
          parent_comment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          author_id?: string
          comment?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          mentions?: string[] | null
          parent_comment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "team_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_locations: {
        Row: {
          accuracy: number | null
          battery_level: number | null
          employee_id: string | null
          heading: number | null
          id: string
          is_moving: boolean | null
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string | null
        }
        Insert: {
          accuracy?: number | null
          battery_level?: number | null
          employee_id?: string | null
          heading?: number | null
          id?: string
          is_moving?: boolean | null
          latitude: number
          longitude: number
          speed?: number | null
          timestamp?: string | null
        }
        Update: {
          accuracy?: number | null
          battery_level?: number | null
          employee_id?: string | null
          heading?: number | null
          id?: string
          is_moving?: boolean | null
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_locations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      time_clock_entries: {
        Row: {
          break_minutes: number | null
          clock_in_address: string | null
          clock_in_location: Json | null
          clock_in_method: string | null
          clock_in_notes: string | null
          clock_in_time: string
          clock_out_address: string | null
          clock_out_location: Json | null
          clock_out_method: string | null
          clock_out_notes: string | null
          clock_out_time: string | null
          created_at: string | null
          duration_minutes: number | null
          edit_reason: string | null
          edited_at: string | null
          edited_by: string | null
          employee_id: string
          flag_reason: string | null
          id: string
          is_flagged: boolean | null
          job_id: string | null
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          break_minutes?: number | null
          clock_in_address?: string | null
          clock_in_location?: Json | null
          clock_in_method?: string | null
          clock_in_notes?: string | null
          clock_in_time: string
          clock_out_address?: string | null
          clock_out_location?: Json | null
          clock_out_method?: string | null
          clock_out_notes?: string | null
          clock_out_time?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          edit_reason?: string | null
          edited_at?: string | null
          edited_by?: string | null
          employee_id: string
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          job_id?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          break_minutes?: number | null
          clock_in_address?: string | null
          clock_in_location?: Json | null
          clock_in_method?: string | null
          clock_in_notes?: string | null
          clock_in_time?: string
          clock_out_address?: string | null
          clock_out_location?: Json | null
          clock_out_method?: string | null
          clock_out_notes?: string | null
          clock_out_time?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          edit_reason?: string | null
          edited_at?: string | null
          edited_by?: string | null
          employee_id?: string
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          job_id?: string | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_clock_entries_edited_by_fkey"
            columns: ["edited_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_clock_entries_edited_by_fkey"
            columns: ["edited_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_clock_entries_edited_by_fkey"
            columns: ["edited_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_clock_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_clock_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_clock_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_clock_entries_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          billable_amount: number | null
          billable_minutes: number | null
          break_minutes: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          employee_id: string
          end_time: string | null
          entry_date: string
          entry_type: string | null
          hourly_rate: number | null
          id: string
          is_billable: boolean | null
          job_id: string | null
          notes: string | null
          rejection_reason: string | null
          start_time: string
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          work_performed: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          billable_amount?: number | null
          billable_minutes?: number | null
          break_minutes?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          employee_id: string
          end_time?: string | null
          entry_date: string
          entry_type?: string | null
          hourly_rate?: number | null
          id?: string
          is_billable?: boolean | null
          job_id?: string | null
          notes?: string | null
          rejection_reason?: string | null
          start_time: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          work_performed?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          billable_amount?: number | null
          billable_minutes?: number | null
          break_minutes?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          employee_id?: string
          end_time?: string | null
          entry_date?: string
          entry_type?: string | null
          hourly_rate?: number | null
          id?: string
          is_billable?: boolean | null
          job_id?: string | null
          notes?: string | null
          rejection_reason?: string | null
          start_time?: string
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          work_performed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_entries_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_entries_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      time_off_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          denial_reason: string | null
          employee_id: string
          end_date: string
          id: string
          is_paid: boolean | null
          notes: string | null
          reason: string | null
          request_type: string
          start_date: string
          status: string | null
          submitted_at: string | null
          total_days: number
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          denial_reason?: string | null
          employee_id: string
          end_date: string
          id?: string
          is_paid?: boolean | null
          notes?: string | null
          reason?: string | null
          request_type: string
          start_date: string
          status?: string | null
          submitted_at?: string | null
          total_days: number
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          denial_reason?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          is_paid?: boolean | null
          notes?: string | null
          reason?: string | null
          request_type?: string
          start_date?: string
          status?: string | null
          submitted_at?: string | null
          total_days?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_off_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_off_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_off_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_off_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "time_off_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_off_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      tool_assignment_history: {
        Row: {
          action: string
          action_date: string | null
          created_at: string | null
          from_employee_id: string | null
          from_location_id: string | null
          id: string
          notes: string | null
          performed_by: string | null
          to_employee_id: string | null
          to_location_id: string | null
          tool_id: string
        }
        Insert: {
          action: string
          action_date?: string | null
          created_at?: string | null
          from_employee_id?: string | null
          from_location_id?: string | null
          id?: string
          notes?: string | null
          performed_by?: string | null
          to_employee_id?: string | null
          to_location_id?: string | null
          tool_id: string
        }
        Update: {
          action?: string
          action_date?: string | null
          created_at?: string | null
          from_employee_id?: string | null
          from_location_id?: string | null
          id?: string
          notes?: string | null
          performed_by?: string | null
          to_employee_id?: string | null
          to_location_id?: string | null
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_assignment_history_from_employee_id_fkey"
            columns: ["from_employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tool_assignment_history_from_employee_id_fkey"
            columns: ["from_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignment_history_from_employee_id_fkey"
            columns: ["from_employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tool_assignment_history_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignment_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tool_assignment_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignment_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tool_assignment_history_to_employee_id_fkey"
            columns: ["to_employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tool_assignment_history_to_employee_id_fkey"
            columns: ["to_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignment_history_to_employee_id_fkey"
            columns: ["to_employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tool_assignment_history_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignment_history_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_assignments_tracking: {
        Row: {
          assigned_to_employee_id: string | null
          assigned_to_location_id: string | null
          assignment_date: string | null
          condition_at_assignment: string | null
          condition_at_return: string | null
          created_at: string | null
          id: string
          notes: string | null
          return_date: string | null
          status: string | null
          tool_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_to_employee_id?: string | null
          assigned_to_location_id?: string | null
          assignment_date?: string | null
          condition_at_assignment?: string | null
          condition_at_return?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          return_date?: string | null
          status?: string | null
          tool_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_to_employee_id?: string | null
          assigned_to_location_id?: string | null
          assignment_date?: string | null
          condition_at_assignment?: string | null
          condition_at_return?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          return_date?: string | null
          status?: string | null
          tool_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_assignments_tracking_assigned_to_employee_id_fkey"
            columns: ["assigned_to_employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tool_assignments_tracking_assigned_to_employee_id_fkey"
            columns: ["assigned_to_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignments_tracking_assigned_to_employee_id_fkey"
            columns: ["assigned_to_employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tool_assignments_tracking_assigned_to_location_id_fkey"
            columns: ["assigned_to_location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignments_tracking_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          current_page: string | null
          id: string
          is_mobile: boolean | null
          last_seen: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          current_page?: string | null
          id?: string
          is_mobile?: boolean | null
          last_seen?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          current_page?: string | null
          id?: string
          is_mobile?: boolean | null
          last_seen?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          account_number: string | null
          address: Json | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          notes: string | null
          payment_terms: string | null
          phone: string | null
          tax_id: string | null
          updated_at: string | null
          vendor_name: string
          website: string | null
        }
        Insert: {
          account_number?: string | null
          address?: Json | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
          vendor_name: string
          website?: string | null
        }
        Update: {
          account_number?: string | null
          address?: Json | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
          vendor_name?: string
          website?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          error_message: string | null
          event_type: string
          execution_time_ms: number | null
          id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          retry_attempt: number | null
          success: boolean | null
          triggered_at: string | null
          webhook_id: string | null
        }
        Insert: {
          error_message?: string | null
          event_type: string
          execution_time_ms?: number | null
          id?: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          retry_attempt?: number | null
          success?: boolean | null
          triggered_at?: string | null
          webhook_id?: string | null
        }
        Update: {
          error_message?: string | null
          event_type?: string
          execution_time_ms?: number | null
          id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          retry_attempt?: number | null
          success?: boolean | null
          triggered_at?: string | null
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          created_by: string | null
          event_types: string[]
          headers: Json | null
          id: string
          is_active: boolean | null
          retry_count: number | null
          secret_key: string | null
          timeout_seconds: number | null
          updated_at: string | null
          url: string
          webhook_name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          event_types: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          retry_count?: number | null
          secret_key?: string | null
          timeout_seconds?: number | null
          updated_at?: string | null
          url: string
          webhook_name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          event_types?: string[]
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          retry_count?: number | null
          secret_key?: string | null
          timeout_seconds?: number | null
          updated_at?: string | null
          url?: string
          webhook_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_automations: {
        Row: {
          actions: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          execution_order: number | null
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          actions: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_automations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          created_by: string | null
          current_step: number | null
          entity_id: string | null
          entity_type: string | null
          error_details: string | null
          id: string
          started_at: string | null
          status: string | null
          steps_completed: Json | null
          total_steps: number | null
          workflow_name: string
        }
        Insert: {
          completed_at?: string | null
          created_by?: string | null
          current_step?: number | null
          entity_id?: string | null
          entity_type?: string | null
          error_details?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          steps_completed?: Json | null
          total_steps?: number | null
          workflow_name: string
        }
        Update: {
          completed_at?: string | null
          created_by?: string | null
          current_step?: number | null
          entity_id?: string | null
          entity_type?: string | null
          error_details?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          steps_completed?: Json | null
          total_steps?: number | null
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      employee_benefits_summary: {
        Row: {
          benefit_name: string | null
          benefit_type: string | null
          employee_contribution: number | null
          employee_id: string | null
          employee_number: string | null
          end_date: string | null
          first_name: string | null
          last_name: string | null
          start_date: string | null
          status: string | null
        }
        Relationships: []
      }
      expiring_certifications: {
        Row: {
          category: string | null
          ce_hours_completed: number | null
          ce_hours_required: number | null
          certification_name: string | null
          certification_number: string | null
          continuing_education_required: boolean | null
          created_at: string | null
          days_until_expiration: number | null
          department: string | null
          document_filename: string | null
          document_url: string | null
          employee_id: string | null
          employee_number: string | null
          expiration_date: string | null
          first_name: string | null
          id: string | null
          issue_date: string | null
          issuing_organization: string | null
          last_name: string | null
          level: string | null
          notes: string | null
          reminder_sent_at: string | null
          status: string | null
          updated_at: string | null
          verification_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          description: string | null
          dimensions: string | null
          id: string | null
          image_url: string | null
          images: Json | null
          is_active: boolean | null
          is_lot_tracked: boolean | null
          is_perishable: boolean | null
          is_serialized: boolean | null
          is_taxable: boolean | null
          item_number: string | null
          lead_time_days: number | null
          manufacturer: string | null
          markup_percent: number | null
          max_quantity: number | null
          min_quantity: number | null
          model_number: string | null
          msrp: number | null
          name: string | null
          notes: string | null
          part_number: string | null
          primary_vendor_id: string | null
          reorder_point: number | null
          reorder_quantity: number | null
          sell_price: number | null
          shelf_life_days: number | null
          spec_sheet_url: string | null
          status: string | null
          subcategory: string | null
          tags: string[] | null
          unit_of_measure: string | null
          updated_at: string | null
          updated_by: string | null
          vendor_part_number: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          description?: string | null
          dimensions?: string | null
          id?: string | null
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_lot_tracked?: boolean | null
          is_perishable?: boolean | null
          is_serialized?: boolean | null
          is_taxable?: boolean | null
          item_number?: string | null
          lead_time_days?: number | null
          manufacturer?: string | null
          markup_percent?: number | null
          max_quantity?: number | null
          min_quantity?: number | null
          model_number?: string | null
          msrp?: number | null
          name?: string | null
          notes?: string | null
          part_number?: string | null
          primary_vendor_id?: string | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          sell_price?: number | null
          shelf_life_days?: number | null
          spec_sheet_url?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          unit_of_measure?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_part_number?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          category?: string | null
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          description?: string | null
          dimensions?: string | null
          id?: string | null
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_lot_tracked?: boolean | null
          is_perishable?: boolean | null
          is_serialized?: boolean | null
          is_taxable?: boolean | null
          item_number?: string | null
          lead_time_days?: number | null
          manufacturer?: string | null
          markup_percent?: number | null
          max_quantity?: number | null
          min_quantity?: number | null
          model_number?: string | null
          msrp?: number | null
          name?: string | null
          notes?: string | null
          part_number?: string | null
          primary_vendor_id?: string | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          sell_price?: number | null
          shelf_life_days?: number | null
          spec_sheet_url?: string | null
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          unit_of_measure?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_part_number?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_primary_vendor_id_fkey"
            columns: ["primary_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mandatory_training_compliance: {
        Row: {
          category: string | null
          completed_at: string | null
          completion_status: string | null
          department: string | null
          employee_id: string | null
          employee_number: string | null
          expires_at: string | null
          first_name: string | null
          last_name: string | null
          role: string | null
          training_id: string | null
          training_title: string | null
        }
        Relationships: []
      }
      pending_expense_reimbursements: {
        Row: {
          amount: number | null
          approved_at: string | null
          approved_by: string | null
          category: string | null
          created_at: string | null
          denial_reason: string | null
          department: string | null
          description: string | null
          employee_id: string | null
          employee_number: string | null
          expense_date: string | null
          first_name: string | null
          id: string | null
          job_id: string | null
          last_name: string | null
          mileage_end: string | null
          mileage_rate: number | null
          mileage_start: string | null
          miles_driven: number | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          receipt_filename: string | null
          receipt_url: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_reimbursements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "expense_reimbursements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_reimbursements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "expense_reimbursements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits_summary"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "expense_reimbursements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_reimbursements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "mandatory_training_compliance"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "expense_reimbursements_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_agreement_number: { Args: never; Returns: string }
      generate_customer_number: { Args: never; Returns: string }
      generate_employee_number: { Args: never; Returns: string }
      generate_job_number: { Args: never; Returns: string }
      generate_payment_number: { Args: never; Returns: string }
      invite_employee: {
        Args: {
          p_email: string
          p_employee_data?: Json
          p_first_name: string
          p_last_name: string
          p_phone: string
          p_role: string
        }
        Returns: Json
      }
    }
    Enums: {
      job_priority: "low" | "medium" | "high" | "emergency"
      job_status:
        | "draft"
        | "scheduled"
        | "dispatched"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "on_hold"
      user_role:
        | "admin"
        | "manager"
        | "dispatcher"
        | "technician"
        | "sales"
        | "customer"
        | "accounting"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      job_priority: ["low", "medium", "high", "emergency"],
      job_status: [
        "draft",
        "scheduled",
        "dispatched",
        "in_progress",
        "completed",
        "cancelled",
        "on_hold",
      ],
      user_role: [
        "admin",
        "manager",
        "dispatcher",
        "technician",
        "sales",
        "customer",
        "accounting",
      ],
    },
  },
} as const
