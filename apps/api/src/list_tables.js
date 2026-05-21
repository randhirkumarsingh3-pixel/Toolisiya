import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data, error } = await supabase.rpc('get_tables_and_views');
  if (error) {
    // If RPC doesn't exist, query pg_catalog
    console.log("RPC get_tables_and_views not found, querying catalog via SQL RPC or general query if possible...");
    // Let's run a raw query by creating a temporary function or running a known query
    const { data: tables, error: sqlError } = await supabase
      .from('tools')
      .select('id')
      .limit(1);
    console.log("Supabase connection check:", { hasData: !!tables, sqlError });
    
    // We can also list by calling a helper
    console.log("Let's list some known tables:");
    const knownTables = ['users', 'medicines', 'medicine_reminders', 'blog_posts', 'categories', 'blog_categories', 'analytics_events'];
    for (const table of knownTables) {
      const { error: tableError } = await supabase.from(table).select('id').limit(1);
      console.log(`Table ${table}:`, tableError ? `NOT FOUND (${tableError.message})` : "EXISTS");
    }
  }
}

run();
