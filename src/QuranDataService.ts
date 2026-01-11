import { FlatAyah, Surah } from "./types";

class QuranDataService {
  private static instance: QuranDataService;
  private ayahs: FlatAyah[] | null = null;
  private surahs: Surah[] | null = null;

  private constructor() {}

  public static getInstance(): QuranDataService {
    if (!QuranDataService.instance) {
      QuranDataService.instance = new QuranDataService();
    }
    return QuranDataService.instance;
  }

  public async getAyahs(): Promise<FlatAyah[]> {
    if (this.ayahs) return this.ayahs;

    const data = await import("./ayahs.json");
    this.ayahs = (data.default || data) as unknown as FlatAyah[];
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
