export interface SearchableAyah {
  surah_id: number;
  ayah_id: number;
  text: string;
  surah_name: string;
}

export interface IndexedAyah extends SearchableAyah {
  normalized_text: string;
}
