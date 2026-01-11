import { Plugin } from "obsidian";
import { FzfAyahModal } from "src/FzfAyahModal";

export default class QuranHelper extends Plugin {
  async onload() {
    // creates an icon in the left ribbon.
    this.addRibbonIcon("book-open", "Insert Ayah", () => {
      new FzfAyahModal(this.app).open();
    });

    this.addCommand({
      id: "open-fzf-quran-modal",
      name: "Add Ayah",
      callback: () => {
        new FzfAyahModal(this.app).open();
      },
    });
  }
  onunload() {}
}
