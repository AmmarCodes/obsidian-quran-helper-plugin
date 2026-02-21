import { App, SuggestModal } from "obsidian";
import { quranDataService } from "./QuranDataService";
import { PageEntry } from "./types";
import { FzfPageAyahModal } from "./FzfPageAyahModal";
import QuranHelper from "../main";

export class FzfPageModal extends SuggestModal<PageEntry> {
  private pages: PageEntry[] = [];
  private plugin: QuranHelper;

  constructor(app: App, plugin: QuranHelper) {
    super(app);
    this.plugin = plugin;
    this.setPlaceholder("اكتب رقم الصفحة (1–604)...");
  }

  async onOpen() {
    super.onOpen();
    try {
      const pageMap = await quranDataService.getPageMap();
      this.pages = Array.from(pageMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([page, ayahs]) => ({ page, ayahs }));
      this.inputEl.dispatchEvent(new Event("input"));
    } catch (error) {
      console.error("Failed to load pages:", error);
    }
  }

  getSuggestions(query: string): PageEntry[] {
    if (!query.trim()) return this.pages;
    return this.pages.filter((entry) =>
      entry.page.toString().includes(query.trim()),
    );
  }

  renderSuggestion(entry: PageEntry, el: HTMLElement) {
    const first = entry.ayahs.at(0);
    const last = entry.ayahs.at(-1);
    if (!first || !last) return;

    const textEl = el.createEl("div", {
      text: `الصفحة ${entry.page}  —  ${entry.ayahs.length} آية`,
    });
    textEl.setAttribute("dir", "rtl");

    const preview = el.createEl("small", {
      text: `${first.surah_name} (${first.ayah_id}) ← ${last.surah_name} (${last.ayah_id})`,
    });
    preview.setAttribute("dir", "rtl");
  }

  onChooseSuggestion(entry: PageEntry, _evt: MouseEvent | KeyboardEvent) {
    new FzfPageAyahModal(this.app, this.plugin, entry).open();
  }
}
