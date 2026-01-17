import { App, MarkdownView, Notice, SuggestModal } from "obsidian";
import { quranDataService } from "./QuranDataService";
import { QuranSearch } from "./QuranSearch";
import { IndexedAyah } from "./types";
import { INITIAL_AYAHS } from "./initialAyahs";
import QuranHelper from "../main";

export class FzfAyahModal extends SuggestModal<IndexedAyah> {
  private quranSearch: QuranSearch | null = null;
  private plugin: QuranHelper;

  constructor(app: App, plugin: QuranHelper) {
    super(app);
    this.plugin = plugin;
    // Initialize with a temporary search instance using initial ayahs
    // so we can use it immediately while full data loads
    this.quranSearch = new QuranSearch(INITIAL_AYAHS);
  }

  async onOpen() {
    super.onOpen();
    try {
      this.quranSearch = await quranDataService.getSearchService();
      // Trigger search update to show full results if input is not empty
      this.inputEl.dispatchEvent(new Event("input"));
    } catch (error) {
      console.error("Failed to load ayahs:", error);
      // Fallback is already handled by constructor initialization
    }
  }

  getSuggestions(query: string): IndexedAyah[] {
    if (!this.quranSearch) return [];
    return this.quranSearch.search(query);
  }

  renderSuggestion(ayah: IndexedAyah, el: HTMLElement) {
    el.createEl("div", { text: ayah.text });
    el.createEl("small", {
      text: `${ayah.surah_name} - ${ayah.ayah_id}`,
    });
  }

  onChooseSuggestion(ayah: IndexedAyah, _evt: MouseEvent | KeyboardEvent) {
    // Validate ayah object has required properties
    if (
      !ayah ||
      !ayah.text ||
      !ayah.surah_name ||
      typeof ayah.ayah_id !== "number"
    ) {
      console.error("Invalid ayah data:", ayah);
      new Notice("Error: Invalid ayah data. Please try again.");
      return;
    }

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor) {
      new Notice("Error: No active editor found. Please open a note first.");
      return;
    }

    try {
      const { outputFormat, calloutType } = this.plugin.settings;
      let content = "";

      if (outputFormat === "blockquote") {
        content = `> ${ayah.text}\n> — ${ayah.surah_name} - ${ayah.ayah_id}\n\n`;
      } else {
        // Callout format
        const type = calloutType || "quran";
        content = `> [!${type}] ${ayah.surah_name} - ${ayah.ayah_id}\n> ${ayah.text}\n\n`;
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
      console.error("Failed to insert ayah:", error);
      new Notice("Error: Failed to insert ayah. Please try again.");
    }
  }
}
