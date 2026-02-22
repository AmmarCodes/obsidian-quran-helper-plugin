import { IndexedAyah } from "./types";
import { normalizeArabic } from "./utils";

export class QuranSearch {
  private ayahs: IndexedAyah[];
  private uniqueWords: string[] = [];
  private wordToAyahs: Map<string, Set<number>> = new Map();

  constructor(ayahs: IndexedAyah[]) {
    this.ayahs = ayahs;
    this.buildIndex();
  }

  private buildIndex() {
    const wordSet = new Set<string>();

    this.ayahs.forEach((ayah, index) => {
      // Tokenize by splitting on whitespace
      const tokens = ayah.normalized_text
        .split(/\s+/)
        .filter((t) => t.length > 0);

      tokens.forEach((token) => {
        wordSet.add(token);

        if (!this.wordToAyahs.has(token)) {
          this.wordToAyahs.set(token, new Set());
        }
        this.wordToAyahs.get(token)?.add(index);
      });
    });

    this.uniqueWords = Array.from(wordSet);
  }

  public search(query: string, limit = 50): IndexedAyah[] {
    if (!query.trim()) {
      return this.ayahs.slice(0, limit);
    }

    const normalizedQuery = normalizeArabic(query.trim());
    const isNumericQuery = /^\d+$/.test(query.trim());

    // Handle numeric query (Ayah ID matching)
    if (isNumericQuery) {
      const results: IndexedAyah[] = [];
      const queryStr = query.trim();
      for (const ayah of this.ayahs) {
        if (results.length >= limit) break;
        if (ayah.ayah_id.toString().includes(queryStr)) {
          results.push(ayah);
        }
      }
      return results;
    }

    // Handle text query
    const queryTerms = normalizedQuery.split(/\s+/).filter((t) => t.length > 0);
    if (queryTerms.length === 0) return this.ayahs.slice(0, limit);

    let candidateIndices: Set<number> | null = null;

    for (const term of queryTerms) {
      const termMatches = new Set<number>();

      // Find all words in the vocabulary that contain this term (substring match on words)
      // This is faster than scanning full text because vocabulary size < total text size
      // and we only scan unique words.
      const matchingWords = this.uniqueWords.filter((w) => w.includes(term));

      for (const word of matchingWords) {
        const indices = this.wordToAyahs.get(word);
        if (indices) {
          for (const index of indices) {
            termMatches.add(index);
          }
        }
      }

      if (candidateIndices === null) {
        candidateIndices = termMatches;
      } else {
        // Intersection
        const intersection = new Set<number>();
        for (const index of termMatches) {
          if (candidateIndices.has(index)) {
            intersection.add(index);
          }
        }
        candidateIndices = intersection;
      }

      // Optimization: If intersection becomes empty, no need to continue
      if (candidateIndices.size === 0) {
        return [];
      }
    }

    if (!candidateIndices) return [];

    // Convert indices to Ayah objects and limit
    const results: IndexedAyah[] = [];
    // We iterate through allAyahs or sort indices?
    // Since we want them in order (Surah/Ayah order), iterating this.ayahs and checking set membership is safe
    // but optimized: we can just sort the indices.
    const sortedIndices = Array.from(candidateIndices).sort((a, b) => a - b);

    for (const index of sortedIndices) {
      const ayah = this.ayahs[index];
      if (ayah) {
        results.push(ayah);
      }
      if (results.length >= limit) break;
    }

    return results;
  }
}
