import { App, PluginSettingTab, Setting } from "obsidian";
import QuranHelper from "../main";

export class QuranHelperSettingTab extends PluginSettingTab {
  plugin: QuranHelper;

  constructor(app: App, plugin: QuranHelper) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Output Format")
      .setDesc("Choose how the Ayah should be formatted")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("blockquote", "Blockquote")
          .addOption("callout", "Callout")
          .setValue(this.plugin.settings.outputFormat)
          .onChange(async (value) => {
            this.plugin.settings.outputFormat = value as
              | "blockquote"
              | "callout";
            await this.plugin.saveSettings();
            this.display(); // Refresh to show/hide options
          }),
      );

    if (this.plugin.settings.outputFormat === "callout") {
      const calloutTypes = [
        "quran",
        "quran-ayah",
        "quran-surah",
        "note",
        "info",
        "todo",
        "tip",
        "success",
        "question",
        "warning",
        "failure",
        "danger",
        "bug",
        "example",
        "quote",
      ];

      new Setting(containerEl)
        .setName("Callout Type")
        .setDesc("Select the type of callout")
        .addDropdown((dropdown) => {
          calloutTypes.forEach((type) => dropdown.addOption(type, type));
          dropdown.setValue(this.plugin.settings.calloutType);
          dropdown.onChange(async (value) => {
            this.plugin.settings.calloutType = value;
            await this.plugin.saveSettings();
          });
        });
    }
  }
}
