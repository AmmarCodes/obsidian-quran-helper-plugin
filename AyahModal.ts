import { App, MarkdownView, Notice, SuggestModal } from "obsidian";
import { Surah } from "./SurahModal";

interface Ayah {
	order: number;
	title: string;
}

const ALL_AYAH = [
	{
		order: 1,
		title: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
	},
	{
		order: 2,
		title: "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ",
	},
];

export class AyahModal extends SuggestModal<Ayah> {
	private surah: Surah;
	constructor(app: App, surah: Surah) {
		super(app);
		new Notice(`Selected ${surah.title}`);
		this.surah = surah;
	}
	getSuggestions(query: string): Ayah[] {
		return ALL_AYAH.filter((ayah) =>
			ayah.title.toLowerCase().includes(query.toLowerCase()),
		);
	}

	// Renders each suggestion item.
	renderSuggestion(ayah: Ayah, el: HTMLElement) {
		el.createEl("div", { text: ayah.title });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(ayah: Ayah, _evt: MouseEvent | KeyboardEvent) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		const editor = view?.editor;
		if (!editor) {
			new Notice(`Selected ${ayah.title}`);
			return;
		}
		const content = `> [!quote] ${ayah.title}
${this.surah.title} - ${ayah.order}
`;
		editor.replaceRange(content, editor.getCursor());
	}
}
