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

    containerEl.createEl("h3", { text: "Ayah Note Settings" });

    new Setting(containerEl)
      .setName("Ayah Note Folder")
      .setDesc("The folder where Ayah notes will be created")
      .setClass("quran-folder-setting")
      .addText((text) => {
        text
          .setPlaceholder("Example: Quran/Notes")
          .setValue(this.plugin.settings.ayahNoteFolder)
          .onChange(async (value) => {
            this.plugin.settings.ayahNoteFolder = value;
            await this.plugin.saveSettings();
          });
      })
      .addExtraButton((button) => {
        button.setIcon("folder");
      });

    new Setting(containerEl)
      .setName("Ayah Note Path Pattern")
      .setDesc("Choose the structure of the Ayah note title/path")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("surah-ayah", "Al-Mulk-1")
          .addOption("surah/ayah", "Al-Mulk/1")
          .addOption("arabic-ayah", "الملك-1")
          .addOption("arabic/ayah", "الملك/1")
          .setValue(this.plugin.settings.ayahNotePathPattern)
          .onChange(async (value) => {
            this.plugin.settings.ayahNotePathPattern = value as
              | "surah-ayah"
              | "surah/ayah"
              | "arabic-ayah"
              | "arabic/ayah";
            await this.plugin.saveSettings();
          }),
      );
  }
}
