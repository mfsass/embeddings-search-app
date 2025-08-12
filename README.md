# Semantic Customer Search (OpenAI Embeddings)

Semantic customer search app (Express + React + OpenAI embeddings). Full-stack Node.js + React application providing semantic search over customer profiles using OpenAI embedding vectors (default model: `text-embedding-3-small`).

## Features
- Parse CSV of customer profiles and generate embeddings at startup (in-memory store)
- REST API: `GET /health`, `POST /search` with `{ query, topK }`
- React + Vite frontend with Material UI
- Cosine similarity ranking
- Loading / error states and server readiness indicator

## Tech Stack
Backend: Node.js 18+, Express, OpenAI SDK, csv-parser, dotenv
Frontend: React 18, Vite, Material UI
Utilities: ESLint, simple Jest test for cosine similarity

## Project Structure
```
embeddings-search-app/
  backend/
    server.js
    data.js
    utils.js
    customers.csv
    package.json
    .env.example
  frontend/
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      components/
        QueryForm.jsx
        ResultsTable.jsx
    package.json
  README.md
```

## Prerequisites
- Node.js 18+ (20 LTS recommended – see Troubleshooting if you are on an older version)
- OpenAI API key with access to embeddings

## Setup & Run
Clone or copy the directory, then:

### Backend
Create `backend/.env` from example:
```
OPENAI_API_KEY=sk-...
PORT=3001
EMBEDDING_MODEL=text-embedding-3-small
```
Install and start:
```
cd backend
npm install
npm start
```
The server loads CSV and generates embeddings (one-off). Check readiness:
```
curl http://localhost:3001/health
```

### Frontend
In a second terminal:
```
cd frontend
npm install
npm run dev
```
Visit: http://localhost:5173

### Search
Enter a natural-language query like:
```
High-value Spur member who visits frequently and redeems vouchers
```
Adjust Top K and submit. Results are ranked by cosine similarity.

## API Contract
POST /search
Request JSON: `{ "query": "string", "topK": 5 }`
Response JSON: `{ query, topK, results: [ { profileId, profileText, similarity } ] }`
Errors: 400 invalid input, 503 embeddings not ready, 500 internal.

## Development
Run lint (frontend/back separately if desired):
```
cd backend && npx eslint .
```
Run tests:
```
cd backend
npm install --save-dev jest
npx jest
```
*(Jest not pre-installed; install if you wish to run tests.)*

## Notes & Next Steps
- For larger datasets, persist embeddings to disk or a vector database (e.g., PostgreSQL + pgvector, Pinecone, Milvus) to avoid recomputation.
- Add pagination and filtering (segments, spend thresholds) as needed.
- Add rate limiting and request validation for production usage.
- Consider batching and caching query embeddings if repeated.

## Troubleshooting

### SyntaxError: Unexpected token '?'
This occurs when running the backend with an outdated Node.js (e.g. 12.x). The OpenAI SDK and ES module syntax used here require Node 18+.

Check your version:
```
node -v
```
If below 18, upgrade.

### Upgrading Node on Windows (nvm-windows)
1. Uninstall existing Node via Apps & Features (optional but keeps things clean).
2. Install nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
3. Open a new PowerShell terminal (not elevated):
```
nvm install 20.14.0
nvm use 20.14.0
node -v  # should show v20.14.0
```
4. Reinstall dependencies:
```
cd backend
rm package-lock.json 2>$null ; del package-lock.json 2>$null  # ignore if missing
rimraf node_modules 2>$null  # or manually delete folder
npm install
npm start
```
If rimraf not installed globally, just delete the node_modules folder via Explorer.

### Environment Variables Not Loading
Ensure `.env` exists in `backend/` and you ran `npm start` from inside that folder. If still not working, add a console.log(process.env.OPENAI_API_KEY?.slice(0,8)) early in `server.js` for a quick check (then remove it).

### Rate Limits / 429 Errors
If you see 429 responses, add small exponential backoff or caching for repeated queries. For local demos this is rarely needed.

## Security
API key stays server-side; frontend never exposes it. Ensure `.env` is excluded from version control.

## License
MIT (add a LICENSE file if distributing publicly).
