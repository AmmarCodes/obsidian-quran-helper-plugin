import { AyahModal } from "AyahModal";
import { Notice, SuggestModal } from "obsidian";

export interface Surah {
	title: string;
	ayah_count: number;
}

const ALL_SURAHS = [
	{
		title: "Al-Fatiha",
		ayah_count: 7,
	},
	{
		title: "Al-Bakara",
		ayah_count: 248,
	},
	{
		title: "Aal Imran",
		ayah_count: 190,
	},
];

export class SurahModal extends SuggestModal<Surah> {
	getSuggestions(query: string): Surah[] {
		return ALL_SURAHS.filter((surah) =>
			surah.title.toLowerCase().includes(query.toLowerCase()),
		);
	}

	// Renders each suggestion item.
	renderSuggestion(surah: Surah, el: HTMLElement) {
		el.createEl("div", { text: surah.title });
		el.createEl("small", { text: surah.ayah_count.toString() });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(surah: Surah, _evt: MouseEvent | KeyboardEvent) {
		new AyahModal(this.app, surah).open();
		new Notice(`Selected ${surah.title}`);
	}
}
