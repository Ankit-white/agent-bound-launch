export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.15" };
  public: {
    Tables: {
      waitlist_signups: {
        Row: {
          building: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
          status: string;
          auth_user_id: string | null;
          verification_token_expires_at: string | null;
          verification_token_hash: string | null;
          verified: boolean;
          verified_at: string | null;
        };
        Insert: {
          building?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          status?: string;
          auth_user_id?: string | null;
          verification_token_expires_at?: string | null;
          verification_token_hash?: string | null;
          verified?: boolean;
          verified_at?: string | null;
        };
        Update: {
          building?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          status?: string;
          auth_user_id?: string | null;
          verification_token_expires_at?: string | null;
          verification_token_hash?: string | null;
          verified?: boolean;
          verified_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      begin_waitlist_verification: {
        Args: {
          p_signup_building: string;
          p_signup_email: string;
          p_signup_name: string;
          p_token_expires_at: string;
          p_token_hash: string | null;
          p_auth_user_id?: string | null;
        };
        Returns: { result: string; signup_id: string | null }[];
      };
      activate_waitlist_for_verified_user: {
        Args: { p_user_id: string; p_email: string };
        Returns: string;
      };
      cancel_waitlist_verification: {
        Args: { p_signup_id: string; p_token_hash: string };
        Returns: undefined;
      };
      confirm_waitlist_verification: { Args: { p_token_hash: string }; Returns: string };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];
export type Tables<
  T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
  _ = never,
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends { Row: infer R } ? R : never;
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Insert: infer I } ? I : never;
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T] extends { Update: infer U } ? U : never;
export type Enums<T extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][T];
export type CompositeTypes<T extends keyof DefaultSchema["CompositeTypes"]> =
  DefaultSchema["CompositeTypes"][T];
export const Constants = { public: { Enums: {} } } as const;
