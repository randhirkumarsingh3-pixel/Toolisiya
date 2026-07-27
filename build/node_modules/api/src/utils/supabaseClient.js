import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: { 'x-my-custom-header': 'toolisiya-api' }
  },
  realtime: {
    transport: ws,
  }
});

export default supabase;
