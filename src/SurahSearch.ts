import { IndexedSurah } from "./types";
import { normalizeArabic } from "./utils";

export class SurahSearch {
  private surahs: IndexedSurah[];
  private uniqueWords: string[] = [];
  private wordToSurahs: Map<string, Set<number>> = new Map();

  constructor(surahs: IndexedSurah[]) {
    this.surahs = surahs;
    this.buildIndex();
  }

  private buildIndex() {
    const wordSet = new Set<string>();

    this.surahs.forEach((surah, index) => {
      // Tokenize by splitting on whitespace
      const tokens = surah.normalized_name
        .split(/\s+/)
        .filter((t) => t.length > 0);

      tokens.forEach((token) => {
        wordSet.add(token);

        if (!this.wordToSurahs.has(token)) {
          this.wordToSurahs.set(token, new Set());
        }
        this.wordToSurahs.get(token)?.add(index);
      });
    });

    this.uniqueWords = Array.from(wordSet);
  }

  public search(query: string, limit = 50): IndexedSurah[] {
    if (!query.trim()) {
      return this.surahs.slice(0, limit);
    }

    const normalizedQuery = normalizeArabic(query.trim());
    const isNumericQuery = /^\d+$/.test(query.trim());

    // Handle numeric query (Surah ID matching)
    if (isNumericQuery) {
      const results: IndexedSurah[] = [];
      const queryStr = query.trim();
      for (const surah of this.surahs) {
        if (results.length >= limit) break;
        if (surah.id.toString().includes(queryStr)) {
          results.push(surah);
        }
      }
      return results;
    }

    // Handle text query on Arabic names
    const queryTerms = normalizedQuery.split(/\s+/).filter((t) => t.length > 0);
    if (queryTerms.length === 0) return this.surahs.slice(0, limit);

    let candidateIndices: Set<number> | null = null;

    for (const term of queryTerms) {
      const termMatches = new Set<number>();

      // Find all words in the vocabulary that contain this term (substring match on words)
      const matchingWords = this.uniqueWords.filter((w) => w.includes(term));

      for (const word of matchingWords) {
        const indices = this.wordToSurahs.get(word);
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

    // Convert indices to Surah objects and limit
    const results: IndexedSurah[] = [];
    // Sort by surah ID for consistent ordering
    const sortedIndices = Array.from(candidateIndices).sort((a, b) => a - b);

    for (const index of sortedIndices) {
      const surah = this.surahs[index];
      if (surah) {
        results.push(surah);
      }
      if (results.length >= limit) break;
    }

    return results;
  }
}
