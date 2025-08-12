import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables early (before reading process.env below)
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, 'customers.csv');

let customers = [];
let ready = false;
let embedModel = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable not set. Create backend/.env with OPENAI_API_KEY=sk-...');
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function isReady() { return ready; }
export function getCustomers() { return customers; }

async function embedTexts(texts) {
  const response = await openai.embeddings.create({
    model: embedModel,
    input: texts
  });
  return response.data.map(d => d.embedding);
}

export async function loadDataAndEmbed() {
  customers = [];
  ready = false;
  await new Promise((resolve, reject) => {
    fs.createReadStream(DATA_PATH)
      .pipe(csv())
      .on('data', (row) => {
        customers.push({
          ...row,  // Flatten all CSV columns to top level
          profile_text: row.profile_text
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // Generate embeddings in batches (small dataset now)
  const texts = customers.map(c => c.profile_text);
  const embeddings = await embedTexts(texts);
  customers = customers.map((c, idx) => ({ ...c, embedding: embeddings[idx] }));
  ready = true;
  console.log(`Embedded ${customers.length} customer profiles`);
}

export async function embedQuery(text) {
  const [embedding] = await embedTexts([text]);
  return embedding;
}
