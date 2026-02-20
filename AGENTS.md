# PROJECT KNOWLEDGE BASE

## OVERVIEW

Obsidian plugin that searches Quran ayahs/surahs and inserts formatted text into the active editor.
Stack: TypeScript, esbuild, Jest (ts-jest), Obsidian Plugin API.

## STRUCTURE

```text
./
|- main.ts                    # Plugin entrypoint: command/ribbon/settings registration
|- manifest.json              # Obsidian plugin metadata (id/version/min app version)
|- version-bump.mjs           # Syncs package + manifest + versions mapping
|- src/                       # Core search, modal UI, settings, and data services
|- tests/                     # Unit tests for search and normalization behavior
|- assets/screenshots/        # README/release screenshots
|- .github/workflows/         # CI test checks and tagged release automation
`- AGENTS.md
```

## WHERE TO LOOK

| Task                                   | Location                                                 | Notes                                          |
| -------------------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| Register commands/ribbons              | `main.ts`                                                | `addCommand`, `addRibbonIcon`, `addSettingTab` |
| Adjust plugin settings schema/defaults | `src/types.ts`                                           | `QuranHelperSettings`, `DEFAULT_SETTINGS`      |
| Adjust settings UI                     | `src/QuranHelperSettingTab.ts`                           | `PluginSettingTab.display()`                   |
| Ayah search algorithm                  | `src/QuranSearch.ts`                                     | Inverted index over normalized ayah text       |
| Surah search algorithm                 | `src/SurahSearch.ts`                                     | Parallel index strategy for surah names        |
| Ayah modal behavior/insertion format   | `src/FzfAyahModal.ts`                                    | Uses plugin settings + active editor           |
| Surah modal behavior/insertion format  | `src/FzfSurahModal.ts`                                   | Inserts full surah content                     |
| Data loading/caching                   | `src/QuranDataService.ts`, `src/SurahDataService.ts`     | Singleton, lazy service access                 |
| Arabic normalization behavior          | `src/utils.ts`                                           | Shared helper used by search/tests             |
| Search test expectations               | `tests/QuranSearch.test.ts`, `tests/SurahSearch.test.ts` | Numeric + normalized text search coverage      |

## CODE MAP

| Symbol                  | Type  | Location                       | Role                                    |
| ----------------------- | ----- | ------------------------------ | --------------------------------------- |
| `QuranHelper`           | class | `main.ts`                      | Plugin lifecycle + command wiring       |
| `QuranSearch`           | class | `src/QuranSearch.ts`           | Ayah inverted-index search engine       |
| `SurahSearch`           | class | `src/SurahSearch.ts`           | Surah-name inverted-index search engine |
| `QuranDataService`      | class | `src/QuranDataService.ts`      | Ayah data and search service provider   |
| `SurahDataService`      | class | `src/SurahDataService.ts`      | Surah data provider                     |
| `FzfAyahModal`          | class | `src/FzfAyahModal.ts`          | Ayah picker + insertion                 |
| `FzfSurahModal`         | class | `src/FzfSurahModal.ts`         | Surah picker + insertion                |
| `QuranHelperSettingTab` | class | `src/QuranHelperSettingTab.ts` | Settings UI                             |

## CONVENTIONS (PROJECT-SPECIFIC)

- Imports commonly use root-based `src/*` paths (`tsconfig.json` sets `baseUrl: .`).
- Build path is `npm run build`: TypeScript check (`tsc -noEmit -skipLibCheck`) then esbuild bundle.
- CI (`.github/workflows/test.yml`) gates merges with `npm run prettier:ci` and `npm test`.
- Release workflow (`.github/workflows/release.yml`) publishes `main.js`, `manifest.json`, `styles.css` on tag.
- Search modules favor class-based APIs and precomputed indexes, not ad-hoc filtering per query.

## ANTI-PATTERNS (THIS PROJECT)

- Do not change `manifest.json` plugin `id` once released (`quran-helper` must remain stable).
- Do not bypass `DEFAULT_SETTINGS` merge in `main.ts`; new settings must be backward-compatible.
- Do not ship release tags without `styles.css`/`manifest.json`/`main.js` artifacts.

## UNIQUE STYLES

- User-facing command/ribbon names include Arabic labels and should preserve Arabic readability.
- Search supports both numeric lookup and normalized Arabic text matching.

## COMMANDS

```bash
npm run dev
npm run build
npm test
npm run prettier:ci
npm run prettier:fix
npm run version
```

## NOTES

- Node versions differ across workflows (tests on Node 22, release build on Node 18); keep code/build config compatible with both.
- `src/surahs.json` is large; avoid noisy diffs and unnecessary formatting churn in data files.
- Subdirectory guidance for source-specific rules is in `src/AGENTS.md`.
