import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oqexlqikyntxywwegfue.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZXhscWlreW50eHl3d2VnZnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNjMsImV4cCI6MjA3NDc5NTE2M30.N2PZ3Sqdt8PSXG-mG9gm6KF64FOCaXKqjogoyuRuRTg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);