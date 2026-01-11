import { App, MarkdownView, SuggestModal } from "obsidian";
import { quranDataService } from "./QuranDataService";
import { searchAyahs } from "./searchUtils";
import { FlatAyah } from "./types";
import { INITIAL_AYAHS } from "./initialAyahs";

export class FzfAyahModal extends SuggestModal<FlatAyah> {
  private allAyahs: FlatAyah[] = INITIAL_AYAHS;

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

  getSuggestions(query: string): FlatAyah[] {
    return searchAyahs(query, this.allAyahs);
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
