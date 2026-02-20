import { Plugin, addIcon } from "obsidian";
import { FzfAyahModal } from "src/FzfAyahModal";
import { FzfSurahModal } from "src/FzfSurahModal";
import { QuranHelperSettings, DEFAULT_SETTINGS } from "src/types";
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

export default class QuranHelper extends Plugin {
  settings!: QuranHelperSettings;

  async onload() {
    await this.loadSettings();
    // Register our custom icons with Obsidian
    addIcon("quran-ayah", QURAN_AYAH_ICON);
    addIcon("quran-surah", QURAN_SURAH_ICON);

    // creates an icon in the left ribbon.
    this.addRibbonIcon("quran-ayah", "Insert Ayah (إدراج آية)", () => {
      new FzfAyahModal(this.app, this).open();
    });

    // creates an icon for inserting entire surah
    this.addRibbonIcon("quran-surah", "Insert Surah (إدراج سورة)", () => {
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
