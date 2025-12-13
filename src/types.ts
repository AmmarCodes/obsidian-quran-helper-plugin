export interface Ayah {
  id: number;
  text: string;
}

export interface FlatAyah {
  surah_id: number;
  ayah_id: number;
  text: string;
  surah_name: string;
}

export interface Surah {
  id: number;
  name: string;
  total_verses: number;
  transliteration: string;
  type: string;
  verses: Ayah[];
}
