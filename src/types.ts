export interface SearchableAyah {
  surah_id: number;
  ayah_id: number;
  text: string;
  surah_name: string;
  normalized_text?: string;
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
}

export const DEFAULT_SETTINGS: QuranHelperSettings = {
  outputFormat: "callout",
  calloutType: "quran",
};
