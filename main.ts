import { Plugin } from "obsidian";
import { FzfAyahModal } from "src/FzfAyahModal";
import { QuranHelperSettings, DEFAULT_SETTINGS } from "src/types";
import { QuranHelperSettingTab } from "src/QuranHelperSettingTab";

export default class QuranHelper extends Plugin {
  settings!: QuranHelperSettings;

  async onload() {
    await this.loadSettings();

    // creates an icon in the left ribbon.
    this.addRibbonIcon("book-open", "Insert Ayah", () => {
      new FzfAyahModal(this.app, this).open();
    });

    this.addCommand({
      id: "open-fzf-quran-modal",
      name: "Add Ayah",
      callback: () => {
        new FzfAyahModal(this.app, this).open();
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
