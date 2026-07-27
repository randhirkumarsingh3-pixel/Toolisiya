import sqlite3
import os

db_path = '/Users/randhir/Downloads/Toolisiya/apps/pocketbase/pb_data/data.db'
output_path = '/Users/randhir/.gemini/antigravity/brain/ef39f8a7-fd02-48a9-b7a2-6967f2b8f8ca/supabase_data_seed.sql'

if not os.path.exists(db_path):
    print(f"Error: Database file not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]

# Filter out internal/system tables except the ones we want
skip_prefixes = ['_mfas', '_otps', '_externalAuths', '_authOrigins', '_migrations', '_params', '_collections', 'sqlite_']
filtered_tables = []
for t in tables:
    should_skip = False
    for prefix in skip_prefixes:
        if t.startswith(prefix):
            should_skip = True
            break
    if not should_skip:
        filtered_tables.append(t)

# A set of all columns that are mapped to JSONB type
json_cols = {
    'experience', 'education', 'skills', 'items', 'category_visibility', 
    'category_order', 'menu_items_config', 'position', 'actionItems', 
    'completedDates', 'intakeHistory', 'ingredients', 'metadata', 
    'structured_data', 'faq_schema', 'tool_schema', 'relatedTools', 
    'faq', 'categories', 'menuItems', 'categoryOrder', 'visibility', 
    'metrics', 'designData', 'formData', 'customizationData'
}

print(f"Found {len(filtered_tables)} data tables to export.")

sql_inserts = ["-- Toolisiya Seed Data Export for Supabase (PostgreSQL)\n", "BEGIN;\n\n"]

for table in filtered_tables:
    if table == '_superusers':
        continue
        
    target_table = table
    
    # Get columns
    cursor.execute(f"PRAGMA table_info({table});")
    columns_info = cursor.fetchall()
    
    col_names = []
    col_types = {}
    for col in columns_info:
        name = col[1]
        t = col[2].upper()
        
        # Map created/updated to created_at/updated_at
        if name == 'created':
            name = 'created_at'
        elif name == 'updated':
            name = 'updated_at'
            
        col_names.append(name)
        col_types[name] = t

    # Fetch rows
    cursor.execute(f"SELECT * FROM {table};")
    rows = cursor.fetchall()
    
    if not rows:
        continue
        
    sql_inserts.append(f"-- Seeding table: {target_table}\n")
    
    for row in rows:
        vals = []
        for i, val in enumerate(row):
            col_name = col_names[i]
            
            if val is None:
                if col_name in json_cols:
                    vals.append("'{}'::jsonb")
                else:
                    vals.append("NULL")
            elif isinstance(val, bool):
                vals.append("true" if val else "false")
            elif isinstance(val, (int, float)):
                # If column type indicates a boolean
                if 'bool' in col_name.lower() or col_name in ['emailVisibility', 'verified', 'maintenance_mode', 'is_published', 'is_active', 'published', 'completed', 'pinned', 'takenToday', 'show_in_menu']:
                    vals.append("true" if val == 1 else "false")
                else:
                    vals.append(str(val))
            elif isinstance(val, str):
                escaped = val.replace("'", "''")
                vals.append(f"'{escaped}'")
            else:
                escaped = str(val).replace("'", "''")
                vals.append(f"'{escaped}'")
                
        cols_str = ", ".join([f'"{c}"' for c in col_names])
        vals_str = ", ".join(vals)
        sql_inserts.append(f"INSERT INTO public.\"{target_table}\" ({cols_str}) VALUES ({vals_str}) ON CONFLICT DO NOTHING;\n")
        
    sql_inserts.append("\n")

sql_inserts.append("COMMIT;\n")

with open(output_path, 'w', encoding='utf-8') as f:
    f.writelines(sql_inserts)

print(f"Data export completed successfully! Written to: {output_path}")
conn.close()
