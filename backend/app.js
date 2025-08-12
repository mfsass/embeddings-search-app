import express from 'express';
import cors from 'cors';
import { loadDataAndEmbed, isReady, getCustomers, embedQuery } from './data.js';
import { cosineSimilarity } from './utils.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', ready: isReady() });
});

app.post('/search', async (req, res) => {
  try {
    if (!isReady()) return res.status(503).json({ error: 'Embeddings not ready yet' });
  // Default topK increased to 100 (cap 100)
  const { query, topK = 100 } = req.body || {};
  if (!query || typeof query !== 'string') return res.status(400).json({ error: 'query string required' });
  const k = Math.min(Math.max(parseInt(topK, 10) || 100, 1), 100);

    const qEmbedding = await embedQuery(query);

    const scored = getCustomers().map(c => ({
      ...c,
      similarity: cosineSimilarity(qEmbedding, c.embedding)
    }));

    scored.sort((a, b) => b.similarity - a.similarity);
    // Remove embedding from response for security/size
    const results = scored.slice(0, k).map(({ embedding, ...rest }) => rest);
  res.json({ query, topK: k, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

export default app;
