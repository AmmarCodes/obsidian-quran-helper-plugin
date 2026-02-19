import * as fs from "fs";
import { IndexedAyah, SearchableAyah } from "../src/types.js";
import { normalizeArabic } from "../src/utils.js";

function generateNormalizedAyahs() {
  const file = "src/ayahs.json";
  const rawData = fs.readFileSync(file, "utf-8");
  const ayahs: SearchableAyah[] = JSON.parse(rawData);
  console.log(`Processing ${ayahs.length} ayahs...`);

  const indexedAyahs: IndexedAyah[] = ayahs.map((ayah) => ({
    ...ayah,
    normalized_text: normalizeArabic(ayah.text),
  }));

  fs.writeFileSync(file, JSON.stringify(indexedAyahs, null, 2), "utf-8");
}

generateNormalizedAyahs();
