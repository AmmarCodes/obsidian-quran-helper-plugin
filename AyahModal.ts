import { App, MarkdownView, Notice, SuggestModal } from "obsidian";
import { Surah } from "./SurahModal";

export interface Ayah {
	id: number;
	text: string;
}

export class AyahModal extends SuggestModal<Ayah> {
	private surah: Surah;
	constructor(app: App, surah: Surah) {
		super(app);
		new Notice(`Selected ${surah.name}`);
		this.surah = surah;
	}

	getSuggestions(query: string): Ayah[] {
		if (Number(query)) {
			// search by ayan number
			return this.surah.verses.filter((ayah) =>
				ayah.id.toString().includes(query),
			);
		} else {
			// search by ayah content
			return this.surah.verses.filter((ayah) =>
				ayah.text
					.replace(/\u0670|\u0671/g, "ا") // replace instances of `ا` like `ٱ` or `ٰ`
					.replace(/[ؐ-ًؕ-ٖٓ-ٟۖ-ٰٰۭ]/g, "") // remove tashkeel
					.includes(query),
			);
		}
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
			new Notice(`Selected ${ayah.text}`);
			return;
		}
		const content = `
> [!quote] ${ayah.text}
${this.surah.name} - ${ayah.id}

`;
		editor.replaceRange(content, editor.getCursor());
	}
}
