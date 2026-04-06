import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Subsidy = {
  id: string
  name: string
  category: string
  max_amount: string
  rate: string
  status: number
  priority: string
  deadline: string
}

export type Task = {
  id: string
  subsidy_id: string
  text: string
  done: boolean
  date: string
  created_at?: string
}

export type Note = {
  id: string
  subsidy_id: string
  text: string
  author: string
  created_at?: string
}

export type FileRecord = {
  id: string
  subsidy_id: string
  name: string
  type: string
  created_at?: string
}
