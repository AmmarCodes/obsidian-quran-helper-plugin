import { normalizeArabic } from "../src/utils";

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
