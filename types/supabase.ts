export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
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
  public: {
    Tables: {
      families: {
        Row: {
          created_at: string
          family_name: string
          id: string
          locale: string
          plan: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_name: string
          id?: string
          locale?: string
          plan?: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          family_name?: string
          id?: string
          locale?: string
          plan?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "families_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          completed_at: string
          created_at: string
          date: string
          habit_id: string
          id: string
          member_id: string
          note: string | null
          photo_url: string | null
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          created_at?: string
          date?: string
          habit_id: string
          id?: string
          member_id: string
          note?: string | null
          photo_url?: string | null
          xp_earned?: number
        }
        Update: {
          completed_at?: string
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          member_id?: string
          note?: string | null
          photo_url?: string | null
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string
          created_at: string
          days_of_week: number[] | null
          description: string | null
          display_order: number
          family_id: string
          frequency: string
          icon: string | null
          id: string
          is_active: boolean
          member_ids: string[]
          time_of_day: string | null
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          color?: string
          created_at?: string
          days_of_week?: number[] | null
          description?: string | null
          display_order?: number
          family_id: string
          frequency: string
          icon?: string | null
          id?: string
          is_active?: boolean
          member_ids?: string[]
          time_of_day?: string | null
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          color?: string
          created_at?: string
          days_of_week?: number[] | null
          description?: string | null
          display_order?: number
          family_id?: string
          frequency?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          member_ids?: string[]
          time_of_day?: string | null
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "habits_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      line_settings: {
        Row: {
          created_at: string
          evening_reminder_time: string | null
          family_id: string
          id: string
          line_access_token: string | null
          line_user_id: string | null
          morning_reminder_time: string | null
          notifications_enabled: boolean
          updated_at: string
          weekly_report_day: number | null
          weekly_report_enabled: boolean
        }
        Insert: {
          created_at?: string
          evening_reminder_time?: string | null
          family_id: string
          id?: string
          line_access_token?: string | null
          line_user_id?: string | null
          morning_reminder_time?: string | null
          notifications_enabled?: boolean
          updated_at?: string
          weekly_report_day?: number | null
          weekly_report_enabled?: boolean
        }
        Update: {
          created_at?: string
          evening_reminder_time?: string | null
          family_id?: string
          id?: string
          line_access_token?: string | null
          line_user_id?: string | null
          morning_reminder_time?: string | null
          notifications_enabled?: boolean
          updated_at?: string
          weekly_report_day?: number | null
          weekly_report_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "line_settings_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: true
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          age: number | null
          avatar_url: string | null
          character_id: string | null
          created_at: string
          current_streak: number
          display_order: number
          family_id: string
          id: string
          level: number
          longest_streak: number
          name: string
          role: string
          total_xp: number
          updated_at: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          character_id?: string | null
          created_at?: string
          current_streak?: number
          display_order?: number
          family_id: string
          id?: string
          level?: number
          longest_streak?: number
          name: string
          role: string
          total_xp?: number
          updated_at?: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          character_id?: string | null
          created_at?: string
          current_streak?: number
          display_order?: number
          family_id?: string
          id?: string
          level?: number
          longest_streak?: number
          name?: string
          role?: string
          total_xp?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

