import { App, MarkdownView, SuggestModal } from "obsidian";
// import from ./all_ayahs.json
import AllAyahsContent from "./ayahs.json";
import { normalizeArabic } from "./utils";

// Define Ayah structure
interface FlatAyah {
	surah_id: number;
	ayah_id: number;
	text: string;
	surah_name: string;
}

// Load all Ayahs from all_ayahs.json
const allAyahs: FlatAyah[] = AllAyahsContent;

export class FzfAyahModal extends SuggestModal<FlatAyah> {
	constructor(app: App) {
		super(app);
	}

	getSuggestions(query: string): FlatAyah[] {
		// Normalize the query for searching
		const normalizedQuery = normalizeArabic(query);
		// Filter ayahs by query matching ayah text or ID
		if (Number(query)) {
			return allAyahs.filter((ayah) =>
				ayah.ayah_id.toString().includes(query),
			);
		} else {
			// Compare against normalized ayah text
			return allAyahs.filter((ayah) =>
				normalizeArabic(ayah.text).includes(normalizedQuery),
			);
		}
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
> [!quote] ${ayah.text}
> ${ayah.surah_name} - ${ayah.ayah_id}

`;
		editor.replaceRange(content, editor.getCursor());
	}
}
