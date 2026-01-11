import { App, MarkdownView, SuggestModal } from "obsidian";
import { quranDataService } from "./QuranDataService";
import { searchAyahs } from "./searchUtils";
import { IndexedAyah } from "./types";
import { INITIAL_AYAHS } from "./initialAyahs";

export class FzfAyahModal extends SuggestModal<IndexedAyah> {
  private allAyahs: IndexedAyah[] = INITIAL_AYAHS;

  constructor(app: App) {
    super(app);
  }

  async onOpen() {
    super.onOpen();
    quranDataService.getAyahs().then((ayahs) => {
      this.allAyahs = ayahs;
      this.inputEl.dispatchEvent(new Event("input"));
    });
  }

  getSuggestions(query: string): IndexedAyah[] {
    return searchAyahs(query, this.allAyahs);
  }

  renderSuggestion(ayah: IndexedAyah, el: HTMLElement) {
    el.createEl("div", { text: ayah.text });
    el.createEl("small", {
      text: `${ayah.surah_name} - ${ayah.ayah_id}`,
    });
  }

  onChooseSuggestion(ayah: IndexedAyah, _evt: MouseEvent | KeyboardEvent) {
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
