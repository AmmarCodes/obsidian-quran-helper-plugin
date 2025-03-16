import { normalizeArabic } from "../src/utils";

describe("normalizeArabicChars", () => {
    it("should handle empty strings", () => {
        expect(normalizeArabic("")).toBe("");
    });

    it("should handle strings \u0670", () => {
        expect(normalizeArabic("عَلَىٰ")).toBe("على");
    });

    it("should handle strings \u0671", () => {
        expect(normalizeArabic("أَعْلَمُ")).toBe("اعلم");
    });

    it("should normalize الرَّحْمَٰنِ to الرحمان", () => {
        expect(normalizeArabic("الرَّحْمَٰنِ")).toBe("الرحمن");
    });

    it("should normalize اللَّهِ ۗ وَاللَّهُ to الله والله", () => {
        expect(normalizeArabic("اللَّهِ ۗ وَاللَّهُ")).toBe("الله والله");
    });

    it("should normalize أُولَٰئِكَ to اولئك", () => {
        expect(normalizeArabic("أُولَٰئِكَ")).toBe("اولئك");
    });
});
