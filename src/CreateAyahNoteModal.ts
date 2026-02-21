import { App, Notice, SuggestModal, TFolder, normalizePath } from "obsidian";
import { quranDataService } from "./QuranDataService";
import { QuranSearch } from "./QuranSearch";
import { IndexedAyah } from "./types";
import { INITIAL_AYAHS } from "./initialAyahs";
import QuranHelper from "../main";

export class CreateAyahNoteModal extends SuggestModal<IndexedAyah> {
  private quranSearch: QuranSearch | null = null;
  private plugin: QuranHelper;

  constructor(app: App, plugin: QuranHelper) {
    super(app);
    this.plugin = plugin;
    this.quranSearch = new QuranSearch(INITIAL_AYAHS);
  }

  async onOpen() {
    super.onOpen();
    try {
      this.quranSearch = await quranDataService.getSearchService();
      this.inputEl.dispatchEvent(new Event("input"));
    } catch (error) {
      console.error("Failed to load ayahs:", error);
    }
  }

  getSuggestions(query: string): IndexedAyah[] {
    if (!this.quranSearch) return [];
    return this.quranSearch.search(query);
  }

  renderSuggestion(ayah: IndexedAyah, el: HTMLElement) {
    const textEl = el.createEl("div", { text: ayah.text });
    textEl.setAttribute("dir", "rtl");
    el.createEl("small", {
      text: `${ayah.surah_name} - ${ayah.ayah_id}`,
    });
  }

  async onChooseSuggestion(
    ayah: IndexedAyah,
    _evt: MouseEvent | KeyboardEvent,
  ) {
    if (
      !ayah ||
      !ayah.text ||
      !ayah.surah_name ||
      typeof ayah.ayah_id !== "number"
    ) {
      new Notice("Error: Invalid ayah data.");
      return;
    }

    const { ayahNotePath, ayahNoteTags } = this.plugin.settings;
    const folderPath = normalizePath(ayahNotePath || "Quran Notes");
    const fileName = `${ayah.surah_name} - ${ayah.ayah_id}.md`;
    const fullPath = normalizePath(`${folderPath}/${fileName}`);

    // Ensure folder exists
    const folder = this.app.vault.getAbstractFileByPath(folderPath);
    if (!folder || !(folder instanceof TFolder)) {
      try {
        await this.app.vault.createFolder(folderPath);
      } catch (error) {
        console.error("Failed to create folder:", error);
      }
    }

    // Check if file already exists
    if (this.app.vault.getAbstractFileByPath(fullPath)) {
      new Notice(
        `Note for ${ayah.surah_name} - ${ayah.ayah_id} already exists.`,
      );
      const existingFile = this.app.vault.getAbstractFileByPath(fullPath);
      if (existingFile) {
        this.app.workspace.getLeaf().openFile(existingFile as any);
      }
      return;
    }

    // Prepare content
    const tags = ayahNoteTags
      ? ayahNoteTags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
          .map((t) => `#${t}`)
          .join(" ")
      : "";

    const content = `---
surah: ${ayah.surah_name}
ayah: ${ayah.ayah_id}
tags: [${ayahNoteTags}]
---

# ${ayah.surah_name} - ${ayah.ayah_id}

> ${ayah.text}

${tags}

---
## Notes
`;

    try {
      const newFile = await this.app.vault.create(fullPath, content);
      new Notice(`Created note for ${ayah.surah_name} - ${ayah.ayah_id}`);
      this.app.workspace.getLeaf().openFile(newFile);
    } catch (error) {
      console.error("Failed to create ayah note:", error);
      new Notice("Error: Failed to create ayah note.");
    }
  }
}
