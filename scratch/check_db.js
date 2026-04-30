
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parsing
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('--- PROJECTS ---');
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, category, live_url, apk_url, image_url');
  
  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
  } else {
    console.table(projects);
  }

  console.log('\n--- SETTINGS ---');
  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('id, value');

  if (settingsError) {
    console.error('Error fetching settings:', settingsError);
  } else {
    console.table(settings);
  }
}

checkDatabase();
