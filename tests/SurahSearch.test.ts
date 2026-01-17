import { SurahSearch } from "../src/SurahSearch";
import { SearchableSurah } from "../src/types";

// Mock Data
const mockSurahs: SearchableSurah[] = [
  {
    id: 1,
    name: "الفاتحة",
    transliteration: "Al-Fatihah",
    type: "meccan",
    total_verses: 7,
  },
  {
    id: 2,
    name: "البقرة",
    transliteration: "Al-Baqarah",
    type: "medinan",
    total_verses: 286,
  },
  {
    id: 112,
    name: "الإخلاص",
    transliteration: "Al-Ikhlas",
    type: "meccan",
    total_verses: 4,
  },
];

describe("SurahSearch", () => {
  let search: SurahSearch;

  beforeEach(() => {
    const indexedSurahs = mockSurahs.map((surah) => ({
      ...surah,
      normalized_name: surah.name, // Simplified for testing
    }));
    search = new SurahSearch(indexedSurahs);
  });

  test("should return all surahs when query is empty", () => {
    const results = search.search("");
    expect(results).toHaveLength(3);
  });

  test("should find surah by exact ID", () => {
    const results = search.search("112");
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe(112);
  });

  test("should find surah by Arabic name", () => {
    const results = search.search("الفاتحة");
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("الفاتحة");
  });

  test("should find surah by partial Arabic name", () => {
    const results = search.search("فاتحة");
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("الفاتحة");
  });

  test("should return empty array for no matches", () => {
    const results = search.search("nonexistent");
    expect(results).toHaveLength(0);
  });
});
