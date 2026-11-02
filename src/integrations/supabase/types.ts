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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      agent_threads: {
        Row: {
          id: string
          messages: Json
          run_id: string | null
          run_started_at: string | null
          title: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          id?: string
          messages?: Json
          run_id?: string | null
          run_started_at?: string | null
          title?: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          id?: string
          messages?: Json
          run_id?: string | null
          run_started_at?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      demo_reminders: {
        Row: {
          created_at: string
          id: string
          idempotency_key: string
          message: string
          reservation_id: string
          reservation_status: string
          scheduled_for: string | null
          source_event_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idempotency_key: string
          message: string
          reservation_id: string
          reservation_status: string
          scheduled_for?: string | null
          source_event_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idempotency_key?: string
          message?: string
          reservation_id?: string
          reservation_status?: string
          scheduled_for?: string | null
          source_event_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_reminders_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "demo_reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_reservations: {
        Row: {
          bay: string
          cancellation_id: string | null
          created_at: string
          facility_id: string
          fee_cents: number
          fee_percent: number
          grace_minutes: number
          hours: number
          id: string
          level: string
          price: number
          reservation_status: string
          resolved_at: string | null
          session_id: string | null
          starts_at: string
          status: string
          tariff: Json | null
          user_id: string
        }
        Insert: {
          bay: string
          cancellation_id?: string | null
          created_at?: string
          facility_id: string
          fee_cents?: number
          fee_percent?: number
          grace_minutes?: number
          hours: number
          id: string
          level: string
          price: number
          reservation_status?: string
          resolved_at?: string | null
          session_id?: string | null
          starts_at: string
          status?: string
          tariff?: Json | null
          user_id: string
        }
        Update: {
          bay?: string
          cancellation_id?: string | null
          created_at?: string
          facility_id?: string
          fee_cents?: number
          fee_percent?: number
          grace_minutes?: number
          hours?: number
          id?: string
          level?: string
          price?: number
          reservation_status?: string
          resolved_at?: string | null
          session_id?: string | null
          starts_at?: string
          status?: string
          tariff?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      integration_events: {
        Row: {
          attempts: number
          created_at: string
          delivery_status: string
          event_type: string
          id: string
          last_error: string | null
          last_http_status: number | null
          lease_until: string | null
          next_attempt_at: string
          payload: Json
          previous_reservation_id: string | null
          reservation_id: string
          sent_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          delivery_status?: string
          event_type: string
          id?: string
          last_error?: string | null
          last_http_status?: number | null
          lease_until?: string | null
          next_attempt_at?: string
          payload: Json
          previous_reservation_id?: string | null
          reservation_id: string
          sent_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          delivery_status?: string
          event_type?: string
          id?: string
          last_error?: string | null
          last_http_status?: number | null
          lease_until?: string | null
          next_attempt_at?: string
          payload?: Json
          previous_reservation_id?: string | null
          reservation_id?: string
          sent_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      parking_states: {
        Row: {
          import_decision: string | null
          imported_at: string | null
          state: Json
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          import_decision?: string | null
          imported_at?: string | null
          state: Json
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          import_decision?: string | null
          imported_at?: string | null
          state?: Json
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          license_plate: string
          parking_preferences: Json
          preferred_facility: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          license_plate?: string
          parking_preferences?: Json
          preferred_facility?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          license_plate?: string
          parking_preferences?: Json
          preferred_facility?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservation_cancellation_quotes: {
        Row: {
          batch_id: string | null
          created_at: string
          expires_at: string
          fee_cents: number
          id: string
          percent: number
          price: number
          reservation_id: string
          user_id: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          expires_at: string
          fee_cents: number
          id?: string
          percent: number
          price: number
          reservation_id: string
          user_id: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          expires_at?: string
          fee_cents?: number
          id?: string
          percent?: number
          price?: number
          reservation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_cancellation_quotes_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "demo_reservations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      demo_book_spot: {
        Args: {
          p_bay: string
          p_facility: string
          p_hours: number
          p_id: string
          p_level: string
          p_start: string
          p_user: string
        }
        Returns: string
      }
      demo_book_spot_priced: {
        Args: {
          p_bay: string
          p_facility: string
          p_hours: number
          p_id: string
          p_level: string
          p_price: number
          p_start: string
          p_tariff: Json
          p_user: string
        }
        Returns: string
      }
      demo_cancel_booking: {
        Args: { p_id: string; p_user: string }
        Returns: boolean
      }
      demo_cancellation_percent: {
        Args: { p_now: string; p_start: string }
        Returns: number
      }
      demo_confirm_cancellation: {
        Args: { p_quote: string; p_user: string }
        Returns: Json
      }
      demo_confirm_cancellation_batch: {
        Args: { p_batch: string; p_user: string }
        Returns: Json
      }
      demo_held_positions: {
        Args: never
        Returns: {
          bay: string
          facility_id: string
          level: string
        }[]
      }
      demo_quote_cancellation: {
        Args: { p_id: string; p_user: string }
        Returns: Json
      }
      demo_quote_cancellation_batch: {
        Args: { p_ids: string[]; p_user: string }
        Returns: Json
      }
      demo_reconcile_no_shows: { Args: never; Returns: number }
      demo_reschedule: {
        Args: {
          p_batch: string
          p_bay: string
          p_facility: string
          p_hours: number
          p_id: string
          p_level: string
          p_price: number
          p_start: string
          p_tariff: Json
          p_user: string
        }
        Returns: Json
      }
      demo_save_state: {
        Args: {
          p_arrival?: string
          p_state: Json
          p_user: string
          p_version: number
        }
        Returns: boolean
      }
      n8n_claim_events: {
        Args: { p_limit: number }
        Returns: {
          attempts: number
          created_at: string
          delivery_status: string
          event_type: string
          id: string
          last_error: string | null
          last_http_status: number | null
          lease_until: string | null
          next_attempt_at: string
          payload: Json
          previous_reservation_id: string | null
          reservation_id: string
          sent_at: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "integration_events"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      n8n_reservation_payload: {
        Args: { r: Database["public"]["Tables"]["demo_reservations"]["Row"] }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
