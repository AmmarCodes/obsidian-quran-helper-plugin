import type { IndexedSurah } from "./types";
import { isSearchableSurahArray } from "./types";
import { normalizeArabic } from "./utils";

class SurahDataService {
  private static instance: SurahDataService;
  private surahs: IndexedSurah[] | null = null;

  private constructor() {}

  public static getInstance(): SurahDataService {
    if (!SurahDataService.instance) {
      SurahDataService.instance = new SurahDataService();
    }
    return SurahDataService.instance;
  }

  public async getSurahs(): Promise<IndexedSurah[]> {
    if (this.surahs) return this.surahs;

    try {
      const data = await import("./surahs.json");
      const rawData = data.default || data;

      if (!isSearchableSurahArray(rawData)) {
        throw new Error(
          "Invalid surahs data format: expected an array of SearchableSurah",
        );
      }

      this.surahs = rawData.map((surah) => {
        return {
          ...surah,
          normalized_name: normalizeArabic(surah.name),
        };
      });

      return this.surahs;
    } catch (error) {
      console.error("Failed to load surahs:", error);
      throw error; // Re-throw so caller can handle
    }
  }
}

export const surahDataService = SurahDataService.getInstance();
