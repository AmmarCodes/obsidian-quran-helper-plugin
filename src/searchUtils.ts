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

  const results: IndexedAyah[] = [];
  const queryTerms = isNumericQuery
    ? []
    : normalizedQuery.split(/\s+/).filter((t) => t.length > 0);

  for (const ayah of allAyahs) {
    if (results.length >= limit) {
      break;
    }

    let isMatch = false;
    if (isNumericQuery) {
      if (ayah.ayah_id.toString().includes(query.trim())) {
        isMatch = true;
      }
    } else {
      // Check if all terms are present in the ayah
      let allTermsMatch = true;
      for (const term of queryTerms) {
        if (!ayah.normalized_text.includes(term)) {
          allTermsMatch = false;
          break;
        }
      }
      if (allTermsMatch) {
        isMatch = true;
      }
    }

    if (isMatch) {
      results.push(ayah);
    }
  }

  return results;
}
