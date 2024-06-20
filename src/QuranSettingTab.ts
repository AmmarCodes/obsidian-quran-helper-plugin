// import { App, PluginSettingTab, Setting } from "obsidian";
// import ObsidianQuran from "../main";

// import { QuranSettingTab, ObsidianQuranSettings } from "./src/QuranSettingTab";
// const DEFAULT_SETTINGS: ObsidianQuranSettings = {
// 	mySetting: "default",
// };
// export default class ObsidianQuran extends Plugin {
// settings: ObsidianQuranSettings;
// async onload() {
//
// await this.loadSettings();
// // This adds a settings tab so the user can configure various aspects of the plugin
//    this.addSettingTab(new QuranSettingTab(this.app, this));
// }
// async loadSettings() {
// 	this.settings = Object.assign(
// 		{},
// 		DEFAULT_SETTINGS,
// 		await this.loadData(),
// 	);
// }
//
// async saveSettings() {
// 	await this.saveData(this.settings);
// }
//
// }

export interface ObsidianQuranSettings {
	mySetting: string;
}

// export class QuranSettingTab extends PluginSettingTab {
// 	plugin: ObsidianQuran;
//
// 	constructor(app: App, plugin: ObsidianQuran) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}
//
// 	display(): void {
// 		const { containerEl } = this;
//
// 		containerEl.empty();
//
// 		new Setting(containerEl)
// 			.setName("Setting #1")
// 			.setDesc("It's a secret")
// 			.addText((text) =>
// 				text
// 					.setPlaceholder("Enter your secret")
// 					.setValue(this.plugin.settings.mySetting)
// 					.onChange(async (value) => {
// 						this.plugin.settings.mySetting = value;
// 						await this.plugin.saveSettings();
// 					}),
// 			);
// 	}
// }
