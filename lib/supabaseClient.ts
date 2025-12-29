import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Only create the client if we have real credentials
export const supabase =
  supabaseUrl.includes("placeholder") || supabaseAnonKey.includes("placeholder")
    ? null
    : createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          name: string;
          center_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          center_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          center_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      centers: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          created_at: string;
          date: string;
          service_type: string;
          center_id: string;
          adult_male: number;
          adult_female: number;
          child_male: number;
          child_female: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          date: string;
          service_type: string;
          center_id: string;
          adult_male?: number;
          adult_female?: number;
          child_male?: number;
          child_female?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          date?: string;
          service_type?: string;
          center_id?: string;
          adult_male?: number;
          adult_female?: number;
          child_male?: number;
          child_female?: number;
        };
      };
    };
  };
};
