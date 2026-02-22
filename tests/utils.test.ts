import {
  normalizeArabic,
  parseAyahNoteTags,
  withTagsFrontmatter,
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
