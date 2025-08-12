import { cosineSimilarity } from '../utils.js';

test('cosine similarity identical vectors', () => {
  expect(cosineSimilarity([1,2,3],[1,2,3])).toBeCloseTo(1);
});

test('cosine similarity orthogonal', () => {
  expect(cosineSimilarity([1,0],[0,1])).toBeCloseTo(0);
});

test('cosine similarity mixed', () => {
  const sim = cosineSimilarity([1,1],[1,0]);
  expect(sim).toBeGreaterThan(0.7);
  expect(sim).toBeLessThan(0.8);
});
