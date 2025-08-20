import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dljzgvtyauyytgibbhom.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanpndnR5YXV5eXRnaWJiaG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDA2MzIsImV4cCI6MjA2ODc3NjYzMn0.RWNXHoiJ0lR8w93gXlpGCKvmEjuDGMYZXV88Yn8lSU0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 