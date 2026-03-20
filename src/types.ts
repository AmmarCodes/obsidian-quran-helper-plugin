export interface SearchableAyah {
  surah_id: number;
  ayah_id: number;
  text: string;
  surah_name: string;
  normalized_text?: string;
  surah_name_en: string;
  page: number;
}

export function isSearchableAyah(item: unknown): item is SearchableAyah {
  if (!item || typeof item !== "object") return false;
  const a = item as Record<string, unknown>;
  return (
    typeof a.surah_id === "number" &&
    typeof a.ayah_id === "number" &&
    typeof a.text === "string" &&
    typeof a.surah_name === "string" &&
    typeof a.page === "number"
  );
}

export function isSearchableAyahArray(data: unknown): data is SearchableAyah[] {
  return Array.isArray(data) && data.every((item) => isSearchableAyah(item));
}

export interface IndexedAyah extends SearchableAyah {
  normalized_text: string;
}

export interface PageEntry {
  page: number;
  ayahs: IndexedAyah[];
}

export interface SearchableSurah {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
}

export function isSearchableSurah(item: unknown): item is SearchableSurah {
  if (!item || typeof item !== "object") return false;
  const s = item as Record<string, unknown>;
  return (
    typeof s.id === "number" &&
    typeof s.name === "string" &&
    typeof s.transliteration === "string" &&
    typeof s.type === "string" &&
    typeof s.total_verses === "number"
  );
}

export function isSearchableSurahArray(
  data: unknown,
): data is SearchableSurah[] {
  return Array.isArray(data) && data.every((item) => isSearchableSurah(item));
}

export interface IndexedSurah extends SearchableSurah {
  normalized_name: string;
}

export interface QuranHelperSettings {
  outputFormat: "blockquote" | "callout";
  calloutType: string;
  ayahNoteFolder: string;
  ayahNoteTags: string;
  ayahNotePathPattern:
    | "surah-ayah"
    | "surah/ayah"
    | "arabic-ayah"
    | "arabic/ayah";
  linkToSurah: boolean;
}

export const DEFAULT_SETTINGS: QuranHelperSettings = {
  outputFormat: "callout",
  calloutType: "quran-ayah",
  ayahNoteFolder: "",
  ayahNoteTags: "",
  ayahNotePathPattern: "surah-ayah",
  linkToSurah: false,
};
