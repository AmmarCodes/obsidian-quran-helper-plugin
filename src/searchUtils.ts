import { normalizeArabic } from "./utils";
import { IndexedAyah } from "./types";

export function searchAyahs(
  query: string,
  allAyahs: IndexedAyah[],
  limit: number = 50,
): IndexedAyah[] {
  // Handle empty queries
  if (!query.trim()) {
    return allAyahs.slice(0, limit);
  }

  // Normalize the query for searching
  const normalizedQuery = normalizeArabic(query.trim());

  // Check if query is purely numeric using regex
  const isNumericQuery = /^\d+$/.test(query.trim());

  let results: IndexedAyah[];

  if (isNumericQuery) {
    results = allAyahs.filter((ayah) =>
      ayah.ayah_id.toString().includes(query.trim()),
    );
  } else {
    const queryTerms = normalizedQuery.split(/\s+/).filter((t) => t.length > 0);
    results = allAyahs.filter((ayah) =>
      queryTerms.every((term) => ayah.normalized_text.includes(term)),
    );
  }

  return results.slice(0, limit);
}
