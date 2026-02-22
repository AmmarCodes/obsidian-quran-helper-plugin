import type { IndexedSurah, SearchableSurah } from "./types";
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
      const rawSurahs = (data.default || data) as unknown as SearchableSurah[];

      // Validate data structure
      if (!Array.isArray(rawSurahs)) {
        throw new Error("Invalid surahs data format: expected an array");
      }

      this.surahs = rawSurahs.map((surah, index) => {
        // Validate each surah has required fields
        if (
          !surah ||
          typeof surah.id !== "number" ||
          typeof surah.name !== "string" ||
          typeof surah.transliteration !== "string" ||
          typeof surah.type !== "string" ||
          typeof surah.total_verses !== "number"
        ) {
          throw new Error(
            `Invalid surah data at index ${index}: missing required fields`,
          );
        }

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
