import { db } from './index.js';

console.log('🔄 Adding model column to plugins table...');

try {
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(plugins)").all() as any[];
  const hasModel = tableInfo.some((col: any) => col.name === 'model');
  
  if (hasModel) {
    console.log('✅ Column model already exists, skipping migration');
  } else {
    // Add the column
    db.prepare('ALTER TABLE plugins ADD COLUMN model TEXT').run();
    // Add index
    db.prepare('CREATE INDEX IF NOT EXISTS idx_plugins_model ON plugins(model)').run();
    console.log('✅ Successfully added model column to plugins table');
  }
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}

console.log('✅ Migration complete!');
