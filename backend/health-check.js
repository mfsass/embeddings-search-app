// Simple health check script
import http from 'http';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3001;

const options = {
  host: HOST,
  port: PORT,
  path: '/health',
  method: 'GET',
  timeout: 4000
};

console.log(`[CHECK] Pinging http://${HOST}:${PORT}/health ...`);

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('[CHECK] Status:', res.statusCode, json);
      process.exit(json.ready ? 0 : 2);
    } catch (e) {
      console.error('[CHECK] Failed to parse JSON:', e.message, 'Raw:', data);
      process.exit(3);
    }
  });
});

req.on('error', err => {
  console.error('[CHECK] Request error:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('[CHECK] Request timed out');
  req.destroy();
  process.exit(4);
});

req.end();
