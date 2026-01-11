import { IndexedAyah, SearchableAyah, Surah } from "./types";
import { normalizeArabic } from "./utils";

class QuranDataService {
  private static instance: QuranDataService;
  private ayahs: IndexedAyah[] | null = null;
  private surahs: Surah[] | null = null;

  private constructor() {}

  public static getInstance(): QuranDataService {
    if (!QuranDataService.instance) {
      QuranDataService.instance = new QuranDataService();
    }
    return QuranDataService.instance;
  }

  public async getAyahs(): Promise<IndexedAyah[]> {
    if (this.ayahs) return this.ayahs;

    const data = await import("./ayahs.json");
    const rawAyahs = (data.default || data) as unknown as SearchableAyah[];

    this.ayahs = rawAyahs.map((ayah) => ({
      ...ayah,
      normalized_text: normalizeArabic(ayah.text),
    }));

    return this.ayahs;
  }

  public async getSurahs(): Promise<Surah[]> {
    if (this.surahs) return this.surahs;

    const data = await import("./quran.json");
    const rawData = (data.default || data) as any[];

    this.surahs = rawData.map(
      (surah) => Object.assign({}, surah) as unknown as Surah,
    );
    return this.surahs;
  }
}

export const quranDataService = QuranDataService.getInstance();
