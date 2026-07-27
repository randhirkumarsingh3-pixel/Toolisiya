import fs from 'fs';
import path from 'path';

const snapshotPath = '/Users/randhir/Downloads/Toolisiya/apps/pocketbase/pb_snapshots/1779289332_collections_snapshot.js';
const content = fs.readFileSync(snapshotPath, 'utf8');

const jsonStart = content.indexOf('const snapshot = [');
const jsonEnd = content.lastIndexOf('];');

if (jsonStart === -1 || jsonEnd === -1) {
  console.error("Could not find snapshot array in file");
  process.exit(1);
}

const snapshotStr = content.substring(jsonStart + 'const snapshot = '.length, jsonEnd + 2);

let snapshot;
try {
  snapshot = eval(snapshotStr);
} catch (e) {
  console.error("Failed to parse snapshot array:", e);
  process.exit(1);
}

let sqlOutput = `-- Toolisiya Database Schema Migration Script for Supabase (PostgreSQL)\n`;
sqlOutput += `-- Generated automatically from PocketBase snapshot\n\n`;

function mapType(field) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'url':
    case 'password':
      return 'TEXT';
    case 'bool':
      return 'BOOLEAN DEFAULT FALSE';
    case 'number':
      return field.onlyInt ? 'INTEGER' : 'DOUBLE PRECISION';
    case 'json':
      return 'JSONB DEFAULT \'{}\'::jsonb';
    case 'autodate':
      return 'TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE(\'utc\'::text, NOW())';
    case 'select':
      return field.maxSelect > 1 ? 'TEXT[]' : 'TEXT';
    case 'file':
      return field.maxSelect > 1 ? 'TEXT[]' : 'TEXT';
    case 'relation':
      return field.maxSelect > 1 ? 'TEXT[]' : 'TEXT';
    default:
      return 'TEXT';
  }
}

function formatIndex(idxStr, colNameMap) {
  let clean = idxStr.replace(/`/g, '');
  clean = clean.replace(/\s+/g, ' ').trim();
  
  const match = clean.match(/^CREATE\s+(UNIQUE\s+)?INDEX\s+(\w+)\s+ON\s+(\w+)\s*\(([^)]+)\)(.*)$/i);
  if (match) {
    const unique = match[1] ? 'UNIQUE ' : '';
    const indexName = match[2];
    const tblName = match[3];
    const colsExpr = match[4];
    const extra = match[5] ? match[5].trim() : '';
    
    const cols = colsExpr.split(',').map(c => {
      let colClean = c.trim();
      if (colClean === 'created') colClean = 'created_at';
      if (colClean === 'updated') colClean = 'updated_at';
      return `"${colClean}"`;
    }).join(', ');
    
    let postgresIdx = `CREATE ${unique}INDEX "${indexName}" ON public."${tblName}" (${cols})`;
    if (extra) {
      let cleanExtra = extra;
      const sqlKeywords = ['where', 'and', 'or', 'not', 'is', 'null', 'like', 'in', 'true', 'false'];
      cleanExtra = cleanExtra.replace(/\b(\w+)\b/g, (word) => {
        const lower = word.toLowerCase();
        if (sqlKeywords.includes(lower) || !isNaN(word)) {
          return word;
        }
        let col = word;
        if (col === 'created') col = 'created_at';
        if (col === 'updated') col = 'updated_at';
        return `"${col}"`;
      });
      postgresIdx += ` ${cleanExtra}`;
    }
    return postgresIdx + ';';
  }
  
  return clean + ';';
}

const allIndexes = [];
const pbSystemTables = ['_mfas', '_otps', '_externalAuths', '_authOrigins', '_migrations', '_params', '_collections', '_superusers'];

for (const collection of snapshot) {
  if (pbSystemTables.includes(collection.name)) {
    continue;
  }

  const tableName = collection.name;
  
  sqlOutput += `-- -----------------------------------------------------\n`;
  sqlOutput += `-- Table: ${tableName}\n`;
  sqlOutput += `-- -----------------------------------------------------\n`;
  sqlOutput += `DROP TABLE IF EXISTS public."${tableName}" CASCADE;\n`;
  sqlOutput += `CREATE TABLE public."${tableName}" (\n`;

  const columns = [];
  for (const field of collection.fields) {
    let colName = field.name;
    if (colName === 'created') colName = 'created_at';
    if (colName === 'updated') colName = 'updated_at';

    let colDef = `  "${colName}" ${mapType(field)}`;
    
    if (field.primaryKey) {
      colDef += ' PRIMARY KEY';
    } else if (field.required) {
      colDef += ' NOT NULL';
    }
    columns.push(colDef);
  }
  
  sqlOutput += columns.join(',\n') + '\n';
  sqlOutput += `);\n\n`;

  // Process indexes
  if (collection.indexes && collection.indexes.length > 0) {
    for (const idx of collection.indexes) {
      allIndexes.push(formatIndex(idx, tableName));
    }
  }
}

sqlOutput += `-- -----------------------------------------------------\n`;
sqlOutput += `-- Database Indexes\n`;
sqlOutput += `-- -----------------------------------------------------\n`;
sqlOutput += allIndexes.join('\n') + '\n';

const artifactDir = '/Users/randhir/.gemini/antigravity/brain/ef39f8a7-fd02-48a9-b7a2-6967f2b8f8ca';
const outputPath = path.join(artifactDir, 'supabase_schema.sql');
fs.writeFileSync(outputPath, sqlOutput, 'utf8');

console.log(`Regenerated Supabase PostgreSQL schema with custom underscore tables at: ${outputPath}`);
