# Contributing to Quran Helper

Thank you for your interest in contributing to Quran Helper! This document provides guidelines for contributing to this Obsidian plugin.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Obsidian](https://obsidian.md/) for testing

### Installation

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/ammaralkhooly/obsidian-quran-helper.git
   cd obsidian-quran-helper
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development mode:

   ```bash
   npm run dev
   ```

4. For testing in Obsidian:
   - Create a test vault in Obsidian
   - Copy/link the plugin folder to your vault's `.obsidian/plugins/` directory
   - Enable the plugin in Obsidian's Community Plugins settings

## Project Structure

```
obsidian-quran-plugin/
├── main.ts              # Plugin entry point
├── src/                 # Source code
├── tests/               # Test files
├── esbuild.config.mjs   # Build configuration
├── manifest.json        # Plugin manifest
├── package.json         # Dependencies and scripts
└── versions.json        # Version compatibility
```

## Development Workflow

### Building

- **Development build** (with watch):

  ```bash
  npm run dev
  ```

- **Production build** (includes type checking):
  ```bash
  npm run build
  ```

### Code Quality

- **Check formatting**:

  ```bash
  npm run prettier:ci
  ```

- **Fix formatting**:

  ```bash
  npm run prettier:fix
  ```

- **Run tests**:
  ```bash
  npm test
  ```

## Code Style

We use [Prettier](https://prettier.io/) for code formatting. The project follows standard TypeScript conventions:

- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- 80 character line width

Please run `npm run prettier:fix` before committing to ensure consistent formatting.

## Testing

All new features should include tests. We use [Jest](https://jestjs.io/) for testing.

- Write tests in the `tests/` directory
- Run tests with: `npm test`
- Aim for meaningful test coverage

## Submitting Changes

### Branch Naming

Use descriptive branch names:

- `feature/add-search-filter`
- `fix/verse-display-issue`
- `docs/update-readme`

### Commit Messages

Write clear, concise commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues when applicable

### Pull Request Process

1. **Before submitting**:
   - Run all tests: `npm test`
   - Check formatting: `npm run prettier:ci`
   - Build successfully: `npm run build`

2. **PR Description** should include:
   - What changes were made
   - Why the changes were made
   - How to test the changes
   - Any breaking changes

3. **Review Process**:
   - Address review feedback
   - Keep discussions focused and respectful
   - Update your PR as needed

### Reporting Issues

When reporting bugs or requesting features:

- Check if the issue already exists
- Provide clear reproduction steps for bugs
- Include Obsidian version and plugin version
- Attach screenshots if relevant

## Questions?

Feel free to open an issue for questions about contributing. We're happy to help!

## Code of Conduct

Be respectful and constructive in all interactions. We're building this together.

---

Thank you for contributing to Quran Helper!
