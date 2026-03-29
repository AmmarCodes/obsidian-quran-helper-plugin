import {
  normalizeArabic,
  parseAyahNoteTags,
  withTagsFrontmatter,
  convertArabicNumerals,
  isNumericQuery,
  isSurahAyahQuery,
  parseNumericString,
} from "../src/utils";

describe("normalizeArabicChars", () => {
  it.each([
    { input: "", expected: "" },
    { input: "عَلَىٰ", expected: "على" },
    { input: "أَعْلَمُ", expected: "اعلم" },
    { input: "الرَّحْمَٰنِ", expected: "الرحمن" },
    { input: "اللَّهِ ۗ وَاللَّهُ", expected: "الله والله" },
    { input: "أُولَٰئِكَ", expected: "اولئك" },
  ])("normalizes '$input' as '$expected'", ({ input, expected }) => {
    expect(normalizeArabic(input)).toBe(expected);
  });

  it.each([
    // Alef wasla (U+0671) → regular alef
    { input: "ٱلرَّحۡمَٰنِ", expected: "الرحمن" },
    // Small high dotless head of khah (U+06E1, QPC sukun)
    { input: "بِسۡمِ", expected: "بسم" },
    // Small high meem (U+06E2)
    { input: "أَلِيمُۢ", expected: "اليم" },
    // Small high three dots (U+06DB)
    { input: "رَيۡبَۛ فِيهِۛ", expected: "ريب فيه" },
    // Inverted damma (U+0657)
    { input: "هُدٗى", expected: "هدى" },
    // Full QPC verse
    {
      input: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
      expected: "بسم الله الرحمن الرحيم",
    },
  ])("normalizes QPC text '$input' as '$expected'", ({ input, expected }) => {
    expect(normalizeArabic(input)).toBe(expected);
  });
});

describe("parseAyahNoteTags", () => {
  it.each([
    { input: "", expected: [] },
    { input: "   ", expected: [] },
    { input: "quran", expected: ["quran"] },
    { input: " quran, ayah ", expected: ["quran", "ayah"] },
    { input: "#quran, ##ayah", expected: ["quran", "ayah"] },
    { input: "quran, #quran, ayah,", expected: ["quran", "ayah"] },
  ])("parses '$input' as $expected", ({ input, expected }) => {
    expect(parseAyahNoteTags(input)).toEqual(expected);
  });
});

describe("withTagsFrontmatter", () => {
  test("returns content unchanged when there are no tags", () => {
    const content = "> [!quran] Al-Fatihah\n> text (1)\n";
    expect(withTagsFrontmatter(content, " ,  , ##")).toBe(content);
  });

  test("prepends tags frontmatter when tags are provided", () => {
    const content = "> [!quran] Al-Fatihah\n> text (1)\n";
    expect(withTagsFrontmatter(content, "#quran, ayah, #quran")).toBe(
      "---\ntags:\n  - quran\n  - ayah\n---\n> [!quran] Al-Fatihah\n> text (1)\n",
    );
  });
});

describe("convertArabicNumerals", () => {
  it("converts Arabic numerals to Western", () => {
    expect(convertArabicNumerals("١٢٣")).toBe("123");
    expect(convertArabicNumerals("٢:٢٥٥")).toBe("2:255");
  });

  it("leaves Western numerals unchanged", () => {
    expect(convertArabicNumerals("123")).toBe("123");
  });
});

describe("isNumericQuery", () => {
  it("accepts Western and Arabic numerals", () => {
    expect(isNumericQuery("123")).toBe(true);
    expect(isNumericQuery("١٢٣")).toBe(true);
  });

  it("rejects mixed or non-numeric", () => {
    expect(isNumericQuery("1abc")).toBe(false);
    expect(isNumericQuery("")).toBe(false);
  });
});

describe("isSurahAyahQuery", () => {
  it("matches Western, Arabic, and mixed numeral formats", () => {
    expect(isSurahAyahQuery("2:255")?.[1]).toBe("2");
    expect(isSurahAyahQuery("٢:٢٥٥")?.[1]).toBe("٢");
    expect(isSurahAyahQuery("2:٢٥٥")).not.toBeNull();
  });

  it("returns null for invalid formats", () => {
    expect(isSurahAyahQuery("2255")).toBeNull();
    expect(isSurahAyahQuery("2:1abc")).toBeNull();
  });
});

describe("parseNumericString", () => {
  it("parses Western and Arabic numerals", () => {
    expect(parseNumericString("123")).toBe(123);
    expect(parseNumericString("١٢٣")).toBe(123);
  });
});
