import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kexwtzdfkcyqjuisskrk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleHd0emRma2N5cWp1aXNza3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzM4NjMsImV4cCI6MjA5NDM0OTg2M30.SduAr2jVIAQ1i1t3NgMRyArIrTXfoxUrQsE2QwFF0hc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const toolId = 'edit-pdf-online';
  
  // check if exists
  const { data: existing } = await supabase.from('tools').select('*').eq('id', toolId).single();
  
  if (existing) {
    console.log('Tool already exists, updating...');
    const { error } = await supabase.from('tools').update({
      name: 'Edit PDF Online',
      category: 'PDF',
      url: '/pdf/edit-pdf-online',
      status: 'active',
      show_in_menu: true
    }).eq('id', toolId);
    if (error) console.error('Update error:', error);
    else console.log('Updated successfully');
  } else {
    console.log('Tool does not exist, inserting...');
    const { error } = await supabase.from('tools').insert({
      id: toolId,
      name: 'Edit PDF Online',
      category: 'PDF',
      url: '/pdf/edit-pdf-online',
      status: 'active',
      show_in_menu: true
    });
    if (error) console.error('Insert error:', error);
    else console.log('Inserted successfully');
  }
}

main();
