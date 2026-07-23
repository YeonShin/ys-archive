export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      contact: {
        Row: {
          description: string | null;
          icon: string;
          id: string;
          name: string;
          url: string;
        };
        Insert: {
          description?: string | null;
          icon: string;
          id?: string;
          name: string;
          url: string;
        };
        Update: {
          description?: string | null;
          icon?: string;
          id?: string;
          name?: string;
          url?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          description: string | null;
          details: string[] | null;
          ended_at: string | null;
          id: string;
          organization: string;
          started_at: string;
          tech_stacks: string[] | null;
          title: string;
        };
        Insert: {
          description?: string | null;
          details?: string[] | null;
          ended_at?: string | null;
          id?: string;
          organization: string;
          started_at: string;
          tech_stacks?: string[] | null;
          title: string;
        };
        Update: {
          description?: string | null;
          details?: string[] | null;
          ended_at?: string | null;
          id?: string;
          organization?: string;
          started_at?: string;
          tech_stacks?: string[] | null;
          title?: string;
        };
        Relationships: [];
      };
      guestbook: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          is_public: boolean | null;
          nickname: string;
          password: string;
          updated_at: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          nickname: string;
          password: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          nickname?: string;
          password?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      portfolio_content: {
        Row: {
          about_text: string;
          hero_description: string;
          hero_title: string;
          id: number;
          profile_image_url: string | null;
          resume_url: string | null;
        };
        Insert: {
          about_text: string;
          hero_description: string;
          hero_title: string;
          id: number;
          profile_image_url?: string | null;
          resume_url?: string | null;
        };
        Update: {
          about_text?: string;
          hero_description?: string;
          hero_title?: string;
          id?: number;
          profile_image_url?: string | null;
          resume_url?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          architecture: Json | null;
          description: string | null;
          id: string;
          images: string[] | null;
          key_features: Json | null;
          links: Json | null;
          period: string;
          priority: number | null;
          retrospective: string | null;
          role: string;
          status: string;
          subtitle: string | null;
          tech_stacks: Json | null;
          thumbnail_url: string;
          title: string;
          troubleshooting: Json | null;
        };
        Insert: {
          architecture?: Json | null;
          description?: string | null;
          id?: string;
          images?: string[] | null;
          key_features?: Json | null;
          links?: Json | null;
          period: string;
          priority?: number | null;
          retrospective?: string | null;
          role: string;
          status: string;
          subtitle?: string | null;
          tech_stacks?: Json | null;
          thumbnail_url: string;
          title: string;
          troubleshooting?: Json | null;
        };
        Update: {
          architecture?: Json | null;
          description?: string | null;
          id?: string;
          images?: string[] | null;
          key_features?: Json | null;
          links?: Json | null;
          period?: string;
          priority?: number | null;
          retrospective?: string | null;
          role?: string;
          status?: string;
          subtitle?: string | null;
          tech_stacks?: Json | null;
          thumbnail_url?: string;
          title?: string;
          troubleshooting?: Json | null;
        };
        Relationships: [];
      };
      tech_stacks: {
        Row: {
          icon: string;
          id: string;
          level: string | null;
          name: string;
          type: string;
        };
        Insert: {
          icon: string;
          id?: string;
          level?: string | null;
          name: string;
          type: string;
        };
        Update: {
          icon?: string;
          id?: string;
          level?: string | null;
          name?: string;
          type?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      guestbook_public_view: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string | null;
          is_public: boolean | null;
          nickname: string | null;
          updated_at: string | null;
        };
        Insert: {
          content?: never;
          created_at?: string | null;
          id?: string | null;
          is_public?: boolean | null;
          nickname?: string | null;
          updated_at?: string | null;
        };
        Update: {
          content?: never;
          created_at?: string | null;
          id?: string | null;
          is_public?: boolean | null;
          nickname?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
