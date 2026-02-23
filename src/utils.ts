// Function to normalize Arabic text for search
export function normalizeArabic(text: string): string {
  return (
    text
      // Remove diacritics (tashkeel)
      .replace(/[\u0617-\u061A\u06D6\u06D7\u064B-\u065E\u0652]/g, "")
      // Remove small alef (alef khanjariya)
      .replace(/\u0670/g, "")
      // Normalize alef wasla and alef variants
      .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
      // Normalize taa marbuta
      .replace(/\u06C3/g, "\u0629")
      // Normalize waw variants
      .replace(/\u0624/g, "\u0648")
      // Remove extended arabic letters
      .replace(/[\u06D5\u06EE\u06EF]/g, "")
      // Remove QPC marks (stop signs, small high forms, sajdah, etc.)
      .replace(/[\u06D6-\u06DC\u06DE-\u06ED]/g, "")
      // Remove any remaining double spaces
      .replace(/\s+/g, " ")
  );
}

export function parseAyahNoteTags(rawTags: string): string[] {
  return rawTags
    .split(",")
    .map((tag) => tag.trim().replace(/^#+/, ""))
    .filter((tag) => Boolean(tag))
    .filter((tag, index, all) => all.indexOf(tag) === index);
}

export function withTagsFrontmatter(content: string, rawTags: string): string {
  const tags = parseAyahNoteTags(rawTags);
  if (tags.length === 0) {
    return content;
  }

  const frontmatterTags = tags.map((tag) => `  - ${tag}`).join("\n");
  return `---\ntags:\n${frontmatterTags}\n---\n${content}`;
}
