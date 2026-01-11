import { AyahModal } from "src/AyahModal";
import { Notice, SuggestModal } from "obsidian";
import { quranDataService } from "./QuranDataService";
import { searchSurahs } from "./searchUtils";
import { Surah } from "./types";

export class SurahModal extends SuggestModal<Surah> {
  private surahs: Surah[] = [];

  async onOpen() {
    super.onOpen();
    this.surahs = await quranDataService.getSurahs();
  }

  getSuggestions(query: string): Surah[] {
    return searchSurahs(query, this.surahs);
  }

  renderSuggestion(surah: Surah, el: HTMLElement) {
    el.createEl("div", { text: surah.name });
    el.createEl("small", {
      text:
        "ترتيبها: " +
        surah.id +
        " - " +
        "آياتها: " +
        surah.total_verses.toString(),
    });
  }

  onChooseSuggestion(surah: Surah, _evt: MouseEvent | KeyboardEvent) {
    new AyahModal(this.app, surah).open();
    new Notice(`Selected ${surah.name}`);
  }
}
