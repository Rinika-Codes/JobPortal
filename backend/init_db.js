const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDB() {
  console.log('Connecting to MySQL...');
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Password from user prompt
    multipleStatements: true
  });

  try {
    console.log('Reading schema...');
    const schemaPath = path.join(__dirname, '..', 'databases', 'migrations', '001_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await conn.query(schemaSql);
    console.log('Schema executed successfully.');

    console.log('Reading seeds...');
    const seedPath = path.join(__dirname, '..', 'databases', 'seeds', '001_seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Executing seeds...');
    await conn.query(seedSql);
    console.log('Seeds executed successfully.');

  } catch (error) {
    console.error('Error during DB initialization:', error);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

initializeDB();
