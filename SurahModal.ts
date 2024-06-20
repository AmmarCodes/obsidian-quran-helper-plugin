import { Ayah, AyahModal } from "AyahModal";
import { Notice, SuggestModal } from "obsidian";
import SurahContent from "./quran.json";

export class Surah {
	id: number;
	name: string;
	total_verses: number;
	transliteration: string;
	type: string;
	verses: Ayah[];
}

const Surahs = SurahContent.map((surah) => Object.assign(new Surah(), surah));

export class SurahModal extends SuggestModal<Surah> {
	getSuggestions(query: string): Surah[] {
		if (Number(query)) {
			// search by ayah number
			return Surahs.filter((surah) =>
				surah.id.toString().includes(query),
			);
		} else {
			return Surahs.filter((surah) =>
				surah.name.toLowerCase().includes(query.toLowerCase()),
			);
		}
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
