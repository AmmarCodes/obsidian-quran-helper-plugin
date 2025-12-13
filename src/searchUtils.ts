import { normalizeArabic } from "./utils";
import { FlatAyah, Surah, Ayah } from "./types";

export function searchAyahs(query: string, allAyahs: FlatAyah[]): FlatAyah[] {
  // Normalize the query for searching
  const normalizedQuery = normalizeArabic(query);
  // Filter ayahs by query matching ayah text or ID
  if (Number(query)) {
    return allAyahs.filter((ayah) => ayah.ayah_id.toString().includes(query));
  } else {
    // Compare against normalized ayah text
    return allAyahs.filter((ayah) =>
      normalizeArabic(ayah.text).includes(normalizedQuery),
    );
  }
}

export function searchSurahs(query: string, allSurahs: Surah[]): Surah[] {
  if (Number(query)) {
    // search by surah number (id)
    return allSurahs.filter((surah) => surah.id.toString().includes(query));
  } else {
    return allSurahs.filter((surah) =>
      surah.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
}

export function searchSurahVerses(query: string, verses: Ayah[]): Ayah[] {
  if (Number(query)) {
    // search by ayah number
    return verses.filter((ayah) => ayah.id.toString().includes(query));
  } else {
    // search by ayah content
    // Note: This logic is preserved from AyahModal.ts and differs from normalizeArabic
    return verses.filter((ayah) =>
      ayah.text
        .replace(/\u0670|\u0671/g, "ا") // replace instances of `ا` like `ٱ` or `ٰ`
        .replace(/[ؐ-ًؕ-ٖٓ-ٟۖ-ٰٰۭ]/g, "") // remove tashkeel
        .includes(query),
    );
  }
}
