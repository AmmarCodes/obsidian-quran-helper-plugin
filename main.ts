import { Notice, normalizePath, Plugin, TFolder, addIcon } from "obsidian";
import { FzfAyahModal } from "src/FzfAyahModal";
import { FzfSurahModal } from "src/FzfSurahModal";
import { FzfPageModal } from "src/FzfPageModal";
import type { QuranHelperSettings, IndexedAyah } from "src/types";
import { DEFAULT_SETTINGS } from "src/types";
import { QuranHelperSettingTab } from "src/QuranHelperSettingTab";

// 1. Icon for Ayah
const QURAN_AYAH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 9h6a4 4 0 0 1 4 4v9a3 3 0 0 0-3-3H2Z"/>
  <path d="M22 9h-6a4 4 0 0 0-4 4v9a3 3 0 0 1 3-3h7Z"/>
  <path d="M12 2L12.3 3.2L13.4 2.6L12.8 3.7L14 4L12.8 4.3L13.4 5.4L12.3 4.8L12 6L11.7 4.8L10.6 5.4L11.2 4.3L10 4L11.2 3.7L10.6 2.6L11.7 3.2Z"/>
</svg>`;

// 2. Icon for Surah
const QURAN_SURAH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 8h5a4 4 0 0 1 4 4v5a3 3 0 0 0-3-3H3z"></path>
  <path d="M21 8h-5a4 4 0 0 0-4 4v5a3 3 0 0 1 3-3h6z"></path>
  <path d="M8 22l4-4 4 4"></path>
  <path d="M12 18v-1"></path>
  <path d="M6 14l3 5"></path>
  <path d="M18 14l-3 5"></path>
</svg>`;

// 3. Icon for Page
const QURAN_PAGE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
  <path d="M10 9H8"/>
  <path d="M16 13H8"/>
  <path d="M16 17H8"/>
</svg>`;

export default class QuranHelper extends Plugin {
  settings!: QuranHelperSettings;

  async onload() {
    await this.loadSettings();
    // Register our custom icons with Obsidian
    addIcon("quran-ayah", QURAN_AYAH_ICON);
    addIcon("quran-surah", QURAN_SURAH_ICON);
    addIcon("quran-page", QURAN_PAGE_ICON);

    // creates an icon in the left ribbon.
    this.addRibbonIcon("quran-ayah", "Insert Ayah (إدراج آية)", () => {
      new FzfAyahModal(this.app, this).open();
    });

    // creates an icon for inserting entire surah
    this.addRibbonIcon("quran-surah", "Insert Surah (إدراج سورة)", () => {
      new FzfSurahModal(this.app, this).open();
    });

    // creates an icon for inserting by page
    this.addRibbonIcon("quran-page", "Insert Page (إدراج صفحة)", () => {
      new FzfPageModal(this.app, this).open();
    });

    this.addCommand({
      id: "open-fzf-quran-modal",
      name: "Insert Ayah (إدراج آية)",
      callback: () => {
        new FzfAyahModal(this.app, this).open();
      },
    });

    this.addCommand({
      id: "open-fzf-quran-surah-modal",
      name: "Insert Surah (إدراج سورة)",
      callback: () => {
        new FzfSurahModal(this.app, this).open();
      },
    });

    this.addCommand({
      id: "open-fzf-quran-page-modal",
      name: "Insert Page (إدراج صفحة)",
      callback: () => {
        new FzfPageModal(this.app, this).open();
      },
    });

    this.addSettingTab(new QuranHelperSettingTab(this.app, this));

    this.addRibbonIcon(
      "file-plus",
      "Create Ayah Note (إنشاء ملاحظة آية)",
      () => {
        new FzfAyahModal(this.app, this, (ayah) =>
          this.createAyahNote(ayah),
        ).open();
      },
    );

    this.addCommand({
      id: "create-ayah-note",
      name: "Create Ayah Note (إنشاء ملاحظة آية)",
      callback: () => {
        new FzfAyahModal(this.app, this, (ayah) =>
          this.createAyahNote(ayah),
        ).open();
      },
    });
  }

  async createAyahNote(ayah: IndexedAyah) {
    const { ayahNoteFolder, ayahNotePathPattern } = this.settings;

    const isEnglish =
      ayahNotePathPattern === "surah-ayah" ||
      ayahNotePathPattern === "surah/ayah";
    const surahName = isEnglish ? ayah.surah_name_en : ayah.surah_name;

    const surahSegment =
      this.sanitizePathSegment(surahName) || `surah-${ayah.surah_id}`;
    const ayahSegment =
      this.sanitizePathSegment(String(ayah.ayah_id)) || String(ayah.ayah_id);

    const fileName =
      ayahNotePathPattern === "surah/ayah" ||
      ayahNotePathPattern === "arabic/ayah"
        ? `${surahSegment}/${ayahSegment}.md`
        : `${surahSegment}-${ayahSegment}.md`;

    const rawFolderPath = (ayahNoteFolder || "").trim().replace(/\/+$/, "");
    const folderPath = rawFolderPath ? normalizePath(rawFolderPath) : "";
    const fullPath = normalizePath(
      folderPath ? `${folderPath}/${fileName}` : fileName,
    );

    const { outputFormat, calloutType } = this.settings;
    const type = calloutType || "quran";
    const content =
      outputFormat === "blockquote"
        ? `> ## ${surahName}\n>\n> ${ayah.text} (${ayah.ayah_id})\n>\n\n`
        : `> [!${type}] ${surahName}\n> ${ayah.text} (${ayah.ayah_id})\n>\n\n`;

    try {
      await this.ensureFolderExists(fullPath);
      const file = await this.app.vault.create(fullPath, content);
      const leaf = this.app.workspace.getLeaf(false);
      await leaf.openFile(file);
    } catch (error) {
      console.error("Failed to create ayah note:", error);
      const message =
        error instanceof Error
          ? error.message
          : "File already exists or failed to create";
      new Notice(`Error: ${message} (${fullPath})`);
    }
  }

  private sanitizePathSegment(segment: string): string {
    return segment
      .trim()
      .replace(/[\\/:*?"<>|]/g, "-")
      .replace(/\s+/g, " ")
      .replace(/(\s|\.)+$/, "");
  }

  async ensureFolderExists(path: string) {
    const parts = normalizePath(path).split("/");
    parts.pop();
    let currentPath = "";

    for (const part of parts) {
      if (!part) {
        continue;
      }

      currentPath += (currentPath ? "/" : "") + part;
      const existing = this.app.vault.getAbstractFileByPath(currentPath);
      if (!existing) {
        await this.app.vault.createFolder(currentPath);
        continue;
      }

      if (!(existing instanceof TFolder)) {
        throw new Error(
          `Cannot create folder because a file exists at ${currentPath}`,
        );
      }
    }
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
