import { IndexedAyah, SearchableAyah } from "./types";
import { normalizeArabic } from "./utils";
import { QuranSearch } from "./QuranSearch";
import { surahDataService } from "./SurahDataService";

class QuranDataService {
  private static instance: QuranDataService;
  private ayahs: IndexedAyah[] | null = null;
  private searchService: QuranSearch | null = null;

  private constructor() {}

  public static getInstance(): QuranDataService {
    if (!QuranDataService.instance) {
      QuranDataService.instance = new QuranDataService();
    }
    return QuranDataService.instance;
  }

  public async getSearchService(): Promise<QuranSearch> {
    if (this.searchService) return this.searchService;
    const ayahs = await this.getAyahs();
    this.searchService = new QuranSearch(ayahs);
    return this.searchService;
  }

  public async getAyahs(): Promise<IndexedAyah[]> {
    if (this.ayahs) return this.ayahs;

    try {
      const data = await import("./ayahs.json");
      const rawAyahs = (data.default || data) as unknown as SearchableAyah[];

      // Validate data structure
      if (!Array.isArray(rawAyahs)) {
        throw new Error("Invalid ayahs data format: expected an array");
      }

      const surahs = await surahDataService.getSurahs();
      const surahMap = new Map(surahs.map((s) => [s.id, s.transliteration]));

      this.ayahs = rawAyahs.map((ayah, index) => {
        // Validate each ayah has required fields
        if (
          !ayah ||
          typeof ayah.text !== "string" ||
          typeof ayah.surah_name !== "string" ||
          typeof ayah.ayah_id !== "number" ||
          typeof ayah.surah_id !== "number"
        ) {
          throw new Error(
            `Invalid ayah data at index ${index}: missing required fields`,
          );
        }

        const enrichedAyah = {
          ...ayah,
          surah_name_en: surahMap.get(ayah.surah_id) || "",
        };

        if (!enrichedAyah.normalized_text) {
          return {
            ...enrichedAyah,
            normalized_text: normalizeArabic(enrichedAyah.text),
          };
        }

        return enrichedAyah as IndexedAyah;
      });

      return this.ayahs;
    } catch (error) {
      console.error("Failed to load ayahs:", error);
      throw error; // Re-throw so caller can handle
    }
  }
}

export const quranDataService = QuranDataService.getInstance();
