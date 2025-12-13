import { AyahModal } from "src/AyahModal";
import { Notice, SuggestModal } from "obsidian";
import SurahContent from "./quran.json";
import { searchSurahs } from "./searchUtils";
import { Surah } from "./types";

const Surahs: Surah[] = SurahContent.map(
  (surah) => Object.assign({}, surah) as unknown as Surah,
);

export class SurahModal extends SuggestModal<Surah> {
  getSuggestions(query: string): Surah[] {
    return searchSurahs(query, Surahs);
  }

  // Renders each suggestion item.
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

  // Perform action on the selected suggestion.
  onChooseSuggestion(surah: Surah, _evt: MouseEvent | KeyboardEvent) {
    new AyahModal(this.app, surah).open();
    new Notice(`Selected ${surah.name}`);
  }
}
