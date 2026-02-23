import { QuranSearch } from "../src/QuranSearch";
import { IndexedAyah, SearchableAyah } from "../src/types";
import { normalizeArabic } from "../src/utils";

// Mock Data (QPC Hafs script)
const mockFlatAyahs: SearchableAyah[] = [
  {
    surah_id: 1,
    ayah_id: 1,
    text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
    surah_name: "الفاتحة",
    surah_name_en: "Al-Fatihah",
    page: 1,
  },
  {
    surah_id: 1,
    ayah_id: 2,
    text: "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ",
    surah_name: "الفاتحة",
    surah_name_en: "Al-Fatihah",
    page: 1,
  },
  {
    surah_id: 112,
    ayah_id: 1,
    text: "قُلۡ هُوَ ٱللَّهُ أَحَدٌ",
    surah_name: "الإخلاص",
    surah_name_en: "Al-Ikhlas",
    page: 604,
  },
];

const mockAyahs: IndexedAyah[] = mockFlatAyahs.map((ayah) => ({
  ...ayah,
  normalized_text: normalizeArabic(ayah.text),
}));

describe("QuranSearch (Inverted Index)", () => {
  let searchService: QuranSearch;

  beforeAll(() => {
    searchService = new QuranSearch(mockAyahs);
  });

  it("finds ayah by text (normalized)", () => {
    // Searching for "بسم الله" should find the first ayah
    const results = searchService.search("بسم الله");
    expect(results.length).toBeGreaterThan(0);
    const firstResult = results[0];
    expect(firstResult).toBeDefined();
    expect(firstResult?.surah_id).toBe(1);
  });

  it("finds ayah by number", () => {
    // Searching for "112" should not find ayah id 112 if it's not there (it's surah_id),
    // but if we search for "1", it should find ayahs with id 1.
    const results = searchService.search("1");
    // ids: 1, 2, 1. So 1 appears twice.
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.ayah_id)).toContain(1);
  });

  it("handles partial matches", () => {
    const results = searchService.search("الحمد");
    expect(results).toHaveLength(1);
    const firstResult = results[0];
    expect(firstResult).toBeDefined();
    expect(firstResult?.text).toContain("ٱلۡحَمۡدُ");
  });

  it("handles partial word matches (e.g. 'عس ربك' -> 'عسى ربكم')", () => {
    // "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ"
    // Query "الحمد لله" -> matches
    // Query "الحم لله" -> should match "الحمد لله"

    const results = searchService.search("الحم لله");
    expect(results.length).toBeGreaterThan(0);
    const firstResult = results[0];
    expect(firstResult).toBeDefined();
    expect(firstResult?.text).toContain("ٱلۡحَمۡدُ");
  });

  it("handles empty queries", () => {
    const results = searchService.search("");
    expect(results).toHaveLength(3); // All 3 mock ayahs
  });

  it("respects result limit", () => {
    // Create a larger mock dataset
    const largeMockAyahs: IndexedAyah[] = Array.from(
      { length: 100 },
      (_, i) => ({
        surah_id: 1,
        ayah_id: i + 1,
        text: `Test ayah ${i + 1}`,
        surah_name: "Test",
        surah_name_en: "Test",
        normalized_text: `test ayah ${i + 1}`,
        page: i,
      }),
    );

    const largeService = new QuranSearch(largeMockAyahs);

    const results = largeService.search("test", 10);
    expect(results).toHaveLength(10);
  });

  it("handles numeric queries correctly", () => {
    // Test that "1abc" is not treated as numeric
    const results = searchService.search("1abc");
    // Should search by text, not by ID
    expect(results).toHaveLength(0);
  });
});
