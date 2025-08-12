// Cosine similarity between two equal-length numeric arrays
export function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) throw new Error('Inputs must be arrays');
  if (a.length !== b.length) throw new Error('Vector length mismatch');
  let dot = 0; let na = 0; let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]; const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
