export interface SearchableAyah {
  surah_id: number;
  ayah_id: number;
  text: string;
  surah_name: string;
  normalized_text?: string;
  surah_name_en: string;
}

export interface IndexedAyah extends SearchableAyah {
  normalized_text: string;
}

export interface SearchableSurah {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
}

export interface IndexedSurah extends SearchableSurah {
  normalized_name: string;
}

export interface QuranHelperSettings {
  outputFormat: "blockquote" | "callout";
  calloutType: string;
  ayahNoteFolder: string;
  ayahNotePathPattern:
    | "surah-ayah"
    | "surah/ayah"
    | "arabic-ayah"
    | "arabic/ayah";
}

export const DEFAULT_SETTINGS: QuranHelperSettings = {
  outputFormat: "callout",
  calloutType: "quran-ayah",
  ayahNoteFolder: "",
  ayahNotePathPattern: "surah-ayah",
};
