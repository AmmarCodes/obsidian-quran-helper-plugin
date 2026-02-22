import * as fs from "fs";
import * as https from "https";
import * as path from "path";

const SRC_DIR = path.dirname(__filename);

interface RawAyah {
  surah_id: number;
  ayah_id: number;
  text: string;
  surah_name: string;
  page?: number;
}

interface AlquranAyah {
  numberInSurah: number;
  page: number;
}

interface AlquranSurah {
  number: number;
  ayahs: AlquranAyah[];
}

interface AlquranResponse {
  data: {
    surahs: AlquranSurah[];
  };
}

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get(url, { timeout: 30000 }, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf-8")) as T);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject)
      .on("timeout", () => reject(new Error("Request timed out")));
  });
}

async function buildPageMap(): Promise<Map<string, number>> {
  const url = "https://api.alquran.cloud/v1/quran/quran-uthmani";
  console.log(`جاري التحميل من: ${url}`);

  const data = await fetchJson<AlquranResponse>(url);
  const map = new Map<string, number>();

  for (const surah of data.data.surahs) {
    for (const ayah of surah.ayahs) {
      map.set(`${surah.number}:${ayah.numberInSurah}`, ayah.page);
    }
  }

  return map;
}

async function enrichQuranData(): Promise<void> {
  const inputPath = path.join(SRC_DIR, "../src/ayahs.json");
  const outputPath = path.join(SRC_DIR, "../src/ayahs.json");

  // 1. تحميل ayahs.json
  if (!fs.existsSync(inputPath)) {
    console.error(`خطأ: الملف مش موجود: ${inputPath}`);
    process.exit(1);
  }

  const ayahs: RawAyah[] = JSON.parse(
    fs.readFileSync(inputPath, "utf-8"),
  ) as RawAyah[];
  console.log(`تم تحميل ${ayahs.length} آية من ${path.basename(inputPath)}`);

  // 2. جيب خريطة الصفحات
  const pageMap = await buildPageMap();
  console.log(`تم بناء خريطة الصفحات: ${pageMap.size} آية`);

  // 3. أضف رقم الصفحة لكل آية
  let enrichedCount = 0;
  const missing: string[] = [];

  for (const ayah of ayahs) {
    const key = `${ayah.surah_id}:${ayah.ayah_id}`;
    const page = pageMap.get(key);
    if (page !== undefined) {
      ayah.page = page;
      enrichedCount++;
    } else {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `تحذير: ${missing.length} آية مش موجودة في الـ API: ${missing.slice(0, 5).join(", ")}`,
    );
  }

  // 4. احفظ النسخة الجديدة (compact بدون indent)
  fs.writeFileSync(outputPath, JSON.stringify(ayahs), "utf-8");

  console.log(`\nتم بنجاح! تم إضافة رقم الصفحة لـ ${enrichedCount} آية.`);
  console.log(`الملف الجديد جاهز: ${outputPath}`);
}

enrichQuranData().catch((err) => {
  console.error("فشل السكريبت:", err);
  process.exit(1);
});
