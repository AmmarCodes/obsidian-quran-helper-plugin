import { searchAyahs } from "../src/searchUtils";
import { IndexedAyah, SearchableAyah } from "../src/types";
import { normalizeArabic } from "../src/utils";

// Mock Data
const mockFlatAyahs: SearchableAyah[] = [
  {
    surah_id: 1,
    ayah_id: 1,
    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    surah_name: "الفاتحة",
  },
  {
    surah_id: 1,
    ayah_id: 2,
    text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    surah_name: "الفاتحة",
  },
  {
    surah_id: 112,
    ayah_id: 1,
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    surah_name: "الإخلاص",
  },
];

const mockAyahs: IndexedAyah[] = mockFlatAyahs.map((ayah) => ({
  ...ayah,
  normalized_text: normalizeArabic(ayah.text),
}));

describe("Search Utils", () => {
  describe("searchAyahs (Global Fuzzy Search)", () => {
    it("finds ayah by text (normalized)", () => {
      // Searching for "بسم الله" should find the first ayah
      const results = searchAyahs("بسم الله", mockAyahs);
      expect(results.length).toBeGreaterThan(0);
      const firstResult = results[0];
      expect(firstResult).toBeDefined();
      expect(firstResult?.surah_id).toBe(1);
    });

    it("finds ayah by number", () => {
      // Searching for "112" should not find ayah id 112 if it's not there,
      // but if we search for "1", it should find ayahs with id 1.
      const results = searchAyahs("1", mockAyahs);
      // ids: 1, 2, 1. So 1 appears twice.
      expect(results).toHaveLength(2);
      expect(results.map((r) => r.ayah_id)).toContain(1);
    });

    it("handles partial matches", () => {
      const results = searchAyahs("الحمد", mockAyahs);
      expect(results).toHaveLength(1);
      const firstResult = results[0];
      expect(firstResult).toBeDefined();
      expect(firstResult?.text).toContain("الْحَمْدُ");
    });

    it("handles empty queries", () => {
      const results = searchAyahs("", mockAyahs);
      expect(results).toHaveLength(3); // All 3 mock ayahs
    });

    it("respects result limit", () => {
      // Create a larger mock dataset
      const largeMockAyahs: IndexedAyah[] = Array.from({ length: 100 }, (_, i) => ({
        surah_id: 1,
        ayah_id: i + 1,
        text: `Test ayah ${i + 1}`,
        surah_name: "Test",
        normalized_text: `test ayah ${i + 1}`,
      }));

      const results = searchAyahs("test", largeMockAyahs, 10);
      expect(results).toHaveLength(10);
    });

    it("handles numeric queries correctly", () => {
      // Test that "1abc" is not treated as numeric
      const results = searchAyahs("1abc", mockAyahs);
      // Should search by text, not by ID
      expect(results).toHaveLength(0);
    });
  });
});
