import type { App } from "obsidian";
import { PluginSettingTab, Setting } from "obsidian";
import type QuranHelper from "../main";
import { FolderSuggest } from "./FolderSuggest";

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
          .addOption("inline", "Inline")
          .setValue(this.plugin.settings.outputFormat)
          .onChange((value) => {
            this.plugin.settings.outputFormat = value as
              | "blockquote"
              | "callout"
              | "inline";
            void this.plugin.saveSettings();
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
          dropdown.onChange((value) => {
            this.plugin.settings.calloutType = value;
            void this.plugin.saveSettings();
          });
          return dropdown;
        });
    }

    new Setting(containerEl).setName("Ayah Note Settings").setHeading();

    new Setting(containerEl)
      .setName("Ayah Note Folder")
      .setDesc("The folder where Ayah notes will be created")
      .addText((text) => {
        text
          .setPlaceholder("Example: Quran/Notes")
          .setValue(this.plugin.settings.ayahNoteFolder)
          .onChange((value) => {
            this.plugin.settings.ayahNoteFolder = value;
            void this.plugin.saveSettings();
          });
        new FolderSuggest(this.app, text.inputEl);
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
          .onChange((value) => {
            this.plugin.settings.ayahNotePathPattern = value as
              | "surah-ayah"
              | "surah/ayah"
              | "arabic-ayah"
              | "arabic/ayah";
            void this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Ayah Note Tags")
      .setDesc("Comma-separated tags to add to created Ayah notes")
      .addText((text) => {
        text
          .setPlaceholder("quran, ayah")
          .setValue(this.plugin.settings.ayahNoteTags)
          .onChange((value) => {
            this.plugin.settings.ayahNoteTags = value;
            void this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Link to Surah")
      .setDesc("Add a link to the Surah note at the bottom of the Ayah note")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.linkToSurah).onChange((value) => {
          this.plugin.settings.linkToSurah = value;
          void this.plugin.saveSettings();
        }),
      );
  }
}
