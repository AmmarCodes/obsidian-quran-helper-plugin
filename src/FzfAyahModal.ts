import { App, MarkdownView, Notice, SuggestModal } from "obsidian";
import { quranDataService } from "./QuranDataService";
import { searchAyahs } from "./searchUtils";
import { IndexedAyah } from "./types";
import { INITIAL_AYAHS } from "./initialAyahs";
import QuranHelper from "../main";

export class FzfAyahModal extends SuggestModal<IndexedAyah> {
  private allAyahs: IndexedAyah[] = INITIAL_AYAHS;
  private plugin: QuranHelper;

  constructor(app: App, plugin: QuranHelper) {
    super(app);
    this.plugin = plugin;
  }

  async onOpen() {
    super.onOpen();
    try {
      const ayahs = await quranDataService.getAyahs();
      this.allAyahs = ayahs;
      this.inputEl.dispatchEvent(new Event("input"));
    } catch (error) {
      // Log error but don't break the modal - fallback to INITIAL_AYAHS
      console.error("Failed to load ayahs:", error);
    }
  }

  getSuggestions(query: string): IndexedAyah[] {
    return searchAyahs(query, this.allAyahs);
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

      editor.replaceRange(content, editor.getCursor());
    } catch (error) {
      console.error("Failed to insert ayah:", error);
      new Notice("Error: Failed to insert ayah. Please try again.");
    }
  }
}
