import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Todo = {
  id: string
  user_id: string
  title: string
  description?: string
  deadline?: string
  completed: boolean
  created_at: string
  updated_at: string
}