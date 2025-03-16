// Function to normalize Arabic text
export function normalizeArabic(text: string): string {
    return text
        // Remove diacritics (tashkeel)
        .replace(/[\u0617-\u061A\u06d6\u06d7\u064B-\u0652]/g, "")
        // Remove small alef (alef khanjariya)
        .replace(/\u0670/g, "")
        // Normalize alef variants
        .replace(/[\u0622\u0623\u0625]/g, "\u0627")
        // Normalize teh marbuta
        .replace(/\u06C3/g, "\u0629")
        // Normalize waw variants
        .replace(/\u0624/g, "\u0648")
        // Remove extended arabic letters
        .replace(/[\u06D5\u06EE\u06EF]/g, "")
        // Remove small kasra
        .replace(/\u061A/g, "");
}
