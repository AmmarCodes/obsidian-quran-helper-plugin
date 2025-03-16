// Function to normalize Arabic text
export function normalizeArabic(text: string): string {
  // Replace all occurrences of "أ" and "إ" with "ا"
  text = text
    .replace(
      /\u0670|\u0671|\u0672|\u0673|\u0675|\u0622|\u0623|\u0625|\u0616|\u0656/g,
      "ا",
    )
    .replace(/ /g, "ا")

    .replace(/[^^\u0621-\u064A]/g, ""); // Keep only Arabic letters

  // Remove diacritics (شكل) and hamza (همزة)
  text = text.replace(/[ؐ-ًؕ-ٖٓ-ٟۖ-ۭ]/g, ""); // Remove diacritics

  return text;
}
