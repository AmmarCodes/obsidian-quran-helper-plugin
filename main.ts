import { Plugin } from "obsidian";
import { FzfAyahModal } from "src/FzfAyahModal";
import { SurahModal } from "./src/SurahModal";

export default class QuranHelper extends Plugin {
	async onload() {
		// This creates an icon in the left ribbon.
		this.addRibbonIcon("book-open", "Insert Ayah", () => {
			new SurahModal(this.app).open();
		});

		this.addCommand({
			id: "open-quran-modal",
			name: "Insert Ayah",
			callback: () => {
				new SurahModal(this.app).open();
			},
		});
		this.addCommand({
			id: "open-fzf-quran-modal",
			name: "Fuzzy Find Ayah",
			callback: () => {
				new FzfAyahModal(this.app).open();
			},
		});
	}
	onunload() {}
}
