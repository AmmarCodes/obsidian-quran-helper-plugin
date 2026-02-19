import { Notice, normalizePath, Plugin, TFolder } from "obsidian";
import { FzfAyahModal } from "src/FzfAyahModal";
import { FzfSurahModal } from "src/FzfSurahModal";
import { QuranHelperSettings, DEFAULT_SETTINGS, IndexedAyah } from "src/types";
import { QuranHelperSettingTab } from "src/QuranHelperSettingTab";

export default class QuranHelper extends Plugin {
  settings!: QuranHelperSettings;

  async onload() {
    await this.loadSettings();

    // creates an icon in the left ribbon.
    this.addRibbonIcon("book-open", "Insert Ayah (إدراج آية)", () => {
      new FzfAyahModal(this.app, this).open();
    });

    // creates an icon for inserting entire surah
    this.addRibbonIcon("book-copy", "Insert Surah (إدراج سورة)", () => {
      new FzfSurahModal(this.app, this).open();
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
    let content = "";

    if (outputFormat === "blockquote") {
      content = `> ## ${surahName}\n>\n> ${ayah.text} (${ayah.ayah_id})\n>\n\n`;
    } else {
      const type = calloutType || "quran";
      content = `> [!${type}] ${surahName}\n> ${ayah.text} (${ayah.ayah_id})\n>\n\n`;
    }

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
      .replace(/[. ]+$/g, "");
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
