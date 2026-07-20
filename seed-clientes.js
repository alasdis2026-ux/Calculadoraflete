// seed-clientes.js — inserta clientes.json en Supabase (tabla clientes)
// Uso: node seed-clientes.js
// Requiere: clientes.json en el mismo directorio
// NO commitear este archivo (contiene service_role key)

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const SUPABASE_URL      = 'https://cxsyayunvyinfqxpjjzc.supabase.co';
const SERVICE_ROLE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4c3lheXVudnlpbmZxeHBqanpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE5Nzg4NCwiZXhwIjoyMDk2NzczODg0fQ.tPO5LF_f6EDmxAjEVroK0XFFUb7YNJsbFJ2QCzVMMPw';
const BATCH_SIZE        = 500;

const raw      = JSON.parse(fs.readFileSync(path.join(__dirname, 'clientes.json'), 'utf8'));
const clientes = raw.map(([cod, nom]) => ({ cod_cliente: String(cod), nom_cliente: nom }));

function post(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url  = new URL('/rest/v1/clientes', SUPABASE_URL);
    const req  = https.request({
      hostname: url.hostname,
      path:     url.pathname,
      method:   'POST',
      headers: {
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(data),
        'apikey':         SERVICE_ROLE_KEY,
        'Authorization':  'Bearer ' + SERVICE_ROLE_KEY,
        'Prefer':         'resolution=merge-duplicates',
      },
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`HTTP ${res.statusCode}: ${body}`));
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function seed() {
  console.log(`Insertando ${clientes.length} clientes en batches de ${BATCH_SIZE}...`);
  const total = Math.ceil(clientes.length / BATCH_SIZE);
  for (let i = 0; i < clientes.length; i += BATCH_SIZE) {
    const batch = clientes.slice(i, i + BATCH_SIZE);
    const n = Math.floor(i / BATCH_SIZE) + 1;
    process.stdout.write(`  Batch ${n}/${total}... `);
    await post(batch);
    console.log('OK');
  }
  console.log('Listo.');
}

seed().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
