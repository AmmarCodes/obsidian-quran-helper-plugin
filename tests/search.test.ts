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
      expect(results[0].surah_id).toBe(1);
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
      expect(results[0].text).toContain("الْحَمْدُ");
    });
  });
});
