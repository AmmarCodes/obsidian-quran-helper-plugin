import { Plugin } from "obsidian";
import { FzfAyahModal } from "src/FzfAyahModal";
import { FzfSurahModal } from "src/FzfSurahModal";
import { QuranHelperSettings, DEFAULT_SETTINGS } from "src/types";
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
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
