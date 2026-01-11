import { normalizeArabic } from "./utils";
import { IndexedAyah } from "./types";

export function searchAyahs(
  query: string,
  allAyahs: IndexedAyah[],
): IndexedAyah[] {
  // Normalize the query for searching
  const normalizedQuery = normalizeArabic(query);
  // Filter ayahs by query matching ayah text or ID
  if (Number(query)) {
    return allAyahs.filter((ayah) => ayah.ayah_id.toString().includes(query));
  } else {
    // Compare against pre-computed normalized ayah text
    return allAyahs.filter((ayah) =>
      ayah.normalized_text.includes(normalizedQuery),
    );
  }
}
