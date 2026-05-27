import { db } from './index.js';

console.log('🔄 Adding system_prompt column to profiles table...');

try {
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(profiles)").all() as any[];
  const hasSystemPrompt = tableInfo.some((col: any) => col.name === 'system_prompt');

  if (hasSystemPrompt) {
    console.log('✅ Column system_prompt already exists, skipping migration');
  } else {
    // Add the column
    db.prepare('ALTER TABLE profiles ADD COLUMN system_prompt TEXT').run();
    console.log('✅ Successfully added system_prompt column to profiles table');
  }
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}

console.log('✅ Migration complete!');
