import { MarkdownView, Plugin } from "obsidian";
import { SurahModal } from "./src/SurahModal";

export default class ObsidianQuran extends Plugin {
	async onload() {
		// This creates an icon in the left ribbon.
		this.addRibbonIcon("book-open", "Insert Ayah", () => {
			new SurahModal(this.app).open();
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-quran-modal",
			name: "Obsidian Quran: Insert Ayah",
			checkCallback: (checking: boolean) => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						new SurahModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});
	}
	onunload() {}
}
