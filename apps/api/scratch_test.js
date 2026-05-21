import { supabase } from './src/utils/supabaseClient.js';
import bcrypt from 'bcryptjs';

async function testLogin(email, password) {
  console.log(`Testing login for ${email}...`);
  try {
    const { data: adminList, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return;
    }

    const admin = adminList?.[0];
    if (!admin) {
      console.log('No admin user found with that email.');
      return;
    }

    console.log('Admin user record:', admin);
    const match = await bcrypt.compare(password, admin.password);
    console.log(`Password matches: ${match}`);
  } catch (err) {
    console.error('Catch error:', err);
  }
}

async function run() {
  await testLogin('admin@toolisiya.com', 'SecureAdminPass2026!');
}

run().catch(console.error);
