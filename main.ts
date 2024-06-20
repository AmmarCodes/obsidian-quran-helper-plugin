import { MarkdownView, Plugin } from "obsidian";
import { SurahModal } from "./src/SurahModal";
import { QuranSettingTab, ObsidianQuranSettings } from "./src/QuranSettingTab";

const DEFAULT_SETTINGS: ObsidianQuranSettings = {
	mySetting: "default",
};

export default class ObsidianQuran extends Plugin {
	settings: ObsidianQuranSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon("book-open", "Quran Plugin", () => {
			new SurahModal(this.app).open();
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-quran-modal",
			name: "Open quran modal",
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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new QuranSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
