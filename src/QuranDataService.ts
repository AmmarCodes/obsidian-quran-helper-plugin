import { IndexedAyah, SearchableAyah } from "./types";
import { normalizeArabic } from "./utils";
import { QuranSearch } from "./QuranSearch";

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

        return {
          ...ayah,
          normalized_text: normalizeArabic(ayah.text),
        };
      });

      return this.ayahs;
    } catch (error) {
      console.error("Failed to load ayahs:", error);
      throw error; // Re-throw so caller can handle
    }
  }
}

export const quranDataService = QuranDataService.getInstance();
