export interface SearchableAyah {
  surah_id: number;
  ayah_id: number;
  text: string;
  surah_name: string;
}

export interface IndexedAyah extends SearchableAyah {
  normalized_text: string;
}

export interface QuranHelperSettings {
  outputFormat: "blockquote" | "callout";
  calloutType: string;
}

export const DEFAULT_SETTINGS: QuranHelperSettings = {
  outputFormat: "callout",
  calloutType: "quran",
};
