import request from 'supertest';
import app from '../app.js';
import * as data from '../data.js';

describe('API Endpoints', () => {
  beforeAll(async () => {
    await data.loadDataAndEmbed();
  });

  test('GET /health returns status and readiness', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('ready');
  });

  test('POST /search returns all attributes', async () => {
    const res = await request(app)
      .post('/search')
      .send({ query: 'high spender', topK: 3 })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);
    if (res.body.results.length > 0) {
      const row = res.body.results[0];
      expect(row).toHaveProperty('profile_id');
      expect(row).toHaveProperty('age');
      expect(row).toHaveProperty('similarity');
      expect(row).not.toHaveProperty('embedding');
      // Newly asserted numeric fields presence & basic validity
      ['age','dependent_count','yearly_spend','campaign_vouchers','regular_vouchers','brand_count'].forEach(f => {
        expect(row).toHaveProperty(f);
        // Accept numeric strings or numbers, but not empty
        expect(row[f]).not.toBe('');
      });
    }
  });

  test('POST /search returns topK sorted by similarity (cap & order)', async () => {
    const res = await request(app)
      .post('/search')
      .send({ query: 'frequent voucher user', topK: 2 })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    const { results } = res.body;
    expect(results.length).toBeLessThanOrEqual(2);
    for (let i = 1; i < results.length; i++) {
      expect(results[i-1].similarity).toBeGreaterThanOrEqual(results[i].similarity);
    }
  });

  test('POST /search default topK now 100', async () => {
    const res = await request(app)
      .post('/search')
      .send({ query: 'high spender' })
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.topK).toBe(100);
    expect(res.body.results.length).toBeLessThanOrEqual(100);
  });

  test('POST /search handles missing query', async () => {
    const res = await request(app)
      .post('/search')
      .send({})
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(400);
  });
});
