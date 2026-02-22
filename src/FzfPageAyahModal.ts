import { App, Editor, MarkdownView, Notice, SuggestModal } from "obsidian";
import { IndexedAyah, PageEntry } from "./types";
import { normalizeArabic } from "./utils";
import QuranHelper from "../main";

type PageAyahItem =
  | { kind: "all"; ayahs: IndexedAyah[] }
  | { kind: "single"; ayah: IndexedAyah };

export class FzfPageAyahModal extends SuggestModal<PageAyahItem> {
  private entry: PageEntry;
  private plugin: QuranHelper;
  private allItem: PageAyahItem;
  private singleItems: PageAyahItem[];

  constructor(app: App, plugin: QuranHelper, entry: PageEntry) {
    super(app);
    this.plugin = plugin;
    this.entry = entry;
    this.allItem = { kind: "all", ayahs: entry.ayahs };
    this.singleItems = entry.ayahs.map((ayah) => ({
      kind: "single" as const,
      ayah,
    }));
    this.setPlaceholder(`الصفحة ${entry.page} — ابحث في الآيات أو اختر...`);
  }

  getSuggestions(query: string): PageAyahItem[] {
    if (!query.trim()) {
      return [this.allItem, ...this.singleItems];
    }

    const normalizedQ = normalizeArabic(query.trim());
    const filtered = this.singleItems.filter((item) => {
      const { ayah } = item as { kind: "single"; ayah: IndexedAyah };
      return (
        ayah.normalized_text.includes(normalizedQ) ||
        ayah.ayah_id.toString().includes(query.trim())
      );
    });

    return [this.allItem, ...filtered];
  }

  renderSuggestion(item: PageAyahItem, el: HTMLElement) {
    if (item.kind === "all") {
      const textEl = el.createEl("div", {
        text: `إدراج الصفحة ${this.entry.page} كاملة`,
      });
      textEl.setAttribute("dir", "rtl");
      el.createEl("small", { text: `${this.entry.ayahs.length} آية` });
      return;
    }

    const { ayah } = item;
    const textEl = el.createEl("div", { text: ayah.text });
    textEl.setAttribute("dir", "rtl");
    el.createEl("small", {
      text: `${ayah.surah_name} - ${ayah.ayah_id}`,
    });
  }

  onChooseSuggestion(item: PageAyahItem, _evt: MouseEvent | KeyboardEvent) {
    if (item.kind === "all") {
      this.insertAllAyahs(item.ayahs);
    } else {
      this.insertSingleAyah(item.ayah);
    }
  }

  private insertSingleAyah(ayah: IndexedAyah) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor) {
      new Notice("Error: No active editor found. Please open a note first.");
      return;
    }

    const { outputFormat, calloutType } = this.plugin.settings;
    let content = "";

    if (outputFormat === "blockquote") {
      content = `> ${ayah.text}\n> — ${ayah.surah_name} - ${ayah.ayah_id}\n\n`;
    } else {
      const type = calloutType || "quran";
      content = `> [!${type}] ${ayah.surah_name} - ${ayah.ayah_id}\n> ${ayah.text}\n\n`;
    }

    this.insertContent(editor, content);
  }

  private insertAllAyahs(ayahs: IndexedAyah[]) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor) {
      new Notice("Error: No active editor found. Please open a note first.");
      return;
    }

    const { outputFormat, calloutType } = this.plugin.settings;
    const first = ayahs.at(0);
    const last = ayahs.at(-1);
    if (!first || !last) return;
    const header = `الصفحة ${this.entry.page} — ${first.surah_name} (${first.ayah_id}) إلى ${last.surah_name} (${last.ayah_id})`;

    let content = "";

    if (outputFormat === "blockquote") {
      content = `> ## ${header}\n>\n`;
      ayahs.forEach((ayah) => {
        content += `> ${ayah.ayah_id}. ${ayah.text}\n`;
      });
      content += `>\n\n`;
    } else {
      const type = calloutType || "quran";
      content = `> [!${type}] ${header}\n> `;
      ayahs.forEach((ayah) => {
        content += `${ayah.text} (${ayah.ayah_id}) `;
      });
      content += `\n>\n\n`;
    }

    this.insertContent(editor, content);
  }

  private insertContent(editor: Editor, content: string) {
    const cursor = editor.getCursor();
    editor.replaceRange(content, cursor);
    const lines = content.split("\n");
    const lastLine = lines[lines.length - 1] || "";
    editor.setCursor({
      line: cursor.line + lines.length - 1,
      ch: lastLine.length,
    });
  }
}
