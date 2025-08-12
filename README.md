<div align="center">

# Semantic Customer Search (OpenAI Embeddings)

Semantic search over customer profiles using OpenAI embeddings. Full‑stack: Express API + React (Vite) frontend with Material UI DataGrid.

</div>

## ✨ Core Features
* CSV ingestion -> embedding generation at startup (in‑memory vector store)
* REST API: `GET /health` (readiness) & `POST /search` (semantic similarity)
* Top‑K ranking (default 100) by cosine similarity
* Rich results table (age, dependents, spend (R), vouchers, brands, segment chips, match % bar)
* Loading, error & empty states; average spend + segment distribution summary

## 🧱 Stack
| Area | Tech |
|------|------|
| Backend | Node.js 18+, Express, OpenAI SDK, csv-parser, dotenv |
| Frontend | React 18, Vite, MUI (Material UI), MUI DataGrid |
| Testing | Jest + Supertest (backend), Vitest + @testing-library (frontend) |
| Linting | ESLint |

## 📁 Structure
```
backend/
  server.js          # Starts Express & loads embeddings
  app.js             # Express app & /search logic
  data.js            # CSV load + embedding init + query embedding
  utils.js           # cosineSimilarity
  customers.csv      # Source data (sample)
  Creates_10k_*.csv  # Larger sample dataset (large file)
  __tests__/         # Jest tests
  .env.example
frontend/
  index.html
  src/
    main.jsx
    App.jsx
    components/
      QueryForm.jsx
      ResultsTable.jsx
  vite.config.js
README.md
```

## ✅ Prerequisites
* Node.js 18+ (20 LTS recommended)
* OpenAI API key (embeddings permission)

## ⚙️ Environment Variables (`backend/.env`)
```
OPENAI_API_KEY=sk-...
PORT=3001
EMBEDDING_MODEL=text-embedding-3-small
# Optional overrides
#CUSTOMERS_CSV=customers.csv
#ROW_LIMIT=0
```

Create it from `.env.example` before starting the backend.

## 🚀 Quick Start
In two terminals:

Backend:
```
cd backend
npm install
npm start
```
Watch logs until: `Embeddings ready` (or check `/health`).

Frontend:
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## 🔍 Using the App
1. Enter a natural language query (e.g. `High value family diner who redeems vouchers`).
2. (Optional) Adjust Top K (defaults to 100).
3. Submit – table fills with best matches (highest similarity first).
4. Review segment chips and average spend summary above the grid.

## 🛣️ API
### Health
`GET /health` -> `{ ready: boolean, total: number }`

### Search
`POST /search`
Request body:
```json
{ "query": "string", "topK": 100 }
```
Response shape (fields trimmed for brevity):
```json
{
  "query": "...",
  "topK": 100,
  "results": [
    {
      "profile_id": "123",
      "age": "42",
      "dependent_count": "2",
      "yearly_spend": "52310",
      "campaign_vouchers": "3",
      "regular_vouchers": "5",
      "brand_count": "4",
      "main_segment": "Champions",
      "similarity": 0.873451
    }
  ]
}
```
Errors:
* 400 – missing/invalid query
* 503 – embeddings not ready
* 500 – internal error

## 🧪 Tests
Backend:
```
cd backend
npm test
```
Frontend (vitest):
```
cd frontend
npm test
```

## 🧹 Lint
Run ESLint (example for backend):
```
cd backend
npx eslint .
```

## 📊 Data & Large Files
The repository currently includes a large CSV (`Creates_10k_rich_texmantic_search_testing_2.csv`, ~74MB). GitHub warns about large files; consider:
* Moving large datasets to Git LFS (`git lfs track '*.csv'`)
* Providing a smaller sample + download link instead

## ⚡ Performance Notes
* Embeddings are generated once at startup (cold start latency increases with dataset size).
* For >100k rows migrate to a vector DB (pgvector / Pinecone / Milvus / Qdrant) and stream ingestion.
* Present search is CPU-bound linear scan; you can add approximate ANN later.

## 🔐 Security
* API key stays server-side (.env not committed).
* Add rate limiting & input validation before exposing publicly.

## 🛠️ Troubleshooting
| Issue | Fix |
|-------|-----|
| `SyntaxError: Unexpected token '?'` | Upgrade Node to >=18 |
| 429 from OpenAI | Add retry/backoff; avoid duplicate queries |
| Env vars undefined | Ensure `backend/.env` exists & restart server |
| Slow startup | Large CSV -> precompute & cache embeddings |

Upgrade Node on Windows (nvm-windows):
```
nvm install 20.14.0
nvm use 20.14.0
node -v
```

## 🗺️ Roadmap Ideas
* Pagination & client filtering (segment, spend range)
* Persist embeddings (disk cache / vector DB)
* ANN index (HNSW) for scalability
* Query history & saved segments
* Docker compose for one-command startup
* GitHub Actions CI (lint + tests)

## 📄 License
MIT (add LICENSE file if distributing publicly)

---
Feel free to open issues or suggestions.
