import { App, MarkdownView, Notice, SuggestModal } from "obsidian";
import { surahDataService } from "./SurahDataService";
import { SurahSearch } from "./SurahSearch";
import { IndexedSurah } from "./types";
import QuranHelper from "../main";

export class FzfSurahModal extends SuggestModal<IndexedSurah> {
  private surahSearch: SurahSearch | null = null;
  private plugin: QuranHelper;

  constructor(app: App, plugin: QuranHelper) {
    super(app);
    this.plugin = plugin;
    // Initialize with a temporary search instance using empty array
    // so we can use it immediately while full data loads
    this.surahSearch = new SurahSearch([]);
  }

  async onOpen() {
    super.onOpen();
    try {
      const surahs = await surahDataService.getSurahs();
      this.surahSearch = new SurahSearch(surahs);
      // Trigger search update to show full results if input is not empty
      this.inputEl.dispatchEvent(new Event("input"));
    } catch (error) {
      console.error("Failed to load surahs:", error);
      // Fallback is already handled by constructor initialization
    }
  }

  getSuggestions(query: string): IndexedSurah[] {
    if (!this.surahSearch) return [];
    return this.surahSearch.search(query);
  }

  renderSuggestion(surah: IndexedSurah, el: HTMLElement) {
    const textEl = el.createEl("div", { text: surah.name });
    textEl.setAttribute("dir", "rtl");
    el.createEl("small", {
      text: `${surah.transliteration} - ${surah.type} - ${surah.total_verses} verses`,
    });
  }

  async onChooseSuggestion(
    surah: IndexedSurah,
    _evt: MouseEvent | KeyboardEvent,
  ) {
    // Validate surah object has required properties
    if (
      !surah ||
      !surah.name ||
      !surah.transliteration ||
      typeof surah.id !== "number" ||
      typeof surah.total_verses !== "number"
    ) {
      console.error("Invalid surah data:", surah);
      new Notice("Error: Invalid surah data. Please try again.");
      return;
    }

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor) {
      new Notice("Error: No active editor found. Please open a note first.");
      return;
    }

    try {
      // Load full surah data from quran.json
      const quranData = await import("./quran.json");
      const fullSurah = (quranData.default || quranData).find(
        (s: any) => s.id === surah.id,
      );

      if (!fullSurah || !fullSurah.verses) {
        throw new Error(`Could not find verses for surah ${surah.id}`);
      }

      const { outputFormat, calloutType } = this.plugin.settings;
      let content = "";

      if (outputFormat === "blockquote") {
        // Header
        content = `> ## ${surah.name} \n>\n`;

        // Verses
        fullSurah.verses.forEach((verse: any) => {
          content += `> ${verse.id}. ${verse.text}\n`;
        });
        content += `>\n\n`;
      } else {
        // Callout format
        const type = calloutType || "quran";

        // Header
        content = `> [!${type}] ${surah.name}\n`;

        // Verses
        content += "> ";
        fullSurah.verses.forEach((verse: any) => {
          content += `${verse.text} (${verse.id}) `;
        });
        content += `\n>\n\n`;
      }

      const cursor = editor.getCursor();
      editor.replaceRange(content, cursor);

      const lines = content.split("\n");
      const lastLine = lines[lines.length - 1] || "";
      editor.setCursor({
        line: cursor.line + lines.length - 1,
        ch: lastLine.length,
      });
    } catch (error) {
      console.error("Failed to insert surah:", error);
      new Notice("Error: Failed to insert surah. Please try again.");
    }
  }
}
