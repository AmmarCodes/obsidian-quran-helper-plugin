import json
import requests
from pathlib import Path

# المجلد اللي فيه السكريبت نفسه (src/)
SRC_DIR = Path(__file__).parent


def build_page_map() -> dict:
    """
    بيجيب خريطة (surah_id, ayah_id) -> page من alquran.cloud.
    ده المصدر الوحيد اللي فيه page number لكل آية فعلًا.
    """
    url = "https://api.alquran.cloud/v1/quran/quran-uthmani"
    print(f"جاري التحميل من: {url}")
    response = requests.get(url, timeout=30)
    response.raise_for_status()  # هيـ raise exception لو الـ status مش 2xx

    data = response.json()["data"]
    page_map = {}
    for surah in data["surahs"]:
        surah_id = surah["number"]
        for ayah in surah["ayahs"]:
            ayah_id = ayah["numberInSurah"]
            page_map[(surah_id, ayah_id)] = ayah["page"]

    return page_map


def enrich_quran_data():
    input_path = SRC_DIR / "ayahs.json"
    output_path = SRC_DIR / "ayahs_v2.json"

    # 1. تحميل ملف ayahs.json
    if not input_path.exists():
        print(f"خطأ: الملف مش موجود: {input_path}")
        return

    with open(input_path, encoding="utf-8") as f:
        ayahs = json.load(f)

    print(f"تم تحميل {len(ayahs)} آية من {input_path.name}")

    # 2. جيب خريطة الصفحات
    page_map = build_page_map()
    print(f"تم بناء خريطة الصفحات: {len(page_map)} آية")

    # 3. أضف رقم الصفحة لكل آية
    enriched_count = 0
    missing = []
    for ayah in ayahs:
        key = (ayah["surah_id"], ayah["ayah_id"])
        if key in page_map:
            ayah["page"] = page_map[key]
            enriched_count += 1
        else:
            missing.append(key)

    if missing:
        print(f"تحذير: {len(missing)} آية مش موجودة في الـ API: {missing[:5]}")

    # 4. احفظ النسخة الجديدة (compact بدون indent عشان حجم الملف)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(ayahs, f, ensure_ascii=False, separators=(",", ":"))

    print(f"\nتم بنجاح! تم إضافة رقم الصفحة لـ {enriched_count} آية.")
    print(f"الملف الجديد جاهز: {output_path}")


if __name__ == "__main__":
    enrich_quran_data()