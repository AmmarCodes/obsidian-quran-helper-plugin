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

    containerEl.createEl("h2", { text: "General Settings" });

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

    containerEl.createEl("h2", { text: "Ayah Note Settings" });

    new Setting(containerEl)
      .setName("Ayah Note Path")
      .setDesc("The folder where Ayah notes will be created")
      .addText((text) =>
        text
          .setPlaceholder("Quran Notes")
          .setValue(this.plugin.settings.ayahNotePath)
          .onChange(async (value) => {
            this.plugin.settings.ayahNotePath = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Ayah Note Tags")
      .setDesc("Comma-separated tags to add to the Ayah note")
      .addText((text) =>
        text
          .setPlaceholder("quran, ayah")
          .setValue(this.plugin.settings.ayahNoteTags)
          .onChange(async (value) => {
            this.plugin.settings.ayahNoteTags = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
