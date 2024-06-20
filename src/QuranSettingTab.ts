import { App, PluginSettingTab, Setting } from "obsidian";
import ObsidianQuran from "../main";

export interface ObsidianQuranSettings {
	mySetting: string;
}

export class QuranSettingTab extends PluginSettingTab {
	plugin: ObsidianQuran;

	constructor(app: App, plugin: ObsidianQuran) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
