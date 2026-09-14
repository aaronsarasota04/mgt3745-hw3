# Canonical agent instructions

Status: ACTIVE in Module 3. Read context/STANDARDS.md and the selected scope in FEATURES.md before editing. STANDARDS.md is normative; report and repair conflicting instruction wording.

1. Use descriptive camelCase identifiers. Keep conventional short names such as event or index when their role is obvious, and avoid vague abbreviations or unnecessary name length.
2. Keep HTML, CSS, and JavaScript in index.html, styles.css, and app.js. Add more files only when they clearly improve the structure.
3. When writing comments, explain why the code exists. Do not restate what it does. Keep comments brief, in present tense, and remove temporary debug output before submission.
4. Write commit messages that name the changed behavior and purpose.
5. Do not insert user input with innerHTML or leave stray console.log statements in the code before submission.

If a rule conflicts with another instruction file, resolve the conflict intentionally and do not silently apply a different policy.

Root CLAUDE.md imports this file for Claude Code. VS Code Copilot uses the separate .github/copilot-instructions.md adapter. A location under /context alone is not a guarantee of automatic discovery.
