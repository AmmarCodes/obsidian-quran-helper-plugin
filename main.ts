import { Editor, MarkdownView, Plugin } from "obsidian";
import { SurahModal } from "./SurahModal";
import { QuranSettingTab, ObsidianQuranSettings } from "./QuranSettingTab";

const DEFAULT_SETTINGS: ObsidianQuranSettings = {
	mySetting: "default",
};

export default class ObsidianQuran extends Plugin {
	settings: ObsidianQuranSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"book-open",
			"Quran Plugin",
			(_evt: MouseEvent) => {
				new SurahModal(this.app).open();
				// Called when the user clicks the icon.
				// new Notice("This is a notice!");
			},
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("obsidian-quran-ribbon-class");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-quran-modal-simple",
			name: "Open quran modal (simple)",
			callback: () => {
				new SurahModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "quran-editor-command",
			name: "Quran editor command",
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Quran Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-quran-modal-complex",
			name: "Open quran modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
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

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000),
		// );
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
