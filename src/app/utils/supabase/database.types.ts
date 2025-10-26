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
      blog: {
        Row: {
          authorid: string
          file: string
          id: number
        }
        Insert: {
          authorid: string
          file: string
          id?: number
        }
        Update: {
          authorid?: string
          file?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_authorid_fkey"
            columns: ["authorid"]
            isOneToOne: false
            referencedRelation: "photoclubuser"
            referencedColumns: ["id"]
          },
        ]
      }
      event: {
        Row: {
          description: string
          enddate: string
          heroid: number
          id: number
          name: string
          startdate: string
          tag: string
        }
        Insert: {
          description: string
          enddate: string
          heroid: number
          id?: number
          name: string
          startdate: string
          tag: string
        }
        Update: {
          description?: string
          enddate?: string
          heroid?: number
          id?: number
          name?: string
          startdate?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_heroid_fkey"
            columns: ["heroid"]
            isOneToOne: false
            referencedRelation: "photo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["name"]
          },
        ]
      }
      photo: {
        Row: {
          authorid: string
          file: string
          id: number
        }
        Insert: {
          authorid: string
          file: string
          id?: number
        }
        Update: {
          authorid?: string
          file?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "photo_authorid_fkey"
            columns: ["authorid"]
            isOneToOne: false
            referencedRelation: "photoclubuser"
            referencedColumns: ["id"]
          },
        ]
      }
      photoclubrole: {
        Row: {
          is_admin: boolean
          roleid: string
        }
        Insert: {
          is_admin: boolean
          roleid: string
        }
        Update: {
          is_admin?: boolean
          roleid?: string
        }
        Relationships: []
      }
      photoclubuser: {
        Row: {
          bio: string | null
          email: string
          id: string
          role: string
          username: string
        }
        Insert: {
          bio?: string | null
          email: string
          id: string
          role: string
          username: string
        }
        Update: {
          bio?: string | null
          email?: string
          id?: string
          role?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "photoclubuser_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "photoclubrole"
            referencedColumns: ["roleid"]
          },
        ]
      }
      phototag: {
        Row: {
          photoid: number
          tag: string
        }
        Insert: {
          photoid: number
          tag: string
        }
        Update: {
          photoid?: number
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "phototag_photoid_fkey"
            columns: ["photoid"]
            isOneToOne: false
            referencedRelation: "photo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phototag_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tag"
            referencedColumns: ["name"]
          },
        ]
      }
      tag: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
