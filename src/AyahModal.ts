import { App, MarkdownView, SuggestModal } from "obsidian";
import { searchSurahVerses } from "./searchUtils";
import { Ayah, Surah } from "./types";

export type { Ayah };

export class AyahModal extends SuggestModal<Ayah> {
  private surah: Surah;
  constructor(app: App, surah: Surah) {
    super(app);
    this.surah = surah;
  }

  getSuggestions(query: string): Ayah[] {
    return searchSurahVerses(query, this.surah.verses);
  }

  // Renders each suggestion item.
  renderSuggestion(ayah: Ayah, el: HTMLElement) {
    el.createEl("div", { text: ayah.text });
    el.createEl("small", {
      text: ayah.id.toString(),
    });
  }

  // Perform action on the selected suggestion.
  onChooseSuggestion(ayah: Ayah, _evt: MouseEvent | KeyboardEvent) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor) {
      return;
    }
    const content = `
> [!quran] ${this.surah.name} - ${ayah.id}
> ${ayah.text}

`;
    editor.replaceRange(content, editor.getCursor());
  }
}
