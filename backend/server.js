import app from './app.js';
import { loadDataAndEmbed, isReady } from './data.js';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

function logMemory(prefix='MEM') {
  const m = process.memoryUsage();
  console.log(`${prefix} rss=${(m.rss/1024/1024).toFixed(1)}MB heapUsed=${(m.heapUsed/1024/1024).toFixed(1)}MB`);
}

console.log('[BOOT] Starting server process pid', process.pid);

const server = app.listen(PORT, HOST, async () => {
  console.log(`[READY] Server listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`[CONFIG] Embedding model: ${process.env.EMBEDDING_MODEL || 'text-embedding-3-small'}`);
  try {
    await loadDataAndEmbed();
    console.log(`[DATA] Embeddings ready: ${isReady()}`);
    logMemory('[DATA]');
  } catch (e) {
    console.error('[ERROR] Failed to load data / embeddings:', e);
  }
});

// Graceful shutdown & diagnostics
['SIGINT','SIGTERM'].forEach(sig => {
  process.on(sig, () => {
    console.log(`[SHUTDOWN] Received ${sig}, closing server...`);
    server.close(() => {
      console.log('[SHUTDOWN] HTTP server closed.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000).unref();
  });
});

process.on('uncaughtException', err => {
  console.error('[FATAL] Uncaught exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('[FATAL] Unhandled rejection:', err);
});

setInterval(() => logMemory('[HEARTBEAT]'), 30000).unref();
