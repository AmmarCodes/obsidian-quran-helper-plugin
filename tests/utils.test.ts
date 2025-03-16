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
});
