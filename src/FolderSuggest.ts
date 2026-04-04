import type { App, TFolder } from "obsidian";
import { AbstractInputSuggest } from "obsidian";

export class FolderSuggest extends AbstractInputSuggest<TFolder> {
  protected inputEl: HTMLInputElement;
  private folders: TFolder[];

  constructor(app: App, inputEl: HTMLInputElement) {
    super(app, inputEl);
    this.inputEl = inputEl;
    this.folders = this.app.vault.getAllFolders();
  }

  getSuggestions(query: string): TFolder[] {
    const queryLower = query.toLowerCase();
    return this.folders.filter((folder) =>
      folder.path.toLowerCase().includes(queryLower),
    );
  }

  renderSuggestion(folder: TFolder, el: HTMLElement): void {
    el.setText(folder.path);
  }

  selectSuggestion(folder: TFolder): void {
    this.inputEl.value = folder.path;
    this.inputEl.trigger("input");
    this.close();
  }
}
