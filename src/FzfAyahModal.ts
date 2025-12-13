import { App, MarkdownView, SuggestModal } from "obsidian";
import AllAyahsContent from "./ayahs.json";
import { searchAyahs } from "./searchUtils";
import { FlatAyah } from "./types";

// Load all Ayahs from all_ayahs.json
const allAyahs: FlatAyah[] = AllAyahsContent;

export class FzfAyahModal extends SuggestModal<FlatAyah> {
  constructor(app: App) {
    super(app);
  }

  getSuggestions(query: string): FlatAyah[] {
    return searchAyahs(query, allAyahs);
  }

  renderSuggestion(ayah: FlatAyah, el: HTMLElement) {
    el.createEl("div", { text: ayah.text });
    el.createEl("small", {
      text: `${ayah.surah_name} - ${ayah.ayah_id}`,
    });
  }

  onChooseSuggestion(ayah: FlatAyah, _evt: MouseEvent | KeyboardEvent) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor) return;

    const content = `
> [!quran] ${ayah.surah_name} - ${ayah.ayah_id}
> ${ayah.text}

`;
    editor.replaceRange(content, editor.getCursor());
  }
}
