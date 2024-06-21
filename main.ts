import { Plugin } from "obsidian";
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
	}
	onunload() {}
}
