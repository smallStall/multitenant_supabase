export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      knex_migrations: {
        Row: {
          batch: number | null
          id: number
          migration_time: string | null
          name: string | null
        }
        Insert: {
          batch?: number | null
          id?: number
          migration_time?: string | null
          name?: string | null
        }
        Update: {
          batch?: number | null
          id?: number
          migration_time?: string | null
          name?: string | null
        }
      }
      knex_migrations_lock: {
        Row: {
          index: number
          is_locked: number | null
        }
        Insert: {
          index?: number
          is_locked?: number | null
        }
        Update: {
          index?: number
          is_locked?: number | null
        }
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_deleted: boolean
          role: string
          tenant_id: string
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_deleted?: boolean
          role?: string
          tenant_id: string
          updated_at?: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_deleted?: boolean
          role?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
          user_name?: string
        }
      }
      tenants: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          is_deleted: boolean
          tenant_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          is_deleted?: boolean
          tenant_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          is_deleted?: boolean
          tenant_name?: string
          updated_at?: string
        }
      }
      todos: {
        Row: {
          created_at: string
          id: string
          is_deleted: boolean
          is_done: boolean
          profile_id: string
          tenant_id: string
          todo_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_done?: boolean
          profile_id: string
          tenant_id: string
          todo_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_done?: boolean
          profile_id?: string
          tenant_id?: string
          todo_name?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_tenant_id: {
        Args: { tenant_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

