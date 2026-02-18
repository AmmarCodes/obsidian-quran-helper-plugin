import { Plugin, Notice } from "obsidian";
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
    let fileName = "";

    if (ayahNotePathPattern === "surah-ayah") {
      fileName = `${ayah.surah_name}-${ayah.ayah_id}.md`;
    } else if (ayahNotePathPattern === "surah/ayah") {
      fileName = `${ayah.surah_name}/${ayah.ayah_id}.md`;
    } else if (ayahNotePathPattern === "arabic-ayah") {
      fileName = `${ayah.surah_name}-${ayah.ayah_id}.md`;
    } else if (ayahNotePathPattern === "arabic/ayah") {
      fileName = `${ayah.surah_name}/${ayah.ayah_id}.md`;
    }

    const folderPath = ayahNoteFolder ? ayahNoteFolder.replace(/\/$/, "") : "";
    const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

    await this.ensureFolderExists(fullPath);

    const { outputFormat, calloutType } = this.settings;
    let content = "";

    if (outputFormat === "blockquote") {
      content = `> ## ${ayah.surah_name}\n>\n> ${ayah.text} (${ayah.ayah_id})\n>\n\n`;
    } else {
      const type = calloutType || "quran";
      content = `> [!${type}] ${ayah.surah_name}\n> ${ayah.text} (${ayah.ayah_id})\n>\n\n`;
    }

    try {
      const file = await this.app.vault.create(fullPath, content);
      const leaf = this.app.workspace.getLeaf(false);
      await leaf.openFile(file);
    } catch (error) {
      new Notice(`Error: File already exists or failed to create: ${fullPath}`);
    }
  }

  async ensureFolderExists(path: string) {
    const parts = path.split("/");
    parts.pop();
    let currentPath = "";

    for (const part of parts) {
      currentPath += (currentPath ? "/" : "") + part;
      if (!(await this.app.vault.adapter.exists(currentPath))) {
        await this.app.vault.createFolder(currentPath);
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
